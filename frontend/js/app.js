document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "";

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
      loadDashboard();
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

    const res = await fetch("/api/career/guidance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ education, skills, interests, targetRole, userId })
    });

    const data = await res.json();
    document.getElementById("career-result").innerHTML = marked.parse(data.guidance);
  });

  /* =============================
     IMPACT ANALYZER
  ============================= */
  document.getElementById("impact-form")?.addEventListener("submit", async e => {
    e.preventDefault();

    const projectTitle = document.getElementById("impact-title").value;
    const domain = document.getElementById("impact-domain").value;
    const description = document.getElementById("impact-description").value;

    const res = await fetch("/api/impact/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectTitle, domain, description })
    });

    const data = await res.json();
    document.getElementById("impact-result").innerHTML = marked.parse(data.impact);
  });

  /* =============================
     AI CHAT MENTOR
  ============================= */
  document.getElementById("chat-form")?.addEventListener("submit", async e => {
    e.preventDefault();

    const message = document.getElementById("chat-input").value;
    const userId = getSessionUserId();

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, userId })
    });

    const data = await res.json();

    const chatWindow = document.getElementById("chat-window");
    chatWindow.innerHTML += `<div class='mb-2 p-2 bg-light rounded'>${marked.parse(data.reply)}</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
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

  document.getElementById("dashboard-tab")?.addEventListener("click", loadDashboard);
  document.getElementById("refresh-dashboard")?.addEventListener("click", loadDashboard);
});
