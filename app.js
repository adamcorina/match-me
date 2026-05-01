// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  allQ: [...QUESTIONS_CORE],
  answers: [],
  current: 0,
  gatePassed: false,
  myVector: null,
  myCode: null,
};

// Persist to localStorage
function saveState() {
  if (state.myCode) {
    localStorage.setItem("matchme_code", state.myCode);
    localStorage.setItem("matchme_vector", JSON.stringify(state.myVector));
  }
}

function loadState() {
  const code = localStorage.getItem("matchme_code");
  const vec = localStorage.getItem("matchme_vector");
  if (code && vec) {
    state.myCode = code;
    state.myVector = JSON.parse(vec);
    return true;
  }
  return false;
}

// ─── Navigation helpers ───────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ─── Landing ──────────────────────────────────────────────────────────────────
function extractCode(input) {
  try {
    const url = new URL(input.trim());
    const code = url.searchParams.get("compare") || url.searchParams.get("me");
    if (code) return code;
  } catch {}
  return input.trim();
}

function checkFromLanding() {
  const code = extractCode(document.getElementById("input-code").value);
  if (!code) return;

  if (!state.myVector) {
    sessionStorage.setItem("pending_code", code);
    startQuiz();
    return;
  }

  compareWithCode(code);
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────
function startQuiz() {
  state.allQ = [...QUESTIONS_CORE];
  state.answers = [];
  state.current = 0;
  state.gatePassed = false;
  showScreen("screen-quiz");
  renderQuestion();
}

function renderQuestion() {
  const q = state.allQ[state.current];
  const total = state.allQ.length;
  const pct = (state.current / total) * 100;

  document.getElementById("prog-fill").style.width = pct + "%";
  document.getElementById("prog-label").textContent =
    `${state.current + 1} / ${total}`;
  document.getElementById("q-section").textContent = q.section;
  document.getElementById("q-text").textContent = q.q;

  const container = document.getElementById("q-options");
  container.innerHTML = "";
  const ans = state.answers[state.current];
  q.opts.forEach((opt, i) => {
    const btn = document.createElement("button");
    const isSelected = q.multiSelect
      ? (Array.isArray(ans) && ans.includes(i))
      : ans === i;
    btn.className = "opt-btn" + (isSelected ? " selected" : "");
    btn.textContent = opt;
    btn.onclick = () => selectOption(i);
    container.appendChild(btn);
  });

  document.getElementById("btn-next").disabled =
    state.answers[state.current] === undefined;

  const isLast = state.current === state.allQ.length - 1;
  document.getElementById("btn-next").textContent = isLast ? "Finish →" : "Continue →";
}

function selectOption(i) {
  const q = state.allQ[state.current];
  if (q.multiSelect) {
    let sel = Array.isArray(state.answers[state.current])
      ? [...state.answers[state.current]]
      : [];
    if (sel.includes(i)) {
      sel = sel.filter(x => x !== i);
    } else if (sel.length < q.multiSelect) {
      sel.push(i);
    }
    state.answers[state.current] = sel.length ? sel : undefined;
    document.querySelectorAll(".opt-btn").forEach((b, idx) => {
      b.classList.toggle("selected", sel.includes(idx));
    });
    document.getElementById("btn-next").disabled = !sel.length;
  } else {
    state.answers[state.current] = i;
    document.querySelectorAll(".opt-btn").forEach((b, idx) => {
      b.classList.toggle("selected", idx === i);
    });
    document.getElementById("btn-next").disabled = false;
  }
}

function goBack() {
  if (state.current > 0) {
    state.current--;
    renderQuestion();
  } else {
    showScreen("screen-landing");
  }
}

function goNext() {
  const ans = state.answers[state.current];
  if (ans === undefined || (Array.isArray(ans) && ans.length === 0)) return;

  // Show dating gate after core questions
  if (state.current === QUESTIONS_CORE.length - 1 && !state.gatePassed) {
    showScreen("screen-gate");
    return;
  }

  if (state.current < state.allQ.length - 1) {
    state.current++;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function chooseDating(yes) {
  state.gatePassed = true;
  if (yes) state.allQ = [...QUESTIONS_CORE, ...QUESTIONS_DATING];
  showScreen("screen-quiz");
  state.current++;
  if (state.current >= state.allQ.length) {
    finishQuiz();
    return;
  }
  renderQuestion();
}

function finishQuiz() {
  state.myVector = buildVector(state.answers, state.allQ);
  state.myCode = encodeVector(state.myVector);
  saveState();
  history.replaceState(null, "", "?me=" + state.myCode);
  renderProfile();

  // Check if there was a pending comparison
  const pending = sessionStorage.getItem("pending_code");
  if (pending) {
    sessionStorage.removeItem("pending_code");
    document.getElementById("input-other-code").value = pending;
  }
}

// ─── Profile ──────────────────────────────────────────────────────────────────
function renderProfile() {
  showScreen("screen-profile");
  document.getElementById("my-code").textContent = state.myCode;

  // Render dimension bars with pole labels
  const container = document.getElementById("profile-dims");
  container.innerHTML = "";
  const dims = Object.keys(state.myVector);
  dims.forEach(d => {
    const meta = DIM_META[d];
    if (!meta) return;
    const val = state.myVector[d];

    if (meta.display === "category") {
      let activeIndices;
      if (meta.type === "overlap") {
        activeIndices = new Set(lovelangFromIndex(val));
      } else {
        const count = meta.cats.length;
        activeIndices = new Set([Math.min(Math.round((val / 3) * (count - 1)), count - 1)]);
      }
      const boxes = meta.cats.map((name, i) => `
        <div class="pcat-box ${activeIndices.has(i) ? "pcat-active" : ""}">
          ${activeIndices.has(i) ? `<div class="pcat-name">${name}</div>` : ""}
        </div>`).join("");
      container.innerHTML += `
        <div class="pdim-row">
          <div class="pdim-label">${meta.label}</div>
          <div class="pcat-boxes">${boxes}</div>
        </div>`;
    } else {
      const pct = Math.round((val / 3) * 100);
      container.innerHTML += `
        <div class="pdim-row">
          <div class="pdim-label">${meta.label}</div>
          <div class="pdim-track">
            <div class="pdim-tick" style="left:${pct}%"></div>
          </div>
          <div class="pdim-poles">
            <span>${meta.lo}</span>
            <span>${meta.hi}</span>
          </div>
        </div>`;
    }
  });
}

function showProfile() {
  if (state.myCode) renderProfile();
  else showScreen("screen-landing");
}

function copyCode() {
  const url = "https://match-me.velea.cc/?compare=" + state.myCode;
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById("copy-btn");
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = "Copy"), 2000);
  });
}

