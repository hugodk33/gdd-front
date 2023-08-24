export function MainCtn({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="flex min-h-screen flex-col items-center h-full justify-between content-center flex-wrap p-24">
            {children}
        </main>
    )
}

export function MainCtnHorizontal({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="flex content-start min-h-screen h-full content-top flex-wrap">
            {children}
        </main>
    )
}