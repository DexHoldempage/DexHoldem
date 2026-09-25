const datasetVideoSamples = [
  { task: "pick_up_left", label: "Pick up left card", group: "card", sizeBytes: 437534065 },
  { task: "pick_up_right", label: "Pick up right card", group: "card", sizeBytes: 374880446 },
  { task: "put_down_left", label: "Put down left card", group: "card", sizeBytes: 357126222 },
  { task: "put_down_right", label: "Put down right card", group: "card", sizeBytes: 185877805 },
  { task: "show_left", label: "Show left card", group: "card", sizeBytes: 121314581 },
  { task: "show_right", label: "Show right card", group: "card", sizeBytes: 134374080 },
  { task: "push_5", label: "Push 5 chip", group: "chip", sizeBytes: 245675298 },
  { task: "push_10", label: "Push 10 chip", group: "chip", sizeBytes: 562513469 },
  { task: "push_50", label: "Push 50 chip", group: "chip", sizeBytes: 581024100 },
  { task: "push_100", label: "Push 100 chip", group: "chip", sizeBytes: 398059812 },
  { task: "pull_5", label: "Pull 5 chip", group: "chip", sizeBytes: 271870374 },
  { task: "pull_10", label: "Pull 10 chip", group: "chip", sizeBytes: 255470222 },
  { task: "pull_50", label: "Pull 50 chip", group: "chip", sizeBytes: 430477545 },
  { task: "pull_100", label: "Pull 100 chip", group: "chip", sizeBytes: 342680284 },
];

const cameraLabels = ["Camera 0", "Camera 1", "Camera 2"];

function datasetAppendText(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function formatDatasetBytes(bytes) {
  if (!Number.isFinite(bytes)) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function rawEpisodePath(sample) {
  return `${sample.task}/data_0001.npz`;
}

function renderCameraPanel(sample, cameraIndex) {
  const panel = document.createElement("figure");
  panel.className = "dataset-camera-panel";

  const mediaWrap = document.createElement("div");
  mediaWrap.className = "dataset-camera-media";

  const video = document.createElement("video");
  video.controls = true;
  video.preload = "metadata";
  video.playsInline = true;
  video.poster = `../assets/videos/dataset-samples/${sample.task}/poster_cam${cameraIndex}.jpg`;
  video.setAttribute("aria-label", `${sample.label} ${cameraLabels[cameraIndex]}`);

  const source = document.createElement("source");
  source.src = `../assets/videos/dataset-samples/${sample.task}/cam${cameraIndex}.mp4`;
  source.type = "video/mp4";
  video.append(source);

  const missing = document.createElement("div");
  missing.className = "dataset-video-missing";
  missing.hidden = true;
  missing.innerHTML = `<strong>Preview missing</strong><span>Generate cam${cameraIndex}.mp4 for this task.</span>`;

  function markMissing() {
    panel.classList.add("is-missing");
    missing.hidden = false;
  }

  source.addEventListener("error", markMissing);
  video.addEventListener("error", markMissing);
  video.addEventListener("loadedmetadata", () => {
    panel.classList.remove("is-missing");
    missing.hidden = true;
  });

  mediaWrap.append(video, missing);
  panel.append(mediaWrap);

  const caption = document.createElement("figcaption");
  datasetAppendText(caption, "strong", "", cameraLabels[cameraIndex]);
  datasetAppendText(caption, "span", "", `images_cam${cameraIndex}`);
  panel.append(caption);

  return { panel, video };
}

function renderTaskCard(sample) {
  const card = document.createElement("article");
  card.className = "dataset-task-card";
  card.dataset.task = sample.task;
  card.dataset.group = sample.group;
  card.dataset.label = sample.label.toLowerCase();

  const header = document.createElement("div");
  header.className = "dataset-task-header";

  const titleWrap = document.createElement("div");
  datasetAppendText(titleWrap, "p", "dataset-task-kicker", sample.group === "card" ? "Card Primitive" : "Chip Primitive");
  datasetAppendText(titleWrap, "h3", "", sample.label);
  datasetAppendText(titleWrap, "code", "source-name", rawEpisodePath(sample));
  header.append(titleWrap);

  const meta = document.createElement("dl");
  meta.className = "dataset-task-meta";
  [
    ["Episode", "data_0001"],
    ["Raw Size", formatDatasetBytes(sample.sizeBytes)],
    ["RGB Views", "3"],
  ].forEach(([term, value]) => {
    const item = document.createElement("div");
    datasetAppendText(item, "dt", "", term);
    datasetAppendText(item, "dd", "", value);
    meta.append(item);
  });
  header.append(meta);

  card.append(header);

  const cameraGrid = document.createElement("div");
  cameraGrid.className = "dataset-camera-grid";
  const videos = [];
  for (let index = 0; index < 3; index += 1) {
    const { panel, video } = renderCameraPanel(sample, index);
    cameraGrid.append(panel);
    videos.push(video);
  }
  card.append(cameraGrid);

  const actions = document.createElement("div");
  actions.className = "dataset-task-actions";

  const playButton = document.createElement("button");
  playButton.type = "button";
  playButton.className = "filter-button";
  playButton.textContent = "Play 3 cameras";
  playButton.addEventListener("click", async () => {
    videos.forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });
    for (const video of videos) {
      try {
        await video.play();
      } catch {
        break;
      }
    }
  });
  actions.append(playButton);

  card.append(actions);
  return card;
}

const taskList = document.getElementById("dataset-task-list");
const taskSearch = document.getElementById("dataset-task-search");
const taskGroup = document.getElementById("dataset-task-group");
const taskCount = document.getElementById("dataset-task-count");

function updateDatasetTaskFilter() {
  if (!taskList) return;

  const query = (taskSearch?.value || "").trim().toLowerCase();
  const group = taskGroup?.value || "all";
  let visibleCount = 0;

  taskList.querySelectorAll(".dataset-task-card").forEach((card) => {
    const matchesQuery = !query || card.dataset.task.includes(query) || card.dataset.label.includes(query);
    const matchesGroup = group === "all" || card.dataset.group === group;
    const isVisible = matchesQuery && matchesGroup;
    card.classList.toggle("is-hidden", !isVisible);
    if (isVisible) visibleCount += 1;
  });

  if (taskCount) {
    taskCount.value = `${visibleCount} / ${datasetVideoSamples.length} tasks`;
  }
}

if (taskList) {
  datasetVideoSamples.forEach((sample) => {
    taskList.append(renderTaskCard(sample));
  });

  taskSearch?.addEventListener("input", updateDatasetTaskFilter);
  taskGroup?.addEventListener("change", updateDatasetTaskFilter);
  updateDatasetTaskFilter();
}
