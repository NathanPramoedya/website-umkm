"use strict";
console.log("P11 JavaScript aktif");

const produkUmkm = [
    { id: "KS-01", nama: "Kopi Saji Signature", kategori: "Kopi", harga: 45000, stok: 24, unggulan: true, diskonPersen: 10, deskripsi: "Bubuk 250 gram, blend robusta-arabika khas Batang." },
    { id: "KS-02", nama: "Cold Brew Aren", kategori: "Kopi", harga: 20000, stok: 12, unggulan: false, diskonPersen: 0, deskripsi: "Botol 250 ml, diseduh dingin 12 jam." },
    { id: "KS-03", nama: "Americano Peach", kategori: "Kopi", harga: 18000, stok: 3, unggulan: false, diskonPersen: 0, deskripsi: "Sachet drip 12 gram, nuansa peach segar." },
    { id: "KS-04", nama: "Es Kopi Kelapa Muda", kategori: "Kopi", harga: 18000, stok: 0, unggulan: false, diskonPersen: 0, deskripsi: "Sachet drip 12 gram, dengan santan kelapa muda." },
    { id: "KS-05", nama: "Paket Kantor Mingguan", kategori: "Bundling", harga: 95000, stok: 8, unggulan: true, diskonPersen: 15, deskripsi: "5 sachet drip @ 15 gram untuk seduh di kantor." },
    { id: "KS-06", nama: "Paket Tester Pelanggan Baru", kategori: "Bundling", harga: 35000, stok: 5, unggulan: false, diskonPersen: 0, deskripsi: "3 sachet drip @ 10 gram untuk coba-coba." },
];

const produkGrid = document.querySelector("#produk-grid");
const produkStatus = document.querySelector("#produk-status");
const tombolFilter = document.querySelectorAll("[data-filter]");

let kategoriSaatIni = "Semua";

function formatRupiah(nilai) {
    const angka = Number(nilai);
    if (!Number.isFinite(angka)) return "Rp 0";
    return "Rp " + Math.round(angka).toLocaleString("id-ID");
}

function hitungHargaAkhir(harga, diskonPersen = 0) {
    if (diskonPersen <= 0) return harga;
    return Math.round((harga * (100 - diskonPersen)) / 100);
}

function statusStok(stok) {
    if (stok <= 0) return { label: "Habis", className: "empty" };
    if (stok <= 5) return { label: "Stok terbatas", className: "warning" };
    return { label: "Tersedia", className: "tersedia" };
}

function perbaruiStatus(kategori) {
    if (!produkStatus || !produkGrid) return;
    const jumlahTampil = produkGrid.querySelectorAll(".product-card").length;
    produkStatus.textContent =
        `Kategori ${kategori} menampilkan ${jumlahTampil} produk dari ${produkUmkm.length} total produk.`;
}

function buatElemenProduk(produk) {
    const card = document.createElement("article");
    card.classList.add("product-card");
    card.dataset.id = produk.id;

    const title = document.createElement("h3");
    title.textContent = produk.nama;

    const category = document.createElement("p");
    category.classList.add("category-note");
    category.textContent = `${produk.kategori} · ${produk.deskripsi}`;

    const hargaAkhir = hitungHargaAkhir(produk.harga, produk.diskonPersen);
    const price = document.createElement("p");
    price.classList.add("price");
    price.textContent = formatRupiah(hargaAkhir);

    const bagianHarga = [price];
    if (hargaAkhir < produk.harga) {
        const priceOld = document.createElement("p");
        priceOld.classList.add("price-old");

        const coret = document.createElement("s");
        coret.textContent = formatRupiah(produk.harga);

        const diskon = document.createElement("span");
        diskon.classList.add("discount-tag");
        diskon.textContent = `-${produk.diskonPersen}%`;

        priceOld.append(coret, " ", diskon);
        bagianHarga.unshift(priceOld);
    }

    const status = statusStok(produk.stok);
    const stock = document.createElement("span");
    stock.classList.add("stock-badge", status.className);
    stock.textContent = status.label;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.classList.add("ghost-button");
    removeButton.textContent = "Sembunyikan";
    removeButton.addEventListener("click", () => {
        card.remove();
        perbaruiStatus(kategoriSaatIni);
        if (produkGrid.querySelectorAll(".product-card").length === 0) {
            produkGrid.append(buatEmptyState("Semua kartu disembunyikan sementara. Klik tombol filter untuk menampilkannya lagi."));
        }
    });

    card.append(title, category, ...bagianHarga, stock, removeButton);
    return card;
}

function buatEmptyState(pesan) {
    const empty = document.createElement("p");
    empty.classList.add("empty-state");
    empty.textContent = pesan;
    return empty;
}

function renderProduk(kategoriAktif = "Semua") {
    if (!produkGrid || !produkStatus) {
        console.warn("Target render produk tidak ditemukan.");
        return;
    }

    kategoriSaatIni = kategoriAktif;
    console.log("Render kategori:", kategoriAktif);

    const produkTampil = kategoriAktif === "Semua"
        ? produkUmkm
        : produkUmkm.filter((produk) => produk.kategori === kategoriAktif);

    produkGrid.replaceChildren();

    if (produkTampil.length === 0) {
        produkGrid.append(buatEmptyState(`Belum ada produk pada kategori ${kategoriAktif}.`));
    } else {
        produkTampil.forEach((produk) => {
            produkGrid.append(buatElemenProduk(produk));
        });
    }

    perbaruiStatus(kategoriAktif);
}

tombolFilter.forEach((tombol) => {
    tombol.addEventListener("click", (event) => {
        const tombolAktif = event.currentTarget;
        const kategori = tombolAktif.dataset.filter;

        tombolFilter.forEach((item) => {
            item.classList.remove("is-active");
            item.setAttribute("aria-pressed", "false");
        });
        tombolAktif.classList.add("is-active");
        tombolAktif.setAttribute("aria-pressed", "true");

        renderProduk(kategori);
    });
});

renderProduk();