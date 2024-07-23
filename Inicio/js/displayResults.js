// var setting = {
//     roots: document.querySelector('.my-js-slider'),
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
// var slider = wRunner(setting);

let $slider = $(".my-js-slider").ionRangeSlider({
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
let paginaActual = 0;
const elementosPorPagina = 10; // Ajusta la cantidad de elementos por página según tu necesidad
var valores = $slider.data("ionRangeSlider").result;
let urlViewAll = urlForBack+`resultados/viewAll?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&edadDesde=${valores.min}&edadHasta=${valores.max}&interes=true`;
let urlViewEsResident = urlForBack+`resultados/esRes?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&edadDesde=${valores.min}&edadHasta=${valores.max}&interes=true`;
let urlViewEsNoResident = urlForBack+`resultados/esNoRes?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&edadDesde=${valores.min}&edadHasta=${valores.max}&interes=true`;
let urlViewSchoolInSanLuis = urlForBack+`resultados/schoolInSanLuis?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&edadDesde=${valores.min}&edadHasta=${valores.max}&interes=true`;
let urlQuantityByCareerTable = urlForBack+`resultados/quantityByCareerTable`;
let urlTour = urlForBack+`resultados/tour?page=${paginaActual}&quantityPerPage=${elementosPorPagina}`;
let urlViewGraph = null;
let graficas; // Arreglo para almacenar las instancias de gráfico

// Obtener la URL actual
let currentURL = window.location.href;

let opcionVisualizador = 1;
let typeOfSearch = 0;

let opcion = null;
let valor = null;

// Tabla seleccionada
let numberTable = parseInt(localStorage.getItem('numberTable'));
let tableId = localStorage.getItem('tableId');


if(numberTable === 4){
    // Mostrar el selector de escuelas
    document.getElementById("filtroForSchool").style.display = "block";
}
else{
    document.getElementById("filtroForSchool").style.display = "none";
}

// Extraer los parámetros de la cadena de consulta
// let urlParams = new URLSearchParams(window.location.search);

// Obtener los valores de los parámetros
// let userName = urlParams.get('userName');
// let password = urlParams.get('password');
// let token = urlParams.get('token');

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
    switch (numberTable) {
        case 1:
            showTable(tableId);
            cargarDatosYPaginacion(numberTable,urlViewAll);
            break;
        case 2:
            showTable(tableId);
            cargarDatosYPaginacion(numberTable,urlViewEsResident);
            break;
        case 3:
            showTable(tableId);
            cargarDatosYPaginacion(numberTable,urlViewEsNoResident);
            break;
        case 4:
            showTable(tableId);
            cargarDatosYPaginacion(numberTable,urlViewSchoolInSanLuis);
            break;
        case 5:
            showTable(tableId);
            cargarDatosYPaginacion(numberTable,urlQuantityByCareerTable);
            break;
        case 6:
            showTable(tableId);
            cargarDatosYPaginacion(numberTable,urlTour);
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
                    dataForTableViewAll(data);
                    break;
                case 2:
                    dataForTableViewEsResident(data);
                    break;
                case 3:
                    dataForTableViewEsNoResident(data);
                    break;
                case 4:
                    dataForTableSchoolInSanLuis(data);
                    break;
                case 5:
                    dataForTableCarrer(data);
                    break;
                case 6:
                    dataForTableTour(data);
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

function filtrarTabla(event) {
    event.preventDefault();

    opcion = document.getElementById('filtroOpcion').value;
    valor = document.getElementById('filtroValor').value;
    // Obtener el valor del checkbox de interés
    const interesCheckbox = document.getElementById('interesCheckbox');
    const interesSeleccionado = interesCheckbox.checked;
    // var valores = $slider.getValue();
    var valores = $slider.data("ionRangeSlider").result;
    let urlFiltrado = null;
    

    // Resto del código de filtrado
    // Puedes usar 'opcion' y 'valor' en tu lógica de filtrado
    console.log("Opción de filtrado: ", opcion);
    console.log("Valor de búsqueda: ", valor);
    console.log("Valor mínimo:", valores.from);
    console.log("Valor máximo:", valores.to);

    switch (opcionVisualizador) {
        case 1:
            // if(opcion == 0){
            //     urlFiltrado = urlForBack+`resultados/viewAll?page=${paginaActual}&quantityPerPage=${elementosPorPagina}`;
            //     typeOfSearch = 0;
            // }
            // else{
            //     urlFiltrado = urlForBack+`resultados/viewAll?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&opcion=${opcion}&valor=${valor}`;
            //     typeOfSearch = 1;
            // }
            //Operador ternario
            urlFiltrado = (opcion == 0) ?
            urlForBack+`resultados/viewAll?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&edadDesde=${valores.from}&edadHasta=${valores.to}&interes=${interesSeleccionado}` :
            urlForBack+`resultados/viewAll?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&opcion=${opcion}&valor=${valor}&edadDesde=${valores.from}&edadHasta=${valores.to}&interes=${interesSeleccionado}`;

            typeOfSearch = (opcion == 0) ? 0 : 1;
            break;
        case 2:
            urlFiltrado = (opcion == 0) ?
            urlForBack+`resultados/esRes?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&edadDesde=${valores.from}&edadHasta=${valores.to}&interes=${interesSeleccionado}` :
            urlForBack+`resultados/esRes?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&opcion=${opcion}&valor=${valor}&edadDesde=${valores.from}&edadHasta=${valores.to}&interes=${interesSeleccionado}`;

            typeOfSearch = (opcion == 0) ? 0 : 1;
            break;
        case 3:
            urlFiltrado = (opcion == 0) ?
            urlForBack+`resultados/esNoRes?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&edadDesde=${valores.from}&edadHasta=${valores.to}&interes=${interesSeleccionado}` :
            urlForBack+`resultados/esNoRes?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&opcion=${opcion}&valor=${valor}&edadDesde=${valores.from}&edadHasta=${valores.to}&interes=${interesSeleccionado}`;

            typeOfSearch = (opcion == 0) ? 0 : 1;
            break;
        case 4:
            urlFiltrado = (opcion == 0) ?
            urlForBack+`resultados/schoolInSanLuis?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&edadDesde=${valores.from}&edadHasta=${valores.to}&interes=${interesSeleccionado}` :
            urlForBack+`resultados/schoolInSanLuis?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&opcion=${opcion}&valor=${valor}&edadDesde=${valores.from}&edadHasta=${valores.to}&interes=${interesSeleccionado}`;

            typeOfSearch = (opcion == 0) ? 0 : 1;
            break;
        // case 5:// caso de no interes
        //     urlFiltrado = (opcion == 0) ?
        //     urlForBack+`resultados/schoolInSanLuis?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&edadDesde=${valores.minValue}&edadHasta=${valores.maxValue}` :
        //     urlForBack+`resultados/schoolInSanLuis?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&opcion=${opcion}&valor=${valor}&edadDesde=${valores.minValue}&edadHasta=${valores.maxValue}`;

        //     typeOfSearch = (opcion == 0) ? 0 : 1;
        //     break;
    }


    // Después de aplicar el filtrado, puedes volver a cargar los datos y la paginación
    cargarDatosYPaginacion(opcionVisualizador, urlFiltrado, typeOfSearch);
}

function filterGraphA(event){
    event.preventDefault();

    // Obtener los valores del formulario
    // var rangoEdad = slider3.getValue();
    let rangoEdad = $slider.data("ionRangeSlider").result;
    var rangoAño = $sliderAno.data("ionRangeSlider").result;
    var exampleSchool = document.getElementById('exampleSchool').value;
    var interesCheckboxG = document.getElementById('interesCheckboxG').checked;

    console.log("rangoEdad mínimo: ", rangoEdad.from);
    console.log("rangoAño mínimo: ", rangoAño.from);
    console.log("rangoEdad máximo: ", rangoEdad.to);
    console.log("rangoAño máximo: ", rangoAño.to);
    console.log("exampleSchool: ", exampleSchool);
    console.log("interesCheckboxG:", interesCheckboxG);
    if(exampleSchool == ""){
        console.log("esta vacio exampleScholl");
        exampleSchool= null;
    }

    // urlViewSchoolInSanLuis = urlForBack+`resultados/viewGraph?interes=${interesCheckboxG}&edadMinima=${rangoEdad.minValue}&edadMaxima=${rangoEdad.maxValue}&anoMinimo=${rangoAño.minValue}&anoMaximo=${rangoAño.maxValue}&escuela=${exampleSchool}&modo=2`;

    urlViewSchoolInSanLuis = urlForBack+`resultados/schoolInSanLuisFP?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&interes=${interesCheckboxG}&edadMinima=${rangoEdad.from}&edadMaxima=${rangoEdad.to}&anoMinimo=${rangoAño.from}&anoMaximo=${rangoAño.to}&escuela=${exampleSchool}`;

    

    cargarDatosYPaginacion(4, urlViewSchoolInSanLuis);

    // Cerrar el modal después de cargar los datos
    $('#exampleModal').modal('hide');
}

function convertirFormatoFecha(fecha) {
    // Dividir la fecha en año, mes y día
    var partes = fecha.split("-");
    // Crear una nueva fecha en el formato DD-MM-AAAA
    var nuevaFecha = partes[2] + "-" + partes[1] + "-" + partes[0];
    return nuevaFecha;
}

function dataForTableViewAll(data){
    // Obtener la referencia a la tabla y la paginación
    const tabla = document.getElementById("miTabla");
    const tbody = tabla.querySelector("tbody");
    const paginacion = document.getElementById("paginacion");
    // const canvas = document.getElementById("graficaBarras");
    const filtro = document.getElementById("filtrado"); // Agregar esta línea

    // Limpiar la tabla y la paginación
    tbody.innerHTML = '';
    paginacion.innerHTML = '';
    // canvas.style.display =  'none';
    if (filtro) {
        filtro.style.display = 'table-row';
    }

    // Llenar la tabla con los datos
    data.content.forEach((resultado) => {
        const fila = document.createElement("tr");
        // Acceder a los campos dentro del objeto usuarios
        // console.log("los usuarios tiene: "+resultado.usuarios);
        // console.log("email tiene: "+ resultado.usuarios.email);
        // const email = resultado.usuarios.email;
        // const edad = resultado.usuarios.edad;
        // const fecha = resultado.fecha;
        // const carreraObtenida = resultado.carreraObtenida;

        const email = resultado[0];
        const edad = resultado[1];
        const fecha = resultado[2];
        const carreraObtenida = resultado[3];

        const columnas = [email, edad, convertirFormatoFecha(fecha), carreraObtenida];
        columnas.forEach((columna) => {
            const celda = document.createElement("td");
            celda.textContent = columna;
            fila.appendChild(celda);
        });
        tbody.appendChild(fila);
        
    });

    agregarBotonesPaginacionBootstrap(data, "paginacion", 1);
    
}

function dataForTableViewEsResident(data){
    // Obtener la referencia a la tabla y la paginación
    const tabla = document.getElementById("tablaEsResidente");
    const tbody = tabla.querySelector("tbody");
    const paginacion = document.getElementById("paginacion");
    const filtro = document.getElementById("filtrado"); // Agregar esta línea

    // Limpiar la tabla y la paginación
    tbody.innerHTML = '';
    paginacion.innerHTML = '';
    filtro.style.display = 'table-row';

    // Llenar la tabla con los datos
    data.content.forEach((resultado) => {
        const fila = document.createElement("tr");
        // Acceder a los campos dentro del objeto usuarios
        const email = resultado[0];
        const edad = resultado[1];
        const fecha = resultado[2];
        const esResidenteArg = resultado[3];
        const provincia = resultado[4];
        const carreraObtenida = resultado[5];

        const columnas = [email, edad, convertirFormatoFecha(fecha), provincia, carreraObtenida];
        columnas.forEach((columna) => {
            const celda = document.createElement("td");
            celda.textContent = columna;
            fila.appendChild(celda);
        });
        tbody.appendChild(fila);
        
    });
    
    agregarBotonesPaginacionBootstrap(data, "paginacion2", 2);
}

function dataForTableViewEsNoResident(data){
    // Obtener la referencia a la tabla y la paginación
    const tabla = document.getElementById("tablaEsNoResidente");
    const tbody = tabla.querySelector("tbody");
    const paginacion = document.getElementById("paginacion");
    const filtro = document.getElementById("filtrado"); // Agregar esta línea

    // Limpiar la tabla y la paginación
    tbody.innerHTML = '';
    paginacion.innerHTML = '';
    filtro.style.display = 'table-row';

    // Llenar la tabla con los datos
    data.content.forEach((resultado) => {
        const fila = document.createElement("tr");
        // Acceder a los campos dentro del objeto usuarios
        const email = resultado[0];
        const edad = resultado[1];
        const fecha = resultado[2];
        const esResidenteArg = resultado[3];
        const paisOrigen = resultado[4];
        const carreraObtenida = resultado[5];

        const columnas = [email, edad, convertirFormatoFecha(fecha), paisOrigen, carreraObtenida];
        columnas.forEach((columna) => {
            const celda = document.createElement("td");
            celda.textContent = columna;
            fila.appendChild(celda);
        });
        tbody.appendChild(fila);
        
    });
    
    agregarBotonesPaginacionBootstrap(data, "paginacion3", 3);
}

function dataForTableSchoolInSanLuis(data){
    // Obtener la referencia a la tabla y la paginación
    const tabla = document.getElementById("tablaSchoolInSanLuis");
    const tbody = tabla.querySelector("tbody");
    const paginacion = document.getElementById("paginacion");
    const filtro = document.getElementById("filtrado"); // Agregar esta línea

    // Limpiar la tabla y la paginación
    tbody.innerHTML = '';
    paginacion.innerHTML = '';
    filtro.style.display = 'table-row';

    // Llenar la tabla con los datos
    data.content.forEach((resultado) => {
        const fila = document.createElement("tr");
        // Acceder a los campos dentro del objeto usuarios
        const email = resultado[0];
        const edad = resultado[1];
        const schoolInSanLuis = resultado[3];
        const fecha = resultado[4];
        const carreraObtenida = resultado[5];
        const idResultado = resultado[6];

        // console.log("idResultado tiene "+ idResultado);

        const columnas = [email, edad, schoolInSanLuis, convertirFormatoFecha(fecha), carreraObtenida];
        columnas.forEach((columna) => {
            const celda = document.createElement("td");
            celda.textContent = columna;
            fila.appendChild(celda);
        });
        // Agregar tooltip a la fila con el mensaje "Seleccionar"
        fila.setAttribute('title', 'Seleccionar');
        fila.setAttribute('data-bs-toggle', 'tooltip');
        fila.setAttribute('data-bs-placement', 'top');

        // Agregar evento de clic a la fila para mostrar el modal
        fila.addEventListener('click', () => {
            dataForModalSeg(email, fecha, schoolInSanLuis, carreraObtenida, idResultado);
        });

        tbody.appendChild(fila);
        
    });

    // Inicializar tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    
    agregarBotonesPaginacionBootstrap(data, "paginacion4", 4);
}

function dataForModalSeg(email, fecha, escuela, carrera, idResultado) {
    // Llenar los elementos del modal con los datos
    document.getElementById('emailSeguimientoModal').textContent = email;
    document.getElementById('fechaModal').textContent = fecha;
    document.getElementById('escuelaObtenidaModal').textContent = escuela;
    document.getElementById('carreraObtenidaModal').textContent = carrera;

    const tabla = document.getElementById("tablaSchoolInSanLuisSeg");
    const tbody = tabla.querySelector("tbody");
    tbody.innerHTML = '';
    console.log("idResultado tiene "+ idResultado);
    url = urlForBack + `resultados/tracking?idResultado=${idResultado}`;
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
            // Llenar la tabla con los datos
            data.forEach((resultado) => {
                const fila = document.createElement("tr");
                // Acceder a los campos dentro del objeto usuarios
                const idPregunta = resultado[0];
                const opcionSeleccionada = resultado[1];

                const columnas = [idPregunta, opcionSeleccionada];
                columnas.forEach((columna) => {
                    const celda = document.createElement("td");
                    celda.textContent = columna;
                    fila.appendChild(celda);
                });

                tbody.appendChild(fila);
                
            });
            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById('modalTableSchoolSeg'));
            modal.show();
        })
        .catch(error => console.error('Error al obtener datos:', error));
    } else {
        console.error('Token no disponible. El usuario no está autenticado.');
    }
    
}

