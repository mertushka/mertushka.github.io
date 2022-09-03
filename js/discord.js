window.onload = function () {
  const OPCODES = {
    INFO: 0,
    HELLO: 1,
    INIT: 2,
    HEARTBEAT: 3,
  };

  const elements = {
    username: document.getElementById("username"),
    avatar: document.getElementById("avatar"),
    card: document.getElementById("profile"),
    presence: document.getElementById("discord-presence"),
  };

  elements.presence.src =
    "https://lanyard-visualizer.netlify.app/user/940131816692674591?background=false&title=false&mode=iframe";

  const lanyard = new WebSocket("wss://api.lanyard.rest/socket");

  // On Message
  lanyard.onmessage = ({ data }) => {
    const parsedData = JSON.parse(data);
    if (parsedData.d?.activities?.find((a) => a.type === 0) == undefined) {
      elements.presence.setAttribute("hidden", "hidden");
    } else {
      elements.presence.removeAttribute("hidden");
    }

    if (parsedData.op == OPCODES.HELLO) {
      // Identify
      lanyard.send(
        JSON.stringify({
          op: OPCODES.INIT,
          d: {
            subscribe_to_id: "940131816692674591",
          },
        })
      );

      // Interval
      setInterval(function () {
        lanyard.send(
          JSON.stringify({
            op: OPCODES.HEARTBEAT,
          })
        );
      }, parsedData.d.heartbeat_interval);
    } else if (parsedData.op == OPCODES.INFO) {
      const statusColors = {
        online: "green",
        offline: "gray",
        idle: "yellow",
        dnd: "pink",
      };

      if (parsedData.t == "INIT_STATE") {
        const user = parsedData.d;

        elements.card.style.opacity = "1";
        elements.username.innerText =
          user.discord_user.username + `#${user.discord_user.discriminator}`;

        elements.avatar.src = `https://cdn.discordapp.com/avatars/${user.discord_user.id}/${user.discord_user.avatar}`;
        setActiveStyle(statusColors[user.discord_status]);
      } else if (parsedData.t == "PRESENCE_UPDATE") {
        const user = parsedData.d;
        setActiveStyle(statusColors[user.discord_status]);
      }
    }
  };
};
