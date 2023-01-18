// let openRequest = indexedDB.open(planer, 1);
const inbox = document.querySelector(".inbox__input");
const inboxButton = document.querySelector(".inbox__button");
const placeInboxList = document.querySelector(".inbox__listItems");
// const buttonInboxEdit = document.querySelector(".inbox__btn-edit");
const buttonInboxDelite = document.querySelector(".inbox__btn-delite");
let inboxItem = document.querySelector(".inbox__item");
let modalWindow = document.getElementById("overlay");
let btnClosePopup = document.getElementById("close");
let nameModale = document.querySelector(".window_name");
const headerButton = document.querySelector(".header__button")
const modalButton = document.querySelector(".modal__button");
const modalInput = document.getElementById("modalInput");
const modalCategory = document.querySelector(".modal__category");
const modalType = document.querySelector(".modal__type");
const modalDate = document.getElementById("date_type");
const modalContext = document.getElementById("context_type");
const typeMenuProject = document.querySelector(".menu__item_submenu-projects");
const typeMenuQuick = document.querySelector(".menu__item_submenu-quick");
const typeMenuReference = document.querySelector(".menu__item_submenu-reference");
const typeMenuWaiting = document.querySelector(".menu__item_submenu-waiting");

let arrayInbox = [];
let arrayEditedTask = [];
let currObjId = giveId();

// проверяет, записан ли последний выданный id в локальное хранилище, если нет - дает 0, если да - забирает значение
function giveId() {
  let id = "";
  if (localStorage.getItem("lastTaskId") === null) {
    id = 0;
  } else {
    id = Number(localStorage.getItem("lastTaskId")) + 1;
  }
  // console.log(id);
  return id;
}

// глобальная переменная для сохранения обрабатываемого таска из функции findTask
let currentObject = "";
// переменная для карточки таска, записывается по нажатию на кнопку редактирования
let taskCard = "";


// создает объект из таска и записывает его в массив
function createTaskObject() {
  const objInbox = {
    id: currObjId++,
    name: inbox.value,
  }
  arrayInbox.push(objInbox);

  // сохраняем массив входящих
  localStorage.setItem('arrayInbox', JSON.stringify(arrayInbox));

  // сохраняем в локальное хранилище последний использованный Id
  localStorage.setItem('lastTaskId', JSON.stringify(objInbox.id));
}

// ЛОКАЛЬНОЕ ХРАНИЛИЩЕ_______________________

// window.addEventListener('storage', event => {
//   // console.log(event);

// })


// window.addEventListener('storage', function (e) {
//   console.log('change');
//   document.querySelector('.out').textContent = localStorage.getItem('b1');
// });


// _________________________________________________________________

// по нажатию на кнопку редактирования у определенного таска вызывается эта функция
function findTask(el) {
  // забирает id из родительского элемента, который мы дали при создании карточки таска в createCard 
  const id = el.parentNode.id;
  console.log(id);
  // находит в массиве тасков соответсвующий таск по id
  const task = arrayInbox.find(el => el.id == id);
  // передает имя таска в showTitle
  showTitle(task.name);
  // записывает в глобальную переменную найденный объект, чтобы передавать его в другие функции
  currentObject = task;
  taskCard = el.parentNode;
}

// засовывает имя таска в модальное окно
function showTitle(title) {
  nameModale.innerHTML = `${title}`;
  modalInput.innerHTML = `${title}`;
}

