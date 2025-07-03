import { useState, useEffect } from "react";
import { signInWithGoogle } from "./services/AuthService";

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

function App() {
  const [user, setUser] = useState<GoogleUserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Check for existing authentication state in chrome storage
    chrome.storage.local.get(
      ["isAuthenticated", "googleUserInfo"],
      (result) => {
        if (result.isAuthenticated && result.googleUserInfo) {
          setUser(result.googleUserInfo);
        }
        setLoading(false);
      }
    );
  }, []);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const response = (await signInWithGoogle()) as {
        success: boolean;
        user?: GoogleUserInfo;
      };
      if (response.success && response.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      // Clear stored authentication data
      await chrome.storage.local.remove([
        "googleAccessToken",
        "googleRefreshToken",
        "googleUserInfo",
        "isAuthenticated",
      ]);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <h1>MemoryBox</h1>
      {!user ? (
        <button onClick={handleSignIn}>Sign in with Google</button>
      ) : (
        <div>
          <p>
            Welcome, {user.name} ({user.email})
          </p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
}

export default App;
