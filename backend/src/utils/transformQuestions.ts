import { OpenAI } from 'openai';


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function transformQuestions(questions: { name: string }[], tone: string) {
    const prompt = `Rephrase question more ${tone}: "${questions[0].name}". Return only modified question.`;
  
    try {
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an assistant that rephrases questions for group activities.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });
    
      console.log("OpenAI response:", chatCompletion);
      const result = chatCompletion.choices[0].message?.content?.trim() || "";
      return result
    } catch (error) {
      console.error("Call error", error);
      throw error;
    }
}