const createСard = (obj) => {
  const block = document.createElement('li');
  block.className = "inbox__listItem";

  const check = document.createElement('div');
  check.className = "inbox__inputfield";

  const labelCheck = document.createElement('label');
  labelCheck.className = "inbox__check check";

  const inputCheck = document.createElement('input');
  inputCheck.className = "inbox__input-check";
  inputCheck.setAttribute("type", "checkbox");

  const checkmark = document.createElement('span');
  checkmark.className = "inbox__checkmark checkmark";

  const item = document.createElement('div');
  item.className = "inbox__item";
  item.textContent = `${inbox.value}`;

  const buttonEdit = document.createElement('button');
  buttonEdit.className = "inbox__btn-edit";

  const buttonDelite = document.createElement('button');
  buttonDelite.className = "inbox__btn-delite";

  const imgButtonEdit = new Image(20, 20);
  imgButtonEdit.src = "./assets/images/pencil_white.png"
  imgButtonEdit.className = "header__buttonpic-edit";

  const imgButtonDelite = new Image(20, 20);
  imgButtonDelite.src = "./assets/images/delite_white.png"
  imgButtonDelite.className = "header__buttonpic-delite";

  block.append(check);
  block.append(item);
  block.append(buttonEdit);
  buttonEdit.append(imgButtonEdit);
  block.append(buttonDelite);
  buttonDelite.append(imgButtonDelite);
  check.append(labelCheck);
  labelCheck.append(inputCheck);
  labelCheck.append(checkmark);

  // проходится по записанным в массив таскам
  arrayInbox.forEach(el => {
    // дает создаваемому элементу block (li) id, доставая его из объекта
    block.setAttribute("id", `${el.id}`);
    // дает создаваемой кнопке редкатирования onClick, который по нажатию отправляет элемент в функцию findTask
    buttonEdit.setAttribute("onClick", "findTask(this)");
    // дает создаваемому чекбокчу onClick, который по нажатию отправляет элемент в функцию checkBox
    inputCheck.setAttribute("onClick", "checkBox(this)");
  })

  return block;
}

const addCard = (objItem,) => {
  const item = createСard(objItem);
  placeInboxList.appendChild(item);
}

// проверка нахождения пользователя на главной странице
if (window.location.href.split('/').at(-1) == "index.html") {

  // слушатель для инпута по кнопке "Enter" на главной
  inbox.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      createTaskObject();
      createСard();
      addCard();

      inbox.value = "";
    }
  });
  // слушатель кнопки "Сохранить" на главной
  inboxButton.addEventListener("click", () => {
    createTaskObject();
    createСard();
    addCard();

    inbox.value = "";
  });
};

// КНОПКИ УДАЛИТЬ И РЕДАКТИРОВАТЬ_______________________________

placeInboxList.addEventListener('click', (event) => {
  if (event.target.classList.contains('inbox__btn-delite')) {
    event.target.parentNode.remove();
    if (window.location.href.split('/').at(-1) == "index.html") {
      const id = event.target.parentNode.id;
      const task = arrayInbox.find(el => el.id == id);
      let index = arrayInbox.indexOf(task);
      arrayInbox.splice(index, 1);
      UpdatedArray();
    }

    if (window.location.toString().indexOf('/3_quick.html') > 0) {
      const id = event.target.parentNode.id;
      const task = arrayQuick.find(el => el.id == id);
      let index = arrayQuick.indexOf(task);
      arrayQuick.splice(index, 1);
      UpdatedArray();
    }
    if (window.location.toString().indexOf('/4_projects.html') > 0) {
      const id = event.target.parentNode.id;
      const task = arrayInbox.find(el => el.id == id);
      let index = arrayProject.indexOf(task);
      arrayProject.splice(index, 1);
      UpdatedArray();
    }
  }
});

placeInboxList.addEventListener('click', (event) => {
  if (event.target.classList.contains('inbox__btn-edit')) {
    modalWindow.style.display = "block";
  }
  // else if (event.target.classList.contains('overlay')) {
  //   modalWindow.style.display = "none";
  // }
})

// ЧЕКБОКС И СЧЕТЧИК______________________________________________________

let arrayProgressCounter = [];
let timeoutID;
let progressCounter = document.querySelector(".header__counter");
let timer;
let updArray;

