"use client";

import { AttributeValue, ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import {
    FunctionComponent,
    ReactNode,
    useCallback,
    useMemo,
    useState,
} from "react";
import { useLocalStorage } from "usehooks-ts";
import { CellRenderers } from "./table.utils";
import { Column, ParsedTableSchema } from "@/utils/aws/parse";
import { ValueOf } from "next/dist/shared/lib/constants";

export interface TableProps {
    data: ScanCommandOutput;
    schema: ParsedTableSchema;
    cellRenderer?:
        | keyof typeof CellRenderers
        | (<T>(val: T, idx: number) => ReactNode);
}

export type TableRow = Record<string, AttributeValue> & { id: number };

export const Table: FunctionComponent<TableProps> = ({
    data,
    schema,
    cellRenderer,
}) => {
    const { id: tableId, columns } = schema;

    const headers = columns
        .sort((a, b) => (a?.order || 0) - (b?.order || 0))
        .map((c) => c.name);

    const columnMap = useMemo<Record<string, Column>>(() => {
        return Object.assign(
            {},
            ...schema.columns.map((c) => ({ [c.name]: c }))
        );
    }, [schema.columns]);

    const [orderedHeaders, setOrdering] = useLocalStorage<string[]>(
        `table-header-${tableId}`,
        headers
    );

    const handleMoveCol = (colName: string, by: "left" | "right") => {
        const idx = orderedHeaders.indexOf(colName);
        const delta = by === "left" ? -1 : 1;

        if (idx + delta < 0 || idx + delta > headers.length - 1) return;

        const newOrdering = [...orderedHeaders];
        newOrdering[idx] = newOrdering[idx + delta];
        newOrdering[idx + delta] = colName;
        setOrdering(newOrdering);
    };

    const cellRendererToUse = useCallback(
        (
            val: AttributeValue,
            options: { col: string; row: number }
        ): ReactNode => {
            if (typeof cellRenderer === "function") {
                return cellRenderer(val, options.row);
            }

            if (
                typeof cellRenderer === "string" &&
                Object.keys(CellRenderers).includes(cellRenderer)
            ) {
                return CellRenderers[cellRenderer](val, options.row);
            }

            return JSON.stringify(val);
        },
        [cellRenderer]
    );

    const getLocalData = ({
        schema,
        data,
    }: Pick<TableProps, "schema" | "data">) => {
        console.log({ schema });
        console.log({ data });

        const tableData = data.Items?.map((row) => {
            const newRowData: Record<
                string,
                {
                    type: keyof AttributeValue;
                    value: ValueOf<AttributeValue> | undefined;
                }
            > = {};
            schema.columns.forEach((col) => {
                if (col.name in row) {
                    newRowData[col.name] = {
                        type: col.type,
                        value: row[col.name][col.type],
                    };
                }
            });

            return newRowData;
        });

        return tableData;
    };

    // console.log("Local data", getLocalData({ schema, data }));

    // const parsedData = (data.Items as TableRow[]).map((item) => {
    //     const parsedItem = Object.entries(item).map(([key, value]) => {
    //         const dataType = Object.keys(value)[0] as keyof AttributeValue;
    //         const dataVal = Object.values(value)[0] as keyof AttributeValue;
    //     });

    //     return item;
    // });

    if (!data.Items) {
        return <div className="text-xl">No Data Found</div>;
    }

    return (
        <table className="table">
            <thead>
                <tr className="flex flex-row">
                    {orderedHeaders.map((h, idx) => (
                        <th
                            key={h}
                            className="flex items-center text-lg px-1 pt-1 text-base-400"
                            title={h}
                            style={{
                                flex: columnMap[h]?.colWidth,
                                minWidth: h == "id" ? 50 : 200,
                            }}
                        >
                            {idx > 0 && (
                                <span
                                    // className="font-mono px-1 hover:cursor-pointer hover:text-blue-400"
                                    className="font-mono px-1 hover:cursor-pointer hover:text-blue-400"
                                    onClick={() => handleMoveCol(h, "left")}
                                >
                                    &#x25C0;
                                </span>
                            )}
                            {h}
                            {idx < orderedHeaders.length - 1 && (
                                <span
                                    // className="font-mono px-1 hover:cursor-pointer hover:text-blue-400"
                                    className="font-mono px-1 hover:cursor-pointer hover:text-blue-400"
                                    onClick={() => handleMoveCol(h, "right")}
                                >
                                    &#x25B6;
                                </span>
                            )}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {(data.Items as TableRow[])
                    // .sort((a, b) => Number(b.id) - Number(a.id))
                    .map((item, idx) => (
                        <tr key={idx} className="flex flex-row">
                            {orderedHeaders.map((h) => (
                                <td
                                    className="border p-0"
                                    key={h}
                                    style={{
                                        flex: columnMap[h]?.colWidth,
                                        minWidth: h === "id" ? 50 : 200,
                                    }}
                                >
                                    {cellRendererToUse(item[h], {
                                        col: h,
                                        row: idx,
                                    })}
                                </td>
                            ))}
                        </tr>
                    ))}
            </tbody>
        </table>
    );
};
