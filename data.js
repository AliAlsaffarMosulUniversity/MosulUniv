/* بيانات تطبيق جامعة الموصل
   المصدر: الموقع الرسمي uomosul.edu.iq — جُمعت بتاريخ 1 تشرين الأول 2026 */

const SITE = 'https://uomosul.edu.iq/';

const GROUPS = [
  { id: 'med',  name: 'الكليات الطبية',        kind: 'college' },
  { id: 'eng',  name: 'الكليات الهندسية',      kind: 'college' },
  { id: 'sci',  name: 'كليات العلوم الصرفة',    kind: 'college' },
  { id: 'hum',  name: 'كليات العلوم الإنسانية', kind: 'college' },
  { id: 'rc',   name: 'المراكز البحثية',       kind: 'center' },
  { id: 'sc',   name: 'المراكز الخدمية',       kind: 'center' },
];

/* slug = مسار الموقع الفرعي على uomosul.edu.iq
   keys = كلمات تُستخدم لربط أخبار الموقع الرئيسي بالجهة */
const UNITS = [
  { id: 'medicine', group: 'med', name: 'كلية الطب', keys: ['كلية الطب ', 'كلية الطب،', 'كلية الطب.'] },
  { id: 'pharmacy', group: 'med', name: 'كلية الصيدلة', keys: ['الصيدلة'] },
  { id: 'dentistry', group: 'med', name: 'كلية طب الأسنان', keys: ['طب الأسنان', 'طب الاسنان'] },
  { id: 'veterinarymedicine', group: 'med', name: 'كلية الطب البيطري', keys: ['الطب البيطري'] },
  { id: 'nursing', group: 'med', name: 'كلية التمريض', keys: ['التمريض'] },
  { id: 'batoolmedicine', group: 'med', name: 'كلية طب البتول', keys: ['البتول'] },

  { id: 'engineering', group: 'eng', name: 'كلية الهندسة', keys: ['كلية الهندسة'] },
  { id: 'petroleumengineering', group: 'eng', name: 'كلية هندسة النفط والتعدين', keys: ['النفط والتعدين'] },
  { id: 'agriculture', group: 'eng', name: 'كلية الزراعة والغابات', keys: ['الزراعة والغابات'] },

  { id: 'science', group: 'sci', name: 'كلية العلوم', keys: ['كلية العلوم '] },
  { id: 'computerscience', group: 'sci', name: 'كلية علوم الحاسبات والرياضيات', keys: ['الحاسبات والرياضيات', 'علوم الحاسوب والرياضيات'] },
  { id: 'education', group: 'sci', name: 'كلية التربية للعلوم الصرفة', keys: ['للعلوم الصرفة'] },
  { id: 'environmentalscience', group: 'sci', name: 'كلية العلوم البيئية', keys: ['العلوم البيئية'] },
  { id: 'physicaleducation', group: 'sci', name: 'كلية التربية البدنية وعلوم الرياضة', keys: ['التربية البدنية'] },
  { id: 'finearts', group: 'sci', name: 'كلية الفنون الجميلة', keys: ['الفنون الجميلة'] },
  { id: 'administrationeconomic', group: 'sci', name: 'كلية الإدارة والاقتصاد', keys: ['الإدارة والاقتصاد', 'الادارة والاقتصاد'] },
  { id: 'tourismscience', group: 'sci', name: 'كلية العلوم السياحية', keys: ['العلوم السياحية'] },

  { id: 'arts', group: 'hum', name: 'كلية الآداب', keys: ['كلية الآداب', 'كلية الاداب'] },
  { id: 'educationhc', group: 'hum', name: 'كلية التربية للعلوم الإنسانية', keys: ['للعلوم الإنسانية', 'للعلوم الانسانية'] },
  { id: 'rights', group: 'hum', name: 'كلية الحقوق', keys: ['الحقوق'] },
  { id: 'basiceducation', group: 'hum', name: 'كلية التربية الأساسية', keys: ['التربية الأساسية', 'التربية الاساسية'] },
  { id: 'islamicscience', group: 'hum', name: 'كلية العلوم الإسلامية', keys: ['العلوم الإسلامية', 'العلوم الاسلامية'] },
  { id: 'politicalscience', group: 'hum', name: 'كلية العلوم السياسية', keys: ['العلوم السياسية'] },
  { id: 'womeneducation', group: 'hum', name: 'كلية التربية للبنات', keys: ['التربية للبنات'] },
  { id: 'archeology', group: 'hum', name: 'كلية الآثار', keys: ['كلية الآثار', 'كلية الاثار'] },

  { id: 'watercenter', group: 'rc', name: 'مركز بحوث السدود والموارد المائية', keys: ['السدود'] },
  { id: 'regionalstudiescenter', group: 'rc', name: 'مركز الدراسات الإقليمية', keys: ['الدراسات الإقليمية', 'الدراسات الاقليمية'] },
  { id: 'afcar', group: 'rc', name: 'مركز بحوث الزراعة الجافة والحافظة', keys: ['الزراعة الجافة'] },
  { id: 'peacebuilding', group: 'rc', name: 'مركز بناء السلام والتعايش السلمي', keys: ['بناء السلام'] },
  { id: 'remotesensingcenter', group: 'rc', name: 'مركز التحسس النائي', keys: ['التحسس النائي'] },
  { id: 'environmentcenter', group: 'rc', name: 'مركز بحوث البيئة', keys: ['مركز بحوث البيئة'] },
  { id: 'mosulstudiescenter', group: 'rc', name: 'مركز دراسات الموصل', keys: ['مركز دراسات الموصل'] },
  { id: 'medicalcenter', group: 'rc', name: 'المراكز الطبية البحثية والعلاجية', keys: ['المراكز الطبية'] },
  { id: 'psychologicalcenter', group: 'rc', name: 'مركز الأبحاث التربوية والنفسية', keys: ['التربوية والنفسية'] },

  { id: 'continuingeducationcenter', group: 'sc', name: 'مركز التعليم المستمر', keys: ['التعليم المستمر'] },
  { id: 'computercenter', group: 'sc', name: 'مركز الحاسبة الإلكترونية', keys: ['الحاسبة الإلكترونية', 'الحاسبة الالكترونية'] },
].map(u => ({ ...u, base: SITE + u.id + '/' }));

