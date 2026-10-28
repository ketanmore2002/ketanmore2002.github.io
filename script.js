// ---------- Publications (edit this list) ----------
const scholar = t => "https://scholar.google.com/scholar?q=" + encodeURIComponent(t);
const ME = "K. More";
const PUBS = [
  { year: 2026, venue: "LREC", title: "ARB: A Comprehensive Arabic Multimodal Reasoning Benchmark", authors: "S. Ghaboura, S. Patle, K. More, et al." },
  { year: 2025, venue: "ACL", title: "LlamaV-o1: Rethinking Step-by-step Visual Reasoning in LLMs", authors: "O. Thawakar, D. Dissanayake, K. More, R. Thawkar, A. Heakl, et al.", url: "https://arxiv.org/abs/2501.06186" },
  { year: 2025, venue: "IROS", title: "DriveLMM-o1: A Step-by-Step Reasoning Dataset and Large Multimodal Model for Driving Scenario Understanding", authors: "A. Ishaq, J. Lahoud, K. More, O. Thawakar, R. Thawkar, et al." },
  { year: 2025, venue: "arXiv", title: "How Good are Foundation Models in Step-by-Step Embodied Reasoning?", authors: "D. Dissanayake, A. Heakl, O. Thawakar, N. Ahsan, R. Thawkar, K. More, et al.", url: "https://arxiv.org/abs/2509.15293" },
  { year: 2025, venue: "CVPR", title: "All Languages Matter: Evaluating LMMs on Culturally Diverse 100 Languages", authors: "A. Vayani, D. Dissanayake, H. Watawana, …, K. More, et al." },
  { year: 2025, venue: "EMNLP", title: "A Culturally-Diverse Multilingual Multimodal Video Benchmark & Model", authors: "B. S. Shafique, A. Vayani, M. Maaz, …, K. More, et al." },
  { year: 2025, venue: "ACL", title: "Time Travel: A Comprehensive Benchmark to Evaluate LMMs on Historical and Cultural Artifacts", authors: "S. Ghaboura, K. More, O. Thawakar, et al." },
  { year: 2025, venue: "EMNLP", title: "Fann or Flop: A Multigenre, Multiera Benchmark for Arabic Poetry Understanding in LLMs", authors: "W. Al Ghallabi, R. Thawkar, S. Ghaboura, K. More, et al." },
];

const rows = document.getElementById("pubRows");
rows.innerHTML = PUBS.map(p => `
  <article class="publication-row fade" data-year="${p.year >= 2025 ? p.year : "earlier"}">
    <span class="pub-year">${p.year}</span>
    <span class="pub-venue">${p.venue}</span>
    <div>
      <h3><a href="${p.url || scholar(p.title)}" target="_blank" rel="noreferrer">${p.title}</a></h3>
      <p>${p.authors.replace(ME, `<b>${ME}</b>`)}</p>
    </div>
  </article>`).join("");

// Year filter with a soft fade
document.getElementById("filters").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  document.querySelectorAll("#filters button").forEach(x => x.classList.toggle("active", x === b));
  const f = b.dataset.filter;
  const all = [...rows.querySelectorAll(".publication-row")];
  all.forEach(r => r.classList.add("out"));
  setTimeout(() => {
    all.forEach(r => { r.hidden = !(f === "all" || r.dataset.year === f); });
    requestAnimationFrame(() => all.forEach(r => !r.hidden && r.classList.remove("out")));
  }, 220);
});

// Portrait: local photo → initials
const img = document.getElementById("portrait");
const fallbacks = [];
img.onerror = () => {
  const next = fallbacks.shift();
  if (next) img.src = next;
  else img.replaceWith(Object.assign(document.createElement("div"), { className: "ph", textContent: "KM" }));
};
if (img.complete && img.naturalWidth === 0) img.onerror();

// Mobile menu
const nav = document.getElementById("nav"), btn = document.getElementById("menuBtn");
btn.onclick = () => { const o = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", o); };
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

// Scroll progress + active nav
const bar = document.getElementById("progress");
const sections = [...document.querySelectorAll("main section[id]")];
const onScroll = () => {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%";
  let cur = "";
  sections.forEach(s => { if (scrollY >= s.offsetTop - 140) cur = s.id; });
  nav.querySelectorAll("a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
};
addEventListener("scroll", onScroll, { passive: true }); onScroll();

// Gentle staggered reveal
const io = new IntersectionObserver(entries => {
  entries.filter(e => e.isIntersecting).forEach((e, i) => {
    e.target.style.setProperty("--d", (i * 0.06) + "s");
    e.target.classList.add("in");
    io.unobserve(e.target);
  });
}, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".fade").forEach(el => io.observe(el));

// Count-up for facts
document.querySelectorAll("[data-count]").forEach(el => {
  const end = +el.dataset.count, suf = el.dataset.suffix || "", t0 = performance.now(), d = 1200;
  const tick = t => { const k = Math.min(1, (t - t0) / d); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
});

document.getElementById("year").textContent = new Date().getFullYear();
