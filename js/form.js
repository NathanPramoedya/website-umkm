"use strict";

(() => {
  const STORAGE_KEY = "kopi-saji-preferensi-kontak";
  const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PESAN_DEFAULT_PREVIEW_ID = "preview-form";

  const form = document.querySelector("#form-kontak");
  if (!form) return;

  const preview = document.getElementById(PESAN_DEFAULT_PREVIEW_ID);
  const formFeedback = document.querySelector("#form-feedback");
  const statusMsg = document.querySelector("#status-form");
  const prefStatus = document.querySelector("#preferensi-status");
  const hapusButton = document.querySelector("#hapus-preferensi");
  const paketSelect = document.querySelector("#paket");
  const topikError = document.querySelector("#topik-error");
  const topikInputs = Array.from(form.querySelectorAll('input[name="topik"]'));
  const topikFieldset = topikInputs.length ? topikInputs[0].closest("fieldset") : null;
  const defaultPreview = preview ? preview.textContent : "";
  const defaultPrefStatus = prefStatus ? prefStatus.textContent : "";

  const fields = ["nama", "email", "telepon", "paket", "pesan", "setuju"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const PESAN_ERROR = {
    nama: {
      valueMissing: "Nama wajib diisi.",
      tooShort: "Nama minimal 3 karakter.",
    },
    email: {
      valueMissing: "Email wajib diisi.",
      typeMismatch: "Format email belum benar, contoh: nama@email.com.",
    },
    telepon: {
      patternMismatch: "Format nomor telepon belum sesuai, contoh: 081234567890.",
    },
    paket: {
      valueMissing: "Pilih paket yang diminati.",
    },
    pesan: {
      valueMissing: "Pesan wajib diisi.",
      tooShort: "Pesan minimal 20 karakter.",
    },
    setuju: {
      valueMissing: "Konfirmasi persetujuan wajib dicentang.",
    },
  };
  const PESAN_TOPIK = "Pilih topik pertanyaan.";


  function getFieldError(field) {
    const aturan = PESAN_ERROR[field.id] || {};
    const validity = field.validity;
    const adalahTeks = field.tagName === "TEXTAREA" || field.type === "text";

    if (adalahTeks) {
      const panjang = field.value.trim().length;
      if (field.required && panjang === 0) return aturan.valueMissing || "Bagian ini wajib diisi.";
      if (field.minLength > 0 && panjang > 0 && panjang < field.minLength) {
        return aturan.tooShort || `Isi minimal ${field.minLength} karakter.`;
      }
    }

    if (validity.valueMissing) return aturan.valueMissing || "Bagian ini wajib diisi.";
    if (validity.tooShort) return aturan.tooShort || `Isi minimal ${field.minLength} karakter.`;
    if (validity.typeMismatch) return aturan.typeMismatch || "Format data belum sesuai.";
    if (validity.patternMismatch) return aturan.patternMismatch || "Format belum sesuai contoh yang diminta.";

    if (field.id === "email" && field.value && !POLA_EMAIL.test(field.value.trim())) {
      return aturan.typeMismatch;
    }

    return "";
  }

  function tampilkanError(field, pesan) {
    const error = document.getElementById(`${field.id}-error`);
    field.setCustomValidity(pesan);
    field.setAttribute("aria-invalid", pesan ? "true" : "false");
    if (error) error.textContent = pesan;
  }

  function validasiField(field) {
    field.setCustomValidity("");
    const pesan = getFieldError(field);
    tampilkanError(field, pesan);
    return pesan === "";
  }

  function topikTerpilih() {
    return topikInputs.find((input) => input.checked) || null;
  }

  function tampilkanErrorTopik(pesan) {
    topikInputs.forEach((input) => input.setAttribute("aria-invalid", pesan ? "true" : "false"));
    if (topikFieldset) topikFieldset.classList.toggle("is-invalid", Boolean(pesan));
    if (topikError) topikError.textContent = pesan;
  }

  function validasiTopik() {
    const valid = topikTerpilih() !== null;
    tampilkanErrorTopik(valid ? "" : PESAN_TOPIK);
    return valid;
  }

  function setFeedback(pesan, sukses) {
    if (!formFeedback) return;
    formFeedback.textContent = pesan;
    formFeedback.classList.toggle("success", Boolean(sukses));
  }

  function kosongkanPreview() {
    if (preview) preview.textContent = defaultPreview;
    if (statusMsg) statusMsg.hidden = true;
  }

  function labelUntuk(input) {
    if (!input) return "-";
    const label = document.querySelector(`label[for="${input.id}"]`);
    return label ? label.textContent.trim() : input.value;
  }

  function tampilkanPreview() {
    const data = new FormData(form);
    const paket = paketSelect && paketSelect.selectedOptions[0]
      ? paketSelect.selectedOptions[0].textContent.trim()
      : data.get("paket");

    if (preview) {
      preview.textContent = [
        `Nama: ${String(data.get("nama")).trim()}`,
        `Email: ${String(data.get("email")).trim()}`,
        `Telepon: ${String(data.get("telepon") || "").trim() || "-"}`,
        `Waktu kontak: ${labelUntuk(form.querySelector('input[name="waktu"]:checked'))}`,
        `Paket: ${paket}`,
        `Topik: ${labelUntuk(topikTerpilih())}`,
        `Pesan: ${String(data.get("pesan")).trim()}`,
      ].join("\n");
    }

    setFeedback("Form valid. Preview berhasil dibuat.", true);
    if (statusMsg) statusMsg.hidden = false;
  }


  function perbaruiPanelPreferensi(pref) {
    if (!prefStatus) return;
    if (!pref) {
      prefStatus.textContent = defaultPrefStatus;
      return;
    }
    const bagian = [];
    if (pref.paket) bagian.push(`paket ${labelPaket(pref.paket)}`);
    if (pref.topik) bagian.push(`topik ${labelUntuk(topikInputs.find((i) => i.value === pref.topik))}`);
    prefStatus.textContent = `Tersimpan: ${bagian.join(", ")}.`;
  }

  function labelPaket(nilai) {
    const opsi = paketSelect ? Array.from(paketSelect.options).find((o) => o.value === nilai) : null;
    return opsi ? opsi.textContent.trim() : nilai;
  }

  function paketValid(nilai) {
    return typeof nilai === "string" && nilai !== "" &&
      Boolean(paketSelect) && Array.from(paketSelect.options).some((o) => o.value === nilai);
  }

  function topikValid(nilai) {
    return typeof nilai === "string" && topikInputs.some((i) => i.value === nilai);
  }

  function simpanPreferensi() {
    const topik = topikTerpilih();
    const preferensi = {
      paket: paketSelect ? paketSelect.value : "",
      topik: topik ? topik.value : "",
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferensi));
      perbaruiPanelPreferensi(preferensi);
    } catch (error) {
      console.warn("Preferensi tidak dapat disimpan.", error);
    }
  }

  function muatPreferensi() {
    try {
      const tersimpan = localStorage.getItem(STORAGE_KEY);
      if (!tersimpan) return;

      const preferensi = JSON.parse(tersimpan);
      if (!preferensi || typeof preferensi !== "object" || Array.isArray(preferensi)) {
        throw new Error("Bentuk data preferensi tidak valid.");
      }

      const adaPaket = paketValid(preferensi.paket);
      const adaTopik = topikValid(preferensi.topik);
      if (!adaPaket && !adaTopik) {
        throw new Error("Isi data preferensi tidak dikenali.");
      }

      if (adaPaket) paketSelect.value = preferensi.paket;
      if (adaTopik) {
        const pilihan = topikInputs.find((i) => i.value === preferensi.topik);
        if (pilihan) pilihan.checked = true;
      }
      perbaruiPanelPreferensi({
        paket: adaPaket ? preferensi.paket : "",
        topik: adaTopik ? preferensi.topik : "",
      });
    } catch (error) {
      console.warn("Preferensi tidak valid, data dihapus.", error);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (errorHapus) {
        console.warn("Preferensi gagal dihapus.", errorHapus);
      }
      perbaruiPanelPreferensi(null);
    }
  }

  function hapusPreferensi() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Preferensi gagal dihapus.", error);
    }
    if (paketSelect) tampilkanError(paketSelect, "");
    if (paketSelect) paketSelect.value = "";
    topikInputs.forEach((input) => { input.checked = false; });
    tampilkanErrorTopik("");
    if (prefStatus) prefStatus.textContent = "Preferensi dihapus. Belum ada preferensi tersimpan.";
  }

  muatPreferensi();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Validasi SEMUA field agar semua error tampil sekaligus.
    const hasilField = fields.map((field) => validasiField(field));
    const topikOk = validasiTopik();
    const semuaValid = hasilField.every(Boolean) && topikOk;

    if (!semuaValid || !form.checkValidity()) {
      setFeedback("Periksa kembali bagian yang ditandai.", false);
      kosongkanPreview(); // preview hanya untuk data valid
      form.reportValidity();
      const pertama = form.querySelector('[aria-invalid="true"]');
      if (pertama) pertama.focus(); // focus management: field invalid pertama (urutan DOM)
      return;
    }

    simpanPreferensi();
    tampilkanPreview();
  });

  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      if (field.value !== "" || field.getAttribute("aria-invalid") === "true") validasiField(field);
    });
    const ulang = () => {
      if (field.getAttribute("aria-invalid") === "true") validasiField(field);
    };
    field.addEventListener("input", ulang);
    field.addEventListener("change", ulang);
  });

  topikInputs.forEach((input) => {
    input.addEventListener("change", validasiTopik);
  });

  form.addEventListener("reset", () => {
    fields.forEach((field) => tampilkanError(field, ""));
    tampilkanErrorTopik("");
    setFeedback("", false);
    kosongkanPreview();
  });

  if (hapusButton) hapusButton.addEventListener("click", hapusPreferensi);
})();