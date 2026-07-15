import { createContext, useContext, useEffect, useState } from "react";

const AccountContext = createContext(null);
const STORAGE_KEY = "silent-earth-account";

export function AccountProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // On first mount, check localStorage for an existing account so
  // the user is never asked to "log in" again on this device.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAccount(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  function saveAccount({ name, mobileNumber }) {
    const data = { name, mobileNumber };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setAccount(data);
  }

  function updateName(name) {
    setAccount((prev) => {
      const updated = { ...prev, name };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <AccountContext.Provider value={{ account, saveAccount, updateName, isLoaded }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within AccountProvider");
  return ctx;
}
