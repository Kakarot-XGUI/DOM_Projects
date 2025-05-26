document.addEventListener("DOMContentLoaded", function () {
    loadTasks();
});

document.querySelector("#Push").onclick = function () {
    let taskInput = document.querySelector(".inp").value;

    if (taskInput.length === 0) {
        alert("Please Enter a Task");
    } else {
        addTask(taskInput);
        saveTasks();
    }
};

function addTask(taskValue) {
    let taskContainer = document.querySelector(".tasks");

    taskContainer.innerHTML += `
        <div class="task mt-5 flex px-5 py-4 bg-white items-center relative justify-between border-b-2 border-[#1c66b2] mx-auto">
            <span class="taskname flex-grow">${taskValue}</span>
            <button class="delete text-[#ffffff] h-10 rounded-lg w-10 bg-[#1c66b2] font-bold"><i class="ri-delete-bin-line"></i></button>
        </div>
    `;

    let currentTasks = document.querySelectorAll(".delete");
    currentTasks.forEach(task => {
        task.onclick = function () {
            this.parentNode.remove();
            saveTasks();
        };
    });
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll(".taskname").forEach(task => {
        tasks.push(task.innerText);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTask(task));
}
