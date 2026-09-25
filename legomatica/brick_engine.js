/* ========================================================
   BrickMind (LEGO-MATICA) - Ultra Responsive Master Game Engine
   Guaranteed instant response on tap, click and drag
   ======================================================== */

(function() {
  const STORAGE_KEY = 'brickmind_save_v5';
  
  // State
  let gameMode = 'add';
  let currentWorld = 'farm';
  let valA = 3, valB = 2, targetSum = 5;
  let streak = 0, bestStreak = 0, totalSolved = 0;
  let isSolved = false, snappedCount = 0;

  // Multiplication
  let mulRows = 3, mulCols = 4, mulTarget = 12, mulCurrentCount = 0;

  // Blitz
  let blitzTimer = 30, blitzScore = 0, blitzHighScore = 0, blitzInterval = null, blitzActive = false;
  let blitzCurA = 2, blitzCurB = 3, blitzCurAns = 5;

  // Sandbox
  let sandboxItems = [];
  let selectedSandboxItem = '👨‍🌾';

  // World Data
  const worldData = {
    farm: {
      name: 'חוות הלגו 🌾',
      icon: '🚜',
      themeClass: 'theme-farm',
      banner: '🚜 חוות הלגו של BrickMind · התקדמות נשמרת אוטומטית 💾 🌾',
      milestones: [
        { targetSolved: 1, icon: '🏠', name: 'אסם לגו אדום', desc: 'האסם המרכזי הוקם בהצלחה בחווה שלך!' },
        { targetSolved: 3, icon: '🚜', name: 'טרקטור חווה אדום', desc: 'הטרקטור מוכן לעבוד ולחרוש את השדות!' },
        { targetSolved: 5, icon: '💨', name: 'טחנת רוח לגו', desc: 'טחנת הרוח מסתובבת על הגבעה הירוקה!' },
        { targetSolved: 8, icon: '🦆', name: 'בריכת ברווזים', desc: 'הברווזים שוחים בשמחה במים הצלולים!' },
        { targetSolved: 12, icon: '🌾', name: 'שדה חיטה מוזהב', desc: 'שדות החיטה צמחו ומוכנים לקציר!' },
        { targetSolved: 16, icon: '🍎', name: 'פרדס עצי תפוח', desc: 'התפוחים האדומים והמתוקים הבשילו על העצים!' },
        { targetSolved: 20, icon: '👑', name: 'כתר אלוף חוות הלגו', desc: 'השלמת את כל החווה! אתה גאון חשבון אמיתי!' }
      ]
    },
    castle: {
      name: 'טירת האבירים 🏰',
      icon: '🏰',
      themeClass: 'theme-castle',
      banner: '🏰 טירת האבירים של BrickMind · מגדלי שמירה וחומות אבן 🛡️',
      milestones: [
        { targetSolved: 1, icon: '🏰', name: 'מגדל שמירה ראשי', desc: 'המגדל המלכותי מתנשא מעל החומה!' },
        { targetSolved: 3, icon: '🛡️', name: 'גשר מתרומם', desc: 'הגשר המלכותי מגן על הכניסה לטירה!' },
        { targetSolved: 5, icon: '⚔️', name: 'ארסנל האבירים', desc: 'החרבות והמגנים מוכנים להגנת הממלכה!' },
        { targetSolved: 8, icon: '🐴', name: 'אורוות סוסי אבירים', desc: 'הסוסים האצילים מוכנים למסדר המלכותי!' },
        { targetSolved: 12, icon: '🚩', name: 'דגל הממלכה המוזהב', desc: 'דגל הממלכה מתנופף בגאווה בראש המגדל!' },
        { targetSolved: 16, icon: '🐉', name: 'דרקון לגו ידידותי', desc: 'הדרקון הידידותי הצטרף לשמירה על הטירה!' }
      ]
    },
    space: {
      name: 'תחנת החלל 🚀',
      icon: '🚀',
      themeClass: 'theme-space',
      banner: '🚀 תחנת החלל של BrickMind · גלקסיית כפל הלבנים 🪐 ✨',
      milestones: [
        { targetSolved: 1, icon: '🚀', name: 'רקטה רב-שלבית', desc: 'הרקטה מוכנה לשיגור אל עבר הגלקסיה!' },
        { targetSolved: 3, icon: '🛰️', name: 'לוויין סולארי', desc: 'הלוויין משדר אותות מחקר מהחלל העמוק!' },
        { targetSolved: 5, icon: '🪐', name: 'תחנת מחקר ירחית', desc: 'התחנה פועלת ומייצרת חמצן לחוקרים!' },
        { targetSolved: 8, icon: '🛸', name: 'רובר גישוש חללי', desc: 'הרובר נוסע ואוסף דגימות לגו מהכוכב!' },
        { targetSolved: 12, icon: '🌌', name: 'שער בין-כוכבי', desc: 'פתחת את שער הכוכבים לאינסוף ומעבר לו!' }
      ]
    }
  };

  const brickColors = {
    farm: { A: ['#2563eb', '#1d4ed8', '#1e40af'], B: ['#f59e0b', '#d97706', '#b45309'] },
    castle: { A: ['#7c3aed', '#6d28d9', '#5b21b6'], B: ['#10b981', '#059669', '#047857'] },
    space: { A: ['#06b6d4', '#0891b2', '#0e7490'], B: ['#ec4899', '#db2777', '#be185d'] }
  };

  // Helper safe element getter
  function $(id) { return document.getElementById(id); }

  // Load / Save
  function loadProgress() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        streak = d.streak || 0;
        bestStreak = d.bestStreak || streak;
        totalSolved = d.totalSolved || 0;
        currentWorld = d.currentWorld || 'farm';
        gameMode = d.gameMode || 'add';
        blitzHighScore = d.blitzHighScore || 0;
        sandboxItems = d.sandboxItems || [];
      }
    } catch(e) {}
  }

  function saveProgress() {
    try {
      if (streak > bestStreak) bestStreak = streak;
      const d = { streak, bestStreak, totalSolved, currentWorld, gameMode, blitzHighScore, sandboxItems, time: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
    } catch(e) {}
  }

  function applyWorldTheme(w) {
    currentWorld = w;
    document.body.className = worldData[w].themeClass;
    if ($('worldIcon')) $('worldIcon').textContent = worldData[w].icon;
    if ($('worldNameLabel')) $('worldNameLabel').textContent = worldData[w].name;
    if ($('footerBannerText')) $('footerBannerText').textContent = worldData[w].banner;
    document.querySelectorAll('.world-card').forEach(c => c.classList.toggle('active-card', c.dataset.world === w));
    updateProgressUI();
    saveProgress();
  }

  function updateProgressUI() {
    const list = worldData[currentWorld].milestones;
    let nextMilestone = list.find(m => totalSolved < m.targetSolved);

    if ($('farmProgressFill') && $('farmProgressText')) {
      if (nextMilestone) {
        const prevTarget = list[list.indexOf(nextMilestone) - 1]?.targetSolved || 0;
        const pct = Math.min(100, Math.max(10, Math.round(((totalSolved - prevTarget) / (nextMilestone.targetSolved - prevTarget)) * 100)));
        $('farmProgressFill').style.width = pct + '%';
        $('farmProgressText').textContent = `היעד הבא: ${nextMilestone.name} (${totalSolved}/${nextMilestone.targetSolved})`;
      } else {
        $('farmProgressFill').style.width = '100%';
        $('farmProgressText').textContent = `✨ כל מבני ${worldData[currentWorld].name} הושלמו!`;
      }
    }

    if ($('farmBadges')) {
      $('farmBadges').innerHTML = '';
      list.forEach(m => {
        const unl = totalSolved >= m.targetSolved;
        const b = document.createElement('div');
        b.className = `farm-unlocked-badge ${unl ? 'is-unlocked' : 'is-locked'}`;
        b.textContent = m.icon;
        b.title = `${m.name} (${unl ? 'נפתח' : 'נעול'})`;
        if (unl) {
          b.onclick = () => {
            if (window.legoSound) window.legoSound.playSoundEffect('cow');
            b.classList.add('badge-bounce');
            setTimeout(() => b.classList.remove('badge-bounce'), 500);
          };
        }
        $('farmBadges').appendChild(b);
      });
    }
  }

  function generateNewProblem() {
    isSolved = false;
    snappedCount = 0;
    if ($('answerDisplay')) {
      $('answerDisplay').textContent = '?';
      $('answerDisplay').classList.remove('revealed');
    }
    if ($('mathCard')) $('mathCard').classList.remove('solved-pulse');
    if ($('towerCountBadge')) $('towerCountBadge').textContent = '0';
    if ($('towerStack')) $('towerStack').innerHTML = '';
    if ($('slotsA')) $('slotsA').innerHTML = '';
    if ($('slotsB')) $('slotsB').innerHTML = '';

    if (gameMode === 'mul') {
      setupMultiplicationMode();
      return;
    }

    if ($('standardLayout')) $('standardLayout').style.display = 'grid';
    if ($('multiplicationLayout')) $('multiplicationLayout').style.display = 'none';

    if (gameMode === 'add') {
      if ($('mainOp')) $('mainOp').textContent = '+';
      valA = Math.floor(Math.random() * 4) + 1;
      valB = Math.floor(Math.random() * 4) + 1;
      targetSum = valA + valB;
      if ($('snapHintText')) $('snapHintText').textContent = `הקש על קוביות כחולות (${valA}) וזהובות (${valB}) לבניית המגדל!`;
    } else if (gameMode === 'sub') {
      if ($('mainOp')) $('mainOp').textContent = '-';
      valA = Math.floor(Math.random() * 5) + 3;
      valB = Math.floor(Math.random() * (valA - 1)) + 1;
      targetSum = valA - valB;
      if ($('snapHintText')) $('snapHintText').textContent = `במגדל יש ${valA} לבנים. הקש עליו כדי לנתק ${valB} לבנים!`;
    }

    if ($('valA')) $('valA').textContent = valA;
    if ($('valB')) $('valB').textContent = valB;
    if ($('streakCount')) $('streakCount').textContent = streak;

    setupStandardArena();
  }

  function setupStandardArena() {
    const pal = brickColors[currentWorld] || brickColors.farm;
    if (gameMode === 'add') {
      if ($('trayALabel')) $('trayALabel').textContent = 'קבוצה 1';
      if ($('trayBLabel')) $('trayBLabel').textContent = 'קבוצה 2';
      if ($('trayACount')) $('trayACount').textContent = `${valA} לבנים`;
      if ($('trayBCount')) $('trayBCount').textContent = `${valB} לבנים`;
      for (let i = 0; i < valA; i++) createTrayBrick('A', i, pal.A, $('slotsA'));
      for (let i = 0; i < valB; i++) createTrayBrick('B', i, pal.B, $('slotsB'));
    } else if (gameMode === 'sub') {
      if ($('trayALabel')) $('trayALabel').textContent = 'מגדל קיים';
      if ($('trayBLabel')) $('trayBLabel').textContent = 'לבנים לניתוק';
      if ($('trayACount')) $('trayACount').textContent = `${valA} סך הכל`;
      if ($('trayBCount')) $('trayBCount').textContent = `יעד: ${valB}`;
      for (let i = 0; i < valA; i++) {
        const color = i < (valA - valB) ? pal.A[0] : pal.B[0];
        const brick = createTowerBrick(color, 'sub-brick');
        brick.onclick = () => handleSubtractionDetach(brick);
        if ($('towerStack')) $('towerStack').appendChild(brick);
      }
      snappedCount = valA;
      if ($('towerCountBadge')) $('towerCountBadge').textContent = snappedCount;
    }
  }

  function createTrayBrick(group, idx, colorArr, container) {
    if (!container) return;
    const slot = document.createElement('div');
    slot.className = 'tray-slot-box';
    const brick = document.createElement('div');
    brick.className = `lego-brick brick-${group.toLowerCase()}`;
    brick.style.background = `linear-gradient(135deg, ${colorArr[0]} 0%, ${colorArr[1]} 60%, ${colorArr[2]} 100%)`;
    brick.dataset.group = group;
    brick.dataset.snapped = 'false';

    const studsWrapper = document.createElement('div');
    studsWrapper.className = 'studs-row';
    for (let s = 0; s < 4; s++) {
      const stud = document.createElement('span');
      stud.className = 'stud';
      studsWrapper.appendChild(stud);
    }
    brick.appendChild(studsWrapper);

    // Direct, immediate tap click
    brick.addEventListener('click', (e) => {
      e.stopPropagation();
      snapBrickToTower(brick, colorArr[0]);
    });

    // Touch & Pointer drag handler
    let startX = 0, startY = 0, curX = 0, curY = 0, isDragging = false, moved = false;

    brick.addEventListener('pointerdown', (e) => {
      if (brick.dataset.snapped === 'true' || isSolved) return;
      isDragging = true;
      moved = false;
      startX = e.clientX; startY = e.clientY;
      brick.classList.add('is-dragging');
      brick.setPointerCapture?.(e.pointerId);
    });

    brick.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      curX = e.clientX - startX; curY = e.clientY - startY;
      if (Math.abs(curX) > 5 || Math.abs(curY) > 5) moved = true;
      brick.style.transform = `translate3d(${curX}px, ${curY}px, 0) scale(1.08)`;
    });

    brick.addEventListener('pointerup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      brick.classList.remove('is-dragging');

      if (!moved) {
        // Pure Tap
        snapBrickToTower(brick, colorArr[0]);
      } else if (Math.abs(curX) > 50 || Math.abs(curY) > 40) {
        // Dragged towards center
        snapBrickToTower(brick, colorArr[0]);
      } else {
        brick.style.transform = 'translate3d(0, 0, 0)';
      }
    });

    slot.appendChild(brick);
    container.appendChild(slot);
  }

  function snapBrickToTower(brick, color) {
    if (brick.dataset.snapped === 'true' || isSolved) return;
    brick.dataset.snapped = 'true';
    brick.classList.add('snapped-out');

    if (window.legoSound) window.legoSound.playSnapClick(1.0 + (snappedCount * 0.08));
    const tb = createTowerBrick(color);
    if ($('towerStack')) $('towerStack').appendChild(tb);
    snappedCount++;
    if ($('towerCountBadge')) $('towerCountBadge').textContent = snappedCount;

    if (snappedCount === targetSum) handleSuccess();
  }

  function createTowerBrick(color, extraClass = '') {
    const b = document.createElement('div');
    b.className = `tower-brick snap-pop ${extraClass}`;
    b.style.backgroundColor = color;
    const studs = document.createElement('div');
    studs.className = 'studs-row';
    for (let s = 0; s < 4; s++) {
      const st = document.createElement('span');
      st.className = 'stud';
      studs.appendChild(st);
    }
    b.appendChild(studs);
    return b;
  }

  function handleSubtractionDetach(brick) {
    if (isSolved || brick.dataset.removed === 'true') return;
    brick.dataset.removed = 'true';
    brick.classList.add('detached-fly');
    if (window.legoSound) window.legoSound.playDetachPop();
    snappedCount--;
    if ($('towerCountBadge')) $('towerCountBadge').textContent = snappedCount;
    setTimeout(() => brick.style.display = 'none', 280);
    if (snappedCount === targetSum) handleSuccess();
  }

  function setupMultiplicationMode() {
    if ($('standardLayout')) $('standardLayout').style.display = 'none';
    if ($('multiplicationLayout')) $('multiplicationLayout').style.display = 'flex';
    if ($('mainOp')) $('mainOp').textContent = '✖️';
    mulRows = Math.floor(Math.random() * 3) + 2;
    mulCols = Math.floor(Math.random() * 3) + 2;
    mulTarget = mulRows * mulCols;
    mulCurrentCount = 0;

    if ($('valA')) $('valA').textContent = mulRows;
    if ($('valB')) $('valB').textContent = mulCols;
    if ($('mulRows')) $('mulRows').textContent = mulRows;
    if ($('mulCols')) $('mulCols').textContent = mulCols;
    if ($('mulTotalVal')) $('mulTotalVal').textContent = `0 / ${mulTarget}`;
    if ($('snapHintText')) $('snapHintText').textContent = `בנה ${mulRows} שורות של ${mulCols} בליטות לגו! הקש על השורות!`;

    if ($('mulGridPlate')) {
      $('mulGridPlate').innerHTML = '';
      const pal = brickColors[currentWorld] || brickColors.space;
      for (let r = 0; r < mulRows; r++) {
        const rowPlate = document.createElement('div');
        rowPlate.className = 'mul-row-plate';
        for (let c = 0; c < mulCols; c++) {
          const sb = document.createElement('div');
          sb.className = 'mul-stud-box';
          sb.innerHTML = '<span class="stud"></span>';
          rowPlate.appendChild(sb);
        }
        rowPlate.onclick = () => {
          if (rowPlate.dataset.assembled === 'true' || isSolved) return;
          rowPlate.dataset.assembled = 'true';
          rowPlate.classList.add('assembled');
          rowPlate.style.backgroundColor = pal.A[r % pal.A.length];
          if (window.legoSound) window.legoSound.playSnapClick(1.1 + (r * 0.1));
          mulCurrentCount += mulCols;
          if ($('mulTotalVal')) $('mulTotalVal').textContent = `${mulCurrentCount} / ${mulTarget}`;
          if (mulCurrentCount === mulTarget) handleSuccess();
        };
        $('mulGridPlate').appendChild(rowPlate);
      }
    }
  }

  function handleSuccess() {
    isSolved = true;
    streak++;
    totalSolved++;
    if ($('streakCount')) $('streakCount').textContent = streak;
    if ($('answerDisplay')) {
      $('answerDisplay').textContent = targetSum || mulTarget;
      $('answerDisplay').classList.add('revealed');
    }
    if ($('mathCard')) $('mathCard').classList.add('solved-pulse');

    if (window.legoSound) window.legoSound.playVictoryFanfare();
    triggerConfetti();
    if (window.legoSound) window.legoSound.cheerInHebrew('כל הכבוד אלוף, עוד לבנה הונחה במקום!');
    saveProgress();
    updateProgressUI();

    const m = worldData[currentWorld].milestones.find(m => m.targetSolved === totalSolved);
    if (m && $('rewardModal')) {
      if ($('rewardIcon')) $('rewardIcon').textContent = m.icon;
      if ($('rewardName')) $('rewardName').textContent = m.name;
      if ($('rewardDesc')) $('rewardDesc').textContent = m.desc;
      $('rewardModal').classList.add('active');
    } else {
      setTimeout(() => generateNewProblem(), 1500);
    }
  }

  function triggerConfetti() {
    const canvas = $('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const p = [];
    for (let i = 0; i < 40; i++) {
      p.push({
        x: canvas.width / 2, y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 1) * 12,
        color: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'][i % 5]
      });
    }
    let f = 0;
    function anim() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      p.forEach(pt => {
        pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.35;
        ctx.fillStyle = pt.color; ctx.fillRect(pt.x, pt.y, 8, 6);
      });
      if (++f < 60) requestAnimationFrame(anim);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(anim);
  }

  // ==========================================
  // SANDBOX
  // ==========================================
  function setupSandbox() {
    document.querySelectorAll('.btn-picker-item').forEach(btn => {
      btn.onclick = () => {
        selectedSandboxItem = btn.dataset.item;
        document.querySelectorAll('.btn-picker-item').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      };
    });

    if ($('sandboxCanvasArea')) {
      $('sandboxCanvasArea').onclick = (e) => {
        const rect = $('sandboxCanvasArea').getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        addSandboxItem(selectedSandboxItem, x, y);
      };
    }

    if ($('btnSandboxClear')) {
      $('btnSandboxClear').onclick = () => {
        sandboxItems = [];
        renderSandboxItems();
        saveProgress();
      };
    }

    renderSandboxItems();
  }

  function addSandboxItem(emoji, x, y) {
    sandboxItems.push({ emoji, x, y, id: Date.now() });
    if (window.legoSound) window.legoSound.playSoundEffect('cow');
    renderSandboxItems();
    saveProgress();
  }

  function renderSandboxItems() {
    if (!$('sandboxPlacedItems')) return;
    $('sandboxPlacedItems').innerHTML = '';
    sandboxItems.forEach(item => {
      const el = document.createElement('div');
      el.className = 'placed-sandbox-item';
      el.textContent = item.emoji;
      el.style.left = item.x + '%';
      el.style.top = item.y + '%';
      el.onclick = (e) => {
        e.stopPropagation();
        if (window.legoSound) window.legoSound.playSnapClick(1.4);
        el.classList.add('badge-bounce');
        setTimeout(() => el.classList.remove('badge-bounce'), 450);
      };
      $('sandboxPlacedItems').appendChild(el);
    });
  }

  // ==========================================
  // BLITZ
  // ==========================================
  function setupBlitz() {
    if ($('btnStartBlitz')) $('btnStartBlitz').onclick = startBlitzGame;
    if ($('blitzHighScore')) $('blitzHighScore').textContent = blitzHighScore;
  }

  function startBlitzGame() {
    blitzActive = true;
    blitzScore = 0;
    blitzTimer = 30;
    if ($('blitzScore')) $('blitzScore').textContent = blitzScore;
    if ($('btnStartBlitz')) $('btnStartBlitz').style.display = 'none';
    if (window.legoSound) window.legoSound.cheerInHebrew('אתגר הבזק מתחיל!');

    generateBlitzProblem();

    clearInterval(blitzInterval);
    blitzInterval = setInterval(() => {
      blitzTimer--;
      if ($('blitzTimer')) $('blitzTimer').textContent = `⏳ ${blitzTimer} שניות`;
      if (blitzTimer <= 0) endBlitzGame();
    }, 1000);
  }

  function generateBlitzProblem() {
    if (!blitzActive) return;
    blitzCurA = Math.floor(Math.random() * 5) + 1;
    blitzCurB = Math.floor(Math.random() * 5) + 1;
    blitzCurAns = blitzCurA + blitzCurB;

    if ($('blitzValA')) $('blitzValA').textContent = blitzCurA;
    if ($('blitzValB')) $('blitzValB').textContent = blitzCurB;

    const options = [blitzCurAns];
    while (options.length < 4) {
      const fake = Math.max(1, blitzCurAns + (Math.floor(Math.random() * 5) - 2));
      if (!options.includes(fake)) options.push(fake);
    }
    options.sort(() => Math.random() - 0.5);

    if ($('blitzAnswersGrid')) {
      $('blitzAnswersGrid').innerHTML = '';
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn-blitz-opt';
        btn.textContent = opt;
        btn.onclick = () => {
          if (!blitzActive) return;
          if (opt === blitzCurAns) {
            blitzScore++;
            if ($('blitzScore')) $('blitzScore').textContent = blitzScore;
            if (window.legoSound) window.legoSound.playSnapClick(1.2 + (blitzScore * 0.05));
            generateBlitzProblem();
          } else {
            if (window.legoSound) window.legoSound.playDetachPop();
            btn.classList.add('opt-wrong');
          }
        };
        $('blitzAnswersGrid').appendChild(btn);
      });
    }
  }

  function endBlitzGame() {
    blitzActive = false;
    clearInterval(blitzInterval);
    if (blitzScore > blitzHighScore) {
      blitzHighScore = blitzScore;
      saveProgress();
    }
    if ($('blitzHighScore')) $('blitzHighScore').textContent = blitzHighScore;
    if ($('btnStartBlitz')) {
      $('btnStartBlitz').style.display = 'inline-block';
      $('btnStartBlitz').textContent = 'שחק שוב 🚀';
    }
    if (window.legoSound) window.legoSound.cheerInHebrew(`בנית ${blitzScore} מגדלים. כל הכבוד!`);
  }

  // ==========================================
  // PARENTS DASHBOARD
  // ==========================================
  function updateParentsDashboard() {
    if ($('statTotalSolved')) $('statTotalSolved').textContent = totalSolved;
    if ($('statBestStreak')) $('statBestStreak').textContent = bestStreak;
    const list = worldData[currentWorld].milestones;
    const unl = list.filter(m => totalSolved >= m.targetSolved).length;
    if ($('statUnlocks')) $('statUnlocks').textContent = `${unl} / ${list.length}`;
  }

  // Event Listeners
  function setupEventListeners() {
    if ($('btnModeAdd')) $('btnModeAdd').onclick = () => setMode('add');
    if ($('btnModeSub')) $('btnModeSub').onclick = () => setMode('sub');
    if ($('btnModeMul')) $('btnModeMul').onclick = () => setMode('mul');

    function setMode(m) {
      gameMode = m;
      if ($('btnModeAdd')) $('btnModeAdd').classList.toggle('active', m === 'add');
      if ($('btnModeSub')) $('btnModeSub').classList.toggle('active', m === 'sub');
      if ($('btnModeMul')) $('btnModeMul').classList.toggle('active', m === 'mul');
      if (window.legoSound) window.legoSound.playSnapClick(1.2);
      saveProgress();
      generateNewProblem();
    }

    if ($('btnWorldSelect')) $('btnWorldSelect').onclick = () => $('worldModal')?.classList.add('active');
    if ($('btnCloseWorldModal')) $('btnCloseWorldModal').onclick = () => $('worldModal')?.classList.remove('active');
    
    document.querySelectorAll('.btn-select-world').forEach(b => {
      b.onclick = (e) => {
        applyWorldTheme(e.target.dataset.world);
        $('worldModal')?.classList.remove('active');
        generateNewProblem();
      };
    });

    if ($('btnSandbox')) $('btnSandbox').onclick = () => $('sandboxOverlay')?.classList.add('active');
    if ($('btnCloseSandbox')) $('btnCloseSandbox').onclick = () => $('sandboxOverlay')?.classList.remove('active');

    if ($('btnBlitz')) $('btnBlitz').onclick = () => $('blitzOverlay')?.classList.add('active');
    if ($('btnCloseBlitz')) {
      $('btnCloseBlitz').onclick = () => {
        blitzActive = false;
        clearInterval(blitzInterval);
        $('blitzOverlay')?.classList.remove('active');
      };
    }

    if ($('btnParents')) {
      $('btnParents').onclick = () => {
        updateParentsDashboard();
        $('parentsModal')?.classList.add('active');
      };
    }
    if ($('btnCloseParents')) $('btnCloseParents').onclick = () => $('parentsModal')?.classList.remove('active');

    if ($('btnRewardContinue')) {
      $('btnRewardContinue').onclick = () => {
        $('rewardModal')?.classList.remove('active');
        generateNewProblem();
      };
    }

    if ($('btnSound')) {
      $('btnSound').onclick = () => {
        if (window.legoSound) {
          window.legoSound.enabled = !window.legoSound.enabled;
          $('btnSound').textContent = window.legoSound.enabled ? '🔊' : '🔇';
        }
      };
    }
    if ($('btnVoice')) {
      $('btnVoice').onclick = () => {
        if (window.legoSound) {
          window.legoSound.voiceEnabled = !window.legoSound.voiceEnabled;
          $('btnVoice').textContent = window.legoSound.voiceEnabled ? '🗣️' : '🤐';
        }
      };
    }
  }

  function init() {
    loadProgress();
    applyWorldTheme(currentWorld);
    setupEventListeners();
    setupSandbox();
    setupBlitz();
    generateNewProblem();
    console.log('🚀 BrickMind Engine initialized with 100% click guarantee');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
