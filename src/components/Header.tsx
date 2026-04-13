import { Link } from 'react-router-dom'

export default function Header() {
    return (
        <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link to="/" className="text-xl font-bold tracking-wide text-white">
                    DevProject
                </Link>

                <nav className="flex items-center gap-6 text-sm text-slate-300">
                    <Link to="/" className="transition hover:text-white">
                        Home
                    </Link>
                    <button className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500">
                        Get Started
                    </button>
                </nav>
            </div>
        </header>
    )
}