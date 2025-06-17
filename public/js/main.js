document.addEventListener("DOMContentLoaded", function () {
  const versions = document.querySelectorAll(".version");
  const versionForm = document.querySelector("#version-form");
  const confirm = document.querySelector(".confirm");
  const title = document.querySelector(".title");

  versions.forEach((version) => {
    version.addEventListener("click", () => {
      confirm.classList.add("show");
    });
  });
  if (versionForm) {
    versionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      axios
        .post(`https://yntanekan-patmutyunner.onrender.com/version`, {
          version: formData.get("version"),
        })
        .then((res) => {
          versionForm.classList.add("hide");
          title.classList.add("show");
        })
        .catch((err) => {
          title.textContent = "Մի բան լավ չգնաց";
          title.classList.add("show");
        });
    });
  }
});
