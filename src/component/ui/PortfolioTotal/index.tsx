import Card from "../Card";
import PieChartComponent from "../PieChart";

const PortfolioTotal = () => {

    const topCoins = [
        {name: "Bitcoin (BTC)", share: 40},
        {name: "trickcoin ", share: 14},
        {name: "bro coin", share: 12},
        {name: "Dogecoin (BTC)", share: 8.3},
        {name: "Etheriem (ETC)", share: 4.23}
    ];

    return (
        <Card className={"flex bg-dark-secondary justify-between flex-wrap"}>
            <div className="flex flex-col justify-between items-baseline gap-5" >
                <div className="flex flex-col gap-5 justify-start">
                    <span className="font-medium text-md leading-5 tracking-[0%] text-text-secondary">
                        Portfolio Total
                    </span>
                    <span className="font-medium text-4xl tracking-[-2.24%] color-[#F4F4F5]" >
                        $10,100.47
                    </span>
                </div>
                <div className="font-normal text-sm leading-5 tracking-[0%] text-text-secondary">Last updated: 3:42:12 PM</div>
            </div>
            <div className="flex flex-col gap-5 justify-start w-[50%]" >
                <span className="font-medium text-md leading-5 tracking-[0%] text-text-secondary">
                    Portfolio Total
                </span>
                <div className="flex flex-wrap">
                    <PieChartComponent />
                    <div className="max-w-100 w-full flex flex-col gap-2">
                        {
                            topCoins.map((ele) => (
                                <div key={ele.name} className="flex gap-6 w-full justify-between">
                                    <span>{ele.name}</span>
                                    <span>{ele.share}%</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default PortfolioTotal;