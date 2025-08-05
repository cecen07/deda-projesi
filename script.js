document.addEventListener('DOMContentLoaded', function() {

    const kriterler = [
        { kategori_id: 1, kategori_adi: "ARAÇLAR / TEKNOLOJİ", maddeler: [ { metin: "Dijital araç kullanılmış mı? (Örn: Canva, Mentimeter, Wordwall, Padlet)" }, { metin: "Araç öğrenci etkileşimini artırıyor mu? (Etkileşimli içerik, anket, canlı yorum vb.)" }, { metin: "Araç branşa ve etkinlik hedefine uygun mu? (Branşın doğasına uygun seçilmiş mi?)" }, { metin: "Araç, uygun kategori içinde mi seçilmiş? (Örn: Değerlendirme, sunum, içerik üretimi)" }, { metin: "Kullanılacak donanım açıkça belirtilmiş mi? (Tablet, Akıllı tahta, Kamera vb.)" }, { metin: "Etkinlik kapsamında öğrenciye dijital araçla üretim yaptırılıyor mu? (Örn: Afiş, video, sunum)" }, { metin: "Araç öğrenmeyi somut olarak destekliyor mu? (Simülasyon, uygulama, deneyimleme)" }, { metin: "Teknoloji, etkinlik amacına uygun ve işlevsel mi? (Gereksiz kullanımdan kaçınılmış mı?)" }, { metin: "Araç yenilikçi sınıf bileşenlerine uygun biçimde kullanılmış mı? (Dijital pano, akıllı masa, VR, 3B yazıcı vb.)" } ] },
        { kategori_id: 2, kategori_adi: "ÖĞRENME ETKİNLİĞİ", maddeler: [ { metin: "Yönerge açık ve anlaşılır mı?" }, { metin: "Yönerge öğrenci etkileşimini teşvik ediyor mu? (Soru, keşif, yönlendirme içeriyor mu?)" }, { metin: "İçerikler telif haklarına uygun mu? (Kaynak belirtilmiş mi?)" }, { metin: "Etkinlik süresi belirli mi? (Zaman planlaması net mi?)" }, { metin: "Kullanılan araç için süre planlaması gerçekçi mi? (İçeriğin yoğunluğuna göre yeterli süre tanınmış mı?)" }, { metin: "Etkinlik yenilikçi sınıf tasarımına uygun mu? (Aktif öğrenme, öğrenci merkezli, yaratıcı üretim destekli)" } ] },
        { kategori_id: 3, kategori_adi: "BAĞLANTILAR / İÇERİKLER", maddeler: [ { metin: "Bağlantılar doğru yazılmış mı ve çalışıyor mu? (Linkler aktif ve doğru biçimde mi girilmiş?)" } ] }
    ];

    const toplamMaddeSayisi = kriterler.reduce((toplam, kategori) => toplam + kategori.maddeler.length, 0);

    // HTML elementlerine referanslar
    const formAlani = document.getElementById('degerlendirme-formu');
    const genelToplamPuanAlani = document.getElementById('genel-toplam-puan');
    const kaydetBtn = document.getElementById('kaydet-btn');
    const sonucMesajiAlani = document.getElementById('sonuc-mesaji');
    const ogretmenAdiInput = document.getElementById('ogretmen-adi');
    const bransInput = document.getElementById('brans');
    const etkinlikNoInput = document.getElementById('etkinlik-no');
    const kayitTablosuGovdesi = document.getElementById('kayit-tablosu-govdesi');

    // Kriterleri ve ara toplam alanlarını oluşturan fonksiyon
    function renderForm() {
        formAlani.innerHTML = '';
        kriterler.forEach(kategori => {
            let kategoriHtml = `
                <div class="kategori" id="kategori-${kategori.kategori_id}">
                    <div class="kategori-baslik">
                        <span>${kategori.kategori_adi}</span>
                        <span id="puan-${kategori.kategori_id}">0 / ${kategori.maddeler.length}</span>
                    </div>
            `;
            kategori.maddeler.forEach(madde => {
                kategoriHtml += `
                    <label class="kriter">
                        <input type="checkbox" class="kriter-check" data-kategori-id="${kategori.kategori_id}">
                        <span>${madde.metin}</span>
                    </label>
                `;
            });
            kategoriHtml += '</div>';
            formAlani.innerHTML += kategoriHtml;
        });
        genelToplamPuanAlani.textContent = `0 / ${toplamMaddeSayisi}`;
    }
    
    // Puanları anlık hesaplayan fonksiyon
    function hesaplaVeGuncelle() {
        let genelToplam = 0;
        kriterler.forEach(kategori => {
            const kategoriElementi = document.getElementById(`kategori-${kategori.kategori_id}`);
            const seciliKutular = kategoriElementi.querySelectorAll('.kriter-check:checked');
            const araPuan = seciliKutular.length;
            genelToplam += araPuan;
            document.getElementById(`puan-${kategori.kategori_id}`).textContent = `${araPuan} / ${kategori.maddeler.length}`;
        });
        genelToplamPuanAlani.textContent = `${genelToplam} / ${toplamMaddeSayisi}`;
    }

    // Değerlendirmeyi kaydetme, tabloyu güncelleme ve formu sıfırlama
    function kaydetVeSifirla() {
        // 1. Gerekli alanların dolu olup olmadığını kontrol et
        if (!ogretmenAdiInput.value || !bransInput.value) {
            alert('Lütfen "Hazırlayan Öğretmen Adı" ve "Branş" alanlarını doldurunuz.');
            return;
        }

        // 2. Mevcut puanları al
        const puanlar = {};
        let genelToplamPuan = 0;
        kriterler.forEach(kategori => {
            const puanMetni = document.getElementById(`puan-${kategori.kategori_id}`).textContent;
            const puan = parseInt(puanMetni.split(' ')[0]);
            puanlar[kategori.kategori_id] = puan;
            genelToplamPuan += puan;
        });

        // 3. Yeni kayıt objesini oluştur
        const yeniKayit = {
            id: Date.now(), // Benzersiz ID
            ogretmenAdi: ogretmenAdiInput.value,
            brans: bransInput.value,
            etkinlikNo: etkinlikNoInput.value || '-', // Boşsa - koy
            puanlar: puanlar,
            genelToplam: genelToplamPuan
        };

        // 4. localStorage'dan eski kayıtları al ve yenisini ekle
        let kayitlar = JSON.parse(localStorage.getItem('dedaKayitlari')) || [];
        kayitlar.push(yeniKayit);
        localStorage.setItem('dedaKayitlari', JSON.stringify(kayitlar));

        // 5. Tabloyu ve formu güncelle/sıfırla
        renderKayitTablosu();
        formuSifirla();
    }
    
    // Kayıt tablosunu ekrana basan fonksiyon
    function renderKayitTablosu() {
        kayitTablosuGovdesi.innerHTML = '';
        const kayitlar = JSON.parse(localStorage.getItem('dedaKayitlari')) || [];
        kayitlar.forEach(kayit => {
            const satir = `
                <tr>
                    <td>${kayit.ogretmenAdi}</td>
                    <td>${kayit.brans}</td>
                    <td>${kayit.etkinlikNo}</td>
                    <td>${kayit.puanlar[1]} / 9</td>
                    <td>${kayit.puanlar[2]} / 6</td>
                    <td>${kayit.puanlar[3]} / 1</td>
                    <td><strong>${kayit.genelToplam} / 16</strong></td>
                </tr>
            `;
            kayitTablosuGovdesi.innerHTML += satir;
        });
    }

    // Formu temizleyen fonksiyon
    function formuSifirla() {
        ogretmenAdiInput.value = '';
        bransInput.value = '';
        etkinlikNoInput.value = '';
        document.querySelectorAll('.kriter-check').forEach(check => check.checked = false);
        sonucMesajiAlani.classList.add('hidden');
        hesaplaVeGuncelle(); // Puan göstergelerini sıfırla
    }

    // Olay dinleyicileri
    formAlani.addEventListener('change', hesaplaVeGuncelle);
    kaydetBtn.addEventListener('click', kaydetVeSifirla);

    // Sayfa ilk yüklendiğinde formu ve tabloyu hazırla
    renderForm();
    renderKayitTablosu();
});
