// app/routes/google-callback.tsx
import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getTokenFromCode } from "../lib/oauth-providers/google";


export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!state || !code) {
    throw new Error("Something went wrong. Please try again.");
  }

  const idToken = await getTokenFromCode(code)
  return json({ google: idToken });
}

// This component should never get rendered, so it can be anything
export default function GoogleCallback() {
    const { google } = useLoaderData<typeof loader>();
    return (
    <div>
      <h1>GoogleCallback : {google.email} / {google.sub}</h1>
    </div>
  );
}