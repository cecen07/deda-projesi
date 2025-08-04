document.addEventListener('DOMContentLoaded', function() {

    // GÜNCELLENMİŞ VERİ YAPISI
    const kriterler = [
        {
            kategori_id: 1,
            kategori_adi: "ARAÇLAR / TEKNOLOJİ",
            maddeler: [
                { id: "1.1", metin: "Dijital araç kullanılmış mı? (Örn: Canva, Mentimeter, Wordwall, Padlet)" },
                { id: "1.2", metin: "Araç öğrenci etkileşimini artırıyor mu? (Etkileşimli içerik, anket, canlı yorum vb.)" },
                { id: "1.3", metin: "Araç branşa ve etkinlik hedefine uygun mu? (Branşın doğasına uygun seçilmiş mi?)" },
                { id: "1.4", metin: "Araç, uygun kategori içinde mi seçilmiş? (Örn: Değerlendirme, sunum, içerik üretimi)" },
                { id: "1.5", metin: "Kullanılacak donanım açıkça belirtilmiş mi? (Tablet, Akıllı tahta, Kamera vb.)" },
                { id: "1.6", metin: "Etkinlik kapsamında öğrenciye dijital araçla üretim yaptırılıyor mu? (Örn: Afiş, video, sunum)" },
                { id: "1.7", metin: "Araç öğrenmeyi somut olarak destekliyor mu? (Simülasyon, uygulama, deneyimleme)" },
                { id: "1.8", metin: "Teknoloji, etkinlik amacına uygun ve işlevsel mi? (Gereksiz kullanımdan kaçınılmış mı?)" },
                { id: "1.9", metin: "Araç yenilikçi sınıf bileşenlerine uygun biçimde kullanılmış mı? (Dijital pano, akıllı masa, VR, 3B yazıcı vb.)" }
            ]
        },
        {
            kategori_id: 2,
            kategori_adi: "ÖĞRENME ETKİNLİĞİ",
            maddeler: [
                { id: "2.1", metin: "Yönerge açık ve anlaşılır mı?" },
                { id: "2.2", metin: "Yönerge öğrenci etkileşimini teşvik ediyor mu? (Soru, keşif, yönlendirme içeriyor mu?)" },
                { id: "2.3", metin: "İçerikler telif haklarına uygun mu? (Kaynak belirtilmiş mi?)" },
                { id: "2.4", metin: "Etkinlik süresi belirli mi? (Zaman planlaması net mi?)" },
                { id: "2.5", metin: "Kullanılan araç için süre planlaması gerçekçi mi? (İçeriğin yoğunluğuna göre yeterli süre tanınmış mı?)" },
                { id: "2.6", metin: "Etkinlik yenilikçi sınıf tasarımına uygun mu? (Aktif öğrenme, öğrenci merkezli, yaratıcı üretim destekli)" }
            ]
        },
        {
            kategori_id: 3,
            kategori_adi: "BAĞLANTILAR / İÇERİKLER",
            maddeler: [
                { id: "3.1", metin: "Bağlantılar doğru yazılmış mı ve çalışıyor mu? (Linkler aktif ve doğru biçimde mi girilmiş?)" },
                            ]
        }
    ];

    // TOPLAM PUANI DİNAMİK OLARAK HESAPLAMA
    const toplamMaddeSayisi = kriterler.reduce((toplam, kategori) => toplam + kategori.maddeler.length, 0);

    const formAlani = document.getElementById('degerlendirme-formu');
    const genelToplamPuanAlani = document.getElementById('genel-toplam-puan');
    const degerlendirBtn = document.getElementById('degerlendir-btn');
    const sonucMesajiAlani = document.getElementById('sonuc-mesaji');
    
    // Sayfa ilk yüklendiğinde toplam puanı doğru göster
    genelToplamPuanAlani.textContent = `0 / ${toplamMaddeSayisi}`;


    function renderKriterler() {
        formAlani.innerHTML = ''; // Formu temizle
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
                        <span>${madde.id} - ${madde.metin}</span>
                    </label>
                `;
            });
            kategoriHtml += '</div>';
            formAlani.innerHTML += kategoriHtml;
        });
    }

    function hesaplaVeGuncelle() {
        let genelToplam = 0;
        kriterler.forEach(kategori => {
            const kategoriElementi = document.getElementById(`kategori-${kategori.kategori_id}`);
            const seciliKutular = kategoriElementi.querySelectorAll('.kriter-check:checked');
            const araPuan = seciliKutular.length;
            genelToplam += araPuan;

            const kategoriPuanGostergesi = document.getElementById(`puan-${kategori.kategori_id}`);
            kategoriPuanGostergesi.textContent = `${araPuan} / ${kategori.maddeler.length}`;
        });

        genelToplamPuanAlani.textContent = `${genelToplam} / ${toplamMaddeSayisi}`;
    }

    // GÜNCELLENMİŞ PUAN ARALIKLARI
    function sonucuGoster() {
        const genelPuan = parseInt(genelToplamPuanAlani.textContent.split(' ')[0]);
        let mesaj = '';
        let renk = '';

        if (genelPuan <= 6) {
            mesaj = '<strong>Geliştirilmesi Gereken Bir Etkinlik:</strong> Etkinliğiniz temel düzeyde. Özellikle Araçlar/Teknoloji başlığındaki kriterleri gözden geçirerek dijital entegrasyonu güçlendirebilirsiniz.';
            renk = '#dc3545';
        } else if (genelPuan <= 12) {
            mesaj = '<strong>Potansiyel Taşıyan Etkinlik:</strong> İyi bir başlangıç! Öğrenme Etkinliği başlığındaki maddelere odaklanarak etkinliğinizi daha pedagojik ve erişilebilir hale getirebilirsiniz.';
            renk = '#ffc107';
        } else if (genelPuan <= 16) {
            mesaj = '<strong>Başarılı Bir Dijital Etkinlik:</strong> Tebrikler! Teknoloji kullanımı anlamlı ve öğrenme hedefleriyle uyumlu. Harika bir iş çıkarmışsınız.';
            renk = '#17a2b8';
        } else {
            mesaj = '<strong>Örnek Düzeyde, Kapsamlı Bir Etkinlik:</strong> Mükemmel! Bu etkinlik, teknoloji entegrasyonu, pedagojik yaklaşım ve erişilebilirlik açısından örnek teşkil etmektedir.';
            renk = '#28a745';
        }
        
        sonucMesajiAlani.innerHTML = mesaj;
        sonucMesajiAlani.style.backgroundColor = renk;
        sonucMesajiAlani.style.color = 'white';
        sonucMesajiAlani.classList.remove('hidden');
    }

    renderKriterler();

    formAlani.addEventListener('change', hesaplaVeGuncelle);
    degerlendirBtn.addEventListener('click', sonucuGoster);
});
