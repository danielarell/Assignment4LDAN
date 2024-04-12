let products_toShow = [];

document.addEventListener("DOMContentLoaded", function() {
    getData();
    actualPage = sessionStorage.getItem('page') || 1; // Recupera la página actual del sessionStorage o establece 1 como valor predeterminado
});

async function getData()
{
    console.log("hola");
    await DataManager.loadData();

    products_toShow = productsArray.slice();

    console.log(products_toShow);
}

async function addToCart(id)
{
    const { value: amount } = await Swal.fire({
        title: "How many products do you want to add to the cart",
        input: "number",
        showCancelButton: true,
        confirmButtonText: `
        Add to <i class="bi bi-cart"></i>
        `,
        inputLabel: "Amount of products",
        inputPlaceholder: "Amount"
      });
      if (amount && amount > 0) {
        Swal.fire(`Products Added: ${amount}`);
         //addtocart function fetch
        if(sessionStorage.getItem("userEmail")==null)
        {
          Swal.fire("Error", "No has iniciado sesion" , "error");
          return;
        }
        addItem(id, amount);
      }else{
        Swal.fire("Action cancelled");
      }

   
}

async function addItem(productUuid, a) {
    
    let product = productsArray.find(e => e.uuid == productUuid);
    let user = sessionStorage.getItem("userEmail");

    if(product.stock < a)
    {
      Swal.fire("Insufficient Stock, Action Cancelled");
      return;
    }

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
}

function disableEnableButton(){
  let inputs = document.querySelectorAll('input')
  let button = document.querySelector('button')
  let inputArr = Array.from(inputs)
  button.classList.remove('disabled')
  if( inputArr.some(input => !input.value)){
      button.classList.add('disabled')
  }
}

function createInputAsHTML(name, type){
  let html = `<input class="form-control mb-3" id="${name}" name="${name}" type="${type}" placeholder="password" required >`
  //last div inside the form
  let lastDiv = document.querySelector("form > div:last-of-type")
  lastDiv.insertAdjacentHTML('afterend', html)
}

document.querySelectorAll('input').forEach(e => e.onchange = disableEnableButton)