function dataForTableCarrer(data){
    // Obtener la referencia a la tabla y la paginación
    const tabla = document.getElementById("tableForQuantityCarrer");
    const tbody = tabla.querySelector("tbody");
    const paginacion = document.getElementById("paginacion");
    const filtro = document.getElementById("filtrado"); // Agregar esta línea
    // const tabulatedTableCarreras = data;

    // Limpiar la tabla y la paginación
    tbody.innerHTML = '';
    paginacion.innerHTML = '';
    filtro.style.display = 'none';
    
    // Llenar la tabla con los datos
    data.forEach((resultado) => {
        const fila = document.createElement("tr");
        // Acceder a los campos dentro del objeto usuarios
        const carreras = resultado[0];
        const cantidadObtenida = resultado[1];

        const columnas = [carreras, cantidadObtenida];
        columnas.forEach((columna) => {
            const celda = document.createElement("td");
            celda.textContent = columna;
            fila.appendChild(celda);
        });
        tbody.appendChild(fila);
        
    });
    
}

function dataForTableTour(data){
    // Obtener la referencia a la tabla y la paginación
    const tabla = document.getElementById("tableTour");
    const tbody = tabla.querySelector("tbody");
    const paginacion = document.getElementById("paginacion");
    const filtro = document.getElementById("filtrado"); // Agregar esta línea
    // const tabulatedTableCarreras = data;

    // Limpiar la tabla y la paginación
    tbody.innerHTML = '';
    paginacion.innerHTML = '';
    filtro.style.display = 'none';
    
    // Llenar la tabla con los datos
    data.content.forEach((resultado) => {
        const fila = document.createElement("tr");
        // Acceder a los campos dentro del objeto usuarios
        const email = resultado[0];
        const edad = resultado[1];
        const fecha = resultado[2];
        const paisOrigen = resultado[3];
        const provincia = resultado[4];
        const escuela = resultado[5];
        const carreraObtenida = resultado[6];
        const idPregunta = resultado[7];
        const opcionSeleccionada = resultado[8];

        const columnas = [email, edad, fecha, paisOrigen, provincia, escuela, carreraObtenida, idPregunta, opcionSeleccionada];
        columnas.forEach((columna) => {
            const celda = document.createElement("td");
            celda.textContent = columna;
            fila.appendChild(celda);
        });
        tbody.appendChild(fila);
        
    });

    agregarBotonesPaginacionBootstrap(data, "paginacion5", 6);
}

