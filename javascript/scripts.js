let BASE_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol";

let NAME;
let LAST_TIME;

function startChat() {
  loadMessages();
  getUsers();

  setInterval(loadMessages, 3000);
}

function loadMessages() {
  const promise = axios.get(`${BASE_URL}/messages`);
  promise.then(renderMessages);
}

function renderMessages(answer) {
  const ul = document.querySelector(".messages-container");
  ul.innerHTML = "";

  for (let i = 0; i < answer.data.length; i++) {
    if (answer.data[i].type === "status") {
      ul.innerHTML += `<li class="in-out">
            <span class="time">(${answer.data[i].time})</span>
            <strong>${answer.data[i].from}</strong>
            <span>${answer.data[i].text}</span>
          </li>`;
    }
    if (answer.data[i].type === "message") {
      ul.innerHTML += `<li class="talk-public">
            <span class="time">(${answer.data[i].time})</span>
            <strong>${answer.data[i].from}</strong>
            <span> para </span>
            <strong>${answer.data[i].to}</strong>
            <span>${answer.data[i].text}</span>
          </li>`;
    }
    if (
      answer.data[i].type === "private_message" &&
      (answer.data[i].to === NAME || answer.data[i].from === NAME)
    ) {
      ul.innerHTML += `<li class="talk-private">
            <span class="time">(${answer.data[i].time})</span>
            <strong>${answer.data[i].from}</strong>
            <span> para </span>
            <strong>${answer.data[i].to}</strong>
            <span>${answer.data[i].text}</span>
            </li>`;
    }

    const lastMessage = resposta.data[resposta.data.length - 1].time;

    scrollEndChat(lastMessage);
  }

  function scrollEndChat(lastMessage) {
    if (lastMessage !== LAST_TIME) {
      const lastMessage = document.querySelector(
        ".messages-container li:last-child"
      );
      lastMessage.scrollIntoView();
      LAST_TIME = lastMessage;
    }
  }
}
