/* =========================================================
   ANIT USTASI — Parçacık efektleri (toz bulutu, kutlama)
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});

  AU.setupEffects = function (ctx) {
    const { THREE, scene, state } = ctx;
    const V3 = THREE.Vector3;
    const GRAVITY = 4;

    function burst(pos, color, count, speed, life, up) {
      const geo = new THREE.BufferGeometry();
      const arr = new Float32Array(count * 3);
      const vel = [];
      for (let i = 0; i < count; i++) {
        arr.set([pos.x, pos.y, pos.z], i * 3);
        const a = Math.random() * Math.PI * 2;
        const s = speed * (0.4 + Math.random() * 0.6);
        vel.push(new V3(Math.cos(a) * s, (up || 0.3) * speed * Math.random(), Math.sin(a) * s));
      }
      geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
      const mat = new THREE.PointsMaterial({ color, size: 0.14, transparent: true, opacity: 1, depthWrite: false });
      const obj = new THREE.Points(geo, mat);
      scene.add(obj);
      state.particles.push({ obj, vel, life, age: 0 });
    }

    function celebrate() {
      const lvl = state.index;
      const h = state.slots.reduce((m, s) => Math.max(m, s.box.max.y), 0);
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          if (state.index !== lvl) return;
          const a = Math.random() * Math.PI * 2;
          burst(new V3(Math.cos(a) * 1.5, h * (0.4 + Math.random() * 0.6), Math.sin(a) * 1.5),
            i % 2 ? '#ffd257' : '#fff1c0', 60, 4, 1.8, 1.2);
        }, i * 220);
      }
    }

    function removeParticle(P) {
      scene.remove(P.obj);
      P.obj.geometry.dispose();
      P.obj.material.dispose();
    }

    function update(dt) {
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const P = state.particles[i];
        P.age += dt;
        const pos = P.obj.geometry.attributes.position;
        for (let j = 0; j < P.vel.length; j++) {
          P.vel[j].y -= GRAVITY * dt;
          pos.setXYZ(j, pos.getX(j) + P.vel[j].x * dt, Math.max(0, pos.getY(j) + P.vel[j].y * dt), pos.getZ(j) + P.vel[j].z * dt);
        }
        pos.needsUpdate = true;
        P.obj.material.opacity = Math.max(0, 1 - P.age / P.life);
        if (P.age >= P.life) {
          removeParticle(P);
          state.particles.splice(i, 1);
        }
      }
    }

    function clear() {
      state.particles.forEach(removeParticle);
      state.particles = [];
    }

    ctx.fx = { burst, celebrate, update, clear };
  };
})();
