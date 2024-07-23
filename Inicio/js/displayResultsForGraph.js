// var setting = {
//     roots: document.querySelector('.my-js-slider'),
//     type: 'range',
//     step: 1,
//     limits : { 
//         minLimit: 16,      
//         maxLimit: 100   
//     },
//     rangeValue: {
//         minValue: 16,
//         maxValue: 100,
//     }
//     }
// var slider = wRunner(setting);

// var setting2 = {
//     roots: document.querySelector('.my-js-slider2'),
//     type: 'range',
//     step: 1,
//     rangeValue: {
//         minValue: 2023,
//         maxValue: 2024,
//     },
//     limits : { 
//         minLimit: 2023,      
//         maxLimit: 2024   
//     }
//     }
// var slider2 = wRunner(setting2);

// var setting3 = {
//     roots: document.querySelector('.my-js-slider3'),
//     type: 'range',
//     step: 1,
//     rangeValue: {
//         minValue: 16,
//         maxValue: 100,
//     },
//     limits : { 
//         minLimit: 16,      
//         maxLimit: 100   
//     }
//     }
// var slider3 = wRunner(setting3);

// var setting4 = {
//     roots: document.querySelector('.my-js-slider4'),
//     type: 'range',
//     step: 1,
//     rangeValue: {
//         minValue: 2023,
//         maxValue: 2024,
//     },
//     limits : { 
//         minLimit: 2023,      
//         maxLimit: 2024   
//     }
//     }
// var slider4 = wRunner(setting4);

let $sliderEdad = $(".my-js-slider").ionRangeSlider({
    type: 'double',   // Use 'double' for a range slider
    min: 16,
    max: 100,
    from: 16,         // Default start value
    step: 1,
    grid: true,
    skin: "round"
});

let $sliderAno = $(".my-js-slider2").ionRangeSlider({
    type: 'double',   // Use 'double' for a range slider
    min: 2023,
    max: 2024,
    from: 2023,         // Default start value
    step: 1,
    grid: true,
    skin: "round"
});

// Variables de paginación
const elementosPorPagina = 10; // Ajusta la cantidad de elementos por página según tu necesidad
let urlViewGraph = null;
let graficas; // Arreglo para almacenar las instancias de gráfico
let currentPage = 1;

let opcionVisualizador = 1;
let typeOfSearch = 0;

let opcion = null;
let valor = null;

// Tabla seleccionada
let numberGraph = parseInt(localStorage.getItem('numberGraph'));
let graphId = localStorage.getItem('graphId');
let typeOfGraph = parseInt(localStorage.getItem('typeOfGraph'));


function handleModeChange() {
    // Ocultar o mostrar los selectores según el typeOfGraph
    if (typeOfGraph == 1) {
        // Ocultar el selector de provincia
        document.getElementById("selectProvincia").style.display = "none";
        // Mostrar el selector de escuelas
        document.getElementById("selectEscuela").style.display = "block";
    } else if (typeOfGraph == 2) {
        // Ocultar el selector de escuelas
        document.getElementById("selectEscuela").style.display = "none";
        // Mostrar el selector de provincias
        document.getElementById("selectProvincia").style.display = "block";
    }
}

// // Espera a que el documento esté completamente cargado
// document.addEventListener("DOMContentLoaded", function() {
//     // Busca el modal por su id
//     var modal = document.getElementById('exampleModal');
//     // Vincula el evento 'shown.bs.modal' al modal
//     modal.addEventListener('shown.bs.modal', function () {
//         // Llama a la función handleModeChange() cuando se muestre el modal
//         handleModeChange();
//     });
// });


const token = localStorage.getItem('authToken');
const userName = localStorage.getItem('userName');

function showTable(elementId) {
    // Ocultar todos los elementos con la clase 'result-view'
    document.querySelectorAll('.result-view').forEach(table => {
        table.style.display = 'none';
    });

    // Mostrar el elemento específico con el ID proporcionado
    const elementToShow = document.getElementById(elementId);
    if (elementToShow) {
        elementToShow.style.display = 'block';
    }
}

