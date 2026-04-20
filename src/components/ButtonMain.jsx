import React from "react";
import { HashLink as Link } from "react-router-hash-link";

import "./Buttons.css";

const ButtonMain = ({ 
  path, 
  icon, 
  text, 
  onClick, 
  type = "button", 
  className = "btn", 
  id, 
  disabled, 
  children 
}) => {
  const content = (
    <>
      {icon && <i>{icon}</i>}
      {text}
      {children}
    </>
  );

  if (path) {
    return (
      <Link to={path} className={className} id={id} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button 
      type={type} 
      className={className} 
      id={id} 
      onClick={onClick} 
      disabled={disabled}
    >
      {content}
    </button>
  );
};

export default ButtonMain;
