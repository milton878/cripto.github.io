
//variables:
const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda')
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');


const objBusqueda ={
    moneda:'',
    criptomoneda:''
}

//crear promise:
const obtenerCriptomonedas = criptomonedas => new Promise ( resolve =>{
    resolve(criptomonedas);
})

//EVENTO
document.addEventListener('DOMContentLoaded', ()=>{
    consultarCriptomonedas();
    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);

});

function consultarCriptomonedas (){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch (url)
    .then(respuesta => respuesta.json())
    .then( resultado => obtenerCriptomonedas(resultado.Data))
    .then( criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
       const {FullName, Name} = cripto.CoinInfo;

       //creo las option:
       const option = document.createElement('option');
       option.value = Name;
       option.textContent = FullName;
       criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
   console.log(objBusqueda);
}

function submitFormulario(e){
    e.preventDefault();
    // validar
    const{moneda, criptomoneda} = objBusqueda;
    if(moneda === '' || criptomoneda === ''){
    
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }
    //consultar api:
    consultarApi();
}

function mostrarAlerta(msg){
    //  console.log(msg);
   const divMensaje = document.createElement('div');
   divMensaje.classList.add('error');

   //mensaje de error:
   divMensaje.textContent = msg;

   formulario.appendChild(divMensaje);
    setTimeout(()=>{
        divMensaje.remove();
    },3000);
}

function consultarApi (){
    const{moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    //==MOSTRAR SPINNER
    monstrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion =>{
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })

}

function mostrarCotizacionHTML(cotizacion){
    //llamo a la funtion para limpiar html
    limpiarHTML();

    //console.log(cotizacion);
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
    //imprimo en  html
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML=`El Precio es: <span>${PRICE}</span>`

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio mas alto del dia <span>${HIGHDAY}</span></p>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio mas bajo del dia <span>${LOWDAY}</span></p>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variacion ultimas 24 horas <span>${CHANGEPCT24HOUR}%</span></p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Ultima actualizacion <span>${LASTUPDATE}</span></p>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function monstrarSpinner(){
    //llama a esta funtion para q limpie lo hay previo
    limpiarHTML();

    const  spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML= `
        <div class="bounce1"></div>
        div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    resultado.appendChild(spinner);

}