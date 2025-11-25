document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "";
const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("novamind-session");
      alert("You have been logged out successfully.");
      location.reload(); // returns to landing page
    });
  }
  /* =============================
     SESSION HELPERS
  ============================= */
  function getSessionUser() {
    return JSON.parse(localStorage.getItem("novamind-session"));
  }

  function getSessionUserId() {
    const session = getSessionUser();
    return session ? session.id : null;
  }

  /* =============================
     SCREEN HANDLER
  ============================= */
  const landingPage = document.getElementById("landing-page");
  const loginPage = document.getElementById("login-page");
  const signupPage = document.getElementById("signup-page");
  const dashboardPage = document.getElementById("dashboard-page");

  function showScreen(screen) {
    [landingPage, loginPage, signupPage, dashboardPage].forEach(p => p.classList.add("d-none"));
    screen.classList.remove("d-none");
  }

  showScreen(landingPage);

  document.getElementById("open-login-btn")?.addEventListener("click", () => showScreen(loginPage));
  document.getElementById("open-signup-btn")?.addEventListener("click", () => showScreen(signupPage));

  const session = getSessionUser();
  if (session) showScreen(dashboardPage);
  // ✅ Show logged-in user's name on dashboard
if (session && session.name) {
  const nameEl = document.getElementById("dashboard-username");
  if (nameEl) {
    nameEl.textContent = session.name;
  }
}


  /* =============================
     SIGNUP
  ============================= */
  document.getElementById("signup-form")?.addEventListener("submit", async e => {
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
      alert("✅ Account created! Please login.");
      showScreen(loginPage);
    } else alert(data.error);
  });

  /* =============================
     LOGIN
  ============================= */
  document.getElementById("login-form")?.addEventListener("submit", async e => {
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
      
      // loadDashboard();
    } else alert(data.error);
  });

  /* =============================
     IDEA REFINER
  ============================= */
  document.getElementById("idea-form")?.addEventListener("submit", async e => {
    e.preventDefault();

    const idea = document.getElementById("idea-input").value;
    const industry = document.getElementById("idea-industry").value;
    const userId = getSessionUserId();

    const res = await fetch("/api/ideas/refine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea, industry, userId })
    });

    const data = await res.json();
    if (!data.success) return alert(data.error);

    document.getElementById("idea-result").innerHTML = marked.parse(data.analysis);
  });


  /* =============================
     TIMELINE BUTTON (Uses refined idea)
  ============================= */
  /* =============================
   ✅ PROJECT TIMELINE BUTTON
============================= */
const timelineBtn = document.getElementById("timeline-btn");

if (timelineBtn) {
  timelineBtn.addEventListener("click", async () => {

    const timelineLoading = document.getElementById("timeline-loading");
    const timelineResult = document.getElementById("timeline-result");
    const refinedIdea = document.getElementById("idea-input").value;

    if (!refinedIdea || refinedIdea.trim() === "") {
      alert("Please refine an idea first before generating timeline.");
      return;
    }

    timelineLoading.classList.remove("d-none");
    timelineResult.innerHTML = "";

    try {
      const res = await fetch("/api/project/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refinedIdea })
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Timeline generation failed.");
        return;
      }

      timelineResult.innerHTML = marked.parse(data.timeline);

    } catch (err) {
      console.error("Timeline error:", err);
      alert("Error generating timeline.");
    } finally {
      timelineLoading.classList.add("d-none");
    }
  });
}

