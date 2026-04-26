===WhatsApp Auto Reply Bot dengan Google Sheets===
Bot ini dirancang untuk menyelesaikan masalah dalam pertanyaan berulang di grup kelas sife02. 

Proyek ini dibuat dengan tujuan utama untuk:
1. Efisiensi Waktu: Mengurangi beban menjawab pertanyaan yang sama berulang kali (seperti jadwal, info tugas, atau kontak).
2. Kemudahan Kelola: Memungkinkan admin memperbarui jawaban hanya melalui Google Sheets (bahkan lewat HP) tanpa harus mengerti kodingan.
3. Automasi Sederhana: Memberikan layanan informasi 24/7 selama server/laptop aktif.

Jika kamu ingin menggunakan bot ini ada beberapa hal yang harus diperhatikan
1. Risiko Banned: WhatsApp dapat memblokir nomor Anda jika bot terdeteksi melakukan spam. Gunakan bot ini secara bijak (hanya untuk membalas pesan masuk, bukan broadcast massal).
2. Kerahasiaan Data: File credentials.json adalah kunci akses ke Google Drive Anda. JANGAN PERNAH mengunggah file ini ke GitHub atau membagikannya ke orang asing.
3. Sesi WhatsApp: Folder .wwebjs_auth berisi data login Anda. Perlakukan file ini seperti password Anda sendiri.

Ikuti langkah-langkah di bawah ini secara berurutan untuk menjalankan bot WhatsApp.

Tahap 1: Instalasi Node.js
1. Buka web https://nodejs.org/en/download download nodejs versi LTS.
2. Instal seperti biasa (klik Next sampai selesai).
3. Verifikasi: Buka CMD, ketik node -v. Jika muncul angka versi (misal: v20.x.x), berarti berhasil.

Tahap 2: Persiapan Folder & Library
1. Buat folder baru di laptop (misal: bot-wa).
2. Di dalam folder BotWhatsApp tadi, klik bagian alamat folder di bagian atas (address bar File Explorer), ketik cmd, lalu Enter. Ini akan membuka terminal langsung di lokasi folder tersebut.
3. Ketik perintah ini untuk menginstal semua library yang dibutuhkan:

	npm install whatsapp-web.js qrcode-terminal google-spreadsheet google-auth-library

	Fungsi Library:
	whatsapp-web.js: Mesin utama bot WhatsApp.
	qrcode-terminal: Menampilkan QR Code di CMD.
	google-spreadsheet: Alat untuk membaca/menulis ke Google Sheets.
	google-auth-library: Mengurus izin keamanan (login) ke Google.

Tahap 3: Konfigurasi Google Cloud (Kunci Akses)
1. Masuk ke web console.cloud.google.com
2. Buat Project Baru ada di kiri atas.
3. Cari dan klik "Enable" (Aktifkan) pada dua layanan ini:
	-di search bari ketik Google Sheets API -> Google Sheets API Read and write Google Sheets data (biasanya muncul paling atas) -> klik enable
	-di search bari ketik Google Drive API -> Google Drive API Create and manage resources in Google Drive (biasanya muncul paling atas) -> klik enable
4. Masuk ke menu APi & Services -> Credentials -> Create Credentials -> Service Account.
5. Isi nama (misal: bot-wa-service), lalu klik Create and Continue sampai selesai.
6. Klik pada email service account yang baru dibuat, masuk ke tab Keys > Add Key > Create New Key > pilih JSON.
7. Sebuah file .json akan terdownload. Ganti namanya menjadi credentials.json dan masukkan ke folder bot kamu.

Tahap 4: Menyiapkan Google Sheets (Database)
1. Masuk ke web https://docs.google.com/spreadsheets/ dan buat Google Sheet baru.
2. Pada baris 1, tulis:
	-Kolom A: keyword
	-Kolom B: pesan
3. Isi baris di bawahnya (Contoh: #intro | Halo saya blablabla) atau copy paste file data-bot-wa.xlxs di github ini untuk testing.
4. Penting: Klik tombol Share, lalu paste email Service Account (ada di file credentials.json) dan beri akses sebagai Viewer atau Editor.
5. Salin ID Spreadsheet dari URL (kode panjang antara /d/ dan /edit misal: https://docs.google.com/spreadsheets/d/KODE-ID-DISINI/edit).

Tahap 5: Konfigurasi Kode (bot.js)
1. Download file bot.js di gituhub ini dan masukkan ke dalam folder bot Anda.
2. Masukkan masuk ke file bot.js dan paste kode id yang sudah bahas sebelumnya.
	Pastikan bagian ini sudah diisi dengan benar:
	const SPREADSHEET_ID = 'PASTE_ID_DISINI';
	const creds = require('./credentials.json'); // Nama file harus sama persis

Tahap 6: Menjalankan Bot
1. Buka CMD di folder bot.
2. Ketik: node bot.js
3. Tunggu hingga QR Code muncul di CMD.
4. Buka WhatsApp di HP > Perangkat Tertaut > Tautkan Perangkat.
5. Scan QR Code tersebut.
6. Jika di CMD muncul tulisan "Bot WhatsApp sudah siap!", selamat! Bot Anda sudah aktif.

Note
1. Update Data: Anda cukup edit isi Google Sheets. Bot akan langsung tahu perubahannya saat ada pesan masuk dan tidak perlu mengubah kode dalam bot.js.
2. Matikan Bot: Tekan Ctrl + C di CMD.
3. Nyalakan Kembali: Ketik node bot.js. (Tidak perlu scan QR lagi selama folder .wwebjs_auth tidak dihapus). 
4. Batasan Kuota API Google: Google memberikan limit untuk API-nya (meskipun sangat besar, yaitu 300 request per menit).
5. Sewa VPS: jika tidak ingin laptop menyala 24/7 gunakan VPS.
6. Jangan menggunakan nomor utama untuk mencegah banned pada akun utama
