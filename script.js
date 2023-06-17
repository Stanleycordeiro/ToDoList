// Selecionando elementos do DOM
const input = document.getElementById("input-nova-tarefa");
const taskList = document.getElementById("lista-tarefas");

// Variável de controle para verificar o estado de edição
let isEditing = false;

// Função para adicionar uma nova tarefa
function newTask() {
  const taskText = input.value.trim();

  if (taskText !== "") {
    const listItem = createTaskElement(taskText);
    taskList.prepend(listItem);

    input.value = "";
    saveTasks(); // Salvar as tarefas após adicionar uma nova tarefa
  }
}

// Função para criar um elemento de tarefa
function createTaskElement(taskText) {
  const listItem = document.createElement("li");
  listItem.className = "list-group-item align-items-center shadow-sm";
  listItem.setAttribute("data-criacao", getCurrentDateTime());

  const taskTextElement = document.createElement("span");
  taskTextElement.className = "task-text";
  taskTextElement.innerText = taskText;

  const dateTimeElement = document.createElement("span");
  dateTimeElement.className = "text-muted ms-2 float-end me-4";
  dateTimeElement.id = "hora-criacao";
  dateTimeElement.innerText = getCurrentDateTime();

  const buttonEdit = createButton("Editar", "btn-warning", editTask);
  const buttonFinish = createButton("Finalizar", "btn-success", finishTask);
  const buttonRemove = createButton("Remover", "btn-danger", removeTask);

  if (!listItem.classList.contains("finished-task")) {
    const buttonPriority = document.createElement("input");
    buttonPriority.type = "checkbox";
    buttonPriority.className = "form-check-input me-3";
    buttonPriority.addEventListener("click", togglePriority);
    listItem.appendChild(buttonPriority);
  }

  listItem.append(
    taskTextElement,
    buttonFinish,
    buttonRemove,
    dateTimeElement,
    buttonEdit
  );

  return listItem;
}

// Função para criar um botão
function createButton(text, className, clickHandler) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `btn btn-sm ${className} float-end me-2`;
  button.innerText = text;
  button.addEventListener("click", clickHandler);

  return button;
}

// Função para marcar uma tarefa como concluída
function finishTask(event) {
  const button = event.target;
  const listItem = button.parentNode;
  listItem.classList.add("finished-task");
  button.innerText = "Concluída";
  button.disabled = true;

  const editButton = listItem.querySelector(".btn-warning");
  if (editButton) {
    editButton.remove();
  }

  taskList.append(listItem);
  saveTasks(); // Salvar as tarefas após marcar como concluída
}

// Função para remover uma tarefa da lista
function removeTask(event) {
  const button = event.target;
  const listItem = button.parentNode;
  listItem.remove();
  saveTasks(); // Salvar as tarefas após remover uma tarefa
}

// Função para editar a tarefa
function editTask(event) {
  if (isEditing) {
    return; // Se já estiver editando, não faz nada
  }

  const button = event.target;
  const listItem = button.parentNode;
  const taskTextElement = listItem.querySelector(".task-text");
  const editInput = document.createElement("input");
  editInput.className = "edit-input w-50";
  editInput.value = taskTextElement.innerText;
  listItem.replaceChild(editInput, taskTextElement);
  button.innerText = "Salvar";
  button.removeEventListener("click", editTask);
  button.addEventListener("click", saveTask);

  const finishButton = listItem.querySelector(".btn-success");
  finishButton.disabled = true;
  finishButton.classList.add("disabled");

  isEditing = true; // Define o estado de edição como verdadeiro
}

// Função para salvar a tarefa editada
function saveTask(event) {
  const button = event.target;
  const listItem = button.parentNode;
  const editInput = listItem.querySelector(".edit-input");
  const taskTextElement = document.createElement("span");
  const newTaskText = editInput.value.trim();

  if (newTaskText === "") {
    return;
  }

  taskTextElement.className = "task-text";
  taskTextElement.innerText = newTaskText;
  listItem.replaceChild(taskTextElement, editInput);
  button.innerText = "Editar";
  button.removeEventListener("click", saveTask);
  button.addEventListener("click", editTask);

  const finishButton = listItem.querySelector(".btn-success");
  finishButton.disabled = false;
  finishButton.classList.remove("disabled");

  isEditing = false; // Define o estado de edição como falso

  saveTasks(); // Salvar as tarefas após editar uma tarefa
}

