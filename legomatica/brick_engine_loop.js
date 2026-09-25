/* ========================================================
   BrickMind (LEGO-MATICA) - Full 3D Table & 25-Unit Building Loop
   Loop: Solve 5 Math Exercises on 3D Wooden Table -> Earn 5 Modules ->
   Assemble 25-Piece Building on Farm Map -> Complete & Unlock Next!
   ======================================================== */

(function() {
  const STORAGE_KEY = 'brickmind_loop_v1';
  
  // Game State
  let currentScreen = 'table'; // 'table' or 'map'
  let valA = 4, valB = 3, targetSum = 7;
  let currentSnapCount = 0;
  let streak = 0, totalSolved = 0;
  let isSolved = false;

  // Building Progression (Each building = 25 units = 5 modules of 5 units each)
  let currentBuildingIndex = 0;
  let earnedModulesInCurrentBuilding = 0; // 0 to 5
  let placedModulesOnMap = 0; // 0 to 5

  const buildingsData = [
    {
      id: 'barn',
      name: 'אסם חווה אדום 🏠',
      icon: '🏠',
      desc: 'אסם לגו אדום מפואר עם דלת כפולה, גג משופע וסילו תבואה עגול.',
      modules: [
        { name: 'מודול 1: יסודות ומשטח רצפה (5 לבנים)', units: 5, color: 0x475569, stage: 'foundation' },
        { name: 'מודול 2: קירות אדומים ודלת לבנה (5 לבנים)', units: 5, color: 0xdc2626, stage: 'walls' },
        { name: 'מודול 3: קומה שנייה וחלונות (5 לבנים)', units: 5, color: 0xdc2626, stage: 'second_floor' },
        { name: 'מודול 4: גג לבן משופע (5 לבנים)', units: 5, color: 0xf8fafc, stage: 'roof' },
        { name: 'מודול 5: סילו תבואה אדום ומנורה (5 לבנים)', units: 5, color: 0xb91c1c, stage: 'silo' }
      ]
    },
    {
      id: 'windmill',
      name: 'טחנת רוח הולנדית 💨',
      icon: '💨',
      desc: 'טחנת רוח גבוהה עם כנפיים מסתובבות ובסיס אבן עגול.',
      modules: [
        { name: 'מודול 1: בסיס אבן עגול (5 לבנים)', units: 5, color: 0x64748b, stage: 'foundation' },
        { name: 'מודול 2: מגדל לבן מחורץ (5 לבנים)', units: 5, color: 0xf1f5f9, stage: 'walls' },
        { name: 'מודול 3: מרפסת עץ ומעקה (5 לבנים)', units: 5, color: 0xb45309, stage: 'balcony' },
        { name: 'מודול 4: כיפת גג כחולה (5 לבנים)', units: 5, color: 0x2563eb, stage: 'roof' },
        { name: 'מודול 5: 4 כנפי רוח מסתובבות (5 לבנים)', units: 5, color: 0xf59e0b, stage: 'blades' }
      ]
    },
    {
      id: 'tractor_shed',
      name: 'מוסך הטרקטור 🚜',
      icon: '🚜',
      desc: 'מוסך חקלאי עם טרקטור אדום ושדות גזר מטופחים.',
      modules: [
        { name: 'מודול 1: רצפת בטון ובור טיפולים (5 לבנים)', units: 5, color: 0x334155, stage: 'foundation' },
        { name: 'מודול 2: עמודי תמיכה ומדפי כלים (5 לבנים)', units: 5, color: 0xd97706, stage: 'pillars' },
        { name: 'מודול 3: טרקטור אדום עם גלגלים (5 לבנים)', units: 5, color: 0xef4444, stage: 'tractor' },
        { name: 'מודול 4: גג אסבסט גלי ירוק (5 לבנים)', units: 5, color: 0x15803d, stage: 'roof' },
        { name: 'מודול 5: ערוגת גזרים ושילוט (5 לבנים)', units: 5, color: 0xf97316, stage: 'carrots' }
      ]
    }
  ];

  function $(id) { return document.getElementById(id); }

  // 3D Table Scene Variables
  let tableScene, tableCamera, tableRenderer, tableControls;
  let tableMeshGroup, tableBricksGroup, tableSnappedStackGroup;

  // 3D Farm Map Scene Variables
  
  // 3D Farm Map Scene Variables
  let mapScene, mapCamera, mapRenderer, mapControls;
  let farmIslandGroup, ghostBlueprintGroup, placedBuildingGroup, grassModulesGroup;

  function init3DFarmMapSite() {
    const container = $('threeMapContainer');
    if (!container) return;

    const w = container.clientWidth || 500;
    const h = container.clientHeight || 450;

    mapScene = new THREE.Scene();
    mapScene.background = new THREE.Color(0x60a5fa);
    mapScene.fog = new THREE.FogExp2(0x93c5fd, 0.02);

    mapCamera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    mapCamera.position.set(0, 11, 16);

    mapRenderer = new THREE.WebGLRenderer({ antialias: true });
    mapRenderer.setSize(w, h);
    mapRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mapRenderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(mapRenderer.domElement);

    // Full 360° Orbit & Zoom & Pan Controls
    mapControls = new THREE.OrbitControls(mapCamera, mapRenderer.domElement);
    mapControls.enableDamping = true;
    mapControls.dampingFactor = 0.08;
    mapControls.maxPolarAngle = Math.PI / 2.05;
    mapControls.minDistance = 6;
    mapControls.maxDistance = 28;
    mapControls.target.set(0, 1.5, 0);

    // Lighting
    const amb = new THREE.AmbientLight(0xffffff, 0.9);
    mapScene.add(amb);
    const sun = new THREE.DirectionalLight(0xfffaed, 1.25);
    sun.position.set(12, 24, 14);
    sun.castShadow = true;
    mapScene.add(sun);

    // Groups
    farmIslandGroup = new THREE.Group();
    ghostBlueprintGroup = new THREE.Group();
    placedBuildingGroup = new THREE.Group();
    grassModulesGroup = new THREE.Group();
    mapScene.add(farmIslandGroup, ghostBlueprintGroup, placedBuildingGroup, grassModulesGroup);

    build3DFarmTerrain();
    updateMapConstructionSite();

    // Render loop with idle bobbing on grass modules
    function animateMap() {
      requestAnimationFrame(animateMap);
      if (mapControls) mapControls.update();

      // Gentle floating glow animation for 3D modules waiting on the grass
      const time = Date.now() * 0.003;
      grassModulesGroup.children.forEach((mod, idx) => {
        if (!mod.userData.isFlying) {
          mod.position.y = mod.userData.baseY + Math.sin(time + idx) * 0.08;
          mod.rotation.y += 0.008;
        }
      });

      mapRenderer.render(mapScene, mapCamera);
    }
    animateMap();

    // Resize
    window.addEventListener('resize', () => {
      if (!container || !mapRenderer || !mapCamera) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      mapCamera.aspect = nw / nh;
      mapCamera.updateProjectionMatrix();
      mapRenderer.setSize(nw, nh);
    });

    // Raycaster to CLICK & SNAP 3D MODULES DIRECTLY FROM THE GRASS!
    const mapRaycaster = new THREE.Raycaster();
    const mapMouse = new THREE.Vector2();

    mapRenderer.domElement.addEventListener('pointerdown', (e) => {
      const rect = mapRenderer.domElement.getBoundingClientRect();
      mapMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mapMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mapRaycaster.setFromCamera(mapMouse, mapCamera);

      const hits = mapRaycaster.intersectObjects(grassModulesGroup.children, true);
      if (hits.length > 0) {
        let hitObj = hits[0].object;
        while (hitObj.parent && hitObj.parent !== grassModulesGroup) {
          hitObj = hitObj.parent;
        }
        if (hitObj.userData && !hitObj.userData.isFlying) {
          snap3DModuleFromGrassToBuilding(hitObj);
        }
      }
    });
  }

  // Update Construction Site: Spawn 3D Ghost Blueprint, Placed Stages & Physical 3D Modules lying on the grass!
  function updateMapConstructionSite() {
    ghostBlueprintGroup.clear();
    placedBuildingGroup.clear();
    grassModulesGroup.clear();

    const currentBuilding = buildingsData[currentBuildingIndex];
    const siteX = -1.5;
    const siteZ = -1.8;

    // 1. Ghosted / Blueprint of the building
    const ghostMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    const ghostBarn = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.5, 4.0), ghostMat);
    ghostBarn.position.set(siteX, 1.75, siteZ);
    const ghostRoof = new THREE.Mesh(new THREE.ConeGeometry(3.6, 1.8, 4), ghostMat);
    ghostRoof.position.set(siteX, 4.4, siteZ);
    ghostRoof.rotation.y = Math.PI / 4;
    const ghostSilo = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 5.0, 16), ghostMat);
    ghostSilo.position.set(siteX + 3.2, 2.5, siteZ);

    ghostBlueprintGroup.add(ghostBarn, ghostRoof, ghostSilo);

    // 2. Render Real Placed Modules on the building (0 to placedModulesOnMap)
    for (let m = 0; m < placedModulesOnMap; m++) {
      const moduleInfo = currentBuilding.modules[m];
      renderPlacedBuildingStage(moduleInfo.stage, siteX, siteZ);
    }

    // 3. PHYSICAL 3D LEGO MODULES LYING ON THE GRASS BESIDE THE BUILDING!
    // For every earned module that hasn't been placed yet:
    for (let i = placedModulesOnMap; i < earnedModulesInCurrentBuilding; i++) {
      const modInfo = currentBuilding.modules[i];
      spawnPhysicalModuleOnGrass(i, modInfo, siteX, siteZ);
    }

    // Also populate UI dock
    populateMapModulesDock();
  }

  // Create Physical 3D Lego Module Mesh lying on the grass next to the construction site
  function spawnPhysicalModuleOnGrass(index, modInfo, siteX, siteZ) {
    const modMesh = create3DModuleMesh(modInfo.stage);
    
    // Position on the grass right beside the building (staggered neatly)
    const grassX = siteX + 4.2 + ((index - placedModulesOnMap) * 1.8);
    const grassZ = siteZ + 2.8 - ((index - placedModulesOnMap) * 0.8);
    const baseY = 0.4;

    modMesh.position.set(grassX, baseY, grassZ);
    modMesh.userData = {
      moduleIndex: index,
      stage: modInfo.stage,
      baseY: baseY,
      isFlying: false,
      siteX: siteX,
      siteZ: siteZ
    };

    // Add a pulsing golden halo ring under the module on the grass
    const ringGeo = new THREE.RingGeometry(0.8, 1.2, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.08;
    modMesh.add(ringMesh);

    grassModulesGroup.add(modMesh);
  }

  // Create 3D Mesh representing each of the 5 Lego Modules
  function create3DModuleMesh(stage) {
    const grp = new THREE.Group();
    const solidMatRed = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.18 });
    const solidMatWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.18 });
    const solidMatFoundation = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.3 });
    const solidMatSilo = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.18 });

    switch (stage) {
      case 'foundation': {
        const f = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 2.0), solidMatFoundation);
        f.position.y = 0.2;
        // 4 studs
        const sGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 16);
        for (let sx = -0.6; sx <= 0.6; sx += 1.2) {
          for (let sz = -0.5; sz <= 0.5; sz += 1.0) {
            const st = new THREE.Mesh(sGeo, solidMatFoundation);
            st.position.set(sx, 0.46, sz);
            grp.add(st);
          }
        }
        grp.add(f);
        break;
      }
      case 'walls': {
        const w = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 1.8), solidMatRed);
        w.position.y = 0.6;
        const d = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.2), solidMatWhite);
        d.position.set(0, 0.5, 0.95);
        grp.add(w, d);
        break;
      }
      case 'second_floor': {
        const w2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.0, 1.8), solidMatRed);
        w2.position.y = 0.5;
        const win = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.2), solidMatWhite);
        win.position.set(0, 0.5, 0.95);
        grp.add(w2, win);
        break;
      }
      case 'roof': {
        const r = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.2, 4), solidMatWhite);
        r.position.y = 0.6;
        r.rotation.y = Math.PI / 4;
        grp.add(r);
        break;
      }
      case 'silo': {
        const silo = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 2.2, 16), solidMatSilo);
        silo.position.y = 1.1;
        const cap = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), solidMatWhite);
        cap.position.set(0, 2.2, 0);
        grp.add(silo, cap);
        break;
      }
    }

    return grp;
  }

  // Smooth 3D Flight & Snap Animation from Grass to Building Blueprint!
  function snap3DModuleFromGrassToBuilding(modMesh) {
    if (modMesh.userData.isFlying) return;
    modMesh.userData.isFlying = true;

    const startX = modMesh.position.x;
    const startY = modMesh.position.y;
    const startZ = modMesh.position.z;

    const targetX = modMesh.userData.siteX;
    const targetZ = modMesh.userData.siteZ;
    let targetY = 1.0;
    if (modMesh.userData.stage === 'second_floor') targetY = 2.5;
    if (modMesh.userData.stage === 'roof') targetY = 4.2;
    if (modMesh.userData.stage === 'silo') targetY = 2.4;

    let startTime = performance.now();
    const duration = 400; // ms

    if (window.legoSound) {
      window.legoSound.playSnapClick(1.2);
    }

    function animateFlight(now) {
      const elapsed = now - startTime;
      const p = Math.min(1.0, elapsed / duration);
      // Smooth cubic curve with high arc
      const ease = p * p * (3 - 2 * p);
      const arcY = Math.sin(p * Math.PI) * 3.5;

      modMesh.position.x = startX + (targetX - startX) * ease;
      modMesh.position.y = startY + (targetY - startY) * ease + arcY;
      modMesh.position.z = startZ + (targetZ - startZ) * ease;

      if (p < 1.0) {
        requestAnimationFrame(animateFlight);
      } else {
        // Impact snap sound & complete placement
        if (window.legoSound) {
          window.legoSound.playSnapClick(1.6);
          window.legoSound.cheerInHebrew('מודול הורכב בהצלחה על שלד המבנה!');
        }
        triggerConfetti();
        grassModulesGroup.remove(modMesh);
        placedModulesOnMap++;
        updateMapConstructionSite();
        saveProgress();
        updateBuildingMissionUI();

        if (placedModulesOnMap === 5) {
          setTimeout(() => handleFullBuildingCompleted(), 600);
        }
      }
    }
    requestAnimationFrame(animateFlight);
  }


  // Entire 25-Piece Building Complete Celebration!
  function handleFullBuildingCompleted() {
    if (window.legoSound) {
      window.legoSound.playVictoryFanfare();
      window.legoSound.cheerInHebrew('מזל טוב! השלמת את כל 25 היחידות של המבנה!');
    }
    triggerConfetti();

    const curr = buildingsData[currentBuildingIndex];
    if ($('compBuildingIcon')) $('compBuildingIcon').textContent = curr.icon;
    if ($('compBuildingName')) $('compBuildingName').textContent = curr.name + ' עומד מוכן בחווה!';
    if ($('buildingCompleteModal')) $('buildingCompleteModal').classList.add('active');
  }

  function advanceToNextBuilding() {
    currentBuildingIndex = (currentBuildingIndex + 1) % buildingsData.length;
    earnedModulesInCurrentBuilding = 0;
    placedModulesOnMap = 0;
    saveProgress();
    updateBuildingMissionUI();
    switchScreen('table');
    generateNewExercise();
    initResourceEconomy();
  }

  // ========================================================
  // 4. UI SCREEN SWITCHING & EXERCISE GENERATION
  // ========================================================
  function switchScreen(screenName) {
    currentScreen = screenName;
    if (screenName === 'table') {
      $('screenTable')?.classList.add('active-screen');
      $('screenMapSite')?.classList.remove('active-screen');
      $('btnViewTable')?.classList.add('active-view');
      $('btnViewMapSite')?.classList.remove('active-view');
    } else {
      $('screenTable')?.classList.remove('active-screen');
      $('screenMapSite')?.classList.add('active-screen');
      $('btnViewTable')?.classList.remove('active-view');
      $('btnViewMapSite')?.classList.add('active-view');
      if (!mapScene) init3DFarmMapSite();
      else updateMapConstructionSite();
    }
  }

  function generateNewExercise() {
    isSolved = false;
    currentSnapCount = 0;

    valA = Math.floor(Math.random() * 4) + 2; // 2 to 5
    valB = Math.floor(Math.random() * 4) + 1; // 1 to 4
    targetSum = valA + valB;

    if ($('valA')) $('valA').textContent = valA;
    if ($('valB')) $('valB').textContent = valB;
    if ($('answerDisplay')) {
      $('answerDisplay').textContent = targetSum;
      $('answerDisplay').classList.remove('revealed');
    }
    if ($('mathCard')) $('mathCard').classList.remove('solved-pulse');
    if ($('snapCountVal')) $('snapCountVal').textContent = `0 / ${targetSum}`;

    spawn3DTableBricks();
  }

  function updateBuildingMissionUI() {
    const curr = buildingsData[currentBuildingIndex];
    if ($('targetBuildingIcon')) $('targetBuildingIcon').textContent = curr.icon;
    if ($('targetBuildingTitle')) $('targetBuildingTitle').textContent = `בונה עכשיו: ${curr.name}`;
    
    const totalUnitsDone = placedModulesOnMap * 5;
    if ($('targetBuildingCounter')) {
      $('targetBuildingCounter').textContent = `הושלמו: ${totalUnitsDone} / 25 יחידות (${placedModulesOnMap}/5 מודולים מורכבים במפה)`;
    }

    const pct = Math.round((totalUnitsDone / 25) * 100);
    if ($('moduleProgressFill')) $('moduleProgressFill').style.width = pct + '%';
  }

  function triggerConfetti() {
    const canvas = $('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const p = [];
    for (let i = 0; i < 45; i++) {
      p.push({
        x: canvas.width / 2, y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 14, vy: (Math.random() - 1) * 14,
        color: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'][i % 5]
      });
    }
    let f = 0;
    function anim() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      p.forEach(pt => {
        pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.35;
        ctx.fillStyle = pt.color; ctx.fillRect(pt.x, pt.y, 9, 6);
      });
      if (++f < 65) requestAnimationFrame(anim);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(anim);
  }

  function loadProgress() {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) {
        const d = JSON.parse(s);
        warehouseStock = d.warehouseStock || 0;
      }
    } catch(e) {}
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) {
        const d = JSON.parse(s);
        streak = d.streak || 0;
        totalSolved = d.totalSolved || 0;
        currentBuildingIndex = d.currentBuildingIndex || 0;
        earnedModulesInCurrentBuilding = d.earnedModulesInCurrentBuilding || 0;
        placedModulesOnMap = d.placedModulesOnMap || 0;
      }
    } catch (e) {}
  }

  function saveProgress() {
    try {
      const d = { streak, totalSolved, currentBuildingIndex, earnedModulesInCurrentBuilding, placedModulesOnMap, warehouseStock, time: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
    } catch(e) {}
    try {
      const d = { streak, totalSolved, currentBuildingIndex, earnedModulesInCurrentBuilding, placedModulesOnMap, time: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
    } catch (e) {}
  }

  function setupEventListeners() {
    // Navigation between 3D Table and 3D Farm Map
    if ($('btnViewTable')) $('btnViewTable').onclick = () => switchScreen('table');
    if ($('btnViewMapSite')) $('btnViewMapSite').onclick = () => switchScreen('map');
    if ($('btnBackToTable')) $('btnBackToTable').onclick = () => switchScreen('table');

    // Reward Modal transition
    if ($('btnGoToMap')) {
      $('btnGoToMap').onclick = () => {
        $('rewardModal')?.classList.remove('active');
        switchScreen('map');
      };
    }

    // Complete Building Modal
    if ($('btnNextBuilding')) {
      $('btnNextBuilding').onclick = () => {
        $('buildingCompleteModal')?.classList.remove('active');
        advanceToNextBuilding();
      };
    }

    // 3D Camera Controls
    if ($('btnCamIso')) $('btnCamIso').onclick = () => tableCamera.position.set(0, 9, 13);
    if ($('btnCamTop')) $('btnCamTop').onclick = () => tableCamera.position.set(0, 16, 0.1);
    if ($('btnCamFront')) $('btnCamFront').onclick = () => tableCamera.position.set(0, 3, 14);

    // Audio Toggles
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

  
  // ==========================================
  // RESOURCE ECONOMY & 60-SECOND PRODUCTION ENGINE
  // ==========================================
  const MAX_WAREHOUSE_CAPACITY = 1000;
  let warehouseStock = 0;

  // Track each building's production timer and unharvested batch
  const buildingProduction = [
    { id: 'barn', name: 'אסם אדום (חלב וחיטה 🥛🌾)', timer: 60, pendingHarvest: 0, isReady: false, resourceIcon: '🌾' },
    { id: 'windmill', name: 'טחנת רוח (קמח לגו 🥖)', timer: 60, pendingHarvest: 0, isReady: false, resourceIcon: '🥖' },
    { id: 'tractor_shed', name: 'ערוגת גזרים (גזר מוזהב 🥕)', timer: 60, pendingHarvest: 0, isReady: false, resourceIcon: '🥕' }
  ];

  let economyInterval = null;

  function initResourceEconomy() {
    if (economyInterval) clearInterval(economyInterval);
    economyInterval = setInterval(() => {
      tickEconomy();
    }, 1000);
    updateWarehouseUI();
    renderProductionPanel();
  }

  function tickEconomy() {
    // Only completed buildings produce resources (placedModulesOnMap >= 5)
    // For unlocked buildings:
    for (let b = 0; b <= currentBuildingIndex; b++) {
      const isCompleted = (b < currentBuildingIndex) || (b === currentBuildingIndex && placedModulesOnMap >= 5);
      
      if (isCompleted) {
        const prod = buildingProduction[b];
        if (prod && !prod.isReady) {
          prod.timer--;
          if (prod.timer <= 0) {
            prod.timer = 60;
            prod.pendingHarvest += 100; // Produces 100 units per minute!
            prod.isReady = true;

            if (window.legoSound) {
              window.legoSound.playSnapClick(1.6);
            }
          }
        }
      }
    }

    renderProductionPanel();
    saveProgress();
  }

  // Harvest 100 units from building into central warehouse
  function harvestFromBuilding(buildingIdx) {
    const prod = buildingProduction[buildingIdx];
    if (!prod || prod.pendingHarvest <= 0) return;

    const availableSpace = MAX_WAREHOUSE_CAPACITY - warehouseStock;
    if (availableSpace <= 0) {
      if (window.legoSound) {
        window.legoSound.cheerInHebrew('המחסן מלא עד אפס מקום! אלף מתוך אלף!');
      }
      alert('המחסן מלא (1000/1000)! ⚠️ עליך לפרוק או להשתמש במשאבים!');
      return;
    }

    const toCollect = Math.min(prod.pendingHarvest, availableSpace);
    warehouseStock += toCollect;
    prod.pendingHarvest -= toCollect;
    if (prod.pendingHarvest === 0) {
      prod.isReady = false;
    }

    if (window.legoSound) {
      window.legoSound.playVictoryFanfare();
      window.legoSound.cheerInHebrew(`נפרקו ${toCollect} יחידות למחסן!`);
    }

    triggerConfetti();
    updateWarehouseUI();
    renderProductionPanel();
    saveProgress();
  }

  function updateWarehouseUI() {
    const elCurrent = $('whCurrentVal');
    const elMax = $('whMaxVal');
    const elFill = $('whFill');
    const elBadge = $('warehouseBadge');

    if (elCurrent) elCurrent.textContent = warehouseStock;
    if (elMax) elMax.textContent = MAX_WAREHOUSE_CAPACITY;

    const pct = Math.min(100, Math.round((warehouseStock / MAX_WAREHOUSE_CAPACITY) * 100));
    if (elFill) {
      elFill.style.width = pct + '%';
      if (pct >= 90) {
        elFill.style.background = '#ef4444'; // Red warning near full
      } else {
        elFill.style.background = 'linear-gradient(90deg, #f59e0b, #10b981)';
      }
    }

    if (elBadge) {
      elBadge.classList.toggle('warehouse-full', warehouseStock >= MAX_WAREHOUSE_CAPACITY);
    }
  }

  function renderProductionPanel() {
    const list = $('prodBuildingsList');
    if (!list) return;
    list.innerHTML = '';

    let anyActive = false;

    for (let b = 0; b < buildingsData.length; b++) {
      const isCompleted = (b < currentBuildingIndex) || (b === currentBuildingIndex && placedModulesOnMap >= 5);
      const prod = buildingProduction[b];
      const bData = buildingsData[b];

      const item = document.createElement('div');
      item.className = `prod-building-card ${isCompleted ? 'active-producer' : 'locked-producer'}`;

      if (isCompleted && prod) {
        anyActive = true;
        const mm = Math.floor(prod.timer / 60);
        const ss = prod.timer % 60;
        const timeFormatted = `${mm < 10 ? '0' : ''}${mm}:${ss < 10 ? '0' : ''}${ss}`;

        item.innerHTML = `
          <div class="prod-icon">${prod.resourceIcon}</div>
          <div class="prod-info">
            <div class="prod-name">${prod.name}</div>
            <div class="prod-timer-text">⏳ מונה ייצור: <strong>${timeFormatted}</strong> (100 יח'/דקה)</div>
          </div>
          <button class="btn-harvest ${prod.pendingHarvest > 0 ? 'can-harvest' : ''}" ${prod.pendingHarvest === 0 ? 'disabled' : ''}>
            ${prod.pendingHarvest > 0 ? `פרוק ${prod.pendingHarvest} יח' למחסן! 📥` : 'מייצר... ⏳'}
          </button>
        `;

        const btn = item.querySelector('.btn-harvest');
        if (btn && prod.pendingHarvest > 0) {
          btn.onclick = () => harvestFromBuilding(b);
        }
      } else {
        item.innerHTML = `
          <div class="prod-icon">🔒</div>
          <div class="prod-info">
            <div class="prod-name">${bData.name}</div>
            <div class="prod-timer-text">השלם את הרכבת 25 היחידות כדי להפעיל ייצור!</div>
          </div>
          <div class="prod-locked-badge">נעול</div>
        `;
      }

      list.appendChild(item);
    }
  }


  function init() {
    loadProgress();
    init3DTable();
    setupEventListeners();
    updateBuildingMissionUI();
    generateNewExercise();
    console.log('🚀 BrickMind 3D Wooden Table & 25-Unit Map Loop Initialized!');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
