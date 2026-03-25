import React from 'react';
import { PatternFormat } from 'react-number-format';
import { FiX, FiCheck, FiCreditCard, FiUser, FiPhone } from 'react-icons/fi';

const CoachPaymentModal = ({ trainer, onClose, onConfirm }) => {
    const [paymentMethod, setPaymentMethod] = React.useState('card');

    if (!trainer) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(); // Вызываем функцию успеха
    };

    return (
        <div className="fixed inset-0 z-[200] overflow-y-auto font-rubik text-white selection:bg-[#c1cf98]/30">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />
            <div className="flex min-h-full items-center justify-center p-8">
                <div className="relative w-full max-w-2xl bg-[#1a1a1a]/90 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[40px] flex flex-col md:flex-row overflow-hidden z-10">

                    <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 text-white/40 hover:text-[#c1cf98] transition-colors">
                        <FiX size={24} />
                    </button>

                    {/* Левая часть: информация о тренере */}
                    <div className="w-full md:w-[45%] p-8 bg-white/5 border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#c1cf98] mb-4">
                            <img src={trainer.img} alt={trainer.name} className="w-full h-full object-cover object-top" />
                        </div>
                        <span className="text-[#c1cf98] text-xs font-medium tracking-wide uppercase">Personal Mentor</span>
                        <h2 className="text-2xl font-bold mt-2 mb-4 leading-tight tracking-tight">
                            {trainer.name} {trainer.surname}
                        </h2>
                        <div className="bg-[#c1cf98]/10 px-4 py-2 rounded-xl border border-[#c1cf98]/20 mb-6">
                            <span className="text-[#c1cf98] font-black">$150.00 / mo</span>
                        </div>
                        <ul className="space-y-3 text-left w-full">
                            {['Personal program', '24/7 Chat support', 'Weekly review'].map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-xs text-white/60">
                                    <FiCheck className="text-[#c1cf98] shrink-0" />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Правая часть: форма */}
                    <div className="flex-1 p-8">
                        <h3 className="text-xl font-bold mb-6 tracking-tight text-[#c1cf98]">Checkout</h3>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                <input type="text" required placeholder="full name" className="w-full bg-white/5 border border-transparent focus:border-[#c1cf98]/50 rounded-2xl py-4 pl-12 pr-4 outline-none text-sm placeholder:text-white/20" />
                            </div>
                            <div className="relative">
                                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                <PatternFormat format="+7 (###) ### ## ##" required placeholder="phone number" className="w-full bg-white/5 border border-transparent focus:border-[#c1cf98]/50 rounded-2xl py-4 pl-12 pr-4 outline-none text-sm text-white placeholder:text-white/20" />
                            </div>
                            <div className="flex bg-white/5 rounded-2xl p-1 gap-1">
                                <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 py-3 rounded-xl text-xs font-medium transition-all ${paymentMethod === 'card' ? 'bg-[#c1cf98] text-black shadow-lg' : 'text-white/40'}`}>
                                    <FiCreditCard className="inline mr-1" /> Card
                                </button>
                                <button type="button" onClick={() => setPaymentMethod('crypto')} className={`flex-1 py-3 rounded-xl text-xs font-medium transition-all ${paymentMethod === 'crypto' ? 'bg-[#c1cf98] text-black shadow-lg' : 'text-white/40'}`}>
                                    Crypto
                                </button>
                            </div>
                            {paymentMethod === 'card' && (
                                <PatternFormat format="#### #### #### ####" required placeholder="card number" className="w-full bg-white/5 border border-transparent focus:border-[#c1cf98]/50 rounded-2xl py-4 px-4 outline-none text-sm tracking-widest placeholder:tracking-normal placeholder:text-white/20" />
                            )}
                            <button type="submit" className="w-full bg-transparent border border-[#c1cf98] text-[#c1cf98] font-bold py-4 rounded-2xl hover:bg-[#c1cf98] hover:text-black transition-all active:scale-95 mt-4">
                                Confirm & Pay
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoachPaymentModal;