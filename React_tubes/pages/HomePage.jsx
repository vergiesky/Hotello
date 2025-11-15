import React from 'react';


export default function HomePage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-black rounded-sm" />
            <span className="font-semibold text-lg">Hotello</span>
            </div>
            <nav className="flex items-center gap-6 text-slate-700">
            <a className="hover:underline">Explore</a>
            <a className="hover:underline">Stays</a>
            <a className="hover:underline">Attractions</a>
            <a className="hover:underline">Experiences</a>
            <button className="ml-4 bg-emerald-200 text-emerald-800 px-4 py-2 rounded-md">List your place</button>
            </nav>
            </header>


            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Hero */}
                <section className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <div className="relative">
                        <img
                            alt="hero"
                            src="https://images.unsplash.com/photo-1560347876-aeef00ee58a1?auto=format&fit=crop&w=1400&q=60"
                            className="w-full h-72 object-cover"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                        <h1 className="text-4xl font-extrabold drop-shadow-lg">Discover your next stay</h1>
                        <p className="mt-2 drop-shadow">Search for hotels, resorts, and more</p>
                        </div>
                    </div>
                </section>


                {/* Featured stays */}
                <section className="mt-8">
                    <h3 className="font-semibold text-lg mb-4">Featured stays</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                        { title: 'The Grand Oasis', subtitle: 'Luxury in the city', img: 'https://images.unsplash.com/photo-1501117716987-c8e3b7f9b8d6?auto=format&fit=crop&w=600&q=60' },
                        { title: 'Coastal Retreat', subtitle: 'Relax by the sea', img: 'https://images.unsplash.com/photo-1501959915551-4e8b88b6d8f9?auto=format&fit=crop&w=600&q=60' },
                        { title: 'Mountain Haven', subtitle: 'Escape to the mountains', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=60' }
                        ].map((s) => (
                            <div key={s.title} className="bg-white rounded-xl shadow p-3 flex gap-3 items-start">
                                <img src={s.img} className="w-28 h-20 object-cover rounded-md" alt="stay" />
                                <div>
                                    <div className="font-semibold">{s.title}</div>
                                    <div className="text-sm text-slate-400">{s.subtitle}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>


                {/* Popular destinations */}
                <section className="mt-10">
                    <h3 className="font-semibold text-lg mb-4">Popular destinations</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {[
                        { city: 'Paris', img: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=800&q=60' },
                        { city: 'Tokyo', img: 'https://images.unsplash.com/photo-1505765053606-9f1d0c65b0b9?auto=format&fit=crop&w=800&q=60' },
                        { city: 'New York', img: 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=800&q=60' },
                        { city: 'London', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=60' }
                        ].map((d) => (
                            <div key={d.city} className="bg-white rounded-xl overflow-hidden shadow">
                                <img className="w-full h-40 object-cover" src={d.img} alt={d.city} />
                                <div className="p-3 text-center font-medium">{d.city}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}