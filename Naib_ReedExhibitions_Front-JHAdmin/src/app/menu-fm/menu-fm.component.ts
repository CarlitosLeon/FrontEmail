import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/users/service/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/users/models/user';
import { Incidencia } from '../models/Incidencia';
import Swal from 'sweetalert2';
import { Salon } from '../models/salon';
import $ from 'jquery';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { IncidenciaService } from './service/incidencia.service';
import { EventoVendedor } from '../users/models/EventoVendedor';
declare const App:any; 

@Component({
  selector: 'app-menu-fm',
  templateUrl: './menu-fm.component.html',
  styleUrls: ['./menu-fm.component.css']

})
export class MenuFMComponent implements OnInit {

  public incidencia: Incidencia = new Incidencia();
  public salon: Salon = new Salon();
  public sub: string;
  public actual: string = "1";
  private fotoEvidencia: File;
  private emptyFile: File;
  public ShowFoto: any;
  salonE: Array<Salon> = new Array<Salon>();
  public nombrePantalla;
  public opened:boolean;
  public vR: string = "";
  public idEventoSeleccionado: number;
  public form: any;
  public selectSalonInci: number = 0;
  eventoEV: Array<EventoVendedor> = new Array<EventoVendedor>();


  constructor(private authService: AuthService, private router: Router, private spinner: NgxSpinnerService, private incidenciaService: IncidenciaService, private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      telefonoReporta: ['', Validators.required],
      categoria: ['', Validators.required],
      status: ['', Validators.required],
      subcategoria: ['', Validators.required],
      reporta: ['', Validators.required],
      nombreReporta: ['', Validators.required],
      seguimiento: ['', Validators.required],
      empresaSeguimiento: ['', Validators.required],
      nombreSeguimiento: ['', Validators.required],
      descripcion: ['', Validators.required],
      eventoSeleccionado: ['', Validators.required]
    });
    this.classMenu();
  }
  dataUser: User;

  ngOnInit(): void {
    this.vR = this.authService.user.rol;
    this.incidencia = new Incidencia();
    this.dataUser = this.authService.user;
    this.nombrePantalla = this.incidenciaService.nombrePantalla;
    App.initAdminLTE(); 
  }

  openSideBar():void{
    this.opened = this.opened ?  false : true;
    this.incidenciaService.sideBarExpositoresMapa.emit(this.opened);
  }

 
  create(f: NgForm) {

    this.incidencia.status = f.value.status;
    this.incidencia.categoria = f.value.categoriaRadios;
    this.incidencia.subcategoria = f.value.subcategoria;
    this.incidencia.reporta = f.value.reporta;
    this.incidencia.nombreReporta = f.value.nombreReporta;
    this.incidencia.telefonoReporta = f.value.telefonoReporta;
    this.incidencia.seguimiento = f.value.seguimiento;
    this.incidencia.empresaSeguimiento = f.value.empresaSeguimiento;
    this.incidencia.nombreSeguimiento = f.value.nombreSeguimiento;
    this.incidencia.descripcion = f.value.descripcion;
    this.incidencia.salon = this.selectSalonInci;

    if (this.incidencia.status == "5") {
      this.incidencia.status = "0";
    }

    this.incidenciaService.create(this.incidencia).subscribe(Incidencia => {
      var x = document.getElementById("1mod");
      x.click();
      Swal.fire('Nueva incidencia creada', `Número de ticket: ${Incidencia.Incidencia.ticket}`, 'success');
      f.resetForm();
      this.selectSalonInci = 0;
      if (this.fotoEvidencia != this.emptyFile) {
        document.getElementById("btnClearImg").style.display = 'none';
        document.getElementById("btnIncidenciaGH").style.display = 'block';
        this.incidenciaService.uploadFoto(this.fotoEvidencia, Incidencia.Incidencia.ticket).subscribe(Resp => {
          this.fotoEvidencia = this.emptyFile;
        }, error => {
          this.errorHTTP(error.status);
        })
      }

    }, error => {
      this.errorHTTP(error.status);
    }
    );
  }

  seleccionarFoto(event) {
    this.fotoEvidencia = event.target.files[0];
    if (this.fotoEvidencia.type.indexOf('image') < 0) {
      Swal.fire('Error', 'Debe de seleccionar una foto', 'error');
      this.fotoEvidencia = this.emptyFile;
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(this.fotoEvidencia);
      reader.onload = (e) => {
        this.ShowFoto = reader.result;

        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success ml-1',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
          title: '¿Subir evidencia?',
          html: '<img src="' + this.ShowFoto + '" style="width: 300px;">',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            document.getElementById("btnClearImg").style.display = 'block';
            $('#btnIncidenciaGH').attr("disabled", true);
            $('#imgIncidenciaGH').attr("disabled", true);
            Swal.fire(
              '¡Evidencia agregada!',
              '',
              'success'
            )
          } else {
            this.fotoEvidencia = this.emptyFile;
            $("#imgIncidenciaGH").val("");
          }
        })
      }
    }
  }


  borrarImgInciG() {
    $("#imgIncidenciaGH").val("");
    this.fotoEvidencia = this.emptyFile;
    document.getElementById("btnClearImg").style.display = 'none';
    $('#btnIncidenciaGH').attr("disabled", false);
    $('#imgIncidenciaGH').attr("disabled", false);
  }

  abrirModal(f: NgForm) {
    f.resetForm();
    this.selectSalonInci = 0;
    this.incidencia = new Incidencia();
    document.getElementById(this.actual).style.display = 'none';
    document.getElementById("contenido").style.display = 'none';
    this.getSalones();
    $("#imgIncidenciaGH").val("");
    this.fotoEvidencia = this.emptyFile;
    document.getElementById("btnClearImg").style.display = 'none';
  }

  mostrarIncidentes(res) {
    document.getElementById("contenido").style.display = 'block';
    document.getElementById(this.actual).style.display = 'none';
    document.getElementById(res).style.display = 'block';
    this.actual = res;
  }

  limpiarForm() {
    document.getElementById(this.actual).style.display = 'none';
    this.incidencia = new Incidencia();
  }

  getSalones() {
    this.incidenciaService.getSalonEvento(this.authService.event.id).subscribe((h) => {
      if (h.values == null) {
        return this.salonE = null;
      }
      this.salonE = h;
      this.incidencia.salon = null;
    }, error => {
      this.errorHTTP(error.status);
    })
  }
  
  getSalonesVendedor() {
    this.authService.userEventoVendedor().subscribe((h) => {
      if (h.values == null) {
        return this.eventoEV = null;
      }
      this.eventoEV = h;
      console.log(this.eventoEV);
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  mandarValor(f: NgForm) {
    this.idEventoSeleccionado = f.value.eventoSeleccionado;
    this.incidenciaService.getIdEvento(this.idEventoSeleccionado);
  }

  logout() {
    this.spinner.show();
    this.authService.logout();
    this.router.navigate(['/']);
    this.spinner.hide();
  }

  //ErrorHTTP
  errorHTTP(status: number) {
    if (status == 401) {
      this.authService.logout();
      this.router.navigate(['/']);
    } else if (status == 500) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success btn-sm'
        },
        buttonsStyling: false
      })
      Swal.fire({
        customClass: {
          confirmButton: 'btn btn-info btn-sm'
        },
        title: "Server Error.",
        buttonsStyling: false,
        html: "<img src='./assets/img_project/excepciones/error500.jpg' class='img-fluid' alt='Server Error'>",
        confirmButtonText: 'Entiendo'
      })
    } else if (status == 0) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success btn-sm'
        },
        buttonsStyling: false
      })
      Swal.fire({
        customClass: {
          confirmButton: 'btn btn-info btn-sm'
        },
        title: "",
        buttonsStyling: false,
        html: "<img src='./assets/img_project/excepciones/errorConexion.jpg' class='img-fluid' alt='Error de conexion'>",
        confirmButtonText: 'Entiendo'
      })
    }
  }

  classMenu() {
    document.body.style.background = '#f4f6f9';
    document.body.classList.add('hold-transition');
    document.body.classList.add('sidebar-mini');
    document.body.classList.add('layout-navbar-fixed');
    document.body.classList.add('layout-fixed');
    document.body.classList.add('sidebar-closed');
    document.body.classList.add('sidebar-collapse');
  }

}
