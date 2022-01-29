(function() {
    let todoArr = []
    // создаем и возравщаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2')
        appTitle.innerHTML = title
        return appTitle
    }

    // создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form')
        let input = document.createElement('input')
        let buttonWrapper = document.createElement('div')
        let button = document.createElement('button')

        form.classList.add('input-group', 'mb-3')
        input.classList.add('form-control')
        input.placeholder = 'Введите название нового дела'
        buttonWrapper.classList.add('input-group-append')
        button.classList.add('btn', 'btn-primary')
        button.setAttribute('disabled', 'disabled')
        button.textContent = 'Добавить дело'

        buttonWrapper.append(button)
        form.append(input)
        form.append(buttonWrapper)

        return {
            form,
            input,
            button,
        }
    };

    //создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    };

    function createTodoItem(name) {
        let item = document.createElement('li');
        // кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.id = (Math.random() * 100).toFixed(2)

        // устанавливаем стили для элемента списка, а так же для размещения кнопок
        // в его правой части с помощью flex
        
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'aline-items-center');
        item.textContent = name;
        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn','btn-danger');
        deleteButton.textContent = 'Удалить';

        // вкладываем кнопки в отельный элемент, чтобы они объеденились в один блок
        buttonGroup.append(doneButton)
        buttonGroup.append(deleteButton)
        item.append(buttonGroup)

        return {
            item,
            doneButton,
            deleteButton,
            buttonGroup
        };
    };

    function changeItemDone(arr, item) {
        arr.map(function(obj) {
            if (obj.id === item.id && obj.done === false) {
                obj.done = true;
            } else if (obj.id === item.id && obj.done === true) {
                obj.done = false
            }
        })
    }

    function createTodoApp(container, title = 'Список дел', key) {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        if (localStorage.getItem(key)) {
            todoArr = JSON.parse(localStorage.getItem(key))

            for (const obj of todoArr) {
                let todoItem = createTodoItem(todoItemForm.input.value)

                todoItem.item.textContent = obj.name
                todoItem.item.id = obj.id

                if (obj.done == true) {
                    todoItem.item.classList.add('list-group-item-success')
                } else {
                    todoItem.item.classList.remove('list-group-item-success')
                }
                todoItem.doneButton.addEventListener('click', function () {
                    todoArr = JSON.parse(localStorage.getItem(key))
                    todoItem.item.classList.toggle('list-group-item-success')
                    changeItemDone(todoArr, todoItem.item)
                    localStorage.setItem(key, JSON.stringify(todoArr))
                })
    
                todoItem.deleteButton.addEventListener('click', function() {
                    if(confirm('Вы уверены ?')) {
                        todoArr = JSON.parse(localStorage.getItem(key))
                        const neaList = todoArr.filter(obj => obj.id !== todoItem.item.id);
                        localStorage.setItem(key, JSON.stringify(neaList))
                        todoItem.item.remove()
                    }
                })

                todoList.append(todoItem.item)
                todoItem.item.append(todoItem.buttonGroup)
            }
        }

        // Попробуем создать обработчик события input (Работает)

        todoItemForm.form.addEventListener('input', () => {
            if (todoItemForm.input.value !== "") {
                todoItemForm.button.removeAttribute('disabled');
            } else {
                todoItemForm.button.setAttribute('disabled', 'disabled')
            }
            

        });

    
        // Браузер создает событие submit на форме по нажатию Enter  или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function(e) {
            // Эта строчка необходима, чтобы предотвратить стандартное действие браузера
            // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы 
            e.preventDefault()

            // Игнорируем создание элемента, если пользователь ничего не ввел в поле
            if (!todoItemForm.input.value) {
                return
            }            

            let todoItem = createTodoItem(todoItemForm.input.value)
            // Добавляем обработчик на кнопки
            todoItem.doneButton.addEventListener('click', function () {
                todoArr = JSON.parse(localStorage.getItem(key))
                todoItem.item.classList.toggle('list-group-item-success')
                changeItemDone(todoArr, todoItem.item)
                localStorage.setItem(key, JSON.stringify(todoArr))
            })

            todoItem.deleteButton.addEventListener('click', function() {
                if(confirm('Вы уверены ?')) {
                    todoArr = JSON.parse(localStorage.getItem(key))
                    const neaList = todoArr.filter(obj => obj.id !== todoItem.item.id);
                    localStorage.setItem(key, JSON.stringify(neaList))
                    todoItem.item.remove()
                }
            })

            let localStorageDate = localStorage.getItem(key)

            if (localStorageDate === null) {
                todoArr = []
            } else {
                todoArr= JSON.parse(localStorageDate)
            }

            function createItemObj (arr) {
                let itemObj = {}
                itemObj.name = todoItemForm.input.value
                itemObj.id = todoItem.item.id
                itemObj.done = false
                
                arr.push(itemObj)
            }

            createItemObj(todoArr)
            localStorage.setItem(key, JSON.stringify(todoArr))
            
            todoList.append(todoItem.item)
            todoItemForm.input.value = ''
            todoItemForm.button.disabled = true
        })
    }
    window.createTodoApp = createTodoApp
})()