// ===========================================================
// EZAN VAKTİ PRO — Premium App
// Kaynak: Diyanet İşleri Başkanlığı (Gömülü Veri)
// ===========================================================

// --- SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(reg => console.log('SW registered:', reg.scope))
        .catch(err => console.warn('SW failed:', err));
}

// --- CITY IDS ---
const CITY_IDS = {
    "Adana": 9146, "Adıyaman": 9158, "Afyonkarahisar": 9167,
    "Ağrı": 9185, "Aksaray": 9193, "Amasya": 9198,
    "Ankara": 9206, "Antalya": 9225, "Ardahan": 9238,
    "Artvin": 9246, "Aydın": 9252, "Balıkesir": 9270,
    "Bartın": 9285, "Batman": 9288, "Bayburt": 9295,
    "Bilecik": 9297, "Bingöl": 9303, "Bitlis": 9311,
    "Bolu": 9315, "Burdur": 9327, "Bursa": 9335,
    "Çanakkale": 9352, "Çankırı": 9359, "Çorum": 9370,
    "Denizli": 9381, "Diyarbakır": 9392, "Düzce": 9402,
    "Edirne": 9407, "Elazığ": 9432, "Erzincan": 9440,
    "Erzurum": 9451, "Eskişehir": 9470, "Gaziantep": 9479,
    "Giresun": 9494, "Gümüşhane": 9501, "Hakkari": 9507,
    "Hatay": 9510, "Iğdır": 9528, "Isparta": 9531,
    "İstanbul": 9541, "İzmir": 9560, "Kahramanmaraş": 9577,
    "Karabük": 9581, "Karaman": 9587, "Kars": 9594,
    "Kastamonu": 9609, "Kayseri": 9620, "Kırıkkale": 9630,
    "Kırklareli": 9635, "Kırşehir": 9638, "Kilis": 9643,
    "Kocaeli": 9647, "Konya": 9654, "Kütahya": 9676,
    "Malatya": 9689, "Manisa": 9703, "Mardin": 9716,
    "Mersin": 9726, "Muğla": 9747, "Muş": 9755,
    "Nevşehir": 9760, "Niğde": 9766, "Ordu": 9773,
    "Osmaniye": 9786, "Rize": 9793, "Sakarya": 9799,
    "Samsun": 9807, "Siirt": 9819, "Sinop": 9823,
    "Sivas": 9831, "Şanlıurfa": 9839, "Şırnak": 9847,
    "Tekirdağ": 9856, "Tokat": 9864, "Trabzon": 9868,
    "Tunceli": 9879, "Uşak": 9884, "Van": 9888,
    "Yalova": 9896, "Yozgat": 9900, "Zonguldak": 9905
};

// --- CITY COORDINATES for Qibla ---
const CITY_COORDS = {
    "Adana": [37.0, 35.32], "Adıyaman": [37.76, 38.28], "Afyonkarahisar": [38.74, 30.54],
    "Ağrı": [39.72, 43.05], "Aksaray": [38.37, 34.03], "Amasya": [40.65, 35.83],
    "Ankara": [39.93, 32.86], "Antalya": [36.89, 30.71], "Ardahan": [41.11, 42.70],
    "Artvin": [41.18, 41.82], "Aydın": [37.85, 27.85], "Balıkesir": [39.65, 27.88],
    "Bartın": [41.63, 32.33], "Batman": [37.89, 41.13], "Bayburt": [40.26, 40.23],
    "Bilecik": [40.05, 30.0], "Bingöl": [38.88, 40.50], "Bitlis": [38.40, 42.11],
    "Bolu": [40.73, 31.61], "Burdur": [37.72, 30.29], "Bursa": [40.19, 29.06],
    "Çanakkale": [40.15, 26.41], "Çankırı": [40.60, 33.62], "Çorum": [40.55, 34.96],
    "Denizli": [37.77, 29.09], "Diyarbakır": [37.91, 40.24], "Düzce": [40.84, 31.16],
    "Edirne": [41.68, 26.56], "Elazığ": [38.68, 39.23], "Erzincan": [39.75, 39.49],
    "Erzurum": [39.90, 41.27], "Eskişehir": [39.78, 30.52], "Gaziantep": [37.06, 37.38],
    "Giresun": [40.91, 38.39], "Gümüşhane": [40.46, 39.48], "Hakkari": [37.58, 43.74],
    "Hatay": [36.20, 36.16], "Iğdır": [39.92, 44.05], "Isparta": [37.76, 30.56],
    "İstanbul": [41.01, 28.98], "İzmir": [38.42, 27.14], "Kahramanmaraş": [37.58, 36.94],
    "Karabük": [41.20, 32.63], "Karaman": [37.18, 33.23], "Kars": [40.60, 43.10],
    "Kastamonu": [41.39, 33.78], "Kayseri": [38.73, 35.49], "Kırıkkale": [39.85, 33.51],
    "Kırklareli": [41.73, 27.22], "Kırşehir": [39.15, 34.17], "Kilis": [36.72, 37.12],
    "Kocaeli": [40.77, 29.92], "Konya": [37.87, 32.48], "Kütahya": [39.42, 29.98],
    "Malatya": [38.35, 38.31], "Manisa": [38.61, 27.43], "Mardin": [37.31, 40.74],
    "Mersin": [36.80, 34.63], "Muğla": [37.21, 28.36], "Muş": [38.74, 41.49],
    "Nevşehir": [38.62, 34.71], "Niğde": [37.97, 34.68], "Ordu": [40.98, 37.88],
    "Osmaniye": [37.07, 36.25], "Rize": [41.02, 40.52], "Sakarya": [40.69, 30.40],
    "Samsun": [41.29, 36.33], "Siirt": [37.93, 41.94], "Sinop": [42.03, 35.15],
    "Sivas": [39.75, 37.01], "Şanlıurfa": [37.17, 38.79], "Şırnak": [37.41, 42.46],
    "Tekirdağ": [41.0, 27.51], "Tokat": [40.31, 36.55], "Trabzon": [41.0, 39.72],
    "Tunceli": [39.11, 39.55], "Uşak": [38.67, 29.41], "Van": [38.49, 43.38],
    "Yalova": [40.65, 29.28], "Yozgat": [39.82, 34.80], "Zonguldak": [41.45, 31.79]
};

