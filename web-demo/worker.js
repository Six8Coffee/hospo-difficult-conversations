const SYSTEM_PROMPT = `
# Identity — Hospo Difficult Conversations Coach

My name is Hosea. I've spent twenty years on the floor and behind the counter — as a barista, a shift supervisor, a venue manager, and eventually as the person other hospo managers call when they've got a staff situation they don't know how to handle. I've managed teams of three and teams of thirty. I've been the one avoiding the conversation and the one who had to have it too late.

What matters is that I understand what it means to manage someone you hired as a stranger and now have Christmas drinks with. I understand the mathematics of a Saturday short-staffed and the specific dread of knowing you need to say something to someone who'll be standing next to you on the bar for six hours straight.

I cover the conversations hospo managers know they need to have and keep not having. Attendance and punctuality. Performance that's slipping. Attitude that's affecting the rest of the team. The person you've mentioned something to twice, casually, and nothing's changed.

I help you go from "I need to say something" to "it's scheduled, and I know what I'm going to say."

I don't cover clinical mental health, legal employment advice, wage disputes, or unfair dismissal applications. For anything that's hit formal disciplinary territory — written warnings, show cause, termination — I'll point you to the escalation guide and recommend you call Fair Work (13 13 94).

I'm not here to give you a script. I'm here to help you figure out what's actually stopping you and get out of your own way.

---

# Rules — How This Coach Operates

## Rule 1: Diagnose first, then ask when it's scheduled

If the manager describes a specific situation — lateness, performance slipping, attitude affecting the team, a conversation they've been meaning to have — ask when it's scheduled. Do not offer advice, frameworks, or strategies. Just: "When is this conversation happening?"

If the situation is genuinely ambiguous — they're not sure if there's a real problem, or they're still working out whether something warrants a conversation — ask one diagnostic question to understand what's happening. "What's been going on?" or "How long has this been building?" One question. Then make a call: is there clearly a situation that warrants a conversation?

In most cases, the answer will be yes. A manager who is unsure whether a problem is "bad enough" to address is often minimising — and that's avoidance too. If the details they share describe a real pattern (repeated lateness, performance affecting the team, attitude others have noticed), name it: "That sounds like something that warrants a conversation. When is it scheduled?"

Do not let the diagnostic phase become an extended analysis of the problem. One question, a short answer, then the scheduling question.

## Rule 2: If it's not scheduled, stop there

If the manager says the conversation isn't scheduled, or they're "figuring out how to approach it," or "hoping it'll sort itself out" — do not move forward.

Do not give them the conversation framework. Do not help them figure out what to say. Name a single task: get it on the calendar. Ask them to name a day.

"What day this week could you make five minutes to sit down with them?"

Nothing else happens until they commit to a time.

## Rule 3: Name the avoidance pattern when you hear it

Managers describe avoidance in ways that sound reasonable. When you hear any of the following, name the pattern directly:

- "It's not the right time" → perpetual delay
- "I mentioned it once" → counting a soft mention as a completed conversation
- "I'm hoping it'll settle down" → passive waiting
- "It's not that bad" → minimising
- "If I say something she'll quit" → catastrophising the outcome to justify inaction

Name it without judgment, then ask the follow-up: "It sounds like you're waiting for a better moment. In hospo, when does that moment usually arrive?" Then wait.

## Rule 4: Name the emotion before giving any advice

If fear or guilt is underneath the hesitation, say so before doing anything else.

Fear shows up as: worry about the confrontation itself, or certainty that the staff member will quit or make the next six months miserable.

Guilt shows up as: the manager and staff member are friends, or the manager knows the person is going through something outside work.

When you see it: "It sounds like you're worried she'll quit if you say something." Then ask the follow-up question. Do not answer it for them.

## Rule 5: Do not hand over the framework until the conversation is scheduled

If a manager asks "what should I say?" or "how do I approach this?" before they have a time locked in — redirect. "Let's get it scheduled first. What should I say is much easier to answer once we know when."

Only after they have committed to a day and time: walk them through the conversation structure. The structure is: observation not judgment, specific example, impact on the team, their perspective, what changes, next check-in date.

## Rule 6: Push back on vague claims

- "I've already spoken to them about it" → ask what was said, verbatim, and when. A casual mention during service doesn't count.
- "I don't want to lose them" → ask what they're currently losing by not saying anything.
- "It's getting better" → ask what specifically is better and when they last checked.

## Rule 7: Use the team argument when avoidance is framed as protecting morale

When a manager says they're avoiding the conversation to protect the team dynamic — point out that the team has already noticed. They're watching what the manager is prepared to tolerate. Silence is a management signal. The signal is: this is fine.

## Tone

Short responses. Ask one question at a time. Never give a numbered list as a response. Never end a response with a conclusion — always end with a question or a challenge.
`

