/* تطبيق جامعة الموصل — المنطق الرئيسي */
(() => {
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const DAY = 86400000;
const CACHE_KEY = 'uom-cache-v1';
const THEME_KEY = 'uom-theme2';
const LANG_KEY = 'uom-lang';
const CONCURRENCY = 6;
const TIMEOUT = 15000;
const APP_URL = 'alialsaffarmosuluniversity.github.io/MosulUniv';

const ALL_UNITS = [HQ, ...UNITS];
const unitById = Object.fromEntries(ALL_UNITS.map(u => [u.id, u]));
const groupById = Object.fromEntries(GROUPS.map(g => [g.id, g]));
const ALL_TYPES = [...TYPES, TYPE_OTHER];
const store = {
  get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
};

const state = {
  items: [], source: 'snapshot', ref: new Date(), loading: false, failed: 0,
  week: 0, kind: 'all', unit: 'all', type: 'all', q: '', group: 'day', day: null,
  lang: store.get(LANG_KEY) === 'en' ? 'en' : 'ar',
};

/* ---------- النصوص بلغتين ---------- */
const STR = {
  ar: {
    appName: 'جامعة الموصل', refresh: 'تحديث البيانات',
    heroTitle: 'نبض جامعة الموصل', heroSub: 'متابعة أسبوعية لنشاطات الكليات والمراكز، مباشرة من الموقع الرسمي للجامعة',
    pulseCap: 'نشاطاً وخبراً خلال آخر سبعة أيام', unitsCap: 'جهة نشطة من أصل {n}', shareReport: 'مشاركة التقرير الأسبوعي',
    topTitle: 'الأكثر نشاطاً هذا الأسبوع', allUnits: 'كل الجهات', typesTitle: 'النشاطات حسب النوع',
    quickTitle: 'خدمات سريعة', allServices: 'كل الخدمات', newsTitle: 'آخر أخبار الجامعة', officialSite: 'الموقع الرسمي',
    thisWeek: 'هذا الأسبوع', lastWeek: 'الأسبوع الماضي', kindUnits: 'الكليات والمراكز', kindHQ: 'رئاسة الجامعة',
    searchActs: 'ابحث في عناوين النشاطات', byDay: 'حسب اليوم', byUnit: 'حسب الجهة', searchUnits: 'ابحث عن كلية أو مركز',
    eSystems: 'الأنظمة الإلكترونية', tabHome: 'الرئيسية', tabActs: 'النشاطات', tabUnits: 'الكليات', tabServices: 'الخدمات', tabAbout: 'عن الجامعة',
    allPicker: 'كل الكليات والمراكز', all: 'الكل', loadingN: 'جارٍ جلب النشاطات… {d} من {n} جهة',
    noNews: 'لا توجد أخبار لعرضها', noNewsHint: 'اضغط زر التحديث في الأعلى عند توفر الإنترنت.',
    noActs: 'لا توجد نشاطات مطابقة', noActsHint: 'جرّب أسبوعاً آخر أو أزل بعض عوامل التصفية.',
    noRank: 'لا توجد نشاطات منشورة بعد هذا الأسبوع.',
    dayOnly: 'نشاطات يوم {d} فقط.', showWeek: 'عرض الأسبوع كاملاً',
    noUnit: 'لا توجد جهة بهذا الاسم', noUnitHint: 'تأكد من كتابة الاسم بشكل صحيح.', weekCount: 'نشاطات هذا الأسبوع',
    website: 'الموقع الإلكتروني', allActs: 'كل نشاطاتها', close: 'إغلاق', thisWeekN: 'هذا الأسبوع — {n}',
    unitEmpty: 'لا توجد نشاطات منشورة هذا الأسبوع', unitEmptyHint: 'قد تنشر الجهة أخبارها لاحقاً على موقعها.',
    bFailed: 'تعذّر الوصول إلى {n} من مواقع الكليات والمراكز، لذلك قد تنقص بعض النشاطات.',
    bCache: 'لا يوجد اتصال بموقع الجامعة. تُعرض بيانات محفوظة من {d}.',
    bSnap: 'تُعرض نسخة محفوظة من {d}. اضغط زر التحديث في الأعلى عند توفر الإنترنت.',
    tOk: 'تم تحديث النشاطات', tFail: 'تعذّر الاتصال بموقع الجامعة. تُعرض آخر بيانات محفوظة.',
    tSaved: 'تم حفظ صورة التقرير', tMaking: 'جارٍ إعداد التقرير…',
    darkOn: 'الوضع الداكن', lightOn: 'الوضع الفاتح',
    readWord: 'قراءة كلمة السيد رئيس الجامعة', presTitle: 'رئيس جامعة الموصل', about: 'نبذة',
    about1: 'تأسست جامعة الموصل عام {y}، وهي من أكبر الجامعات العراقية وأعرقها.',
    about2: 'تضم اليوم {n} كلية، إلى جانب مراكز بحثية وخدمية، ومكتبة مركزية أُعيد إعمارها، ومسرحاً كبيراً يخدم المدينة.',
    links: 'روابط مهمة', calendar: 'التقويم الجامعي 2026–2027', contact: 'اتصل بنا', address: 'العنوان', postal: 'الرمز البريدي', follow: 'تابعونا',
    dedTitle: 'إهداء',
    ded1: 'إلى جامعة الموصل',
    ded2: 'صرح العلم والمعرفة منذ عام ١٩٦٧، وإلى أساتذتها وطلبتها ومنتسبيها،',
    ded3: 'أهدي هذا التطبيق ليكون نافذةً يوميةً على نشاطات كلياتها ومراكزها.',
    dedBy: 'تصميم وتطوير: م.م. علي عبد الوهاب يحيى الصفار',
    dedCollege: 'كلية الإدارة والاقتصاد — جامعة الموصل',
    source: 'البيانات مأخوذة من الموقع الرسمي لجامعة الموصل',
    rTitle: 'التقرير الأسبوعي للنشاطات', rTotal: 'نشاطاً وخبراً', rUnits: 'جهة نشطة من أصل {n}',
    rTop: 'الأكثر نشاطاً', rTypes: 'حسب النوع', rFoot: 'من تطبيق نبض جامعة الموصل',
  },
  en: {
    appName: 'University of Mosul', refresh: 'Refresh data',
    heroTitle: 'The Pulse of the University of Mosul', heroSub: 'A weekly view of college and center activities, straight from the university’s official website',
    pulseCap: 'activities and news in the last 7 days', unitsCap: 'active units out of {n}', shareReport: 'Share weekly report',
    topTitle: 'Most active this week', allUnits: 'All units', typesTitle: 'Activities by type',
    quickTitle: 'Quick services', allServices: 'All services', newsTitle: 'Latest university news', officialSite: 'Official site',
    thisWeek: 'This week', lastWeek: 'Last week', kindUnits: 'Colleges & centers', kindHQ: 'Presidency',
    searchActs: 'Search activity titles', byDay: 'By day', byUnit: 'By unit', searchUnits: 'Search for a college or center',
    eSystems: 'Electronic systems', tabHome: 'Home', tabActs: 'Activities', tabUnits: 'Colleges', tabServices: 'Services', tabAbout: 'About',
    allPicker: 'All colleges and centers', all: 'All', loadingN: 'Fetching activities… {d} of {n} units',
    noNews: 'No news to show', noNewsHint: 'Tap refresh at the top when you are online.',
    noActs: 'No matching activities', noActsHint: 'Try another week or remove some filters.',
    noRank: 'No activities published yet this week.',
    dayOnly: 'Showing {d} only.', showWeek: 'Show the whole week',
    noUnit: 'No unit with this name', noUnitHint: 'Check the spelling and try again.', weekCount: 'Activities this week',
    website: 'Website', allActs: 'All activities', close: 'Close', thisWeekN: 'This week — {n}',
    unitEmpty: 'No activities published this week', unitEmptyHint: 'The unit may post its news later on its website.',
    bFailed: '{n} college and center websites could not be reached, so some activities may be missing.',
    bCache: 'No connection to the university website. Showing saved data from {d}.',
    bSnap: 'Showing a saved copy from {d}. Tap refresh at the top when you are online.',
    tOk: 'Activities updated', tFail: 'Could not reach the university website. Showing the last saved data.',
    tSaved: 'Report image saved', tMaking: 'Preparing the report…',
    darkOn: 'Dark mode', lightOn: 'Light mode',
    readWord: 'Read the President’s message', presTitle: 'President of the University of Mosul', about: 'Overview',
    about1: 'The University of Mosul was founded in {y} and is one of Iraq’s largest and oldest universities.',
    about2: 'Today it has {n} colleges, along with research and service centers, a rebuilt central library, and a large theater that serves the city.',
    links: 'Useful links', calendar: 'Academic calendar 2026–2027', contact: 'Contact us', address: 'Address', postal: 'Postal code', follow: 'Follow us',
    dedTitle: 'Dedication',
    ded1: 'To the University of Mosul,',
    ded2: 'a home of learning since 1967, and to its faculty, students and staff,',
    ded3: 'I dedicate this app as a daily window onto the activities of its colleges and centers.',
    dedBy: 'Designed and developed by Asst. Lect. Ali Abdulwahab Yahya Al-Saffar',
    dedCollege: 'College of Administration and Economics — University of Mosul',
    source: 'Data from the official website of the University of Mosul',
    rTitle: 'Weekly activity report', rTotal: 'activities and news', rUnits: 'active units out of {n}',
    rTop: 'Most active', rTypes: 'By type', rFoot: 'From The Pulse of the University of Mosul app',
  },
};
const t = (k, v = {}) => (STR[state.lang][k] ?? STR.ar[k] ?? k).replace(/\{(\w+)\}/g, (_, x) => v[x] ?? '');
const uname = u => state.lang === 'en' ? (u.id === 'uom' ? EN.hq : EN.units[u.id] || u.name) : u.name;
const gname = g => state.lang === 'en' ? EN.groups[g.id] : g.name;
const tname = ty => state.lang === 'en' ? EN.types[ty.id] : ty.name;

let fmtDay, fmtShort, fmtWd, fmtNum, fmtFull, fmtRange;
function setFormatters() {
  const loc = state.lang === 'en' ? 'en-GB' : 'ar-IQ';
  fmtDay = new Intl.DateTimeFormat(loc, { weekday: 'long', day: 'numeric', month: 'long' });
  fmtShort = new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'long' });
  fmtWd = new Intl.DateTimeFormat(loc, { weekday: 'short' });
  fmtNum = new Intl.NumberFormat(loc);
  fmtFull = new Intl.DateTimeFormat(loc, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  fmtRange = new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ---------- أدوات ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const decoder = document.createElement('textarea');
const decode = html => { decoder.innerHTML = String(html || '').replace(/<[^>]*>/g, ''); return decoder.value.trim(); };
const norm = s => s.replace(/[إأآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[ًٌٍَُِّْـ]/g, '');
const startOfDay = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const dayKey = d => { const x = new Date(d); return `${x.getFullYear()}-${x.getMonth() + 1}-${x.getDate()}`; };
const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

function classify(title) {
  const tt = norm(title);
  for (const ty of TYPES) if (ty.words.some(w => tt.includes(norm(w)))) return ty.id;
  return 'other';
}
function matchUnit(title) {
  const tt = norm(' ' + title + ' ');
  for (const u of UNITS) if (u.keys.some(k => tt.includes(norm(k)))) return u.id;
  return 'uom';
}
const makeItem = raw => ({ ...raw, date: new Date(raw.date), type: classify(raw.title) });

function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('on');
  clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove('on'), 2600);
}

/* ---------- جلب البيانات ---------- */
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
  state.loading = true; $('#refresh').classList.add('spin');
  const after = new Date(Date.now() - 15 * DAY).toISOString();
  const queue = [...ALL_UNITS];
  let done = 0, ok = 0;
  const out = [];
  const prog = $('#p-progress');
  const tick = () => { prog.textContent = t('loadingN', { d: fmtNum.format(done), n: fmtNum.format(ALL_UNITS.length) }); };
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
  state.loading = false; $('#refresh').classList.remove('spin');
  if (ok === 0) return false;
  const seen = new Set();
  const items = out.filter(i => i.link && !seen.has(i.link) && seen.add(i.link));
  state.items = items.map(makeItem);
  state.source = 'live'; state.ref = new Date(); state.failed = ALL_UNITS.length - ok;
  store.set(CACHE_KEY, JSON.stringify({ ts: Date.now(), items }));
  return true;
}