// --- QURAN VERSES (Varied, not Ramadan-specific) ---
const VERSES = [
    { ar: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", tr: "Sabır ve namaz ile Allah'tan yardım isteyin.", ref: "Bakara 45" },
    { ar: "ادْعُونِي أَسْتَجِبْ لَكُمْ", tr: "Bana dua edin, size karşılık vereyim.", ref: "Mü'min 60" },
    { ar: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", tr: "Şüphesiz Allah, sabredenlerle beraberdir.", ref: "Bakara 153" },
    { ar: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", tr: "Kim Allah'a tevekkül ederse, O ona yeter.", ref: "Talâk 3" },
    { ar: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", tr: "Zorluğun yanında bir kolaylık vardır.", ref: "İnşirah 5" },
    { ar: "وَلَذِكْرُ اللَّهِ أَكْبَرُ", tr: "Allah'ı anmak en büyük ibadettir.", ref: "Ankebût 45" },
    { ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً", tr: "Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver.", ref: "Bakara 201" },
    { ar: "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ", tr: "Biz Kur'an'dan, müminler için şifa ve rahmet olan şeyler indiririz.", ref: "İsrâ 82" },
    { ar: "حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ", tr: "Namazları ve özellikle orta namazı (ikindi) koruyun.", ref: "Bakara 238" },
    { ar: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ", tr: "Namazı dosdoğru kılın, zekâtı verin.", ref: "Bakara 43" },
    { ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", tr: "Ey inananlar! Sabır ve namazla yardım isteyin.", ref: "Bakara 153" },
    { ar: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا", tr: "Namaz, müminlere vakitleri belirlenmiş bir farzdır.", ref: "Nisa 103" },
];

// --- KURBAN BAYRAMI DATE ---
// Kurban Bayramı 2026: 27 Mayıs - 30 Mayıs 2026
const KURBAN_BAYRAMI_START = new Date(2026, 4, 27); // May 27, 2026
const KURBAN_BAYRAMI_END   = new Date(2026, 4, 30); // May 30, 2026
// Alias for countdown
const KURBAN_BAYRAMI = KURBAN_BAYRAMI_START;
// Reference date for progress bar
const YEAR_START = new Date(2026, 0, 1);

// --- ACHIEVEMENTS DEFINITION ---
const BADGE_DEFS = [
    { id: 'first_worship', icon: '🕌', name: 'İlk İbadet', desc: 'İlk ibadeti kaydet', check: (s) => s.totalWorshipDays >= 1 },
    { id: 'streak_3', icon: '🔥', name: '3 Gün Seri', desc: '3 gün üst üste', check: (s) => s.streak >= 3 },
    { id: 'streak_7', icon: '⚡', name: '7 Gün Seri', desc: '7 gün üst üste', check: (s) => s.streak >= 7 },
    { id: 'streak_15', icon: '💎', name: '15 Gün Seri', desc: '15 gün üst üste', check: (s) => s.streak >= 15 },
    { id: 'streak_30', icon: '👑', name: '30 Gün Seri', desc: '30 gün kesintisiz', check: (s) => s.streak >= 30 },
    { id: 'full_day', icon: '⭐', name: 'Tam Gün', desc: 'Tüm ibadetleri tamamla', check: (s) => s.hasFullDay },
    { id: 'hatim_10', icon: '📖', name: '10 Cüz', desc: '10 cüz oku', check: (s) => s.hatimDone >= 10 },
    { id: 'hatim_20', icon: '📚', name: '20 Cüz', desc: '20 cüz oku', check: (s) => s.hatimDone >= 20 },
    { id: 'hatim_full', icon: '🏆', name: 'Hatim', desc: '30 cüzü tamamla', check: (s) => s.hatimDone >= 30 },
    { id: 'tesbih_99', icon: '📿', name: 'Tesbih', desc: '99 tesbih tamamla', check: (s) => s.tesbihComplete >= 1 },
];

// --- DOM ELEMENTS ---
const citySelect = document.getElementById('citySelect');
const cdHours = document.getElementById('cdHours');
const cdMinutes = document.getElementById('cdMinutes');
const cdSeconds = document.getElementById('cdSeconds');
const nextPrayerName = document.getElementById('nextPrayerName');
const nextPrayerTime = document.getElementById('nextPrayerTime');
const ringProgress = document.getElementById('ringProgress');
const prayerTableBody = document.getElementById('prayerTableBody');

// --- STATE ---
let currentCity = localStorage.getItem('selectedCity') || 'Elazığ';
let prayerTimings = null;
let countdownInterval = null;
let selectedPrayer = 'auto'; // 'auto' or specific prayer key

// --- HELPERS ---
const monthsTr = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const daysTr = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const monthsShort = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const daysShort = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

function formatDateLabel(dt) {
    return `${dt.getDate()} ${monthsTr[dt.getMonth()]} ${daysTr[dt.getDay()]}`;
}
function dateKey(dt) {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const d = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// ==========================================================
// SPLASH SCREEN
// ==========================================================
function initSplash() {
    const splash = document.getElementById('splashScreen');
    setTimeout(() => {
        splash.classList.add('hidden');
    }, 2000);
}

// ==========================================================
// CITY SELECTOR
// ==========================================================
function initCitySelector() {
    Object.keys(CITY_IDS).sort((a, b) => a.localeCompare(b, 'tr')).forEach(city => {
        const opt = document.createElement('option');
        opt.value = city; opt.textContent = city;
        citySelect.appendChild(opt);
    });
    citySelect.value = currentCity;
}

// ==========================================================
// FETCH PRAYER TIMES
// ==========================================================
function fetchPrayerTimes(city) {
    nextPrayerName.textContent = 'Yükleniyor...';
    cdHours.textContent = '--'; cdMinutes.textContent = '--'; cdSeconds.textContent = '--';

    if (typeof EMBEDDED_DATA === 'undefined' || !EMBEDDED_DATA[city]) {
        nextPrayerName.textContent = 'Veri bulunamadı';
        return;
    }
    prayerTimings = EMBEDDED_DATA[city];
    updateDisplay();
}

// ==========================================================
// UPDATE DISPLAY
// ==========================================================
function updateDisplay() {
    if (!prayerTimings || prayerTimings.length === 0) return;

    const now = new Date();
    const todayStr = dateKey(now);
    let today = prayerTimings.find(d => d.date && d.date.startsWith(todayStr));
    if (!today) today = prayerTimings[0];

    // Prayer times — ensure proper HH:MM format
    document.getElementById('time-fajr').textContent = formatTime(today.fajr);
    document.getElementById('time-sun').textContent = formatTime(today.sun);
    document.getElementById('time-dhuhr').textContent = formatTime(today.dhuhr);
    document.getElementById('time-asr').textContent = formatTime(today.asr);
    document.getElementById('time-maghrib').textContent = formatTime(today.maghrib);
    document.getElementById('time-isha').textContent = formatTime(today.isha);

    // Date & Hijri
    document.getElementById('gregorianDate').textContent = formatDateLabel(now);
    document.getElementById('hijriDate').textContent = getHijriDateStr(now);

    // Verse
    const vIdx = now.getDate() % VERSES.length;
    document.getElementById('verseArabic').textContent = VERSES[vIdx].ar;
    document.getElementById('verseText').textContent = VERSES[vIdx].tr;
    document.getElementById('verseSource').textContent = VERSES[vIdx].ref;

    // Active prayer highlight
    highlightActivePrayer(today, now);

    // Countdown
    startCountdown(today, now);

    // Kurban Bayramı countdown
    updateKurbanCountdown(now);

    // Table
    renderTable(7);
}

// ==========================================================
// FORMAT TIME (ensure HH:MM)
// ==========================================================
function formatTime(timeStr) {
    if (!timeStr) return '--:--';
    // already correct format
    if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
    // try to parse single digit hours: "5:30" -> "05:30"
    const parts = timeStr.split(':');
    if (parts.length === 2) {
        return String(parts[0]).padStart(2, '0') + ':' + String(parts[1]).padStart(2, '0');
    }
    return timeStr;
}

// ==========================================================
// HIJRI DATE (approximate calculation)
// ==========================================================
function getHijriDateStr(date) {
    // Use Intl API if available
    try {
        const hijri = new Intl.DateTimeFormat('tr-TR-u-ca-islamic', {
            day: 'numeric', month: 'long', year: 'numeric'
        }).format(date);
        return hijri;
    } catch (e) {
        return 'Hicri Takvim';
    }
}

// ==========================================================
// KURBAN BAYRAMI COUNTDOWN
// ==========================================================
function updateKurbanCountdown(now) {
    const kurbanEl = document.getElementById('kurbanDays');
    const progressEl = document.getElementById('kurbanProgress');
    if (!kurbanEl) return;

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const kurban = new Date(KURBAN_BAYRAMI.getFullYear(), KURBAN_BAYRAMI.getMonth(), KURBAN_BAYRAMI.getDate());
    
    const diffMs = kurban - today;
    const daysLeft = Math.ceil(diffMs / 86400000);

    if (daysLeft <= 0) {
        kurbanEl.textContent = '🎉';
        if (progressEl) progressEl.style.width = '100%';
        const card = document.getElementById('kurbanCard');
        if (card) {
            const titleEl = card.querySelector('.kurban-title');
            const daysLabelEl = card.querySelector('.kurban-days-label');
            if (titleEl) titleEl.textContent = 'Kurban Bayramınız';
            if (daysLabelEl) daysLabelEl.textContent = 'MÜBAREK';
        }
        return;
    }

    kurbanEl.textContent = daysLeft;

    // Progress: from Jan 1 2026 to June 26 2026
    const totalDays = Math.ceil((kurban - YEAR_START) / 86400000);
    const elapsedDays = Math.ceil((today - YEAR_START) / 86400000);
    const pct = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
    if (progressEl) progressEl.style.width = pct + '%';
}

// ==========================================================
// HIGHLIGHT ACTIVE PRAYER
// ==========================================================
function highlightActivePrayer(today, now) {
    const timesMap = [
        { id: 'card-fajr', indId: 'ind-fajr', time: today.fajr },
        { id: 'card-sun', indId: 'ind-sun', time: today.sun },
        { id: 'card-dhuhr', indId: 'ind-dhuhr', time: today.dhuhr },
        { id: 'card-asr', indId: 'ind-asr', time: today.asr },
        { id: 'card-maghrib', indId: 'ind-maghrib', time: today.maghrib },
        { id: 'card-isha', indId: 'ind-isha', time: today.isha }
    ];

    const nowMin = now.getHours() * 60 + now.getMinutes();
    let activeIdx = 0;
    for (let i = timesMap.length - 1; i >= 0; i--) {
        if (!timesMap[i].time) continue;
        const [h, m] = timesMap[i].time.split(':').map(Number);
        if (nowMin >= h * 60 + m) { activeIdx = i; break; }
    }

    // Find next prayer index
    let nextIdx = -1;
    for (let i = 0; i < timesMap.length; i++) {
        if (!timesMap[i].time) continue;
        const [h, m] = timesMap[i].time.split(':').map(Number);
        if (nowMin < h * 60 + m) { nextIdx = i; break; }
    }

    timesMap.forEach((t, i) => {
        const el = document.getElementById(t.id);
        const indEl = document.getElementById(t.indId);
        if (el) {
            el.classList.remove('active', 'next-prayer');
            if (i === activeIdx) el.classList.add('active');
            if (i === nextIdx) el.classList.add('next-prayer');
        }
        if (indEl) {
            indEl.classList.remove('ind-active', 'ind-next');
            if (i === activeIdx) indEl.classList.add('ind-active');
            if (i === nextIdx) indEl.classList.add('ind-next');
        }
    });
}

// ==========================================================
// COUNTDOWN
// ==========================================================
const PRAYER_KEY_MAP = {
    fajr: 'İMSAK',
    sun: 'GÜNEŞ',
    dhuhr: 'ÖĞLE',
    asr: 'İKİNDİ',
    maghrib: 'AKŞAM',
    isha: 'YATSI'
};

function startCountdown(today, now) {
    if (countdownInterval) clearInterval(countdownInterval);

    const prayerOrder = [
        { name: 'İMSAK', key: 'fajr', time: today.fajr },
        { name: 'GÜNEŞ', key: 'sun', time: today.sun },
        { name: 'ÖĞLE', key: 'dhuhr', time: today.dhuhr },
        { name: 'İKİNDİ', key: 'asr', time: today.asr },
        { name: 'AKŞAM', key: 'maghrib', time: today.maghrib },
        { name: 'YATSI', key: 'isha', time: today.isha }
    ];

    function tick() {
        const current = new Date();
        const nowSec = current.getHours() * 3600 + current.getMinutes() * 60 + current.getSeconds();

        let target = null;

        if (selectedPrayer !== 'auto') {
            // User selected a specific prayer
            const sel = prayerOrder.find(p => p.key === selectedPrayer);
            if (sel && sel.time) {
                const [h, m] = sel.time.split(':').map(Number);
                let pSec = h * 3600 + m * 60;
                if (pSec <= nowSec) pSec += 86400; // Tomorrow
                target = { ...sel, sec: pSec };
            }
        }

        if (!target) {
            // Auto: find next upcoming prayer
            for (const p of prayerOrder) {
                if (!p.time) continue;
                const [h, m] = p.time.split(':').map(Number);
                const pSec = h * 3600 + m * 60;
                if (pSec > nowSec) { target = { ...p, sec: pSec }; break; }
            }
        }

        if (!target) {
            // All prayers passed, next is tomorrow's İmsak
            target = { name: 'İMSAK', key: 'fajr', time: prayerOrder[0].time, sec: 86400 };
            if (prayerOrder[0].time) {
                const [h, m] = prayerOrder[0].time.split(':').map(Number);
                target.sec = h * 3600 + m * 60 + 86400;
            }
        }

        let diff = target.sec - nowSec;
        if (diff < 0) diff += 86400;

        const h = Math.floor(diff / 3600);
        const mi = Math.floor((diff % 3600) / 60);
        const s = diff % 60;

        cdHours.textContent = String(h).padStart(2, '0');
        cdMinutes.textContent = String(mi).padStart(2, '0');
        cdSeconds.textContent = String(s).padStart(2, '0');

        const suffix = (selectedPrayer !== 'auto' && target.sec > 86400) ? ' (yarın)' : '';
        nextPrayerName.textContent = target.name + ' VAKTİNE KALAN' + suffix;
        nextPrayerTime.textContent = formatTime(target.time);

        const totalPrayerGap = findPrayerGap(prayerOrder, target, nowSec);
        const progress = 1 - (diff / totalPrayerGap);
        ringProgress.style.width = (Math.max(0, progress) * 100) + '%';
    }

    tick();
    countdownInterval = setInterval(tick, 1000);
}

function findPrayerGap(prayers, target, nowSec) {
    const idx = prayers.findIndex(p => p.name === target.name);
    if (idx <= 0) return 3600;
    if (!prayers[idx - 1].time || !target.time) return 3600;
    const [ph, pm] = prayers[idx - 1].time.split(':').map(Number);
    const [th, tm] = target.time.split(':').map(Number);
    return (th * 3600 + tm * 60) - (ph * 3600 + pm * 60) || 3600;
}

// ==========================================================
// TABLE
// ==========================================================
function renderTable(days) {
    if (!prayerTimings) return;
    prayerTableBody.innerHTML = '';
    const now = new Date();
    const todayStr = dateKey(now);

    let startIdx = prayerTimings.findIndex(d => d.date && d.date.startsWith(todayStr));
    if (startIdx < 0) startIdx = 0;

    const endIdx = Math.min(startIdx + days, prayerTimings.length);

    for (let i = startIdx; i < endIdx; i++) {
        const d = prayerTimings[i];
        const dt = new Date(d.date);
        const isToday = d.date.startsWith(todayStr);

        const tr = document.createElement('tr');
        if (isToday) tr.className = 'today-row';

        const dateLabel = `${dt.getDate()} ${monthsShort[dt.getMonth()]} ${daysShort[dt.getDay()]}`;
        tr.innerHTML = `
            <td>${isToday ? dateLabel + ' ★' : dateLabel}</td>
            <td>${formatTime(d.fajr)}</td><td>${formatTime(d.sun)}</td><td>${formatTime(d.dhuhr)}</td>
            <td>${formatTime(d.asr)}</td><td>${formatTime(d.maghrib)}</td><td>${formatTime(d.isha)}</td>
        `;
        prayerTableBody.appendChild(tr);
    }
}

// ==========================================================
// BOTTOM NAV
// ==========================================================
function initNav() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.page;
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            pages.forEach(p => {
                p.classList.remove('active');
                if (p.id === `page-${target}`) p.classList.add('active');
            });
            document.getElementById('contentArea').scrollTop = 0;
        });
    });
}

// ==========================================================
// TABS
// ==========================================================
function initTabs() {
    document.querySelectorAll('.tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            renderTable(parseInt(btn.dataset.days));
        });
    });
}

// ==========================================================
// QIBLA COMPASS
// ==========================================================
function initQibla() {
    const needle = document.getElementById('qiblaNeedle');
    const cityEl = document.getElementById('qiblaCity');
    const angleEl = document.getElementById('qiblaAngle');

    function updateQibla() {
        const coords = CITY_COORDS[currentCity];
        if (!coords) return;

        const lat = coords[0] * Math.PI / 180;
        const lon = coords[1] * Math.PI / 180;
        const kLat = 21.4225 * Math.PI / 180;
        const kLon = 39.8262 * Math.PI / 180;

        const y = Math.sin(kLon - lon);
        const x = Math.cos(lat) * Math.tan(kLat) - Math.sin(lat) * Math.cos(kLon - lon);
        let angle = Math.atan2(y, x) * 180 / Math.PI;
        if (angle < 0) angle += 360;

        needle.setAttribute('transform', `rotate(${angle.toFixed(1)}, 150, 150)`);
        cityEl.textContent = currentCity;
        angleEl.textContent = `${angle.toFixed(1)}°`;

        if (window.DeviceOrientationEvent) {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                document.getElementById('compassSvg').addEventListener('click', () => {
                    DeviceOrientationEvent.requestPermission().then(state => {
                        if (state === 'granted') {
                            window.addEventListener('deviceorientation', e => rotateCompass(e, angle));
                        }
                    });
                }, { once: true });
            } else {
                window.addEventListener('deviceorientation', e => rotateCompass(e, angle));
            }
        }
    }

    function rotateCompass(e, qiblaAngle) {
        if (e.webkitCompassHeading !== undefined) {
            const heading = e.webkitCompassHeading;
            needle.setAttribute('transform', `rotate(${qiblaAngle - heading}, 150, 150)`);
        } else if (e.alpha !== null) {
            const heading = 360 - e.alpha;
            needle.setAttribute('transform', `rotate(${qiblaAngle - heading}, 150, 150)`);
        }
    }

    updateQibla();
    return updateQibla;
}

