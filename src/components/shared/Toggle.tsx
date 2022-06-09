import { Switch } from "@headlessui/react";

import React from "react";

interface ToggleProps {
  label: string;
  enabled: boolean;
  onChange: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, label, onChange }) => {
  const handleToggle = () => {
    onChange();
  };

  return (
    <Switch
      checked={enabled}
      onChange={handleToggle}
      className={`${enabled ? "bg-cyan-500" : "bg-dark-100"}
          relative inline-flex h-[20px] w-[40px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className={`${enabled ? "translate-x-5" : "translate-x-0"}
            pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      />
    </Switch>
  );
};

export default Toggle;
