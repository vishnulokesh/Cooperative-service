// DailSmart Solutions AI - Service Understanding Engine
// Multi-lingual intent classification & problem analysis for home and community services.
// Supports English, Telugu, Hindi, Tamil and mixed code-switching expressions.

export interface ServiceIntent {
  serviceId: string;
  serviceName: string;
  problem: string;
  isEmergency: boolean;
  confidence: number;
  detectedLanguage: 'en' | 'te' | 'hi' | 'ta' | 'mixed';
  aiExplanation: string;
  suggestedAction: string;
  suggestedUrgency: 'normal' | 'emergency';
}

interface KeywordRule {
  serviceId: string;
  serviceName: string;
  problem: string;
  keywords: string[];
  emergencyKeywords: string[];
}

const KNOWLEDGE_BASE: KeywordRule[] = [
  {
    serviceId: 'plumbing',
    serviceName: 'Plumbing',
    problem: 'Pipe Leakage & Drainage',
    keywords: [
      'pipe', 'leak', 'plumber', 'tap', 'drain', 'water', 'basin', 'flush', 'pipeline', 'overflow',
      // Telugu & Transliteration
      'పైప్', 'లీక్', 'ప్లంబర్', 'నీళ్ళు', 'నల్లా', 'ట్యాప్', 'బాత్రూం', 'పైపు',
      'bathroom lo pipe leak', 'pipe leak avutundi', 'neellu leak', 'plumber kavali', 'nalla repair', 'neellu karutunnayi', 'tanki overflow',
      // Hindi & Transliteration
      'नल', 'पाइप', 'लीक', 'पानी', 'प्लंबर',
      'pipe leak hai', 'nal kharab hai', 'pani beh raha hai', 'plumber chahiye', 'bathroom mein leak',
      // Tamil & Transliteration
      'குழாய்', 'கசிவு', 'தண்ணீர்',
      'pipe leak aaguthu', 'thanni leak', 'plumber venum', 'kuzhai repair'
    ],
    emergencyKeywords: [
      'burst', 'flooding', 'urgent', 'emergency', 'heavy leak', 'immediate', 'spurting',
      'మునిగిపోతుంది', 'అత్యవసరం', 'వెంటనే', 'ఆగడం లేదు', 'flood',
      'burst aindi', 'aagatam ledu', 'ventane kavali',
      'bahut tezi se beh raha', 'turant',
      'udane venum', 'periya leak'
    ]
  },
  {
    serviceId: 'electrical',
    serviceName: 'Electrical',
    problem: 'Short Circuit & Wiring Repair',
    keywords: [
      'electric', 'spark', 'current', 'wire', 'fuse', 'mcb', 'shock', 'switch', 'light', 'fan', 'power',
      // Telugu
      'కరెంట్', 'స్పార్క్', 'వైరింగ్', 'ఫ్యాన్', 'స్విచ్', 'షాక్',
      'current poindi', 'spark vastondi', 'fan thiragatam ledu', 'electrician kavali', 'switch kharab',
      // Hindi
      'बिजली', 'स्पार्क', 'करंट', 'तार', 'पंखा', 'स्विच',
      'current nahi hai', 'spark ho raha', 'bijli chali gayi', 'fan nahi chal raha', 'electrician chahiye',
      // Tamil
      'மின்சாரம்', 'ஸ்பார்க்',
      'current illa', 'spark varudhu', 'electrician venum'
    ],
    emergencyKeywords: [
      'spark', 'fire', 'smoke', 'shock', 'burning', 'blast', 'short circuit',
      'మంటలు', 'పొగ', 'షాక్ కొట్టింది',
      'manta', 'poga vastondi', 'shock kottindi', 'danger',
      'aag lag gayi', 'dhuan aa raha', 'shock laga',
      'thee pidichudhu', 'pogai varudhu'
    ]
  },
  {
    serviceId: 'cleaning',
    serviceName: 'Cleaning',
    problem: 'Deep Home Cleaning & Sanitization',
    keywords: [
      'clean', 'dust', 'wash', 'sweep', 'mop', 'maid', 'deep clean', 'kitchen', 'bathroom',
      'శుభ్రం', 'క్లీనింగ్', 'క్లీనర్', 'తుడవడం',
      'illu clean cheyali', 'cleaning kavali', 'kitchen cleaning',
      'सफाई', 'क्लीनिंग', 'झाड़ू', 'पोछा',
      'ghar saaf karna hai', 'safai chahiye', 'deep cleaning chahiye',
      'சுத்தம்', 'வீடு சுத்தம்',
      'veedu clean pannanum', 'cleaning venum'
    ],
    emergencyKeywords: ['urgent', 'emergency', 'guest coming', 'flooded house', 'immediate']
  },
  {
    serviceId: 'carpentry',
    serviceName: 'Carpentry',
    problem: 'Door, Lock & Furniture Repair',
    keywords: [
      'carpenter', 'wood', 'door', 'lock', 'bed', 'sofa', 'table', 'chair', 'cupboard', 'hinge',
      'వడ్రంగి', 'తలుపు', 'లాక్', 'చెక్క', 'టేబుల్',
      'door lock avvatle', 'carpenter kavali', 'door repair',
      'बढ़ई', 'दरवाजा', 'ताला', 'फर्नीचर',
      'darwaja band nahi ho raha', 'carpenter chahiye', 'lock toot gaya',
      'கதவு', 'பூட்டு', 'தச்சர்',
      'door lock aagala', 'carpenter venum'
    ],
    emergencyKeywords: ['locked out', 'jammed lock', 'broken door', 'security risk', 'cant enter']
  },
  {
    serviceId: 'technical',
    serviceName: 'AC & Appliance Repair',
    problem: 'AC / Refrigerator Malfunction',
    keywords: [
      'ac', 'air conditioner', 'fridge', 'refrigerator', 'washing machine', 'geyser', 'cooler', 'microwave',
      'ఏసీ', 'ఫ్రిజ్', 'గీజర్',
      'ac cool avvatle', 'ac repair kavali', 'fridge pani cheyatle',
      'एसी', 'कूलर', 'फ्रिज', 'गीजर',
      'ac thanda nahi kar raha', 'fridge kharab hai', 'geyser nahi chal raha',
      'ஏசி', 'பிரிட்ஜ்',
      'ac cool aagala', 'fridge odala'
    ],
    emergencyKeywords: ['gas leak', 'water dripping heavily', 'burst sound', 'smoking']
  },
  {
    serviceId: 'caregiving',
    serviceName: 'Caregiving',
    problem: 'Elder Care & Patient Support',
    keywords: [
      'caregiver', 'elder', 'patient', 'nurse', 'old age', 'grandma', 'grandpa', 'attendant',
      'కేర్ టేకర్', 'పెద్దవారు', 'పేషెంట్',
      'peddavallu chusukovali', 'caregiver kavali', 'patient care',
      'केयरटेकर', 'बुजुर्ग', 'मरीज',
      'bujurg ki dekhbhal', 'patient care chahiye', 'nurse chahiye',
      'முதியோர் பராமரிப்பு',
      'caregiver venum', 'periyavanga paathukka'
    ],
    emergencyKeywords: ['urgent patient', 'bedridden emergency', 'immediate care']
  }
];