// Função para alternar a prioridade da tarefa
function togglePriority(event) {
  const checkbox = event.target;
  const listItem = checkbox.parentNode.parentNode;

  if (checkbox.checked) {
    listItem.classList.add("priority-task");
  } else {
    listItem.classList.remove("priority-task");
  }

  saveTasks(); // Salvar as tarefas após alterar a prioridade
}

// Função para obter a data e hora atual formatada
function getCurrentDateTime() {
  const currentDateTime = new Date();
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return currentDateTime.toLocaleString("pt-BR", options);
}

// Carregando as tarefas salvas (se houver) ao iniciar a página
window.addEventListener("DOMContentLoaded", () => {
  loadSavedTasks();
  addControlButtons();
});

// Função para adicionar os botões de controle
function addControlButtons() {
  const panelControl = document.querySelector(".bg-dark .container");

  if (!document.getElementById("cleartask")) {
    const clearTaskButton = document.createElement("button");
    clearTaskButton.className = "btn btn-danger me-4";
    clearTaskButton.id = "cleartask";
    clearTaskButton.innerText = "Limpar todas as tarefas";
    clearTaskButton.addEventListener("click", clearTasks);
    panelControl.appendChild(clearTaskButton);
  }

  if (!document.getElementById("cleartaskfinished")) {
    const removeFinishedButton = document.createElement("button");
    removeFinishedButton.className = "btn btn-warning";
    removeFinishedButton.id = "cleartaskfinished";
    removeFinishedButton.innerText = "Remover tarefas finalizadas";
    removeFinishedButton.addEventListener("click", removeFinishedTasks);
    panelControl.appendChild(removeFinishedButton);
  }
}

// Função para salvar as tarefas
function saveTasks() {
  const listItems = taskList.querySelectorAll("li");
  const tasks = [];

  listItems.forEach((listItem) => {
    const taskText = listItem.querySelector(".task-text").innerText;
    const isFinished = listItem.classList.contains("finished-task");
    const criacao = listItem.getAttribute("data-criacao");
    const task = {
      text: taskText,
      finished: isFinished,
      criacao: criacao,
    };
    tasks.push(task);
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Limpar todas as tarefas
function clearTasks() {
  taskList.innerHTML = "";
  saveTasks(); // Salvar as tarefas após limpar todas
}

// Remover tarefas finalizadas
function removeFinishedTasks() {
  const finishedTasks = document.getElementsByClassName("finished-task");

  while (finishedTasks.length > 0) {
    finishedTasks[0].remove();
  }

  saveTasks(); // Salvar as tarefas após remover as finalizadas
}

// Função para carregar as tarefas salvas
function loadSavedTasks() {
  const savedTasks = localStorage.getItem("tasks");

  if (savedTasks) {
    const tasks = JSON.parse(savedTasks);

    tasks.forEach((task) => {
      const listItem = createTaskElement(task.text);
      const criacao = task.criacao;

      if (task.finished) {
        listItem.classList.add("finished-task");
        const buttonFinish = listItem.querySelector(".btn-success");
        buttonFinish.innerText = "Concluída";
        buttonFinish.disabled = true;
      }

      taskList.appendChild(listItem);
      addTaskButtonEvents(listItem); // Adicionar eventos aos botões da tarefa
    });
  }
}

// Função para adicionar eventos aos botões das tarefas
function addTaskButtonEvents(listItem) {
  const buttonFinish = listItem.querySelector(".btn-success");
  buttonFinish.addEventListener("click", finishTask);

  const buttonRemove = listItem.querySelector(".btn-danger");
  buttonRemove.addEventListener("click", removeTask);

  const buttonPriority = listItem.querySelector(".form-check-input");
  buttonPriority.addEventListener("click", togglePriority);

  const buttonEdit = listItem.querySelector(".btn-warning");
  const isFinished = listItem.classList.contains("finished-task");
  if (!isFinished) {
    buttonEdit.addEventListener("click", editTask);
  } else {
    buttonEdit.remove(); // Remove o botão de edição se a tarefa estiver concluída
  }
}