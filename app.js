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

// ─── Storage versioning ───────────────────────────────────────────────────────
const STORAGE_VERSION = "4";

function migrateStorage() {
  if (localStorage.getItem("matchme_version") !== STORAGE_VERSION) {
    localStorage.removeItem("matchme_code");
    localStorage.removeItem("matchme_vector");
    localStorage.removeItem("matchme_answers");
    localStorage.removeItem("matchme_allQ_dating");
    localStorage.setItem("matchme_version", STORAGE_VERSION);
  }
}

// Persist to localStorage
function saveState() {
  localStorage.setItem("matchme_answers", JSON.stringify(state.answers));
  localStorage.setItem("matchme_allQ_dating", JSON.stringify(state.allQ.length > QUESTIONS_CORE.length));
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
    const savedAnswers = localStorage.getItem("matchme_answers");
    if (savedAnswers) state.answers = JSON.parse(savedAnswers);
    const hadDating = localStorage.getItem("matchme_allQ_dating");
    if (hadDating === "true") state.allQ = [...QUESTIONS_CORE, ...QUESTIONS_DATING];
    return true;
  }
  return false;
}

function loadSavedAnswers() {
  const savedAnswers = localStorage.getItem("matchme_answers");
  const hadDating = localStorage.getItem("matchme_allQ_dating");
  if (hadDating === "true") state.allQ = [...QUESTIONS_CORE, ...QUESTIONS_DATING];
  return savedAnswers ? JSON.parse(savedAnswers) : [];
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
  state.gatePassed = false;
  state.addingRomantic = false;
  const saved = loadSavedAnswers();
  state.answers = saved.length ? saved : [];
  state.current = 0;
  showScreen("screen-quiz");
  renderQuestion();
}

function startDatingQuiz() {
  state.allQ = [...QUESTIONS_CORE, ...QUESTIONS_DATING];
  // preserve existing core answers, load saved dating answers if any
  const saved = loadSavedAnswers();
  if (state.answers.length < QUESTIONS_CORE.length) {
    state.answers = saved.length ? saved : new Array(QUESTIONS_CORE.length).fill(undefined);
  }
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
  saveState();
}

function goBack() {
  if (state.current > 0) {
    state.current--;
    renderQuestion();
  } else if (state.myVector) {
    renderProfile();
  } else {
    showScreen("screen-landing");
  }
}

