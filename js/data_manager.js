let productsArray = []
let productsDisplayed = []

let actualPage;
let pageSize = 4;

class DataManager
{
    static async loadData(category = null){
    
        console.log(category);
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
        
        productsArray = data;

        console.log(productsArray);

        if(category == null)
        {
            this.pagination(actualPage);
        }else{
            this.filterProducts(category);
        }

        
        
    }

    static filterProducts(category)
    {
        productsArray = productsArray.filter(e => e.category.toLowerCase().includes(category.toLowerCase()));

        this.pagination(actualPage,prodlist_cat);
    }

    static pagination(page, prodlist = productsArray, fnToHtml = View.toHtmlList, pagesize = pageSize) {
        
        sessionStorage.setItem("page", page);
        actualPage = page;
    
        // Calcula el índice inicial y final de los productos a mostrar en la página
        let startIndex = (page - 1) * pagesize;
        let endIndex = startIndex + pagesize;
        
        // Filtra los productos para mostrar solo los de la página actual
        let productsToShow = prodlist.slice(startIndex, endIndex);
    
        console.log(productsToShow);

        this.pageLogic(prodlist,pageSize);
    
        // Renderiza los productos de la página actual
        let html = this.toHtml(fnToHtml,productsToShow);
        View.render(html, "info");
    }

    static toHtml(fnToHtml = View.toHtmlList, prodlist) {
        console.log("entro");
        return fnToHtml(prodlist);
    }

    static pageLogic(prodList, pageSize)
    {
        const totalPages = Math.ceil(prodList.length / pageSize);

        console.log(prodList);

        let paginationHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            let encodedProdList = encodeURIComponent(JSON.stringify(prodList));
            if (i === parseInt(sessionStorage.getItem("page"))) {
                paginationHTML += `<li class="page-item active"><a class="page-link" href="#" onclick="DataManager.pagination(${i}, JSON.parse(decodeURIComponent('${encodedProdList}')))">${i}</a></li>`;
            } else {
                paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="DataManager.pagination(${i}, JSON.parse(decodeURIComponent('${encodedProdList}')))">${i}</a></li>`;
            }
        }


        document.getElementById('pagination').innerHTML = paginationHTML;

        if (totalPages === 0) {
            document.getElementById('pagination').style.display = 'none';
        } else {
            document.getElementById('pagination').style.display = 'flex';
        }
    }
}

class View
{

    static render(html, elementId){
        document.querySelector(`#${elementId}`).innerHTML = html;
    }

    static toHtmlList(list){
        console.log("entro2");
        let html = `
                    ${list.map((prod) => View.toHtmlDiv(prod)).join("")}
                
                    `;
        return html;
    }
    
    static toHtmlDiv(obj) {
        console.log("entro3");
        let html = `<div clas="col">
                        <div class="card h-100" style="width: 18rem;">
                            <img src="${obj.imageUrl}" class="card-img-top" alt="Product Image">
                            <div class="card-body">
                                <h5 class="card-title">${obj.name}</h5>
                                <p class="card-text">${obj.description}</p>
                                <p class="card-text">Price Per Unit: $${obj.pricePerUnit}</p>
                                <button class="btn btn-primary" onclick="addToCart('${obj.uuid}')" ><i class="bi bi-cart-plus"></i> Añadir al carrito</button>
                            </div>
                        </div>
                    </div>`;
        return html;
    }

    static toHtmlTable(list, propOrder){
        let html = `<table> 
                        <tr> 
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Category</th>
                            <th>unit</th>
                            <th>image</th>
                            <th>Actions</th>
                        </tr>
                    
                    ${list.map((prod) => View.toHtmlRow(prod)).join("")}
                    </table>
                    `;
        return html;
    }

    static toHtmlRow(obj, propOrder = []) {
        if (propOrder.length === 0) {
            propOrder = ['uuid', 'name', 'description', 'pricePerUnit', 'stock', 'category', 'unit', 'imageUrl'];
        }
        let html = '<tr>';
        for (const prop of propOrder) {
            if(prop =="imageUrl"){
                html+=`<td><img src="${obj[prop]}" alt="" style="width: 50px;"></td>`
            }else
            html+=`<td>${obj[prop]}</td>`
        }
        html += `<td>
                    <a
                        class="btn btn-primary"
                        href="#"
                        role="button"
                        onclick = "editProduct('${obj.uuid}')"
                        ><i class="bi bi-pencil-fill"></i>
                    </a>
                </td>`
        html += '</tr>';
        return html;
    }
    
}