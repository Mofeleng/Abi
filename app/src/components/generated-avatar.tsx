import { Avatar as createdAvatar, Style } from "@dicebear/core";
import notionists from "@dicebear/styles/notionists.json" with { type: 'json' };
import initials from "@dicebear/styles/initials.json" with { type: 'json' };

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
interface GeneratedAvatarProps {
    seed: string;
    className?: string;
    variant: "notionists" | "initials";
}

export function GeneratedAvatar({ seed, className, variant }:GeneratedAvatarProps) {
    let avatar;
    let style;

    if (variant === "notionists") {
        style = new Style(notionists);
        avatar = new createdAvatar(style, {
            seed
        });
    } else {
        style = new Style(initials);
        avatar = new createdAvatar(style, {
            seed,
            fontWeight: 500,
            size: 42
        })
    }

    return (
        <Avatar className={cn(className)}>
            <AvatarImage src={avatar.toDataUri()} alt="Generated avatar for user image" />
            <AvatarFallback>
                { seed.at(0)?.toUpperCase() }
            </AvatarFallback>
        </Avatar>
    )
}