/* =============================
   ✅ IDEA SCORING BUTTON
============================= */
document.getElementById("score-idea-btn")?.addEventListener("click", async () => {
  const idea = document.getElementById("idea-input").value;
  const industry = document.getElementById("idea-industry").value;
  const userId = getSessionUserId();

  if (!idea) {
    alert("Please enter an idea first.");
    return;
  }

  if (!userId) {
    alert("Please login first.");
    return;
  }

  const loadingEl = document.getElementById("score-idea-loading");
  const resultEl = document.getElementById("idea-score-result");

  loadingEl.classList.remove("d-none");
  resultEl.innerHTML = "";

  try {
    const res = await fetch("/api/ideas/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea, industry, userId })
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error || "Scoring failed");
      return;
    }

    resultEl.innerHTML = marked.parse(data.scores);
  } catch (error) {
    console.error("Score Error:", error);
    alert("Failed to score idea.");
  } finally {
    loadingEl.classList.add("d-none");
  }
});

  /* =============================
     LEARNING ROADMAP
  ============================= */
  document.getElementById("learning-form")?.addEventListener("submit", async e => {
    e.preventDefault();

    const userId = getSessionUserId();
    const goal = document.getElementById("learning-goal").value;
    const level = document.getElementById("learning-level").value;
    const hoursPerDay = document.getElementById("learning-hours").value;

    const res = await fetch("/api/learning/roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, level, hoursPerDay, userId })
    });

    const data = await res.json();
    if (!data.success) return alert(data.error);

    document.getElementById("learning-result").innerHTML = marked.parse(data.roadmap);
  });

  /* =============================
     CAREER GUIDANCE
  ============================= */
    document.getElementById("career-form")?.addEventListener("submit", async e => {
  e.preventDefault();

  const userId = getSessionUserId();
  const education = document.getElementById("career-education").value;
  const skills = document.getElementById("career-skills").value;
  const interests = document.getElementById("career-interests").value;
  const targetRole = document.getElementById("career-target").value;

  const loading = document.getElementById("career-loading");
  loading.classList.remove("d-none"); // ✅ SHOW loading text

  try {
    const res = await fetch("/api/career/guidance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ education, skills, interests, targetRole, userId })
    });

    const data = await res.json();

    document.getElementById("career-result").innerHTML =
      marked.parse(data.guidance);

  } catch (error) {
    console.error("Career guidance error:", error);
    document.getElementById("career-result").innerText =
      "Failed to generate career guidance.";
  } finally {
    loading.classList.add("d-none"); // ✅ HIDE after response
  }
});

  /* =============================
     IMPACT ANALYZER
  ============================= */
  document.getElementById("impact-form")?.addEventListener("submit", async e => {
  e.preventDefault();

  const projectTitle = document.getElementById("impact-title").value;
  const domain = document.getElementById("impact-domain").value;
  const description = document.getElementById("impact-description").value;
  const userId = getSessionUserId(); // ✅ REQUIRED

  const loading = document.getElementById("impact-loading");
  loading.classList.remove("d-none"); // ✅ SHOW "Evaluating impact..."

  try {
    const res = await fetch("/api/impact/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectTitle, domain, description, userId })
    });

    const data = await res.json();

    document.getElementById("impact-result").innerHTML =
      marked.parse(data.impact);

  } catch (error) {
    console.error("Impact error:", error);
    document.getElementById("impact-result").innerText =
      "Failed to analyze impact.";
  } finally {
    loading.classList.add("d-none"); // ✅ HIDE after response
  }
});

  /* =============================
     AI CHAT MENTOR
  ============================= */
  document.getElementById("chat-form")?.addEventListener("submit", async e => {
  e.preventDefault();

  const chatInput = document.getElementById("chat-input");
  const message = chatInput.value.trim();
  const userId = getSessionUserId();
  const chatWindow = document.getElementById("chat-window");
  const loading = document.getElementById("chat-loading");

  if (!message) return;

  // ✅ Show user's message on RIGHT
  chatWindow.innerHTML += `
    <div class="d-flex justify-content-end mb-2">
      <div class="chat-bubble user-msg">
        ${message}
      </div>
    </div>
  `;

  chatInput.value = "";
  chatWindow.scrollTop = chatWindow.scrollHeight;

  loading.classList.remove("d-none"); // show typing

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, userId })
    });

    const data = await res.json();

    // ✅ AI response on LEFT
    chatWindow.innerHTML += `
      <div class="d-flex justify-content-start mb-2">
        <div class="chat-bubble ai-msg">
          ${marked.parse(data.reply)}
        </div>
      </div>
    `;
  } catch (error) {
    chatWindow.innerHTML += `
      <div class="d-flex justify-content-start mb-2">
        <div class="chat-bubble ai-msg text-danger">
          Failed to get response.
        </div>
      </div>
    `;
  } finally {
    loading.classList.add("d-none");
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});

  /* =============================
     DASHBOARD STATS
  ============================= */
  async function loadDashboard() {
    const userId = getSessionUserId();
    const res = await fetch(`/api/dashboard/stats?userId=${userId}`);
    const data = await res.json();

    document.getElementById("stat-ideas").innerText = data.stats?.ideas || 0;
    document.getElementById("stat-learning").innerText = data.stats?.learningPaths || 0;
    document.getElementById("stat-career").innerText = data.stats?.careerPlans || 0;
    document.getElementById("stat-interactions").innerText = data.stats?.totalInteractions || 0;
  }
/* =========================
   DASHBOARD STATS
========================= */
/* =============================
   ✅ DASHBOARD STATS - FIXED
============================= */
async function loadDashboard() {
  const userId = getSessionUserId();
  if (!userId) {
    console.warn("No userId found for dashboard");
    return;
  }

  try {
    // 1️⃣ Try using backend stats
    const res = await fetch(`/api/dashboard/stats?userId=${userId}`);
    const data = await res.json();

    console.log("Dashboard stats API:", data);

    if (data.success && data.stats) {
      document.getElementById("stat-ideas").innerText = data.stats.ideas;
      document.getElementById("stat-learning").innerText = data.stats.learningPaths;
      document.getElementById("stat-career").innerText = data.stats.careerPlans;
      document.getElementById("stat-interactions").innerText = data.stats.totalInteractions;
      return;
    }

  } catch (err) {
    console.warn("Stats API failed, switching to fallback...");
  }

  // 2️⃣ FALLBACK: Count by length from actual data
  try {
    const [ideasRes, learningRes, careerRes] = await Promise.all([
      fetch(`/api/dashboard/ideas?userId=${userId}`),
      fetch(`/api/dashboard/learning?userId=${userId}`),
      fetch(`/api/dashboard/careers?userId=${userId}`)
    ]);

    const ideasData = await ideasRes.json();
    const learningData = await learningRes.json();
    const careerData = await careerRes.json();

    document.getElementById("stat-ideas").innerText =
      ideasData.ideas?.length || 0;

    document.getElementById("stat-learning").innerText =
      learningData.paths?.length || 0;

    document.getElementById("stat-career").innerText =
      careerData.careers?.length || 0;

  } catch (error) {
    console.error("Fallback count failed:", error);
  }
}


