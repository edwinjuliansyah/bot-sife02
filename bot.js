const { Client, LocalAuth } = require('whatsapp-web.js'); // Mengimpor fitur Client dan LocalAuth dari library whatsapp-web.js untuk membuat bot
const qrcode = require('qrcode-terminal'); // Mengimpor library qrcode-terminal untuk menampilkan QR code di layar terminal CMD/VSCode
const ExcelJS = require('exceljs'); // Mengimpor library exceljs untuk membaca dan mengelola data dari file Excel

const client = new Client({ // Membuat instance atau objek bot baru dengan nama 'client'
    authStrategy: new LocalAuth() // Menggunakan LocalAuth agar bot menyimpan riwayat login (tidak perlu scan QR ulang setiap kali bot dimatikan)
}); // Menutup pengaturan konfigurasi untuk client bot

client.on('qr', (qr) => { // Menjalankan fungsi ini jika bot meminta scan QR code (saat login pertama kali)
    qrcode.generate(qr, { small: true }); // Menampilkan QR code ke layar terminal dengan ukuran kecil agar mudah di-scan oleh HP
}); // Menutup blok fungsi kemunculan QR code

client.on('ready', () => { // Menjalankan fungsi ini ketika bot sudah berhasil login dan siap menerima/mengirim pesan
    console.log('Hore! Bot WhatsApp sudah siap dan berjalan!'); // Menampilkan teks di terminal untuk memberitahu Anda bahwa bot sudah aktif
}); // Menutup blok fungsi kesiapan bot

client.on('message', async (msg) => { // Menjalankan fungsi ini secara asinkron setiap kali ada pesan baru yang masuk ke nomor bot
    const pesan = msg.body; // Mengambil isi teks pesan yang dikirimkan oleh pengguna, lalu menyimpannya di variabel 'pesan'
    
    if (pesan.startsWith('#')) { // Mengecek kondisi apakah teks pesan tersebut diawali dengan simbol '#' (prefix)
        const keywordDicari = pesan.toLowerCase(); // Mengubah semua huruf di pesan menjadi huruf kecil (case-insensitive) agar #Tugas dan #tugas dianggap sama
        
        const workbook = new ExcelJS.Workbook(); // Membuat objek 'Buku Kerja' (workbook) Excel baru di memori untuk persiapan membaca file
        
        try { // Memulai blok 'try' untuk mencoba menjalankan kode yang berpotensi memunculkan error (misal file Excel hilang)
            await workbook.xlsx.readFile('data_bot.xlsx'); // Membaca file Excel bernama 'data_bot.xlsx' yang ada di folder yang sama
            const worksheet = workbook.getWorksheet(1); // Mengambil lembar kerja (Sheet) urutan pertama dari file Excel tersebut
            
            let balasan = ''; // Menyiapkan variabel kosong bernama 'balasan' untuk menampung teks yang akan dikirim kembali
            let ditemukan = false; // Menyiapkan variabel penanda 'ditemukan' dengan status awal salah (false)
            
            worksheet.eachRow((row, rowNumber) => { // Melakukan perulangan otomatis untuk mengecek baris demi baris di dalam file Excel
                if (rowNumber > 1) { // Mengabaikan baris ke-1 karena baris ke-1 adalah judul kolom (Keyword, Pesan), kita mulai dari baris 2
                    const keywordExcel = row.getCell(1).value; // Mengambil nilai dari kotak/sel di kolom ke-1 (kolom Keyword) pada baris saat ini
                    const isiPesanExcel = row.getCell(2).value; // Mengambil nilai dari kotak/sel di kolom ke-2 (kolom Pesan) pada baris saat ini
                    
                    if (keywordExcel && keywordExcel.toString().toLowerCase() === keywordDicari) { // Mengecek apakah keyword di Excel ada isinya DAN sama persis dengan yang diketik user
                        balasan = isiPesanExcel.toString(); // Jika cocok, ubah isi pesan di Excel menjadi teks biasa dan masukkan ke variabel 'balasan'
                        ditemukan = true; // Mengubah status penanda 'ditemukan' menjadi benar (true) karena datanya ada
                    } // Menutup blok pengecekan kesamaan keyword
                } // Menutup blok pengabaian baris pertama
            }); // Menutup blok perulangan baris Excel
            
            if (ditemukan) { // Mengecek kondisi apakah data berhasil ditemukan (bernilai true)
                msg.reply(balasan); // Mengirimkan pesan balasan ke pengguna WhatsApp sesuai dengan isi dari file Excel
            } else { // Kondisi alternatif jika data tidak ditemukan (bernilai false)
                msg.reply('Maaf, informasi untuk keyword tersebut belum tersedia di database.'); // Membalas pesan bahwa keyword tidak dikenali
            } // Menutup blok if-else pengiriman balasan
            
        } catch (error) { // Blok untuk menangkap error jika proses pembacaan file di blok 'try' tadi gagal
            console.error('Waduh, ada error saat membaca Excel:', error); // Menampilkan detail pesan error di terminal Anda agar bisa diperbaiki
            msg.reply('Mohon maaf, sistem sedang mengalami gangguan saat membaca database.'); // Mengirim pesan minta maaf ke pengguna agar mereka tahu bot sedang error
        } // Menutup blok penangkapan error (catch)
    } // Menutup blok pengecekan prefix tanda pagar '#'
}); // Menutup blok fungsi penerimaan pesan

client.initialize(); // Perintah terakhir yang sangat penting untuk menyalakan dan memulai seluruh proses bot WhatsApp di atas
