(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const trails = (window.TRAILS || []).slice().sort((a, b) => a.id - b.id);

  const intro = $('#intro');
  const video = $('#introVideo');
  const mainSite = $('#mainSite');
  const soundBtn = $('#soundBtn');
  const skipBtn = $('#skipBtn');
  const replayBtn = $('#replayBtn');
  const playFallback = $('#playFallback');
  const playBtn = $('#playBtn');
  const enterDirectBtn = $('#enterDirectBtn');

  const pinLayer = $('#pinLayer');
  const trailList = $('#trailList');
  const trailPanel = $('#trailPanel');
  const listToggleBtn = $('#listToggleBtn');
  const closePanelBtn = $('#closePanelBtn');
  const searchInput = $('#trailSearch');
  const clearSearchBtn = $('#clearSearchBtn');
  const searchHint = $('#searchHint');

  const dialog = $('#trailDialog');
  const dialogCloseBtn = $('#dialogCloseBtn');
  const dialogNumber = $('#dialogNumber');
  const dialogTitle = $('#dialogTitle');
  const dialogDescription = $('#dialogDescription');
  const dialogStatus = $('#dialogStatus');
  const dialogLink = $('#dialogLink');

  const mapCanvas = $('#mapCanvas');
  const mapViewport = $('#mapViewport');
  const zoomLabel = $('#zoomLabel');
  const zoomInBtn = $('#zoomInBtn');
  const zoomOutBtn = $('#zoomOutBtn');
  const zoomResetBtn = $('#zoomResetBtn');

  let lastFocused = null;
  let zoom = window.innerWidth <= 680 ? 1.65 : window.innerWidth <= 980 ? 1.25 : 1;

  function showMain() {
    intro.hidden = true;
    intro.style.display = 'none';
    mainSite.hidden = false;
    document.body.style.overflow = '';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function showIntro() {
    mainSite.hidden = true;
    intro.hidden = false;
    intro.style.display = 'block';
    document.body.style.overflow = 'hidden';
    playFallback.hidden = true;
    video.currentTime = 0;
    video.muted = true;
    soundBtn.textContent = '🔇 開啟聲音';
    soundBtn.setAttribute('aria-pressed', 'false');
    const promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => { playFallback.hidden = false; });
    }
  }

  function initIntro() {
    document.body.style.overflow = 'hidden';
    video.addEventListener('ended', showMain);
    video.addEventListener('error', () => { playFallback.hidden = false; });

    soundBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      soundBtn.textContent = video.muted ? '🔇 開啟聲音' : '🔊 關閉聲音';
      soundBtn.setAttribute('aria-pressed', String(!video.muted));
      if (video.paused) video.play().catch(() => {});
    });

    skipBtn.addEventListener('click', showMain);
    replayBtn.addEventListener('click', showIntro);
    playBtn.addEventListener('click', () => {
      playFallback.hidden = true;
      video.muted = false;
      soundBtn.textContent = '🔊 關閉聲音';
      soundBtn.setAttribute('aria-pressed', 'true');
      video.play().catch(() => { playFallback.hidden = false; });
    });
    enterDirectBtn.addEventListener('click', showMain);
  }

  function formatNum(id) { return String(id).padStart(2, '0'); }

  function createPin(trail) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'trail-pin';
    btn.style.left = `${trail.x}%`;
    btn.style.top = `${trail.y}%`;
    btn.dataset.id = trail.id;
    btn.dataset.title = `${formatNum(trail.id)}｜${trail.name}`;
    btn.setAttribute('aria-label', `${formatNum(trail.id)} ${trail.name}`);
    btn.innerHTML = `<span>${formatNum(trail.id)}</span>`;
    btn.addEventListener('click', () => openTrail(trail.id));
    return btn;
  }

  function createListItem(trail) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'trail-item';
    btn.dataset.id = trail.id;
    btn.setAttribute('aria-label', `查看 ${formatNum(trail.id)} ${trail.name}`);
    btn.innerHTML = `
      <span class="trail-item__num">${formatNum(trail.id)}</span>
      <span class="trail-item__name">${trail.name}</span>
      <span class="trail-item__state ${trail.url ? 'is-live' : ''}">${trail.url ? '已上線' : '建置中'}</span>
    `;
    btn.addEventListener('click', () => {
      focusPin(trail.id);
      openTrail(trail.id);
      if (window.innerWidth <= 980) setPanel(false);
    });
    return btn;
  }

  function renderTrails() {
    pinLayer.innerHTML = '';
    trailList.innerHTML = '';
    trails.forEach((trail) => {
      pinLayer.appendChild(createPin(trail));
      trailList.appendChild(createListItem(trail));
    });
  }

  function openTrail(id) {
    const trail = trails.find(t => t.id === Number(id));
    if (!trail) return;
    lastFocused = document.activeElement;
    dialogNumber.textContent = formatNum(trail.id);
    dialogTitle.textContent = trail.name;
    dialogDescription.textContent = trail.description || '學習步道介紹內容建置中。';

    if (trail.url) {
      dialogStatus.textContent = '✓ 學習內容已上線';
      dialogStatus.classList.add('is-live');
      dialogLink.href = trail.url;
      dialogLink.hidden = false;
    } else {
      dialogStatus.textContent = '🚧 學習內容建置中';
      dialogStatus.classList.remove('is-live');
      dialogLink.hidden = true;
      dialogLink.removeAttribute('href');
    }

    dialog.hidden = false;
    document.body.style.overflow = 'hidden';
    dialogCloseBtn.focus();
  }

  function closeDialog() {
    dialog.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function initDialog() {
    dialogCloseBtn.addEventListener('click', closeDialog);
    $$('[data-close-dialog]').forEach(el => el.addEventListener('click', closeDialog));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !dialog.hidden) closeDialog();
    });
  }

  function setPanel(open) {
    trailPanel.classList.toggle('is-open', open);
    listToggleBtn.setAttribute('aria-expanded', String(open));
  }

  function initPanel() {
    listToggleBtn.addEventListener('click', () => setPanel(!trailPanel.classList.contains('is-open')));
    closePanelBtn.addEventListener('click', () => setPanel(false));
  }

  function normalize(text) {
    return String(text || '').toLowerCase().replace(/\s+/g, '');
  }

  function searchTrails() {
    const raw = searchInput.value.trim();
    const q = normalize(raw);
    const numberQuery = /^\d+$/.test(raw) ? Number(raw) : null;
    const matches = trails.filter(t => !q || normalize(t.name).includes(q) || (numberQuery !== null && t.id === numberQuery));
    const matchIds = new Set(matches.map(t => t.id));

    $$('.trail-pin').forEach(pin => {
      const id = Number(pin.dataset.id);
      pin.classList.toggle('is-dimmed', !!q && !matchIds.has(id));
      pin.classList.toggle('is-match', !!q && matchIds.has(id));
    });
    $$('.trail-item').forEach(item => {
      const id = Number(item.dataset.id);
      item.hidden = !!q && !matchIds.has(id);
      item.classList.toggle('is-match', !!q && matchIds.has(id));
    });

    if (!q) searchHint.textContent = '';
    else if (matches.length === 0) searchHint.textContent = '找不到符合的學道，請換一個關鍵字。';
    else if (matches.length === 1) {
      searchHint.textContent = `找到：${formatNum(matches[0].id)} ${matches[0].name}`;
      focusPin(matches[0].id, false);
    } else searchHint.textContent = `找到 ${matches.length} 個學道。`;
  }

  function focusPin(id, center = true) {
    const pin = pinLayer.querySelector(`.trail-pin[data-id="${id}"]`);
    if (!pin) return;
    if (center) {
      const pinRect = pin.getBoundingClientRect();
      const viewRect = mapViewport.getBoundingClientRect();
      const left = mapViewport.scrollLeft + (pinRect.left - viewRect.left) - (viewRect.width / 2) + (pinRect.width / 2);
      const top = mapViewport.scrollTop + (pinRect.top - viewRect.top) - (viewRect.height / 2) + (pinRect.height / 2);
      mapViewport.scrollTo({ left, top, behavior: 'smooth' });
    }
    pin.focus({ preventScroll: true });
  }

  function initSearch() {
    searchInput.addEventListener('input', searchTrails);
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchTrails();
      searchInput.focus();
    });
  }

  function applyZoom() {
    zoom = Math.min(2.4, Math.max(0.85, zoom));
    mapCanvas.style.width = `${zoom * 100}%`;
    zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
  }

  function initZoom() {
    applyZoom();
    zoomInBtn.addEventListener('click', () => { zoom += .15; applyZoom(); });
    zoomOutBtn.addEventListener('click', () => { zoom -= .15; applyZoom(); });
    zoomResetBtn.addEventListener('click', () => {
      zoom = window.innerWidth <= 680 ? 1.65 : window.innerWidth <= 980 ? 1.25 : 1;
      applyZoom();
      mapViewport.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    });
  }

  // 地圖可左右捲動，但垂直滾輪應控制整個網頁。
  // 這可避免游標停在地圖上時，頁面看起來像被「卡住」。
  function initPageScrollPassThrough() {
    mapViewport.addEventListener('wheel', (event) => {
      if (event.ctrlKey || event.shiftKey) return;
      const mostlyVertical = Math.abs(event.deltaY) >= Math.abs(event.deltaX);
      if (!mostlyVertical || event.deltaY === 0) return;

      event.preventDefault();
      window.scrollBy({ top: event.deltaY, left: 0, behavior: 'auto' });
    }, { passive: false });
  }

  renderTrails();
  initIntro();
  initDialog();
  initPanel();
  initSearch();
  initZoom();
  initPageScrollPassThrough();

  // If autoplay is blocked, display an explicit start control.
  const attempt = video.play();
  if (attempt && typeof attempt.catch === 'function') {
    attempt.catch(() => { playFallback.hidden = false; });
  }
})();
