import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IncidenciaService } from 'src/app/menu-fm/service/incidencia.service';
import { AuthService } from 'src/app/users/service/auth.service';
import { HorariosFmService } from 'src/app/adminFM/horarios-fm/horarios-fm.component.service';
import Swal from 'sweetalert2';
import { HorarioFM } from 'src/app/models/HorarioFM';
import { DatePipe } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-horarios-fm',
  templateUrl: './horarios-fm.component.html',
  styleUrls: ['./horarios-fm.component.css']
})
export class HorariosFmComponent implements OnInit {

  // A C T I V E   F I L T R O S
  public activeBtn: Date;
  // F I L T R O S
  public fechas: Array<HorarioFM> = [];
  public fechaP: any;
  public fechasFiltradas: Array<Date> = [];
  // T A B L A
  public resultadosHorarios: any = [];
  public resultadosHorariosFilter: any = [];
  // F E C H A S   E N   T A B L A S
  public xs1: any;
  public xs2: any;
  // M O D A L
  public nombre: any;
  //          Contadores
  public numIncidenciasTotales: number = 0;
  public numIncidenciasTerminadas: number = 0;
  public numIncidenciasProceso: number = 0;
  public numIncidenciasNoIniciadas: number = 0;
  //        Tablas categorias
  public arrCategoriasTerminadas: Array<any> = [];
  public arrCategoriasProceso: Array<any> = [];
  public arrCategoriasNoIniciadas: Array<any> = [];
  // Tablas contadores "CATEGORIAS"
  public countCategoriasTerminadas: Array<any> = [];
  public countCategoriasProceso: Array<any> = [];
  public countCategoriasNoIniciadas: Array<any> = [];
  // Tablas contadores "NUMEROS"
  public countTerminadasNumero = {};
  public countProcesoNumero = {};
  public countNoIniciadasNumero = {};
  //          Primeros datos modal
  public tel: any;
  public equipo: any;
  public detallesEquipo: any;
  // L O A D I N G
  loadingInci: boolean = false;

  public counts: Array<any> = [];

  constructor(private datePipe: DatePipe, private menu: IncidenciaService, private horariosService: HorariosFmService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.menu.setNombrePantalla("MIS FLOOR MANAGERS");
    this.getHorariosFM();
  }

