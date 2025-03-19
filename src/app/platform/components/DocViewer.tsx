"use client";

import React, { useEffect, useRef, useState } from 'react';
import { renderAsync } from 'docx-preview';
import './DocViewer.css'; // Import the CSS overrides

interface DocViewerProps {
  docFile: string;
  width?: number; // Optional width for document container
}

const DocViewer: React.FC<DocViewerProps> = ({ docFile, width = 750 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDocument = async () => {
      if (!containerRef.current) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the DOCX file
        const response = await fetch(docFile);
        
        if (!response.ok) {
          throw new Error(`Failed to load document: ${response.statusText}`);
        }
        
        // Get the file content as ArrayBuffer
        const buffer = await response.arrayBuffer();
        
        // Add styles to override docx-preview defaults while preserving text layout
        const style = document.createElement('style');
        style.innerHTML = `
          .docx-viewer {
            background-color: white !important;
            padding: 20px !important;
            font-family: var(--font-sans), system-ui, sans-serif !important;
          }
          
          /* Keep fixed width content for consistent text layout - letter format */
          .docx-viewer .document-container {
            background-color: white !important;
            width: ${width}px !important; /* Letter format width */
            margin: 0 auto !important;
          }
          
          /* Letter format page styling */
          .docx-viewer-page {
            background-color: white !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 auto !important;
            padding: 0 !important;
            /* Ensure letter format aspect ratio */
            width: ${width}px !important;
            max-width: 100% !important;
          }
          
          .docx-viewer-inner {
            background-color: white !important;
            padding: 0 !important;
          }
          
          .docx-wrapper {
            background-color: white !important;
            padding: 0 !important;
          }
          
          .page-container {
            background-color: white !important;
            box-shadow: none !important;
            border: none !important;
            margin: 10px auto !important;
            padding: 0 !important;
            /* Letter format dimensions */
            width: ${width}px !important;
            max-width: 100% !important;
          }
          
          .docx {
            background-color: white !important;
          }
          
          /* Preserve text styling but use system fonts */
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
            white-space: pre-wrap !important; /* Preserve spaces and line breaks */
          }
          
          /* Make sure the container is scrollable horizontally if needed */
          .doc-viewer-container {
            overflow-x: auto !important;
            width: 100% !important;
          }
        `;
        document.head.appendChild(style);
        
        // Render the document in the container with options to preserve content layout
        await renderAsync(buffer, containerRef.current, containerRef.current, {
          className: 'docx-viewer',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreFonts: false,
          breakPages: true,
          renderHeaders: true,
          useBase64URL: true
        });
        
        // After rendering, ensure consistent styling while preserving text layout
        setTimeout(() => {
          if (containerRef.current) {
            // Target the document container directly to set fixed width
            const documentContainer = containerRef.current.querySelector('.docx-viewer > div');
            if (documentContainer) {
              (documentContainer as HTMLElement).style.backgroundColor = 'white';
              (documentContainer as HTMLElement).style.width = `${width}px`;
              (documentContainer as HTMLElement).style.margin = '0 auto';
              (documentContainer as HTMLElement).style.border = 'none';
              (documentContainer as HTMLElement).style.boxShadow = 'none';
            }
            
            // Ensure all paragraph elements have fixed width to maintain exact same line breaks
            const paragraphs = containerRef.current.querySelectorAll('p');
            paragraphs.forEach(p => {
              (p as HTMLElement).style.width = '100%';
              (p as HTMLElement).style.maxWidth = '100%';
              (p as HTMLElement).style.boxSizing = 'border-box';
              (p as HTMLElement).style.whiteSpace = 'pre-wrap';
              (p as HTMLElement).style.overflowWrap = 'normal';
              (p as HTMLElement).style.wordBreak = 'keep-all';
            });
            
            // Find all elements with background that's not white and change it
            const elements = containerRef.current.querySelectorAll('*');
            elements.forEach(el => {
              const element = el as HTMLElement;
              const computedStyle = window.getComputedStyle(element);
              const bgColor = computedStyle.backgroundColor;
              
              // If the background color is not white or transparent, set it to white
              if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'rgb(255, 255, 255)') {
                element.style.backgroundColor = 'white';
              }
              
              // Apply system fonts without changing text positioning
              if (element.tagName.match(/^(P|SPAN|DIV|H[1-6]|TD|TH|LI)$/i)) {
                element.style.fontFamily = 'var(--font-sans), system-ui, sans-serif';
              }
            });
          }
        }, 100);
        
        setLoading(false);
      } catch (err) {
        console.error('Error rendering document:', err);
        setError(err instanceof Error ? err.message : 'Failed to load document');
        setLoading(false);
      }
    };
    
    renderDocument();
  }, [docFile, width]);

  return (
    <div className="doc-viewer-container" style={{ backgroundColor: 'white', padding: '10px', width: '100%', overflowX: 'auto' }}>
      {loading && (
        <div className="flex h-64 w-full items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p>Loading document...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="flex h-64 w-full items-center justify-center">
          <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
            <p className="mb-2 text-lg font-semibold">Document Error</p>
            <p>{error}</p>
            <p className="mt-2 text-sm">Please check if the document exists and try again.</p>
          </div>
        </div>
      )}
      
      <div 
        ref={containerRef} 
        className="docx-container"
        style={{ 
          display: loading || error ? 'none' : 'block',
          minHeight: '500px',
          backgroundColor: 'white',
          border: 'none',
          padding: '0',
          margin: '0 auto',
          width: '100%'
        }}
      ></div>
    </div>
  );
};

export default DocViewer; 