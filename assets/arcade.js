/**
 * GARDEN SNAKE — el cartucho de la página 404.
 *
 * Canvas puro, sin dependencias. Teclado (flechas o WASD), cruceta en
 * pantalla y deslizar el dedo. La partida se pausa sola si cambias de
 * pestaña, y la puntuación máxima se guarda en el navegador.
 */
(function () {
  'use strict';

  const canvas = document.getElementById('screen');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const CELLS = 16;                 // rejilla 16 x 16
  const SIZE = canvas.width / CELLS; // 20 px por celda

  const COL = {
    bg: '#0e1a12',
    grid: 'rgba(120, 220, 150, 0.055)',
    snake: '#7ee787',
    head: '#b7f7c0',
    food: '#f2a65a',
    text: '#7ee787'
  };

  const HISCORE_KEY = 'snake-hiscore';
  const sfx = name => { if (window.Sfx) window.Sfx.play(name); };

  let snake, dir, nextDir, food, score, hiscore, state, tickMs, acc, last, raf;

  try { hiscore = parseInt(localStorage.getItem(HISCORE_KEY), 10) || 0; }
  catch (e) { hiscore = 0; }

  function reset() {
    snake = [{ x: 7, y: 8 }, { x: 6, y: 8 }, { x: 5, y: 8 }];
    dir = { x: 1, y: 0 };
    nextDir = dir;
    score = 0;
    tickMs = 130;
    acc = 0;
    placeFood();
  }

  function placeFood() {
    /* Se sortea entre las celdas libres para no caer nunca sobre la serpiente */
    const free = [];
    for (let y = 0; y < CELLS; y++) {
      for (let x = 0; x < CELLS; x++) {
        if (!snake.some(s => s.x === x && s.y === y)) free.push({ x: x, y: y });
      }
    }
    food = free.length ? free[Math.floor(Math.random() * free.length)] : null;
  }

  function step() {
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    const hitWall = head.x < 0 || head.y < 0 || head.x >= CELLS || head.y >= CELLS;
    const hitSelf = snake.some(s => s.x === head.x && s.y === head.y);

    if (hitWall || hitSelf) {
      state = 'over';
      sfx('over');
      if (score > hiscore) {
        hiscore = score;
        try { localStorage.setItem(HISCORE_KEY, String(hiscore)); } catch (e) { /* nada */ }
      }
      return;
    }

    snake.unshift(head);

    if (food && head.x === food.x && head.y === food.y) {
      score += 10;
      sfx('pickup');
      /* Acelera poco a poco, con un suelo para que siga siendo jugable */
      tickMs = Math.max(70, tickMs - 4);
      placeFood();
    } else {
      snake.pop();
    }
  }

  function draw() {
    ctx.fillStyle = COL.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = COL.grid;
    ctx.lineWidth = 1;
    for (let i = 1; i < CELLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * SIZE, 0); ctx.lineTo(i * SIZE, canvas.height);
      ctx.moveTo(0, i * SIZE); ctx.lineTo(canvas.width, i * SIZE);
      ctx.stroke();
    }

    if (food) {
      ctx.fillStyle = COL.food;
      ctx.fillRect(food.x * SIZE + 5, food.y * SIZE + 5, SIZE - 10, SIZE - 10);
    }

    snake.forEach(function (s, i) {
      ctx.fillStyle = i === 0 ? COL.head : COL.snake;
      ctx.fillRect(s.x * SIZE + 2, s.y * SIZE + 2, SIZE - 4, SIZE - 4);
    });

    ctx.fillStyle = COL.text;
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';
    ctx.fillText('SCORE ' + String(score).padStart(4, '0'), 8, 7);
    const hi = 'HI ' + String(hiscore).padStart(4, '0');
    ctx.fillText(hi, canvas.width - 8 - ctx.measureText(hi).width, 7);

    if (state !== 'playing') overlay();
  }

  function overlay() {
    ctx.fillStyle = 'rgba(6, 14, 9, 0.82)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = COL.text;
    ctx.textAlign = 'center';

    const title = state === 'over' ? 'GAME OVER' : 'GARDEN SNAKE';
    ctx.font = '18px "Geist Pixel", "JetBrains Mono", monospace';
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 34);

    ctx.font = '10px "JetBrains Mono", monospace';
    if (state === 'over') {
      ctx.fillText('SCORE ' + score, canvas.width / 2, canvas.height / 2 - 4);
    }
    ctx.fillText(canvas.dataset.hint || 'PULSA START', canvas.width / 2, canvas.height / 2 + 20);

    ctx.textAlign = 'left';
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (state !== 'playing') { draw(); return; }

    const delta = now - (last || now);
    last = now;
    acc += delta;

    /* Paso fijo: la velocidad no depende de los fps del equipo */
    while (acc >= tickMs) {
      acc -= tickMs;
      step();
      if (state !== 'playing') break;
    }
    draw();
  }

  function turn(x, y) {
    /* No se puede girar 180 grados sobre uno mismo */
    if (dir.x === -x && dir.y === -y) return;
    if (nextDir.x === x && nextDir.y === y) return;
    nextDir = { x: x, y: y };
    sfx('nav');
  }

  function action() {
    if (state === 'playing') return;
    reset();
    state = 'playing';
    last = 0;
    sfx('select');
  }

  /* ── Teclado ───────────────────────────────────────────────── */
  const KEYS = {
    ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
    ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
    ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
    ArrowRight: [1, 0], d: [1, 0], D: [1, 0]
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      /* Sin robarle la tecla a un botón o enlace enfocado */
      const tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'BUTTON' || tag === 'A') return;
      e.preventDefault();
      action();
      return;
    }
    const move = KEYS[e.key];
    if (!move) return;
    e.preventDefault();
    if (state !== 'playing') action();
    turn(move[0], move[1]);
  });

  /* ── Cruceta en pantalla ───────────────────────────────────── */
  document.querySelectorAll('[data-dir]').forEach(function (btn) {
    const [x, y] = btn.dataset.dir.split(',').map(Number);
    btn.addEventListener('click', function () {
      if (state !== 'playing') action();
      turn(x, y);
    });
  });

  const startBtn = document.getElementById('arcade-action');
  if (startBtn) startBtn.addEventListener('click', action);

  /* ── Deslizar el dedo sobre la pantalla ────────────────────── */
  let touchStart = null;
  canvas.addEventListener('touchstart', function (e) {
    const t = e.changedTouches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  }, { passive: true });

  canvas.addEventListener('touchend', function (e) {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    touchStart = null;

    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) { action(); return; }
    if (state !== 'playing') action();

    if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 1 : -1, 0);
    else turn(0, dy > 0 ? 1 : -1);
  }, { passive: true });

  /* Al volver de otra pestaña, el reloj no debe haber "avanzado" la partida */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && state === 'playing') state = 'paused';
    else if (!document.hidden && state === 'paused') { last = 0; state = 'playing'; }
  });

  reset();
  state = 'ready';
  raf = requestAnimationFrame(loop);
})();
