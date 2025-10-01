import { useState } from "react";
import { useAppDispatch } from "../../../app/hooks"
import { changeHolding } from "../../../features/portfolio/portfolioSlice";
import type { WatchListRowSerializable } from "../../../utils"
import Button from "../Button"

const HoldingInput = ({row}: { row: WatchListRowSerializable }) => {
    const dispatch = useAppDispatch();
    const [value, setValue] = useState(row.holding);
    return (
        <div className="flex items.center justify-start gap-3 h-8">
            <input id="holding-input" defaultValue={row.holding} value={value} min="0" onChange={e => setValue(Number(e.target.value))} className="bg-[#ffffff0a] shadow-[0px_0px_0px_4px_#A9E85133] shadow-[0px_0px_0px_1px_#A9E851] w-[109px] h-[32px] gap-2 px-2 rounded-md" type="number" />
            <Button type="secondary" text="Save" onClickFn={() => dispatch(changeHolding({id: row.id, holding: value}))} />
        </div>
    )
}
export default HoldingInput;