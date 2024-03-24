import axios from "axios";
import TurndownService from "turndown";

export async function htmlToMarkdown(url: string): Promise<string> {
  try {
    const response = await axios.get(url, { responseType: "text" });
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(response.data);
    return markdown;
  } catch (error) {
    console.error("Error converting HTML to Markdown:", error);
    throw error;
  }
}

