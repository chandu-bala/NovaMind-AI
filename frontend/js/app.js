document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "";

  // ---------- SESSION HELPER ----------
  function getSessionUserId() {
    const session = JSON.parse(localStorage.getItem("novamind-session"));
    return session ? session.id : null;
  }

  // ---------- SCREEN HANDLER ----------
  const landingPage = document.getElementById("landing-page");
  const loginPage = document.getElementById("login-page");
  const signupPage = document.getElementById("signup-page");
  const dashboardPage = document.getElementById("dashboard-page");

  function showScreen(screen) {
    landingPage.classList.add("d-none");
    loginPage.classList.add("d-none");
    signupPage.classList.add("d-none");
    dashboardPage.classList.add("d-none");

    screen.classList.remove("d-none");
  }

  // Default view
  showScreen(landingPage);

  // Navigation buttons
  const openLoginBtn = document.getElementById("open-login-btn");
  const openSignupBtn = document.getElementById("open-signup-btn");

  if (openLoginBtn) {
    openLoginBtn.onclick = () => showScreen(loginPage);
  }
  if (openSignupBtn) {
    openSignupBtn.onclick = () => showScreen(signupPage);
  }

  // ---------- SESSION RESTORE ----------
  const session = JSON.parse(localStorage.getItem("novamind-session"));
  if (session) {
    showScreen(dashboardPage);
  }

  // ---------- SIGNUP ----------
  document
    .getElementById("signup-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("signup-name").value;
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Account created! Now login.");
        showScreen(loginPage);
      } else {
        alert(data.error);
      }
    });

  // ---------- LOGIN ----------
  document
    .getElementById("login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // store full user with id
        localStorage.setItem("novamind-session", JSON.stringify(data.user));
        showScreen(dashboardPage);
      } else {
        alert(data.error);
      }
    });

  // ---------- API HELPER ----------
  async function postJSON(path, data) {
    const res = await fetch(API_BASE_URL + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  // ---------- IDEA FORM ----------
  document
    .getElementById("idea-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const idea = document.getElementById("idea-input").value;
      const industry = document.getElementById("idea-industry").value;

      const loading = document.getElementById("idea-loading");
      const result = document.getElementById("idea-result");

      loading.classList.remove("d-none");
      result.textContent = "";

      try {
        const data = await postJSON("/api/ideas/refine", {
          idea,
          industry,
          userId: getSessionUserId(),
        });

        if (data.analysis) {
          result.innerHTML = marked.parse(data.analysis);
        } else {
          result.textContent = JSON.stringify(data, null, 2);
        }
      } catch (err) {
        result.textContent = "Error: " + err.message;
      } finally {
        loading.classList.add("d-none");
      }
    });

  // ---------- DASHBOARD ----------
  async function loadDashboard() {
    try {
      const userId = getSessionUserId();
      const res = await fetch(
        `/api/dashboard/stats?userId=${encodeURIComponent(userId || "")}`
      );
      const data = await res.json();

      document.getElementById("stat-ideas").textContent =
        data.stats?.ideas ?? 0;
      document.getElementById("stat-learning").textContent =
        data.stats?.learningPaths ?? 0;
      document.getElementById("stat-career").textContent =
        data.stats?.careerPlans ?? 0;
      document.getElementById("stat-interactions").textContent =
        data.stats?.totalInteractions ?? 0;
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  }

  const dashboardTab = document.getElementById("dashboard-tab");
  const refreshDashboard = document.getElementById("refresh-dashboard");

  if (dashboardTab) {
    dashboardTab.onclick = loadDashboard;
  }
  if (refreshDashboard) {
    refreshDashboard.onclick = loadDashboard;
  }

  // USER UI ELEMENTS (optional – only if you added them in navbar)
  const userSection = document.getElementById("user-section");
  const userDisplay = document.getElementById("user-display");
  const logoutBtn = document.getElementById("logout-btn");

  if (session && userSection && userDisplay) {
    userSection.classList.remove("d-none");
    // userDisplay.innerText = "Welcome " + (session.name || session.email);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("novamind-session");
      if (userSection) userSection.classList.add("d-none");
      showScreen(landingPage);
    });
  }
});

/* ---------- POPUP HISTORY (GLOBAL) ---------- */
window.showHistory = async function (type) {
  let url = "";
  let title = "";

  const session = JSON.parse(localStorage.getItem("novamind-session"));
  const userId = session ? session.id : null;

  if (!userId) {
    alert("Please login to view details.");
    return;
  }

  if (type === "ideas") {
    url = `/api/dashboard/ideas?userId=${encodeURIComponent(userId)}`;
    title = "Ideas Submitted";
  }
  if (type === "learning") {
    url = `/api/dashboard/learning?userId=${encodeURIComponent(userId)}`;
    title = "Learning Roadmaps";
  }
  if (type === "career") {
    url = `/api/dashboard/careers?userId=${encodeURIComponent(userId)}`;
    title = "Career Plans";
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    let html = "";

    if (type === "ideas" && data.ideas) {
      data.ideas.forEach((item) => {
        html += `
          <div class="border rounded p-2 mb-2">
            <strong>Idea:</strong> ${item.idea}<br>
            <small class="text-muted">${item.industry || ""}</small>
          </div>`;
      });
    }

    if (type === "learning" && data.paths) {
      data.paths.forEach((item) => {
        html += `
          <div class="border rounded p-2 mb-2">
            <strong>Goal:</strong> ${item.goal}<br>
            <small>Level: ${item.level}</small>
          </div>`;
      });
    }

    if (type === "career" && data.careers) {
      data.careers.forEach((item) => {
        html += `
          <div class="border rounded p-2 mb-2">
            <strong>Target Role:</strong> ${item.targetRole}<br>
            <small>${item.skills}</small>
          </div>`;
      });
    }

    document.getElementById("dashboardModalTitle").innerText = title;
    document.getElementById("dashboardModalBody").innerHTML =
      html || "<p class='text-muted'>No data found</p>";

    const modal = new bootstrap.Modal(
      document.getElementById("dashboardModal")
    );
    modal.show();
  } catch (err) {
    console.error("Popup error:", err);
  }
};
