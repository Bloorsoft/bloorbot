import { Router } from "express";
import { fetchTopStories, fetchTopStory } from "@utils/hackerNewsUtils";

const router = Router();

router.get("/top-stories", async (req, res) => {
  try {
    const stories = await fetchTopStories();
    res.json(stories);
  } catch (error) {
    console.error("Failed to fetch top stories:", error);
    res.status(500).json({ message: "Failed to fetch top stories" });
  }
});

router.get("/top-story", async (req, res) => {
  try {
    const story = await fetchTopStory();
    res.json(story);
  } catch (error) {
    console.error("Failed to fetch top stories:", error);
    res.status(500).json({ message: "Failed to fetch top stories" });
  }
});

export default router;
