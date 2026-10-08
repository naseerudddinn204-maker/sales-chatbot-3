    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      setInput(transcript);
      if (transcript.trim()) sendVoiceMessage(transcript.trim());
    };
    recognition.onerror = () => { setListening(false); setBackendError('Could not hear your voice. Please try again.'); };
    recognition.onend = () => { setListening(false); (window as any).__salesChatRecognition = null; };
    (window as any).__salesChatRecognition = recognition;
    setBackendError('');
    recognition.start();
  }

  function speakAnswer(text: string) {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      setBackendError('Voice playback is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const speech = window.speechSynthesis;
    speech.cancel();

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(String(text));
      const voices = speech.getVoices();
      const voice =
        voices.find(v => /^en-US$/i.test(v.lang)) ||
        voices.find(v => /^en/i.test(v.lang)) ||
        voices[0];

      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.onerror = () => setBackendError('Could not play the voice answer. Please try again.');
      speech.speak(utterance);
    };

    if (speech.getVoices().length) {
      speak();
    } else {
      speech.onvoiceschanged = () => {
        speech.onvoiceschanged = null;
        speak();
      };
      setTimeout(() => {
        if (!speech.speaking && speech.getVoices().length) speak();
      }, 300);
    }
  }

  async function sendVoiceMessage(text: string) {
    if (!text || loading) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text }]);
    setLoading(true);
    try {
      const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, session_id: session, slug, business_description: config?.knowledge_description || '', knowledge_text: [config?.knowledge_text || '', visitorDescription.trim(), visitorKnowledge].filter(Boolean).join('\n\n') }) });
      const d = await r.json().catch(() => ({}));
      if (d.session_id) setSession(d.session_id);
      if (!r.ok || !d.reply) throw new Error(d?.error || 'Backend returned no chatbot reply.');
      setMessages(m => [...m, { role: 'assistant', text: d.reply }]);
      speakAnswer(d.reply);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Connection error.';
      setBackendError(message);
      setMessages(m => [...m, { role: 'assistant', text: message }]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function loadConfig() {
      try {
        const url = SUPABASE_URL + '/rest/v1/chatbots?select=id,name,slug,description,welcome_message,brand_color,logo_url,knowledge_description,knowledge_text&slug=eq.' + encodeURIComponent(slug) + '&enabled=eq.true&limit=1';
        const response = await fetch(url, { headers });
        const data = await response.json().catch(() => []);
        if (!response.ok || !Array.isArray(data) || !data[0]) throw new Error('Unable to load chatbot configuration.');