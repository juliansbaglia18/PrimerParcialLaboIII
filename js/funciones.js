var obj = new Array();
var flag = false;

window.addEventListener("load", function()
{
    traerJsonGetTabla('http://localhost:3000/materias');
    btnCerrar.addEventListener("click", cerrar);
    btnGuardar.addEventListener("click", cerrar);

    var load = document.getElementById("loader");
    
    load.hidden = true;
    
    btnCerrar.addEventListener("mouseout",function(){
        btnCerrar.value = "X";
    });
    btnCerrar.addEventListener("mouseover",function(){
        btnCerrar.value = "bye";
    });
    btnEliminar.addEventListener("mouseout",function(){
        btnEliminar.value = "Eliminar";
    });
    btnEliminar.addEventListener("mouseover",function(){
        btnEliminar.value = "Seguro?";
    });
    
    btnGuardar.addEventListener("mouseout",function(){
        btnGuardar.value = "Modificar";
    });
    btnGuardar.addEventListener("mouseover",function(){
        btnGuardar.value = "Todo listo?";
    });
    
});

function traerJsonGetTabla(url){
    var peticionHttp = new XMLHttpRequest();
    peticionHttp.open('GET', url, true); 
    peticionHttp.onreadystatechange = function () {
        if (peticionHttp.readyState == 4)
        if  (peticionHttp.status == 200) {
            obj = JSON.parse(peticionHttp.responseText);
            console.log("Cantidad de elementos: "+obj.length);
        }
        var tcuerpo = document.getElementById("tcuerpo");
        
        for (var i = 0; i < obj.length; i++) {
            
            var row = document.createElement("tr");
            
            var colN = document.createElement("td");
            var noText = document.createTextNode(obj[i].nombre);
            colN.appendChild(noText);
            row.appendChild(colN);
            
            var colA = document.createElement("td");
            var apText = document.createTextNode(obj[i].cuatrimestre);
            colA.appendChild(apText);
            row.appendChild(colA);
            
            var colF = document.createElement("td");
            var fText = document.createTextNode(obj[i].fechaFinal);
            colF.appendChild(fText);
            row.appendChild(colF);
            
            var colS = document.createElement("td");
            var sText = document.createTextNode(obj[i].turno);
            colS.appendChild(sText);
            row.appendChild(colS);
            row.addEventListener("dblclick", abrir);
            
            
            tcuerpo.appendChild(row);   
        }  
    };
    peticionHttp.send(null);
}

function modificar(){
    alert("Modificar");
    
    
    // event.preventDefault();
    
    // var fila = event.name;
    // console.log(fila);
    // var tabla = document.getElementById("tcuerpo");
    
    // tabla.removeChild(fila);
    
}

function abrir(event){
    var contenedor = document.getElementById("divContenedor");
    
    if(flag == false){
        contenedor.hidden = flag;
        flag = true;
    }else{
        contenedor.hidden = flag;
        flag = false;
    }
    
    event.preventDefault();
    
    btnEliminar.addEventListener("click", function(){
        event.preventDefault();
    
        var fila = event.target.parentNode;
        
        var tabla = document.getElementById("tcuerpo");
        
        tabla.removeChild(fila);
        
        cerrar();
    });
}

function cerrar(){
    var contenedor = document.getElementById("divContenedor");

    contenedor.hidden = true;
    
    flag = false;
}