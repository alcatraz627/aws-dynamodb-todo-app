import { Table } from "@/components/table/table.component";
import { getSchemas, getTableData } from "@/utils/aws/db";
import {
    ParsedTableSchema,
    convertDynamoToJS,
    getTableSchema,
} from "@/utils/aws/parse";
import { Suspense } from "react";

export default async function Page({ params }: { params: { slug: string } }) {
    try {
        const data = await getTableData(params.slug);
        const schemas = await getSchemas();

        const currentSchema = getTableSchema(params.slug, schemas.Items);

        if (!data?.Items?.length) {
            return (
                <div className="text-lg">No data found for {params.slug}</div>
            );
        }

        const parsedData = data.Items.map((row) => {
            return Object.assign(
                {},
                ...Object.entries(row).map(([key, value]) => {
                    const { key: dataType, value: parsedValue } =
                        convertDynamoToJS(value);

                    return {
                        [key]: {
                            type: dataType,
                            value: parsedValue,
                        },
                    };
                })
            );
        });

        return (
            <>
                <div className="flex flex-row justify-between items-center">
                    <div className="text-3xl pb-2">Table {params.slug}</div>
                    <button className="btn btn-wide btn-secondary btn-outline">
                        Create Entry
                    </button>
                </div>
                <hr className="my-2" />
                <Suspense>
                    <Table
                        data={data}
                        schema={currentSchema as unknown as ParsedTableSchema}
                        cellRenderer="dynamo"
                    />
                </Suspense>
                <div className="text-2xl">Data</div>
                <pre>{JSON.stringify(data, undefined, 4)}</pre>
                <hr className="my-2" />

                <div className="text-2xl">Parsed Data</div>
                <pre>{JSON.stringify(parsedData, undefined, 4)}</pre>
                <hr className="my-2" />

                <div className="text-2xl">Current Schema</div>
                <pre>{JSON.stringify(currentSchema, undefined, 4)}</pre>
            </>
        );
    } catch (error) {
        console.error(error);

        return (
            <div>
                <div className="text-2xl">Whoops</div>
                <hr className="my-2" />
                <pre>{JSON.stringify(error, undefined, 4)}</pre>
            </div>
        );
    }
}
