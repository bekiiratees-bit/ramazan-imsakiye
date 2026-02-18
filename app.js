// ===========================================================
// RAMAZAN İMSAKİYE 2026 - PREMIUM APP
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

// --- QURAN VERSES ---
const VERSES = [
    { ar: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ", tr: "Ramazan ayı, insanlara yol gösterici olan Kur'an'ın indirildiği aydır.", ref: "Bakara 185" },
    { ar: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", tr: "Sabır ve namaz ile Allah'tan yardım isteyin.", ref: "Bakara 45" },
    { ar: "ادْعُونِي أَسْتَجِبْ لَكُمْ", tr: "Bana dua edin, size karşılık vereyim.", ref: "Mü'min 60" },
    { ar: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", tr: "Şüphesiz Allah, sabredenlerle beraberdir.", ref: "Bakara 153" },
    { ar: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", tr: "Kim Allah'a tevekkül ederse, O ona yeter.", ref: "Talâk 3" },
    { ar: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", tr: "Zorluğun yanında bir kolaylık vardır.", ref: "İnşirah 5" },
    { ar: "وَلَذِكْرُ اللَّهِ أَكْبَرُ", tr: "Allah'ı anmak en büyük ibadettir.", ref: "Ankebût 45" },
    { ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً", tr: "Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver.", ref: "Bakara 201" },
    { ar: "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ", tr: "Biz Kur'an'dan, müminler için şifa ve rahmet olan şeyler indiririz.", ref: "İsrâ 82" },
    { ar: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", tr: "Şüphesiz biz sana Kevser'i verdik.", ref: "Kevser 1" },
];

// --- RAMADAN DATES ---
const RAMADAN_START = new Date(2026, 1, 19); // 19 Şubat 2026
const RAMADAN_END = new Date(2026, 2, 20);   // 20 Mart 2026 (Bayram başlangıç)
const BAYRAM_END = new Date(2026, 2, 23);    // 22 Mart 2026 (Bayram sonu, dahil)
const KADIR_NIGHT_DATE = new Date(2026, 2, 16); // 16 Mart 2026

// --- ACHIEVEMENTS DEFINITION ---
const BADGE_DEFS = [
    { id: 'first_fast', icon: '🌙', name: 'İlk Oruç', desc: 'İlk ibadeti kaydet', check: (s) => s.totalWorshipDays >= 1 },
    { id: 'streak_3', icon: '🔥', name: '3 Gün Seri', desc: '3 gün üst üste', check: (s) => s.streak >= 3 },
    { id: 'streak_7', icon: '⚡', name: '7 Gün Seri', desc: '7 gün üst üste', check: (s) => s.streak >= 7 },
    { id: 'streak_15', icon: '💎', name: '15 Gün Seri', desc: '15 gün üst üste', check: (s) => s.streak >= 15 },
    { id: 'streak_30', icon: '👑', name: '30 Gün Seri', desc: 'Tüm Ramazan', check: (s) => s.streak >= 30 },
    { id: 'full_day', icon: '⭐', name: 'Tam Gün', desc: 'Tüm ibadetleri tamamla', check: (s) => s.hasFullDay },
    { id: 'hatim_10', icon: '📖', name: '10 Cüz', desc: '10 cüz oku', check: (s) => s.hatimDone >= 10 },
    { id: 'hatim_20', icon: '📚', name: '20 Cüz', desc: '20 cüz oku', check: (s) => s.hatimDone >= 20 },
    { id: 'hatim_full', icon: '🏆', name: 'Hatim', desc: '30 cüzü tamamla', check: (s) => s.hatimDone >= 30 },
    { id: 'journal_5', icon: '✍️', name: 'Yazar', desc: '5 gün günlük yaz', check: (s) => s.journalDays >= 5 },
    { id: 'journal_15', icon: '📝', name: 'Günlükçü', desc: '15 gün günlük yaz', check: (s) => s.journalDays >= 15 },
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
    return dt.toISOString().split('T')[0];
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

    // Prayer times
    document.getElementById('time-fajr').textContent = today.fajr || '--:--';
    document.getElementById('time-sun').textContent = today.sun || '--:--';
    document.getElementById('time-dhuhr').textContent = today.dhuhr || '--:--';
    document.getElementById('time-asr').textContent = today.asr || '--:--';
    document.getElementById('time-maghrib').textContent = today.maghrib || '--:--';
    document.getElementById('time-isha').textContent = today.isha || '--:--';

    // Date
    document.getElementById('gregorianDate').textContent = formatDateLabel(now);

    // Ramadan progress
    updateRamadanProgress(now);

    // Fasting duration
    updateFastingDuration(today);

    // Verse
    const vIdx = now.getDate() % VERSES.length;
    document.getElementById('verseArabic').textContent = VERSES[vIdx].ar;
    document.getElementById('verseText').textContent = VERSES[vIdx].tr;
    document.getElementById('verseSource').textContent = VERSES[vIdx].ref;

    // Active prayer highlight
    highlightActivePrayer(today, now);

    // Countdown
    startCountdown(today, now);

    // Bayram namazı
    updateBayramNamazi(now);

    // Table
    renderTable(7);
}

// ==========================================================
// BAYRAM NAMAZI
// ==========================================================
// Bayram Namazı: always visible for selected city (Target: March 20)
function updateBayramNamazi(now) {
    const bayramEl = document.getElementById('bayramNamazi');
    const bayramTime = document.getElementById('bayramNamaziTime');
    if (!bayramEl || !bayramTime) return;
    if (!prayerTimings) return;

    // Find the first day of Bayram (March 20, 2026)
    // RAMADAN_END is March 20 (Bayram 1. Day)
    const bayramDate = new Date(2026, 2, 20);
    const key = dateKey(bayramDate);
    const bayramDay = prayerTimings.find(d => d.date && d.date.startsWith(key));

    if (!bayramDay || !bayramDay.sun) {
        bayramEl.style.display = 'none';
        return;
    }

    // Bayram namazı = Güneş (sunrise) + 45 minutes (approximation per Diyanet)
    const [sH, sM] = bayramDay.sun.split(':').map(Number);
    const totalMin = sH * 60 + sM + 45;
    const bH = Math.floor(totalMin / 60);
    const bM = totalMin % 60;

    bayramTime.textContent = `${String(bH).padStart(2, '0')}:${String(bM).padStart(2, '0')}`;
    bayramEl.style.display = 'flex';
}

// ==========================================================
// RAMADAN PROGRESS
// ==========================================================
function updateRamadanProgress(now) {
    const ramaDayEl = document.getElementById('ramadanDay');
    const progressLabel = document.getElementById('progressLabel');
    const progressDay = document.getElementById('progressDay');
    const progressFill = document.getElementById('progressFill');

    if (now >= RAMADAN_START && now < RAMADAN_END) {
        const dayNum = Math.floor((now - RAMADAN_START) / 86400000) + 1;
        const totalDays = Math.floor((RAMADAN_END - RAMADAN_START) / 86400000);
        const pct = Math.min(100, (dayNum / totalDays) * 100);

        ramaDayEl.textContent = `${dayNum}. Gün`;
        progressLabel.textContent = 'Ramazan İlerlemesi';
        progressDay.textContent = `${dayNum} / ${totalDays}`;
        progressFill.style.width = pct + '%';

        const kadir = now.getDate() === KADIR_NIGHT_DATE.getDate() && now.getMonth() === KADIR_NIGHT_DATE.getMonth();
        if (kadir) {
            ramaDayEl.textContent = `${dayNum}. Gün ✨ Kadir Gecesi`;
        }
    } else if (now < RAMADAN_START) {
        const daysLeft = Math.ceil((RAMADAN_START - now) / 86400000);
        ramaDayEl.textContent = `Ramazan'a ${daysLeft} gün`;
        progressLabel.textContent = 'Ramazan Bekleniyor';
        progressDay.textContent = `${daysLeft} gün kaldı`;
        progressFill.style.width = '0%';
    } else if (now >= RAMADAN_END && now < BAYRAM_END) {
        ramaDayEl.textContent = 'Bayram Mübarek! 🎉';
        progressLabel.textContent = 'Ramazan Bayramı (20-22 Mart)';
        progressDay.textContent = '30 / 30';
        progressFill.style.width = '100%';
    } else {
        ramaDayEl.textContent = 'Ramazan Tamamlandı';
        progressLabel.textContent = 'Ramazan 2026 Sona Erdi';
        progressDay.textContent = '30 / 30';
        progressFill.style.width = '100%';
    }
}

// ==========================================================
// FASTING DURATION
// ==========================================================
function updateFastingDuration(today) {
    const bar = document.getElementById('fastingBar');
    const dur = document.getElementById('fastingDuration');
    const fill = document.getElementById('fastingFill');
    const startEl = document.getElementById('fastingStart');
    const endEl = document.getElementById('fastingEnd');
    const pctEl = document.getElementById('fastingPct');
    const ringEl = document.getElementById('fastingRing');

    if (!today.fajr || !today.maghrib) { bar.style.display = 'none'; return; }
    bar.style.display = 'block';

    const [fH, fM] = today.fajr.split(':').map(Number);
    const [mH, mM] = today.maghrib.split(':').map(Number);
    const fastMins = (mH * 60 + mM) - (fH * 60 + fM);
    const hours = Math.floor(fastMins / 60);
    const mins = fastMins % 60;
    dur.textContent = `${hours} saat ${mins} dk`;
    startEl.textContent = today.fajr;
    endEl.textContent = today.maghrib;

    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const fStart = fH * 60 + fM;
    const fEnd = mH * 60 + mM;
    const circumference = 263.9; // 2 * PI * 42
    let pct = 0;

    if (nowMin >= fStart && nowMin <= fEnd) {
        pct = Math.round(((nowMin - fStart) / (fEnd - fStart)) * 100);
    } else if (nowMin > fEnd) {
        pct = 100;
    }

    if (fill) fill.style.width = pct + '%';
    if (pctEl) pctEl.textContent = `%${pct}`;
    if (ringEl) {
        const offset = circumference - (circumference * pct / 100);
        ringEl.style.strokeDashoffset = offset;
    }
}

// ==========================================================
// HIGHLIGHT ACTIVE PRAYER
// ==========================================================
function highlightActivePrayer(today, now) {
    const timesMap = [
        { id: 'card-fajr', time: today.fajr },
        { id: 'card-sun', time: today.sun },
        { id: 'card-dhuhr', time: today.dhuhr },
        { id: 'card-asr', time: today.asr },
        { id: 'card-maghrib', time: today.maghrib },
        { id: 'card-isha', time: today.isha }
    ];

    const nowMin = now.getHours() * 60 + now.getMinutes();
    let activeIdx = 0;
    for (let i = timesMap.length - 1; i >= 0; i--) {
        if (!timesMap[i].time) continue;
        const [h, m] = timesMap[i].time.split(':').map(Number);
        if (nowMin >= h * 60 + m) { activeIdx = i; break; }
    }

    timesMap.forEach((t, i) => {
        const el = document.getElementById(t.id);
        if (el) el.classList.toggle('active', i === activeIdx);
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

    const isRamadan = now >= RAMADAN_START && now < RAMADAN_END;

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

        let displayName = target.name;
        if (isRamadan) {
            if (target.name === 'AKŞAM') displayName = 'İFTAR';
            if (target.name === 'İMSAK') displayName = 'SAHUR';
        }

        const suffix = (selectedPrayer !== 'auto' && target.sec > 86400) ? ' (yarın)' : '';
        nextPrayerName.textContent = displayName + ' VAKTİNE KALAN' + suffix;
        nextPrayerTime.textContent = target.time;

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
        const dayOfRamadan = Math.floor((dt - RAMADAN_START) / 86400000) + 1;
        const isKadir = dt.getDate() === KADIR_NIGHT_DATE.getDate() && dt.getMonth() === KADIR_NIGHT_DATE.getMonth();

        const tr = document.createElement('tr');
        if (isToday) tr.className = 'today-row';
        if (isKadir) tr.classList.add('kadir-row');

        const dateLabel = `${dt.getDate()} ${monthsShort[dt.getMonth()]} ${daysShort[dt.getDay()]}`;
        tr.innerHTML = `
            <td>${isToday ? dateLabel + ' ★' : dateLabel}</td>
            <td>${d.fajr}</td><td>${d.sun}</td><td>${d.dhuhr}</td>
            <td>${d.asr}</td><td>${d.maghrib}</td><td>${d.isha}</td>
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
    const phases = [
        { ar: 'سُبْحَانَ اللَّهِ', tr: 'SubhanAllah', target: 33 },
        { ar: 'الْحَمْدُ لِلَّهِ', tr: 'Elhamdulillah', target: 33 },
        { ar: 'اللَّهُ أَكْبَرُ', tr: 'Allahuekber', target: 33 }
    ];

    let phase = parseInt(localStorage.getItem('tesbihPhase') || '0');
    let count = parseInt(localStorage.getItem('tesbihCount') || '0');
    let completions = parseInt(localStorage.getItem('tesbihCompletions') || '0');
    const btn = document.getElementById('tesbihBtn');
    const countEl = document.getElementById('tesbihCount');
    const targetEl = document.getElementById('tesbihTarget');
    const labelEl = document.getElementById('tesbihLabel');
    const labelTrEl = document.getElementById('tesbihLabelTr');
    const progressEl = document.getElementById('tesbihProgress');
    const stepEls = document.querySelectorAll('.step');
    const circumference = 2 * Math.PI * 70;

    function updateUI() {
        const p = phases[phase];
        countEl.textContent = count;
        targetEl.textContent = `/ ${p.target}`;
        labelEl.textContent = p.ar;
        labelTrEl.textContent = p.tr;

        const offset = circumference - (count / p.target) * circumference;
        progressEl.setAttribute('stroke-dashoffset', Math.max(0, offset));

        stepEls.forEach((s, i) => {
            s.classList.remove('active', 'done');
            if (i < phase) s.classList.add('done');
            if (i === phase) s.classList.add('active');
        });

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

    progressEl.setAttribute('stroke-dasharray', circumference);
    updateUI();
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
                // Find first incomplete as "current"
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
// JOURNAL (Ramazan Günlüğü)
// ==========================================================
function initJournal() {
    const textarea = document.getElementById('journalText');
    const dateLabel = document.getElementById('journalDateLabel');
    const saveBtn = document.getElementById('journalSave');
    const savedMsg = document.getElementById('journalSavedMsg');
    let viewDate = new Date();

    function getKey(dt) { return `journal_${dateKey(dt)}`; }

    function render() {
        dateLabel.textContent = formatDateLabel(viewDate);
        const saved = localStorage.getItem(getKey(viewDate));
        textarea.value = saved || '';
        savedMsg.classList.remove('show');
    }

    saveBtn.addEventListener('click', () => {
        localStorage.setItem(getKey(viewDate), textarea.value);
        savedMsg.classList.add('show');
        setTimeout(() => savedMsg.classList.remove('show'), 2000);
        checkAchievements();
    });

    document.getElementById('journalPrevDay').addEventListener('click', () => {
        viewDate = new Date(viewDate.getTime() - 86400000);
        render();
    });
    document.getElementById('journalNextDay').addEventListener('click', () => {
        viewDate = new Date(viewDate.getTime() + 86400000);
        render();
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
    // Total worship days
    let totalWorshipDays = 0;
    let streak = 0;
    let hasFullDay = false;
    const today = new Date();

    // Check last 30 days backwards for streak
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

    // Hatim
    const hatimSaved = localStorage.getItem('hatim_progress');
    const hatimDone = hatimSaved ? JSON.parse(hatimSaved).completed.length : 0;

    // Journal
    let journalDays = 0;
    for (let i = 0; i < 30; i++) {
        const dt = new Date(today.getTime() - i * 86400000);
        const saved = localStorage.getItem(`journal_${dateKey(dt)}`);
        if (saved && saved.trim().length > 0) journalDays++;
    }

    // Tesbih completions
    const tesbihComplete = parseInt(localStorage.getItem('tesbihCompletions') || '0');

    return { totalWorshipDays, streak, hasFullDay, hatimDone, journalDays, tesbihComplete };
}

function checkAchievements() {
    const stats = getAchievementStats();

    // Update streak display
    const streakEl = document.getElementById('streakCount');
    if (streakEl) streakEl.textContent = stats.streak;

    // Check badges
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
function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);

    document.getElementById('themeToggle').addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
    });
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    icon.className = theme === 'dark' ? 'ri-sun-line' : 'ri-moon-clear-line';
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

        const text = `🌙 ${currentCity} - Namaz Vakitleri\n📅 ${document.getElementById('gregorianDate').textContent}\n\n🕌 İmsak: ${today.fajr}\n🌅 Güneş: ${today.sun}\n🕐 Öğle: ${today.dhuhr}\n🕑 İkindi: ${today.asr}\n🌇 Akşam: ${today.maghrib}\n🌙 Yatsı: ${today.isha}\n\n📱 Kaynak: Diyanet İşleri Başkanlığı`;

        if (navigator.share) {
            try { await navigator.share({ title: 'Namaz Vakitleri', text }); } catch (e) { }
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
// INIT
// ==========================================================
window.addEventListener('DOMContentLoaded', () => {
    initSplash();
    initCitySelector();
    initNav();
    initTabs();
    initTheme();
    initTesbih();
    initWorship();
    initHatim();
    initJournal();
    initAchievements();
    initShare();
    initPrint();
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
            // Re-render with new selection
            if (prayerTimings) updateDisplay();
        });
    }

    fetchPrayerTimes(currentCity);
});
