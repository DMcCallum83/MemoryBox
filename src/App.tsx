import { useState, useEffect } from 'react';
import './App.css';

interface UserInfo {
  name: string;
  email: string;
  picture: string;
}

function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const login = () => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      const accessToken = typeof token === 'string' ? token : token?.token;
      if (chrome.runtime.lastError || !accessToken) {
        console.error(chrome.runtime.lastError);
        return;
      }

      fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`)
        .then((response) => response.json())
        .then((data: UserInfo) => {
          setUserInfo(data);
          chrome.storage.sync.set({ userInfo: data });
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
        });
    });
  };

  const logout = () => {
    chrome.identity.getAuthToken({ interactive: false }, (token) => {
      const accessToken = typeof token === 'string' ? token : token?.token;
      if (accessToken) {
        chrome.identity.removeCachedAuthToken({ token: accessToken }, () => {
          setUserInfo(null);
          chrome.storage.sync.remove('userInfo');
        });
      }
    });
  };

  useEffect(() => {
    chrome.storage.sync.get('userInfo', (data: { userInfo?: UserInfo }) => {
      if (data.userInfo) {
        setUserInfo(data.userInfo);
      }
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chrome Extension Boilerplate</h1>
        {userInfo ? (
          <div>
            <p>Welcome, {userInfo.name}</p>
            <p>{userInfo.email}</p>
            <img src={userInfo.picture} alt="User profile" />
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <button onClick={login}>Login with Google</button>
        )}
      </header>
    </div>
  );
}

export default App;
