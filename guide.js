/* عرض الدليل التعريفي — صفحة كاملة داخل التطبيق، بلغتين */
(() => {
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const UI = {
  ar: {
    title: 'الدليل التعريفي', year: '2026/2027', uni: 'جامعة الموصل', back: 'رجوع', badge: 'جديد',
    cardSub: 'التقويم الجامعي والتخصصات والتصنيفات والأرقام، في دليل واحد', open: 'تصفّح الدليل',
    coverSub: 'كل ما تحتاج معرفته عن جامعة الموصل للعام الدراسي القادم', start: 'ابدأ الجولة', share: 'مشاركة',
    nav: { letter: 'كلمة الرئيس', calendar: 'التقويم', about: 'من نحن', numbers: 'بالأرقام', rankings: 'التصنيفات', role: 'دورنا', programs: 'البرامج', city: 'الموصل', campus: 'الحرمان', contact: 'تواصل' },
    eLetter: 'كلمة رئيس الجامعة', eCalendar: 'التقويم الجامعي', eAbout: 'من نحن', eNumbers: 'الجامعة بالأرقام', eRankings: 'التصنيفات 2026',
    eRole: 'دور الجامعة', ePrograms: 'البرامج الأكاديمية', eCity: 'مدينة الموصل', eCampus: 'الحرمان الجامعيان', eContact: 'تواصل معنا',
    president: 'رئيس جامعة الموصل', readMore: 'اقرأ الكلمة كاملة', readLess: 'إخفاء',
    calSub: 'الدراسة الصباحية والمسائية', now: 'جارٍ الآن', next: 'القادم', done: 'انتهى', daysLeft: 'متبقٍّ {n} يوماً', dayN: 'اليوم {a} من {b}',
    vision: 'رؤيتنا', mission: 'رسالتنا', objectives: 'أهدافنا', showObj: 'عرض الأهداف', hideObj: 'إخفاء الأهداف',
    rankHint: 'كلما قلّ الرقم كان الترتيب أفضل.', rankSrc: 'بحسب دليل الجامعة 2026',
    roleH: 'ماذا تقدّم الجامعة؟', supportH: 'الدعم الأكاديمي للطلبة',
    progSearch: 'ابحث عن تخصص', progEmpty: 'لا يوجد تخصص مطابق', programsN: '{n} تخصصاً', browseColleges: 'تصفّح الكليات والمراكز', openProg: 'تخصصات',
    campusSub: 'أكثر من 2,300 هكتار من الأبنية والمرافق والمساحات الخضراء', maps: 'افتح في الخرائط',
    contactSub: 'موقع الجامعة الرسمي وعنوانها', website: 'الموقع الرسمي', address: 'شارع المجموعة الثقافية الرئيسي، الموصل – العراق',
    shareText: 'الدليل التعريفي لجامعة الموصل 2026/2027', copied: 'تم نسخ الرابط', source: 'المصدر: دليل جامعة الموصل التعريفي 2026/2027', digi: 'رقمنة الدليل', digiBy: 'م. م. علي عبد الوهاب الصفار', plus: '+',
  },
  en: {
    title: 'University Prospectus', year: '2026/2027', uni: 'University of Mosul', back: 'Back', badge: 'New',
    cardSub: 'Academic calendar, programs, rankings and numbers — in one guide', open: 'Open the guide',
    coverSub: 'Everything you need to know about the University of Mosul for the coming academic year', start: 'Start the tour', share: 'Share',
    nav: { letter: 'President', calendar: 'Calendar', about: 'About', numbers: 'In numbers', rankings: 'Rankings', role: 'Our role', programs: 'Programs', city: 'Mosul', campus: 'Campuses', contact: 'Contact' },
    eLetter: 'President\'s message', eCalendar: 'Academic calendar', eAbout: 'About UoM', eNumbers: 'UoM in numbers', eRankings: 'UoM rankings 2026',
    eRole: 'Our role', ePrograms: 'Academic programs', eCity: 'Mosul city', eCampus: 'UoM campuses', eContact: 'Contact us',
    president: 'University President', readMore: 'Read the full message', readLess: 'Show less',
    calSub: 'Evening and morning study', now: 'In progress', next: 'Up next', done: 'Ended', daysLeft: '{n} days left', dayN: 'Day {a} of {b}',
    vision: 'Our vision', mission: 'Our mission', objectives: 'Objectives', showObj: 'Show objectives', hideObj: 'Hide objectives',
    rankHint: 'A lower number means a better position.', rankSrc: 'As published in the 2026 prospectus',
    roleH: 'What the university offers', supportH: 'Academic support for students',
    progSearch: 'Search for a program', progEmpty: 'No matching program', programsN: '{n} programs', browseColleges: 'Browse colleges and centers', openProg: 'programs',
    campusSub: 'Over 2,300 hectares of buildings, facilities and green space', maps: 'Open in Maps',
    contactSub: 'The official website and address', website: 'Official website', address: 'Main Cultural Complex Street, Mosul – Iraq',
    shareText: 'University of Mosul Prospectus 2026/2027', copied: 'Link copied', source: 'Source: University of Mosul Prospectus 2026/2027', digi: 'Guide digitization', digiBy: 'Asst. Lect. Ali Abdulwahab Al-Saffar', plus: '+',
  },
};

let lang = 'ar';
let level = 'bsc';
let progQ = '';
const L = () => (lang === 'en' ? 1 : 0);
const tx = a => a[L()];
const u = k => UI[lang][k];
const fmtN = n => new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'ar-IQ').format(n);
const fmtDate = d => new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'ar-IQ', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
const fmtShortDate = d => new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'ar-IQ', { day: 'numeric', month: 'short' }).format(d);
const fmtWd = d => new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'ar-IQ', { weekday: 'long' }).format(d);
const norm = s => String(s).toLowerCase().replace(/[إأآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[ًٌٍَُِّْـ]/g, '');
const parseD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const DAY = 86400000;

const ICON = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8l7.4-4.4M8.3 13.2l7.4 4.4"/></svg>',
  chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.7 3.9 5.7 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.7-3.9-9S9.4 5.7 12 3z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.8-3.8"/></svg>',
  quote: '<svg viewBox="0 0 32 24" aria-hidden="true"><path fill="currentColor" d="M0 24V14.4C0 6.2 4.6 1.2 12 0l1.4 3.4C9.5 4.6 7.6 7 7.4 10.4H13V24H0zm19 0V14.4C19 6.2 23.600 1.200 31 0l1.400 3.400c-3.900 1.200-5.800 3.600-6 7H32V24H19z"/></svg>',
};

