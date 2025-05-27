document.addEventListener("DOMContentLoaded",()=> {   // ()=> is the same as function() 
    const saved = JSON.parse(localStorage.getItem("groceryItems")) || []; // check the Local storage for saved items
                                                                   //JSON string turns into Java Script array
    saved.forEach (item => renderTask(item.text,item.bought )); // call renderTask for saved items to reappear on the page

});


const itemInput = document.getElementById("itemInput");
const addItem = document.getElementById("addItem");
const filterSection = document.getElementById("filterSection");
const groceryList = document.getElementById("groceryList");

function renderTask(text, bought) {    //define the function that has items, checkbox, span, delete btn
   const li = document.createElement("li");  // create li element for each item
   
   const checkBox = document.createElement("input");  // create a checkbox
     checkBox.type = "checkbox";   //shows browser that this a checkbox
     checkBox.checked = bought;   // set as checked if item is bought

    const span = document.createElement("span");   // create a span to hold the item
        span.innerText = text;                     // fill it with the text
        if (bought) li.classList.add("bought");    //if bought - add CSS class


    const deleteItem = document.createElement("button");   // create delete btn to remove the item
        deleteItem.innerText = "Delete";                   // label as Delete
        deleteItem.classList.add("deleteBtn");             // for CSS


// assemble the li element
li.appendChild(checkBox);
li.appendChild(span);
li.appendChild(deleteItem);

groceryList.appendChild(li); // add the new li to ul
}
// Event Delegation for checkbox and Delete btn inside of the item list
groceryList.addEventListener("click", function(e) {   //when clicks happens anywhere inside of ul
    const target = e.target;      //get the actual element that was clicked

    if (target.matches("input[type='checkbox']")) {   // if click checkbox
        const li = target.closest("li");    //find the parent li of this checkbox
        li.classList.toggle("bought", target.checked);  //toggle the bought class based on checkbox state
        saveItems();    //save to Local Storage
        applyFilter();   // the list updates if filtered
    }

    if(target.classList.contains("deleteBtn")) {   // if click Delete btn
        const li = target.closest("li");   // find the parent li of that button
        li.remove();     //remove the item from DOM
        saveItems();   //save to Local Storage
    }

});

addItem.addEventListener("click", function() {  // when click "add Item"
    const text = itemInput.value.trim();             //trim whitespace from input
    if (!text) {                               // if empty - alert
        alert ("Please enter a new item.");
        return;
    }
    renderTask(text, false);             // create a new item, marked bought
    itemInput.value = "";                // clear the input for the new item
    saveItems();                         // saves to the Local Storage
});

function saveItems() {                   // saves all of the items to Local Storage
    const items = [];                    //Start with an empty array to collect item objects
    groceryList.querySelectorAll("li").forEach(li => {   //select all of the li from the page 
        items.push({
            text:li.querySelector("span").innerText,  //take the item
            bought: li.classList.contains("bought")   //take the bought status
        });
    });
    localStorage.setItem("groceryItems", JSON.stringify(items)); } //Convert the array to JSON and store under “items”



filterSection.addEventListener("change", applyFilter);    // when change radio button - apply filter

function applyFilter() {
    const filter = filterSection.querySelector("input[name='filter']:checked").value;  // check which radio is selected
    groceryList.querySelectorAll("li").forEach(li => {   // go through every item in the list
        if(filter === "all") {    // if "All" is selected - show everything
            li.style.display = "";
        } else if (filter ==="bought") {   // if "Bought" is selected - show only checked items
            li.style.display = li.classList.contains("bought") ? "" : "none";
        } else if (filter ==="unbought") {    // if "Unbought" is selected - show only unchecked items
            li.style.display = li.classList.contains("bought") ? "none" : "";
        }

     });
}