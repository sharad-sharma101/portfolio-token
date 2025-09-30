import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../Modal";
import Button from "../Button";
import { useQuery } from "@tanstack/react-query";
import Checkbox from "../Checkbox";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changleModalState } from "../../../features/portfolio/portfolioSlice";
import { addCoinsToLocalStorage } from "../../../utils";

function useDebounce<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}


const apiKey = import.meta.env.VITE_CG_DEMO_API_KEY as string | undefined;
const headers: HeadersInit = apiKey ? { "x_cg_demo_api_key": apiKey } : {};

const AddTokenModal = () => {

    const [selectedCoin, setSelectedCoin] = useState<any[]>([]);
    const [query, setQuery] = useState("");
    const debounced = useDebounce(query, 300);
    const searchEnabled = debounced.trim().length > 0;

    const { modalOpenState } = useAppSelector(store => store.portfolio);
    const dispatch = useAppDispatch();

    // Trending (shown when no search)
    const { isPending: isTrendingLoading, error: trendingError, data: trending } = useQuery({
        queryKey: ['trending data'],
        queryFn: async () => {
          const response = await fetch(
            'https://api.coingecko.com/api/v3/search/trending', {
                method: "GET", 
                headers
            }
          )
          return await response.json()
        },
    })

    // Search (only when input has text)
    const { isPending: isSearchLoading, error: searchError, data: searchData } = useQuery({
        queryKey: ['cg-search', debounced],
        enabled: searchEnabled,
        queryFn: async () => {
          const res = await fetch(
            `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(debounced)}`,
            {
              method: "GET",
              headers
            }
          );
          if (!res.ok) throw new Error("Failed to fetch search");
          return res.json();
        },
    });

    function handleSelectCoin(ele: any) {
        if(selectedCoin.some ( item =>  item.coin_id === ele.coin_id)){
            const updatedSelectedCoin = selectedCoin.filter( item => item.coin_id !== ele.coin_id );
            setSelectedCoin([ ...updatedSelectedCoin ]);
        } else {
            setSelectedCoin(prev => [ ...prev, ele ]);
        }
    }

    function isChecked(ele: any) { return selectedCoin.some( item =>  item.coin_id === ele.item.coin_id);}

    // Infinite reveal for search results (API doesn't paginate)
    const coins = useMemo(() => (searchData?.coins ?? []) as any[], [searchData]);
    const [visible, setVisible] = useState(20);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    function handleAddToWishlist() {
      addCoinsToLocalStorage(selectedCoin);
      dispatch(changleModalState(false))
    }

    useEffect(() => {
      setVisible(20);
    }, [debounced]);

    useEffect(() => {
      if (!searchEnabled) return;
      const el = sentinelRef.current;
      if (!el) return;
      const io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setVisible(v => (v < coins.length ? Math.min(v + 20, coins.length) : v));
        }
      });
      io.observe(el);
      return () => io.disconnect();
    }, [coins.length, searchEnabled]);

    return (
        <Modal
            open={modalOpenState}
            onClose={() => dispatch(changleModalState(false))}
            footer={
                <div className="flex flex-col items-end px-3 py-4">
                    <Button text="Add To Wishlist" className="w-fit" type="secondary" isDisabled={selectedCoin.length ===0 } onClickFn={handleAddToWishlist} />
                </div>
            }
        >
            <div className="flex flex-col">
                <div className="w-full px-3 py-4">
                    <input
                      id="token-search-input"
                      className="search-input w-full bg-[#212124] border-none"
                      placeholder="Search tokens (e.g., ETH, SOL)..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {/* Content area */}
                <div className="px-2 flex flex-col scroll h-[400px] overflow-y-scroll gap-1">

                  {/* When input empty: show Trending */}
                  {!searchEnabled && (
                    <>
                      <div className="text-xs font-medium text-text-secondary pt-3 pb-1 px-2">Trending</div>
                      {isTrendingLoading && (
                        <div className="text-xs px-2 py-2 text-text-secondary">Loading…</div>
                      )}
                      {trendingError && (
                        <div className="text-xs px-2 py-2 text-red-400">Failed to load trending.</div>
                      )}
                      {!isTrendingLoading && !trendingError && trending?.coins?.map((ele: any) => (
                        <div
                          key={ele.item.coin_id}
                          className={`flex w-full justify-between items-center p-2 rounded-[6px] cursor-pointer hover:bg-secondary-300 ${isChecked(ele) ? "bg-secondary-300" : "" }`}
                          onClick={() => handleSelectCoin(ele.item)}
                        >
                          <div className="flex-center gap-3">
                            <img className="rounded-sm" height={28} width={28} src={ele.item.thumb} alt="icon" />
                            <span className="text-md text-[#F4F4F5]">{ele.item.name}</span>
                          </div>
                          <Checkbox checked={isChecked(ele)} />
                        </div>
                      ))}
                    </>
                  )}

                  {/* When searching: show search results (with infinite reveal) */}
                  {searchEnabled && (
                    <>
                      {isSearchLoading && (
                        <div className="text-xs px-2 py-2 text-text-secondary">Searching…</div>
                      )}
                      {searchError && (
                        <div className="text-xs px-2 py-2 text-red-400">Failed to fetch results.</div>
                      )}
                      {!isSearchLoading && !searchError && coins.length === 0 && (
                        <div className="text-xs px-2 py-2 text-text-secondary">No results.</div>
                      )}
                      {!isSearchLoading && !searchError && coins.slice(0, visible).map((c: any) => (
                        <div
                          key={c.id ?? c.coin_id ?? `${c.name}-${c.symbol}`}
                          className="flex w-full justify-between items-center p-2 rounded-[6px] cursor-pointer hover:bg-secondary-300"
                          onClick={() => handleSelectCoin({ coin_id: c.coin_id ?? c.id, name: c.name, thumb: c.thumb })}
                        >
                          <div className="flex-center gap-3">
                            <img className="rounded-sm" height={28} width={28} src={c.thumb} alt="icon" />
                            <span className="text-md text-[#F4F4F5]">{c.name}</span>
                          </div>
                          <Checkbox checked={selectedCoin.some(s => s.coin_id === (c.coin_id ?? c.id))} />
                        </div>
                      ))}
                      <div ref={sentinelRef} className="h-4" />
                    </>
                  )}

                </div>
            </div>
        </Modal>
    )
}

export default AddTokenModal;