function checkBox(checkbox) {
  if (window.location.href.split('/').at(-1) == "index.html") {
    if (checkbox.checked) {
      const id = checkbox.parentNode.parentNode.parentNode.id;
      const task = arrayInbox.find(el => el.id == id);
      let index = arrayInbox.indexOf(task);
      // console.log(index);

      timeoutID = setTimeout(() =>
        checkbox.parentNode.parentNode.parentNode.style.display = 'none', 5000
      );
      arrayProgressCounter.push(1);

      timer = setTimeout(() =>
        arrayInbox.splice(index, 1), 5000
      );

      updArray = setTimeout(() =>
        UpdatedArray(), 5000
      );

    } else {
      clearTimeout(timeoutID);
      clearTimeout(timer);
      clearTimeout(updArray);
      arrayProgressCounter.pop();
    }
  }

  if (window.location.toString().indexOf('/3_quick.html') > 0) {
    if (checkbox.checked) {
      const id = checkbox.parentNode.parentNode.parentNode.id;
      const task = arrayQuick.find(el => el.id == id);
      let index = arrayQuick.indexOf(task);
      // console.log(index);

      timeoutID = setTimeout(() =>
        checkbox.parentNode.parentNode.parentNode.style.display = 'none', 5000
      );
      arrayProgressCounter.push(1);

      timer = setTimeout(() =>
        arrayQuick.splice(index, 1), 5000
      );

      updArray = setTimeout(() =>
        UpdatedArray(), 5000
      );
      console.log(arrayQuick);

    } else {
      clearTimeout(timeoutID);
      clearTimeout(timer);
      clearTimeout(updArray);
      arrayProgressCounter.pop();
    }
  }
  if (window.location.toString().indexOf('/4_projects.html') > 0) {
    if (checkbox.checked) {
      const id = checkbox.parentNode.parentNode.parentNode.id;
      const task = arrayProject.find(el => el.id == id);
      let index = arrayProject.indexOf(task);
      // console.log(index);

      timeoutID = setTimeout(() =>
        checkbox.parentNode.parentNode.parentNode.style.display = 'none', 5000
      );
      arrayProgressCounter.push(1);

      timer = setTimeout(() =>
        arrayProject.splice(index, 1), 5000
      );

      updArray = setTimeout(() =>
        UpdatedArray(), 5000
      );

    } else {
      clearTimeout(timeoutID);
      clearTimeout(timer);
      clearTimeout(updArray);
      arrayProgressCounter.pop();
    }
  }
  // let progressCounter = document.querySelector(".header__counter");
  progressCounter.textContent = arrayProgressCounter.length;
  localStorage.setItem("progressCounter", JSON.stringify(arrayProgressCounter.length));

}

// ЗАГРУЗКА СТРАНИЦЫ________________________________________________

