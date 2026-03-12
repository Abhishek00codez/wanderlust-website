(() => {
  "use strict";

  // Bootstrap form validation
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    }, false);
  });

  // Auto-show Bootstrap toasts
  document.querySelectorAll(".toast").forEach((el) => {
    new bootstrap.Toast(el).show();
  });

  // Image preview on file input
  const imageInput = document.getElementById("imageInput");
  const previewContainer = document.getElementById("imgPreview");
  const previewImg = document.getElementById("imgPreviewImg");

  if (imageInput && previewContainer && previewImg) {
    imageInput.addEventListener("change", () => {
      const file = imageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImg.src = e.target.result;
          previewContainer.style.display = "block";
        };
        reader.readAsDataURL(file);
      } else {
        previewContainer.style.display = "none";
        previewImg.src = "";
      }
    });
  }
})();