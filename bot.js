const { Client, LocalAuth } = require('whatsapp-web.js'); // Mengimpor fitur Client dan LocalAuth dari library whatsapp-web.js untuk membuat bot
const qrcode = require('qrcode-terminal'); // Mengimpor library qrcode-terminal untuk menampilkan QR code di layar terminal CMD/VSCode
const { GoogleSpreadsheet } = require('google-spreadsheet'); // Menggunakan alat pembaca Google Sheets
const { JWT } = require('google-auth-library'); // Menggunakan alat pembuat "Kunci Izin" Google

// --- KONFIGURASI GOOGLE SHEETS ---
const SPREADSHEET_ID = 'MASUKKAN_ID_GOOGLE_SHEET_KAMU_DISINI';
const creds = require('./credentials.json'); 

const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'], 
});
const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

// --- INISIALISASI BOT WA ---
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
        
        try { // Memulai blok 'try' untuk mencoba menjalankan kode yang berpotensi memunculkan error (misal file Excel hilang)
            await doc.loadInfo(); // Mendownload informasi terbaru dari Google Sheets
            const sheet = doc.sheetsByIndex[0]; // Ambil sheet pertama
            const rows = await sheet.getRows(); // Ambil seluruh baris data dari atas ke bawah

            
            let balasan = ''; // Menyiapkan variabel kosong bernama 'balasan' untuk menampung teks yang akan dikirim kembali
            let ditemukan = false; // Menyiapkan variabel penanda 'ditemukan' dengan status awal salah (false)
            
            for (const row of rows) {
                const keywordDiSheet = row.get('keyword'); // Ambil nilai di kolom yang judulnya "keyword" dan pastikan berada di baris 1
                const jawabanDiSheet = row.get('pesan');   // Ambil nilai di kolom yang judulnya "pesan" dan pastikan berada di baris 1

                if (keywordDiSheet && keywordDiSheet.toString().toLowerCase() === keywordDicari) { // Mengecek apakah keyword di sheet tidak kosong dan cocok dengan keyword yang dicari (case-insensitive)
                    balasan = jawabanDiSheet.toString(); // Jika cocok, simpan jawaban dari kolom "pesan" ke variabel 'balasan' untuk nanti dikirim ke pengguna
                    ditemukan = true; // Set status 'ditemukan' menjadi benar (true) karena data sudah ditemukan di sheet
                    break; /// Berhenti mencari karena sudah ketemu
                }
            }

            if (ditemukan) { // Mengecek kondisi apakah data berhasil ditemukan (bernilai true)
                msg.reply(balasan); // Mengirimkan pesan balasan ke pengguna WhatsApp sesuai dengan isi dari file gogle sheet yang sudah ditemukan
                console.log(`✅ Sukses membalas: ${keywordDicari}`); // Menampilkan log sukses di terminal untuk memantau aktivitas bot
            } else { // Kondisi alternatif jika data tidak ditemukan (bernilai false)
                msg.reply('Maaf, informasi untuk keyword tersebut belum tersedia di database.'); // Membalas pesan bahwa keyword tidak dikenali
            } // Menutup blok if-else pengiriman balasan
            
        } catch (error) { // Blok untuk menangkap error jika proses pembacaan file di blok 'try' tadi gagal
            console.error('Waduh, ada error saat membaca Google Sheets:', error); // Menampilkan detail pesan error di terminal Anda agar bisa diperbaiki
            msg.reply('Mohon maaf, sistem sedang mengalami gangguan saat membaca database.'); // Mengirim pesan minta maaf ke pengguna agar mereka tahu bot sedang error
        } // Menutup blok penangkapan error (catch)
    } // Menutup blok pengecekan prefix tanda pagar '#'
}); // Menutup blok fungsi penerimaan pesan

client.initialize(); // Perintah terakhir yang sangat penting untuk menyalakan dan memulai seluruh proses bot WhatsApp di atas
