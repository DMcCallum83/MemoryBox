import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "./config/auth";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Service worker installed.");
});

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "signIn") {
    console.log("Launching web auth flow with URL:", request.url);
    console.log(
      "Code verifier received:",
      request.codeVerifier ? "(present)" : "(missing)"
    );

    // Validate the URL before launching
    try {
      new URL(request.url);
    } catch {
      console.error("Invalid URL provided:", request.url);
      sendResponse({ success: false, error: "Invalid authorization URL" });
      return;
    }

    // Try to launch the OAuth flow
    chrome.identity.launchWebAuthFlow(
      {
        url: request.url,
        interactive: true,
      },
      async (redirectUrl) => {
        console.log("Redirect URL received:", redirectUrl);

        if (chrome.runtime.lastError) {
          console.error("Chrome identity error:", chrome.runtime.lastError);
          sendResponse({
            success: false,
            error: chrome.runtime.lastError.message,
          });
          return;
        }

        if (redirectUrl) {
          try {
            // Parse the redirect URL to extract authorization code
            const url = new URL(redirectUrl);
            const queryParams = new URLSearchParams(url.search);

            const code = queryParams.get("code");
            const error = queryParams.get("error");
            const errorDescription = queryParams.get("error_description");

            console.log(
              "Authorization code received:",
              code ? "(present)" : "(missing)"
            );

            if (error) {
              console.error("OAuth error:", error, errorDescription);
              sendResponse({
                success: false,
                error: errorDescription || error,
              });
              return;
            }

            if (code) {
              try {
                // Exchange authorization code for tokens manually
                const tokenResponse = await fetch(
                  "https://oauth2.googleapis.com/token",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                      client_id: GOOGLE_CLIENT_ID,
                      client_secret: GOOGLE_CLIENT_SECRET,
                      code: code,
                      code_verifier: request.codeVerifier,
                      grant_type: "authorization_code",
                      redirect_uri: chrome.identity.getRedirectURL("oauth2"),
                    }),
                  }
                );

                const tokenData = await tokenResponse.json();

                if (tokenData.error) {
                  console.error("Token exchange error:", tokenData);
                  sendResponse({
                    success: false,
                    error: tokenData.error_description || tokenData.error,
                  });
                  return;
                }

                console.log("Token exchange successful:", tokenData);

                // Get user info from Google using the access token
                const userInfoResponse = await fetch(
                  "https://www.googleapis.com/oauth2/v2/userinfo",
                  {
                    headers: {
                      Authorization: `Bearer ${tokenData.access_token}`,
                    },
                  }
                );

                const userInfo = await userInfoResponse.json();
                console.log("Google user info:", userInfo);

                if (userInfo.error) {
                  console.error("Error getting user info:", userInfo);
                  sendResponse({
                    success: false,
                    error: userInfo.error_description || userInfo.error,
                  });
                  return;
                }

                // Store the tokens and user info in chrome.storage for later use
                await chrome.storage.local.set({
                  googleAccessToken: tokenData.access_token,
                  googleRefreshToken: tokenData.refresh_token,
                  googleUserInfo: userInfo,
                  isAuthenticated: true,
                });

                console.log("Authentication successful, tokens stored");
                sendResponse({ success: true, user: userInfo });
              } catch (e: unknown) {
                const errorMessage =
                  e instanceof Error ? e.message : "Unknown error occurred";
                console.error("Error during token exchange:", e);
                sendResponse({ success: false, error: errorMessage });
              }
            } else {
              console.error("No authorization code found in redirect URL");
              sendResponse({
                success: false,
                error: "Authorization code not found in redirect URL.",
              });
            }
          } catch (e: unknown) {
            const errorMessage =
              e instanceof Error ? e.message : "Unknown error occurred";
            console.error("Error parsing redirect URL or exchanging code:", e);
            sendResponse({ success: false, error: errorMessage });
          }
        } else {
          console.log("User cancelled the OAuth flow");
          sendResponse({ success: false, error: "User cancelled" });
        }
      }
    );
    return true; // Keep the message channel open for async response
  }
});
