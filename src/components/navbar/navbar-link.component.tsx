/* eslint-disable @next/next/no-img-element */
import { cx } from "@/utils/style";
import { FunctionComponent, ReactNode } from "react";

export interface NavbarLinkProps {
    iconUrl: string;
    text: string;
    iconProps?: {
        className?: string;
    };
}

export const NavbarLink: FunctionComponent<NavbarLinkProps> = ({
    iconUrl,
    text,
    iconProps,
}) => {
    return (
        <div className="flex flex-row items-center">
            {iconUrl && (
                <img
                    alt=""
                    src={iconUrl}
                    className={cx(
                        "text-white inline-block invert mr-1",
                        iconProps?.className
                    )}
                />
            )}
            <span>{text}</span>
        </div>
    );
};
