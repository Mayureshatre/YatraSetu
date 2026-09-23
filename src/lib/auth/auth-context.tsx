"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/db/supabase";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  label: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  locationPermission: "prompt" | "granted" | "denied";
  userLocation: UserLocation | null;
  showLocationModal: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  requestLocationPermission: () => Promise<boolean>;
  setManualLocation: (location: UserLocation) => void;
  closeLocationModal: () => void;
  dismissLocationPrompt: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEFAULT_USER: UserProfile = {
  id: "auth-traveler-01",
  email: "traveler@yatrasetu.org",
  name: "Aarav Sharma",
  avatar_url:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
};

// Default Central Indian Planning Anchor (Bhopal, MP)
export const DEFAULT_LOCATION: UserLocation = {
  latitude: 23.2599,
  longitude: 77.4126,
  label: "Bhopal, Madhya Pradesh",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState<
    "prompt" | "granted" | "denied"
  >("prompt");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    // Check local storage for persistent session simulation
    const savedUser = localStorage.getItem("yatrasetu_user");
    const savedLoc = localStorage.getItem("yatrasetu_location");
    const savedPerm = localStorage.getItem("yatrasetu_loc_perm") as any;

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedLoc) {
      setUserLocation(JSON.parse(savedLoc));
    }
    if (savedPerm) {
      setLocationPermission(savedPerm);
    }

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const u: UserProfile = {
            id: session.user.id,
            email: session.user.email || "",
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              "Traveler",
            avatar_url:
              session.user.user_metadata?.avatar_url ||
              session.user.user_metadata?.picture ||
              null,
          };
          setUser(u);
        }
        setIsLoading(false);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user) {
            const u: UserProfile = {
              id: session.user.id,
              email: session.user.email || "",
              name:
                session.user.user_metadata?.full_name ||
                session.user.user_metadata?.name ||
                "Traveler",
              avatar_url:
                session.user.user_metadata?.avatar_url ||
                session.user.user_metadata?.picture ||
                null,
            };
            setUser(u);
            if (
              _event === "SIGNED_IN" &&
              !localStorage.getItem("yatrasetu_location")
            ) {
              setShowLocationModal(true);
            }
          } else {
            setUser(null);
          }
        },
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    if (supabase) {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/trip`,
        },
      });
      return;
    }

    // Interactive Demo / Local Mode Sign In
    setUser(DEFAULT_USER);
    localStorage.setItem("yatrasetu_user", JSON.stringify(DEFAULT_USER));
    setShowLocationModal(true); // Trigger immediate location modal post-login (PRD-002)
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem("yatrasetu_user");
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationPermission("denied");
        setUserLocation(DEFAULT_LOCATION);
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: UserLocation = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            label: `Current GPS Location (${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°)`,
          };
          setLocationPermission("granted");
          setUserLocation(loc);
          localStorage.setItem("yatrasetu_location", JSON.stringify(loc));
          localStorage.setItem("yatrasetu_loc_perm", "granted");
          setShowLocationModal(false);
          resolve(true);
        },
        (_err) => {
          setLocationPermission("denied");
          setUserLocation(DEFAULT_LOCATION);
          localStorage.setItem(
            "yatrasetu_location",
            JSON.stringify(DEFAULT_LOCATION),
          );
          localStorage.setItem("yatrasetu_loc_perm", "denied");
          setShowLocationModal(false);
          resolve(false);
        },
        { timeout: 8000, enableHighAccuracy: true },
      );
    });
  };

  const setManualLocation = (loc: UserLocation) => {
    setUserLocation(loc);
    localStorage.setItem("yatrasetu_location", JSON.stringify(loc));
    setShowLocationModal(false);
  };

  const closeLocationModal = () => {
    setShowLocationModal(false);
  };

  const dismissLocationPrompt = () => {
    setLocationPermission("denied");
    if (!userLocation) {
      setUserLocation(DEFAULT_LOCATION);
    }
    setShowLocationModal(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        locationPermission,
        userLocation,
        showLocationModal,
        signInWithGoogle,
        signOut,
        requestLocationPermission,
        setManualLocation,
        closeLocationModal,
        dismissLocationPrompt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
