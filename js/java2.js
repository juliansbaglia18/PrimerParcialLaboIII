function RealizarPeticionGET(url, funcion){
    http.onreadystatechange = funcion;
    http.open("GET", url, true);
    http.send();
}

function RealizarPeticionPOST(url, funcion, param){
    http.onreadystatechange = funcion;
    http.open("POST", url, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(param);
}

var http = new XMLHttpRequest();

window.onload = function(){
    RealizarPeticionGET("http://localhost:3000/materias", ArmarGrilla);
}

function ArmarGrilla(){
    if(http.readyState===4 && http.status===200){
        var arrayMaterias = JSON.parse(http.responseText);
        var tabla = document.getElementById("TablaMaterias");

        for(var i=0; i<arrayMaterias.length;i++)
        {
            let tr=document.createElement('tr');
            tr.addEventListener("dblclick", DblClickEvent)
            let datos=arrayMaterias[i];

            for(dato in datos){
                if(dato != "id"){
                    let td=document.createElement('td');
                    td.innerText=datos[dato];
                    tr.appendChild(td);
                    tabla.appendChild(tr);
                }
            }
            tr.setAttribute("id",i+1);
        }
    }
}

function DblClickEvent(e){
    var row = e.target.parentNode;
    var id = row.getAttribute("id");
    var nombre = row.childNodes[0].innerText;
    var cuatri = row.childNodes[1].innerText;
    var fecha = row.childNodes[2].innerText;
    var turno = row.childNodes[3].innerText;

    AbrirVentanaModificarMateria(id, nombre, cuatri, fecha, turno);
}

function AbrirVentanaModificarMateria(id, nombre, cuatri, fecha, turno){
    document.getElementById("spinner").hidden = true;
    //document.getElementById("TablaMaterias").style.opacity = 0.2;
    document.getElementById("VntModificarMateria").hidden = false;
    var btnCancelar = document.getElementById("btnCancelarModificar");
    btnCancelar.onclick = CerrarVentanaModificarMateria;
    var btnEliminar = document.getElementById("btnEliminarModificar");
    btnEliminar.onclick = EliminarMateria;
    var btnModificar = document.getElementById("btnModificar");
    btnModificar.onclick = ValidarYModificarMateria;
    
    fecha = FormatearFecha(fecha);
    //Cargo los datos de la persona
    document.getElementById("idMateria").value = id;
    document.getElementById("txtNombre").value = nombre;
    document.getElementById("slcCuatri").value = cuatri;
    document.getElementById("dateFecha").value = fecha;
    if(turno=="Mañana")
        document.getElementById("rdoM").checked = true;
    else
        document.getElementById("rdoN").checked = true;
}

function FormatearFecha(fecha){
    var anio = parseInt(fecha.substring(6, 10), 10).toString();
    var mes = parseInt(fecha.substring(3, 5), 10).toString();
    var dia = parseInt(fecha.substring(0, 2), 10).toString();

    if(mes.length == 1)
        mes = "0" + mes;
    if(dia.length == 1)
        dia = "0" + dia;
    return anio + "-" + mes + "-" + dia;
}

function DesformatearFecha(fecha){
    var anio = parseInt(fecha.substring(0, 4), 10).toString();
    var mes = parseInt(fecha.substring(5, 7), 10).toString();
    var dia = parseInt(fecha.substring(8, 10), 10).toString();

    if(mes.length == 1)
        mes = "0" + mes;

    if(dia.length == 1)
        dia = "0" + dia;

    return dia + "/" + mes + "/" + anio;
}

function ValidarFecha(fecha){
    var anio = parseInt(fecha.substring(0, 4), 10);
    var mes = parseInt(fecha.substring(5, 7), 10);
    var dia = parseInt(fecha.substring(8, 10), 10);

    var fechaHoy=new Date(2020,05,22);
    var fecha=new Date(anio,mes,dia);
    if(fechaHoy>fecha)
        return "";

    return "fecha";
}

function ValidarYModificarMateria(){
    var id= document.getElementById("idMateria").value;
    var nombre = document.getElementById("txtNombre");
    var cuatri = document.getElementById("slcCuatri");
    var fecha = document.getElementById("dateFecha");
    var turno = "Mañana";
    if(document.getElementById("rdoN").checked)
        turno = "Noche";

    var error = "";
    if(fecha.value != null)
        error = ValidarFecha(fecha.value);
    if(nombre.value.length <= 6)
        error = "materia";
    if(!document.getElementById("rdoN").checked && !document.getElementById("rdoM").checked)
        error = "turno";
    if(!cuatri.disabled)
        error = "cuatrimestre";

    if(error ==  ""){
        document.getElementById("spinner").hidden = false;
        document.getElementById("VntModificarMateria").hidden = true;
        document.getElementById("TablaMaterias").hidden = true;
        var fechaAux = DesformatearFecha(fecha.value);
        var json = {"id":id,
                    "nombre":nombre.value,
                    "cuatrimestre":cuatri.value,
                    "fechaFinal":fechaAux,
                    "turno":turno};
        RealizarPeticionPOST("http://localhost:3000/editar", ActualizarGrilla, JSON.stringify(json));
    }
    else{
        switch(error){

            case "materia":
                document.getElementById("txtNombre").style.border = "2px solid red";
                break;

            case "cuatrimestre":
                document.getElementById("slcCuatri").style.border = "2px solid red";
                break;

            case "fecha":
                document.getElementById("dateFecha").style.border = "2px solid red";
                break;
        }
    }
}

function ActualizarGrilla(){
    if(http.readyState===4 && http.status==200){
        var tabla = document.getElementById("TablaMaterias");
        var id = document.getElementById("idMateria").value;
        var nombre = document.getElementById("txtNombre").value;
        var fecha = document.getElementById("dateFecha").value;
        var fechaAux = DesformatearFecha(fecha);
        var turno = "Mañana";
        if (document.getElementById("rdoN").checked)
            turno = "Noche";

        for(var i=0;i<tabla.childElementCount;i++){
            var tr = tabla.childNodes[i];
            if (tr["id"] == id){
                if(tr != "id"){
                    tr.childNodes[0].innerText = nombre;
                    tr.childNodes[2].innerText = fechaAux;
                    tr.childNodes[3].innerText = turno;
                    CerrarVentanaModificarMateria();
                    return;
                }
            }
        }
    }
}

function CerrarVentanaModificarMateria(){
    document.getElementById("spinner").hidden = true;
    document.getElementById("VntModificarMateria").hidden = true;
    document.getElementById("TablaMaterias").hidden = false;
    document.getElementById("TablaMaterias").style.opacity = 1;
    document.getElementById("txtNombre").style.border = "0px";
    document.getElementById("slcCuatri").style.border = "0px";
    document.getElementById("dateFecha").style.border = "0px";
}

function EliminarMateria(){
    var id = document.getElementById("idMateria").value;
    var json = {"id":id};
    RealizarPeticionPOST("http://localhost:3000/eliminar", EliminarMateriaDeLaGrilla, JSON.stringify(json));
}

function EliminarMateriaDeLaGrilla(){
    document.getElementById("spinner").hidden = false;
    document.getElementById("VntModificarMateria").hidden = true;
    document.getElementById("TablaMaterias").hidden = true;
    
    if(http.readyState===4 && http.status==200){
        var tabla = document.getElementById("TablaMaterias");
        var id = document.getElementById("idMateria").value;
    
        for(var i=0;i<tabla.childElementCount;i++){
            var tr = tabla.childNodes[i];
            if (tr["id"] == id){
                tabla.removeChild(tr);
                CerrarVentanaModificarMateria();
            }
        }
    }
}