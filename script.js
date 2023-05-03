const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
// const items = itemList.querySelectorAll('li'); //we must cdefine it inside that function otherwise we will not be able to get newly added items




const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}


const onAddItemSubmit = (e)=>{
    e.preventDefault();

    const newItem = itemInput.value;

    // Validate Input
    if(newItem === ''){
        alert('Please add an item');
        return;
    }

    // // Create List Item
    // const li = document.createElement('li');
    // li.appendChild(document.createTextNode(newItem));
    
    // const button = createButton('remove-item btn-link text-red');
    // li.appendChild(button)
    // // Add li to the dom
    // itemList.appendChild(li);


    // check for edit mode
    if(checkIfItemExists(newItem)){
        alert('That item already exists!');
        return
    }
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
        }
    // }else{
    //     if(checkIfItemExists(newItem)){
    //         alert('That item already exists!');
    //         return
    //     }
    // }
    
    
    //  Create Item DOM Element
    addItemToDOM(newItem);

    // Add item to local Storage
    addItemToStorage(newItem);

    checkUI();
    itemInput.value = '';
}
function addItemToDOM(item){
    // Create List Item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    
    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button)
    // Add li to the dom
    itemList.appendChild(li);
}

const createButton = (classes) =>{
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon)
    return button;
}
const createIcon = (classes) =>{
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function addItemToStorage(item){
    // let itemsFromStorage;
    // if(localStorage.getItem('items') === null){
    //     itemsFromStorage = [];
    // }else{
    //     itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    // }

    const itemsFromStorage = getItemsFromStorage();

    // Add new item to Array
    itemsFromStorage.push(item);

    // convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

function getItemsFromStorage(){
    let itemsFromStorage;
    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    }else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
    removeItem(e.target.parentElement.parentElement)
    }else{
        setItemToEdit(e.target)
    }
}

function checkIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage();
//     if(itemsFromStorage.includes(item)){
//         return true;
//     }else{
//         return false;
//     }
// shortcut
return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode = true;
    itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item'
    formBtn.style.backgroundColor = '#228b22';
    itemInput.value = item.textContent;
}

const removeItem = (item)=>{
    // if(e.target.parentElement.classList.contains('remove-item')){
    //     if(confirm("Are You Sure?")){
    //         e.target.parentElement.parentElement.remove();
    //         checkUI()
    //     }
    // }
    if(confirm('Are You Sure?')){
        // remove item from DOM
        item.remove();

        // remove item from storage
        removeItemFromStorage(item.textContent)
        checkUI();
    }
}

function removeItemFromStorage(item){
    let itemsFromStorage =getItemsFromStorage();

    // Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i)=> i!== item);

    // Re set to local storage
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

const clearItems = (e)=>{
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild)
    }

    // clear from local storage
    localStorage.removeItem('items');
    checkUI()
}

function filterItems(e){
    const text = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll('li');

    items.forEach(item =>{
        const itemName = item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(text) !== -1){
            item.style.display = 'flex';
        }else{
            item.style.display = 'none';
        }
    })
    
}

function checkUI(){
    itemInput.value = '';
    const items = itemList.querySelectorAll('li');
    if (items.length === 0){
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    }else{
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }
    formBtn.innerHTML= '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor ='#333'
    isEditMode = false;
}

// Initialize App
function init(){
    // Event Listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    // itemList.addEventListener('click', removeItem); made it onClickItem for reuseability
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);
    checkUI();
}

init();