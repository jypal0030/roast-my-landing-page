import Groq from "groq-sdk";

export const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

export async function generateGroqRoast(
  systemPrompt: string,
  htmlContent: string,
  lighthouseData: Record<string, unknown>,
  pagespeedData: Record<string, unknown> | null
): Promise<string> {
  if (!groq) throw new Error("GROQ_API_KEY not configured");

  const userMessage = JSON.stringify({
    pageContent: htmlContent.substring(0, 12000),
    lighthouseData,
    pagespeedData: pagespeedData || { note: "No PageSpeed data available" },
  });

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 1.2,
    max_tokens: 2500,
  });

  return response.choices[0]?.message?.content || "{}";
}
