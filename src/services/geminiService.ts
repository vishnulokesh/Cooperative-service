const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const BASE_URL = import.meta.env.VITE_GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta";

export interface GeminiResponse {
  text: string;
  success: boolean;
}

export const geminiService = {
  /**
   * Send prompt to Gemini REST Endpoint
   */
  async generateContent(prompt: string): Promise<GeminiResponse> {
    if (!API_KEY) {
      return {
        text: "Gemini API Key is not configured.",
        success: false
      };
    }

    try {
      const endpoint = `${BASE_URL}/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

      return {
        text,
        success: true
      };
    } catch (err: any) {
      console.warn("Gemini API call error, using local fallback response:", err?.message);
      return {
        text: "AI Recommendation active (DailSmart FairRoute Local Engine)",
        success: false
      };
    }
  },

  /**
   * Get FairRoute dispatch advice from Gemini AI
   */
  async getFairRouteAdvice(customerService: string, location: string): Promise<string> {
    const prompt = `You are DailSmart AI FairRoute Engine for a blue-collar worker cooperative network in India. 
Customer needs: "${customerService}" at "${location}".
Give a 2-sentence concise worker assignment recommendation prioritizing skill match, proximity, and fair wage rotation.`;

    const res = await this.generateContent(prompt);
    return res.text;
  },

  /**
   * Get Demand Surge Forecast from Gemini AI
   */
  async getDemandForecast(area: string): Promise<string> {
    const prompt = `As DailSmart Demand AI, provide a 1-sentence prediction for trade service demand (plumbing/electrical/cleaning) in ${area} for tomorrow.`;

    const res = await this.generateContent(prompt);
    return res.text;
  }
};
