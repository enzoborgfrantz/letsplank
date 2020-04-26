import React, { useState, useEffect, useContext, createContext } from "react";

import { useGoogleApi } from "./useGoogleApi";

interface UserProfile {
  name: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl: string;
  email: string;
  id: string;
}

interface GoogleAuth {
  signIn?: () => Promise<UserProfile | undefined>;
  signOut?: () => void;
  userProfile?: UserProfile;
  isUserAuthenticated: boolean;
}

const googleAuthContext = createContext<GoogleAuth>({
  isUserAuthenticated: false,
});

const useGoogleAuthProvider = () => {
  const googleApi = useGoogleApi();
  const { isGoogleApiReady } = googleApi;
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>();

  const authenticateUser = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    const isSignedIn = auth2.isSignedIn.get();
    setIsUserAuthenticated(isSignedIn);

    if (!isSignedIn) {
      return;
    }

    const user = auth2.currentUser.get();
    const profile = user.getBasicProfile();

    const userProfile: UserProfile = {
      name: profile.getName(),
      firstName: profile.getGivenName(),
      lastName: profile.getFamilyName(),
      profilePhotoUrl: profile.getImageUrl(),
      email: profile.getEmail(),
      id: profile.getId(),
    };
    setUserProfile(userProfile);
    return userProfile;
  };

  const signIn = async () =>
    window.gapi.auth2.getAuthInstance().signIn().then(authenticateUser);

  const signOut = () => {
    window.gapi.auth2
      .getAuthInstance()
      .signOut()
      .then(() => {
        setUserProfile(undefined);
        setIsUserAuthenticated(false);
      });
  };

  useEffect(() => {
    if (isGoogleApiReady && !isUserAuthenticated) {
      authenticateUser();
    }
  }, [isGoogleApiReady, isUserAuthenticated]);

  const googleAuth: GoogleAuth = {
    ...googleApi,
    isUserAuthenticated,
    userProfile,
    signIn,
    signOut,
  };

  return googleAuth;
};

export const GoogleAuthProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const googleAuth = useGoogleAuthProvider();
  return (
    <googleAuthContext.Provider value={googleAuth}>
      {children}
    </googleAuthContext.Provider>
  );
};

export const useGoogleAuth = () => {
  return useContext<GoogleAuth>(googleAuthContext);
};
