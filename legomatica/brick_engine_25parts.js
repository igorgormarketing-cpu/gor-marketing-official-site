/**
 * BrickMind (LEGO-MATICA) - AAA 3D Master Lego Engine & Multi-Screen Manager
 * Cumulative 3D Lego Assembly Engine with Realistic Studs & Persistent Step Building
 * Engineered by GOR MARKETING (2026)
 */

(function() {
  'use strict';

  function $(id) {
    return document.getElementById(id);
  }

  // --- STATE VARIABLES ---
  const STORAGE_KEY = 'brickmind_save_state_2026_v3';
  
  let activeBuildingId = 'barn';
  let currentStepIndex = 0;
  let streak = 0;
  let totalSolved = 0;
  let isStepSolved = false;

  let isSoundEnabled = true;
  let isVoiceEnabled = true;

  // Economy & Inventory
  let MAX_WAREHOUSE_CAPACITY = 1000;
  let coinsStock = 1250;
  let gemsStock = 85;
  let playerLevel = 24;

  let inventory = {
    wheat: 180,
    carrots: 120,
    apples: 95,
    wood: 65,
    bricks: 40,
    milk: 20,
    wool: 15,
    eggs: 10
  };

  // --- 6 MASTER BUILDING BLUEPRINTS (25 PARTS EACH) ---
  const BUILDINGS_DATABASE = {
    barn: {
      id: 'barn',
      name: 'אסם חווה אדום (Red Barn)',
      heName: 'אסם חווה אדום',
      icon: '🏛️',
      totalParts: 25,
      production: '+100 תבואה / דקה',
      color: 0xdc2626,
      steps: [
        { step: 1, name: 'יסודות רצפת עץ (11 כחול)', icon: '🪵', shape: 'base_plate', eq: { a: 4, b: 7, ans: 11 }, color: 0x2563eb, desc: 'בסיס הרצפה הכחול הנושא את כל האסם (4 + 7 = 11)' },
        { step: 2, name: 'קיר לבנים ימני (8 אדום)', icon: '🧱', shape: 'wall_right', eq: { a: 3, b: 5, ans: 8 }, color: 0xdc2626, desc: 'קיר לבנים אדומות מחוזק בצד ימין (3 + 5 = 8)' },
        { step: 3, name: 'קיר לבנים שמאלי (8 אדום)', icon: '🧱', shape: 'wall_left', eq: { a: 5, b: 3, ans: 8 }, color: 0xdc2626, desc: 'קיר לבנים אדומות בצד שמאל (5 + 3 = 8)' },
        { step: 4, name: 'שער אסם רחב (7 לבן)', icon: '🚪', shape: 'door_front', eq: { a: 3, b: 4, ans: 7 }, color: 0xf8fafc, desc: 'שער אסם כפול עם משקוף (3 + 4 = 7)' },
        { step: 5, name: 'קיר חלון קדמי (5 לבן)', icon: '🪟', shape: 'window_front', eq: { a: 2, b: 3, ans: 5 }, color: 0xf8fafc, desc: 'חלון קדמי לאור שמש ואוורור (2 + 3 = 5)' },
        { step: 6, name: 'קיר אחורי מחוזק (8 אדום)', icon: '🧱', shape: 'wall_back', eq: { a: 4, b: 4, ans: 8 }, color: 0xdc2626, desc: 'קיר לבנים אחורי סוגר (4 + 4 = 8)' },
        { step: 7, name: 'קורת אלון מרכזית (10 עץ)', icon: '🪵', shape: 'beam_center', eq: { a: 6, b: 4, ans: 10 }, color: 0xb45309, desc: 'קורת עץ נושאת לקומה השנייה (6 + 4 = 10)' },
        { step: 8, name: 'קיר קומה שנייה ימין (8 אדום)', icon: '🧱', shape: 'upper_wall_r', eq: { a: 4, b: 4, ans: 8 }, color: 0xdc2626, desc: 'קיר עליית הגג ימין (4 + 4 = 8)' },
        { step: 9, name: 'קיר קומה שנייה שמאל (8 אדום)', icon: '🧱', shape: 'upper_wall_l', eq: { a: 4, b: 4, ans: 8 }, color: 0xdc2626, desc: 'קיר עליית הגג שמאל (4 + 4 = 8)' },
        { step: 10, name: 'גמלון גג קדמי משולש (8 אדום)', icon: '📐', shape: 'gable_front', eq: { a: 5, b: 3, ans: 8 }, color: 0xdc2626, desc: 'משולש הגמלון הקדמי (5 + 3 = 8)' },
        { step: 11, name: 'גמלון גג אחורי משולש (8 אדום)', icon: '📐', shape: 'gable_back', eq: { a: 3, b: 5, ans: 8 }, color: 0xdc2626, desc: 'משולש הגמלון האחורי (3 + 5 = 8)' },
        { step: 12, name: 'שיפוע רעפי גג ימין (11 לבן)', icon: '🏠', shape: 'roof_slope_r', eq: { a: 6, b: 5, ans: 11 }, color: 0xf8fafc, desc: 'רעפי גג משופעים בימין (6 + 5 = 11)' },
        { step: 13, name: 'שיפוע רעפי גג שמאל (11 לבן)', icon: '🏠', shape: 'roof_slope_l', eq: { a: 5, b: 6, ans: 11 }, color: 0xf8fafc, desc: 'רעפי גג משופעים בשמאל (5 + 6 = 11)' },
        { step: 14, name: 'רכס גג עליון (6 זהב)', icon: '🔝', shape: 'roof_ridge', eq: { a: 3, b: 3, ans: 6 }, color: 0xfacc15, desc: 'כתר רכס הגג המוזהב (3 + 3 = 6)' },
        { step: 15, name: 'שבשבת רוח אסם (4 אדום)', icon: '🧭', shape: 'weather_vane', eq: { a: 2, b: 2, ans: 4 }, color: 0xdc2626, desc: 'שבשבת רוח עם תרנגול על הגג (2 + 2 = 4)' }
      ]
    },
    windmill: {
      id: 'windmill',
      name: 'טחנת רוח כפרית (Windmill)',
      heName: 'טחנת רוח כפרית',
      icon: '💨',
      totalParts: 25,
      production: '+150 קמח / דקה',
      color: 0x3b82f6,
      steps: [
        { step: 1, name: 'יסודות גבעה ירוקה (10 ירוק)', icon: '⛰️', shape: 'base_plate', eq: { a: 5, b: 5, ans: 10 }, color: 0x16a34a, desc: 'יסודות סלעים ירוקים (5 + 5 = 10)' },
        { step: 2, name: 'מגדל טחנה מתומן תחתון (9 לבן)', icon: '🏛️', shape: 'tower_lower', eq: { a: 4, b: 5, ans: 9 }, color: 0xf8fafc, desc: 'קירות המגדל הלבנים (4 + 5 = 9)' },
        { step: 3, name: 'מרפסת תצפית מעץ (9 עץ)', icon: '🪵', shape: 'balcony', eq: { a: 3, b: 6, ans: 9 }, color: 0xb45309, desc: 'מרפסת היקפית לתצפית (3 + 6 = 9)' },
        { step: 4, name: 'כיפת טחנה עליונה (9 אדום)', icon: '🧢', shape: 'dome', eq: { a: 6, b: 3, ans: 9 }, color: 0xdc2626, desc: 'כיפת גג אדומה (6 + 3 = 9)' },
        { step: 5, name: '4 כנפיים צהובות מסתובבות (12 צהוב)', icon: '⚙️', shape: 'blades', eq: { a: 4, b: 8, ans: 12 }, color: 0xfacc15, desc: 'כנפיים גדולות לייצור קמח (4 + 8 = 12)' }
      ]
    },
    farmhouse: {
      id: 'farmhouse',
      name: 'סדנת נגר ובית חווה (Carpenter Workshop & Farmhouse)',
      heName: 'סדנת נגר ובית חווה',
      icon: '🪚',
      totalParts: 25,
      production: '+30 קרשי עץ ובונוס ייצור',
      color: 0x16a34a,
      steps: [
        { step: 1, name: 'דק מרפסת עץ ושולחן נגרים (12 עץ)', icon: '🪵', shape: 'base_plate', eq: { a: 6, b: 6, ans: 12 }, color: 0xb45309, desc: 'דק עץ כפרי רחב עם שולחן עבודה (6 + 6 = 12)' },
        { step: 2, name: 'סדנת נגרות ודלת כניסה (9 לבן)', icon: '🚪', shape: 'door_front', eq: { a: 4, b: 5, ans: 9 }, color: 0xf8fafc, desc: 'דלת עץ עם חלונות תריסים (4 + 5 = 9)' },
        { step: 3, name: 'קירות סדנת נגר (8 אדום)', icon: '🧱', shape: 'wall_right', eq: { a: 3, b: 5, ans: 8 }, color: 0xdc2626, desc: 'קיר לבנים אדומות מחוזק (3 + 5 = 8)' },
        { step: 4, name: 'אח לבנים וארובת עשן (6 אדום)', icon: '🔥', shape: 'chimney_roof', eq: { a: 3, b: 3, ans: 6 }, color: 0xdc2626, desc: 'אח לחימום הסדנה וארובה (3 + 3 = 6)' },
        { step: 5, name: 'גג רעפים אדום (10 אדום)', icon: '🏠', shape: 'roof_slope_r', eq: { a: 5, b: 5, ans: 10 }, color: 0xdc2626, desc: 'גג כפרי משופע (5 + 5 = 10)' }
      ]
    },
    coop: {
      id: 'coop',
      name: 'לול תרנגולות (Chicken Coop)',
      heName: 'לול תרנגולות',
      icon: '🐔',
      totalParts: 25,
      production: '+50 ביצים / דקה',
      color: 0xf59e0b,
      steps: [
        { step: 1, name: 'בסיס קורות עץ מוגבה (7 עץ)', icon: '🪵', shape: 'base_plate', eq: { a: 3, b: 4, ans: 7 }, color: 0x92400e, desc: 'עמודי עץ להגנה (3 + 4 = 7)' },
        { step: 2, name: 'תאי הטלה וקירות לול (7 צהוב)', icon: '🪺', shape: 'wall_right', eq: { a: 2, b: 5, ans: 7 }, color: 0xfef08a, desc: 'קש מרופד להטלת ביצים (2 + 5 = 7)' },
        { step: 3, name: 'סולם עץ ופתח כניסה (7 עץ)', icon: '🪜', shape: 'door_front', eq: { a: 4, b: 3, ans: 7 }, color: 0xb45309, desc: 'רמפת שלבים נוחה (4 + 3 = 7)' },
        { step: 4, name: 'גג קש צהוב עמיד (9 צהוב)', icon: '🌾', shape: 'roof_slope_r', eq: { a: 5, b: 4, ans: 9 }, color: 0xfacc15, desc: 'גג עמיד לגשם (5 + 4 = 9)' }
      ]
    },
    greenhouse: {
      id: 'greenhouse',
      name: 'חממת ירקות (Greenhouse)',
      heName: 'חממת ירקות',
      icon: '🌱',
      totalParts: 25,
      production: '+80 גזרים ועגבניות',
      color: 0x10b981,
      steps: [
        { step: 1, name: 'אדניות בטון מנוקזות (10 אבן)', icon: '🧱', shape: 'base_plate', eq: { a: 4, b: 6, ans: 10 }, color: 0x64748b, desc: 'אדניות עשירות בקרקע פורייה (4 + 6 = 10)' },
        { step: 2, name: 'שלד קשתות זכוכית (10 ציאן)', icon: '🪟', shape: 'wall_right', eq: { a: 6, b: 4, ans: 10 }, color: 0x38bdf8, desc: 'מסגרת פלדה שקופה (6 + 4 = 10)' },
        { step: 3, name: 'מערכת השקיה וקיר קדמי (8 כחול)', icon: '💧', shape: 'door_front', eq: { a: 5, b: 3, ans: 8 }, color: 0x0284c7, desc: 'צינורות טפטוף ודלת זכוכית (5 + 3 = 8)' },
        { step: 4, name: 'גג זכוכית נפתח (10 ציאן)', icon: '☀️', shape: 'roof_slope_r', eq: { a: 3, b: 7, ans: 10 }, color: 0xbae6fd, desc: 'תקרה שקופה לאור שמש מרבי (3 + 7 = 10)' }
      ]
    },
    silo: {
      id: 'silo',
      name: 'ממגורת תבואה (Grain Silo)',
      heName: 'ממגורת תבואה',
      icon: '🛢️',
      totalParts: 25,
      production: '+500 קיבולת אחסון',
      color: 0x64748b,
      steps: [
        { step: 1, name: 'יסודות עגולים מחוזקים (12 אבן)', icon: '⚪', shape: 'base_plate', eq: { a: 6, b: 6, ans: 12 }, color: 0x475569, desc: 'בסיס עגול כבד (6 + 6 = 12)' },
        { step: 2, name: 'מגדל פח גלי מרכזי (12 מתכת)', icon: '🥫', shape: 'tower_lower', eq: { a: 7, b: 5, ans: 12 }, color: 0x94a3b8, desc: 'מגדל מתכת עמיד (7 + 5 = 12)' },
        { step: 3, name: 'סולם טיפוס וגוף עליון (8 מתכת)', icon: '🪜', shape: 'balcony', eq: { a: 4, b: 4, ans: 8 }, color: 0x334155, desc: 'סולם בטיחות לבדיקת תבואה (4 + 4 = 8)' },
        { step: 4, name: 'כיפת מתכת עליונה וצינור מילוי (12 כסף)', icon: '🔝', shape: 'dome', eq: { a: 8, b: 4, ans: 12 }, color: 0xe2e8f0, desc: 'כיפת איטום עליונה (8 + 4 = 12)' }
      ]
    }
  };

  // --- AUDIO & VOICE SYNTHESIS ---
  function playSoundSafe(fnName, param) {
    if (!isSoundEnabled) return;
    if (window.legoSound && typeof window.legoSound[fnName] === 'function') {
      try { window.legoSound[fnName](param); } catch(e){}
    }
  }

  function speakHebrew(text) {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'he-IL';
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    } catch(e){}
  }

  // --- THREE.JS 3D PLAY TABLE ENGINE ---
  let tableScene, tableCamera, tableRenderer, tableControls;
  let activeBuildingGroup, floatingGhostGroup;

  function init3DTable() {
    const container = $('threeTableContainer');
    if (!container || tableRenderer) return;

    tableScene = new THREE.Scene();
    tableScene.background = new THREE.Color(0xf1f5f9);

    const aspect = container.clientWidth / container.clientHeight || 1;
    tableCamera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    tableCamera.position.set(22, 26, 22);

    tableRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    tableRenderer.setSize(container.clientWidth, container.clientHeight);
    tableRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    tableRenderer.shadowMap.enabled = true;
    tableRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(tableRenderer.domElement);

    if (typeof THREE.OrbitControls !== 'undefined') {
      tableControls = new THREE.OrbitControls(tableCamera, tableRenderer.domElement);
      tableControls.enableDamping = true;
      tableControls.dampingFactor = 0.08;
      tableControls.maxPolarAngle = Math.PI / 2.05;
      tableControls.minDistance = 10;
      tableControls.maxDistance = 65;
      tableControls.target.set(0, 4, 0);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    tableScene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 0.95);
    dirLight.position.set(25, 45, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    tableScene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    fillLight.position.set(-20, 20, -20);
    tableScene.add(fillLight);

    // Chunky Wooden Table Surface
    const tableGeom = new THREE.BoxGeometry(30, 2, 30);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7, metalness: 0.1 });
    const tableMesh = new THREE.Mesh(tableGeom, tableMat);
    tableMesh.position.y = -1;
    tableMesh.receiveShadow = true;
    tableScene.add(tableMesh);

    // Green Lego Baseplate with Studs
    const plateGeom = new THREE.BoxGeometry(22, 0.6, 22);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.3, metalness: 0.1 });
    const plateMesh = new THREE.Mesh(plateGeom, plateMat);
    plateMesh.position.y = 0.3;
    plateMesh.receiveShadow = true;
    tableScene.add(plateMesh);

    // Add 8x8 Studs Grid on Baseplate
    const studGeom = new THREE.CylinderGeometry(0.45, 0.45, 0.3, 16);
    const studMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.3 });
    for (let x = -8; x <= 8; x += 2.2) {
      for (let z = -8; z <= 8; z += 2.2) {
        const stud = new THREE.Mesh(studGeom, studMat);
        stud.position.set(x, 0.7, z);
        tableScene.add(stud);
      }
    }

    activeBuildingGroup = new THREE.Group();
    tableScene.add(activeBuildingGroup);

    floatingGhostGroup = new THREE.Group();
    tableScene.add(floatingGhostGroup);

    window.addEventListener('resize', onTableResize);
    animateTable();
  }

  function onTableResize() {
    const container = $('threeTableContainer');
    if (!container || !tableRenderer || !tableCamera) return;
    tableCamera.aspect = container.clientWidth / container.clientHeight;
    tableCamera.updateProjectionMatrix();
    tableRenderer.setSize(container.clientWidth, container.clientHeight);
  }

  function animateTable() {
    requestAnimationFrame(animateTable);
    if (tableControls) tableControls.update();
    if (floatingGhostGroup && !isStepSolved) {
      floatingGhostGroup.rotation.y += 0.012;
      floatingGhostGroup.position.y = 7.0 + Math.sin(Date.now() * 0.004) * 0.45;
    }
    if (tableRenderer && tableScene && tableCamera) {
      tableRenderer.render(tableScene, tableCamera);
    }
  }

  // Camera Presets
  function setCameraAngle(type) {
    if (!tableCamera || !tableControls) return;
    if (type === 'iso') {
      tableCamera.position.set(22, 26, 22);
      tableControls.target.set(0, 4, 0);
    } else if (type === 'top') {
      tableCamera.position.set(0, 38, 0.1);
      tableControls.target.set(0, 0, 0);
    } else if (type === 'front') {
      tableCamera.position.set(0, 14, 34);
      tableControls.target.set(0, 6, 0);
    }
    tableControls.update();
    playSoundSafe('playBrickClick');
  }

  // --- REALISTIC LEGO MESH GENERATOR (MODULAR 25 PARTS WITH STUDS) ---
  function buildLegoPieceMesh(shape, colorHex, isGhost) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.25,
      metalness: 0.1,
      transparent: isGhost,
      opacity: isGhost ? 0.48 : 1.0
    });

    const studGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    const studMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.25,
      transparent: isGhost,
      opacity: isGhost ? 0.48 : 1.0
    });

    function addStudsOnTop(width, depth, yTop) {
      const step = 2.0;
      for (let x = -width / 2 + 1.0; x <= width / 2 - 1.0; x += step) {
        for (let z = -depth / 2 + 1.0; z <= depth / 2 - 1.0; z += step) {
          const stud = new THREE.Mesh(studGeom, studMat);
          stud.position.set(x, yTop + 0.15, z);
          group.add(stud);
        }
      }
    }

    if (shape === 'base_plate') {
      // 1. Wide Baseplate (16 x 1.0 x 16) with 7x7 Studs (11 Blue / Foundations)
      const baseBox = new THREE.Mesh(new THREE.BoxGeometry(16, 1.0, 16), mat);
      baseBox.position.y = 0.5;
      baseBox.castShadow = !isGhost;
      baseBox.receiveShadow = true;
      group.add(baseBox);
      addStudsOnTop(16, 16, 1.0);
    } 
    else if (shape === 'wall_right') {
      // 2. Right Wall (3.2 x 5.0 x 14) positioned at x = 6.4, y = 3.5
      const wallBox = new THREE.Mesh(new THREE.BoxGeometry(3.2, 5.0, 14), mat);
      wallBox.position.set(6.4, 3.5, 0);
      wallBox.castShadow = !isGhost;
      group.add(wallBox);
      addStudsOnTop(3.2, 14, 6.0);
    }
    else if (shape === 'wall_left') {
      // 3. Left Wall (3.2 x 5.0 x 14) positioned at x = -6.4, y = 3.5
      const wallBox = new THREE.Mesh(new THREE.BoxGeometry(3.2, 5.0, 14), mat);
      wallBox.position.set(-6.4, 3.5, 0);
      wallBox.castShadow = !isGhost;
      group.add(wallBox);
      addStudsOnTop(3.2, 14, 6.0);
    }
    else if (shape === 'door_front') {
      // 4. Front Wall with Open Door (14 x 5.0 x 2.2) at z = 6.0
      const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(4.0, 5.0, 2.2), mat);
      leftPillar.position.set(-4.5, 3.5, 6.0);
      group.add(leftPillar);

      const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(4.0, 5.0, 2.2), mat);
      rightPillar.position.set(4.5, 3.5, 6.0);
      group.add(rightPillar);

      const archTop = new THREE.Mesh(new THREE.BoxGeometry(14, 1.4, 2.2), mat);
      archTop.position.set(0, 5.3, 6.0);
      group.add(archTop);
    }
    else if (shape === 'window_front' || shape === 'wall_back') {
      // 5-6. Back Wall with Window (14 x 5.0 x 2.2) at z = -6.0
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(14, 5.0, 2.2), mat);
      backWall.position.set(0, 3.5, -6.0);
      group.add(backWall);

      const winGlassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65 });
      const winGlass = new THREE.Mesh(new THREE.BoxGeometry(4, 2.8, 2.4), winGlassMat);
      winGlass.position.set(0, 3.5, -6.0);
      group.add(winGlass);
    }
    else if (shape === 'beam_center') {
      // 7. Heavy Oak Timber Beam (14 x 1.2 x 2.4) across y = 6.4
      const beamBox = new THREE.Mesh(new THREE.BoxGeometry(14, 1.2, 2.4), mat);
      beamBox.position.set(0, 6.4, 0);
      group.add(beamBox);
    }
    else if (shape === 'upper_wall_r' || shape === 'upper_wall_l') {
      // 8-9. Upper Level Walls at y = 8.5
      const isRight = shape === 'upper_wall_r';
      const uWall = new THREE.Mesh(new THREE.BoxGeometry(3.0, 4.0, 14), mat);
      uWall.position.set(isRight ? 6.0 : -6.0, 8.2, 0);
      group.add(uWall);
    }
    else if (shape === 'gable_front' || shape === 'gable_back') {
      // 10-11. Triangular Gables at z = 6.0 and z = -6.0
      const isFront = shape === 'gable_front';
      const gableGeom = new THREE.ConeGeometry(8.5, 4.5, 4);
      const gableMesh = new THREE.Mesh(gableGeom, mat);
      gableMesh.rotation.y = Math.PI / 4;
      gableMesh.position.set(0, 10.5, isFront ? 5.5 : -5.5);
      group.add(gableMesh);
    }
    else if (shape === 'roof_slope_r' || shape === 'roof_slope_l') {
      // 12-13. Sloped Roof Tile Wedges
      const isRight = shape === 'roof_slope_r';
      const slopeBox = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.8, 15), mat);
      slopeBox.position.set(isRight ? 4.2 : -4.2, 11.2, 0);
      slopeBox.rotation.z = isRight ? -0.55 : 0.55;
      group.add(slopeBox);
    }
    else if (shape === 'roof_ridge') {
      // 14. Golden Roof Ridge Capping Apex
      const ridgeMesh = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.8, 15.5), mat);
      ridgeMesh.position.set(0, 13.5, 0);
      group.add(ridgeMesh);
    }
    else if (shape === 'weather_vane') {
      // 15. Weather Vane
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.0), mat);
      pole.position.set(0, 15.2, 0);
      group.add(pole);
      const rooster = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.0, 0.4), mat);
      rooster.position.set(0, 16.5, 0);
      group.add(rooster);
    }
    else {
      // Default Modular Lego Block with Studs
      const box = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 8), mat);
      box.position.y = 1.5;
      group.add(box);
      addStudsOnTop(8, 8, 3.0);
    }

    return group;
  }

  // --- STEP RENDERING & GHOST PIECE ---
  function renderCurrentStep() {
    isStepSolved = false;
    const building = BUILDINGS_DATABASE[activeBuildingId] || BUILDINGS_DATABASE.barn;
    const curPart = building.steps[currentStepIndex] || building.steps[0];

    // Update Top Math Card
    const valA = $('valA');
    const valB = $('valB');
    const answerDisplay = $('answerDisplay');
    if (valA && valB && answerDisplay) {
      valA.textContent = curPart.eq.a;
      valB.textContent = curPart.eq.b;
      answerDisplay.textContent = '?';
    }

    // Update Floating Quest Bubble on Table
    const curPartIcon = $('curPartIcon');
    const curPartName = $('curPartName');
    const snapCountVal = $('snapCountVal');
    if (curPartIcon) curPartIcon.textContent = curPart.icon + ' חלק ' + (currentStepIndex + 1) + ' מתוך ' + building.steps.length;
    if (curPartName) curPartName.textContent = curPart.name;
    if (snapCountVal) snapCountVal.textContent = 'שלב ' + (currentStepIndex + 1) + ' / ' + building.steps.length;

    // Speak Math Problem
    speakHebrew('כמה זה ' + curPart.eq.a + ' ועוד ' + curPart.eq.b + '?');

    // Reset ONLY the Floating Ghost Piece (Keep all accumulated solid pieces intact!)
    if (floatingGhostGroup) {
      while (floatingGhostGroup.children.length > 0) {
        floatingGhostGroup.remove(floatingGhostGroup.children[0]);
      }
      const ghostMesh = buildLegoPieceMesh(curPart.shape, curPart.color, true);
      floatingGhostGroup.add(ghostMesh);
      floatingGhostGroup.position.set(0, 7.0, 0);
    }

    populateBottomDockForPart(curPart);
  }

  function populateBottomDockForPart(curPart) {
    const dock = $('dockBricksRow');
    if (!dock) return;
    dock.innerHTML = '';

    const correctAns = curPart.eq.ans;
    const options = [correctAns, correctAns - 2, correctAns + 3, correctAns + 1]
      .filter((v, i, a) => v > 0 && a.indexOf(v) === i)
      .slice(0, 4)
      .sort(() => Math.random() - 0.5);

    options.forEach(ans => {
      const btn = document.createElement('button');
      btn.className = 'dock-brick-btn';
      btn.style.background = ans === correctAns ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'linear-gradient(135deg, #475569, #334155)';
      btn.style.color = '#ffffff';
      btn.style.border = '2.5px solid #38bdf8';
      btn.style.borderRadius = '14px';
      btn.style.padding = '8px 18px';
      btn.style.fontSize = '1.35rem';
      btn.style.fontWeight = '900';
      btn.style.cursor = 'pointer';
      btn.style.margin = '0 4px';
      btn.innerHTML = '<span style="font-size: 1.4rem;">🧱</span> ' + ans;

      btn.onclick = () => {
        if (ans === correctAns) {
          handleCorrectAnswer(ans, curPart);
        } else {
          handleWrongAnswer(btn);
        }
      };
      dock.appendChild(btn);
    });
  }

  function handleCorrectAnswer(ans, curPart) {
    if (isStepSolved) return;
    isStepSolved = true;

    playSoundSafe('playSnapClick', 1.2);
    playSoundSafe('playCelebrationJingle');
    
    const answerDisplay = $('answerDisplay');
    if (answerDisplay) answerDisplay.textContent = ans;

    const mathCard = $('mathCard');
    if (mathCard) {
      mathCard.classList.add('solved-pulse');
      setTimeout(() => mathCard.classList.remove('solved-pulse'), 800);
    }

    // Remove Floating Ghost Piece
    if (floatingGhostGroup) {
      while (floatingGhostGroup.children.length > 0) {
        floatingGhostGroup.remove(floatingGhostGroup.children[0]);
      }
    }

    // Build the SOLID, PERMANENT LEGO PIECE and SNAP it onto the Table
    const solidPieceGroup = buildLegoPieceMesh(curPart.shape, curPart.color, false);
    
    // Animate Drop from top (y = 10 -> 0)
    solidPieceGroup.position.set(0, 10.0, 0);
    activeBuildingGroup.add(solidPieceGroup);

    let startY = 10.0;
    let targetY = 0.0;
    let startTime = performance.now();
    let duration = 350;

    function snapDropAnim(now) {
      let progress = Math.min((now - startTime) / duration, 1.0);
      let ease = 1 - Math.pow(1 - progress, 3);
      solidPieceGroup.position.y = startY + (targetY - startY) * ease;

      if (progress < 1.0) {
        requestAnimationFrame(snapDropAnim);
      } else {
        solidPieceGroup.position.y = targetY;
        playSoundSafe('playSnapClick', 1.4);
      }
    }
    requestAnimationFrame(snapDropAnim);

    // Rewards & Score
    coinsStock += 50;
    streak++;
    totalSolved++;
    updateWarehouseUI();

    spawnFloatingResourceText('🎉 כל הכבוד! קיבלת את החלק (' + curPart.eq.a + ' + ' + curPart.eq.b + ' = ' + ans + ') +50 🪙', window.innerWidth / 2, window.innerHeight / 2);

    const building = BUILDINGS_DATABASE[activeBuildingId] || BUILDINGS_DATABASE.barn;
    if (currentStepIndex + 1 < building.steps.length) {
      setTimeout(() => {
        currentStepIndex++;
        renderCurrentStep();
      }, 1300);
    } else {
      setTimeout(handleBuildingCompleted, 1100);
    }
  }

  function handleWrongAnswer(btn) {
    playSoundSafe('playErrorSound');
    btn.style.background = '#ef4444';
    btn.style.transform = 'translateX(6px)';
    setTimeout(() => btn.style.transform = 'translateX(-6px)', 100);
    setTimeout(() => btn.style.transform = 'none', 200);
    spawnFloatingResourceText('נסה שוב! 🤔', window.innerWidth / 2, window.innerHeight * 0.4);
  }

  function handleBuildingCompleted() {
    playSoundSafe('playVictoryFanfare');
    const modal = $('buildingCompleteModal');
    if (modal) modal.style.display = 'flex';
  }

  // --- FLOATING TEXT ANIMATION ---
  function spawnFloatingResourceText(text, clientX, clientY) {
    const el = document.createElement('div');
    el.className = 'floating-resource-popup';
    el.textContent = text;
    el.style.left = (clientX || window.innerWidth / 2) + 'px';
    el.style.top = (clientY || window.innerHeight / 2) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }

  // --- WAREHOUSE UI & INVENTORY ---
  function updateWarehouseUI() {
    $('coinsCountVal') && ($('coinsCountVal').textContent = coinsStock.toLocaleString());
    $('gemsCountVal') && ($('gemsCountVal').textContent = gemsStock.toLocaleString());
    $('playerLevelVal') && ($('playerLevelVal').textContent = playerLevel);

    $('whStockWheat') && ($('whStockWheat').textContent = inventory.wheat);
    $('whStockCarrots') && ($('whStockCarrots').textContent = inventory.carrots);
    $('whStockApples') && ($('whStockApples').textContent = inventory.apples);
    $('whStockWood') && ($('whStockWood').textContent = inventory.wood);
    $('whStockBricks') && ($('whStockBricks').textContent = inventory.bricks);
    $('whStockMilk') && ($('whStockMilk').textContent = inventory.milk);
  }

  // Global sell & store functions for inline onclick in warehouse
  window.sellResource = function(resName, price) {
    let key = 'wheat';
    if (resName.includes('גזר')) key = 'carrots';
    else if (resName.includes('תפוח')) key = 'apples';
    else if (resName.includes('עץ')) key = 'wood';
    else if (resName.includes('לבנ')) key = 'bricks';
    else if (resName.includes('חלב')) key = 'milk';

    if ((inventory[key] || 0) >= 10) {
      inventory[key] -= 10;
      coinsStock += price;
      updateWarehouseUI();
      playSoundSafe('playVictoryFanfare');
      spawnFloatingResourceText('💰 נמכרו 10 ' + resName + ' תמורת +' + price + ' 🪙!', window.innerWidth / 2, window.innerHeight / 2);
    } else {
      spawnFloatingResourceText('⚠️ אין מספיק ' + resName + ' במחסן!', window.innerWidth / 2, window.innerHeight / 2);
      playSoundSafe('playErrorSound');
    }
  };

  window.storeResource = function(resName, amount) {
    let key = 'wheat';
    if (resName.includes('גזר')) key = 'carrots';
    else if (resName.includes('תפוח')) key = 'apples';
    else if (resName.includes('עץ')) key = 'wood';
    else if (resName.includes('לבנ')) key = 'bricks';
    else if (resName.includes('חלב')) key = 'milk';

    inventory[key] = (inventory[key] || 0) + amount;
    updateWarehouseUI();
    playSoundSafe('playBrickClick');
    spawnFloatingResourceText('📥 נפרקו +' + amount + ' ' + resName + ' למחסן!', window.innerWidth / 2, window.innerHeight / 2);
  };

  // --- SCREEN SWITCHER (ALL 4 SCREENS SUPPORT) ---
  function switchScreen(screenName) {
    const screenTable = $('screenTable');
    const screenMapSite = $('screenMapSite');
    const catalogModal = $('buildingCatalogModal');
    const warehouseModal = $('warehouseModal');

    const btnViewMap = $('btnViewMapSite');
    const btnViewCat = $('btnViewCatalog');
    const btnViewTab = $('btnViewTable');
    const btnViewWh = $('btnViewWarehouse');
    const mathSection = $('mathCardSection');

    // Reset tab active states
    [btnViewMap, btnViewCat, btnViewTab, btnViewWh].forEach(b => b && b.classList.remove('active-seg'));

    // Hide modals when switching screens
    if (screenName !== 'catalog' && catalogModal) catalogModal.style.display = 'none';
    if (screenName !== 'warehouse' && warehouseModal) warehouseModal.style.display = 'none';

    if (screenName === 'table') {
      screenTable && screenTable.classList.add('active-screen');
      screenMapSite && screenMapSite.classList.remove('active-screen');
      btnViewTab && btnViewTab.classList.add('active-seg');
      mathSection && (mathSection.style.display = 'flex');
      onTableResize();
    } else if (screenName === 'map') {
      screenTable && screenTable.classList.remove('active-screen');
      screenMapSite && screenMapSite.classList.add('active-screen');
      btnViewMap && btnViewMap.classList.add('active-seg');
      mathSection && (mathSection.style.display = 'none');
    } else if (screenName === 'catalog') {
      btnViewCat && btnViewCat.classList.add('active-seg');
      if (catalogModal) catalogModal.style.display = 'flex';
    } else if (screenName === 'warehouse') {
      btnViewWh && btnViewWh.classList.add('active-seg');
      if (warehouseModal) warehouseModal.style.display = 'flex';
    }

    playSoundSafe('playBrickClick');
  }

  // --- MODAL CONTROLS ---
  function openModal(id) {
    const m = $(id);
    if (m) m.style.display = 'flex';
    playSoundSafe('playBrickClick');
  }

  function closeModal(id) {
    const m = $(id);
    if (m) m.style.display = 'none';
    playSoundSafe('playBrickClick');
  }

  function selectBuildingAndStart(bId) {
    activeBuildingId = bId;
    currentStepIndex = 0;
    isStepSolved = false;
    
    // Clear previous building from 3D table to start fresh
    if (activeBuildingGroup) {
      while (activeBuildingGroup.children.length > 0) {
        activeBuildingGroup.remove(activeBuildingGroup.children[0]);
      }
    }

    closeModal('buildingCatalogModal');
    closeModal('buildingCompleteModal');
    switchScreen('table');
    renderCurrentStep();
    playSoundSafe('playSnapClick', 1.2);
  }

  // --- DIORAMA CHECKPOINTS & HOTSPOTS ---
  function initDioramaHotspots() {
    function openCheckpointModal(title, icon, desc, buildingId, resourceName, resourceAmount, resourceIcon) {
      const modal = $('checkpointActionModal');
      if (!modal) return;
      $('cpModalTitle') && ($('cpModalTitle').textContent = title);
      $('cpModalIcon') && ($('cpModalIcon').textContent = icon);
      $('cpModalDesc') && ($('cpModalDesc').textContent = desc);
      
      const btnBuild = $('btnCpStartBuild');
      if (btnBuild) {
        btnBuild.textContent = '🔨 בנה את ' + title + ' (25 חלקים ב-3D)';
        btnBuild.onclick = () => {
          modal.style.display = 'none';
          selectBuildingAndStart(buildingId);
        };
      }

      const btnCollect = $('btnCpCollectResource');
      if (btnCollect) {
        btnCollect.textContent = resourceIcon + ' אסוף ' + resourceAmount + ' ' + resourceName;
        btnCollect.onclick = () => {
          modal.style.display = 'none';
          if (resourceName.includes('עץ') || resourceName.includes('קרש')) inventory.wood = (inventory.wood || 0) + resourceAmount;
          else if (resourceName.includes('קמח') || resourceName.includes('חיטה')) inventory.wheat = (inventory.wheat || 0) + resourceAmount;
          else inventory.bricks = (inventory.bricks || 0) + resourceAmount;
          
          spawnFloatingResourceText('+' + resourceAmount + ' ' + resourceIcon + ' ' + resourceName + ' נאסף!', window.innerWidth / 2, window.innerHeight / 2);
          playSoundSafe('playVictoryFanfare');
          updateWarehouseUI();
        };
      }

      const btnClose = $('btnCpClose');
      if (btnClose) btnClose.onclick = () => { modal.style.display = 'none'; };

      modal.style.display = 'flex';
      playSoundSafe('playBrickClick');
    }

    // 1. 🪚 Carpenter Workshop & Farmhouse
    const carpHotspot = $('hotspotCarpenter') || $('hotspotBarn');
    if (carpHotspot) {
      carpHotspot.onclick = () => {
        openCheckpointModal(
          'סדנת נגר ובית חווה (BrickMind Farm)',
          '🪚',
          'סדנת הנגרות והמבנה המרכזי בעולם החווה! כאן מנסרים קרשי עץ, מרכיבים קורות אלון ופותרים אתגרי חשבון מהנים.',
          'farmhouse',
          'קרשי עץ מנוסרים',
          25,
          '🪵'
        );
      };
    }

    // 2. 💨 Windmill
    $('hotspotWindmill') && ($('hotspotWindmill').onclick = () => {
      openCheckpointModal(
        'טחנת רוח כפרית',
        '💨',
        'טחנת רוח כפרית מרשימה עם כנפיים מסתובבות לייצור קמח ותבואה טחונה מ-25 חלקי לגו.',
        'windmill',
        'קמח חיטה טחון',
        20,
        '🌾'
      );
    });

    // 3. 🌾 Wheat Fields
    $('hotspotWheat') && ($('hotspotWheat').onclick = (e) => {
      inventory.wheat = (inventory.wheat || 0) + 25;
      spawnFloatingResourceText('+25 🌾 חיטה זהובה נקצרה!', e.clientX || window.innerWidth * 0.75, e.clientY || window.innerHeight * 0.6);
      playSoundSafe('playSnapClick', 1.4);
      updateWarehouseUI();

      const questPill = $('questProgressText');
      if (questPill) questPill.textContent = 'הושלם! 🌾 25/25';
      const questTitle = $('mapQuestTitleText');
      if (questTitle) questTitle.textContent = '🌟 קציר הושלם! בנה בסדנת הנגר';
    });

    // 4. 🚜 Delivery Tractor
    $('hotspotTractor') && ($('hotspotTractor').onclick = (e) => {
      coinsStock += 50;
      spawnFloatingResourceText('+50 🪙 משלוח תוצרת הושלם!', e.clientX || window.innerWidth * 0.54, e.clientY || window.innerHeight * 0.56);
      playSoundSafe('playVictoryFanfare');
      updateWarehouseUI();
    });

    // 5. 🦆 Duck Pond
    $('hotspotPond') && ($('hotspotPond').onclick = (e) => {
      spawnFloatingResourceText('🦆 קוואק! הברווזים נהנים במים (+10 💧)', e.clientX || window.innerWidth * 0.2, e.clientY || window.innerHeight * 0.72);
      playSoundSafe('playBrickClick');
    });

    // 6. 🐑 Sheep Pen
    $('hotspotSheep') && ($('hotspotSheep').onclick = (e) => {
      inventory.wool = (inventory.wool || 0) + 5;
      spawnFloatingResourceText('🐑 מההה! +5 צמר איכותי 🧶', e.clientX || window.innerWidth * 0.78, e.clientY || window.innerHeight * 0.84);
      playSoundSafe('playBrickClick');
      updateWarehouseUI();
    });

    // 7. 🍎 Apple Orchard
    $('hotspotApples') && ($('hotspotApples').onclick = (e) => {
      inventory.apples = (inventory.apples || 0) + 15;
      spawnFloatingResourceText('🍎 +15 תפוחים אדומים ומתוקים!', e.clientX || window.innerWidth * 0.6, e.clientY || window.innerHeight * 0.22);
      playSoundSafe('playSnapClick', 1.3);
      updateWarehouseUI();
    });

    // 8. 🥛 Dairy Cow
    $('hotspotCow') && ($('hotspotCow').onclick = (e) => {
      inventory.milk = (inventory.milk || 0) + 10;
      spawnFloatingResourceText('🥛 מווו! +10 כדים חלב טרי!', e.clientX || window.innerWidth * 0.18, e.clientY || window.innerHeight * 0.52);
      playSoundSafe('playBrickClick');
      updateWarehouseUI();
    });

    // 9. 🥕 Carrot Garden
    $('hotspotCarrots') && ($('hotspotCarrots').onclick = (e) => {
      inventory.carrots = (inventory.carrots || 0) + 10;
      spawnFloatingResourceText('🥕 +10 גזרים פריכים!', e.clientX || window.innerWidth * 0.5, e.clientY || window.innerHeight * 0.46);
      playSoundSafe('playBrickClick');
      updateWarehouseUI();
    });

    // 10. 🥚 Coop & Animals
    $('hotspotCoop') && ($('hotspotCoop').onclick = (e) => {
      inventory.eggs = (inventory.eggs || 0) + 5;
      spawnFloatingResourceText('🥚 +5 ביצים טריות מהלול!', e.clientX || window.innerWidth * 0.54, e.clientY || window.innerHeight * 0.92);
      playSoundSafe('playBrickClick');
      updateWarehouseUI();
    });
  }

  // --- INITIALIZE ALL UI EVENT LISTENERS ---
  function initAllUIEventListeners() {
    // 1. Top Bar Navigation & Controls
    $('btnViewMapSite') && ($('btnViewMapSite').onclick = () => switchScreen('map'));
    $('btnViewCatalog') && ($('btnViewCatalog').onclick = () => switchScreen('catalog'));
    $('btnViewTable') && ($('btnViewTable').onclick = () => switchScreen('table'));
    $('btnViewWarehouse') && ($('btnViewWarehouse').onclick = () => switchScreen('warehouse'));

    $('topBarCoins') && ($('topBarCoins').onclick = () => openModal('warehouseModal'));
    
    $('topBarGems') && ($('topBarGems').onclick = () => {
      gemsStock += 10;
      updateWarehouseUI();
      playSoundSafe('playVictoryFanfare');
      spawnFloatingResourceText('💎 קיבלת בונוס +10 יהלומים!', window.innerWidth / 2, window.innerHeight * 0.3);
    });

    $('btnSettings') && ($('btnSettings').onclick = () => openModal('settingsModal'));
    $('btnCloseSettings') && ($('btnCloseSettings').onclick = () => closeModal('settingsModal'));

    $('btnOpenCatalogNav') && ($('btnOpenCatalogNav').onclick = () => openModal('buildingCatalogModal'));
    $('btnOpenWarehouseNav') && ($('btnOpenWarehouseNav').onclick = () => openModal('warehouseModal'));
    $('btnWorldModal') && ($('btnWorldModal').onclick = () => openModal('worldsExplorerModal'));
    
    $('btnOpenRebrickable') && ($('btnOpenRebrickable').onclick = () => {
      window.open('https://rebrickable.com/', '_blank');
    });

    // Sound Toggle
    $('btnSound') && ($('btnSound').onclick = () => {
      isSoundEnabled = !isSoundEnabled;
      $('btnSound').textContent = isSoundEnabled ? '🔊' : '🔇';
      spawnFloatingResourceText(isSoundEnabled ? '🔊 צלילים הופעלו' : '🔇 צלילים הושתקו', window.innerWidth / 2, window.innerHeight * 0.2);
    });

    // Voice Narration
    $('btnVoice') && ($('btnVoice').onclick = () => {
      isVoiceEnabled = !isVoiceEnabled;
      $('btnVoice').textContent = isVoiceEnabled ? '🗣️' : '🤐';
      const building = BUILDINGS_DATABASE[activeBuildingId] || BUILDINGS_DATABASE.barn;
      const curPart = building.steps[currentStepIndex] || building.steps[0];
      speakHebrew('שאלה: כמה זה ' + curPart.eq.a + ' ועוד ' + curPart.eq.b + '?');
      spawnFloatingResourceText(isVoiceEnabled ? '🗣️ דיבוב עברי פעיל' : '🤐 דיבוב הושתק', window.innerWidth / 2, window.innerHeight * 0.2);
    });

    // 2. Camera Controls on 3D Table
    $('btnCamIso') && ($('btnCamIso').onclick = () => setCameraAngle('iso'));
    $('btnCamTop') && ($('btnCamTop').onclick = () => setCameraAngle('top'));
    $('btnCamFront') && ($('btnCamFront').onclick = () => setCameraAngle('front'));

    // 3. 5 Chunky Master Dock Buttons (Table Dock)
    $('btnDockLevels') && ($('btnDockLevels').onclick = () => openModal('worldsExplorerModal'));
    $('btnDockBuildChunky') && ($('btnDockBuildChunky').onclick = () => openModal('buildingCatalogModal'));
    $('btnDockHome') && ($('btnDockHome').onclick = () => switchScreen('map'));
    $('btnDockScores') && ($('btnDockScores').onclick = () => openModal('warehouseModal'));
    $('btnDockReplay') && ($('btnDockReplay').onclick = () => {
      currentStepIndex = 0;
      isStepSolved = false;
      if (activeBuildingGroup) {
        while (activeBuildingGroup.children.length > 0) {
          activeBuildingGroup.remove(activeBuildingGroup.children[0]);
        }
      }
      renderCurrentStep();
      playSoundSafe('playBrickClick');
    });

    // 4. Right Action Dock on Screen 1 (Farm Map)
    $('btnDockTools') && ($('btnDockTools').onclick = () => openModal('farmToolsModal'));
    $('btnDockBuild') && ($('btnDockBuild').onclick = () => openModal('buildingCatalogModal'));
    $('btnDockWarehouse') && ($('btnDockWarehouse').onclick = () => openModal('warehouseModal'));
    
    $('btnDockQuests') && ($('btnDockQuests').onclick = () => {
      const bubble = $('mapQuestBubble');
      if (bubble) {
        bubble.style.transform = 'scale(1.18)';
        setTimeout(() => bubble.style.transform = 'scale(1)', 400);
      }
      speakHebrew('משימת החווה הפעילה: קצור חיטה ובנה בסדנת הנגר!');
      spawnFloatingResourceText('📋 משימה פעילה: קצור חיטה ובנה בסדנת הנגר!', window.innerWidth / 2, window.innerHeight * 0.2);
      playSoundSafe('playBrickClick');
    });

    // 5. Building Blueprints Selection (Catalog Modal)
    $('btnCloseCatalog') && ($('btnCloseCatalog').onclick = () => closeModal('buildingCatalogModal'));
    $('btnChooseBarn') && ($('btnChooseBarn').onclick = () => selectBuildingAndStart('barn'));
    $('btnChooseWindmill') && ($('btnChooseWindmill').onclick = () => selectBuildingAndStart('windmill'));
    $('btnChooseFarmhouse') && ($('btnChooseFarmhouse').onclick = () => selectBuildingAndStart('farmhouse'));
    $('btnChooseCoop') && ($('btnChooseCoop').onclick = () => selectBuildingAndStart('coop'));
    $('btnChooseChickenCoop') && ($('btnChooseChickenCoop').onclick = () => selectBuildingAndStart('coop'));
    $('btnChooseGreenhouse') && ($('btnChooseGreenhouse').onclick = () => selectBuildingAndStart('greenhouse'));
    $('btnChooseSilo') && ($('btnChooseSilo').onclick = () => selectBuildingAndStart('silo'));

    // 6. Warehouse Modal Actions
    $('btnCloseWarehouse') && ($('btnCloseWarehouse').onclick = () => closeModal('warehouseModal'));
    
    $('btnCollectAllToWarehouse') && ($('btnCollectAllToWarehouse').onclick = () => {
      inventory.wheat += 30;
      inventory.carrots += 20;
      inventory.apples += 15;
      inventory.milk += 10;
      inventory.wood += 20;
      updateWarehouseUI();
      playSoundSafe('playVictoryFanfare');
      spawnFloatingResourceText('📥 כל תוצרת החווה נפרקה למחסן בהצלחה!', window.innerWidth / 2, window.innerHeight / 2);
    });

    $('btnUpgradeWarehouse') && ($('btnUpgradeWarehouse').onclick = () => {
      if (coinsStock >= 150) {
        coinsStock -= 150;
        MAX_WAREHOUSE_CAPACITY += 500;
        updateWarehouseUI();
        playSoundSafe('playVictoryFanfare');
        spawnFloatingResourceText('🏰 המחסן שודרג לקיבולת ' + MAX_WAREHOUSE_CAPACITY + '!', window.innerWidth / 2, window.innerHeight / 2);
      } else {
        spawnFloatingResourceText('⚠️ חסרים מטבעות זהב לשדרוג (150 🪙)!', window.innerWidth / 2, window.innerHeight / 2);
        playSoundSafe('playErrorSound');
      }
    });

    // 7. Celebration & Reward Modals
    $('btnGoToMap') && ($('btnGoToMap').onclick = () => {
      closeModal('buildingCompleteModal');
      switchScreen('map');
    });

    $('btnNextBuilding') && ($('btnNextBuilding').onclick = () => {
      closeModal('buildingCompleteModal');
      const buildingKeys = Object.keys(BUILDINGS_DATABASE);
      const nextIdx = (buildingKeys.indexOf(activeBuildingId) + 1) % buildingKeys.length;
      selectBuildingAndStart(buildingKeys[nextIdx]);
    });

    $('btnContinueToMap') && ($('btnContinueToMap').onclick = () => {
      closeModal('rewardModal');
      switchScreen('map');
    });

    $('btnNextPartDirect') && ($('btnNextPartDirect').onclick = () => {
      closeModal('rewardModal');
      currentStepIndex++;
      renderCurrentStep();
    });

    // 8. Worlds Explorer Modal
    $('btnCloseWorldExplorer') && ($('btnCloseWorldExplorer').onclick = () => closeModal('worldsExplorerModal'));

    // 9. Farm Tools Upgrades Modal
    $('btnCloseToolsModal') && ($('btnCloseToolsModal').onclick = () => closeModal('farmToolsModal'));
    
    $('btnUpgradeTractor') && ($('btnUpgradeTractor').onclick = () => {
      if (coinsStock >= 100) {
        coinsStock -= 100;
        updateWarehouseUI();
        playSoundSafe('playVictoryFanfare');
        spawnFloatingResourceText('🚜 טרקטור שודרג למהירות טורבו (+50% תפוקה)!', window.innerWidth / 2, window.innerHeight / 2);
      } else {
        spawnFloatingResourceText('⚠️ חסרים מטבעות זהב (100 🪙)!', window.innerWidth / 2, window.innerHeight / 2);
        playSoundSafe('playErrorSound');
      }
    });

    $('btnUpgradeSaw') && ($('btnUpgradeSaw').onclick = () => {
      if (coinsStock >= 80) {
        coinsStock -= 80;
        updateWarehouseUI();
        playSoundSafe('playVictoryFanfare');
        spawnFloatingResourceText('🪚 מסור נגרים שודרג לייצור כפול של קרשים!', window.innerWidth / 2, window.innerHeight / 2);
      } else {
        spawnFloatingResourceText('⚠️ חסרים מטבעות זהב (80 🪙)!', window.innerWidth / 2, window.innerHeight / 2);
        playSoundSafe('playErrorSound');
      }
    });

    $('btnUpgradeSickle') && ($('btnUpgradeSickle').onclick = () => {
      if (coinsStock >= 120) {
        coinsStock -= 120;
        updateWarehouseUI();
        playSoundSafe('playVictoryFanfare');
        spawnFloatingResourceText('🌾 מגל זהב הופעל לקציר חיטה מוגבר!', window.innerWidth / 2, window.innerHeight / 2);
      } else {
        spawnFloatingResourceText('⚠️ חסרים מטבעות זהב (120 🪙)!', window.innerWidth / 2, window.innerHeight / 2);
        playSoundSafe('playErrorSound');
      }
    });
  }

  // --- BOOTSTRAP INITIALIZATION ---
  window.addEventListener('DOMContentLoaded', () => {
    init3DTable();
    initDioramaHotspots();
    initAllUIEventListeners();
    updateWarehouseUI();
    renderCurrentStep();
    console.log('✅ BrickMind (LEGO-MATICA) Cumulative 3D Lego Engine initialized!');
  });

})();
