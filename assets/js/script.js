const card = $('.new-car');
const currentDate = $('dayjs');
const taskDetails = $('task-details');
const id = $('generateTaskId');
const name = $("#task-name");
const dueDate = $("#due-date");
const description= $("#task-description");

// Retrieve tasks and nextId from localStorage
// $(document).ready(function () {
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// TODO: create a function to generate a unique task id
function generateTaskId() {
  // if nextId does not exist in localStorage, set it to 1
  if (nextId === null) {
    nextId = 1
  } else {
  // otherwise, increment it by 1
    nextId++;
  }
  // save nextId to localStorage
   localStorage.setItem("nextId", JSON.stringify(nextId));
}

// TODO: create a function to create a task card
function createTaskCard(task) {
  // create card elements
  let card = $("<div>").addClass("new-card");

  // set card background color based on due date
  let currentDate = dayjs();
  let dueDate = dayjs(task.dueDate);
  
  if (dueDate.isBefore(currentDate, 'day')) {
    card.addClass('bg-danger');
  } else if (dueDate.isBefore(currentDate.add(1, 'week'), 'day')) {
    card.addClass('bg-warning');
  }else {
    card.addClass('bg-success');
}
  // append card elements
  let taskDetails = $("<div>").addClass("task-details");
      taskDetails.append($("<h3>").text("Task Name: " + task.name));
      taskDetails.append($("<p>").text("Due Date: " + task.dueDate));
      taskDetails.append($("<p>").text("Description: " + task.description));

  // swimLane.append(card);
  card.append(taskDetails);

  $("#todo-cards").append(card);
}

// TODO: create a function to render the task list and make cards draggable
function renderTaskList() {
  // if taskList is null, set it to an empty array
  if (taskList === null || taskList.length === 0) {
    taskList = [];
  }
  // empty existing task cards
  $(".new-card").remove();

  // loop through tasks and create task cards for each status
  taskList.forEach(task => {
     createTaskCard(task);
});

  // make task cards draggable
  $(".new-card").draggable();
}

// TODO: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  // create a new task object
  let newTask = {
    id: generateTaskId(),
    name: $("#task-name").val(),
    dueDate: $("#due-date").val(),
    description: $("#task-description").val(),
    status: "todo",
  };

  // add the new task to the taskList save and render

  taskList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();

  $("#formModal").modal("hide");

  // Clear the form fields
  $("#task-name").val("");
  $("#due-date").val("");
  $("#task-description").val("");
}

// TODO: create a function to handle deleting a task
function handleDeleteTask(event) {
  // get the task id from the button clicked
  let taskId = $(event.target).data("task-id");
  // remove the task from the taskList, save and render
  taskList = taskList.filter(task => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));

  renderTaskList();
}

// TODO: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  // get the task id and new status from the event
  let taskId = ui.draggable.data("task-id");
  let newStatus = $(event.target).data("status");

  // update the task status of the dragged card
  taskList.forEach(task => {
    if (task.id === taskId) {
      task.status = newStatus;
      }
   });

  // save and render
  localStorage.setItem("tasks", JSON.stringify(taskList));

  renderTaskList();
}

// TODO: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // render the task list
    renderTaskList();
  // add event listener
  $("#save").click(handleAddTask);
  $(".delete-btn").click(handleDeleteTask);


  // make lanes droppable
  $(".lane").droppable({
    drop: handleDrop
  });

  // make due date field a date picker
    $("#due-date").datepicker();
  });

