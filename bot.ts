import { Client } from "twitter-api-sdk";
import { TwitterApi } from "twitter-api-v2";
import OpenAI from "openai";
import { promises as fs } from "fs";
import dotenv from "dotenv";

dotenv.config();

const CALLBACK_URL = "http://localhost:3000/auth/twitter/callback";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateSEOFileName(topic: string): Promise<string> {
  const seoCompletion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are an SEO expert. Generate a URL-friendly filename based on the given blog topic. The filename should be lowercase, use hyphens instead of spaces, and exclude special characters. Only output the filename.",
      },
      {
        role: "user",
        content: `Generate a filename for a blog post about: ${topic}`,
      },
    ],
  });

  let seoFriendlyName = seoCompletion?.choices[0]?.message?.content?.trim();
  // Ensure the filename ends with .md
  if (!seoFriendlyName?.endsWith(".md")) {
    seoFriendlyName += ".md";
  }

  return seoFriendlyName as string;
}

async function main() {
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are world class blogger skilled in writing detailed, engaging, and informative tech-based blog posts in Markdown format. Include a relevant image which further describes the topic from known online image sources. Remember, your goal is to write content that is actually valuable for the user and will teach them something new. You can also include code snippets, diagrams, and other visual aids to help explain the topic. Your blog post should be at least 500 words long and should be written in a conversational tone. You can also include a call to action at the end of the blog post to encourage the user to take a specific action, such as signing up for a newsletter or following you on social media. You can also include a list of resources at the end of the blog post to help the user learn more about the topic. You can also include a list of resources at the end of the blog post to help the user learn more about the topic.",
      },
      {
        role: "user",
        content:
          "Write a blog post about the latest trends in artificial intelligence.",
      },
    ],
  });

  const blogContent = chatCompletion.choices[0].message.content;

  // Use GPT-4 to generate an SEO-friendly filename based on the topic
  const filename = await generateSEOFileName(
    "latest trends in artificial intelligence"
  );

  // Write the content to the generated filename
  await fs.writeFile(filename, blogContent!, { flag: "a" });

  console.log(`${filename} has been created with the blog content.`);
}

main();
