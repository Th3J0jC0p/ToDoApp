class Task {
	constructor(
		taskName = "task",
		description = "",
		date = null,
		priority = 0
	) {
		this.taskName = taskName;
		this.description = description;
		this.date = date;
		this.priority = priority;
	}
}

class App {
	tasks = [];
	selected = null;
	printTasks() {
		document.querySelector(".tasks").innerHTML = this.tasks
			.map(
				(task, index) =>
					`<li class="taskItem" data-index="${index}">${task.taskName}</li>`
			)
			.join("");

		this.saveTasks();
	}

	saveTasks() {
		localStorage.setItem("tasks", JSON.stringify(this.tasks));
	}

	loadTasks() {
		this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
		this.printTasks();
	}

	removeTask(index) {
		this.tasks.splice(index, 1);
		this.printTasks();
	}

	addTask(task) {
		this.tasks.push(new Task(task.value));
		this.printTasks();
	}

	printProperites(index) {
		this.selected = index;
		let task = this.tasks[index];
		let template = document.querySelector("#properties");
		let clone = template.content.cloneNode(true);
		clone.querySelector("#title").value = task.taskName;
		clone.querySelector(".changeName").dataset.index = index;
		clone.querySelector("#description").value = task.description;
		clone.querySelector(".changeDescription").dataset.index = index;
		document.querySelector(".propTab").innerHTML = "";
		document.querySelector(".propTab").appendChild(clone);
		console.log(task);
	}

	closeProperties() {
		document.querySelector(".propTab").innerHTML = "";
	}

	constructor() {
		document.addEventListener("DOMContentLoaded", () => {
			this.loadTasks();
			document.querySelector("#addTask").addEventListener("click", () => {
				event.preventDefault();
				let task = document.querySelector("#task");
				if (task.value !== "") {
					this.addTask(task);
				}
				task.value = "";
			});

			document
				.querySelector(".tasks")
				.addEventListener("click", (event) => {
					if (
						event.target.className === "taskItem" &&
						event.ctrlKey === true
					) {
						this.removeTask(event.target.dataset.index);
						this.closeProperties();
					} else if (event.target.className === "taskItem") {
						this.printProperites(event.target.dataset.index);
					}
				});
			document
				.querySelector(".propTab")
				.addEventListener("click", (event) => {
					if (event.target.className === "changeName") {
						this.tasks[event.target.dataset.index].taskName =
							document.querySelector("#title").value;
						this.printTasks();
						this.closeProperties();
					}
					if (event.target.className === "changeDescription") {
						this.tasks[event.target.dataset.index].description =
							document.querySelector("#description").value;
						this.printTasks();
						this.closeProperties();
					}
					if (event.target.className === "remove") {
						this.removeTask(event.target.dataset.index);
						this.printTasks();
						this.closeProperties();
					}
				});
		});
	}
}

let app = new App();
