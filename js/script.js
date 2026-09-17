const promoButton = document.querySelector("#promoButton");

promoButton.addEventListener("click", () => {
    promoButton.textContent = "Promo: Beli 2 Gratis 1 Cold Brew Aren!";
    
    promoButton.style.backgroundColor = "#865c42";
    promoButton.style.color = "#ffffff";
    
    console.log("Promo Kopi Saji berhasil ditampilkan");
});