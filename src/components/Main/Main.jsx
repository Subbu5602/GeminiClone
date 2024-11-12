import React, { useContext } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
  } = useContext(Context);

  return (
    <div className="main">
      {/* nav bar */}
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="User Icon" />
      </div>
      <div className="main-container">
        {!showResult ? (
          // when no result is shown
          <>
            <div className="greet">
              <p>
                <span>Hello, Dev.</span>
              </p>
              <p>How can I Help you Today ?</p>
            </div>
            {/* show cards after greeting */}
            <div className="cards">
              <div className="card">
                <p>Suggest me some cute dog pictures</p>
                <img src={assets.compass_icon} alt="Compass Icon" />
              </div>
              <div className="card">
                <p>Give me Recipe for Chocolate Muffins</p>
                <img src={assets.bulb_icon} alt="Compass Icon" />
              </div>
              <div className="card">
                <p>How to take care of a dog</p>
                <img src={assets.message_icon} alt="Compass Icon" />
              </div>
              <div className="card">
                <p>Tell me about React Hooks</p>
                <img src={assets.code_icon} alt="Compass Icon" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              {/* for question said by user */}
              <img src={assets.user_icon} alt="User Icon" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              {/* gemini icon answering */}
              <img src={assets.gemini_icon} alt="Gemini Icon" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p> // Insert raw HTML directly into the DOM inside the <p> tag
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              /* Capture user input and update the input state in context */
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a Prompt Here"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSent(); // Trigger onSent() if the Enter key is pressed
                  setInput(''); //make input field empty after pressing enter
                }
              }}
            />
            <div>
              <img src={assets.gallery_icon} alt="Gallery Icon" />
              <img src={assets.mic_icon} alt="Mic Icon" />
              <img
                src={assets.send_icon}
                onClick={() => onSent()}
                alt="Send Icon"
              />
            </div>
          </div>
          <p className="bottom-info">
            Gemini can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
