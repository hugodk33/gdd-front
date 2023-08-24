export default function Content({
    children,
}: {
    children: React.ReactNode
}) {
    return (
      <section className="p-1 mb-40 sm:w-full md:w-9/12">
        <div className="bg-white rounded p-4">
            { children }
        </div>
      </section>
    )
}