let questionsAndOption = [];

// Agrega un objeto con la pregunta y la opción seleccionada al arreglo
function tour(idPregunta, opcionSeleccionada){ 
    questionsAndOption.push({ idPregunta: idPregunta, opcionSeleccionada: opcionSeleccionada });

}

function resetTour(){
    while(questionsAndOption.length >0)
        questionsAndOption.pop();
}

