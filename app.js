/* تطبيق جامعة الموصل — المنطق الرئيسي */
(() => {
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const DAY = 86400000;
const CACHE_KEY = 'uom-cache-v1';
const THEME_KEY = 'uom-theme';
const CONCURRENCY = 6;
const TIMEOUT = 15000;

const ALL_UNITS = [HQ, ...UNITS];
const unitById = Object.fromEntries(ALL_UNITS.map(u => [u.id, u]));
const groupById = Object.fromEntries(GROUPS.map(g => [g.id, g]));
const typeById = Object.fromEntries([...TYPES, TYPE_OTHER].map(t => [t.id, t]));

const state = {
  items: [],          // {title, date(Date), link, img, unit, src:'hq'|'unit', type}
  source: 'snapshot', // live | cache | snapshot
  ref: new Date(),
  loading: false,
  week: 0, kind: 'all', unit: 'all', type: 'all', q: '', group: 'day', day: null,
};

/* ---------- أدوات ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const decoder = document.createElement('textarea');
const decode = html => { decoder.innerHTML = String(html || '').replace(/<[^>]*>/g, ''); return decoder.value.trim(); };
const norm = s => s.replace(/[إأآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[ًٌٍَُِّْـ]/g, '');
const startOfDay = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const dayKey = d => { const x = new Date(d); return `${x.getFullYear()}-${x.getMonth() + 1}-${x.getDate()}`; };
const fmtDay = new Intl.DateTimeFormat('ar-IQ', { weekday: 'long', day: 'numeric', month: 'long' });
const fmtShort = new Intl.DateTimeFormat('ar-IQ', { day: 'numeric', month: 'long' });
const fmtWd = new Intl.DateTimeFormat('ar-IQ', { weekday: 'short' });
const fmtNum = new Intl.NumberFormat('ar-IQ');
const fmtFull = new Intl.DateTimeFormat('ar-IQ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

function classify(title) {
  const t = norm(title);
  for (const ty of TYPES) if (ty.words.some(w => t.includes(norm(w)))) return ty.id;
  return 'other';
}
function matchUnit(title) {
  const t = norm(' ' + title + ' ');
  for (const u of UNITS) if (u.keys.some(k => t.includes(norm(k)))) return u.id;
  return 'uom';
}
function makeItem(raw) {
  const date = new Date(raw.date);
  return { ...raw, date, type: classify(raw.title) };
}

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ---------- جلب البيانات من موقع الجامعة ---------- */
async function fetchJSON(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT);
  try {
    const r = await fetch(url, { signal: ctl.signal, mode: 'cors', credentials: 'omit' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } finally { clearTimeout(timer); }
}

async function fetchUnit(unit, afterISO) {
  const url = unit.base + 'wp-json/wp/v2/posts?per_page=50&orderby=date&order=desc'
    + '&after=' + encodeURIComponent(afterISO)
    + '&_embed=wp:featuredmedia&_fields=id,date,link,title,_links,_embedded';
  const posts = await fetchJSON(url);
  if (!Array.isArray(posts)) throw new Error('bad payload');
  return posts.map(p => {
    const m = p._embedded && p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0];
    const sizes = m && m.media_details && m.media_details.sizes;
    const img = (sizes && (sizes.medium || sizes.thumbnail || {}).source_url) || (m && m.source_url) || '';
    const title = decode(p.title && p.title.rendered);
    const isHQ = unit.id === 'uom';
    return { title, date: p.date, link: p.link, img, unit: isHQ ? matchUnit(title) : unit.id, src: isHQ ? 'hq' : 'unit' };
  });
}

async function loadLive() {
  state.loading = true; setRefreshing(true);
  const after = new Date(Date.now() - 15 * DAY).toISOString();
  const queue = [...ALL_UNITS];
  let done = 0, ok = 0;
  const out = [];
  const prog = $('#p-progress');
  const tick = () => { prog.textContent = `جارٍ جلب النشاطات… ${fmtNum.format(done)} من ${fmtNum.format(ALL_UNITS.length)} جهة`; };
  tick();
  async function worker() {
    while (queue.length) {
      const u = queue.shift();
      try { out.push(...await fetchUnit(u, after)); ok++; } catch (e) { /* جهة غير متاحة */ }
      done++; tick();
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  prog.textContent = '';
  state.loading = false; setRefreshing(false);

  if (ok === 0) return false;
  const seen = new Set();
  const items = out.filter(i => i.link && !seen.has(i.link) && seen.add(i.link));
  state.items = items.map(makeItem);
  state.source = 'live'; state.ref = new Date();
  state.failed = ALL_UNITS.length - ok;
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), items })); } catch (e) {}
  return true;
}

