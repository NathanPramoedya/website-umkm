"use strict";

(() => {
  const NEWSLETTER_KEY = "kopi-saji-newsletter";
  const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const form = document.querySelector("#form-newsletter");
  const emailInput = document.querySelector("#newsletter-email");
  const errorEl = document.querySelector("#newsletter-email-error");
  const feedback = document.querySelector("#newsletter-feedback");
  const unsubscribe = document.querySelector("#newsletter-unsubscribe");
  if (!form || !emailInput) return;

  function setFeedback(pesan, sukses) {
    if (!feedback) return;
    feedback.textContent = pesan;
    feedback.classList.toggle("success", Boolean(sukses));
  }

  function tampilkanError(pesan) {
    emailInput.setCustomValidity(pesan);
    emailInput.setAttribute("aria-invalid", pesan ? "true" : "false");
    if (errorEl) errorEl.textContent = pesan;
  }

  function validasi() {
    emailInput.setCustomValidity("");
    const nilai = emailInput.value.trim();

    let pesan = "";
    if (nilai === "") {
      pesan = "Email wajib diisi untuk berlangganan.";
    } else if (emailInput.validity.typeMismatch || !POLA_EMAIL.test(nilai)) {
      pesan = "Format email belum benar, contoh: nama@email.com.";
    }

    tampilkanError(pesan);
    return pesan === "";
  }

  function hapusStorage() {
    try {
      localStorage.removeItem(NEWSLETTER_KEY);
    } catch (error) {
      console.warn("Data newsletter gagal dihapus.", error);
    }
  }

  function muat() {
    try {
      const tersimpan = localStorage.getItem(NEWSLETTER_KEY);
      if (!tersimpan) return;

      const data = JSON.parse(tersimpan);
      if (!data || typeof data.email !== "string" || !POLA_EMAIL.test(data.email)) {
        throw new Error("Data newsletter tidak valid.");
      }

      emailInput.value = data.email;
      setFeedback(`Terdaftar dengan email: ${data.email}`, true);
      if (unsubscribe) unsubscribe.hidden = false;
    } catch (error) {
      console.warn("Data newsletter tidak valid, data dihapus.", error);
      hapusStorage();
    }
  }

  muat();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validasi() || !form.checkValidity()) {
      setFeedback("Periksa kembali alamat email kamu.", false);
      emailInput.reportValidity();
      emailInput.focus();
      return;
    }

    const payload = {
      email: emailInput.value.trim(),
      subscribedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(payload));
    } catch (error) {
      console.warn("Newsletter tidak dapat disimpan.", error);
    }

    setFeedback(`Terima kasih! ${payload.email} berhasil terdaftar di newsletter.`, true);
    if (unsubscribe) unsubscribe.hidden = false;
  });

  emailInput.addEventListener("input", () => {
    if (emailInput.getAttribute("aria-invalid") === "true") validasi();
  });

  if (unsubscribe) {
    unsubscribe.addEventListener("click", () => {
      hapusStorage();
      form.reset();
      tampilkanError("");
      setFeedback("Langganan newsletter dibatalkan.", false);
      unsubscribe.hidden = true;
    });
  }
})();