
const trails = window.TRAILS || [];
const intro = document.getElementById("intro");
const app = document.getElementById("app");
const video = document.getElementById("introVideo");
const soundBtn = document.getElementById("soundBtn");
const skipBtn = document.getElementById("skipBtn");
const replayBtn = document.getElementById("replayBtn");
const markersEl = document.getElementById("markers");
const gridEl = document.getElementById("trailGrid");
const panel = document.getElementById("detailPanel");
const searchInput = document.getElementById("searchInput");
let selectedId = null;

function enterSite(){
  intro.classList.add("is-hidden");
  app.classList.remove("is-hidden");
  document.body.style.overflow = "";
}
function showIntro(){
  intro.classList.remove("is-hidden");
  app.classList.add("is-hidden");
  document.body.style.overflow = "hidden";
  video.currentTime = 0;
  video.muted = true;
  soundBtn.textContent = "🔇 開啟聲音";
  const p = video.play();
  if (p && p.catch) p.catch(()=>{});
}
video.addEventListener("ended", enterSite);
video.addEventListener("error", () => {
  setTimeout(enterSite, 1200);
});
skipBtn.addEventListener("click", enterSite);
soundBtn.addEventListener("click", () => {
  video.muted = !video.muted;
  soundBtn.textContent = video.muted ? "🔇 開啟聲音" : "🔊 關閉聲音";
});
replayBtn.addEventListener("click", showIntro);

function n2(n){ return String(n).padStart(2,"0"); }

function renderMarkers(){
  markersEl.innerHTML = "";
  trails.forEach(t => {
    const b = document.createElement("button");
    b.className = "marker";
    b.type = "button";
    b.textContent = n2(t.id);
    b.dataset.id = t.id;
    b.dataset.title = t.title;
    b.setAttribute("aria-label", `${n2(t.id)} ${t.title}`);
    b.style.left = `${t.x}%`;
    b.style.top = `${t.y}%`;
    b.addEventListener("click", () => selectTrail(t.id, true));
    markersEl.appendChild(b);
  });
}
function renderGrid(){
  gridEl.innerHTML = "";
  trails.forEach(t => {
    const b = document.createElement("button");
    b.className = "trail-card";
    b.type = "button";
    b.dataset.id = t.id;
    b.dataset.search = `${t.id} ${n2(t.id)} ${t.title}`.toLowerCase();
    b.innerHTML = `<span class="trail-no">${n2(t.id)}</span><span class="trail-name">${t.title}</span><span class="trail-arrow">›</span>`;
    b.addEventListener("click", () => selectTrail(t.id, true));
    gridEl.appendChild(b);
  });
}
function selectTrail(id, scrollPanel=false){
  const t = trails.find(x => x.id === id);
  if(!t) return;
  selectedId = id;
  document.querySelectorAll(".marker,.trail-card").forEach(el => {
    el.classList.toggle("active", Number(el.dataset.id) === id);
  });
  panel.innerHTML = `
    <span class="detail-number">${n2(t.id)}</span>
    <h2>${t.title}</h2>
    <p>${t.description}</p>
    <a class="primary-link" href="${t.url}" target="_blank" rel="noopener noreferrer">進入學習步道 →</a>
  `;
  if(scrollPanel && window.innerWidth <= 1100){
    panel.scrollIntoView({behavior:"smooth", block:"start"});
  }
}
function applySearch(){
  const q = searchInput.value.trim().toLowerCase();
  document.querySelectorAll(".trail-card").forEach(el => {
    el.classList.toggle("dim", q && !el.dataset.search.includes(q));
  });
  document.querySelectorAll(".marker").forEach(el => {
    const t = trails.find(x => x.id === Number(el.dataset.id));
    const hay = `${t.id} ${n2(t.id)} ${t.title}`.toLowerCase();
    el.classList.toggle("dim", q && !hay.includes(q));
  });
}
searchInput.addEventListener("input", applySearch);

renderMarkers();
renderGrid();
document.body.style.overflow = "hidden";

setTimeout(() => {
  if (video.readyState === 0) enterSite();
}, 2500);
