let exists = document.querySelector('#search_input');
if(exists)
    document.querySelector('#search_input').addEventListener('input', searchByName);


function logIn()
{
    console.log("Entro al login");
    let userInfo = document.querySelector('#login_e-mail')
    let userEmail = userInfo.value;
    sessionStorage.setItem("userEmail", userEmail);
    console.log(sessionStorage.getItem("userEmail")); 
    
    load_if_Admin();
}

function load_if_Admin()
{
    console.log("Entra a la funcion de carga del botón")
    let userEmail = sessionStorage.getItem("userEmail");

    if(userEmail == 'admin@gmail.com')
    {
        sessionStorage.setItem("token", true);
        
    }else{
        sessionStorage.setItem("token", false);
    }
    
    
    return;
}

function searchByName()
{
    let searchPrompt = document.querySelector('#search_input')
    let queryToSearch = searchPrompt.value;

    let productsToShow = productsArray.filter(element =>    element.name.toLowerCase().includes(queryToSearch.toLowerCase()) || 
                                                element.description.toLowerCase().includes(queryToSearch.toLowerCase()) ||
                                                element.category.toLowerCase().includes(queryToSearch.toLowerCase()));

    if (productsToShow.length === 0) {
        // Si no se encuentra ningún producto, mostrar mensaje y el icono de vacío
        document.getElementById("info").innerHTML = `
            <p><b>No se encontraron productos</b></p>
            <i class="bi bi-emoji-frown"></i>
        `;
    } 
    else
        DataManager.pagination(sessionStorage.getItem("page"),productsToShow);
}