/* الجهة الافتراضية لأخبار الموقع الرئيسي */
const HQ = { id: 'uom', group: null, name: 'رئاسة الجامعة', base: SITE, keys: [] };

const SERVICES = [
  { name: 'نظام معلومات الطلبة', note: 'درجات الطالب وبياناته', url: 'http://sis.uomosul.edu.iq/', icon: 'student' },
  { name: 'منصة الباحثين', note: 'ملفات التدريسيين وبحوثهم', url: 'https://ris.uomosul.edu.iq/ar', icon: 'research' },
  { name: 'نظام السيرة الذاتية', note: 'السير الذاتية للتدريسيين', url: 'https://cv.uomosul.edu.iq/', icon: 'cv' },
  { name: 'بريد منتسبي الجامعة', note: 'البريد الرسمي للموظفين', url: 'https://mail.google.com/a/uomosul.edu.iq', icon: 'mail' },
  { name: 'بريد طلبة الجامعة', note: 'البريد الرسمي للطلبة', url: 'https://mail.google.com/a/student.uomosul.edu.iq', icon: 'mail' },
  { name: 'تسجيل الدراسات الأولية', note: 'التقديم والقبول', url: 'https://admission.uomosul.edu.iq/login', icon: 'enroll' },
  { name: 'تسجيل الدراسات العليا', note: 'الماجستير والدكتوراه', url: 'http://pgadmission.uomosul.edu.iq/', icon: 'enroll' },
  { name: 'شهادة كفاءة الحاسوب', note: 'التسجيل والنتائج', url: 'http://computercertificates.uomosul.edu.iq', icon: 'cert' },
  { name: 'نظام الشكاوى', note: 'تقديم شكوى أو استفسار', url: 'https://inquiry.uomosul.edu.iq', icon: 'inbox' },
  { name: 'تخصيص دور وشقق الجامعة', note: 'وحدة دار الجامعة', url: 'https://houseunit.uomosul.edu.iq/', icon: 'house' },
  { name: 'نظام الباجات', note: 'باجات دخول السيارات', url: 'https://car-badge.uomosul.edu.iq', icon: 'car' },
  { name: 'نظام الطلبة الوزاري', note: 'وزارة التعليم العالي', url: 'https://sis.mohesr.gov.iq/', icon: 'gov' },
  { name: 'الموارد البشرية الوزاري', note: 'وزارة التعليم العالي', url: 'https://hr.mohesr.gov.iq/', icon: 'gov' },
  { name: 'ادرس في العراق', note: 'بوابة الطلبة الدوليين', url: 'https://studyiniraq.scrd-gate.gov.iq/home', icon: 'globe' },
];

