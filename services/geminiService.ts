import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askProductAssistant = async (
  question: string,
  product: Product
): Promise<string> => {
  try {
    const prompt = `
      Você é um assistente de compras especialista do Mercado Clone (similar ao Mercado Livre).
      O usuário está interessado no seguinte produto:
      Título: ${product.title}
      Preço: R$ ${product.price}
      Descrição: ${product.description}
      Avaliação: ${product.rating}/5 baseada em ${product.reviews} reviews.

      O usuário perguntou: "${question}"

      Responda de forma útil, concisa (máximo 3 parágrafos curtos) e persuasiva, destacando os pontos positivos do produto mas sendo honesto.
      Se a pergunta for irrelevante ao produto, peça para focar no item. Use formatação Markdown simples se necessário.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Desculpe, não consegui analisar sua pergunta no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao consultar o assistente inteligente. Tente novamente mais tarde.";
  }
};