/* ---------- بطاقة الرئيسية ---------- */
function homeCard() {
  return `<button class="guide-card" data-go="guide" aria-label="${esc(u('title') + ' ' + u('year'))}">
    <span class="gc-bg" style="background-image:url('guide/hero.webp')"></span>
    <span class="gc-body">
      <span class="gc-badge"><i></i>${esc(u('badge'))} · ${esc(u('year'))}</span>
      <span class="gc-title">${esc(u('title'))}</span>
      <span class="gc-sub">${esc(u('cardSub'))}</span>
      <span class="gc-cta">${esc(u('open'))}<span class="gc-arrow">${ICON.back}</span></span>
    </span>
  </button>`;
}

/* ---------- الأقسام ---------- */
const sec = (id, eyebrow, num, body, title) => `
  <section class="g-sec reveal" id="g-${id}">
    <div class="g-eyebrow"><b>${fmtN(num)}</b><span>${esc(eyebrow)}</span></div>
    ${title ? `<h2 class="g-h">${esc(title)}</h2>` : ''}
    ${body}
  </section>`;

function cover() {
  const stats = [[1967, GUIDE.facts[0].l], [24, GUIDE.facts[1].l], [138, GUIDE.facts[2].l]];
  return `<div class="g-cover">
    <div class="gcv-img" style="background-image:url('guide/hero.webp')"></div>
    <div class="gcv-in">
      <span class="gcv-year">${esc(u('year'))}</span>
      <h1>${esc(u('title'))}</h1>
      <p class="gcv-uni">${esc(u('uni'))}</p>
      <p class="gcv-sub">${esc(u('coverSub'))}</p>
      <div class="gcv-actions">
        <button class="g-btn solid" data-gs="calendar">${esc(u('start'))}</button>
        <button class="g-btn ghost" data-gshare>${ICON.share}<span>${esc(u('share'))}</span></button>
      </div>
      <div class="gcv-stats">${stats.map(([v, l]) => `<div><b>${v === 1967 ? String(v).replace(/\d/g, d => lang === 'en' ? d : '٠١٢٣٤٥٦٧٨٩'[d]) : fmtN(v)}</b><span>${esc(tx(l))}</span></div>`).join('')}</div>
    </div>
  </div>`;
}

