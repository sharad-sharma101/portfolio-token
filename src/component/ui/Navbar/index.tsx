import { Logo, WalletIcon } from "../../../icons"
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
    return (
        <div className="w-full flex justify-between items-center p-3">
            <div className="flex gap-3 items-center">
                <Logo />
                <span className="font-semibold text-xl leading-6 tracking-[0%]">Token Portfolio</span>
            </div>

            <div className="flex-center gap-[6px] connected-btn">
                <WalletIcon />
                <ConnectButton />
            </div>
        </div>
    )
}

export default Navbar;