"use strict";

console.log("P09 JavaScript aktif");

const produkUmkm = [
    { nama: "Kopi Saji Signature", kategori: "Kopi", harga: 45000, stok: 24, isUnggulan: true, diskonPersen: 10, deskripsi: "Bubuk 250 gram, blend robusta-arabika khas Batang." },
    { nama: "Cold Brew Aren", kategori: "Kopi", harga: 20000, stok: 12, isUnggulan: false, diskonPersen: 0, deskripsi: "Botol 250 ml, diseduh dingin 12 jam." },
    { nama: "Americano Peach", kategori: "Kopi", harga: 18000, stok: 3, isUnggulan: false, diskonPersen: 0, deskripsi: "Sachet drip 12 gram, nuansa peach segar." },
    { nama: "Es Kopi Kelapa Muda", kategori: "Kopi", harga: 18000, stok: 0, isUnggulan: false, diskonPersen: 0, deskripsi: "Sachet drip 12 gram, dengan santan kelapa muda." },
    { nama: "Paket Kantor Mingguan", kategori: "Bundling", harga: 95000, stok: 8, isUnggulan: true, diskonPersen: 15, deskripsi: "5 sachet drip @ 15 gram untuk seduh di kantor." },
    { nama: "Paket Tester Pelanggan Baru", kategori: "Bundling", harga: 35000, stok: 5, isUnggulan: false, diskonPersen: 0, deskripsi: "3 sachet drip @ 10 gram untuk coba-coba." },
];

const formatRupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

function hitungHargaAkhir(harga, diskonPersen = 0) {
    const persen = Number(diskonPersen);
    if (!Number.isFinite(persen) || persen <= 0) {
        return harga; // tidak ada diskon valid
    }
    const persenAman = Math.min(persen, 100);
    return Math.round((harga * (100 - persenAman)) / 100);
}

function statusStok(stok) {
    if (stok === 0) {
        return { label: "Habis", className: "empty" };
    } else if (stok <= 5) {
        return { label: "Terbatas", className: "warning" };
    } else {
        return { label: "Tersedia", className: "" };
    }
}

function renderProduk() {
    const grid = document.querySelector("#produk-dinamis");
    const ringkasan = document.querySelector("#produk-ringkasan");

    if (!grid || !ringkasan) {
        return;
    }

    console.table(produkUmkm);

    let jumlahTersedia = 0;
    let markup = "";

    for (const produk of produkUmkm) {
        const status = statusStok(produk.stok);
        const hargaAkhir = hitungHargaAkhir(produk.harga, produk.diskonPersen);
        const adaDiskon = hargaAkhir < produk.harga;

        if (produk.stok > 0) {
            jumlahTersedia++;
        }

        const badgeUnggulan = produk.isUnggulan
            ? '<span class="product-badge">Unggulan</span>'
            : "";

        const blokHarga = adaDiskon
            ? `<p class="price-old"><s>${formatRupiah.format(produk.harga)}</s> <span class="discount-tag">-${produk.diskonPersen}%</span></p>
            <p class="price">${formatRupiah.format(hargaAkhir)}</p>`
            : `<p class="price">${formatRupiah.format(produk.harga)}</p>`;

        markup += `
    <article class="js-product-card">
        ${badgeUnggulan}
        <h3>${produk.nama}</h3>
        <p>${produk.kategori} &middot; ${produk.deskripsi}</p>
        ${blokHarga}
        <span class="stock-badge ${status.className}">${status.label}${produk.stok > 0 ? ` (${produk.stok})` : ""}</span>
        <p>${produk.stok > 0 ? "Siap dipesan" : "Hubungi admin"}</p>
    </article>`;
    }

    grid.innerHTML = markup;
    ringkasan.textContent = `${jumlahTersedia} produk tersedia dari ${produkUmkm.length} data.`;
}

renderProduk();