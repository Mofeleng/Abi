import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

export function SocialSignOnButtons() {
    return (
        <Button variant="outline" className="w-full flex items-center gap-1.5 text-foreground">
            <FaGoogle />
            Google
        </Button>
    )
}