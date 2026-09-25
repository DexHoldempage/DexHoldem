const header = document.querySelector(".site-header");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const scriptAssetRoot = document.currentScript?.dataset.assetRoot || "";

function getLocalSection(link) {
  const href = link.getAttribute("href") || "";
  if (!href.startsWith("#")) return null;
  return document.querySelector(href);
}

const sections = navLinks
  .map(getLocalSection)
  .filter(Boolean);

function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 28);
}

function updateActiveNav() {
  const offset = window.scrollY + 140;
  let activeId = sections[0]?.id;

  for (const section of sections) {
    if (section.offsetTop <= offset) {
      activeId = section.id;
    }
  }

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
  });
}

window.addEventListener("scroll", () => {
  updateHeader();
  updateActiveNav();
}, { passive: true });

updateHeader();
updateActiveNav();

const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
const leaderboardRows = Array.from(document.querySelectorAll("#leaderboard tbody tr"));

filterButtons.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    leaderboardRows.forEach((row) => {
      const matches = filter === "all" || row.dataset.family === filter;
      row.classList.toggle("is-hidden", !matches);
    });
  });
});

const policyDemoVideos = [
  { id: "act_pick_up_right_fail", model: "ACT", family: "From-scratch", task: "Pick up right card", condition: "Standard", outcome: "Fail" },
  { id: "act_pull_100_disruptive_fail", model: "ACT", family: "From-scratch", task: "Pull 100 chip", condition: "Disruptive", outcome: "Fail" },
  { id: "act_push_100_success", model: "ACT", family: "From-scratch", task: "Push 100 chip", condition: "Standard", outcome: "Success" },
  { id: "act_show_right_disruptive_fail", model: "ACT", family: "From-scratch", task: "Show right card", condition: "Disruptive", outcome: "Fail" },
  { id: "baku_pick_up_left_success", model: "BAKU", family: "From-scratch", task: "Pick up left card", condition: "Standard", outcome: "Success" },
  { id: "baku_pull_10_fail", model: "BAKU", family: "From-scratch", task: "Pull 10 chip", condition: "Standard", outcome: "Fail" },
  { id: "baku_push_10_fail", model: "BAKU", family: "From-scratch", task: "Push 10 chip", condition: "Standard", outcome: "Fail" },
  { id: "baku_push_5_fail", model: "BAKU", family: "From-scratch", task: "Push 5 chip", condition: "Standard", outcome: "Fail" },
  { id: "baku_put_down_left_success", model: "BAKU", family: "From-scratch", task: "Put down left card", condition: "Standard", outcome: "Success" },
  { id: "dp_trans_pick_up_left_fail", model: "DP-Transformer", family: "From-scratch", task: "Pick up left card", condition: "Standard", outcome: "Fail" },
  { id: "dp_trans_pull_10_disruptive_success", model: "DP-Transformer", family: "From-scratch", task: "Pull 10 chip", condition: "Disruptive", outcome: "Success" },
  { id: "dp_trans_push_10_disruptive_fail", model: "DP-Transformer", family: "From-scratch", task: "Push 10 chip", condition: "Disruptive", outcome: "Fail" },
  { id: "dp_unet_disruptive_fail", model: "DP-UNet", family: "From-scratch", task: "Disruptive rollout", condition: "Disruptive", outcome: "Fail" },
  { id: "dp_unet_fail", model: "DP-UNet", family: "From-scratch", task: "Standard rollout", condition: "Standard", outcome: "Fail" },
  { id: "dpdino_pick_up_left_success", model: "DP (DINO)", family: "From-scratch", task: "Pick up left card", condition: "Standard", outcome: "Success" },
  { id: "dpdino_pull_5_success", model: "DP (DINO)", family: "From-scratch", task: "Pull 5 chip", condition: "Standard", outcome: "Success" },
  { id: "dpdino_push_5_fail", model: "DP (DINO)", family: "From-scratch", task: "Push 5 chip", condition: "Standard", outcome: "Fail" },
  { id: "dpdino_put_down_left_success", model: "DP (DINO)", family: "From-scratch", task: "Put down left card", condition: "Standard", outcome: "Success" },
  { id: "pi0.5_pick_left_card_fail", model: "pi0.5", family: "Pretrained", task: "Pick left card", condition: "Standard", outcome: "Fail" },
  { id: "pi0.5_pick_right_card_success", model: "pi0.5", family: "Pretrained", task: "Pick right card", condition: "Standard", outcome: "Success" },
  { id: "pi0.5_pull_5_disruptive_fail", model: "pi0.5", family: "Pretrained", task: "Pull 5 chip", condition: "Disruptive", outcome: "Fail" },
  { id: "pi0.5_pull_5_fail", model: "pi0.5", family: "Pretrained", task: "Pull 5 chip", condition: "Standard", outcome: "Fail" },
  { id: "pi0.5_push_50_disruptive_success", model: "pi0.5", family: "Pretrained", task: "Push 50 chip", condition: "Disruptive", outcome: "Success" },
  { id: "pi0.5_put_down_right_disruptive_success", model: "pi0.5", family: "Pretrained", task: "Put down right card", condition: "Disruptive", outcome: "Success" },
  { id: "pi0_lift_left_card_success", model: "pi0", family: "Pretrained", task: "Lift left card", condition: "Standard", outcome: "Success" },
  { id: "pi0_pull_100_fail", model: "pi0", family: "Pretrained", task: "Pull 100 chip", condition: "Standard", outcome: "Fail" },
  { id: "pi0_push_10_fail", model: "pi0", family: "Pretrained", task: "Push 10 chip", condition: "Standard", outcome: "Fail" },
  { id: "pi0_put_down_left_card_success", model: "pi0", family: "Pretrained", task: "Put down left card", condition: "Standard", outcome: "Success" },
  { id: "rdt_ft_pick_up_left_fail", model: "RDT", family: "Pretrained", task: "Pick up left card", condition: "Standard", outcome: "Fail" },
  { id: "rdt_ft_pull_50_success", model: "RDT", family: "Pretrained", task: "Pull 50 chip", condition: "Standard", outcome: "Success" },
  { id: "rdt_ft_push_100_fail", model: "RDT", family: "Pretrained", task: "Push 100 chip", condition: "Standard", outcome: "Fail" },
  { id: "rdt_ft_show_left_success", model: "RDT", family: "Pretrained", task: "Show left card", condition: "Standard", outcome: "Success" },
  { id: "rdt_small_pick_up_left_disruptive_fail", model: "RDT-small", family: "From-scratch", task: "Pick up left card", condition: "Disruptive", outcome: "Fail" },
  { id: "rdt_small_pull_5_disruptive_fail", model: "RDT-small", family: "From-scratch", task: "Pull 5 chip", condition: "Disruptive", outcome: "Fail" },
  { id: "rdt_small_push_10_fail", model: "RDT-small", family: "From-scratch", task: "Push 10 chip", condition: "Standard", outcome: "Fail" },
  { id: "rdt_small_put_down_left_success", model: "RDT-small", family: "From-scratch", task: "Put down left card", condition: "Standard", outcome: "Success" },
];

