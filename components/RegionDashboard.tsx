import React from 'react';
import { User, PaymentItem } from '../types';
import { Map, TrendingUp, Users, DollarSign, Activity, PieChart, ArrowUpRight, Wallet, Plus } from 'lucide-react';

interface RegionDashboardProps {
  user: User;
  onLogout: () => void;
  onTopUp: (item: PaymentItem) => void;
}

export const RegionDashboard: React.FC<RegionDashboardProps> = ({ user, onLogout, onTopUp }) => {
  // Mock Data for Regional Insights
  const stats = [
    { label: 'Total Revenue', value: '₹12.4M', change: '+12%', icon: DollarSign, color: 'text-green-600' },
    { label: 'Active Salons', value: '18', change: '+2', icon: Map, color: 'text-brand-600' },
    { label: 'Total Customers', value: '3,240', change: '+5%', icon: Users, color: 'text-blue-600' },
    { label: 'Avg. Rating', value: '4.7', change: '+0.1', icon: Activity, color: 'text-yellow-600' },
  ];

  const topSalons = [
    { name: 'Luxe Studio - Saheed Nagar', revenue: '₹4.2M', growth: '+15%', status: 'Excellent' },
    { name: 'Prelook X - Esplanade', revenue: '₹3.8M', growth: '+8%', status: 'Good' },
    { name: 'Urban Cuts - Patia', revenue: '₹2.1M', growth: '-2%', status: 'Attention Needed' },
    { name: 'Style Hub - Cuttack', revenue: '₹1.8M', growth: '+5%', status: 'Good' },
  ];

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col">
       {/* Region Header */}
        <div className="bg-white border-b border-brand-200 p-6 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-brand-900 text-white w-10 h-10 rounded-xl flex items-center justify-center">
                        <PieChart className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-serif text-xl text-brand-900 font-bold">Odisha Region Insight</h1>
                        <p className="text-xs text-brand-500 uppercase tracking-wider">Franchise HQ</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-brand-900">{user.name}</p>
                        <p className="text-xs text-brand-500">Regional Director</p>
                    </div>
                    <button onClick={onLogout} className="px-4 py-2 bg-brand-100 hover:bg-brand-200 text-brand-800 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
                        Logout
                    </button>
                </div>
            </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-brand-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold uppercase text-brand-400 tracking-widest">{stat.label}</span>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <div>
                                <span className="text-3xl font-serif text-brand-900 font-medium block">{stat.value}</span>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block mt-2">
                                    {stat.change} vs last month
                                </span>
                            </div>
                        </div>
                    ))}
                    
                    {/* Franchise Fund Card */}
                    <div className="bg-brand-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                         <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold uppercase text-brand-300 tracking-widest">Franchise Fund</span>
                            <Wallet className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-serif font-medium">₹850k</span>
                            <button 
                                onClick={() => onTopUp({ type: 'FUND', name: 'Operational Fund Deposit', price: 50000 })}
                                className="w-8 h-8 rounded-full bg-white text-brand-900 flex items-center justify-center hover:bg-brand-100 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Performance Table */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-brand-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-brand-100 flex items-center justify-between">
                            <h3 className="font-serif text-xl text-brand-900">Salon Performance</h3>
                            <button className="text-brand-500 hover:text-brand-900 text-xs font-bold uppercase tracking-wider">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-brand-50 text-brand-500 font-bold uppercase text-xs tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Salon Name</th>
                                        <th className="px-6 py-4">Revenue (YTD)</th>
                                        <th className="px-6 py-4">Growth</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-100">
                                    {topSalons.map((salon, i) => (
                                        <tr key={i} className="hover:bg-brand-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-brand-900">{salon.name}</td>
                                            <td className="px-6 py-4 text-brand-600">{salon.revenue}</td>
                                            <td className={`px-6 py-4 font-bold ${salon.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{salon.growth}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold uppercase
                                                    ${salon.status === 'Excellent' ? 'bg-green-100 text-green-700' : 
                                                      salon.status === 'Good' ? 'bg-blue-100 text-blue-700' : 
                                                      'bg-yellow-100 text-yellow-700'}
                                                `}>
                                                    {salon.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* AI Insights Panel */}
                    <div className="bg-brand-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
                         <div className="absolute top-0 right-0 p-6 opacity-5">
                             <TrendingUp className="w-40 h-40" />
                         </div>
                         
                         <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-white/20 p-1.5 rounded-lg">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-brand-200">AI Forecast</span>
                            </div>
                            <h3 className="font-serif text-2xl mb-4">Summer Surge Predicted</h3>
                            <p className="text-brand-300 text-sm leading-relaxed mb-6">
                                Based on last year's data and current booking trends, expect a 25% increase in "Short Bob" styling requests across Bhubaneswar salons in May.
                            </p>
                         </div>

                         <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                             <p className="text-xs font-bold text-brand-200 uppercase tracking-widest mb-1">Recommended Action</p>
                             <p className="text-sm font-medium">Stock up on volumizing products and run a "Summer Fresh" campaign.</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};