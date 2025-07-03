chrome.identity.onSignInChanged.addListener((account, signedIn) => {
  console.log(`Account ${account.id} signed in: ${signedIn}`);
  // You might want to update UI or perform other actions based on sign-in status
});

// Example of how to handle messages from the popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureVisibleTab") {
    if (sender.tab?.windowId !== undefined) {
      chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: "png" }, (dataUrl) => {
        sendResponse({ dataUrl });
      });
    } else {
      sendResponse({ error: "No window ID found for tab." });
    }
    return true; // Indicates that sendResponse will be called asynchronously
  }
});
