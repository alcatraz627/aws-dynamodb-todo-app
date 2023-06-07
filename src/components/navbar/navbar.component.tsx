import Link from "next/link";
import { ReactNode } from "react";

export interface NavbarProps {
    links: {
        href: string;
        content?: ReactNode;
    }[];
    title: string;
}

export const Navbar = ({ links, title }: NavbarProps) => {
    return (
        // <nav className="w-full text-white bg-blue-700 bg-opacity-80 p-4 border-0 border-purple-700 border-solid border-opacity-50">
        <nav className="navbar bg-blue-700 text-white w-100 bg-opacity-80 flex-row justify-between px-4">
            <a href="/" className="text-2xl">
                {title}
            </a>
            <div className="flex">
                {links.map(({ href, content }) => (
                    <Link
                        key={href}
                        title={href}
                        href={href}
                        className="link mx-2 no-underline"
                        // className="border border-transparent hover:border-white border-solid px-2 py-1 rounded"
                    >
                        {content}
                    </Link>
                ))}
            </div>
        </nav>
    );
};