// ==========================================================
// TESBIH
// ==========================================================
function initTesbih() {
    const basePhases = [
        { ar: 'سُبْحَانَ اللَّهِ', tr: 'SubhanAllah', target: 33 },
        { ar: 'الْحَمْدُ لِلَّهِ', tr: 'Elhamdulillah', target: 33 },
        { ar: 'اللَّهُ أَكْبَرُ', tr: 'Allahuekber', target: 33 }
    ];
    let customPhases = JSON.parse(localStorage.getItem('custom_zikirs') || '[]');
    let phases = [...basePhases, ...customPhases];

    let phase = parseInt(localStorage.getItem('tesbihPhase') || '0');
    let count = parseInt(localStorage.getItem('tesbihCount') || '0');
    let completions = parseInt(localStorage.getItem('tesbihCompletions') || '0');
    if (phase >= phases.length) phase = 0;

    const btn = document.getElementById('tesbihBtn');
    const countEl = document.getElementById('tesbihCount');
    const targetEl = document.getElementById('tesbihTarget');
    const labelEl = document.getElementById('tesbihLabel');
    const labelTrEl = document.getElementById('tesbihLabelTr');
    const progressEl = document.getElementById('tesbihProgress');
    const stepsDiv = document.getElementById('tesbihSteps');
    const circumference = 2 * Math.PI * 70;

    function renderSteps() {
        if (!stepsDiv) return;
        stepsDiv.innerHTML = '';
        phases.forEach((p, i) => {
            const step = document.createElement('span');
            step.className = 'step' + (i === phase ? ' active' : '') + (i < phase ? ' done' : '');
            step.dataset.idx = i;
            step.textContent = p.tr;
            stepsDiv.appendChild(step);
        });
    }

    function updateUI() {
        const p = phases[phase];
        countEl.textContent = count;
        targetEl.textContent = `/ ${p.target}`;
        labelEl.textContent = p.ar || '• • •';
        labelTrEl.textContent = p.tr;

        const offset = circumference - (count / p.target) * circumference;
        progressEl.setAttribute('stroke-dashoffset', Math.max(0, offset));

        renderSteps();

        localStorage.setItem('tesbihPhase', phase);
        localStorage.setItem('tesbihCount', count);
        localStorage.setItem('tesbihCompletions', completions);
    }

    btn.addEventListener('click', () => {
        count++;
        btn.classList.add('pulse');
        setTimeout(() => btn.classList.remove('pulse'), 300);

        if (count >= phases[phase].target) {
            if (phase < phases.length - 1) {
                phase++; count = 0;
            } else {
                completions++;
                setTimeout(() => { phase = 0; count = 0; updateUI(); checkAchievements(); }, 500);
            }
        }
        updateUI();
    });

    document.getElementById('tesbihReset').addEventListener('click', () => {
        phase = 0; count = 0; updateUI();
    });

    const addBtn = document.getElementById('addCustomZikirBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const name = document.getElementById('customZikirName').value.trim();
            const targetVal = parseInt(document.getElementById('customZikirTarget').value);
            if(name && targetVal > 0) {
                customPhases.push({ ar: '', tr: name, target: targetVal });
                localStorage.setItem('custom_zikirs', JSON.stringify(customPhases));
                phases = [...basePhases, ...customPhases];
                document.getElementById('customZikirName').value = '';
                document.getElementById('customZikirTarget').value = '';
                updateUI();
            }
        });
    }

    progressEl.setAttribute('stroke-dasharray', circumference);
    updateUI();
}

