import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Check, Circle, Clock, CheckCircle2, MapPin, X } from 'lucide-react'; 

// --- CONFIGURATION ---
const BINGO_ITEMS = [
  { id: 1, text: "Matcha + Activewear Combo" },
  { id: 2, text: "Matcha photo before first sip" },
  { id: 3, text: "Matcha photo (different angle)" },
  { id: 4, text: "Overheard: 'Manifesting'" },
  { id: 5, text: "Matcha + Pastry (The Upsell)" }
];

// --- SUB-COMPONENT: HARRY'S TICKET ---
// Now accepts an 'onClose' prop to exit the screen
function HarrysTicket({ onClose }: { onClose: () => void }) {
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-sm border border-stone-200 animate-in zoom-in duration-300 relative">
      
      {/* --- CLOSE BUTTON (ADDED) --- */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-1 rounded-full bg-black/10 hover:bg-black/20 text-white transition-all backdrop-blur-sm"
      >
        <X className="w-4 h-4" />
      </button>

      {/* 1. HOLOGRAPHIC HEADER */}
      <div className="bg-teal-800 p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-800 via-emerald-600 to-teal-800 opacity-80 animate-pulse" />
        
        <div className="relative z-10">
          <h2 className="text-white/80 text-[10px] font-bold tracking-[0.3em] uppercase mb-1">
            Official Winner
          </h2>
          <h1 className="text-3xl font-black text-white tracking-tighter">
            HARRY'S
          </h1>
          <div className="mt-2 inline-flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-white text-[10px] font-medium">
            <CheckCircle2 className="w-3 h-3" /> Verified Spotter
          </div>
        </div>
      </div>

      {/* 2. TICKET BODY */}
      <div className="p-6 flex flex-col items-center text-center bg-[#FFFBEB]">
        
        <div className="space-y-1 mb-6">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">REWARD UNLOCKED</p>
          <p className="text-4xl font-bold text-teal-900">$4 MATCHA</p>
          <p className="text-xs text-teal-800/60 font-medium">+ Priority Seating</p>
        </div>

        {/* 3. THE CODE */}
        <div className="w-full bg-white border-2 border-dashed border-stone-300 rounded-xl p-4 mb-4 relative">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FFFBEB] rounded-full border-r border-stone-300" />
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FFFBEB] rounded-full border-l border-stone-300" />
            
            <p className="text-[10px] text-stone-400 mb-1 uppercase">Show to Staff</p>
            <p className="text-2xl font-mono font-bold text-stone-800 tracking-widest">
              HARRY-882
            </p>
        </div>

        {/* 4. TIMER */}
        <div className="flex items-center gap-2 text-red-500 font-mono text-xs font-bold animate-pulse">
          <Clock className="w-3 h-3" />
          Expires in: {formatTime(timeLeft)}
        </div>

        <div className="mt-6 pt-4 border-t border-stone-200/50 w-full flex items-center justify-center gap-2 text-stone-400">
           <MapPin className="w-3 h-3" />
           <span className="text-[10px]">2/136 Wairoa Ave, Bondi Beach</span>
        </div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export function MatchaBingoCard() {
  const [checked, setChecked] = useState<number[]>([]);
  const [isRedeemed, setIsRedeemed] = useState(false);

  const toggleItem = (id: number) => {
    // If ticket is open, don't toggle items. 
    // But if they closed the ticket, they can interact again (or just see the list)
    if (isRedeemed) return;

    if (checked.includes(id)) {
      setChecked(checked.filter(i => i !== id));
    } else {
      setChecked([...checked, id]);
    }
  };

  const isWinner = checked.length === BINGO_ITEMS.length;

  // IF REDEEMED: Show the Harry's Ticket
  // We pass a function to 'turn off' the redeemed state
  if (isRedeemed) {
    return <HarrysTicket onClose={() => setIsRedeemed(false)} />;
  }

  // ELSE: Show the Bingo Game
  return (
    <Card className="w-full h-full shadow-lg border-2 border-white/50 bg-white/80 backdrop-blur-md overflow-hidden relative">
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
             <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary">
               🍵 Matcha Bingo
             </CardTitle>
             <CardDescription className="opacity-80 text-xs">
               Sponsored by <strong>Harry's Bondi</strong>
             </CardDescription>
          </div>
          <div className="text-xs font-mono border border-current px-2 py-1 rounded-full opacity-70">
            {checked.length}/5
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {BINGO_ITEMS.map((item) => {
          const isChecked = checked.includes(item.id);
          return (
            <div 
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`
                flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all duration-300
                ${isChecked 
                  ? 'bg-primary/10 border-primary translate-x-1' 
                  : 'hover:bg-black/5 border-transparent opacity-70 hover:opacity-100'
                }
              `}
            >
              {isChecked ? (
                <div className="bg-primary text-white rounded-full p-0.5 animate-in zoom-in">
                  <Check className="w-3 h-3" strokeWidth={4} />
                </div>
              ) : (
                <Circle className="w-5 h-5 opacity-30" />
              )}
              <span className={`text-sm font-medium ${isChecked ? 'line-through opacity-50' : ''}`}>
                {item.text}
              </span>
            </div>
          );
        })}
      </CardContent>

      <CardFooter className="pt-2 pb-6">
        {isWinner ? (
          <button 
            onClick={() => setIsRedeemed(true)}
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-md animate-in slide-in-from-bottom-2 shadow-xl transform hover:scale-[1.02] transition-all"
          >
            🎉 REDEEM AT HARRY'S
          </button>
        ) : (
          <div className="w-full text-center text-[10px] opacity-40 italic uppercase tracking-wider">
            Spot all 5 items to unlock
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
