import OpenAI from "openai";
import * as fs from 'fs';
import * as path from 'path';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "fallback_key"
});

export class OpenAIService {
  // Cache for phonetic mappings to improve performance
  private phoneticCache = new Map<string, string>();
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
            content: "You are an encouraging Amharic language tutor. Provide brief, positive feedback on pronunciation and quiz performance. Focus on specific areas for improvement."
          },
          {
            role: "user",
            content: `Student scored ${score}% on pronunciation/quiz practice. Mistakes: ${mistakes.join(', ')}. Provide encouraging, specific feedback in 1-2 sentences with actionable advice.`
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      return response.choices[0].message.content || "Great effort! Keep practicing and you'll improve.";
    } catch (error) {
      console.error("OpenAI feedback error:", error);
      return score >= 80 ? "Excellent pronunciation! Your Amharic sounds clear and natural." : "Good effort! Try speaking more slowly and focus on the vowel sounds.";
    }
  }

  async generateAudio(text: string, speed: 'normal' | 'slow' = 'normal'): Promise<Buffer> {
    try {
      // Use tts-1-hd for better quality and alloy voice for clearer pronunciation
      const response = await openai.audio.speech.create({
        model: "tts-1-hd",
        voice: "alloy", // Better for non-English languages
        input: text,
        speed: speed === 'slow' ? 0.6 : 0.9, // Slightly slower for better pronunciation
      });

      const buffer = Buffer.from(await response.arrayBuffer());
      return buffer;
    } catch (error) {
      console.error("OpenAI TTS error:", error);
      throw new Error("Failed to generate audio: " + (error as Error).message);
    }
  }

  async ensureAudioDirectory(): Promise<void> {
    const audioDir = path.join(process.cwd(), 'public', 'audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
  }

  // Helper function to convert Amharic text to phonetic representation for better speech recognition
  phoneticTransliteration(amharicText: string): string {
    // Basic phonetic mapping for common Amharic characters
    const phoneticMap: { [key: string]: string } = {
      'ሀ': 'ha', 'ሃ': 'ha', 'ሄ': 'he', 'ህ': 'hi', 'ሆ': 'ho', 'ሁ': 'hu',
      'ለ': 'le', 'ሉ': 'lu', 'ሊ': 'li', 'ላ': 'la', 'ሌ': 'le', 'ል': 'li', 'ሎ': 'lo',
      'መ': 'me', 'ሙ': 'mu', 'ሚ': 'mi', 'ማ': 'ma', 'ሜ': 'me', 'ም': 'mi', 'ሞ': 'mo',
      'ሰ': 'se', 'ሱ': 'su', 'ሲ': 'si', 'ሳ': 'sa', 'ሴ': 'se', 'ስ': 'si', 'ሶ': 'so',
      'ረ': 're', 'ሩ': 'ru', 'ሪ': 'ri', 'ራ': 'ra', 'ሬ': 're', 'ር': 'ri', 'ሮ': 'ro',
      'ተ': 'te', 'ቱ': 'tu', 'ቲ': 'ti', 'ታ': 'ta', 'ቴ': 'te', 'ት': 'ti', 'ቶ': 'to',
      'ቀ': 'qe', 'ቁ': 'qu', 'ቂ': 'qi', 'ቃ': 'qa', 'ቄ': 'qe', 'ቅ': 'qi', 'ቆ': 'qo',
      'በ': 'be', 'ቡ': 'bu', 'ቢ': 'bi', 'ባ': 'ba', 'ቤ': 'be', 'ብ': 'bi', 'ቦ': 'bo',
      'ነ': 'ne', 'ኑ': 'nu', 'ኒ': 'ni', 'ና': 'na', 'ኔ': 'ne', 'ን': 'ni', 'ኖ': 'no',
      'ወ': 'we', 'ዉ': 'wu', 'ዊ': 'wi', 'ዋ': 'wa', 'ዌ': 'we', 'ው': 'wi', 'ዎ': 'wo',
      'ዘ': 'ze', 'ዙ': 'zu', 'ዚ': 'zi', 'ዛ': 'za', 'ዜ': 'ze', 'ዝ': 'zi', 'ዞ': 'zo',
      'የ': 'ye', 'ዩ': 'yu', 'ዪ': 'yi', 'ያ': 'ya', 'ዬ': 'ye', 'ይ': 'yi', 'ዮ': 'yo',
      'ደ': 'de', 'ዱ': 'du', 'ዲ': 'di', 'ዳ': 'da', 'ዴ': 'de', 'ድ': 'di', 'ዶ': 'do',
      'ገ': 'ge', 'ጉ': 'gu', 'ጊ': 'gi', 'ጋ': 'ga', 'ጌ': 'ge', 'ግ': 'gi', 'ጎ': 'go',
      'ፈ': 'fe', 'ፉ': 'fu', 'ፊ': 'fi', 'ፋ': 'fa', 'ፌ': 'fe', 'ፍ': 'fi', 'ፎ': 'fo',
      'ፐ': 'pe', 'ፑ': 'pu', 'ፒ': 'pi', 'ፓ': 'pa', 'ፔ': 'pe', 'ፕ': 'pi', 'ፖ': 'po',
      '፡': ' ', '።': '.', '፣': ',', '፤': ';', '፥': ':', '፦': '::', '፧': '?',
      // Numbers
      '፩': '1', '፪': '2', '፫': '3', '፬': '4', '፭': '5', '፮': '6', '፯': '7', '፰': '8', '፱': '9', '፲': '10'
    };

    let result = '';
    for (const char of amharicText) {
      result += phoneticMap[char] || char;
    }
    return result.toLowerCase().trim();
  }

  async generateAndSaveAudio(text: string, filename: string): Promise<{ normalUrl: string; slowUrl: string }> {
    await this.ensureAudioDirectory();
    
    const audioDir = path.join(process.cwd(), 'public', 'audio');
    const normalPath = path.join(audioDir, `${filename}.mp3`);
    const slowPath = path.join(audioDir, `${filename}_slow.mp3`);

    // Check if files already exist to avoid regenerating
    if (fs.existsSync(normalPath) && fs.existsSync(slowPath)) {
      return {
        normalUrl: `/audio/${filename}.mp3`,
        slowUrl: `/audio/${filename}_slow.mp3`
      };
    }

    // Generate both normal and slow audio
    const [normalBuffer, slowBuffer] = await Promise.all([
      this.generateAudio(text, 'normal'),
      this.generateAudio(text, 'slow')
    ]);

    // Save files
    fs.writeFileSync(normalPath, normalBuffer);
    fs.writeFileSync(slowPath, slowBuffer);

    return {
      normalUrl: `/audio/${filename}.mp3`,
      slowUrl: `/audio/${filename}_slow.mp3`
    };
  }
}
