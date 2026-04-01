(function() {
  const container = document.getElementById('particles-js');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const PARTICLE_COUNT = 24;

  function resize() {
    width = container.offsetWidth;
    height = container.offsetHeight;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor(isRespawn = false) {
      this.init(isRespawn);
    }

    init(fromBottom) {
      this.x = Math.random() * width;
      this.y = fromBottom ? height + 10 : Math.random() * height;
      this.opacity = 0.08 + Math.random() * 0.44;
      this.radius = Math.random() * 5 + 1;
      this.vy = -(Math.random() * 1.5 + 0.5);
      this.vx = (Math.random() - 0.5) * 0.5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -this.radius) this.x = width + this.radius;
      if (this.x > width + this.radius) this.x = -this.radius;

      if (this.y < -this.radius) {
        this.init(true);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(234, 247, 135, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();
})();
