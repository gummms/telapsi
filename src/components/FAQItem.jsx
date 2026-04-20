import { useState } from "react";
import Icones from "./Icones";

import "./FAQItem.css";

const FAQItem = ({ question, answer, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="FAQ-item">
      <div className="FAQ-question-header" onClick={handleClick}>
        <i className="FAQ-caret">{isOpen ? <Icones icone="fa-chevron-down" /> : <Icones icone="fa-chevron-right" />}</i>
        <h3 className="FAQ-question-text">{question}</h3>
      </div>
      {isOpen && (
        <div className="FAQ-answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQItem;
