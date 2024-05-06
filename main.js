//! gerekli HTML elementlerini seç
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");


let editElement;
let editFlag = false; // Düzenleme modunda olup olmadığını belirtir.
let editID = ""; // Düzenleme yapılan ögenin benzersiz kimliği

//! fonksiyonlar

const setBackToDefault = () => {}


const displayAlert = (text, action) => {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    setTimeout( ()=>{
        alert.textContent = ""
        alert.classList.remove(`alert-${action}`);
    },2000);
};

// tıkladıgımızda "artickle" etiketini ekrandan kaldırıcak fonksiyondur
const deleteItem = (e) => {
    const element = e.currentTarget.parentElement.parentElement; // "artickle" etiketine eriştik
    const id = element.dataset.id;
    list.removeChild(element); // list etiketinden "artickle" etiketini kaldırdık
    displayAlert("öğe kaldırıldı", "danger");
    setBackToDefault();
    removeFromLocalStorage(id)
};

const editItem = (e) => {
    const element = e.currentTarget.parentElement.parentElement; // "artickle" etiketine parentEelement sayesinde eriştik
   editElement = e.currentTarget.parentElement.previousElementSibling; // butonun kapsayıcısına eriştikten sonra kapsayıcının kardeş etiketine eriştik
   // tıkladıgım "artickle"
   grocery.value = editElement.innerText;

   editFlag = true;
   editID = element.dataset.id;
   submitBtn.textContent = "Düzenle";
};


const addItem = (e) => {
    e.preventDefault(); // formun otomatik olarak gönderilmesini engller.
    const value = grocery.value // form içerisinde bulunan inputun değerini aldık
    const id = new Date().getTime().toString(); // benzersiz bir id oluşturduk

    if (value !== "" && !editFlag) {
        const element = document.createElement("article"); // yeni bir artickle etiketi oluşturduk
        let attr = document.createAttribute("data-id"); // yeni bir veri kimliği oluşturur
        attr.value = id;
        element.setAttributeNode(attr); // oluşturduğumuz id yi "artickle etiketine ekledik"
        element.classList.add("grocery-item"); // oluşturdugumuz "artickle" etiketine class ekledik
        element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
         `;

         const deleteBtn = element.querySelector(".delete-btn");
         deleteBtn.addEventListener("click", deleteItem);
         const editBtn = element.querySelector(".edit-btn");
         editBtn.addEventListener("click", editItem);
         // kapsayıcıya oluşturdugumuz "artickle" etiketini ekleme
         list.appendChild(element);
         displayAlert("Başarıyla Eklendi", "success");
         container.classList.add("show-container");
         // local storage ekleme
         addToLocalStorage(id, value);
         setBackToDefault();
    }else if(value !== "" && editFlag) {
        editElement.innerText = value;
        // ekrana alert yapısını bastırdık
        displayAlert("değer değiştirildi", "success");
        editLocalStorage(editID,value);
        setBackToDefault();
    }
};

const clearItems = () => {
    const items = document.querySelectorAll(".grocery-item"); 
    // listede öge varsa çalışır
    if (items.length > 0){
        items.forEach((item) => list.removeChild(item)); // "items" yerine items değişkenini yazarak, seçilen öğeleri konsola yazdırabilirsiniz
    }
    container.classList.remove("show-container");
    displayAlert("Liste Boş", "danger");
    setBackToDefault();
};
clearItems();

const createListItem = (id, value) => {
    const element = document.createElement("article"); // yeni bir artickle etiketi oluşturduk
        let attr = document.createAttribute("data-id"); // yeni bir veri kimliği oluşturur
        attr.value = id;
        element.setAttributeNode(attr); // oluşturduğumuz id yi "artickle etiketine ekledik"
        element.classList.add("grocery-item"); // oluşturdugumuz "artickle" etiketine class ekledik
        element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
         `;

         const deleteBtn = element.querySelector(".delete-btn");
         deleteBtn.addEventListener("click", deleteItem);
         const editBtn = element.querySelector(".edit-btn");
         editBtn.addEventListener("click", editItem);
         // kapsayıcıya oluşturdugumuz "artickle" etiketini ekleme
         list.appendChild(element);
         container.classList.add("show-container");
};

const setupItems = () => {
    let items =  getLocalStorage();
    if (items.length > 0) {
        items.forEach((item) => {
            createListItem(item.id, item.value);
        });
    }
};



//! olay izleyicileri
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);

// local storage 
// yerel depoya öge ekleme işlemi
const addToLocalStorage = (id,value) => {
    const grocery = {id, value};
    let items = getLocalStorage();
    items.push(grocery);
    console.log(items);
    localStorage.setItem("List", JSON.stringify(items));
};


// yerel depodan öğeleri alma işlemi
const getLocalStorage = () => {
    return localStorage.getItem("list")
     ? JSON.parse(localStorage.getItem("list"))
      : [];
};

// localstoragedan veriyi silme
const removeFromLocalStorage = (id) => {
    // local storageda bulunan verileri getir
    let items = getLocalStorage();
    // tıkladıgım etiketin id si localstoragda ki id eşit değilse bunu diziden çıkar ve yeni bir elemana aktar
    items = items.filter((item) => {
        if (item.id !== id){
            return item;
        }
    });
        console.log(items);
        localStorage.setItem("list",JSON.stringify(items));
};

// yerel depoda update işlemi
const editLocalStorage = (id, value) => {
    let items = getLocalStorage();
    // yerel depodaki verilerin  id ile güncellenecek olan verinin id si birbirine eşit ise inputa girilen value
    // değişkenini al localstorageda bulunan verilerin valuesuna aktar
   items = items.map((item) => {
        if (item.id === id){
            item.value = value
        }
        return item;
    });
   localStorage.setItem("list", JSON.stringify(items));
};