function updateUrl(urlID,paginaActual, url){
    console.log("typeofSearch tieneeeee "+ typeOfSearch);
    const interesCheckbox = document.getElementById('interesCheckbox');
    const interesSeleccionado = interesCheckbox.checked.toString();
    switch (urlID) {
        case 1:
            // if(typeOfSearch == 0){
            //     console.log("entreaaaaaaaaaaaaaaa aquiiii sin search");
            //     url = urlForBack+`resultados/viewAll?page=${paginaActual}&quantityPerPage=${elementosPorPagina}`;
            // }
            // else{
            //     console.log("entreaaaaaaaaaaaaaaa aquiiii con search");
            //     url = urlForBack+`resultados/viewAll?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&opcion=${opcion}&valor=${valor}`;
            // }
            
            url = (typeOfSearch === 0) ?
            urlForBack+`resultados/viewAll?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&edadDesde=${valores.minValue}&edadHasta=${valores.maxValue}&interes=${interesSeleccionado}` :
            urlForBack+`resultados/viewAll?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&opcion=${opcion}&valor=${valor}&interes=${interesSeleccionado}`;
            break;
        case 2:
            url = (typeOfSearch === 0) ?
            urlForBack+`resultados/esRes?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&edadDesde=${valores.minValue}&edadHasta=${valores.maxValue}&interes=${interesSeleccionado}` :
            urlForBack+`resultados/esRes?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&opcion=${opcion}&valor=${valor}&edadDesde=${valores.minValue}&edadHasta=${valores.maxValue}&interes=${interesSeleccionado}`;

            break;
        case 3:
            url = (typeOfSearch === 0) ?
            urlForBack+`resultados/esNoRes?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&edadDesde=${valores.minValue}&edadHasta=${valores.maxValue}&interes=${interesSeleccionado}` :
            urlForBack+`resultados/esNoRes?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&opcion=${opcion}&valor=${valor}&edadDesde=${valores.minValue}&edadHasta=${valores.maxValue}&interes=${interesSeleccionado}`;

            break;
        case 4:
            url = (typeOfSearch === 0) ?
            urlForBack+`resultados/schoolInSanLuis?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&edadDesde=${valores.minValue}&edadHasta=${valores.maxValue}&interes=${interesSeleccionado}` :
            urlForBack+`resultados/schoolInSanLuis?page=${paginaActual}&quantityPerPage=${elementosPorPagina}&opcion=${opcion}&valor=${valor}&edadDesde=${valores.minValue}&edadHasta=${valores.maxValue}&interes=${interesSeleccionado}`;

            break;
        case 6:
            url = 
            urlForBack+`resultados/tour?page=${paginaActual}&quantityPerPage=${elementosPorPagina}`;

            break;
    }
    return url;
}

