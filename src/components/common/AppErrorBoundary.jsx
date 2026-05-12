import React from 'react';

class AppErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error('App crashed:', error, info);
    }

    render() {
        if (this.state.error) {
            return (
                <main className="flex min-h-screen items-center justify-center bg-[#080b0d] px-5 font-rubik text-white">
                    <section className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/[0.04] p-6 text-center shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
                        <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#c1cf98]">HeroFit error</p>
                        <h1 className="mt-3 text-2xl font-black text-white">Something crashed on this page</h1>
                        <p className="mt-3 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-left text-sm text-red-100">
                            {this.state.error.message || 'Unknown frontend error'}
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-5 rounded-2xl bg-[#c1cf98] px-5 py-3 font-bold text-black transition-all hover:bg-[#d4dfb2]"
                        >
                            Reload
                        </button>
                    </section>
                </main>
            );
        }

        return this.props.children;
    }
}

export default AppErrorBoundary;
