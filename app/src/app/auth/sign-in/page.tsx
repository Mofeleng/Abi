import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign in"
}

export default function Page() {
    return <SignInView />
}