/* ==========================================================================
   mosfet-3d.js - Interactive 3D WebGL MOSFET Device Chamber
   Visualizes 3D Inversion Layer, Pinch-Off, Channel Length Modulation,
   Real-Time Animated Carrier Drift (NMOS Electrons vs PMOS Holes),
   and 3D Electric Field Vector Streamlines
   ========================================================================== */

class MOSFET3DChamber {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    if (typeof THREE === 'undefined') {
      this.container.innerHTML = '<div class="fallback-3d" style="height:100%; display:flex; align-items:center; justify-content:center; padding:20px; text-align:center; color:#94a3b8; font-size:0.9rem; border:1px dashed #334155; border-radius:4px;">3D view could not load. Controls and numeric results still work.</div>';
      return;
    }

    this.params = {
      deviceType: 'nmos', // 'nmos' or 'pmos'
      vgs: 1.8,
      vds: 1.5,
      vth: 0.5,
      unCox: 200, // uA/V^2
      W: 10,
      L: 1,
      lambda: 0.08,
      showChannel: true,
      showCarriers: true,
      showFields: true
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.electrons = [];
    this.channelMesh = null;
    this.fieldArrowsGroup = null;
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
    const height = this.container.clientHeight || 480;

    // 1. Scene & Renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x080d18);

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(9, 7, 11);

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
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 2. Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.05;
      this.controls.minDistance = 5;
      this.controls.maxDistance = 25;
      this.controls.target.set(0, 0, 0);
    }

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(8, 14, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    this.scene.add(dirLight);

    this.accentLight = new THREE.PointLight(0x38bdf8, 1.2, 18);
    this.accentLight.position.set(0, 3, 2);
    this.scene.add(this.accentLight);

    // 4. Build 3D Solid Device Structure
    this.buildDevice();

    // 5. Build Animated Carriers
    this.initCarriers();

    // 6. Build 3D Field Arrows
    this.buildFieldArrows();

    // 7. Responsive listener
    window.addEventListener('resize', () => this.onResize());
    if ('ResizeObserver' in window && this.container) {
      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(this.container);
    }

    // 8. Start render loop
    
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
    if (this.deviceGroup) {
      this.scene.remove(this.deviceGroup);
    }
    this.deviceGroup = new THREE.Group();

    const isNMOS = this.params.deviceType === 'nmos';
    const subWidth = 7.0;
    const subHeight = 1.8;
    const subDepth = 4.0;

    // A. Substrate (p-type for NMOS, n-type for PMOS)
    const subGeo = new THREE.BoxGeometry(subWidth, subHeight, subDepth);
    const subMat = new THREE.MeshStandardMaterial({
      color: isNMOS ? 0x1e293b : 0x22354a,
      roughness: 0.6,
      metalness: 0.1,
      transparent: true,
      opacity: 0.88
    });
    this.subMesh = new THREE.Mesh(subGeo, subMat);
    this.subMesh.position.y = -subHeight / 2;
    this.subMesh.receiveShadow = true;
    this.deviceGroup.add(this.subMesh);

    // B. Source & Drain Wells (n+ for NMOS, p+ for PMOS)
    const wellWidth = 1.6;
    const wellHeight = 0.7;
    const wellDepth = 3.6;
    const wellGeo = new THREE.BoxGeometry(wellWidth, wellHeight, wellDepth);
    const wellMat = new THREE.MeshStandardMaterial({
      color: isNMOS ? 0x10b981 : 0xf43f5e,
      roughness: 0.3,
      metalness: 0.4,
      emissive: isNMOS ? 0x064e3b : 0x881337,
      emissiveIntensity: 0.35
    });

    this.sourceWell = new THREE.Mesh(wellGeo, wellMat);
    this.sourceWell.position.set(-2.2, -wellHeight / 2, 0);
    this.sourceWell.castShadow = true;
    this.sourceWell.receiveShadow = true;
    this.deviceGroup.add(this.sourceWell);

    this.drainWell = new THREE.Mesh(wellGeo, wellMat);
    this.drainWell.position.set(2.2, -wellHeight / 2, 0);
    this.drainWell.castShadow = true;
    this.drainWell.receiveShadow = true;
    this.deviceGroup.add(this.drainWell);

    // C. Gate Oxide (SiO2)
    const tox = 0.15;
    const oxWidth = 2.8;
    const oxGeo = new THREE.BoxGeometry(oxWidth, tox, wellDepth);
    const oxMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4
    });
    this.oxideMesh = new THREE.Mesh(oxGeo, oxMat);
    this.oxideMesh.position.set(0, tox / 2, 0);
    this.deviceGroup.add(this.oxideMesh);

    // D. Metal Gate
    const gateHeight = 0.6;
    const gateGeo = new THREE.BoxGeometry(oxWidth, gateHeight, wellDepth);
    const gateMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x78350f,
      emissiveIntensity: 0.2
    });
    this.gateMesh = new THREE.Mesh(gateGeo, gateMat);
    this.gateMesh.position.set(0, tox + gateHeight / 2, 0);
    this.gateMesh.castShadow = true;
    this.deviceGroup.add(this.gateMesh);

    // E. Metal Contact Leads
    const contactMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1 });
    const sPad = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.1, 2.5), contactMat);
    sPad.position.set(-2.2, 0.05, 0);
    this.deviceGroup.add(sPad);

    const dPad = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.1, 2.5), contactMat);
    dPad.position.set(2.2, 0.05, 0);
    this.deviceGroup.add(dPad);

    const gPad = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 1.8), contactMat);
    gPad.position.set(0, tox + gateHeight + 0.06, 0);
    this.deviceGroup.add(gPad);

    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16);
    const sPost = new THREE.Mesh(postGeo, contactMat);
    sPost.position.set(-2.2, 0.65, 0);
    this.deviceGroup.add(sPost);

    const dPost = new THREE.Mesh(postGeo, contactMat);
    dPost.position.set(2.2, 0.65, 0);
    this.deviceGroup.add(dPost);

    const gPost = new THREE.Mesh(postGeo, contactMat);
    gPost.position.set(0, tox + gateHeight + 0.65, 0);
    this.deviceGroup.add(gPost);

    // F. Coordinate Grid
    const grid = new THREE.GridHelper(16, 16, 0x1e293b, 0x0f172a);
    grid.position.y = -subHeight - 0.05;
    this.scene.add(grid);

    this.scene.add(this.deviceGroup);
    this.updateChannelMesh();
  }

  buildFieldArrows() {
    if (this.fieldArrowsGroup) {
      this.scene.remove(this.fieldArrowsGroup);
    }
    this.fieldArrowsGroup = new THREE.Group();

    // Vertical Electric Field Lines (Gate to Substrate)
    for (let x = -1.0; x <= 1.0; x += 0.5) {
      for (let z = -1.2; z <= 1.2; z += 0.8) {
        const dir = new THREE.Vector3(0, -1, 0);
        const origin = new THREE.Vector3(x, 0.5, z);
        const arrow = new THREE.ArrowHelper(dir, origin, 0.6, 0xf59e0b, 0.12, 0.08);
        this.fieldArrowsGroup.add(arrow);
      }
    }

    // Lateral Field Lines (Drain to Source)
    for (let z = -1.0; z <= 1.0; z += 1.0) {
      const dirLat = new THREE.Vector3(-1, 0, 0);
      const originLat = new THREE.Vector3(1.2, -0.05, z);
      const arrowLat = new THREE.ArrowHelper(dirLat, originLat, 2.4, 0x38bdf8, 0.16, 0.1);
      this.fieldArrowsGroup.add(arrowLat);
    }

    this.fieldArrowsGroup.visible = this.params.showFields;
    this.scene.add(this.fieldArrowsGroup);
  }

  updateChannelMesh() {
    if (this.channelMesh) {
      this.deviceGroup.remove(this.channelMesh);
      this.channelMesh.geometry.dispose();
      this.channelMesh = null;
    }

    if (!this.params.showChannel) return;

    const { vgs, vds, vth, lambda, deviceType } = this.params;
    const vov = vgs - vth;

    if (vov <= 0) return;

    const isNMOS = deviceType === 'nmos';
    const channelL = 2.8;
    const channelW = 3.6;
    const xStart = -1.4;
    const xEnd = 1.4;

    let pinchX = xEnd;
    let isPinched = false;

    if (vds >= vov) {
      isPinched = true;
      const deltaL = Math.min(channelL * 0.45, lambda * (vds - vov) * 0.8);
      pinchX = xEnd - deltaL;
    }

    const segmentsX = 30;
    const segmentsZ = 12;
    const geom = new THREE.PlaneGeometry(channelL, channelW, segmentsX, segmentsZ);
    geom.rotateX(Math.PI / 2);

    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      let depth = 0;
      if (x <= pinchX) {
        const fractionToPinch = (x - xStart) / (pinchX - xStart);
        const vChannel = isPinched ? vov * fractionToPinch : vds * fractionToPinch;
        const localVov = Math.max(0, vov - vChannel);
        depth = 0.05 + 0.22 * (localVov / 2.5);
      } else {
        depth = 0.01;
      }
      pos.setY(i, -depth);
    }
    geom.computeVertexNormals();

    const channelColor = isNMOS ? 0x38bdf8 : 0xa855f7;
    const emissiveColor = isNMOS ? 0x0284c7 : 0x7e22ce;

    const channelMat = new THREE.MeshStandardMaterial({
      color: channelColor,
      emissive: emissiveColor,
      emissiveIntensity: isPinched ? 0.95 : 0.6,
      roughness: 0.2,
      metalness: 0.5,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });

    this.channelMesh = new THREE.Mesh(geom, channelMat);
    this.channelMesh.position.set(0, 0, 0);
    this.deviceGroup.add(this.channelMesh);
  }

  initCarriers() {
    if (this.electronsGroup) {
      this.deviceGroup.remove(this.electronsGroup);
    }

    this.carrierCount = 80;
    const isNMOS = this.params.deviceType === 'nmos';
    const sphereGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const carrierMat = new THREE.MeshBasicMaterial({
      color: isNMOS ? 0xe0f2fe : 0xfef08a
    });

    this.electronsGroup = new THREE.Group();
    this.electrons = [];

    for (let i = 0; i < this.carrierCount; i++) {
      const mesh = new THREE.Mesh(sphereGeo, carrierMat);
      const carrier = {
        mesh: mesh,
        x: -2.0 + Math.random() * 0.8,
        y: -0.15 - Math.random() * 0.2,
        z: (Math.random() - 0.5) * 3.0,
        vx: 0,
        phase: Math.random() * Math.PI * 2
      };
      mesh.position.set(carrier.x, carrier.y, carrier.z);
      this.electronsGroup.add(mesh);
      this.electrons.push(carrier);
    }

    this.electronsGroup.visible = this.params.showCarriers;
    this.deviceGroup.add(this.electronsGroup);
  }

  updateCarriers(dt) {
    if (!this.params.showCarriers) return;

    const { vgs, vds, vth, lambda } = this.params;
    const vov = vgs - vth;

    let Id = 0;
    if (vov > 0) {
      if (vds < vov) {
        Id = (vov * vds - 0.5 * vds * vds);
      } else {
        Id = 0.5 * vov * vov * (1 + lambda * (vds - vov));
      }
    }

    const driftSpeed = Math.min(4.5, Id * 2.2);

    this.electrons.forEach(c => {
      if (vov <= 0) {
        c.x += (Math.random() - 0.5) * 0.02;
        c.z += (Math.random() - 0.5) * 0.02;
        c.mesh.position.set(c.x, c.y, c.z);
        return;
      }

      c.x += (driftSpeed + 0.2) * dt;
      if (c.x >= -1.4 && c.x <= 1.4) {
        c.y = -0.06 - Math.sin(c.phase) * 0.04;
      } else {
        c.y = -0.2 - Math.sin(c.phase) * 0.1;
      }

      if (c.x > 2.6) {
        c.x = -2.6 + Math.random() * 0.4;
        c.z = (Math.random() - 0.5) * 3.2;
      }

      c.mesh.position.set(c.x, c.y, c.z);
    });
  }

  setVoltages(vgs, vds) {
    this.params.vgs = parseFloat(vgs);
    this.params.vds = parseFloat(vds);
    this.updateChannelMesh();
  }

  setDeviceType(type) {
    this.params.deviceType = type;
    this.buildDevice();
    this.initCarriers();
    this.buildFieldArrows();
  }

  toggleLayer(layer, isVisible) {
    if (layer === 'channel') {
      this.params.showChannel = isVisible;
      this.updateChannelMesh();
    } else if (layer === 'carriers') {
      this.params.showCarriers = isVisible;
      if (this.electronsGroup) this.electronsGroup.visible = isVisible;
    } else if (layer === 'fields') {
      this.params.showFields = isVisible;
      if (this.fieldArrowsGroup) this.fieldArrowsGroup.visible = isVisible;
    }
  }

  setCameraView(mode) {
    if (!this.camera || !this.controls) return;
    if (mode === 'iso') {
      this.camera.position.set(9, 7, 11);
      this.controls.target.set(0, 0, 0);
    } else if (mode === 'top') {
      this.camera.position.set(0, 14, 0.1);
      this.controls.target.set(0, 0, 0);
    } else if (mode === 'side') {
      this.camera.position.set(0, 0.2, 12);
      this.controls.target.set(0, 0, 0);
    } else if (mode === 'cutaway') {
      this.camera.position.set(4, 2.5, 7);
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
    this.updateCarriers(dt);

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

window.MOSFET3DChamber = MOSFET3DChamber;
