import { Router } from "express";
import dotenv from "dotenv";
import { TwitterApi } from "twitter-api-v2";
import { htmlToMarkdown } from "@utils/contentUtils";
import openai from "@utils/openaiClient";

declare module "express-session" {
  export interface SessionData {
    oauth_token?: string;
    oauth_token_secret?: string;
    accessToken?: string;
    accessSecret?: string;
  }
}

dotenv.config();

const router = Router();

let twitterClient: TwitterApi | undefined;

router.get("/auth", async (req, res) => {
  const CALLBACK_URL = "http://localhost:3000/twitter/callback";

  twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
  });

  try {
    const { url, oauth_token, oauth_token_secret } =
      await twitterClient.generateAuthLink(CALLBACK_URL, {
        linkMode: "authorize",
      });

    req.session.oauth_token = oauth_token;
    req.session.oauth_token_secret = oauth_token_secret;

    res.redirect(url);
  } catch (error) {
    console.error("Error generating auth link:", error);
    res.status(500).send("Failed to initiate authentication with Twitter.");
  }
});

// router.get("/callback", (req, res) => {
//   // Extract tokens from query string
//   const { oauth_token, oauth_verifier } = req.query;
//   // Get the saved oauth_token_secret from session
//   const { oauth_token_secret } = req.session;

//   if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
//     return res.status(400).send("You denied the app or your session expired!");
//   }

//   // Obtain the persistent tokens
//   // Create a client from temporary tokens
//   const client = new TwitterApi({
//     appKey: process.env.TWITTER_API_KEY!,
//     appSecret: process.env.TWITTER_API_SECRET!,
//     accessToken: oauth_token,
//     accessSecret: oauth_token_secret,
//   });

//   // @ts-ignore
//   client
//     .login(oauth_verifier as string)
//     .then(({ client: loggedClient, accessToken, accessSecret }) => {
//       // loggedClient is an authenticated client in behalf of some user
//       // Store accessToken & accessSecret somewhere
//       twitterClient = loggedClient;
//       // req.session.accessToken = accessToken;
//       // req.session.accessSecret = accessSecret;
//     })
//     .catch(() => res.status(403).send("Invalid verifier or access tokens!"));
// });

router.post("/generate-thread", async (req, res) => {
  const url = req.body.url;
  const markdownContent = await htmlToMarkdown(url);

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are a world-class tweet writer. Generate an engaging and informative Twitter thread. Use the following content as context for the thread. Remember to write in a conversational tone. Do not go over 6 tweets in a thread. Do not use emojis and unnecessary hashtags. Keep the writing human and specific to the readers who are engineers or founders and are in the startup space. Keep the tweets to the point and avoid fluff. If appropriate, further engage the readers by asking questions.`,
      },
      {
        role: "user",
        content: `Here's the content: ${markdownContent}. Write a Twitter thread using this content. Focus on providing as much value to the reader as possible. Each tweet should give the reader something to think about or act on.`,
      },
    ],
  });

  const threadContent = chatCompletion.choices[0].message.content;

  res.json({ message: "Thread generated successfully", threadContent });
});

router.post("/tweet", async (req, res) => {
  try {
    const rwClient = twitterClient?.readWrite;
    const tweet = await rwClient?.v2.tweet("Hello, world!");
    res.json({ message: "Tweeted successfully", tweet });
  } catch (error) {
    console.error("Failed to tweet:", error);
    res.status(500).json({ message: "Failed to tweet" });
  }
});

export default router;