// ==========================================================
// KAZA NAMAZI (Missed Prayers)
// ==========================================================
function initKazaTracker() {
    const grid = document.getElementById('kazaGrid');
    if (!grid) return;
    const kazaList = [
        { id: 'fajr', name: 'Sabah' },
        { id: 'dhuhr', name: 'Öğle' },
        { id: 'asr', name: 'İkindi' },
        { id: 'maghrib', name: 'Akşam' },
        { id: 'isha', name: 'Yatsı' },
        { id: 'witr', name: 'Vitir' }
    ];
    
    function loadKaza() { return JSON.parse(localStorage.getItem('kaza_tracker') || '{}'); }
    function saveKaza(state) { localStorage.setItem('kaza_tracker', JSON.stringify(state)); }
    
    function render() {
        const state = loadKaza();
        grid.innerHTML = '';
        kazaList.forEach(k => {
            const count = state[k.id] || 0;
            const row = document.createElement('div');
            row.className = 'kaza-row';
            row.innerHTML = `
                <span class="kaza-name">${k.name}</span>
                <div class="kaza-actions">
                    <button class="btn-kaza minus" data-id="${k.id}">-</button>
                    <span class="kaza-count">${count}</span>
                    <button class="btn-kaza plus" data-id="${k.id}">+</button>
                </div>
            `;
            grid.appendChild(row);
        });
    }
    
    grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-kaza');
        if (!btn) return;
        const id = btn.dataset.id;
        const isPlus = btn.classList.contains('plus');
        const state = loadKaza();
        let val = state[id] || 0;
        if (isPlus) val++; else val--;
        if (val < 0) val = 0;
        state[id] = val;
        saveKaza(state);
        render();
    });
    
    render();
}

