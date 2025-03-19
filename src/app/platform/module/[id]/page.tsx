"use client";

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import DocViewer from '../../components/DocViewer';
import ModuleQuiz from '../../components/ModuleQuiz';
import { getModuleQuiz } from '../quizData';

// CSS to be injected directly into the page
const inlineStyles = `
  .docx-viewer,
  .docx-viewer *,
  .docx-viewer-page,
  .docx-viewer-inner,
  .docx-wrapper,
  .page-container,
  .document-container,
  .docx-container {
    background-color: white !important;
    box-shadow: none !important;
    border: none !important;
    font-family: var(--font-sans), system-ui, sans-serif !important;
  }
  
  .docx-viewer .document-container {
    width: 750px !important; /* Letter format width */
    margin: 0 auto !important;
  }
  
  /* Add letter format styling */
  .docx-viewer-page {
    width: 750px !important; /* Letter format width */
    max-width: 100% !important;
    margin: 0 auto !important;
    padding: 0 !important;
  }
  
  .docx-viewer p, 
  .docx-viewer span, 
  .docx-viewer div, 
  .docx-viewer h1, 
  .docx-viewer h2, 
  .docx-viewer h3, 
  .docx-viewer h4, 
  .docx-viewer h5, 
  .docx-viewer h6 {
    font-family: var(--font-sans), system-ui, sans-serif !important;
    white-space: pre-wrap !important;
  }
  
  /* Document scroll container */
  .document-scroll-container {
    width: 100%;
    overflow-x: auto;
    background-color: white;
  }
  
  /* Quiz container styling to match document width */
  .module-quiz-container {
    width: 750px !important; /* Letter format width - match document */
    max-width: 100%;
    margin: 0 auto;
    padding: 0;
  }
  
  /* Make sure quiz container is scrollable on small screens */
  .module-quiz-wrapper {
    width: 100%;
    overflow-x: auto;
    background-color: white;
  }
  
  /* Minimize gap between document and quiz */
  .mt-6 {
    margin-top: 1.5rem !important;
  }
`;

export default function ModulePage() {
  const params = useParams();
  const moduleId = params?.id || '1';
  // Ensure we have a string for the module ID
  const moduleIdString = Array.isArray(moduleId) ? moduleId[0] : moduleId;
  const quizQuestions = getModuleQuiz(moduleIdString);

  // Inject CSS directly into the page head when the component mounts
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = inlineStyles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleQuizSubmit = (selectedOptions: number[]) => {
    console.log('Selected options:', selectedOptions);
    // Here you could track progress, save to database, etc.
  };

  // Document width constant - using letter format width
  const documentWidth = 750;

  return (
    <div className="module-content p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Module {moduleIdString}</h1>
      </div>
      
      <div className="flex flex-col items-center">
        {/* Document viewer with horizontal scroll if needed */}
        <div className="document-scroll-container rounded-lg w-full">
          <DocViewer docFile={`/documents/module${moduleIdString}.docx`} width={documentWidth} />
        </div>
        
        {/* Quiz section - using the same width as the document */}
        <div className="module-quiz-wrapper w-full">
          <div className="module-quiz-container">
            <div className="mt-6"> {/* Reduced margin to position quiz closer to document */}
              <h2 className="text-2xl font-bold mb-4">Quiz</h2>
              
              <p className="text-gray-600 mb-6">
                Test your understanding of the concepts covered in this module.
              </p>
              
              {quizQuestions.map((question, index) => (
                <ModuleQuiz 
                  key={index} 
                  question={question} 
                  onSubmit={handleQuizSubmit}
                />
              ))}
              
              {quizQuestions.length === 0 && (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-500">No quiz available for this module.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 