const ABOUT = {
  president: 'أ.د. وحيد محمود الإبراهيمي',
  presidentTitle: 'رئيس جامعة الموصل',
  presidentPhoto: SITE + 'wp-content/uploads/2025/09/photo_2025-09-22_20-16-59.jpg',
  presidentCV: 'https://cv.uomosul.edu.iq/dr.waheedramo/ar',
  presidentEmail: 'president@uomosul.edu.iq',
  presidentWordUrl: SITE + '%d9%83%d9%84%d9%85%d8%a9-%d8%a7%d9%84%d8%b3%d9%8a%d8%af-%d8%b1%d8%a6%d9%8a%d8%b3-%d8%a7%d9%84%d8%ac%d8%a7%d9%85%d8%b9%d8%a9/',
  founded: 1967,
  address: 'شارع المجموعة الثقافية الرئيسي، الموصل – العراق',
  postal: '41002',
  calendarUrl: SITE + '%d8%a7%d9%84%d8%aa%d9%82%d9%88%d9%8a%d9%85-%d8%a7%d9%84%d8%ac%d8%a7%d9%85%d8%b9%d9%8a-%d9%84%d9%84%d8%b9%d8%a7%d9%85-2026-2027/',
  contactUrl: SITE + '%d8%a7%d8%aa%d8%b5%d9%84_%d8%a8%d9%86%d8%a7/',
  social: [
    { name: 'فيسبوك', url: 'https://www.facebook.com/UniversityofMos/' },
    { name: 'إكس', url: 'https://x.com/UniversityofMos' },
    { name: 'يوتيوب', url: 'https://www.youtube.com/channel/UCyuMTjuWBR5mTxjw_VkXIdg' },
    { name: 'إنستغرام', url: 'https://www.instagram.com/universityofmos/' },
  ],
};

/* نسخة محفوظة تُعرض عند تعذّر الاتصال بالموقع.
   كل العناوين والروابط منقولة كما هي من الموقع الرسمي. */
