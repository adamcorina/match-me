// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  allQ: [...QUESTIONS_CORE],
  answers: [],
  current: 0,
  gatePassed: false,
  addingRomantic: false,
  myVector: null,
  myCode: null,
};

// Persist to localStorage
function saveState() {
  if (state.myCode) {
    localStorage.setItem("matchme_code", state.myCode);
    localStorage.setItem("matchme_vector", JSON.stringify(state.myVector));
    localStorage.setItem("matchme_answers", JSON.stringify(state.answers));
  }
}

function loadState() {
  const code = localStorage.getItem("matchme_code");
  const vec = localStorage.getItem("matchme_vector");
  if (code && vec) {
    state.myCode = code;
    state.myVector = JSON.parse(vec);
    const savedAnswers = localStorage.getItem("matchme_answers");
    if (savedAnswers) state.answers = JSON.parse(savedAnswers);
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
  state.addingRomantic = false;
  showScreen("screen-quiz");
  renderQuestion();
}

function startDatingQuiz() {
  state.allQ = [...QUESTIONS_CORE, ...QUESTIONS_DATING];
  state.answers = new Array(QUESTIONS_CORE.length).fill(undefined);
  state.current = QUESTIONS_CORE.length;
  state.gatePassed = true;
  state.addingRomantic = true;
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

function friendshipCode(vector) {
  const friendshipOnly = Object.fromEntries(
    Object.entries(vector).filter(([d]) => FRIENDSHIP_DIMS.has(d))
  );
  return encodeVector(friendshipOnly);
}

function finishQuiz() {
  const newVector = buildVector(state.answers, state.allQ);
  if (state.addingRomantic && state.myVector) {
    state.myVector = { ...state.myVector, ...newVector };
    state.addingRomantic = false;
  } else {
    state.myVector = newVector;
  }
  state.myCode = encodeVector(state.myVector);
  saveState();

  const pending = sessionStorage.getItem("pending_code");
  if (pending) sessionStorage.removeItem("pending_code");
  const params = new URLSearchParams({ me: state.myCode });
  if (pending) params.set("compare", pending);
  window.location.href = "https://match-me.velea.cc/complete?" + params.toString();
}

// ─── Profile ──────────────────────────────────────────────────────────────────
function renderProfile() {
  showScreen("screen-profile");
  const hasRomantic = [...RELATIONSHIP_DIMS].some(d => !FRIENDSHIP_DIMS.has(d) && state.myVector[d] !== undefined);
  document.getElementById("code-toggle").style.display = hasRomantic ? "" : "none";
  document.getElementById("btn-add-romantic").style.display = hasRomantic ? "none" : "";
  document.getElementById("my-code").textContent = state.myCode;
  document.querySelectorAll(".code-toggle-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === "full"));

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

  renderFitSummary();
}

const LOVELANG_LABELS = ["Acts of service", "Gifts", "Touch", "Words of affirmation", "Quality time"];

function fitLines(v) {
  const best = [];
  const worst = [];

  const lo = d => v[d] !== undefined && v[d] <= 0.8;
  const hi = d => v[d] !== undefined && v[d] >= 2.2;
  const ext = (...dims) => Math.max(...dims.map(d => v[d] !== undefined ? Math.abs(v[d] - 1.5) : 0));
  const pushBest = (dims, text) => best.push({ w: ext(...dims), text });
  const pushWorst = (dims, text) => worst.push({ w: ext(...dims), text });

  // Communication
  if (lo("comm")) pushBest(["comm"], "communicates directly and in the moment");
  if (hi("comm")) pushBest(["comm"], "prefers to process before responding, and doesn't need to talk everything out face to face");
  if (lo("comm")) pushWorst(["comm"], "needs a lot of time and distance before they can respond to anything emotional");
  if (hi("comm")) pushWorst(["comm"], "demands immediate face-to-face resolution of everything");

  // Conflict style + resolution pace combined
  const conflictHi = hi("conflict"), conflictLo = lo("conflict");
  const cconfLo = lo("cconf"), cconfHi = hi("cconf");
  if (conflictLo && cconfLo) {
    pushBest(["conflict", "cconf"], "addresses friction directly and wants it resolved the same day, no lingering tension");
    pushWorst(["conflict", "cconf"], "avoids conflict and lets things drift unresolved for days");
  } else if (conflictHi && cconfHi) {
    pushBest(["conflict", "cconf"], "needs space before revisiting things and is fine letting them settle slowly");
    pushWorst(["conflict", "cconf"], "demands immediate confrontation and won't rest until it's resolved");
  } else if (conflictHi && cconfLo) {
    pushBest(["conflict", "cconf"], "doesn't rush into conflict but still needs things resolved before the day ends, neither pushy nor avoidant");
    pushWorst(["conflict", "cconf"], "either forces confrontation immediately or lets things fester indefinitely");
  } else if (conflictLo && cconfHi) {
    pushBest(["conflict", "cconf"], "addresses things directly but isn't rigid about when it gets fully resolved");
    pushWorst(["conflict", "cconf"], "either blows up immediately or refuses to ever fully address it");
  } else if (conflictLo) {
    pushBest(["conflict"], "addresses friction head-on rather than letting it sit");
    pushWorst(["conflict"], "avoids conflict entirely or shuts down when things get tense");
  } else if (conflictHi) {
    pushBest(["conflict"], "gives things space to settle before revisiting them");
    pushWorst(["conflict"], "pushes for resolution before you've had time to process");
  } else if (cconfLo) {
    pushBest(["cconf"], "needs to resolve things the same day, no overnight tension");
    pushWorst(["cconf"], "can let unresolved things drift for days or weeks");
  } else if (cconfHi) {
    pushBest(["cconf"], "is fine letting things settle in their own time");
  }

  // Depth
  if (lo("depth")) {
    pushBest(["depth"], "goes deep, conceptual conversation, meaning, ideas");
    pushWorst(["depth"], "keeps everything on the surface and resists going deeper");
  }
  if (hi("depth")) pushBest(["depth"], "is grounded and practical rather than endlessly reflective");

  // Independence (differ)
  if (lo("differ")) {
    pushBest(["differ"], "is comfortable with real closeness and doesn't need distance to feel like themselves");
    pushWorst(["differ"], "needs a lot of independence or alone time to feel okay in a relationship");
  }
  if (hi("differ")) {
    pushBest(["differ"], "values their own space and doesn't need constant togetherness");
    pushWorst(["differ"], "can't function without complete emotional merger");
  }

  // Direction
  if (lo("direction")) {
    pushBest(["direction"], "knows roughly where they're heading in life");
    pushWorst(["direction"], "has no sense of direction and isn't interested in figuring it out");
  }
  if (hi("direction")) pushBest(["direction"], "is comfortable keeping the future open and unscripted");

  // Empathy / support style
  if (lo("empathy")) {
    pushBest(["empathy"], "leads with emotional presence when someone's struggling, sits with it rather than trying to fix it");
    pushWorst(["empathy"], "immediately tries to fix things rather than just being there");
  }
  if (hi("empathy")) {
    pushBest(["empathy"], "reaches for practical solutions rather than sitting in feelings");
    pushWorst(["empathy"], "expects you to just listen and feel without offering any path forward");
  }

  // Energy
  if (lo("energy")) {
    pushBest(["energy"], "recharges around people and enjoys a shared social life");
    pushWorst(["energy"], "needs a lot of solitude to recover and rarely wants to be around others");
  }
  if (hi("energy")) {
    pushBest(["energy"], "values solitude and is selective about who they spend time with");
    pushWorst(["energy"], "has a packed social calendar and treats alone time as wasted time");
  }

  // Finances
  if (lo("finances")) {
    pushBest(["finances"], "treats money as shared, a team thing");
    pushWorst(["finances"], "insists on total financial independence and keeping everything separate");
  }
  if (hi("finances")) pushBest(["finances"], "values financial autonomy and independent decision-making");

  // Humour
  if (lo("humor")) {
    pushBest(["humor"], "has an absurdist or dry sense of humour");
    pushWorst(["humor"], "finds your kind of humour cold or hard to read");
  }
  if (hi("humor")) pushBest(["humor"], "is reactive and playful, finds the funny in whatever's in front of them");

  // Intimacy
  if (lo("intimacy")) {
    pushBest(["intimacy"], "wants to be fully known, vulnerability isn't scary to them");
    pushWorst(["intimacy"], "keeps emotional exposure to a minimum");
  }
  if (hi("intimacy")) pushBest(["intimacy"], "feels closest through quiet presence and acceptance rather than intense disclosure");

  // Love language
  if (v.lovelang !== undefined) {
    const langs = lovelangFromIndex(v.lovelang).map(i => LOVELANG_LABELS[i]);
    if (langs.length) {
      pushBest(["lovelang"], `shows care through ${langs.join(" and ").toLowerCase()}`);
      pushWorst(["lovelang"], "shows care in ways that don't register as care to you");
    }
  }

  // Passion
  if (lo("passion")) {
    pushBest(["passion"], "places physical chemistry and romantic intensity near the centre of the relationship");
    pushWorst(["passion"], "treats passion as a nice bonus rather than essential");
  }
  if (hi("passion")) pushBest(["passion"], "builds connection through consistency and warmth rather than intensity");

  // Rhythm
  if (lo("rhythm")) {
    pushBest(["rhythm"], "checks in often and stays close even in the small moments");
    pushWorst(["rhythm"], "disappears for days without thinking anything of it");
  }
  if (hi("rhythm")) {
    pushBest(["rhythm"], "is comfortable with loose, low-pressure contact and doesn't need to check in constantly");
    pushWorst(["rhythm"], "needs daily check-ins to feel secure");
  }

  // Stability
  if (lo("stability")) {
    pushBest(["stability"], "is emotionally steady, a reliable baseline when things get hard");
    pushWorst(["stability"], "is equally reactive, with no one anchoring the room");
  }
  if (hi("stability")) pushBest(["stability"], "is emotionally expressive and sensitive");

  // Values
  if (lo("values")) {
    pushBest(["values"], "is reliable, consistent, and shows up when it counts");
    pushWorst(["values"], "treats commitment as optional and values keeping things loose");
  }
  if (hi("values")) pushBest(["values"], "prioritises ease and low-pressure connection over obligation");

  // Admire
  if (lo("admire")) {
    pushBest(["admire"], "extends generosity and gives people the benefit of the doubt");
    pushWorst(["admire"], "defaults to a critical read of people, especially under stress");
  }
  if (hi("admire")) pushBest(["admire"], "calls things as they are and doesn't soften the truth");

  // Worldview
  if (lo("worldview")) {
    pushBest(["worldview"], "shares a faith-grounded framework for meaning");
    pushWorst(["worldview"], "has no interest in or patience for faith as part of life");
  }
  if (hi("worldview")) {
    pushBest(["worldview"], "is secular in how they make sense of things");
    pushWorst(["worldview"], "expects faith to structure daily life and major decisions");
  }

  // Space
  if (lo("space")) {
    pushBest(["space"], "treats home as an ordered, calm space");
    pushWorst(["space"], "lives in permanent chaos and doesn't see why it matters");
  }
  if (hi("space")) pushBest(["space"], "is relaxed about tidiness, home is lived-in");

  // Drive
  if (lo("drive")) {
    pushBest(["drive"], "is ambitious and career-oriented");
    pushWorst(["drive"], "treats work as just a means to an end and is cautious with money");
  }
  if (hi("drive")) {
    pushBest(["drive"], "is lifestyle-led and financially cautious");
    pushWorst(["drive"], "is defined by ambition and spends freely without thinking");
  }

  // Attachment
  if (lo("attach")) pushBest(["attach"], "forms bonds openly and gradually, secure by default");
  if (hi("attach")) {
    pushBest(["attach"], "takes their time to attach, no pressure, no rushing it");
    pushWorst(["attach"], "bonds fast and reads any distance as rejection");
  }

  const sort = arr => arr.sort((a, b) => b.w - a.w).slice(0, 7).map(x => x.text);
  return { best: sort(best), worst: sort(worst) };
}

function renderFitSummary() {
  const container = document.getElementById("profile-fit");
  container.innerHTML = "";
  if (!state.myVector) return;

  const { best, worst } = fitLines(state.myVector);
  if (!best.length && !worst.length) return;

  if (!best.length && !worst.length) {
    container.innerHTML = `<div class="fit-section"><p class="fit-balanced">You sit close to the middle on most dimensions. You're likely to get along with a wide range of personalities - it can just take longer to find out where the real points of connection are.</p></div>`;
    return;
  }

  const bestHtml = best.map(l => `<li>${l}</li>`).join("");
  const worstHtml = worst.map(l => `<li>${l}</li>`).join("");

  const bestBlock = best.length ? `
      <div class="fit-block fit-best">
        <div class="fit-heading">Probably a great fit if they…</div>
        <ul class="fit-list">${bestHtml}</ul>
      </div>` : "";
  const worstBlock = worst.length ? `
      <div class="fit-block fit-worst">
        <div class="fit-heading">Likely to clash if they…</div>
        <ul class="fit-list">${worstHtml}</ul>
      </div>` : "";

  container.innerHTML = `<div class="fit-section">${bestBlock}${worstBlock}</div>`;
}

function showProfile() {
  if (state.myCode) renderProfile();
  else showScreen("screen-landing");
}

function copyCode() {
  const code = document.getElementById("my-code").textContent;
  const url = "https://match-me.velea.cc/share?compare=" + code;
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById("copy-btn");
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = "Copy"), 2000);
  });
}

