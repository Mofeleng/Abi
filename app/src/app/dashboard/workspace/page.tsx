import { auth } from "@/lib/auth";
import { WorkspaceView } from "@/modules/workspace/ui/views/workspace-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) redirect("/auth/sign-in");
    
    return <WorkspaceView />
}