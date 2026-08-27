const $ = (selector) => document.querySelector(selector);

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const setText = (selector, value) => {
  const element = $(selector);
  if (element && value !== undefined) element.textContent = value;
};

const setLink = (selector, link) => {
  const element = $(selector);
  if (!element || !link) return;
  element.textContent = link.label;
  element.href = link.href;
};

async function loadData() {
  const response = await fetch("content.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`Unable to load portfolio content (${response.status})`);
  return response.json();
}

function renderProfile(data) {
  document.title = `${data.profile.name} — ${data.profile.title}`;
  const meta = $("#page-description");
  if (meta) meta.content = data.profile.metaDescription;
  setText("#brand-initials", data.profile.initials);
  setText("#brand-name", data.profile.name);
  setText("#footer-name", data.profile.name);
}

function renderHero(data) {
  setText("#hero-eyebrow", data.hero.eyebrow);
  setText("#hero-title", data.hero.title);
  setText("#hero-subtitle", data.hero.subtitle);
  setLink("#primary-cta", data.hero.primaryCta);
  setLink("#secondary-cta", data.hero.secondaryCta);

  $("#stats").innerHTML = data.stats.map((stat) => `
    <div class="stat">
      <strong>${escapeHtml(stat.value)}</strong>
      <span>${escapeHtml(stat.label)}</span>
    </div>
  `).join("");

  $("#service-map").innerHTML = data.serviceMap.map((service, index) => `
    <div class="service-pill"><span>0${index + 1}</span>${escapeHtml(service)}</div>
  `).join("");
}

function renderInfrastructure(data) {
  const section = data.infrastructure;
  setText("#infrastructure-intro", section.intro);
  setText("#plain-language-copy", section.plainLanguage);
  setText("#comparison-note", section.note);
  $("#comparison-grid").innerHTML = section.options.map((option) => `
    <article class="comparison-card${option.featured ? " featured" : ""}">
      <p class="comparison-label">${escapeHtml(option.label)}</p>
      <h3>${escapeHtml(option.title)}</h3>
      <ul>${option.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </article>
  `).join("");
}

function tagList(tags = []) {
  return `<ul class="tag-list">${tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>`;
}

function mediaButton(src, alt, className = "") {
  return `
    <button class="media-button ${className}" type="button" data-preview="${escapeHtml(src)}" data-alt="${escapeHtml(alt)}" aria-label="Open ${escapeHtml(alt)} preview">
      <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" />
      <span>Open system view ↗</span>
    </button>
  `;
}

function renderWork(data) {
  const featured = data.featuredCase;
  $("#featured-case").innerHTML = `
    <div class="featured-copy">
      <p class="case-client">Featured system / ${escapeHtml(featured.client)}</p>
      <h3>${escapeHtml(featured.title)}</h3>
      <p>${escapeHtml(featured.summary)}</p>
      <div class="outcome-grid">${featured.outcomes.map((outcome) => `<span>${escapeHtml(outcome)}</span>`).join("")}</div>
      ${tagList(featured.stack)}
    </div>
    <div class="featured-media">${mediaButton(featured.image, featured.title, "featured-media-button")}</div>
  `;

  $("#project-grid").innerHTML = data.projects.map((project) => `
    <article class="project-card">
      <div class="project-meta"><span>${escapeHtml(project.number)}</span>${tagList(project.tags)}</div>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.description)}</p>
      ${mediaButton(project.image, project.title)}
    </article>
  `).join("");
}

function renderServices(data) {
  setText("#services-intro", data.servicesIntro);
  $("#services-grid").innerHTML = data.services.map((service) => `
    <article class="service-row">
      <span class="service-number">${escapeHtml(service.number)}</span>
      <h3>${escapeHtml(service.title)}</h3>
      <p>${escapeHtml(service.description)}</p>
      <small>${escapeHtml(service.deliverables)}</small>
    </article>
  `).join("");
}

function renderAbout(data) {
  setText("#about-title", data.about.title);
  setText("#about-body", data.about.body);
  $("#specialties").innerHTML = data.about.specialties.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  $("#process-list").innerHTML = data.process.map((step, index) => `
    <li><span>0${index + 1}</span><div><strong>${escapeHtml(step.title)}</strong><p>${escapeHtml(step.description)}</p></div></li>
  `).join("");
}

function renderProof(data) {
  const proof = data.proof;
  setText("#proof-intro", proof.intro);
  $("#proof-showcase").innerHTML = `
    <div class="proof-copy"><p>System overview</p><h3>${escapeHtml(proof.showcase.title)}</h3><span>${escapeHtml(proof.showcase.description)}</span></div>
    ${mediaButton(proof.showcase.src, proof.showcase.alt, "showcase-button")}
  `;
  $("#proof-grid").innerHTML = proof.items.map((item) => {
    const media = item.type === "embed"
      ? `<div class="embed-frame"><iframe src="${escapeHtml(item.src)}" title="${escapeHtml(item.title)}" loading="lazy" allowfullscreen></iframe></div>`
      : mediaButton(item.src, item.title);
    return `<article class="proof-item">${media}<div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></div></article>`;
  }).join("");
}

function renderStandards(data) {
  $("#standards-grid").innerHTML = data.standards.map((item) => `
    <article class="standard-card">
      <span>${escapeHtml(item.number)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
      <small>${escapeHtml(item.evidence)}</small>
    </article>
  `).join("");
}

function renderContact(data) {
  setText("#contact-title", data.contact.title);
  setText("#contact-body", data.contact.body);
  $("#contact-links").innerHTML = `
    <a class="contact-primary" href="${escapeHtml(data.contact.email)}">Email me <span>↗</span></a>
    <a href="${escapeHtml(data.contact.whatsapp)}" target="_blank" rel="noreferrer">WhatsApp <span>↗</span></a>
    <a href="${escapeHtml(data.contact.facebook)}" target="_blank" rel="noreferrer">Facebook <span>↗</span></a>
  `;
}

function initNavigation() {
  const toggle = $("#nav-toggle");
  const nav = $("#nav-links");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  });
  nav.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Menu";
  });
}

