function MostrarElemento(numero) {
    // document.getElementById significa que va a tomar el elemento del documento mediante su ID, al concatenar ".style.display" significa que va modificar esas caracteristicas. "Block" es mostrar, "None" es ocultar.
    document.getElementById("contenido").style.display = 'block';
    switch(numero){
        case "1":
            document.getElementById("contenido").innerHTML = "<div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>  Robo o Extravio  </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>  Fuga de gases  </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>  Render  </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>  DRO </label>  </div>" ;
       
            break;
            case "2":
    document.getElementById("contenido").innerHTML = "<div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>  Daño al Recinto  </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>   Daño al Stand  </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>   Daño a terceros  </label>  </div> " ;
       
    break;
    case "3":
        document.getElementById("contenido").innerHTML = "<div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'> Sismo  </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>   Ambulancia  </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>   Conato de incendio  </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>   Lesion/Enfermedad  </label>  </div><div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>   Amenaza de bomba  </label>  </div> " ;
           
        break;
        case "4":
            document.getElementById("contenido").innerHTML = "<div class='col-12'> <div class='row'> <div class='col-4'> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'> Alfombra  </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>   Mobiliario  </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>   Luz/Electricidad  </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>   Colganteo  </label>  </div><div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>  Montaje Instalación </label>  </div> </div> <div class='col-4'> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>  Renta de inmobiliario </label>  </div>  <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>  Limpieza </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>  Servicio Médico </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>  Estacionamiento </label>  </div>  <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>  Renta de plantas </label> </div> </div> <div class='col-4'>   <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>  Agua y desague </label>  </div>  <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>  Aire </label>  </div>  <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>  Internet </label>  </div>  <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>  Alimentos y bebidas </label> </div> </div> </div> </div>" ;    
            break;

            case "5":
                document.getElementById("contenido").innerHTML = "<div class='col-12'> <div class='row'> <div class='col-6'>  <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'> Trazado   </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>   Etiquetado  </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>   % armado  </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>   Separación entre Stands </label>  </div> </div> <div class='col-6'><div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>   Pago pendiente </label>  </div>  <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>   Fuera de marca </label>  </div>  <div class='form-check text-secondary'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>   Mobiliario </label>  </div> </div></div></div>" ;
                   
                break;
                case "6":
                    document.getElementById("contenido").innerHTML = "<div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'> Limpieza  </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>   Alfombra  </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>   Detalles por terminar  </label>  </div> <div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'>   Esconder pared posterior  </label>  </div> " ;
                       
                    break;
                    case "7":
                    document.getElementById("contenido").innerHTML ="<div class='form-check'> <input class='form-check-input' type='radio'  name='exampleRadios' id='exampleRadios1' value='option1' checked> <label class='form-check-label text-secondary text-xs' for='exampleRadios1'> Otra  </label>  </div> ";
                    break;
}
}

function cambiarcolor() {
 
    var color = document.getElementById("proceso").value;
    switch(color){
        case "0": 
        document.getElementById("proceso").className = "form-control form-control-sm bg-danger";
                break;

                case "1": 
                document.getElementById("proceso").className = "form-control form-control-sm bg-warning";
                break;

                case "2": 
                document.getElementById("proceso").className = "form-control form-control-sm bg-success";
                break;
}
}

function guardar() {


const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-outline-success ml-4',
      cancelButton: 'btn btn-outline-danger'
    },
    buttonsStyling: false
  })
  
  swalWithBootstrapButtons.fire({
    title: 'Estas seguro?',
    text: "Elige una opción",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si!',
    cancelButtonText: 'No',
    reverseButtons: true
  }).then((result) => {
    if (result.value) {
      swalWithBootstrapButtons.fire(
        'Guardado!',
        'Haz creado una incidencia',
        'success'
      )
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Cancelado',
        ' :(',
        'error'
      )
    }
  })
}