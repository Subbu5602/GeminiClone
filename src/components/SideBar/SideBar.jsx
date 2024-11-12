import React, { useContext, useState } from "react";
import "./SideBar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const SideBar = () => {
  const [extended, setExtended] = useState(false);
  const { onSent, prevPrompts, setRecentPrompt, newChat} = useContext(Context); //children to be used in this component from Cotext.jsx

  const loadPrompt = async (prompt) => {
    //adds to history of prompts in sidebar after api gets prompt and returns a response
    setRecentPrompt(prompt)
    await onSent(prompt)
  }

  return (
    <div className="sidebar">
      <div className="top">
        <img
          src={assets.menu_icon}
          alt="Menu Icon"
          className="menu"
          onClick={() => setExtended((prev) => !prev)} //changing false to true and vice versa so flipping the state of if sidebar is opened
        />
        {/* newChat() feature from Context.jsx */}
        <div onClick={()=>newChat()} className="new-chat"> 
          <img src={assets.plus_icon} alt="Plus Icon" />
          {extended ? <p>New Chat</p> : null} {/*New Chat wording besides the plus img only if sidear is extended */}
        </div>
        {/* if sidebar extended */}
        {extended ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {/* show history of prev prompts */}
            {prevPrompts.map((item, index) => {
              return (
                <div onClick={()=>loadPrompt(item)} className="recent-entry">
                  {/* chat message image and prev prompt only showing their 18 characters */}
                  <img src={assets.message_icon} alt="Message Icon" />
                  <p>{item.slice(0, 18)} ...</p>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      {/* help,history,question images with the text content showing only when sidebar is extended */}
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="Question" />
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="Question" />
          {extended ? <p>History</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="Question" />
          {extended ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