function initProjectSheet(data) {
  const body = document.body;
  const sheet = $("[data-project-sheet]");
  const scrim = $("[data-project-scrim]");
  const launcher = $(".project-launcher");
  const toggles = [...document.querySelectorAll("[data-project-toggle]")];
  const closeButton = $("[data-project-close]");
  const form = $("[data-project-form]");
  let previousFocus = null;
  let focusTimer;

  const setOpen = (open) => {
    window.clearTimeout(focusTimer);
    body.classList.toggle("is-project-open", open);
    sheet.setAttribute("aria-hidden", String(!open));
    launcher.setAttribute("aria-expanded", String(open));
    launcher.setAttribute("aria-label", open ? "Close project contact panel" : "Open project contact panel");
    $("#nav-links").classList.remove("open");
    $("#nav-toggle").setAttribute("aria-expanded", "false");
    $("#nav-toggle").textContent = "Menu";

    if (open) {
      previousFocus = document.activeElement;
      focusTimer = window.setTimeout(() => form.elements.name.focus(), 580);
    } else {
      focusTimer = window.setTimeout(() => previousFocus?.focus(), 280);
    }
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      const shouldClose = toggle === launcher && body.classList.contains("is-project-open");
      setOpen(!shouldClose);
    });
  });
  closeButton.addEventListener("click", () => setOpen(false));
  scrim.addEventListener("click", () => setOpen(false));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const brief = String(formData.get("brief") || "").trim();
    const tools = formData.getAll("tools").map(String);
    const recipient = data.contact.email.replace(/^mailto:/, "");
    const subject = `Project inquiry from ${name}`;
    const message = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Tools involved: ${tools.length ? tools.join(", ") : "Not specified"}`,
      "",
      "What needs to work:",
      brief
    ].join("\n");
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("is-project-open")) {
      setOpen(false);
      return;
    }
    if (event.key !== "Tab" || !body.classList.contains("is-project-open")) return;
    const focusable = [
      launcher,
      ...sheet.querySelectorAll("button, input, textarea, a[href]")
    ].filter((element) => !element.disabled && element.offsetParent !== null);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function initLightbox() {
  const lightbox = $("#lightbox");
  const content = $("#lightbox-content");
  const close = $("#lightbox-close");
  let previousFocus = null;

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    content.innerHTML = "";
    previousFocus?.focus();
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-preview]");
    if (!trigger) return;
    previousFocus = trigger;
    content.innerHTML = `<img src="${escapeHtml(trigger.dataset.preview)}" alt="${escapeHtml(trigger.dataset.alt)}" />`;
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    close.focus();
  });
  close.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !lightbox.hidden) closeLightbox(); });
}

function render(data) {
  renderProfile(data);
  renderHero(data);
  renderInfrastructure(data);
  renderWork(data);
  renderServices(data);
  renderAbout(data);
  renderProof(data);
  renderStandards(data);
  renderContact(data);
  initNavigation();
  initProjectSheet(data);
  initLightbox();
}

loadData().then(render).catch((error) => {
  console.error(error);
  document.body.classList.add("content-error");
  setText("#hero-subtitle", "The portfolio content could not be loaded. Please serve this folder through a local or web server and refresh the page.");
});