function goNext() {
  const ans = state.answers[state.current];
  if (ans === undefined || (Array.isArray(ans) && ans.length === 0)) return;

  // Show dating gate after core questions — skip if already did dating before
  if (state.current === QUESTIONS_CORE.length - 1 && !state.gatePassed) {
    if (state.allQ.length > QUESTIONS_CORE.length) {
      // already includes dating questions (loaded from saved), just continue
      state.gatePassed = true;
    } else {
      showScreen("screen-gate");
      return;
    }
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
  state.current++;
  if (state.current >= state.allQ.length) {
    finishQuiz();
    return;
  }
  showScreen("screen-quiz");
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

  history.replaceState(null, "", "?me=" + state.myCode);
  renderProfile();

  const pending = sessionStorage.getItem("pending_code");
  if (pending) {
    sessionStorage.removeItem("pending_code");
    history.replaceState(null, "", "?me=" + state.myCode + "&compare=" + pending);
    compareWithCode(pending);
  }
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

  // Attachment profile block (replaces individual attach_* bars)
  if (hasAttachmentProfile(state.myVector)) {
    const { attach_secure: sec, attach_anxious: anx, attach_avoidant: avd } = state.myVector;
    const attachBox = (label, val) => {
      const pct = Math.round((val / 3) * 100);
      const opacity = 0.15 + (val / 3) * 0.85;
      return `
        <div class="pcat-box pcat-attach" style="opacity:${opacity.toFixed(2)}">
          <div class="pcat-attach-label">${label}</div>
          <div class="pcat-attach-pct">${pct}%</div>
        </div>`;
    };
    container.innerHTML += `
      <div class="pdim-row">
        <div class="pdim-label">Attachment</div>
        <div class="pcat-boxes pcat-boxes-attach">
          ${attachBox("Secure", sec)}
          ${attachBox("Anxious", anx)}
          ${attachBox("Avoidant", avd)}
        </div>
      </div>`;
  }

  const dims = Object.keys(state.myVector);
  dims.forEach(d => {
    if (ATTACH_DIMS.includes(d)) return; // rendered above as a group
    const meta = DIM_META[d];
    if (!meta) return;
    const val = state.myVector[d];

    if (meta.display === "category" || meta.type === "exact" || meta.type === "overlap") {
      let activeIndices;
      if (meta.type === "overlap") {
        activeIndices = new Set(pick2FromIndex(val));
      } else if (meta.type === "exact") {
        activeIndices = new Set([val]);
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
      const pct = Math.round((val / (meta.max || 3)) * 100);
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

  const lo  = d => v[d] !== undefined && v[d] <= 0.8;
  const hi  = d => v[d] !== undefined && v[d] >= 2.2;
  const ext = (...dims) => Math.max(...dims.map(d => v[d] !== undefined ? Math.abs(v[d] - 1.5) : 0));
  const pushBest  = (dims, text) => best.push({ w: ext(...dims), text });
  const pushWorst = (dims, text) => worst.push({ w: ext(...dims), text });

  // comm — direct ←→ async
  if (lo("comm")) pushBest(["comm"], "communicates directly and in the moment");
  if (hi("comm")) pushBest(["comm"], "prefers to process before responding, doesn't need to talk everything out face to face");
  if (lo("comm")) pushWorst(["comm"], "needs a lot of time and distance before they can respond to anything emotional");
  if (hi("comm")) pushWorst(["comm"], "demands immediate face-to-face resolution of everything");

  // conflict + cconf combined
  const conflictLo = lo("conflict"), conflictHi = hi("conflict");
  const cconfLo = lo("cconf"), cconfHi = hi("cconf");
  if (conflictLo && cconfLo) {
    pushBest(["conflict","cconf"], "addresses friction directly and wants it resolved the same day, no lingering tension");
    pushWorst(["conflict","cconf"], "avoids conflict and lets things drift unresolved for days");
  } else if (conflictHi && cconfHi) {
    pushBest(["conflict","cconf"], "needs space before revisiting things and is fine letting them settle slowly");
    pushWorst(["conflict","cconf"], "demands immediate confrontation and won't rest until it's resolved");
  } else if (conflictHi && cconfLo) {
    pushBest(["conflict","cconf"], "doesn't rush into conflict but still needs things resolved before the day ends");
    pushWorst(["conflict","cconf"], "either forces confrontation immediately or lets things fester indefinitely");
  } else if (conflictLo && cconfHi) {
    pushBest(["conflict","cconf"], "addresses things directly but isn't rigid about when it gets fully resolved");
    pushWorst(["conflict","cconf"], "either blows up immediately or refuses to ever fully address it");
  } else if (conflictLo) {
    pushBest(["conflict"], "addresses friction head-on rather than letting it sit");
    pushWorst(["conflict"], "avoids conflict entirely or shuts down when things get tense");
  } else if (conflictHi) {
    pushBest(["conflict"], "gives things space to settle before revisiting them");
    pushWorst(["conflict"], "pushes for resolution before you've had time to process");
  } else if (cconfLo) {
    pushBest(["cconf"], "needs to resolve things the same day, no overnight tension");
    pushWorst(["cconf"], "lets unresolved things drift for days or weeks");
  } else if (cconfHi) {
    pushBest(["cconf"], "is fine letting things settle in their own time");
  }

  // auth — open ←→ guarded
  if (lo("auth")) {
    pushBest(["auth"], "is open and doesn't hide much, what you see is what you get");
    pushWorst(["auth"], "takes years to let anyone in and never fully does");
  }
  if (hi("auth")) {
    pushBest(["auth"], "takes their time to open up and doesn't perform warmth they don't feel");
    pushWorst(["auth"], "overshares early and expects the same level of openness immediately");
  }

  // boundaries — direct/explicit ←→ absorbs quietly
  if (lo("boundaries")) {
    pushBest(["boundaries"], "names limits clearly and without drama");
    pushWorst(["boundaries"], "never says what they need and expects you to guess");
  }
  if (hi("boundaries")) {
    pushBest(["boundaries"], "doesn't make a thing of every limit, absorbs small frictions without comment");
    pushWorst(["boundaries"], "draws hard lines at the first sign of discomfort");
  }

  // depth — conceptual ←→ practical
  if (lo("depth")) {
    pushBest(["depth"], "goes deep, real conversation, meaning, ideas");
    pushWorst(["depth"], "keeps everything on the surface and resists going deeper");
  }
  if (hi("depth")) pushBest(["depth"], "is grounded and practical rather than endlessly reflective");

  // differ — merged ←→ independent
  if (lo("differ")) {
    pushBest(["differ"], "is comfortable with real closeness and doesn't need distance to feel like themselves");
    pushWorst(["differ"], "needs a lot of independence or alone time to feel okay in a relationship");
  }
  if (hi("differ")) {
    pushBest(["differ"], "values their own space and doesn't need constant togetherness");
    pushWorst(["differ"], "can't function without complete emotional merger");
  }

  // direction — exact type, check specific values
  const dirLabels = ["oriented toward stability and routine", "oriented toward freedom and flexibility",
                     "oriented toward growth and building things", "oriented toward connection above all else"];
  if (v.direction !== undefined) {
    pushBest(["direction"], `is ${dirLabels[v.direction]}`);
    if (v.direction === 0) pushWorst(["direction"], "has no interest in settling or building anything stable");
    if (v.direction === 1) pushWorst(["direction"], "needs roots and a fixed plan, resists any openness");
    if (v.direction === 2) pushWorst(["direction"], "isn't interested in building or growing toward anything");
    if (v.direction === 3) pushWorst(["direction"], "prioritises place and plan over people");
  }

  // empathy — emotional ←→ practical
  if (lo("empathy")) {
    pushBest(["empathy"], "leads with emotional presence when someone's struggling, sits with it rather than trying to fix it");
    pushWorst(["empathy"], "immediately tries to fix things rather than just being there");
  }
  if (hi("empathy")) {
    pushBest(["empathy"], "reaches for practical solutions rather than sitting in feelings");
    pushWorst(["empathy"], "expects you to just listen and feel without offering any path forward");
  }

  // energy — social ←→ solitary
  if (lo("energy")) {
    pushBest(["energy"], "recharges around people and enjoys a shared social life");
    pushWorst(["energy"], "needs a lot of solitude to recover and rarely wants to be around others");
  }
  if (hi("energy")) {
    pushBest(["energy"], "values solitude and is selective about who they spend time with");
    pushWorst(["energy"], "has a packed social calendar and treats alone time as wasted time");
  }

  // finances — shared/free ←→ separate/careful
  if (lo("finances")) {
    pushBest(["finances"], "treats money as shared, a team thing");
    pushWorst(["finances"], "insists on total financial independence and keeping everything separate");
  }
  if (hi("finances")) {
    pushBest(["finances"], "values financial autonomy and careful decision-making");
    pushWorst(["finances"], "spends freely and wants everything pooled without discussion");
  }

  // humor — overlap type, use actual combo labels
  if (v.humor !== undefined) {
    const HUMOR_LABELS = ["absurd", "dry", "playful", "dark", "physical"];
    const humorStyles = pick2FromIndex(v.humor).map(i => HUMOR_LABELS[i]);
    pushBest(["humor"], `has a ${humorStyles.join(" or ")} sense of humour`);
    pushWorst(["humor"], "has a completely different comedic register with no overlap");
  }

  // intimacy — vulnerable ←→ quiet presence
  if (lo("intimacy")) {
    pushBest(["intimacy"], "wants to be fully known, vulnerability isn't scary to them");
    pushWorst(["intimacy"], "keeps emotional exposure to a minimum");
  }
  if (hi("intimacy")) pushBest(["intimacy"], "feels closest through quiet presence and acceptance rather than intense disclosure");

  // lovelang — overlap type, use actual labels
  if (v.lovelang !== undefined) {
    const langs = pick2FromIndex(v.lovelang).map(i => LOVELANG_LABELS[i]);
    if (langs.length) {
      pushBest(["lovelang"], `shows care through ${langs.join(" and ").toLowerCase()}`);
      pushWorst(["lovelang"], "shows care in ways that don't register as care to you");
    }
  }

  // admire — generous ←→ critical
  if (lo("admire")) {
    pushBest(["admire"], "extends generosity and gives people the benefit of the doubt by default");
    pushWorst(["admire"], "defaults to a critical read of people, especially under stress");
  }
  if (hi("admire")) {
    pushBest(["admire"], "sees people clearly and doesn't dress things up");
    pushWorst(["admire"], "extends unconditional warmth even when it isn't warranted");
  }

  // passion — passion-led ←→ connection-led
  if (lo("passion")) {
    pushBest(["passion"], "places physical chemistry and romantic intensity near the centre of the relationship");
    pushWorst(["passion"], "treats passion as a nice bonus rather than essential");
  }
  if (hi("passion")) pushBest(["passion"], "builds connection through consistency and warmth rather than intensity");

  // rhythm — frequent ←→ organic
  if (lo("rhythm")) {
    pushBest(["rhythm"], "checks in often and stays close even in the small moments");
    pushWorst(["rhythm"], "disappears for days without thinking anything of it");
  }
  if (hi("rhythm")) {
    pushBest(["rhythm"], "is comfortable with loose, low-pressure contact and doesn't need to check in constantly");
    pushWorst(["rhythm"], "needs daily check-ins to feel secure");
  }

  // stability — steady ←→ reactive
  if (lo("stability")) {
    pushBest(["stability"], "is emotionally steady, a reliable baseline when things get hard");
    pushWorst(["stability"], "is equally reactive, with no one anchoring the room");
  }
  if (hi("stability")) {
    pushBest(["stability"], "is emotionally expressive and feels things deeply");
    pushWorst(["stability"], "needs everything to be calm and reads any emotional intensity as a problem");
  }

  // values — exact type, check specific values
  const valLabels = ["shows up reliably, especially when it's hard",
                     "gives people space to be themselves without making it a project",
                     "pushes toward growth and wants to be pushed back",
                     "keeps things easy and low-pressure, no obligation for its own sake"];
  if (v.values !== undefined) {
    pushBest(["values"], valLabels[v.values]);
    if (v.values === 0) pushWorst(["values"], "treats commitment as optional and values keeping things loose");
    if (v.values === 1) pushWorst(["values"], "is in your business constantly and makes everything a project");
    if (v.values === 2) pushWorst(["values"], "has no interest in growing or being challenged");
    if (v.values === 3) pushWorst(["values"], "makes everything feel like a commitment and never just lets things be easy");
  }

  // worldview — faith-led ←→ secular
  if (lo("worldview")) {
    pushBest(["worldview"], "shares a faith-grounded framework for meaning");
    pushWorst(["worldview"], "has no interest in or patience for faith as part of life");
  }
  if (hi("worldview")) {
    pushBest(["worldview"], "is secular in how they make sense of things");
    pushWorst(["worldview"], "expects faith to structure daily life and major decisions");
  }

  // space — ordered ←→ relaxed
  if (lo("space")) {
    pushBest(["space"], "treats shared space as ordered and calm");
    pushWorst(["space"], "lives in permanent clutter and doesn't see why it matters");
  }
  if (hi("space")) {
    pushBest(["space"], "is relaxed about tidiness, home is lived-in");
    pushWorst(["space"], "needs the house spotless and feels anxious when it isn't");
  }

  // drive — achievement-driven ←→ lifestyle-led
  if (lo("drive")) {
    pushBest(["drive"], "is ambitious and career-oriented");
    pushWorst(["drive"], "treats work as a means to an end and has no real ambition");
  }
  if (hi("drive")) {
    pushBest(["drive"], "is lifestyle-led and doesn't let work take over");
    pushWorst(["drive"], "is defined by their ambition and has little patience for people who aren't");
  }

  // attach — profile-based
  const secHi  = v.attach_secure  !== undefined && v.attach_secure  >= 2;
  const anxHi  = v.attach_anxious !== undefined && v.attach_anxious >= 2;
  const avdHi  = v.attach_avoidant!== undefined && v.attach_avoidant>= 2;
  if (secHi && !anxHi && !avdHi) {
    pushBest(["attach_secure"], "is secure in relationships — doesn't need a lot of reassurance and doesn't run from closeness");
    pushWorst(["attach_secure"], "is very anxious or avoidant in relationships");
  }
  if (anxHi) {
    pushBest(["attach_anxious"], "will reach for closeness and make their needs known");
    pushWorst(["attach_anxious"], "is emotionally unavailable or pulls away when things get hard");
  }
  if (avdHi) {
    pushBest(["attach_avoidant"], "values their own space and won't demand more closeness than you can give");
    pushWorst(["attach_avoidant"], "smothers and leaves no room to breathe");
  }

  const sort = arr => arr.sort((a, b) => b.w - a.w).map(x => x.text);
  return { best: sort(best), worst: sort(worst) };
}

function growthLines(v) {
  const lines = [];

  // Check each GROWTH_VECTORS dim — if someone is "stretched", surface a line about it
  const stretched = [
    ["conflict",        d => v[d] !== undefined && v[d] >= 2,   v => v.conflict,        "You tend to avoid conflict rather than address it directly. Someone who stays calm and names things without making it an attack can shift what feels possible."],
    ["empathy",         d => v[d] !== undefined && v[d] >= 2,   v => v.empathy,         "You reach for practical solutions when someone's struggling rather than just being present. Someone who sits with things can expand that instinct."],
    ["auth",            d => v[d] !== undefined && v[d] >= 2,   v => v.auth,            "You take a long time to lower your guard. Being close to someone who is genuinely open — not as a performance — tends to make that easier over time."],
    ["boundaries",      d => v[d] !== undefined && v[d] >= 2,   v => v.boundaries,      "You absorb a lot before naming limits. Someone who sets boundaries without drama can make it easier to do the same."],
    ["attach_anxious",  d => v[d] !== undefined && v[d] >= 2,   v => v.attach_anxious,  "You carry anxiety into relationships — looking for signs, needing reassurance. A secure presence — consistent, not punishing — is one of the few things that actually shifts that pattern."],
    ["attach_avoidant", d => v[d] !== undefined && v[d] >= 2,   v => v.attach_avoidant, "You protect yourself with distance when things get close. Someone who is genuinely secure — not threatened by your space needs — can make it safer to stay present."],
    ["stability",       d => v[d] !== undefined && v[d] >= 2,   v => v.stability,       "You run reactive and feel things intensely. Being regularly around someone who doesn't escalate can quietly expand what regulated feels like from the inside."],
    ["differ",          d => v[d] !== undefined && v[d] <= 0.8, v => 3 - v.differ,      "You lean toward merger in relationships. Someone who holds their own identity without needing distance can show that closeness and selfhood aren't in conflict."],
  ];

  stretched
    .filter(([dim, isStretched]) => isStretched(dim))
    .sort((a, b) => b[2](v) - a[2](v))
    .slice(0, 3)
    .forEach(([,, , text]) => lines.push(text));

  return lines;
}

function renderFitSummary() {
  const container = document.getElementById("profile-fit");
  container.innerHTML = "";
  if (!state.myVector) return;

  const { best, worst } = fitLines(state.myVector);
  const growth = growthLines(state.myVector);

  if (!best.length && !worst.length && !growth.length) return;

  const bestBlock = best.length ? `
      <div class="fit-block fit-best">
        <div class="fit-heading">Likely to feel easy if they…</div>
        <ul class="fit-list">${best.map(l => `<li>${l}</li>`).join("")}</ul>
      </div>` : "";
  const worstBlock = worst.length ? `
      <div class="fit-block fit-worst">
        <div class="fit-heading">More friction likely if they…</div>
        <ul class="fit-list">${worst.map(l => `<li>${l}</li>`).join("")}</ul>
      </div>` : "";
  const growthBlock = growth.length ? `
      <div class="fit-block fit-growth">
        <div class="fit-heading">Where the right person could help you grow</div>
        <ul class="fit-list">${growth.map(l => `<li>${l}</li>`).join("")}</ul>
      </div>` : "";

  container.innerHTML = `<div class="fit-section">${bestBlock}${worstBlock}${growthBlock}</div>`;
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

const FRIENDSHIP_DIMS = new Set(["comm","conflict","energy","rhythm","empathy","humor","boundaries","stability","values","depth","auth","admire","direction","worldview"]);
const RELATIONSHIP_DIMS = new Set(["comm","conflict","energy","rhythm","empathy","humor","boundaries","stability","values","depth","auth","admire","direction","worldview","attach_profile","intimacy","lovelang","cconf","passion","differ","drive","space","finances","direction_children","roles","lifestyle"]);

function attachPersonBars(v) {
  if (!hasAttachmentProfile(v)) return "";
  const row = (label, val) => {
    const pct = Math.round((val / 3) * 100);
    return `<div class="attach-row"><span>${label}</span><div class="attach-mini-bg"><div class="attach-mini-fill" style="width:${pct}%"></div></div><span>${pct}%</span></div>`;
  };
  return row("Secure", v.attach_secure) + row("Anxious", v.attach_anxious) + row("Avoidant", v.attach_avoidant);
}

function renderDimCards(dims, sharedDims, v1, v2, containerId) {
  const el = document.getElementById(containerId);
  el.innerHTML = "";
  const sorted = sharedDims.slice().sort((a, b) => dims[b] - dims[a]);
  sorted.forEach(d => {
    const s = Math.round(dims[d] * 100);
    const color = s >= 65 ? "bar-hi" : s >= 40 ? "bar-mid" : "bar-lo";

    if (d === "attach_profile") {
      const ins = attachmentInsight(v1, v2);
      const insHtml = ins ? `<div class="dim-insight ${ins.type}"><span class="dynamic-label">Dynamic</span>${ins.text}</div>` : "";
      el.innerHTML += `
        <div class="dim-card">
          <div class="dim-card-header">
            <div class="rdim-label">Attachment</div>
            <div class="rdim-pct">${s}%</div>
          </div>
          <div class="rdim-bar-bg"><div class="rdim-bar-fill ${color}" style="width:${s}%"></div></div>
          ${insHtml}
        </div>`;
      return;
    }

    let ins = DIM_INSIGHTS[d] ? DIM_INSIGHTS[d](v1[d], v2[d], dims[d]) : null;
    if (ins && ins.type === "strength" && dims[d] < 0.5) ins = { type: "diff", text: ins.text, growth: ins.growth };
    const growthHtml = ins && ins.growth ? `<div class="dim-insight growth"><span class="growth-label">Growth</span>${ins.growth}</div>` : "";
    const insHtml = ins ? `<div class="dim-insight ${ins.type}"><span class="dynamic-label">Dynamic</span>${ins.text}</div>${growthHtml}` : "";
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

const tabScores = { friendship: null, relationship: null, growth: null };

function animateRing(id, pct) {
  const circumference = 326.7;
  const offset = circumference - (pct / 100) * circumference;
  const ring = document.getElementById(id);
  ring.style.strokeDashoffset = offset;
  ring.style.stroke = pct >= 76 ? "#c8b89a"
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
    setTimeout(() => animateRing("ring-fg", pct), 100);
  } else {
    document.getElementById("r-pct").textContent = "—";
    document.getElementById("r-lbl").textContent = "";
    setTimeout(() => animateRing("ring-fg", 0), 100);
  }

  const growth = tabScores.growth;
  if (growth !== null) {
    document.getElementById("r-growth-pct").textContent = growth.score + "%";
    document.getElementById("r-growth-lbl").textContent = growth.label;
    setTimeout(() => animateRing("ring-growth-fg", growth.score), 100);
  } else {
    document.getElementById("r-growth-pct").textContent = "—";
    document.getElementById("r-growth-lbl").textContent = "";
    setTimeout(() => animateRing("ring-growth-fg", 0), 100);
  }
}

function renderResult(v1, v2) {
  const result = calcCompat(v1, v2);
  if (!result) return;

  showScreen("screen-result");

  tabScores.growth = result.growth;

  // Friendship dims + score
  const friendshipDims = result.sharedDims.filter(d => FRIENDSHIP_DIMS.has(d));
  tabScores.friendship = friendshipDims.length
    ? Math.round(friendshipDims.reduce((s, d) => s + result.dims[d] * (DIM_WEIGHTS[d] || 1), 0) / friendshipDims.reduce((s, d) => s + (DIM_WEIGHTS[d] || 1), 0) * 100)
    : null;
  renderDimCards(result.dims, friendshipDims, v1, v2, "r-dims-friendship");

  const allCombos = COMBO_INSIGHTS.map(fn => fn(v1, v2)).filter(Boolean);
  const growthCombos = result.growth.combos || [];
  const friendshipCombos = allCombos.filter(ins => ins.tab === "friendship");
  const friendshipInsightsEl = document.getElementById("r-insights-friendship");
  let friendshipHtml = "";
  if (friendshipCombos.length) {
    friendshipHtml += `<div class="combo-header">Also worth knowing</div>` +
      friendshipCombos.map(ins => `<div class="insight ${ins.type}">${ins.text}</div>`).join("");
  }
  if (growthCombos.length) {
    friendshipHtml += `<div class="combo-header">Growth potential</div>` +
      growthCombos.map(c => `<div class="insight growth-combo">${c.text}</div>`).join("");
  }
  friendshipInsightsEl.innerHTML = friendshipHtml;

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
    let relationshipHtml = "";
    if (allCombos.length) {
      relationshipHtml += `<div class="combo-header">Also worth knowing</div>` +
        allCombos.map(ins => `<div class="insight ${ins.type}">${ins.text}</div>`).join("");
    }
    if (growthCombos.length) {
      relationshipHtml += `<div class="combo-header">Growth potential</div>` +
        growthCombos.map(c => `<div class="insight growth-combo">${c.text}</div>`).join("");
    }
    rInsightsEl.innerHTML = relationshipHtml;
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
  migrateStorage();
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
      // restore saved answers without overwriting them
      const savedAnswers = localStorage.getItem("matchme_answers");
      if (savedAnswers) state.answers = JSON.parse(savedAnswers);
      const hadDating = localStorage.getItem("matchme_allQ_dating");
      if (hadDating === "true") state.allQ = [...QUESTIONS_CORE, ...QUESTIONS_DATING];
      localStorage.setItem("matchme_code", meCode);
      localStorage.setItem("matchme_vector", JSON.stringify(vec));
      renderProfile();
      return;
    }
  }

  const hasProfile = loadState();
  if (hasProfile) renderProfile();
})();
