#!/usr/bin/env python3
"""
Ezan Vakti Pro - Diyanet Namaz Vakitleri Çekme Scripti
Diyanet API'sinden tüm 81 il için güncel vakitleri çeker
Tarih aralığı: Bugünden itibaren 60 gün (Nisan - Haziran 2026)
"""
import json, urllib.request, time, sys, datetime

# 81 il ve Diyanet location ID'leri (merkez ilçe)
CITIES = {
    "Adana": 9146, "Adıyaman": 9158, "Afyonkarahisar": 9167, "Ağrı": 9185,
    "Aksaray": 9193, "Amasya": 9198, "Ankara": 9206, "Antalya": 9225,
    "Ardahan": 9238, "Artvin": 9246, "Aydın": 9252, "Balıkesir": 9270,
    "Bartın": 9285, "Batman": 9288, "Bayburt": 9295, "Bilecik": 9297,
    "Bingöl": 9303, "Bitlis": 9311, "Bolu": 9315, "Burdur": 9327,
    "Bursa": 9335, "Çanakkale": 9352, "Çankırı": 9359, "Çorum": 9370,
    "Denizli": 9381, "Diyarbakır": 9392, "Düzce": 9403, "Edirne": 9407,
    "Elazığ": 9432, "Erzincan": 9440, "Erzurum": 9452, "Eskişehir": 9470,
    "Gaziantep": 9479, "Giresun": 9494, "Gümüşhane": 9501, "Hakkari": 9507,
    "Hatay": 9512, "Iğdır": 9528, "Isparta": 9531, "İstanbul": 9541,
    "İzmir": 9560, "Kahramanmaraş": 9572, "Karabük": 9581, "Karaman": 9587,
    "Kars": 9594, "Kastamonu": 9601, "Kayseri": 9609, "Kilis": 9620,
    "Kırıkkale": 9623, "Kırklareli": 9629, "Kırşehir": 9635, "Kocaeli": 9638,
    "Konya": 9649, "Kütahya": 9676, "Malatya": 9689, "Manisa": 9703,
    "Mardin": 9716, "Mersin": 9726, "Muğla": 9737, "Muş": 9747,
    "Nevşehir": 9755, "Niğde": 9760, "Ordu": 9766, "Osmaniye": 9782,
    "Rize": 9785, "Sakarya": 9793, "Samsun": 9807, "Şanlıurfa": 9819,
    "Siirt": 9831, "Sinop": 9839, "Şırnak": 9846, "Sivas": 9854,
    "Tekirdağ": 9868, "Tokat": 9874, "Trabzon": 9884, "Tunceli": 9893,
    "Uşak": 9901, "Van": 9907, "Yalova": 9919, "Yozgat": 9923,
    "Zonguldak": 9935
}

# Diyanet API URL'i
API_BASE = "https://prayertimes.api.abdus.dev/api/diyanet/prayertimes?location_id="

all_data = {}
total = len(CITIES)
failed = []

print(f"=== Ezan Vakti Pro - Diyanet Veri Çekme ===")
print(f"Toplam {total} il için istek gönderilecek...")
print()

for i, (city, cid) in enumerate(CITIES.items(), 1):
    url = API_BASE + str(cid)
    print(f"[{i:2d}/{total}] {city:<20} ...", end=" ", flush=True)
    
    success = False
    for attempt in range(3):  # 3 deneme
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "Mozilla/5.0 EzanVaktiPro/1.0"}
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode())
                
                # Filter to include today onward (from April 2026)
                today = datetime.date.today()
                filtered = [d for d in data if d.get("date", "")[:10] >= str(today)]
                
                if filtered:
                    all_data[city] = filtered
                    print(f"OK ({len(filtered)} günlük veri)")
                else:
                    # Use all data if filter yields nothing
                    all_data[city] = data
                    print(f"OK* (tüm {len(data)} gün)")
                
                success = True
                break
        except Exception as e:
            if attempt < 2:
                print(f"deneme {attempt+2}..", end=" ", flush=True)
                time.sleep(1)
            else:
                print(f"HATA: {e}")
                failed.append(city)
    
    if not success and city not in failed:
        failed.append(city)
    
    time.sleep(0.15)  # Rate limit

print()
print(f"=== Tamamlandı ===")
print(f"Başarılı: {len(all_data)}/{total}")
if failed:
    print(f"Başarısız: {failed}")

# Dosyaya yaz
outpath = "/Users/bekirates/.gemini/antigravity/scratch/ramazan-imsakiye/embedded_data.js"
with open(outpath, "w", encoding="utf-8") as f:
    f.write("// Ezan Vakti Pro - Diyanet İşleri Başkanlığı Namaz Vakitleri\n")
    f.write("// Son güncelleme: " + datetime.datetime.now().strftime("%Y-%m-%d %H:%M") + "\n")
    f.write("const EMBEDDED_DATA = ")
    json.dump(all_data, f, ensure_ascii=False, separators=(',', ':'))
    f.write(";\n")

import os
size_kb = os.path.getsize(outpath) // 1024
print(f"embedded_data.js güncellendi: {size_kb} KB, {len(all_data)} il")
