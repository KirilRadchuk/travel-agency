import Header from "@/components/templates/header";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-muted">
            <Header />
            <main className="container grow mx-auto p-4">
                {children}
            </main>
        </div>
    )
}