import fs from "fs";
import fetch from "node-fetch";

const idea = fs.readFileSync("ideas/next-feature.md", "utf-8");

const prompt = `
You are a senior full-stack engineer.
Project name: HARBORX (logistics SaaS).

Generate production-ready code changes based on this feature request.
Return ONLY code blocks with file paths.

Feature request:
${idea}
`;

const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  })
});

const data = await response.json();

fs.writeFileSync(".ai/output.txt", data.choices[0].message.content);

console.log("AI output generated");
