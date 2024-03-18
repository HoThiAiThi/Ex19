document.addEventListener("DOMContentLoaded", function () {
  const list_task = document.getElementById("list-task");
  const totalTaskElement = document.getElementById("totalTaskElement");
  const taskForm = document.getElementById("taskForm");
  const btnAddTask = document.getElementById("btnAddTask");
  const inputTaskname = document.getElementById("inputTaskname");
  const inputDescription = document.getElementById("inputDescription");
  const btnCancel = document.getElementById("btnCancel");
  const btnConfirmAddTask = document.getElementById("btnConfirmAddTask");
  const addForm = document.getElementById("addForm");
  const btnClose = document.getElementById("btnClose");
  const backdrop = document.getElementById("backdrop");

  // hien thi va khong hien thi form
  btnAddTask.addEventListener("click", function () {
    taskForm.style.display = "block";
    addForm.style.display = "none";
  });

  btnCancel.addEventListener("click", function () {
    taskForm.style.display = "none";
    addForm.style.display = "block";
  });

  // Hàm render ra Task List
  function renderNewTask(taskName, description) {
    const newTaskHTML = `
        <div class="flex items-start py-2 pb-6 border-b-2 w-full">
        <input type="checkbox" class="form-checkbox mt-1 rounded-full w-5 h-5">

          <div class="flex-grow ms-3">
              <label for="form-checkbox" class="text-base">${taskName}</label>
              <p class="text-[#8f9eb4] mt-1">${description}</p>
          </div>
          <div class="dropdown-menu hidden">
              <ul>
                  <li class="border-b-2 mb-2 px-4 py-2 "><i class="fa-solid fa-pen" style="color: #a0aec0;" ></i><a href="#" class="update-task font-bold ml-3 ">Update</a></li>
                  <li class="px-4 "><i class="fa-solid fa-trash" style="color: #e53e3e;"></i><a href="#" class="delete-task text-[#e53e3e] font-bold ml-3 ">Delete</a></li>
              </ul>
          </div>
          <div class="flex justify-end">
              <i class="fa-solid fa-ellipsis-vertical" style="color: #a0aec0;"></i>
          </div>
        </div>
    `;
    list_task.innerHTML += newTaskHTML;
    updateTotalTasks();

    const ellipsisIcons = document.querySelectorAll(".fa-ellipsis-vertical");

    ellipsisIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const dropdownMenu = this.parentElement.previousElementSibling;
        dropdownMenu.classList.toggle("hidden");
      });
    });

    //xoa task
    const deleteTaskButtons = document.querySelectorAll(".delete-task");
    deleteTaskButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        const taskItem =
          this.parentElement.parentElement.parentElement.parentElement;
        taskItem.remove();
        updateTotalTasks();
      });
    });

    const taskItem = list_task.lastElementChild;

    taskItem.addEventListener("click", function (event) {
      const clickedElement = event.target;
      const isCheckbox = clickedElement.classList.contains("form-checkbox");
      const isUpdateButton = clickedElement.classList.contains("update-task");

      // Kiểm tra nếu không phải là checkbox hoặc nút Update trong menu
      if (!isCheckbox && !isUpdateButton) {
        // Lấy dropdown-menu để kiểm tra nếu nó đang được hiển thị
        const dropdownMenu = this.querySelector(".dropdown-menu");
        const isDropdownMenuVisible =
          !dropdownMenu.classList.contains("hidden");

        // Kiểm tra xem dropdown-menu có đang được hiển thị hay không
        if (!isDropdownMenuVisible) {
          const modal = document.getElementById("modal-container");
          modal.classList.add("show");
        }
      }
      const taskName = this.querySelector("label").textContent;
      const taskDescription = this.querySelector("p").textContent;
      const modalTitle = modal.querySelector(".modal-body label");
      modalTitle.textContent = taskName;
      const modalDescription = modal.querySelector(".modal-body p");
      modalDescription.textContent = taskDescription;
    });

    //sự kiện click cho icon "Update" trong menu
    const updateTaskButtons = document.querySelectorAll(".update-task");
    updateTaskButtons.forEach((button) => {
      button.addEventListener("click", function (event) {
        const modal = document.getElementById("modal-container");
        modal.classList.add("show");

        // hidden menu dropdown sau khi click vào nút "Update"
        const dropdownMenu = this.parentElement.parentElement;
        dropdownMenu.classList.add("hidden");

        event.stopPropagation();
      });
    });

    // close modal
    btnClose.addEventListener("click", function () {
      const modal = document.getElementById("modal-container");
      modal.classList.remove("show");
    });
    // close backdrop modal
    backdrop.addEventListener("click", function () {
      const modal = document.getElementById("modal-container");
      modal.classList.remove("show");
    });
  }

  // kiem tra trang thai checked cua checkbox
  list_task.addEventListener("click", function (event) {
    if (event.target.type === "checkbox") {
      updateTotalTasks();

      const label = event.target.nextElementSibling.querySelector("label");
      const description = event.target.nextElementSibling.querySelector("p");

      if (event.target.checked) {
        label.style.textDecoration = "line-through";
        description.style.textDecoration = "line-through";
      } else {
        label.style.textDecoration = "none";
        description.style.textDecoration = "none";
      }
    }
  });

  // kiểm tra trạng thái checkbox trong modal
  const modalLabel = document.querySelector(
    "#modal-container .modal-body label"
  );
  const modalDescription = document.querySelector(
    "#modal-container .modal-body p"
  );
  const modalCheckbox = document.querySelector(
    "#modal-container .modal-body input[type='checkbox']"
  );

  // Kiểm tra sự kiện click của checkbox trong modal
  modalCheckbox.addEventListener("click", function (event) {
    if (event.target.type === "checkbox") {
      const isChecked = event.target.checked;

      // Cập nhật trạng thái của checkbox trong modal
      modalLabel.style.textDecoration = isChecked ? "line-through" : "none";
      modalDescription.style.textDecoration = isChecked
        ? "line-through"
        : "none";
    }
  });

  //update total Task
  function updateTotalTasks() {
    let checkedTasks = list_task.querySelectorAll(
      'input[type="checkbox"]:checked'
    ).length;
    let totalTasks = list_task.children.length;
    let remainingTasks = totalTasks - checkedTasks;
    totalTaskElement.innerHTML = `${remainingTasks}/${totalTasks} tasks <i class="fa-solid fa-check me-2"></i> `;
  }

  // confirm addTask
  btnConfirmAddTask.addEventListener("click", function () {
    const taskName = inputTaskname.value;
    const description = inputDescription.value;

    if (taskName.trim() !== "" && description.trim() !== "") {
      renderNewTask(taskName, description);

      inputTaskname.value = "";
      inputDescription.value = "";
    }
    taskForm.style.display = "none";
    addForm.style.display = "block";
  });
});
