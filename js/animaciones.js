// ======= MENÚ HAMBURGUESA =======
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links a");

if (hamburger && navLinks) {
  // Abrir/cerrar menú al hacer clic en hamburguesa
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // Cerrar menú al hacer clic en un enlace (móvil)
  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
      }
    });
  });
}
