// app/lib/oauth-providers/google.ts
import { OAuth2Client } from "google-auth-library";

// Make sure the environment variables are set
if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.GOOGLE_REDIRECT_URI
) {
  throw new Error(
    "Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REDIRECT_URI"
  );
}

const oauthClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI
});

export const getTokenFromCode = async (code: string) => {
    const { tokens } = await oauthClient.getToken(code);
    if (!tokens.id_token) {
    throw new Error("Something went wrong. Please try again.");
    }

    const payload = await oauthClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID
    });

    const idTokenBody = payload.getPayload();

    if (!idTokenBody) {
    throw new Error("Something went wrong. Please try again.");
    }

    return idTokenBody
}

export const generateAuthUrl = (state: string) => {
  return oauthClient.generateAuthUrl({
    access_type: "online",
    scope: ["https://www.googleapis.com/auth/userinfo.email"],
    state
  });
};
