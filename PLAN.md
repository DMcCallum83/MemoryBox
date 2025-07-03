# MemoryBox Development Plan

## 1. Project Setup
*   Initialize a React project with TypeScript.
*   Configure SCSS for styling.
*   Install `feather-icons-react` and `headlessui`.
*   Integrate **Firebase SDK** for:
    *   **Authentication:** Google Sign-In.
    *   **Database:** Firestore (for structured memory data and user profiles).
    *   **Storage:** Firebase Storage (for images from screengrabs/clipboard).

## 2. Authentication
*   Implement Google Sign-In using the `chrome.identity` API. This will allow users to authenticate with their Google accounts within the extension.
*   Handle user authentication state and ensure data retrieval from Firestore is tied to the authenticated user.

## 3. Data Model (Firebase Firestore & Storage)
*   **Memories Collection (Firestore):** Store memory details (text, URL, `important` tag, creation/update dates, shared status, etc.).
*   **User Profiles Collection (Firestore):** Store user-specific data, including contacts for sharing.
*   **Firebase Storage:** Store image data (from screengrabs or clipboard pastes) and link their URLs in the Firestore memory documents.

## 4. Core UI Components (HeadlessUI & SCSS)
*   **Layout:** Create a main layout component with navigation for "Memory Box", "New Memory", and "Box Stats" tabs.
*   **Memory Box Tab:**
    *   Display a list of memories retrieved from Firestore.
    *   Implement filtering by tags and date.
    *   Implement text search across memory content.
    *   Implement memory expansion to show full details.
    *   Implement "Export" (to clipboard) and "Share" functionalities.
*   **New Memory Tab:**
    *   Input fields for text and URL.
    *   Button for image paste from clipboard.
    *   Button for screengrab using `chrome.desktopCapture`.
    *   Option to add an "important" tag.
    *   Save new memories to Firestore (and images to Firebase Storage).
*   **Box Stats Tab:**
    *   Display statistics based on Firestore data (total memories, memories today/week/month, total shared memories).

## 5. Chrome Extension Integration
*   Configure `manifest.json` with necessary permissions (`identity`, `storage`, `desktopCapture`, `activeTab`, `clipboardRead`, `clipboardWrite`).
*   Implement a background script to handle `chrome.identity` and `chrome.desktopCapture` requests, and potentially other long-running tasks.

## 6. Sharing Functionality
*   Implement a sharing mechanism where memories are shared by granting access to specific user IDs in Firestore.
*   When a shared memory is updated, push changes to Firestore, which will then sync to all users who have access.

## 7. Screengrab Implementation
*   Utilize `chrome.desktopCapture` to capture the current tab or a selected area.
*   Process the captured image (e.g., convert to a suitable format), upload it to Firebase Storage, and save the resulting URL in the memory document in Firestore.

## 8. Styling
*   Apply plain SCSS based on the provided color palette and theme, ensuring a neat and consistent visual style.

## 9. Project Structure
*   Organize the codebase into logical folders such as `components`, `services` (for Firebase interactions, Chrome API calls), `utils`, `hooks`, `pages` (for the main tab views), and `types` (for TypeScript interfaces).
