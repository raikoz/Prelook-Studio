import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, ArrowLeft, Building, Wallet, Smartphone } from 'lucide-react';
import { PaymentItem } from '../types';

interface PaymentScreenProps {
  item: PaymentItem;
  onBack: () => void;
  onSuccess: () => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({ item, onBack, onSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const [method, setMethod] = useState<'CARD' | 'UPI'>('CARD');

  const handlePayment = () => {
    setProcessing(true);
    // Simulate API call
    setTimeout(() => {
        setProcessing(false);
        onSuccess();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white max-w-4xl w-full rounded-3xl shadow-2xl border border-brand-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Summary */}
        <div className="bg-brand-900 text-white p-8 md:w-1/3 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             
             <div className="relative z-10">
                 <button onClick={onBack} className="flex items-center gap-2 text-brand-300 hover:text-white text-sm font-bold uppercase tracking-widest mb-8">
                    <ArrowLeft className="w-4 h-4" /> Cancel
                 </button>
                 
                 <h2 className="font-serif text-3xl mb-1">Order Summary</h2>
                 <p className="text-brand-300 text-sm">Review your purchase details.</p>
                 
                 <div className="mt-8 space-y-4">
                     <div className="flex justify-between items-start border-b border-white/10 pb-4">
                         <div>
                             <p className="font-bold text-lg">{item.name}</p>
                             <p className="text-xs text-brand-300 uppercase tracking-widest">{item.type === 'TIER' ? 'Subscription' : 'Credit Pack'}</p>
                         </div>
                         <p className="font-serif text-xl">₹{item.price}</p>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                         <span className="text-brand-300">Subtotal</span>
                         <span>₹{item.price}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                         <span className="text-brand-300">Tax (18% GST)</span>
                         <span>₹{Math.round(item.price * 0.18)}</span>
                     </div>
                 </div>
             </div>

             <div className="relative z-10 mt-8 pt-8 border-t border-white/20">
                 <div className="flex justify-between items-end">
                     <span className="text-sm font-bold uppercase tracking-widest">Total Pay</span>
                     <span className="font-serif text-4xl">₹{Math.round(item.price * 1.18)}</span>
                 </div>
             </div>
        </div>

        {/* Right: Payment Details */}
        <div className="p-8 md:w-2/3">
             <div className="flex items-center gap-2 mb-8">
                 <Lock className="w-5 h-5 text-green-600" />
                 <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Secure Payment Gateway</span>
             </div>

             <h3 className="font-serif text-2xl text-brand-900 mb-6">Select Payment Method</h3>
             
             <div className="grid grid-cols-2 gap-4 mb-8">
                 <button 
                    onClick={() => setMethod('CARD')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${method === 'CARD' ? 'border-brand-900 bg-brand-50 text-brand-900 ring-1 ring-brand-900' : 'border-brand-200 hover:border-brand-400 text-brand-500'}`}
                 >
                     <CreditCard className="w-8 h-8" />
                     <span className="text-xs font-bold uppercase tracking-widest">Card</span>
                 </button>
                 <button 
                    onClick={() => setMethod('UPI')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${method === 'UPI' ? 'border-brand-900 bg-brand-50 text-brand-900 ring-1 ring-brand-900' : 'border-brand-200 hover:border-brand-400 text-brand-500'}`}
                 >
                     <Smartphone className="w-8 h-8" />
                     <span className="text-xs font-bold uppercase tracking-widest">UPI</span>
                 </button>
             </div>

            {method === 'CARD' && (
                 <div className="space-y-4 animate-fade-in">
                     <div>
                         <label className="block text-xs font-bold uppercase tracking-widest text-brand-500 mb-2">Card Number</label>
                         <div className="relative">
                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:border-brand-900 focus:ring-0 outline-none font-mono" />
                            <div className="absolute right-4 top-3 flex gap-2">
                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                            </div>
                         </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-brand-500 mb-2">Expiry</label>
                            <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:border-brand-900 focus:ring-0 outline-none font-mono" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-brand-500 mb-2">CVC</label>
                            <input type="text" placeholder="123" className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:border-brand-900 focus:ring-0 outline-none font-mono" />
                         </div>
                     </div>
                     <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-brand-500 mb-2">Cardholder Name</label>
                        <input type="text" placeholder="JOHN DOE" className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:border-brand-900 focus:ring-0 outline-none" />
                     </div>
                 </div>
            )}

            {method === 'UPI' && (
                <div className="space-y-4 animate-fade-in">
                     <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-brand-500 mb-2">UPI ID</label>
                        <input type="text" placeholder="username@okhdfcbank" className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:border-brand-900 focus:ring-0 outline-none" />
                     </div>
                     <div className="p-4 bg-brand-50 rounded-xl border border-brand-100 text-center">
                         <p className="text-sm text-brand-600 mb-2">Scan QR to Pay</p>
                         <div className="w-32 h-32 bg-white mx-auto border border-brand-200 flex items-center justify-center">
                             <div className="w-24 h-24 bg-brand-900 opacity-10"></div>
                         </div>
                     </div>
                </div>
            )}

             <button 
                onClick={handlePayment}
                disabled={processing}
                className="w-full mt-8 bg-brand-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl disabled:opacity-70 flex items-center justify-center gap-3"
             >
                {processing ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                    </>
                ) : (
                    <>
                        <ShieldCheck className="w-5 h-5" />
                        Proceed to Payment
                    </>
                )}
             </button>
             
             <div className="mt-4 text-center">
                 <p className="text-[10px] text-brand-400">
                     By continuing, you agree to our Terms of Service. All transactions are encrypted.
                 </p>
             </div>
        </div>
      </div>
    </div>
  );
};