/* =============================
   ✅ LOAD DASHBOARD RELIABLY
============================= */
function ensureDashboardLoads() {
  const session = getSessionUser();
  if (session) {
    setTimeout(loadDashboard, 300);
  }
}

// Trigger when dashboard tab opens
document.getElementById("dashboard-tab")?.addEventListener("click", loadDashboard);

// Trigger after login screen switch
const observer = new MutationObserver(() => {
  const dashboard = document.getElementById("dashboard-page");
  if (!dashboard.classList.contains("d-none")) {
    loadDashboard();
  }
});

observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["class"] });




/* =========================
   SHOW HISTORY LIST
========================= */
async function showHistory(type) {
  const userId = getSessionUserId();
  const modal = new bootstrap.Modal(document.getElementById("historyModal"));
  const titleBox = document.getElementById("historyTitle");
  const content = document.getElementById("historyContent");

  if (!userId) {
    alert("User not authenticated");
    return;
  }

  titleBox.innerText = `${type.toUpperCase()} LIST`;
  content.innerHTML = "<p class='text-muted'>Loading...</p>";
  modal.show();

  let endpoint = "";

  if (type === "ideas") endpoint = `/api/dashboard/ideas?userId=${userId}`;
  if (type === "learning") endpoint = `/api/dashboard/learning?userId=${userId}`;
  if (type === "career") endpoint = `/api/dashboard/careers?userId=${userId}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    let records = [];
    if (type === "ideas") records = data.ideas || [];
    if (type === "learning") records = data.paths || [];
    if (type === "career") records = data.careers || [];

    if (records.length === 0) {
      content.innerHTML = "<p class='text-muted'>No data found.</p>";
      return;
    }

    content.innerHTML = records.map(item => {

      let heading = "Entry";

      // ✅ Correct heading mapping
      if (type === "ideas") heading = item.idea || "Unnamed Idea";
      if (type === "learning") heading = item.skills || item.domain || "Learning Roadmap";
      if (type === "career") heading = item.targetRole || "Career Plan";

      // ✅ Correct Firestore Timestamp handling
      const displayDate = item.createdAt?.seconds
        ? new Date(item.createdAt.seconds * 1000).toLocaleString()
        : "       ";

      return `
        <div class="list-group-item list-group-item-action"
             onclick="showDetails('${type}','${item.id}')"
             style="cursor:pointer;">
          <strong>${heading}</strong>
          <br>
          </br>
          <small class="text-muted d-block">${displayDate}</small>
        </div>
      `;
    }).join("");

  } catch (error) {
    console.error("History load error:", error);
    content.innerHTML = "<p class='text-danger'>Failed to load history.</p>";
  }
}

window.showHistory = showHistory;


/* =========================
   SHOW FULL DETAILS
========================= */
async function showDetails(type, id) {
  const userId = getSessionUserId();
  const titleBox = document.getElementById("historyTitle");
  const content = document.getElementById("historyContent");

  titleBox.innerText = "DETAIL VIEW";
  content.innerHTML = "Loading details...";

  let endpoint = "";

  if (type === "ideas") endpoint = `/api/dashboard/ideas?userId=${userId}`;
  if (type === "learning") endpoint = `/api/dashboard/learning?userId=${userId}`;
  if (type === "career") endpoint = `/api/dashboard/careers?userId=${userId}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    let records = [];
    if (type === "ideas") records = data.ideas || [];
    if (type === "learning") records = data.paths || [];
    if (type === "career") records = data.careers || [];

    const item = records.find(r => r.id === id);

    if (!item) {
      content.innerHTML = "<p class='text-danger'>Record not found.</p>";
      return;
    }

    content.innerHTML = `
      <div class="card">
        <div class="card-body">
          <button class="btn btn-sm btn-secondary mb-3" onclick="showHistory('${type}')">
            ← Back
          </button>
          ${marked.parse(item.analysis || item.roadmap || item.guidance || "")}
        </div>
      </div>
    `;

  } catch (error) {
    console.error("Detail load error:", error);
    content.innerHTML = "<p class='text-danger'>Failed to load details.</p>";
  }
}

window.showDetails = showDetails;


/* =========================
   AUTO LOAD DASHBOARD
========================= */
/***************************
   AUTO LOAD DASHBOARD + LOGOUT
****************************/
document.addEventListener("DOMContentLoaded", () => {

  setTimeout(() => {
    loadDashboard();
  }, 300);

  // ✅ LOGOUT BUTTON HANDLER
  

});


  });
