"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { getUserFromToken } from "../(auth)/_actions";
import { UserRestrictedType } from "../_utils/db/prismaTypes";
import useSessionStorage from "../hooks/useSessionStorage";

type UserContextType = {
  user: UserRestrictedType;
  setUser: (user: UserRestrictedType | null) => void;
  refreshUser: () => Promise<void>; // Function to refresh user data
  tokenExpiry: string | null;
  setTokenExpiry: (tokenExpiry: string | null) => void;
};

const UserContext = createContext({} as UserContextType);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useSessionStorage<UserRestrictedType | null>(
    "user",
    null
  );
  const [tokenExpiry, setTokenExpiry] = useSessionStorage<string | null>(
    "tokenExpiry",
    null
  );

  //   // Fetch the user on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserFromToken();
        if (!userData?.user) {
          setUser(null);
          setTokenExpiry(null);
          return;
        }
        setUser(userData.user);
        setTokenExpiry(userData.tokenExpiry || null);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error: unknown) {
        setUser(null);
        setTokenExpiry(null);
      }
    };

    fetchUser();
  }, [setUser, setTokenExpiry]);

  // Function to refresh user data (e.g., after editing)
  const refreshUser = useCallback(async () => {
    const updatedUser = await getUserFromToken();
    if (!updatedUser?.user) {
      setUser(null);
      setTokenExpiry(null);
      return;
    }
    setUser(updatedUser.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    user: user as UserRestrictedType,
    setUser,
    refreshUser,
    tokenExpiry,
    setTokenExpiry,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};