function switchCodeMode(mode) {
  const code = mode === "friendship" ? friendshipCode(state.myVector) : state.myCode;
  document.getElementById("my-code").textContent = code;
  document.querySelectorAll(".code-toggle-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
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
  } else {
    document.getElementById("r-pct").textContent = "—";
    document.getElementById("r-lbl").textContent = "";
    setTimeout(() => animateRing(0), 100);
  }
}

function renderResult(v1, v2) {
  const result = calcCompat(v1, v2);
  if (!result) return;

  showScreen("screen-result");

  // Friendship dims + score
  const friendshipDims = result.sharedDims.filter(d => FRIENDSHIP_DIMS.has(d));
  tabScores.friendship = friendshipDims.length
    ? Math.round(friendshipDims.reduce((s, d) => s + result.dims[d] * (DIM_WEIGHTS[d] || 1), 0) / friendshipDims.reduce((s, d) => s + (DIM_WEIGHTS[d] || 1), 0) * 100)
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

  // Relationship dims + score — only count dims exclusive to dating questions
  const relOnlyDims = [...RELATIONSHIP_DIMS].filter(d => !FRIENDSHIP_DIMS.has(d));
  const sharedRelOnlyDims = result.sharedDims.filter(d => relOnlyDims.includes(d));
  const relationshipDims = result.sharedDims.filter(d => RELATIONSHIP_DIMS.has(d));
  tabScores.relationship = sharedRelOnlyDims.length
    ? Math.round(relationshipDims.reduce((s, d) => s + result.dims[d] * (DIM_WEIGHTS[d] || 1), 0) / relationshipDims.reduce((s, d) => s + (DIM_WEIGHTS[d] || 1), 0) * 100)
    : null;

  const rDimsEl = document.getElementById("r-dims-relationship");
  const rInsightsEl = document.getElementById("r-insights-relationship");

  if (!sharedRelOnlyDims.length) {
    rDimsEl.innerHTML = "";
    rInsightsEl.innerHTML = `<p class="tab-empty">One of you didn't complete this section - relationship compatibility can't be calculated.</p>`;
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

function openPrivacy() {
  document.getElementById("privacy-modal").style.display = "flex";
}

function closePrivacy(e) {
  if (!e || e.target === document.getElementById("privacy-modal")) {
    document.getElementById("privacy-modal").style.display = "none";
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
