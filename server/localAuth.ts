import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import type { Express } from "express";
import { z } from "zod";

// Registration schema with enhanced fields
const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  age: z.number().int().min(13).max(120).optional(),
  sex: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  country: z.string().optional(),
  profession: z.string().optional(),
  nativeLanguage: z.enum(["english", "arabic"]),
  alwaysLoggedIn: z.boolean().default(false),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().default(false),
});

export async function setupLocalAuth(app: Express) {
  // Local strategy for email/password authentication
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          
          if (!user || !user.password) {
            return done(null, false, { message: "Invalid email or password" });
          }

          const isValidPassword = await bcrypt.compare(password, user.password);
          
          if (!isValidPassword) {
            return done(null, false, { message: "Invalid email or password" });
          }

          // Create user object compatible with existing auth system
          const authUser = {
            claims: {
              sub: user.id,
              email: user.email,
              first_name: user.firstName,
              last_name: user.lastName,
              profile_image_url: user.profileImageUrl,
            },
            access_token: null,
            refresh_token: null,
            expires_at: null, // Local auth doesn't expire
          };

          return done(null, authUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Registration route
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registrationSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);

      // Create user
      const user = await storage.createLocalUser({
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        age: validatedData.age,
        sex: validatedData.sex,
        country: validatedData.country,
        profession: validatedData.profession,
        nativeLanguage: validatedData.nativeLanguage,
        alwaysLoggedIn: validatedData.alwaysLoggedIn,
      });

      // Auto-login the user after registration
      const authUser = {
        claims: {
          sub: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          profile_image_url: user.profileImageUrl,
        },
        access_token: null,
        refresh_token: null,
        expires_at: null,
      };

      req.login(authUser, (err) => {
        if (err) {
          return res.status(500).json({ message: "Registration successful but login failed" });
        }
        
        // Set longer session for "always logged in" users
        if (validatedData.alwaysLoggedIn) {
          req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year
        }

        res.status(201).json({ 
          message: "Registration successful", 
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            nativeLanguage: user.nativeLanguage,
          }
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input data", 
          errors: error.errors 
        });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login route
  app.post("/api/auth/login", (req, res, next) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) {
          return res.status(500).json({ message: "Login failed" });
        }
        
        if (!user) {
          return res.status(401).json({ message: info?.message || "Invalid credentials" });
        }

        req.login(user, async (loginErr) => {
          if (loginErr) {
            return res.status(500).json({ message: "Login failed" });
          }

          // Set longer session for "remember me" users or always logged in preference
          const dbUser = await storage.getUserByEmail(validatedData.email);
          if (validatedData.rememberMe || dbUser?.alwaysLoggedIn) {
            req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year
          }

          res.json({ 
            message: "Login successful",
            user: {
              id: user.claims.sub,
              email: user.claims.email,
              firstName: user.claims.first_name,
              lastName: user.claims.last_name,
            }
          });
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Password reset request
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      
      // Always return success to prevent email enumeration
      res.json({ 
        message: "If an account with that email exists, we've sent password reset instructions." 
      });

      // TODO: Implement email sending for password reset
      // This would typically involve generating a reset token and sending an email
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });
}

// Utility functions for password management
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}