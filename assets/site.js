const chapterOrder = ["intro", "schedule", "fee", "venue", "contact"];
const chapterLabels = {
  intro: "홈",
  schedule: "일정",
  fee: "참가비",
  venue: "장소",
  contact: "안내"
};

const tabs = Array.from(document.querySelectorAll("[data-chapter]"));
const panels = Array.from(document.querySelectorAll("[data-panel]"));
const countEl = document.getElementById("chapterCount");
const nameEl = document.getElementById("chapterName");
const progressBar = document.getElementById("progressBar");
const prevButton = document.getElementById("prevChapter");
const nextButton = document.getElementById("nextChapter");
let currentIndex = 0;

function setChapter(target, updateHash = true) {
  const nextIndex = typeof target === "number" ? target : chapterOrder.indexOf(target);
  if (nextIndex < 0 || nextIndex >= chapterOrder.length) return;

  currentIndex = nextIndex;
  const activeKey = chapterOrder[currentIndex];

  panels.forEach((panel) => {
    const active = panel.dataset.panel === activeKey;
    panel.hidden = !active;
    panel.setAttribute("aria-hidden", String(!active));
  });

  tabs.forEach((tab) => {
    const active = tab.dataset.chapter === activeKey;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  countEl.textContent = String(currentIndex + 1).padStart(2, "0") + " / " + String(chapterOrder.length).padStart(2, "0");
  nameEl.textContent = chapterLabels[activeKey];
  progressBar.style.width = ((currentIndex + 1) / chapterOrder.length * 100) + "%";
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === chapterOrder.length - 1;

  if (updateHash) history.replaceState(null, "", "#" + activeKey);
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setChapter(tab.dataset.chapter));
});

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => setChapter(button.dataset.go));
});

prevButton.addEventListener("click", () => setChapter(currentIndex - 1));
nextButton.addEventListener("click", () => setChapter(currentIndex + 1));

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") setChapter(currentIndex + 1);
  if (event.key === "ArrowLeft") setChapter(currentIndex - 1);
});

document.querySelectorAll("[data-part]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.part;
    document.querySelectorAll("[data-part]").forEach((partButton) => {
      const active = partButton.dataset.part === key;
      partButton.classList.toggle("is-active", active);
      partButton.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll("[data-part-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.partPanel !== key;
    });
  });
});

const initialKey = location.hash.replace("#", "");
setChapter(chapterOrder.includes(initialKey) ? initialKey : "intro", false);