function selectOption(numberTable, tableId){
    opcionVisualizador = numberTable;
    typeOfSearch = 0;
    currentPage = 1;
    switch (numberTable) {
        case 1:
            urlViewGraph = urlForBack+`resultados/viewGraph?interes=true&modo=1`;
            showTable(tableId);
            cargarDatosYPaginacion(numberTable,urlViewGraph);
            break;
        case 2:
            
            urlViewGraph = urlForBack+`resultados/mostFrequentSchool`;
            showTable(tableId);
            cargarDatosYPaginacion(numberTable,urlViewGraph);
            break;
        case 3:
            urlViewGraph = urlForBack+`resultados/viewGraph?interes=true&modo=2`;
            showTable(tableId);
            cargarDatosYPaginacion(numberTable,urlViewGraph);
        break;
        case 4:
            urlViewGraph = urlForBack+`resultados/viewGraph?interes=true&modo=3`;
            showTable(tableId);
            cargarDatosYPaginacion(numberTable,urlViewGraph);
        break;
    }
}

function logOut() {
    localStorage.removeItem('token'); // Cambia 'token' por la clave que identifica tu sesión
    
    // Redirige a index.html
    window.location.href = '../index.html';
}

// Función para cargar datos y paginación
function cargarDatosYPaginacion(opcion, url) {
    // Verifica si el token está disponible
    console.log("el token tiene "+token);
    console.log("el userName tiene "+userName);
    console.log("la url tiene "+url);
    if (token) {
        // Realizar la solicitud GET a la API con información de paginación
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
                // Otros encabezados según sea necesario
            }
        })
        .then(response => {
            // Verificar si la respuesta es un Unauthorized (código 403)
            if (response.status === 403) {
                // El token ha expirado, muestra un modal y redirige a index.html
                mostrarModalSesionExpirada();
                // window.location.href = 'index.html';
                return Promise.reject('Token expirado');
            }

            return response.json();
        })
        .then(data => {
            switch (opcion) {
                case 1:
                    dataForTableViewGraph(data);
                    break;
                case 2:
                    dataForViewGraphBarOfSchool(data,1);
                    break;
                case 3:
                    dataForTableViewGraph(data);
                    break;
                case 4:
                    dataForTableViewGraph(data);
                    break;
                
            }
        })
        .catch(error => console.error('Error al obtener datos:', error));
    } else {
        console.error('Token no disponible. El usuario no está autenticado.');
    }
}

function mostrarModalSesionExpirada() {
    // Muestra el modal
    $('#sesionExpiradaModal').modal('show');

    // Configura el evento para redirigir al hacer clic en el botón "Volver"
    $('#volverBtn').on('click', function() {
        // Obtén el nombre de usuario del parámetro en la URL
        const urlParams = new URLSearchParams(window.location.search);
        const userNameFromURL = urlParams.get('userName');

        // Verifica si el nombre de usuario está definido
        if (userNameFromURL) {
            // Redirige a index.html con el nombre de usuario en el parámetro
            window.location.href = `../index.html?username=${userNameFromURL}`;
        } else {
            // Redirige a index.html sin ningún parámetro
            window.location.href = '../index.html';
        }
    });
}

function acortarNombreEscuela(nombreEscuela) {
    // Lista de palabras que se deben reemplazar
    const reemplazos = [
        { original: 'ESCUELA DE JORNADA EXTENDIDA', abreviado: 'ESC' },
        { original: 'ESCUELA PÚBLICA AUTOGESTIONADA', abreviado: 'ESC P.A ' },
        { original: 'ESCUELA ', abreviado: 'ESC ' },
        { original: 'CENTRO EDUCATIVO', abreviado: 'C.E ' },
        { original: 'ESCUELA TÉCNICA', abreviado: 'ESC TÉC ' },
        { original: 'INSTITUTO', abreviado: 'INS ' },
        { original: 'CENTRO EDUCATIVO NIVEL SUPERIOR', abreviado: 'C.E.N.S ' },
        { original: 'ESCUELA DE EDUCACIÓN ESPECIAL', abreviado: 'ESC E.E ' },
        { original: 'ESCUELA NACIONAL NORMAL', abreviado: 'ESC N.N ' },
        { original: 'COLEGIO', abreviado: 'COL ' },
        { original: 'ESCUELA DE COMERCIO', abreviado: 'ESC COM ' },
        { original: 'ESCUELA SECUNDARIA', abreviado: 'ESC SEC ' },
        { original: 'ESCUELA DE JORNADA COMPLETA', abreviado: 'ESC J.C ' },
        { original: 'ESCUELA PÚBLICA DIGITAL', abreviado: 'ESC P.D ' },
        { original: 'ESCUELA GENERATIVA', abreviado: 'ESC GE ' },

    ];

    // Aplicar los reemplazos
    reemplazos.forEach(reemplazo => {
        nombreEscuela = nombreEscuela.replace(reemplazo.original, reemplazo.abreviado);
    });

    return nombreEscuela;
}

