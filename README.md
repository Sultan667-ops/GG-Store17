# GG Sport17 – Web Katalog

Web toko statis (HTML + CSS + JS biasa, tanpa install apa-apa). Pembeli lihat produk, masukin ke keranjang, lalu pesanan dikirim ke WhatsApp toko.

## Buka web
Klik dua kali `index.html`, atau upload seluruh folder ini ke hosting statis (GitHub Pages, Netlify, Vercel).

## Struktur
| File | Isi |
|---|---|
| `products.js` | **Data toko**: nomor WA, link Shopee, angka statistik, kategori, produk & harga. Cuma file ini yang perlu diedit sehari-hari. |
| `images/<slug>/01.jpg …` | Foto produk. `01.jpg` jadi foto sampul. |
| `index.html`, `style.css`, `app.js` | Tampilan & logika web. |

## Isi harga
Buka `products.js`, cari produknya, ganti `price: null` jadi angka tanpa titik:

```js
price: 42500, oldPrice: 64900,   // oldPrice = harga coret, isi null kalau nggak diskon
```

Selama `price` masih `null`, produk tampil "Tanya Harga" dan tombolnya ngarah ke WhatsApp.

## Tambah produk baru
1. Bikin folder `images/nama-produk/`, isi foto `01.jpg`, `02.jpg`, … (kotak/persegi, sekitar 1000×1000 px).
2. Di `products.js`, copy satu blok produk, lalu ganti `id` (angka unik), `slug` (= nama folder), `cat`, `photos` (jumlah foto), `name`, `desc`.

## Setelah update
Di `index.html`, naikkan angka `?v=` di link `style.css`, `products.js` dan `app.js` (misal `?v=4` → `?v=5`). Dengan begitu browser pengunjung langsung ambil versi baru, nggak pakai salinan lama.

## Link promosi per channel
Pakai link yang beda di tiap tempat promosi. Kalau pembeli chat lewat web, di akhir pesan WA bakal muncul `(via tiktok)` dan sejenisnya, jadi lu tahu channel mana yang paling menghasilkan.

| Dipasang di | Link |
|---|---|
| Bio TikTok | `https://ggsport17.netlify.app/?src=tiktok` |
| Bio Instagram | `https://ggsport17.netlify.app/?src=instagram` |
| Grup Facebook | `https://ggsport17.netlify.app/?src=fbgrup` |
| FB Marketplace | `https://ggsport17.netlify.app/?src=marketplace` |
| Status / broadcast WA | `https://ggsport17.netlify.app/?src=wa` |
| QR di kartu / stiker | `https://ggsport17.netlify.app/?src=qr` |

Nama setelah `src=` bebas, misalnya `?src=klubfutsal-bekasi`.

## Biar muncul di Google
1. Buka https://search.google.com/search-console, pilih **URL prefix**, isi `https://ggsport17.netlify.app/`.
2. Pilih verifikasi **HTML tag**, copy tag `<meta name="google-site-verification" ...>`, kirim ke Claude (atau tempel sendiri di `<head>` `index.html`), lalu push.
3. Setelah terverifikasi, menu **Sitemaps** → isi `sitemap.xml`.

## Link produk
Tiap produk punya link sendiri buat di-share, contoh: `https://ggsport17.netlify.app/#p/kinematic-solid`.

## Hosting
Web tayang di **https://ggsport17.netlify.app/** (Netlify, otomatis update tiap push ke `main`).
Alamat lama `sultan667-ops.github.io/GG-Store17/` otomatis dialihkan ke alamat Netlify.
