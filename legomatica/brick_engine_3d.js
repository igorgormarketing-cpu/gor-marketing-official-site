/* ========================================================
   BrickMind (LEGO-MATICA) - Complete Three.js 3D Engine
   True 3D Lego Bricks, Cylindrical Studs, 360° Orbit Rotation,
   3D Physics Snapping, and 3D FarmVille Island Explorer
   ======================================================== */

(function() {
  const STORAGE_KEY = 'brickmind_save_3d_v1';
  
  // Game State
  let gameMode = 'add'; // 'add', 'sub', 'mul'
  let currentWorld = 'farm'; // 'farm', 'castle', 'space'
  let valA = 3, valB = 2, targetSum = 5;
  let streak = 0, bestStreak = 0, totalSolved = 0;
  let isSolved = false, snappedCount = 0;

  // 3D Tower Scene Variables
  let scene, camera, renderer, controls;
  let basePlateGroup, towerBricksGroup;
  let autoRotate = false;
  let stacked3DBricks = []; // Array of { mesh, color, group, height }

  // 3D Farm Island Scene Variables
  let farmScene, farmCamera, farmRenderer, farmControls;
  let windmillBladesMesh = null;
  let farmDuckMesh = null;
  let farmTractorMesh = null;

  // Colors Palette
  const worldThemes = {
    farm: {
      name: 'חוות הלגו 3D 🌾',
      icon: '🚜',
      themeClass: 'theme-farm',
      banner: '🚜 חוות הלגו 3D של BrickMind · גרור לסיבוב 360 מעלות 🔄 🌾',
      colorsA: 0x2563eb, // Royal Blue
      colorsB: 0xf59e0b, // Amber Gold
      basePlateColor: 0x22c55e, // Grass Green
      milestones: [
        { targetSolved: 1, icon: '🏠', name: 'אסם לגו אדום 3D', desc: 'האסם המרכזי הוקם בתלת-ממד מלא בחווה שלך!' },
        { targetSolved: 3, icon: '🚜', name: 'טרקטור חווה אדום 3D', desc: 'הטרקטור מוכן לעבוד ולחרוש את השדות!' },
        { targetSolved: 5, icon: '💨', name: 'טחנת רוח לגו 3D', desc: 'טחנת הרוח מסתובבת על הגבעה הירוקה!' },
        { targetSolved: 8, icon: '🦆', name: 'בריכת ברווזים 3D', desc: 'הברווזים שוחים בשמחה במים הצלולים!' },
        { targetSolved: 12, icon: '🌾', name: 'שדה חיטה מוזהב 3D', desc: 'שדות החיטה צמחו ומוכנים לקציר!' },
        { targetSolved: 16, icon: '🍎', name: 'פרדס עצי תפוח 3D', desc: 'התפוחים האדומים והמתוקים הבשילו על העצים!' },
        { targetSolved: 20, icon: '👑', name: 'כתר אלוף חוות הלגו 3D', desc: 'השלמת את כל החווה! אתה גאון חשבון אמיתי!' }
      ]
    },
    castle: {
      name: 'טירת האבירים 3D 🏰',
      icon: '🏰',
      themeClass: 'theme-castle',
      banner: '🏰 טירת האבירים 3D של BrickMind · מגדלי שמירה וחומות אבן 🛡️',
      colorsA: 0x7c3aed, // Purple
      colorsB: 0x10b981, // Emerald
      basePlateColor: 0x64748b, // Stone Gray
      milestones: [
        { targetSolved: 1, icon: '🏰', name: 'מגדל שמירה ראשי 3D', desc: 'המגדל המלכותי מתנשא מעל החומה!' },
        { targetSolved: 3, icon: '🛡️', name: 'גשר מתרומם 3D', desc: 'הגשר המלכותי מגן על הכניסה לטירה!' },
        { targetSolved: 5, icon: '⚔️', name: 'ארסנל האבירים 3D', desc: 'החרבות והמגנים מוכנים להגנת הממלכה!' },
        { targetSolved: 8, icon: '🐴', name: 'אורוות סוסי אבירים 3D', desc: 'הסוסים האצילים מוכנים למסדר המלכותי!' },
        { targetSolved: 12, icon: '🚩', name: 'דגל הממלכה המוזהב 3D', desc: 'דגל הממלכה מתנופף בגאווה בראש המגדל!' },
        { targetSolved: 16, icon: '🐉', name: 'דרקון לגו 3D', desc: 'הדרקון הידידותי הצטרף לשמירה על הטירה!' }
      ]
    },
    space: {
      name: 'תחנת החלל 3D 🚀',
      icon: '🚀',
      themeClass: 'theme-space',
      banner: '🚀 תחנת החלל 3D של BrickMind · גלקסיית כפל הלבנים 🪐 ✨',
      colorsA: 0x06b6d4, // Cyan
      colorsB: 0xec4899, // Pink
      basePlateColor: 0x1e293b, // Dark Moon Rock
      milestones: [
        { targetSolved: 1, icon: '🚀', name: 'רקטה רב-שלבית 3D', desc: 'הרקטה מוכנה לשיגור אל עבר הגלקסיה!' },
        { targetSolved: 3, icon: '🛰️', name: 'לוויין סולארי 3D', desc: 'הלוויין משדר אותות מחקר מהחלל העמוק!' },
        { targetSolved: 5, icon: '🪐', name: 'תחנת מחקר ירחית 3D', desc: 'התחנה פועלת ומייצרת חמצן לחוקרים!' },
        { targetSolved: 8, icon: '🛸', name: 'רובר גישוש חללי 3D', desc: 'הרובר נוסע ואוסף דגימות לגו מהכוכב!' },
        { targetSolved: 12, icon: '🌌', name: 'שער בין-כוכבי 3D', desc: 'פתחת את שער הכוכבים לאינסוף ומעבר לו!' }
      ]
    }
  };

  function $(id) { return document.getElementById(id); }

  // ========================================================
  // 1. INITIALIZE THREE.JS 3D ARENA
  // ========================================================
  function initThreeArena() {
    const container = $('threeContainer');
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 360;

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 8, 14);

    // WebGL Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Orbit Controls (360° rotation)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.05; // Don't go below baseplate
    controls.minDistance = 6;
    controls.maxDistance = 24;
    controls.target.set(0, 2.5, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(10, 20, 12);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.4);
    fillLight.position.set(-10, 10, -10);
    scene.add(fillLight);

    // Groups
    basePlateGroup = new THREE.Group();
    towerBricksGroup = new THREE.Group();
    scene.add(basePlateGroup);
    scene.add(towerBricksGroup);

    // Build 3D Lego Baseplate
    create3DBaseplate();

    // Render Loop
    function animate() {
      requestAnimationFrame(animate);
      if (controls) {
        if (autoRotate) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 2.0;
        } else {
          controls.autoRotate = false;
        }
        controls.update();
      }
      renderer.render(scene, camera);
    }
    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    // Raycaster for tapping 3D bricks in subtraction mode
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('pointerdown', (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(towerBricksGroup.children, true);

      if (intersects.length > 0 && gameMode === 'sub' && !isSolved) {
        let hitMesh = intersects[0].object;
        while (hitMesh.parent && hitMesh.parent !== towerBricksGroup) {
          hitMesh = hitMesh.parent;
        }
        handle3DSubtractionDetach(hitMesh);
      }
    });
  }

  // Create 3D Studded Lego Baseplate
  function create3DBaseplate() {
    basePlateGroup.clear();
    const currentTheme = worldThemes[currentWorld] || worldThemes.farm;

    // Main Plate Box
    const plateGeo = new THREE.BoxGeometry(7, 0.4, 7);
    const plateMat = new THREE.MeshStandardMaterial({
      color: currentTheme.basePlateColor,
      roughness: 0.3,
      metalness: 0.1
    });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.position.y = -0.2;
    plateMesh.receiveShadow = true;
    basePlateGroup.add(plateMesh);

    // Studs on Baseplate Grid (6x6 studs)
    const studGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.14, 16);
    const studMat = new THREE.MeshStandardMaterial({
      color: currentTheme.basePlateColor,
      roughness: 0.3,
      metalness: 0.1
    });

    for (let x = -2.5; x <= 2.5; x += 1.0) {
      for (let z = -2.5; z <= 2.5; z += 1.0) {
        const stud = new THREE.Mesh(studGeo, studMat);
        stud.position.set(x, 0.07, z);
        stud.castShadow = true;
        stud.receiveShadow = true;
        basePlateGroup.add(stud);
      }
    }
  }

  // ========================================================
  // 2. CREATE 3D LEGO BRICK MESH
  // ========================================================
  function create3DLegoBrickMesh(colorHex, isWide = false) {
    const brickGroup = new THREE.Group();

    const brickWidth = isWide ? 4.0 : 3.0;
    const brickHeight = 0.8;
    const brickDepth = 1.6;

    // Main Body Box
    const bodyGeo = new THREE.BoxGeometry(brickWidth, brickHeight, brickDepth);
    const brickMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.18,
      metalness: 0.08,
      emissive: 0x000000
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, brickMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    brickGroup.add(bodyMesh);

    // 4 Studs on Top
    const studGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.2, 16);
    const studOffsets = [
      { x: -0.8, z: -0.4 }, { x: 0.8, z: -0.4 },
      { x: -0.8, z: 0.4 },  { x: 0.8, z: 0.4 }
    ];

    studOffsets.forEach(pos => {
      const stud = new THREE.Mesh(studGeo, brickMat);
      stud.position.set(pos.x, brickHeight / 2 + 0.1, pos.z);
      stud.castShadow = true;
      stud.receiveShadow = true;
      brickGroup.add(stud);
    });

    brickGroup.userData = { colorHex, initialY: 0 };
    return brickGroup;
  }

  // Snap 3D Brick into the Tower with Smooth Physics Animation
  function snap3DBrickToTower(colorHex) {
    if (isSolved) return;

    const brickMesh = create3DLegoBrickMesh(colorHex);
    const targetY = (snappedCount * 0.8) + 0.4;
    const startY = targetY + 4.0; // Drop from above

    brickMesh.position.set(0, startY, 0);
    towerBricksGroup.add(brickMesh);
    stacked3DBricks.push(brickMesh);

    if (window.legoSound) {
      window.legoSound.playSnapClick(1.0 + (snappedCount * 0.08));
    }

    // Drop Animation
    let startTime = performance.now();
    const duration = 220; // ms

    function animateDrop(time) {
      const elapsed = time - startTime;
      const progress = Math.min(1.0, elapsed / duration);
      // Ease out bounce
      const ease = 1 - Math.pow(1 - progress, 3);
      brickMesh.position.y = startY - ((startY - targetY) * ease);

      if (progress < 1.0) {
        requestAnimationFrame(animateDrop);
      } else {
        brickMesh.position.y = targetY;
        // Subtle impact squash
        brickMesh.scale.set(1.08, 0.92, 1.08);
        setTimeout(() => brickMesh.scale.set(1, 1, 1), 60);
      }
    }
    requestAnimationFrame(animateDrop);

    snappedCount++;
    if ($('towerCountBadge')) $('towerCountBadge').textContent = snappedCount;

    // Check Win
    if (snappedCount === targetSum) {
      handleSuccess();
    }
  }

  // Handle 3D Subtraction Detach
  function handle3DSubtractionDetach(brickMesh) {
    if (isSolved || !brickMesh || brickMesh.userData.detached) return;
    brickMesh.userData.detached = true;

    if (window.legoSound) window.legoSound.playDetachPop();

    // Fly away animation
    let startTime = performance.now();
    const startY = brickMesh.position.y;
    function animateFly(time) {
      const elapsed = time - startTime;
      const progress = Math.min(1.0, elapsed / 280);
      brickMesh.position.x = progress * 6.0;
      brickMesh.position.y = startY + (progress * 2.0);
      brickMesh.rotation.z = progress * 1.5;
      brickMesh.scale.setScalar(1 - progress * 0.5);

      if (progress < 1.0) {
        requestAnimationFrame(animateFly);
      } else {
        towerBricksGroup.remove(brickMesh);
      }
    }
    requestAnimationFrame(animateFly);

    snappedCount--;
    if ($('towerCountBadge')) $('towerCountBadge').textContent = snappedCount;

    if (snappedCount === targetSum) {
      handleSuccess();
    }
  }

  // ========================================================
  // 3. INITIALIZE 3D FARMVILLE ISLAND EXPLORER
  // ========================================================
  function init3DFarmIsland() {
    const container = $('farm3dContainer');
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    farmScene = new THREE.Scene();
    farmCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    farmCamera.position.set(0, 14, 22);

    farmRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    farmRenderer.setSize(width, height);
    farmRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    farmRenderer.shadowMap.enabled = true;
    container.appendChild(farmRenderer.domElement);

    farmControls = new THREE.OrbitControls(farmCamera, farmRenderer.domElement);
    farmControls.enableDamping = true;
    farmControls.dampingFactor = 0.06;
    farmControls.autoRotate = true;
    farmControls.autoRotateSpeed = 1.2;
    farmControls.target.set(0, 1, 0);

    // Lighting
    const amb = new THREE.AmbientLight(0xffffff, 0.8);
    farmScene.add(amb);
    const sun = new THREE.DirectionalLight(0xfffaed, 1.1);
    sun.position.set(15, 25, 15);
    sun.castShadow = true;
    farmScene.add(sun);

    // Build 3D Lego Island
    build3DFarmWorld();

    function animateFarm() {
      requestAnimationFrame(animateFarm);
      if (windmillBladesMesh) windmillBladesMesh.rotation.z += 0.03;
      if (farmDuckMesh) farmDuckMesh.position.y = 0.2 + Math.sin(Date.now() * 0.004) * 0.08;
      farmControls.update();
      farmRenderer.render(farmScene, farmCamera);
    }
    animateFarm();

    // Raycast on 3D farm items to trigger sounds
    const farmRaycaster = new THREE.Raycaster();
    const farmMouse = new THREE.Vector2();

    farmRenderer.domElement.addEventListener('pointerdown', (e) => {
      const rect = farmRenderer.domElement.getBoundingClientRect();
      farmMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      farmMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      farmRaycaster.setFromCamera(farmMouse, farmCamera);

      const hits = farmRaycaster.intersectObjects(farmScene.children, true);
      if (hits.length > 0) {
        let obj = hits[0].object;
        while (obj.parent && obj.parent !== farmScene) obj = obj.parent;
        const soundType = obj.userData?.sound || 'cow';
        if (window.legoSound) window.legoSound.playSoundEffect(soundType);

        // Jump animation
        const initY = obj.position.y;
        obj.position.y = initY + 1.0;
        setTimeout(() => obj.position.y = initY, 200);
      }
    });
  }

  // Build the rich 3D Lego Farm Island
  function build3DFarmWorld() {
    farmScene.clear();

    // 1. Green Studded Island Baseplate
    const islandGeo = new THREE.CylinderGeometry(9, 9.5, 0.6, 32);
    const islandMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.4 });
    const islandMesh = new THREE.Mesh(islandGeo, islandMat);
    islandMesh.position.y = -0.3;
    farmScene.add(islandMesh);

    // 2. Duck Pond (Blue Glass Circle)
    const pondGeo = new THREE.CylinderGeometry(2.6, 2.6, 0.1, 24);
    const pondMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, transparent: true, opacity: 0.85 });
    const pondMesh = new THREE.Mesh(pondGeo, pondMat);
    pondMesh.position.set(3.2, 0.05, 3.2);
    farmScene.add(pondMesh);

    // 3D Lego Duck
    farmDuckMesh = new THREE.Group();
    const duckBody = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.6), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
    const duckHead = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
    duckHead.position.set(0.35, 0.35, 0);
    const duckBeak = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.25), new THREE.MeshStandardMaterial({ color: 0xf97316 }));
    duckBeak.position.set(0.65, 0.3, 0);
    farmDuckMesh.add(duckBody, duckHead, duckBeak);
    farmDuckMesh.position.set(3.2, 0.2, 3.2);
    farmDuckMesh.userData = { sound: 'duck' };
    farmScene.add(farmDuckMesh);

    // 3. 3D Lego Red Barn
    const barnGroup = new THREE.Group();
    const barnWalls = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.2, 4.0), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
    barnWalls.position.y = 1.6;
    const barnRoof = new THREE.Mesh(new THREE.ConeGeometry(3.6, 1.8, 4), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    barnRoof.position.y = 4.1;
    barnRoof.rotation.y = Math.PI / 4;
    const barnDoor = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.8, 0.2), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    barnDoor.position.set(0, 0.9, 2.05);
    barnGroup.add(barnWalls, barnRoof, barnDoor);
    barnGroup.position.set(-3.5, 0, -2.5);
    barnGroup.userData = { sound: 'cow' };
    farmScene.add(barnGroup);

    // 4. 3D Lego Windmill
    const windmillGroup = new THREE.Group();
    const millTower = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 5.0, 8), new THREE.MeshStandardMaterial({ color: 0xf1f5f9 }));
    millTower.position.y = 2.5;
    const millRoof = new THREE.Mesh(new THREE.ConeGeometry(1.5, 1.2, 8), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
    millRoof.position.y = 5.6;

    windmillBladesMesh = new THREE.Group();
    const bladeGeo = new THREE.BoxGeometry(0.3, 3.8, 0.08);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });
    const b1 = new THREE.Mesh(bladeGeo, bladeMat);
    const b2 = new THREE.Mesh(bladeGeo, bladeMat);
    b2.rotation.z = Math.PI / 2;
    windmillBladesMesh.add(b1, b2);
    windmillBladesMesh.position.set(0, 4.8, 1.25);

    windmillGroup.add(millTower, millRoof, windmillBladesMesh);
    windmillGroup.position.set(4.2, 0, -3.2);
    windmillGroup.userData = { sound: 'windmill' };
    farmScene.add(windmillGroup);

    // 5. 3D Lego Red Tractor
    farmTractorMesh = new THREE.Group();
    const tBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 1.4), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    tBody.position.y = 0.8;
    const tCabin = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.2), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 }));
    tCabin.position.set(-0.4, 1.8, 0);
    const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const w1 = new THREE.Mesh(wheelGeo, wheelMat); w1.rotation.x = Math.PI / 2; w1.position.set(0.7, 0.4, 0.8);
    const w2 = new THREE.Mesh(wheelGeo, wheelMat); w2.rotation.x = Math.PI / 2; w2.position.set(0.7, 0.4, -0.8);
    const w3 = new THREE.Mesh(wheelGeo, wheelMat); w3.rotation.x = Math.PI / 2; w3.position.set(-0.7, 0.5, 0.8);
    const w4 = new THREE.Mesh(wheelGeo, wheelMat); w4.rotation.x = Math.PI / 2; w4.position.set(-0.7, 0.5, -0.8);
    farmTractorMesh.add(tBody, tCabin, w1, w2, w3, w4);
    farmTractorMesh.position.set(-2.5, 0, 3.5);
    farmTractorMesh.userData = { sound: 'tractor' };
    farmScene.add(farmTractorMesh);

    // 6. 3D Lego Trees
    create3DTree(-0.5, -4.5);
    create3DTree(-4.8, 1.0);
    create3DTree(1.5, -2.0);
  }

  function create3DTree(x, z) {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 1.8, 8), new THREE.MeshStandardMaterial({ color: 0x78350f }));
    trunk.position.y = 0.9;
    const leaves1 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, 1.8), new THREE.MeshStandardMaterial({ color: 0x15803d }));
    leaves1.position.y = 2.0;
    const leaves2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1.2), new THREE.MeshStandardMaterial({ color: 0x16a34a }));
    leaves2.position.y = 2.8;
    tree.add(trunk, leaves1, leaves2);
    tree.position.set(x, 0, z);
    tree.userData = { sound: 'crunch' };
    farmScene.add(tree);
  }

  // ========================================================
  // 4. GAME PLAY & DOM INTERACTION
  // ========================================================
  function generateNewProblem() {
    isSolved = false;
    snappedCount = 0;
    stacked3DBricks = [];
    if (towerBricksGroup) towerBricksGroup.clear();

    if ($('answerDisplay')) {
      $('answerDisplay').textContent = '?';
      $('answerDisplay').classList.remove('revealed');
    }
    if ($('mathCard')) $('mathCard').classList.remove('solved-pulse');
    if ($('towerCountBadge')) $('towerCountBadge').textContent = '0';
    if ($('slotsA')) $('slotsA').innerHTML = '';
    if ($('slotsB')) $('slotsB').innerHTML = '';

    const theme = worldThemes[currentWorld] || worldThemes.farm;

    if (gameMode === 'add') {
      if ($('mainOp')) $('mainOp').textContent = '+';
      valA = Math.floor(Math.random() * 4) + 1;
      valB = Math.floor(Math.random() * 4) + 1;
      targetSum = valA + valB;
      if ($('snapHintText')) $('snapHintText').textContent = `לחץ על קוביות לבנייה ב-3D! גרור לסיבוב 360° 🔄`;
    } else if (gameMode === 'sub') {
      if ($('mainOp')) $('mainOp').textContent = '-';
      valA = Math.floor(Math.random() * 5) + 3;
      valB = Math.floor(Math.random() * (valA - 1)) + 1;
      targetSum = valA - valB;
      if ($('snapHintText')) $('snapHintText').textContent = `במגדל יש ${valA} לבנים. הקש על הלבנים ב-3D כדי לנתק ${valB}!`;

      // Build initial 3D tower with valA bricks
      for (let i = 0; i < valA; i++) {
        const col = i < (valA - valB) ? theme.colorsA : theme.colorsB;
        const b = create3DLegoBrickMesh(col);
        b.position.set(0, (i * 0.8) + 0.4, 0);
        towerBricksGroup.add(b);
        stacked3DBricks.push(b);
      }
      snappedCount = valA;
      if ($('towerCountBadge')) $('towerCountBadge').textContent = snappedCount;
    } else if (gameMode === 'mul') {
      if ($('mainOp')) $('mainOp').textContent = '✖️';
      valA = Math.floor(Math.random() * 3) + 2;
      valB = Math.floor(Math.random() * 3) + 2;
      targetSum = valA * valB;
      if ($('snapHintText')) $('snapHintText').textContent = `בנה ${valA} שורות של ${valB} לבנים במערך 3D!`;
    }

    if ($('valA')) $('valA').textContent = valA;
    if ($('valB')) $('valB').textContent = valB;
    if ($('streakCount')) $('streakCount').textContent = streak;

    setupTrays();
  }

  function setupTrays() {
    const theme = worldThemes[currentWorld] || worldThemes.farm;
    const colorAHex = '#' + theme.colorsA.toString(16).padStart(6, '0');
    const colorBHex = '#' + theme.colorsB.toString(16).padStart(6, '0');

    if (gameMode === 'add') {
      if ($('trayALabel')) $('trayALabel').textContent = 'קבוצה 1';
      if ($('trayBLabel')) $('trayBLabel').textContent = 'קבוצה 2';
      if ($('trayACount')) $('trayACount').textContent = `${valA} לבנים`;
      if ($('trayBCount')) $('trayBCount').textContent = `${valB} לבנים`;

      for (let i = 0; i < valA; i++) createTrayButton('A', theme.colorsA, colorAHex, $('slotsA'));
      for (let i = 0; i < valB; i++) createTrayButton('B', theme.colorsB, colorBHex, $('slotsB'));
    } else if (gameMode === 'sub') {
      if ($('trayALabel')) $('trayALabel').textContent = 'מגדל 3D';
      if ($('trayBLabel')) $('trayBLabel').textContent = 'יעד ניתוק';
      if ($('trayACount')) $('trayACount').textContent = `${valA} לבנים`;
      if ($('trayBCount')) $('trayBCount').textContent = `לנתק: ${valB}`;
    } else if (gameMode === 'mul') {
      if ($('trayALabel')) $('trayALabel').textContent = `${valA} שורות`;
      if ($('trayBLabel')) $('trayBLabel').textContent = `${valB} בכל שורה`;
      for (let i = 0; i < valA; i++) {
        createTrayButton('A', theme.colorsA, colorAHex, $('slotsA'), `שורה ${i+1} (${valB} לבנים)`, valB);
      }
    }
  }

  function createTrayButton(group, colorNum, colorHex, container, labelText = null, mulCount = 1) {
    if (!container) return;
    const btn = document.createElement('div');
    btn.className = 'tray-3d-brick-btn';
    btn.style.backgroundColor = colorHex;

    const studs = document.createElement('div');
    studs.className = 'studs-row';
    for (let s = 0; s < 4; s++) {
      const st = document.createElement('span');
      st.className = 'stud';
      studs.appendChild(st);
    }
    btn.appendChild(studs);

    if (labelText) {
      const lbl = document.createElement('span');
      lbl.className = 'btn-inner-lbl';
      lbl.textContent = labelText;
      btn.appendChild(lbl);
    }

    btn.onclick = () => {
      if (btn.dataset.used === 'true' || isSolved) return;
      btn.dataset.used = 'true';
      btn.classList.add('used');

      if (gameMode === 'mul') {
        for (let m = 0; m < mulCount; m++) {
          setTimeout(() => snap3DBrickToTower(colorNum), m * 70);
        }
      } else {
        snap3DBrickToTower(colorNum);
      }
    };

    container.appendChild(btn);
  }

  function handleSuccess() {
    isSolved = true;
    streak++;
    totalSolved++;
    if ($('streakCount')) $('streakCount').textContent = streak;
    if ($('answerDisplay')) {
      $('answerDisplay').textContent = targetSum;
      $('answerDisplay').classList.add('revealed');
    }
    if ($('mathCard')) $('mathCard').classList.add('solved-pulse');

    if (window.legoSound) window.legoSound.playVictoryFanfare();
    if (window.legoSound) window.legoSound.cheerInHebrew('כל הכבוד אלוף, מגדל הלגו נבנה בצורה מושלמת!');

    // Trigger celebration spin
    autoRotate = true;
    setTimeout(() => autoRotate = false, 2500);

    triggerConfetti();
    saveProgress();
    updateProgressUI();

    const m = worldThemes[currentWorld].milestones.find(m => m.targetSolved === totalSolved);
    if (m && $('rewardModal')) {
      if ($('rewardIcon')) $('rewardIcon').textContent = m.icon;
      if ($('rewardName')) $('rewardName').textContent = m.name;
      if ($('rewardDesc')) $('rewardDesc').textContent = m.desc;
      $('rewardModal').classList.add('active');
    } else {
      setTimeout(() => generateNewProblem(), 1800);
    }
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
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        streak = d.streak || 0;
        totalSolved = d.totalSolved || 0;
        currentWorld = d.currentWorld || 'farm';
        gameMode = d.gameMode || 'add';
      }
    } catch(e) {}
  }

  function saveProgress() {
    try {
      const d = { streak, totalSolved, currentWorld, gameMode, time: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
    } catch(e) {}
  }

  function updateProgressUI() {
    const list = worldThemes[currentWorld].milestones;
    let nextMilestone = list.find(m => totalSolved < m.targetSolved);

    if ($('farmBadges')) {
      $('farmBadges').innerHTML = '';
      list.forEach(m => {
        const unl = totalSolved >= m.targetSolved;
        const b = document.createElement('div');
        b.className = `farm-unlocked-badge ${unl ? 'is-unlocked' : 'is-locked'}`;
        b.textContent = m.icon;
        b.title = `${m.name} (${unl ? 'נפתח ב-3D' : 'נעול'})`;
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

  function setupEventListeners() {
    // Math Modes
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

    // 3D Camera Controls
    if ($('btnCamIso')) $('btnCamIso').onclick = () => {
      camera.position.set(0, 8, 14);
      controls.target.set(0, 2.5, 0);
    };
    if ($('btnCamFront')) $('btnCamFront').onclick = () => {
      camera.position.set(0, 3, 15);
      controls.target.set(0, 2.5, 0);
    };
    if ($('btnCamTop')) $('btnCamTop').onclick = () => {
      camera.position.set(0, 16, 0.1);
      controls.target.set(0, 0, 0);
    };
    if ($('btnCamAutoRotate')) $('btnCamAutoRotate').onclick = () => {
      autoRotate = !autoRotate;
      $('btnCamAutoRotate').classList.toggle('active', autoRotate);
    };

    // 3D Farm Explorer Overlay
    if ($('btnViewFarm3D')) $('btnViewFarm3D').onclick = () => {
      $('farm3dOverlay')?.classList.add('active');
      if (!farmScene) init3DFarmIsland();
    };
    if ($('btnCloseFarm3D')) $('btnCloseFarm3D').onclick = () => {
      $('farm3dOverlay')?.classList.remove('active');
    };

    // Modals
    if ($('btnWorldSelect')) $('btnWorldSelect').onclick = () => $('worldModal')?.classList.add('active');
    if ($('btnCloseWorldModal')) $('btnCloseWorldModal').onclick = () => $('worldModal')?.classList.remove('active');
    document.querySelectorAll('.btn-select-world').forEach(b => {
      b.onclick = (e) => {
        currentWorld = e.target.dataset.world;
        document.body.className = worldThemes[currentWorld].themeClass;
        if ($('worldIcon')) $('worldIcon').textContent = worldThemes[currentWorld].icon;
        if ($('worldNameLabel')) $('worldNameLabel').textContent = worldThemes[currentWorld].name;
        if ($('footerBannerText')) $('footerBannerText').textContent = worldThemes[currentWorld].banner;
        create3DBaseplate();
        $('worldModal')?.classList.remove('active');
        generateNewProblem();
      };
    });

    if ($('btnSandbox')) $('btnSandbox').onclick = () => $('sandboxOverlay')?.classList.add('active');
    if ($('btnCloseSandbox')) $('btnCloseSandbox').onclick = () => $('sandboxOverlay')?.classList.remove('active');

    if ($('btnBlitz')) $('btnBlitz').onclick = () => $('blitzOverlay')?.classList.add('active');
    if ($('btnCloseBlitz')) $('btnCloseBlitz').onclick = () => $('blitzOverlay')?.classList.remove('active');

    if ($('btnParents')) $('btnParents').onclick = () => $('parentsModal')?.classList.add('active');
    if ($('btnCloseParents')) $('btnCloseParents').onclick = () => $('parentsModal')?.classList.remove('active');

    if ($('btnRewardContinue')) $('btnRewardContinue').onclick = () => {
      $('rewardModal')?.classList.remove('active');
      generateNewProblem();
    };

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
    initThreeArena();
    setupEventListeners();
    generateNewProblem();
    console.log('🚀 BrickMind 3D Three.js Engine with 360° Orbit initialized successfully!');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