const policyVideoGrid = document.getElementById("policy-video-grid");
const policyModelFilter = document.getElementById("policy-model-filter");
const policyOutcomeFilter = document.getElementById("policy-outcome-filter");
const policyVideoCount = document.getElementById("policy-video-count");

function appendText(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function renderPolicyVideoCard(demo) {
  const card = document.createElement("article");
  card.className = "policy-video-card";
  card.dataset.model = demo.model;
  card.dataset.outcome = demo.outcome;

  const video = document.createElement("video");
  video.controls = true;
  video.preload = "none";
  video.playsInline = true;
  video.poster = `${scriptAssetRoot}assets/videos/policy-bench/posters/${demo.id}.jpg`;
  video.setAttribute("aria-label", `${demo.model} ${demo.task} ${demo.condition} ${demo.outcome}`);

  const source = document.createElement("source");
  source.src = `${scriptAssetRoot}assets/videos/policy-bench/${demo.id}.mp4`;
  source.type = "video/mp4";
  video.append(source);
  card.append(video);

  const copy = document.createElement("div");
  copy.className = "policy-video-copy";

  const topline = document.createElement("div");
  topline.className = "policy-video-topline";
  appendText(topline, "span", "policy-model", demo.model);
  appendText(topline, "span", `outcome-badge ${demo.outcome.toLowerCase()}`, demo.outcome);
  copy.append(topline);

  appendText(copy, "h4", "", demo.task);

  const tags = document.createElement("div");
  tags.className = "policy-video-tags";
  appendText(tags, "span", `condition-badge ${demo.condition.toLowerCase()}`, demo.condition);
  appendText(tags, "span", "condition-badge", demo.family);
  copy.append(tags);

  const sourceName = appendText(copy, "code", "source-name", `${demo.id}.MOV`);
  sourceName.title = `${demo.id}.MOV`;

  card.append(copy);
  return card;
}

function updatePolicyVideoFilter() {
  if (!policyVideoGrid) return;

  const model = policyModelFilter?.value || "all";
  const outcome = policyOutcomeFilter?.value || "all";
  let visibleCount = 0;

  policyVideoGrid.querySelectorAll(".policy-video-card").forEach((card) => {
    const matchesModel = model === "all" || card.dataset.model === model;
    const matchesOutcome = outcome === "all" || card.dataset.outcome === outcome;
    const isVisible = matchesModel && matchesOutcome;
    card.classList.toggle("is-hidden", !isVisible);
    if (isVisible) visibleCount += 1;
  });

  if (policyVideoCount) {
    policyVideoCount.value = `${visibleCount} / ${policyDemoVideos.length} videos`;
  }
}

if (policyVideoGrid && policyModelFilter && policyOutcomeFilter) {
  policyModelFilter.append(new Option("All models", "all"));
  Array.from(new Set(policyDemoVideos.map((demo) => demo.model))).forEach((model) => {
    policyModelFilter.append(new Option(model, model));
  });

  policyDemoVideos.forEach((demo) => {
    const card = renderPolicyVideoCard(demo);
    const video = card.querySelector("video");
    video.addEventListener("play", () => {
      policyVideoGrid.querySelectorAll("video").forEach((other) => {
        if (other !== video) other.pause();
      });
    });
    policyVideoGrid.append(card);
  });

  policyModelFilter.addEventListener("change", updatePolicyVideoFilter);
  policyOutcomeFilter.addEventListener("change", updatePolicyVideoFilter);
  updatePolicyVideoFilter();
}

const P19_STATES = [
  {id:"s0",stage:"idle",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":4,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":0,"10":0,"50":0,"100":0}},
  {id:"s1",stage:"acting",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s2",stage:"acting",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s3",stage:"acting",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s4",stage:"acting",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s5",stage:"atom_idle",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s6",stage:"acting",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s7",stage:"acting",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s8",stage:"idle",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s9",stage:"idle",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s10",stage:"acting",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s11",stage:"acting",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s12",stage:"acting",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s13",stage:"atom_idle",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s14",stage:"atom_idle",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s15",stage:"atom_idle",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s16",stage:"acting",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s17",stage:"acting",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s18",stage:"idle",blind:"big blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s19",stage:"acting",blind:"big_blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s20",stage:"acting",blind:"big_blind",turn:true,community:[],my_chips:{"5":4,"10":4,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":0,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s21",stage:"idle",blind:"big_blind",turn:false,community:[],my_chips:{"5":4,"10":3,"50":4,"100":4},opp_chips:{"5":3,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":1,"50":0,"100":0},opp_bet:{"5":1,"10":0,"50":0,"100":0}},
  {id:"s22",stage:"idle",blind:"big_blind",turn:false,community:[],my_chips:{"5":4,"10":3,"50":4,"100":4},opp_chips:{"5":2,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":1,"50":0,"100":0},opp_bet:{"5":2,"10":0,"50":0,"100":0}},
  {id:"s23",stage:"acting",blind:"big_blind",turn:true,community:["7d","6s","Jc"],my_chips:{"5":4,"10":3,"50":4,"100":4},opp_chips:{"5":2,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":1,"50":0,"100":0},opp_bet:{"5":2,"10":0,"50":0,"100":0}},
  {id:"s24",stage:"acting",blind:"big_blind",turn:true,community:["7d","6s","Jc"],my_chips:{"5":4,"10":3,"50":4,"100":4},opp_chips:{"5":2,"10":4,"50":4,"100":4},my_bet:{"5":0,"10":1,"50":0,"100":0},opp_bet:{"5":2,"10":0,"50":0,"100":0}},
  {id:"s25",stage:"idle",blind:"big_blind",turn:true,community:["7d","6s","Jc"],my_chips:{"5":4,"10":3,"50":4,"100":3},opp_chips:{"5":2,"10":4,"50":3,"100":3},my_bet:{"5":0,"10":1,"50":0,"100":1},opp_bet:{"5":2,"10":0,"50":1,"100":1}},
  {id:"s26",stage:"acting",blind:"big_blind",turn:true,community:["7d","6s","Jc"],my_chips:{"5":4,"10":3,"50":4,"100":3},opp_chips:{"5":2,"10":4,"50":3,"100":3},my_bet:{"5":0,"10":1,"50":0,"100":1},opp_bet:{"5":2,"10":0,"50":1,"100":1}},
  {id:"s27",stage:"acting",blind:"big_blind",turn:true,community:["7d","6s","Jc"],my_chips:{"5":4,"10":3,"50":4,"100":3},opp_chips:{"5":2,"10":4,"50":3,"100":3},my_bet:{"5":0,"10":1,"50":0,"100":1},opp_bet:{"5":2,"10":0,"50":1,"100":1}},
  {id:"s28",stage:"idle",blind:"big_blind",turn:true,community:["Qh","7d","6s","Jc"],my_chips:{"5":4,"10":3,"50":3,"100":3},opp_chips:{"5":2,"10":4,"50":3,"100":3},my_bet:{"5":0,"10":1,"50":1,"100":1},opp_bet:{"5":2,"10":0,"50":1,"100":1}},
  {id:"s29",stage:"acting",blind:"big_blind",turn:true,community:["Qh","7d","6s","Jc"],my_chips:{"5":4,"10":3,"50":3,"100":3},opp_chips:{"5":2,"10":4,"50":3,"100":3},my_bet:{"5":0,"10":1,"50":1,"100":1},opp_bet:{"5":2,"10":0,"50":1,"100":1}},
  {id:"s30",stage:"acting",blind:"big_blind",turn:true,community:["Qh","7d","6s","Jc"],my_chips:{"5":4,"10":3,"50":3,"100":3},opp_chips:{"5":2,"10":4,"50":3,"100":3},my_bet:{"5":0,"10":1,"50":1,"100":1},opp_bet:{"5":2,"10":0,"50":1,"100":1}},
  {id:"s31",stage:"idle",blind:"big_blind",turn:true,community:["Qh","7d","6s","Jc"],my_chips:{"5":4,"10":3,"50":3,"100":2},opp_chips:{"5":2,"10":4,"50":3,"100":3},my_bet:{"5":0,"10":1,"50":1,"100":2},opp_bet:{"5":2,"10":0,"50":1,"100":1}},
  {id:"s32",stage:"win",blind:"big_blind",turn:true,community:["Qh","7d","6s","Jc"],my_chips:{"5":4,"10":3,"50":3,"100":2},opp_chips:{"5":2,"10":4,"50":3,"100":3},my_bet:{"5":0,"10":1,"50":1,"100":2},opp_bet:{"5":2,"10":0,"50":1,"100":1}},
];

const problemTimeline = document.getElementById("problem-timeline");
const problemPreviewImg = document.getElementById("problem-preview-img");
const problemStateInfo = document.getElementById("problem-state-info");
const problemPreviewNote = document.getElementById("problem-preview-note");

if (problemTimeline && problemPreviewImg && problemStateInfo) {
  let activeIndex = 0;

  function formatChips(chips) {
    const parts = [];
    for (const denom of ["5", "10", "50", "100"]) {
      const count = chips[denom] || 0;
      if (count > 0) parts.push(`${denom}×${count}`);
    }
    return parts.length ? parts.join("  ") : "—";
  }

  const LAST = P19_STATES.length - 1;
  const FIELDS = ["Stage", "Blind", "Turn", "Community", "My bet", "Opp bet", "My chips", "Opp chips"];

  function renderStateInfo(state) {
    const stage = state.stage.replace("_", " ");
    const stageClass = state.stage;
    const community = state.community.length ? state.community.join(" ") : "—";
    const turn = state.turn ? "Robot" : "Opponent";

    problemStateInfo.innerHTML =
      `<div class="state-field"><span class="state-field-label">State</span><span class="state-field-value">${state.id}</span></div>` +
      `<div class="state-field"><span class="state-field-label">Stage</span><span class="state-field-value"><span class="stage-badge ${stageClass}">${stage}</span></span></div>` +
      `<div class="state-field"><span class="state-field-label">Blind</span><span class="state-field-value">${state.blind}</span></div>` +
      `<div class="state-field"><span class="state-field-label">Turn</span><span class="state-field-value">${turn}</span></div>` +
      `<div class="state-field"><span class="state-field-label">Community</span><span class="state-field-value">${community}</span></div>` +
      `<div class="state-field"><span class="state-field-label">My bet</span><span class="state-field-value">${formatChips(state.my_bet)}</span></div>` +
      `<div class="state-field"><span class="state-field-label">Opp bet</span><span class="state-field-value">${formatChips(state.opp_bet)}</span></div>` +
      `<div class="state-field"><span class="state-field-label">My chips</span><span class="state-field-value">${formatChips(state.my_chips)}</span></div>` +
      `<div class="state-field"><span class="state-field-label">Opp chips</span><span class="state-field-value">${formatChips(state.opp_chips)}</span></div>`;
  }

  function renderTargetPrompt(state) {
    let html = `<div class="target-prompt-header">Current state &mdash; predict from this observation</div>`;
    html += `<div class="state-field"><span class="state-field-label">State</span><span class="state-field-value">${state.id} (target)</span></div>`;
    for (const f of FIELDS) {
      html += `<div class="state-field"><span class="state-field-label">${f}</span><span class="state-field-value state-field-hidden">?</span></div>`;
    }
    html += `<div class="target-prompt-note">The perceiver receives this agent-view capture plus the ${LAST} predecessor states as context, and must output the complete structured state.</div>`;
    problemStateInfo.innerHTML = html;
  }

  function selectState(index) {
    activeIndex = index;
    const state = P19_STATES[index];
    problemPreviewImg.src = `assets/images/perception-problem/${state.id}.jpg`;
    problemPreviewImg.alt = `Agent view for state ${state.id}`;

    if (index === LAST) {
      renderTargetPrompt(state);
      problemStateInfo.classList.add("is-target");
      if (problemPreviewNote) {
        problemPreviewNote.innerHTML = "<strong>Notes for reader:</strong> In this state, the core challenge is to recognize that the opponent folds, hence judging the stage to <em>win</em>. Community cards, chips, bets, turn and blind info can be inherited from predecessor.";
        problemPreviewNote.hidden = false;
      }
    } else {
      renderStateInfo(state);
      problemStateInfo.classList.remove("is-target");
      if (problemPreviewNote) {
        problemPreviewNote.hidden = true;
      }
    }

    problemTimeline.querySelectorAll(".state-dot").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  }

  P19_STATES.forEach((state, i) => {
    const dot = document.createElement("button");
    dot.className = "state-dot" + (i === LAST ? " state-dot-target" : "");
    dot.type = "button";
    dot.dataset.stage = state.stage;
    dot.setAttribute("role", "option");
    dot.setAttribute("aria-label", i === LAST ? `${state.id}: target state (predict this)` : `${state.id}: ${state.stage}`);
    dot.addEventListener("mouseenter", () => selectState(i));
    dot.addEventListener("click", () => selectState(i));
    problemTimeline.append(dot);
  });

  selectState(LAST);
}

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;

    try {
      await navigator.clipboard.writeText(target.innerText.trim());
      button.textContent = "Copied";
      button.classList.add("copied");
      window.setTimeout(() => {
        button.textContent = "Copy";
        button.classList.remove("copied");
      }, 1600);
    } catch {
      button.textContent = "Select";
      target.focus?.();
    }
  });
});
