// inside AddTokenModal (top-level in the file)
const LS_KEY = 'tp_selectedCoins';


export type WatchListRowSerializable = {
  id: string | number;
  token: string;
  price: number | null;
  change24h: number | null;
  sparklineUrl: string | null;
};

export function toWatchlistRows(): WatchListRowSerializable[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return list.map((item: any) => ({
      id: item.coin_id,
      token: item.name,
      price: typeof item?.data?.price === 'number' ? item.data.price : null,
      change24h: typeof item?.data?.price_change_percentage_24h?.eur === 'number'
        ? item.data.price_change_percentage_24h.eur
        : null,
      sparklineUrl: item?.data?.sparkline ?? null,
    }));
  } catch {
    return [];
  }
}

export function addCoinsToLocalStorage(coins: any[]) {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const existing: any[] = raw ? JSON.parse(raw) : [];
  
      const existingIds = new Set(existing.map(c => c.coin_id));
      const dedupToAdd = coins.filter(c => !existingIds.has(c.coin_id));
  
      if (dedupToAdd.length === 0) return;
  
      localStorage.setItem(LS_KEY, JSON.stringify([...existing, ...dedupToAdd]));
    } catch {}
  }

  export function removeCoinFromLocalStorage(coinId: string | number) {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const list = JSON.parse(raw) as any[];
      const next = list.filter((c) => String(c.coin_id) !== String(coinId));
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {}
  }
