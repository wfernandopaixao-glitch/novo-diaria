
import { GoogleGenAI } from "@google/genai";

export const improveReport = async (rawNotes: string, objective: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Transforme as seguintes notas de atividades de um servidor público em um relatório formal e profissional para prestação de contas de diárias.
      
      Objetivo da Viagem: ${objective}
      Notas das Atividades: ${rawNotes}
      
      Regras:
      1. Use linguagem administrativa formal e impessoal (Ex: "Procedeu-se...", "Realizou-se...").
      2. Seja conciso mas detalhado sobre as ações executadas.
      3. Organize em parágrafos coerentes.
      4. O texto deve estar em Português do Brasil.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || rawNotes;
  } catch (error) {
    console.error("Erro ao melhorar relatório com Gemini:", error);
    return rawNotes;
  }
};
