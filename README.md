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
Di `index.html`, naikkan angka `?v=` di link `style.css`, `products.js` dan `app.js` (misal `?v=2` → `?v=3`). Dengan begitu browser pengunjung langsung ambil versi baru, nggak pakai salinan lama.

## Link produk
Tiap produk punya link sendiri buat di-share, contoh: `index.html#p/kinematic-solid`.