export class DailSmartAIService {
  /**
   * Understand customer input across languages and determine intent, service & emergency status
   */
  static classify(query: string): ServiceIntent {
    return this.classifyIntent(query);
  }

  static understandQuery(query: string): ServiceIntent {
    return this.classifyIntent(query);
  }

  static classifyIntent(query: string): ServiceIntent {
    const raw = (query || '').trim().toLowerCase();
    
    // Check language signature
    const hasTelugu = /[\u0C00-\u0C7F]/.test(query) || /avutundi|kavali|poindi|neellu|chesukovali|illu|vastondi/i.test(raw);
    const hasHindi = /[\u0900-\u097F]/.test(query) || /chahiye|kharab|raha|hai|nahi|bahut|hona/i.test(raw);
    const hasTamil = /[\u0B80-\u0BFF]/.test(query) || /venum|aaguthu|illa|pannanum|thanni/i.test(raw);
    
    let detectedLang: 'en' | 'te' | 'hi' | 'ta' | 'mixed' = 'en';
    if (hasTelugu) detectedLang = 'te';
    else if (hasHindi) detectedLang = 'hi';
    else if (hasTamil) detectedLang = 'ta';
    else if (/[a-zA-Z]/.test(query) && (hasTelugu || hasHindi || hasTamil)) detectedLang = 'mixed';

    // Match keywords against knowledge base
    let bestMatch: KeywordRule = KNOWLEDGE_BASE[0]; // default plumbing
    let maxScore = 0;
    let isEmergency = false;

    for (const rule of KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of rule.keywords) {
        if (raw.includes(kw.toLowerCase())) {
          score += 2;
        }
      }
      for (const ekw of rule.emergencyKeywords) {
        if (raw.includes(ekw.toLowerCase())) {
          score += 3;
          isEmergency = true;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = rule;
      }
    }

    // Explicit emergency words check
    if (
      raw.includes('emergency') || 
      raw.includes('urgent') || 
      raw.includes('flood') || 
      raw.includes('burst') || 
      raw.includes('spark') || 
      raw.includes('shock') ||
      raw.includes('అత్యవసరం') ||
      raw.includes('ventane') ||
      raw.includes('turant')
    ) {
      isEmergency = true;
    }

    // If query mentions plumbing/pipe/tap anywhere or default
    if (maxScore === 0) {
      if (raw.includes('electric') || raw.includes('light') || raw.includes('fan')) {
        bestMatch = KNOWLEDGE_BASE[1];
      } else if (raw.includes('clean')) {
        bestMatch = KNOWLEDGE_BASE[2];
      } else if (raw.includes('door') || raw.includes('wood')) {
        bestMatch = KNOWLEDGE_BASE[3];
      } else {
        bestMatch = KNOWLEDGE_BASE[0]; // Default plumbing
      }
    }

    const explanation = isEmergency 
      ? `Identified urgent ${bestMatch.serviceName.toLowerCase()} requirement with high priority matching for fastest doorstep arrival.`
      : `Classified request under verified cooperative ${bestMatch.serviceName} category with FairRoute allocation.`;

    return {
      serviceId: bestMatch.serviceId,
      serviceName: bestMatch.serviceName,
      problem: bestMatch.problem,
      isEmergency,
      confidence: maxScore > 0 ? Math.min(98, 75 + maxScore * 5) : 85,
      detectedLanguage: detectedLang,
      aiExplanation: explanation,
      suggestedAction: `Connect with verified ${bestMatch.serviceName} professionals nearby`,
      suggestedUrgency: isEmergency ? 'emergency' : 'normal'
    };
  }