addEventListener('DOMContentLoaded', () => {

  let lastLenghtCounter = Number(localStorage.getItem("progressCounter"));
  arrayProgressCounter.length = lastLenghtCounter;
  progressCounter.textContent = arrayProgressCounter.length;

  if (localStorage.getItem("arrayInbox") === null) {
    arrayInbox = [];
  } else {
    arrayInbox = JSON.parse(localStorage.getItem("arrayInbox"));
  }

  if (window.location.toString().indexOf('/index.html') > 0) {
    insertTasks(arrayInbox);
  }

  const arrTasks = getLocStorage("editedTasks");

  if (window.location.href.split('/').at(-1) == "10_category_sorting.html?category-home") {
    sortByCategory(arrTasks, 'Дом');
  }

  else if (window.location.href.split('/').at(-1) == "10_category_sorting.html?category-study") {
    sortByCategory(arrTasks, 'Учеба');
  }
  else if (window.location.href.split('/').at(-1) == "10_category_sorting.html?category-work") {
    sortByCategory(arrTasks, 'Работа');
  }
  else if (window.location.href.split('/').at(-1) == "10_category_sorting.html?category-selfimprovment") {
    sortByCategory(arrTasks, 'Саморазвитие');
  }
  else if (window.location.href.split('/').at(-1) == "10_category_sorting.html?category-health") {
    sortByCategory(arrTasks, 'Здоровье');
  }
  else if (window.location.href.split('/').at(-1) == "10_category_sorting.html?category-rest") {
    sortByCategory(arrTasks, 'Отдых');
  }
  else if (window.location.href.split('/').at(-1) == "10_category_sorting.html?category-hobby") {
    sortByCategory(arrTasks, 'Хобби');
  }
  else if (window.location.href.split('/').at(-1) == "10_category_sorting.html?category-ideas") {
    sortByCategory(arrTasks, 'Идеи');
  }
  else if (window.location.href.split('/').at(-1) == "10_category_sorting.html?category-household") {
    sortByCategory(arrTasks, 'Хозяйство');
  }
  else if (window.location.href.split('/').at(-1) == "10_category_sorting.html?category-sport") {
    sortByCategory(arrTasks, 'Спорт');
  }
  else if (window.location.href.split('/').at(-1) == "10_category_sorting.html?category-selfcare") {
    sortByCategory(arrTasks, 'Уход за собой');
  }

  if (window.location.href.split('/').at(-1) == "12_context_sorting.html?context-tel") {
    sortByContext(arrTasks, 'Телефон');
  }
  else if (window.location.href.split('/').at(-1) == "12_context_sorting.html?context-home") {
    sortByContext(arrTasks, 'Дом');
  }
  else if (window.location.href.split('/').at(-1) == "12_context_sorting.html?context-outside") {
    sortByContext(arrTasks, 'Вне дома');
  }
  else if (window.location.href.split('/').at(-1) == "12_context_sorting.html?context-school") {
    sortByContext(arrTasks, 'Школа');
  }
  else if (window.location.href.split('/').at(-1) == "12_context_sorting.html?context-kindergarden") {
    sortByContext(arrTasks, 'Дет. сад');
  }
  else if (window.location.href.split('/').at(-1) == "12_context_sorting.html?context-computer") {
    sortByContext(arrTasks, 'Компьютер');
  }
  else if (window.location.href.split('/').at(-1) == "12_context_sorting.html?context-minsk") {
    sortByContext(arrTasks, 'Минск');
  }
  else if (window.location.href.split('/').at(-1) == "12_context_sorting.html?context-in-town") {
    sortByContext(arrTasks, 'В городе');
  }
  else if (window.location.href.split('/').at(-1) == "12_context_sorting.html?context-delegated") {
    sortByContext(arrTasks, 'Делегировано');
  }

});

function sortByCategory(tasks, category) {
  const arr = tasks.filter(el => el.category === `${category}`);
  insertTasks(arr);
}

function sortByContext(tasks, context) {
  const arr = tasks.filter(el => el.context === `${context}`);
  insertTasks(arr);
}
// МЕНЮ________________________________________________________  _

// показывает выбранный пункт меню, выдавая класс с цветом
const menuItems = document.querySelectorAll('.menu__item');

menuItems.forEach(el => {
  el.addEventListener('click', function () {
    removeClassSelected();
    el.classList.add('menu__item_selected');
  });
});

function removeClassSelected() {
  menuItems.forEach(el => {
    el.classList.remove('menu__item_selected');
  })
};

// открывает и закрывает под-меню по клику + закрывает соседние
const submenu = document.querySelectorAll('.menu__item_withSubmenu');

submenu.forEach(el => {
  el.addEventListener('click', function () {

    if (el.classList.contains("menu__item_submenu_selected")) {
      el.classList.remove("menu__item_submenu_selected")
    } else {
      hideOtherSubmenu();
      el.classList.add('menu__item_submenu_selected');
    }

  });
});

function hideOtherSubmenu() {
  submenu.forEach(el => {
    el.classList.remove('menu__item_submenu_selected');
  })
};

// --------------- МОДАЛЬНОЕ ОКНО 1 -------------
let arrayProject = [];
let arrayReference = [];
let arrayQuick = [];
let arrayWaitingList = [];

function closePopup() {
  modalWindow.style.display = "none";
};