function loadCache() {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (!c || !Array.isArray(c.items) || !c.items.length) return false;
    state.items = c.items.map(makeItem); state.source = 'cache'; state.ref = new Date(c.ts);
    return true;
  } catch (e) { return false; }
}

function loadSnapshot() {
  state.items = SNAPSHOT.map(s => makeItem({ ...s, src: s.unit === 'uom' ? 'hq' : 'unit', unit: s.unit === 'uom' ? matchUnit(s.title) : s.unit }));
  state.source = 'snapshot'; state.ref = new Date(SNAPSHOT_DATE);
}

async function refresh(user) {
  if (state.loading) return;
  const live = await loadLive();
  if (!live) {
    if (state.source === 'snapshot' && !loadCache()) loadSnapshot();
    if (user) toast('تعذّر الاتصال بموقع الجامعة. تُعرض آخر بيانات محفوظة.');
  } else if (user) toast('تم تحديث النشاطات');
  renderAll();
}

function setRefreshing(on) { $('#refresh').classList.toggle('spin', on); }

/* ---------- حسابات الأسابيع ---------- */
function weekRange(w) {
  const end = new Date(startOfDay(state.ref).getTime() + DAY - 7 * DAY * w);
  return { start: new Date(end.getTime() - 7 * DAY), end };
}
function inWeek(i, w) { const r = weekRange(w); return i.date >= r.start && i.date < r.end; }

/* ---------- العرض ---------- */
function itemHTML(i, showUnit = true) {
  const ty = typeById[i.type] || TYPE_OTHER;
  const u = unitById[i.unit] || HQ;
  const img = i.img ? `<img class="thumb" src="${esc(i.img)}" alt="" loading="lazy" onerror="this.remove();this.parentNode&&this.parentNode.classList.add('noimg')">` : '';
  return `<a class="item ${i.img ? '' : 'noimg'}" style="--tc:var(--t-${ty.id})" href="${esc(i.link)}" target="_blank" rel="noopener">
    <div>
      <h3>${esc(i.title)}</h3>
      <div class="meta"><span class="tag">${esc(ty.name)}</span>${showUnit ? `<span>${esc(u.name)}</span>` : ''}<span>${esc(fmtShort.format(i.date))}</span></div>
    </div>${img}</a>`;
}

function renderBanner() {
  const b = $('#banner');
  if (state.source === 'live') {
    if (state.failed > 4) { b.hidden = false; b.textContent = `تعذّر الوصول إلى ${fmtNum.format(state.failed)} من مواقع الكليات والمراكز، لذلك قد تنقص بعض النشاطات.`; }
    else b.hidden = true;
  } else if (state.source === 'cache') {
    b.hidden = false; b.textContent = `لا يوجد اتصال بموقع الجامعة. تُعرض بيانات محفوظة من ${fmtFull.format(state.ref)}.`;
  } else {
    b.hidden = false; b.textContent = `تُعرض نسخة محفوظة من ${fmtFull.format(state.ref)}. اضغط زر التحديث في الأعلى عند توفر الإنترنت.`;
  }
}

