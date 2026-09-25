(function() {
  'use strict';
  function $(id) { return document.getElementById(id); }
  const STORAGE_KEY = 'brickmind_multi_building_save_v1';
  
  // Active Building Selection & Progress
  let activeBuildingId = 'barn'; // 'barn', 'windmill', 'farmhouse', 'coop', 'greenhouse', 'silo'
  let currentStepIndex = 0;
  let currentSnapCount = 0;
  let streak = 0, totalSolved = 0;
  let isSolved = false;

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
    milk: 20
  };

  // Building Blueprints Database
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
        { step: 1, name: 'יסודות רצפת עץ', icon: '🪵', shape: 'base_plate', eq: { a: 4, b: 7, ans: 11 }, color: 0x3b82f6, desc: 'בסיס הרצפה הכבד שנושא את כל האסם (4 + 7 = 11)' },
        { step: 2, name: 'קיר תחתון ימני', icon: '🧱', shape: 'wall_right', eq: { a: 3, b: 5, ans: 8 }, color: 0xdc2626, desc: 'קיר לבנים אדומות מחוזק בצד ימין (3 + 5 = 8)' },
        { step: 3, name: 'קיר תחתון שמאלי', icon: '🧱', shape: 'wall_left', eq: { a: 5, b: 3, ans: 8 }, color: 0xdc2626, desc: 'קיר לבנים אדומות בצד שמאל (5 + 3 = 8)' },
        { step: 4, name: 'שער כפול לבן', icon: '🚪', shape: 'door_frame', eq: { a: 3, b: 4, ans: 7 }, color: 0xf8fafc, desc: 'שער אסם רחב עם משקוף (3 + 4 = 7)' },
        { step: 5, name: 'חלון קדמי ימני', icon: '🪟', shape: 'window_right', eq: { a: 2, b: 3, ans: 5 }, color: 0xf8fafc, desc: 'חלון מואר לאור שמש (2 + 3 = 5)' },
        { step: 6, name: 'חלון קדמי שמאלי', icon: '🪟', shape: 'window_left', eq: { a: 3, b: 2, ans: 5 }, color: 0xf8fafc, desc: 'חלון מואר לאוורור (3 + 2 = 5)' },
        { step: 7, name: 'קורת תמיכה מרכזית', icon: '🪵', shape: 'beam', eq: { a: 6, b: 4, ans: 10 }, color: 0xb45309, desc: 'קורת אלון חזקה לקומה השנייה (6 + 4 = 10)' },
        { step: 8, name: 'קיר קומה שנייה ימני', icon: '🧱', shape: 'wall_upper_r', eq: { a: 4, b: 4, ans: 8 }, color: 0xdc2626, desc: 'קיר עליית הגג בצד ימין (4 + 4 = 8)' },
        { step: 9, name: 'קיר קומה שנייה שמאלי', icon: '🧱', shape: 'wall_upper_l', eq: { a: 4, b: 4, ans: 8 }, color: 0xdc2626, desc: 'קיר עליית הגג בצד שמאל (4 + 4 = 8)' },
        { step: 10, name: 'אשנב עליית גג עגול', icon: '🪟', shape: 'attic_window', eq: { a: 2, b: 2, ans: 4 }, color: 0xf8fafc, desc: 'חלון עגול לעליית החציר (2 + 2 = 4)' },
        { step: 11, name: 'גמלון גג קדמי', icon: '📐', shape: 'gable_front', eq: { a: 5, b: 3, ans: 8 }, color: 0xdc2626, desc: 'משולש הגמלון הקדמי (5 + 3 = 8)' },
        { step: 12, name: 'גמלון גג אחורי', icon: '📐', shape: 'gable_back', eq: { a: 3, b: 5, ans: 8 }, color: 0xdc2626, desc: 'משולש הגמלון האחורי (3 + 5 = 8)' },
        { step: 13, name: 'שיפוע רעפים ימני', icon: '🏠', shape: 'roof_slope_r', eq: { a: 6, b: 5, ans: 11 }, color: 0xf8fafc, desc: 'רעפי גג משופעים בצד ימין (6 + 5 = 11)' },
        { step: 14, name: 'שיפוע רעפים שמאלי', icon: '🏠', shape: 'roof_slope_l', eq: { a: 5, b: 6, ans: 11 }, color: 0xf8fafc, desc: 'רעפי גג משופעים בצד שמאל (5 + 6 = 11)' },
        { step: 15, name: 'רכס גג עליון', icon: '🔝', shape: 'roof_ridge', eq: { a: 3, b: 3, ans: 6 }, color: 0xe2e8f0, desc: 'סגירת רכס הגג המוזהב (3 + 3 = 6)' },
        { step: 16, name: 'בסיס סילו תבואה', icon: '🛢️', shape: 'silo_base', eq: { a: 4, b: 4, ans: 8 }, color: 0xb91c1c, desc: 'יסודות עגולים למגדל התבואה (4 + 4 = 8)' },
        { step: 17, name: 'גוף סילו מרכזי', icon: '🛢️', shape: 'silo_mid', eq: { a: 5, b: 5, ans: 10 }, color: 0xb91c1c, desc: 'מגדל האחסון לתבואת החווה (5 + 5 = 10)' },
        { step: 18, name: 'כיפת סילו עליונה', icon: '🌕', shape: 'silo_cap', eq: { a: 3, b: 3, ans: 6 }, color: 0xf8fafc, desc: 'כיפת איטום עליונה (3 + 3 = 6)' },
        { step: 19, name: 'גדר עץ ימנית', icon: '🪵', shape: 'fence_r', eq: { a: 3, b: 2, ans: 5 }, color: 0x92400e, desc: 'גדר עץ לסגירת חצר החיות (3 + 2 = 5)' },
        { step: 20, name: 'גדר עץ שמאלית', icon: '🪵', shape: 'fence_l', eq: { a: 2, b: 3, ans: 5 }, color: 0x92400e, desc: 'גדר עץ לשטח המרעה (2 + 3 = 5)' },
        { step: 21, name: 'תיבת דואר אדומה', icon: '📮', shape: 'mailbox', eq: { a: 1, b: 2, ans: 3 }, color: 0xef4444, desc: 'תיבת דואר כפרית (1 + 2 = 3)' },
        { step: 22, name: 'שביל וערוגת גזרים', icon: '🥕', shape: 'carrots_path', eq: { a: 4, b: 4, ans: 8 }, color: 0xf97316, desc: 'שביל אבנים וערוגת גזרים (4 + 4 = 8)' },
        { step: 23, name: 'עץ תפוחים פורה', icon: '🌳', shape: 'apple_tree', eq: { a: 5, b: 4, ans: 9 }, color: 0x16a34a, desc: 'עץ תפוחים מלא פירות (5 + 4 = 9)' },
        { step: 24, name: 'עששית תאורה', icon: '🏮', shape: 'lantern', eq: { a: 1, b: 2, ans: 3 }, color: 0xfacc15, desc: 'פנס לילה מאיר (1 + 2 = 3)' },
        { step: 25, name: 'שבשבת רוח מוזהבת', icon: '🚩', shape: 'weather_vane', eq: { a: 2, b: 3, ans: 5 }, color: 0xf59e0b, desc: 'שבשבת רוח - האסם מושלם! (2 + 3 = 5)' }
      ]
    },

    windmill: {
      id: 'windmill',
      name: 'טחנת רוח כפרית (Windmill)',
      heName: 'טחנת רוח כפרית',
      icon: '💨',
      totalParts: 20,
      production: '+150 קמח / דקה',
      color: 0x3b82f6,
      steps: [
        { step: 1, name: 'בסיס אבן מתומן', icon: '🧱', shape: 'base_stone', eq: { a: 5, b: 7, ans: 12 }, color: 0x64748b, desc: 'בסיס אבן כבד ליציבות הטחנה (5 + 7 = 12)' },
        { step: 2, name: 'קיר מגדל תחתון', icon: '🧱', shape: 'tower_b', eq: { a: 4, b: 4, ans: 8 }, color: 0xf8fafc, desc: 'קיר לבנים עגול (4 + 4 = 8)' },
        { step: 3, name: 'שער טוחן מקושת', icon: '🚪', shape: 'door_arch', eq: { a: 2, b: 3, ans: 5 }, color: 0xb45309, desc: 'דלת כניסה מעץ (2 + 3 = 5)' },
        { step: 4, name: 'מנוע גלגלי שיניים', icon: '⚙️', shape: 'gears', eq: { a: 6, b: 6, ans: 12 }, color: 0x475569, desc: 'מנגנון טחינת התבואה לקמח (6 + 6 = 12)' },
        { step: 5, name: 'ציר סיבוב ראשי', icon: '🔄', shape: 'axle', eq: { a: 3, b: 3, ans: 6 }, color: 0x94a3b8, desc: 'ציר כנפי הרוח (3 + 3 = 6)' },
        { step: 6, name: 'כנף רוח ראשונה', icon: '💨', shape: 'blade1', eq: { a: 4, b: 5, ans: 9 }, color: 0xf8fafc, desc: 'כנף עץ עם בד לבן (4 + 5 = 9)' },
        { step: 7, name: 'כנף רוח שנייה', icon: '💨', shape: 'blade2', eq: { a: 5, b: 4, ans: 9 }, color: 0xf8fafc, desc: 'כנף עץ שנייה (5 + 4 = 9)' },
        { step: 8, name: 'כנף רוח שלישית', icon: '💨', shape: 'blade3', eq: { a: 4, b: 5, ans: 9 }, color: 0xf8fafc, desc: 'כנף עץ שלישית (4 + 5 = 9)' },
        { step: 9, name: 'כנף רוח רביעית', icon: '💨', shape: 'blade4', eq: { a: 5, b: 4, ans: 9 }, color: 0xf8fafc, desc: 'כנף עץ רביעית (5 + 4 = 9)' },
        { step: 10, name: 'כיפה חרוטית עליונה', icon: '⛺', shape: 'roof_cone', eq: { a: 5, b: 3, ans: 8 }, color: 0x991b1b, desc: 'כיפת הגג של הטחנה (5 + 3 = 8)' }
      ]
    },

    farmhouse: {
      id: 'farmhouse',
      name: 'בית החווה הראשי (Farmhouse)',
      heName: 'בית החווה הראשי',
      icon: '🏡',
      totalParts: 25,
      production: '+20% בונוס ייצור לכל החווה',
      color: 0x16a34a,
      steps: [
        { step: 1, name: 'דק מרפסת עץ', icon: '🪵', shape: 'deck', eq: { a: 6, b: 6, ans: 12 }, color: 0xb45309, desc: 'דק עץ כפרי רחב (6 + 6 = 12)' },
        { step: 2, name: 'דלת כניסה וסלון', icon: '🚪', shape: 'door_living', eq: { a: 4, b: 5, ans: 9 }, color: 0xf8fafc, desc: 'דלת עם חלונות תריסים (4 + 5 = 9)' },
        { step: 3, name: 'אח לבנים מחמם', icon: '🔥', shape: 'fireplace', eq: { a: 3, b: 3, ans: 6 }, color: 0xdc2626, desc: 'אח לחימום הבית (3 + 3 = 6)' },
        { step: 4, name: 'קומה שנייה וחדר שינה', icon: '🛏️', shape: 'upper_floor', eq: { a: 4, b: 4, ans: 8 }, color: 0xf8fafc, desc: 'קירות מגורי החוואי (4 + 4 = 8)' },
        { step: 5, name: 'גג רעפים חום וארובה', icon: '🏠', shape: 'chimney_roof', eq: { a: 5, b: 5, ans: 10 }, color: 0x78350f, desc: 'גג כפרי עם ארובת עשן (5 + 5 = 10)' }
      ]
    },

    coop: {
      id: 'coop',
      name: 'לול תרנגולות (Chicken Coop)',
      heName: 'לול תרנגולות',
      icon: '🐔',
      totalParts: 15,
      production: '+50 ביצים / דקה',
      color: 0xf59e0b,
      steps: [
        { step: 1, name: 'עמודי הגבהה ורמפה', icon: '🪵', shape: 'stilts', eq: { a: 3, b: 4, ans: 7 }, color: 0x92400e, desc: 'עמודי עץ ורמפת עלייה (3 + 4 = 7)' },
        { step: 2, name: 'תאי הטלת ביצים', icon: '🥚', shape: 'nests', eq: { a: 4, b: 4, ans: 8 }, color: 0xfef08a, desc: 'תאים מרופדים בחציר (4 + 4 = 8)' },
        { step: 3, name: 'גג נפתח לאיסוף', icon: '🏠', shape: 'roof_open', eq: { a: 3, b: 3, ans: 6 }, color: 0xdc2626, desc: 'גג צירים נפתח (3 + 3 = 6)' }
      ]
    },

    greenhouse: {
      id: 'greenhouse',
      name: 'חממת ירקות (Greenhouse)',
      heName: 'חממת ירקות',
      icon: '🌿',
      totalParts: 20,
      production: '+80 תותים ועגבניות / דקה',
      color: 0x10b981,
      steps: [
        { step: 1, name: 'שלד אלומיניום ירוק', icon: '🧱', shape: 'frame', eq: { a: 4, b: 6, ans: 10 }, color: 0x15803d, desc: 'שלד חזק לחממה (4 + 6 = 10)' },
        { step: 2, name: 'קירות זכוכית שקופה', icon: '🪟', shape: 'glass_walls', eq: { a: 5, b: 5, ans: 10 }, color: 0xbae6fd, desc: 'קירות פלסטיק שקוף (5 + 5 = 10)' },
        { step: 3, name: 'ערוגות טפטוף ומאוורר', icon: '🍓', shape: 'hydro_beds', eq: { a: 4, b: 4, ans: 8 }, color: 0xef4444, desc: 'מערכת השקיה וגידול (4 + 4 = 8)' }
      ]
    },

    silo: {
      id: 'silo',
      name: 'ממגורת תבואה (Grain Silo)',
      heName: 'ממגורת תבואה',
      icon: '🌾',
      totalParts: 15,
      production: '+500 קיבולת אחסון למחסן',
      color: 0x991b1b,
      steps: [
        { step: 1, name: 'רפסודת בטון כבדה', icon: '🧱', shape: 'silo_base', eq: { a: 4, b: 4, ans: 8 }, color: 0x475569, desc: 'יסודות בטון עגולים (4 + 4 = 8)' },
        { step: 2, name: 'גליל ממגורה ענק', icon: '🛢️', shape: 'silo_cylinder', eq: { a: 6, b: 6, ans: 12 }, color: 0xb91c1c, desc: 'טבעות אחסון תבואה (6 + 6 = 12)' },
        { step: 3, name: 'כיפת מתכת ומסוע פריקה', icon: '🌕', shape: 'silo_dome', eq: { a: 3, b: 4, ans: 7 }, color: 0xf8fafc, desc: 'כיפת איטום וצינור שפיכה (3 + 4 = 7)' }
      ]
    }
  };

  // 3D Engine Variables
  let tableScene, tableCamera, tableRenderer, tableControls;
  let tableMeshGroup, tableSnappedStackGroup;

  function $(id) { return document.getElementById(id); }

  // ========================================================
  // 1. INITIALIZE AAA 3D WORK TABLE
  // ========================================================
  function init3DTable() {
    const container = $('threeTableContainer');
    if (!container) return;

    const w = container.clientWidth || 480;
    const h = container.clientHeight || 420;

    tableScene = new THREE.Scene();
    tableScene.background = new THREE.Color(0xfef3c7);
    tableScene.fog = new THREE.FogExp2(0xfef3c7, 0.015);

    tableCamera = new THREE.PerspectiveCamera(38, w / h, 0.1, 1000);
    tableCamera.position.set(0, 6.4, 8.8);

    tableRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    tableRenderer.setSize(w, h);
    tableRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    tableRenderer.shadowMap.enabled = true;
    tableRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    tableRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    tableRenderer.toneMappingExposure = 1.18;
    container.innerHTML = '';
    container.appendChild(tableRenderer.domElement);

    tableControls = new THREE.OrbitControls(tableCamera, tableRenderer.domElement);
    tableControls.enableDamping = true;
    tableControls.dampingFactor = 0.08;
    tableControls.maxPolarAngle = Math.PI / 2.05;
    tableControls.minDistance = 4.0;
    tableControls.maxDistance = 15.0;
    tableControls.target.set(0, 1.1, 0);

    // Warm Studio Lighting
    const warmAmbient = new THREE.AmbientLight(0xffedd5, 1.4);
    tableScene.add(warmAmbient);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.6);
    keyLight.position.set(6, 15, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0004;
    tableScene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xbae6fd, 1.1);
    fillLight.position.set(-8, 9, -4);
    tableScene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfde047, 1.7);
    rimLight.position.set(0, 10, -9);
    tableScene.add(rimLight);

    tableMeshGroup = new THREE.Group();
    tableSnappedStackGroup = new THREE.Group();
    tableScene.add(tableMeshGroup);
    tableScene.add(tableSnappedStackGroup);

    // Warm Oak Tabletop
    const tableCanvas = document.createElement('canvas');
    tableCanvas.width = 512;
    tableCanvas.height = 512;
    const ctx = tableCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
    grad.addColorStop(0, '#d97706');
    grad.addColorStop(0.5, '#b45309');
    grad.addColorStop(1, '#78350f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 3;
    for (let r = 35; r < 360; r += 28) {
      ctx.beginPath();
      ctx.arc(256 + (r * 0.08), 256, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    const woodTexture = new THREE.CanvasTexture(tableCanvas);

    const tableTopMat = new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.32, metalness: 0.05 });
    const tableTopMesh = new THREE.Mesh(new THREE.CylinderGeometry(9.0, 9.0, 0.7, 48), tableTopMat);
    tableTopMesh.position.y = 0.5;
    tableTopMesh.receiveShadow = true;
    tableMeshGroup.add(tableTopMesh);

    // Blue Studded Baseplate
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.14, metalness: 0.05 });
    const basePlate = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.24, 6.6), baseMat);
    basePlate.position.y = 0.97;
    basePlate.receiveShadow = true;
    basePlate.castShadow = true;
    tableMeshGroup.add(basePlate);

    const studGeom = new THREE.CylinderGeometry(0.16, 0.16, 0.12, 16);
    const studMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.14 });
    for (let x = -2.7; x <= 2.7; x += 0.54) {
      for (let z = -2.7; z <= 2.7; z += 0.54) {
        const stud = new THREE.Mesh(studGeom, studMat);
        stud.position.set(x, 1.13, z);
        stud.receiveShadow = true;
        stud.castShadow = true;
        tableMeshGroup.add(stud);
      }
    }

    // Minifigure Helper
    const minifig = new THREE.Group();
    const legs = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.65, 0.35), new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.2 }));
    legs.position.y = 1.38;
    legs.castShadow = true;
    minifig.add(legs);

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.4), new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.2 }));
    torso.position.y = 2.0;
    torso.castShadow = true;
    minifig.add(torso);

    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.42, 16), new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.15 }));
    head.position.y = 2.52;
    head.castShadow = true;
    minifig.add(head);

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 }));
    hair.position.set(0, 2.72, 0);
    hair.scale.set(1.0, 0.6, 1.0);
    minifig.add(hair);

    minifig.position.set(2.2, 0, -1.2);
    minifig.rotation.y = -Math.PI / 4;
    tableMeshGroup.add(minifig);

    // Sparkles
    const sparkleGroup = new THREE.Group();
    const starGeom = new THREE.SphereGeometry(0.06, 8, 8);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    for (let i = 0; i < 28; i++) {
      const sp = new THREE.Mesh(starGeom, starMat);
      sp.position.set((Math.random() - 0.5) * 6.5, 2.5 + Math.random() * 3.5, (Math.random() - 0.5) * 4.5);
      sp.userData = { speedY: 0.008 + Math.random() * 0.01, initialY: sp.position.y };
      sparkleGroup.add(sp);
    }
    tableMeshGroup.add(sparkleGroup);

    function animateTable(time) {
      requestAnimationFrame(animateTable);
      if (tableControls) tableControls.update();
      sparkleGroup.children.forEach(sp => {
        sp.position.y += Math.sin(time * 0.003 + sp.userData.initialY) * 0.003;
      });
      minifig.position.y = Math.sin(time * 0.004) * 0.02;
      tableRenderer.render(tableScene, tableCamera);
    }
    requestAnimationFrame(animateTable);
  }

  // ========================================================
  // 2. STEP RENDERING & SNAP MECHANICS
  // ========================================================
  function renderCurrentStep() {
    const building = BUILDINGS_DATABASE[activeBuildingId] || BUILDINGS_DATABASE.barn;
    const curPart = building.steps[currentStepIndex % building.steps.length];
    if (!curPart) return;

    currentSnapCount = 0;
    isSolved = false;
    tableSnappedStackGroup.clear();

    // Update Math Card
    if ($('valA')) $('valA').textContent = curPart.eq.a;
    if ($('valB')) $('valB').textContent = curPart.eq.b;
    if ($('answerDisplay')) $('answerDisplay').textContent = curPart.eq.ans;

    // Quest Bubble
    if ($('curPartIcon')) $('curPartIcon').textContent = `${curPart.icon} ${building.heName}`;
    if ($('curPartName')) $('curPartName').textContent = `חלק ${curPart.step} מתוך ${building.totalParts}: ${curPart.name}`;
    if ($('snapCountVal')) $('snapCountVal').textContent = `0 / ${curPart.eq.ans}`;

    populateBottomDockForPart(curPart);
  }

  function populateBottomDockForPart(curPart) {
    const row = $('dockBricksRow');
    if (!row) return;
    row.innerHTML = '';

    // Group A Buttons (Red)
    for (let i = 0; i < curPart.eq.a; i++) {
      const btn = document.createElement('div');
      btn.className = 'dock-brick-btn brick-red';
      btn.innerHTML = `<span class="dock-brick-label">${i + 1} (א')</span>`;
      btn.dataset.used = 'false';
      btn.onclick = () => {
        if (btn.dataset.used === 'true' || isSolved) return;
        btn.dataset.used = 'true';
        btn.classList.add('used');
        snapBrickToTablePart(0xdc2626);
      };
      row.appendChild(btn);
    }

    // Group B Buttons (Gold)
    for (let i = 0; i < curPart.eq.b; i++) {
      const btn = document.createElement('div');
      btn.className = 'dock-brick-btn brick-gold';
      btn.innerHTML = `<span class="dock-brick-label">${i + 1} (ב')</span>`;
      btn.dataset.used = 'false';
      btn.onclick = () => {
        if (btn.dataset.used === 'true' || isSolved) return;
        btn.dataset.used = 'true';
        btn.classList.add('used');
        snapBrickToTablePart(0xf59e0b);
      };
      row.appendChild(btn);
    }
  }

  function snapBrickToTablePart(colorHex) {
    if (isSolved) return;

    const building = BUILDINGS_DATABASE[activeBuildingId] || BUILDINGS_DATABASE.barn;
    const curPart = building.steps[currentStepIndex % building.steps.length];
    const targetSum = curPart.eq.ans;

    const b = createSingle3DBrick(colorHex);

    const cols = 4;
    const row = Math.floor(currentSnapCount / cols);
    const col = currentSnapCount % cols;
    const targetX = -1.6 + (col * 1.1);
    const targetZ = -1.2 + (row * 0.9);
    const targetY = 1.16;

    b.position.set(targetX, targetY + 3.5, targetZ);
    tableSnappedStackGroup.add(b);

    if (window.legoSound && typeof window.legoSound.playSnapClick === 'function') {
      window.legoSound && typeof window.legoSound.playSnapClick === 'function' && (window.legoSound && typeof window.legoSound.playSnapClick === 'function' && window.legoSound.playSnapClick(1.0 + (currentSnapCount * 0.06)));
    }

    let st = performance.now();
    function drop(now) {
      const p = Math.min(1.0, (now - st) / 180);
      const ease = 1 - Math.pow(1 - p, 3);
      b.position.y = (targetY + 3.5) - (3.5 * ease);
      if (p < 1.0) requestAnimationFrame(drop);
      else b.position.y = targetY;
    }
    requestAnimationFrame(drop);

    currentSnapCount++;
    if ($('snapCountVal')) $('snapCountVal').textContent = `${currentSnapCount} / ${targetSum}`;

    if (currentSnapCount >= targetSum) {
      handlePartCompleted();
    }
  }

  function createSingle3DBrick(colorHex) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.16, metalness: 0.05 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.55, 0.85), mat);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const studGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.12, 16);
    [{ x: -0.38, z: -0.2 }, { x: 0.38, z: -0.2 }, { x: -0.38, z: 0.2 }, { x: 0.38, z: 0.2 }].forEach(pos => {
      const s = new THREE.Mesh(studGeo, mat);
      s.position.set(pos.x, 0.33, pos.z);
      s.castShadow = true;
      group.add(s);
    });
    return group;
  }

  function handlePartCompleted() {
    isSolved = true;
    streak++;
    totalSolved++;

    coinsStock += 150;
    gemsStock += 5;
    if ($('coinsCountVal')) $('coinsCountVal').textContent = coinsStock.toLocaleString();
    if ($('gemsCountVal')) $('gemsCountVal').textContent = gemsStock.toLocaleString();

    if (window.legoSound) {
      if (typeof window.legoSound.playRewardCheer === 'function') window.legoSound.playRewardCheer();
      else if (typeof window.legoSound.playCelebrationJingle === 'function') window.legoSound && typeof window.legoSound.playCelebrationJingle === 'function' && (window.legoSound && typeof window.legoSound.playCelebrationJingle === 'function' && window.legoSound.playCelebrationJingle());
    }

    const building = BUILDINGS_DATABASE[activeBuildingId] || BUILDINGS_DATABASE.barn;
    const curPart = building.steps[currentStepIndex % building.steps.length];
    if ($('rewardPartName')) $('rewardPartName').textContent = `${building.heName}: ${curPart.name}`;
    if ($('rewardProgressText')) $('rewardProgressText').textContent = `חלק ${curPart.step} מתוך ${building.totalParts} הושלם בהצלחה!`;

    setTimeout(() => {
      if ($('rewardModal')) $('rewardModal').style.display = 'flex';
    }, 400);
  }

  // ========================================================
  // 3. DIORAMA HOTSPOTS & HARVESTING
  // ========================================================
  function initDioramaHotspots() {
    // Wheat Harvest
    $('hotspotWheat') && ($('hotspotWheat').onclick = (e) => {
      inventory.wheat += 10;
      spawnFloatingResourceText('+10 🌾 חיטה!', e.clientX, e.clientY);
      if (window.legoSound) window.legoSound && typeof window.legoSound.playBrickClick === 'function' && (window.legoSound && typeof window.legoSound.playBrickClick === 'function' && window.legoSound.playBrickClick());
      updateWarehouseUI();
    });

    // Carrots Harvest
    $('hotspotCarrots') && ($('hotspotCarrots').onclick = (e) => {
      inventory.carrots += 5;
      spawnFloatingResourceText('+5 🥕 גזר!', e.clientX, e.clientY);
      if (window.legoSound) window.legoSound && typeof window.legoSound.playBrickClick === 'function' && (window.legoSound && typeof window.legoSound.playBrickClick === 'function' && window.legoSound.playBrickClick());
      updateWarehouseUI();
    });

    // Barn Hotspot -> Work Table
    $('hotspotBarn') && ($('hotspotBarn').onclick = () => {
      activeBuildingId = 'barn';
      switchScreen('table');
      renderCurrentStep();
    });

    // Windmill Hotspot -> Work Table
    $('hotspotWindmill') && ($('hotspotWindmill').onclick = (e) => {
      inventory.wheat += 15;
      spawnFloatingResourceText('+15 🌾 קמח טחון!', e.clientX, e.clientY);
      if (window.legoSound) window.legoSound && typeof window.legoSound.playBrickClick === 'function' && (window.legoSound && typeof window.legoSound.playBrickClick === 'function' && window.legoSound.playBrickClick());
      updateWarehouseUI();
    });

    // Pond Hotspot
    $('hotspotPond') && ($('hotspotPond').onclick = (e) => {
      spawnFloatingResourceText('🦆 קוואק! הברווזים שמחים', e.clientX, e.clientY);
      if (window.legoSound) window.legoSound && typeof window.legoSound.playSnapClick === 'function' && (window.legoSound && typeof window.legoSound.playSnapClick === 'function' && window.legoSound.playSnapClick(1.5));
    });

    // Tractor Hotspot
    $('hotspotTractor') && ($('hotspotTractor').onclick = (e) => {
      spawnFloatingResourceText('🚜 פפפ-פפפ! הטרקטור פעיל', e.clientX, e.clientY);
      if (window.legoSound) window.legoSound && typeof window.legoSound.playSnapClick === 'function' && (window.legoSound && typeof window.legoSound.playSnapClick === 'function' && window.legoSound.playSnapClick(0.8));
    });
  }

  function spawnFloatingResourceText(text, clientX, clientY) {
    const container = $('farmDioramaContainer') || document.body;
    const pop = document.createElement('div');
    pop.className = 'floating-resource-popup';
    pop.textContent = text;
    const rect = container.getBoundingClientRect();
    pop.style.left = (clientX - rect.left) + 'px';
    pop.style.top = (clientY - rect.top) + 'px';
    container.appendChild(pop);
    setTimeout(() => { pop.remove(); }, 1200);
  }

  function updateWarehouseUI() {
    $('wheatCountVal') && ($('wheatCountVal').textContent = inventory.wheat);
    $('carrotsCountVal') && ($('carrotsCountVal').textContent = inventory.carrots);
    $('applesCountVal') && ($('applesCountVal').textContent = inventory.apples);
    $('woodCountVal') && ($('woodCountVal').textContent = inventory.wood);
    $('bricksCountVal') && ($('bricksCountVal').textContent = inventory.bricks);
    $('milkCountVal') && ($('milkCountVal').textContent = inventory.milk);
  }

  // ========================================================
  // 4. SCREEN NAVIGATION & MODALS
  // ========================================================
  function switchScreen(screenName) {
    if (screenName === 'table') {
      $('screenTable').classList.add('active-screen');
      $('screenMapSite').classList.remove('active-screen');
      $('btnViewTable').classList.add('active-seg');
      $('btnViewMapSite').classList.remove('active-seg');
      $('mathCardSection').style.display = 'block';
    } else {
      $('screenTable').classList.remove('active-screen');
      $('screenMapSite').classList.add('active-screen');
      $('btnViewTable').classList.remove('active-seg');
      $('btnViewMapSite').classList.add('active-seg');
      $('mathCardSection').style.display = 'none';
    }
  }

  
  function openCatalogModalSafe() {
    const m = $('buildingCatalogModal') || $('catalogModal');
    if (m) m.style.display = 'flex';
  }
  function closeCatalogModalSafe() {
    const m = $('buildingCatalogModal') || $('catalogModal');
    if (m) m.style.display = 'none';
  }
  function openWarehouseModalSafe() {
    const m = $('warehouseModal');
    if (m) m.style.display = 'flex';
  }
  function closeWarehouseModalSafe() {
    const m = $('warehouseModal');
    if (m) m.style.display = 'none';
  }

  function initModalsAndNavigation() {
    // Screen Switch
    $('btnViewTable') && ($('btnViewTable').onclick = () => switchScreen('table'));
    $('btnViewMapSite') && ($('btnViewMapSite').onclick = () => switchScreen('map'));

    // Catalog Open / Close
    function openCatalog() {
      const modal = $('buildingCatalogModal') || $('catalogModal');
      if (modal) modal.style.display = 'flex';
    }
    function closeCatalog() {
      const modal = $('buildingCatalogModal') || $('catalogModal');
      if (modal) modal.style.display = 'none';
    }

    $('btnOpenCatalogNav') && ($('btnOpenCatalogNav').onclick = openCatalogModalSafe);
    $('btnDockBuild') && ($('btnDockBuild').onclick = openCatalogModalSafe);
    $('btnDockBuildChunky') && ($('btnDockBuildChunky').onclick = openCatalogModalSafe);
    $('btnCloseCatalog') && ($('btnCloseCatalog').onclick = closeCatalogModalSafe);

    // Warehouse Open / Close
    function openWarehouse() {
      const modal = $('warehouseModal');
      if (modal) modal.style.display = 'flex';
    }
    function closeWarehouse() {
      const modal = $('warehouseModal');
      if (modal) modal.style.display = 'none';
    }

    $('btnOpenWarehouseNav') && ($('btnOpenWarehouseNav').onclick = openWarehouseModalSafe);
    $('btnDockWarehouse') && ($('btnDockWarehouse').onclick = openWarehouseModalSafe);
    $('btnDockScores') && ($('btnDockScores').onclick = openWarehouseModalSafe);
    $('topBarCoins') && ($('topBarCoins').onclick = openWarehouseModalSafe);
    $('btnCloseWarehouse') && ($('btnCloseWarehouse').onclick = closeWarehouseModalSafe);

    // Worlds Modal
    $('btnWorldModal') && ($('btnWorldModal').onclick = () => { $('worldsModal') && ($('worldsModal').style.display = 'flex'); });
    $('btnDockLevels') && ($('btnDockLevels').onclick = () => { $('worldsModal') && ($('worldsModal').style.display = 'flex'); });
    $('btnCloseWorlds') && ($('btnCloseWorlds').onclick = () => { $('worldsModal') && ($('worldsModal').style.display = 'none'); });

    // Home / Replay
    $('btnDockHome') && ($('btnDockHome').onclick = () => { switchScreen('map'); });
    $('btnDockReplay') && ($('btnDockReplay').onclick = () => { renderCurrentStep(); });

    // Reward Modal Handlers
    $('btnContinueToMap') && ($('btnContinueToMap').onclick = () => {
      $('rewardModal').style.display = 'none';
      switchScreen('map');
    });
    $('btnNextPartDirect') && ($('btnNextPartDirect').onclick = () => {
      $('rewardModal').style.display = 'none';
      const building = BUILDINGS_DATABASE[activeBuildingId] || BUILDINGS_DATABASE.barn;
      currentStepIndex = (currentStepIndex + 1) % building.steps.length;
      renderCurrentStep();
      switchScreen('table');
    });

    // Rebrickable Modal Handlers
    $('btnOpenRebrickable') && ($('btnOpenRebrickable').onclick = () => {
      populateRebrickableGrid();
      $('rebrickableModal').style.display = 'flex';
    });
    $('btnCloseRebrickable') && ($('btnCloseRebrickable').onclick = () => {
      $('rebrickableModal').style.display = 'none';
    });

    // Link Specific Building Selection Buttons
    function selectBuildingAndStart(bId) {
      activeBuildingId = bId;
      currentStepIndex = 0;
      closeCatalog();
      renderCurrentStep();
      switchScreen('table');
    }

    $('btnChooseBarn') && ($('btnChooseBarn').onclick = () => selectBuildingAndStart('barn'));
    $('btnChooseWindmill') && ($('btnChooseWindmill').onclick = () => selectBuildingAndStart('windmill'));
    $('btnChooseFarmhouse') && ($('btnChooseFarmhouse').onclick = () => selectBuildingAndStart('farmhouse'));
    $('btnChooseChickenCoop') && ($('btnChooseChickenCoop').onclick = () => selectBuildingAndStart('coop'));
    $('btnChooseGreenhouse') && ($('btnChooseGreenhouse').onclick = () => selectBuildingAndStart('greenhouse'));
    $('btnChooseSilo') && ($('btnChooseSilo').onclick = () => selectBuildingAndStart('silo'));

    // Warehouse Sell Actions
    initWarehouseActions();
  }

  function initWarehouseActions() {
    $('btnSellWheat10') && ($('btnSellWheat10').onclick = () => {
      if (inventory.wheat >= 10) {
        inventory.wheat -= 10;
        coinsStock += 50;
        updateWarehouseUI();
        if (window.legoSound) window.legoSound && typeof window.legoSound.playBrickClick === 'function' && (window.legoSound && typeof window.legoSound.playBrickClick === 'function' && window.legoSound.playBrickClick());
      }
    });
    $('btnSellWheatAll') && ($('btnSellWheatAll').onclick = () => {
      if (inventory.wheat > 0) {
        coinsStock += inventory.wheat * 5;
        inventory.wheat = 0;
        updateWarehouseUI();
        if (window.legoSound) window.legoSound && typeof window.legoSound.playCelebrationJingle === 'function' && (window.legoSound && typeof window.legoSound.playCelebrationJingle === 'function' && window.legoSound.playCelebrationJingle());
      }
    });
    $('btnSellCarrotsAll') && ($('btnSellCarrotsAll').onclick = () => {
      if (inventory.carrots > 0) {
        coinsStock += inventory.carrots * 8;
        inventory.carrots = 0;
        updateWarehouseUI();
        if (window.legoSound) window.legoSound && typeof window.legoSound.playCelebrationJingle === 'function' && (window.legoSound && typeof window.legoSound.playCelebrationJingle === 'function' && window.legoSound.playCelebrationJingle());
      }
    });
    $('btnUpgradeWarehouse') && ($('btnUpgradeWarehouse').onclick = () => {
      if (coinsStock >= 200) {
        coinsStock -= 200;
        MAX_WAREHOUSE_CAPACITY += 500;
        updateWarehouseUI();
        if (window.legoSound) window.legoSound && typeof window.legoSound.playCelebrationJingle === 'function' && (window.legoSound && typeof window.legoSound.playCelebrationJingle === 'function' && window.legoSound.playCelebrationJingle());
      }
    });
  }

  function initBuildingCatalogSelections() {
    const catalogCards = document.querySelectorAll('.catalog-card');
    catalogCards.forEach(card => {
      const bBtn = card.querySelector('.btn-build-start');
      if (bBtn) {
        bBtn.onclick = (e) => {
          e.stopPropagation();
          const bTitle = card.querySelector('.cat-title') ? card.querySelector('.cat-title').textContent : '';
          if (bTitle.includes('אסם') || bTitle.includes('Barn')) activeBuildingId = 'barn';
          else if (bTitle.includes('טחנת') || bTitle.includes('Windmill')) activeBuildingId = 'windmill';
          else if (bTitle.includes('בית') || bTitle.includes('Farmhouse')) activeBuildingId = 'farmhouse';
          else if (bTitle.includes('לול') || bTitle.includes('Coop')) activeBuildingId = 'coop';
          else if (bTitle.includes('חממת') || bTitle.includes('Greenhouse')) activeBuildingId = 'greenhouse';
          else if (bTitle.includes('ממגורת') || bTitle.includes('Silo')) activeBuildingId = 'silo';

          $('catalogModal').style.display = 'none';
          currentStepIndex = 0;
          renderCurrentStep();
          switchScreen('table');
        };
      }
    });
  }

  function populateRebrickableGrid() {
    const grid = $('rebrickablePartsGrid');
    if (!grid || !window.REBRICKABLE_PARTS_CATALOG) return;
    grid.innerHTML = '';

    window.REBRICKABLE_PARTS_CATALOG.forEach(part => {
      const card = document.createElement('div');
      card.style.cssText = 'background: white; border-radius: 12px; border: 2px solid #e2e8f0; padding: 10px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05);';
      card.innerHTML = `
        <div style="font-size: 1.8rem; margin-bottom: 4px;">🧱</div>
        <div style="font-size: 0.75rem; font-weight: 900; color: #dc2626; background: #fee2e2; border-radius: 6px; padding: 2px 6px; display: inline-block;">Part #${part.id}</div>
        <div style="font-size: 0.85rem; font-weight: 800; color: #1e293b; margin-top: 4px;">${part.heName}</div>
        <div style="font-size: 0.72rem; color: #64748b; font-weight: 600;">${part.name}</div>
        <div style="margin-top: 6px; font-size: 0.75rem; background: #f8fafc; border-radius: 6px; padding: 4px; color: #0284c7; font-weight: 700;">
          ${part.studsL}x${part.studsW} Studs | ${part.category}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // ========================================================
  // INITIALIZATION ON DOM READY
  // ========================================================
  window.addEventListener('DOMContentLoaded', () => {
    init3DTable();
    initModalsAndNavigation();
    initDioramaHotspots();
    renderCurrentStep();
    updateWarehouseUI();
    console.log('Master Multi-Building Lego Engine loaded successfully!');
  });

})();
