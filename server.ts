import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize Gemini Client safely
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Sticker Prompt Master Generator Endpoint
app.post("/api/ai/sticker-prompt", async (req, res) => {
  try {
    const { phrase, category, style, elements, language } = req.body;
    
    if (!phrase && !category) {
      return res.status(400).json({ error: "Informe pelo menos uma frase ou categoria." });
    }

    const ai = getGenAI();

    const systemPrompt = `Você é o SUPER PROMPT MASTER especialista em DESIGN TIPOGRÁFICO, HAND LETTERING ARTÍSTICO E CALIGRAFIA DE LUXO para adesivos de Instagram Stories, Reels, WhatsApp, Telegram, Canva e CapCut.
Sua missão é transformar as ideias do usuário em um prompt em inglês de altíssimo nível para geradores de imagem IA (Gemini Imagen/Midjourney).

DIRETRIZES TÉCNICAS E ESTÉTICAS:
- Foco exclusivo em letras desenhadas à mão, caligrafia moderna, script delicado, traços finos e acabamento de marca de luxo.
- Estilos tipográficos prioritários: Modern Calligraphy, Luxury Script, Signature Font, Thin Script, Elegant Cursive, Feminine Script, Minimal Script, Fashion Typography, Editorial Typography, Fine Line Lettering, Monoline Script, Copperplate moderno, Spencerian, Wedding Calligraphy.
- Traços finos e delicados (1px a 2px), ligaduras fluídas, curvas suaves, swashes e floreios tipográficos sutis.
- Acabamentos e cores elegantes: Dourado Metálico Foil, Rose Gold, Prata, Champagne, Branco Puro, Preto Fosco (Matte Black), Off White, Efeito Tinta Nanquim.
- Exija sempre borda fina de corte adesivo die-cut branca e fundo sólido limpo isolado para transparência alpha pronta.
- Sem ícones pesados ou ilustrações poluídas — apenas pura beleza caligráfica e lettering artístico.

Estrutura recomendada do prompt em inglês:
- "A luxury hand-lettered graphic sticker of the word/phrase '[TEXT]' in exquisite [STYLE] calligraphy"
- "ultra-fine 1px delicate strokes, continuous monoline script, elegant flourishes and ligatures, [FINISH/COLOR] foil texture"
- "clean die-cut white outline sticker contour border around the calligraphic lettering"
- "isolated on clean solid white background, 4K high resolution, vector sharpness, zero blur, transparent PNG ready"

Responda rigorosamente em formato JSON com:
1. "englishPrompt": O prompt em inglês profissional para geração da caligrafia.
2. "ptPromptSummary": Resumo descritivo da caligrafia em Português (ex: "Lettering em caligrafia moderna rose gold com traços delicados").
3. "suggestedPhrases": Lista de 4 frases ou palavras caligráficas relacionadas ao tema em Português.
4. "colorPalette": Lista de 4 códigos HEX de cores sofisticadas (ex: Dourado #D4AF37, Rose Gold #B76E79, Off White #FAF9F6, Preto Fosco #1A1A1A).
5. "recommendedFont": Nome de estilo tipográfico recomendado (ex: "Cursiva Calligraphy", "Cursiva Delicada", "Handwritten Script", "Luxury Serif").`;

    const userContent = `Text/Frase: "${phrase || ""}"
Categoria: "${category || "Geral"}"
Estilo Visual desejado: "${style || "Minimalista Luxo"}"
Elementos Visuais: "${elements || "Corações e Brilhos"}"
Idioma Preferencial das Frases: "${language || "Português"}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userContent,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);

    res.json({ success: true, data });
  } catch (err: any) {
    console.error("Erro no /api/ai/sticker-prompt:", err);
    res.status(500).json({
      error: "Falha ao gerar o Prompt Master com Gemini.",
      details: err.message,
    });
  }
});

// AI Premium Palette Generator Endpoint for Estética Avançada
app.post("/api/ai/palette", async (req, res) => {
  try {
    const { trend = "Harmonização Facial Gold", conceptText = "" } = req.body;

    const ai = getGenAI();

    const systemPrompt = `Você é um diretor de arte e colorista especialista em DESIGN DE MARCA DE LUXO, CROMOTERAPIA E PALETAS DE CORES PARA ESTÉTICA AVANÇADA, CLÍNICAS DE HARMONIZAÇÃO, BEAUTY E LIFESTYLE PREMIUM.
Sua missão é criar uma paleta de cores perfeitamente harmônica e sofisticada baseada na tendência de 'Estética Avançada' fornecida.

DIRETRIZES DE DESIGN:
- As cores devem exalar luxo, sofisticação, higiene clínica impecável e elegância visual para Instagram Stories e materiais de clínicas médicas.
- Combine tons ricos (Ouro Champagne, Vinho Bordeaux, Rose Gold, Off-White Pérola, Nude Aveludado, Verde Menta Muted, Preto Fosco Nobre, Prata Cristal) garantindo excelente contraste para legibilidade em adesivos transparentes.

Responda RIGOROSAMENTE em formato JSON com o seguinte esquema:
{
  "name": "Nome sofisticado da paleta (ex: Ouro Champagne & Vinho Bordeaux)",
  "gradientStart": "#HEX",
  "gradientEnd": "#HEX",
  "textColor": "#HEX",
  "strokeColor": "#HEX",
  "glowColor": "#HEX",
  "shadowColor": "rgba(r,g,b,alpha)",
  "aestheticRationale": "Breve frase descritiva em Português explicando o conceito cromatico e por que transmite luxo e harmonização."
}`;

    const userContent = `Tendência de Estética Avançada escolhida: "${trend}"
Contexto do adesivo / Frase: "${conceptText || "Harmonização & Elegância"}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userContent,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);

    res.json({ success: true, data });
  } catch (err: any) {
    console.error("Erro no /api/ai/palette:", err);
    res.status(500).json({
      error: "Falha ao gerar a Paleta Premium com Gemini.",
      details: err.message,
    });
  }
});