function renderHome() {
  const week = state.items.filter(i => inWeek(i, 0));
  const units = new Set(week.map(i => i.unit).filter(u => u !== 'uom'));
  $('#p-total').textContent = fmtNum.format(week.length);
  $('#p-units').textContent = fmtNum.format(units.size);
  $('#p-all').textContent = fmtNum.format(UNITS.length);

  const { start } = weekRange(0);
  const days = Array.from({ length: 7 }, (_, k) => new Date(start.getTime() + k * DAY));
  const counts = days.map(d => week.filter(i => dayKey(i.date) === dayKey(d)).length);
  const max = Math.max(1, ...counts);
  $('#p-days').innerHTML = days.map((d, k) => `
    <button class="day ${counts[k] ? '' : 'zero'}" data-day="${dayKey(d)}" aria-label="${esc(fmtDay.format(d))}: ${counts[k]}">
      <span class="n">${fmtNum.format(counts[k])}</span>
      <span class="bar-wrap"><span class="bar" style="height:${Math.max(6, Math.round(counts[k] / max * 100))}%"></span></span>
      <span class="d">${esc(fmtWd.format(d))}</span>
    </button>`).join('');

  const news = state.items.filter(i => i.src === 'hq').sort((a, b) => b.date - a.date).slice(0, 8);
  $('#news').innerHTML = news.length ? news.map(i => itemHTML(i, false)).join('')
    : `<div class="empty"><b>لا توجد أخبار لعرضها</b>اضغط زر التحديث في الأعلى عند توفر الإنترنت.</div>`;
}

function filtered() {
  const q = norm(state.q.trim());
  return state.items.filter(i =>
    inWeek(i, state.week)
    && (state.kind === 'hq' ? i.src === 'hq' : state.kind === 'all' ? i.unit !== 'uom' : true)
    && (state.unit === 'all' || i.unit === state.unit)
    && (state.day === null || dayKey(i.date) === state.day)
    && (!q || norm(i.title).includes(q))
  );
}

function renderActivities() {
  const base = filtered();
  // شرائح الأنواع مع العدد
  const counts = {};
  base.forEach(i => counts[i.type] = (counts[i.type] || 0) + 1);
  const chips = [{ id: 'all', name: 'الكل', n: base.length },
    ...[...TYPES, TYPE_OTHER].filter(t => counts[t.id]).map(t => ({ ...t, n: counts[t.id] }))];
  if (state.type !== 'all' && !counts[state.type]) state.type = 'all';
  $('#type-chips').innerHTML = chips.map(c =>
    `<button class="chip ${state.type === c.id ? 'on' : ''}" data-type="${c.id}">${esc(c.name)} ${fmtNum.format(c.n)}</button>`).join('');

  const list = base.filter(i => state.type === 'all' || i.type === state.type).sort((a, b) => b.date - a.date);
  const box = $('#acts');
  let head = '';
  if (state.day) { const [y, m, d] = state.day.split('-').map(Number); head = `<div class="banner">نشاطات يوم ${esc(fmtDay.format(new Date(y, m - 1, d)))} فقط. <button class="link-btn" data-clear-day>عرض الأسبوع كاملاً</button></div>`; }
  if (!list.length) {
    box.innerHTML = head + `<div class="empty"><b>لا توجد نشاطات مطابقة</b>جرّب أسبوعاً آخر أو أزل بعض عوامل التصفية.</div>`;
    return;
  }
  if (state.group === 'day') {
    const groups = new Map();
    list.forEach(i => { const k = dayKey(i.date); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(i); });
    box.innerHTML = head + [...groups.values()].map(g =>
      `<div class="day-label">${esc(fmtDay.format(g[0].date))} — ${fmtNum.format(g.length)}</div><div class="list">${g.map(i => itemHTML(i)).join('')}</div>`).join('');
  } else {
    const groups = new Map();
    list.forEach(i => { if (!groups.has(i.unit)) groups.set(i.unit, []); groups.get(i.unit).push(i); });
    box.innerHTML = head + [...groups.entries()].sort((a, b) => b[1].length - a[1].length).map(([u, g]) =>
      `<div class="day-label">${esc((unitById[u] || HQ).name)} — ${fmtNum.format(g.length)}</div><div class="list">${g.map(i => itemHTML(i, false)).join('')}</div>`).join('');
  }
}

