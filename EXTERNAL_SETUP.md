# External Service Setup for Chrome Extension Authentication

This guide provides a complete walkthrough for configuring the authentication flow between your Chrome Extension, Google Cloud, and Supabase.

There are two distinct phases for this setup:
1.  **Development & Local Testing**: For when you are running the extension locally as an unpacked extension.
2.  **Production & Web Store**: For when you have published your extension to the Chrome Web Store.

It is a security best practice to use separate credentials for development and production environments.

---

## Part 1: Development & Local Testing Setup

During development, your extension has a temporary, unique ID that can change. You need to use this ID to configure your services.

### Step 1: Find Your Local Extension ID

1.  Open Google Chrome and navigate to `chrome://extensions`.
2.  Ensure "Developer mode" in the top-right corner is toggled **on**.
3.  Click "Load unpacked" and select the `dist` folder of your project (`I:/chrome-extensions/MemoryBox/dist`).
4.  Your extension will appear in the list. Find its card and copy the **ID**. It will be a long string of random characters.

    *   **Example ID**: `bgpphakfkefiandebalceffjjbhfhggg`

    **Important**: This ID is tied to the path of your extension folder. If you move the project or load it on a different computer, this ID will change, and you will need to update your configurations.

### Step 2: Configure Google Cloud Console

This is where you get the credentials that tell Google your application is authorized to use its sign-in service.

1.  **Navigate to the Google Cloud Console**: Go to [console.cloud.google.com](https://console.cloud.google.com) and select your project.

2.  **Enable Necessary APIs**:
    *   In the sidebar, go to **APIs & Services** -> **Library**.
    *   Search for and enable the **"Google People API"**. This is often required for accessing basic user profile information.

3.  **Configure the OAuth Consent Screen**:
    *   Go to **APIs & Services** -> **OAuth consent screen**.
    *   **If you are setting this up for the first time**:
        *   Choose **External** for the User Type and click **Create**.
        *   Follow the on-screen wizard. Fill in the required app information (name, support email, etc.).
        *   On the **Scopes** step, you can click **Save and Continue** without adding any scopes for a basic Google Sign-In.
        *   On the **Test users** step, click **+ ADD USERS**. Add the Google account(s) you will use for testing. **This is crucial, otherwise, your login attempts will be blocked while your app is in "Testing" mode.**
        *   Complete the wizard and save your changes.
    *   **If you have already configured the consent screen**:
        *   You will see a summary of your consent screen settings. The **Publishing status** should be **"Testing"**.
        *   To manage test users, you may need to click the **"Edit App"** button first.
        *   As you've correctly pointed out, the **Test Users** section may be found directly on the main consent screen page, sometimes under a heading like **"Audience"**. 
        *   Find the **Test users** list and click **+ ADD USERS** to add or manage the Google accounts you will use for testing.

4.  **Create an OAuth 2.0 Client ID**:
    *   Go to **APIs & Services** -> **Credentials**.
    *   Click **+ CREATE CREDENTIALS** and select **OAuth client ID**.
    *   For **Application type**, select **Chrome extension**.
    *   In the **Application ID** field, paste the local **Extension ID** you found in Step 1.
    *   Click **Create**.

5.  **Get Your Client ID**:
    *   A **Client ID** will be displayed. It will be a long string ending in `.apps.googleusercontent.com`.
    *   **You will NOT receive a Client Secret for a Chrome Extension client type.** This is expected and secure.
    *   You will only need the Client ID for the Supabase configuration.

### Step 3: Configure Supabase

This is where you tell Supabase to use the Google credentials you just created.

1.  **Navigate to Supabase**: Go to your project's dashboard at [app.supabase.com](https://app.supabase.com).

2.  **Configure the Google Auth Provider**:
    *   In the sidebar, go to **Authentication** -> **Providers**.
    *   Find **Google** in the list and enable it.
    *   In the **Client ID** field, paste the Client ID from the Google Cloud Console.
    *   Leave the **Client Secret** field **blank**.
    *   Click **Save**.

3.  **Configure the Redirect URL**:
    *   In the sidebar, go to **Authentication** -> **URL Configuration**.
    *   In the **Redirect URLs** field, add the following URL, replacing `<your-local-extension-id>` with the ID from Step 1:
        ```
        https://<your-local-extension-id>.chromiumapp.org/
        ```
    *   **Example**: `https://bgpphakfkefiandebalceffjjbhfhggg.chromiumapp.org/`
    *   **Important**: The URL must start with `https://` and end with a trailing slash `/`. You can add multiple URLs here, separated by commas or new lines.
    *   Click **Save**.

Your development environment is now fully configured.

---

## Part 2: Production & Chrome Web Store Setup

When you publish your extension, it gets a permanent, public ID. You must create and use a separate, new set of production credentials.

### Step 1: Get Your Production Extension ID

1.  **Upload Your Extension**: Follow the [Chrome Web Store documentation](https://developer.chrome.com/docs/webstore/publish) to upload the `.zip` file of your `dist` folder.
2.  **Find the Production ID**: After uploading, the Chrome Developer Dashboard will show you the permanent ID for your published item. This ID will be different from your local development ID. It is also visible in the public URL of your extension's store page.

### Step 2: Update Google Cloud Console for Production

1.  **Create a NEW OAuth 2.0 Client ID**:
    *   Go back to **APIs & Services** -> **Credentials** in your Google Cloud project.
    *   Click **+ CREATE CREDENTIALS** -> **OAuth client ID**.
    *   Select **Chrome extension** as the application type.
    *   In the **Application ID** field, paste your new **Production Extension ID**.
    *   Click **Create**.

2.  **Get Production Credentials**:
    *   A new, separate set of "Client ID" and "Client Secret" will be generated. Use these for your production environment.

### Step 3: Update Supabase for Production

1.  **Add the Production Redirect URL**:
    *   Go to **Authentication** -> **URL Configuration** in your Supabase dashboard.
    *   **Add** the new production redirect URL to the **Redirect URLs** list. Do not remove your development URL.
        ```
        https://<your-production-extension-id>.chromiumapp.org/
        ```

2.  **Update Your Extension's Code (Recommended)**:
    *   It's a best practice to use environment variables to switch between development and production credentials.
    *   In your extension's code where you initialize Supabase (`supabase.ts`), you should dynamically use the correct Google Client ID based on the environment.
    *   For production, you would use the new production Client ID. For development, you'd continue using the development one. This step is more advanced and depends on your build process, but it is highly recommended for security. If you don't do this, you would have to manually replace the credentials in your code before creating a production build.

By following these steps, you will have a secure and correctly configured authentication flow for both your local testing and your published Chrome Extension.
