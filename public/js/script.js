(() => {
  "use strict";

  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });

  const filterButtons = document.querySelectorAll("[data-filter]");
  const listingCards = document.querySelectorAll("[data-listing-card]");
  const taxSwitch = document.querySelector("#taxSwitch");
  const taxInfos = document.querySelectorAll("[data-tax-info]");

  if (filterButtons.length && listingCards.length) {
    filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      listingCards.forEach((card) => {
      const cardCategory = card.dataset.category;
        const shouldShow =
        selectedFilter === "all" || cardCategory === selectedFilter;

        card.style.display = shouldShow ? "" : "none";
        });
      });
    });
  }

  if (taxSwitch && taxInfos.length) {
    taxSwitch.addEventListener("change", () => {
      taxInfos.forEach((info) => {
        info.classList.toggle("show-tax", taxSwitch.checked);
      });
    });
  }
})();
