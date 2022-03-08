
//2 the fechData funtion will be executed when on content load
document.addEventListener("DOMContentLoaded", e =>{
    fechData();
});

//1 funton to consume the data
const fechData = async () =>{
    try {
        //accesing to the data to consume with fech
        const res = await fetch("./assets/api.json")
        const data = await res.json();
        // console.log(data )
        
        //5 executing the renderData funtion
        renderData(data);
        btnDetector(data);
    } catch (err) {
        console.log(err)
    }
};

//3 accesing to the HTML elements
const $productsContainer = document.querySelector("#products-container");

//4 this funtion render the data at the HTML. this recive the data as params
const renderData = (data) =>{
    //Accesing to to the template content
    const $template = document.querySelector("#template-products").content;   
    // console.log($template)
    // creating a fragment
    const $fragment = document.createDocumentFragment();

    // data itettator
    data.forEach(products => {
        // console.log(producto)
        $template.querySelector('img').setAttribute('src', products.thumbnailUrl)
        $template.querySelector('.card-title').textContent = products.title
        $template.querySelector('p span').textContent = products.price
        // creando el dataset
        $template.querySelector('button').dataset.id = products.id
        const clone = $template.cloneNode(true)
        $fragment.appendChild(clone)
    })

    // añadiendo al Dom
    $productsContainer.appendChild($fragment)

    // NOTAS: cuando se usan los template fragmen no se puede usar el addEventListener directaman dentro del forEach. pare esto se usan los datasets
};

//6 Obj donde se guardaran los iten
let cardObj = {};


//5 Detectando el button. esto dectara cada uno de los buttons
const btnDetector = (data) =>{
    const button = document.querySelectorAll(".card button")
    // console.log(button)

    // Obtenemos un nodeList que es un array y lo iterramos, luego le añadimos el addEventListener.Con el dataset cada btn tendra su id asignado

    // La idea del btn es que cuando se haga un click sobre el en el objeto creado se creara un item con los datos del procto. tambien cuando se le de click al btn de mas o menos este incrementara o disminuira el valor de los productos
    button.forEach(btn => {
        btn.addEventListener("click", () =>{
            // console.log(btn.dataset)
            // buscando dentro de la data el id. NOTA:  ambas funcionan
            // const product = data.find(item => item.id == btn.dataset.id);
            const product = data.find(item => item.id === parseInt(btn.dataset.id));
            // console.log(product)

            //  añade la propiedad cantidad
            product.cuantity = 1;

            // Si elproducto existe en el obj y se hace click no de duplicara mas se incrementera
            if(cardObj.hasOwnProperty(product.id)){
                // console.log("existe")
                // si ya existe se ahumenta
                product.cuantity = cardObj[product.id].cuantity + 1;
            }

            cardObj[product.id] = {...product}
            // console.log(cardObj);

            // Funcion que renderiza el card
            productsInCard();


        });
    });
};

//6 CAPTURANDO LOS ITEMs
const $items = document.querySelector(".items");

//6 Funcion que renderiza el card
const productsInCard = () =>{
    // inpiando el HTML para que las filas de los productos no se repitan.
    $items.innerHTML = "";
    // for (const key in object) {
    //     if (Object.hasOwnProperty.call(object, key)) {
    //         const element = object[key];
            
    //     }
    // }

    const fragmen = document.createDocumentFragment();
    const template = document.querySelector("#card-template").content;

    // console.log(Object.values(cardObj)). esto tranforma los objeto en un array
    Object.values(cardObj).forEach(product =>{
        // console.log(product);
        template.querySelector("th").textContent = product.id;
        template.querySelectorAll("td")[0].textContent  = product.title;
        template.querySelectorAll("td")[1].textContent  = product.cuantity; 
        template.querySelector("span").textContent  = product.price * product.cuantity; 

        //8 Selecionando los botones de mas y menos
        template.querySelector(".btn-info").dataset.id = product.id; 
        template.querySelector(".btn-danger").dataset.id = product.id; 
    


        const  clone = template.cloneNode(true);
        fragmen.appendChild(clone);
    })

    $items.appendChild(fragmen)

    // Renderiza el foter
    renderFooter();

    // ACCION DE LOS BOTTONS
    actionButttons();
}


// Renderiza el foter
const footer = document.querySelector("#card-footer")
const renderFooter = ()  =>{
    footer.innerHTML = "";

    // Para mostrael el mensaje despues de vaciar el carrito es obcional
    if(Object.keys(cardObj).length === 0){
        footer.innerHTML =`
        <th scope="row" colspan="5">Empty Card now!</th>
        `;
        return;
    }

    const template = document.querySelector("#template-footer").content;
    const fragment = document.createDocumentFragment();
    // Para sumar el total y la cantidad de todos los elemnetos clickeados
    // Este tiene un acumulador y un item y y hace una iterracion sobre estos y ejecuta la operacion indicada(1-acaumulador, 2-properis, 3- operattio a ejecutar, 4-devuelve el formato especificado(numero enteste caso))
    // const nCuantity = Object.values(cardObj).reduce(acc , ite)
    const nCuantity = Object.values(cardObj).reduce((acc , {cuantity}) => acc + cuantity, 0);
    // Para el precio. Suma los precios 
    const nPrice = Object.values(cardObj).reduce((acc , {cuantity, price}) => acc + cuantity * price, 0);

    // console.log(nCuantity)
    // console.log(nPrice)

    // pintadolo dentro del template
    template.querySelectorAll("td")[0].textContent = nCuantity;
    template.querySelector("span").textContent = nPrice;

    const clone = template.cloneNode(true)
    fragment.appendChild(clone);

    footer.appendChild(fragment)

    // Manejando el boton se vacair el car
    const boton = document.querySelector("#card-empty")
    boton.addEventListener("click", () =>{
        cardObj = {};
        productsInCard();

    })
}


// ACCION DE LOS BOTTONS
const actionButttons = ()  =>{
    const botonAdd = document.querySelectorAll(".items .btn-info")
    const botonDelete = document.querySelectorAll(".items .btn-danger")

    botonAdd.forEach(btn =>{
        btn.addEventListener("click", () => {
            // console.log("agregando...")
            // adding
            console.log(btn.dataset.id)
           const product = cardObj[btn.dataset.id];
           product.cuantity ++;
           cardObj[btn.dataset.id] = {...product };

        //  para que la funcion se actulalize con los cambio
        productsInCard();

        })
    })

    botonDelete.forEach(btn =>{
        btn.addEventListener("click", () => {
            // console.log("Eliminando...")
            // deleteing
            const product = cardObj[btn.dataset.id];
            product.cuantity --;
            if(product.cuantity === 0){
                // Esto dolo funciona en los obj
                delete cardObj[btn.dataset.id];
            }else{
                cardObj[btn.dataset.id] = {...product };
               
            }
            productsInCard();
        })
    })

}
