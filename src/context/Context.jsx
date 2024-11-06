import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false)
    setShowResult(false)
  }

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if (prompt !== undefined) {
      response = await run(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
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
          const cleanLine = line.replace(/^##\s*/, "").trim();
          formattedResponse += `<h3><strong><u>${cleanLine}</u></strong></h3>`;
        } else {
          // Check if the line has bold text (i.e., contains '**' markers)
          const boldTextRegex = /\*\*(.*?)\*\*/g;
          line = line.replace(boldTextRegex, "<strong>$1</strong>");

          // Replace single asterisks for italic text
          const italicTextRegex = /\*(.*?)\*/g;
          line = line.replace(italicTextRegex, "<em>$1</em>");

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
        formattedResponse = formattedResponse.replace(
          /(<li>.*<\/li>)+/,
          (match) => `<ul>${match}</ul>`
        );
      }

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
    newChat
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
