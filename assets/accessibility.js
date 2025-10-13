// Общие контролы доступности: размер шрифта, межстрочность, межбуквенный интервал,
// темы (light/dark/high-contrast), выбор шрифта, TTS и сохранение в localStorage
(function() {
  const root = document.documentElement;

  const state = {
    fs: parseFloat(getComputedStyle(root).getPropertyValue('--fs')) || 18,
    lh: parseFloat(getComputedStyle(root).getPropertyValue('--lh')) || 1.6,
    ls: parseFloat(getComputedStyle(root).getPropertyValue('--ls')) || 0,
    theme: localStorage.getItem('theme') || 'light',
    font: localStorage.getItem('font') || 'inter',
  };

  const apply = () => {
    root.style.setProperty('--fs', state.fs + 'px');
    root.style.setProperty('--lh', String(state.lh));
    root.style.setProperty('--ls', state.ls + 'px');
    root.setAttribute('data-theme', state.theme);
    root.setAttribute('data-font', state.font);
    localStorage.setItem('theme', state.theme);
    localStorage.setItem('font', state.font);
    localStorage.setItem('fs', String(state.fs));
    localStorage.setItem('lh', String(state.lh));
    localStorage.setItem('ls', String(state.ls));
  };

  // Восстановление размеров из localStorage, если есть
  const savedFs = parseFloat(localStorage.getItem('fs')); if (!isNaN(savedFs)) state.fs = savedFs;
  const savedLh = parseFloat(localStorage.getItem('lh')); if (!isNaN(savedLh)) state.lh = savedLh;
  const savedLs = parseFloat(localStorage.getItem('ls')); if (!isNaN(savedLs)) state.ls = savedLs;
  apply();

  const $ = sel => document.querySelector(sel);

  // Привязка кнопок (если они есть на странице)
  const bind = (sel, fn) => { const el = $(sel); if (el) el.addEventListener('click', fn); };

  bind('#fs-plus', () => { state.fs = Math.min(state.fs + 2, 36); apply(); });
  bind('#fs-minus', () => { state.fs = Math.max(state.fs - 2, 12); apply(); });
  bind('#fs-reset', () => { state.fs = 18; state.lh = 1.6; state.ls = 0; apply(); });

  bind('#lh-plus', () => { state.lh = Math.min(state.lh + 0.1, 2.5); apply(); });
  bind('#lh-minus', () => { state.lh = Math.max(state.lh - 0.1, 1.0); apply(); });

  bind('#ls-plus', () => { state.ls = Math.min(state.ls + 0.2, 2); apply(); });
  bind('#ls-minus', () => { state.ls = Math.max(state.ls - 0.2, 0); apply(); });

  bind('#theme-light', () => { state.theme = 'light'; apply(); });
  bind('#theme-dark', () => { state.theme = 'dark'; apply(); });
  bind('#theme-hc', () => { state.theme = 'hc'; apply(); });

  bind('#font-inter', () => { state.font = 'inter'; apply(); });
  bind('#font-noto', () => { state.font = 'noto-serif'; apply(); });

  // Web Speech API — озвучивание выделенного текста
  bind('#tts', () => {
    try {
      const sel = window.getSelection().toString().trim();
      const text = sel || document.querySelector('[data-tts-target]')?.innerText || '';
      if (!text) return alert('Выделите текст для озвучивания или пометьте блок атрибутом data-tts-target.');
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ru-RU';
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch (e) { console.error(e); alert('Озвучивание не поддерживается в этом браузере.'); }
  });

  bind('#tts-stop', () => { try { speechSynthesis.cancel(); } catch(e){} });
})();