function dataForTableViewGraph(data) {
    // Ocultar el gráfico de barras
    document.getElementById("barGraph").style.display = "none";
    // Mostrar el gráfico circular
    document.getElementById("pieGraph").style.display = "block";

    // Obtener el lienzo (canvas) existente
    var canvas = document.getElementById("graficaBarras");

    // Destruir la instancia anterior del gráfico, si existe
    if (graficas) {
        graficas.dispose();
    }

    // Obtener los datos de las carreras y cantidades desde el array data
    let carreras = data.map(item => item[0]);
    let cantidades = data.map(item => item[1]);

    // Crear un arreglo de objetos que contengan las carreras y las cantidades
    let chartData = [];
    for (let i = 0; i < carreras.length; i++) {
        chartData.push({ x: carreras[i], value: cantidades[i] });
    }

    // Crear el gráfico circular
    var chart = anychart.pie(chartData);
    // Título del gráfico
    chart.title("Gráfico Circular de Carreras");

     // Ajustar el tamaño de la gráfica
    //  chart.width("80%"); // Opcional: Puedes especificar un porcentaje
    //  chart.height("80%"); // Opcional: Puedes especificar un porcentaje

    // Mostrar el gráfico en el lienzo
    chart.container(canvas);
    chart.draw();

    // Asignar la instancia del gráfico a una variable global para poder accederla posteriormente
    graficas = chart;
}

function filterGraphA(event, modo){
    event.preventDefault();

    // Obtener los valores del formulario
    var rangoEdad = $sliderEdad.data("ionRangeSlider").result;
    var rangoAño = $sliderAno.data("ionRangeSlider").result;
    var exampleSchool = modo == 1 ? document.getElementById('exampleSchool').value : "";
    var exampleProvincia = modo == 2 ? document.getElementById('exampleProvince').value : "";
    var interesCheckboxG = document.getElementById('interesCheckboxG').checked;

    console.log("rangoEdad mínimo: ", rangoEdad.from);
    console.log("rangoAño mínimo: ", rangoAño.from);
    console.log("rangoEdad máximo: ", rangoEdad.to);
    console.log("rangoAño máximo: ", rangoAño.to);
    console.log("exampleSchool: ", exampleSchool);
    console.log("exampleProvincia: ", exampleProvincia);
    console.log("interesCheckboxG:", interesCheckboxG);
    if(exampleSchool == ""){
        console.log("esta vacio exampleScholl");
        exampleSchool= null;
    }
    switch(modo){
        case 1:
            urlViewGraph = urlForBack+`resultados/viewGraph?interes=${interesCheckboxG}&edadMinima=${rangoEdad.from}&edadMaxima=${rangoEdad.to}&anoMinimo=${rangoAño.from}&anoMaximo=${rangoAño.to}&escuela=${exampleSchool}&modo=2`;
            break;
        case 2:
            urlViewGraph = urlForBack+`resultados/viewGraph?interes=${interesCheckboxG}&edadMinima=${rangoEdad.from}&edadMaxima=${rangoEdad.to}&anoMinimo=${rangoAño.from}&anoMaximo=${rangoAño.to}&provincia=${exampleProvincia}&modo=3`;
            break;
    }
    // urlViewGraph = urlForBack+`resultados/viewGraph?interes=${interesCheckboxG}&edadMinima=${rangoEdad.minValue}&edadMaxima=${rangoEdad.maxValue}&anoMinimo=${rangoAño.minValue}&anoMaximo=${rangoAño.maxValue}&escuela=${exampleSchool}`;
    

    cargarDatosYPaginacion(1, urlViewGraph);

    // Cerrar el modal después de cargar los datos
    $('#exampleModal').modal('hide');
}

