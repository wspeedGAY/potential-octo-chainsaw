(function() {
  if (document.getElementById("gd-container")) return;
   let openInNewTab = false;

  const container = document.createElement("div");
  container.id = "gd-container";
  container.style.cssText = `
    position: fixed;
    bottom: 20px; right: 20px;
    width: 480px; height: 360px;
    background: white; border: 2px solid black;
    z-index: 999999; display: flex; flex-direction: column;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    overflow: hidden; transform: scale(0.5);
    opacity: 0; transition: transform 0.3s, opacity 0.3s, width 0.3s, height 0.3s;
    left: auto; top: auto;
  `;

    const audio = document.createElement("audio"); let lastAudioTime = 0;
    audio.src = "https://drive.google.com/uc?export=download&id=14FRtf-DZnNEziFnay-xeYbEw3MjGLLXY";
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = "auto";

  const header = document.createElement("div");
  header.style.cssText = `
    background: #333; color: white; padding: 5px 10px;
    cursor: move; user-select: none;
    display: flex; justify-content: space-between; align-items: center;
  `;

  const leftControls = document.createElement("div");
  const resizeLabel = document.createElement("span");
  resizeLabel.textContent = "Resize:";
  resizeLabel.style.marginRight = "5px";

  const resizePlus = document.createElement("button");
  resizePlus.textContent = "+";
  resizePlus.style.cssText = "margin-right:2px;cursor:pointer;";

  const resizeMinus = document.createElement("button");
  resizeMinus.textContent = "–";
  resizeMinus.style.cssText = "margin-right:10px;cursor:pointer;";

  let isCollapsed = false;
  resizePlus.onclick = () => {
    if (!isCollapsed) {
      container.style.width = container.offsetWidth + 50 + "px";
      container.style.height = container.offsetHeight + 30 + "px";
    }
  };
  resizeMinus.onclick = () => {
    if (!isCollapsed) {
      container.style.width = Math.max(200, container.offsetWidth - 50) + "px";
      container.style.height = Math.max(150, container.offsetHeight - 30) + "px";
    }
  };

  leftControls.append(resizeLabel, resizePlus, resizeMinus);

  const titleSpan = document.createElement("span");
  titleSpan.textContent = "Main Menu";
  titleSpan.style.cssText = "flex-grow:1; text-align:center;";

  const buttonContainer = document.createElement("div");

  const collapseBtn = document.createElement("button");
  collapseBtn.textContent = "-";
  collapseBtn.style.cssText = "margin-left:5px;cursor:pointer;";

  collapseBtn.onclick = () => {
    if (!isCollapsed) {
      contentWrapper.style.opacity = "0";
      contentWrapper.style.pointerEvents = "none";
      container.style.height = header.offsetHeight + "px";
      audio.pause();
    } else {
      contentWrapper.style.opacity = "1";
      contentWrapper.style.pointerEvents = "auto";
      container.style.height = originalStyles.height;
      if (!iframeVisible()) audio.play();
    }
    isCollapsed = !isCollapsed;
  };

  const fullscreenBtn = document.createElement("button");
  fullscreenBtn.textContent = "⛶";
  fullscreenBtn.style.cssText = "margin-left:5px;cursor:pointer;";

  let isFullscreen = false;
  const originalStyles = {
    width: "480px",
    height: "360px",
    left: null,
    top: null,
    right: "20px",
    bottom: "20px"
  };

  fullscreenBtn.onclick = () => {
    if (!isFullscreen) {
      Object.assign(originalStyles, {
        width: container.style.width,
        height: container.style.height,
        left: container.style.left,
        top: container.style.top,
        right: container.style.right,
        bottom: container.style.bottom
      });
      container.style.top = container.style.left = "0";
      container.style.right = container.style.bottom = "0";
      container.style.width = "100vw";
      container.style.height = "100vh";
      isFullscreen = true;
    } else {
      container.style.width = originalStyles.width;
      container.style.height = originalStyles.height;
      container.style.left = originalStyles.left;
      container.style.top = originalStyles.top;
      container.style.right = originalStyles.right;
      container.style.bottom = originalStyles.bottom;
      isFullscreen = false;
    }
  };

  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back";
  backBtn.style.cssText = "margin-left:5px;cursor:pointer;display:none;";

  backBtn.onclick = () => {
    iframe.src = "";
    iframe.style.display = "none";
    backBtn.style.display = "none";
    if (!contentWrapper.contains(menu)) contentWrapper.append(menu);
    if (!contentWrapper.contains(gdToolsMenu)) contentWrapper.append(gdToolsMenu);
    if (!contentWrapper.contains(extraGamesMenu)) contentWrapper.append(extraGamesMenu);
    if (!contentWrapper.contains(musicMenu)) contentWrapper.append(musicMenu);
    [menu, gdToolsMenu, extraGamesMenu, musicMenu].forEach(el =>
      (el.style.display = el === menu ? "flex" : "none")
    );
    titleSpan.textContent = "Main Menu";
    if (!iframeVisible()) audio.play();
  };

  const hideBtn = document.createElement("button");
  hideBtn.textContent = "✕";
  hideBtn.style.cssText = "margin-left:5px;cursor:pointer;";
  hideBtn.onclick = () => {
  container.style.display = "none";
  lastAudioTime = audio.currentTime;
  audio.pause();
};

  buttonContainer.append(collapseBtn, fullscreenBtn, backBtn, hideBtn);
  header.append(leftControls, titleSpan, buttonContainer);

  const contentWrapper = document.createElement("div");
  contentWrapper.style.cssText = "flex-grow:1; display:flex; flex-direction:column; overflow-y:auto;";

const makeButton = (text, url, title) => {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.style.cssText = `
    background: grey; color: white;
    border: none; padding:10px 20px;
    font-size:16px; border-radius:8px;
    cursor:pointer;
  `;
  btn.onclick = () => {
    if (openInNewTab) {
      window.open(url, "_blank");
    } else {
      iframe.src = url;
      iframe.style.display = "block";
      backBtn.style.display = "inline-block";
      [menu, gdToolsMenu, extraGamesMenu, musicMenu].forEach(el => (el.style.display = "none"));
      titleSpan.textContent = title;
      lastAudioTime = audio.currentTime;
      audio.pause();
    }
  };
  return btn;
};

  const menu = document.createElement("div");
  menu.style.cssText = `
    background:black;color:white;flex-grow:1;
    display:flex;flex-direction:column;
    justify-content:center;align-items:center;
    gap:15px;
  `;

  const selectLabel = document.createElement("div");
  selectLabel.textContent = "Select Game";
  selectLabel.style.cssText = "color:white;font-size:20px;font-weight:bold;margin-bottom:10px;";
  menu.append(
    selectLabel,
    makeButton("Geometry Dash", "https://geometrydashlite.io", "Geometry Dash! Ctrl + Q to hide/unhide."),
    makeButton("Geometry Dash Meltdown", "https://geometrydashmeltdown.io", "Geometry Dash Meltdown! Ctrl + Q to hide/unhide."),
    makeButton(
      "Geometry Dash Breeze! (unofficial)",
      "https://geometrydashbreeze.com/#google_vignette",
      "Geometry Dash Breeze!"
    )
  );

(() => {
// Toggle: open in new tab
const toggleDiv = document.createElement("div");
toggleDiv.style.cssText = "margin-top:10px; color:white; font-size:14px;";

const toggleLabel = document.createElement("label");
toggleLabel.textContent = "Open games in new tab: ";
toggleLabel.style.marginRight = "5px";

const toggleCheckbox = document.createElement("input");
toggleCheckbox.type = "checkbox";
toggleCheckbox.style.verticalAlign = "middle";
toggleCheckbox.onchange = () => {
  openInNewTab = toggleCheckbox.checked;
};

toggleDiv.append(toggleLabel, toggleCheckbox);
menu.append(toggleDiv); // ← Important! Adds to menu
})(); // close the toggle IIFE

  const createLink = (text, targetEl, titleText) => {
    const link = document.createElement("a");
    link.textContent = text;
    link.href = "#";
    link.style.cssText = "color:grey;text-decoration:underline;font-size:14px;cursor:pointer;";
    link.onclick = e => {
      e.preventDefault();
      [menu, gdToolsMenu, extraGamesMenu, musicMenu].forEach(el => (el.style.display = "none"));
      targetEl.style.display = "flex";
      if (!contentWrapper.contains(targetEl)) contentWrapper.append(targetEl);
      backBtn.style.display = "inline-block";
      titleSpan.textContent = titleText;
      lastAudioTime = audio.currentTime;
    if (!iframeVisible()) {
        audio.currentTime =         lastAudioTime;
    audio.play();
        }
    };
    return link;
  };

  const gdToolsMenu = document.createElement("div");
  gdToolsMenu.style.cssText = menu.style.cssText;
  gdToolsMenu.style.display = "none";
  gdToolsMenu.append(
    (() => {
      const div = document.createElement("div");
      div.textContent = "GD Tools (unplayable)";
      div.style.cssText = selectLabel.style.cssText;
      return div;
    })(),
    makeButton("GD Save Editor", "https://gdcolon.com/gdsave/", "GD Save Editor"),
    makeButton("GD Font Generator", "https://gdcolon.com/gdfont", "GD Font Generator"),
    makeButton("GD Comment Viewer", "https://gdcolon.com/gdcomment", "GD Comment Viewer"),
    makeButton("GD Icon Kit", "https://gdbrowser.com/iconkit/", "GD Icon Kit"),
    makeButton("GD Browser (Classic)", "https://gdbrowser.com/", "GD Browser (Classic)")
  );

const extraGamesMenu = document.createElement("div");
extraGamesMenu.style.cssText = menu.style.cssText;
extraGamesMenu.style.display = "none";
extraGamesMenu.append(
  (() => {
    const div = document.createElement("div");
    div.textContent = "Extra Games";
    div.style.cssText = selectLabel.style.cssText;
    return div;
  })(),
  makeButton("Sans", "https://jcw87.github.io/c2-sans-fight/", "Sans"),
  makeButton("Sans?", "https://caijiqaq.github.io/LAST-BREATH/", "Last Breath"),
  makeButton("Undyne", "https://doodle-pile.gitlab.io/unfair-undyne/v0.99/", "Undyne"),
  makeButton("Thirty Dollar Website", "https://thirtydollar.website/", "Thirty Dollar Website"),
  makeButton("Undertale DEMO", "https://turbowarp.org/791527350/embed", "Undertale"),
  makeButton("Friday Night Funkin' (Embed)", "https://itch.io/embed/792778", "Friday Night Funkin'"),
  (() => {
    const btn = document.createElement("button");
    btn.textContent = "Deltarune (opens in a new tab)";
    btn.style.cssText = `
      background: grey; color: white;
      border: none; padding:10px 20px;
      font-size:16px; border-radius:8px;
      cursor:pointer;
    `;
    btn.onclick = () => {
      window.open("https://genizy.itch.io/deltarune", "_blank");
    };
    return btn;
  })(),
  (() => {
    const btn = document.createElement("button");
    btn.textContent = "Bad Monday Simulator (opens in a new tab)";
    btn.style.cssText = `
      background: grey; color: white;
      border: none; padding:10px 20px;
      font-size:16px; border-radius:8px;
      cursor:pointer;
    `;
    btn.onclick = () => {
      window.open("https://lumpytouch.itch.io/bad-monday-simulator", "_blank");
    };
    return btn;
  })()
);


  // Music Switcher
  const musicMenu = document.createElement("div");
  musicMenu.style.cssText = menu.style.cssText;
  musicMenu.style.display = "none";

  const musicLabel = document.createElement("div");
  musicLabel.textContent = "Select Music";
  musicLabel.style.cssText = selectLabel.style.cssText;
  musicMenu.append(musicLabel);

  const tracks = [
    { name: "Shop - Undertale", id: "14JOJhlBAJPcHcvPq9auhA0Yx_U69gvTH" },
    { name: "Home - Undertale", id: "14J4UwHB1e0orEALIivVRVcE0Lt4owxow" },
    { name: "Dating Start! - Undertale", id: "14OD0YWdbOWWNmV3MoLPm2JCzi20Bc1cw" },
    { name: "Amalgam - Undertale", id: "14WD0Cy2bDGL-UeAhiqKCjHbm5rArjFFs" },
    { name: "Menu FULL - Undertale", id: "14Sd-8CZKR8cJHcTKmWLu4xirnRRGCJmO" }
  ];

  tracks.forEach(t => {
    const btn = document.createElement("button");
    btn.textContent = t.name;
    btn.style.cssText = `
      background:grey;color:white;border:none;
      padding:10px 20px;font-size:16px;
      border-radius:8px;cursor:pointer;
    `;
    btn.onclick = () => {
      audio.src = `https://drive.google.com/uc?export=download&id=${t.id}`;
      audio.load();
      audio.play();
    };
    musicMenu.append(btn);
  });

  const defaultBtn = document.createElement("button");
  defaultBtn.textContent = "Menu - Undertale";
  defaultBtn.style.cssText = `
    background:darkgrey;color:white;border:none;
    padding:10px 20px;font-size:16px;
    border-radius:8px;cursor:pointer;
  `;
  defaultBtn.onclick = () => {
    audio.src = "https://drive.google.com/uc?export=download&id=14FRtf-DZnNEziFnay-xeYbEw3MjGLLXY";
    audio.play();
  };
  musicMenu.append(defaultBtn);

  menu.append(
    createLink("GD Tools (unplayable)", gdToolsMenu, "GD Tools"),
    createLink("Extra Games", extraGamesMenu, "Extra Games"),
    createLink("Music Switcher (takes a while to load)", musicMenu, "Music Switcher")
  );

  const iframe = document.createElement("iframe");
  iframe.style.cssText = "flex-grow:1;width:100%;height:100%;border:none;display:none;";

  const iframeVisible = () => iframe.style.display !== "none";

  contentWrapper.append(menu, gdToolsMenu, extraGamesMenu, musicMenu, iframe);
  container.append(header, contentWrapper);
  document.body.append(container);
  document.body.append(audio);

    setTimeout(() => {
        container.style.transform = "scale(1)";
        container.style.opacity = "1";
        audio.load(); // ensure it's ready
        audio.play(); // now play it
    }, 50);

  let isDragging = false,
    offsetX = 0,
    offsetY = 0;
  header.addEventListener("mousedown", e => {
    if (e.target.tagName === "BUTTON" || isFullscreen) return;
    isDragging = true;
    offsetX = e.clientX - container.offsetLeft;
    offsetY = e.clientY - container.offsetTop;
    document.body.style.userSelect = "none";
  });
  document.addEventListener("mousemove", e => {
    if (isDragging && !isFullscreen) {
      container.style.left = `${e.clientX - offsetX}px`;
      container.style.top = `${e.clientY - offsetY}px`;
      container.style.right = "auto";
      container.style.bottom = "auto";
    }
  });
  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.userSelect = "";
  });

document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key.toLowerCase() === "q") {
    const vis = container.style.display !== "none";
    container.style.display = vis ? "none" : "flex";
    if (vis) {
      lastAudioTime = audio.currentTime;
      audio.pause();
    } else {
      if (!iframeVisible()) {
        audio.currentTime = lastAudioTime;
        audio.volume = 0;
        audio.play();
        // Fade in
        let vol = 0;
        const fade = setInterval(() => {
          vol += 0.05;
          if (vol >= 0.5) {
            audio.volume = 0.5;
            clearInterval(fade);
          } else {
            audio.volume = vol;
          }
        }, 100);
      }
    }
  }
});
})();
