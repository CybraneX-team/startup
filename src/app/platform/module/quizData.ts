import { QuizQuestion } from "../components/ModuleQuiz";

// Sample quiz questions for different modules
export const moduleQuizzes: Record<string, QuizQuestion[]> = {
  "1": [
    {
      question: "How does unit economics empower you to make strategic decisions?",
      multipleAnswers: true,
      options: [
        {
          text: "Evaluate whether a new business can be profitable and ascertain the lowest cost of production.",
          isCorrect: true
        },
        {
          text: "Confirm that business growth leads to increased profitability rather than merely amplifying losses.",
          isCorrect: true
        },
        {
          text: "Develop a comprehensive advertising strategy to ensure profitability across various channels.",
          isCorrect: false
        },
        {
          text: "Enhance understanding of the revenue each customer contributes, with potential for improvement.",
          isCorrect: true
        },
        {
          text: "Illustrate to potential investors how increased sales could elevate profits.",
          isCorrect: true
        },
        {
          text: "Calculate the effects of external economic fluctuations on the company.",
          isCorrect: false
        }
      ],
      explanation: "Unit economics provides a framework for understanding the fundamental economic viability of your business model by analyzing revenue and costs at the unit level. This empowers strategic decision making by helping evaluate profitability potential, understand customer value, confirm sustainable growth, and communicate with investors."
    }
  ],
  "2": [
    {
      question: "What are the key components of startup unit economics?",
      multipleAnswers: true,
      options: [
        { text: "Customer Acquisition Cost (CAC)", isCorrect: true },
        { text: "Customer Lifetime Value (CLV or LTV)", isCorrect: true },
        { text: "Market Capitalization", isCorrect: false },
        { text: "Contribution Margin", isCorrect: true },
        { text: "Payback Period", isCorrect: true }
      ],
      explanation: "The core components of unit economics for startups include CAC, CLV, and the payback period. Contribution margin is also important as it helps understand the profitability per unit after accounting for variable costs."
    }
  ],
  "3": [
    {
      question: "Which metrics help determine if your business model is sustainable?",
      options: [
        { text: "CAC to LTV ratio greater than 3:1", isCorrect: true },
        { text: "Social media engagement rates", isCorrect: false },
        { text: "Number of employees", isCorrect: false },
        { text: "Website traffic volume", isCorrect: false }
      ],
      explanation: "A CAC to LTV ratio of at least 3:1 is generally considered healthy for most business models, indicating that the value derived from customers substantially exceeds the cost to acquire them."
    }
  ]
};

// Helper function to get quiz questions for a specific module
export const getModuleQuiz = (moduleId: string): QuizQuestion[] => {
  return moduleQuizzes[moduleId] || [];
}; 