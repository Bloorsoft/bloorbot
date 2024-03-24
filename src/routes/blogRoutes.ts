import { Router } from "express";
import { promises as fs } from "fs";
import { fetchTopStory } from "@utils/hackerNewsUtils";
import { htmlToMarkdown } from "@utils/contentUtils";
import openai from "@utils/openaiClient";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

async function generateSEOFileName(topic: string): Promise<string> {
  const seoCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
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

  if (!seoFriendlyName?.endsWith(".md")) {
    seoFriendlyName += ".md";
  }

  return seoFriendlyName as string;
}

router.post("/generate-blog", async (req, res) => {
  const topic = req.body.topic;

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a world-class blogger...",
      },
      {
        role: "user",
        content: `Write a blog post about the latest trends in ${topic}.`,
      },
    ],
  });

  const blogContent = chatCompletion.choices[0].message.content;
  const filename = await generateSEOFileName(topic);
  await fs.writeFile(filename, blogContent!, { flag: "a" });

  res.json({ message: `${filename} has been created with the blog content.` });
});

router.post("/generate-hackernews-top-story-blog", async (req, res) => {
  try {
    const story = await fetchTopStory();
    const title = story.title,
      url = story.url;
    const markdownContent = await htmlToMarkdown(url);

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a world-class blogger. Generate a detailed, engaging, and informative blog post in Markdown format. Use the following content as context for the blog post. Remember to write in a conversational tone. Make sure to add an image for this blog post from known online image sources (no need to include citations).",
        },
        {
          role: "user",
          content: `Here's a topic based on a top story: ${title}. Here is the content: ${markdownContent}. Write a blog post about this.`,
        },
      ],
    });

    const blogContent = chatCompletion.choices[0].message.content;
    const fileName = await generateSEOFileName(title);

    await fs.writeFile(fileName, blogContent!, { flag: "a" });

    res.json({
      message: `${fileName} has been created with the blog content.`,
      blogContent,
      fileName,
    });

  } catch (error) {
    console.error("Failed to generate blog from top story:", error);
    res.status(500).json({ message: "Failed to generate blog from top story" });
  }
});

export default router;
