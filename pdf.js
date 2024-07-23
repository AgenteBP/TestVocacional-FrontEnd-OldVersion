
// function generarPDF(typeofPDF){

//     var data = null;

//     // // Agrega el título al PDF
//     // pdf.setFontSize(18);

//     switch(typeofPDF){
//         case 1: 
//             pdf.text(carrerTW, 10, 10);
//             data = document.getElementById('tableTW');
//             break;
//         case 2:
//             pdf.text(carrerTR, 10, 10);
//             data = document.getElementById('tableTR');
//             break;
//         case 3:
//             pdf.text(carrerPC, 10, 10);
//             data = document.getElementById('tablePC');
//             break;
//         case 4:
//             pdf.text(carrerLC, 15, 20);
//             data = document.getElementById('tableLC');
//             break;
//         case 5:
//             pdf.text(carrerII, 10, 10);
//             data = document.getElementById('tableII');
//             break;
//         case 6:
//             pdf.text(carrerIC, 10, 10);
//             data = document.getElementById('tableIC');
//             break;
//     }

//     pdf.html(
//         data, 
//         {
//           x: margin, 
//           y: margin, 
//           html2canvas:{
//             scale: scale, 
//         },
//         callback: function(pdf){ 
//             pdf.output('dataurlnewwindow', 'carrera_informacion.pdf'); 
//         }
//      });

//     // Guarda o muestra el PDF
//     // pdf.save('carrera_informacion.pdf');
    
// }



// Variables y funciones para Carreras Disponibles
var scrollYPosition = 0;
var scrollXPosition = 0;

function generarPDF(typeofPDF){

    var $data = null;
    scrollYPosition = 0;
    scrollXPosition = 0;

    switch (typeofPDF) {
        case 1:
            $data = document.getElementById('tableTW');
            break;
        case 2:
            $data = document.getElementById('tableTR');
            break;
        case 3:
            $data = document.getElementById('tablePC');
            break;
        case 4:
            $data = document.getElementById('tableLC');
            break;
        case 5:
            $data = document.getElementById('tableII');
            break;
        case 6:
            $data = document.getElementById('tableIC');
            break;
    }

    html2pdf()
    .set({
        margin: [0.5,0.5,0.5,0.5],
        filename: 'carrera_informacion.pdf',
        image: {
            type: 'jpeg',
            quality: 0.98
        },
        html2canvas: {
            scale: 3, // A mayor escala, mejores gráficos, pero más peso
            letterRendering: true,
            scrollY: scrollYPosition,
            scrollX: scrollXPosition
        },
        jsPDF: {
            unit: "in",
            format: "a4",
            orientation: 'portrait', // landscape o portrait
        }
    })
    .from($data)
    .save()
    .catch(err => console.log(err));
}

function sendEmail(typeofPDF, destinatario) {
    console.log("el destinatario es ", destinatario);
    console.log("el typeofPDF es ", typeofPDF);

    var $data = null;
    scrollYPosition = 0;
    scrollXPosition = 0;

    switch (typeofPDF) {
        case 1:
            $data = document.getElementById('tableTW');
            break;
        case 2:
            $data = document.getElementById('tableTR');
            break;
        case 3:
            $data = document.getElementById('tablePC');
            break;
        case 4:
            $data = document.getElementById('tableLC');
            break;
        case 5:
            $data = document.getElementById('tableII');
            break;
        case 6:
            $data = document.getElementById('tableIC');
            break;
    }

    html2pdf()
    .set({
        margin: [0.5,0.5,0.5,0.5],
        filename: 'carrera_informacion.pdf',
        image: {
            type: 'jpeg',
            quality: 0.98
        },
        html2canvas: {
            scale: 3, // A mayor escala, mejores gráficos, pero más peso
            letterRendering: true,
            scrollY: scrollYPosition,
            scrollX: scrollXPosition
        },
        jsPDF: {
            unit: "in",
            format: "a4",
            orientation: 'portrait', // landscape o portrait
        }
    })
    .from($data)
    .toPdf()
    .get('pdf')
    .then(function(pdf) {
        // Convertir el PDF en un Blob
            var blob = new Blob([pdf.output('arraybuffer')], { type: 'application/pdf' });

            // Crear el objeto FormData y agregar el PDF y el destinatario
            var formData = new FormData();
            formData.append('pdf', blob, 'carrera_informacion.pdf');
            formData.append('destinatario', destinatario);
            formData.append('typeofPDF', typeofPDF);

            // Enviar la solicitud POST al backend
            fetch(urlForBack+'sendEmail/enviar', {
                method: 'POST',
                body: formData
            })
                // .then(response => {
                //     if (!response.ok) {
                //         throw new Error('Error al enviar el PDF al servidor');
                //     }
                //     alert('PDF enviado al servidor correctamente');
                // })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al enviar el PDF al servidor');
            });
    })
    .catch(err => console.log(err));
}




