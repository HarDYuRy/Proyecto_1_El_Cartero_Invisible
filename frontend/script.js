const nombre = "Erik";
const edad = 22;
const boto = document.getElementById("btnSaluda");
const boto1= document.getElementById("btnPresenta");


function saluda() {
    alert("Hola, món!");
}
function presentacion(){
    alert(`Me llamo ${nombre}, Y tengo ${edad} años`)
}


boto.addEventListener("click", saluda);
boto1.addEventListener("click", presentacion);
