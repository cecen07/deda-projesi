document.addEventListener('DOMContentLoaded', function() {

    // Veri Yapısı: Kriterleri JSON formatında tanımlıyoruz.
    const kriterler = [
        {
            kategori_id: 1,
            kategori_adi: "ARAÇLAR / TEKNOLOJİ",
            maddeler: [
                { id: "1.1", metin: "Dijital bir araç kullanılmış mı? (örnek: Canva, Mentimeter, Padlet)" },
                { id: "1.2", metin: "Araç öğrenci etkileşimini artırıcı özellik sunuyor mu? (örn. canlı anket, yorum)" },
                { id: "1.3", metin: "Araç, öğretmenin branşı ve etkinliğin hedefleriyle uyumlu mu?" },
                { id: "1.4", metin: "Araç, ait olduğu kategoriye (içerik üretme, ölçme vb.) uygun seçilmiş mi?" },
                { id: "1.5", metin: "Kullanılacak donanım (tablet, akıllı tahta vs.) açıkça belirtilmiş mi?" },
                { id: "1.6", metin: "Araç mevcut okul altyapısı ile uyumlu çalışır mı?" },
                { id: "1.7", metin: "MEB sistemleriyle veya yerel altyapıyla uyumlu araç mı? (örnek: MEB-KİT)" },
                { id: "1.8", metin: "Araç, öğrenme sürecine katkı sağlıyor mu (içerik üretme, keşif, uygulama vs.)?" },
                { id: "1.9", metin: "Teknolojinin amacı net, anlamlı ve abartısız şekilde mi kullanılmış?" }
            ]
        },
        {
            kategori_id: 2,
            kategori_adi: "ÖĞRENME ETKİNLİĞİ",
            maddeler: [
                { id: "2.1", metin: "Etkinlik yönergesi açık, sade ve uygulanabilir mi?" },
                { id: "2.2", metin: "Yönerge, öğrencinin aracı keşfetmesini ve katılımını teşvik ediyor mu?" },
                { id: "2.3", metin: "Evrensel tasarım ilkelerine uygun mu? (erişilebilirlik, sade dil, anlaşılır yapı)" },
                { id: "2.4", metin: "Kullanılan içerikler (resim, video vs.) telif haklarına uygun mu?" },
                { id: "2.5", metin: "Etkinlik süresi belirli mi? (örnek: 20 dakika)" },
                { id: "2.6", metin: "Kullanılan araç için önerilen süre gerçekçi ve uygulanabilir mi?" }
            ]
        },
        {
            kategori_id: 3,
            kategori_adi: "BAĞLANTILAR",
            maddeler: [
                { id: "3.1", metin: "Tüm bağlantılar doğru yazılmış mı ve aktif mi çalışıyor?" }
            ]
        }
    ];

    const formAlani = document.getElementById('degerlendirme-formu');
    const araToplamlarAlani = document.getElementById('ara-toplamlar');
    const genelToplamPuanAlani = document.getElementById('genel-toplam-puan');
    const degerlendirBtn = document.getElementById('degerlendir-btn');
    const sonucMesajiAlani = document.getElementById('sonuc-mesaji');

    // Kriterleri ekrana dinamik olarak yerleştiren fonksiyon
    function renderKriterler() {
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

    // Puanları hesaplayan ve anlık güncelleyen fonksiyon
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

        genelToplamPuanAlani.textContent = `${genelToplam} / 16`;
    }

    // "Değerlendir" butonuna basıldığında sonucu gösteren fonksiyon
    function sonucuGoster() {
        const genelPuan = parseInt(genelToplamPuanAlani.textContent.split(' ')[0]);
        let mesaj = '';
        let renk = '';

        if (genelPuan <= 5) {
            mesaj = '<strong>Geliştirilmesi Gereken Bir Etkinlik:</strong> Etkinliğiniz temel düzeyde. Özellikle Araçlar/Teknoloji başlığındaki kriterleri gözden geçirerek dijital entegrasyonu güçlendirebilirsiniz.';
            renk = '#dc3545';
        } else if (genelPuan <= 10) {
            mesaj = '<strong>Potansiyel Taşıyan Etkinlik:</strong> İyi bir başlangıç! Öğrenme Etkinliği başlığındaki maddelere odaklanarak etkinliğinizi daha pedagojik ve erişilebilir hale getirebilirsiniz.';
            renk = '#ffc107';
        } else if (genelPuan <= 14) {
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

    // Başlangıç
    renderKriterler();

    // Olay Dinleyicileri
    formAlani.addEventListener('change', hesaplaVeGuncelle);
    degerlendirBtn.addEventListener('click', sonucuGoster);
});