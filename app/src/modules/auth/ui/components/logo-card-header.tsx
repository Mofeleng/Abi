"use client";

import { LoaderIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export function LogoCardHeader() {
    const [ logoSrc, setLogoSrc ] = useState<string|null>(null);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        if (resolvedTheme) {
            setLogoSrc(resolvedTheme === "dark" ? "/logo-dark.svg" : "/logo-base.svg");
        } else {
            setLogoSrc("/logo-base.svg")
        }
    }, [resolvedTheme]);

    return (
        <div className="w-full flex justify-center">
            { logoSrc ? (
                <Image
                    src={ logoSrc }
                    alt="Logo image"
                    width={130}
                    height={100}
                />
            ): (
                    <LoaderIcon className="animate-spin" />
                )}  {/* TODO: Use skeleton */}
        </div>
    )
}