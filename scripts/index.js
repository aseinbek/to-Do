const vid = document.getElementById("myAudio");


const $title = document.querySelector('.titleInput')
const $description = document.querySelector('.descriptionInput')
const $addBtn = document.querySelector('.addBtn')
const $container = document.querySelector('.todos')
const $categorySelect = document.querySelector('.categorySelect')





function enableAutoplay() { 
    vid.autoplay = true;
    vid.load();
  }

  // Load categories from LS
window.addEventListener('load', () => {
  const categories = getCategories()

  categories.forEach(category => {
    $categorySelect.insertAdjacentHTML('beforeend', categoryTemplate(category))
  })
})

  // Load todos from local storage
  window.addEventListener('load', () => {
    const todos = getTodos()
  
    todos.reverse().forEach(todo => {
      $container.insertAdjacentHTML('beforeend', cardTemplate(todo))
    })
  })
  
  $addBtn.addEventListener('click', () => {
    if (isValidated($title) && isValidated($categorySelect) && isValidated($description)) {
      createTodo({ 
        title: $title.value, 
        description: $description.value, 
        category: $categorySelect.value 
      })
    }
  })
  
  function cardTemplate(todo) {
    const {
      title,
      description,
      id,
      completed,
      createdAt,
      editedAt,
      category,
    } = todo
  
    const categories = getCategories()
  
    const foundCategory = categories.find(ctg => ctg.id === +category)
  
    const isLongText = description.length > 350
  
    return `
      <div class="todoCard ${completed ? 'completed' : ''}">
        <h2>${title}</h2>
  
        ${
          foundCategory ? `<p>Категория: <strong>${foundCategory.title}</strong></p>` : ''
        }
  
        <div class="content">
          <div class="${isLongText ? 'shorten' : 'descriptionContainer'}">
            <p>${description}</p>
          </div>
  
          <p class="dates">
            <span>${createdAt}</span>
            ${
              editedAt ? `<span>Edited at: ${editedAt}</span>` : ''
            }
          </p>
        </div>
  
        <div>
          <button onclick="completeTodo(${id})" class="card-btn">Complete</button>
          <button onclick="deleteTodo(${id})" class="card-btn">Delete</button>
          <button onclick="editTodo(${id})" class="card-btn">Edit</button>
        </div>
      </div>
    `
  }

  function categoryTemplate(category) {
    const {
      id,
      title
    } = category
  
    return `
      <option value="${id}">
        ${title}
      </option>
    `
  }
  
  function createTodo({ title, description, category }) {
    const currentTodos = getTodos()
  
    const todo = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: currentDate(),
      editedAt: null,
      category,
    }
  
    setTodos([...currentTodos, todo])
  
    $container.insertAdjacentHTML('afterbegin', cardTemplate(todo))
  
    resetFields()
  }
  
  function deleteTodo(id) {
    const confirmDelete = confirm('Are you sure?')
  
    if (!confirmDelete) return
  
    const updatedTodos = getTodos().filter(todo => todo.id !== id)
  
    setTodos(updatedTodos)
  
    reloadPage()
  }
  
  function completeTodo(id) {
    const updatedTodos = getTodos().map(todo => {
      if (todo.id === id) {
        todo.completed = !todo.completed
      }
  
      return todo
    })
  
    setTodos(updatedTodos)
  
    reloadPage()
  }
  
  function editTodo(id) {
    const updatedTodos = getTodos().map(todo => {
      if (todo.id === id) {
        todo.title = prompt('Title', todo.title) || todo.title
        todo.description = prompt('Description', todo.description) || todo.description
        todo.editedAt = currentDate()
      }
  
      return todo
    })
  
    setTodos(updatedTodos)
  
    reloadPage()
  }
  
  function isValidated(element) {
    if (!element.value) {
      element.classList.add('error')
  
      element.focus()
  
      return false
    }
  
    element.classList.remove('error')
    return true
  }
  
  
  function resetFields() {
    $title.value = ''
    $description.value = ''
    $categorySelect.value = ''
  }
  
  
  // Current date function
  
  function currentDate() {
    return new Date().toLocaleString()
  }
  
  
  // Id Generator
  function generateId() {
    const todos = getTodos()
    const maxID = todos.reduce((acc, todo) => todo.id > acc ? todo.id : acc, 0)
  
    return maxID + 1
  }
  
  // Get todos function
  
  function getTodos() {
    return JSON.parse(localStorage.getItem('todos')) || []
  }
  
  // Set todo function
  
  function setTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos))
  }
  
  // Reload page function
  
  function reloadPage() {
    window.location.reload()
  }