const SNAPSHOT_DATE = '2026-10-01T22:00:00+03:00';
const SNAPSHOT = [
  { unit: 'uom', date: '2026-10-01T12:00:00', title: '#المؤتمر_العراقي_الثالث_للتعليم_العالي_2026',
    link: SITE + '%d8%a7%d9%84%d9%85%d8%a4%d8%aa%d9%85%d8%b1_%d8%a7%d9%84%d8%b9%d8%b1%d8%a7%d9%82%d9%8a_%d8%a7%d9%84%d8%ab%d8%a7%d9%84%d8%ab_%d9%84%d9%84%d8%aa%d8%b9%d9%84%d9%8a%d9%85_%d8%a7%d9%84%d8%b9%d8%a7%d9%84/',
    img: SITE + 'wp-content/uploads/2026/09/FB_IMG_1790679113535.jpg' },
  { unit: 'uom', date: '2026-10-01T11:00:00', title: 'من يمكنه المشاركة ؟ في المؤتمر العراقي الثالث للتعليم العالي 2026',
    link: SITE + '%d9%85%d9%86-%d9%8a%d9%85%d9%83%d9%86%d9%87-%d8%a7%d9%84%d9%85%d8%b4%d8%a7%d8%b1%d9%83%d8%a9-%d8%9f-%d9%81%d9%8a-%d8%a7%d9%84%d9%85%d8%a4%d8%aa%d9%85%d8%b1-%d8%a7%d9%84%d8%b9%d8%b1%d8%a7%d9%82%d9%8a/',
    img: SITE + 'wp-content/uploads/2026/09/FB_IMG_1790679113535.jpg' },
  { unit: 'uom', date: '2026-10-01T10:00:00', title: 'جامعة الموصل تعزز تنظيم وإدارة البريد الإلكتروني الرسمي',
    link: SITE + '00-601/', img: SITE + 'wp-content/uploads/2026/10/1-scaled.jpg' },
  { unit: 'uom', date: '2026-10-01T09:00:00', title: 'جامعة الموصل تسهم في بحث دولي يدعم تطوير الروبوتات العاملة بالذكاء الاصطناعي للمساعدة ورعاية الإنسان',
    link: SITE + '00-600/', img: SITE + 'wp-content/uploads/2026/10/%D8%A8%D8%AD%D8%AB-%D9%85%D8%AD%D9%85%D8%AF-%D9%8A%D8%A7%D8%B3%D9%8A%D9%86.png' },
  { unit: 'uom', date: '2026-09-30T19:00:00', title: 'اثنتان وثلاثون جامعة عراقية في تصنيف التايمز العالمي 2027',
    link: SITE + '%d8%a7%d8%ab%d9%86%d8%aa%d8%a7%d9%86-%d9%88%d8%ab%d9%84%d8%a7%d8%ab%d9%88%d9%86-%d8%ac%d8%a7%d9%85%d8%b9%d8%a9-%d8%b9%d8%b1%d8%a7%d9%82%d9%8a%d8%a9-%d9%81%d9%8a-%d8%aa%d8%b5%d9%86%d9%8a%d9%81-%d8%a7/',
    img: SITE + 'wp-content/uploads/2026/09/IMG_20260930_191153_120.jpg' },
  { unit: 'uom', date: '2026-09-30T18:00:00', title: '#يوم_السيادة_الوطني_30_أيلول_2026',
    link: SITE + '%d9%8a%d9%88%d9%85_%d8%a7%d9%84%d8%b3%d9%8a%d8%a7%d8%af%d8%a9_%d8%a7%d9%84%d9%88%d8%b7%d9%86%d9%8a_30_%d8%a3%d9%8a%d9%84%d9%88%d9%84_2026-2/',
    img: SITE + 'wp-content/uploads/2026/09/IMG_20260930_190824_325.jpg' },

  { unit: 'administrationeconomic', date: '2026-10-01T10:00:00', title: 'السيادة عنوان عزّنا ومستقبلنا… نجدد العهد لعراقٍ عزيزٍ وسيادةٍ راسخة',
    link: SITE + 'administrationeconomic/%d8%a7%d9%84%d8%b3%d9%8a%d8%a7%d8%af%d8%a9-%d8%b9%d9%86%d9%88%d8%a7%d9%86-%d8%b9%d8%b2%d9%91%d9%86%d8%a7-%d9%88%d9%85%d8%b3%d8%aa%d9%82%d8%a8%d9%84%d9%86%d8%a7-%d9%86%d8%ac%d8%af%d8%af-%d8%a7%d9%84/',
    img: SITE + 'administrationeconomic/wp-content/uploads/sites/24/2026/10/img_1790847668321.jpg' },
  { unit: 'administrationeconomic', date: '2026-09-28T13:00:00', title: 'مجلس كلية الإدارة والاقتصاد بجامعة الموصل يناقش خطة القبول للدراسات العليا والإجازات الدراسية للعام 2027–2028',
    link: SITE + 'administrationeconomic/%d9%85%d8%ac%d9%84%d8%b3-%d9%83%d9%84%d9%8a%d8%a9-%d8%a7%d9%84%d8%a5%d8%af%d8%a7%d8%b1%d8%a9-%d9%88%d8%a7%d9%84%d8%a7%d9%82%d8%aa%d8%b5%d8%a7%d8%af-%d8%a8%d8%ac%d8%a7%d9%85%d8%b9%d8%a9-%d8%a7%d9%84-9/',
    img: SITE + 'administrationeconomic/wp-content/uploads/sites/24/2026/09/processed_1790617068136.png' },
  { unit: 'administrationeconomic', date: '2026-09-28T11:00:00', title: 'قسم إدارة التسويق في كلية الإدارة والاقتصاد ينظم ورشة تثقيفية حول دليل إدارة الامتحانات الجامعية للدراسات الأولية',
    link: SITE + 'administrationeconomic/%d9%82%d8%b3%d9%85-%d8%a5%d8%af%d8%a7%d8%b1%d8%a9-%d8%a7%d9%84%d8%aa%d8%b3%d9%88%d9%8a%d9%82-%d9%81%d9%8a-%d9%83%d9%84%d9%8a%d8%a9-%d8%a7%d9%84%d8%a5%d8%af%d8%a7%d8%b1%d8%a9-%d9%88%d8%a7%d9%84%d8%a7-9/',
    img: SITE + 'administrationeconomic/wp-content/uploads/sites/24/2026/09/processed_1790606293850.png' },
  { unit: 'administrationeconomic', date: '2026-09-28T09:00:00', title: 'إعلان مهم إلى الطلبة المقبولين ضمن “قبول الاحتياط” للدراسات العليا في كلية الإدارة والاقتصاد بجامعة الموصل',
    link: SITE + 'administrationeconomic/%d8%a5%d8%b9%d9%84%d8%a7%d9%86-%d9%85%d9%87%d9%85-%d8%a5%d9%84%d9%89-%d8%a7%d9%84%d8%b7%d9%84%d8%a8%d8%a9-%d8%a7%d9%84%d9%85%d9%82%d8%a8%d9%88%d9%84%d9%8a%d9%86-%d8%b6%d9%85%d9%86-%d9%82%d8%a8%d9%88/',
    img: SITE + 'administrationeconomic/wp-content/uploads/sites/24/2026/09/img_1787482349569.jpg' },
  { unit: 'administrationeconomic', date: '2026-09-27T14:00:00', title: 'شراكة أكاديمية جديدة نحو التميز… كلية الإدارة والاقتصاد بجامعة الموصل توقّع اتفاقية تعاون مع كلية اليرموك الجامعة دعماً لجودة التعليم والتنمية المستدامة',
    link: SITE + 'administrationeconomic/%d8%b4%d8%b1%d8%a7%d9%83%d8%a9-%d8%a3%d9%83%d8%a7%d8%af%d9%8a%d9%85%d9%8a%d8%a9-%d8%ac%d8%af%d9%8a%d8%af%d8%a9-%d9%86%d8%ad%d9%88-%d8%a7%d9%84%d8%aa%d9%85%d9%8a%d8%b2-%d9%83%d9%84%d9%8a%d8%a9/',
    img: SITE + 'administrationeconomic/wp-content/uploads/sites/24/2026/09/compressed_1790532861036.jpg' },
  { unit: 'administrationeconomic', date: '2026-09-27T12:00:00', title: 'بالتعاون مع رئاسة جامعة الموصل… كلية الإدارة والاقتصاد تطلق دورة تدريبية في المحاسبة الرقمية والتدقيق المالي للمشاريع الاستثمارية',
    link: SITE + 'administrationeconomic/%d8%a8%d8%a7%d9%84%d8%aa%d8%b9%d8%a7%d9%88%d9%86-%d9%85%d8%b9-%d8%b1%d8%a6%d8%a7%d8%b3%d8%a9-%d8%ac%d8%a7%d9%85%d8%b9%d8%a9-%d8%a7%d9%84%d9%85%d9%88%d8%b5%d9%84-%d9%83%d9%84%d9%8a%d8%a9-%d8%a7/',
    img: SITE + 'administrationeconomic/wp-content/uploads/sites/24/2026/09/processed_1790519178534.png' },
  { unit: 'administrationeconomic', date: '2026-09-27T10:00:00', title: 'قسم نظم المعلومات الإدارية في كلية الإدارة والاقتصاد بجامعة الموصل يناقش بحث الدبلوم العالي عن العوامل المؤثرة في تبني الإدارة الذكية',
    link: SITE + 'administrationeconomic/%d9%82%d8%b3%d9%85-%d9%86%d8%b8%d9%85-%d8%a7%d9%84%d9%85%d8%b9%d9%84%d9%88%d9%85%d8%a7%d8%aa-%d8%a7%d9%84%d8%a5%d8%af%d8%a7%d8%b1%d9%8a%d8%a9-%d9%81%d9%8a-%d9%83%d9%84%d9%8a%d8%a9-%d8%a7%d9%84-16/',
    img: SITE + 'administrationeconomic/wp-content/uploads/sites/24/2026/09/compressed_1790518612104-scaled.jpg' },
];

