// variables
let table = document.querySelector("table tbody");
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let searchTitleBtn = document.getElementById("search-title");
let searchCategoryBtn = document.getElementById("search-category");


let state = "create";
let productIndex;

let searchState = "title";
let searchInput = document.getElementById("search");


// events

price.addEventListener("keyup", getTotal);
taxes.addEventListener("keyup", getTotal);
ads.addEventListener("keyup", getTotal);
discount.addEventListener("keyup", getTotal);
submit.addEventListener("click", createProducts);
searchCategoryBtn.addEventListener("click", function() {setSearchState(this.id)});
searchTitleBtn.addEventListener("click", function() {setSearchState(this.id)});
searchInput.addEventListener("keyup", function() {searchData(this.value)});
// functions



// get total price
function getTotal() {
    if (price.value !== "" && taxes.value !="" && ads.value !="" && discount.value!= "") {
        let res = (+price.value + +taxes.value + +ads.value) - (+discount.value);
        total.textContent = res;
        total.style.background = "green";
    } else {
        total.textContent = "";
        total.style.background = "red";
    }
}

// create products and save data

let products;

if (localStorage.getItem("products") != null) {
    products = JSON.parse(localStorage.getItem("products"));

} else {
    products = []
}

function createProducts() {

    let productInfo = {
        title:    title.value.toLowerCase(),
        price:    price.value,
        taxes:    taxes.value,
        ads  :    ads.value,
        discount: discount.value,
        count:    count.value,
        category: category.value.toLowerCase(),
        total:    total.innerHTML
    }

    if (title.value != "" && price.value != "" && category.value != "" && count.value <= 100) {
        if (state === "create") {
            if (productInfo.count > 1) {
                for (let x = 1; x <= productInfo.count; x++) {
                    products.push(productInfo);
                }
            } else {
                products.push(productInfo);
            }
        } else {
            
            products[productIndex] = productInfo;
            state = "create";
            submit.innerHTML = "Create";
            count.style.display = "inline-block";
            category.style.minWidth = "50%";
        }

        clearInputs();
    }
    
    
    localStorage.setItem("products", JSON.stringify(products));
    renderTable();
    getTotal();
}

// clear inputs

function clearInputs() {
    title.value    = "",
    price.value    = "",
    taxes.value    = "",
    ads.value      = "",
    discount.value = "",
    count.value    = "",
    category.value = "",
    total.innerHTML= ""
}

// Render table row data

function renderTable() {
    let tableCells = '';

    tableCells += products.map((pro, index) => {
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${pro.title}</td>
                <td>${pro.price}</td>
                <td>${pro.ads}</td>
                <td>${pro.discount}</td>
                <td>${pro.total}</td>
                <td>${pro.category}</td>
                <td><button id="update" onclick="updateValues(${index})">Update</button></td>
                <td><button id="delete" onclick="deleteProduct(${index})">Delete</button></td>
            </tr>
        `
    }).join("")

    table.innerHTML = tableCells;
    // create deleteAll button
    let clearAllBtn = document.getElementById("clearAll");

    if (products.length) {
        clearAllBtn.innerHTML = `<button onclick='deleteAll()'>Clear all (${products.length})</button>`
    } else {
        clearAllBtn.innerHTML = ""
    }


}

renderTable();


// delete one product

function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    renderTable();
}

// delete all

function deleteAll() {
    localStorage.clear();
    products.splice(0)   // products = [];

    renderTable()
}

// update values

function updateValues(index) {
    
    let product = products[index];
    title.value = product.title;
    price.value = product.price;
    taxes.value = product.taxes;
    ads.value = product.ads;
    discount.value = product.discount;
    category.value = product.category;
    
    getTotal();

    count.style.display = 'none';
    category.style.minWidth = "100%";
    submit.innerHTML = "Update";
    state = "update";
    productIndex = index;

    scroll({
        top: 0,
        behavior: "smooth"
    })

}

// search

function setSearchState(id) {
    if (id === "search-title") {
        searchState = "title"
    } else {
        searchState = "category"
    }

    searchInput.value = "";
    searchInput.focus();
    searchInput.placeholder = `Search by ${searchState}`;
    renderTable();
}

function searchData(value) {
    let tableCells = "";
    products.map((pro, index) => {
        if (searchState === "title"){
            if (pro.title.includes(value.toLowerCase())) {
                tableCells += renderRow(pro, index)
                table.innerHTML = tableCells;
            }

        } else {
            if (pro.category.includes(value.toLowerCase())) {
                tableCells += renderRow(pro, index)
                table.innerHTML = tableCells;
            }
        }
    })
}

function renderRow(pro, index) {
    return `
        <tr>
            <td>${index + 1}</td>
            <td>${pro.title}</td>
            <td>${pro.price}</td>
            <td>${pro.ads}</td>
            <td>${pro.discount}</td>
            <td>${pro.total}</td>
            <td>${pro.category}</td>
            <td><button id="update" onclick="updateValues(${index})">Update</button></td>
            <td><button id="delete" onclick="deleteProduct(${index})">Delete</button></td>
        </tr>
    `
}
