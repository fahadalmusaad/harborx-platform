const fs = require("fs");
const https = require("https");

const idea = fs.readFileSync("ideas/next-feature.md", "utf-8");
const serverPath = "server/index.js";
const markerStart = "// === AI ROUTES START ===";
const markerEnd = "// === AI ROUTES END ===";

const serverCode = fs.readFileSync(serverPath, "utf-8");

const payload = JSON.stringify({
  model: "gpt-4.1-mini",
  messages: [
    {
      role: "system",
      content: "You are a senior backend engineer. Output ONLY JavaScript Express routes."
    },
    {
      role: "user",
      content: `
Add new Express.js routes for this feature.
Rules:
- ONLY routes (app.get / app.post)
- No explanations
- No imports
- No server listen
- Idempotent (do not duplicate routes)

Feature:
${idea}
`
    }
  ],
  temperature: 0.2
});

const options = {
  hostname: "api.openai.com",
  path: "/v1/chat/completions",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Length": Buffer.byteLength(payload)
  }
};

const req = https.request(options, res => {
  let data = "";
  res.on("data", chunk => (data += chunk));
  res.on("end", () => {
    try {
      const response = JSON.parse(data);
      if (!response.choices) return;

      const aiRoutes = response.choices[0].message.content.trim();
      if (!aiRoutes) return;

      const before = serverCode.split(markerStart)[0];
      const middle = serverCode.split(markerStart)[1].split(markerEnd)[0];
      const after = serverCode.split(markerEnd)[1];

      if (middle.includes(aiRoutes)) return;

      const updated =
        before +
        markerStart +
        "\n" +
        middle.trim() +
        "\n" +
        aiRoutes +
        "\n" +
        markerEnd +
        after;

      fs.writeFileSync(serverPath, updated);
      console.log("AI routes injected into server/index.js");
    } catch (e) {
      console.error("AI injection failed safely");
    }
  });
});

req.on("error", () => {});
req.write(payload);
req.end();
