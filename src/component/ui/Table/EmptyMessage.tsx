import { useAppDispatch } from "../../../app/hooks";
import { changleModalState } from "../../../features/portfolio/portfolioSlice";
import { AddIconDark } from "../../../icons";
import Button from "../Button";

const EmptyMessage = () => {
    const dispatch = useAppDispatch();
    return (
        <div className="flex-center w-full h-48">
            <div className="flex-center flex-col gap-2">
                <span className="text-md font-medium text-text-secondary w-60 text-center">
                    Your watchlist is empty. Add some coins to track them
                </span>
                <Button text="Add Token" type="secondary" icon={<AddIconDark />} onClickFn={() => dispatch(changleModalState(true))}/>
            </div>
        </div>
    )
}

export default EmptyMessage;