function filterGraphM(event){
    event.preventDefault();

    // Obtener los valores del formulario
    var rangoEdad = $sliderEdad.data("ionRangeSlider").result;
    var rangoAño = $sliderAno.data("ionRangeSlider").result;
 
    var interesCheckboxG = document.getElementById('interesCheckboxG2').checked;

    console.log("rangoEdad mínimo: ", rangoEdad.from);
    console.log("rangoAño mínimo: ", rangoAño.from);
    console.log("rangoEdad máximo: ", rangoEdad.to);
    console.log("rangoAño máximo: ", rangoAño.to);
    console.log("interesCheckboxG:", interesCheckboxG);

    urlViewGraph = urlForBack+`resultados/viewGraph?interes=${interesCheckboxG}&edadMinima=${rangoEdad.from}&edadMaxima=${rangoEdad.to}&anoMinimo=${rangoAño.from}&anoMaximo=${rangoAño.to}`;

    cargarDatosYPaginacion(1, urlViewGraph);
}


// Grafico de barras Escuelas 

function dataForViewGraphBarOfSchool(data, currentPage) {
    // Ocultar el gráfico circular
    document.getElementById("pieGraph").style.display = "none";
    // Mostrar el gráfico de barras
    document.getElementById("barGraph").style.display = "block";
    // Número de escuelas por página
    const schoolsPerPage = 5;

    // Calcular el índice inicial y final de las escuelas para la página actual
    const startIndex = (currentPage - 1) * schoolsPerPage;
    const endIndex = Math.min(startIndex + schoolsPerPage, data.length);

    // Obtener los datos de las escuelas y cantidades para la página actual
    const schools = data.slice(startIndex, endIndex).map(item => acortarNombreEscuela(item[0]));
    const cantidades = data.slice(startIndex, endIndex).map(item => item[1]);

    // Crear un arreglo de objetos que contengan las escuelas y las cantidades para la página actual
    let chartData = [];

    for (let i = 0; i < schools.length; i++) {
        chartData.push({ x: schools[i], value: cantidades[i] });
    }

    if (graficas) {
        graficas.dispose();
    }

    // Crear un gráfico de barras
    var chart = anychart.bar();

    // Crear una serie de barras y establecer los datos
    var cantidad = chart.bar(chartData);
    cantidad.name("Cantidad");

    // Establecer el título del gráfico
    chart.title("Top 5");

    // Establecer los títulos de los ejes
    chart.xAxis().title("Escuelas");
    chart.yAxis().title("Cantidad");

    // Establecer el contenedor del gráfico
    chart.container("graphForSchoolTop");

    // Iniciar el dibujo del gráfico
    chart.draw();

    // Asignar la instancia del gráfico a una variable global para poder accederla posteriormente
    graficas = chart;

    createPagination(data);
}

// Función para manejar el cambio de página
function changePage(pageNumber, data) {
    // Llamar a la función para dibujar el gráfico con los datos correspondientes a la página seleccionada
    dataForViewGraphBarOfSchool(data, pageNumber);
}


// Función para crear los botones de paginación
function createPagination(data) {
    // Número total de escuelas
    const totalSchools = data.length;
    // Número de escuelas por página
    const schoolsPerPage = 5;
    // Número total de páginas
    const totalPages = Math.ceil(totalSchools / schoolsPerPage);

    // Obtener el contenedor de la paginación
    const paginationContainer = document.getElementById("paginacion");

    // Limpiar cualquier contenido existente en la paginación
    paginationContainer.innerHTML = '';

    // Crear botón de anterior
    const previousButton = document.createElement('li');
    previousButton.classList.add('page-item');
    const previousLink = document.createElement('a');
    previousLink.classList.add('page-link');
    previousLink.href = "#";
    previousLink.textContent = 'Anterior';
    previousLink.addEventListener('click', () => {
        if (paginationContainer) {
            if (currentPage > 1) {
                currentPage--;
                changePage(currentPage, data);
            }
        } else {
            console.error("El elemento paginacion no existe en el DOM.");
        }
        
    });
    previousButton.appendChild(previousLink);
    paginationContainer.appendChild(previousButton);

    // Crear botones de paginación para cada página
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');

        const a = document.createElement('a');
        a.classList.add('page-link');
        a.href = "#";
        a.textContent = i;
        a.addEventListener('click', () => {
            changePage(i, data);
        });

        li.appendChild(a);
        paginationContainer.appendChild(li);
    }

    // Crear botón de siguiente
    const nextButton = document.createElement('li');
    nextButton.classList.add('page-item');
    const nextLink = document.createElement('a');
    nextLink.classList.add('page-link');
    nextLink.href = "#";
    nextLink.textContent = 'Siguiente';
    nextLink.addEventListener('click', () => {
        if (paginationContainer) {
            if (currentPage < totalPages) {
                currentPage++;
                changePage(currentPage, data);
            }
        } else {
            console.error("El elemento paginacion no existe en el DOM.");
        }
        
    });
    nextButton.appendChild(nextLink);
    paginationContainer.appendChild(nextButton);
}

