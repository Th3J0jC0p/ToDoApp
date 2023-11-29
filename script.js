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
					`<li id="" class="${
						this.selected == index
							? "taskItem selected"
							: "taskItem"
					}" data-index="${index}">${task.taskName}</li>`
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
		this.closeProperties();
	}

	handleNameChange(index) {
		this.tasks[index].taskName = document.querySelector("#title").value;
		this.printTasks();
	}

	handleDescriptionChange(index) {
		this.tasks[index].description =
			document.querySelector("#description").value;
		this.printTasks();
	}

	handleRemove(index) {
		this.removeTask(index);
		this.printTasks();
	}

	printProperites(index) {
		this.selected = index;
		let task = this.tasks[index];
		this.printTasks();

		let template = document.querySelector("#properties");
		let clone = template.content.cloneNode(true);

		clone.querySelector("#title").value = task.taskName;
		clone.querySelector(".changeName").dataset.index = index;
		clone.querySelector("#description").value = task.description;
		clone.querySelector(".changeDescription").dataset.index = index;

		let propTab = document.querySelector(".propTab");
		propTab.innerHTML = "";
		propTab.appendChild(clone);

		propTab.addEventListener("click", event => {
			if (event.target.className === "changeName") {
				this.handleNameChange(event.target.dataset.index);
				this.closeProperties();
			} else if (event.target.className === "changeDescription") {
				this.handleDescriptionChange(event.target.dataset.index);
				this.closeProperties();
			} else if (event.target.className === "remove") {
				this.handleRemove(event.target.dataset.index);
				this.closeProperties();
			} else if (event.target.className === "cancel") {
				this.closeProperties();
			} else {
				return;
			}
		});
	}

	closeProperties() {
		this.selected = null;
		document.querySelector(".propTab").innerHTML = "";
		this.printTasks();
	}

	getTaskHandler(event) {
		event.preventDefault();
		let task = document.querySelector("#task");
		if (task.value !== "") {
			this.addTask(task);
		}
		task.value = "";
	}

	constructor() {
		document.addEventListener("DOMContentLoaded", () => {
			this.loadTasks();

			document
				.querySelector(".addTaskForm")
				.addEventListener("submit", event => {
					event.preventDefault();
					this.getTaskHandler(event);
				});

			document
				.querySelector(".tasks")
				.addEventListener("click", event => {
					if (
						event.target.className === "taskItem" &&
						event.ctrlKey === true
					) {
						this.removeTask(event.target.dataset.index);
						this.closeProperties();
					} else if (event.target.className === "taskItem") {
						this.printProperites(event.target.dataset.index);
						this.printTasks();
					}
				});
		});
	}
}

let app = new App();
