import useIsMobile from "../../../hooks/useIsMobile";
import Card from "../Card";
import PieChartComponent from "../PieChart";
import { useAppSelector } from "../../../app/hooks";
import { useMemo } from "react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FFC49F'];

const PortfolioTotal = () => {
    const isMobile = useIsMobile();
    const watchListRows = useAppSelector(store => store.portfolio.watchListRows);

    // Calculate portfolio total and top coins
    const { totalValue, topCoins } = useMemo(() => {
        let total = 0;
        const coinValues: Array<{ name: string; value: number; share: number }> = [];

        watchListRows.forEach((row) => {
            if (row.price && row.holding > 0) {
                const value = row.price * row.holding;
                total += value;
                coinValues.push({
                    name: row.token,
                    value,
                    share: 0 // Will calculate after total is known
                });
            }
        });

        // Calculate percentages
        const coinsWithShare = coinValues.map(coin => ({
            ...coin,
            share: total > 0 ? (coin.value / total) * 100 : 0
        }));

        // Sort by value descending and take top 5
        const topCoins = coinsWithShare
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
            .map(coin => ({
                name: coin.name,
                share: parseFloat(coin.share.toFixed(2))
            }));

        return {
            totalValue: total,
            topCoins
        };
    }, [watchListRows]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    return (
        <Card className={"flex bg-dark-secondary justify-between flex-wrap"}>
            <div className="flex flex-col justify-between items-baseline gap-5" >
                <div className="flex flex-col gap-5 justify-start">
                    <span className="font-medium text-md leading-5 tracking-[0%] text-text-secondary">
                        Portfolio Total
                    </span>
                    <span className="font-medium text-4xl tracking-[-2.24%] color-[#F4F4F5]" >
                        {formatCurrency(totalValue)}
                    </span>
                </div>
                <div className="font-normal text-sm leading-5 tracking-[0%] text-text-secondary">
                    Last updated: {getCurrentTime()}
                </div>
            </div>
            <div className={`flex flex-col gap-5 justify-start ${isMobile ? "w-full" : "w-[50%]" }`} >
                <span className="font-medium text-md leading-5 tracking-[0%] text-text-secondary">
                    Portfolio Distribution
                </span>
                <div className="flex flex-wrap">
                    <PieChartComponent data={topCoins.map(e => {return{ ...e, value: e.share }} )} />
                    <div className="max-w-100 w-full flex flex-col gap-2">
                        {
                            topCoins.length > 0 ? topCoins.map((ele, index) => (
                                <div key={ele.name} style={{color: COLORS[index]}} className="flex gap-6 w-full justify-between">
                                    <span>{ele.name}</span>
                                    <span>{ele.share}%</span>
                                </div>
                            )) : (
                                <div className="text-text-secondary text-sm">No holdings</div>
                            )
                        }
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default PortfolioTotal;