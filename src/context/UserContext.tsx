"use client";

import { isTokenExpired } from "@/tokenUtil";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { notificationMessagesType, selectedTasksType, UserContextType, UserData } from "./interface.types";

// Add refreshUser to the context type definition if it's not already there in interface.types.ts
// If you can't edit interface.types, you can cast it here, but ideally add it there.

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserData | null>(null);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loader, setloader] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<selectedTasksType[]>(
    [],
  );
  // Initialize notifications from localStorage or default
  const [notificationMessages, setnotificationMessages] = useState<
    notificationMessagesType[]
  >(() => {
    if (typeof window !== 'undefined') {
      const savedNotifications = localStorage.getItem('gameNotifications');
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          console.warn('Failed to parse saved notifications:', e);
        }
      }
    }
    return [
    {
      message: "Welcome to the game",
      isPositive: true,
    },
    ];
  });
  const [elonStep, setElonStep] = useState<number | null>(0);
  const [turnAmount, setTurnAmount] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [userLoaded, setUserLoaded] = useState(false);
  const [HeaderDark, setHeaderDark] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("");

  const router = useRouter();

  // ✅ NEW: Function to fetch fresh user data from DB
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;
    
    try {

       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { 
         headers: { token } 
       });
       if(res.ok) {
         const data = await res.json();
         setUser(data);
       }
    } catch (error) {
      console.error("Failed to refresh user", error);
    }
  }, []);


  
  useEffect(() => {
    const storedToken = localStorage.getItem("userToken");
    const storedUser = localStorage.getItem("userData");

    if (storedToken && isTokenExpired(storedToken)) {
      // Auto logout if token expired
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      setUserState(null);
      toast.warn("Session expired. Please sign in again.");
      router.push("/auth/signin");
    } else if (storedUser && storedToken) {
      setUserState(JSON.parse(storedUser));
    }

    setUserLoaded(true);
  }, [router]);

  // Persist notifications to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && notificationMessages.length > 0) {
      localStorage.setItem('gameNotifications', JSON.stringify(notificationMessages));
    }
  }, [notificationMessages]);

  // const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (
      !user ||
      user.salaries === undefined ||
      user.rent === undefined ||
      user.metrics?.contributionMargin === undefined
    ) {
      setTurnAmount("");
      return;
    }

    // Always subtract absolute value of contribution margin
    const value = Math.floor(
      -user.salaries +
        -user.rent +
        Math.floor(Math.abs(user.metrics.contributionMargin)),
    );
    const sign = value < 0 ? "-" : "+";
    setTurnAmount(`${sign}${Math.abs(value)}`);
  }, [user]);

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("userData");
  //   if (storedUser) {
  //     setUserState(JSON.parse(storedUser));
  //   }
  // }, []);

  // Custom setUser function to store in localStorage
  const setUser = (userData: UserData | null) => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
      setUserState(userData);
    } else {
      // If resetting, retrieve user from localStorage
      const storedUser = localStorage.getItem("userData");
      if (storedUser) {
        setUserState(JSON.parse(storedUser));
      } else {
        setUserState(null);
        localStorage.removeItem("userData");
      }
    }
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem("userData");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,
        setUserState,
        task,
        setTask,
        loader,
        setloader,
        notificationMessages,
        setnotificationMessages,
        turnAmount,
        setTurnAmount,
        selectedTaskIds,
        setSelectedTaskIds,
        modalOpen,
        setModalOpen,
        userLoaded,
        HeaderDark,
        setHeaderDark,
        loaderMessage,
        setLoaderMessage,
        elonStep,
        setElonStep,
        refreshUser, // ✅ Expose this
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