function generarPDFCD(typeofPDF){

    var $data = null;
    scrollYPosition = 0;
    scrollXPosition = 0;

    switch (typeofPDF) {
        case 1:
            $data = document.getElementById('tableTW');
            break;
        case 2:
            $data = document.getElementById('tableTR');
            break;
        case 3:
            $data = document.getElementById('tablePC');
            break;
        case 4:
            $data = document.getElementById('tableLC');
            break;
        case 5:
            $data = document.getElementById('tableII');
            break;
        case 6:
            $data = document.getElementById('tableIC');
            break;
    }

    html2pdf()
    .set({
        margin: [1,0.5,1,0.5],
        filename: 'carrera_informacion.pdf',
        image: {
            type: 'jpeg',
            quality: 0.98
        },
        html2canvas: {
            scale: 3, // A mayor escala, mejores gráficos, pero más peso
            letterRendering: true,
            scrollY: scrollYPosition,
            scrollX: scrollXPosition
        },
        jsPDF: {
            unit: "in",
            format: "a4",
            orientation: 'portrait', // landscape o portrait
        }
    })
    .from($data)
    .save()
    .catch(err => console.log(err));
}

function sendEmailCD(typeofPDF, destinatario) {
    console.log("el destinatario es ", destinatario);
    console.log("el typeofPDF es ", typeofPDF);

    var $data = null;
    scrollYPosition = 0;
    scrollXPosition = 0;

    switch (typeofPDF) {
        case 1:
            scrollYPosition = 0;
            $data = document.getElementById('tableTW');
            break;
        case 2:
            $data = document.getElementById('tableTR');
            break;
        case 3:
            scrollXPosition = 0
            $data = document.getElementById('tablePC');
            break;
        case 4:
            $data = document.getElementById('tableLC');
            break;
        case 5:
            $data = document.getElementById('tableII');
            break;
        case 6:
            $data = document.getElementById('tableIC');
            break;
    }

    html2pdf()
    .set({
        margin: [1,0.5,1,0.5],
        filename: 'carrera_informacion.pdf',
        image: {
            type: 'jpeg',
            quality: 1
        },
        html2canvas: {
            scale: 3, // A mayor escala, mejores gráficos, pero más peso
            letterRendering: true,
            scrollY: scrollYPosition,
            scrollX: scrollXPosition
        },
        jsPDF: {
            unit: "in",
            format: "a4",
            orientation: 'portrait', // landscape o portrait
        }
    })
    .from($data)
    .toPdf()
    .get('pdf')
    .then(function(pdf) {
        // Convertir el PDF en un Blob
            var blob = new Blob([pdf.output('arraybuffer')], { type: 'application/pdf' });

            // Crear el objeto FormData y agregar el PDF y el destinatario
            var formData = new FormData();
            formData.append('pdf', blob, 'carrera_informacion.pdf');
            formData.append('destinatario', destinatario);
            formData.append('typeofPDF', typeofPDF);

            // Enviar la solicitud POST al backend
            fetch(urlForBack+'sendEmail/enviar', {
                method: 'POST',
                body: formData
            })
                // .then(response => {
                //     if (!response.ok) {
                //         throw new Error('Error al enviar el PDF al servidor');
                //     }
                //     alert('PDF enviado al servidor correctamente');
                // })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al enviar el PDF al servidor');
            });
    })
    .catch(err => console.log(err));
}



