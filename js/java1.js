var objId;
var peticionHttp = new XMLHttpRequest();
var listaJson= new Array();
var urlMaterias = 'http://localhost:3000/materias';
var urlEliminar = 'http://localhost:3000/eliminar';
var urlEditar = 'http://localhost:3000/editar';
var rta;

window.addEventListener("load", Load);

function Load(){
    Botones();
    realizarPeticionGET(urlMaterias, traerJsonGetTabla);
}

function realizarPeticionPOST(url, funcion, param){
    SpinnerOn();
    peticionHttp.onreadystatechange = funcion;
    peticionHttp.open("POST", url, true);
    peticionHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    peticionHttp.send(param);
}
function realizarPeticionPostEliminar(url, funcion, param){
    SpinnerOn();
    peticionHttp.onreadystatechange = funcion;
    peticionHttp.open("POST", url, true);
    // console.log(peticionHttp.onreadystatechange);
    
    peticionHttp.setRequestHeader("Content-Type", "application/json");
    peticionHttp.send(param);
}

function realizarPeticionGET(url, funcion){
    peticionHttp.onreadystatechange = funcion;
    peticionHttp.open("GET", url, true);
    peticionHttp.send();
}

function Botones(){
    
    btnCerrar.addEventListener("mouseout",function(){
        btnCerrar.value = "X";
    });
    btnCerrar.addEventListener("mouseover",function(){
        btnCerrar.value = "Bye";
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

    var rdoMañana = document.getElementById("rdoMañana");
    var rdoNoche = document.getElementById("rdoNoche");

    rdoMañana.addEventListener("click", function(){
        rdoMañana.checked = true;
        rdoNoche.checked = false;
    });
    rdoNoche.addEventListener("click", function(){
        rdoNoche.checked = true;
        rdoMañana.checked = false;
    });
}

function traerJsonGetTabla(){
    
    tabla=document.getElementById("tableMaterias");
    if(peticionHttp.readyState == 4)
    {
        if(peticionHttp.status == 200)
        {
            var respuesta=peticionHttp.responseText;
            var json= JSON.parse(respuesta);

            console.log("cantidad de elementos: " + json.length);
            
            for(var i=0; i<json.length;i++)
            {
                var listaTr=new Array();
                var materia=new Array(json[i].nombre,json[i].cuatrimestre,
                    json[i].fechaFinal,json[i].turno,json[i].id);
                var trMateria=CrearNodo(materia);
                
                
                trMateria.addEventListener("dblclick", abrirContenedor);
                
                tabla.appendChild(trMateria);

                
                var element=document.getElementsByTagName("tr");
                for(var j=0; j<element.length; j++)
                {
                    listaTr.push(element[i]);
                }
                listaJson.push(json[i]);
            }
        }else{
            alert("ERROR");
        }
    }
}

function CrearNodo(materia)
{
  var trMateria=document.createElement("tr");
        
  var tdId=document.createElement("td");
  var tdNombre=document.createElement("td");
  var tdCuatri=document.createElement("td");
  var tdFecha=document.createElement("td");
  var tdTurno=document.createElement("td");

  tdId.hidden = true;

        
  var txName= document.createTextNode(materia[0]);
  var txCuatri=document.createTextNode(materia[1]);
  var txDate=document.createTextNode(materia[2]);
  var txTurno=document.createTextNode(materia[3]);
  var txId=document.createTextNode(materia[4]);

  tdNombre.appendChild(txName);
  tdCuatri.appendChild(txCuatri);
  tdFecha.appendChild(txDate);
  tdTurno.appendChild(txTurno);
  tdId.appendChild(txId);

  trMateria.appendChild(tdNombre);
  trMateria.appendChild(tdCuatri);
  trMateria.appendChild(tdFecha);
  trMateria.appendChild(tdTurno);
  trMateria.appendChild(tdId);

  return trMateria;
}

function abrirContenedor(event){
    var contenedor = document.getElementById("divContenedor");
        
    contenedor.hidden = false;

    var row = event.target.parentNode;
    var nombre = row.childNodes[0].innerText;
    var cuatri = row.childNodes[1].innerText;
    var fecha = row.childNodes[2].innerText;
    var turno = row.childNodes[3].innerText;
    var id = row.childNodes[4].innerText;
    objId = row.childNodes[4];
    
    // document.getElementById("idMateria").value = id;
    //console.log(fecha);
    fecha = iniciarFecha(fecha);
    // document.getElementById("idMateria").value = id;
    document.getElementById("txtName").value = nombre;
    document.getElementById("slcCuatri").value = cuatri;
    if(turno=="Mañana"){
        document.getElementById("rdoMañana").checked = true;
        document.getElementById("rdoNoche").checked = false;
    }
    else{
        document.getElementById("rdoNoche").checked = true;
        document.getElementById("rdoMañana").checked = false;
    }
    document.getElementById("dateFecha").value = fecha;

    console.log(nombre + " id: " + id);

    var btnCerrar = document.getElementById("btnCerrar");
    btnCerrar.addEventListener("click",CerrarContenedor);
    // btnCerrar.onclick = CerrarContenedor;

    var btnEliminar = document.getElementById("btnEliminar");
    // btnEliminar.onclick = borrar(materia);
    btnEliminar.addEventListener("click",Borrar);
    
    var btnGuardar = document.getElementById("btnGuardar");
    btnGuardar.addEventListener("click",Guardar);
    // btnGuardar.onclick = CerrarContenedor;
}

function Guardar(){
    var nombre = document.getElementById("txtName");
    var cuatri = document.getElementById("slcCuatri");
    var fecha = AcomodarFecha(document.getElementById("dateFecha").value);
    // console.log(AcomodarFecha(fecha.value));
    var turno = validarTurnoCheck();

    var param = "id="+objId.innerText+"&nombre="+nombre.value+"&cuatrimestre="+
    cuatri.value+"&fechaFinal="+fecha+"&turno="+turno;
    
    if(ValidarNameDate(nombre,fecha)==true)
    {
        realizarPeticionPOST(urlEditar, respuestaPostEditar, param);
        // if(rta == "ok"){
        // }
        CerrarContenedor();
    }  
}

function validarTurnoCheck()
{
    var Materia = BuscarMateriaPorId(objId.innerText);
    
    var turnoM=document.getElementById("rdoMañana");
    var turnoN=document.getElementById("rdoNoche");
    var jornada="";
    
    if(Materia.turno==="Mañana" && turnoN.checked==true )
    {
        jornada="Noche";
    }else if(Materia.turno==="Noche" && turnoM.checked==true)
    {
        jornada="Mañana";
    }else if(Materia.turno==="Mañana")
    {
        jornada="Mañana";
    }else if(Materia.turno==="Noche")
    {
        jornada="Noche";
  }
  return jornada;
}

function AcomodarFecha(fecha){
    var fechaAux = fecha.split("-");
    return fechaAux[2] + "/" + fechaAux[1] + "/" + fechaAux[0];
}

function EditarContenedor()
{
    var nombre = document.getElementById("txtName");
    var cuatri = document.getElementById("slcCuatri");
    var fecha = AcomodarFecha(document.getElementById("dateFecha").value);
    var turno = validarTurnoCheck();

    var fila = objId.parentNode;
    var tabla= fila.parentNode;

    var aux=new Array(nombre.value, cuatri.value, fecha, turno, objId.innerText);
    var nuevoNodo=CrearNodo(aux);
    nuevoNodo.addEventListener("dblclick", abrirContenedor);
    
    tabla.replaceChild(nuevoNodo,fila);
}

function ValidarNameDate(name, date){
    var retorno=true;
    if(name.value.length <6)
    {
        console.log("Error en el nombre");
        name.className="inputError";
        retorno =false;
    }else{
        name.className="inputSinError";
    }
    
    var fechaAct=hoyFecha();
    if(date.value < fechaAct)
    {
        console.log("Error en la fecha");
        date.className="inputError";
        retorno =false;
    }else{
        date.className="inputSinError";
    }
    return retorno;
}

function hoyFecha(){
    var fecha = new Date(); //Fecha actual
    var mes = fecha.getMonth()+1; //obteniendo mes
    var dia = fecha.getDate(); //obteniendo dia
    var año = fecha.getFullYear(); //obteniendo año
    if(dia < 10)
    dia = '0' + dia; //agrega cero si el menor de 10
    if(mes < 10)
    mes = '0' + mes //agrega cero si el menor de 10
    var fecha = año + "-" + mes + "-" + dia;
    return fecha;
}

function CerrarContenedor(){
    var contenedor = document.getElementById("divContenedor");
    contenedor.hidden = true;
}

function BuscarMateriaPorNombre(nombre){
    var retorno=false;
  for(var i=0; i<listaJson.length; i++)
  {
    if(nombre == listaJson[i].nombre)
    {
      retorno=listaJson[i];
    }
  }
  return retorno;
}

function BuscarMateriaPorId(id){
    var retorno=false;
    for(var i=0; i<listaJson.length; i++)
    {
        if(id == listaJson[i].id)
        {
            retorno=listaJson[i];
        }
    }
    return retorno;
}
function Borrar(){
    EliminarMateria();
    CerrarContenedor();
}
function BorrarFila(obj){
    var fila = obj.parentNode;
    var tabla = fila.parentNode;

    tabla.removeChild(fila);
    
    console.log("Materia " + fila.childNodes[0].innerText + " elimnada.");
}

function iniciarFecha(fecha){
    var anio = parseInt(fecha.substring(6, 10), 10).toString();
    var mes = parseInt(fecha.substring(3, 5), 10).toString();
    var dia = parseInt(fecha.substring(0, 2), 10).toString();

    if(mes.length == 1)
        mes = "0" + mes;
    if(dia.length == 1)
        dia = "0" + dia;
    return anio + "-" + mes + "-" + dia;
}

function EliminarMateria(){
    var id = objId.innerText;
    var json = {"id":id};
    
    realizarPeticionPostEliminar(urlEliminar, respuestaPostEliminar, JSON.stringify(json));
}
function respuestaPostEditar(){
    rta = "error";

    if(peticionHttp.readyState===4){
        if(peticionHttp.status===200){
            respuesta=peticionHttp.responseText;
            if(respuesta === '{"type":"ok"}'){
                rta = "ok";
                EditarContenedor();
                SpinnerOff();
            }
        }
    }
}
function respuestaPostEliminar(){
    rta = "error";

    if(peticionHttp.readyState===4){
        if(peticionHttp.status===200){
            respuesta=peticionHttp.responseText;
            if(respuesta === '{"type":"ok"}'){
                rta = "ok";
                BorrarFila(objId);
                SpinnerOff();

            }
        }
    }
}

function SpinnerOn(){
    document.getElementById("loader").hidden = false;
}
function SpinnerOff(){
    document.getElementById("loader").hidden = true;
}