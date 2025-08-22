// ======= MENÚ HAMBURGUESA =======
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links a");

if (hamburger && navLinks) {
  // Abrir/cerrar menú al hacer clic en hamburguesa
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    hamburger.classList.toggle("active");
  });

  // Cerrar menú al hacer clic en un enlace (móvil)
  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("show")) {
        navLinks.classList.remove("show");
        hamburger.classList.remove("active");
      }
    });
  });
}
