import { createContext, useState } from "react";
import run from "../config/gemini";

// Create a new context that can be used across components
export const Context = createContext();

const ContextProvider = (props) => {
  //necessary functions as useState functions
  const [input, setInput] = useState(""); //no input
  const [recentPrompt, setRecentPrompt] = useState(""); //no current/recent prompt
  const [prevPrompts, setPrevPrompts] = useState([]); //zero previous prompts
  const [showResult, setShowResult] = useState(false); //no showing result
  const [loading, setLoading] = useState(false); //no loading
  const [resultData, setResultData] = useState(""); //empty result data

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord); // prev becomes prev + newWord after a delay of (75 * index) ms
    }, 75 * index); //if  given index 1 -> 75ms delay, for 2, 150ms delay
  };

  // Function to reset the chat, hiding results and stopping the loading state
  const newChat = () => {
    //loading and results, both false as user wants new chat
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    //result initially empty, loading and showing results are becoming true
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if (prompt !== undefined) {
      response = await run(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]); //use spread to create shallow copy of prev arr, adds input, returns modified arr
      setRecentPrompt(input);
      response = await run(input);
    }

    if (response) {
      // Split the response into lines to format bullet points, headings, and paragraphs
      const responseLines = response.split("\n");
      let formattedResponse = "";

      responseLines.forEach((line) => {
        // Check if the line is a heading (starts with '##')
        if (line.trim().startsWith("##")) {
          // Format headings with both underline and bold
          const cleanLine = line.replace(/^##\s*/, "").trim(); //replace the hashtags with empty space
          formattedResponse += `<h3><strong><u>${cleanLine}</u></strong></h3>`;
        } else {
          // Check if the line has bold text (i.e., contains '**' markers)
          const boldTextRegex = /\*\*(.*?)\*\*/g;
          line = line.replace(boldTextRegex, "<strong>$1</strong>"); //$1 means first occurence of character with the boldTextRegex, so 1st occurence of string between double asterisks

          // Replace single asterisks for italic text
          const italicTextRegex = /\*(.*?)\*/g;
          line = line.replace(italicTextRegex, "<em>$1</em>"); //same for italic text for string between single asterisks

          if (line.trim().startsWith("*")) {
            // Remove the stars and format the line as a bullet point
            const cleanLine = line.replace(/\*/g, "").trim(); // Remove the '*' from the start and end
            formattedResponse += `<li>${cleanLine}</li>`;
          } else {
            // Format regular text as paragraphs
            formattedResponse += `<p>${line.trim()}</p>`;
          }
        }
      });

      // Wrap bullet points in an unordered list if any are found
      if (formattedResponse.includes("<li>")) {
        // If the response includes <li> elements, use replace to wrap them in <ul> tags
        formattedResponse = formattedResponse.replace(
          // Regular expression to match one or more <li> elements and their contents
          /(<li>.*<\/li>)+/,

          // Replace the matched list items with <ul>...</ul> wrapping the <li> elements
          (match) => `<ul>${match}</ul>`
        );
      }

      //for typing effect
      const words = formattedResponse.split(" "); // Split by spaces to get words
      words.forEach((word, index) => {
        delayPara(index, word + " "); // Add space after each word
      });
    } else {
      setResultData("No response text available.");
    }

    setLoading(false);
    setInput("");
  };

  // Provide the context value that can be used by all components wrapped by Context.Provider
  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}{" "} {/* The children components will have access to the context */} 
    </Context.Provider>
  );
};

export default ContextProvider;
