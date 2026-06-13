export function AuthCardSeparator() {
    return (
        <div className="flex items-center gap-4 my-6">
        <div className="h-px flex-1 bg-muted" />

        <span className="text-sm text-muted-foreground whitespace-nowrap">
            Or continue with
        </span>

        <div className="h-px flex-1 bg-muted" />
    </div>
    )
}