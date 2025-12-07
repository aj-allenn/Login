const list = document.getElementById('display');

function fetchTodos() {
    fetch("/api/todos")
        .then(res => res.json())
        .then(data => {
            list.innerHTML = "";
            data.forEach(todo => {
                list.innerHTML += `
                    <p>${todo.task}</p>
                `;
            });
        });
}

function addTodo() {
    const input = document.getElementById("todo-input");
    const task = input.value.trim();

    if (!task) return alert("Enter a task");

    fetch("/api/todos", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ task })
    })
        .then(() => {
            input.value = "";
            fetchTodos();
        });
}

fetchTodos();