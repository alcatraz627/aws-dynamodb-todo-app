import { ReactNode } from "react";

export default async function Home({ children }: { children: ReactNode }) {
    return (
        <main className="p-4">
            <div className={`bg-gray-100 m-auto max-w-4xl`}>
                {children}
                {/* <pre>{JSON.stringify(data, undefined, 4)}</pre> */}
            </div>
        </main>
    );
}
