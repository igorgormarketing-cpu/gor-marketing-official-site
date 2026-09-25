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

  // --- MASTER 3D PHOTOREALISTIC WORKBENCH ENGINE (MATCHING SCREEN_3_WORKTABLE.JPG 1:1) ---
  let tableScene, tableCamera, tableRenderer, tableControls;
  let activeBuildingGroup, floatingGhostGroup, dustParticlesGroup, snapFXGroup, minifigGroup;

  function createWoodTableTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Warm radial honey oak grain
    const grad = ctx.createRadialGradient(512, 512, 80, 512, 512, 512);
    grad.addColorStop(0, '#d97706');
    grad.addColorStop(0.5, '#b45309');
    grad.addColorStop(0.85, '#92400e');
    grad.addColorStop(1, '#78350f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Concentric growth rings
    for (let r = 50; r < 600; r += 12) {
      ctx.strokeStyle = 'rgba(69, 26, 3, 0.12)';
      ctx.lineWidth = 3 + Math.random() * 2;
      ctx.beginPath();
      ctx.arc(512, 512, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Wood fiber rays
    for (let a = 0; a < Math.PI * 2; a += 0.04) {
      ctx.strokeStyle = Math.random() > 0.5 ? 'rgba(254, 243, 199, 0.05)' : 'rgba(69, 26, 3, 0.06)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(512 + Math.cos(a) * 60, 512 + Math.sin(a) * 60);
      ctx.lineTo(512 + Math.cos(a) * 510, 512 + Math.sin(a) * 510);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  function createSoftShadowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 124);
    grad.addColorStop(0, 'rgba(30, 41, 59, 0.7)');
    grad.addColorStop(0.4, 'rgba(30, 41, 59, 0.4)');
    grad.addColorStop(0.8, 'rgba(30, 41, 59, 0.1)');
    grad.addColorStop(1, 'rgba(30, 41, 59, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  function buildLegoMinifigure() {
    const fig = new THREE.Group();

    // Materials
    const yellowSkinMat = new THREE.MeshPhysicalMaterial({
      color: 0xfacc15,
      roughness: 0.18,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1
    });
    const redShirtMat = new THREE.MeshPhysicalMaterial({
      color: 0xdc2626,
      roughness: 0.22,
      clearcoat: 0.85
    });
    const bluePantsMat = new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8,
      roughness: 0.22,
      clearcoat: 0.85
    });
    const blondeHairMat = new THREE.MeshPhysicalMaterial({
      color: 0xfde047,
      roughness: 0.35,
      clearcoat: 0.7
    });

    // Legs
    const lLegGeom = new THREE.BoxGeometry(0.7, 1.4, 0.75);
    const leftLeg = new THREE.Mesh(lLegGeom, bluePantsMat);
    leftLeg.position.set(-0.42, 0.7, 0);
    leftLeg.castShadow = true;
    fig.add(leftLeg);

    const rightLeg = new THREE.Mesh(lLegGeom, bluePantsMat);
    rightLeg.position.set(0.42, 0.7, 0);
    rightLeg.castShadow = true;
    fig.add(rightLeg);

    // Hips
    const hipsGeom = new THREE.BoxGeometry(1.6, 0.4, 0.76);
    const hips = new THREE.Mesh(hipsGeom, bluePantsMat);
    hips.position.set(0, 1.5, 0);
    fig.add(hips);

    // Torso
    const torsoGeom = new THREE.BoxGeometry(1.65, 1.5, 0.85);
    const torso = new THREE.Mesh(torsoGeom, redShirtMat);
    torso.position.set(0, 2.45, 0);
    torso.castShadow = true;
    fig.add(torso);

    // Arms
    const armGeom = new THREE.CylinderGeometry(0.24, 0.22, 1.2, 12);
    const leftArm = new THREE.Mesh(armGeom, redShirtMat);
    leftArm.position.set(-1.05, 2.3, 0.2);
    leftArm.rotation.x = -Math.PI / 4;
    leftArm.rotation.z = Math.PI / 10;
    fig.add(leftArm);

    const rightArm = new THREE.Mesh(armGeom, redShirtMat);
    rightArm.position.set(1.05, 2.5, 0.5);
    rightArm.rotation.x = -Math.PI / 2.5; // Reaching up holding brick!
    rightArm.rotation.z = -Math.PI / 8;
    fig.add(rightArm);

    // Yellow Hands
    const handGeom = new THREE.TorusGeometry(0.18, 0.08, 8, 12, Math.PI * 1.5);
    const rightHand = new THREE.Mesh(handGeom, yellowSkinMat);
    rightHand.position.set(1.15, 2.65, 1.2);
    rightHand.rotation.y = Math.PI / 2;
    fig.add(rightHand);

    const leftHand = new THREE.Mesh(handGeom, yellowSkinMat);
    leftHand.position.set(-1.15, 1.7, 0.6);
    leftHand.rotation.y = -Math.PI / 2;
    fig.add(leftHand);

    // Head
    const headGeom = new THREE.CylinderGeometry(0.48, 0.48, 0.75, 18);
    const head = new THREE.Mesh(headGeom, yellowSkinMat);
    head.position.set(0, 3.5, 0);
    head.castShadow = true;
    fig.add(head);

    // Head Stud on top
    const hStudGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.2, 12);
    const hStud = new THREE.Mesh(hStudGeom, yellowSkinMat);
    hStud.position.set(0, 3.95, 0);
    fig.add(hStud);

    // Blonde Hair
    const hairGeom = new THREE.SphereGeometry(0.55, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.7);
    const hair = new THREE.Mesh(hairGeom, blondeHairMat);
    hair.position.set(0, 3.7, 0);
    hair.scale.set(1.05, 0.8, 1.1);
    fig.add(hair);

    // Yellow Mini Brick held in hand
    const miniBrickGeom = new THREE.BoxGeometry(0.9, 0.6, 0.9);
    const miniBrickMat = new THREE.MeshPhysicalMaterial({ color: 0xfacc15, roughness: 0.15, clearcoat: 1.0 });
    const miniBrick = new THREE.Mesh(miniBrickGeom, miniBrickMat);
    miniBrick.position.set(1.15, 2.9, 1.4);
    fig.add(miniBrick);

    fig.scale.set(1.4, 1.4, 1.4);
    return fig;
  }

  function addDecorativeLooseBricks(scene) {
    const looseGroup = new THREE.Group();

    const redMat = new THREE.MeshPhysicalMaterial({ color: 0xef4444, roughness: 0.15, clearcoat: 1.0 });
    const yellowMat = new THREE.MeshPhysicalMaterial({ color: 0xfacc15, roughness: 0.15, clearcoat: 1.0 });
    const blueMat = new THREE.MeshPhysicalMaterial({ color: 0x2563eb, roughness: 0.15, clearcoat: 1.0 });

    const studGeom = new THREE.CylinderGeometry(0.44, 0.44, 0.26, 16);

    // Helper: 2x4 Brick
    function make2x4(mat) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(6.4, 1.8, 3.2), mat);
      body.castShadow = true;
      body.receiveShadow = true;
      g.add(body);
      for (let x = -2.4; x <= 2.4; x += 1.6) {
        for (let z = -0.8; z <= 0.8; z += 1.6) {
          const st = new THREE.Mesh(studGeom, mat);
          st.position.set(x, 1.02, z);
          st.castShadow = true;
          g.add(st);
        }
      }
      return g;
    }

    // Helper: 2x2 Brick
    function make2x2(mat) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.8, 3.2), mat);
      body.castShadow = true;
      body.receiveShadow = true;
      g.add(body);
      for (let x = -0.8; x <= 0.8; x += 1.6) {
        for (let z = -0.8; z <= 0.8; z += 1.6) {
          const st = new THREE.Mesh(studGeom, mat);
          st.position.set(x, 1.02, z);
          st.castShadow = true;
          g.add(st);
        }
      }
      return g;
    }

    // Brick 1: Yellow 2x4 on left
    const b1 = make2x4(yellowMat);
    b1.position.set(-13, 0.9, -3);
    b1.rotation.y = Math.PI / 7;
    looseGroup.add(b1);

    // Brick 2: Red 2x4 in front-left
    const b2 = make2x4(redMat);
    b2.position.set(-10, 0.9, 12);
    b2.rotation.y = -Math.PI / 10;
    looseGroup.add(b2);

    // Brick 3: Red 2x2 on baseplate front
    const b3 = make2x2(redMat);
    b3.position.set(-6, 0.9, 8);
    b3.rotation.y = Math.PI / 5;
    looseGroup.add(b3);

    // Brick 4: Yellow 2x4 on right
    const b4 = make2x4(yellowMat);
    b4.position.set(13.5, 0.9, 4);
    b4.rotation.y = Math.PI / 12;
    looseGroup.add(b4);

    // Brick 5: Red 2x2 on right front
    const b5 = make2x2(redMat);
    b5.position.set(5.5, 0.9, 13);
    b5.rotation.y = -Math.PI / 6;
    looseGroup.add(b5);

    // Brick 6: Yellow 2x2 on baseplate right
    const b6 = make2x2(yellowMat);
    b6.position.set(9.5, 0.9, 7);
    b6.rotation.y = Math.PI / 8;
    looseGroup.add(b6);

    scene.add(looseGroup);
  }

  function init3DTable() {
    const container = $('threeTableContainer');
    if (!container || tableRenderer) return;

    tableScene = new THREE.Scene();

    const aspect = container.clientWidth / container.clientHeight || 1;
    tableCamera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
    tableCamera.position.set(20, 26, 22);

    // Transparent WebGL Renderer so the warm playroom studio backdrop glows through!
    tableRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    tableRenderer.setSize(container.clientWidth, container.clientHeight);
    tableRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    tableRenderer.shadowMap.enabled = true;
    tableRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    tableRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    tableRenderer.toneMappingExposure = 1.12;
    container.appendChild(tableRenderer.domElement);

    if (typeof THREE.OrbitControls !== 'undefined') {
      tableControls = new THREE.OrbitControls(tableCamera, tableRenderer.domElement);
      tableControls.enableDamping = true;
      tableControls.dampingFactor = 0.06;
      tableControls.maxPolarAngle = Math.PI / 2.12;
      tableControls.minDistance = 12;
      tableControls.maxDistance = 60;
      tableControls.target.set(0, 4.0, 0);
    }

    // --- CINEMATIC 3-POINT STUDIO & WARM SUN LIGHTING ---
    const hemiLight = new THREE.HemisphereLight(0xfffaed, 0x64748b, 0.75);
    tableScene.add(hemiLight);

    // Key Sun Light from Window (Top Left)
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.7);
    sunLight.position.set(24, 46, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 100;
    sunLight.shadow.camera.left = -22;
    sunLight.shadow.camera.right = 22;
    sunLight.shadow.camera.top = 22;
    sunLight.shadow.camera.bottom = -22;
    sunLight.shadow.bias = -0.00015;
    sunLight.shadow.radius = 2.5;
    tableScene.add(sunLight);

    // Cool Sky Fill Light
    const skyFill = new THREE.DirectionalLight(0x93c5fd, 0.55);
    skyFill.position.set(-22, 20, -22);
    tableScene.add(skyFill);

    // Warm Rim Backlight (Pixar Glow on Brick Edges)
    const rimLight = new THREE.DirectionalLight(0xfde047, 0.85);
    rimLight.position.set(0, 30, -32);
    tableScene.add(rimLight);

    // --- 1. WARM CIRCULAR OAK WOODEN TABLE ---
    const woodTex = createWoodTableTexture();
    const tableGeom = new THREE.CylinderGeometry(23, 23, 2.0, 48);
    const tableMat = new THREE.MeshPhysicalMaterial({
      map: woodTex,
      roughness: 0.38,
      metalness: 0.05,
      clearcoat: 0.45,
      clearcoatRoughness: 0.2
    });
    const tableMesh = new THREE.Mesh(tableGeom, tableMat);
    tableMesh.position.y = -1.0;
    tableMesh.receiveShadow = true;
    tableScene.add(tableMesh);

    // --- 2. SOFT CONTACT AMBIENT OCCLUSION SHADOW ---
    const shadowTex = createSoftShadowTexture();
    const shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(28, 28),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.65, depthWrite: false })
    );
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.02;
    tableScene.add(shadowMesh);

    // --- 3. BLUE LEGO BASEPLATE WITH ROUNDED EDGES & GLOSSY STUDS ---
    const plateGeom = new THREE.BoxGeometry(20, 0.55, 20);
    const plateMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7, // Vibrant Classic Lego Blue
      roughness: 0.14,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      reflectivity: 0.95
    });
    const plateMesh = new THREE.Mesh(plateGeom, plateMat);
    plateMesh.position.y = 0.28;
    plateMesh.receiveShadow = true;
    plateMesh.castShadow = true;
    tableScene.add(plateMesh);

    // 10x10 Glossy Studs Grid on Baseplate
    const studGeom = new THREE.CylinderGeometry(0.44, 0.44, 0.26, 18);
    const studMat = new THREE.MeshPhysicalMaterial({
      color: 0x0369a1,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06
    });
    for (let x = -8.1; x <= 8.1; x += 1.8) {
      for (let z = -8.1; z <= 8.1; z += 1.8) {
        const stud = new THREE.Mesh(studGeom, studMat);
        stud.position.set(x, 0.68, z);
        stud.receiveShadow = true;
        stud.castShadow = true;
        tableScene.add(stud);
      }
    }

    // --- 4. SCATTERED DECORATIVE LOOSE BRICKS AROUND TABLE ---
    addDecorativeLooseBricks(tableScene);

    // --- 5. 3D LEGO MINIFIGURE BUILDER CHARACTER ---
    minifigGroup = buildLegoMinifigure();
    minifigGroup.position.set(8.2, 0.28, -2.5);
    minifigGroup.rotation.y = -Math.PI / 3;
    tableScene.add(minifigGroup);

    // --- 6. FLOATING GOLDEN SUNLIGHT DUST PARTICLES ---
    dustParticlesGroup = new THREE.Group();
    const dustGeom = new THREE.BufferGeometry();
    const dustCount = 45;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 30;
      dustPos[i + 1] = 2 + Math.random() * 22;
      dustPos[i + 2] = (Math.random() - 0.5) * 30;
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.4,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    dustParticlesGroup.add(new THREE.Points(dustGeom, dustMat));
    tableScene.add(dustParticlesGroup);

    // --- 7. ACTIVE ASSEMBLED LEGO & GHOST GROUPS ---
    activeBuildingGroup = new THREE.Group();
    tableScene.add(activeBuildingGroup);

    floatingGhostGroup = new THREE.Group();
    tableScene.add(floatingGhostGroup);

    snapFXGroup = new THREE.Group();
    tableScene.add(snapFXGroup);

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

    // Floating Ghost Piece Glow & Bob
    if (floatingGhostGroup && !isStepSolved) {
      floatingGhostGroup.rotation.y += 0.01;
      floatingGhostGroup.position.y = 7.0 + Math.sin(Date.now() * 0.0035) * 0.4;
    }

    // Minifigure Breathing Micro-Animation
    if (minifigGroup) {
      minifigGroup.position.y = 0.28 + Math.sin(Date.now() * 0.002) * 0.04;
    }

    // Sunlight Dust Motes Slow Drift
    if (dustParticlesGroup) {
      dustParticlesGroup.rotation.y += 0.0006;
    }

    // Animate Snap Sparkles
    if (snapFXGroup && snapFXGroup.children.length > 0) {
      for (let i = snapFXGroup.children.length - 1; i >= 0; i--) {
        const p = snapFXGroup.children[i];
        p.position.add(p.userData.velocity);
        p.material.opacity -= 0.04;
        p.scale.multiplyScalar(0.94);
        if (p.material.opacity <= 0.05) {
          snapFXGroup.remove(p);
        }
      }
    }

    if (tableRenderer && tableScene && tableCamera) {
      tableRenderer.render(tableScene, tableCamera);
    }
  }

  // Camera Presets
  function setCameraAngle(type) {
    if (!tableCamera || !tableControls) return;
    if (type === 'iso') {
      tableCamera.position.set(20, 26, 22);
      tableControls.target.set(0, 4.0, 0);
    } else if (type === 'top') {
      tableCamera.position.set(0, 38, 0.1);
      tableControls.target.set(0, 0, 0);
    } else if (type === 'front') {
      tableCamera.position.set(0, 15, 34);
      tableControls.target.set(0, 5.5, 0);
    }
    tableControls.update();
    playSoundSafe('playBrickClick');
  }

  // --- REALISTIC LEGO MESH GENERATOR (PHOTOREALISTIC PBR ABS PLASTIC) ---
  function buildLegoPieceMesh(shape, colorHex, isGhost) {
    const group = new THREE.Group();

    const mat = isGhost
      ? new THREE.MeshPhysicalMaterial({
          color: colorHex,
          roughness: 0.08,
          clearcoat: 1.0,
          transparent: true,
          opacity: 0.54,
          transmission: 0.65,
          ior: 1.35
        })
      : new THREE.MeshPhysicalMaterial({
          color: colorHex,
          roughness: 0.12,
          metalness: 0.02,
          clearcoat: 1.0,
          clearcoatRoughness: 0.06,
          reflectivity: 0.95,
          ior: 1.54,
          specularIntensity: 1.0
        });

    const studMat = isGhost
      ? mat
      : new THREE.MeshPhysicalMaterial({
          color: colorHex,
          roughness: 0.12,
          clearcoat: 1.0,
          clearcoatRoughness: 0.06,
          reflectivity: 0.95,
          ior: 1.54
        });

    const studGeom = new THREE.CylinderGeometry(0.44, 0.44, 0.28, 18);

    function addStudsGrid(width, depth, topY) {
      const step = 1.8;
      const startX = -((width - 1) * step) / 2;
      const startZ = -((depth - 1) * step) / 2;

      for (let r = 0; r < depth; r++) {
        for (let c = 0; c < width; c++) {
          const stud = new THREE.Mesh(studGeom, studMat);
          stud.position.set(startX + c * step, topY + 0.14, startZ + r * step);
          stud.castShadow = !isGhost;
          stud.receiveShadow = !isGhost;
          group.add(stud);
        }
      }
    }

    if (shape === 'baseplate_11' || shape === 'baseplate_12' || shape === 'beam_11') {
      const w = 11 * 1.5;
      const d = 3.6;
      const h = 0.9;
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      body.castShadow = !isGhost;
      body.receiveShadow = !isGhost;
      group.add(body);
      addStudsGrid(7, 2, h / 2);
    } else if (shape === 'wall_8' || shape === 'beam_8' || shape === 'wall_9') {
      const w = 8 * 1.5;
      const d = 3.2;
      const h = 1.9;
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      body.castShadow = !isGhost;
      body.receiveShadow = !isGhost;
      group.add(body);
      addStudsGrid(5, 2, h / 2);
    } else if (shape === 'brick_6' || shape === 'beam_6' || shape === 'wall_6') {
      const w = 6 * 1.5;
      const d = 3.0;
      const h = 1.9;
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      body.castShadow = !isGhost;
      body.receiveShadow = !isGhost;
      group.add(body);
      addStudsGrid(4, 2, h / 2);
    } else if (shape === 'brick_4' || shape === 'block_4') {
      const w = 4.2;
      const d = 4.2;
      const h = 1.9;
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      body.castShadow = !isGhost;
      body.receiveShadow = !isGhost;
      group.add(body);
      addStudsGrid(2, 2, h / 2);
    } else if (shape === 'beam_4' || shape === 'column_4') {
      const w = 4 * 1.5;
      const d = 2.4;
      const h = 1.9;
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      body.castShadow = !isGhost;
      body.receiveShadow = !isGhost;
      group.add(body);
      addStudsGrid(3, 1, h / 2);
    } else if (shape === 'brick_2' || shape === 'connector_2') {
      const w = 3.2;
      const d = 2.0;
      const h = 1.9;
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      body.castShadow = !isGhost;
      body.receiveShadow = !isGhost;
      group.add(body);
      addStudsGrid(2, 1, h / 2);
    } else if (shape === 'stud_1' || shape === 'tile_1') {
      const w = 2.0;
      const d = 2.0;
      const h = 1.9;
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      body.castShadow = !isGhost;
      body.receiveShadow = !isGhost;
      group.add(body);
      addStudsGrid(1, 1, h / 2);
    } else if (shape === 'roof_slope_4' || shape === 'roof_slope_6' || shape === 'roof_peak') {
      const w = 7.5;
      const d = 4.5;
      const h = 2.4;
      const prismGeom = new THREE.ConeGeometry(w / 1.7, h, 4);
      prismGeom.rotateY(Math.PI / 4);
      const body = new THREE.Mesh(prismGeom, mat);
      body.castShadow = !isGhost;
      body.receiveShadow = !isGhost;
      group.add(body);
    } else if (shape === 'gear_4' || shape === 'rotor_blade') {
      const body = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.6, 12), mat);
      body.castShadow = !isGhost;
      body.receiveShadow = !isGhost;
      group.add(body);
    } else {
      const body = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.9, 4.0), mat);
      body.castShadow = !isGhost;
      body.receiveShadow = !isGhost;
      group.add(body);
      addStudsGrid(2, 2, 0.95);
    }

    return group;
  }

  // --- SNAP SPARKLE BURST FX ---
  function triggerSnapSparkleFX(pos) {
    if (!snapFXGroup) return;
    const count = 20;
    for (let i = 0; i < count; i++) {
      const pGeom = new THREE.SphereGeometry(0.18, 8, 8);
      const pMat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.4 ? 0xfde047 : 0x38bdf8,
        transparent: true,
        opacity: 1.0
      });
      const pMesh = new THREE.Mesh(pGeom, pMat);
      pMesh.position.copy(pos);
      pMesh.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.45,
          0.15 + Math.random() * 0.4,
          (Math.random() - 0.5) * 0.45
        )
      };
      snapFXGroup.add(pMesh);
    }
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
