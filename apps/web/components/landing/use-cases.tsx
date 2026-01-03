export function UseCases() {
    return (
        <section id="use-cases" className="py-24 bg-[#051c1c] relative">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold font-heading text-white sm:text-5xl mb-4 glow-orange">
                        Who are you?
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    <div className="inset-pod p-10 rounded-[4rem] text-center group hover:scale-105 transition-transform duration-500">
                        <span className="text-8xl mb-6 block filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">🎨</span>
                        <h3 className="text-2xl font-bold font-heading text-white mb-4">The Lone Wolf</h3>
                        <p className="text-zinc-400">Founders running their entire business solo. We handle the boring stuff.</p>
                    </div>

                    <div className="inset-pod p-10 rounded-[4rem] text-center group hover:scale-105 transition-transform duration-500">
                        <span className="text-8xl mb-6 block filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">🏛️</span>
                        <h3 className="text-2xl font-bold font-heading text-white mb-4">The Small Agency</h3>
                        <p className="text-zinc-400">Teams that need one place for clients, projects, and payments.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
