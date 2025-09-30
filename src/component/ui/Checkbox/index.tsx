import React, { useEffect, useState } from "react";
import { Check } from "lucide-react"; // or any icon library
import { WatchListStar } from "../../../icons";

type CheckboxProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

const Checkbox: React.FC<CheckboxProps> = ({ checked = false, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const toggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    onChange?.(newState);
  };

  useEffect(() => {
    setIsChecked(checked);
  }, [checked])

  return (
    <div className="flex-center gap-3" >
      { checked && <WatchListStar /> }
      <button
      onClick={toggle}
      className={`flex items-center justify-center w-[15px] h-[15px] rounded-full border transition-colors duration-200 ${
        isChecked
          ? "bg-secondary border-secondary"
          : "border-[#A1A1AA] bg-transparent"
      }`}
    >
      {isChecked && <Check className="w-3 h-3 text-black" />}
    </button>
    </div>
  );
};

export default Checkbox;
