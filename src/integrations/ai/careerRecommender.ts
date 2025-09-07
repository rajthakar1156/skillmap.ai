export interface ProfileInput {
  academics: {
    class_12_stream: string;
    key_subjects_score: Record<string, number>;
  };
  interests: string[];
  personality: {
    type: string;
    strong_traits: string[];
  };
  extracurriculars: string[];
  values: string[];
}

export interface CareerRecommendation {
  career: string;
  rationale?: string;
  roadmap?: string[];
}

const buildPrompt = (profile: ProfileInput) => {
  const { academics, interests, personality, values } = profile;
  const stream = academics.class_12_stream;
  return `You are a career guidance expert for Indian class 12 students.

Profile:
- Stream: ${stream}
- Key Subjects Scores: ${Object.entries(academics.key_subjects_score)
  .map(([k, v]) => `${k}: ${v}`)
  .join(", ")}
- Interests: ${interests.join(", ")}
- Personality Type: ${personality.type}
- Strong Traits: ${personality.strong_traits.join(", ")}
- Values: ${values.join(", ")}

Task:
- Recommend ONE most suitable career title (e.g., Data Scientist, Software Engineer, UX/UI Designer, Product Manager, Business Analyst, Marketing Manager, Doctor, Biotechnologist, Pharmacist, Microbiologist, Physiotherapist, Nutritionist, etc.).
- If stream is Science (PCB) and interests include Biology or related fields, DO NOT recommend software/IT/data roles.
- Keep it aligned with stream and interests.
- Then provide a short one-sentence rationale and a brief 4-step skill roadmap.

Output JSON with keys: career (string), rationale (string), roadmap (string[]).`;
};

const parseSafeJson = (text: string): CareerRecommendation | null => {
  try {
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const sliced = text.slice(jsonStart, jsonEnd + 1);
      return JSON.parse(sliced);
    }
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export async function getCareerRecommendation(profile: ProfileInput): Promise<CareerRecommendation> {
  const openaiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || (globalThis as any).VITE_OPENAI_API_KEY;
  const geminiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (globalThis as any).VITE_GEMINI_API_KEY;
  const prompt = buildPrompt(profile);

  // Prefer OpenAI if available
  if (openaiKey) {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You output strictly JSON."
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`OpenAI error: ${resp.status} ${errText}`);
    }
    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content || "";
    const parsed = parseSafeJson(content) || { career: "Data Scientist" };
    return parsed;
  }

  // Fallback to Gemini
  if (geminiKey) {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "You output strictly JSON." },
                { text: prompt },
              ],
            },
          ],
          generationConfig: { temperature: 0.4 },
        }),
      }
    );
    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Gemini error: ${resp.status} ${errText}`);
    }
    const data = await resp.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsed = parseSafeJson(text) || { career: "Data Scientist" };
    return parsed;
  }

  // Final heuristic fallback (no keys provided)
  const stream = profile.academics.class_12_stream.toLowerCase();
  const interests = new Set(profile.interests.map(i => i.toLowerCase()));
  if (stream.includes("pcb") || interests.has("biology")) {
    return { career: "Biotechnologist", rationale: "PCB stream with strong interest in biology.", roadmap: ["Foundational Biology", "Biotech Lab Skills", "Internship", "Specialize in area"] };
  }
  return { career: "Software Engineer", rationale: "Default fallback without API keys.", roadmap: ["Programming Basics", "Data Structures", "Projects", "Internship/Job"] };
}


