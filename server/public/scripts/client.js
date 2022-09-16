/// <reference path="jquery.js" />
$(onReady);
let editMode = false;
let globalIDHolder = "";

function onReady() {
  clickHandler();
  appendTasks();
} // end onReady

function clickHandler() {
  $("#addNoteBtn").on("click", addTask);
  $("#noteList").on("click", ".complete-button", completeTask);
  $("#noteList").on("click", ".edit-button", editTask);
  $("#noteList").on("click", ".delete-button", deleteTask);
  $(".cancel-button").on("click", resetAfterEdit);
} // end clickHandler

function checkError(error) {
  console.log("error caught :>> ", error);
} // end checkError

function appendTasks() {
  $.ajax({
    method: "GET",
    url: "/tasks",
  })
    .then((results) => {
      $("#noteList").empty();

      for (const task of results) {
        $("#noteList").append(`
            <tr data-is-complete="${task.is_complete}" data-id="${task.id}">
                <td>${task.note}</td>
                <td>${task.is_complete ? "Complete" : "Pending"}</td>
                <td>
                <button class="complete-button">Complete</button>
                <button class="edit-button">Edit</button>
                <button class="delete-button">Delete</button>
                </td>
            </tr>
        `);
      }
    })
    .catch(checkError);
} // end appendTasks

function addTask() {
  if (editMode === true) {
    $.ajax({
      method: "PUT",
      url: `/tasks/edit/${globalIDHolder}`,
      data: {
        note: $("#inputNote").val(),
      },
    })
      .then(() => {
        appendTasks();
        resetAfterEdit();
      })
      .catch(checkError);
  } else {
    $.ajax({
      method: "POST",
      url: "/tasks",
      data: {
        note: $("#inputNote").val(),
      },
    })
      .then(() => {
        appendTasks();
        $("#inputNote").val("");
      })
      .catch(checkError);
  }
} // end addTask

function deleteTask(event) {
  const currentID = $(event.target).closest("tr").data("id");

  $.ajax({
    method: "DELETE",
    url: `/tasks/${currentID}`,
  })
    .then(() => {
      appendTasks();
    })
    .catch(checkError);
} // end deleteTask

function completeTask(event) {
  const currentID = $(event.target).closest("tr").data("id");

  $.ajax({
    method: "PUT",
    url: `/tasks/togcomplete/${currentID}`,
  })
    .then(() => {
      appendTasks();
    })
    .catch(checkError);
} // end completeTask

function editTask(event) {
  globalIDHolder = $(event.target).closest("tr").data("id");
  editMode = true;
  $("#inputNote").val($(event.target).closest("tr").children().first().text());
  $("#addNoteBtn").text("Edit Task");
  $(".cancel-button").show();
} // end editTask

function resetAfterEdit() {
  globalIDHolder = "";
  editMode = false;
  $("#inputNote").val("");
  $("#addNoteBtn").text("Add Task");
  $(".cancel-button").hide();
} // end resetAfterEdit
