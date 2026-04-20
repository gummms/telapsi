import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

const Icones = ({ icone }) => {
  library.add(fas, far, fab);

  return <FontAwesomeIcon icon={`fa-solid ${icone}`} />;
};

export default Icones;