function agregarBotonesPaginacionBootstrap(data, idpaginacion, numberTable) {

    const paginacion = document.getElementById(idpaginacion);
    let url = "";

    // Limpiar el contenedor de paginación antes de agregar nuevos botones
    paginacion.innerHTML = "";

    console.log("typeofSearch tiene en paginado " +typeOfSearch);
    // Botón "Anterior"
    const botonAnterior = document.createElement("li");
    botonAnterior.classList.add("page-item");
    const enlaceAnterior = document.createElement("a");
    enlaceAnterior.classList.add("page-link");
    enlaceAnterior.setAttribute("href", "#");
    enlaceAnterior.textContent = "Anterior";
    botonAnterior.appendChild(enlaceAnterior);
    botonAnterior.addEventListener("click", () => {
        if (paginaActual > 0) {
            paginaActual--;
            url = updateUrl(numberTable,paginaActual,url);
            cargarDatosYPaginacion(numberTable,url);
        }
    });
    paginacion.appendChild(botonAnterior);

    // Agregar botones de páginas
    for (let i = 0; i < data.totalPages; i++) {
        const boton = document.createElement("li");
        boton.classList.add("page-item");
        const enlace = document.createElement("a");
        enlace.classList.add("page-link");
        enlace.setAttribute("href", "#");
        enlace.textContent = i + 1;
        boton.appendChild(enlace);
        // boton.addEventListener("click", () => {
        //     paginaActual = i;
        //     cargarDatosYPaginacion();
        // });
        paginacion.appendChild(boton);
    }

    // Botón "Siguiente"
    console.log("pagina total "+data.totalPages);
    console.log("pagina actual "+paginaActual);
    const botonSiguiente = document.createElement("li");
    botonSiguiente.classList.add("page-item");
    const enlaceSiguiente = document.createElement("a");
    enlaceSiguiente.classList.add("page-link");
    enlaceSiguiente.setAttribute("href", "#");
    enlaceSiguiente.textContent = "Siguiente";
    botonSiguiente.appendChild(enlaceSiguiente);
    botonSiguiente.addEventListener("click", () => {
        if (paginaActual < data.totalPages - 1) {
            paginaActual++;
            url = updateUrl(numberTable,paginaActual, url);
            cargarDatosYPaginacion(numberTable,url);
        }
    });
    paginacion.appendChild(botonSiguiente);

    // Personalizar botones (aquí puedes agregar tu propia lógica para estilos u otros atributos)
    const botones = paginacion.querySelectorAll("li");
    botones.forEach((boton, index) => {
        boton.classList.add("clase-personalizada"); // Agregar una clase personalizada
        // Puedes agregar más personalizaciones según tus necesidades
    });
}

// Cargar datos y paginación al cargar la página
console.log("numberTable tiene ",numberTable);
console.log("tableId tiene ",tableId);
// cargarDatosYPaginacion(numberTable, tableId);
selectOption(numberTable, tableId);