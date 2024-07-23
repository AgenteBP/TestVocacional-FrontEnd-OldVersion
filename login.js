let userName = null;
let password = null;
let data = null;
let authToken = null;

function modalSesionIncorrect(){
    // Muestra el modal
    $('#sesionNoAutorizadoModal').modal('show');


}

function submitLogin(event) {
    var form = document.querySelector('.needs-validation');

    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    } else {
        // Realiza aquí la lógica de autenticación o cualquier otra acción que desees
        // Por ahora, simplemente cierra el modal
        userName = document.getElementById('username').value;
        password = document.getElementById('password').value;

        data = {
            userName: userName,
            password: password
        };
        fetch(urlForBack+"auth/login", {
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
                    modalSesionIncorrect();
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
                // debugger;
                

                // Almacena el token y el usuario en el localStorage

                localStorage.setItem('userName', userName);
                localStorage.setItem('authToken', data.token);
                
                // Si la autenticación es exitosa, redirige a la página mostrarResultado.html
                window.location.href = 'Inicio/mostrarResultado3.html';
            })
            .catch(error => {
                console.error('Error al realizar la solicitud:', error);
        });
        
    }

    form.classList.add('was-validated');
}

function showResults(){

    // window.location.href = 'mostrarResultado.html';
    $('#resultsModal').modal('show');
}