/* أنواع النشاطات — الترتيب مهم: أول نوع تتطابق كلماته يُعتمد */
const TYPES = [
  { id: 'council',   name: 'مجلس واجتماع', words: ['مجلس', 'اجتماع', 'يستقبل', 'تستقبل', 'استقبل', 'زيارة', 'يزور', 'يلتقي'] },
  { id: 'defense',   name: 'مناقشة',       words: ['مناقشة', 'يناقش', 'تناقش', 'رسالة الماجستير', 'أطروحة', 'اطروحة', 'بحث الدبلوم'] },
  { id: 'workshop',  name: 'ورشة',         words: ['ورشة', 'ورش '] },
  { id: 'seminar',   name: 'ندوة',         words: ['ندوة', 'حلقة نقاشية', 'سمنار', 'سيمنار', 'حلقة علمية'] },
  { id: 'course',    name: 'دورة',         words: ['دورة', 'برنامج تدريبي', 'برنامج التدريب', 'تدريبية'] },
  { id: 'conf',      name: 'مؤتمر',        words: ['مؤتمر', 'ملتقى', 'المؤتمر'] },
  { id: 'lecture',   name: 'محاضرة',       words: ['محاضرة'] },
  { id: 'agreement', name: 'اتفاقية',      words: ['اتفاقية', 'مذكرة تفاهم', 'شراكة', 'توأمة'] },
  { id: 'campaign',  name: 'حملة ومبادرة', words: ['حملة', 'مبادرة', 'تطوعي', 'تطوعية'] },
  { id: 'event',     name: 'احتفالية',     words: ['احتفال', 'احتفالية', 'مهرجان', 'معرض', 'بطولة', 'تخرج', 'تكريم'] },
  { id: 'notice',    name: 'إعلان',        words: ['إعلان', 'اعلان', 'تنويه', 'تعلن'] },
];
const TYPE_OTHER = { id: 'other', name: 'خبر' };