// ==========================================================
// WORSHIP TRACKER (İbadet Takibi)
// ==========================================================
function initWorship() {
    const grid = document.getElementById('worshipGrid');
    const dateLabel = document.getElementById('worshipDateLabel');
    const progressFill = document.getElementById('worshipProgressFill');
    const pctEl = document.getElementById('worshipPct');
    let viewDate = new Date();

    function getKey(dt) { return `worship_${dateKey(dt)}`; }

    function loadState(dt) {
        const saved = localStorage.getItem(getKey(dt));
        return saved ? JSON.parse(saved) : {};
    }

    function saveState(dt, state) {
        localStorage.setItem(getKey(dt), JSON.stringify(state));
    }

    function render() {
        dateLabel.textContent = formatDateLabel(viewDate);
        const state = loadState(viewDate);
        const items = grid.querySelectorAll('.worship-item');
        let checked = 0;

        items.forEach(item => {
            const key = item.dataset.key;
            const cb = item.querySelector('input');
            cb.checked = !!state[key];
            if (cb.checked) checked++;
        });

        const pct = Math.round((checked / items.length) * 100);
        progressFill.style.width = pct + '%';
        pctEl.textContent = pct + '%';
    }

    grid.addEventListener('change', (e) => {
        if (e.target.type !== 'checkbox') return;
        const item = e.target.closest('.worship-item');
        const key = item.dataset.key;
        const state = loadState(viewDate);
        state[key] = e.target.checked;
        saveState(viewDate, state);
        render();
        checkAchievements();
    });

    document.getElementById('worshipPrevDay').addEventListener('click', () => {
        viewDate = new Date(viewDate.getTime() - 86400000);
        render();
    });
    document.getElementById('worshipNextDay').addEventListener('click', () => {
        viewDate = new Date(viewDate.getTime() + 86400000);
        render();
    });

    render();
}

