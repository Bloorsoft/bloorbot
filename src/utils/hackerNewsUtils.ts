import axios from "axios";

export async function fetchTopStories() {
  const topStoriesUrl = "https://hacker-news.firebaseio.com/v0/topstories.json";
  const { data: storyIds } = await axios.get<number[]>(topStoriesUrl);
  const topTenIds = storyIds.slice(0, 10);

  const storyPromises = topTenIds.map((id) =>
    axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
  );
  const storiesResponses = await Promise.all(storyPromises);
  const stories = storiesResponses.map((response) => response.data);

  return stories;
}

export async function fetchTopStory() {
  const topStoriesUrl = "https://hacker-news.firebaseio.com/v0/topstories.json";
  const { data: storyIds } = await axios.get<number[]>(topStoriesUrl);
  const topStoryId = storyIds[0];

  const storyResponse = await axios.get(
    `https://hacker-news.firebaseio.com/v0/item/${topStoryId}.json`
  );
  return storyResponse.data;
}
