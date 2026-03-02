const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const maxParticles = 200;
const mouse = { x: innerWidth / 2, y: innerHeight / 2, down: false };

function resizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
  spawnParticles(3); // more value = more particles
});

canvas.addEventListener('mousedown', () => {
  mouse.down = true;
});

canvas.addEventListener('mouseup', () => {
  mouse.down = false;
});

function spawnParticles(count) {
  for (let i = 0; i < count; i++) {
    if (particles.length >= maxParticles) break;
    particles.push({
      x: mouse.x,
      y: mouse.y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      life: 1,
      color: hsl(${Math.random() * 360}, 80%, 60%)
    });
  }
}

function updateParticles() {
  particles.forEach(p => {
    // slight attraction to mouse
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const dist = Math.hypot(dx, dy) || 1;
    const force = mouse.down ? 0.08 : 0.02;

    p.vx += (dx / dist) * force;
    p.vy += (dy / dist) * force;

    // friction
    p.vx *= 0.97;
    p.vy *= 0.97;

    p.x += p.vx;
    p.y += p.vy;

    p.life -= 0.01;
  });

  particles = particles.filter(p => p.life > 0);
}

function drawParticles() {
  // fade the previous frame a bit for a trail effect
  ctx.fillStyle = 'rgba(5, 6, 10, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1;

  // draw lines between close particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      const maxDist = 120;

      if (dist < maxDist) {
        const alpha = 1 - dist / maxDist;
        ctx.strokeStyle = rgba(255,255,255,${alpha * 0.5});
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        document.addEventListener("touchmove", function(e) {
    let touch = e.touches[0];
    mouseX = touch.clientX;
    mouseY = touch.clientY;
});
      }
    }
  }
}

function loop() {
  updateParticles();
  drawParticles();
  requestAnimationFrame(loop);
}


loop();
