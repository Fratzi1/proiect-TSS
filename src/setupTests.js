import "@testing-library/jest-dom";

beforeAll(() => {
  if (typeof HTMLDialogElement !== "undefined") {
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute("open", "");
    };

    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute("open");
    };
  }
});

beforeEach(() => {
  const existingModal = document.getElementById("modal");

  if (!existingModal) {
    const modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "modal");
    document.body.appendChild(modalRoot);
  }

});

afterEach(() => {
  document.getElementById("modal")?.remove();
});