/* الأسماء الإنجليزية — تُستخدم عند التبديل إلى English */
const EN = {
  hq: 'University Presidency',
  units: {
    medicine: 'College of Medicine', pharmacy: 'College of Pharmacy', dentistry: 'College of Dentistry',
    veterinarymedicine: 'College of Veterinary Medicine', nursing: 'College of Nursing', batoolmedicine: 'Al-Batool College of Medicine',
    engineering: 'College of Engineering', petroleumengineering: 'College of Petroleum and Mining Engineering', agriculture: 'College of Agriculture and Forestry',
    science: 'College of Science', computerscience: 'College of Computer Science and Mathematics', education: 'College of Education for Pure Sciences',
    environmentalscience: 'College of Environmental Science', physicaleducation: 'College of Physical Education and Sport Sciences', finearts: 'College of Fine Arts',
    administrationeconomic: 'College of Administration and Economics', tourismscience: 'College of Tourism Sciences',
    arts: 'College of Arts', educationhc: 'College of Education for Humanities', rights: 'College of Law', basiceducation: 'College of Basic Education',
    islamicscience: 'College of Islamic Sciences', politicalscience: 'College of Political Science', womeneducation: 'College of Education for Women', archeology: 'College of Archaeology',
    watercenter: 'Dams and Water Resources Research Center', regionalstudiescenter: 'Regional Studies Center', afcar: 'Dryland and Conservation Agriculture Research Center',
    peacebuilding: 'Peacebuilding and Coexistence Center', remotesensingcenter: 'Remote Sensing Center', environmentcenter: 'Environmental Research Center',
    mosulstudiescenter: 'Mosul Studies Center', medicalcenter: 'Medical Research and Treatment Centers', psychologicalcenter: 'Educational and Psychological Research Center',
    continuingeducationcenter: 'Continuing Education Center', computercenter: 'Computer Center',
  },
  groups: { med: 'Medical colleges', eng: 'Engineering colleges', sci: 'Pure science colleges', hum: 'Humanities colleges', rc: 'Research centers', sc: 'Service centers' },
  types: { council: 'Council & meeting', defense: 'Thesis defense', workshop: 'Workshop', seminar: 'Seminar', course: 'Course', conf: 'Conference',
    lecture: 'Lecture', agreement: 'Agreement', campaign: 'Campaign', event: 'Ceremony', notice: 'Announcement', other: 'News' },
  services: [
    ['Student Information System', 'Student grades and records'], ['Researcher Platform', 'Faculty profiles and research'], ['CV System', 'Faculty CVs'],
    ['Staff Email', 'Official staff mailbox'], ['Student Email', 'Official student mailbox'], ['Undergraduate Admission', 'Apply and enroll'],
    ['Postgraduate Admission', 'Master’s and PhD'], ['Computer Proficiency', 'Registration and results'], ['Complaints System', 'Submit a complaint or inquiry'],
    ['University Housing', 'House and apartment allocation'], ['Car Badge System', 'Vehicle entry badges'], ['Ministry Student System', 'Ministry of Higher Education'],
    ['Ministry HR System', 'Ministry of Higher Education'], ['Study in Iraq', 'International students portal'],
  ],
  president: 'Prof. Dr. Waheed Mahmood Al-Ibrahimi',
  address: 'Main Cultural Complex Street, Mosul – Iraq',
};
