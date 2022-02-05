const OPCODES = {
  INFO: 0,
  HELLO: 1,
  INIT: 2,
  HEARTBEAT: 3,
};

const elements = {
  username: document.getElementById("username"),
  avatar: document.getElementById("avatar"),
  status: document.getElementById("status"),
  card: document.getElementById("profile"),
};

const lanyard = new WebSocket("wss://api.lanyard.rest/socket");

// On Message
lanyard.onmessage = ({ data }) => {
  const parsedData = JSON.parse(data);

  if (parsedData.op == OPCODES.HELLO) {
    // Identify
    lanyard.send(
      JSON.stringify({
        op: OPCODES.INIT,
        d: {
          subscribe_to_id: "937430365230989352",
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
      elements.status.style.backgroundImage = `url("https://lanyard-profile-readme.vercel.app/api/${
        user.discord_user.id
      }?${new Date().getMilliseconds()}")`;
      elements.username.innerText =
        user.discord_user.username + `#${user.discord_user.discriminator}`;

      elements.avatar.src = `https://cdn.discordapp.com/avatars/${user.discord_user.id}/${user.discord_user.avatar}.png?size=128`;
      setActiveStyle(statusColors[user.discord_status]);
    } else if (parsedData.t == "PRESENCE_UPDATE") {
      const user = parsedData.d;
      elements.status.style.backgroundImage = `url("https://lanyard-profile-readme.vercel.app/api/${
        user.discord_user.id
      }?${new Date().getMilliseconds()}")`;
      setActiveStyle(statusColors[user.discord_status]);
    }
  }
};
