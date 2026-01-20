const resumeButton = document.querySelector("#download-resume");

if (resumeButton) {
  resumeButton.addEventListener("click", () => {
    window.print();
  });
}
