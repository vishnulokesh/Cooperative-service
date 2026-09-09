import { useState, useEffect, useRef } from "react";
import { Bot, Mic, MicOff, Send, X, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DailSmartAIService } from "../services/ai/serviceUnderstanding";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  detectedService?: string;
  detectedServiceId?: string;
  urgencyPrompt?: boolean;
  actionButton?: { label: string; path: string; state?: any };
}

const SAMPLE_QUESTIONS = [
  { label: "Telugu: Pipe Leak", text: "నా ఇంట్లో పైప్ లీక్ అవుతుంది" },
  { label: "Telugu-Eng: Urgent Leak", text: "Bathroom lo pipe leak avutundi" },
  { label: "Hindi: Pipe Leak", text: "मेरे घर में पानी की पाइप लीक हो रही है" },
  { label: "Tamil: Tap Repair", text: "என் வீட்டில் தண்ணீர் குழாய் கசிகிறது" },
  { label: "English: Electrical Issue", text: "My switchboard is sparking" },
];

export function AIAssistant() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [currentLang, setCurrentLang] = useState<"en" | "te" | "hi" | "ta">("en");
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "ai",
      text: "Hello! I am DailSmart AI. You can speak or type in English, Telugu, Hindi, or Tamil. Describe your problem, and I'll find the right verified cooperative professional."
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = currentLang === 'te' ? 'te-IN' : currentLang === 'hi' ? 'hi-IN' : currentLang === 'ta' ? 'ta-IN' : 'en-IN';

      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
        setIsListening(false);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, [currentLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.0;
      window.speechSynthesis.speak(u);
    }
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please type your message.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    // Analyze intent through DailSmart multi-lingual AI engine
    const intent = DailSmartAIService.classify(query);

    setTimeout(() => {
      let responseText = "";
      const lang = intent.detectedLanguage;

      if (lang === 'te' || query.includes('పైప్') || query.includes('leak') && currentLang === 'te') {
        responseText = `నేను అర్థం చేసుకున్నాను. ఇది ${intent.serviceName} సమస్యగా గుర్తించబడింది. ఇది ఎంత అత్యవసరం?`;
      } else if (lang === 'hi' || query.includes('लीक') || query.includes('पाइप')) {
        responseText = `मैं समझ गया। यह ${intent.serviceName} की समस्या लगती है। क्या यह इमरजेंसी है?`;
      } else if (lang === 'ta' || query.includes('குழாய்')) {
        responseText = `நான் புரிந்து கொண்டேன். இது ${intent.serviceName} சிக்கல் போல் தெரிகிறது. இது எவ்வளவு அவசரம்?`;
      } else {
        responseText = `I understand. This looks like a ${intent.serviceName} issue (${intent.problem}). How urgent is the issue?`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: responseText,
        detectedService: intent.serviceName,
        detectedServiceId: intent.serviceId,
        urgencyPrompt: true,
        actionButton: {
          label: `Find ${intent.serviceName} Workers`,
          path: "/find-worker",
          state: { service: intent.serviceName, serviceId: intent.serviceId }
        }
      };

      setMessages([...newMessages, aiMsg]);
      speakText(responseText);
    }, 400);
  };

  const handleSelectUrgency = (urgency: "emergency" | "urgent" | "normal", serviceName: string, serviceId?: string) => {
    const confirmMsg: ChatMessage = {
      id: `u-urg-${Date.now()}`,
      sender: "user",
      text: urgency === 'emergency' ? '🔴 Emergency (< 15 mins)' : urgency === 'urgent' ? '🟠 Urgent Today' : '🟢 Normal Scheduled Service'
    };

    const replyMsg: ChatMessage = {
      id: `ai-urg-${Date.now()}`,
      sender: "ai",
      text: urgency === 'emergency' 
        ? `Understood! Emergency priority enabled. Recommending qualified standby ${serviceName} professionals nearby with instant response.`
        : `Great! Found available verified ${serviceName} cooperative workers near your location.`,
      actionButton: {
        label: `View Matching ${serviceName}s`,
        path: urgency === 'emergency' ? '/emergency' : '/find-worker',
        state: { service: serviceName, serviceId: serviceId || 'plumbing', isEmergency: urgency === 'emergency' }
      }
    };

    setMessages(prev => [...prev, confirmMsg, replyMsg]);
    if (urgency === 'emergency') {
      speakText(`Emergency priority enabled. Finding nearest verified ${serviceName}.`);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Launcher Button */}
      {!isOpen && (
        <button
          id="ai-assistant-toggle-btn"
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all border-2 border-amber-400 flex items-center gap-2 group"
          title="Open DailSmart AI Assistant"
        >
          <Bot className="w-7 h-7 text-amber-300 animate-pulse" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-black px-1">
            Talk to DailSmart AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-slate-900 text-white w-80 sm:w-96 rounded-3xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden animate-fadeIn h-[520px]">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-950 via-blue-900 to-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-blue-500/20 text-amber-300 flex items-center justify-center border border-blue-400/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                  DailSmart AI
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <p className="text-[10px] text-blue-200">Multilingual Voice & Intent Engine</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Language Selector Bar */}
          <div className="bg-slate-950 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
              <Globe className="w-3 h-3 text-indigo-400" /> Language:
            </span>
            <div className="flex items-center gap-1">
              {[
                { code: 'en', label: 'English' },
                { code: 'te', label: 'తెలుగు' },
                { code: 'hi', label: 'हिन्दी' },
                { code: 'ta', label: 'தமிழ்' },
              ].map(l => (
                <button
                  key={l.code}
                  onClick={() => setCurrentLang(l.code as any)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                    currentLang === l.code ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="bg-slate-900/60 px-3 py-1.5 border-b border-slate-800 flex gap-1.5 overflow-x-auto text-[10px] scrollbar-none">
            {SAMPLE_QUESTIONS.map((sq, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(sq.text);
                  handleSend(sq.text);
                }}
                className="whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md border border-slate-700 transition-colors"
              >
                {sq.label}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl font-medium leading-relaxed ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700"
                  }`}
                >
                  {m.text}

                  {/* Urgency Selection Options */}
                  {m.urgencyPrompt && m.detectedService && (
                    <div className="mt-3 pt-2 border-t border-slate-700/60 space-y-1.5">
                      <div className="text-[10px] font-black uppercase text-amber-300">Choose Urgency:</div>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSelectUrgency('emergency', m.detectedService!, m.detectedServiceId)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black flex items-center gap-1 shadow-sm"
                        >
                          <AlertTriangle className="w-3 h-3" /> Emergency
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectUrgency('urgent', m.detectedService!, m.detectedServiceId)}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-[10px] font-black"
                        >
                          🟠 Urgent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectUrgency('normal', m.detectedService!, m.detectedServiceId)}
                          className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-[10px] font-bold"
                        >
                          🟢 Normal
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Link Button */}
                  {m.actionButton && (
                    <div className="mt-3 pt-2 border-t border-slate-700/60">
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          navigate(m.actionButton!.path, { state: m.actionButton!.state });
                        }}
                        className="w-full px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {m.actionButton.label}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Voice Bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800">
            {isListening && (
              <div className="mb-2 text-center text-[10px] font-black text-rose-400 bg-rose-950/60 py-1 rounded-lg border border-rose-800 flex items-center justify-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Listening... Speak naturally in Telugu, Hindi, Tamil, or English
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleMic}
                className={`p-2.5 rounded-xl transition-all ${
                  isListening
                    ? "bg-rose-600 text-white animate-pulse"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                title={isListening ? "Stop listening" : "Tap to speak in your language"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-amber-400" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type or speak (e.g. Bathroom lo pipe leak...)"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-colors shadow-sm"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}
export default AIAssistant;
