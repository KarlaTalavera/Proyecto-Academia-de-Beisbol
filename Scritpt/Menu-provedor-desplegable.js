const boton = document.getElementById('boton-registrar-desplegar');
const formulario = document.getElementById('formulario-Provedor');

boton.addEventListener('click', () => {

    if(formulario.style.display === 'none'){
        formulario.style.display = 'block';
    } else {
        formulario.style.display = 'none';
    }
});