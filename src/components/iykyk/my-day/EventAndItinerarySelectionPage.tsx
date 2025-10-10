
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { appData } from '@/lib/data';

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
            className="flex flex-col h-full bg-background overflow-y-auto p-6 text-center"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="w-6"></div>
                <h2 className="text-2xl font-bold text-foreground flex-grow text-center">Plan My Day or Event</h2>
                <div className="w-6"></div>
            </div>
            <div className="flex justify-center mb-6 w-full max-w-sm bg-card rounded-full p-2 shadow-inner mx-auto">
                <button 
                    className={`flex-1 px-4 py-2 rounded-full font-semibold transition-colors ${activeTab === 'solo' ? 'bg-primary text-primary-foreground' : 'text-secondary-foreground'}`} 
                    onClick={() => setActiveTab('solo')}
                >
                    Solo Itinerary
                </button>
                <button 
                    className={`flex-1 px-4 py-2 rounded-full font-semibold transition-colors ${activeTab === 'group' ? 'bg-primary text-primary-foreground' : 'text-secondary-foreground'}`} 
                    onClick={() => setActiveTab('group')}
                >
                    Plan an Event
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeTab === 'solo' ? (appData.mapMyDayOptions.map(option => (
                    <Card key={option.id} className="rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between text-center transition-all hover:shadow-2xl hover:-translate-y-1">
                        <CardHeader className="p-0">
                            <CardTitle className="text-lg font-bold">{option.title}</CardTitle>
                            <CardDescription className="text-sm mt-1">{option.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 mt-4 w-full">
                            <Button onClick={() => onSelectVibe(option)} className="w-full font-bold shadow-lg">View Itinerary</Button>
                        </CardContent>
                    </Card>
                ))) : (appData.groupEventsOptions.map(option => (
                    <Card key={option.id} className="rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between text-center transition-all hover:shadow-2xl hover:-translate-y-1">
                        <CardHeader className="p-0">
                            <CardTitle className="text-lg font-bold">{option.title}</CardTitle>
                            <CardDescription className="text-sm mt-1">{option.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 mt-4 w-full">
                            <Button onClick={() => onSelectVibe(option)} className="w-full font-bold shadow-lg">View Itinerary</Button>
                        </CardContent>
                    </Card>
                )))}
            </div>
        </motion.div>
    );
};
