const sections = document.querySelectorAll("section[id]");
// const themeToggler = document.querySelector(".toggle-theme");

function toggleActive(currentSection) {
  const scrollY = window.pageYOffset;
  const sectionTop = currentSection.offsetTop - 50;
  const sectionId = currentSection.getAttribute("id");
  const sectionHeight = currentSection.height;
  const isActive =
    scrollY > sectionTop && scrollY <= sectionTop + sectionHeight;
  const navLink = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);
  navLink?.classList?.toggle("active-link", isActive);
}

function scrollActive(event) {
  sections.forEach((section) => {
    toggleActive(section);
  });
}

function scrollHeader(event) {
  const header = document.getElementById("header");
  if (!header) return false;
  header.classList.toggle("scroll-header", window.scrollY >= 80);
}

// function toggleTheme(event) {
//   console.log(event.target.checked);
//   document
//     .querySelector("body")
//     .classList.toggle("dark-theme", event.target.checked);
// }

function updateProgressBar(event) {
  const progressBar = document.querySelector(".progress__bar");
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  if (progressBar) progressBar.style.width = scrolled + "%";
}

window.addEventListener("scroll", scrollActive);
window.addEventListener("scroll", scrollHeader);
window.addEventListener("scroll", updateProgressBar);
// themeToggler.addEventListener("change", toggleTheme);
