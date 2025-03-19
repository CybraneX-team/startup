import { QuizQuestion } from "../../components/ModuleQuiz";
// We'll use dynamic import for mammoth to avoid issues with SSR
// import mammoth from "mammoth";

/**
 * Extracts quiz questions from a DOCX file.
 * 
 * This function attempts to identify quiz sections in a DOCX file by looking for specific
 * patterns that indicate a quiz question, such as headers containing "quiz", question text,
 * and options (typically in a list format).
 */
export async function extractQuizFromDocx(docxPath: string): Promise<QuizQuestion[]> {
  try {
    // Dynamically import mammoth to avoid SSR issues
    const mammoth = await import('mammoth');

    // Fetch the DOCX file
    const response = await fetch(docxPath);
    if (!response.ok) {
      throw new Error(`Failed to load document: ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();
    
    // Convert DOCX to HTML
    const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
    const html = result.value;
    
    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const questions: QuizQuestion[] = [];
    
    // Look for quiz sections (this is a simple implementation and may need refinement)
    // For example, we might look for headers containing "quiz", followed by p elements with questions
    const headers = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      if (header.textContent?.toLowerCase().includes('quiz')) {
        // Found a quiz section, try to extract the question
        let currentElement = header.nextElementSibling;
        
        while (currentElement && !currentElement.tagName.match(/^H[1-6]$/)) {
          // Check if this element contains a question
          if (currentElement.textContent?.includes('?')) {
            const questionText = currentElement.textContent.trim();
            const options: { text: string, isCorrect?: boolean }[] = [];
            
            // Look for list items which might be options
            let listElement = currentElement.nextElementSibling;
            while (listElement && (listElement.tagName === 'UL' || listElement.tagName === 'OL')) {
              const listItems = listElement.querySelectorAll('li');
              listItems.forEach(item => {
                const optionText = item.textContent?.trim() || '';
                // Check if the option text indicates it's correct
                const isCorrect = detectCorrectAnswer(optionText);
                // Remove the (Correct) indicator from the text for display
                const cleanedText = removeCorrectMarker(optionText);
                
                options.push({ 
                  text: cleanedText,
                  isCorrect 
                });
              });
              listElement = listElement.nextElementSibling;
            }
            
            if (options.length > 0) {
              // Detect if it's a multiple choice question
              const multipleAnswers = questionText.toLowerCase().includes('multiple answers') || 
                                     questionText.toLowerCase().includes('choose multiple');
              
              questions.push({
                question: questionText,
                options,
                multipleAnswers
              });
            }
          }
          
          currentElement = currentElement.nextElementSibling;
        }
      }
    }
    
    return questions;
  } catch (error) {
    console.error('Error extracting quiz from DOCX:', error);
    return [];
  }
}

/**
 * Detects if an option is marked as correct in the text
 * @param optionText The text of the option
 * @returns Whether the option is marked as correct
 */
function detectCorrectAnswer(optionText: string): boolean {
  return optionText.toLowerCase().includes('(correct)') || 
         optionText.toLowerCase().includes('(right)') ||
         optionText.toLowerCase().includes('(true)') ||
         optionText.endsWith('✓') ||
         optionText.endsWith('✔️');
}

/**
 * Removes any markers indicating a correct answer from the option text
 * @param optionText The text of the option
 * @returns The cleaned text without correct markers
 */
function removeCorrectMarker(optionText: string): string {
  return optionText
    .replace(/\s*\(correct\)\s*$/i, '')
    .replace(/\s*\(right\)\s*$/i, '')
    .replace(/\s*\(true\)\s*$/i, '')
    .replace(/\s*✓\s*$/, '')
    .replace(/\s*✔️\s*$/, '')
    .trim();
}

/**
 * Helper function to format DOCX content for quiz extraction
 * 
 * This function provides guidance on how to structure your DOCX files so that
 * quizzes can be extracted automatically.
 */
export function formatDocForQuizExtraction(): string {
  return `
To ensure quizzes can be extracted from your DOCX files, follow these formatting guidelines:

1. Create a section with a heading that includes the word "Quiz" (e.g., "Module Quiz", "Quiz Section")
2. Each question should be in a paragraph ending with a question mark (?)
3. For multiple choice questions, add "Choose multiple answers" in the question text
4. Options should be in a list (bulleted or numbered) immediately following the question
5. For correct answers, you can add "(Correct)" at the end of the option, which will be used in future enhancements

Example structure:
----------------
## Module Quiz

How does unit economics empower you to make strategic decisions? Choose multiple answers.
- Evaluate whether a new business can be profitable and ascertain the lowest cost of production. (Correct)
- Confirm that business growth leads to increased profitability rather than merely amplifying losses. (Correct)
- Develop a comprehensive advertising strategy to ensure profitability across various channels.
- Enhance understanding of the revenue each customer contributes, with potential for improvement. (Correct)
- Illustrate to potential investors how increased sales could elevate profits. (Correct)
- Calculate the effects of external economic fluctuations on the company.

Which metrics help determine if your business model is sustainable?
- CAC to LTV ratio greater than 3:1 (Correct)
- Social media engagement rates
- Number of employees
- Website traffic volume
----------------

The extraction algorithm will identify the questions and options based on this structure.
`;
}

/**
 * This is a more practical approach that would work with specially formatted DOCX files
 * where quiz content follows a specific structure that you define.
 * 
 * For example, you could have a section with a heading "QUIZ" followed by structured content:
 * - Question: [question text]
 * - Option: [option text] (Correct)
 * - Option: [option text]
 */
export async function extractStructuredQuizFromDocx(docxPath: string): Promise<QuizQuestion[]> {
  try {
    // Similar implementation to the above, but with more specific parsing rules
    // This would depend on how you structure your DOCX files
    
    // For demonstration purposes, we're returning an empty array
    return [];
  } catch (error) {
    console.error('Error extracting structured quiz from DOCX:', error);
    return [];
  }
} 