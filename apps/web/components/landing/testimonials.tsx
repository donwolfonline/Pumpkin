export function Testimonials() {
    return (
        <section className="py-24 bg-[#0a2c28] border-t border-white/5">
            <div className="mx-auto max-w-7xl px-6 text-center">
                <h2 className="text-2xl font-bold font-heading text-white mb-16 uppercase tracking-[0.3em] opacity-40">Words from the Party</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <TestimonialCard
                        quote="Pumpkin replaced four tools I was using daily. Everything finally feels organized."
                        author="The Consultant"
                        mascot="🦉"
                    />
                    <TestimonialCard
                        quote="I close deals faster and get paid on time. That alone is worth it."
                        author="The Agency Boss"
                        mascot="🐱"
                    />
                    <TestimonialCard
                        quote="It feels calm. That’s rare in business software."
                        author="The Designer"
                        mascot="🕸️"
                    />
                </div>
            </div>
        </section>
    );
}

function TestimonialCard({ quote, author, mascot }: { quote: string, author: string, mascot: string }) {
    return (
        <div className="inset-pod p-8 rounded-[3rem] border border-white/5 hover:scale-105 transition-transform duration-500">
            <div className="text-4xl mb-6">{mascot}</div>
            <p className="text-lg font-medium font-heading leading-relaxed mb-8 text-white italic">
                “{quote}”
            </p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">{author}</p>
        </div>
    )
}
