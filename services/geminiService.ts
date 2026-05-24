
import { GoogleGenAI, Type } from "@google/genai";
import { TripMatch } from "../types";

// Always initialize GoogleGenAI exactly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIMatches = async (source: string, destination: string, type: 'seat' | 'cargo', language: 'en' | 'hi' = 'en'): Promise<TripMatch[]> => {
  const prompt = `Act as the TripSure AI Matching Engine. A user wants to travel or ship cargo from ${source} to ${destination} for a ${type}. 
  Find 3 realistic simulated matches for return trips in India. 
  Include driver names, vehicle types (like Swift Dzure, Tata Ace, Mahindra Bolero), competitive pricing in INR, and a 'reason' why this is a good match.
  IMPORTANT: Provide the 'reason' in ${language === 'hi' ? 'Hindi (using Devanagari script)' : 'English'}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            driverName: { type: Type.STRING },
            vehicle: { type: Type.STRING },
            route: { type: Type.STRING },
            eta: { type: Type.STRING },
            price: { type: Type.NUMBER },
            type: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            reason: { type: Type.STRING }
          },
          required: ["id", "driverName", "vehicle", "price", "reason"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse AI matches", e);
    return [];
  }
};

/**
 * Optimized: Fetches a concise summary of route insights using Google Search Grounding.
 */
export const getRouteInsights = async (source: string, destination: string) => {
  const prompt = `Provide a very brief 2-sentence summary of travel conditions from ${source} to ${destination} in India. 
  Focus ONLY on major toll estimates and current traffic trends. Be extremely concise.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

/**
 * NEW: Fetches nearby amenities using Google Maps Grounding
 */
export const getPitstopSuggestions = async (route: string, lat: number, lng: number) => {
  const prompt = `I am on a trip on the ${route} route. Suggest 3 highly-rated pitstops (Dhabas, fuel pumps, or clean rest areas) near my location.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: { latitude: lat, longitude: lng }
        }
      }
    }
  });

  return {
    text: response.text,
    places: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const getSupportResponse = async (history: { role: string, text: string }[], currentMessage: string, language: 'en' | 'hi' = 'en') => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the TripSure Support Assistant. TripSure is an Indian intercity transport platform specializing in return trips. 
      You handle queries about KYC (Aadhaar/PAN), booking, ₹5 lakh insurance, real-time tracking, and regional language support. 
      Be professional, helpful, and concise. Speak clearly about Indian context (UPI, rural-to-urban routes).
      
      CRITICAL: The user's preferred language is ${language === 'hi' ? 'Hindi (हिन्दी)' : 'English'}. 
      Always respond in ${language === 'hi' ? 'Hindi using Devanagari script' : 'English'}. 
      Even if the user types in another language, your output must be in ${language === 'hi' ? 'Hindi' : 'English'}.`,
    },
  });

  const response = await chat.sendMessage({ message: currentMessage });
  return response.text;
};
