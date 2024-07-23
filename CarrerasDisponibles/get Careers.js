function modalFunctionQQ(modalId, urlOption) {
    // Ruta al archivo modals.html
    let rutaArchivo = '';
    if(urlOption == 1){   
        rutaArchivo = 'modalsInfo.html'; // Obtiene la ruta 
    }else{
        if(urlOption == 2){
            rutaArchivo = '../Preguntas/modals.html'; // Obtiene la ruta 
        }
    }

    // Fetch para obtener el contenido del archivo modals.html
    fetch(rutaArchivo)
      .then(response => response.text())
      .then(data => {
        // Crear un elemento temporal para cargar el HTML del archivo
        const tempEl = document.createElement('div');
        tempEl.innerHTML = data;

        // Obtener el modal deseado por su ID
        const modalContent = tempEl.querySelector(`#${modalId}`);
    
        // Verificar si se encontró el modal
        if (modalContent) {          
            // Crear un nuevo div para el modal
            const modalWrapper = document.createElement('div');
            modalWrapper.appendChild(modalContent.cloneNode(true));

            // Adjuntar el nuevo div al cuerpo del documento
            document.body.appendChild(modalWrapper);

            // Mostrar el modal usando jQuery
            $(modalWrapper.firstChild).modal('show');
        } else {
          console.error(`Modal con ID ${modalId} no encontrado en el archivo.`);
        }
      })
      .catch(error => {
        console.error('Error al cargar el archivo:', error);
      });
  }

function backToResgistro(){
  // const queryString = window.location.search;
  // const urlParams = new URLSearchParams(queryString);

  // const email = urlParams.get('email');
  // const idUsuario = urlParams.get('id');
  // const edad = urlParams.get('edad');
  // const esResidenteArg = urlParams.get('esResidenteArg');
  // const paisOrigen = urlParams.get('paisOrigen');
  // const provinciaArg = urlParams.get('provinciaArg');
  const email = localStorage.getItem('email');
  const idUsuario = localStorage.getItem('id');
  const edad = localStorage.getItem('edad');
  const esResidenteArg = localStorage.getItem('esResidenteArg');
  const paisOrigen = localStorage.getItem('paisOrigen');
  const provinciaArg = localStorage.getItem('provinciaArg');
  
  // Construir la nueva URL con los datos
  // const nuevaURL = `../registroA.html?email=${email}&id=${idUsuario}&edad=${edad}&esResidenteArg=${esResidenteArg}&paisOrigen=${paisOrigen}&provinciaArg=${provinciaArg}`;
  const nuevaURL = `../registroA.html`;

  // Redirigir a registroA.html con los datos
  window.location.href = nuevaURL;
}

function obtenerFechaActual() {
    const fechaActual = new Date();
    
    // Obtén los componentes de la fecha
    const dia = fechaActual.getUTCDate() + 1;
    const mes = fechaActual.getUTCMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const anio = fechaActual.getUTCFullYear();

    // Formatea la fecha como "YYYY-MM-DD" (puedes ajustar el formato según tus necesidades)
    const fechaFormateada = `${anio}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
    // const fechaFormateada = `${dia < 10 ? '0' : ''}${dia}-${mes < 10 ? '0' : ''}${mes}-${anio}`;

    return fechaFormateada;
}


function sendResultsQQ(results, interes, typeofPDF){
    
  // const queryString = window.location.search;
  // const urlParams = new URLSearchParams(queryString);

  // const email = urlParams.get('email');
  // const idUsuario = urlParams.get('id');
  // const edad = urlParams.get('edad');
  // const esResidenteArg = urlParams.get('esResidenteArg');
  // const paisOrigen = urlParams.get('paisOrigen');
  // const provinciaArg = urlParams.get('provinciaArg');

  const email = localStorage.getItem('email');
  const idUsuario = localStorage.getItem('id');
  const edad = localStorage.getItem('edad');
  const esResidenteArg = localStorage.getItem('esResidenteArg');
  const paisOrigen = localStorage.getItem('paisOrigen');
  const provinciaArg = localStorage.getItem('provinciaArg');

  console.log('Email:', email);
  console.log('ID:', idUsuario);
  console.log('Edad:', edad);
  console.log('Es residente de Argentina:', esResidenteArg);
  console.log('País de Origen:', paisOrigen);
  console.log('Provincia en Argentina:', provinciaArg);

  const url = urlForBack+'resultados';  // Reemplaza con la URL de tu endpoint en el backend
  const data = {
    resultados: {
      carreraObtenida: results,
      idUsuario: idUsuario,
      fecha: obtenerFechaActual(),
      interes: interes,
      saveTest: false
    }
  }

  fetch(url, {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
  })
  .then(response => {
      console.log('Estado de la respuesta:', response.status);
      console.log('Cabeceras de la respuesta:', response.headers);

      if (!response.ok) {
          throw new Error('Error en la respuesta del servidor: ' + response.status);
      }

      // Verifica si la respuesta tiene un tipo de contenido adecuado
      const contentType = response.headers.get('content-type');
      console.log('Tipo de contenido de la respuesta:', contentType);

      if (contentType && contentType.includes('application/json')) {
          return response.json();  // Analiza la respuesta como JSON
      } else {
          return response.text();
      }
  })
  .then(data => {
      console.log('Respuesta del servidor:', data);
      console.log('ID del usuario:', data.id);
      // debugger;
      // let urlModalsResults = "../modalsResults.html";
      // let urlModalsResults = "modalsInfo.html";
      if(interes == true){ 
        let urlModalsResults = "modalsInfo.html";
        fetch(urlModalsResults)
        .then(response => response.text())
        .then(html => {
            // Enviamos el correo
            sendEmailCD(typeofPDF,email);
            // Crear un elemento temporal para cargar el HTML del archivo
            const tempEl = document.createElement('div');
            tempEl.innerHTML = html;

            // Obtener el modal deseado por su ID
            const modalContent = tempEl.querySelector(`#modalFinalizacion`);
        
            // Verificar si se encontró el modal
            if (modalContent) {          
                // Modificar el contenido del modal antes de mostrarlo
                const emailSpan = modalContent.querySelector('#emailEnModal');
                if (emailSpan) {
                    emailSpan.textContent = `${email}`;
                }
                
                // Crear un nuevo div para el modal
                const modalWrapper = document.createElement('div');
                modalWrapper.appendChild(modalContent.cloneNode(true));

                // Adjuntar el nuevo div al cuerpo del documento
                document.body.appendChild(modalWrapper);

                // Mostrar el modal usando jQuery
                $(modalWrapper.firstChild).modal('show');
            } else {
            console.error(`Modal con ID modalFinalizacion no encontrado en el archivo modalsInfo.html.`);
            }
        });
    }
    else{
        // Acciones de que en caso no aceptara la carrera 
        fetch(urlModalsResults)
        .then(response => response.text())
        .then(html => {
            // Crear un elemento temporal para cargar el HTML del archivo
            const tempEl = document.createElement('div');
            tempEl.innerHTML = html;

            // Obtener el modal deseado por su ID
            const modalContent = tempEl.querySelector(`#modalNoInteres`);
        
            // Verificar si se encontró el modal
            if (modalContent) {
                // Crear un nuevo div para el modal
                const modalWrapper = document.createElement('div');
                modalWrapper.appendChild(modalContent.cloneNode(true));

                // Adjuntar el nuevo div al cuerpo del documento
                document.body.appendChild(modalWrapper);

                // Mostrar el modal usando jQuery
                $(modalWrapper.firstChild).modal('show');
            } else {
            console.error(`Modal con ID modalFinalizacion no encontrado en el archivo modalsInfo.html.`);
            }
        });
    }
  })
  .catch(error => {
      console.error('Error al realizar la solicitud:', error);
  });
}

