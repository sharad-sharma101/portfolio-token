import { useRef } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { changleModalState } from "../../../features/portfolio/portfolioSlice";
import useIsMobile from "../../../hooks/useIsMobile";
import { AddIconDark, RefreshIcon, WatchListStar } from "../../../icons"
import Button from "../Button";
import Table from "../Table"

const Watchlist = () => {

    const dispatch = useAppDispatch();
    const isMobile = useIsMobile();
    const tableRef = useRef<{ refreshVisible: () => void }>(null);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex w-full justify-between items-center">

                <div className="flex-center font-medium gap-1 text-2xl">
                    <WatchListStar />
                    Watchlist
                </div>

                <div className="flex justify-center items-center gap-3">
                    { isMobile ? <Button text="" onClickFn={() => tableRef.current?.refreshVisible()} icon={<RefreshIcon />} /> : 
                    <Button text="Refresh Prices" onClickFn={() => tableRef.current?.refreshVisible()} icon={<RefreshIcon />} />}
                    <Button text="Add Token" type="secondary" icon={<AddIconDark />} onClickFn={() => dispatch(changleModalState(true))}/>
                </div>
            </div>

            <Table ref={tableRef} />
        </div>
    )
}

export default Watchlist;