  getHorariosFM() {
    this.horariosService.getHorariosFMService(this.authService.event.id).subscribe((result) => {
      console.log(result);
      if (result.length == 0) {
        return this.fechas = null;
      }
      this.fechas = result;

      this.fechaP = this.datePipe.transform(this.fechas[0].entrada, "yyyy-MM-dd");
      this.fechasFiltradas.push(this.fechaP);
      this.activeBtn = this.fechasFiltradas[0];

      for (let i = 1; i < this.fechas.length; i++) {
        this.fechaP = this.datePipe.transform(this.fechas[i].entrada, "yyyy-MM-dd");
        if (this.fechasFiltradas.indexOf(this.fechaP) === -1) {
          this.fechasFiltradas.push(this.fechaP);
        }
      }
      this.getResultadosHorario();
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  getResultadosHorario() {
    this.horariosService.getHorariosResultadosService(this.authService.event.id).subscribe((result) => {
      if (result.values == null) {
        return this.resultadosHorarios = null;
      }
      this.resultadosHorarios = result;
      this.buscarFM(this.activeBtn);
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  buscarFM(d) {
    this.activeBtn = d;
    this.resultadosHorariosFilter.length = 0;
    for (var i = 0; i < this.resultadosHorarios.length; i++) {
      for (var a = 0; a < this.resultadosHorarios[i].horarios.length; a++) {
        if (this.datePipe.transform(this.resultadosHorarios[i].horarios[a].entrada, "yyyy-MM-dd") === d) {
          this.resultadosHorariosFilter.push(this.resultadosHorarios[i]);
        }
      }
    }
  }

  bH1(i, d): Date {
    for (var a = 0; a < this.resultadosHorariosFilter[i].horarios.length; a++) {
      this.xs1 = this.datePipe.transform(this.resultadosHorariosFilter[i].horarios[a].entrada, "yyyy-MM-dd");
      if (this.xs1 == d) {
        return this.resultadosHorariosFilter[i].horarios[a].entrada;
      }
    }
  }

  bH2(i, d): Date {
    for (var a = 0; a < this.resultadosHorariosFilter[i].horarios.length; a++) {
      this.xs2 = this.datePipe.transform(this.resultadosHorariosFilter[i].horarios[a].entrada, "yyyy-MM-dd");
      if (this.xs2 == d) {
        this.xs2 = this.resultadosHorariosFilter[i].horarios[a].salida;
        return this.xs2;
      }
    }
  }

  modalActividades(res) {
    this.loadingInci = true;
    for (var a = 0; a < this.resultadosHorarios.length; a++) {
      if (this.resultadosHorarios[a].detalleUsuario.usuario.id === res) {
        res = a;
      }
    }
    this.nombre = this.resultadosHorarios[res].detalleUsuario.usuario.nombre + " " + this.resultadosHorarios[res].detalleUsuario.usuario.aPaterno + " (" + this.resultadosHorarios[res].zona.nombre + ")";
    this.tel = this.resultadosHorarios[res].detalleUsuario.usuario.telefono;
    this.equipo = this.resultadosHorarios[res].equipo;
    this.detallesEquipo = this.resultadosHorarios[res].detalle;
    this.getIncidencias(this.resultadosHorarios[res].detalleUsuario.usuario.id);
  }

  getIncidencias(res) {
    this.horariosService.getIncidenciasService(res).subscribe((result) => {
      this.limpiarContadores();
      this.numIncidenciasTotales = result.Count;
      result.Todas.forEach(element => {
        if (element.status == "0") {
          this.numIncidenciasNoIniciadas = this.numIncidenciasNoIniciadas + 1;
          if (this.arrCategoriasNoIniciadas.length > 0) {
            if (this.arrCategoriasNoIniciadas.indexOf(element.categoria) === -1) {
              this.arrCategoriasNoIniciadas.push(element.categoria);
              this.countCategoriasNoIniciadas.push(element.categoria);
            } else {
              this.countCategoriasNoIniciadas.push(element.categoria);
            }
          } else {
            this.arrCategoriasNoIniciadas.push(element.categoria);
            this.countCategoriasNoIniciadas.push(element.categoria);
          }
        } else if (element.status == "1") {
          this.numIncidenciasProceso = this.numIncidenciasProceso + 1;
          if (this.arrCategoriasProceso.length > 0) {
            if (this.arrCategoriasProceso.indexOf(element.categoria) === -1) {
              this.arrCategoriasProceso.push(element.categoria);
              this.countCategoriasProceso.push(element.categoria);
            } else {
              this.countCategoriasProceso.push(element.categoria);
            }
          } else {
            this.arrCategoriasProceso.push(element.categoria);
            this.countCategoriasProceso.push(element.categoria);
          }
        } else if (element.status == "2") {
          this.numIncidenciasTerminadas = this.numIncidenciasTerminadas + 1;
          if (this.arrCategoriasTerminadas.length > 0) {
            if (this.arrCategoriasTerminadas.indexOf(element.categoria) === -1) {
              this.arrCategoriasTerminadas.push(element.categoria);
              this.countCategoriasTerminadas.push(element.categoria);
            } else {
              this.countCategoriasTerminadas.push(element.categoria);
            }
          } else {
            this.arrCategoriasTerminadas.push(element.categoria);
            this.countCategoriasTerminadas.push(element.categoria);
          }
        }

      });
      for (var i = 0; i < this.countCategoriasNoIniciadas.length; i++) {
        if (!(this.countCategoriasNoIniciadas[i] in this.countNoIniciadasNumero)) this.countNoIniciadasNumero[this.countCategoriasNoIniciadas[i]] = 0;
        this.countNoIniciadasNumero[this.countCategoriasNoIniciadas[i]]++;
      }
      for (var i = 0; i < this.countCategoriasProceso.length; i++) {
        if (!(this.countCategoriasProceso[i] in this.countProcesoNumero)) this.countProcesoNumero[this.countCategoriasProceso[i]] = 0;
        this.countProcesoNumero[this.countCategoriasProceso[i]]++;
      }
      for (var i = 0; i < this.countCategoriasTerminadas.length; i++) {
        if (!(this.countCategoriasTerminadas[i] in this.countTerminadasNumero)) this.countTerminadasNumero[this.countCategoriasTerminadas[i]] = 0;
        this.countTerminadasNumero[this.countCategoriasTerminadas[i]]++;
      }


      this.loadingInci = false;
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  limpiarContadores() {
    this.numIncidenciasTotales = 0;
    this.numIncidenciasNoIniciadas = 0;
    this.numIncidenciasProceso = 0;
    this.numIncidenciasTerminadas = 0;
    this.arrCategoriasNoIniciadas.length = 0;
    this.arrCategoriasProceso.length = 0;
    this.arrCategoriasTerminadas.length = 0;
    this.countNoIniciadasNumero = {};
    this.countProcesoNumero = {};
    this.countTerminadasNumero = {};
    this.countCategoriasNoIniciadas.length = 0;
    this.countCategoriasProceso.length = 0;
    this.countCategoriasTerminadas.length = 0;
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

}
