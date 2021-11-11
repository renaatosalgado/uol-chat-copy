let BASE_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v4/uol";

let NAME;
let LAST_TIME;
let RECEIVER = "Todos";
let MESSAGE_TYPE = "message";

function startChat() {
  loadMessages();
  getUsers();

  setInterval(loadMessages, 3000);
  setInterval(validateStatus, 5000);
  setInterval(getUsers, 10000);

  document.addEventListener("keyup", sendMessageKeyboard);
}

function sendMessageKeyboard(event) {
  if (event.key === "Enter") {
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
      ul.innerHTML += `<li data-identifier="message" class="in-out">
            <span class="time">(${answer.data[i].time})</span>
            <strong>${answer.data[i].from}</strong>
            <span>${answer.data[i].text}</span>
          </li>`;
    }
    if (answer.data[i].type === "message") {
      ul.innerHTML += `<li data-identifier="message" class="talk-public">
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
      ul.innerHTML += `<li data-identifier="message" class="talk-private">
            <span class="time">(${answer.data[i].time})</span>
            <strong>${answer.data[i].from}</strong>
            <span> reservadamente para </span>
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
  };

  input.value = "";

  const promise = axios.post(`${BASE_URL}/messages`, message);
  promise.then(loadMessages);
  promise.catch(reloadPage);
}

function renderUsers(answer) {
  let usersList = document.querySelector(".contacts");

  let userClass = "";

  if (RECEIVER === "Todos") {
    userClass = "selected";
  }

  usersList.innerHTML = `<li class="visibility-public ${userClass}" onclick="selectReceiver(this)">
  <ion-icon name="people"></ion-icon><span class="name">Todos</span><ion-icon class="check" name="checkmark-outline">
  </ion-icon>
  </li>`;

  for (let i = 0; i < answer.data.length; i++) {
    if (RECEIVER === answer.data[i].name) {
      userClass = "selected";
    } else {
      userClass = "";
    }
    usersList.innerHTML += `<li class="visibility-public ${userClass}" onclick="selectReceiver(this)">
     <ion-icon name="person-circle"></ion-icon>
     <span class="name">${answer.data[i].name}</span><ion-icon class="check" name="checkmark-outline">
     </ion-icon>
   </li>`;
  }
}

function selectReceiver(element) {
  RECEIVER = element.querySelector(".name").innerHTML;

  const message = document.querySelector(".sending");

  if (MESSAGE_TYPE === "message") {
    message.innerHTML = `Enviando para ${RECEIVER}`;
  } else {
    message.innerHTML = `Enviando para ${RECEIVER} (reservadamente)`;
  }
  getUsers();
}

function getUsers() {
  const promise = axios.get(`${BASE_URL}/participants`);
  promise.then(renderUsers);
}

function selectVisibility(element, type) {
  document
    .querySelector(".visibilities .selected")
    .classList.remove("selected");
  element.classList.add("selected");

  MESSAGE_TYPE = type;
}

function openMenu() {
  const menu = document.querySelector(".menu");
  const chatBackgound = document.querySelector(".menu-back");

  menu.classList.toggle("hidden");
  chatBackgound.classList.toggle("back-hidden");
}

enterRoom();