function renderUnitPicker() {
  const sel = $('#unit-picker');
  sel.innerHTML = `<option value="all">كل الكليات والمراكز</option>` + GROUPS.map(g =>
    `<optgroup label="${esc(g.name)}">${UNITS.filter(u => u.group === g.id).map(u => `<option value="${u.id}">${esc(u.name)}</option>`).join('')}</optgroup>`).join('');
  sel.value = state.unit;
}

function renderUnits() {
  const q = norm($('#unit-search').value.trim());
  const week = state.items.filter(i => inWeek(i, 0));
  const count = id => week.filter(i => i.unit === id).length;
  const chev = `<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 6-6 6 6 6"/></svg>`;
  const html = GROUPS.map(g => {
    const us = UNITS.filter(u => u.group === g.id && (!q || norm(u.name).includes(q)));
    if (!us.length) return '';
    return `<h2>${esc(g.name)}</h2><div class="units">${us.map(u => {
      const n = count(u.id);
      return `<button class="unit" data-unit="${u.id}"><span class="nm">${esc(u.name)}</span><span class="ct ${n ? 'has' : ''}" title="نشاطات هذا الأسبوع">${fmtNum.format(n)}</span>${chev}</button>`;
    }).join('')}</div>`;
  }).join('');
  $('#unit-groups').innerHTML = html || `<div class="empty" style="margin-top:14px"><b>لا توجد جهة بهذا الاسم</b>تأكد من كتابة الاسم بشكل صحيح.</div>`;
}

const ICONS = {
  student: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/>',
  research: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  cv: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="9.5" r="2.5"/><path d="M8 17c.8-2 2.2-3 4-3s3.2 1 4 3"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/>',
  enroll: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M12 12v6M9 15h6"/>',
  cert: '<circle cx="12" cy="9" r="5"/><path d="m9 13.5-1.5 7.5 4.5-2.5 4.5 2.5-1.5-7.5"/>',
  inbox: '<path d="M3 13h5l1.5 3h5L16 13h5"/><path d="M5 5h14l2 8v6H3v-6z"/>',
  house: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
  car: '<path d="M5 16V11l2-5h10l2 5v5"/><path d="M3 16h18v3H3z"/><circle cx="7.5" cy="13" r=".8"/><circle cx="16.5" cy="13" r=".8"/>',
  gov: '<path d="M3 21h18M5 10v8M9.5 10v8M14.5 10v8M19 10v8M2 10h20L12 3z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>',
};
const svg = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[k] || ICONS.globe}</svg>`;

function renderServices() {
  $('#services').innerHTML = SERVICES.map(s =>
    `<a class="svc" href="${esc(s.url)}" target="_blank" rel="noopener">${svg(s.icon)}<b>${esc(s.name)}</b><span>${esc(s.note)}</span></a>`).join('');
  const quick = [SERVICES[0], SERVICES[1], SERVICES[3], SERVICES[8]];
  $('#quick').innerHTML = quick.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${svg(s.icon)}${esc(s.name)}</a>`).join('');
}

