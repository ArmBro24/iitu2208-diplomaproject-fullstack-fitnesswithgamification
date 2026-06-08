import React from 'react';
import { PatternFormat } from 'react-number-format';
import { FiX, FiCheck, FiCreditCard, FiMapPin, FiUser, FiPhone } from 'react-icons/fi';
import useStore from '../../store/useStore';
import { createPayment } from '../../utils/adminApi.js';

const SubscriptionModal = ({ sub, onClose }) => {
    const [paymentMethod, setPaymentMethod] = React.useState('card');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState('');
    const setSubscription = useStore((state) => state.setSubscription);
    const currentUser = useStore((state) => state.currentUser);

    if (!sub) return null;

    const handlePurchase = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const memberId = currentUser?.id || localStorage.getItem('userId');

            if (!memberId) {
                throw new Error('Please log in before buying a membership.');
            }

            const response = await createPayment({
                subscriptionId: sub.id,
                memberId: Number(memberId),
                amount: parsePrice(sub.price),
                currency: 'KZT',
                method: paymentMethod === 'office' ? 'CASH' : 'CARD'
            });

            const newSubscription = {
                subId: sub.id,
                status: response.data?.status === 'SUCCESS' ? 'active' : 'pending',
                paymentId: response.data?.id ?? null
            };

            setSubscription(newSubscription);

            console.log('Payment created:', response.data);
            console.log('Store updated with:', newSubscription);

            onClose();
        } catch (purchaseError) {
            setError(purchaseError.response?.data?.message || purchaseError.message || 'Payment could not be created.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] overflow-y-auto font-rubik text-white selection:bg-[#c1cf98]/30">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />

            <div className="flex min-h-full items-center justify-center p-8 md:p-12">
                <div className="relative w-full max-w-2xl bg-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[32px] md:rounded-[40px] flex flex-col md:flex-row overflow-hidden z-10 animate-in zoom-in duration-300">

                    <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 text-white/40 hover:text-[#c1cf98] transition-colors">
                        <FiX size={24} />
                    </button>

                    <div className="w-full md:w-[45%] p-8 bg-white/5 border-b md:border-b-0 md:border-r border-white/5">
                        <span className="text-[#c1cf98] text-xs font-medium tracking-wide">{sub.desc}</span>
                        <h2 className="text-3xl font-bold mt-2 mb-6 leading-tight tracking-tight">{sub.title}</h2>
                        <ul className="space-y-4 mb-8">
                            {sub.features?.map((f, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                                    <FiCheck className="text-[#c1cf98] mt-1 shrink-0" />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex-1 p-8">
                        <h3 className="text-xl font-bold mb-6 tracking-tight text-[#c1cf98]">Checkout</h3>

                        <form className="space-y-5" onSubmit={handlePurchase}>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                <input required type="text" placeholder="full name" className="w-full bg-white/5 border border-transparent focus:border-[#c1cf98]/50 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all text-sm placeholder:text-white/20" />
                            </div>

                            <div className="relative">
                                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                <PatternFormat format="+7 (###) ### ## ##" allowEmptyFormatting={false} mask="_" placeholder="phone number" className="w-full bg-white/5 border border-transparent focus:border-[#c1cf98]/50 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all text-sm text-white placeholder:text-white/20" required />
                            </div>

                            <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5 gap-1">
                                <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all font-medium text-xs ${paymentMethod === 'card' ? 'bg-[#c1cf98] text-black shadow-lg shadow-[#c1cf98]/10' : 'text-white/40 hover:text-white'}`}>
                                    <FiCreditCard size={14}/> Card
                                </button>
                                <button type="button" onClick={() => setPaymentMethod('office')} className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all font-medium text-xs ${paymentMethod === 'office' ? 'bg-[#c1cf98] text-black shadow-lg shadow-[#c1cf98]/10' : 'text-white/40 hover:text-white'}`}>
                                    <FiMapPin size={14}/> Office
                                </button>
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <PatternFormat format="#### #### #### ####" placeholder="card number" className="w-full bg-white/5 border border-transparent focus:border-[#c1cf98]/50 rounded-2xl py-4 px-4 outline-none transition-all text-sm tracking-widest placeholder:tracking-normal placeholder:text-white/20" required />
                                </div>
                            )}

                            {error && (
                                <div className="rounded-2xl border border-red-300/25 bg-red-400/10 px-4 py-3 text-xs font-bold text-red-100">
                                    {error}
                                </div>
                            )}

                            <div className="pt-4">
                                <button type="submit" disabled={isSubmitting} className="w-full bg-transparent border border-[#c1cf98] text-[#c1cf98] font-bold py-4 rounded-2xl hover:bg-[#c1cf98] hover:text-black transition-all duration-300 transform active:scale-[0.98] tracking-tight disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-[#c1cf98]">
                                    {isSubmitting ? 'Creating payment...' : `Buy membership - ${sub.price}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const parsePrice = (price) => Number(String(price).replace(/[^\d]/g, ''));

export default SubscriptionModal;
