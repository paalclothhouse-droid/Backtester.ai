
import { GoogleGenAI, Type } from "@google/genai";
import { BacktestResult, StrategyParams } from "../types";

const initGemini = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const runBacktest = async (params: StrategyParams): Promise<BacktestResult> => {
  const ai = initGemini();
  const { pair, startDate, endDate, description } = params;

  const prompt = `
    You are an expert algorithmic trading engineer.
    User Strategy: "${description}"
    Asset: ${pair}
    
    Task 1: Simulate a backtest for this strategy on the specified asset (${startDate} to ${endDate}). Be realistic with win rates (usually 40-65%).
    
    Task 2: Write a valid TradingView Pine Script (v5) that implements this strategy.
    
    Return the result strictly as a JSON object with this schema:
    {
      "winRate": number,
      "totalTrades": number,
      "netProfit": number,
      "profitFactor": number,
      "maxDrawdown": number,
      "analysis": string (short summary max 30 words),
      "pineScriptCode": string (The full pine script code)
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            winRate: { type: Type.NUMBER },
            totalTrades: { type: Type.NUMBER },
            netProfit: { type: Type.NUMBER },
            profitFactor: { type: Type.NUMBER },
            maxDrawdown: { type: Type.NUMBER },
            analysis: { type: Type.STRING },
            pineScriptCode: { type: Type.STRING },
          },
          required: ["winRate", "totalTrades", "netProfit", "profitFactor", "maxDrawdown", "analysis", "pineScriptCode"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as BacktestResult;
    } else {
      throw new Error("Empty response from AI");
    }
  } catch (error) {
    console.error("Backtest failed:", error);
    return {
      winRate: 0,
      totalTrades: 0,
      netProfit: 0,
      profitFactor: 0,
      maxDrawdown: 0,
      analysis: "Failed to run analysis. Please check API configuration.",
      pineScriptCode: "// Error generating code",
    };
  }
};

export const analyzeChartTrend = async (pair: string, price: number, change: number): Promise<string> => {
  const ai = initGemini();
  const prompt = `
    Act as a professional technical analyst. 
    Asset: ${pair}
    Current Price: ${price}
    24h Change: ${change}%
    
    Provide a concise, 2-sentence technical analysis of the current trend sentiment (Bullish/Bearish) and key levels to watch. Use trading terminology.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Market data unavailable for analysis.";
  } catch (e) {
    return " AI Analysis offline.";
  }
};