// ─── Compatibility ────────────────────────────────────────────────────────────
function checkCompat() {
  const code = extractCode(document.getElementById("input-other-code").value);
  if (!code) return;
  compareWithCode(code);
}

function compareWithCode(code) {
  const v2 = decodeVector(code);
  if (!v2) {
    alert("Invalid code. Please check and try again.");
    return;
  }
  renderResult(state.myVector, v2);
}

const FRIENDSHIP_DIMS = new Set(["comm","conflict","energy","rhythm","empathy","humor","boundaries","stability","values","depth","auth"]);
const RELATIONSHIP_DIMS = new Set(["comm","conflict","energy","rhythm","empathy","humor","boundaries","stability","values","depth","auth","attach","intimacy","direction","lovelang","cconf","passion","differ","drive","worldview","space","admire","finances"]);

function renderDimCards(dims, sharedDims, v1, v2, containerId) {
  const el = document.getElementById(containerId);
  el.innerHTML = "";
  const sorted = sharedDims.slice().sort((a, b) => dims[b] - dims[a]);
  sorted.forEach(d => {
    const s = Math.round(dims[d] * 100);
    const color = s >= 65 ? "bar-hi" : s >= 40 ? "bar-mid" : "bar-lo";
    let ins = DIM_INSIGHTS[d] ? DIM_INSIGHTS[d](v1[d], v2[d], dims[d]) : null;
    if (ins && ins.type === "strength" && dims[d] < 0.5) ins = { type: "diff", text: ins.text };
    const insHtml = ins ? `<div class="dim-insight ${ins.type}">${ins.text}</div>` : "";
    el.innerHTML += `
      <div class="dim-card">
        <div class="dim-card-header">
          <div class="rdim-label">${DIM_META[d].label}</div>
          <div class="rdim-pct">${s}%</div>
        </div>
        <div class="rdim-bar-bg">
          <div class="rdim-bar-fill ${color}" style="width:${s}%"></div>
        </div>
        ${insHtml}
      </div>`;
  });
}