function reloadPage() {
  // Recarga la página a registroA.html

  // const queryString = window.location.search;
  // const urlParams = new URLSearchParams(queryString);

  // const email = urlParams.get('email');
  // const idUsuario = urlParams.get('id');
  // const edad = urlParams.get('edad');
  // const esResidenteArg = urlParams.get('esResidenteArg');
  // const paisOrigen = urlParams.get('paisOrigen');
  // const provinciaArg = urlParams.get('provinciaArg');

  const email = localStorage.getItem('email');
  const idUsuario = localStorage.getItem('id');
  const edad = localStorage.getItem('edad');
  const esResidenteArg = localStorage.getItem('esResidenteArg');
  const paisOrigen = localStorage.getItem('paisOrigen');
  const provinciaArg = localStorage.getItem('provinciaArg');
  
  // Construir la nueva URL con los datos
  // const nuevaURL = `../registroA.html?email=${email}&id=${idUsuario}&edad=${edad}&esResidenteArg=${esResidenteArg}&paisOrigen=${paisOrigen}&provinciaArg=${provinciaArg}`;
  const nuevaURL = `../registroA.html`;

  // Redirigir a registroA.html con los datos
  window.location.href = nuevaURL;
}

// function sendEmail(email) {
//     // Obtiene el valor del correo electrónico desde el span
//     // var destinatario = document.getElementById('emailEnModal').innerText;
//     var destinatario = email;

//     // Abre una nueva ventana de correo electrónico con el destinatario
//     // window.open('mailto:' + email);
//     fetch(urlForBack+'sendEmail/enviar', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             destinatario: destinatario 
//         })
//     })
//     .then(response => {
//         console.log('Estado de la respuesta:', response.status);
//         console.log('Cabeceras de la respuesta:', response.headers);

//         if (!response.ok) {
//             throw new Error('Error en la respuesta del servidor: ' + response.status);
//         }

//         // Verifica si la respuesta tiene un tipo de contenido adecuado
//         const contentType = response.headers.get('content-type');
//         console.log('Tipo de contenido de la respuesta:', contentType);

//         if (contentType && contentType.includes('application/json')) {
//             return response.json();  // Analiza la respuesta como JSON
//         } else {
//             return response.text();
//         }
//     })
//     .then(data => {
//         console.log('Respuesta del servidor:', data);
//         console.log('Respuesta del status:', data.status);
    
//         // Verifica si la respuesta indica que el mensaje fue enviado exitosamente
//         // if (data.status === 200) {
//             // Muestra un mensaje de alerta indicando que el mensaje fue enviado
//             // alert('Mensaje enviado exitosamente, presione aceptar para volver hacer el test');
//             // reloadPage();
//         // } else {
//         //     // Muestra un mensaje de alerta indicando que hubo un problema al enviar el mensaje
//         //     alert('Error al enviar el mensaje');
//         // }
        
//     })
//     .catch(error => {
//         console.error('Error al enviar el correo electrónico:', error);
//     });
// }