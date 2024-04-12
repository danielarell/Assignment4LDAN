document.addEventListener("DOMContentLoaded", function() {
    loadData();
    load_add_button();
});

function load_add_button()
{
    if(sessionStorage.getItem("token") == 'true')
    {
        console.log("entro al rendering");
        let html = '';
        html += `<button class="btn btn-primary"
        href="#"
        
        class="text-white text-decoration-none mx-2"
        data-bs-toggle="modal"
        data-bs-target="#registroRecetaModal"
        role="button"
        >Add Product  <i class="bi bi-plus-circle"></i></button>`

        document.getElementById('add_product').innerHTML = html;
    }
}

document.querySelector('#filterBtn').addEventListener('click', readFilterValues);

function readFilterValues() {
    let selectedCategory = document.querySelector('#categories').value;
    let minPrice = document.querySelector('#minPrice').value;
    let maxPrice = document.querySelector('#maxPrice').value;

    console.log('Selected category:', selectedCategory);
    console.log('Minimum Price:', minPrice);
    console.log('Maximum Price:', maxPrice);

    let prodlist = usersArray.slice();
    if(selectedCategory)
    {
        prodlist = prodlist.filter(e => e.category == selectedCategory);
        showUsersTable(prodlist);
    }

    if(minPrice){
        prodlist = prodlist.filter(e=> e.pricePerUnit >= minPrice);
    }

    if(maxPrice)
    {
        prodlist = prodlist.filter(e=> e.pricePerUnit <= maxPrice)
    }

    showUsersTable(prodlist);


    let pages=document.querySelector('#pagination');
    pages.style.display = 'none';
}

function saveSelectedCategory() {
    let selectedCategory = document.querySelector('#categories').value;
    console.log('Selected category:', typeof(selectedCategory));
}

async function loadData(){
    
    console.log("inside");
    let resp = await fetch('https://products-dasw.onrender.com/api/products',{
            method :'GET',
            headers: {
                'x-expediente':743961,
                'x-auth': 'admin'
            }
        })

    console.log(resp.status);
    let data = await resp.json()
    console.log(data);
    sessionStorage.setItem('users', JSON.stringify(data))
    usersArray=data;
    showUsersTable(usersArray)

    let pages=document.querySelector('#pagination');
    pages.style.display = 'none';
    
}

function showUsersTable(prodlist)
{
    DataManager.pagination(1,prodlist,View.toHtmlTable, 1000);
}

 

function editProduct(id){
    
    let productData = usersArray.find(u => u.uuid == id)

    console.log("Product to edit: ",id);
    let modalId = document.getElementById('productEditModal');
    console.log(modalId);
    console.log(productData);
    
    let myModal = new bootstrap.Modal(modalId, {});

    document.querySelector("#id").value = productData.uuid;
    document.querySelector("#name_edit").value = productData.name;
    document.querySelector("#descripcion").value = productData.description;
    document.querySelector("#price").value = productData.pricePerUnit;
    document.querySelector("#stock").value = productData.stock;
    document.querySelector("#categoryDropDown").value = productData.category;
    document.querySelector("#unit").value = productData.unit;
    document.querySelector("#url").value = productData.imageUrl;



    myModal.show();
    
}

async function StoreEditedProduct(){
    console.log("entro")
    let id = document.querySelector("#id").value;
    let name = document.querySelector("#name_edit").value;
    let description = document.querySelector("#descripcion").value;
    let pricePerUnit = document.querySelector("#price").value;
    let stock = document.querySelector("#stock").value;
    let category = document.querySelector("#categoryDropDown").value;
    let unit = document.querySelector("#unit").value;
    let imageUrl = document.querySelector("#url").value;

    stock = parseFloat(stock);
    pricePerUnit = parseFloat(pricePerUnit);

    console.log(typeof(stock));
    
    let userData = {name, description, pricePerUnit, stock, category, imageUrl, unit}

    let resp = await fetch('https://products-dasw.onrender.com/api/products/'+id,{
        headers:{
            'x-expediente':'743961',
            'x-auth': 'admin',
            'content-type': 'Application/json'
        },
        method: 'PUT',
        body: JSON.stringify(userData)
    })

    let data = await resp.json()


    if(!data.error){
        //https://sweetalert.js.org/
        swal("Data Updated", "User:"+ data.name + " updated" , "success");
        loadData()
    }else{
        swal("Error", data.error , "error");
    }

    console.log(data);


}

async function sendData(id = null){
    event.preventDefault()
    if(sessionStorage.getItem("userEmail") == null)
    {
      swal("Error", "No has iniciado sesion" , "error");
      return;
    }
  
    if(id == null)
    {
      let name = document.getElementById('name_create').value;
      let description = document.getElementById('descripcion_create').value;
      let pricePerUnit = document.getElementById('price_create').value;
      let stock = document.getElementById('stock_create').value;
      let category = document.getElementById('categoryDropDown_create').value;
      let unit = document.getElementById('unit_create').value;
      let imageUrl = document.getElementById('url_create').value;

      stock = parseFloat(stock);
      pricePerUnit = parseFloat(pricePerUnit);

  
      let body= {name, description, pricePerUnit, stock, category, unit, imageUrl}
  
      console.log(body);
      let resp = await fetch('https://products-dasw.onrender.com/api/products',{
          method: 'POST',
          headers: {
              'x-expediente': 743961,
              'x-auth': 'admin',
              'Content-type':'Application/json'
          },
          body: JSON.stringify(body)
      })
      let data = await resp.json()
      console.log(data);

      if(!data.error){
        //https://sweetalert.js.org/
        swal("Data Updated", "User:"+ data.name + " updated" , "success");
        loadData()
        }else{
            swal("Error", data.error , "error");
        }
      
    }  
    
  }

