"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Metrics {
  userAcquisition: number;
  conversionFirstPurchase: number;
  averageOrderValue: number;
  costOfGoodsSold: number;
  averagePaymentCount: number;
  customerLifetimeValue: number;
  averageRevenuePerUser: number;
  costPerAcquisition: number;
  contributionMargin: number;
  buyerCount: number;
}

interface UserData {
  finances: number;
  metrics: Metrics;
  currentStage: string;
  completedTasks: any[];
  token: string;
  teamMembers: any[]
  gameId: string
  availableInvestments : any[];
  investmentsMade: any[]
}

interface UserContextType {
  user: UserData | null;
  setUser: (userData: UserData | null) => void;
  logout: () => void;
  setUserState : (userData: UserData | null) => void;
  resetTheGame : () => void
  task : string
  setTask  : (taskID : string) => void 
  loader : boolean
  setloader : (loaderShow : boolean) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserData | null>(null);
  const [task, setTask] = useState("");
  const [loader, setloader] = useState(false);
  const [tasklist, settasklist] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
    
  }, []);
  

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
  
  const resetTheGame = async () => {
    try {
      setloader(true);
  
      // Minimum delay to ensure loader visibility
      const delay = (ms:number) => new Promise((resolve) => setTimeout(resolve, ms));
  
      const token = localStorage.getItem("userToken");
      if (!token) {
        alert("User is not authenticated. Please log in.");
        setloader(false); // Reset loader state
        return;
      }
  
      const makeReq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resetGame`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          gameId: user?.gameId,
        }),
      });
  
      if (!makeReq.ok) {
        throw new Error(`Error: ${makeReq.status} - ${makeReq.statusText}`);
      }
  
      const response = await makeReq.json();
  
      if (response.user) {
        console.log("✅ Updating user state with:", response.user);
  
        // Add a delay before updating the state and hiding the loader
        await delay(1000); // Delay for 1 second (adjust as needed)
  
        setUserState({ ...response.user, 
          gameId: response?.gameId, 
          finances: response.finances, 
          availableInvestments : response.availableInvestments 
        });
        setUser({ ...response.user, 
          gameId: response?.gameId, 
          finances: response.finances,
          availableInvestments : response.availableInvestments
         });
        console.log("🟢 State updated with:", response.user);
      }
    } catch (error) {
      console.error("Error resetting game:", error);
      alert("Failed to reset the game. Please try again.");
    } finally {
      setloader(false); // Ensure loader is turned off in all cases
    }
  };
  
  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      logout, 
      setUserState, 
      resetTheGame,
      task,
      setTask,
      loader,
      setloader
      }}>
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