// висит на онклике кнопки "Сохранить" в модальном окне
function addValues() {
  // нужный объект найден в функции findTask и записан в глобальную переменную currentObject
  // забирает все значения из полей, записывает их в объект и выводит объект в консоль

  let name = document.getElementById("modalInput").value;
  currentObject.name = `${name}`;
  let type = document.getElementById("case_type");
  currentObject.type = `${type.value}`;
  let category = document.getElementById("project_category");
  currentObject.category = `${category.value}`;
  let context = document.getElementById("context_type");
  currentObject.context = `${context.value}`;
  let data = document.getElementById("date_type");
  currentObject.data = `${data.value}`;

  if (type.value != "") {
    arrayEditedTask.push(currentObject);
    localStorage.setItem("editedTasks", JSON.stringify(arrayEditedTask));
    let index = arrayInbox.indexOf(currentObject);
    arrayInbox.splice(index, 1);
    UpdatedArray();
  }
  // очищение полей модального окна
  type.value = "";
  category.value = "";
  context.value = "";
  data.value = "";
  // удаление карточки таска
  taskCard.remove();
  // закрытие модального окна

  sortByType();

  localStorage.setItem("arrayProject", JSON.stringify(arrayProject));
  localStorage.setItem("arrayReference", JSON.stringify(arrayReference));
  localStorage.setItem("arrayQuick", JSON.stringify(arrayQuick));
  localStorage.setItem("arrayWaitingList", JSON.stringify(arrayWaitingList));

  closePopup();
};


function UpdatedArray() {
  if (window.location.href.split('/').at(-1) == "index.html") {
    localStorage.removeItem("arrayInbox");
    localStorage.setItem("arrayInbox", JSON.stringify(arrayInbox));
  }

  if (window.location.toString().indexOf('/3_quick.html') > 0) {
    localStorage.removeItem("arrayQuick");
    localStorage.setItem("arrayQuick", JSON.stringify(arrayQuick));
  }
  if (window.location.toString().indexOf('/4_projects.html') > 0) {
    localStorage.removeItem("arrayProject");
    localStorage.setItem("arrayProject", JSON.stringify(arrayProject));
  }
};

//ЧЕРНОВИК СОРТИРОВКИ С ВЫВОДОМ В КОНСОЛЬ
//const projects = document.getElementById('projects');
//projects.addEventListener('click', sortByType());


function sortByType() {

  if (currentObject.type === 'Проекты') {
    arrayProject.push(currentObject);
  } else if (currentObject.type === 'Быстрые дела') {
    arrayQuick.push(currentObject);
  } else if (currentObject.type === 'Справочные материалы') {
    arrayReference.push(currentObject);
  } else if (currentObject.type === 'Лист ожидания') {
    arrayWaitingList.push(currentObject);
  }

};

// загрузка массива проекты на страницу проекты с отрисовкой

if (window.location.toString().indexOf('/4_projects.html') > 0) {
  document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("arrayProject") === null) {
      arrayProject = [];
    } else {
      arrayProject = JSON.parse(localStorage.getItem("arrayProject"));
    }
    insertTasks(arrayProject);
  });
};
// загрузка массива быстрые дела на страницу быстрые дела с отрисовкой
if (window.location.toString().indexOf('/3_quick.html') > 0) {
  document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("arrayQuick") === null) {
      arrayQuick = [];
    } else {
      arrayQuick = JSON.parse(localStorage.getItem("arrayQuick"));
    }
    insertTasks(arrayQuick);
  });
};

// загрузка массива справочные материалы на страницу справочные материалы с отрисовкой
if (window.location.toString().indexOf('/7_reference.html') > 0) {
  document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("arrayReference") === null) {
      arrayReference = [];
    } else {
      arrayReference = JSON.parse(localStorage.getItem("arrayReference"));
    }
    insertTasks(arrayReference);
  });
};
// загрузка массива лист ожилания на страницу лист ожидания с отрисовкой
if (window.location.toString().indexOf('/8_waiting-list.html') > 0) {
  document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("arrayWaitingList") === null) {
      arrayWaitingList = [];
    } else {
      arrayWaitingList = JSON.parse(localStorage.getItem("arrayWaitingList"));
    }
    insertTasks(arrayWaitingList);
  });
};

function getLocStorage(key) {
  return JSON.parse(localStorage.getItem(key))
}
//return arr.filter((el) => el.type.includes(query));


