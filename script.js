
// Feature Tabs
document.querySelectorAll('.feature-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.feature-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.feature-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.panel).classList.add('active');
    });
});

// Scroll Animations
const animEls = document.querySelectorAll('.anim');
const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 70);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });
animEls.forEach(el => observer.observe(el));

// Float CTA visibility
const floatCta = document.getElementById('floatCta');
const formEl = document.getElementById('cform');
new IntersectionObserver(([e]) => {
    floatCta.classList.toggle('show', !e.isIntersecting);
}, { threshold: 0.1 }).observe(formEl);

// Nav shadow on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
});


// Form submit handler

const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const blockedDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "rediffmail.com"
];

function validateEmail() {
    const email = emailInput.value.trim();
    emailError.textContent = "";
    emailInput.classList.remove("input-error");

    if (email === "") {
        return false;
    }

    if (!emailRegex.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        emailInput.classList.add("input-error");
        return false;
    }

    const domain = email.split("@")[1];

    if (blockedDomains.includes(domain?.toLowerCase())) {
        emailError.textContent = "Please enter your work email.";
        emailInput.classList.add("input-error");
        return false;
    }

    return true;
}

emailInput.addEventListener("blur", function () {
    if (emailInput.value.trim() !== "") {
        validateEmail();
    }
});


// 🔹 Validate when leaving field
emailInput.addEventListener("blur", validateEmail);



function handleSubmit(e) {
    if (!validateEmail()) {
        e.preventDefault();
    }
    const form = document.getElementById("leadForm");


    // Get UTM parameters
    function getUTMs() {
        const params = new URLSearchParams(window.location.search);
        return {
            utm_source: params.get("utm_source") || "",
            utm_medium: params.get("utm_medium") || "",
            utm_campaign: params.get("utm_campaign") || "",
            utm_term: params.get("utm_term") || "",
            utm_content: params.get("utm_content") || ""
        };
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const btn = form.querySelector(".form-btn");
        const originalText = btn.textContent;

        btn.textContent = "Submitting...";
        btn.disabled = true;

        const formData = new FormData(form);
        const utms = getUTMs();

        const portalId = "YOUR_PORTAL_ID";
        const formId = "YOUR_FORM_ID";

        const data = {
            fields: [
                { name: "email", value: formData.get("email") },
                { name: "firstname", value: formData.get("fullname") },
                { name: "company", value: formData.get("company") },
                { name: "phone", value: formData.get("phone") },
                { name: "shipping_volume", value: formData.get("shipping_volume") },
                { name: "requirements", value: formData.get("requirements") },
                { name: "utm_source", value: utms.utm_source },
                { name: "utm_medium", value: utms.utm_medium },
                { name: "utm_campaign", value: utms.utm_campaign },
                { name: "utm_term", value: utms.utm_term },
                { name: "utm_content", value: utms.utm_content }
            ],
            context: {
                pageUri: window.location.href,
                pageName: document.title
            }
        };

        try {
            const response = await fetch(
                `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            if (response.ok) {
                // Success UI
                btn.textContent = "✓ Request Submitted!";
                btn.style.background = "#22c55e";
                btn.style.boxShadow = "0 4px 16px rgba(34,197,94,0.35)";

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = "";
                    btn.style.boxShadow = "";
                    btn.disabled = false;
                    form.reset();
                }, 3000);
            } else {
                throw new Error("HubSpot submission failed");
            }

        } catch (error) {
            console.error("Submission Error:", error);
            btn.textContent = "Try Again";
            btn.disabled = false;
        }
    });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".stat-num");

    const animateCounter = (el) => {
        const text = el.innerText.trim();

        // Extract number (remove commas and + or %)
        const numericValue = parseFloat(text.replace(/[^0-9.]/g, ""));
        const suffix = text.replace(/[0-9.,]/g, ""); // keeps + or %

        let start = 0;
        const duration = 1500; // animation duration in ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentValue = Math.floor(progress * numericValue);
            el.innerText = currentValue.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.innerText = numericValue.toLocaleString() + suffix;
            }
        }

        requestAnimationFrame(updateCounter);
    };

    // Optional: Trigger when visible (recommended)
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter);
    });
});


