/* ==========================================================================
   bjt-3d.js - Interactive 3D WebGL BJT Device Chamber (NPN Transistor)
   Visualizes Emitter Injection, Base Recombination (IB), Collector Sweep (IC),
   and Base Width Modulation (Early Effect)
   ========================================================================== */

class BJT3DChamber {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    if (typeof THREE === 'undefined') {
      this.container.innerHTML = '<div class="fallback-3d" style="height:100%; display:flex; align-items:center; justify-content:center; padding:20px; text-align:center; color:#94a3b8; font-size:0.9rem; border:1px dashed #334155; border-radius:4px;">3D view could not load. Controls and numeric results still work.</div>';
      return;
    }

    this.params = {
      vbe: 0.7,
      vce: 8.0,
      beta: 120,
      va: 50 // Early Voltage
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.electrons = [];
    try {
      this.clock = new THREE.Clock();
    } catch(e) {
      this.container.innerHTML = '<div class="fallback-3d" style="height:100%; display:flex; align-items:center; justify-content:center; padding:20px; text-align:center; color:#94a3b8; font-size:0.9rem; border:1px dashed #334155; border-radius:4px;">3D view could not load. Controls and numeric results still work.</div>';
      return;
    }

    this.init();
  }

  init() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 450;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x080d18);

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(8, 6, 10);

        if (typeof THREE === 'undefined') {
      this.container.innerHTML = '<div class="fallback-3d" style="height:100%; display:flex; align-items:center; justify-content:center; padding:20px; text-align:center; color:#94a3b8; font-size:0.9rem; border:1px dashed #334155; border-radius:4px;">3D view could not load. Controls and numeric results still work.</div>';
      return;
    }
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      this.container.innerHTML = '<div class="fallback-3d" style="height:100%; display:flex; align-items:center; justify-content:center; padding:20px; text-align:center; color:#94a3b8; font-size:0.9rem; border:1px dashed #334155; border-radius:4px;">3D view could not load. Controls and numeric results still work.</div>';
      return;
    }
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.target.set(0, 0, 0);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(6, 12, 8);
    this.scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 1.2, 16);
    pointLight.position.set(0, 2, 2);
    this.scene.add(pointLight);

    this.buildDevice();
    this.initCarriers();

    window.addEventListener('resize', () => this.onResize());
    if ('ResizeObserver' in window && this.container) {
      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(this.container);
    }
    
    this.isVisible = true;
    if ('IntersectionObserver' in window && this.container) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const wasVisible = this.isVisible;
          this.isVisible = entry.isIntersecting;
          if (!wasVisible && this.isVisible) {
            this.animate();
          }
        });
      }, { threshold: 0.05 });
      obs.observe(this.container);
    }
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isVisible) {
        this.animate();
      }
    });

    this.animate();
  }

  buildDevice() {
    this.deviceGroup = new THREE.Group();

    // 1. Emitter Block (n+, left)
    const emGeo = new THREE.BoxGeometry(2.0, 2.0, 3.2);
    const emMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.35,
      metalness: 0.3,
      emissive: 0x064e3b,
      emissiveIntensity: 0.3
    });
    this.emitterMesh = new THREE.Mesh(emGeo, emMat);
    this.emitterMesh.position.set(-2.2, 0, 0);
    this.deviceGroup.add(this.emitterMesh);

    // 2. Base Region (p, middle - very thin)
    this.baseWidth = 0.8;
    this.baseGeo = new THREE.BoxGeometry(this.baseWidth, 2.0, 3.2);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.4,
      metalness: 0.2,
      emissive: 0x881337,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.85
    });
    this.baseMesh = new THREE.Mesh(this.baseGeo, baseMat);
    this.baseMesh.position.set(-0.7, 0, 0);
    this.deviceGroup.add(this.baseMesh);

    // 3. Collector-Base Depletion Layer (changes with VCE)
    this.depGeo = new THREE.BoxGeometry(0.5, 2.0, 3.2);
    const depMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.5,
      roughness: 0.2
    });
    this.depMesh = new THREE.Mesh(this.depGeo, depMat);
    this.depMesh.position.set(-0.05, 0, 0);
    this.deviceGroup.add(this.depMesh);

    // 4. Collector Block (n, right - wide)
    const colGeo = new THREE.BoxGeometry(3.0, 2.0, 3.2);
    const colMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.35,
      metalness: 0.3,
      emissive: 0x075985,
      emissiveIntensity: 0.3
    });
    this.colMesh = new THREE.Mesh(colGeo, colMat);
    this.colMesh.position.set(1.8, 0, 0);
    this.deviceGroup.add(this.colMesh);

    // 5. Metal Contacts & Wire Posts
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    
    // Emitter Contact (Left face)
    const eContact = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 2.4), metalMat);
    eContact.position.set(-3.25, 0, 0);
    this.deviceGroup.add(eContact);

    // Base Contact (Top face of base)
    const bContact = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 1.4), metalMat);
    bContact.position.set(-0.7, 1.05, 0);
    this.deviceGroup.add(bContact);

    const bPost = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 16), metalMat);
    bPost.position.set(-0.7, 1.45, 0);
    this.deviceGroup.add(bPost);

    // Collector Contact (Right face)
    const cContact = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 2.4), metalMat);
    cContact.position.set(3.35, 0, 0);
    this.deviceGroup.add(cContact);

    // Grid Floor
    const grid = new THREE.GridHelper(14, 14, 0x1e293b, 0x0f172a);
    grid.position.y = -1.2;
    this.scene.add(grid);

    this.scene.add(this.deviceGroup);
  }

  initCarriers() {
    this.carrierCount = 60;
    const sphereGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const electronMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });

    this.carrierGroup = new THREE.Group();
    for (let i = 0; i < this.carrierCount; i++) {
      const mesh = new THREE.Mesh(sphereGeo, electronMat);
      const isBaseRecombine = (i % 25 === 0); // ~4% recombines in base as IB
      const c = {
        mesh: mesh,
        x: -3.0 + Math.random() * 0.8,
        y: (Math.random() - 0.5) * 1.5,
        z: (Math.random() - 0.5) * 2.5,
        isBaseRecombine: isBaseRecombine,
        phase: Math.random() * Math.PI * 2
      };
      mesh.position.set(c.x, c.y, c.z);
      this.carrierGroup.add(mesh);
      this.electrons.push(c);
    }
    this.deviceGroup.add(this.carrierGroup);
  }

  setVoltages(vbe, vce) {
    this.params.vbe = parseFloat(vbe);
    this.params.vce = parseFloat(vce);

    // Early effect: Depletion width increases with VCE
    const depWidth = 0.2 + (this.params.vce / 20) * 0.45;
    this.depMesh.scale.x = depWidth / 0.5;
    this.depMesh.position.x = -0.3 + depWidth / 2;
  }

  setCameraView(mode) {
    if (!this.camera || !this.controls) return;
    if (mode === 'iso') {
      this.camera.position.set(8, 6, 10);
      this.controls.target.set(0, 0, 0);
    } else if (mode === 'top') {
      this.camera.position.set(0, 12, 0.1);
      this.controls.target.set(0, 0, 0);
    } else if (mode === 'side') {
      this.camera.position.set(0, 0, 11);
      this.controls.target.set(0, 0, 0);
    }
    this.controls.update();
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

    animate() {
    if (document.hidden || !this.isVisible) return;

    requestAnimationFrame(() => this.animate());
    const dt = this.clock.getDelta();
    if (this.controls) this.controls.update();

    const { vbe, vce } = this.params;
    const isConducting = vbe >= 0.65;
    const speed = isConducting ? 3.0 : 0.1;

    this.electrons.forEach(c => {
      if (!isConducting) {
        c.x += (Math.random() - 0.5) * 0.02;
        c.y += (Math.random() - 0.5) * 0.02;
        c.mesh.position.set(c.x, c.y, c.z);
        return;
      }

      c.x += speed * dt;

      // Base recombination branch: carrier exits upward toward base terminal
      if (c.isBaseRecombine && c.x >= -0.9 && c.x <= -0.5) {
        c.y += 2.0 * dt;
        if (c.y > 1.2) {
          // Recycle back to emitter
          c.x = -3.0;
          c.y = (Math.random() - 0.5) * 1.5;
        }
      }

      // Reached collector contact
      if (c.x > 3.2) {
        c.x = -3.0 + Math.random() * 0.3;
        c.y = (Math.random() - 0.5) * 1.5;
        c.z = (Math.random() - 0.5) * 2.5;
      }

      c.mesh.position.set(c.x, c.y, c.z);
    });

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

window.BJT3DChamber = BJT3DChamber;
