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
interface availableemployees{
  _id : string ;
  roleName : string;
  salary : number
}
interface employeesAvailable{
  _id: string;
  stage :string;
  maximum_allowed_employess: number;
  availableEmployes : availableemployees[]
}
interface financesBreakdown {
  Founder: number;  // Uppercase matches API response
  Investors: number;
  Mentor: number;
}
interface Employee {
  _id: string;
  roleName: string;
  salary: number;
  quantity: number;
}
export interface UserData {
  finances: number;
  metrics: Metrics;
  startupStage: string;
  completedTasks: any[];
  token: string;
  username: string;
  revenue : number;
  marketing : number;
  salaries : number;
  costOfSales  : number;
  rent  : number;
  teamMembers: Employee[];
  gameId: string;
  availableInvestments : any[];
  investmentsMade: any[];
  employeesAvailable: employeesAvailable[]; 
  financesBreakdown : financesBreakdown;
  mentorsAvailable: any[];
  tasks : any[];
  bugPercentage : number;
  myMentors : any[]
  turnNumber: number; 
}
interface notificationMessagesType{
  message: string;
  isPositive: boolean;
}
interface selectedTasksType {
  taskId ? : string;
  bugId ? : string;
}

interface UserContextType {
  user: UserData | null;
  setUser: (userData: UserData | null) => void;
  logout: () => void;
  setUserState : (userData: UserData | null) => void;
  task : string
  setTask  : (taskID : string) => void 
  loader : boolean
  notificationMessages : notificationMessagesType[] ;
  setnotificationMessages  : (newNotficationArray : notificationMessagesType[])=> void   ; 
  setloader : (loaderShow : boolean) => void
  turnAmount  : string, 
  setTurnAmount : (trunAmount : string) => void
  selectedTaskIds: selectedTasksType[];
  setSelectedTaskIds: React.Dispatch<React.SetStateAction<selectedTasksType[]>>;
  modalOpen : boolean;
  setModalOpen: (arg: boolean) => void;
  userLoaded: boolean; 
  HeaderDark : boolean;
  setHeaderDark : (arg: boolean) => void;
}


const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserData | null>(null);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loader, setloader] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<selectedTasksType[]>([]);
  const [notificationMessages, setnotificationMessages] = useState<notificationMessagesType[]>([
      {
        message: "Welcome to the game",
        isPositive: true
      }
    ])
    const [turnAmount, setTurnAmount] = useState<string>("");
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [userLoaded, setUserLoaded] = useState(false);
    const [HeaderDark, setHeaderDark] = useState(false);

    useEffect(() => {
      const storedUser = localStorage.getItem("userData");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserState(parsedUser);
      }
      setUserLoaded(true);
    }, []);

    // const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
    
    useEffect(() => {
      if (
        !user ||
        user.salaries === undefined ||
        user.rent === undefined ||
        !user.metrics?.contributionMargin
      ) {
        setTurnAmount("");
        return;
      }
    
      const value = Math.floor(((-user.salaries) + (-user.rent)) - user.metrics.contributionMargin);
      const sign = value < 0 ? '-' : '+';
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
      setHeaderDark
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
