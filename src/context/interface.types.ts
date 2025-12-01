export interface  Metrics {
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
export interface  availableemployees {
  _id: string;
  roleName: string;
  salary: number;
}
export interface  aiSkinnedEmployees {
  roleName: string;
  salary: number;
  actualName? : string;
}
export interface  employeesAvailable {
  _id: string;
  stage: string;
  maximum_allowed_employess: number;
  availableEmployes: availableemployees[];
}
export interface  financesBreakdown {
  Founder: number; // Uppercase matches API response
  Investors: number;
  Mentor: number;
}
export interface  Employee {
  _id: string;
  roleName: string;
  salary: number;
  quantity: number;
}
export interface  userGameType {
  gameId: string;
  gameName: string;
}
export  interface  UserData {
  finances: number;
  metrics: Metrics;
  startupStage: string;
  completedTasks: any[];
  token: string;
  username: string;
  revenue: number;
  marketing: number;
  salaries: number;
  costOfSales: number;
  rent: number;
  teamMembers: Employee[];
  gameId: string;
  availableInvestments: any[];
  investmentsMade: any[];
  employeesAvailable: employeesAvailable[];
  financesBreakdown: financesBreakdown;
  mentorsAvailable: any[];
  tasks: any[];
  bugPercentage: number;
  myMentors: any[];
  turnNumber: number;
  userGames: userGameType[];
  lastRequestMade: string;
  isAiCustomizationDone: boolean;
  gameName: string;
  businessDescription: string;
  credits: number;
  preventBug: boolean;
  hint?: string;
  notEnoughCredits: boolean;
  isPurchaseDone: boolean;
  aiSkinnedEmployees : aiSkinnedEmployees[];
}
export interface  notificationMessagesType {
  message: string;
  isPositive: boolean;
}
export interface  selectedTasksType {
  taskId?: string;
  bugId?: string;
}

export interface  UserContextType {
  user: UserData | null;
  setUser: (userData: UserData | null) => void;
  logout: () => void;
  setUserState: (userData: UserData | null) => void;
  task: string;
  setTask: (taskID: string) => void;
  loader: boolean;
  notificationMessages: notificationMessagesType[];
  setnotificationMessages: (
    newNotficationArray: notificationMessagesType[],
  ) => void;
  setloader: (loaderShow: boolean) => void;
  turnAmount: string;
  setTurnAmount: (trunAmount: string) => void;
  selectedTaskIds: selectedTasksType[];
  setSelectedTaskIds: React.Dispatch<React.SetStateAction<selectedTasksType[]>>;
  modalOpen: boolean;
  setModalOpen: (arg: boolean) => void;
  userLoaded: boolean;
  HeaderDark: boolean;
  setHeaderDark: (arg: boolean) => void;
  loaderMessage: string;
  setLoaderMessage: (msg: string) => void;
  elonStep: number | null;
  setElonStep: (step: number | null) => void;
}