function filterBar(event){
    event.preventDefault();

    // Obtener los valores del formulario
    var barGraphSchool1 = document.getElementById('barGraphSchool1').value;
    var barGraphSchool2 = document.getElementById('barGraphSchool2').value;
    var barGraphSchool3 = document.getElementById('barGraphSchool3').value;
    var barGraphSchool4 = document.getElementById('barGraphSchool4').value;
    var barGraphSchool5 = document.getElementById('barGraphSchool5').value;

    console.log("barGraphSchool1: ", barGraphSchool1);
    console.log("barGraphSchool2: ", barGraphSchool2);
    console.log("barGraphSchool3: ", barGraphSchool3);
    console.log("barGraphSchool4: ", barGraphSchool4);
    console.log("barGraphSchool5: ", barGraphSchool5);

    // if(barGraphSchool1 == "" || barGraphSchool2 == "" ||barGraphSchool3 == "" ||barGraphSchool4 == "" ||barGraphSchool5 == ""){
    //     console.log("esta vacio exampleScholl");
    //     barGraphSchool1= null;
    //     barGraphSchool2= null;
    //     barGraphSchool3= null;
    //     barGraphSchool4= null;
    //     barGraphSchool5= null;
    // }
    barGraphSchool1 = barGraphSchool1.trim() === "" ? null : barGraphSchool1;
    barGraphSchool2 = barGraphSchool2.trim() === "" ? null : barGraphSchool2;
    barGraphSchool3 = barGraphSchool3.trim() === "" ? null : barGraphSchool3;
    barGraphSchool4 = barGraphSchool4.trim() === "" ? null : barGraphSchool4;
    barGraphSchool5 = barGraphSchool5.trim() === "" ? null : barGraphSchool5;

    var escuelas = [barGraphSchool1, barGraphSchool2, barGraphSchool3, barGraphSchool4, barGraphSchool5];
    urlViewGraph = urlForBack+`resultados/mostFrequentSchoolCom?escuelas=${escuelas}`;

    cargarDatosYPaginacion(2, urlViewGraph);
    // Cerrar el modal después de cargar los datos
    $('#exampleModalBarGraph').modal('hide');
}

function reset(){
    // // Para grafico circular
    // slider.update({
    //     minValue: slider.settings.rangeValue.start,
    //     maxValue: slider.settings.rangeValue.end
    // });
    // slider2.update({
    //     minValue: slider.settings.rangeValue.start,
    //     maxValue: slider.settings.rangeValue.end
    // });
    $('#exampleSchool').selectpicker('deselectAll');
    $('#exampleSchool').selectpicker('val', ''); // Restablece el valor seleccionado a vacío
    
    // Para grafico en barra
    $('#barGraphSchool1').selectpicker('deselectAll');
    $('#barGraphSchool1').selectpicker('val', ''); // Restablece el valor seleccionado a vacío

    $('#barGraphSchool2').selectpicker('deselectAll');
    $('#barGraphSchool2').selectpicker('val', ''); // Restablece el valor seleccionado a vacío

    $('#barGraphSchool3').selectpicker('deselectAll');
    $('#barGraphSchool3').selectpicker('val', ''); // Restablece el valor seleccionado a vacío

    $('#barGraphSchool4').selectpicker('deselectAll');
    $('#barGraphSchool4').selectpicker('val', ''); // Restablece el valor seleccionado a vacío

    $('#barGraphSchool5').selectpicker('deselectAll');
    $('#barGraphSchool5').selectpicker('val', ''); // Restablece el valor seleccionado a vacío
}


console.log("numberTable tiene ",numberGraph);
console.log("tableId tiene ",graphId);
selectOption(numberGraph, graphId);