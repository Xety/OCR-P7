export default function ProjectsLoading() {
    return (
        <section
            aria-label="Chargement des projets"
            aria-busy="true"
            className="mx-auto w-full max-w-300 px-5 py-12 md:px-0 md:py-16"
        >
            <div className="flex items-start justify-between gap-6">
                <div className="animate-pulse">
                    <div className="h-6 w-32 rounded bg-[#e4e7eb]" />
                    <div className="mt-3 h-4 w-28 rounded bg-[#e4e7eb]" />
                </div>
                <div className="h-11 w-38 animate-pulse rounded-lg bg-[#d9dde2]" />
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                    <div
                        key={index}
                        className="min-h-80 animate-pulse rounded-lg border border-[#dfe3e8] bg-white p-7"
                    >
                        <div className="h-5 w-2/5 rounded bg-[#e4e7eb]" />
                        <div className="mt-4 h-4 w-full rounded bg-[#eceef1]" />
                        <div className="mt-2 h-4 w-4/5 rounded bg-[#eceef1]" />
                        <div className="mt-14 h-2 w-full rounded bg-[#e4e7eb]" />
                        <div className="mt-16 h-4 w-24 rounded bg-[#eceef1]" />
                    </div>
                ))}
            </div>
        </section>
    );
}
