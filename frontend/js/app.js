// frontend/js/app.js

const API_BASE_URL = ""; // same origin

async function postJSON(path, data) {
  const res = await fetch(API_BASE_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

// IDEA FORM
document.getElementById("idea-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const idea = document.getElementById("idea-input").value.trim();
  const domain = document.getElementById("idea-domain").value.trim();
  const industry = document.getElementById("idea-industry").value;

  const loadingEl = document.getElementById("idea-loading");
  const resultEl = document.getElementById("idea-result");

  resultEl.textContent = "";
  loadingEl.classList.remove("d-none");

  try {
    const data = await postJSON("/api/ideas/refine", { idea, domain,industry });
    resultEl.innerHTML = marked.parse(data.analysis) || JSON.stringify(data, null, 2);
  } catch (err) {
    resultEl.textContent = "Error: " + err.message;
  } finally {
    loadingEl.classList.add("d-none");
  }
});

// LEARNING FORM
document
  .getElementById("learning-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const goal = document.getElementById("learning-goal").value.trim();
    const level = document.getElementById("learning-level").value;
    const hoursPerDay = Number(
      document.getElementById("learning-hours").value
    );
    const loadingEl = document.getElementById("learning-loading");
    const resultEl = document.getElementById("learning-result");

    resultEl.textContent = "";
    loadingEl.classList.remove("d-none");

    try {
      const data = await postJSON("/api/learning/roadmap", {
        goal,
        level,
        hoursPerDay,
      });
      resultEl.textContent = data.roadmap || JSON.stringify(data, null, 2);
    } catch (err) {
      resultEl.textContent = "Error: " + err.message;
    } finally {
      loadingEl.classList.add("d-none");
    }
  });

// CAREER FORM
document
  .getElementById("career-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const education = document.getElementById("career-education").value.trim();
    const skills = document.getElementById("career-skills").value.trim();
    const interests = document
      .getElementById("career-interests")
      .value.trim();
    const targetRole = document.getElementById("career-target").value.trim();

    const loadingEl = document.getElementById("career-loading");
    const resultEl = document.getElementById("career-result");

    resultEl.textContent = "";
    loadingEl.classList.remove("d-none");

    try {
      const data = await postJSON("/api/career/guidance", {
        education,
        skills,
        interests,
        targetRole,
      });
      resultEl.textContent = data.guidance || JSON.stringify(data, null, 2);
    } catch (err) {
      resultEl.textContent = "Error: " + err.message;
    } finally {
      loadingEl.classList.add("d-none");
    }
  });

// IMPACT FORM
document
  .getElementById("impact-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const projectTitle = document.getElementById("impact-title").value.trim();
    const domain = document.getElementById("impact-domain").value.trim();
    const description = document
      .getElementById("impact-description")
      .value.trim();

    const loadingEl = document.getElementById("impact-loading");
    const resultEl = document.getElementById("impact-result");

    resultEl.textContent = "";
    loadingEl.classList.remove("d-none");

    try {
      const data = await postJSON("/api/impact/analyze", {
        projectTitle,
        domain,
        description,
      });
      resultEl.textContent = data.impact || JSON.stringify(data, null, 2);
    } catch (err) {
      resultEl.textContent = "Error: " + err.message;
    } finally {
      loadingEl.classList.add("d-none");
    }
  });

// CHAT FORM
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatLoading = document.getElementById("chat-loading");

function addChatMessage(text, type) {
  const div = document.createElement("div");
  div.classList.add("chat-message", type);
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  addChatMessage(message, "user");
  chatInput.value = "";
  chatLoading.classList.remove("d-none");

  try {
    const data = await postJSON("/api/chat", {
      message,
      context: "NovaMind-AI web chat",
    });
    addChatMessage(data.reply || JSON.stringify(data, null, 2), "bot");
  } catch (err) {
    addChatMessage("Error: " + err.message, "bot");
  } finally {
    chatLoading.classList.add("d-none");
  }
});

const scoreBtn = document.getElementById("score-idea-btn");
const scoreResultEl = document.getElementById("idea-score-result");
const scoreLoadingEl = document.getElementById("score-idea-loading");

scoreBtn.addEventListener("click", async () => {
  const idea = document.getElementById("idea-input").value.trim();
  const domain = document.getElementById("idea-domain").value.trim();
  const industry = document.getElementById("idea-industry").value;

  if (!idea) {
    scoreResultEl.textContent = "Please enter an idea first.";
    return;
  }

  scoreResultEl.textContent = "";
  scoreLoadingEl.classList.remove("d-none");

  try {
    const data = await postJSON("/api/ideas/score", { idea, domain, industry });
    scoreResultEl.innerHTML = marked.parse(data.scores || JSON.stringify(data, null, 2));
  } catch (err) {
    scoreResultEl.textContent = "Error: " + err.message;
  } finally {
    scoreLoadingEl.classList.add("d-none");
  }
});


const timelineBtn = document.getElementById("timeline-btn");
const timelineResultEl = document.getElementById("timeline-result");
const timelineLoadingEl = document.getElementById("timeline-loading");

timelineBtn.addEventListener("click", async () => {
  const refined = document.getElementById("idea-result").textContent.trim();
  if (!refined) {
    timelineResultEl.textContent = "Refine the idea first before generating a timeline.";
    return;
  }

  timelineResultEl.textContent = "";
  timelineLoadingEl.classList.remove("d-none");

  try {
    const data = await postJSON("/api/project/timeline", {
      refinedIdea: refined,
    });

    timelineResultEl.innerHTML = marked.parse(
      data.timeline || JSON.stringify(data, null, 2)
    );
  } catch (err) {
    timelineResultEl.textContent = "Error: " + err.message;
  } finally {
    timelineLoadingEl.classList.add("d-none");
  }
});

async function loadDashboard() {
  try {
    const res = await fetch("/api/dashboard/stats");
    const data = await res.json();

    const s = data.stats || {};
    document.getElementById("stat-ideas").textContent = s.ideas || 0;
    document.getElementById("stat-learning").textContent = s.learningPaths || 0;
    document.getElementById("stat-career").textContent = s.careerPlans || 0;
    document.getElementById("stat-interactions").textContent =
      s.totalInteractions || 0;
  } catch (error) {
    console.error("Dashboard load error:", error);
  }
}

// Button refresh
document
  .getElementById("refresh-dashboard")
  .addEventListener("click", loadDashboard);

// Auto load on tab open
document
  .getElementById("dashboard-tab")
  .addEventListener("click", loadDashboard);

  async function showHistory(type) {
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

  const res = await fetch(url);
  const data = await res.json();

  let html = "";

  if (type === "ideas") {
    data.ideas.forEach(item => {
      html += `<div class="mb-2 p-2 border rounded">
        <b>Idea:</b> ${item.idea}<br>
        <small>${item.domain || ""}</small>
      </div>`;
    });
  }

  if (type === "learning") {
    data.paths.forEach(item => {
      html += `<div class="mb-2 p-2 border rounded">
        <b>Goal:</b> ${item.goal}<br>
        <small>Level: ${item.level}</small>
      </div>`;
    });
  }

  if (type === "career") {
    data.careers.forEach(item => {
      html += `<div class="mb-2 p-2 border rounded">
        <b>Target Role:</b> ${item.targetRole}<br>
        <small>${item.skills}</small>
      </div>`;
    });
  }

  document.getElementById("dashboardModalTitle").textContent = title;
  document.getElementById("dashboardModalBody").innerHTML = html;

  new bootstrap.Modal(document.getElementById("dashboardModal")).show();
}