function letter() {
  const A = GUIDE.letter;
  const first = A.p.slice(0, 2), rest = A.p.slice(2);
  const name = lang === 'en' ? EN.president : ABOUT.president;
  return sec('letter', u('eLetter'), 1, `
    <div class="g-pres">
      <div class="gp-photo"><img src="guide/president.webp" alt="${esc(name)}" loading="lazy"><div class="gp-cap"><b>${esc(name)}</b><span>${esc(u('president'))}</span></div></div>
      <div class="gp-text">
        <span class="gp-q">${ICON.quote}</span>
        <p class="gp-to">${esc(tx(A.to))}</p>
        ${first.map(p => `<p>${esc(tx(p))}</p>`).join('')}
        <div class="gp-more" id="gp-more" hidden>${rest.map(p => `<p>${esc(tx(p))}</p>`).join('')}</div>
        <button class="g-link" data-gtoggle="gp-more" data-more="${esc(u('readMore'))}" data-less="${esc(u('readLess'))}" aria-expanded="false">${esc(u('readMore'))}</button>
      </div>
    </div>`);
}

function calendar() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const ev = GUIDE.calendar.map(e => ({ ...e, a: parseD(e.from), b: parseD(e.to) }));
  const nextIdx = ev.findIndex(e => e.a > today);
  const items = ev.map((e, i) => {
    const cur = today >= e.a && today <= e.b;
    const done = today > e.b;
    const isNext = !cur && i === nextIdx && !ev.some(x => today >= x.a && today <= x.b);
    const single = +e.a === +e.b;
    const date = single ? `${fmtWd(e.a)}${lang === 'en' ? ',' : '،'} ${fmtDate(e.a)}` : `${fmtShortDate(e.a)} — ${fmtDate(e.b)}`;
    let prog = '';
    if (cur && !single) {
      const total = Math.round((e.b - e.a) / DAY) + 1, d = Math.round((today - e.a) / DAY) + 1;
      prog = `<div class="tl-prog"><span style="width:${Math.min(100, Math.round(d / total * 100))}%"></span></div>
        <div class="tl-prog-t">${esc(u('dayN').replace('{a}', fmtN(d)).replace('{b}', fmtN(total)))} · ${esc(u('daysLeft').replace('{n}', fmtN(total - d)))}</div>`;
    }
    const pill = cur ? `<span class="pill now">${esc(u('now'))}</span>` : isNext ? `<span class="pill next">${esc(u('next'))}</span>` : done ? `<span class="pill done">${esc(u('done'))}</span>` : '';
    return `<li class="tl-item ${cur ? 'cur' : ''} ${done ? 'past' : ''} ${isNext ? 'nxt' : ''}">
      <span class="tl-dot"></span>
      <div class="tl-card">
        <div class="tl-top"><span class="tl-date">${esc(date)}</span>${pill}</div>
        <h3>${esc(tx(e.t))}</h3>
        ${e.n ? `<p>${esc(tx(e.n))}</p>` : ''}
        ${prog}
      </div>
    </li>`;
  }).join('');
  return sec('calendar', u('eCalendar'), 2, `<p class="g-lead">${esc(u('calSub'))} · ${esc(u('year'))}</p><ol class="tl">${items}</ol>`);
}

