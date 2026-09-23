"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.AuthProvider = AuthProvider;
exports.DEFAULT_USER = exports.DEFAULT_LOCATION = void 0;
exports.useAuth = useAuth;
var _react = _interopRequireWildcard(require("react"));
var _supabase = require("@/lib/db/supabase");
function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}
const AuthContext = /*#__PURE__*/ (0, _react.createContext)(undefined);
const DEFAULT_USER = {
  id: "auth-traveler-01",
  email: "traveler@yatrasetu.org",
  name: "Aarav Sharma",
  avatar_url:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
};

// Default Central Indian Planning Anchor (Bhopal, MP)
exports.DEFAULT_USER = DEFAULT_USER;
const DEFAULT_LOCATION = {
  latitude: 23.2599,
  longitude: 77.4126,
  label: "Bhopal, Madhya Pradesh",
};
exports.DEFAULT_LOCATION = DEFAULT_LOCATION;
function AuthProvider({ children }) {
  const [user, setUser] = (0, _react.useState)(null);
  const [isLoading, setIsLoading] = (0, _react.useState)(true);
  const [locationPermission, setLocationPermission] = (0, _react.useState)(
    "prompt",
  );
  const [userLocation, setUserLocation] = (0, _react.useState)(null);
  const [showLocationModal, setShowLocationModal] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    // Check local storage for persistent session simulation
    const savedUser = localStorage.getItem("yatrasetu_user");
    const savedLoc = localStorage.getItem("yatrasetu_location");
    const savedPerm = localStorage.getItem("yatrasetu_loc_perm");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedLoc) {
      setUserLocation(JSON.parse(savedLoc));
    }
    if (savedPerm) {
      setLocationPermission(savedPerm);
    }
    if (_supabase.supabase) {
      _supabase.supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const u = {
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
      const { data: authListener } = _supabase.supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user) {
            const u = {
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
            setShowLocationModal(true);
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
    if (_supabase.supabase) {
      await _supabase.supabase.auth.signInWithOAuth({
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
    if (_supabase.supabase) {
      await _supabase.supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem("yatrasetu_user");
  };
  const requestLocationPermission = async () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationPermission("denied");
        setUserLocation(DEFAULT_LOCATION);
        resolve(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
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
        {
          timeout: 8000,
          enableHighAccuracy: true,
        },
      );
    });
  };
  const setManualLocation = (loc) => {
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
  return /*#__PURE__*/ _react.default.createElement(
    AuthContext.Provider,
    {
      value: {
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
      },
    },
    children,
  );
}
function useAuth() {
  const context = (0, _react.useContext)(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
