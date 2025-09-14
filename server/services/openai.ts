import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "fallback_key"
});

export class OpenAIService {
  async getChatResponse(messages: any[], nativeLanguage: string = 'english'): Promise<string> {
    try {
      const systemPrompt = this.getSystemPrompt(nativeLanguage);
      
      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-10).map(msg => ({ // Keep last 10 messages for context
            role: msg.role,
            content: msg.content
          }))
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return response.choices[0].message.content || "I apologize, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error("Failed to get AI response: " + (error as Error).message);
    }
  }

  private getSystemPrompt(nativeLanguage: string): string {
    const basePrompt = `You are an AI tutor specializing in teaching Amharic language. You are patient, encouraging, and adapt your explanations to the student's level.

Your role:
- Help students learn Amharic alphabet, vocabulary, grammar, and pronunciation
- Provide corrections and encouragement
- Ask engaging questions to test understanding
- Explain Amharic concepts clearly
- Use examples and practice exercises
- Be culturally sensitive about Ethiopian culture

Guidelines:
- Keep responses concise but helpful
- Use encouraging language
- Provide pronunciation guides when helpful
- Include cultural context when relevant
- Ask follow-up questions to keep students engaged
- If students make mistakes, correct them gently and explain why

Current student's native language: ${nativeLanguage}`;

    if (nativeLanguage === 'arabic') {
      return basePrompt + `
- You can occasionally use Arabic for explanations if it helps
- Point out similarities between Arabic and Amharic when relevant
- Remember that Arabic speakers already understand Semitic language concepts`;
    }

    return basePrompt + `
- Explain concepts in English
- Compare to English when helpful for understanding
- Remember this student is learning from an English-speaking background`;
  }

  async generateLessonFeedback(score: number, mistakes: string[]): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an encouraging Amharic language tutor. Provide brief, positive feedback on quiz performance."
          },
          {
            role: "user",
            content: `Student scored ${score}% on a quiz. Mistakes: ${mistakes.join(', ')}. Provide encouraging feedback in 1-2 sentences.`
          }
        ],
        max_tokens: 100,
        temperature: 0.8,
      });

      return response.choices[0].message.content || "Great effort! Keep practicing and you'll improve.";
    } catch (error) {
      console.error("OpenAI feedback error:", error);
      return score >= 80 ? "Excellent work! You're making great progress." : "Good effort! Review the mistakes and try again.";
    }
  }
}
