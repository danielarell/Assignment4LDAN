let productsInCart = [];

document.addEventListener("DOMContentLoaded", function() {
    loadCart();
    
    
});

async function loadCart()
{
    let user = sessionStorage.getItem("userEmail");
    let resp = await fetch('https://products-dasw.onrender.com/api/cart',{
        method :'GET',
        headers: {
            'x-expediente':743961,
            'x-user': user
        }
    })

    console.log(resp.status);
    let data = await resp.json()
    console.log(data);
    
    productsInCart = data;

    console.log(productsInCart);

    renderShoppingCart(productsInCart.cart);

}


function renderShoppingCart(productsInCart) {
    let html = '';

    // Iniciar el Media Object
    html += `
        <div class="container mt-5">
            <div class="row custom-margin">
                <div class="col-md-8">
                    <div class="media border p-3">
    `;

    
    productsInCart.forEach(product => {
        if (product) {
            html += `
            <div class="media-body">
                <div class="row">
                    <div class="col-md-8 mt-50">
                        <h4>${product.product.name} <button class="btn btn-danger btn-sm" onclick="banish('${product.product.uuid}')"><i class="bi bi-trash3-fill"></i></button></h4>
                        <div class="input-group">
                        <span class="input-group-text">Cantidad</span>
                        <input type="number" class="form-control quantity-input" value="${product.amount}" readonly>
                        <button class="btn btn-outline-secondary edit-button" type="button" onclick="toggleButtons('${product.product.uuid}')">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button class="btn btn-success save-button" type="button" style="display: none;" onclick="editItem('${product.product.uuid}')">
                        <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger cancel-button" type="button" style="display: none;" onclick="toggleButtonsOff('${product.product.uuid}')">
                        <i class="bi bi-x"></i>
                        </button>
                    </div>
                        <div class="input-group mt-3">
                            <span class="input-group-text">Price per Unit</span>
                            <input type="number" class="form-control" value="${product.product.pricePerUnit}" readonly>
                            <span class="input-group-text">MXN</span>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <img src="${product.product.imageUrl}" alt="Product Image" class="mt-3 rounded" style="width: 100px; height: 100px;">
                    </div>
                </div>
            </div>`;
        }
    });

    // Renderizar el total
    let totalCost = 0;
    html += `
                    </div>
                </div>
                <div class="col-md-4 mt-md-0 mt-3"> 
                    <div class="media border p-3 w-100">
                        <div class="media-body">
                            <h4>Total de la compra:</h4>`;
    productsInCart.forEach(product => {
        if (product) {
            let productTotal = product.amount * product.product.pricePerUnit;
            html += `
                            <p><b>${product.product.name}:</b> ${product.amount} x $${product.product.pricePerUnit.toFixed(2)} MXN</p>`;
            totalCost += productTotal;
        }
    });
    html += `
                            <h5>Total: $${totalCost.toFixed(2)} MXN</h5>
                            <div class="text-center">
                                <a class="btn btn-primary btn-lg px-4 py-2" href="#" role="button">Pagar</a>
                            </div>
                            <div class="text-center mt-2">
                                <a class="btn btn-danger btn-lg px-4 py-2" href="#" role="button">Cancelar</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    // Renderizar en el HTML
    View.render(html, "cart");
}

function toggleButtons(productUuid) {

    
    swal({
        title: "Are you sure you want edit this product?",
        text: "Once updated, you will need to reedit the product to change",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {

            const quantity_inputs = document.querySelectorAll('.quantity-input');

            productsInCart.cart.forEach((prod, index) =>{
                if(prod.product.uuid == productUuid)
                {
                    quantity_inputs[index].removeAttribute('readonly');
                }
            })
          
        } else {
          swal("No changes commited");
          toggleButtonsOff();
        }
      });
    
      const editButtons = document.querySelectorAll('.edit-button');
      const saveButtons = document.querySelectorAll('.save-button');
      const cancelButtons = document.querySelectorAll('.cancel-button');
      
      // Iterar sobre todos los productos en el carrito
      productsInCart.cart.forEach((product, index) => {
          if (product.product.uuid === productUuid) {
              // Mostrar los botones de guardar y cancelar, ocultar el botón de editar para el producto correspondiente
              editButtons[index].style.display = 'none';
              saveButtons[index].style.display = 'inline-block';
              cancelButtons[index].style.display = 'inline-block';
          } else {
              // Ocultar los botones de guardar y cancelar, mostrar el botón de editar para los otros productos
              editButtons[index].style.display = 'inline-block';
              saveButtons[index].style.display = 'none';
              cancelButtons[index].style.display = 'none';
          }
      });
}

function toggleButtonsOff(productUuid) {

    const quantity_inputs = document.querySelectorAll('.quantity-input');

            productsInCart.cart.forEach((prod, index) =>{
                if(prod.product.uuid == productUuid)
                {
                    quantity_inputs[index].setAttribute('readonly', true);
                }
            })
    const editButtons = document.querySelectorAll('.edit-button');
      const saveButtons = document.querySelectorAll('.save-button');
      const cancelButtons = document.querySelectorAll('.cancel-button');
      
      // Iterar sobre todos los productos en el carrito
      productsInCart.cart.forEach((product, index) => {
          if (product.product.uuid === productUuid) {
              // Mostrar los botones de guardar y cancelar, ocultar el botón de editar para el producto correspondiente
              editButtons[index].style.display = 'inline-block';
              saveButtons[index].style.display = 'none';
              cancelButtons[index].style.display = 'none';
          } else {
              // Ocultar los botones de guardar y cancelar, mostrar el botón de editar para los otros productos
              editButtons[index].style.display = 'inline-block';
              saveButtons[index].style.display = 'none';
              cancelButtons[index].style.display = 'none';
          }
      });

    loadCart()
    }

async function removeItem(id)
{


    console.log("item to remove" + id);

    let user = sessionStorage.getItem("userEmail");
    let resp = await fetch('https://products-dasw.onrender.com/api/cart/'+id,{
        method :'DELETE',
        headers: {
            'x-expediente':743961,
            'x-user': user
        }
    })

    console.log(resp.status);
    let data = await resp.json()
    console.log(data);
    
    productsInCart = data;

    console.log(productsInCart);

    loadCart();

}

function banish(id)
{

    let prod = productsInCart.cart.find(e => e.uuid == id);

    swal({
        title: "Are you sure you want to delete: " + prod.product.name + "?",
        text: "Once deleted, you will not be able to recover this user record",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
         

          removeItem(id);
          

        } else {
          swal("The product is safe!");
        }
      });
}

function editItem(id)
{
    let new_amount;

    let prod = productsInCart.cart.find(e => e.uuid == id);

    console.log(prod);

    const quantity_inputs = document.querySelectorAll('.quantity-input');

    productsInCart.cart.forEach((prod, index) =>{
        if(prod.product.uuid == id)
        {
            new_amount = quantity_inputs[index].value; 
        }
    })

    if(new_amount <= 0)
    {
        banish(id);
    }else if(new_amount > prod.product.stock)
    {
        swal("Insufficient Stock, Action Cancelled");
        loadCart();
        return;
    }else{
        //update
        addItem(id,new_amount);
       
    }

    console.log(new_amount);
}

async function addItem(productUuid, a) {
    
    let product = productsArray.find(e => e.uuid == productUuid);
    let user = sessionStorage.getItem("userEmail");

    console.table(productUuid);
    console.log(a);
    console.log(user);

    let amount = a;
    
    let body= {amount};

    console.log(body);
    let resp = await fetch('https://products-dasw.onrender.com/api/cart/'+productUuid,{
        method: 'POST',
        headers: {
            'x-expediente': 743961,
            'x-user': user,
            'Content-type':'Application/json'
        },
        body: JSON.stringify(body)
    })
    let data = await resp.json()
    console.log(data);

    loadCart();
}