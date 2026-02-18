# Android APK Yükleme & Oluşturma Rehberi

Bu proje bir **PWA (Progressive Web App)** projesidir. Tıpkı bir mobil uygulama gibi çalışır. Android telefonunuza yüklemek için 2 yöntem vardır:

## Yöntem 1: En Kolay (Tavsiye Edilen) - WebAPK (Ana Ekrana Ekle)
Bu yöntemle uygulamanız otomatik güncellenir ve APK gibi çalışır.

1. Android telefonunuzda **Chrome** tarayıcısını açın.
2. Sitenize gidin: `https://bekiiratees-bit.github.io/ramazan-imsakiye/` (veya mevcut URL)
3. Sağ üstteki **3 nokta** menüsüne dokunun.
4. **"Ana Ekrana Ekle"** veya **"Uygulamayı Yükle"** seçeneğine dokunun.
5. Telefonunuz bu siteyi otomatik olarak bir **Uygulama (APK)** gibi paketleyip menünüze ikon olarak ekleyecektir.

**Avantajı:** Kod güncellendiğinde (GitHub'a attıklarımız), uygulamayı kapatıp açmanız yeterlidir. Yeni dosya indirmenize gerek yoktur.

---

## Yöntem 2: Google Play İçin Gerçek APK (PWABuilder)
Eğer bu uygulamayı Google Play Store'a yüklemek veya arkadaşınıza dosya olarak göndermek istiyorsanız:

1. [PWABuilder.com](https://www.pwabuilder.com/) adresine gidin.
2. Kutucuğa sitenizin adresini yapıştırın: `https://bekiiratees-bit.github.io/ramazan-imsakiye/`
3. **Start** butonuna basın.
4. Sistem `manifest.json` dosyanızı kontrol edecek. Her şey yeşil (Ready) görünmeli.
5. **Build My PWA** butonuna tıklayın.
6. **Android** seçeneğini seçin.
7. **Download** diyerek `.apk` ve `.aab` (Google Play için) dosyalarını indirebilirsiniz.

**Not:** Bu yöntemle aldığınız APK, Play Store üzerinden güncelleme almadıkça elle güncellenmesi gerekir. O yüzden 1. yöntem (WebAPK) kişisel kullanım için en iyisidir.