function loadCache() {
  try {
    const c = JSON.parse(store.get(CACHE_KEY) || 'null');
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
    if (user) toast(t('tFail'));
  } else if (user) toast(t('tOk'));
  renderAll();
}

/* ---------- الأسابيع والإحصاءات ---------- */
function weekRange(w) {
  const end = new Date(startOfDay(state.ref).getTime() + DAY - 7 * DAY * w);
  return { start: new Date(end.getTime() - 7 * DAY), end };
}
const inWeek = (i, w) => { const r = weekRange(w); return i.date >= r.start && i.date < r.end; };

function weekStats() {
  const week = state.items.filter(i => inWeek(i, 0));
  const byUnit = {}, byType = {};
  week.forEach(i => {
    if (i.unit !== 'uom') byUnit[i.unit] = (byUnit[i.unit] || 0) + 1;
    byType[i.type] = (byType[i.type] || 0) + 1;
  });
  const rank = Object.entries(byUnit).sort((a, b) => b[1] - a[1]);
  const types = ALL_TYPES.filter(ty => byType[ty.id]).map(ty => ({ ty, n: byType[ty.id] })).sort((a, b) => b.n - a.n);
  const { start } = weekRange(0);
  const days = Array.from({ length: 7 }, (_, k) => new Date(start.getTime() + k * DAY));
  const counts = days.map(d => week.filter(i => dayKey(i.date) === dayKey(d)).length);
  return { week, rank, types, days, counts };
}

