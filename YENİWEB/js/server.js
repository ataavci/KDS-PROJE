var express = require("express");
var app = express();
var path = require("path");
const mysql = require('mysql');
const bodyParser = require('body-parser'); 
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join("C:/Users/brt-b/Desktop/YENİWEB")));
app.use(express.static('public'));
app.use(express.json());


// MySQL bağlantı bilgilerini tanımlayın
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    database: 'proje_6'
});

// MySQL bağlantısını başlatın
db.connect((err) => {
    if (err) {
        console.error('MySQL bağlantı hatası: ' + err.stack);
        return;
    }
    console.log('MySQL bağlandı, bağlantı ID: ' + db.threadId);

    // MySQL bağlantısı başarılı olduğunda Express sunucusunu başlatın
    app.listen(port, function () {
        console.log("Sunucu localhost:" + port + " adresinde çalışıyor...");
    });
});
//-----------------------------------------------------------------------------------------------

app.get('/veriler', (req, res) => {
    const query = 'SELECT gunluk_ciro_.tarih,gunluk_ciro_.2020 FROM gunluk_ciro_; '; 
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const dataPoints = results.map(row => ({ label: row.tarih, y: row['2020'] }));
        res.json(dataPoints);
    });
});

app.use(bodyParser.json());
app.post('/veri-girisi', (req, res) => {
    const { tarih, veri2023 } = req.body;
    const query = 'UPDATE gunluk_ciro_ SET gunluk_ciro_.2023 = ? WHERE gunluk_ciro_.tarih = ?';

    db.query(query, [tarih, 2023], (err, result) => {
        if (err) {
            console.error('Veri girişi hatası: ' + err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json({ message: 'Veri başarıyla eklendi.' });
    });
});

app.post('/getYearlyAverage', (req, res) => {
    const { year } = req.body;
  
    try {
      const sqlQuery = `
        SET lc_time_names = 'tr_TR';
  
        SELECT 
          YEAR(tarih) AS yil,
          MONTHNAME(tarih) AS ay,
          ROUND(AVG(paket_ciro + restoran_ciro), 2) AS ortalama_ciro
        FROM 
          gunluk_ciro
        WHERE 
          YEAR(tarih) = ?
        GROUP BY 
          yil, MONTH(tarih)
        ORDER BY 
          yil, MONTH(tarih);
      `;
  
      db.query(sqlQuery, [year], (err, results) => {
        if (err) {
          console.error('Sorgu çalıştırılırken hata oluştu: ' + err.stack);
          return res.status(500).json({ error: 'Sorgu çalıştırılırken hata oluştu' });
        }
  
        console.log('Sorgu başarıyla çalıştırıldı, sonuçlar: ', results);
        res.json(results);
      });
    } catch (error) {
      console.error('İstek işlenirken bir hata oluştu:', error);
      res.status(500).json({ error: 'İstek işlenirken bir hata oluştu' });
    }
  });
  


  const tableName = 'deneme';
  // Veri eklemek için POST endpoint'i
  app.post('/veri-ekle', (req, res) => {
    const { tarih, ciro } = req.body;
    const veri = { tarih, ciro };
    const query = "INSERT INTO `deneme` (`tarih`, `ciro`) VALUES (?, ?)";

    try {
        db.query(query, [tarih, ciro], (err, results) => {
            if (err) {
                console.error(err); // Hata konsola yazdırılıyor
                return res.status(500).json({ message: 'Veri eklenemedi' });
            }
            return res.status(200).json({ message: 'Veri başarıyla eklendi' });
        });
    } catch (error) {
        console.error(error); // Olası hata konsola yazdırılıyor
        return res.status(500).json({ message: 'Veri eklenemedi' });
    }
});


// Veri eklemek için POST endpoint'i
app.post('/veri-ekle_1', (req, res) => {
  const { tarih, fiş } = req.body;
  const veri = { tarih, fiş };
  const query = "INSERT INTO `deneme_1` (`tarih`, `fiş`) VALUES (?, ?)";

  try {
      db.query(query, [tarih, fiş], (err, results) => {
          if (err) {
              console.error(err); // Hata konsola yazdırılıyor
              return res.status(500).json({ message: 'Veri eklenemedi' });
          }
          return res.status(200).json({ message: 'Veri başarıyla eklendi' });
      });
  } catch (error) {
      console.error(error); // Olası hata konsola yazdırılıyor
      return res.status(500).json({ message: 'Veri eklenemedi' });
  }
});


app.get('/ciro', (req, res) => {
    const tarih1 = req.query.tarih1; // İstenen tarih aralığı parametreleri
    const tarih2 = req.query.tarih2;
  
    const query = `SELECT SUM(gunluk_ciro.paket_ciro + gunluk_ciro.restoran_ciro) as toplam_ciro
                   FROM gunluk_ciro
                   WHERE gunluk_ciro.tarih BETWEEN ? AND ?`;
  
    // Veritabanı sorgusunu çalıştırma
    db.query(query, [tarih1, tarih2], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Veritabanı hatası: ' + error.message });
        throw error;
      }
  
      res.json({ toplam_ciro: results[0].toplam_ciro });
    });
  });


  app.get('/fis', (req, res) => {
    const tarih1 = req.query.tarih1; // İstenen tarih aralığı parametreleri
    const tarih2 = req.query.tarih2;
  
    const query = `SELECT SUM(gunluk_fis.fis_paket+gunluk_fis.fis_restoran) 
                   FROM gunluk_fis 
                   WHERE gunluk_fis.tarih BETWEEN ? AND ?`;
  
    // Veritabanı sorgusunu çalıştırma
    db.query(query, [tarih1, tarih2], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Veritabanı hatası: ' + error.message });
        throw error;
      }
  
      res.json({ toplam_fis: results[0].toplam_fis });
    });
  });

