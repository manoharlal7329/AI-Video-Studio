import dotenv from 'dotenv';
dotenv.config();

export const generateScenes = async (script: string, language: string, duration: string) => {
  console.log(`[Gemini API] Request received - Duration: ${duration}s, Language: ${language}`);
  console.log(`[Gemini API] Script: ${script}`);

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error("GEMINI_API_KEY is missing in backend/.env. Please configure a valid Google Gemini API key to use the AI Pipeline.");
  }

  console.log(`[Gemini API] Key found. Sending request via Native Fetch...`);

  const systemPrompt = `You are an expert film director. Break the script into logical visual scenes for a video of exactly ${duration} seconds.
Ensure the pacing makes sense. Output a JSON array of scenes. Each scene must have: sceneNumber (int), narration (text in ${language}), duration_seconds (int), visual_description (cinematic image generation prompt).`;

  const userPrompt = `Script: ${script}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        generationConfig: {
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedScenes = JSON.parse(text);
    console.log(`[Gemini API] Successfully generated ${parsedScenes.length} scenes.`);
    return parsedScenes;
  } catch (error: any) {
    console.error("[Gemini API] Generation Error:", error.message);
    throw new Error(`Failed to generate scenes with Gemini: ${error.message}`);
  }
};
