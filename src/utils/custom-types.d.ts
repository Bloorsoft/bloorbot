import "express-session";

declare module "express-session" {
  export interface SessionData {
    oauth_token?: string;
    oauth_token_secret?: string;
    accessToken?: string;
    accessSecret?: string;
  }
}