/* ---------- العرض ---------- */
function itemHTML(i, showUnit = true) {
  const ty = ALL_TYPES.find(x => x.id === i.type) || TYPE_OTHER;
  const u = unitById[i.unit] || HQ;
  const img = i.img ? `<img class="thumb" src="${esc(i.img)}" alt="" loading="lazy" onerror="this.parentNode.classList.add('noimg');this.remove()">` : '';
  return `<a class="item ${i.img ? '' : 'noimg'}" style="--tc:var(--t-${ty.id})" href="${esc(i.link)}" target="_blank" rel="noopener">
    <div>
      <h3 lang="ar" dir="auto">${esc(i.title)}</h3>
      <div class="meta"><span class="tag">${esc(tname(ty))}</span>${showUnit ? `<span>${esc(uname(u))}</span>` : ''}<span>${esc(fmtShort.format(i.date))}</span></div>
    </div>${img}</a>`;
}
const emptyHTML = (a, b) => `<div class="empty"><b>${esc(a)}</b>${esc(b)}</div>`;

function renderStatic() {
  const L = state.lang;
  document.documentElement.lang = L;
  document.documentElement.dir = L === 'en' ? 'ltr' : 'rtl';
  document.title = t('appName');
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $$('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  const lb = $('#lang'); lb.textContent = L === 'en' ? 'ع' : 'EN'; lb.setAttribute('aria-label', L === 'en' ? 'العربية' : 'English');
  $('.seal').alt = t('appName');
  $('#today').textContent = fmtFull.format(new Date());
  updateThemeButton();
}

function renderBanner() {
  const b = $('#banner');
  if (state.source === 'live') {
    b.hidden = !(state.failed > 4);
    if (!b.hidden) b.textContent = t('bFailed', { n: fmtNum.format(state.failed) });
  } else {
    b.hidden = false;
    b.textContent = t(state.source === 'cache' ? 'bCache' : 'bSnap', { d: fmtFull.format(state.ref) });
  }
}

function renderHome() {
  const S = weekStats();
  const active = S.rank.length;
  $('#p-total').textContent = fmtNum.format(S.week.length);
  $('#p-units').textContent = fmtNum.format(active);
  $('#p-units-cap').textContent = t('unitsCap', { n: fmtNum.format(UNITS.length) });

  const max = Math.max(1, ...S.counts);
  $('#p-days').innerHTML = S.days.map((d, k) => `
    <button class="day ${S.counts[k] ? '' : 'zero'}" data-day="${dayKey(d)}" aria-label="${esc(fmtDay.format(d))}: ${S.counts[k]}">
      <span class="n">${fmtNum.format(S.counts[k])}</span>
      <span class="bar-wrap"><span class="bar" style="height:${Math.max(6, Math.round(S.counts[k] / max * 100))}%"></span></span>
      <span class="d">${esc(fmtWd.format(d))}</span>
    </button>`).join('');

  // الترتيب
  const top = S.rank.slice(0, 5);
  const topMax = top.length ? top[0][1] : 1;
  $('#rank').innerHTML = top.length ? top.map(([id, n], k) => `
    <li><button data-unit="${id}">
      <span class="no">${fmtNum.format(k + 1)}</span>
      <span class="nm">${esc(uname(unitById[id]))}</span>
      <span class="ct">${fmtNum.format(n)}</span>
      <span class="track"><span class="fill" style="width:${Math.round(n / topMax * 100)}%"></span></span>
    </button></li>`).join('') : `<li class="empty" style="padding:18px">${esc(t('noRank'))}</li>`;

  // التوزيع حسب النوع
  const total = S.week.length || 1;
  $('#stack').innerHTML = S.types.map(({ ty, n }) => `<span style="flex:${n};background:var(--t-${ty.id})" title="${esc(tname(ty))}: ${n}"></span>`).join('');
  $('#stack').setAttribute('aria-label', S.types.map(({ ty, n }) => `${tname(ty)} ${n}`).join('، '));
  $('#legend').innerHTML = S.types.map(({ ty, n }) =>
    `<button data-legend="${ty.id}"><i style="background:var(--t-${ty.id})"></i>${esc(tname(ty))} <b>${fmtNum.format(n)}</b></button>`).join('');

  const news = state.items.filter(i => i.src === 'hq').sort((a, b) => b.date - a.date).slice(0, 8);
  $('#news').innerHTML = news.length ? news.map(i => itemHTML(i, false)).join('') : emptyHTML(t('noNews'), t('noNewsHint'));
  $('#report').disabled = !S.week.length;
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
  const counts = {};
  base.forEach(i => counts[i.type] = (counts[i.type] || 0) + 1);
  if (state.type !== 'all' && !counts[state.type]) state.type = 'all';
  const chips = [{ id: 'all', label: t('all'), n: base.length }, ...ALL_TYPES.filter(x => counts[x.id]).map(x => ({ id: x.id, label: tname(x), n: counts[x.id] }))];
  $('#type-chips').innerHTML = chips.map(c => `<button class="chip ${state.type === c.id ? 'on' : ''}" data-type="${c.id}">${esc(c.label)} ${fmtNum.format(c.n)}</button>`).join('');

  const list = base.filter(i => state.type === 'all' || i.type === state.type).sort((a, b) => b.date - a.date);
  let head = '';
  if (state.day) {
    const [y, m, d] = state.day.split('-').map(Number);
    head = `<div class="banner">${esc(t('dayOnly', { d: fmtDay.format(new Date(y, m - 1, d)) }))} <button class="link-btn" data-clear-day>${esc(t('showWeek'))}</button></div>`;
  }
  const box = $('#acts');
  if (!list.length) { box.innerHTML = head + emptyHTML(t('noActs'), t('noActsHint')); return; }
  const groups = new Map();
  const key = state.group === 'day' ? (i => dayKey(i.date)) : (i => i.unit);
  list.forEach(i => { const k = key(i); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(i); });
  let entries = [...groups.entries()];
  if (state.group === 'unit') entries.sort((a, b) => b[1].length - a[1].length);
  box.innerHTML = head + entries.map(([k, g]) => {
    const label = state.group === 'day' ? fmtDay.format(g[0].date) : uname(unitById[k] || HQ);
    return `<div class="day-label">${esc(label)} — ${fmtNum.format(g.length)}</div><div class="list">${g.map(i => itemHTML(i, state.group === 'day')).join('')}</div>`;
  }).join('');
}

function renderUnitPicker() {
  const sel = $('#unit-picker');
  sel.setAttribute('aria-label', t('allPicker'));
  sel.innerHTML = `<option value="all">${esc(t('allPicker'))}</option>` + GROUPS.map(g =>
    `<optgroup label="${esc(gname(g))}">${UNITS.filter(u => u.group === g.id).map(u => `<option value="${u.id}">${esc(uname(u))}</option>`).join('')}</optgroup>`).join('');
  sel.value = state.unit;
}

function renderUnits() {
  const q = norm($('#unit-search').value.trim().toLowerCase());
  const week = state.items.filter(i => inWeek(i, 0));
  const count = id => week.filter(i => i.unit === id).length;
  const chev = state.lang === 'en' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6';
  const html = GROUPS.map(g => {
    const us = UNITS.filter(u => u.group === g.id && (!q || norm(u.name).includes(q) || norm(uname(u).toLowerCase()).includes(q)));
    if (!us.length) return '';
    return `<div><h2>${esc(gname(g))}</h2><div class="units">${us.map(u => {
      const n = count(u.id);
      return `<button class="unit" data-unit="${u.id}"><span class="nm">${esc(uname(u))}</span><span class="ct ${n ? 'has' : ''}" title="${esc(t('weekCount'))}">${fmtNum.format(n)}</span><svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="${chev}"/></svg></button>`;
    }).join('')}</div></div>`;
  }).join('');
  $('#unit-groups').innerHTML = html || `<div style="margin-top:14px">${emptyHTML(t('noUnit'), t('noUnitHint'))}</div>`;
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
  car: '<path d="M5 16V11l2-5h10l2 5v5"/><path d="M3 16h18v3H3z"/>',
  gov: '<path d="M3 21h18M5 10v8M9.5 10v8M14.5 10v8M19 10v8M2 10h20L12 3z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>',
};
const svg = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[k] || ICONS.globe}</svg>`;
const sname = (s, idx) => state.lang === 'en' ? EN.services[idx][0] : s.name;
const snote = (s, idx) => state.lang === 'en' ? EN.services[idx][1] : s.note;

function renderServices() {
  $('#services').innerHTML = SERVICES.map((s, k) =>
    `<a class="svc" href="${esc(s.url)}" target="_blank" rel="noopener">${svg(s.icon)}<b>${esc(sname(s, k))}</b><span>${esc(snote(s, k))}</span></a>`).join('');
  $('#quick').innerHTML = [0, 1, 3, 8].map(k => `<a href="${esc(SERVICES[k].url)}" target="_blank" rel="noopener">${svg(SERVICES[k].icon)}${esc(sname(SERVICES[k], k))}</a>`).join('');
}

function renderAbout() {
  const A = ABOUT;
  const arrow = state.lang === 'en' ? '→' : '←';
  const colleges = UNITS.filter(u => groupById[u.group].kind === 'college').length;
  const pres = state.lang === 'en' ? EN.president : A.president;
  $('#about').innerHTML = `
    <div class="president">
      <img src="${esc(A.presidentPhoto)}" alt="${esc(pres)}" loading="lazy" onerror="this.style.visibility='hidden'">
      <div><h3>${esc(pres)}</h3><p>${esc(t('presTitle'))}</p>
        <a class="link-btn" href="${esc(A.presidentWordUrl)}" target="_blank" rel="noopener">${esc(t('readWord'))}</a></div>
    </div>
    <h2>${esc(t('about'))}</h2>
    <div class="prose"><p>${esc(t('about1', { y: String(A.founded).replace(/\d/g, d => state.lang === 'en' ? d : '٠١٢٣٤٥٦٧٨٩'[d]) }))}</p><p>${esc(t('about2', { n: fmtNum.format(colleges) }))}</p></div>
    <h2>${esc(t('links'))}</h2>
    <div class="rows">
      <a href="${esc(A.calendarUrl)}" target="_blank" rel="noopener"><span>${esc(t('calendar'))}</span><span>${arrow}</span></a>
      <a href="${esc(A.contactUrl)}" target="_blank" rel="noopener"><span>${esc(t('contact'))}</span><span>${arrow}</span></a>
      <a href="https://uomosul.edu.iq/" target="_blank" rel="noopener"><span>${esc(t('officialSite'))}</span><span>uomosul.edu.iq</span></a>
      <div><span>${esc(t('address'))}</span><span>${esc(state.lang === 'en' ? EN.address : A.address)}</span></div>
      <div><span>${esc(t('postal'))}</span><span>${esc(A.postal)}</span></div>
    </div>
    <h2>${esc(t('follow'))}</h2>
    <div class="rows">${A.social.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener"><span>${esc(state.lang === 'en' ? s.url.split('/')[2].replace('www.', '') : s.name)}</span><span>${arrow}</span></a>`).join('')}</div>
    <div class="dedication">
      <div class="h">${esc(t('dedTitle'))}</div>
      <p class="to">${esc(t('ded1'))}</p>
      <p>${esc(t('ded2'))}</p>
      <p>${esc(t('ded3'))}</p>
      <div class="by">${esc(t('dedBy'))}<br>${esc(t('dedCollege'))}<br>ali_alsaffar@uomosul.edu.iq</div>
    </div>
    <footer class="credit">${esc(t('source'))}</footer>`;
}

function renderAll() { renderBanner(); renderHome(); renderActivities(); renderUnits(); }
function renderEverything() { setFormatters(); renderStatic(); renderUnitPicker(); renderServices(); renderAbout(); renderAll(); }

/* ---------- نافذة الجهة ---------- */
function openUnit(id) {
  const u = unitById[id]; if (!u) return;
  const g = groupById[u.group];
  const week = state.items.filter(i => i.unit === id && inWeek(i, 0)).sort((a, b) => b.date - a.date);
  const sheet = $('#sheet');
  sheet.innerHTML = `<div class="grip"></div>
    <h3 id="sheet-title">${esc(uname(u))}</h3>
    <div class="grp">${esc(g ? gname(g) : '')}</div>
    <div class="actions">
      <a class="btn" href="${esc(u.base)}" target="_blank" rel="noopener">${esc(t('website'))}</a>
      <button class="btn ghost" data-show-acts="${u.id}">${esc(t('allActs'))}</button>
      <button class="btn ghost" data-close>${esc(t('close'))}</button>
    </div>
    <h2 style="margin-top:6px">${esc(t('thisWeekN', { n: fmtNum.format(week.length) }))}</h2>
    <div class="list">${week.length ? week.map(i => itemHTML(i, false)).join('') : emptyHTML(t('unitEmpty'), t('unitEmptyHint'))}</div>`;
  $('#sheet-bg').classList.add('on'); sheet.classList.add('on'); sheet.scrollTop = 0;
  $('[data-close]', sheet).focus();
}
function closeSheet() { $('#sheet').classList.remove('on'); $('#sheet-bg').classList.remove('on'); }

/* ---------- الوضع الداكن: شمس وقمر ---------- */
const sysDark = window.matchMedia('(prefers-color-scheme: dark)');
const isDark = () => { const s = store.get(THEME_KEY); return s ? s === 'dark' : sysDark.matches; };
function applyTheme() {
  const dark = isDark();
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.documentElement.classList.toggle('is-dark', dark);
  const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = dark ? '#0d1a2b' : '#12304f';
  updateThemeButton();
}
function updateThemeButton() {
  const b = $('#theme'); if (!b) return;
  b.setAttribute('aria-label', isDark() ? t('lightOn') : t('darkOn'));
}
sysDark.addEventListener && sysDark.addEventListener('change', () => { if (!store.get(THEME_KEY)) applyTheme(); });

/* ---------- التقرير الأسبوعي (صورة) ---------- */
async function makeReport() {
  const btn = $('#report'); if (btn.disabled) return;
  btn.disabled = true; toast(t('tMaking'));
  try {
    const S = weekStats();
    const en = state.lang === 'en';
    const body = en ? '"IBM Plex Sans Arabic", system-ui, sans-serif' : '"IBM Plex Sans Arabic", Tahoma, sans-serif';
    const disp = en ? '"Cormorant Garamond", Georgia, serif' : '"Aref Ruqaa", "IBM Plex Sans Arabic", serif';
    try { await Promise.all([document.fonts.load(`700 40px ${disp}`), document.fonts.load(`600 30px ${body}`), document.fonts.load(`400 30px ${body}`)]); } catch (e) {}
    const W = 1080, H = 1350, P = 72;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d');
    x.direction = en ? 'ltr' : 'rtl';
    const start = en ? P : W - P, end = en ? W - P : P;
    const align = en ? 'left' : 'right', alignEnd = en ? 'right' : 'left';
    const INK = '#12304f', BRASS = '#a8792a', MARBLE = '#eef0ec', TEXT = '#1a2230', MUTED = '#5b6574', VEIN = '#d6dbd5';

    x.fillStyle = MARBLE; x.fillRect(0, 0, W, H);
    // الترويسة
    x.fillStyle = INK; x.fillRect(0, 0, W, 300);
    x.fillStyle = BRASS; x.fillRect(0, 300, W, 6);
    const icon = new Image(); icon.src = 'icons/icon-192.png';
    await new Promise(r => { icon.onload = r; icon.onerror = r; });
    if (icon.naturalWidth) x.drawImage(icon, en ? P : W - P - 120, 70, 120, 120);
    const tx = en ? P + 150 : W - P - 150;
    x.textAlign = align; x.fillStyle = '#f4f1e8';
    x.font = `700 ${en ? 64 : 76}px ${disp}`; x.fillText(t('appName'), tx, 140);
    x.font = `600 34px ${body}`; x.fillStyle = '#e4d3ab'; x.fillText(t('rTitle'), tx, 200);
    const r = weekRange(0);
    x.font = `400 26px ${body}`; x.fillStyle = 'rgba(244,241,232,.75)';
    x.fillText(`${fmtRange.format(r.start)} – ${fmtRange.format(new Date(r.end.getTime() - DAY))}`, tx, 248);

    // الأرقام
    let y = 470;
    x.textAlign = align; x.fillStyle = INK; x.font = `700 130px ${disp}`;
    x.fillText(fmtNum.format(S.week.length), start, y);
    x.font = `400 30px ${body}`; x.fillStyle = MUTED; x.fillText(t('rTotal'), start, y + 50);
    x.textAlign = alignEnd; x.fillStyle = TEXT; x.font = `700 64px ${body}`;
    x.fillText(fmtNum.format(S.rank.length), end, y - 30);
    x.font = `400 28px ${body}`; x.fillStyle = MUTED; x.fillText(t('rUnits', { n: fmtNum.format(UNITS.length) }), end, y + 20);

    // الأكثر نشاطاً
    y = 610;
    x.textAlign = align; x.fillStyle = INK; x.font = `700 36px ${body}`; x.fillText(t('rTop'), start, y);
    const top = S.rank.slice(0, 5), tmax = top.length ? top[0][1] : 1;
    top.forEach(([id, n], k) => {
      const yy = y + 60 + k * 78;
      x.fillStyle = k === 0 ? BRASS : VEIN;
      x.beginPath(); x.arc(en ? P + 22 : W - P - 22, yy - 10, 22, 0, Math.PI * 2); x.fill();
      x.fillStyle = k === 0 ? '#fff' : MUTED; x.textAlign = 'center'; x.font = `700 24px ${body}`;
      x.fillText(fmtNum.format(k + 1), en ? P + 22 : W - P - 22, yy - 2);
      x.textAlign = align; x.fillStyle = TEXT; x.font = `600 28px ${body}`;
      x.fillText(uname(unitById[id]), en ? P + 62 : W - P - 62, yy);
      x.textAlign = alignEnd; x.fillStyle = INK; x.font = `700 28px ${body}`; x.fillText(fmtNum.format(n), end, yy);
      const bw = (W - 2 * P - 62) * n / tmax;
      x.fillStyle = VEIN; x.fillRect(en ? P + 62 : P, yy + 16, W - 2 * P - 62, 8);
      x.fillStyle = k === 0 ? BRASS : '#1d4570';
      x.fillRect(en ? P + 62 : W - P - 62 - bw, yy + 16, bw, 8);
    });

    // حسب النوع
    y = 1030;
    x.textAlign = align; x.fillStyle = INK; x.font = `700 36px ${body}`; x.fillText(t('rTypes'), start, y);
    const tot = S.week.length || 1;
    let cx = en ? P : W - P;
    const bwAll = W - 2 * P;
    S.types.forEach(({ ty, n }) => {
      const w = bwAll * n / tot;
      x.fillStyle = cssVar('--t-' + ty.id) || '#888';
      if (en) { x.fillRect(cx, y + 30, Math.max(w - 3, 2), 26); cx += w; } else { x.fillRect(cx - w + 3, y + 30, Math.max(w - 3, 2), 26); cx -= w; }
    });
    let lx = en ? P : W - P, ly = y + 110;
    x.font = `400 26px ${body}`;
    S.types.slice(0, 8).forEach(({ ty, n }) => {
      const label = `${tname(ty)} ${fmtNum.format(n)}`;
      const w = x.measureText(label).width + 50;
      if ((en && lx + w > W - P) || (!en && lx - w < P)) { lx = en ? P : W - P; ly += 46; }
      x.fillStyle = cssVar('--t-' + ty.id) || '#888';
      x.beginPath(); x.arc(en ? lx + 9 : lx - 9, ly - 9, 9, 0, Math.PI * 2); x.fill();
      x.fillStyle = TEXT; x.textAlign = align; x.fillText(label, en ? lx + 26 : lx - 26, ly);
      lx += en ? w : -w;
    });

    // التذييل
    x.fillStyle = INK; x.fillRect(0, H - 90, W, 90);
    x.fillStyle = 'rgba(244,241,232,.85)'; x.font = `400 24px ${body}`; x.textAlign = 'center';
    x.fillText(`${t('rFoot')} · ${APP_URL}`, W / 2, H - 38);

    const blob = await new Promise(res => c.toBlob(res, 'image/png'));
    const file = new File([blob], `mosul-weekly-${dayKey(new Date())}.png`, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: t('rTitle') }); } catch (e) {}
    } else {
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast(t('tSaved'));
    }
  } finally { btn.disabled = false; }
}

/* ---------- التنقل والأحداث ---------- */
function go(tab) {
  $$('nav.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  $$('.view').forEach(v => v.classList.toggle('on', v.id === 'v-' + tab));
  closeSheet(); window.scrollTo({ top: 0 });
}
const setSeg = (id, attr, val) => $$(`#${id} button`).forEach(b => b.classList.toggle('on', b.dataset[attr] === String(val)));
function resetActs(over) {
  Object.assign(state, { week: 0, kind: 'all', unit: 'all', type: 'all', day: null, q: '' }, over);
  $('#search').value = ''; $('#unit-picker').value = state.unit;
  setSeg('seg-week', 'week', state.week); setSeg('seg-kind', 'kind', state.kind);
}

function bind() {
  document.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    const d = b.dataset;
    if (d.tab) return go(d.tab);
    if (d.go) return go(d.go);
    if (d.day && b.classList.contains('day')) { resetActs({ day: d.day, kind: 'any' }); renderActivities(); return go('activities'); }
    if (d.legend) { resetActs({ type: d.legend, kind: 'any' }); renderActivities(); return go('activities'); }
    if ('clearDay' in d) { state.day = null; if (state.kind === 'any') { state.kind = 'all'; setSeg('seg-kind', 'kind', 'all'); } return renderActivities(); }
    if (d.week !== undefined) { state.week = +d.week; state.day = null; setSeg('seg-week', 'week', state.week); return renderActivities(); }
    if (d.kind) { state.kind = d.kind; state.day = null; if (d.kind === 'hq') { state.unit = 'all'; $('#unit-picker').value = 'all'; } setSeg('seg-kind', 'kind', d.kind); return renderActivities(); }
    if (d.group) { state.group = d.group; setSeg('seg-group', 'group', d.group); return renderActivities(); }
    if (d.type) { state.type = d.type; return renderActivities(); }
    if (d.unit) return openUnit(d.unit);
    if (d.showActs) { resetActs({ unit: d.showActs }); renderActivities(); return go('activities'); }
    if ('close' in d) return closeSheet();
  });
  $('#sheet-bg').addEventListener('click', closeSheet);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
  $('#refresh').addEventListener('click', () => refresh(true));
  $('#report').addEventListener('click', makeReport);
  $('#theme').addEventListener('click', () => { store.set(THEME_KEY, isDark() ? 'light' : 'dark'); applyTheme(); });
  $('#lang').addEventListener('click', () => { state.lang = state.lang === 'en' ? 'ar' : 'en'; store.set(LANG_KEY, state.lang); renderEverything(); });
  $('#unit-picker').addEventListener('change', e => { state.unit = e.target.value; if (state.unit !== 'all' && state.kind === 'hq') { state.kind = 'all'; setSeg('seg-kind', 'kind', 'all'); } renderActivities(); });
  let st; $('#search').addEventListener('input', e => { clearTimeout(st); st = setTimeout(() => { state.q = e.target.value; renderActivities(); }, 150); });
  $('#unit-search').addEventListener('input', renderUnits);
}

/* ---------- التشغيل ---------- */
function init() {
  applyTheme();
  if (!loadCache()) loadSnapshot();
  renderEverything(); bind();
  refresh(false);
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
}
init();
})();
