import { useCallback } from "react";

interface ButtonType {
    text: string;
    icon?: React.ReactElement | null;
    type?: "primary" | "secondary";
    className?: string;
    onClickFn?: () => void;
    isDisabled?: boolean;
}

const Button = ( {text, icon, type = "primary", className, onClickFn = () => {}, isDisabled = false}: ButtonType) => {

    const typeTheme = useCallback(() => {
        if(isDisabled) return "text-table-border border border-table-border bg-[#27272A] cursor-not-allowed"
        if (type === "primary") 
            return "text-[#fff] bg-[#27272A] shadow-[0px_0px_0px_1px_#00000014] shadow-[0px_1px_2px_0px_#0000001F]"   
        else
            return "text-[#18181B] bg-[#A9E851] shadow-[0px_0px_0px_1px_#1F6619] shadow-[0px_1px_2px_0px_#1F661966] shadow-[0px_0.75px_0px_0px_#FFFFFF33_inset]"
    }, [isDisabled])

    return (
        <button className={`flex justify-center items-center rounded-[6px] gap-[6px] px-3 py-2 ${typeTheme()} ${ !isDisabled && "cursor-pointer"} ${className}`} onClick={onClickFn} disabled={isDisabled}>
            { icon && <div>{icon}</div> }
            <div className={`font-medium text-sm leading-5`} >
                {text}
            </div>
        </button>
    )
}

export default Button;