let api;
let tabsConfig;

// wczytaj konfigurację
fetch("config.json")
  .then(response => response.json())
  .then(data => {
    tabsConfig = data.tabs;
    populateSelector();
    loadTab(tabsConfig[0].file); // domyślny pierwszy tab
    changeYoutubeURL(tabsConfig[0])
  })
  .catch(err => console.error("Failed to load config.json:", err));

function populateSelector() {
  const selector = document.getElementById("tabSelector");
  tabsConfig.forEach(tab => {
    const option = document.createElement("option");
    option.value = tab.file;
    option.textContent = tab.title;
    selector.appendChild(option);
  });

  selector.addEventListener("change", () => {
    loadTab(selector.value);
    configItem = tabsConfig.find((item) => item.file === selector.value)
    changeYoutubeURL(configItem)
  });
}

function loadTab(file) {
  if (api) api.dispose();

  const container = document.getElementById('alphaTab');
  
  api = new alphaTab.AlphaTabApi(container, {
    display: {
        staveProfile: 3 // Ustawiamy to już w konfiguracji startowej
    },
    player: {
        enablePlayer: true,
        enableCursor: true,
        soundFont: "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2"
    }
  });

  fetch(file)
    .then(response => response.text())
    .then(texData => {
      api.tex(texData);
    })
    .catch(err => console.error("Błąd:", err));
}

function changeYoutubeURL (configItem) {
  const youtubeLink = document.getElementById('youtube-link')
    if (youtubeLink) {

      youtubeLink.href = configItem.youtube_url
      youtubeLink.textContent = configItem.youtube_url
    }
}

document.getElementById("playBtn").addEventListener("click", () => api.play());
document.getElementById("pauseBtn").addEventListener("click", () => api.pause());
