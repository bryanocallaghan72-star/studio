
import { Sparkles, Coffee, Utensils, Beer, Dumbbell, Sun, Calendar } from 'lucide-react';

export const appData = {
  creators: [
    {
      id: 'shannon',
      name: 'Shannon',
      bio: 'Just an Irish girl who\'s new to Bondi. Show me the best spots for a pint and a good chat!',
      avatar: 'https://github.com/shannon.png',
      x: '30%',
      y: '40%',
    },
    {
      id: 'alice',
      name: 'Alice',
      bio: 'French DJ spinning tunes across Bondi. Find me where the beat drops and the cocktails flow.',
      avatar: 'https://github.com/alice.png',
      x: '70%',
      y: '60%',
    },
    {
      id: 'lucas',
      name: 'Lucas',
      bio: 'Upcoming DJ and barman from a hospo family. I know the best-kept secrets of Bondi\'s nightlife.',
      avatar: 'https://github.com/lucas.png',
      x: '80%',
      y: '20%',
    },
    {
      id: 'jay',
      name: 'Jay',
      bio: 'Korean foodie on a mission to find the most authentic and delicious eats in town.',
      avatar: 'https://github.com/jay.png',
      x: '45%',
      y: '75%',
    },
    {
      id: 'kevin',
      name: 'Kevin',
      bio: 'I just really, really love bananas. And anything made with them. Send me your best banana bread recipes.',
      avatar: 'https://github.com/kevin.png',
      x: '15%',
      y: '60%',
    },
    {
      id: 'bondicreator',
      name: 'bondicreator',
      bio: 'I make content about Bondi.',
      avatar: 'https://github.com/shadcn.png',
       x: '50%',
      y: '50%',
    },
    {
      id: 'foodiegal',
      name: 'foodiegal',
      bio: 'I love food!',
      avatar: 'https://github.com/foodie.png',
      x: '25%',
      y: '25%',
    }
  ],
  categories: {
    "All": { icon: Sparkles, color: '#f8fafc', textColor: '#0f172a' },
    "Brunch": { icon: Coffee, color: '#f59e0b', textColor: '#ffffff' },
    "Lunch": { icon: Utensils, color: '#14b8a6', textColor: '#ffffff' },
    "Restaurants": { icon: Utensils, color: '#3b82f6', textColor: '#ffffff' },
    "Nightlife": { icon: Beer, color: '#8b5cf6', textColor: '#ffffff' },
    "Health & Fitness": { icon: Dumbbell, color: '#ec4899', textColor: '#ffffff' },
    "Vibes": { icon: Sun, color: '#fbbf24', textColor: '#0f172a' },
    "Sushi": { icon: Utensils, color: '#2dd4bf', textColor: '#0f172a' },
    "Cocktails": { icon: Beer, color: '#d946ef', textColor: '#ffffff' },
    "Retail": { icon: Sparkles, color: '#f43f5e', textColor: '#ffffff' },
    "Events": { icon: Calendar, color: '#fb7185', textColor: '#ffffff' },
  },
  mapMyDayOptions: [
    {
      id: 'mmd1',
      title: 'Tinder Date - Bondi',
      description: 'Casual cocktails to break the ice',
      request: {
        vibe: 'A casual but impressive Tinder date in Bondi. Start with unique cocktails, followed by a trendy dinner spot that\'s not too formal, and end with a place with great views for a nightcap.',
        pace: 3,
        budget: 4,
        travelMode: 'walking',
      },
      curatedMessage: 'All good, you\'re booked in for a cheeky cocktail at The Rum Diary Bar, then jump over to Totti\'s for some delicious Italian food. Finish the night at Icebergs with some wicked cocktails. You\'ve Got This!'
    },
    {
      id: 'mmd2',
      title: 'Single & Ready to Mingle - Bondi',
      description: 'Easy icebreakers over small plates',
      request: {
        vibe: 'A fun, high-energy night for a single person in Bondi looking to meet people. Think busy, social venues with opportunities to chat with new people. Start with a lively trivia or tapas bar, move to a rooftop for cocktails, and end at a place with dancing.',
        pace: 4,
        budget: 3,
        travelMode: 'walking',
      },
      curatedMessage: 'Get ready to mingle! You\'re all set for trivia and tapas at Lulu, then hit the rooftop at Ravesis for some cocktails. Finish the night dancing at Bondi Vibes Bar. Have fun!'
    },
    {
      id: 'mmd3',
      title: 'Wellness Saturday - Bondi',
      description: 'Stretch with an ocean view',
      request: {
        vibe: 'The ultimate wellness and self-care day in Bondi. Start with a morning exercise class with ocean views, followed by a healthy and delicious breakfast (think acai bowls and green juice), and finish with a refreshing and resetting activity like a cold plunge.',
        pace: 2,
        budget: 3,
        travelMode: 'walking',
      },
      curatedMessage: 'Your wellness day is all planned! Start with sunrise yoga at Fluidform Pilates, grab a healthy bite at Harry\'s, then finish with a refreshing cold plunge at Icebergs. A perfect reset!'
    },
    {
      id: 'mmd4',
      title: 'Date Night - Bondi',
      description: 'Cliffop glow & photo spots',
      request: {
        vibe: 'A classic, romantic date night in Bondi. I want a fantastic meal at a popular spot, followed by rooftop drinks with an amazing ocean view for sunset, and a final stop for a scenic walk and cocktails.',
        pace: 3,
        budget: 4,
        travelMode: 'walking',
      },
      curatedMessage: 'All good, you\'re booked in for a cheeky cocktail at Rum Diaries, then jump over to Totti\'s for some delicious Italian food. Finish the night at Icebergs with some wicked cocktails. You\'ve Got This!'
    },
    {
      id: 'mmd5',
      title: 'Girls\' Night Out - Bondi',
      description: 'Margaritas & shared tapas',
      request: {
        vibe: 'A fun and energetic girls\' night out. We want to start with margaritas and shared tapas, move to a stylish rooftop bar for more cocktails, and end the night dancing at a place with great energy and music.',
        pace: 4,
        budget: 3,
        travelMode: 'uber',
      },
      curatedMessage: 'Your girls\' night out is all set! Start with margaritas at Lulu, then hit the rooftop at Ravesis for cocktails. Finish the night dancing at Bondi Vibes Bar. Have a blast!'
    },
    {
      id: 'mmd6',
      title: 'Ladies\' Lunch - Bondi',
      description: 'Window shop & try-ons',
      request: {
        vibe: 'A chic and leisurely ladies\' lunch in Bondi. Start with a delicious brunch with spritzes, followed by some window shopping, and finish with champagne and oysters at a sophisticated spot.',
        pace: 2,
        budget: 4,
        travelMode: 'walking',
      },
      curatedMessage: 'Lunch plans are sorted! You\'re all set for ricotta hotcakes and spritz at Raw Bar, then head over to Totti\'s for a window shop. Finish your afternoon with champagne and oysters at Sushi-e. Enjoy!'
    },
    {
      id: 'mmd7',
      title: 'Quick Bondi Lunch',
      description: 'Grab a healthy and delicious bite on your break.',
      request: {
        vibe: 'A quick, healthy, and delicious lunch in Bondi for someone on a work break. Two options: one very healthy and fresh, one a bit more of a treat but still fast.',
        pace: 5,
        budget: 2,
        travelMode: 'walking',
      },
      curatedMessage: 'Your quick lunch is sorted! Head to Raw Bar for a fresh meal, or grab a quick taco at Beach Burrito Company. Enjoy!'
    }
  ],
  groupEventsOptions: [
    {
      id: 'ge1',
      title: 'Birthday Brunch',
      description: 'A boozy brunch for big groups. ~20 pax',
      request: {
        vibe: 'A boozy birthday brunch for a large group of about 20 people. Start with a great brunch spot, then an activity like a cocktail masterclass, and end with celebratory rooftop drinks.',
        pace: 3,
        budget: 4,
        travelMode: 'walking',
      },
      curatedMessage: 'Your birthday brunch is set! Start with hotcakes at Harry\'s, then a cocktail masterclass at The Rum Diary Bar, and finish with rooftop drinks at Ravesis. Happy birthday!'
    },
    {
      id: 'ge2',
      title: 'Staff Party',
      description: 'Team building and celebrations. ~30 pax, $2500 budget.',
      request: {
        vibe: 'A staff party for about 30 people with a budget of around $2500. We need a nice dinner to start, followed by a place with live music and a great atmosphere, and a final spot for a nightcap.',
        pace: 3,
        budget: 5,
        travelMode: 'uber',
      },
      curatedMessage: 'Your staff party is on! Start with an elegant dinner at Chiswick, then head to Bondi Vibes Bar for some live music, and finish the night with a nightcap at The Bucket List. Time to celebrate!'
    },
    {
      id: 'ge3',
      title: 'Baby Shower',
      description: 'Bites and mocktails by the beach.',
      request: {
        vibe: 'A classy and relaxed baby shower by the beach. Looking for a place with light bites and nice mocktails, a spot for coffee and cake, and a picturesque location for photos.',
        pace: 1,
        budget: 3,
        travelMode: 'walking',
      },
      curatedMessage: 'Your baby shower is all set! Start with a light lunch at North Bondi Fish, then coffee and cake at Speedo\'s Cafe, and finish with a photo op at Bondi Icebergs. Congratulations!'
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
      { id: 15, "name": "Bills", "slug": "bills", "type": "Brunch", "description": "Famous for ricotta hotcakes and scrambled eggs.", "x": "45%", "y": "70%" },
      { id: 16, "name": "Sean's", "slug": "seans", "type": "Restaurants", "description": "Farm-to-table dining with ocean views.", "x": "90%", "y": "10%" },
      { id: 17, "name": "La Piadina", "slug": "la-piadina", "type": "Restaurants", description: "Authentic Italian flatbread sandwiches.", "x": "60%", "y": "40%" },
      { id: 18, "name": "The Bucket List", "slug": "the-bucket-list", "type": "Nightlife", description: "Casual beachside bar with a lively atmosphere.", "x": "35%", "y": "25%" },
      { id: 19, "name": "Porch and Parlour", "slug": "porch-and-parlour", "type": "Brunch", description: "Bohemian-style cafe with healthy options.", "x": "95%", "y": "50%" },
      { id: 20, "name": "Anatomy", "slug": "anatomy", "type": "Health & Fitness", description: "Boutique fitness studio offering various classes.", "x": "5%", "y": "50%" },
      { id: 21, "name": "Acai Brothers", "slug": "acai-brothers", "type": "Health & Fitness", description: "Superfood bar specializing in acai bowls.", "x": "90%", "y": "60%" },
      { id: 22, name: "The Rum Diary Bar", slug: "the-rum-diary-bar", type: "Cocktails", description: "Caribbean-themed bar with a wide rum selection.", x: "5%", y: "80%" },
      { id: 23, name: "Lulu", slug: "lulu", type: "Restaurants", description: "Modern Pan-Asian cuisine in a chic setting.", x: "50%", y: "60%" },
      { id: 24, name: "Ravesis", slug: "ravesis", type: "Nightlife", description: "Stylish beachfront bar and restaurant.", x: "55%", y: "30%" },
      { id: 25, name: "Bondi Vibes Bar", slug: "bondi-vibes-bar", type: "Nightlife", description: "Live music and good vibes.", x: "40%", y: "20%" },
      { id: 26, name: "Fluidform Pilates", slug: "fluidform-pilates", type: "Health & Fitness", description: "Boutique pilates studio.", x: "10%", y: "55%" },
      { id: 27, name: "Sushi-e", slug: "sushi-e", type: "Sushi", description: "High-end sushi experience.", x: "35%", y: "65%" },
      { id: 28, name: "Beach Burrito Company", slug: "beach-burrito-company", type: "Restaurants", description: "Casual Mexican food and frozen margaritas.", x: "65%", y: "55%" },
      { id: 29, name: "Chiswick", slug: "chiswick", type: "Restaurants", description: "Collective dining with a seasonal menu.", x: "80%", y: "85%" },
      { id: 30, name: "North Bondi Fish", slug: "north-bondi-fish", type: "Restaurants", description: "Fresh seafood in a relaxed setting.", x: "90%", y: "40%" },
    ]
  }
};

    
