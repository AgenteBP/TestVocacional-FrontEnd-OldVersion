const token = localStorage.getItem('authToken');
const userName = localStorage.getItem('userName');

// Definir las URLs a las que quieres hacer Fetch
const url1 = urlForBack+`resultados/count`;
const url2 = urlForBack+`resultados/countWithInterest`;
const url3 = urlForBack+`resultados/mostChosenCareer`;
const url4 = urlForBack+`resultados/mostFrequentSchool`;
const urlGraphPie = urlForBack+`resultados/viewGraph?modo=1`;
const tabulatedTableOfCareers = urlForBack+`resultados/quantityByCareerTable`;
let tabulatedTableOfSchool = urlForBack+`resultados/quantityBySchoolTable`;

let tabulatedTableCarreras = null;
let tabulatedTableSchool = null;
let currentPage = 0;
// Definir una variable global para la cantidad de datos por página
const cantidadPorPagina = 10;


const cuentaTotalElement1 = document.getElementById('cuentaTotal');
const cuentaTotalElement2 = document.getElementById('cuentaTotalI');
const cuentaTotalElement3 = document.getElementById('cuentaCarrera');
const cuentaTotalElement4 = document.getElementById('cuentaEscuela');

console.log("el token tiene "+token);

function acortarNombreEscuela(nombreEscuela) {
    // Lista de palabras que se deben reemplazar
    const reemplazos = [
        { original: 'ESCUELA DE JORNADA EXTENDIDA', abreviado: 'ESC' },
        { original: 'ESCUELA PÚBLICA AUTOGESTIONADA', abreviado: 'ESC P.A ' },
        { original: 'ESCUELA TÉCNICA', abreviado: 'ESC TÉC ' },
        { original: 'ESCUELA ', abreviado: 'ESC ' },
        { original: 'CENTRO EDUCATIVO', abreviado: 'C.E ' },
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

function mostrarCarrerasMasElegidas(data, cuentaTotalElement) {
    // Si no hay datos disponibles
    if (data.length === 0) {
        console.error("No se han recibido datos.");
        return;
    }

    // Obtener la cantidad máxima de la primera entrada
    const maxCantidad = data[0][1];

    // Filtrar las carreras con la cantidad máxima
    const carrerasMasElegidas = data.filter(carrera => carrera[1] === maxCantidad).map(carrera => carrera[0]);

    // Mostrar las carreras más elegidas
    if (carrerasMasElegidas.length === 1) {
        const carreraMasElegida = carrerasMasElegidas[0];
        cuentaTotalElement.textContent = carreraMasElegida;
        console.log("La carrera más elegida es:", carreraMasElegida);
    } else {
        const carrerasEmpatadas = carrerasMasElegidas.join(", ");
        cuentaTotalElement.textContent = "Empate entre: " + carrerasEmpatadas;
        console.log("Hay un empate entre las siguientes carreras:", carrerasEmpatadas);
    }
}

function mostrarEscuelaMasElegida(data, cuentaTotalElement) {
    // Si no hay datos disponibles
    if (data.length === 0) {
        console.error("No se han recibido datos.");
        return;
    }

    // Inicializar variables para la escuela más elegida y su cantidad
    let escuelasMasElegidas = [];
    let maxCantidad = -1;

    // Iterar sobre los datos para encontrar la cantidad máxima
    data.forEach((escuela) => {
        const cantidad = escuela[1];
        if (cantidad > maxCantidad) {
            maxCantidad = cantidad;
            // Limpiar el array de escuelas más elegidas y agregar la escuela actual
            escuelasMasElegidas = [escuela[0]];
        } else if (cantidad === maxCantidad) {
            // Si hay un empate, agregar la escuela actual al array de escuelas más elegidas
            escuelasMasElegidas.push(escuela[0]);
        }
    });

    // Mostrar las escuelas más elegidas
    if (escuelasMasElegidas.length === 1) {
        const escuelaMasElegida = escuelasMasElegidas[0];
        cuentaTotalElement.textContent = escuelaMasElegida  + " con " + maxCantidad + " veces";
    } else {
        const escuelasEmpatadas = escuelasMasElegidas.join(", ");
        cuentaTotalElement.textContent = "Empate entre: " + escuelasEmpatadas + " con " + maxCantidad + " veces";
    }
}

// Funcion para filtros
// Función para manejar el cambio de página
function changePage(pageNumber) {
    
    tabulatedTableOfSchool = urlForBack+`resultados/quantityBySchoolTable?page=${pageNumber}&quantityPerPage=${10}`
    if (token) {
        // Realizar la solicitud GET a la API con información de paginación
        fetch(tabulatedTableOfSchool, {
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
            dataForQuatitySchool(data);
        })
        .catch(error => console.error('Error al obtener datos:', error));
    } else {
        console.error('Token no disponible. El usuario no está autenticado.');
    }
}
// Función para crear los botones de paginación
function createPagination(totalPages) {

    // Obtener el contenedor de la paginación
    const paginationContainer = document.getElementById("paginacionSchool");

    paginationContainer.innerHTML = ''; // Limpiar el contenido previo

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
                changePage(currentPage);
            }
        } else {
            console.error("El elemento paginacion no existe en el DOM.");
        }
        
    });
    previousButton.appendChild(previousLink);
    paginationContainer.appendChild(previousButton);

    // Crear botones de paginación para cada página
    for (let i = 0; i < totalPages; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');

        const a = document.createElement('a');
        a.classList.add('page-link');
        a.href = "#";
        a.textContent = i+1;
        a.addEventListener('click', () => {
            currentPage = i;
            changePage(i);
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
                changePage(currentPage);
            }
        } else {
            console.error("El elemento paginacion no existe en el DOM.");
        }
        
    });
    nextButton.appendChild(nextLink);
    paginationContainer.appendChild(nextButton);
}

