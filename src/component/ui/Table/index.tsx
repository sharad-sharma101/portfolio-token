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
import { toWatchlistRows, type WatchListRowSerializable } from "../../../utils";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setWatchListRows } from "../../../features/portfolio/portfolioSlice";
import ThreeDotMenu from "../ThreeDotMenu";

type Row = WatchListRowSerializable;


const Table: React.FC = () => {
  const data = useAppSelector(store => store.portfolio.watchListRows);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(setWatchListRows(toWatchlistRows()));
  }, []);

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      { header: "Token", accessorKey: "token" },
      { header: "Price", accessorKey: "price", cell: ({ row }) => {
          const v = row.original.price;
          return v == null ? "-" : v.toFixed(6);
        }
      },
      { header: "24h %", accessorKey: "change24h", cell: ({ row }) => {
          const v = row.original.change24h;
          return v == null ? "-" : `${v.toFixed(2)}%`;
        }
      },
      { header: "sparkline (7d)", accessorKey: "sparklineUrl", cell: ({ row }) => (
          row.original.sparklineUrl ? <img src={row.original.sparklineUrl} alt="sparkline" /> : "-"
        )
      },
      { id: "holding", header: "Holdings", cell: () => (
          <input className="bg-transparent outline-none border border-table-border rounded px-2 py-1 w-20" type="number" />
        )
      },
      { id: "value", header: "Value", cell: () => 0 },
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
    state: { },
  });

  const rows = table.getRowModel().rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  return (
    <div className="w-full rounded-lg border border-solid border-table-border ">
      <table className="Table w-full">
        <thead className="bg-dark-secondary h-[48px] gap-3 pr-16" >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <th key={header.id} className={`text-sm font-medium text-text-secondary text-justify ${index === 0 ? "pl-6": ""} ${index === 6 ? "w-[5%]" : "w-1/7"}`}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {rows.length > 0 && (
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>

      { rows.length === 0 && <EmptyMessage /> }

      <Pagination
        pages={Math.max(1, Math.ceil(data.length / pageSize))}
        page={pageIndex}
        onPageChange={(p) => setPageIndex(p)}
        previousText="Previous"
        nextText="Next"
      />
    </div>
  );
};

export default Table;