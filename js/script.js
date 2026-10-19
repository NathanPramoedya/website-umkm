const promoButton = document.querySelector("#promoButton");

if (promoButton) {
    promoButton.addEventListener("click", () => {
        promoButton.textContent = "Promo: Beli 2 Gratis 1 Cold Brew Aren!";
        promoButton.classList.add("is-promo");
        console.log("Promo Kopi Saji berhasil ditampilkan");
    });
}

// Hamburger menu untuk navigasi mobile.
(() => {
  const nav = document.querySelector(".nav");
  const toggle = nav && nav.querySelector(".nav-toggle");
  const list = document.getElementById("nav-list");
  if (!nav || !toggle || !list) return;

  nav.classList.add("nav--js");

  const mobileQuery = window.matchMedia("(max-width: 47.99rem)");
  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";
  const setOpen = (open) => toggle.setAttribute("aria-expanded", String(open));

  toggle.addEventListener("click", () => setOpen(!isOpen()));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (isOpen() && !nav.contains(event.target)) setOpen(false);
  });

  mobileQuery.addEventListener("change", () => setOpen(false));
})();