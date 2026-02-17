// ===========================================================
// RAMAZAN İMSAKİYE 2026 - APP.JS
// Kaynak: Diyanet İşleri Başkanlığı (Gömülü Veri)
// ===========================================================

// --- SERVICE WORKER (PWA Offline Desteği) ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(reg => console.log('SW registered:', reg.scope))
        .catch(err => console.warn('SW registration failed:', err));
}

// --- DİYANET İL ID'LERİ (81 İL) ---
const CITY_IDS = {
    "Adana": 9146, "Adıyaman": 9158, "Afyonkarahisar": 9167,
    "Ağrı": 9185, "Aksaray": 9193, "Amasya": 9198,
    "Ankara": 9206, "Antalya": 9225, "Ardahan": 9238,
    "Artvin": 9246, "Aydın": 9252, "Balıkesir": 9270,
    "Bartın": 9285, "Batman": 9288, "Bayburt": 9295,
    "Bilecik": 9297, "Bingöl": 9303, "Bitlis": 9311,
    "Bolu": 9319, "Burdur": 9327, "Bursa": 9335,
    "Çanakkale": 9352, "Çankırı": 9359, "Çorum": 9366,
    "Denizli": 9381, "Diyarbakır": 9392, "Düzce": 9403,
    "Edirne": 9407, "Elazığ": 9432, "Erzincan": 9440,
    "Erzurum": 9452, "Eskişehir": 9470, "Gaziantep": 9479,
    "Giresun": 9494, "Gümüşhane": 9501, "Hakkari": 9507,
    "Hatay": 9512, "Iğdır": 9528, "Isparta": 9531,
    "İstanbul": 9541, "İzmir": 9560, "Kahramanmaraş": 9572,
    "Karabük": 9581, "Karaman": 9587, "Kars": 9594,
    "Kastamonu": 9601, "Kayseri": 9609, "Kilis": 9620,
    "Kırıkkale": 9623, "Kırklareli": 9629, "Kırşehir": 9635,
    "Kocaeli": 9638, "Konya": 9649, "Kütahya": 9676,
    "Malatya": 9689, "Manisa": 9703, "Mardin": 9716,
    "Mersin": 9726, "Muğla": 9737, "Muş": 9747,
    "Nevşehir": 9755, "Niğde": 9760, "Ordu": 9766,
    "Osmaniye": 9782, "Rize": 9785, "Sakarya": 9793,
    "Samsun": 9807, "Şanlıurfa": 9819, "Siirt": 9831,
    "Sinop": 9839, "Şırnak": 9846, "Sivas": 9854,
    "Tekirdağ": 9868, "Tokat": 9874, "Trabzon": 9884,
    "Tunceli": 9893, "Uşak": 9901, "Van": 9907,
    "Yalova": 9919, "Yozgat": 9923, "Zonguldak": 9935
};

