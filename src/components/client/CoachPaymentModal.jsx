import React from 'react';
import { PatternFormat } from 'react-number-format';
import { FiX, FiCheck, FiCreditCard, FiMapPin, FiUser, FiPhone } from 'react-icons/fi';
import useStore from '../../store/useStore.js';
import { createPayment } from '../../utils/adminApi.js';

const CoachPaymentModal = ({ trainer, onClose, onConfirm }) => {
    const [paymentMethod, setPaymentMethod] = React.useState('card');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState('');
    const currentUser = useStore((state) => state.currentUser);

    if (!trainer) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const memberId = currentUser?.id || localStorage.getItem('userId');
            if (!memberId) {
                throw new Error('Please log in before paying for mentor access.');
            }

            const response = await createPayment({
                subscriptionId: Number(trainer.id),
                memberId: Number(memberId),
                amount: 150,
                currency: 'USD',
                method: paymentMethod === 'office' ? 'CASH' : 'CARD'
            });

            await onConfirm(response.data);
        } catch (paymentError) {
            setError(paymentError.response?.data?.message || paymentError.message || 'Payment could not be completed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] overflow-y-auto font-rubik text-white selection:bg-[#c1cf98]/30">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />
            <div className="flex min-h-full items-center justify-center p-8">
                <div className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-[40px] border border-white/10 bg-[#1a1a1a]/90 shadow-2xl backdrop-blur-2xl md:flex-row">
                    <button onClick={onClose} className="absolute right-6 top-6 z-20 p-2 text-white/40 transition-colors hover:text-[#c1cf98]">
                        <FiX size={24} />
                    </button>

                    <div className="flex w-full flex-col items-center border-b border-white/5 bg-white/5 p-8 text-center md:w-[45%] md:border-b-0 md:border-r">
                        <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-[#c1cf98]">
                            <img src={trainer.img} alt={trainer.name} className="h-full w-full object-cover object-top" />
                        </div>
                        <span className="text-xs font-medium uppercase tracking-wide text-[#c1cf98]">Personal Mentor</span>
                        <h2 className="mb-4 mt-2 text-2xl font-bold leading-tight tracking-tight">
                            {trainer.name} {trainer.surname}
                        </h2>
                        <div className="mb-6 rounded-xl border border-[#c1cf98]/20 bg-[#c1cf98]/10 px-4 py-2">
                            <span className="font-black text-[#c1cf98]">$150.00 / mo</span>
                        </div>
                        <ul className="w-full space-y-3 text-left">
                            {['Personal program', '24/7 Chat support', 'Weekly review'].map((feature) => (
                                <li key={feature} className="flex items-center gap-3 text-xs text-white/60">
                                    <FiCheck className="shrink-0 text-[#c1cf98]" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex-1 p-8">
                        <h3 className="mb-6 text-xl font-bold tracking-tight text-[#c1cf98]">Checkout</h3>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                <input type="text" required placeholder="full name" className="w-full rounded-2xl border border-transparent bg-white/5 py-4 pl-12 pr-4 text-sm outline-none placeholder:text-white/20 focus:border-[#c1cf98]/50" />
                            </div>
                            <div className="relative">
                                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                <PatternFormat format="+7 (###) ### ## ##" required placeholder="phone number" className="w-full rounded-2xl border border-transparent bg-white/5 py-4 pl-12 pr-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#c1cf98]/50" />
                            </div>
                            <div className="flex gap-1 rounded-2xl bg-white/5 p-1">
                                <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 rounded-xl py-3 text-xs font-medium transition-all ${paymentMethod === 'card' ? 'bg-[#c1cf98] text-black shadow-lg' : 'text-white/40'}`}>
                                    <FiCreditCard className="mr-1 inline" /> Card
                                </button>
                                <button type="button" onClick={() => setPaymentMethod('office')} className={`flex-1 rounded-xl py-3 text-xs font-medium transition-all ${paymentMethod === 'office' ? 'bg-[#c1cf98] text-black shadow-lg' : 'text-white/40'}`}>
                                    <FiMapPin className="mr-1 inline" /> Office
                                </button>
                            </div>
                            {paymentMethod === 'card' && (
                                <PatternFormat format="#### #### #### ####" required placeholder="card number" className="w-full rounded-2xl border border-transparent bg-white/5 px-4 py-4 text-sm tracking-widest outline-none placeholder:tracking-normal placeholder:text-white/20 focus:border-[#c1cf98]/50" />
                            )}
                            {error && (
                                <div className="rounded-2xl border border-red-300/25 bg-red-400/10 px-4 py-3 text-xs font-bold text-red-100">
                                    {error}
                                </div>
                            )}
                            <button type="submit" disabled={isSubmitting} className="mt-4 w-full rounded-2xl border border-[#c1cf98] bg-transparent py-4 font-bold text-[#c1cf98] transition-all hover:bg-[#c1cf98] hover:text-black active:scale-95 disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-[#c1cf98]">
                                {isSubmitting ? 'Processing...' : 'Confirm & Pay'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoachPaymentModal;
