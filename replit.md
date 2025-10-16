# Overview

This is an AI-powered Amharic language learning application built for English and Arabic speakers. The app provides interactive lessons, pronunciation practice, AI tutoring, and progress tracking. It features a comprehensive curriculum starting with alphabet basics and progressing through vocabulary and grammar, with both free trial lessons and premium subscription content. The app uses a vertical language arrangement (Amharic → Arabic → English) throughout the interface for optimal multi-language learning.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React using TypeScript and modern UI components. It uses Wouter for routing and TanStack Query for state management and API calls. The UI is built with shadcn/ui components and styled with Tailwind CSS, following a mobile-first responsive design pattern.

Key frontend decisions:
- **React with TypeScript**: Chosen for type safety and modern development experience
- **Wouter**: Lightweight router selected over React Router for smaller bundle size
- **TanStack Query**: Handles server state, caching, and API synchronization efficiently
- **shadcn/ui + Tailwind**: Provides consistent, accessible UI components with utility-first styling
- **Multi-language support**: Vertical language arrangement (Amharic → Arabic → English) with automatic font sizing for optimal readability across all language groups

## Backend Architecture
The server uses Express.js with TypeScript running on Node.js. It follows a modular structure with separate route handlers, services, and storage layers. The API is RESTful with proper error handling and logging middleware.

Key backend decisions:
- **Express.js**: Fast, unopinionated web framework suitable for REST APIs
- **Modular structure**: Separation of concerns with dedicated files for routes, services, and storage
- **Middleware-based**: Uses middleware for authentication, logging, and error handling

## Authentication System
Uses Replit's OIDC (OpenID Connect) authentication with session-based storage. Sessions are persisted in PostgreSQL using connect-pg-simple for scalability and reliability.

Key authentication decisions:
- **Replit OIDC**: Leverages platform authentication for seamless integration
- **Session-based auth**: More suitable than JWT for this application's security requirements
- **Database session storage**: Ensures session persistence across server restarts

## Data Storage
PostgreSQL database with Drizzle ORM for type-safe database operations. The schema includes tables for users, lessons, progress tracking, AI conversations, and session management.

Key storage decisions:
- **PostgreSQL**: Robust relational database suitable for structured learning data
- **Drizzle ORM**: Provides type safety and excellent developer experience
- **Neon Database**: Serverless PostgreSQL provider for scalability and ease of deployment
- **Multi-language content**: Lesson content structure supports Arabic and English translations alongside Amharic, with phonetic representations for alphabet lessons and authentic translations for vocabulary

## AI Integration
OpenAI integration for conversational AI tutoring and pronunciation feedback. The service handles chat conversations with context retention and provides personalized learning assistance.

Key AI decisions:
- **OpenAI GPT-4o-mini**: Cost-effective model providing high-quality responses for educational content
- **Context retention**: Maintains conversation history for coherent tutoring sessions
- **Phonetic analysis**: Custom pronunciation scoring system for language learning

# External Dependencies

## Core Services
- **Neon Database**: Serverless PostgreSQL hosting for data persistence
- **OpenAI API**: Powers the AI tutor functionality and pronunciation analysis
- **Replit Authentication**: OIDC-based user authentication and authorization

## Payment Processing
- **Binance Pay**: Cryptocurrency payment option for global accessibility and subscription management
- **Internal subscription system**: Uses database subscriptionStatus field for access control

## Audio Processing
- **Web Speech API**: Browser-based speech recognition for pronunciation practice
- **Audio storage**: External audio file hosting for lesson content and pronunciation examples

## Development Tools
- **Vite**: Fast build tool and development server for the frontend
- **Drizzle Kit**: Database schema management and migrations
- **TypeScript**: Type safety across the full stack

## UI Components
- **Radix UI**: Accessible component primitives for consistent user interface
- **Tailwind CSS**: Utility-first styling framework for responsive design
- **Lucide Icons**: Comprehensive icon library for consistent visual elements