$(onReady);

function onReady() {
  clickHandler();
  appendTasks();
}

function clickHandler() {
  $("#addNoteBtn").on("click", addTask);
  //   $("#noteList").on("click", "complete-button", completeTask);
  //   $("#noteList").on("click", "edit-button", editTask);
  //   $("#noteList").on("click", "delete-button", deleteTask);
}

function checkError(error) {
  console.log("error caught :>> ", error);
}

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
}

function addTask() {
  $.ajax({
    method: "POST",
    url: "/tasks",
    data: {
      note: $("#inputNote").val(),
    },
  })
    .then(() => {
      appendTasks();
    })
    .catch(checkError);
}
