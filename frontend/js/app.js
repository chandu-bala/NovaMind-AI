document.addEventListener("DOMContentLoaded", () => {

const API_BASE_URL = "";

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
document.getElementById("open-login-btn").onclick = () => showScreen(loginPage);
document.getElementById("open-signup-btn").onclick = () => showScreen(signupPage);

// ---------- SESSION RESTORE ----------
const session = JSON.parse(localStorage.getItem("novamind-session"));
if (session) showScreen(dashboardPage);

// ---------- SIGNUP ----------
document.getElementById("signup-form").addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
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
document.getElementById("login-form").addEventListener("submit", async e => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.success) {
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
    body: JSON.stringify(data)
  });
  return res.json();
}

// ---------- IDEA FORM FIX ----------
document.getElementById("idea-form").addEventListener("submit", async e => {
  e.preventDefault();

  const idea = document.getElementById("idea-input").value;
  const industry = document.getElementById("idea-industry").value;

  const loading = document.getElementById("idea-loading");
  const result = document.getElementById("idea-result");

  loading.classList.remove("d-none");

  const data = await postJSON("/api/ideas/refine", { idea, industry });
  result.innerHTML = marked.parse(data.analysis);

  loading.classList.add("d-none");
});

// ---------- DASHBOARD ----------
async function loadDashboard() {
  const res = await fetch("/api/dashboard/stats");
  const data = await res.json();

  document.getElementById("stat-ideas").textContent = data.stats.ideas;
  document.getElementById("stat-learning").textContent = data.stats.learningPaths;
  document.getElementById("stat-career").textContent = data.stats.careerPlans;
  document.getElementById("stat-interactions").textContent = data.stats.totalInteractions;
}

document.getElementById("dashboard-tab").onclick = loadDashboard;
document.getElementById("refresh-dashboard").onclick = loadDashboard;

});


/* ✅ THIS MUST BE OUTSIDE DOMContentLoaded */
window.showHistory = async function(type) {
  let url = "";
  let title = "";

  if (type === "ideas") {
    url = "/api/dashboard/ideas";
    title = "Ideas Submitted";
  }
  if (type === "learning") {
    url = "/api/dashboard/learning";
    title = "Learning Roadmaps";
  }
  if (type === "career") {
    url = "/api/dashboard/careers";
    title = "Career Plans";
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    let html = "";

    if (type === "ideas") {
      data.ideas.forEach(item => {
        html += `
        <div class="border rounded p-2 mb-2">
          <strong>Idea:</strong> ${item.idea}<br>
          <small>${item.industry || ""}</small>
        </div>`;
      });
    }

    if (type === "learning") {
      data.paths.forEach(item => {
        html += `
        <div class="border rounded p-2 mb-2">
          <strong>Goal:</strong> ${item.goal}<br>
          <small>Level: ${item.level}</small>
        </div>`;
      });
    }

    if (type === "career") {
      data.careers.forEach(item => {
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