// AI Image Generation Endpoint for Custom Stickers
app.post("/api/ai/generate-sticker", async (req, res) => {
  try {
    const { prompt, aspectRatio = "1:1" } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "O prompt é obrigatório." });
    }

    const ai = getGenAI();
    const fullPrompt = `${prompt}, delicate ultra-fine line art, monoline aesthetic, sticker cutout with clean white outline die-cut border, isolated object on flat solid white background, crisp vector graphic sticker, 4K high resolution render.`;

    let imageUrl: string | null = null;
    let lastError: any = null;

    // 1. Try gemini-3.1-flash-lite-image
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          },
        },
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (e1: any) {
      console.warn("gemini-3.1-flash-lite-image notice:", e1.message);
      lastError = e1;
    }

    // 2. Try gemini-3.1-flash-image if lite failed
    if (!imageUrl) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-image",
          contents: {
            parts: [{ text: fullPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio as any,
            },
          },
        });

        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData?.data) {
              imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
      } catch (e2: any) {
        console.warn("gemini-3.1-flash-image notice:", e2.message);
        lastError = e2;
      }
    }

    // 3. High-Quality Vector Sticker Fallback Generator
    if (!imageUrl) {
      console.info("Gerando adesivo vetorial de altíssima qualidade para o prompt:", prompt);
      
      // Extract clean phrase from prompt
      let cleanText = "";
      const matchQuote = prompt.match(/["']([^"']+)["']/);
      if (matchQuote && matchQuote[1]) {
        cleanText = matchQuote[1].trim();
      } else {
        cleanText = prompt
          .replace(/^a luxury hand-lettered graphic sticker of (the word\/phrase )?/gi, '')
          .replace(/in exquisite.*$/gi, '')
          .replace(/[\"'\n\r]/g, '')
          .split(',')[0]
          .trim();
      }
      if (!cleanText || cleanText.length > 35) {
        cleanText = cleanText.substring(0, 30) || "Harmonização & Luxo";
      }

      // Calculate dynamic font size based on text length
      let fontSize = 72;
      if (cleanText.length <= 8) fontSize = 84;
      else if (cleanText.length <= 15) fontSize = 68;
      else if (cleanText.length <= 25) fontSize = 52;
      else fontSize = 40;

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FCEABB" />
            <stop offset="50%" stop-color="#D4AF37" />
            <stop offset="100%" stop-color="#8B6212" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="20" flood-color="#5B1E2D" flood-opacity="0.3" />
          </filter>
        </defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&amp;display=swap');
          .lettering {
            font-family: 'Dancing Script', 'Playfair Display', cursive, sans-serif;
            font-size: ${fontSize}px;
            font-weight: 700;
            fill: url(#goldGrad);
          }
          .sparkle {
            fill: #D4AF37;
          }
        </style>
        <rect width="100%" height="100%" fill="none" />
        <g transform="translate(500, 520)" text-anchor="middle" filter="url(#softGlow)">
          <text x="0" y="0" class="lettering">${cleanText}</text>
          <path class="sparkle" d="M -120 -100 L -115 -85 L -100 -80 L -115 -75 L -120 -60 L -125 -75 L -140 -80 L -125 -85 Z" opacity="0.85" />
          <path class="sparkle" d="M 120 -110 L 123 -100 L 133 -97 L 123 -94 L 120 -84 L 117 -94 L 107 -97 L 117 -100 Z" opacity="0.85" />
        </g>
      </svg>`;

      imageUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    }

    res.json({ success: true, imageUrl });
  } catch (err: any) {
    console.error("Erro geral no /api/ai/generate-sticker:", err);
    res.status(500).json({
      error: "Erro ao gerar imagem de sticker com Gemini.",
      details: err.message,
    });
  }
});

// AI Custom Sticker Parameter Generator
app.post("/api/ai/generate-custom-sticker-data", async (req, res) => {
  try {
    const { phrase, category = "estetica-facial", style = "Traços Finos" } = req.body;
    if (!phrase) {
      return res.status(400).json({ error: "A frase é obrigatória." });
    }

    const ai = getGenAI();
    const systemPrompt = `Você é um diretor de arte e designer tipográfico da marca de luxo Tamiris Santana.
Dada a frase do usuário, crie uma configuração completa de adesivo de luxo.

Responda rigorosamente em formato JSON:
{
  "title": "${phrase}",
  "category": "${category}",
  "style": "${style}",
  "tags": ["estética", "harmonização", "luxo"],
  "primaryColor": "#HEX (dourado #D4AF37, rose gold #B76E79, ou vinho #5B1E2D)",
  "textColor": "#HEX (#FFFFFF ou #5B1E2D ou #D4AF37)",
  "fontFamily": "Script Elegante" ou "Cursiva Delicada" ou "Luxo Serif" ou "Manuscrito Fino",
  "iconSymbol": "Sparkles" ou "Crown" or "Heart" or "Star" or "Flower",
  "badge": "IA TAMIRIS"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Frase: "${phrase}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json({ success: true, stickerData: data });
  } catch (err: any) {
    console.error("Erro no /api/ai/generate-custom-sticker-data:", err);
    res.status(500).json({ error: err.message });
  }
});

// AI Batch Category Text Generator
app.post("/api/ai/suggest-pack", async (req, res) => {
  try {
    const { category, style } = req.body;
    const ai = getGenAI();

    const prompt = `Gere uma lista de 10 variações exclusivas de adesivos para Instagram para a categoria "${category}" no estilo "${style}".
Cada item deve ter:
- "title": texto/frase impactante em português (máx 5 palavras)
- "elements": lista de 2 elementos visuais complementares (ex: "cruz dourada", "raios de luz")
- "styleTag": tag do estilo (ex: "3D Gold", "Neon Cyan", "Aquarela Soft")
- "hexColor": cor hex sugerida

Responda apenas em formato JSON com a propriedade "stickers" contendo a array.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || '{"stickers":[]}');
    res.json({ success: true, pack: data.stickers });
  } catch (err: any) {
    console.error("Erro no /api/ai/suggest-pack:", err);
    res.status(500).json({ error: err.message });
  }
});

// Firebase configuration public metadata endpoint
app.get("/api/firebase-config", (req, res) => {
  try {
    const fs = require("fs");
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      res.json({ success: true, config });
    } else {
      res.status(404).json({ error: "Configuração do Firebase não encontrada." });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Fallback for SPA routing in development mode
    app.use(async (req, res, next) => {
      if (req.method !== "GET" || req.originalUrl.startsWith("/api")) return next();
      try {
        const fs = await import("fs");
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.method === "GET" && !req.path.startsWith("/api")) {
        return res.sendFile(path.join(distPath, "index.html"));
      }
      next();
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StickerMaster Express Server rodando na porta ${PORT}`);
  });
}

if (process.env.VERCEL !== "1") {
  startServer();
}

export default app;

