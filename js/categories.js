let prodlist_cat;

document.addEventListener("DOMContentLoaded", function() {
    getData_2();
    actualPage = sessionStorage.getItem('page') || 1; // Recupera la página actual del sessionStorage o establece 1 como valor predeterminado
});

function getData_2()
{
    let category = document.querySelector("#categoria_actual");
    console.log(category.textContent);
    DataManager.loadData(category.textContent);
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
