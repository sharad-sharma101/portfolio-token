import React from "react";
import { Edit, Trash } from "../../../icons";
import { removeCoinFromLocalStorage } from "../../../utils";
import { useAppDispatch } from "../../../app/hooks";
import { removeCoinFromRows } from "../../../features/portfolio/portfolioSlice";

type ThreeDotMenuProps = {
  onEditHoldings?: () => void;
  disableEdit?: boolean;
  className?: string;
  coinID: string | number;
};

const ThreeDotMenu: React.FC<ThreeDotMenuProps> = ({
  onEditHoldings,
  disableEdit = true,
  className = "",
  coinID = ""
}) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="p-2 flex rounded hover:bg-white/5 focus:outline-none cursor-pointer"
      >
        <span className="block w-1 h-1 bg-[#A1A1AA] rounded-full" />
        <span className="block w-1 h-1 bg-[#A1A1AA] rounded-full mx-0.5" />
        <span className="block w-1 h-1 bg-[#A1A1AA] rounded-full" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 rounded-lg bg-[#1F1F22] text-[#D4D4D8] shadow-lg ring-1 ring-black/10 overflow-hidden z-50"
        >
          <button
            role="menuitem"
            disabled={disableEdit}
            onClick={() => {
              if (!disableEdit) onEditHoldings?.();
              setOpen(false);
            }}
            className={`w-full text-left px-4 py-3 flex items-center gap-2 border-b border-white/10 ${
              disableEdit ? "text-[#8A8A91] cursor-not-allowed" : "hover:bg-white/5"
            }`}
          >
            <Edit />
            Edit Holdings
          </button>

          <button
            role="menuitem"
            onClick={() => {
              dispatch(removeCoinFromRows(coinID));
              removeCoinFromLocalStorage(coinID);
              setOpen(false);
            }}
            className="w-full text-left px-4 py-3 flex items-center gap-2 text-[#FF7A7A] hover:bg-white/5"
          >
            <Trash />
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default ThreeDotMenu;