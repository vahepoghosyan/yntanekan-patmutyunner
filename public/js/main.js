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
        .post(`http://localhost:3001/version`, {
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

  const path = location.origin;

  {
    const contactUsForm = document.getElementById("contact-us");
    const message = document.getElementById("message");

    if (contactUsForm) {
      contactUsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        axios
          .post(`https://email-sender-gezb.onrender.com/example`, {
            full_name: formData.get("full_name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            social: formData.get("social"),
            message: formData.get("message"),
          })
          .then((res) => {})
          .catch((err) => {});
      });
    }
  }
  {
    const userDataForm1 = document.getElementById("step-1");
    const userDataForm2 = document.getElementById("step-2");
    const loginForm = document.getElementById("login");
    const travelDetailsForm = document.getElementById("travel-details");
    const message = document.getElementById("message");
    const submitFormButton = document.getElementById("submit-form");
    if (userDataForm1) {
      userDataForm1.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        submitFormButton.classList.remove("button-primary");
        submitFormButton.classList.add("button-disabled");
        axios
          .post(`${path}/step-1`, {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
          })
          .then(() => {
            window.location.replace(`${path}/step-2`);
          })
          .catch((err) => {
            console.log(err);
            if (err?.response?.data) {
              message.innerText = err.response.data.message;
              message.classList.remove("d-none");
              submitFormButton.classList.remove("button-disabled");
              submitFormButton.classList.add("button-primary");
            } else {
              window.location.replace(`${location.origin}/SWW`);
            }
          });
      });
    }
    if (userDataForm2) {
      userDataForm2.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        submitFormButton.classList.remove("button-primary");
        submitFormButton.classList.add("button-disabled");
        axios
          .post(`${path}/step-2`, {
            movie: formData.get("movie"),
          })
          .then(() => {
            window.location.replace(`${location.origin}/profile`);
          })
          .catch((err) => {
            if (err?.response?.data) {
              message.innerText = err.response.data.message;
              message.classList.remove("d-none");
              submitFormButton.classList.add("button-primary");
              submitFormButton.classList.remove("button-disabled");
            } else {
              window.location.replace(`${location.origin}/SWW`);
            }
          });
      });
    }
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        submitFormButton.classList.remove("button-primary");
        submitFormButton.classList.add("button-disabled");
        axios
          .post(`${path}/login`, {
            identifier: formData.get("username"),
            password: formData.get("password"),
          })
          .then(() => {
            window.location.replace(`${location.origin}/profile`);
          })
          .catch((err) => {
            if (err?.response?.data) {
              message.innerText = err.response.data.message;
              message.classList.remove("d-none");
              submitFormButton.classList.add("button-primary");
              submitFormButton.classList.remove("button-disabled");
            } else {
              window.location.replace(`${location.origin}/SWW`);
            }
          });
      });
    }

    if (travelDetailsForm) {
      travelDetailsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        submitFormButton.classList.remove("button-primary");
        submitFormButton.classList.add("button-disabled");
        axios
          .put(`${path}/profile`, {
            arrivalFlightNo: formData.get("arrivalFlightNo").trim(),
            arrivalDate: formData.get("arrivalDate").trim(),
            departureDate: formData.get("departureDate").trim(),
            footRestrictions: formData.get("foodRestrictions"),
          })
          .then(() => {
            window.location.replace(`${location.origin}/profile`);
          })
          .catch((err) => {
            if (err?.response?.data) {
              message.innerText = err.response.data.message;
              message.classList.remove("d-none");
              submitFormButton.classList.add("button-primary");
              submitFormButton.classList.remove("button-disabled");
            } else {
              window.location.replace(`${location.origin}/SWW`);
            }
          });
      });
    }
  }
});
