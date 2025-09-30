import PortfolioTotal from "../../component/ui/PortfolioTotal"
import Watchlist from "../../component/ui/Watchlist"
import AddTokenModal from "../../component/ui/AddTokenModal"

const Home = () => {
  
    return (
        <div className="flex flex-col p-7 gap-12">
          <PortfolioTotal />
          <Watchlist />
          <AddTokenModal />
        </div>
    )
}

export default Home;