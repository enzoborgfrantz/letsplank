import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { useGoogleApi } from "../../shared/hooks/useGoogleApi";
import { useOnClickOutside } from "../../shared/hooks/useOnClickOutside";
import { useGoogleAuth } from "../../shared/hooks";

const UserProfile = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
`;

const ProfilePicture = styled.img`
  border-radius: 8px;
  width: 50px;
  height: 50px;
`;

const UserName = styled.span`
  color: white;
  font-family: monospace;
  margin-left: 8px;
  margin-right: 4px;
  color: white;
  font-family: Questrial;
`;

interface ProfileMenuProps {
  profilePhotoUrl: string;
  firstName: string;
  signOut: (() => void) | undefined;
}

const Menu = styled.div`
  color: white;
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 4px;
  background-color: #1a1f40;
  border-radius: 8px;
  padding: 5px 10px;
  z-index: 1;
`;

const Button = styled.button`
  color: white;
  display: flex;
  width: 100%;
  white-space: nowrap;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 5px 10px;
`;

const ProfileMenu = ({
  profilePhotoUrl,
  firstName,
  signOut,
}: ProfileMenuProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const ref = useRef() as React.MutableRefObject<HTMLElement>;
  useOnClickOutside(ref, () => setShowMenu(false));

  return (
    <>
      <UserProfile
        // @ts-ignore
        ref={ref}
        onClick={() => setShowMenu(true)}
      >
        <ProfilePicture src={profilePhotoUrl} />
        {/* <UserName>{firstName}</UserName> */}
        {showMenu && (
          <Menu>
            <Button onClick={signOut}>Sign out</Button>
          </Menu>
        )}
      </UserProfile>
    </>
  );
};

export const Profile = () => {
  const { isGoogleApiReady } = useGoogleApi();
  const { isUserAuthenticated, userProfile, signIn, signOut } = useGoogleAuth();

  useEffect(() => {
    if (!userProfile) {
      return;
    }

    const { firstName: name, profilePhotoUrl, id } = userProfile;
    fetch("/user", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ name, profilePhotoUrl, id }),
    }).then(console.log);
  }, [userProfile]);

  if (!isGoogleApiReady) {
    // console.log({ isGoogleApiReady });
    return null;
  }

  const authenticate = async () => {
    if (!signIn) {
      return;
    }
    await signIn();
    console.log("signed in");
  };

  return (
    <>
      {isUserAuthenticated ? (
        !userProfile ? null : (
          <ProfileMenu
            profilePhotoUrl={userProfile.profilePhotoUrl}
            firstName={userProfile.firstName}
            signOut={signOut}
          />
        )
      ) : (
        <button onClick={authenticate}>Sign in</button>
      )}
    </>
  );
};