// --- RAMAZAN 2026: 30 GÜNLÜK AYETLER ---
const dailyVerses = [
    { arabic: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ", turkish: "Ramazan ayı, insanlara yol gösterici, doğrunun ve doğruyu eğriden ayırmanın açık delilleri olarak Kur'an'ın indirildiği aydır.", source: "Bakara Suresi, 2:185" },
    { arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ", turkish: "Ey iman edenler! Oruç, sizden öncekilere farz kılındığı gibi, size de farz kılındı. Umulur ki korunursunuz.", source: "Bakara Suresi, 2:183" },
    { arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ", turkish: "Kullarım sana beni sorduğunda, muhakkak ki ben çok yakınım.", source: "Bakara Suresi, 2:186" },
    { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", turkish: "Şüphesiz Allah, sabredenlerle beraberdir.", source: "Bakara Suresi, 2:153" },
    { arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", turkish: "Kim Allah'a tevekkül ederse, O kendisine yeter.", source: "Talak Suresi, 65:3" },
    { arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ", turkish: "Öyleyse siz beni anın ki ben de sizi anayım. Bana şükredin, nankörlük etmeyin.", source: "Bakara Suresi, 2:152" },
    { arabic: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ", turkish: "Şüphesiz, biz onu Kadir gecesinde indirdik.", source: "Kadir Suresi, 97:1" },
    { arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", turkish: "Sabır ve namaz ile Allah'tan yardım isteyin.", source: "Bakara Suresi, 2:45" },
    { arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", turkish: "Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru.", source: "Bakara Suresi, 2:201" },
    { arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", turkish: "Allah, hiçbir kimseye gücünün yetmediğini yüklemez.", source: "Bakara Suresi, 2:286" },
    { arabic: "وَقُلْ رَبِّ زِدْنِي عِلْمًا", turkish: "Ve de ki: Rabbim! İlmimi artır.", source: "Taha Suresi, 20:114" },
    { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", turkish: "Muhakkak ki zorlukla beraber bir kolaylık vardır.", source: "İnşirah Suresi, 94:6" },
    { arabic: "وَلَذِكْرُ اللَّهِ أَكْبَرُ", turkish: "Allah'ı zikretmek elbette en büyük ibadettir.", source: "Ankebut Suresi, 29:45" },
    { arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", turkish: "Kim Allah'tan korkarsa, Allah ona bir çıkış yolu açar.", source: "Talak Suresi, 65:2" },
    { arabic: "ادْعُونِي أَسْتَجِبْ لَكُمْ", turkish: "Bana dua edin, size karşılık vereyim.", source: "Mü'min Suresi, 40:60" },
    { arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", turkish: "Nerede olursanız olun, O sizinle beraberdir.", source: "Hadid Suresi, 57:4" },
    { arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", turkish: "De ki: O, Allah'tır, bir tektir.", source: "İhlas Suresi, 112:1" },
    { arabic: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", turkish: "Rabbin sana verecek, sen de hoşnut olacaksın.", source: "Duha Suresi, 93:5" },
    { arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اصْبِرُوا وَصَابِرُوا", turkish: "Ey iman edenler! Sabredin, sabır yarışında düşmanlarınızı geçin.", source: "Ali İmran Suresi, 3:200" },
    { arabic: "وَمَا تُقَدِّمُوا لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ اللَّهِ", turkish: "Kendiniz için önceden ne iyilik gönderirseniz, onu Allah katında bulursunuz.", source: "Bakara Suresi, 2:110" },
    { arabic: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ", turkish: "Allah'ın rahmetinden ümit kesmeyin.", source: "Yusuf Suresi, 12:87" },
    { arabic: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ", turkish: "Şüphesiz Allah, çok tövbe edenleri ve çok temizlenenleri sever.", source: "Bakara Suresi, 2:222" },
    { arabic: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ", turkish: "Rahmetim her şeyi kuşatmıştır.", source: "A'raf Suresi, 7:156" },
    { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", turkish: "Dikkat edin! Kalpler ancak Allah'ı anmakla huzur bulur.", source: "Ra'd Suresi, 13:28" },
    { arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", turkish: "Şüphesiz güçlükle beraber bir kolaylık vardır.", source: "İnşirah Suresi, 94:5" },
    { arabic: "وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ", turkish: "Allah, iyilik edenleri sever.", source: "Ali İmran Suresi, 3:134" },
    { arabic: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ", turkish: "Kadir gecesi bin aydan daha hayırlıdır.", source: "Kadir Suresi, 97:3" },
    { arabic: "وَتُوبُوا إِلَى اللَّهِ جَمِيعًا أَيُّهَ الْمُؤْمِنُونَ لَعَلَّكُمْ تُفْلِحُونَ", turkish: "Ey müminler! Hep birlikte Allah'a tövbe ediniz ki kurtuluşa eresiniz.", source: "Nur Suresi, 24:31" },
    { arabic: "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ", turkish: "Biz ona şah damarından daha yakınız.", source: "Kaf Suresi, 50:16" },
    { arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ", turkish: "De ki: Ey kendi nefisleri aleyhine haddi aşan kullarım! Allah'ın rahmetinden ümit kesmeyin.", source: "Zümer Suresi, 39:53" }
];

// --- TESBİH VERİLERİ ---
const TESBIH_PHASES = [
    { arabic: "سُبْحَانَ اللَّهِ", turkish: "SubhanAllah", target: 33 },
    { arabic: "الْحَمْدُ لِلَّهِ", turkish: "Elhamdulillah", target: 33 },
    { arabic: "اللَّهُ أَكْبَرُ", turkish: "Allahuekber", target: 33 }
];

// --- UYGULAMA DURUMU ---
let currentCity = localStorage.getItem('selectedCity') || 'Elazığ';
let currentTheme = localStorage.getItem('theme') || 'dark';
let prayerTimings = null;
let countdownInterval = null;
let currentTabDays = 7;

// Tesbih state
let tesbihPhase = 0;
let tesbihCount = 0;

// --- DOM ---
const citySelect = document.getElementById('citySelect');
const cdHours = document.getElementById('cdHours');
const cdMinutes = document.getElementById('cdMinutes');
const cdSeconds = document.getElementById('cdSeconds');
const nextPrayerName = document.getElementById('nextPrayerName');
const gregorianDate = document.getElementById('gregorianDate');
const hijriDate = document.getElementById('hijriDate');
const ramadanDayEl = document.getElementById('ramadanDay');
const verseArabic = document.getElementById('verseArabic');
const verseText = document.getElementById('verseText');
const verseSource = document.getElementById('verseSource');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const progressFill = document.getElementById('progressFill');
const progressDay = document.getElementById('progressDay');
const bayramCountdown = document.getElementById('bayramCountdown');
const prayerTableBody = document.getElementById('prayerTableBody');
const printBtn = document.getElementById('printBtn');

// --- BAŞLATMA ---
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(currentTheme);
    populateCities();
    displayDailyVerse();
    fetchPrayerTimes(currentCity);
    updateProgress();
    initTesbih();
    initTabs();

    citySelect.addEventListener('change', (e) => {
        currentCity = e.target.value;
        localStorage.setItem('selectedCity', currentCity);
        fetchPrayerTimes(currentCity);
    });

    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        applyTheme(currentTheme);
    });

    printBtn.addEventListener('click', () => {
        // Switch to monthly view before printing
        currentTabDays = 30;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.tab-btn[data-days="30"]').classList.add('active');
        buildTable(currentCity, 30);
        setTimeout(() => window.print(), 300);
    });
});

// --- TEMA ---
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'light' ? 'ri-moon-line' : 'ri-sun-line';
}

// --- İLLER ---
function populateCities() {
    citySelect.innerHTML = '';
    const sortedCities = Object.keys(CITY_IDS).sort((a, b) => a.localeCompare(b, 'tr'));
    sortedCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
    citySelect.value = currentCity;
}

// --- NAMAZ VAKİTLERİNİ GÖMÜLÜ VERİDEN ÇEK ---
function fetchPrayerTimes(city) {
    cdHours.textContent = '--';
    cdMinutes.textContent = '--';
    cdSeconds.textContent = '--';
    nextPrayerName.textContent = 'Yükleniyor...';

    const data = EMBEDDED_DATA[city];
    if (!data || data.length === 0) {
        nextPrayerName.textContent = 'İl verisi bulunamadı';
        return;
    }

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    let todayData = data.find(d => d.date.startsWith(todayStr));
    if (!todayData) todayData = data[0];

    prayerTimings = todayData;
    updateUI(todayData);
    buildTable(city, currentTabDays);
}

// --- ARAYÜZ GÜNCELLE ---
function updateUI(data) {
    if (!data) return;

    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    gregorianDate.textContent = now.toLocaleDateString('tr-TR', options);

    updateHijriDate(now);

    const ramDay = getRamadanDay();
    if (ramDay > 0 && ramDay <= 30) {
        ramadanDayEl.textContent = `Ramazan ${ramDay}. Gün`;
    } else {
        ramadanDayEl.textContent = 'Ramazan Dışı';
    }

    document.getElementById('time-fajr').textContent = data.fajr;
    document.getElementById('time-sun').textContent = data.sun;
    document.getElementById('time-dhuhr').textContent = data.dhuhr;
    document.getElementById('time-asr').textContent = data.asr;
    document.getElementById('time-maghrib').textContent = data.maghrib;
    document.getElementById('time-isha').textContent = data.isha;

    startCountdown(data);
}

// --- HİCRİ TARİH ---
function updateHijriDate(date) {
    const ramDay = getRamadanDay();
    if (ramDay > 0 && ramDay <= 30) {
        hijriDate.textContent = `${ramDay} Ramazan 1447`;
    } else {
        try {
            const hijriFormatter = new Intl.DateTimeFormat('tr-u-ca-islamic', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
            hijriDate.textContent = hijriFormatter.format(date);
        } catch (e) {
            hijriDate.textContent = 'Hicri Takvim';
        }
    }
}

// --- RAMAZAN GÜNÜ ---
function getRamadanDay() {
    const ramadanStart = new Date(2026, 1, 18); // 18 Şubat 2026
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - ramadanStart) / (1000 * 60 * 60 * 24));
    return (diffDays >= 0 && diffDays < 30) ? diffDays + 1 : -1;
}

// --- İLERLEME ÇUBUĞU ---
function updateProgress() {
    const ramDay = getRamadanDay();
    const progressSection = document.getElementById('progressSection');

    if (ramDay > 0 && ramDay <= 30) {
        progressSection.style.display = 'block';
        const pct = (ramDay / 30) * 100;
        progressFill.style.width = pct + '%';
        progressDay.textContent = `${ramDay}. gün / 30`;

        const daysLeft = 30 - ramDay;
        if (daysLeft > 0) {
            bayramCountdown.textContent = `Bayrama ${daysLeft + 1} gün`;
        } else {
            bayramCountdown.textContent = 'Bayram yarın! 🎉';
        }
    } else {
        // Ramazan öncesi: Ramazana kalan günleri göster
        const ramadanStart = new Date(2026, 1, 18);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysUntil = Math.ceil((ramadanStart - today) / (1000 * 60 * 60 * 24));

        if (daysUntil > 0 && daysUntil <= 60) {
            progressSection.style.display = 'block';
            progressFill.style.width = '0%';
            progressDay.textContent = `Ramazan'a ${daysUntil} gün`;
            bayramCountdown.textContent = '';
        } else {
            progressSection.style.display = 'none';
        }
    }
}

// --- GÜNLÜK AYET ---
function displayDailyVerse() {
    const ramDay = getRamadanDay();
    let idx;
    if (ramDay > 0 && ramDay <= 30) {
        idx = ramDay - 1;
    } else {
        const startOfYear = new Date(new Date().getFullYear(), 0, 0);
        const dayOfYear = Math.floor((new Date() - startOfYear) / (1000 * 60 * 60 * 24));
        idx = dayOfYear % dailyVerses.length;
    }
    const verse = dailyVerses[idx];
    verseArabic.textContent = verse.arabic;
    verseText.textContent = `"${verse.turkish}"`;
    verseSource.textContent = `— ${verse.source}`;
}

// --- TABLO SEKMELERİ ---
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTabDays = parseInt(btn.dataset.days);
            buildTable(currentCity, currentTabDays);
        });
    });
}

function buildTable(city, days) {
    const data = EMBEDDED_DATA[city];
    if (!data || data.length === 0) {
        prayerTableBody.innerHTML = '<tr><td colspan="7">Veri bulunamadı</td></tr>';
        return;
    }

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Find today's index in data
    let startIdx = data.findIndex(d => d.date.startsWith(todayStr));
    if (startIdx === -1) startIdx = 0;

    const rows = [];
    const endIdx = Math.min(startIdx + days, data.length);

    const dayNames = ['Pzr', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

    for (let i = startIdx; i < endIdx; i++) {
        const d = data[i];
        const dateObj = new Date(d.date);
        const dayName = dayNames[dateObj.getDay()];
        const dateLabel = `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]} ${dayName}`;
        const isToday = d.date.startsWith(todayStr);

        rows.push(`<tr class="${isToday ? 'today-row' : ''}">
            <td>${dateLabel}${isToday ? ' ★' : ''}</td>
            <td>${d.fajr}</td>
            <td>${d.sun}</td>
            <td>${d.dhuhr}</td>
            <td>${d.asr}</td>
            <td>${d.maghrib}</td>
            <td>${d.isha}</td>
        </tr>`);
    }

    prayerTableBody.innerHTML = rows.join('');
}

// --- GERİ SAYIM ---
function startCountdown(data) {
    if (countdownInterval) clearInterval(countdownInterval);

    function toDate(timeStr) {
        const [h, m] = timeStr.split(':').map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        return d;
    }

    const ramDay = getRamadanDay();
    const isRamadan = ramDay > 0 && ramDay <= 30;

    const prayers = [
        { key: 'fajr', name: isRamadan ? 'SAHUR / İMSAK' : 'İMSAK', time: toDate(data.fajr) },
        { key: 'sun', name: 'GÜNEŞ', time: toDate(data.sun) },
        { key: 'dhuhr', name: 'ÖĞLE', time: toDate(data.dhuhr) },
        { key: 'asr', name: 'İKİNDİ', time: toDate(data.asr) },
        { key: 'maghrib', name: isRamadan ? '🌙 İFTAR' : 'AKŞAM', time: toDate(data.maghrib) },
        { key: 'isha', name: 'YATSI', time: toDate(data.isha) }
    ];

    const now = new Date();
    let target = null;
    let targetName = '';

    for (const p of prayers) {
        if (p.time > now) {
            target = p.time;
            targetName = p.name;
            highlightCard(p.key);
            break;
        }
    }

    if (!target) {
        target = toDate(data.fajr);
        target.setDate(target.getDate() + 1);
        targetName = isRamadan ? 'SAHUR / İMSAK' : 'İMSAK';
        highlightCard('fajr');
    }

    nextPrayerName.textContent = `${targetName} Vaktine Kalan`;

    function tick() {
        const diff = target - new Date();
        if (diff <= 0) {
            clearInterval(countdownInterval);
            fetchPrayerTimes(currentCity);
            return;
        }
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        cdHours.textContent = String(h).padStart(2, '0');
        cdMinutes.textContent = String(m).padStart(2, '0');
        cdSeconds.textContent = String(s).padStart(2, '0');
    }

    tick();
    countdownInterval = setInterval(tick, 1000);
}

// --- AKTİF KART ---
function highlightCard(key) {
    document.querySelectorAll('.prayer-card').forEach(c => c.classList.remove('active'));
    const card = document.getElementById(`card-${key}`);
    if (card) card.classList.add('active');
}

// --- TESBİH SAYACI ---
function initTesbih() {
    const btn = document.getElementById('tesbihBtn');
    const resetBtn = document.getElementById('tesbihReset');
    const countEl = document.getElementById('tesbihCount');
    const targetEl = document.getElementById('tesbihTarget');
    const labelEl = document.getElementById('tesbihLabel');
    const labelTrEl = document.getElementById('tesbihLabelTr');

    // Load saved state
    tesbihPhase = parseInt(localStorage.getItem('tesbihPhase') || '0');
    tesbihCount = parseInt(localStorage.getItem('tesbihCount') || '0');
    updateTesbihUI();

    btn.addEventListener('click', () => {
        tesbihCount++;
        const phase = TESBIH_PHASES[tesbihPhase];

        // Pulse animation
        btn.classList.add('pulse');
        setTimeout(() => btn.classList.remove('pulse'), 300);

        if (tesbihCount >= phase.target) {
            // Mark current phase as done
            document.querySelectorAll('.tesbih-phase')[tesbihPhase].classList.add('done');
            document.querySelectorAll('.tesbih-phase')[tesbihPhase].classList.remove('active');

            if (tesbihPhase < 2) {
                tesbihPhase++;
                tesbihCount = 0;
            }
            // If all 3 phases done, stay at last count
        }

        saveTesbihState();
        updateTesbihUI();
    });

    resetBtn.addEventListener('click', () => {
        tesbihPhase = 0;
        tesbihCount = 0;
        saveTesbihState();
        document.querySelectorAll('.tesbih-phase').forEach(p => {
            p.classList.remove('done', 'active');
        });
        updateTesbihUI();
    });

    function updateTesbihUI() {
        const phase = TESBIH_PHASES[tesbihPhase];
        countEl.textContent = tesbihCount;
        targetEl.textContent = `/ ${phase.target}`;
        labelEl.textContent = phase.arabic;
        labelTrEl.textContent = phase.turkish;

        // Update phase indicators
        document.querySelectorAll('.tesbih-phase').forEach((el, i) => {
            el.classList.remove('active');
            if (i < tesbihPhase) {
                el.classList.add('done');
            } else if (i === tesbihPhase) {
                el.classList.add('active');
            }
        });
    }

    function saveTesbihState() {
        localStorage.setItem('tesbihPhase', tesbihPhase);
        localStorage.setItem('tesbihCount', tesbihCount);
    }
}
