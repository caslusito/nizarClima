/*VARIABLES*/

const result = document.querySelector('.result');
const form = document.querySelector('.get-weather');
const nameCity = document.querySelector('#city');
const nameCountry = document.querySelector('#country');


/*ALERTA CON TOASTIFY*/
const button = document.getElementById("boton1");

button.addEventListener("click", () => {

    Toastify({
        text: "PROCESANDO PRONOSTICO",
        duration: 500,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            color: "black",
        },
        onClick: () => {

        },
    }).showToast();

});


/*INTERACCION CON USUARIO*/

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (nameCity.value === '' || nameCountry.value === '') {
        showError('Ambos campos son obligatorios...');
        return;
    }

    callAPI(nameCity.value, nameCountry.value);

})

/*LLAMANDO A LA API*/

function callAPI(city, country) {
    const apiId = '41d1d7f5c2475b3a16167b30bc4f265c';
    const https = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiId}`;

    fetch(https)
        .then(data => {
            return data.json();
        })
        .then(dataJSON => {
            if (dataJSON.cod === '404') {
                showError('Ciudad no encontrada...');
            } else {
                clearHTML();
                showWeather(dataJSON);
            }
        })
        .catch(error => {
            console.log(error);
        })
}


/*APLICACION*/

function showWeather(data) {
    const { name, main: { temp, temp_min, temp_max }, weather: [arr] } = data;

    const degrees = kelvinToCentigrade(temp);
    const min = kelvinToCentigrade(temp_min);
    const max = kelvinToCentigrade(temp_max);
    const content = document.createElement('div');
    content.innerHTML = `
        <h5>Clima en ${name}</h5>
        <img src="https://openweathermap.org/img/wn/${arr.icon}@2x.png" alt="icon">
        <h2>${degrees}°C</h2>
        <p>Max: ${max}°C</p>
        <p>Min: ${min}°C</p>
    `;


    result.appendChild(content);
}

/*MENSAJE DE ERROR*/

function showError(message) {
    const alert = document.createElement('p');
    alert.classList.add('alert-message');
    alert.innerHTML = message;

    form.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

/*PASAR DE KELVIN A CELCIUSº*/

function kelvinToCentigrade(temp) {
    return parseInt(temp - 273);
}

function clearHTML() {
    result.innerHTML = '';
}




/*MODO CLARO CON LOCALSTORAGE*/

const btnSwitch = document.querySelector('#switch');

btnSwitch.addEventListener('click', () => {
    document.body.classList.toggle('light');
    btnSwitch.classList.toggle('active');

    // Guardamos el modo en localstorage.
    if (document.body.classList.contains('light')) {
        localStorage.setItem('light-mode', 'true');
    } else {
        localStorage.setItem('light-mode', 'false');
    }
});

// Obtenemos el modo actual.
if (localStorage.getItem('light-mode') === 'true') {
    document.body.classList.add('light');
    btnSwitch.classList.add('active');
} else {
    document.body.classList.remove('light');
    btnSwitch.classList.remove('active');
}