// --------------- МОДАЛЬНОЕ ОКНО 2 -------------

// let modalWindow2 = document.getElementById("overlay2");
// let btnClosePopup2 = document.getElementById("close2");
// let delay_popup2 = 5000;

// setTimeout(() => {
//   modalWindow2.style.display = "block";
// }, delay_popup2);

// btnClosePopup2.onclick = () => {
//   modalWindow2.style.display = "none";
// };



// ЧЕК_ЛИСТ

// $('.task__add').on('focus',function(){
//   $(this).val('');
// });

// $('.task__add').on('blur',function(){
//   $(this).val('+ add new task');
// });

// $('form').on('submit', function(event){
//   event.preventDefault();

//   var taskText = $('.task__add').val();
//   var tasksN = $('.task').length + 1;

//   var newTask = '<label for="task--' + tasksN + '" class="task task--new"><input class="task__check" type="checkbox" id="task--' + tasksN + '" /> <div class="task__field task--row">' + taskText + '<button class="task__important"><i class="fa fa-check" aria-hidden="true"></i></button></div></label>'


//   $('.task__list').append(newTask);

//   $('.task__add').val('');
//   checkList();
// });

// var lastDeletedTask = '';


// function checkList() {


//   $('.task').each(function(){

//     var $field = $(this).find('.task__field');
//     var mousedown = false;


//     $field.on('mousedown', function(){
//         mousedown = true;
//         $field.addClass('shaking');
//         setTimeout(deleteTask,1000)
//     });

//     $field.on('mouseup', function(){
//         mousedown = false;
//         $field.removeClass('shaking');
//     });

//     function deleteTask(){
//       if(mousedown) {
//         $field.addClass('delete');
//         lastDeletedTask = $field.text();
//         console.log(lastDeletedTask);

//         setTimeout(function(){
//            $field.remove();
//         }, 200);
//        } else {return;}
//     }

//   });
// }

// checkList();

// let nameTask == inbox.value;

// let task = {
//     nameTask: "",
//     category: "",
//     contextTask: "",
//     dateTask: "",
//     stages:[]
// }

// let stage = {
//   nameStage: "",
//   contextStage: "",
//     dateStage: "",
// }



// function generateInboxList() {
//     arrayInbox.push(inbox.value);
//     console.log(arrayInbox);
//     placeInboxList.innerHTML += `<li class="inbox__listItem listItem">


//     <div class="inbox__inputfield">
//       <label class="inbox__check check">
//         <input type="checkbox" class="inbox__input-check"/>
//         <span class="inbox__checkmark checkmark"></span>
//       </label>
//     </div>



//     <div class="inbox__item">${inbox.value}</div>
//     <button class="inbox__btn-edit btn">
//       <img
//         class="header__buttonpic-edit"
//         src="./assets/images/pencil_white.png"
//         alt="logo_white"
//       />
//     </button>
//     <button class="inbox__btn-delite btn" onclick="InboxDelite()">
//       <img
//         class="header__buttonpic"
//         src="./assets/images/delite_white.png"
//         alt="logo_white"
//       />
//     </button>
//   </li>`

//   inbox.value = "";
//   console.log(buttonInboxEdit);
// }

// const objInbox = {
//   name: inbox.value,
//   type: "",
//   category: "",
//   context: "",
//   date: "",
// id:"",

//     }

// function InboxDelite() {
//     inboxItem.innerHTML = null;
// }
// placeInboxList

// function Storage() {
//   this._ITEMS_DESCRIPTOR = 'items'; // Я полагаю, ключ по умолчанию?
// }
// // let key будет указан при вызове метода, или по умолчанию устанавливается в the private property _ITEMS_DESCRIPTOR
// Storage.prototype.get = function(key) {
//   var fromStorage = localStorage.getItem(key  ? key : this._planerTaskObjId);
//   return fromStorage ? JSON.parse(fromStorage) : [];
// };
// Storage.prototype.set = function(key, items) {
//   localStorage.setItem(key, JSON.stringify(items));