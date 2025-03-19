"use client";

import React, { useState } from 'react';

export interface QuizOption {
  text: string;
  isCorrect?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  multipleAnswers?: boolean;
  explanation?: string;
}

interface ModuleQuizProps {
  question: QuizQuestion;
  onSubmit?: (selectedOptions: number[]) => void;
}

const ModuleQuiz: React.FC<ModuleQuizProps> = ({ question, onSubmit }) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  
  const handleOptionToggle = (index: number) => {
    if (question.multipleAnswers) {
      // For multiple answer questions
      if (selectedOptions.includes(index)) {
        setSelectedOptions(selectedOptions.filter(i => i !== index));
      } else {
        setSelectedOptions([...selectedOptions, index]);
      }
    } else {
      // For single answer questions
      setSelectedOptions([index]);
    }
  };
  
  const handleSubmit = () => {
    setSubmitted(true);
    if (onSubmit) {
      onSubmit(selectedOptions);
    }
  };
  
  // Determine if an option is correct (if submitted) or selected
  const isOptionSelected = (index: number) => {
    return selectedOptions.includes(index);
  };
  
  return (
    <div className="quiz-container my-8 w-full" style={{ maxWidth: '100%' }}>
      <div className="p-4 sm:p-6">
        <h3 className="text-xl font-medium mb-4">{question.question}</h3>
        
        <p className="text-gray-700 mb-4">
          {question.multipleAnswers ? 'Choose multiple answers' : 'Choose an answer'}
        </p>
        
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <div 
              key={index}
              className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                submitted 
                  ? isOptionSelected(index) && option.isCorrect 
                    ? 'border-green-200' 
                    : 'border-gray-200'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => !submitted && handleOptionToggle(index)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  {submitted && isOptionSelected(index) ? (
                    <div className={`w-6 h-6 flex items-center justify-center rounded ${
                      option.isCorrect ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className={`w-6 h-6 flex items-center justify-center border rounded ${
                      isOptionSelected(index) 
                        ? 'bg-primary border-primary' 
                        : 'border-gray-300'
                    }`}>
                      {isOptionSelected(index) && (
                        <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-gray-800">{option.text}</div>
              </div>
            </div>
          ))}
        </div>
        
        {!submitted ? (
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={selectedOptions.length === 0}
              className="w-full py-3 px-4 bg-black text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 font-medium rounded-lg text-center transition-colors"
            >
              Confirm answer
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 bg-black text-white hover:bg-gray-800 font-medium rounded-lg text-center transition-colors"
            >
              Start quiz from beginning
            </button>
          </div>
        )}
        
        {submitted && question.explanation && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">{question.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleQuiz; 