function renderAbout() {
  const A = ABOUT;
  const theme = (() => { try { return localStorage.getItem(THEME_KEY) || 'auto'; } catch (e) { return 'auto'; } })();
  $('#about').innerHTML = `
    <div class="president">
      <img src="${esc(A.presidentPhoto)}" alt="${esc(A.president)}" loading="lazy" onerror="this.style.visibility='hidden'">
      <div>
        <h3>${esc(A.president)}</h3>
        <p>${esc(A.presidentTitle)}</p>
        <a class="link-btn" href="${esc(A.presidentWordUrl)}" target="_blank" rel="noopener">قراءة كلمة السيد رئيس الجامعة</a>
      </div>
    </div>

    <h2>نبذة</h2>
    <div class="prose">
      <p>تأسست جامعة الموصل عام ${fmtNum.format(A.founded).replace(/٬/g, '')}، وهي من أكبر الجامعات العراقية وأعرقها.</p>
      <p>تضم اليوم ${fmtNum.format(UNITS.filter(u => GROUPS.find(g => g.id === u.group).kind === 'college').length)} كلية، إلى جانب مراكز بحثية وخدمية، ومكتبة مركزية أُعيد إعمارها، ومسرحاً كبيراً يخدم المدينة.</p>
    </div>

    <h2>روابط مهمة</h2>
    <div class="rows">
      <a href="${esc(A.calendarUrl)}" target="_blank" rel="noopener"><span>التقويم الجامعي 2026–2027</span><span>←</span></a>
      <a href="${esc(A.contactUrl)}" target="_blank" rel="noopener"><span>اتصل بنا</span><span>←</span></a>
      <a href="https://uomosul.edu.iq/" target="_blank" rel="noopener"><span>الموقع الرسمي</span><span>uomosul.edu.iq</span></a>
      <div><span>العنوان</span><span>${esc(A.address)}</span></div>
      <div><span>الرمز البريدي</span><span>${esc(A.postal)}</span></div>
    </div>

    <h2>تابعونا</h2>
    <div class="rows">${A.social.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener"><span>${esc(s.name)}</span><span>←</span></a>`).join('')}</div>

    <h2>المظهر</h2>
    <div class="seg" id="seg-theme" style="grid-template-columns:repeat(3,1fr)">
      <button data-theme-set="auto" class="${theme === 'auto' ? 'on' : ''}">تلقائي</button>
      <button data-theme-set="light" class="${theme === 'light' ? 'on' : ''}">فاتح</button>
      <button data-theme-set="dark" class="${theme === 'dark' ? 'on' : ''}">داكن</button>
    </div>

    <div class="dedication">
      <div class="h">إهداء</div>
      <p>إلى الأستاذ الدكتور ${esc(A.president.replace('أ.د. ', ''))}</p>
      <p>رئيس جامعة الموصل المحترم</p>
      <p>عرفاناً بجهودكم في نهضة جامعتنا، أضع بين أيديكم هذا التطبيق ليكون نافذةً يوميةً على نشاطات كلياتها ومراكزها.</p>
      <div class="by">تصميم وتطوير: م.م. علي عبد الوهاب يحيى الصفار<br>كلية الإدارة والاقتصاد — جامعة الموصل<br>ali_alsaffar@uomosul.edu.iq</div>
    </div>
    <footer class="credit">البيانات مأخوذة من الموقع الرسمي لجامعة الموصل</footer>`;
}

function renderAll() {
  renderBanner(); renderHome(); renderActivities(); renderUnits();
}

/* ---------- نافذة الجهة ---------- */
function openUnit(id) {
  const u = unitById[id]; if (!u) return;
  const g = groupById[u.group];
  const week = state.items.filter(i => i.unit === id && inWeek(i, 0)).sort((a, b) => b.date - a.date);
  const sheet = $('#sheet');
  sheet.innerHTML = `<div class="grip"></div>
    <h3 id="sheet-title">${esc(u.name)}</h3>
    <div class="grp">${esc(g ? g.name : '')}</div>
    <div class="actions">
      <a class="btn" href="${esc(u.base)}" target="_blank" rel="noopener">الموقع الإلكتروني</a>
      <button class="btn ghost" data-show-acts="${u.id}">كل نشاطاتها</button>
      <button class="btn ghost" data-close>إغلاق</button>
    </div>
    <h2 style="margin-top:6px">هذا الأسبوع — ${fmtNum.format(week.length)}</h2>
    <div class="list">${week.length ? week.map(i => itemHTML(i, false)).join('') : `<div class="empty"><b>لا توجد نشاطات منشورة هذا الأسبوع</b>قد تنشر الجهة أخبارها لاحقاً على موقعها.</div>`}</div>`;
  $('#sheet-bg').classList.add('on'); sheet.classList.add('on');
  sheet.scrollTop = 0;
  $('[data-close]', sheet).focus();
}
function closeSheet() { $('#sheet').classList.remove('on'); $('#sheet-bg').classList.remove('on'); }

/* ---------- التنقل ---------- */
function go(tab) {
  $$('nav.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  $$('.view').forEach(v => v.classList.toggle('on', v.id === 'v-' + tab));
  window.scrollTo({ top: 0 });
}

function setSeg(segId, attr, val) { $$(`#${segId} button`).forEach(b => b.classList.toggle('on', b.dataset[attr] === String(val))); }

