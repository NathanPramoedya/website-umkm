const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");
const statusMsg = document.querySelector("#status-form");
const defaultPreview = preview.textContent;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  preview.textContent = [
    `Nama: ${data.get("nama")}`,
    `Email: ${data.get("email")}`,
    `WhatsApp: ${data.get("telepon") || "-"}`,
    `Waktu kontak: ${data.get("waktu")}`,
    `Paket: ${data.get("paket")}`,
    `Topik: ${data.get("topik")}`,
    `Pesan: ${data.get("pesan")}`,
  ].join("\n");
  statusMsg.hidden = false;
});

form.addEventListener("reset", () => {
  preview.textContent = defaultPreview;
  statusMsg.hidden = true;
});