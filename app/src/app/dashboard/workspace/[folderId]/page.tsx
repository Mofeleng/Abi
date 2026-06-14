import { auth } from "@/lib/auth";
import { FolderView } from "@/modules/workspace/ui/views/folder-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) redirect("/auth/sign-in");
    
    return <FolderView />
}