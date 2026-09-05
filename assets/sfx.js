/**
 * Sonidos de interfaz estilo 8 bits, sintetizados con Web Audio.
 *
 * No hay archivos de audio: los tonos se generan en el navegador. Eso evita
 * descargar nada, evita usar sonidos con copyright (los de Zelda, Mario y
 * compañía lo tienen) y suena exactamente igual que un chip de los de antes,
 * porque es lo mismo que hacían: ondas cuadradas y triangulares.
 *
 * Está APAGADO por defecto. Sonido sin pedirlo es hostil, y además los
 * navegadores bloquean el audio hasta que el usuario interactúa.
 */
window.Sfx = (function () {
  'use strict';

  const STORAGE_KEY = 'sfx';
  let ctx = null;
  let enabled = false;

  /* Recetas: lista de tonos [frecuencia Hz, inicio s, duración s, onda] */
  const PATCHES = {
    /* Moverse por el menú: un tic corto y agudo */
    nav:     [[880, 0, 0.045, 'square']],
    /* Confirmar: dos tonos ascendentes, el clásico "select" */
    select:  [[660, 0, 0.055, 'square'], [988, 0.05, 0.075, 'square']],
    /* Volver o cerrar: los mismos, descendentes */
    back:    [[660, 0, 0.05, 'square'], [440, 0.045, 0.08, 'square']],
    /* Interruptor: un salto corto */
    toggle:  [[520, 0, 0.04, 'triangle'], [780, 0.038, 0.06, 'triangle']],
    /* Recompensa: arpegio de tres notas */
    pickup:  [[660, 0, 0.05, 'square'], [880, 0.05, 0.05, 'square'], [1320, 0.1, 0.09, 'square']],
    /* Fin de partida: caída larga */
    over:    [[440, 0, 0.12, 'square'], [330, 0.12, 0.14, 'square'], [220, 0.26, 0.28, 'square']]
  };

  function audio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    /* Tras un gesto del usuario el contexto puede seguir suspendido */
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function play(name) {
    if (!enabled) return;
    const patch = PATCHES[name];
    const ac = audio();
    if (!patch || !ac) return;

    patch.forEach(function (step) {
      const [freq, at, dur, type] = step;
      const t0 = ac.currentTime + at;

      const osc = ac.createOscillator();
      const gain = ac.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);

      /* Envolvente corta: ataque casi instantáneo y caída exponencial.
         Sin esto se oiría un chasquido al cortar la onda de golpe. */
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.07, t0 + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

      osc.connect(gain).connect(ac.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    });
  }

  function setEnabled(value, silent) {
    enabled = Boolean(value);
    try { localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off'); } catch (e) { /* modo privado */ }
    if (enabled && !silent) play('toggle');
  }

  function isEnabled() { return enabled; }

  /* Estado inicial: apagado salvo que se haya activado antes */
  try { enabled = localStorage.getItem(STORAGE_KEY) === 'on'; } catch (e) { enabled = false; }

  return { play: play, setEnabled: setEnabled, isEnabled: isEnabled };
})();
