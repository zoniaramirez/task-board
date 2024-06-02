// const card = $('.new-card');
const currentDate = dayjs();
const taskDetails = $('.task-details');

// Retrieve tasks and nextId from localStorage
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
   return nextId;
}

// TODO: create a function to create a task card
function createTaskCard(task) {
  // create card elements
  let card = $("<div>").addClass("new-card").attr("data-task-id", task.id);

  // set card background color based on due date
  let dueDate = dayjs(task.dueDate);
  
  if (dueDate.isBefore(currentDate, 'day')) {
    card.addClass('bg-danger');
  } else if (dueDate.diff(currentDate, 'days') <= 2 && dueDate.diff(currentDate, 'days') >= 0) {
    card.addClass('bg-warning');
  }else {
    card.addClass('bg-success');
  }

  switch (task.status) {
    case "done":
      card.addClass('bg-white');
  }

  // append card elements
  let taskDetails = $("<div>").addClass("task-details");
      taskDetails.append($("<h3>").text("Task Name: " + task.name));
      taskDetails.append($("<p>").text("Due Date: " + task.dueDate));
      taskDetails.append($("<p>").text("Description: " + task.description));

  card.append(taskDetails);


  card.append($("<button>").text("Delete").addClass("btn btn-danger delete-btn").data("task-id", task.id).css("border", "2px solid black"));

  let columnId;
  switch (task.status) {
      case "todo":
          columnId = "#todo-cards";
          break;
      case "in-progress":
          columnId = "#in-progress-cards";
          break;
      case "done":
          columnId = "#done-cards";
          break;
      default:
          columnId = "#todo-cards";
  }
  
  $(columnId).append(card);
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
  $(".new-card").draggable({
  });
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
  event.preventDefault();
  // get the task id from the button clicked
  let taskId = $(event.target).data("task-id");
  // remove the task from the taskList, save and render
  let taskIndex = taskList.findIndex(task => task.id === taskId);

  if (taskIndex !== -1) {
    taskList.splice(taskIndex, 1);
  
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
  }
}

// TODO: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  // get the task id and new status from the event
  let taskId = ui.draggable.data('task-id');
  let newStatus = event.target.closest('.lane').id;
  // update the task status of the dragged card

  // console.log("Task ID:", taskId);
  // console.log("New Status:", newStatus);

  // update the task status of the dragged card
  taskList.forEach(task => {
    if (task.id === taskId) {
      task.status = newStatus;
      }
   });

  // save and render
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // console.log("Task List after update:", taskList);

  renderTaskList();
}

// TODO: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // render the task list
    renderTaskList();
  // add event listener
  $("#save").click(handleAddTask);
  $(document).on("click", ".delete-btn", handleDeleteTask);


  // make lanes droppable
  $(".lane").droppable({
    drop: function(event, ui) {
    handleDrop(event, ui);
    }
  });

  // make due date field a date picker
    $("#due-date").datepicker();
  });