function about() {
  const A = GUIDE;
  return sec('about', u('eAbout'), 3, `
    <div class="g-about">
      <img class="ga-img" src="guide/about.webp" alt="" loading="lazy">
      <div class="ga-text">${A.about.map(p => `<p>${esc(tx(p))}</p>`).join('')}</div>
    </div>
    <div class="g-vm">
      <div class="vm vision"><h3>${esc(u('vision'))}</h3><p>${esc(tx(A.vision))}</p></div>
      <div class="vm mission"><h3>${esc(u('mission'))}</h3><p>${esc(tx(A.mission))}</p></div>
    </div>
    <button class="g-link wide" data-gtoggle="g-obj" data-more="${esc(u('showObj'))}" data-less="${esc(u('hideObj'))}" aria-expanded="false">${esc(u('showObj'))}</button>
    <ol class="g-obj" id="g-obj" hidden>${A.objectives.map((o, i) => `<li><b>${fmtN(i + 1)}</b><span>${esc(tx(o))}</span></li>`).join('')}</ol>`);
}

function numbers() {
  return sec('numbers', u('eNumbers'), 4, `
    <div class="g-nums">${GUIDE.numbers.map(n => `
      <div class="nm ${n.hot ? 'hot' : ''}"><b data-count="${n.v}">${fmtN(n.v)}</b><span>${esc(tx(n.l))}</span></div>`).join('')}</div>`);
}

function rankings() {
  return sec('rankings', u('eRankings'), 5, `
    <p class="g-lead">${esc(u('rankHint'))}</p>
    ${GUIDE.rankings.map(g => `
      <div class="rk-group"><h3>${esc(tx(g.g))}</h3>
        <div class="rk-grid">${g.items.map(i => `<div class="rk"><b dir="ltr">${esc(lang === 'en' ? i.v : i.v.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]))}</b><span>${esc(tx(i.l))}</span></div>`).join('')}</div>
      </div>`).join('')}
    <p class="g-note">${esc(u('rankSrc'))}</p>`);
}

function role() {
  const card = (it, i) => `<details class="g-acc"><summary><span class="no">${fmtN(i + 1)}</span><span class="tt">${esc(tx(it[0]))}</span><span class="chev">${ICON.chev}</span></summary><p>${esc(tx(it[1]))}</p></details>`;
  return sec('role', u('eRole'), 6, `
    <h3 class="g-sub">${esc(u('roleH'))}</h3>
    <div class="g-accs">${GUIDE.role.map(card).join('')}</div>
    <h3 class="g-sub">${esc(u('supportH'))}</h3>
    <div class="g-accs">${GUIDE.support.map(card).join('')}</div>`);
}

/* البرامج */
function progList(levelId) {
  const q = norm(progQ.trim());
  const out = [];
  const C = GUIDE.colleges;
  const groupsOrder = ['med', 'eng', 'sci', 'hum', 'edu'];
  const ids = levelId === 'bsc' ? Object.keys(GUIDE.bsc) : GUIDE[levelId];
  groupsOrder.forEach(g => {
    const rows = ids.filter(id => C[id][0] === g).map(id => {
      const col = C[id], name = col[1 + L()];
      const progs = levelId === 'bsc' ? GUIDE.bsc[id] : null;
      let shown = progs, hit = true;
      if (q) {
        const nameHit = norm(col[1]).includes(q) || norm(col[2]).includes(q);
        if (progs && progs.length) { const m = progs.filter(p => norm(p[0]).includes(q) || norm(p[1]).includes(q)); shown = nameHit ? progs : m; hit = nameHit || m.length > 0; }
        else hit = nameHit;
        if (!hit) return null;
      }
      return { id, name, progs: shown, count: progs ? progs.length : 0, single: levelId === 'bsc' && progs.length === 0 };
    }).filter(Boolean);
    if (rows.length) out.push({ g, rows });
  });
  return out;
}

