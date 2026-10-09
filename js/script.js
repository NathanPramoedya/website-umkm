const promoButton = document.querySelector("#promoButton");

if (promoButton) {
    promoButton.addEventListener("click", () => {
        promoButton.textContent = "Promo: Beli 2 Gratis 1 Cold Brew Aren!";
        promoButton.classList.add("is-promo");
        console.log("Promo Kopi Saji berhasil ditampilkan");
    });
}