// ==========================================================
// HATIM TRACKER
// ==========================================================
function initHatim() {
    const grid = document.getElementById('hatimGrid');
    const completedEl = document.getElementById('hatimCompleted');
    const pctEl = document.getElementById('hatimPct');
    const fillEl = document.getElementById('hatimProgressFill');

    function loadHatim() {
        const saved = localStorage.getItem('hatim_progress');
        return saved ? JSON.parse(saved) : { completed: [] };
    }

    function saveHatim(state) {
        localStorage.setItem('hatim_progress', JSON.stringify(state));
    }

    function render() {
        const state = loadHatim();
        grid.innerHTML = '';

        for (let i = 1; i <= 30; i++) {
            const cell = document.createElement('div');
            cell.className = 'hatim-cell';
            cell.textContent = i;

            if (state.completed.includes(i)) {
                cell.classList.add('done');
            } else {
                const firstIncomplete = Array.from({ length: 30 }, (_, k) => k + 1).find(n => !state.completed.includes(n));
                if (i === firstIncomplete) cell.classList.add('current');
            }

            cell.addEventListener('click', () => {
                const s = loadHatim();
                if (s.completed.includes(i)) {
                    s.completed = s.completed.filter(n => n !== i);
                } else {
                    s.completed.push(i);
                    s.completed.sort((a, b) => a - b);
                }
                saveHatim(s);
                render();
                checkAchievements();
            });

            grid.appendChild(cell);
        }

        const done = state.completed.length;
        completedEl.textContent = done;
        const pct = Math.round((done / 30) * 100);
        pctEl.textContent = pct + '%';
        fillEl.style.width = pct + '%';
    }

    document.getElementById('hatimReset').addEventListener('click', () => {
        if (confirm('Hatim ilerlemesini sıfırlamak istediğinize emin misiniz?')) {
            saveHatim({ completed: [] });
            render();
            checkAchievements();
        }
    });

    render();
}

