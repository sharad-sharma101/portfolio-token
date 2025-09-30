import { useAppDispatch } from "../../../app/hooks";
import { changleModalState } from "../../../features/portfolio/portfolioSlice";
import { AddIconDark, RefreshIcon, WatchListStar } from "../../../icons"
import Button from "../Button";
import Table from "../Table"

const Watchlist = () => {

    const dispatch = useAppDispatch();

    return (
        <div className="flex flex-col gap-3">
            <div className="flex w-full justify-between items-center">

                <div className="flex-center font-medium gap-1 text-2xl">
                    <WatchListStar />
                    Watchlist
                </div>

                <div className="flex justify-center items-center gap-3">
                    <Button text="Refresh Prices" icon={<RefreshIcon />} />
                    <Button text="Add Token" type="secondary" icon={<AddIconDark />} onClickFn={() => dispatch(changleModalState(true))}/>
                </div>
            </div>

            <Table />
        </div>
    )
}

export default Watchlist;