export const EVENTS = [
    {
        id: '1',
        title: 'IND vs AFG',
        date: 'Sun, 14 Jan, 7:00 PM',
        location: 'Holkar Stadium | Indore',
        distance: '17.7 km away',
        price: '₹1000 onwards',
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop',
        about: 'Catch the thrilling 2nd T20I match between India and Afghanistan live at Holkar Stadium. Experience the electric atmosphere and cheer for your favorite players.',
        highlights: [
            { title: 'What you\'ll experience', desc: 'Live cricket action, roaring crowd, and unforgettable moments.' },
            { title: 'Special attractions', desc: 'Food stalls, merchandise, and fan zones available inside the stadium.' }
        ],
        tickets: [
            { id: 't1', name: 'Early Bird | Silver', price: 1000, desc: ['Grants entry to Silver Zone', 'Seated section', 'First-come, first-served basis'] },
            { id: 't2', name: 'Premium | Gold', price: 2500, desc: ['Grants entry to Gold Zone', 'Reserved seating', 'Includes complimentary beverage'] }
        ]
    },
    {
        id: '2',
        title: 'Nizami Bandhu Live',
        date: 'Sat, 27 Jun, 9:30 PM',
        location: 'KOPA | Lajpat Nagar 3, New Delhi, Delhi/NCR',
        distance: '5.2 km away',
        price: '₹2000 onwards',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop'
        ],
        about: 'Experience the soulful Sufi music of Nizami Bandhu live in concert. A dynamic blend of traditional qawwali and modern sounds.',
        highlights: [
            { title: 'What you\'ll experience', desc: 'Soulful Qawwali, captivating vocals, and an evening of spiritual music.' },
            { title: 'Special attractions', desc: 'Intimate setting, premium acoustic experience, and fine dining options.' }
        ],
        tickets: [
            { id: 't1', name: 'Phase 1 | General', price: 2000, desc: ['Standing area', 'Access to food and beverage counters'] },
            { id: 't2', name: 'VIP Table', price: 10000, desc: ['Reserved VIP table for 4', 'Includes bottle service', 'Dedicated waitstaff'] }
        ]
    },
    {
        id: '3',
        title: 'Sunburn Arena ft. Martin Garrix',
        date: 'Fri, 15 Dec, 5:00 PM',
        location: 'Bhartiya City | Bengaluru',
        distance: '12.4 km away',
        price: '₹3500 onwards',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1520699697851-3dc68aa3a474?q=80&w=1000&auto=format&fit=crop'
        ],
        about: 'The world\'s #1 DJ Martin Garrix returns to India for a massive Sunburn Arena tour. Get ready for an electrifying night of EDM.',
        highlights: [
            { title: 'What you\'ll experience', desc: 'Massive stage production, mind-blowing visuals, and world-class EDM.' },
            { title: 'Special attractions', desc: 'Multiple stages, art installations, and a massive food court.' }
        ],
        tickets: [
            { id: 't1', name: 'GA Phase 1', price: 3500, desc: ['Access to GA standing area', 'Access to food and beverage counters'] },
            { id: 't2', name: 'VIP Phase 1', price: 6500, desc: ['Access to VIP elevated viewing deck', 'Dedicated bars and washrooms'] }
        ]
    }
];
