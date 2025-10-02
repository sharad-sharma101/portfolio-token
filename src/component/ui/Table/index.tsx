import React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Pagination from "./pagination";
import "./index.scss";
import EmptyMessage from "./EmptyMessage";
import { toWatchlistRows, type WatchListRowSerializable, updatePricesInLocalStorage } from "../../../utils";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setWatchListRows } from "../../../features/portfolio/portfolioSlice";
import ThreeDotMenu from "../ThreeDotMenu";
import HoldingInput from "../HoldingInput";
import LineChart from "../LineChart";
import { useMutation } from "@tanstack/react-query"
const apiKey = import.meta.env.VITE_CG_DEMO_API_KEY as string | undefined;
const headers: HeadersInit = apiKey ? { "x_cg_demo_api_key": apiKey } : {};

type Row = WatchListRowSerializable;

const Table = React.forwardRef<{ refreshVisible: () => void }>((props, ref) => {
  const data = useAppSelector(store => store.portfolio.watchListRows);
  const dispatch = useAppDispatch();

  const refreshMutation = useMutation({
    mutationFn: async (ids: Array<string | number>) => {
      const url = (id: string | number) =>
        `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(String(id))}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`;
      const settled = await Promise.allSettled(ids.map(async (id) => {
        const res = await fetch(url(id), { method: "GET", headers });
        if (!res.ok) throw new Error(`Failed ${id}`);
        const j = await res.json();
        return {
          id,
          price: j?.market_data?.current_price?.usd ?? null,
          change24h: j?.market_data?.price_change_percentage_24h_in_currency?.eur
            ?? j?.market_data?.price_change_percentage_24h ?? null,
          sparkline: j?.market_data?.sparkline_7d?.price ?? null,
        };
      }));
      const success = settled.filter(s => s.status === "fulfilled").map((s: any) => s.value);
      return success;
    },
    onSuccess: (success) => {
      if (success.length > 0) {
        updatePricesInLocalStorage(success);
      }
      dispatch(setWatchListRows(toWatchlistRows()));
    },
  });
  
  React.useEffect(() => {
    dispatch(setWatchListRows(toWatchlistRows()));
  }, []);

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      {
        header: "Token", accessorKey: "token", cell: ({ row }) => {
          const v = row.original.token;
          return (
            <div className="flex items-center gap-3 pl-6" >
              <img className="rounded-sm" height={32} width={32} src={row.original.thumb} alt="icon" />
              <div className="font-normal text-sm"> <span className="text-[#F4F4F5]">{v}</span> <span className="text-text-secondary">(BTC)</span> </div>
            </div>)
        }
      },
      {
        header: "Price", accessorKey: "price", cell: ({ row }) => {
          const v = row.original.price;
          return <span className="font-normal text-text-secondary">{v == null ? "-" : `$${v.toFixed(6)}`}</span>
        }
      },
      {
        header: "24h %", accessorKey: "change24h", cell: ({ row }) => {
          const v = row.original.change24h;
          return <span className="font-normal text-text-secondary">{v == null ? "-" : v.toFixed(6)}</span>
        }
      },
      {
        header: "sparkline (7d)", accessorKey: "sparklineUrl", cell: ({ row }) => (
          row.original.sparklineUrl ? <LineChart data={row.original.sparklineUrl} /> : "-"
        )
      },
      {
        id: "holding", header: "Holdings", cell: ({ row }) => {
          if (row.original.isEditable)
            return <HoldingInput row={row.original} />
          return <span className="text[#F4F4F5] font-normal" >{row.original.holding}</span>;
        }
      },
      { id: "value", header: "Value", cell: ({ row }) => <span className="text[#F4F4F5] font-normal" >{(Number(row.original.holding) * Number(row.original.price)).toFixed(2)}</span> },
      { id: "menu", header: "", cell: ({ row }) => <ThreeDotMenu coinID={row.original.id || ""} /> },
    ],
    []
  );

  const [pageIndex, setPageIndex] = React.useState(0);
  const pageSize = 10;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {},
  });

  const rows = table.getRowModel().rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  React.useImperativeHandle(ref, () => ({
    refreshVisible: () => {
      const ids = rows.slice(0, 10).map(r => r.original.id);
      if (ids.length) refreshMutation.mutate(ids);
    }
  }));

  return (
    <div className="w-full rounded-lg border border-solid border-table-border overflow-x-scroll">
      <table className={`Table w-full min-w-[800px]`}>
        <thead className="bg-dark-secondary h-[48px] gap-3 pr-16" >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <th key={header.id} className={`text-sm font-medium text-text-secondary text-justify ${index === 0 ? "pl-6" : ""} ${index === 6 ? "w-[5%]" : "w-1/7"}`}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {rows.length > 0 && (
          <tbody className="h-40">
            {rows.map((row) => (
              <tr key={row.id} className={`gap-2 ${row.original.isEditable ? 'bg-[#27272A]' : ''}`}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>

      {rows.length === 0 && <EmptyMessage />}

      <Pagination
        pages={Math.max(1, Math.ceil(data.length / pageSize))}
        page={pageIndex}
        onPageChange={(p) => setPageIndex(p)}
        previousText="Previous"
        nextText="Next"
      />
    </div>
  );
});

export default Table;
