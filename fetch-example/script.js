// https://jsonplaceholder.typicode.com/todos

// fetch('https://jsonplaceholder.typicode.com/todos', {
//     method : 'POST',
//     headers : {
//         'Content-Type' : 'application/json',
//         'Authorization' : '<token>'
//     },
//     body : JSON.stringify({
//         username : 'Jesper',
//         password : 'coolio'
//     })
// });

// Det lite nyare sättet att göra fetch-anrop på
// let response = await fetch('https://jsonplaceholder.typicode.com/todos');
// let data = await response.json();

// console.log(data);

pageSetup();

async function pageSetup() {
    let todos = await fetchTodos();
    renderTodos(todos);
}

async function fetchTodos() {
    let todos = await fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then(data => {
        return data;
    });
    
    return todos;
}

function renderTodos(todos) {
    for(let todo of todos) {
        let todoRef = document.createElement('p');
        todoRef.textContent = todo.title;
        document.body.appendChild(todoRef);
    }
}