# Chrome Extension Boilerplate

This is a boilerplate project for creating Chrome extensions using React, TypeScript, and Vite. It includes Google Authentication and demonstrates how to use synced storage.

## Technologies Used

*   **Framework:** [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Authentication:** Google OAuth 2.0 via `chrome.identity` API
*   **Storage:** `chrome.storage.sync` for cross-device data synchronization

## Getting Started

### 1. Installation

Clone the repository and install the dependencies using `npm`:

```bash
git clone https://github.com/DMcCallum83/chrome-extension-boilerplate.git
cd chrome-extension-boilerplate
npm install
```

### 2. Google OAuth 2.0 Client ID

To use the Google Authentication feature, you need to create an OAuth 2.0 Client ID in the Google Cloud Console.

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  Go to **APIs & Services > Credentials**.
4.  Click **Create Credentials > OAuth client ID**.
5.  Select **Chrome App** as the application type.
6.  Fill in the required information. The Application ID can be found at `chrome://extensions` after you load the extension for the first time.
7.  Once the client ID is created, copy it.
8.  Open the `manifest.json` file and replace `"YOUR_CLIENT_ID.apps.googleusercontent.com"` with your actual client ID.

For more detailed instructions, follow the official Chrome Extension documentation: [OAuth 2.0 tutorial](https://developer.chrome.com/docs/extensions/mv3/tut_oauth/)

### 3. Running the Extension in Development Mode

To run the extension in development mode with hot-reloading:

```bash
npm run dev
```

This will create a `dist` directory. To load the extension in Chrome:

1.  Open Chrome and navigate to `chrome://extensions`.
2.  Enable **Developer mode**.
3.  Click **Load unpacked**.
4.  Select the `dist` directory from this project.

The extension should now be loaded, and you can start developing. Vite will watch for file changes and automatically reload the extension.

## Building for Production

To create a production-ready build of the extension:

```bash
npm run build
```

This will create an optimized build in the `dist` directory. You can then zip the `dist` directory and upload it to the Chrome Web Store.

## Project Structure

*   `manifest.json`: The core configuration file for the Chrome extension.
*   `src/`: Contains the source code for the extension.
    *   `background.ts`: The service worker for background tasks.
    *   `popup.html` & `popup.tsx`: The UI for the extension's popup.
    *   `main.tsx`: The entry point for the React application.
*   `vite.config.ts`: The configuration file for Vite.
*   `dist/`: The output directory for the built extension.