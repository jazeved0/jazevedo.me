import React, { useEffect, useState } from "react";

type HashLocationContextValue = string;

export const HashLocationContext =
  React.createContext<HashLocationContextValue>("");

type HashLocationProviderProps = {
  children: React.ReactNode;
};

/**
 * Context provider for the current hash location.
 */
export default function HashLocationProvider({
  children,
}: HashLocationProviderProps): React.ReactElement {
  const [hash, setHash] = useState<string>(() => window.location.hash);

  useEffect(() => {
    const handleHashChange = (): void => {
      setHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <HashLocationContext.Provider value={hash}>
      {children}
    </HashLocationContext.Provider>
  );
}