app.get('/iki-tarih-ciro', (req, res) => {
  const tarih1 = req.query.tarih1; // İstenen tarih aralığı parametreleri
  const tarih2 = req.query.tarih2;

  const query = `SELECT gunluk_ciro.paket_ciro as paket, gunluk_ciro.restoran_ciro as restoran, gunluk_ciro.tarih
                 FROM gunluk_ciro
                 WHERE gunluk_ciro.tarih BETWEEN ? AND ?`;

  // Veritabanı sorgusunu çalıştırma
  db.query(query, [tarih1, tarih2], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Veritabanı hatası: ' + error.message });
      throw error;
    }

    res.json(results); // Sorgu sonuçlarını JSON olarak döndürme
  });
});





  app.get('/gunluk-fis', (req, res) => {
    const startDate = req.query.startDate; // İstekten tarihleri al
    const endDate = req.query.endDate;
  
    const sql = 'SELECT SUM(fis_paket + fis_restoran) AS total FROM gunluk_fis WHERE tarih BETWEEN ? AND ?';
  
    // Veritabanı sorgusunu çalıştır
    db.query(sql, [startDate, endDate], (err, result) => {
      if (err) {
        throw err;
      }
      res.json({ total: result[0].total });
    });
  });
  

  app.post('/veri_ekle_3', (req, res) => {
    const { tarih, restoran_id, restoran_ciro, paket_ciro } = req.body;
    
    // Tüm gerekli alanların dolu olup olmadığını kontrol et
    if (!tarih || !restoran_id || !restoran_ciro || !paket_ciro) {
      return res.status(400).send('Tüm alanları doldurun.');
    }
  
    // INSERT INTO sorgusunu oluştur
    const sql = "INSERT INTO `gunluk_ciro` (`tarih`, `restoran_id`, `restoran_ciro`, `paket_ciro`) VALUES (`?`, `?`, `?`, `?`)";
    const values = [tarih, restoran_id, restoran_ciro, paket_ciro];
  
    // Veritabanına ekleme işlemini gerçekleştir
    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send('Veri başarıyla eklendi.');
    });
  });



  




