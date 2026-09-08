/**
 * ==========================================================================
 * GOR MARKETING - KOWALSKI ZERO-PENALTY WEBSITE CHATBOT ENGINE
 * ==========================================================================
 * Zero-TBT, Zero-CLS, Dynamic Lazy Load
 */

(function () {
  const API_BASE = window.GOR_KOWALSKI_API || 'http://localhost:3000';
  const WHATSAPP_PHONE = '972525155598';
  let isInitialized = false;
  let chatHistory = [];
  let sessionId = 'gor_lead_' + Date.now();

  function createWidgetDOM() {
    if (document.getElementById('gor-chat-container')) return;

    const container = document.createElement('div');
    container.id = 'gor-chat-container';
    container.innerHTML = `
      <!-- Launcher Button -->
      <button class="gor-chat-launcher" id="gor-launcher-btn" aria-label="פתח שיחה עם קובלסקי AI">
        <span class="gor-launcher-badge"></span>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>

      <!-- Chat Modal -->
      <div class="gor-chat-modal" id="gor-chat-modal">
        <!-- Header -->
        <div class="gor-chat-header">
          <div class="gor-header-left">
            <div class="gor-avatar">🐧</div>
            <div class="gor-header-info">
              <span class="gor-header-title">קובלסקי AI 🔸 GOR</span>
              <span class="gor-header-sub"><span class="gor-status-dot"></span> מחובר וזמין 24/7</span>
            </div>
          </div>
          <button class="gor-close-btn" id="gor-close-btn" aria-label="סגור שיחה">&times;</button>
        </div>

        <!-- Messages Body -->
        <div class="gor-chat-body" id="gor-chat-body">
          <div class="gor-msg gor-msg-bot">
            שלום! אני <strong>קובלסקי</strong>, נציג ה-AI והשותף החכם של איגור גורלקין ב-<strong>GOR MARKETING</strong> 🐧<br><br>
            במה נוכל לעזור לך לקדם ולהעיף את העסק שלך קדימה?
          </div>

          <!-- Quick Action Chips -->
          <div class="gor-chips" id="gor-chips">
            <button class="gor-chip" data-query="ספר לי על קידום אתרים (SEO) שלכם">🚀 קידום אתרים SEO</button>
            <button class="gor-chip" data-query="איך אתם מנהלים קמפיינים ממומנים ב-Google ו-Meta?">🎯 קמפיינים ממומנים</button>
            <button class="gor-chip" data-query="אני רוצה לבנות אתר / אפליקציה חדשה">💻 בניית אתרים ואפליקציות</button>
            <button class="gor-chip" data-query="איך עובדות האוטומציות והבוטים ב-AI?">🤖 אוטומציות ובוטים AI</button>
            <button class="gor-chip" data-query="אני רוצה לפתוח שיחת וואטסאפ ישירה עם איגור">💬 מעבר לוואטסאפ של איגור</button>
          </div>
        </div>

        <!-- Footer Input -->
        <div class="gor-chat-footer">
          <input type="text" class="gor-chat-input" id="gor-chat-input" placeholder="הקלד/י שאלה לקובלסקי..." autocomplete="off">
          <button class="gor-send-btn" id="gor-send-btn" aria-label="שלח הודעה">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Bind UI Events
    const launcherBtn = document.getElementById('gor-launcher-btn');
    const closeBtn = document.getElementById('gor-close-btn');
    const modal = document.getElementById('gor-chat-modal');
    const input = document.getElementById('gor-chat-input');
    const sendBtn = document.getElementById('gor-send-btn');
    const chips = document.querySelectorAll('.gor-chip');

    launcherBtn.addEventListener('click', () => {
      modal.classList.toggle('open');
      if (modal.classList.contains('open')) {
        setTimeout(() => input.focus(), 200);
      }
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });

    sendBtn.addEventListener('click', handleUserSend);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleUserSend();
    });

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        input.value = query;
        handleUserSend();
      });
    });
  }

  function appendMessage(text, role) {
    const body = document.getElementById('gor-chat-body');
    const msgDiv = document.createElement('div');
    msgDiv.className = `gor-msg ${role === 'user' ? 'gor-msg-user' : 'gor-msg-bot'}`;
    msgDiv.innerHTML = text.replace(/\n/g, '<br>').replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    body.appendChild(msgDiv);
    body.scrollTop = body.scrollHeight;
    return msgDiv;
  }

  function showTyping() {
    const body = document.getElementById('gor-chat-body');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'gor-msg gor-msg-bot gor-typing';
    typingDiv.id = 'gor-typing-indicator';
    typingDiv.innerHTML = `
      <div class="gor-typing-dot"></div>
      <div class="gor-typing-dot"></div>
      <div class="gor-typing-dot"></div>
    `;
    body.appendChild(typingDiv);
    body.scrollTop = body.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById('gor-typing-indicator');
    if (el) el.remove();
  }

  function showWhatsAppHandoverCard(inquiryText) {
    const body = document.getElementById('gor-chat-body');
    const card = document.createElement('div');
    card.className = 'gor-wa-card';
    card.innerHTML = `
      <p>🚀 <strong>רוצה שקובלסקי יפתח איתך שיחת וואטסאפ מיידית?</strong></p>
      <div class="gor-wa-inputs">
        <input type="text" id="gor-lead-name" placeholder="שמך המלא">
        <input type="tel" id="gor-lead-phone" placeholder="מספר נייד (לדוגמה: 0525155598)">
      </div>
      <button class="gor-wa-btn" id="gor-lead-submit">
        <span>פתח שיחת וואטסאפ עם קובלסקי</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
        </svg>
      </button>
      <div style="margin-top: 8px;">
        <a href="https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('היי איגור, פניתי דרך בוט האתר של GOR בנושא: ' + (inquiryText || 'ייעוץ שיווקי'))}" target="_blank" style="font-size: 11px; color: #9ca3af; text-decoration: underline;">
          או לחץ כאן למעבר ישיר לוואטסאפ של איגור
        </a>
      </div>
    `;
    body.appendChild(card);
    body.scrollTop = body.scrollHeight;

    const submitBtn = card.querySelector('#gor-lead-submit');
    submitBtn.addEventListener('click', async () => {
      const name = card.querySelector('#gor-lead-name').value.trim() || 'פונה מהאתר';
      const phone = card.querySelector('#gor-lead-phone').value.trim();

      if (!phone || phone.length < 9) {
        alert('אנא הזן/י מספר טלפון תקין');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'פותח שיחת וואטסאפ...';

      try {
        const res = await fetch(`${API_BASE}/api/lead-initiate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone,
            inquiry: inquiryText || 'פנייה מבוט האתר',
            summary: chatHistory.map(h => `${h.role}: ${h.text}`).join(' | ')
          })
        });

        const data = await res.json();
        if (data.success) {
          card.innerHTML = `<p style="color:#22c55e; margin:0;">✅ <strong>מעולה ${name}!</strong> קובלסקי שלח אליך הודעת וואטסאפ ל-${phone} ברגעים אלו. בדוק/י את הוואטסאפ שלך!</p>`;
        } else {
          // Fallback direct WhatsApp redirect
          window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('היי איגור, שמי ' + name + ' והשארתי פרטים באתר בנושא: ' + inquiryText)}`, '_blank');
        }
      } catch (err) {
        // Direct link fallback
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('היי איגור, שמי ' + name + ' והשארתי פרטים באתר בנושא: ' + inquiryText)}`, '_blank');
      }
    });
  }

  async function handleUserSend() {
    const input = document.getElementById('gor-chat-input');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    appendMessage(text, 'user');
    chatHistory.push({ role: 'user', text });

    // Hide quick chips once conversation starts
    const chips = document.getElementById('gor-chips');
    if (chips) chips.style.display = 'none';

    // Check direct WhatsApp request
    if (text.includes('וואטסאפ') || text.includes('ווטסאפ') || text.includes('טלפון') || text.includes('הצעת מחיר') || text.includes('פגישה') || text.includes('לדבר')) {
      showWhatsAppHandoverCard(text);
      return;
    }

    showTyping();

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatHistory.slice(-6),
          sessionId
        })
      });

      const data = await res.json();
      removeTyping();

      const reply = data.reply || '🐧 *קובלסקי* 🔸 אני כאן לעזור! תוכל גם לפנות ישירות בוואטסאפ לאיגור.';
      appendMessage(reply, 'bot');
      chatHistory.push({ role: 'bot', text: reply });

      // After 2 messages, offer the WhatsApp handover card seamlessly
      if (chatHistory.length >= 4 && !document.querySelector('.gor-wa-card')) {
        setTimeout(() => showWhatsAppHandoverCard(text), 1500);
      }
    } catch (e) {
      removeTyping();
      appendMessage('🐧 *קובלסקי* 🔸 קיבלתי את שאלתך! אשמח לעזור לך ישירות בוואטסאפ.', 'bot');
      showWhatsAppHandoverCard(text);
    }
  }

  // Zero-Penalty Lazy Loader
  function init() {
    if (isInitialized) return;
    isInitialized = true;
    createWidgetDOM();
  }

  // Bind to idle or initial user interaction
  if (typeof window !== 'undefined') {
    window.initGorKowalskiChat = init;

    // Interaction triggers (0 penalty on PageSpeed)
    const triggerEvents = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    const loadHandler = () => {
      triggerEvents.forEach(e => window.removeEventListener(e, loadHandler));
      init();
    };
    triggerEvents.forEach(e => window.addEventListener(e, loadHandler, { passive: true, once: true }));

    // Fallback: load during idle after Core Web Vitals measurement
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => setTimeout(init, 3000));
    } else {
      setTimeout(init, 4000);
    }
  }
})();
