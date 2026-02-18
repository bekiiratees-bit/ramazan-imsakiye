#!/usr/bin/env python3
"""Fetch prayer times for all 81 Turkish cities and generate embedded_data.js"""
import json, urllib.request, time, sys

CITIES = {
    "Adana": 9146, "Adıyaman": 9158, "Afyonkarahisar": 9167, "Ağrı": 9185,
    "Aksaray": 9193, "Amasya": 9198, "Ankara": 9206, "Antalya": 9225,
    "Ardahan": 9238, "Artvin": 9246, "Aydın": 9252, "Balıkesir": 9270,
    "Bartın": 9285, "Batman": 9288, "Bayburt": 9295, "Bilecik": 9297,
    "Bingöl": 9303, "Bitlis": 9311, "Bolu": 9319, "Burdur": 9327,
    "Bursa": 9335, "Çanakkale": 9352, "Çankırı": 9359, "Çorum": 9366,
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

API = "https://prayertimes.api.abdus.dev/api/diyanet/prayertimes?location_id="
all_data = {}
total = len(CITIES)

for i, (city, cid) in enumerate(CITIES.items(), 1):
    print(f"[{i}/{total}] {city}...", end=" ", flush=True)
    try:
        req = urllib.request.Request(API + str(cid))
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            all_data[city] = data
            print(f"OK ({len(data)} days)")
    except Exception as e:
        print(f"FAIL: {e}")
    time.sleep(0.2)

# Write JS file
outpath = "/Users/bekirates/.gemini/antigravity/scratch/ramazan-imsakiye/embedded_data.js"
with open(outpath, "w", encoding="utf-8") as f:
    f.write("// Diyanet prayer times - All 81 cities - Ramadan 2026\n")
    f.write("const EMBEDDED_DATA = ")
    json.dump(all_data, f, ensure_ascii=False)
    f.write(";\n")

print(f"\nDone! {len(all_data)}/{total} cities saved to embedded_data.js")
