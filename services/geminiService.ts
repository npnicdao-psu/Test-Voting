
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate } from "../types";

export const analyzeElectionTrends = async (candidates: Candidate[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const electionSummary = candidates.map(c => 
    `${c.name} (${c.position}): ${c.votes} votes`
  ).join('\n');

  const prompt = `
    As an expert political analyst for a local association, analyze the following real-time election results:
    
    ${electionSummary}
    
    Provide:
    1. A summary of current leaders for each position.
    2. An analysis of the margin of victory in key positions (like President).
    3. A professional prediction of the outcome if trends continue.
    4. Two sentences of "community commentary" on what these results might suggest about the association's mood.
    
    Format the response as a clear, structured markdown report.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.8,
      }
    });

    return response.text || "Unable to generate analysis at this time.";
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "Error connecting to AI analysis service.";
  }
};
