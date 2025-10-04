
import { Sparkles, Coffee, Utensils, Beer, Dumbbell, Sun, Calendar } from 'lucide-react';

export const appData = {
  creators: [
    {
      id: 'shannon',
      name: 'Shannon',
      bio: 'Just an Irish girl who\'s new to Bondi. Show me the best spots for a pint and a good chat!',
      avatar: 'https://github.com/shannon.png'
    },
    {
      id: 'alice',
      name: 'Alice',
      bio: 'French DJ spinning tunes across Bondi. Find me where the beat drops and the cocktails flow.',
      avatar: 'https://github.com/alice.png'
    },
    {
      id: 'lucas',
      name: 'Lucas',
      bio: 'Upcoming DJ and barman from a hospo family. I know the best-kept secrets of Bondi\'s nightlife.',
      avatar: 'https://github.com/lucas.png'
    },
    {
      id: 'jay',
      name: 'Jay',
      bio: 'Korean foodie on a mission to find the most authentic and delicious eats in town.',
      avatar: 'https://github.com/jay.png'
    },
    {
      id: 'kevin',
      name: 'Kevin',
      bio: 'I just really, really love bananas. And anything made with them. Send me your best banana bread recipes.',
      avatar: 'https://github.com/kevin.png'
    },
    {
      id: 'bondicreator',
      name: 'bondicreator',
      bio: 'I make content about Bondi.',
      avatar: 'https://github.com/shadcn.png'
    },
    {
      id: 'foodiegal',
      name: 'foodiegal',
      bio: 'I love food!',
      avatar: 'https://github.com/foodie.png'
    }
  ],
  categories: {
    "All": { icon: Sparkles, color: "#FF7F50" },
    "Brunch": { icon: Coffee, color: "#FFA07A" },
    "Restaurants": { icon: Utensils, color: "#FA8072" },
    "Nightlife": { icon: Beer, color: "#E9967A" },
    "Health & Fitness": { icon: Dumbbell, color: "#40E0D0" },
    "Vibes": { icon: Sun, color: "#48D1CC" },
    "Sushi": { icon: Utensils, color: "#20B2AA" },
    "Cocktails": { icon: Beer, color: "#008B8B" },
    "Retail": { icon: Sparkles, color: "#AFEEEE" },
    "Events": { icon: Calendar, color: "#7FFFD4" },
  },
  mapMyDayOptions: [
    {
      id: 'mmd1',
      title: 'Tinder Date - Bondi',
      description: 'Casual cocktails to break the ice',
      request: { vibe: "Tinder Date - Bondi", pace: 2, budget: 3, travelMode: 'walk' },
      mockItinerary: [
        { time: '18:30', name: 'The Rum Diary Bar', notes: 'Booked in for a cheeky cocktail.' },
        { time: '19:30', name: 'Totti\'s', notes: 'Reservation for dinner and some delicious Italian food.' },
        { time: '21:00', name: 'Bondi Icebergs', notes: 'Finish the night with some wicked cocktails.' }
      ],
      curatedMessage: 'All good, you\'re booked in for a cheeky cocktail at The Rum Diary Bar, then jump over to Totti\'s for some delicious Italian food. Finish the night at Icebergs with some wicked cocktails. You\'ve Got This!'
    },
    {
      id: 'mmd2',
      title: 'Single & Ready to Mingle - Bondi',
      description: 'Easy icebreakers over small plates',
      request: { vibe: "Single & Ready to Mingle - Bondi", pace: 3, budget: 3, travelMode: 'walk' },
      mockItinerary: [
        { time: '18:30', name: 'LULU', notes: 'Trivia & tapas at the local.' },
        { time: '20:00', name: 'Hotel Ravesis', notes: 'Rooftop cocktails - mingle hour.' },
        { time: '22:00', name: 'The Bucket List', notes: 'Dancing & good energy!' }
      ],
      curatedMessage: 'Get ready to mingle! You\'re all set for trivia and tapas at Lulu, then hit the rooftop at Ravesis for some cocktails. Finish the night dancing at The Bucket List. Have fun!'
    },
    {
      id: 'mmd3',
      title: 'Wellness Saturday - Bondi',
      description: 'Stretch with an an ocean view',
      request: { vibe: "Wellness Saturday - Bondi", pace: 2, budget: 2, travelMode: 'walk' },
      mockItinerary: [
        { time: '08:00', name: 'Anatomy', notes: 'Sunrise yoga at the Pavilion.' },
        { time: '09:30', name: 'Harry\'s Bondi', notes: 'Acai bowl & green juice.' },
        { time: '11:00', name: 'Bondi Icebergs', notes: 'Cold plunge & reset.' }
      ],
      curatedMessage: 'Your wellness day is all planned! Start with sunrise yoga at Anatomy, grab a healthy bite at Harry\'s, then finish with a refreshing cold plunge at Icebergs. A perfect reset!'
    },
    {
      id: 'mmd4',
      title: 'Date Night - Bondi',
      description: 'Cliffop glow & photo spots',
      request: { vibe: "Date Night - Bondi", pace: 3, budget: 4, travelMode: 'rideshare' },
      mockItinerary: [
        { time: '18:00', name: 'Totti\'s', notes: 'Reservation for an amazing meal.' },
        { time: '19:30', name: 'Hotel Ravesis', notes: 'Rooftop drinks with an ocean view.' },
        { time: '21:00', name: 'Bondi Icebergs', notes: 'Sunset walk and cocktails at the pool.' }
      ],
      curatedMessage: 'All good, you\'re booked in for a cheeky cocktail at The Rum Diary Bar, then jump over to Totti\'s for some delicious Italian food. Finish the night at Icebergs with some wicked cocktails. You\'ve Got This!'
    },
    {
      id: 'mmd5',
      title: 'Girls\' Night Out - Bondi',
      description: 'Margaritas & shared tapas',
      request: { vibe: "Girls' Night Out - Bondi", pace: 4, budget: 3, travelMode: 'rideshare' },
      mockItinerary: [
        { time: '18:00', name: 'LULU', notes: 'Margaritas and shared tapas.' },
        { time: '20:00', name: 'Hotel Ravesis', notes: 'Skyline cocktails on the rooftop.' },
        { time: '22:00', name: 'The Bucket List', notes: 'Dancing & good energy.' }
      ],
      curatedMessage: 'Your girls\' night out is all set! Start with margaritas at LULU, then hit the rooftop at Ravesis for cocktails. Finish the night dancing at The Bucket List. Have a blast!'
    },
    {
      id: 'mmd6',
      title: 'Ladies\' Lunch - Bondi',
      description: 'Window shop & try-ons',
      request: { vibe: "Ladies' Lunch - Bondi", pace: 2, budget: 4, travelMode: 'walk' },
      mockItinerary: [
        { time: '12:00', name: 'Raw Bar', notes: 'Ricotta hotcakes & spritz.' },
        { time: '13:30', name: 'Totti\'s', notes: 'Window shopping & try-ons.' },
        { time: '15:00', name: 'RND Izakaya', notes: 'Champagne & oysters.' }
      ],
      curatedMessage: 'Lunch plans are sorted! You\'re all set for ricotta hotcakes and spritz at Raw Bar, then head over to Totti\'s for a window shop. Finish your afternoon with champagne and oysters at RND Izakaya. Enjoy!'
    },
    {
      id: 'mmd7',
      title: 'Quick Bondi Lunch',
      description: 'Grab a healthy and delicious bite on your break.',
      request: { vibe: "Quick Bondi Lunch - Bondi", pace: 1, budget: 2, travelMode: 'walk' },
      mockItinerary: [
        { time: '13:30', name: 'Raw Bar', notes: 'Healthy and fresh lunch.' },
        { time: '14:30', name: 'La Piadina', notes: 'A quick taco.' }
      ],
      curatedMessage: 'Your quick lunch is sorted! Head to Raw Bar for a fresh meal, or grab a quick taco at La Piadina. Enjoy!'
    }
  ],
  groupEventsOptions: [
    {
      id: 'ge1',
      title: 'Birthday Brunch',
      description: 'A boozy brunch for big groups. ~20 pax',
      request: { vibe: "Birthday Brunch - Bondi" },
      mockItinerary: [
        { time: '11:00', name: 'Harry\'s Bondi', notes: 'Ricotta hotcakes for everyone.' },
        { time: '13:00', name: 'The Rum Diary Bar', notes: 'Cocktail masterclass for the crew.' },
        { time: '15:00', name: 'Hotel Ravesis', notes: 'Rooftop drinks to finish the day.' }
      ],
      curatedMessage: 'Your birthday brunch is set! Start with hotcakes at Harry\'s, then a cocktail masterclass at The Rum Diary Bar, and finish with rooftop drinks at Ravesis. Happy birthday!'
    },
    {
      id: 'ge2',
      title: 'Staff Party',
      description: 'Team building and celebrations. ~30 pax, $2500 budget.',
      request: { vibe: "Staff Party - Bondi" },
      mockItinerary: [
        { time: '18:00', name: 'Totti\'s', notes: 'Dinner reservation for the whole team.' },
        { time: '20:30', name: 'The Bucket List', notes: 'Live music and great vibes.' },
        { time: '22:00', name: 'The Corner House', notes: 'Nightcap on the beach.' }
      ],
      curatedMessage: 'Your staff party is on! Start with an elegant dinner at Totti\'s, then head to The Bucket List for some live music, and finish the night with a nightcap at The Corner House. Time to celebrate!'
    },
    {
      id: 'ge3',
      title: 'Baby Shower',
      description: 'Bites and mocktails by the beach.',
      request: { vibe: "Baby Shower - Bondi" },
      mockItinerary: [
        { time: '12:00', name: 'Bills', notes: 'Light lunch with a stunning view.' },
        { time: '14:00', name: 'Speedo\'s Cafe', notes: 'Coffee and cake to celebrate.' },
        { time: '16:00', name: 'Bondi Icebergs', notes: 'Photo op by the pool.' }
      ],
      curatedMessage: 'Your baby shower is all set! Start with a light lunch at Bills, then coffee and cake at Speedo\'s Cafe, and finish with a photo op at Bondi Icebergs. Congratulations!'
    },
  ],
  map: {
    pins: [
      { id: 1, name: "Bondi Icebergs", slug: "bondi-icebergs", type: "Vibes", description: "Iconic ocean views and fine dining.", x: "30%", y: "80%" },
      { id: 2, name: "Hotel Ravesis", slug: "hotel-ravesis", type: "Nightlife", description: "Stylish beachfront bar and restaurant.", x: "55%", y: "30%" },
      { id: 3, name: "The Depot", slug: "the-depot", type: "Brunch", description: "Popular spot for brunch and coffee.", x: "65%", y: "65%" },
      { id: 4, name: "Bondi Beach", slug: "bondi-beach", type: "Vibes", description: "World-famous beach with golden sands and surf.", x: "25%", y: "15%" },
      { id: 5, name: "Raw Bar", slug: "raw-bar", type: "Sushi", description: "Authentic Japanese sushi and sashimi.", x: "40%", y: "50%" },
      { id: 6, name: "Speedo's Cafe", slug: "speedos-cafe", type: "Brunch", description: "Insta-famous colorful brunch dishes.", x: "80%", y: "25%" },
      { id: 7, name: "Totti's", slug: "tottis", type: "Restaurants", description: "Vibrant Italian restaurant with a leafy courtyard.", x: "85%", y: "75%" },
      { id: 8, name: "Bondi Trattoria", slug: "bondi-trattoria", type: "Restaurants", description: "Classic Italian dishes with a sea view.", x: "20%", y: "55%" },
      { id: 9, name: "The Corner House", slug: "the-corner-house", type: "Cocktails", description: "Cozy bar with a great cocktail list.", x: "75%", y: "45%" },
      { id: 10, name: "Harry's Bondi", slug: "harrys-bondi", type: "Brunch", description: "Classic brunch fare with a modern twist.", x: "15%", y: "40%" },
      { id: 11, name: "LULU", slug: "lulu-pan-asian", type: "Restaurants", description: "Modern Pan-Asian cuisine in a chic setting.", x: "50%", y: "60%" },
      { id: 12, name: "RND Izakaya", slug: "rnd-izakaya", type: "Sushi", description: "Japanese pub food and creative cocktails.", x: "10%", y: "70%" },
      { id: 13, name: "Luca and Luca", slug: "luca-and-luca-gelato", type: "Brunch", description: "Artisanal gelato with unique flavors.", x: "70%", y: "20%" },
      { id: 14, name: "Volume One", slug: "volume-one", type: "Cocktails", description: "Hidden gem for craft cocktails.", x: "55%", y: "85%" },
      { id: 15, name: "Bills", slug: "bills", type: "Brunch", description: "Famous for ricotta hotcakes and scrambled eggs.", x: "45%", y: "70%" },
      { id: 16, name: "Sean's", slug: "seans", type: "Restaurants", description: "Farm-to-table dining with ocean views.", x: "90%", y: "10%" },
      { id: 17, "name": "La Piadina", "slug": "la-piadina", "type": "Restaurants", description: "Authentic Italian flatbread sandwiches.", "x": "60%", "y": "40%" },
      { id: 18, "name": "The Bucket List", "slug": "the-bucket-list", "type": "Nightlife", description: "Casual beachside bar with a lively atmosphere.", "x": "35%", "y": "25%" },
      { id: 19, "name": "Porch and Parlour", "slug": "porch-and-parlour", "type": "Brunch", description: "Bohemian-style cafe with healthy options.", "x": "95%", "y": "50%" },
      { id: 20, "name": "Anatomy", "slug": "anatomy", "type": "Health & Fitness", description: "Boutique fitness studio offering various classes.", "x": "5%", "y": "50%" },
      { id: 21, "name": "Acai Brothers", "slug": "acai-brothers", "type": "Health & Fitness", description: "Superfood bar specializing in acai bowls.", "x": "90%", "y": "60%" },
      { id: 22, name: "The Rum Diary Bar", slug: "the-rum-diary-bar", type: "Cocktails", description: "Caribbean-themed bar with a wide rum selection.", x: "5%", y: "80%" },
    ]
  }
};
