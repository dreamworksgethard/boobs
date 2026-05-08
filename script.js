function $(sel) {
  return document.querySelector(sel);
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}

function getCA() {
  const saved = localStorage.getItem("boobs_ca");
  return saved && saved.trim()
    ? saved.trim()
    : "J9JShWnSRBeFvJyBgpLwTVYDwoGNrEZCG3Lsjw4yh26G";
}

/** Wrapped SOL mint: Raydium swap input for SOL → token */
const SOL_MINT = "So11111111111111111111111111111111111111112";

function raydiumSwapUrl(ca) {
  if (!ca || ca === "TBA") return "";
  const q = new URLSearchParams({
    inputMint: SOL_MINT,
    outputMint: ca.trim(),
  });
  return `https://raydium.io/swap/?${q.toString()}`;
}

function setRaydiumBuyLink() {
  const links = document.querySelectorAll(".raydium-buy-link");
  if (!links.length) return;
  const url = raydiumSwapUrl(getCA());
  for (const a of links) {
    if (url) {
      a.setAttribute("href", url);
      a.removeAttribute("aria-disabled");
    } else {
      a.setAttribute("href", "#tokenomics");
      a.setAttribute("aria-disabled", "true");
    }
  }
}

function copyToClipboard(text) {
  if (!text || text === "TBA") return false;
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch(() => false);
  }

  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

function wireCopyButtons() {
  const ca = getCA();
  setText("#ca-box-2", ca);
  setRaydiumBuyLink();

  const statuses = ["#copy-status-3"]
    .map((s) => $(s))
    .filter(Boolean);
  const notify = (msg) => {
    if (!statuses.length) return;
    for (const el of statuses) el.textContent = msg;
    window.clearTimeout(notify._t);
    notify._t = window.setTimeout(() => {
      for (const el of statuses) el.textContent = "";
    }, 2000);
  };

  const handler = async () => {
    const result = await copyToClipboard(ca);
    notify(result ? "Copied." : "Set the CA first (currently TBA).");
  };

  $("#copy-ca-4")?.addEventListener("click", handler);
}

function spawnSparkles(hostSel = "#sparkles") {
  const host = document.querySelector(hostSel);
  if (!host) return;

  const count = hostSel === "#sparkles-tits" ? 18 : 28;
  for (let i = 0; i < count; i += 1) {
    const s = document.createElement("div");
    s.className = "sparkle";
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    s.style.animationDelay = `${Math.random() * 1.8}s`;
    s.style.animationDuration = `${1.8 + Math.random() * 1.8}s`;
    s.style.opacity = "0";
    s.style.transform = `rotate(45deg) scale(${0.8 + Math.random() * 0.6})`;
    host.appendChild(s);
  }
}

function setYear() {
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
}

function markActiveNav() {
  const page = document.body?.dataset?.page;
  if (!page) return;
  const el = document.querySelector(`.nav a[data-nav="${page}"]`);
  if (el) el.classList.add("is-active");
}

