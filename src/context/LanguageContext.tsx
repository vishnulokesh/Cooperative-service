import React, { createContext, useContext, useState } from 'react';

export type LanguageCode = 'en' | 'te' | 'hi' | 'ta';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.workers': 'Workers',
    'nav.cooperatives': 'Cooperatives',
    'nav.emergency': 'Emergency',
    'nav.profile': 'Profile',
    'nav.dashboard': 'Dashboard',
    'nav.notifications': 'Notifications',
    'nav.settings': 'Settings',
    'nav.logout': 'Log Out',
    'nav.login': 'Log In / Sign Up',
    'nav.worker_portal': 'Worker Operating Portal',
    
    // Buttons & Actions
    'btn.book_now': 'Book Service Now',
    'btn.view_details': 'View Details',
    'btn.accept': 'Accept Job',
    'btn.decline': 'Decline Job',
    'btn.on_the_way': 'Mark On The Way',
    'btn.start_work': 'Start Service',
    'btn.complete_job': 'Complete Job',
    'btn.go_online': 'Go Online',
    'btn.go_offline': 'Go Offline',
    'btn.save_settings': 'Save Settings',
    'btn.close': 'Close',
    'btn.find_worker': 'Find a Worker',
    'btn.use_location': 'Use My Location',
    'btn.book_service': 'Book a Service',
    'btn.cancel': 'Cancel',
    'btn.confirm': 'Confirm Booking',

    // Hero
    'hero.title': "India's #1 Household Services App",
    'hero.subtitle': 'Quick, Affordable services at your doorstep',
    'hero.location_placeholder': 'Enter Location',
    'hero.service_placeholder': 'What service do you need?',
    'hero.search': 'Search & Book',

    // Headers & Labels
    'dashboard.customer_title': 'Customer Dashboard',
    'dashboard.welcome': 'Welcome back',
    'dashboard.active_booking': 'Current Active Booked Service',
    'dashboard.all_bookings': 'All Bookings',
    'dashboard.no_active': 'No active bookings currently in progress.',
    'dashboard.worker_on_the_way': 'Worker On The Way',
    'dashboard.job_progress': 'Job Progress Tracker',

    'worker.title': 'Worker Dashboard',
    'worker.available_requests': 'Available Service Requests in Your Area',
    'worker.active_job': 'Your Active Accepted Job',
    'worker.select_prompt': 'Select a service request to view details and accept.',
    'worker.accepted_card': 'Job Accepted!',
    'worker.view_dashboard': 'View Active Job in Worker Dashboard',

    // Services
    'service.plumbing': 'Plumbing',
    'service.electrical': 'Electrician',
    'service.carpentry': 'Carpenter',
    'service.cleaning': 'Cleaning',
    'service.painting': 'Painter',
    'service.domestic': 'Domestic Help',
    'service.caregiving': 'Caregiver',
    'service.appliance': 'AC / Appliance',
    'service.driver': 'Driver',

    // Status labels
    'status.requested': 'Requested',
    'status.accepted': 'Accepted',
    'status.on_the_way': 'On The Way',
    'status.started': 'Started',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',

    // Settings
    'settings.title': 'Application Settings',
    'settings.appearance': 'Appearance & Theme',
    'settings.dark_mode': 'Dark Mode',
    'settings.dark_mode_desc': 'Toggle dark theme for late night usage',
    'settings.language': 'Language / భాష / भाषा / மொழி',
    'settings.notifications': 'Notification Alerts',
    'settings.notifications_desc': 'Receive real-time updates for job assignments and bookings',
    'settings.role_mode': 'View Mode / Switch Role',
    'settings.role_customer': 'Customer View',
    'settings.role_worker': 'Worker View',
    'settings.role_coop': 'Cooperative Admin View',

    // Profile
    'profile.basic_info': 'Basic Information',
    'profile.location_account': 'Location & Account',
    'profile.full_name': 'Full Name',
    'profile.email': 'Email',
    'profile.phone': 'Phone',
    'profile.location': 'Location',
    'profile.joined': 'Joined',
    'profile.username': 'Username',

    // Booking
    'booking.address': 'Door / Flat No. & Street Address',
    'booking.city': 'City',
    'booking.schedule': 'Preferred Date & Time',
    'booking.notes': 'Instructions / Problem Description',
    'booking.payment': 'Payment Method',
    'booking.map_preview': 'Map Preview',

    // Footer / Generic
    'generic.loading': 'Loading...',
    'generic.error': 'Something went wrong',
    'generic.no_results': 'No results found',
    'generic.back': 'Go Back',
  },

  te: {
    // Navigation
    'nav.home': 'హోమ్ (Home)',
    'nav.services': 'సేవలు (Services)',
    'nav.workers': 'పనివారలు (Workers)',
    'nav.cooperatives': 'సహకార సంఘాలు (Cooperatives)',
    'nav.emergency': 'అత్యవసర సేవ (Emergency)',
    'nav.profile': 'ప్రొఫైల్ (Profile)',
    'nav.dashboard': 'డాష్‌బోర్డ్ (Dashboard)',
    'nav.notifications': 'నోటిఫికేషన్లు (Notifications)',
    'nav.settings': 'సెట్టింగ్‌లు (Settings)',
    'nav.logout': 'లాగ్ అవుట్ (Log Out)',
    'nav.login': 'లాగిన్ / సైన్ అప్',
    'nav.worker_portal': 'వర్కర్ ఆపరేటింగ్ పోర్టల్',

    // Buttons & Actions
    'btn.book_now': 'సేవను బుక్ చేయండి',
    'btn.view_details': 'వివరాలు చూడండి',
    'btn.accept': 'పనిని స్వీకరించండి (Accept)',
    'btn.decline': 'తిరస్కరించండి (Decline)',
    'btn.on_the_way': 'వస్తున్నాను (On The Way)',
    'btn.start_work': 'పని ప్రారంభించు',
    'btn.complete_job': 'పని పూర్తయింది',
    'btn.go_online': 'ఆన్‌లైన్‌కి వెళ్లండి',
    'btn.go_offline': 'ఆఫ్‌లైన్‌కి వెళ్లండి',
    'btn.save_settings': 'సెట్టింగ్‌లను సేవ్ చేయండి',
    'btn.close': 'మూసివేయి',
    'btn.find_worker': 'పనివారిని కనుగొనండి',
    'btn.use_location': 'నా స్థానం వాడండి',
    'btn.book_service': 'సేవను బుక్ చేయండి',
    'btn.cancel': 'రద్దు చేయండి',
    'btn.confirm': 'బుకింగ్ నిర్ధారించండి',

    // Hero
    'hero.title': 'భారత్ నంబర్ 1 గృహ సేవల యాప్',
    'hero.subtitle': 'వేగంగా, తక్కువ ధరకు మీ ఇంటికి సేవలు',
    'hero.location_placeholder': 'స్థానాన్ని నమోదు చేయండి',
    'hero.service_placeholder': 'మీకు ఏ సేవ కావాలి?',
    'hero.search': 'వెతకండి & బుక్ చేయండి',

    // Headers & Labels
    'dashboard.customer_title': 'కస్టమర్ డాష్‌బోర్డ్',
    'dashboard.welcome': 'సుస్వాగతం',
    'dashboard.active_booking': 'ప్రస్తుతం బుక్ చేసిన క్రియాశీల సేవ (Active Service)',
    'dashboard.all_bookings': 'అన్ని బుకింగ్‌లు',
    'dashboard.no_active': 'ప్రస్తుతం ఎటువంటి సేవ పురోగతిలో లేదు.',
    'dashboard.worker_on_the_way': 'పనిమనిషి మార్గంలో ఉన్నారు',
    'dashboard.job_progress': 'పని పురోగతి పరిశీలన (Tracker)',

    'worker.title': 'వర్కర్ డాష్‌బోర్డ్',
    'worker.available_requests': 'మీ ప్రాంతంలో అందుబాటులో ఉన్న సేవాభ్యర్థనలు',
    'worker.active_job': 'మీరు స్వీకరించిన క్రియాశీల పని',
    'worker.select_prompt': 'వివరాలను చూసి పనిని స్వీకరించడానికి ఎంచుకోండి.',
    'worker.accepted_card': 'పని స్వీకరించబడింది!',
    'worker.view_dashboard': 'వర్కర్ డాష్‌బోర్డ్‌లో స్థితి చూడండి',

    // Settings
    'settings.title': 'యాప్ సెట్టింగ్‌లు (Settings)',
    'settings.appearance': 'థీమ్ & రూపురేఖలు (Theme)',
    'settings.dark_mode': 'డార్క్ మోడ్ (Dark Mode)',
    'settings.dark_mode_desc': 'రాత్రి వేళ వినియోగానికి డార్క్ థీమ్ మార్చండి',
    'settings.language': 'భాషను ఎంచుకోండి (Language)',
    'settings.notifications': 'నోటిఫికేషన్ హెచ్చరికలు',
    'settings.notifications_desc': 'పని పురోగతి హెచ్చరికలను పొందండి',
    'settings.role_mode': 'రోల్ మార్చుకోండి (Role Switcher)',
    'settings.role_customer': 'కస్టమర్ మోడ్',
    'settings.role_worker': 'వర్కర్ మోడ్',
    'settings.role_coop': 'కోఆపరేటివ్ అడ్మిన్',

    // Services
    'service.plumbing': 'ప్లంబింగ్',
    'service.electrical': 'విద్యుత్ పని',
    'service.carpentry': 'వడ్రంగి పని',
    'service.cleaning': 'శుభ్రపరచడం',
    'service.painting': 'రంగు వేయడం',
    'service.domestic': 'గృహ సహాయం',
    'service.caregiving': 'సంరక్షణ',
    'service.appliance': 'ఏసీ / ఉపకరణాలు',
    'service.driver': 'డ్రైవర్',

    // Status
    'status.requested': 'అభ్యర్థించబడింది',
    'status.accepted': 'స్వీకరించబడింది',
    'status.on_the_way': 'వస్తున్నారు',
    'status.started': 'ప్రారంభించబడింది',
    'status.completed': 'పూర్తయింది',
    'status.cancelled': 'రద్దు చేయబడింది',

    // Profile
    'profile.basic_info': 'ప్రాథమిక సమాచారం',
    'profile.location_account': 'స్థానం & ఖాతా',
    'profile.full_name': 'పూర్తి పేరు',
    'profile.email': 'ఇమెయిల్',
    'profile.phone': 'ఫోన్',
    'profile.location': 'స్థానం',
    'profile.joined': 'చేరిన తేదీ',
    'profile.username': 'వినియోగదారు పేరు',

    // Booking
    'booking.address': 'ఇంటి నంబర్ & వీధి చిరునామా',
    'booking.city': 'నగరం',
    'booking.schedule': 'తేదీ & సమయం',
    'booking.notes': 'సూచనలు / సమస్య వివరణ',
    'booking.payment': 'చెల్లింపు విధానం',
    'booking.map_preview': 'మ్యాప్ ప్రివ్యూ',

    // Generic
    'generic.loading': 'లోడ్ అవుతోంది...',
    'generic.error': 'ఏదో తప్పు జరిగింది',
    'generic.no_results': 'ఫలితాలు దొరకలేదు',
    'generic.back': 'వెనుకకు',
  },

  hi: {
    // Navigation
    'nav.home': 'होम (Home)',
    'nav.services': 'सेवाएं (Services)',
    'nav.workers': 'कारीगर (Workers)',
    'nav.cooperatives': 'सहकारी समितियां',
    'nav.emergency': 'आपातकालीन सेवा (Emergency)',
    'nav.profile': 'प्रोफ़ाइल (Profile)',
    'nav.dashboard': 'डैशबोर्ड (Dashboard)',
    'nav.notifications': 'सूचनाएं (Notifications)',
    'nav.settings': 'सेटिंग्स (Settings)',
    'nav.logout': 'लॉग आउट (Log Out)',
    'nav.login': 'लॉग इन / साइन अप',
    'nav.worker_portal': 'कर्मचारी पोर्टल',

    // Buttons & Actions
    'btn.book_now': 'सेवा बुक करें',
    'btn.view_details': 'विवरण देखें',
    'btn.accept': 'कार्य स्वीकार करें (Accept)',
    'btn.decline': 'अस्वीकार करें (Decline)',
    'btn.on_the_way': 'रास्ते में हैं (On The Way)',
    'btn.start_work': 'काम शुरू करें',
    'btn.complete_job': 'काम पूरा करें',
    'btn.go_online': 'ऑनलाइन हों',
    'btn.go_offline': 'ऑफ़लाइन हों',
    'btn.save_settings': 'सेटिंग्स सुरक्षित करें',
    'btn.close': 'बंद करें',
    'btn.find_worker': 'कारीगर खोजें',
    'btn.use_location': 'मेरा स्थान उपयोग करें',
    'btn.book_service': 'सेवा बुक करें',
    'btn.cancel': 'रद्द करें',
    'btn.confirm': 'बुकिंग की पुष्टि करें',

    // Hero
    'hero.title': 'भारत का नंबर 1 होम सर्विस ऐप',
    'hero.subtitle': 'तेज़, किफायती सेवाएं आपके दरवाजे पर',
    'hero.location_placeholder': 'स्थान दर्ज करें',
    'hero.service_placeholder': 'आपको कौन सी सेवा चाहिए?',
    'hero.search': 'खोजें & बुक करें',

    // Headers & Labels
    'dashboard.customer_title': 'ग्राहक डैशबोर्ड',
    'dashboard.welcome': 'स्वागत है',
    'dashboard.active_booking': 'वर्तमान सक्रिय बुक की गई सेवा',
    'dashboard.all_bookings': 'सभी बुकिंग',
    'dashboard.no_active': 'वर्तमान में कोई सक्रिय सेवा प्रगति पर नहीं है।',
    'dashboard.worker_on_the_way': 'कारीगर रास्ते में है',
    'dashboard.job_progress': 'कार्य प्रगति ट्रैकर',

    'worker.title': 'वर्कर्स डैशबोर्ड',
    'worker.available_requests': 'आपके क्षेत्र में उपलब्ध सेवा अनुरोध',
    'worker.active_job': 'आपका स्वीकृत सक्रिय कार्य',
    'worker.select_prompt': 'विवरण देखने और स्वीकार करने के लिए एक अनुरोध चुनें।',
    'worker.accepted_card': 'कार्य स्वीकार कर लिया गया!',
    'worker.view_dashboard': 'वर्कर डैशबोर्ड में सक्रिय कार्य देखें',

    // Settings
    'settings.title': 'एप्लिकेशन सेटिंग्स',
    'settings.appearance': 'थीम और उपस्थिति',
    'settings.dark_mode': 'डार्क मोड (Dark Mode)',
    'settings.dark_mode_desc': 'रात के उपयोग के लिए डार्क थीम चालू करें',
    'settings.language': 'भाषा चुनें (Language)',
    'settings.notifications': 'सूचनाएं और अलर्ट',
    'settings.notifications_desc': 'बुकिंग अपडेट तुरंत प्राप्त करें',
    'settings.role_mode': 'भूमिका बदलें (Switch Role)',
    'settings.role_customer': 'ग्राहक रूप',
    'settings.role_worker': 'वर्कर रूप',
    'settings.role_coop': 'कोऑपरेटिव एडमिन्',

    // Services
    'service.plumbing': 'प्लंबिंग',
    'service.electrical': 'बिजली काम',
    'service.carpentry': 'बढ़ईगीरी',
    'service.cleaning': 'सफाई',
    'service.painting': 'पेंटिंग',
    'service.domestic': 'घरेलू सहायता',
    'service.caregiving': 'देखभाल',
    'service.appliance': 'AC / उपकरण',
    'service.driver': 'चालक',

    // Status
    'status.requested': 'अनुरोध किया',
    'status.accepted': 'स्वीकार किया',
    'status.on_the_way': 'रास्ते में',
    'status.started': 'शुरू हो गया',
    'status.completed': 'पूरा हो गया',
    'status.cancelled': 'रद्द किया गया',

    // Profile
    'profile.basic_info': 'बुनियादी जानकारी',
    'profile.location_account': 'स्थान और खाता',
    'profile.full_name': 'पूरा नाम',
    'profile.email': 'ईमेल',
    'profile.phone': 'फोन',
    'profile.location': 'स्थान',
    'profile.joined': 'जुड़ने की तारीख',
    'profile.username': 'उपयोगकर्ता नाम',

    // Booking
    'booking.address': 'घर नंबर और सड़क पता',
    'booking.city': 'शहर',
    'booking.schedule': 'तारीख और समय',
    'booking.notes': 'निर्देश / समस्या विवरण',
    'booking.payment': 'भुगतान विधि',
    'booking.map_preview': 'नक्शा पूर्वावलोकन',

    // Generic
    'generic.loading': 'लोड हो रहा है...',
    'generic.error': 'कुछ गलत हो गया',
    'generic.no_results': 'कोई परिणाम नहीं मिला',
    'generic.back': 'वापस जाएं',
  },

  ta: {
    // Navigation
    'nav.home': 'முகப்பு (Home)',
    'nav.services': 'சேவைகள் (Services)',
    'nav.workers': 'பணியாளர்கள் (Workers)',
    'nav.cooperatives': 'கூட்டுறவு சங்கங்கள்',
    'nav.emergency': 'அவசர சேவை (Emergency)',
    'nav.profile': 'சுயவிவரம் (Profile)',
    'nav.dashboard': 'டாஷ்போர்டு (Dashboard)',
    'nav.notifications': 'அறிவிப்புகள் (Notifications)',
    'nav.settings': 'அமைப்புகள் (Settings)',
    'nav.logout': 'வெளியேறு (Log Out)',
    'nav.login': 'உள்நுழைக / பதிவு செய்க',
    'nav.worker_portal': 'பணியாளர் தளம்',

    // Buttons & Actions
    'btn.book_now': 'சேவையை முன்பதிவு செய்',
    'btn.view_details': 'விவரங்களை காண்க',
    'btn.accept': 'பணியை ஏற் (Accept)',
    'btn.decline': 'நிராகரி (Decline)',
    'btn.on_the_way': 'வந்துகொண்டிருக்கிறேன் (On The Way)',
    'btn.start_work': 'பணியை தொடங்கு',
    'btn.complete_job': 'பணியை முடி',
    'btn.go_online': 'ஆன்லைனில் செல்',
    'btn.go_offline': 'ஆஃப்லைனில் செல்',
    'btn.save_settings': 'அமைப்புகளை சேமி',
    'btn.close': 'மூடு',
    'btn.find_worker': 'பணியாளரை தேடு',
    'btn.use_location': 'என் இடத்தை பயன்படுத்து',
    'btn.book_service': 'சேவையை முன்பதிவு செய்',
    'btn.cancel': 'ரத்து செய்',
    'btn.confirm': 'முன்பதிவை உறுதிப்படுத்து',

    // Hero
    'hero.title': 'இந்தியாவின் எண்.1 வீட்டு சேவை செயலி',
    'hero.subtitle': 'விரைவான, மலிவான சேவைகள் வீட்டிற்கே',
    'hero.location_placeholder': 'இடத்தை உள்ளிடுக',
    'hero.service_placeholder': 'என்ன சேவை வேண்டும்?',
    'hero.search': 'தேடு & முன்பதிவு செய்',

    // Headers & Labels
    'dashboard.customer_title': 'வாடிக்கையாளர் டாஷ்போர்டு',
    'dashboard.welcome': 'நல்வரவு',
    'dashboard.active_booking': 'தற்போதைய முன்பதிவு செய்யப்பட்ட சேவை',
    'dashboard.all_bookings': 'அனைத்து முன்பதிவுகளும்',
    'dashboard.no_active': 'தற்போது செயலில் சேவை எதுவும் இல்லை.',
    'dashboard.worker_on_the_way': 'பணியாளர் வழியில் உள்ளார்',
    'dashboard.job_progress': 'பணி முன்னேற்ற கண்காணிப்பு',

    'worker.title': 'பணியாளர் டாஷ்போர்டு',
    'worker.available_requests': 'உங்கள் பகுதியில் உள்ள சேவை கோரிக்கைகள்',
    'worker.active_job': 'நீங்கள் ஏற்றுக் கொண்ட பணி',
    'worker.select_prompt': 'விவரங்களை காண சேவை கோரிக்கையை தேர்ந்தெடுக்கவும்.',
    'worker.accepted_card': 'பணி ஏற்றுக்கொள்ளப்பட்டது!',
    'worker.view_dashboard': 'டாஷ்போர்டில் பணியை காண்க',

    // Settings
    'settings.title': 'செயலி அமைப்புகள்',
    'settings.appearance': 'தோற்றம் (Theme)',
    'settings.dark_mode': 'டார்க் மோட் (Dark Mode)',
    'settings.dark_mode_desc': 'இரவு நேர பயன்பாட்டிற்கு மாற்றவும்',
    'settings.language': 'மொழியை தேர்வு செய்க (Language)',
    'settings.notifications': 'அறிவிப்பு எச்சரிக்கைகள்',
    'settings.notifications_desc': 'உடனடி அறிவிப்புகளை பெறுக',
    'settings.role_mode': 'பங்கை மாற்றுக (Switch Role)',
    'settings.role_customer': 'வாடிக்கையாளர் நிலை',
    'settings.role_worker': 'பணியாளர் நிலை',
    'settings.role_coop': 'கூட்டுறவு நிர்வாகி',

    // Services
    'service.plumbing': 'குழாய் பணி',
    'service.electrical': 'மின் பணி',
    'service.carpentry': 'தச்சு வேலை',
    'service.cleaning': 'சுத்தம் செய்தல்',
    'service.painting': 'வர்ணம் பூசுதல்',
    'service.domestic': 'வீட்டு உதவி',
    'service.caregiving': 'பராமரிப்பு',
    'service.appliance': 'AC / சாதனங்கள்',
    'service.driver': 'ஓட்டுனர்',

    // Status
    'status.requested': 'கோரப்பட்டது',
    'status.accepted': 'ஏற்கப்பட்டது',
    'status.on_the_way': 'வழியில் உள்ளார்',
    'status.started': 'தொடங்கியது',
    'status.completed': 'முடிந்தது',
    'status.cancelled': 'ரத்து செய்யப்பட்டது',

    // Profile
    'profile.basic_info': 'அடிப்படை தகவல்',
    'profile.location_account': 'இடம் & கணக்கு',
    'profile.full_name': 'முழு பெயர்',
    'profile.email': 'மின்னஞ்சல்',
    'profile.phone': 'தொலைபேசி',
    'profile.location': 'இடம்',
    'profile.joined': 'சேர்ந்த தேதி',
    'profile.username': 'பயனர் பெயர்',

    // Booking
    'booking.address': 'வீட்டு எண் & தெரு முகவரி',
    'booking.city': 'நகரம்',
    'booking.schedule': 'தேதி & நேரம்',
    'booking.notes': 'வழிமுறைகள் / சிக்கல் விளக்கம்',
    'booking.payment': 'கட்டண முறை',
    'booking.map_preview': 'வரைபட முன்னோட்டம்',

    // Generic
    'generic.loading': 'ஏற்றுகிறது...',
    'generic.error': 'ஏதோ தவறு நடந்தது',
    'generic.no_results': 'முடிவுகள் இல்லை',
    'generic.back': 'திரும்பு',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('dailsmart_language');
      if (saved && (saved === 'en' || saved === 'te' || saved === 'hi' || saved === 'ta')) {
        return saved as LanguageCode;
      }
    } catch { /* ignore */ }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('dailsmart_language', lang);
    } catch { /* ignore */ }
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language] || translations['en'];
    return langDict[key] || translations['en'][key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
