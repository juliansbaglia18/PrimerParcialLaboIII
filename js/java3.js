var peticionHttp = new XMLHttpRequest();
var listaJson= new Array();
var Materia;
var evento;
function Load()
{
  getMateria(); 
}
function getMateria()
{    
  peticionHttp.onreadystatechange = callback;
  peticionHttp.open("GET","http://localhost:3000/materias",true);
  peticionHttp.send();
  console.log("termino")
                             
}
function callback()
{
  tabla=document.getElementById("tbDatos");
  if(peticionHttp.readyState===4)
  {
    if(peticionHttp.status===200)
    {
      var respuesta=peticionHttp.responseText;
      var json= JSON.parse(respuesta);
      for(var i=0; i<json.length;i++)
      {
        var listaTr=new Array();
        var M = json[i].fechaFinal.split("/").reverse().join("-");
        var materia=new Array(json[i].nombre,json[i].cuatrimestre,M,json[i].turno);
        var trMateria=CrearNodo(materia);

        tabla.appendChild(trMateria);
        
        var element=document.getElementsByTagName("tr");
        for(var j=0; j<element.length; j++)
        {
          listaTr.push(element[i]);
        }
        DobleClick(listaTr);       
        listaJson.push(json[i]);
      }
    }else{
      alert("ERROR");
    }
  }
}
function DobleClick(listaTr)
{
  for(var i=0; i<listaTr.length; i++)
  {
    listaTr[i].addEventListener("dblclick", CompletarCampos, false);
  }
} 
CompletarCampos=function(event)
{
  var name= document.getElementById("name")
  var cuatrimestre= document.getElementById("cuatri");
  var fecha= document.getElementById("dates");
  var turno=document.getElementsByName("Turno");
  if (event.target.tagName == "TD")
  { 
    var fila = event.target.parentNode;
    name.value = fila.children[0].innerHTML
    cuatrimestre.value = fila.children[1].innerHTML
    fecha.value = fila.children[2].innerHTML
    turno.value=fila.children[3].innerHTML
    
    
    if(turno.value=="Mañana")
    {
      turno=document.getElementById("jM").checked=true;
    }else{
      turno=document.getElementById("jN").checked=true;
    }
    if(CompararMaterias(name.value, cuatrimestre.value, fecha.value)!=false)
    {
      Materia=CompararMaterias(name.value, cuatrimestre.value);
    }
    evento=event;
    Inputs();
  }
}
function Inputs()
{
  AbrirContenedor();
}
function AbrirContenedor()
{
  var div=document.getElementById("div");
  div.hidden=false;
  var btnModificar=document.getElementById("btnModificar");
  btnModificar.addEventListener("click",GuardarClick);
  var btnCerrar=document.getElementById("btnCerrar");
  var btnEliminar=document.getElementById("btnEliminar");
  btnEliminar.addEventListener("click",EliminarFila);
  btnCerrar.addEventListener("click", CerrarContenedor);
}
function CompararMaterias(nombre, cuatrimestre)
{
  var retorno=false;
  for(var i=0; i<listaJson.length; i++)
  {
    if(nombre == listaJson[i].nombre && cuatrimestre== listaJson[i].cuatrimestre)
    {
      retorno=listaJson[i];
    }
  }
  return retorno;
}
function CerrarContenedor()
{
  var div=document.getElementById("div");
  div.hidden=true;
}
function validarTurnoCheck()
{
  var turnoM=document.getElementById("jM");
  var turnoN=document.getElementById("jN");
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
function GuardarClick()
{
  var name= document.getElementById("name")
  var cuatrimestre= document.getElementById("cuatri");
  var fecha= document.getElementById("dates");
  var auxJornada=validarTurnoCheck();
  if(ValidarCampos(name,fecha)==true)
  {
      EditarContenedor(name,cuatrimestre,fecha,auxJornada);
      Spinner();
      EjecutarPost(name,auxJornada,fecha);
  }
    
}
function EditarContenedor(name,cuatrimestre,fecha,jornada)
{
  evento.preventDefault();
  var fila = evento.target.parentNode;
  var tabla=document.getElementById("tbDatos");
  var aux=new Array(name.value,cuatrimestre.value,fecha.value,jornada);
  var nuevoNodo=CrearNodo(aux);
  tabla.replaceChild(nuevoNodo,fila);
}
  
function ValidarCampos(name, fecha)
{
  var retorno=true;
  if(name.value.length <6)
  {
    name.className="inputError";
    retorno =false;
  }else{
    name.className="inputSinError";
  }
  if(!document.querySelector('input[name="Turno"]:checked')) 
  {
    var turno=document.getElementsByName(turno);
    retorno =false;
  }
  var fechaAct=hoyFecha();
  if(fecha.value<fechaAct)
  {
    fecha.className="inputError";
    retorno =false;
  }else{
    fecha.className="inputSinError";
  }
  return retorno;
}
function hoyFecha(){
  var fecha = new Date(); //Fecha actual
  var mes = fecha.getMonth()+1; //obteniendo mes
  var dia = fecha.getDate(); //obteniendo dia
  var ano = fecha.getFullYear(); //obteniendo año
  if(dia<10)
    dia='0'+dia; //agrega cero si el menor de 10
  if(mes<10)
    mes='0'+mes //agrega cero si el menor de 10
  var fecha=ano+"-"+mes+"-"+dia;
  return fecha;
}
function EjecutarPost(name,auxJornada,fecha)
{
  peticionHttp.onreadystatechange = respuestaPost;
  peticionHttp.open("POST","http://localhost:3000/editar");
  peticionHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  peticionHttp.send("id="+Materia.id+"&nombre="+name.value+"&cuatrimestre="+Materia.cuatrimestre+"&fechaFinal="+fecha.value+"&turno="+auxJornada);
}
function EjecutarPostEliminar(materia)
{
  peticionHttp.onreadystatechange = respuestaPost;
  peticionHttp.open("POST","http://localhost:3000/eliminar");
  peticionHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  peticionHttp.send("id="+materia.id+"&nombre="+materia.nombre+"&cuatrimestre="+materia.cuatrimestre+"&fechaFinal="+materia.fechaFinal+"&sexo="+materia.turno);
}
function respuestaPost(){
  if(peticionHttp.readyState===4){
      if(peticionHttp.status===200){
          $respuesta=peticionHttp.responseText;
          alert($respuesta);
      }else{
          alert("ERROR");
      }
  }
}
function $(id)
{
    return document.getElementById(id).value;
}
function Limpiar()
{
  var name= document.getElementById("name");
  var fecha= document.getElementById("dates");
  var turno=document.getElementById("jN");
  var turnoM=document.getElementById("jM");

  name.value="";
  fecha.value="";
  turnoM.checked=false
  turno.checked=false
}
function CrearNodo(materia)
{
  var trMateria=document.createElement("tr");
        
  var tdnombre=document.createElement("td");
  var tdCuatrimestre=document.createElement("td");
  var tdFecha=document.createElement("td");
  var tdTurno=document.createElement("td");

        
  var txName= document.createTextNode(materia[0]);
  var txCuatrimestre=document.createTextNode(materia[1]);
  var txDate=document.createTextNode(materia[2]);
  var txTurno=document.createTextNode(materia[3]);

  //tabla.appendChild(trMateria);

  tdnombre.appendChild(txName);
  tdCuatrimestre.appendChild(txCuatrimestre);
  tdFecha.appendChild(txDate);
  tdTurno.appendChild(txTurno);

  trMateria.appendChild(tdnombre);
  trMateria.appendChild(tdCuatrimestre);
  trMateria.appendChild(tdFecha);
  trMateria.appendChild(tdTurno);
  return trMateria;
}

function Spinner()
{
  var charge=document.getElementById("spinner");
  charge.hidden=false;
  var cerrar=document.getElementById("XCerrar");
  cerrar.addEventListener("click",CerrarSpinner);
}
function CerrarSpinner()
{
  var charge=document.getElementById("spinner");
  charge.hidden=true;
}
function EliminarFila()
{
  Spinner();
  evento.preventDefault();
  var fila = evento.target.parentNode;
  EjecutarPostEliminar(Materia)
  var tabla=document.getElementById("tbDatos");
  tabla.removeChild(fila);
  Limpiar();
}