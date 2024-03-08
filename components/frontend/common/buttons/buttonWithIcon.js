import React from "react";
import {useI18n} from "../../../../contexts/i18n";

const ButtonWithIcon = ({name, icon, isActive, className, onClick}) => {
  const i18n = useI18n()
  return (
    <button
      className={`flex items-center px-5 py-2 bg-white ${className} ${isActive
        ? "border-2 border-twSecondary-shade700 text-twSecondary-shade700"
        : "border-2 border-twContent-muted"
        } font-Inter font-semibold text-lg rounded-md capitalize`}
      onClick={onClick}
    >
      <img className="mr-3 h-6" src={icon} alt={i18n?.t && i18n?.t(`${name}`)}></img>
      {i18n?.t && i18n?.t(`${name}`)}
    </button>
  );
};

export default ButtonWithIcon;
