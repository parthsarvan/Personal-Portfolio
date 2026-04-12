const resumeButton = document.querySelector("#download-resume");

if (resumeButton) {
  resumeButton.addEventListener("click", () => {
    window.print();
  });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealTargets = document.querySelectorAll(
  ".section, .card, .hero-content, .hero-photo, .contact-grid > div"
);

revealTargets.forEach((element) => element.classList.add("reveal"));

const staggerGroups = document.querySelectorAll(".section, .stack, .grid, .contact-grid");
staggerGroups.forEach((group) => {
  const items = group.querySelectorAll("article, li, p");
  items.forEach((item, index) => {
    item.classList.add("stagger");
    item.style.setProperty("--delay", `${Math.min(index * 60, 360)}ms`);
  });
});

if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
}

const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const quickNav = document.querySelector(".quick-nav");
const quickNavLabel = document.querySelector(".quick-nav-label");
const contactFloat = document.querySelector(".contact-float");

if (sections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove("active"));
          const active = navLinks.find(
            (link) => link.getAttribute("href") === `#${entry.target.id}`
          );
          if (active) active.classList.add("active");
          if (quickNav && quickNavLabel) {
            quickNavLabel.textContent = active ? active.textContent : "Section";
            quickNav.classList.add("is-visible");
          }
        }
      });
    },
    { threshold: 0.6 }
  );

  sections.forEach((section) => navObserver.observe(section));
}

const heroPhoto = document.querySelector(".hero-photo");

const updateEffects = () => {
  const scrollY = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight || 1;
  const progress = Math.min(Math.max(scrollY / docHeight, 0), 1);
  document.documentElement.style.setProperty("--spot-x", `${20 + progress * 60}%`);
  document.documentElement.style.setProperty("--spot-y", `${15 + progress * 70}%`);
  document.documentElement.style.setProperty("--spot-2x", `${80 - progress * 50}%`);
  document.documentElement.style.setProperty("--spot-2y", `${60 - progress * 40}%`);

  if (heroPhoto && !prefersReducedMotion) {
    heroPhoto.style.setProperty("--hero-parallax", `${scrollY * 0.08}px`);
  }

  if (contactFloat) {
    if (scrollY > 240) {
      contactFloat.classList.add("is-visible");
    } else {
      contactFloat.classList.remove("is-visible");
    }
  }
};

updateEffects();
window.addEventListener("scroll", updateEffects, { passive: true });