function dataForQuatitySchool(data){
    // Obtener la referencia a la tabla y la paginación
    const tablaSchool = document.getElementById("tableForQuantitySchool");
    const tbodySchool = tablaSchool.querySelector("tbody");

    // Llenar la tabla con los datos
    data.content.forEach((resultado) => {
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
        tbodySchool.appendChild(fila);
        
    });

    // Crear la paginación solo si hay datos disponibles
    if (data.totalPages > 0) {

        // Crear los botones de paginación
        createPagination(data.totalPages);
    }
}

// Crear una función para hacer Fetch a una URL con el token de autorización
const fetchData = async (url) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    // Verificar si la respuesta es un Unauthorized (código 403)
    if (response.status === 403) {
        // El token ha expirado, muestra un modal y redirige a index.html
        mostrarModalSesionExpirada();
        // window.location.href = 'launch.html';
        return Promise.reject('Token expirado');
    }
    return await response.json();
};

// Hacer Fetch a todas las URLs simultáneamente usando Promise.all()
Promise.all([fetchData(url1), fetchData(url2), fetchData(url3), fetchData(url4), fetchData(urlGraphPie), fetchData(tabulatedTableOfCareers), fetchData(tabulatedTableOfSchool)])
.then(responses => {
    // responses es un array con los resultados de todas las llamadas Fetch
    const data1 = responses[0];
    const data2 = responses[1];
    const data3 = responses[2];
    const schools = responses[3];
    const graphPieCarreras = responses[4];
    tabulatedTableCarreras = responses[5];
    tabulatedTableSchool = responses[6];

    // Aquí puedes hacer lo que necesites con los datos obtenidos
    console.log('Datos de la URL 1:', data1);
    console.log('Datos de la URL 2:', data2);
    console.log('Datos de la URL 3:', data3);
    console.log('Datos de la URL 4:', schools);
    console.log('Datos de la URL 6:', tabulatedTableCarreras);

    // Por ejemplo, actualizar el contenido del DOM con los datos obtenidos
    cuentaTotalElement1.textContent = data1;
    cuentaTotalElement2.textContent = data2;
    mostrarCarrerasMasElegidas(data3, cuentaTotalElement3);
    mostrarEscuelaMasElegida(schools, cuentaTotalElement4);

    //Para grafico de barra
    anychart.onDocumentReady(function () {

        // Obtener los datos de las carreras y cantidades desde el array data
        let school = schools.map(item => acortarNombreEscuela(item[0]));
        let cantidades = schools.map(item => item[1]);

        // Crear un arreglo de objetos que contengan las carreras y las cantidades
        let chartData = [];

        for (let i = 0; (i < 5 && i<school.length); i++) {
            chartData.push({ x: school[i], value: cantidades[i] });
        }

        // create a chart
        var chart = anychart.bar();
        // chart.name("cantidad");
    
        // create a bar series and set the data
        var cantidad = chart.bar(chartData);
        cantidad.name("Cantidad");
    
        // set the chart title
        chart.title("Top 5");
    
        // set the titles of the axes
        chart.xAxis().title("Escuelas");
        chart.yAxis().title("Cantidad");
    
        // set the container id
        chart.container("graphForSchoolTop");
    
        // initiate drawing the chart
        chart.draw();
    });

    //Para grafico circular
    anychart.onDocumentReady(function () {
    
    var canvas = document.getElementById("graficaBarras");

    // Obtener los datos de las carreras y cantidades desde el array data
    let carreras = graphPieCarreras.map(item => item[0]);
    let cantidades = graphPieCarreras.map(item => item[1]);

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
    });     

    // Para tabla tabulada de cantidad de carreras
    
    // Obtener la referencia a la tabla y la paginación
    const tabla = document.getElementById("tableForQuantityCarrer");
    const tbody = tabla.querySelector("tbody");

    // Llenar la tabla con los datos
    tabulatedTableCarreras.forEach((resultado) => {
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

    // Para tabla tabulada de escuelas donde se ha realizado los tests
    dataForQuatitySchool(tabulatedTableSchool);
    
    
})
.catch(error => console.error('Error al obtener datos:', error));


function logOut() {
    localStorage.removeItem('token'); // Cambia 'token' por la clave que identifica tu sesión
    
    // Redirige a index.html
    window.location.href = '../index.html';
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
