let BASE_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v4/uol";

let NAME;
let LAST_TIME;
let RECEIVER = "Todos";
let MESSAGE_TYPE = "message";

function startChat() {
  loadMessages();

  setInterval(loadMessages, 3000);
  setInterval(validateStatus, 5000);

  document.addEventListener("keyup", sendMessageKeyboard)
}

function sendMessageKeyboard(event) {
  if(event.key === "Enter") {
    sendMessage();
  }
}

function enterRoom() {
  NAME = prompt("Qual o seu nome?");

  const promise = axios.post(`${BASE_URL}/participants`, {
    name: NAME,
  });

  promise.then(startChat);
  promise.catch(reloadPage);
}

function validateStatus() {
  axios.post(`${BASE_URL}/status`, {
    name: NAME,
  });
}

function reloadPage() {
  window.location.reload();
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

    const lastMessage = answer.data[answer.data.length - 1].time;

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

function sendMessage() {
  const input = document.querySelector(".input-message");

  const text = input.value;
  const message = {
    to: RECEIVER,
    from: NAME,
    text: text,
    type: MESSAGE_TYPE,
  }

  input.value = "";

  const promise = axios.post(`${BASE_URL}/messages`, message);
  promise.then(loadMessages);
  promise.catch(reloadPage);
}

enterRoom();
