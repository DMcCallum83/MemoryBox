import { supabase } from "./supabase";
import { GOOGLE_CLIENT_ID } from "../config/auth";

// Generate a random string for PKCE
function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// Generate code challenge from verifier
async function generateCodeChallenge(verifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export const signInWithGoogle = async () => {
  // For Chrome extensions, we need to use a specific redirect URL format
  const redirectUrl = chrome.identity.getRedirectURL("oauth2");

  console.log("Generated redirect URL:", redirectUrl);

  // Generate PKCE values
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  console.log("Generated code verifier:", codeVerifier);
  console.log("Generated code challenge:", codeChallenge);

  // Build Google OAuth URL directly with PKCE
  const googleOAuthUrl = new URL(
    "https://accounts.google.com/o/oauth2/v2/auth"
  );
  googleOAuthUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
  googleOAuthUrl.searchParams.set("redirect_uri", redirectUrl);
  googleOAuthUrl.searchParams.set("response_type", "code");
  googleOAuthUrl.searchParams.set(
    "scope",
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid"
  );
  googleOAuthUrl.searchParams.set("access_type", "offline");
  googleOAuthUrl.searchParams.set("prompt", "consent");
  googleOAuthUrl.searchParams.set("code_challenge", codeChallenge);
  googleOAuthUrl.searchParams.set("code_challenge_method", "S256");

  console.log("Direct Google OAuth URL:", googleOAuthUrl.toString());

  const response = await new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        action: "signIn",
        url: googleOAuthUrl.toString(),
        codeVerifier: codeVerifier, // Pass the code verifier to background script
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (response && response.success) {
          resolve(response);
        } else {
          reject(new Error(response?.error || "Unknown error occurred"));
        }
      }
    );
  });

  return response;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

export const getUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const onAuthStateChange = (callback: any) => {
  return supabase.auth.onAuthStateChange(callback);
};

export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};