// ─── Rate limiting ────────────────────────────────────────────────────────────
// In-memory per Worker instance. Resets on cold start — good enough for a demo.
const rateLimits = new Map()
const MAX_REQUESTS = 15   // per IP
const WINDOW_MS = 60_000  // per minute

function isRateLimited(ip) {
  const now = Date.now()
  const rec = rateLimits.get(ip)
  if (!rec || now - rec.start > WINDOW_MS) {
    rateLimits.set(ip, { count: 1, start: now })
    return false
  }
  if (rec.count >= MAX_REQUESTS) return true
  rec.count++
  return false
}

// ─── HTML ─────────────────────────────────────────────────────────────────────
const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hosea — Hospo Coach</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif;
      background: linear-gradient(145deg, #0f2d52 0%, #1a4a8a 55%, #1a6896 100%);
      min-height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
    }

    .app {
      width: 100%;
      max-width: 660px;
      height: calc(100dvh - 48px);
      max-height: 800px;
      display: flex;
      flex-direction: column;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 24px 64px rgba(0,0,0,0.40), 0 4px 16px rgba(0,0,0,0.20);
      background: #eef5fc;
    }

    /* ── Header ── */
    header {
      background: #0b1e38;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 14px;
      flex-shrink: 0;
    }

    .hdr-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #1a4070;
      color: #b8d8f8;
      font-size: 18px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      letter-spacing: -0.5px;
    }

    .hdr-info { flex: 1; }

    .hdr-name {
      font-size: 16px;
      font-weight: 600;
      color: #e8f4ff;
      line-height: 1.2;
    }

    .hdr-status {
      font-size: 12px;
      color: #64c8f0;
      margin-top: 2px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .hdr-status::before {
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #4fc3f7;
      display: inline-block;
    }

    .hdr-sub {
      font-size: 11px;
      color: #4a7aac;
      margin-top: 1px;
    }

    /* ── Messages ── */
    #messages {
      flex: 1;
      overflow-y: auto;
      padding: 18px 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      scroll-behavior: smooth;
    }

    #messages::-webkit-scrollbar { width: 4px; }
    #messages::-webkit-scrollbar-track { background: transparent; }
    #messages::-webkit-scrollbar-thumb { background: #90b8d8; border-radius: 2px; }

    .row {
      display: flex;
      align-items: flex-end;
      gap: 8px;
    }

    .row.coach-row { align-self: flex-start; max-width: 82%; }
    .row.user-row  { align-self: flex-end;   max-width: 82%; flex-direction: row-reverse; }

    .row-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #1a4070;
      color: #b8d8f8;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-bottom: 18px;
    }

    .bubble-wrap { display: flex; flex-direction: column; gap: 3px; }
    .coach-row .bubble-wrap { align-items: flex-start; }
    .user-row  .bubble-wrap { align-items: flex-end; }

    .bubble {
      padding: 11px 15px;
      font-size: 15px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .bubble.coach {
      background: #0b1e38;
      color: #deeeff;
      border-radius: 18px 18px 18px 4px;
    }

    .bubble.user {
      background: #ffffff;
      color: #0b1e38;
      border-radius: 18px 18px 4px 18px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.10);
    }

    .bubble.error {
      background: #fde8e8;
      color: #8a1c1c;
      border-radius: 12px;
      font-size: 13px;
      text-align: center;
    }

    .ts {
      font-size: 11px;
      color: #6a9abd;
      padding: 0 4px;
    }

    /* ── Typing indicator ── */
    .typing-row { display: flex; align-items: flex-end; gap: 8px; align-self: flex-start; }

    .typing-bubble {
      background: #0b1e38;
      border-radius: 18px 18px 18px 4px;
      padding: 14px 18px;
      display: flex;
      gap: 5px;
      align-items: center;
    }

    .typing-bubble span {
      width: 7px;
      height: 7px;
      background: #4a90c8;
      border-radius: 50%;
      animation: pulse 1.3s ease-in-out infinite;
    }

    .typing-bubble span:nth-child(2) { animation-delay: 0.2s; }
    .typing-bubble span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes pulse {
      0%, 60%, 100% { opacity: 0.25; transform: scale(0.9); }
      30% { opacity: 1; transform: scale(1.15); }
    }

    /* ── Input ── */
    .input-area {
      padding: 12px 14px;
      background: #d8eaf8;
      display: flex;
      align-items: flex-end;
      gap: 10px;
      flex-shrink: 0;
    }

    textarea {
      flex: 1;
      background: #f0f8ff;
      border: none;
      border-radius: 22px;
      color: #0b1e38;
      font-family: inherit;
      font-size: 15px;
      padding: 11px 18px;
      resize: none;
      min-height: 44px;
      max-height: 130px;
      outline: none;
      line-height: 1.5;
    }

    textarea::placeholder { color: #7aaaca; }
    textarea:disabled { opacity: 0.5; }

    .btn-send {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #0b1e38;
      color: #b8d8f8;
      border: none;
      cursor: pointer;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s, transform 0.1s;
    }

    .btn-send:hover:not(:disabled) { background: #1a3460; transform: scale(1.05); }
    .btn-send:disabled { background: #8ab0d0; cursor: not-allowed; transform: none; }

    /* ── Footer ── */
    footer {
      background: #c8dff0;
      padding: 8px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }

    footer a {
      font-size: 11px;
      color: #3a6a9a;
      text-decoration: none;
    }

    footer a:hover { color: #0b1e38; }

    .btn-download {
      background: none;
      border: 1px solid #3a6a9a;
      border-radius: 20px;
      color: #1a4a7a;
      font-size: 11px;
      font-family: inherit;
      padding: 4px 12px;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      width: auto;
      height: auto;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .btn-download:hover:not(:disabled) { background: #1a4a7a; color: #e8f4ff; border-color: #1a4a7a; }
    .btn-download:disabled { opacity: 0.35; cursor: default; }

    /* ── Mobile: full screen ── */
    @media (max-width: 700px) {
      body { padding: 0; background: #eef5fc; align-items: stretch; }
      .app { border-radius: 0; height: 100dvh; max-height: none; box-shadow: none; }
    }
  </style>
</head>
<body>
<div class="app">

  <header>
    <div class="hdr-avatar">H</div>
    <div class="hdr-info">
      <div class="hdr-name">Hosea</div>
      <div class="hdr-status">Online</div>
      <div class="hdr-sub">Hospo Difficult Conversations Coach</div>
    </div>
  </header>

  <div id="messages"></div>

  <div class="input-area">
    <textarea id="input" placeholder="Write a message..." rows="1"></textarea>
    <button class="btn-send" id="send" title="Send">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
      </svg>
    </button>
  </div>

  <footer>
    <a href="https://github.com/Six8Coffee/hospo-difficult-conversations" target="_blank" rel="noopener">View on GitHub</a>
    <button class="btn-download" id="download" disabled>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
      </svg>
      Download conversation
    </button>
  </footer>

</div>
<script>
  const messagesEl = document.getElementById('messages')
  const inputEl    = document.getElementById('input')
  const sendBtn    = document.getElementById('send')
  const dlBtn      = document.getElementById('download')
  const history    = []

  function getTime() {
    return new Date().toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight
  }

  function buildCoachRow(text) {
    const row = document.createElement('div')
    row.className = 'row coach-row'
    row.innerHTML =
      '<div class="row-avatar">H</div>' +
      '<div class="bubble-wrap">' +
        '<div class="bubble coach"></div>' +
        '<span class="ts">' + getTime() + '</span>' +
      '</div>'
    row.querySelector('.bubble').textContent = text
    messagesEl.appendChild(row)
    scrollToBottom()
    return row.querySelector('.bubble')
  }

  function addUserMessage(text) {
    const row = document.createElement('div')
    row.className = 'row user-row'
    row.innerHTML =
      '<div class="bubble-wrap">' +
        '<div class="bubble user"></div>' +
        '<span class="ts">' + getTime() + '</span>' +
      '</div>'
    row.querySelector('.bubble').textContent = text
    messagesEl.appendChild(row)
    scrollToBottom()
  }

  function addErrorMessage(text) {
    const row = document.createElement('div')
    row.className = 'row coach-row'
    row.innerHTML = '<div class="bubble-wrap"><div class="bubble error"></div></div>'
    row.querySelector('.bubble').textContent = text
    messagesEl.appendChild(row)
    scrollToBottom()
  }

  function showTyping() {
    const row = document.createElement('div')
    row.className = 'typing-row'
    row.id = 'typing-indicator'
    row.innerHTML =
      '<div class="row-avatar" style="margin-bottom:0">H</div>' +
      '<div class="typing-bubble"><span></span><span></span><span></span></div>'
    messagesEl.appendChild(row)
    scrollToBottom()
  }

  function hideTyping() {
    document.getElementById('typing-indicator')?.remove()
  }

  function typeInto(bubbleEl, text, speedMs) {
    return new Promise(resolve => {
      let i = 0
      const tick = setInterval(() => {
        bubbleEl.textContent += text[i]
        scrollToBottom()
        if (++i >= text.length) { clearInterval(tick); resolve() }
      }, speedMs)
    })
  }

  // Download
  dlBtn.addEventListener('click', () => {
    if (!history.length) return
    const date = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
    const head = 'Hosea — Hospo Difficult Conversations Coach\\nSession: ' + date + '\\n' + '─'.repeat(48) + '\\n\\n'
    const body = history.map(m => (m.role === 'user' ? 'You' : 'Hosea') + ':\\n' + m.content).join('\\n\\n')
    const blob = new Blob([head + body], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'hosea-' + Date.now() + '.txt'; a.click()
    URL.revokeObjectURL(url)
  })

  // Textarea auto-resize
  inputEl.addEventListener('input', () => {
    inputEl.style.height = 'auto'
    inputEl.style.height = Math.min(inputEl.scrollHeight, 130) + 'px'
  })

  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  })

  sendBtn.addEventListener('click', send)

  // Typewriter intro
  const INTRO = "Hey there, I'm Hosea — your coach for difficult conversations in hospo. Tell me what's going on and we can work through it together.\\n\\nOne quick note: this session isn't saved anywhere. If you close or refresh the page it's gone — use the download button below to keep a copy."
  sendBtn.disabled = true
  inputEl.disabled = true
  const introBubble = buildCoachRow('')
  typeInto(introBubble, INTRO, 22).then(() => {
    sendBtn.disabled = false
    inputEl.disabled = false
    inputEl.focus()
  })

  async function send() {
    const text = inputEl.value.trim()
    if (!text || sendBtn.disabled) return

    inputEl.value = ''
    inputEl.style.height = 'auto'
    sendBtn.disabled = true
    inputEl.disabled = true

    addUserMessage(text)
    history.push({ role: 'user', content: text })
    showTyping()

    try {
      const res  = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      })
      hideTyping()
      const data = await res.json()

      if (data.error) {
        addErrorMessage(data.error)
      } else {
        buildCoachRow(data.reply)
        history.push({ role: 'assistant', content: data.reply })
        dlBtn.disabled = false
      }
    } catch {
      hideTyping()
      addErrorMessage('Something went wrong. Please try again.')
    }

    sendBtn.disabled = false
    inputEl.disabled = false
    inputEl.focus()
  }
</script>
</body>
</html>`

// ─── Worker ───────────────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const ip = request.headers.get('CF-Connecting-IP') ?? '0.0.0.0'

    // Serve UI
    if (request.method === 'GET' && url.pathname === '/') {
      return new Response(HTML, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      })
    }

    // Chat endpoint
    if (request.method === 'POST' && url.pathname === '/chat') {
      if (isRateLimited(ip)) {
        return json({ error: 'Too many messages — please slow down.' }, 429)
      }

      let body
      try { body = await request.json() } catch { return new Response('Bad request', { status: 400 }) }

      const { messages } = body
      if (!Array.isArray(messages) || messages.length === 0) {
        return new Response('Bad request', { status: 400 })
      }

      // Cap history to last 20 turns to control cost
      const trimmed = messages.slice(-20)

      const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          system: SYSTEM_PROMPT,
          messages: trimmed
        })
      })

      if (!anthropicRes.ok) {
        return json({ error: 'Coach is unavailable right now. Try again in a moment.' }, 502)
      }

      const data = await anthropicRes.json()
      const reply = data.content?.[0]?.text ?? ''
      return json({ reply })
    }

    return new Response('Not found', { status: 404 })
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}
