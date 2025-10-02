// inside AddTokenModal (top-level in the file)
const LS_KEY = 'tp_selectedCoins';
export const LAST_UPDATED_KEY = 'tp_lastUpdated';

export function setLastUpdatedNow() {
  try {
    localStorage.setItem(LAST_UPDATED_KEY, new Date().toISOString());
  } catch {}
}

export function getLastUpdated(): string | null {
  try {
    return localStorage.getItem(LAST_UPDATED_KEY);
  } catch {
    return null;
  }
}

export type WatchListRowSerializable = {
  id: string | number;
  token: string;
  price: number | null;
  change24h: number | null;
  holding: number;
  isEditable: boolean;
  sparklineUrl: number[];
  thumb: string;
};

export function toWatchlistRows(): WatchListRowSerializable[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return list.map((item: any) => ({
      id: item.id,
      token: item.name,
      thumb: item.thumb,
      price: item.price || null,
      change24h: item.price_change_percentage_24h ||  null,
      holding: item.holding,
      isEditable: false,
      sparklineUrl: item?.sparkline ?? null,
    }));
  } catch {
    return [];
  }
}

export function addCoinsToLocalStorage(coins: any[]) {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const existing: any[] = raw ? JSON.parse(raw) : [];
  
      const existingIds = new Set(existing.map(c => c.id));
      const dedupToAdd = coins.filter(c => !existingIds.has(c.id));
  
      if (dedupToAdd.length === 0) return;

      const addHoldings = dedupToAdd.map( (e: any) => { return { ...e, "holding": 0  };} ) ;
  
      localStorage.setItem(LS_KEY, JSON.stringify([...existing, ...addHoldings]));
      setLastUpdatedNow();
    } catch {}
  }

  export function removeCoinFromLocalStorage(coinId: string | number) {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const list = JSON.parse(raw) as any[];
      const next = list.filter((c) => String(c.id) !== String(coinId));
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {}
  }


  export function updateHoldingInLocalStorage(coinId: string | number, holding: number) {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const list = JSON.parse(raw) as any[];
      const updated = list.map((c) => 
        String(c.id) === String(coinId) ? { ...c, holding } : c
      );
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
    } catch {}
  }

export function updatePricesInLocalStorage(updates: Array<{ id: string | number, price: number | null, change24h: number | null, sparkline?: number[] | null }>) {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const list = JSON.parse(raw) as any[];

    const byId = new Map(updates.map(u => [String(u.id), u]));
    const next = list.map((c) => {
      const key = String(c.coin_id ?? c.id); // support both shapes
      const u = byId.get(key);
      if (!u) return c;
      return {
        ...c,
        data: {
          ...(c.data || {}),
          price: u.price ?? null,
          price_change_percentage_24h: {
            ...(c.data?.price_change_percentage_24h || {}),
            eur: u.change24h ?? null,
          },
          sparkline: u.sparkline ?? c.data?.sparkline ?? null,
        },
      };
    });

    localStorage.setItem(LS_KEY, JSON.stringify(next));
    try { localStorage.setItem('tp_lastUpdated', new Date().toISOString()); } catch {}
  } catch {}
}