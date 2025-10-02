import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../Modal";
import Button from "../Button";
import { useMutation, useQuery } from "@tanstack/react-query";
import Checkbox from "../Checkbox";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changleModalState, setWatchListRows } from "../../../features/portfolio/portfolioSlice";
import { addCoinsToLocalStorage, toWatchlistRows } from "../../../utils";

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

function mapCoin(j: any, id: number | string) {
  return {
    id: id,
    name: j?.name,
    thumb: j?.image?.thumb,
    price: j?.market_data?.current_price?.usd ?? null,
    price_change_percentage_24h: j.market_data?.price_change_percentage_24h ?? null,
    sparkline: j.market_data?.sparkline_7d?.price,
  };
}

const AddTokenModal = () => {

  const [selectedCoin, setSelectedCoin] = useState<any[]>([]);
  const [selectionWarning, setSelectionWarning] = useState<string>("");
  const [failedIds, setFailedIds] = useState<Array<number | string>>([]);
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
    if (selectedCoin.some(item => item.id === ele.id)) {
      const updatedSelectedCoin = selectedCoin.filter(item => item.id !== ele.id);
      setSelectedCoin([...updatedSelectedCoin]);
      if (selectionWarning) setSelectionWarning("");
    } else {
      if (selectedCoin.length >= 5) {
        setSelectionWarning("You can select a maximum of 5 coins in one attempt.");
        return;
      }
      setSelectedCoin(prev => [...prev, ele]);
      if (selectedCoin.length + 1 >= 5) {
        setSelectionWarning("You have reached the maximum of 5 selected coins.");
      } else if (selectionWarning) {
        setSelectionWarning("");
      }
    }
  }

  function isChecked(ele: any) { return selectedCoin.some(item => item.id === ele.item.id); }

  // Infinite reveal for search results (API doesn't paginate)
  const coins = useMemo(() => (searchData?.coins ?? []) as any[], [searchData]);
  const [visible, setVisible] = useState(20);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const addCoinsMutation = useMutation({
    mutationFn: async (ids: Array<number | string>) => {
      const url = (id: number | string) =>
        `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(String(id))}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`;

      const settled = await Promise.allSettled(
        ids.map(async (id) => {
          const res = await fetch(url(id), { method: "GET", headers });
          if (!res.ok) throw new Error(`Failed ${id}`);
          const j = await res.json();
          return mapCoin(j, id);
        })
      );

      const success = settled
        .filter((r): r is PromiseFulfilledResult<ReturnType<typeof mapCoin>> => r.status === "fulfilled")
        .map(r => r.value);

      const failedIds = settled
        .map((r, idx) => ({ r, id: ids[idx] }))
        .filter(x => x.r.status === "rejected")
        .map(x => x.id);

      return { success, failedIds };
    },
    onSuccess: ({ success, failedIds }) => {
      if (success.length > 0) {
        addCoinsToLocalStorage(success);
        dispatch(setWatchListRows(toWatchlistRows()));
      }
      // Show a small banner if some failed
      if (failedIds.length > 0) {
        setSelectionWarning(`Added ${success.length}. ${failedIds.length} failed. You can retry.`);
        // optionally store for retry
        setFailedIds(failedIds);
      } else {
        dispatch(changleModalState(false));
      }

      setSelectedCoin([]);
    },
  });

  function handleAddToWishlist() {
    const ids = selectedCoin.map((c) => c.id);
    if (ids.length === 0) return;
    addCoinsMutation.mutate(ids);
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
          <Button
            text={addCoinsMutation.isPending ? "Adding…" : "Add To Wishlist"}
            className="w-fit"
            type="secondary"
            isDisabled={selectedCoin.length === 0 || addCoinsMutation.isPending}
            onClickFn={handleAddToWishlist}
          />
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
          {selectionWarning && (
            <div className="mt-2 text-xs text-[#F59E0B] flex items-center gap-2">
              {selectionWarning}
              {failedIds.length > 0 && (
                <button
                  className="underline text-[#F59E0B] cursor-pointer"
                  onClick={() => addCoinsMutation.mutate(failedIds)}
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="px-2 flex flex-col scroll h-[400px] overflow-y-scroll gap-1 relative">

          {addCoinsMutation.isPending && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div className="text-text-secondary text-sm">Adding to wishlist…</div>
            </div>
          )}

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
                  key={ele.item.id}
                  className={`flex w-full justify-between items-center p-2 rounded-[6px] cursor-pointer hover:bg-secondary-300 ${isChecked(ele) ? "bg-secondary-300" : ""}`}
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
                  key={c.id ?? c.id ?? `${c.name}-${c.symbol}`}
                  className="flex w-full justify-between items-center p-2 rounded-[6px] cursor-pointer hover:bg-secondary-300"
                  onClick={() => handleSelectCoin({ id: c.id ?? c.id, name: c.name, thumb: c.thumb })}
                >
                  <div className="flex-center gap-3">
                    <img className="rounded-sm" height={28} width={28} src={c.thumb} alt="icon" />
                    <span className="text-md text-[#F4F4F5]">{c.name}</span>
                  </div>
                  <Checkbox checked={selectedCoin.some(s => s.id === (c.id ?? c.id))} />
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