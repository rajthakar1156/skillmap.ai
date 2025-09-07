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

export interface CareerResourceItem {
  title: string;
  description?: string;
  url: string;
  platform?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced" | string;
  duration?: string;
  isFree?: boolean;
}

type CacheValue<T> = { timestamp: number; data: T };
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const memoryCache = new Map<string, CacheValue<any>>();

const getCache = <T,>(key: string): T | null => {
  const entry = memoryCache.get(key) as CacheValue<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data;
};

const setCache = <T,>(key: string, data: T) => {
  memoryCache.set(key, { timestamp: Date.now(), data });
};

export async function getCareerResources(careerPath: string): Promise<CareerResourceItem[]> {
  const cacheKey = `resources:${careerPath.toLowerCase()}`;
  const cached = getCache<CareerResourceItem[]>(cacheKey);
  if (cached) return cached;
  const openaiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || (globalThis as any).VITE_OPENAI_API_KEY;
  const geminiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (globalThis as any).VITE_GEMINI_API_KEY;
  const prompt = `Recommend exactly 9 high-quality learning resources for the career: "${careerPath}".
Return a JSON array of exactly 9 objects with keys: title, url, description, platform, difficulty (Beginner|Intermediate|Advanced), duration, isFree (boolean).
Every url MUST be a valid https link to a real resource (no placeholders, no examples). Prefer reputable platforms (Coursera, edX, Khan Academy, official docs, quality YouTube). Ensure resources are specific to ${careerPath}.`;

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
          { role: "system", content: "You output strictly JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      }),
    });
    if (!resp.ok) throw new Error(`OpenAI error: ${resp.status}`);
    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content || "";
    const parsed = (parseSafeJson(content) as unknown) as CareerResourceItem[] | null;
    if (Array.isArray(parsed)) { setCache(cacheKey, parsed); return parsed; }
  }

  if (geminiKey) {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: "You output strictly JSON." }, { text: prompt }] },
          ],
          generationConfig: { temperature: 0.4 },
        }),
      }
    );
    if (!resp.ok) throw new Error(`Gemini error: ${resp.status}`);
    const data = await resp.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsed = (parseSafeJson(text) as unknown) as CareerResourceItem[] | null;
    if (Array.isArray(parsed)) { setCache(cacheKey, parsed); return parsed; }
  }

  // Fallback basic resources if no API available
  const fallback = [
    {
      title: `${careerPath} Foundations (Free)`,
      url: "https://khanacademy.org",
      description: "Fundamentals to build a strong base",
      platform: "Khan Academy",
      difficulty: "Beginner",
      isFree: true,
    },
    {
      title: `${careerPath} Specialization`,
      url: "https://www.coursera.org",
      description: "Curated multi-course path",
      platform: "Coursera",
      difficulty: "Intermediate",
      isFree: false,
    },
  ];
  setCache(cacheKey, fallback);
  return fallback;
}

export interface CareerPaperOrVideo {
  title: string;
  url: string;
  type: "paper" | "video";
  source?: string;
  summary?: string;
}

export async function getPapersAndVideos(careerPath: string): Promise<CareerPaperOrVideo[]> {
  const cacheKey = `media:${careerPath.toLowerCase()}`;
  const cached = getCache<CareerPaperOrVideo[]>(cacheKey);
  if (cached) return cached;

  const openaiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || (globalThis as any).VITE_OPENAI_API_KEY;
  const geminiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (globalThis as any).VITE_GEMINI_API_KEY;
  const prompt = `List exactly 9 top recent learning materials for ${careerPath}.
Return a JSON array of exactly 9 objects with fields: title, url, type (paper|video), source, summary.
All url values MUST be valid https links to the actual paper or video page (no placeholders). Prefer reputable publishers (e.g., arXiv, Nature, IEEE, ACM) and high-quality videos.`;

  try {
    if (openaiKey) {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [ { role: "system", content: "You output strictly JSON." }, { role: "user", content: prompt } ],
          temperature: 0.4,
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        const content = data?.choices?.[0]?.message?.content || "";
        const parsed = (parseSafeJson(content) as unknown) as CareerPaperOrVideo[] | null;
        if (Array.isArray(parsed)) { setCache(cacheKey, parsed); return parsed; }
      }
    }
    if (geminiKey) {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [ { parts: [ { text: "You output strictly JSON." }, { text: prompt } ] } ], generationConfig: { temperature: 0.4 } }),
      });
      if (resp.ok) {
        const data = await resp.json();
        const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const parsed = (parseSafeJson(text) as unknown) as CareerPaperOrVideo[] | null;
        if (Array.isArray(parsed)) { setCache(cacheKey, parsed); return parsed; }
      }
    }
  } catch {}

  const fallback: CareerPaperOrVideo[] = [
    { title: `${careerPath} overview talk`, url: "https://youtube.com", type: "video", source: "YouTube" },
    { title: `${careerPath} survey paper`, url: "https://arxiv.org", type: "paper", source: "arXiv" },
  ];
  setCache(cacheKey, fallback);
  return fallback;
}

export interface CareerJobItem {
  title: string;
  company?: string;
  location?: string;
  applyUrl: string;
  experience?: string;
  type?: string;
}

export async function getCareerJobs(careerPath: string): Promise<CareerJobItem[]> {
  const cacheKey = `jobs:${careerPath.toLowerCase()}`;
  const cached = getCache<CareerJobItem[]>(cacheKey);
  if (cached) return cached;

  const openaiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || (globalThis as any).VITE_OPENAI_API_KEY;
  const geminiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (globalThis as any).VITE_GEMINI_API_KEY;
  const prompt = `List exactly 9 current job role examples in ${careerPath} (India preferred) with fields: title, company, location, applyUrl, experience, type (Remote|Onsite|Hybrid).
Return a JSON array of exactly 9 objects. All applyUrl MUST be valid https links to real postings (no placeholders).`;

  try {
    if (openaiKey) {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [ { role: "system", content: "You output strictly JSON." }, { role: "user", content: prompt } ],
          temperature: 0.4,
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        const content = data?.choices?.[0]?.message?.content || "";
        const parsed = (parseSafeJson(content) as unknown) as CareerJobItem[] | null;
        if (Array.isArray(parsed)) { setCache(cacheKey, parsed); return parsed; }
      }
    }
    if (geminiKey) {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [ { parts: [ { text: "You output strictly JSON." }, { text: prompt } ] } ], generationConfig: { temperature: 0.4 } }),
      });
      if (resp.ok) {
        const data = await resp.json();
        const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const parsed = (parseSafeJson(text) as unknown) as CareerJobItem[] | null;
        if (Array.isArray(parsed)) { setCache(cacheKey, parsed); return parsed; }
      }
    }
  } catch {}

  const fallback: CareerJobItem[] = [
    { title: `${careerPath} Intern`, company: "TopOrg", location: "India", applyUrl: "https://example.com", experience: "Entry", type: "Hybrid" },
  ];
  setCache(cacheKey, fallback);
  return fallback;
}

