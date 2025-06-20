document.addEventListener("DOMContentLoaded", function () {
  const body = document.getElementById("body");
  const versions = document.querySelectorAll(".version");
  const versionForm = document.querySelector("#version-form");
  const confirm = document.querySelector(".confirm");
  const title = document.querySelector(".title");

  const randomImage = Math.round(Math.random() * (7 - 1) + 1);
  body.style.backgroundImage = `url("../img/${randomImage}.gif")`;

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
        .post(`https://yntanekan-patmutyunner-901154874733.europe-west1.run.app/version`, {
          version: formData.get("version"),
        })
        .then((res) => {
          versionForm.classList.add("hide");
          title.classList.add("show");
        })
        .catch((err) => {
          title.textContent = "Մի բան լավ չգնաց";
          versionForm.classList.add("hide");
          title.classList.add("show");
        });
    });
  }
});