function animateStepsOnView() {
  const items = Array.from(document.querySelectorAll(".steps--big > li"));
  if (!items.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (const li of items) li.classList.add("is-visible");
    return;
  }

  if (!("IntersectionObserver" in window)) {
    for (const li of items) li.classList.add("is-visible");
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = /** @type {HTMLElement} */ (e.target);
        if (e.isIntersecting) {
          const h = window.innerHeight || 0;
          const mid =
            (e.boundingClientRect.top + e.boundingClientRect.bottom) / 2;
          if (h > 0 && mid > h * 0.52) {
            el.dataset.revealFrom = "below";
          } else {
            el.dataset.revealFrom = "above";
          }
          el.classList.add("is-visible");
        } else {
          el.classList.remove("is-visible");
          delete el.dataset.revealFrom;
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  items.forEach((li, i) => {
    li.style.transitionDelay = `${i * 90}ms`;
    io.observe(li);
  });
}

function initScrollReveal() {
  const nodes = document.querySelectorAll("[data-reveal]");
  if (!nodes.length) return;

  const revealAll = () => {
    for (const el of nodes) el.classList.add("is-visible");
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealAll();
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealAll();
    return;
  }

  const roots = document.querySelectorAll("header.topbar, main > section, main > footer");
  for (const root of roots) {
    const inRoot = root.querySelectorAll("[data-reveal]");
    inRoot.forEach((el, i) => {
      el.style.setProperty("--reveal-order", String(i));
    });
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = /** @type {HTMLElement} */ (e.target);
        if (e.isIntersecting) {
          const h = window.innerHeight || 0;
          const mid =
            (e.boundingClientRect.top + e.boundingClientRect.bottom) / 2;
          if (h > 0 && mid > h * 0.52) {
            el.dataset.revealFrom = "below";
          } else {
            el.dataset.revealFrom = "above";
          }
          el.classList.add("is-visible");
        } else {
          el.classList.remove("is-visible");
          delete el.dataset.revealFrom;
        }
      }
    },
    { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
  );

  for (const el of nodes) io.observe(el);
}

const AGE_VERIFIED_KEY = "boobs_age_verified";

function initAgeGate() {
  const gate = document.getElementById("age-gate");
  if (!gate) return;

  const enter = document.getElementById("age-enter");
  const exit = document.getElementById("age-exit");

  const dismiss = () => {
    gate.setAttribute("hidden", "");
    document.body.classList.remove("age-gate-open");
  };

  const show = () => {
    gate.removeAttribute("hidden");
    document.body.classList.add("age-gate-open");
    window.setTimeout(() => enter?.focus(), 0);
  };

  if (localStorage.getItem(AGE_VERIFIED_KEY) === "1") {
    dismiss();
    return;
  }

  show();

  enter?.addEventListener("click", () => {
    localStorage.setItem(AGE_VERIFIED_KEY, "1");
    dismiss();
  });

  exit?.addEventListener("click", () => {
    window.location.href = "https://www.google.com/";
  });
}

function initTitsLightbox() {
  const root = document.getElementById("tits-lightbox");
  const img = document.getElementById("tits-lightbox-img");
  const backdrop = root?.querySelector(".tits-lightbox__backdrop");
  const closeBtn = root?.querySelector(".tits-lightbox__close");
  if (!root || !img || !backdrop || !closeBtn) return;

  /** @type {HTMLElement | null} */
  let lastFocus = null;
  /** @type {number} */
  let closeTimer = 0;

  const close = () => {
    window.clearTimeout(closeTimer);
    root.classList.remove("is-open");
    document.body.classList.remove("tits-lightbox-open");
    closeTimer = window.setTimeout(() => {
      if (root.classList.contains("is-open")) return;
      root.setAttribute("hidden", "");
      img.removeAttribute("src");
      lastFocus?.focus();
      lastFocus = null;
    }, 720);
  };

  const open = (src) => {
    window.clearTimeout(closeTimer);
    lastFocus = /** @type {HTMLElement} */ (document.activeElement);
    img.src = src;
    root.removeAttribute("hidden");
    document.body.classList.add("tits-lightbox-open");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        root.classList.add("is-open");
        closeBtn.focus();
      });
    });
  };

  document.querySelector(".tits-grid")?.addEventListener("click", (e) => {
    const btn = e.target instanceof Element ? e.target.closest(".tits-card") : null;
    if (!btn || !(btn instanceof HTMLButtonElement)) return;
    const src = btn.dataset.full?.trim();
    if (src) open(src);
  });

  backdrop.addEventListener("click", close);
  closeBtn.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (root.hasAttribute("hidden")) return;
    close();
  });
}

wireCopyButtons();
initAgeGate();
spawnSparkles("#sparkles");
spawnSparkles("#sparkles-tits");
initTitsLightbox();
setYear();
markActiveNav();
initScrollReveal();
animateStepsOnView();

