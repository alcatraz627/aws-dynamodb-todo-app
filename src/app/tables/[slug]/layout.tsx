import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
    return (
        <main className="p-4">
            <div className="bg-gray-50 m-auto p-6">{children}</div>
        </main>
    );
}