function programsBody() {
  const groups = progList(level);
  if (!groups.length) return `<div class="g-empty">${esc(u('progEmpty'))}</div>`;
  const open = !!progQ.trim();
  return groups.map(({ g, rows }) => `
    <div class="pg-group"><h4>${esc(tx(GUIDE.groups[g]))}</h4>
    ${rows.map(r => r.progs && !r.single
      ? `<details class="pg" ${open ? 'open' : ''}><summary><span class="tt">${esc(r.name)}</span><span class="ct">${esc(u('programsN').replace('{n}', fmtN(r.count)))}</span><span class="chev">${ICON.chev}</span></summary>
          <ul class="pg-list">${r.progs.map(p => `<li>${esc(tx(p))}</li>`).join('')}</ul></details>`
      : `<div class="pg single"><span class="tt">${esc(r.name)}</span></div>`).join('')}
    </div>`).join('');
}

function programs() {
  return sec('programs', u('ePrograms'), 7, `
    <div class="g-seg" role="tablist">${GUIDE.levels.map(l => `<button role="tab" class="${l.id === level ? 'on' : ''}" data-glevel="${l.id}" aria-selected="${l.id === level}">${esc(tx(l.n))}</button>`).join('')}</div>
    <label class="g-search">${ICON.search}<input id="g-psearch" type="search" value="${esc(progQ)}" placeholder="${esc(u('progSearch'))}" autocomplete="off"></label>
    <div id="g-pbody">${programsBody()}</div>
    <button class="g-btn solid wide" data-go="units">${esc(u('browseColleges'))}</button>`);
}

function city() {
  const C = GUIDE.city;
  return sec('city', u('eCity'), 8, `
    <p class="g-lead strong">${esc(tx(C.h))}</p>
    <div class="g-gallery" tabindex="0">${C.photos.map(([src, cap]) => `<figure><img src="${src}" alt="${esc(tx(cap))}" loading="lazy"><figcaption>${esc(tx(cap))}</figcaption></figure>`).join('')}</div>
    <div class="g-prose">${C.p.map(p => `<p>${esc(tx(p))}</p>`).join('')}</div>`);
}

function campus() {
  return sec('campus', u('eCampus'), 9, `
    <p class="g-lead">${esc(u('campusSub'))}</p>
    <div class="g-campus">${GUIDE.campuses.map(c => `<figure><img src="${c.img}" alt="${esc(tx(c.n))}" loading="lazy"><figcaption>${ICON.pin}<span>${esc(tx(c.n))}</span></figcaption></figure>`).join('')}</div>`);
}

function contact() {
  const q = encodeURIComponent('University of Mosul');
  return sec('contact', u('eContact'), 10, `
    <div class="g-contact">
      <img src="icons/icon-192.png" alt="" class="gc-logo">
      <h3>${esc(u('uni'))}</h3>
      <p>${esc(u('contactSub'))}</p>
      <div class="gct-rows">
        <a href="https://uomosul.edu.iq/${lang === 'en' ? 'en/' : ''}" target="_blank" rel="noopener">${ICON.globe}<span>${esc(u('website'))}</span><em dir="ltr">uomosul.edu.iq</em></a>
        <a href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">${ICON.pin}<span>${esc(u('address'))}</span><em>${esc(u('maps'))}</em></a>
      </div>
    </div>
    <div class="g-digi"><span>${esc(u('digi'))}</span><b>${esc(u('digiBy'))}</b></div>
    <footer class="g-foot">${esc(u('source'))}</footer>`);
}

/* ---------- التجميع ---------- */
function navBar() {
  const keys = ['letter', 'calendar', 'about', 'numbers', 'rankings', 'role', 'programs', 'city', 'campus', 'contact'];
  return `<div class="g-nav" id="g-nav"><div class="g-nav-in">
    <button class="g-back" data-go="home" aria-label="${esc(u('back'))}">${ICON.back}</button>
    <div class="g-chips">${keys.map(k => `<button data-gs="${k}">${esc(UI[lang].nav[k])}</button>`).join('')}</div>
  </div></div>`;
}

