function setActiveStyle(color) {
  let links = document.querySelectorAll(".alternate-style"),
    totalLinks = links.length;

  if (
    links.length === 0 ||
    !Array.from(links).find((link) => link.getAttribute("title") === color)
  ) {
    let link = document.createElement("link");
    let head = document.getElementsByTagName("head")[0];
    link.rel = "stylesheet";
    link.className = "alternate-style";
    link.title = color;
    link.type = "text/css";
    link.setAttribute("disabled", "");

    link.href = `/css/skins/${color}.css`;
    head.appendChild(link);

    let links = document.querySelectorAll(".alternate-style"),
      totalLinks = links.length;

    for (let i = 0; i < totalLinks; i++) {
      if (color === links[i].getAttribute("title")) {
        links[i].removeAttribute("disabled");
      } else {
        links[i].setAttribute("disabled", true);
      }
    }
  } else {
    for (let i = 0; i < totalLinks; i++) {
      if (color === links[i].getAttribute("title")) {
        links[i].removeAttribute("disabled");
      } else {
        links[i].setAttribute("disabled", true);
      }
    }
  }
}

window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  ? (document.body.className = "dark")
  : (document.body.className = "");