const tabScores = { friendship: null, relationship: null };

function animateRing(pct) {
  const circumference = 326.7;
  const offset = circumference - (pct / 100) * circumference;
  const ring = document.getElementById("ring-fg");
  ring.style.strokeDashoffset = offset;
  ring.style.stroke = pct >= 65 ? "#c8b89a"
                    : pct >= 40 ? "rgba(200,184,154,0.5)"
                    : "rgba(200,184,154,0.25)";
}

function switchTab(tab) {
  document.getElementById("tab-friendship").classList.toggle("active", tab === "friendship");
  document.getElementById("tab-relationship").classList.toggle("active", tab === "relationship");
  document.getElementById("tab-panel-friendship").style.display = tab === "friendship" ? "" : "none";
  document.getElementById("tab-panel-relationship").style.display = tab === "relationship" ? "" : "none";

  const pct = tabScores[tab];
  if (pct !== null) {
    document.getElementById("r-pct").textContent = pct + "%";
    document.getElementById("r-lbl").textContent = scoreLabel(pct);
    setTimeout(() => animateRing(pct), 100);
  }
}

function renderResult(v1, v2) {
  const result = calcCompat(v1, v2);
  if (!result) return;

  showScreen("screen-result");

  // Friendship dims + score
  const friendshipDims = result.sharedDims.filter(d => FRIENDSHIP_DIMS.has(d));
  tabScores.friendship = friendshipDims.length
    ? Math.round(friendshipDims.reduce((s, d) => s + result.dims[d], 0) / friendshipDims.length * 100)
    : null;
  renderDimCards(result.dims, friendshipDims, v1, v2, "r-dims-friendship");

  const allCombos = COMBO_INSIGHTS.map(fn => fn(v1, v2)).filter(Boolean);
  const friendshipCombos = allCombos.filter(ins => ins.tab === "friendship");
  const friendshipInsightsEl = document.getElementById("r-insights-friendship");
  if (friendshipCombos.length) {
    friendshipInsightsEl.innerHTML = `<div class="combo-header">Also worth knowing</div>` +
      friendshipCombos.map(ins => `<div class="insight ${ins.type}">${ins.text}</div>`).join("");
  } else {
    friendshipInsightsEl.innerHTML = "";
  }

  // Relationship dims + score
  const relationshipDims = result.sharedDims.filter(d => RELATIONSHIP_DIMS.has(d));
  tabScores.relationship = relationshipDims.length
    ? Math.round(relationshipDims.reduce((s, d) => s + result.dims[d], 0) / relationshipDims.length * 100)
    : null;

  const rDimsEl = document.getElementById("r-dims-relationship");
  const rInsightsEl = document.getElementById("r-insights-relationship");

  if (!relationshipDims.length) {
    rDimsEl.innerHTML = "";
    rInsightsEl.innerHTML = `<p class="tab-empty">Neither of you answered the dating questions. Go back and add them to see relationship compatibility.</p>`;
  } else {
    renderDimCards(result.dims, relationshipDims, v1, v2, "r-dims-relationship");
    const relationshipCombos = allCombos;
    if (relationshipCombos.length) {
      rInsightsEl.innerHTML = `<div class="combo-header">Also worth knowing</div>` +
        relationshipCombos.map(ins => `<div class="insight ${ins.type}">${ins.text}</div>`).join("");
    } else {
      rInsightsEl.innerHTML = "";
    }
  }

  switchTab("friendship");
}

// ─── About ────────────────────────────────────────────────────────────────────
function openAbout() {
  document.getElementById("about-modal").style.display = "flex";
}

function closeAbout(e) {
  if (!e || e.target === document.getElementById("about-modal")) {
    document.getElementById("about-modal").style.display = "none";
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────
(function init() {
  const params = new URLSearchParams(location.search);
  const compareCode = params.get("compare");
  const meCode = params.get("me");

  if (compareCode) {
    const hasProfile = loadState();
    if (hasProfile) {
      compareWithCode(compareCode);
    } else {
      sessionStorage.setItem("pending_code", compareCode);
      startQuiz();
    }
    return;
  }

  if (meCode) {
    const vec = decodeVector(meCode);
    if (vec) {
      state.myCode = meCode;
      state.myVector = vec;
      saveState();
      renderProfile();
      return;
    }
  }

  const hasProfile = loadState();
  if (hasProfile) renderProfile();
})();