function render(newLang) {
  if (newLang) lang = newLang === 'en' ? 'en' : 'ar';
  const hc = $('#guide-card-slot'); if (hc) hc.innerHTML = homeCard();
  const root = $('#v-guide'); if (!root) return;
  const keep = window.scrollY;
  root.innerHTML = navBar() + cover() + letter() + calendar() + about() + numbers() + rankings() + role() + programs() + city() + campus() + contact();
  setup(root);
  if (root.classList.contains('on')) window.scrollTo({ top: keep });
}

/* ---------- التفاعل ---------- */
let io, spy;
function setup(root) {
  // ظهور تدريجي + عدّاد الأرقام
  if (io) io.disconnect();
  if (!('IntersectionObserver' in window)) { $$('.reveal', root).forEach(el => el.classList.add('in')); return syncTop(); }
  if (!reduce) root.classList.add('g-ready');
  io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    $$('[data-count]', e.target).forEach(countUp);
  }), { threshold: 0.12 });
  $$('.reveal', root).forEach(el => io.observe(el));
  if (reduce) $$('.reveal', root).forEach(el => el.classList.add('in'));
  syncTop();
  onScroll();
}
function countUp(el) {
  if (reduce || el.dataset.done) return;
  el.dataset.done = '1';
  const end = +el.dataset.count, t0 = performance.now(), dur = 1100;
  const step = t => {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = fmtN(Math.round(end * e));
    if (k < 1) requestAnimationFrame(step);
  };
  el.textContent = fmtN(0); requestAnimationFrame(step);
}
function syncTop() {
  const h = $('header.top'); if (h) document.documentElement.style.setProperty('--top-h', h.offsetHeight + 'px');
}
function onScroll() {
  const root = $('#v-guide'); if (!root || !root.classList.contains('on')) return;
  const secs = $$('.g-sec', root); if (!secs.length) return;
  const line = ($('header.top')?.offsetHeight || 60) + 90;
  let cur = null;
  secs.forEach(s => { if (s.getBoundingClientRect().top <= line) cur = s.id.slice(2); });
  $$('.g-chips button', root).forEach(b => {
    const on = b.dataset.gs === cur; b.classList.toggle('on', on);
    if (on && !b.dataset.seen) { b.dataset.seen = '1'; b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); }
    if (!on) delete b.dataset.seen;
  });
}
function scrollToSec(id) {
  const el = $('#g-' + id); if (!el) return;
  const off = ($('header.top')?.offsetHeight || 60) + ($('#g-nav')?.offsetHeight || 48) + 6;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - off, behavior: reduce ? 'auto' : 'smooth' });
}
async function shareGuide() {
  const url = location.href.split('#')[0];
  const data = { title: u('title') + ' ' + u('year'), text: u('shareText'), url };
  try {
    if (navigator.share) { await navigator.share(data); return; }
    await navigator.clipboard.writeText(url);
    window.dispatchEvent(new CustomEvent('guide-toast', { detail: u('copied') }));
  } catch (e) { /* أُلغيت المشاركة */ }
}

function bind() {
  const root = $('#v-guide'); if (!root) return;
  root.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.gs) return scrollToSec(d.gs);
    if ('gshare' in d) return shareGuide();
    if (d.gtoggle) {
      const box = document.getElementById(d.gtoggle); const open = box.hidden;
      box.hidden = !open; b.textContent = open ? d.less : d.more; b.setAttribute('aria-expanded', String(open));
      return;
    }
    if (d.glevel) {
      level = d.glevel;
      $$('.g-seg button', root).forEach(x => { const on = x.dataset.glevel === level; x.classList.toggle('on', on); x.setAttribute('aria-selected', String(on)); });
      $('#g-pbody').innerHTML = programsBody();
    }
  });
  let t; root.addEventListener('input', e => {
    if (e.target.id !== 'g-psearch') return;
    clearTimeout(t); t = setTimeout(() => { progQ = e.target.value; $('#g-pbody').innerHTML = programsBody(); }, 120);
  });
  window.addEventListener('scroll', () => { if (!onScroll.q) { onScroll.q = true; requestAnimationFrame(() => { onScroll.q = false; onScroll(); }); } }, { passive: true });
  window.addEventListener('resize', syncTop);
}

window.GUIDE_UI = { render, bind, scrollToSec, onScroll };
})();
