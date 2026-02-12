(() => {
  const RECIPIENT_NAME = "Yiting";
  const NICKNAME = "darling";
  const FROM_TEXT = "your daddy";
  const SIGNATURE = "your daddy";

  const SONG_LABEL = "JVKE \u2014 her";
  const ANNIVERSARY = "2025-09-13";
  const QUOTES = [
  "You are doing better than you think",
  "I am proud of you — always",
  "你不用逞强，我在",
  "别怕慢，只要你没放弃",
  "You are loved, even on messy days",
  "你不是负担，你是我想守护的人",
  "Breathe. I’ve got you",
  "你值得被温柔对待"
];

  const SECRET_WORD_1 = "yiting";
  const SECRET_TEXT_1 = "You are never a burden. You are my favorite place to come home to. 🤍";
  const SECRET_WORD_2 = "darling";
  const SECRET_TEXT_2 = "If your heart feels heavy, come back to me.\nI\u2019ll hold you gently, remind you you\u2019re enough, and love you the way you deserve \u2014 always. \ud83e\udd0d";

  const DEFAULT_VOLUME = 0.30;
  const FADE_MS = 1600;

  const LETTER_TEXT = "Happy Valentine\u2019s Day \ud83e\udd0d\n\nI know this year feels very different from what we once imagined. Life has been heavy on you \u2014 work pressure, family problems, responsibilities, overthinking, insecurities, and so many emotions all at once. I know you\u2019ve been trying so hard to stay strong even when everything feels messy and overwhelming.\n\nI just want you to know how proud I am of you for still standing, still trying, still waking up every day and facing everything even when you feel like running away.\n\nThe past weeks weren\u2019t easy for us. We hurt each other, misunderstood each other, cried, got scared of losing each other\u2026 but we didn\u2019t give up. And that means so much to me. Thank you for staying. Thank you for still loving me even when your world felt like it was falling apart.\n\nYou once told me you worry you\u2019re not good enough, not as beautiful, not as worthy, and that your life might become a burden to someone who loves you. But the truth is, I never loved you because your life was easy or perfect. I love you because you are real. Because you care deeply. Because you try so hard to be a good person even when life hasn\u2019t been kind to you.\n\nI know work has been exhausting and unfair. I know your heart hurts seeing your parents separate. I know you feel pressure about the future and responsibilities. And I know sometimes you feel like you don\u2019t belong anywhere. But even when you feel lost, please remember this \u2014 you are not alone. You don\u2019t have to carry everything by yourself anymore.\n\nThis Valentine\u2019s Day doesn\u2019t need to be perfect. We don\u2019t need perfect love or perfect lives. I just hope we continue learning how to love each other gently, patiently, and honestly. Step by step. Day by day.\n\nI\u2019m really grateful that you are still here with me.\nAnd I hope this year, life will slowly become softer to you.\n\nHappy Valentine\u2019s Day, my love \u2764\ufe0f\n";

  const $ = (s) => document.querySelector(s);

  const nameBadge = $("#nameBadge");
  const nameInline = $("#nameInline");
  const nick = $("#nickname");
  const fromInline = $("#fromInline");
  const sigName = $("#sigName");

  const openLetterBtn = $("#openLetter");
  const confettiBtn = $("#confetti");
  const musicBtn = $("#music");

  const bgm = $("#bgm");
  const player = $("#player");
  const trackName = $("#trackName");
  const seek = $("#seek");
  const curTime = $("#curTime");
  const durTime = $("#durTime");

  const letterEl = $("#letter");
  const tw = $("#typewriter");
  const controls = $("#controls");
  const replayBtn = $("#replay");
  const copyBtn = $("#copy");
  const hugBtn = $("#hug");
  const toast = $("#toast");

  const togetherText = $("#togetherText");
  const whisper = $("#whisper");

  const modal = $("#modal");
  const closeModalBtn = $("#closeModal");
  const secretBtn = $("#secret");
  const secretInput = $("#secretInput");
  const unlockBtn = $("#unlock");
  const secretMsg = $("#secretMsg");

  // Force-hide modal on load
  if (modal) {
    modal.hidden = true;
    modal.style.display = "none";
    modal.style.pointerEvents = "none";
  }

  if (nameBadge) nameBadge.textContent = RECIPIENT_NAME;
  if (nameInline) nameInline.textContent = RECIPIENT_NAME;
  if (nick) nick.textContent = NICKNAME;
  if (fromInline) fromInline.textContent = FROM_TEXT;
  if (sigName) sigName.textContent = SIGNATURE;
  if (trackName) trackName.textContent = SONG_LABEL;

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    toast.style.opacity = "1";
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.hidden = true, 250);
    }, 1100);
  }

  function fmtTime(sec) {
    if (!isFinite(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2,"0")}`;
  }

  // typewriter
  let typing = false;
  let cancelTyping = false;

  async function typewrite(text) {
    cancelTyping = false;
    typing = true;
    if (controls) controls.hidden = true;
    if (tw) tw.textContent = "";

    const cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.textContent = " ";
    if (tw) tw.appendChild(cursor);

    for (let i = 0; i < text.length; i++) {
      if (cancelTyping) break;
      cursor.remove();
      const ch = text[i];
      if (tw) tw.textContent += ch;
      if (tw) tw.appendChild(cursor);

      const base = (ch === "\n") ? 12 : 18;
      const extra = (".!?,".includes(ch)) ? 180 : 0;
      await sleep(base + extra + Math.random() * 26);
    }

    cursor.remove();
    typing = false;
    if (controls) controls.hidden = false;
  }

  // music
  let musicReady = false;
  let fading = false;
  let seeking = false;

  function canPlayMusic() {
    return bgm && bgm.querySelector("source") && bgm.querySelector("source").getAttribute("src");
  }

  async function fadeTo(target, ms) {
    if (!bgm) return;
    fading = true;
    const start = bgm.volume ?? DEFAULT_VOLUME;
    const steps = 20;
    for (let i=1; i<=steps; i++) {
      const t = i/steps;
      bgm.volume = start + (target - start) * t;
      await sleep(ms/steps);
    }
    bgm.volume = target;
    fading = false;
  }

  
  // ===== Ultimate romantic effect (music-reactive glow) =====
  let audioCtx = null;
  let analyser = null;
  let dataArr = null;
  let srcNode = null;
  let rafId = null;

  function setupAnalyzer(){
    if (!bgm) return;
    if (analyser) return;
    try{
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const bufferLen = analyser.frequencyBinCount;
      dataArr = new Uint8Array(bufferLen);

      srcNode = audioCtx.createMediaElementSource(bgm);
      srcNode.connect(analyser);
      analyser.connect(audioCtx.destination);

      const tick = () => {
        if (!analyser || !dataArr) return;
        analyser.getByteFrequencyData(dataArr);
        // compute a soft energy value 0..1
        let sum = 0;
        for (let i = 0; i < dataArr.length; i++) sum += dataArr[i];
        const avg = sum / (dataArr.length * 255);
        // smoothing
        const beat = Math.max(0, Math.min(1, avg * 1.6));
        document.documentElement.style.setProperty("--beat", beat.toFixed(4));
        rafId = requestAnimationFrame(tick);
      };
      tick();
    }catch(e){
      // ignore if unsupported
    }
  }

  function resumeAudioContext(){
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume().catch(()=>{});
  }

async function startMusic() {
    if (!bgm || !canPlayMusic()) return;
    try {
      bgm.volume = 0.05;
      await bgm.play();
      setupAnalyzer();
      resumeAudioContext();
      document.body.classList.add("musicOn");
      if (player) player.hidden = false;
      await fadeTo(DEFAULT_VOLUME, FADE_MS);
      musicReady = true;
      if (musicBtn) {
        musicBtn.classList.add("on");
        musicBtn.textContent = "Music ❚❚";
      }
    } catch {
      // autoplay blocked
    }
  }

  async function stopMusic() {
    if (!bgm) return;
    try { await fadeTo(0.05, Math.max(700, FADE_MS * 0.6)); } catch {}
    bgm.pause();
    document.body.classList.remove("musicOn");
    document.documentElement.style.setProperty("--beat","0");
    if (musicBtn) {
      musicBtn.classList.remove("on");
      musicBtn.textContent = "Music ♪";
    }
  }

  async function toggleMusic() {
    if (!bgm || !canPlayMusic()) return showToast("Add bgm.mp3");
    if (fading) return;
    if (bgm.paused) await startMusic();
    else await stopMusic();
  }

  if (musicBtn) musicBtn.addEventListener("click", toggleMusic);

  if (bgm) {
    bgm.addEventListener("loadedmetadata", () => {
      if (durTime) durTime.textContent = fmtTime(bgm.duration);
    });
    bgm.addEventListener("timeupdate", () => {
      if (!seeking) {
        if (curTime) curTime.textContent = fmtTime(bgm.currentTime);
        if (seek && isFinite(bgm.duration) && bgm.duration > 0) {
          seek.value = String(Math.floor((bgm.currentTime / bgm.duration) * 1000));
        }
      }
    });
  }

  if (seek) {
    seek.addEventListener("input", () => { seeking = true; });
    seek.addEventListener("change", () => {
      if (!bgm || !isFinite(bgm.duration) || bgm.duration <= 0) return;
      const v = Number(seek.value) / 1000;
      bgm.currentTime = v * bgm.duration;
      seeking = false;
    });
  }

  // hearts canvas
  const canvas = document.getElementById("hearts");
  const ctx = canvas ? canvas.getContext("2d") : null;
  let W = 0, H = 0;
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const hearts = [];

  function resize() {
    if (!canvas || !ctx) return;
    W = canvas.width = Math.floor(window.innerWidth * dpr);
    H = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(1,0,0,1,0,0);
  }
  window.addEventListener("resize", resize);
  resize();

  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];

  const palette = [
    "rgba(255,77,125,0.55)",
    "rgba(255,143,179,0.45)",
    "rgba(255,208,226,0.50)",
    "rgba(141,214,255,0.35)",
    "rgba(170,255,223,0.35)"
  ];

  function heartPath(x, y, s) {
    if (!ctx) return;
    ctx.beginPath();
    const top = s * 0.3;
    ctx.moveTo(x, y + top);
    ctx.bezierCurveTo(x, y, x - s / 2, y, x - s / 2, y + top);
    ctx.bezierCurveTo(x - s / 2, y + (s + top) / 2, x, y + (s + top) / 2, x, y + s);
    ctx.bezierCurveTo(x, y + (s + top) / 2, x + s / 2, y + (s + top) / 2, x + s / 2, y + top);
    ctx.bezierCurveTo(x + s / 2, y, x, y, x, y + top);
    ctx.closePath();
  }

  function spawnHeart(px, py, burst=false) {
    const count = burst ? 28 : 10;
    for (let i=0; i<count; i++) {
      hearts.push({
        x: (px * dpr) + rand(-18, 18) * dpr,
        y: (py * dpr) + rand(-10, 10) * dpr,
        s: rand(10, burst ? 24 : 18) * dpr,
        vx: rand(-0.9, 0.9) * dpr,
        vy: rand(-2.4, -0.7) * dpr,
        rot: rand(-0.7, 0.7),
        vr: rand(-0.03, 0.03),
        a: rand(0.55, 1.0),
        col: pick(palette),
        life: rand(70, 130),
      });
    }
  }

  setInterval(() => spawnHeart(window.innerWidth * rand(0.2, 0.8), window.innerHeight + 10), 420);

  function step() {
    if (!ctx) return;
    ctx.clearRect(0,0,W,H);
    for (let i=hearts.length-1; i>=0; i--) {
      const h = hearts[i];
      h.x += h.vx;
      h.y += h.vy;
      h.rot += h.vr;
      h.vy -= 0.002 * dpr;
      h.life -= 1;
      const alpha = Math.max(0, Math.min(1, h.a * (h.life / 130)));

      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(h.rot);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = h.col;
      heartPath(0, 0, h.s);
      ctx.fill();
      ctx.restore();

      if (h.life <= 0 || h.y < -60 * dpr) hearts.splice(i, 1);
    }
    requestAnimationFrame(step);
  }
  step();

  window.addEventListener("pointerdown", (e) => {
    spawnHeart(e.clientX, e.clientY, false);
    resumeAudioContext();
    if (!musicReady && bgm && canPlayMusic()) startMusic();
  }, { passive: true });

  if (confettiBtn) confettiBtn.addEventListener("click", () => {
    const rect = confettiBtn.getBoundingClientRect();
    spawnHeart(rect.left + rect.width/2, rect.top + rect.height/2, true);
  });

  // cinematic open + open letter
  async function openLetter() {
    document.body.classList.add("cine");
    if (letterEl) letterEl.hidden = false;
    if (openLetterBtn) {
      const rect = openLetterBtn.getBoundingClientRect();
      spawnHeart(rect.left + rect.width/2, rect.top + rect.height/2, true);
    }
    await startMusic();
    if (!typing) await typewrite(LETTER_TEXT);
  }

  if (openLetterBtn) openLetterBtn.addEventListener("click", openLetter);

  if (replayBtn) replayBtn.addEventListener("click", () => {
    cancelTyping = true;
    setTimeout(() => typewrite(LETTER_TEXT), 30);
  });

  if (copyBtn) copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(LETTER_TEXT);
      showToast("Copied!");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = LETTER_TEXT;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      showToast("Copied!");
    }
  });

  if (hugBtn) hugBtn.addEventListener("click", () => {
    showToast("Virtual hug sent 🫶💗");
    spawnHeart(window.innerWidth * 0.5, window.innerHeight * 0.55, true);
  });

  // together counter
  function parseAnniversary() {
    const [y,m,d] = ANNIVERSARY.split("-").map(Number);
    return new Date(y, m-1, d, 0, 0, 0);
  }
  const start = parseAnniversary();

  function updateTogether() {
    if (!togetherText) return;
    const now = new Date();
    let diff = now.getTime() - start.getTime();
    if (diff < 0) diff = 0;
    const totalMin = Math.floor(diff / 60000);
    const days = Math.floor(totalMin / (60*24));
    const hours = Math.floor((totalMin - days*60*24) / 60);
    const mins = totalMin % 60;
    togetherText.textContent = `Together: ${days} days ${hours} hrs ${mins} mins`;
  }
  updateTogether();
  setInterval(updateTogether, 30000);

  // whispers
  let quoteTimer = null;
  function showWhisper() {
    if (!whisper) return;
    const q = pick(QUOTES);
    whisper.textContent = q;
    whisper.hidden = false;
    setTimeout(() => { if (whisper) whisper.hidden = true; }, 6500);
  }
  function startWhispers() {
    if (quoteTimer) return;
    showWhisper();
    quoteTimer = setInterval(showWhisper, 20000);
  }
  if (openLetterBtn) openLetterBtn.addEventListener("click", startWhispers, { once:true });

  // secret modal
  function openModal() {
    if (!modal) return;
    modal.hidden = false;
    modal.style.display = "grid";
    modal.style.pointerEvents = "auto";
    if (secretMsg) secretMsg.hidden = true;
    if (secretInput) {
      secretInput.value = "";
      setTimeout(() => secretInput.focus(), 50);
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.style.display = "none";
    modal.style.pointerEvents = "none";
    modal.hidden = true;
  }

  function unlock() {
    const v = (secretInput?.value || "").trim().toLowerCase();
    if (!secretMsg) return;
    secretMsg.hidden = false;

    if (v === SECRET_WORD_1) {
      secretMsg.textContent = SECRET_TEXT_1;
      spawnHeart(window.innerWidth * 0.5, window.innerHeight * 0.35, true);
      
      return;
    }

    if (v === SECRET_WORD_2) {
      secretMsg.textContent = SECRET_TEXT_2;
      spawnHeart(window.innerWidth * 0.5, window.innerHeight * 0.35, true);
      
      return;
    }

    secretMsg.textContent = "Not quite… try again 💗";
  }

  if (secretBtn) secretBtn.addEventListener("click", openModal);
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (unlockBtn) unlockBtn.addEventListener("click", unlock);

  if (secretInput) secretInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") unlock();
    if (e.key === "Escape") closeModal();
  });

  if (modal) modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  if (controls) {
    const showControls = () => controls.hidden = false;
    openLetterBtn?.addEventListener("click", () => setTimeout(showControls, 500), { once:true });
  }
})();