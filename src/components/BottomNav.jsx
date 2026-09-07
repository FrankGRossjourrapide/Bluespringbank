import React from 'react'
import { Home, Send, User, Plus } from 'lucide-react'

export default function BottomNav({ currentView, setCurrentView }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto lg:max-w-none bg-white border-t border-gray-200 px-2 py-2 md:py-3 shadow-lg" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
      <div className="flex justify-around items-center gap-1 md:gap-2">
        <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center justify-center gap-1 px-3 md:px-6 py-2 rounded-lg transition min-h-12 min-w-12 touch:min-h-12 touch:min-w-12 ${currentView === 'home' ? 'bg-blue-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}><Home className="w-5 h-5 md:w-6 md:h-6" /><span className="text-xs font-medium">Home</span></button>
        <button onClick={() => setCurrentView('transfer')} className={`flex flex-col items-center justify-center gap-1 px-3 md:px-6 py-2 rounded-lg transition min-h-12 min-w-12 touch:min-h-12 touch:min-w-12 ${currentView === 'transfer' ? 'bg-blue-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}><Send className="w-5 h-5 md:w-6 md:h-6" /><span className="text-xs font-medium">Transfer</span></button>
        <button onClick={() => setCurrentView('account')} className={`flex flex-col items-center justify-center gap-1 px-3 md:px-6 py-2 rounded-lg transition min-h-12 min-w-12 touch:min-h-12 touch:min-w-12 ${currentView === 'account' ? 'bg-blue-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}><User className="w-5 h-5 md:w-6 md:h-6" /><span className="text-xs font-medium">Account</span></button>
        <button onClick={() => setCurrentView('deposit')} className={`flex flex-col items-center justify-center gap-1 px-3 md:px-6 py-2 rounded-lg transition min-h-12 min-w-12 touch:min-h-12 touch:min-w-12 ${currentView === 'deposit' ? 'bg-blue-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}><Plus className="w-5 h-5 md:w-6 md:h-6" /><span className="text-xs font-medium">Deposit</span></button>
        <button onClick={() => setCurrentView('profile-settings')} className="flex flex-col items-center justify-center gap-1 px-3 md:px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition min-h-12 min-w-12 touch:min-h-12 touch:min-w-12"><User className="w-5 h-5 md:w-6 md:h-6" /><span className="text-xs font-medium">Profile</span></button>
      </div>
    </div>
  )
}
