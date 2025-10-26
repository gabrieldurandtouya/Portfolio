
document.addEventListener('DOMContentLoaded', () => {
  const switcher = document.getElementById('theme-switch');

  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) { saved = null; }
  const isSavedDark = saved === 'dark' || saved === 'true' || saved === '1';

  if (isSavedDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  if (switcher) switcher.checked = isSavedDark;

  if (switcher) {
    switcher.addEventListener('change', () => {
      const newTheme = switcher.checked ? 'dark' : 'light';
      if (newTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
      else document.documentElement.removeAttribute('data-theme');
      try { localStorage.setItem('theme', newTheme); } catch (e) {}
    });
  }

  const resetBtn = document.getElementById('reset-theme');
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      try { localStorage.removeItem('theme'); } catch (err) {}
      document.documentElement.removeAttribute('data-theme');
      if (switcher) switcher.checked = false;
      location.reload();
    });
  }
});


function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters || counters.length === 0) return;

  const observerOptions = { threshold: 0.7 };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.getAttribute('data-target');
        const target = parseInt(raw, 10) || 0;
        const duration = 2000;
        const stepTime = 16; // approx 60fps
        const increment = Math.max(1, Math.floor(target / (duration / stepTime)));
        let current = 0;

        const update = () => {
          current += increment;
          if (current < target) {
            el.textContent = Math.floor(current);
            requestAnimationFrame(update);
          } else {
            el.textContent = target;
          }
        };

        update();
        obs.unobserve(el);
      }
    });
  }, observerOptions);

  counters.forEach(c => observer.observe(c));
}

function initScrollToTop() {
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (!scrollToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) scrollToTopBtn.classList.add('visible');
    else scrollToTopBtn.classList.remove('visible');
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  animateCounters();
  initScrollToTop();
});



document.addEventListener("DOMContentLoaded", () => {
  if (typeof emailjs === "undefined") {
    console.error("❌ Le SDK EmailJS n'est pas chargé. Vérifie le script CDN dans ton HTML.");
    return;
  }

  emailjs.init("Y3AsrL_V0Gt9d6ea4"); // ← ta clé publique

  const form = document.getElementById("contact-form");
  const status = document.getElementById("status");
  const popup = document.getElementById("popup-notif");

  if (!form) {
    console.error("❌ Formulaire introuvable (#contact-form)");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const params = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      message: document.getElementById("message").value.trim(),
    };

    if (!params.name || !params.email || !params.message) {
      showStatus("❌ Merci de remplir tous les champs.", "red");
      return;
    }

    const button = form.querySelector("button");
    button.disabled = true;

    status.innerHTML = '⏳ Envoi en cours... <span class="spinner"></span>';
    status.style.color = "var(--text-color)";
    status.style.fontStyle = "italic";

    try {
      await emailjs.send("service_jkcckqn", "template_vdfrj97", params);

      showStatus("✅ Message envoyé avec succès !", "var(--accent-color)");
      form.reset();
      showPopup("✅ Message envoyé avec succès !");
    } catch (error) {
      console.error("Erreur EmailJS :", error);
      showStatus("❌ Une erreur est survenue. Réessayez plus tard.", "red");
      showPopup("❌ Une erreur est survenue !");
    } finally {
      button.disabled = false;
      status.style.fontStyle = "normal";
    }
  });

  function showStatus(text, color) {
    status.textContent = text;
    status.style.color = color || "inherit";
  }

  function showPopup(message) {
    if (!popup) return;
    popup.textContent = message;
    popup.classList.add("visible");
    setTimeout(() => popup.classList.remove("visible"), 3000);
  }
});