function applyTheme(t) {
  const root = document.documentElement;
  if (t === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', t);
}

function bind() {
  document.addEventListener('click', e => {
    const t = e.target.closest('button, [data-day]');
    if (!t) return;
    if (t.dataset.tab) return go(t.dataset.tab);
    if (t.dataset.go) return go(t.dataset.go);
    if (t.dataset.day && t.classList.contains('day')) {
      state.day = t.dataset.day; state.week = 0; state.kind = 'all'; state.unit = 'all'; state.type = 'all';
      // نُظهر كل المصادر عند اختيار يوم من نبض الأسبوع
      state.kind = 'any';
      setSeg('seg-week', 'week', 0); setSeg('seg-kind', 'kind', 'any'); $('#unit-picker').value = 'all';
      renderActivities(); go('activities'); return;
    }
    if ('clearDay' in t.dataset) { state.day = null; if (state.kind === 'any') { state.kind = 'all'; setSeg('seg-kind', 'kind', 'all'); } return renderActivities(); }
    if (t.dataset.week !== undefined) { state.week = +t.dataset.week; state.day = null; setSeg('seg-week', 'week', state.week); return renderActivities(); }
    if (t.dataset.kind) { state.kind = t.dataset.kind; state.day = null; if (state.kind === 'hq') { state.unit = 'all'; $('#unit-picker').value = 'all'; } setSeg('seg-kind', 'kind', state.kind); return renderActivities(); }
    if (t.dataset.group) { state.group = t.dataset.group; setSeg('seg-group', 'group', state.group); return renderActivities(); }
    if (t.dataset.type) { state.type = t.dataset.type; return renderActivities(); }
    if (t.dataset.unit) return openUnit(t.dataset.unit);
    if (t.dataset.showActs) {
      closeSheet(); state.unit = t.dataset.showActs; state.kind = 'all'; state.day = null; state.type = 'all';
      $('#unit-picker').value = state.unit; setSeg('seg-kind', 'kind', 'all'); renderActivities(); go('activities'); return;
    }
    if ('close' in t.dataset) return closeSheet();
    if (t.dataset.themeSet) {
      const v = t.dataset.themeSet; applyTheme(v); setSeg('seg-theme', 'themeSet', v);
      try { localStorage.setItem(THEME_KEY, v); } catch (err) {}
      return;
    }
  });
  $('#sheet-bg').addEventListener('click', closeSheet);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
  $('#refresh').addEventListener('click', () => refresh(true));
  $('#unit-picker').addEventListener('change', e => { state.unit = e.target.value; if (state.unit !== 'all' && state.kind === 'hq') { state.kind = 'all'; setSeg('seg-kind', 'kind', 'all'); } renderActivities(); });
  let st; $('#search').addEventListener('input', e => { clearTimeout(st); st = setTimeout(() => { state.q = e.target.value; renderActivities(); }, 150); });
  $('#unit-search').addEventListener('input', renderUnits);
}

/* ---------- التشغيل ---------- */
function init() {
  try { applyTheme(localStorage.getItem(THEME_KEY) || 'auto'); } catch (e) {}
  $('#today').textContent = fmtFull.format(new Date());
  if (!loadCache()) loadSnapshot();
  renderUnitPicker(); renderServices(); renderAbout(); renderAll(); bind();
  refresh(false);
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}
init();
})();
