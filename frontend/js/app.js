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
  const loadingEl = document.getElementById("idea-loading");
  const resultEl = document.getElementById("idea-result");

  resultEl.textContent = "";
  loadingEl.classList.remove("d-none");

  try {
    const data = await postJSON("/api/ideas/refine", { idea, domain });
    resultEl.textContent = data.analysis || JSON.stringify(data, null, 2);
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
