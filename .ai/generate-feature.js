const fs = require("fs");
const https = require("https");

// ensure .ai directory exists
if (!fs.existsSync(".ai")) {
  fs.mkdirSync(".ai");
}

const idea = fs.readFileSync("ideas/next-feature.md", "utf-8");

const payload = JSON.stringify({
  model: "gpt-4.1-mini",
  messages: [
    {
      role: "user",
      content: `
You are a senior backend engineer.
Project: HARBORX (logistics SaaS).

Generate ONLY Express.js code for this feature.
Do NOT explain.
Return code only.

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
    const response = JSON.parse(data);
    fs.writeFileSync(".ai/output.txt", response.choices[0].message.content);
    console.log("AI output written to .ai/output.txt");
  });
});

req.on("error", err => {
  console.error("Request failed:", err);
});

req.write(payload);
req.end();
