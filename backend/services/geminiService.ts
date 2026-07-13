/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google Gen AI client with appropriate headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface IParsedNarrative {
  source: string;
  category: string;
}

/**
 * Parses unstructured messy bank narratives using Gemini AI
 * with high-resilience regex fallback.
 */
export async function parseNarrative(rawNarrative: string): Promise<IParsedNarrative> {
  const normalized = rawNarrative.toUpperCase();

  // Regular expression fallback to handle typical Indian gig-worker / freelance payouts immediately
  const fallbackRules = [
    { pattern: /UPWRK|UPWORK/, source: 'Upwork Client', category: 'Freelance Payout' },
    { pattern: /FIVERR/, source: 'Fiverr International', category: 'Freelance Payout' },
    { pattern: /SWIGGY/, source: 'Swiggy Delivery Partner', category: 'Gig Delivery Services' },
    { pattern: /ZOMATO/, source: 'Zomato Food Delivery', category: 'Gig Delivery Services' },
    { pattern: /YOUTUBE|GOOGLE/, source: 'Google AdSense Partner', category: 'Ad Revenue / Creator Income' },
    { pattern: /KREATOR|SPONSOR|INFLUENCER/, source: 'Brand Collaborator', category: 'Sponsorship Income' },
    { pattern: /FREELANCE|CONTRACT/, source: 'Direct Contract Client', category: 'Contract Payment' },
    { pattern: /GST|REFUND/, source: 'GST Tax Department', category: 'Tax Refund' },
    { pattern: /STRIPE/, source: 'Stripe Merchant Gateway', category: 'SaaS / E-commerce Sale' },
    { pattern: /PAYPAL/, source: 'PayPal Payout', category: 'International Freelancing' },
  ];

  const matched = fallbackRules.find(rule => rule.pattern.test(normalized));
  const fallbackValue = matched 
    ? { source: matched.source, category: matched.category }
    : { source: 'Direct Bank Transfer', category: 'General Income' };

  // If Gemini API Key is missing, skip the call and return the matched fallback immediately
  if (!process.env.GEMINI_API_KEY) {
    console.log(`[FlowState AI Parse] No GEMINI_API_KEY. Using deterministic matching for narrative: "${rawNarrative}" -> Source: ${fallbackValue.source}`);
    return fallbackValue;
  }

  try {
    const prompt = `You are FlowState's elite Fintech banking parser. Parse this raw Indian bank transaction narrative to extract the actual client/merchant source and the income/payment category:
    Raw Narrative: "${rawNarrative}"
    Provide accurate source/brand/category labels. Give clean names (e.g. "Upwork Client" rather than messy codes).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            source: { 
              type: Type.STRING,
              description: "The parsed corporate source or client name, e.g. Upwork, Swiggy, YouTube" 
            },
            category: { 
              type: Type.STRING, 
              description: "The clean category of income, e.g. Freelance Payout, Gig Work, Sponsorship, SaaS Subscription" 
            }
          },
          required: ["source", "category"]
        }
      }
    });

    if (response && response.text) {
      const result = JSON.parse(response.text.trim());
      if (result.source && result.category) {
        console.log(`[FlowState AI Parse] Gemini successfully parsed narrative: "${rawNarrative}" -> Source: "${result.source}"`);
        return result;
      }
    }
  } catch (err) {
    console.error(`[FlowState AI Parse] Gemini parsing failed for narrative "${rawNarrative}". Falling back to regex match.`, err);
  }

  return fallbackValue;
}
