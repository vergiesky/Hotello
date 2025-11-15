import React, { useState } from 'react';


export default function SignInPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        // placeholder: panggil API login
        alert(`Masuk: ${form.email}`);
    };


    return (
        <div className="min-h-screen bg-slate-50 flex items-start">
            <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
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
            <main className="w-full max-w-md mx-auto px-6 py-6">
                <h1 className="text-center text-3xl font-extrabold mb-8">Welcome to StayScape</h1>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow">
                    <label className="block mb-4">
                        <div className="text-sm font-medium mb-2">Email</div>
                        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border rounded-lg px-4 py-3 text-sm bg-slate-50" />
                    </label>

                    <label className="block mb-6 flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium mb-2">Password</div>
                        </div>
                        <a href="#" className="text-sm text-sky-500">Forgot password?</a>
                        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full border rounded-lg px-4 py-3 text-sm bg-slate-50 mt-2" />
                    </label>

                    <button className="w-full bg-sky-300 text-slate-900 py-3 rounded-lg font-semibold">Sign In</button>


                    <div className="text-center my-4 text-slate-400">OR</div>


                    <button type="button" className="w-full border rounded-lg py-3 flex items-center justify-center gap-3">
                        <img src="https://www.gstatic.com/images/branding/product/1x/google_favicon_32dp.png" alt="g" className="w-5 h-5" />
                        Continue with Google
                    </button>


                    <div className="text-center mt-4 text-sm text-slate-400">Don\'t have an account? <a href="#" className="text-sky-500">Sign Up</a></div>
                </form>
            </main>
        </div>
    );
}