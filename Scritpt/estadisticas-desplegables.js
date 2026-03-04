document.addEventListener("DOMContentLoaded", () =>{
    const btonpicheo = document.getElementById("tabla-picheo");
    const btonbateo = document.getElementById("tabla-bateo");
    const estadisticasPicheo = document.getElementById("tabla-estadisticas-picheo");
    const estadisticasBateo = document.getElementById("tabla-estadisticas-bateo");

    btonbateo.addEventListener("click", () => {
        estadisticasBateo.style.display = "block";
        estadisticasPicheo.style.display = "none";
    
       btonbateo.classList.add("active");
       btonpicheo.classList.remove("active");
    }); 

    btonpicheo.addEventListener("click", () => {
        estadisticasPicheo.style.display = "block";
        estadisticasBateo.style.display = "none";   
    
        btonpicheo.classList.add("active");
        btonbateo.classList.remove("active");
    });
});
