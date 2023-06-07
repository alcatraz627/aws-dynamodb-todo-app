import { getSchemas } from "@/utils/aws/db";
import { convertDynamoToJS } from "@/utils/aws/parse";
import { useEffect } from "react";

const Page = async () => {
    const { Items = [] } = await getSchemas();

    const Schemas = Items.map((item) => {
        const id = item.id.S;

        const schema = item.schema.L?.map((v) => {
            const name = v.M?.key.S;
            const type = v.M?.type.S;

            return { name, type };
        });

        return { id, schema };
    });

    console.log({ Items });

    // console.log({ parsed: Items.map(convertDynamoToJS) });

    return (
        <main className="p-4">
            <div className={`m-auto max-w-4xl`}>
                <h3 className="text-3xl">Schemas</h3>
                <ul className="rounded-box py-4 my-4 w-full h-full border border-style-solid border-blue-300 bg-base-100">
                    {Schemas.map((item) => (
                        <li
                            key={item.id}
                            className="text-lg flex flex-col items-start px-8 hover:bg-base-100"
                        >
                            <div className="py-2">
                                <div className="text-xl font-semibold text-left">
                                    {item.id}
                                </div>
                                <div className="font-mono text-sm py-2">
                                    {item.schema
                                        ?.map((i) => `${i.name}(${i.type})`)
                                        .join("|")}
                                </div>
                            </div>
                            <div className="btn-group w-full">
                                <a
                                    className="btn btn-outline btn-sm"
                                    href={`/tables/${item.id}`}
                                >
                                    View Table
                                </a>
                                <a
                                    className="btn btn-outline btn-sm"
                                    href={`/schemas/${item.id}`}
                                >
                                    View Schema
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
                <hr />
                {/* <pre>{JSON.stringify(Items, undefined, 4)}</pre> */}
            </div>
        </main>
    );
};

export default Page;