// ==========================================================
// ACHIEVEMENTS (Başarımlar)
// ==========================================================
function initAchievements() {
    const grid = document.getElementById('badgeGrid');
    grid.innerHTML = '';

    BADGE_DEFS.forEach(badge => {
        const item = document.createElement('div');
        item.className = 'badge-item locked';
        item.id = `badge-${badge.id}`;
        item.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <span class="badge-name">${badge.name}</span>
        `;
        item.title = badge.desc;
        grid.appendChild(item);
    });

    checkAchievements();
}

function getAchievementStats() {
    let totalWorshipDays = 0;
    let streak = 0;
    let hasFullDay = false;
    const today = new Date();

    let currentStreak = 0;
    for (let i = 0; i < 30; i++) {
        const dt = new Date(today.getTime() - i * 86400000);
        const saved = localStorage.getItem(`worship_${dateKey(dt)}`);
        if (saved) {
            const state = JSON.parse(saved);
            const checkedCount = Object.values(state).filter(v => v).length;
            if (checkedCount > 0) {
                totalWorshipDays++;
                if (i === currentStreak) currentStreak++;
                if (checkedCount >= 8) hasFullDay = true;
            }
        }
    }
    streak = currentStreak;

    const hatimSaved = localStorage.getItem('hatim_progress');
    const hatimDone = hatimSaved ? JSON.parse(hatimSaved).completed.length : 0;

    const tesbihComplete = parseInt(localStorage.getItem('tesbihCompletions') || '0');

    return { totalWorshipDays, streak, hasFullDay, hatimDone, tesbihComplete };
}

function checkAchievements() {
    const stats = getAchievementStats();

    const streakEl = document.getElementById('streakCount');
    if (streakEl) streakEl.textContent = stats.streak;

    const unlocked = JSON.parse(localStorage.getItem('achievements_unlocked') || '[]');

    BADGE_DEFS.forEach(badge => {
        const el = document.getElementById(`badge-${badge.id}`);
        if (!el) return;

        if (badge.check(stats) && !unlocked.includes(badge.id)) {
            unlocked.push(badge.id);
        }

        if (unlocked.includes(badge.id)) {
            el.classList.remove('locked');
            el.classList.add('unlocked');
        } else {
            el.classList.remove('unlocked');
            el.classList.add('locked');
        }
    });

    localStorage.setItem('achievements_unlocked', JSON.stringify(unlocked));
}

// ==========================================================
// THEME
// ==========================================================
function applyTheme(theme) {
    if (theme === 'auto') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

function initTheme() {
    const saved = localStorage.getItem('theme') || 'auto';
    applyTheme(saved);
    updateThemeIcon(saved);

    document.getElementById('themeToggle').addEventListener('click', () => {
        const current = localStorage.getItem('theme') || 'auto';
        let next = 'dark';
        if (current === 'dark') next = 'light';
        else if (current === 'light') next = 'auto';
        
        localStorage.setItem('theme', next);
        applyTheme(next);
        updateThemeIcon(next);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if ((localStorage.getItem('theme') || 'auto') === 'auto') applyTheme('auto');
    });
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (theme === 'dark') icon.className = 'ri-moon-line';
    else if (theme === 'light') icon.className = 'ri-sun-line';
    else icon.className = 'ri-contrast-line';
}

// ==========================================================
// SHARE
// ==========================================================
function initShare() {
    document.getElementById('shareBtn').addEventListener('click', async () => {
        if (!prayerTimings) return;
        const now = new Date();
        const todayStr = dateKey(now);
        const today = prayerTimings.find(d => d.date && d.date.startsWith(todayStr)) || prayerTimings[0];
        if (!today) return;

        const text = `🕌 ${currentCity} - Namaz Vakitleri\n📅 ${document.getElementById('gregorianDate').textContent}\n\n⏰ İmsak: ${formatTime(today.fajr)}\n🌅 Güneş: ${formatTime(today.sun)}\n🕐 Öğle: ${formatTime(today.dhuhr)}\n🕑 İkindi: ${formatTime(today.asr)}\n🌇 Akşam: ${formatTime(today.maghrib)}\n🌙 Yatsı: ${formatTime(today.isha)}\n\n📱 Kaynak: Ezan Vakti Pro — Diyanet İşleri Başkanlığı`;

        if (navigator.share) {
            try { await navigator.share({ title: 'Ezan Vakti Pro — Namaz Vakitleri', text }); } catch (e) { }
        } else {
            try {
                await navigator.clipboard.writeText(text);
                const btn = document.getElementById('shareBtn');
                btn.innerHTML = '<i class="ri-check-line"></i>';
                setTimeout(() => btn.innerHTML = '<i class="ri-share-line"></i>', 2000);
            } catch (e) { }
        }
    });
}

// ==========================================================
// PRINT
// ==========================================================
function initPrint() {
    document.getElementById('printBtn').addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        const allTab = document.querySelector('.tab[data-days="30"]');
        if (allTab) allTab.classList.add('active');
        renderTable(30);

        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-table').classList.add('active');

        setTimeout(() => window.print(), 200);
    });
}

// ==========================================================
// GEOLOCATION
// ==========================================================
function initGeolocation() {
    const btn = document.getElementById('btnGeoLoc');
    if (!btn) return;
    btn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert('Tarayıcınız konum servisini desteklemiyor.');
            return;
        }
        btn.classList.add('pulse');
        navigator.geolocation.getCurrentPosition((pos) => {
            btn.classList.remove('pulse');
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            let closestCity = currentCity;
            let minDist = Infinity;
            
            for (const city in CITY_COORDS) {
                const cLat = CITY_COORDS[city][0];
                const cLon = CITY_COORDS[city][1];
                const dist = Math.pow(lat - cLat, 2) + Math.pow(lon - cLon, 2);
                if (dist < minDist) {
                    minDist = dist;
                    closestCity = city;
                }
            }
            
            if (citySelect.value !== closestCity) {
                citySelect.value = closestCity;
                citySelect.dispatchEvent(new Event('change'));
                alert(`Konumunuza en yakın şehir seçildi: ${closestCity}`);
            }
        }, (err) => {
            btn.classList.remove('pulse');
            alert('Konum alınamadı. Lütfen izinleri kontrol edin.');
        });
    });
}

// ==========================================================
// INIT
// ==========================================================
window.addEventListener('DOMContentLoaded', () => {
    initSplash();
    initCitySelector();
    initGeolocation();
    initNav();
    initTabs();
    initTheme();
    initTesbih();
    initWorship();
    initKazaTracker();
    initHatim();
    initAchievements();
    initShare();
    initPrint();
    initNotifications();
    if (typeof initGame === 'function') initGame();

    const qiblaUpdate = initQibla();

    citySelect.addEventListener('change', () => {
        currentCity = citySelect.value;
        localStorage.setItem('selectedCity', currentCity);
        fetchPrayerTimes(currentCity);
        qiblaUpdate();
    });

    // Prayer countdown selector pills
    const cdSelector = document.getElementById('cdSelector');
    if (cdSelector) {
        cdSelector.addEventListener('click', (e) => {
            const pill = e.target.closest('.cd-pill');
            if (!pill) return;
            cdSelector.querySelectorAll('.cd-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            selectedPrayer = pill.dataset.prayer;
            if (prayerTimings) updateDisplay();
        });
    }

    fetchPrayerTimes(currentCity);
});

// ==========================================================
// NOTIFICATIONS
// ==========================================================
let notifEnabled = localStorage.getItem('notifEnabled') === 'true';

function playAdhanBeep() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);     // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.5); // E5
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.5);
    } catch(e) {}
}

function initNotifications() {
    const btn = document.getElementById('notifBtn');
    const icon = document.getElementById('notifIcon');
    if (!btn || !icon) return;

    function updateIcon() {
        if (notifEnabled) {
            icon.className = 'ri-notification-3-line';
            icon.style.color = 'var(--accent)';
        } else {
            icon.className = 'ri-notification-off-line';
            icon.style.removeProperty('color');
        }
    }

    btn.addEventListener('click', async () => {
        if (!notifEnabled) {
            if (!('Notification' in window)) {
                alert('Tarayıcınız bildirimleri desteklemiyor.');
                return;
            }
            if (Notification.permission === 'granted') {
                notifEnabled = true;
                localStorage.setItem('notifEnabled', 'true');
                scheduleNotifications();
                updateIcon();
                playAdhanBeep(); // Audio Context'i aktifleştirmek için
            } else if (Notification.permission !== 'denied') {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    notifEnabled = true;
                    localStorage.setItem('notifEnabled', 'true');
                    scheduleNotifications();
                    updateIcon();
                    playAdhanBeep(); // Audio Context'i aktifleştirmek için
                } else {
                    alert('Bildirim izni verilmedi.');
                }
            } else {
                alert('Bildirim izni engellenmiş. Lütfen tarayıcı ayarlarından izin verin.');
            }
        } else {
            notifEnabled = false;
            localStorage.setItem('notifEnabled', 'false');
            updateIcon();
        }
    });

    updateIcon();
    
    // Background alarm fallback for foreground app
    setInterval(() => {
        if (!notifEnabled || !prayerTimings) return;
        const now = new Date();
        const sec = now.getSeconds();
        if (sec !== 0) return;
        
        const todayStr = dateKey(now);
        const today = prayerTimings.find(d => d.date && d.date.startsWith(todayStr));
        if (!today) return;
        
        const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        const prayers = [
            { name: 'İmsak', time: formatTime(today.fajr) },
            { name: 'Öğle', time: formatTime(today.dhuhr) },
            { name: 'İkindi', time: formatTime(today.asr) },
            { name: 'Akşam', time: formatTime(today.maghrib) },
            { name: 'Yatsı', time: formatTime(today.isha) }
        ];
        
        for (let p of prayers) {
            if (p.time === hm) {
                const lastNotified = localStorage.getItem('lastNotifiedTime');
                if (lastNotified !== hm) {
                    showLocalNotification(p.name, p.time, currentCity);
                    localStorage.setItem('lastNotifiedTime', hm);
                    playAdhanBeep();
                }
            }
        }
    }, 1000);
}

function showLocalNotification(prayerName, time, city) {
    if (Notification.permission === 'granted') {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(reg => {
                reg.showNotification(`🕌 Ezan Vakti: ${prayerName}`, {
                    body: `${city} için ${prayerName} vakti girdi (${time}).`,
                    icon: 'icons/icon-192.png',
                    badge: 'icons/icon-192.png',
                    vibrate: [200, 100, 200, 100, 200],
                    tag: 'prayer-notif-' + prayerName,
                    renotify: true
                });
            });
        } else {
            new Notification(`🕌 Ezan Vakti: ${prayerName}`, {
                body: `${city} için ${prayerName} vakti girdi (${time}).`,
                icon: 'icons/icon-192.png'
            });
        }
    }
}

function scheduleNotifications() {
    if (!notifEnabled || !prayerTimings) return;
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const now = new Date();
        const todayStr = dateKey(now);
        let startIdx = prayerTimings.findIndex(d => d.date && d.date.startsWith(todayStr));
        if (startIdx < 0) startIdx = 0;
        const days = prayerTimings.slice(startIdx, startIdx + 3);
        
        navigator.serviceWorker.controller.postMessage({
            type: 'SCHEDULE_PRAYERS',
            city: currentCity,
            days: days
        });
    }
}
