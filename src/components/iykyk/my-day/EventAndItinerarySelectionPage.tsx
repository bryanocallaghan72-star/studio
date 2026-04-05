'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { appData, type ItineraryOption } from '@/lib/data';

type EventAndItinerarySelectionPageProps = {
    onSelectVibe: (option: any) => void;
};

export const EventAndItinerarySelectionPage = ({ onSelectVibe }: EventAndItinerarySelectionPageProps) => {
    const [activeTab, setActiveTab] = useState('solo');

    return (
        <motion.div
            key="selector"
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full bg-[#f2ece0] overflow-y-auto p-6 text-center"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="w-6"></div>
                <h2 className="text-2xl font-bold text-[#1a1208] flex-grow text-center">Plan My Day or Event</h2>
                <div className="w-6"></div>
            </div>
            
            {/* Toggle Switch */}
            <div className="flex justify-center mb-8 w-full max-w-sm bg-[rgba(26,18,8,0.06)] rounded-full p-1.5 shadow-inner mx-auto border border-black/[0.03]">
                <button 
                    className={`flex-1 px-4 py-2.5 rounded-full text-[13px] font-bold transition-all duration-300 ${activeTab === 'solo' ? 'bg-white border border-black/5 text-[#1a1208] shadow-sm' : 'text-[rgba(26,18,8,0.40)]'}`} 
                    onClick={() => setActiveTab('solo')}
                >
                    Solo Itinerary
                </button>
                <button 
                    className={`flex-1 px-4 py-2.5 rounded-full text-[13px] font-bold transition-all duration-300 ${activeTab === 'group' ? 'bg-white border border-black/5 text-[#1a1208] shadow-sm' : 'text-[rgba(26,18,8,0.40)]'}`} 
                    onClick={() => setActiveTab('group')}
                >
                    Plan an Event
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeTab === 'solo' ? (appData.mapMyDayOptions.map((option: ItineraryOption) => (
                    <Card key={option.id} className="rounded-2xl p-6 border border-black/[0.08] bg-white shadow-sm flex flex-col items-center justify-between text-center transition-all hover:shadow-md hover:-translate-y-0.5">
                        <CardHeader className="p-0">
                            <CardTitle className="text-lg font-bold text-[#1a1208]">{option.title}</CardTitle>
                            <CardDescription className="text-[13px] mt-1 text-[rgba(26,18,8,0.50)] leading-relaxed">{option.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 mt-6 w-full">
                            <Button onClick={() => onSelectVibe(option)} className="w-full font-bold rounded-2xl bg-[#c4762a] text-white hover:bg-[#b06824] shadow-lg shadow-[#c4762a]/15 h-12">
                                View Itinerary
                            </Button>
                        </CardContent>
                    </Card>
                ))) : (appData.groupEventsOptions.map((option: ItineraryOption) => (
                    <Card key={option.id} className="rounded-2xl p-6 border border-black/[0.08] bg-white shadow-sm flex flex-col items-center justify-between text-center transition-all hover:shadow-md hover:-translate-y-0.5">
                        <CardHeader className="p-0">
                            <CardTitle className="text-lg font-bold text-[#1a1208]">{option.title}</CardTitle>
                            <CardDescription className="text-[13px] mt-1 text-[rgba(26,18,8,0.50)] leading-relaxed">{option.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 mt-6 w-full">
                            <Button onClick={() => onSelectVibe(option)} className="w-full font-bold rounded-2xl bg-[#c4762a] text-white hover:bg-[#b06824] shadow-lg shadow-[#c4762a]/15 h-12">
                                View Itinerary
                            </Button>
                        </CardContent>
                    </Card>
                )))}
            </div>
        </motion.div>
    );
};