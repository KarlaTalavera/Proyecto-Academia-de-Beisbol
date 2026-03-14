const boton = document.getElementById('boton-registrar-jugador-desplegar');
const formulario = document.getElementById('Nuevo-jugador');

boton.addEventListener('click', () => {

    if(formulario.style.display === 'none'){
        formulario.style.display = 'block';
    } else {
        formulario.style.display = 'none';
    }
});