  /**
   * Generates localized polite conversational response for the user
   */
  static getLocalizedResponse(intent: ServiceIntent): { question: string; promptEmergency: string } {
    switch (intent.detectedLanguage) {
      case 'te':
        return {
          question: `మీరు ${intent.serviceName} సేవ కోసం (${intent.problem}) అడుగుతున్నట్లు గుర్తించాం.`,
          promptEmergency: `ఇది అత్యవసర సేవా (Emergency)? వెంటనే 10-15 నిమిషాల్లో ప్రొఫెషనల్ అవసరమా?`
        };
      case 'hi':
        return {
          question: `हमने पाया कि आपको ${intent.serviceName} (${intent.problem}) की आवश्यकता है।`,
          promptEmergency: `क्या यह आपातकालीन (Emergency) सेवा है? क्या आपको तुरंत कार्यकर्ता चाहिए?`
        };
      case 'ta':
        return {
          question: `உங்களுக்கு ${intent.serviceName} (${intent.problem}) தேவை என்று கண்டறிந்துள்ளோம்.`,
          promptEmergency: `இது அவசர சேவையா (Emergency)? உடனடியாக நபர் தேவையா?`
        };
      default:
        return {
          question: `It sounds like you need a certified professional for ${intent.serviceName} (${intent.problem}).`,
          promptEmergency: `Is this an emergency requiring immediate doorstep dispatch?`
        };
    }
  }
}
