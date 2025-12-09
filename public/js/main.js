document.addEventListener("DOMContentLoaded", function () {
  const body = document.getElementById("body");
  const versions = document.querySelectorAll(".version");
  const versionForm = document.querySelector("#version-form");
  const confirm = document.querySelector(".confirm");
  const title = document.querySelector(".title");

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const weights = [1, 2, 1, 4, 1, 1, 4, 4, 4, 2, 8, 8, 8, 8, 8, 8];

  function weightedRandom(numbers, weights) {
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const rand = Math.random() * totalWeight;
    let sum = 0;

    for (let i = 0; i < numbers.length; i++) {
      sum += weights[i];
      if (rand < sum) return numbers[i];
    }
  }

  body.style.backgroundImage = `url("../img/${weightedRandom(numbers, weights)}.gif")`;

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
