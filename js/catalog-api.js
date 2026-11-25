const DATA_URL = "data/products.json";
const catalogStatus = document.querySelector("#catalog-status");
const produkGrid = document.querySelector("#produk-dinamis");
const produkRingkasan = document.querySelector("#produk-ringkasan");
const produkUnggulan = document.querySelector("#produk-unggulan");
const tombolFilter = document.querySelectorAll("[data-filter]");

let products = [];
let activeCategory = "Semua";
let isLoaded = false; // true hanya jika fetch + validasi berhasil

function formatRupiah(nilai) {
  const angka = Number(nilai);
  if (!Number.isFinite(angka)) return "Rp 0";
  return "Rp " + Math.round(angka).toLocaleString("id-ID");
}

function getStockStatus(stock) {
  if (stock <= 0) return { label: "Habis", className: "empty" };
  if (stock <= 5) return { label: "Stok terbatas", className: "warning" };
  return { label: "Tersedia", className: "tersedia" };
}

function getFinalPrice(price, discountPercent = 0) {
  if (!Number.isFinite(discountPercent) || discountPercent <= 0) return price;
  return Math.round((price * (100 - discountPercent)) / 100);
}

function setStatus(state, message) {
  catalogStatus.className = "catalog-status produk-status";
  if (state) catalogStatus.classList.add(state);
  catalogStatus.textContent = message;
}

function createEmptyState(message) {
  const empty = document.createElement("p");
  empty.classList.add("empty-state");
  empty.textContent = message;
  return empty;
}

function validateProducts(data) {
  if (!Array.isArray(data)) {
    throw new Error("Format JSON harus berupa array.");
  }
  data.forEach((item, index) => {
    const valid =
      item !== null && typeof item === "object" && !Array.isArray(item) &&
      (typeof item.id === "string" || typeof item.id === "number") &&
      typeof item.name === "string" && item.name.trim() !== "" &&
      typeof item.category === "string" &&
      Number.isFinite(item.price) &&
      Number.isFinite(item.stock) &&
      (item.discountPercent === undefined ||
        (Number.isFinite(item.discountPercent) &&
          item.discountPercent >= 0 && item.discountPercent <= 100));
    if (!valid) {
      throw new Error(`Data produk ke-${index + 1} tidak lengkap atau salah tipe.`);
    }
  });
  return data;
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.classList.add("product-card");
  card.dataset.id = product.id;

  if (product.featured) {
    const badge = document.createElement("span");
    badge.classList.add("product-badge");
    badge.textContent = "Unggulan";
    card.append(badge);
  }

  const title = document.createElement("h3");
  title.textContent = product.name;

  const category = document.createElement("p");
  category.classList.add("category-note");
  category.textContent = `${product.category} · ${product.description ?? ""}`;

  const finalPrice = getFinalPrice(product.price, product.discountPercent);

  const price = document.createElement("p");
  price.classList.add("price");
  price.textContent = formatRupiah(finalPrice);

  const priceParts = [price];
  if (finalPrice < product.price) {
    const priceOld = document.createElement("p");
    priceOld.classList.add("price-old");

    const strike = document.createElement("s");
    strike.textContent = formatRupiah(product.price);

    const tag = document.createElement("span");
    tag.classList.add("discount-tag");
    tag.textContent = `-${product.discountPercent}%`;

    priceOld.append(strike, " ", tag);
    priceParts.unshift(priceOld);
  }

  const stockInfo = getStockStatus(product.stock);
  const stock = document.createElement("span");
  stock.classList.add("stock-badge", stockInfo.className);
  stock.textContent = `${stockInfo.label} (${product.stock})`;

  card.append(title, category, ...priceParts, stock);
  return card;
}

function updateFeaturedSummary(items) {
  if (!produkUnggulan) return;
  const featuredNames = items
    .filter((item) => item.featured)
    .map((item) => item.name);

  produkUnggulan.textContent = featuredNames.length === 0
    ? "Tidak ada produk unggulan pada daftar ini."
    : `Produk unggulan: ${featuredNames.join(", ")}.`;
}

function renderProducts(items) {
  produkGrid.replaceChildren();

  if (items.length === 0) {
    produkGrid.append(createEmptyState(
      products.length === 0
        ? "Belum ada produk yang tersedia."
        : `Belum ada produk pada kategori ${activeCategory}.`
    ));
    produkRingkasan.textContent = "0 produk ditemukan.";
    return;
  }

  items.forEach((product) => {
    produkGrid.append(createProductCard(product));
  });
  produkRingkasan.textContent = `${items.length} produk ditampilkan.`;
}

function applyFilter(category) {
  activeCategory = category;
  if (!isLoaded) return;

  const filtered = category === "Semua"
    ? products
    : products.filter((product) => product.category === category);

  renderProducts(filtered);

  if (products.length === 0) {
    setStatus("empty", "Request berhasil, tetapi data produk kosong.");
  } else if (filtered.length === 0) {
    setStatus("empty", `Belum ada produk pada kategori ${category}.`);
  } else if (category === "Semua") {
    setStatus("success", `${products.length} produk berhasil dimuat.`);
  } else {
    setStatus("success",
      `Kategori ${category}: ${filtered.length} dari ${products.length} produk ditampilkan.`);
  }
}

tombolFilter.forEach((button) => {
  button.addEventListener("click", (event) => {
    tombolFilter.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-pressed", "false");
    });
    event.currentTarget.classList.add("is-active");
    event.currentTarget.setAttribute("aria-pressed", "true");
    applyFilter(event.currentTarget.dataset.filter ?? "Semua");
  });
});

async function loadProducts() {
  isLoaded = false;
  produkGrid.setAttribute("aria-busy", "true");
  setStatus("loading", "Memuat data produk...");
  produkRingkasan.textContent = "Menunggu data produk.";
  produkUnggulan.textContent = "Produk unggulan akan muncul setelah data dimuat.";

  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    products = validateProducts(await response.json());
    isLoaded = true;

    updateFeaturedSummary(products);
    applyFilter(activeCategory);
  } catch (error) {
    products = [];
    isLoaded = false;
    produkGrid.replaceChildren();
    produkRingkasan.textContent = "Data produk gagal dimuat.";
    produkUnggulan.textContent = "-";
    setStatus("error", `Gagal memuat produk: ${error.message}`);
  } finally {
    produkGrid.setAttribute("aria-busy", "false");
  }
}

loadProducts();