import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are an elite technical recruiter and resume writer.

You have the user's GitHub URL, LinkedIn URL, Master Resume, and Target Job Description.

RULES:
1. If this is the start of the conversation, immediately generate a highly tailored resume using the "Jake's Resume" LaTeX template.
2. Ensure every bullet point follows the Google X-Y-Z format: "Accomplished [X] as measured by [Y], by doing [Z]."
3. Quantify everything. Use strong action verbs.
4. Keep the resume to one page.
5. If the user provides feedback or asks for tweaks, regenerate the necessary sections or the full LaTeX document incorporating their changes.
6. ALWAYS output the final LaTeX strictly inside \`\`\`latex codeblocks.
7. Never wrap the LaTeX in HTML or any other format. Only use \`\`\`latex blocks.
8. The LaTeX must be valid and compilable with pdflatex.

Jake's Resume template structure:
- Use \\documentclass[a4paper,11pt]{article}
- Use \\usepackage[utf8]{inputenc}, \\usepackage[T1]{fontenc}
- Use \\usepackage{geometry} with margins 0.75in
- Use \\usepackage{enumitem} for lists
- Use \\usepackage{hyperref} for links
- Use \\usepackage{fontawesome} for icons (optional)
- Sections: Education, Experience, Projects, Skills
- Format: Name centered at top, contact info below, then sections
- For each experience/project, use \\textbf{Title} \\hfill Date range on one line, then \\textit{Company/Organization} on next line, then bullet points`;

const userMessage = `Generate a tailored LaTeX resume for me based on the following information.

GitHub URL: https://github.com/johndoe
LinkedIn URL: https://linkedin.com/in/johndoe

=== MASTER RESUME ===
Senior Software Engineer with 5+ years of experience building full-stack web applications. Proficient in React, TypeScript, Node.js, Python, and AWS. Led a team of 4 engineers at TechCorp where I built a real-time analytics dashboard serving 50k+ users. Previously at StartupXYZ, I built the core payment processing system handling $2M+ monthly transactions. Computer Science degree from University of California, Berkeley.

=== TARGET JOB DESCRIPTION ===
Senior Full-Stack Engineer at FastGrowingAI
We are looking for an experienced full-stack engineer to join our AI platform team. You will build and maintain scalable web applications serving millions of users. Required: 5+ years experience, strong React/TypeScript skills, experience with Node.js microservices, familiarity with ML/AI pipelines, experience leading technical projects. Our stack: React, Next.js, Python, AWS, PostgreSQL, Redis.`;

const result = streamText({
  model: groq('llama-3.3-70b-versatile'),
  system: SYSTEM_PROMPT,
  messages: [{ role: 'user', content: userMessage }],
  temperature: 0.7,
  maxOutputTokens: 8192,
});

let fullText = '';
for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
  fullText += chunk;
}

console.log('\n\n=== DONE ===');
