export default function ProjectLoading() {
    return (
        <section
            aria-label="Chargement du projet"
            aria-busy="true"
            className="mx-auto w-full max-w-300 px-5 py-10 md:px-0 md:py-14"
        >
            <div className="animate-pulse">
                <div className="flex items-start gap-4">
                    <div className="size-11 rounded-lg bg-[#dfe3e8]" />
                    <div className="flex-1">
                        <div className="h-7 w-56 rounded bg-[#dfe3e8]" />
                        <div className="mt-3 h-4 max-w-xl rounded bg-[#e8eaed]" />
                    </div>
                </div>
                <div className="mt-9 h-18 rounded-lg bg-[#e8eaed]" />
                <div className="mt-7 rounded-lg border border-[#dfe3e8] bg-white p-8">
                    <div className="h-6 w-24 rounded bg-[#dfe3e8]" />
                    <div className="mt-9 flex flex-col gap-4">
                        {Array.from({ length: 3 }, (_, index) => (
                            <div
                                key={index}
                                className="h-52 rounded-lg border border-[#e5e7eb] bg-[#fafafa]"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
