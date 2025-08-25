const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector("nav ul");
const navLinks = document.querySelectorAll("nav a");

function toggleMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("show");
}

function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("show");
}

if (hamburger && navMenu) {
  hamburger.addEventListener("click", toggleMenu);
}

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    hamburger.classList.remove("active");
    navMenu.classList.remove("show");
  }
});
