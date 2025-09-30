import { Logo, WalletIcon } from "../../../icons"
import Button from "../Button"

const Navbar = () => {
    return (
        <div className="w-full flex justify-between items-center p-3">
            <div className="flex gap-3 items-center">
                <Logo />
                <span className="font-semibold text-xl leading-6 tracking-[0%]">Token Portfolio</span>
            </div>

            <div>
                <Button text="Connected Wallet" icon={<WalletIcon />} type="secondary" className="rounded-full" />
            </div>
        </div>
    )
}

export default Navbar;