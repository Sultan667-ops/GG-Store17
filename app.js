/* GG Sport17 storefront. Data lives in products.js. */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const fmt = n => 'Rp' + n.toLocaleString('id-ID');
const hasPrice = p => typeof p.price === 'number' && p.price > 0;
const photo = (p, i = 1) => `images/${p.slug}/${String(i).padStart(2, '0')}.jpg`;
const catOf = id => CATEGORIES.find(c => c.id === id);
const byId = id => PRODUCTS.find(p => p.id === id);
const icon = (id, cls = '') => `<svg${cls ? ` class="${cls}"` : ''}><use href="#${id}"/></svg>`;

function waLink(msg) { return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(msg)}`; }
function openWA(msg) { window.open(waLink(msg), '_blank', 'noopener'); }

let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- Static sections ---------- */
function renderStatic() {
  $('#stats').innerHTML = STORE.stats.map(s => `<div><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`).join('');

  const hero = ['kinematic-solid', 'kaos-kaki', 'fingertape-camo'].map(s => PRODUCTS.find(p => p.slug === s)).filter(Boolean);
  $('#hero-visual').innerHTML = hero.map((p, i) => `<div class="hv hv-${i + 1}"><img src="${photo(p)}" alt="" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}></div>`).join('');

  $('#cat-grid').innerHTML = CATEGORIES.map(c => {
    const items = PRODUCTS.filter(p => p.cat === c.id);
    if (!items.length) return '';
    return `<button class="cat" data-cat="${c.id}">
      <div class="cat-img"><img src="${photo(items[0])}" alt="${esc(c.name)}" loading="lazy"></div>
      <div class="cat-b"><div><h3>${esc(c.name)}</h3><p>${items.length} produk · ${esc(c.blurb)}</p></div>${icon('i-chev')}</div>
    </button>`;
  }).join('') + `<button class="cat cat-all" data-cat="semua"><h3>Semua Produk</h3><p>${PRODUCTS.length} produk siap kirim</p><span>Lihat katalog ${icon('i-chev')}</span></button>`;

  $('#ftr-cats').innerHTML = CATEGORIES.map(c => `<li><a href="#produk" data-cat="${c.id}">${esc(c.name)}</a></li>`).join('');
  $('#ftr-wa').textContent = 'WhatsApp: ' + STORE.whatsappLabel;
  $('#ftr-shopee').href = STORE.shopeeUrl;
  $('#year').textContent = new Date().getFullYear();
}

/* ---------- Catalog ---------- */
let activeCat = 'semua', query = '';

function renderCatalog() {
  const pills = [{ id: 'semua', name: 'Semua' }, ...CATEGORIES];
  $('#pills').innerHTML = pills.map(c => {
    const n = c.id === 'semua' ? PRODUCTS.length : PRODUCTS.filter(p => p.cat === c.id).length;
    return n ? `<button class="pill${activeCat === c.id ? ' on' : ''}" role="tab" aria-selected="${activeCat === c.id}" data-cat="${c.id}">${esc(c.name)}<small>${n}</small></button>` : '';
  }).join('');

  const q = query.trim().toLowerCase();
  const list = PRODUCTS.filter(p =>
    (activeCat === 'semua' || p.cat === activeCat) &&
    (!q || [p.name, catOf(p.cat)?.name, ...p.desc].join(' ').toLowerCase().includes(q))
  );

  $('#grid').innerHTML = list.map(card).join('');
  $('#empty').hidden = list.length > 0;
  const where = activeCat === 'semua' ? '' : ` di ${catOf(activeCat).name}`;
  $('#prod-count').textContent = q
    ? `${list.length} hasil untuk “${query.trim()}”${where}`
    : `${list.length} produk${where}`;
}

function badgeHTML(b) {
  return b ? `<span class="badge b-${b.toLowerCase().replace(/\s+/g, '-')}">${esc(b)}</span>` : '';
}

function priceHTML(p) {
  if (!hasPrice(p)) return `<span class="ask">${icon('i-wa')}Tanya Harga</span>`;
  return `<span class="price">${p.oldPrice ? `<s>${fmt(p.oldPrice)}</s>` : ''}${fmt(p.price)}</span>`;
}

function card(p) {
  return `<article class="card" tabindex="0" role="button" data-open="${p.id}" aria-label="${esc(p.name)}">
    <div class="card-img"><img src="${photo(p)}" alt="${esc(p.name)}" loading="lazy">${badgeHTML(p.badge)}${p.photos > 1 ? `<span class="photo-n">${p.photos} foto</span>` : ''}</div>
    <div class="card-b">
      <span class="card-cat">${esc(catOf(p.cat).name)}</span>
      <h3 class="card-name">${esc(p.name)}</h3>
      <div class="card-ft">${priceHTML(p)}<span class="card-go">${icon('i-chev')}</span></div>
    </div>
  </article>`;
}

function setCat(id, scroll = true) {
  activeCat = id;
  renderCatalog();
  if (scroll) $('#produk').scrollIntoView({ behavior: 'smooth' });
}

/* ---------- Product detail ---------- */
let current = null, qty = 1;

function openProduct(id, push = true) {
  const p = byId(id);
  if (!p) return;
  current = p; qty = 1;
  const imgs = Array.from({ length: p.photos }, (_, i) => photo(p, i + 1));
  const priced = hasPrice(p);

  $('#pd').innerHTML = `
    <div class="gal">
      <div class="gal-main">
        <div class="gal-track" id="gal-track">${imgs.map((src, i) => `<img src="${src}" alt="${esc(p.name)} foto ${i + 1}" ${i ? 'loading="lazy"' : ''}>`).join('')}</div>
        ${imgs.length > 1 ? `<button class="gal-nav prev" data-gal="-1" aria-label="Foto sebelumnya">${icon('i-chev')}</button><button class="gal-nav next" data-gal="1" aria-label="Foto berikutnya">${icon('i-chev')}</button><span class="gal-idx" id="gal-idx">1 / ${imgs.length}</span>` : ''}
      </div>
      ${imgs.length > 1 ? `<div class="thumbs" id="thumbs">${imgs.map((src, i) => `<button class="${i ? '' : 'on'}" data-thumb="${i}" aria-label="Foto ${i + 1}"><img src="${src}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
    </div>
    <div class="pd-info">
      <span class="card-cat">${esc(catOf(p.cat).name)}</span>
      <h2 id="pd-name">${esc(p.name)}</h2>
      ${priced
        ? `<div class="pd-price">${fmt(p.price)}${p.oldPrice ? `<s>${fmt(p.oldPrice)}</s>` : ''}</div>`
        : `<div class="pd-ask"><b>Harga via WhatsApp.</b> Tanyakan harga terbaru, stok & pilihan warna ke admin kami.</div>`}
      <ul class="pd-desc">${p.desc.map(d => `<li>${icon('i-check')}<span>${esc(d)}</span></li>`).join('')}</ul>
      <div class="qty-row">Jumlah
        <div class="qty"><button data-qty="-1" aria-label="Kurangi">−</button><span id="pd-qty">1</span><button data-qty="1" aria-label="Tambah">+</button></div>
      </div>
      <div class="pd-act">
        <button class="btn btn-primary btn-block" id="pd-add">${icon('i-cart')}Tambah ke Keranjang</button>
        <button class="btn btn-wa btn-block" id="pd-wa">${icon('i-wa')}${priced ? 'Pesan via WhatsApp' : 'Tanya Harga via WhatsApp'}</button>
      </div>
      <p class="pd-shopee">Lebih suka checkout di marketplace? <a href="${esc(STORE.shopeeUrl)}" target="_blank" rel="noopener">Cari di Shopee</a></p>
    </div>`;

  const track = $('#gal-track');
  track.addEventListener('scroll', () => {
    const i = Math.round(track.scrollLeft / track.clientWidth);
    const idx = $('#gal-idx');
    if (idx) idx.textContent = `${i + 1} / ${imgs.length}`;
    $$('#thumbs button').forEach((b, j) => b.classList.toggle('on', i === j));
  }, { passive: true });

  $('#modal').hidden = false;
  document.body.classList.add('lock');
  $('.modal-x').focus({ preventScroll: true });
  if (push && location.hash !== '#p/' + p.slug) { history.pushState({ p: p.id }, '', '#p/' + p.slug); pushed = true; }
}

// pushed: we added the #p/ entry ourselves, so Back returns to the page.
// Otherwise the visitor arrived via a shared product link; just drop the hash.
let pushed = false;
function closeProduct(fromHistory = false) {
  if ($('#modal').hidden) return;
  $('#modal').hidden = true;
  document.body.classList.remove('lock');
  current = null;
  const wasPushed = pushed;
  pushed = false;
  if (fromHistory || !location.hash.startsWith('#p/')) return;
  if (wasPushed) history.back();
  else history.replaceState(null, '', location.pathname + location.search);
}

function goPhoto(i) {
  const track = $('#gal-track');
  if (!track) return;
  const n = track.children.length;
  i = (i + n) % n;
  track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
}
function photoIndex() { const t = $('#gal-track'); return Math.round(t.scrollLeft / t.clientWidth); }

function productMsg(p, n) {
  const line = hasPrice(p) ? `\nHarga: ${fmt(p.price)} × ${n} = ${fmt(p.price * n)}` : `\nJumlah: ${n} pcs`;
  return hasPrice(p)
    ? `Halo GG Sport17! Saya mau pesan:\n\n*${p.name}*${line}\n\nApakah stok tersedia? Terima kasih.`
    : `Halo GG Sport17! Saya mau tanya harga & stok:\n\n*${p.name}*${line}\n\nTerima kasih.`;
}

function routeFromHash() {
  const m = location.hash.match(/^#p\/([\w-]+)$/);
  const p = m && PRODUCTS.find(x => x.slug === m[1]);
  if (p) openProduct(p.id, false);
  else closeProduct(true);
}

/* ---------- Cart ---------- */
const CART_KEY = 'ggsport17-cart';
let cart = [];
try { cart = (JSON.parse(localStorage.getItem(CART_KEY)) || []).filter(i => byId(i.id)); } catch { cart = []; }
const saveCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {} };

function addToCart(id, n = 1) {
  const it = cart.find(i => i.id === id);
  if (it) it.qty += n; else cart.push({ id, qty: n });
  saveCart(); updateCount(true);
}
function setQty(id, d) {
  const it = cart.find(i => i.id === id);
  if (!it) return;
  it.qty += d;
  if (it.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart(); updateCount(); renderCart();
}
function updateCount(bump = false) {
  const n = cart.reduce((s, i) => s + i.qty, 0);
  const el = $('#cart-count');
  el.textContent = n; el.hidden = n === 0;
  if (bump) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
}

function cartTotals() {
  let total = 0, unpriced = 0;
  cart.forEach(i => { const p = byId(i.id); if (hasPrice(p)) total += p.price * i.qty; else unpriced++; });
  return { total, unpriced };
}

function renderCart() {
  const body = $('#cart-body'), ft = $('#cart-ft');
  if (!cart.length) {
    body.innerHTML = `<div class="cart-empty">${icon('i-cart')}<p><b>Keranjang masih kosong.</b><br>Yuk pilih produk dulu.</p><button class="btn btn-primary" data-close-cart data-go="produk">Lihat Produk</button></div>`;
    ft.hidden = true;
    return;
  }
  body.innerHTML = cart.map(i => {
    const p = byId(i.id);
    return `<div class="ci">
      <img src="${photo(p)}" alt="">
      <div class="ci-b">
        <div class="ci-n">${esc(p.name)}</div>
        <div class="ci-p">${hasPrice(p) ? `${fmt(p.price)} / pcs` : 'Harga dikonfirmasi via WA'}</div>
        <div class="ci-row">
          <div class="qty"><button data-cq="${p.id}" data-d="-1" aria-label="Kurangi">−</button><span>${i.qty}</span><button data-cq="${p.id}" data-d="1" aria-label="Tambah">+</button></div>
          <button class="icon-btn ci-del" data-del="${p.id}" aria-label="Hapus">${icon('i-trash')}</button>
        </div>
      </div>
    </div>`;
  }).join('');

  const { total, unpriced } = cartTotals();
  const saved = loadForm();
  ft.hidden = false;
  ft.innerHTML = `
    <div class="sum"><span>Subtotal</span><b>${total ? fmt(total) : '–'}</b></div>
    <p class="sum-note">${unpriced ? `${unpriced} produk harganya dikonfirmasi admin. ` : ''}Ongkir dihitung admin sesuai alamat.</p>
    <label class="field"><span>Nama penerima</span><input id="f-name" autocomplete="name" value="${esc(saved.name || '')}"></label>
    <label class="field"><span>No. WhatsApp</span><input id="f-phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="08xxxxxxxxxx" value="${esc(saved.phone || '')}"></label>
    <label class="field"><span>Alamat lengkap (jalan, kecamatan, kota, kode pos)</span><textarea id="f-addr" autocomplete="street-address">${esc(saved.addr || '')}</textarea></label>
    <label class="field"><span>Catatan (warna, ukuran, dll) — opsional</span><input id="f-note" value="${esc(saved.note || '')}"></label>
    <button class="btn btn-wa btn-block" id="checkout">${icon('i-wa')}Kirim Pesanan via WhatsApp</button>`;
}

const FORM_KEY = 'ggsport17-form';
function loadForm() { try { return JSON.parse(localStorage.getItem(FORM_KEY)) || {}; } catch { return {}; } }
function saveForm(f) { try { localStorage.setItem(FORM_KEY, JSON.stringify(f)); } catch {} }

function checkout() {
  const f = { name: $('#f-name').value.trim(), phone: $('#f-phone').value.trim(), addr: $('#f-addr').value.trim(), note: $('#f-note').value.trim() };
  const missing = [['name', '#f-name'], ['phone', '#f-phone'], ['addr', '#f-addr']].filter(([k]) => !f[k]);
  $$('#cart-ft .field-err').forEach(e => e.classList.remove('field-err'));
  if (missing.length) {
    missing.forEach(([, s]) => $(s).classList.add('field-err'));
    $(missing[0][1]).focus();
    toast('Lengkapi nama, no. WhatsApp & alamat dulu ya');
    return;
  }
  saveForm(f);
  const items = cart.map((i, n) => {
    const p = byId(i.id);
    return `${n + 1}. ${p.name}\n   ${i.qty} pcs${hasPrice(p) ? ` × ${fmt(p.price)} = ${fmt(p.price * i.qty)}` : ' (mohon info harga)'}`;
  }).join('\n');
  const { total, unpriced } = cartTotals();
  const totalLine = total ? `\n\n*Subtotal: ${fmt(total)}*${unpriced ? ' (belum termasuk produk yang perlu konfirmasi harga)' : ''}` : '';
  const msg = `Halo GG Sport17! Saya mau order:\n\n${items}${totalLine}\n\n*Data pengiriman*\nNama: ${f.name}\nNo. WA: ${f.phone}\nAlamat: ${f.addr}${f.note ? `\nCatatan: ${f.note}` : ''}\n\nMohon info total + ongkir dan cara pembayarannya. Terima kasih!`;
  openWA(msg);
}

function openCart() {
  renderCart();
  $('#drawer').classList.add('open');
  $('#drawer').setAttribute('aria-hidden', 'false');
  document.body.classList.add('lock');
}
function closeCart() {
  $('#drawer').classList.remove('open');
  $('#drawer').setAttribute('aria-hidden', 'true');
  if ($('#modal').hidden) document.body.classList.remove('lock');
}

/* ---------- Events ---------- */
document.addEventListener('click', e => {
  const t = e.target;
  const wa = t.closest('[data-wa]');
  if (wa) { e.preventDefault(); openWA(wa.dataset.wa); return; }

  const cat = t.closest('[data-cat]');
  if (cat) { e.preventDefault(); $('#nav').classList.remove('open'); setCat(cat.dataset.cat, !cat.closest('#pills')); return; }

  const open = t.closest('[data-open]');
  if (open) { openProduct(+open.dataset.open); return; }

  if (t.closest('[data-close]')) { closeProduct(); return; }
  if (t.closest('[data-close-cart]')) {
    closeCart();
    const go = t.closest('[data-go]');
    if (go) $('#' + go.dataset.go).scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const g = t.closest('[data-gal]');
  if (g) { goPhoto(photoIndex() + +g.dataset.gal); return; }
  const th = t.closest('[data-thumb]');
  if (th) { goPhoto(+th.dataset.thumb); return; }

  const q = t.closest('[data-qty]');
  if (q) { qty = Math.max(1, Math.min(99, qty + +q.dataset.qty)); $('#pd-qty').textContent = qty; return; }

  if (t.closest('#pd-add')) {
    addToCart(current.id, qty);
    toast(`${qty} × ${current.name} masuk keranjang`);
    return;
  }
  if (t.closest('#pd-wa')) { openWA(productMsg(current, qty)); return; }

  const cq = t.closest('[data-cq]');
  if (cq) { setQty(+cq.dataset.cq, +cq.dataset.d); return; }
  const del = t.closest('[data-del]');
  if (del) { setQty(+del.dataset.del, -Infinity); return; }
  if (t.closest('#checkout')) { checkout(); return; }

  if (t.closest('#cart-open')) { openCart(); return; }
  if (t.closest('#menu-toggle')) { $('#nav').classList.toggle('open'); return; }
  if (t.closest('#search-toggle')) {
    $('#produk').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => $('#search').focus({ preventScroll: true }), 350);
    return;
  }
  if (t.closest('#nav a')) $('#nav').classList.remove('open');
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if ($('#drawer').classList.contains('open')) closeCart(); else closeProduct(); }
  if (!$('#modal').hidden && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && $('#gal-track')) goPhoto(photoIndex() + (e.key === 'ArrowRight' ? 1 : -1));
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-open]')) { e.preventDefault(); openProduct(+e.target.dataset.open); }
});

let searchT;
$('#search').addEventListener('input', e => {
  clearTimeout(searchT);
  searchT = setTimeout(() => { query = e.target.value; renderCatalog(); }, 120);
});
window.addEventListener('popstate', routeFromHash);

renderStatic();
renderCatalog();
updateCount();
routeFromHash();
