import express, { Express, Request, Response } from "express";
import session from "express-session";
import hackerNewsRoutes from "./routes/hackerNewsRoutes";
import blogRoutes from "./routes/blogRoutes";
import twitterRoutes from "./routes/twitterRoutes";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/hackernews", hackerNewsRoutes);
app.use("/blog", blogRoutes);
app.use("/twitter", twitterRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
