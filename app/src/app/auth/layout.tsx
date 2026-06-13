export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="h-screen">
            <div className="flex h-full flex-col justify-center items-center">
                { children }
            </div>
        </main>
    )
}