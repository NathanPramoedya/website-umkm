"use strict";
console.log("P09 JavaScript aktif");

const produkUmkm = [
    { id: "KS-01", nama: "Kopi Saji Signature", kategori: "Kopi", harga: 45000, stok: 24, unggulan: true, diskonPersen: 10, deskripsi: "Bubuk 250 gram, blend robusta-arabika khas Batang." },
    { id: "KS-02", nama: "Cold Brew Aren", kategori: "Kopi", harga: 20000, stok: 12, unggulan: false, diskonPersen: 0, deskripsi: "Botol 250 ml, diseduh dingin 12 jam." },
    { id: "KS-03", nama: "Americano Peach", kategori: "Kopi", harga: 18000, stok: 3, unggulan: false, diskonPersen: 0, deskripsi: "Sachet drip 12 gram, nuansa peach segar." },
    { id: "KS-04", nama: "Es Kopi Kelapa Muda", kategori: "Kopi", harga: 18000, stok: 0, unggulan: false, diskonPersen: 0, deskripsi: "Sachet drip 12 gram, dengan santan kelapa muda." },
    { id: "KS-05", nama: "Paket Kantor Mingguan", kategori: "Bundling", harga: 95000, stok: 8, unggulan: true, diskonPersen: 15, deskripsi: "5 sachet drip @ 15 gram untuk seduh di kantor." },
    { id: "KS-06", nama: "Paket Tester Pelanggan Baru", kategori: "Bundling", harga: 35000, stok: 5, unggulan: false, diskonPersen: 0, deskripsi: "3 sachet drip @ 10 gram untuk coba-coba." },
];

function formatRupiah(nilai) {
    const angka = Number(nilai);
    if (!Number.isFinite(angka)) {
        return "Rp 0";
    }
    return "Rp " + Math.round(angka).toLocaleString("id-ID");
}

function hitungHargaAkhir(harga, diskonPersen = 0) {
    return diskonPersen > 0 ? Math.round((harga * (100 - diskonPersen)) / 100) : harga;
}

function statusStok(stok) {
    if (stok <= 0) {
        return { label: "Habis", class: "empty" };
    }
    if (stok <= 5) {
        return { label: "Stok terbatas", class: "warning" };
    }
    return { label: "Tersedia", class: "tersedia" };
}

function buatKartuProduk(produk) {
    const status = statusStok(produk.stok);
    const hargaAkhir = hitungHargaAkhir(produk.harga, produk.diskonPersen);
    const adaDiskon = hargaAkhir < produk.harga;

    const blokHarga = adaDiskon
        ? `<p class="price-old"><s>${formatRupiah(produk.harga)}</s> <span class="discount-tag">-${produk.diskonPersen}%</span></p>
        <p class="price">${formatRupiah(hargaAkhir)}</p>`
        : `<p class="price">${formatRupiah(produk.harga)}</p>`;

    return `
    <article class="js-product-card" data-id="${produk.id}">
        <h3>${produk.nama}</h3>
        <p class="category-note">${produk.kategori} &middot; ${produk.deskripsi}</p>
        ${blokHarga}
        <span class="stock-badge ${status.class}">${status.label}</span>
    </article>`;
}

function renderProduk() {
    const grid = document.querySelector("#produk-dinamis");
    const ringkasan = document.querySelector("#produk-ringkasan");
    const unggulan = document.querySelector("#produk-unggulan");
    if (!grid || !ringkasan || !unggulan) {
        console.warn("Kontainer render tidak ditemukan, render dilewati.");
        return;
    }

    console.table(produkUmkm);

    const produkTersedia = produkUmkm.filter((produk) => produk.stok > 0);
    console.log("Setelah filter stok > 0:", produkTersedia.length, "| array asli tetap:", produkUmkm.length);

    const daftarKartu = produkTersedia.map((produk) => buatKartuProduk(produk));
    console.log("Jumlah kartu HTML:", daftarKartu.length);

    const produkUnggulan = produkUmkm.find((produk) => produk.unggulan === true);
    console.log("Hasil find unggulan:", produkUnggulan);

    const jumlahPerStatus = { "Tersedia": 0, "Stok terbatas": 0, "Habis": 0 };
    for (const produk of produkUmkm) {
        const status = statusStok(produk.stok);
        jumlahPerStatus[status.label] += 1;
    }
    console.table(jumlahPerStatus);

    grid.innerHTML = daftarKartu.join("");
    ringkasan.textContent = `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data.`;

    if (produkUnggulan) {
        unggulan.textContent = `Produk unggulan: ${produkUnggulan.nama}`;
    } else {
        unggulan.textContent = "Belum ada produk unggulan.";
    }
}

document.addEventListener("DOMContentLoaded", renderProduk);