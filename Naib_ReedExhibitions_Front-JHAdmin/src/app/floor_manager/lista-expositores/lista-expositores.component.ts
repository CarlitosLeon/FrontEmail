import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { listaExpositoresService } from './lista-expositores.service';
import { AuthService } from 'src/app/users/service/auth.service';
import { HttpEventType } from '@angular/common/http';
import { StandReferencia } from '../../models/StandReferencia';
import { timer, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { IncidenciaService } from 'src/app/menu-fm/service/incidencia.service';
import { DetalleFM } from 'src/app/models/DetalleFM';
import { User } from 'src/app/users/models/user';
import { AsignacionFMEvento } from 'src/app/models/AsignacionFMEvento';
import { Zona } from 'src/app/models/Zona';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { BlockScrollStrategy } from '@angular/cdk/overlay';
declare var $: any;

@Component({
  selector: 'app-lista-expositores',
  templateUrl: './lista-expositores.component.html',
  styleUrls: ['./lista-expositores.component.css']
})
export class ListaExpositoresComponent implements OnInit {

  public listaStand: StandReferencia[]=[];
  public activeUser;
  public totalExpositores: number;

  public listaFm: DetalleFM[] = [];
  public zonaUsuario: number = 0;

  public totalFm;
  public timerBuscador: number = 0;
  public cargando: boolean = true;
  public isEmpty:boolean;

  private listaEstatusStand: Array<string> = [];
  private listaIdStand: Array<string> = [];
  private TimeEstatusStand: number = 0;
  private lastIdStandSelected;
  private listaMisExpositores: StandReferencia[] = [];
  private listaExpositoresUser: StandReferencia[] = [];
  private listaTotalExpositores: StandReferencia[] = [];
  private diasEvento: Array<{ fecha: string, noDia: string }> = [];
  private fechaHoy: string;
  private horaActual: string;

  constructor(private listaExpositorService: listaExpositoresService, private authService: AuthService, private ruta: Router, private menu: IncidenciaService) { }


  ngOnInit(): void {
    // this.buttonDetailsAnimation();
    this.getListaExpositores(this.authService.user.id);
    this.activeUser = this.authService.user.id;
    this.menu.setNombrePantalla("LISTA DE EXPOSITORES");
    let now = new Date();
    this.fechaHoy = formatDate(now, 'dd/MM/yyyy', 'en-US');
    this.fechaHoy = '11/05/2020';
    this.horaActual = formatDate(now, 'HH', 'en-US');
  }

  ///////////////////////////////////////////CAMBIAR METODO
  private getListaExpositores(idUsuario: number): void {
    this.listaExpositorService.getListaExpositores(idUsuario).subscribe(
      Respuesta => {
        if (Respuesta.type === HttpEventType.Response) {
          let response: any = Respuesta.body;
          this.listaTotalExpositores = response.listaExpositores;
          if (this.listaTotalExpositores.length == 0) {
            this.isEmpty=true;
          } else {
            let before: number = 0;
            if (response.usersByEvento.length == 0) {
              Swal.fire('Detalles de ingreso', 'No se han asignado floor managers al evento', 'error')
            } else {
              response.usersByEvento.forEach(element => {
                let workToday = false;
                element.horarios.forEach(horario => {
                  workToday = this.validateTurno(horario.entrada, horario.salida);
                });
                if (element.detalleUsuario.usuario.id == this.activeUser) {
                  if (workToday) {
                    this.zonaUsuario = element.zona.id;
                  } else {
                    Swal.fire('Detalles de ingreso', 'Su turno aún no ha comenzado ', 'warning')
                  }
                }
                if (before != element.zona.id) {
                  if (workToday) this.listaFm.push(element);
                }
                before = element.zona.id;

              });
            }
            this.totalFm = this.listaFm.length;
            ///////////CLEAN LIST EXPO
            this.listaTotalExpositores.forEach(element => {
              element.usuarios = [];
              if (element.asignacionEvento.length != 0) {
                element.asignacionEvento = element.asignacionEvento[0];
              } else {
                element.asignacionEvento = new AsignacionFMEvento();
              }
              response.usersByEvento.forEach(detalleFM => {
                let workToday: boolean;
                if (detalleFM.zona.id == element.asignacionEvento.asignacionZona.id) {
                  detalleFM.horarios.forEach(horario => {
                    workToday = this.validateTurno(horario.entrada, horario.salida)
                  });
                  if (workToday) {
                    let nuevo = new User();
                    nuevo.nombre = detalleFM.detalleUsuario.usuario.nombre;
                    nuevo.aPaterno = detalleFM.detalleUsuario.usuario.aPaterno;
                    nuevo.id = detalleFM.detalleUsuario.usuario.id;
                    element.usuarios.push(nuevo);
                  }
                }
              });
              if (this.zonaUsuario == element.asignacionEvento.asignacionZona.id) {
                this.listaMisExpositores.push(element);
              }
            });

            ///////////INIT LIST EXPO
            if (this.zonaUsuario != 0) {
              this.totalExpositores = this.listaMisExpositores.length;
              this.listaStand = this.listaMisExpositores;
            } else {
              this.totalExpositores = this.listaTotalExpositores.length;
              this.listaStand = this.listaTotalExpositores;
            }
          }
        }
      }
    )
    this.cargando = false;
  }


  private validateTurno(entrada: string, salida: string): boolean {
    let res: boolean;
    let fEntrada: string = formatDate(entrada, 'dd/MM/yyyy', 'en-US');
    let hEntrada = parseInt(formatDate(entrada, 'HH', 'en-US'));
    let fSalida: string = formatDate(salida, 'dd/MM/yyyy', 'en-US');
    let hSalida = parseInt(formatDate(salida, 'HH', 'en-US'));
    if (fEntrada === this.fechaHoy) {
      if (parseInt(this.horaActual) >= hEntrada) res = true;
    } else if (fSalida === this.fechaHoy) {
      if (parseInt(this.horaActual) < hSalida) res = true;
    }
    return res;
  }

  ///////////////////////////////////////////CAMBIAR METODO
  public FiltroExpositores(): void {
    var seleccionado = $('select[id=filtroListaExpositor]').val();
    if (parseInt(seleccionado) == 0) {
      this.totalExpositores = this.listaTotalExpositores.length;
      this.listaStand = this.listaTotalExpositores;

    } else if (parseInt(seleccionado) == 1) {
      this.totalExpositores = this.listaMisExpositores.length;
      this.listaStand = this.listaMisExpositores;

    } else if (parseInt(seleccionado) == 2) {
      this.listaExpositoresUser = [];
      this.listaTotalExpositores.forEach(element => {
        if (element.asignacionEvento.length != 0) {
          if (parseInt(seleccionado.split("-")[1]) == element.asignacionEvento.asignacionZona.id) {
            this.listaExpositoresUser.push(element);
          }
        }
      });
      this.totalExpositores = this.listaExpositoresUser.length;
      this.listaStand = this.listaExpositoresUser;
    }
  }



  actualizarEstadoStand(id: string) {
    var seleccionado = $('#Boton-' + id).val();
    var status: string;
    this.TimeEstatusStand = this.TimeEstatusStand + 1;
    var time = timer(4000);

    if (seleccionado == "Trazado") {
      $("#Boton-" + id).html("<i class='fas fa-tags'></i> Etiquetado");
      $("#Boton-" + id).removeClass("btn-outline-dark");
      $("#Boton-" + id).addClass("btn-outline-warning");
      $("#Boton-" + id).val("Etiquetado");
      status = "1";

    } else if (seleccionado == "Etiquetado") {
      $("#Boton-" + id).html("<i class='fas fa-eye'></i> Detalle");
      $("#Boton-" + id).removeClass("btn-outline-warning");
      $("#Boton-" + id).addClass("btn-outline-primary");
      $("#Boton-" + id).val("Detalle");
      status = "2";

    } else if (seleccionado == "Detalle") {
      this.listaExpositorService.updateStatusStand(this.listaIdStand, this.listaEstatusStand).subscribe(
        Respuesta => {
          this.ruta.navigate(['/detalleExpositor/', id])
        }
      );
    }

    let hasResult = 0;
    if (id == this.lastIdStandSelected) {
      this.listaEstatusStand.pop();
      this.listaIdStand.pop();
      this.lastIdStandSelected = parseInt(id);
      this.listaEstatusStand.push(status);
      this.listaIdStand.push(id);
      hasResult = 1;
    } else {
      let contador = 0;
      this.listaEstatusStand.forEach(element => {
        if (parseInt(id) == parseInt(this.listaIdStand[contador])) {
          element = status;
          hasResult = 1;
        }
        contador = contador + 1;
      });
    }
    if (hasResult == 0) {
      this.listaEstatusStand.push(status);
      this.listaIdStand.push(id);
    }

    time.subscribe((n) => {
      if (n == 0) {
        this.TimeEstatusStand = this.TimeEstatusStand - 1;
        if (this.TimeEstatusStand == 0) {
          this.TimeEstatusStand = 1;
          this.listaExpositorService.updateStatusStand(this.listaIdStand, this.listaEstatusStand).subscribe(
            Respuesta => {
              this.TimeEstatusStand = 0;
              if (Respuesta.type === HttpEventType.Response) {
                this.TimeEstatusStand = 0;
                this.listaIdStand = [];
                this.listaEstatusStand = [];
              }
            }
          );
        }
      }
    })

    this.lastIdStandSelected = parseInt(id);
  }


  public terminoBusqueda;

  buscador(event): void {
    this.timerBuscador = this.timerBuscador + 1;
    this.listaStand = [];
    let termino = event.target.value;
    this.terminoBusqueda = termino;
    var time = timer(500);
    time.subscribe((n) => {
      if (n == 0) {
        this.timerBuscador = this.timerBuscador - 1;
        if (this.timerBuscador == 0) {

        }
      }
    });

    if (termino == "") {
      this.FiltroExpositores();
    } else {
      this.listaTotalExpositores.forEach(element => {
        if (element.componente.numeroStand.toString().toLowerCase().startsWith(termino.toLowerCase()) || element.expositor.nombre_comercial.toLowerCase().startsWith(termino.toLowerCase())) {
          this.listaStand.push(element);
        }
      })
    }
  }



  selected = 'option2';

  cambiarColorBarra(porcentaje): string {
    let colorBarra = "red;";
    //rojo
    if (porcentaje < 30) {
      if (porcentaje > 20) {
        colorBarra = "rgb(213," + (porcentaje - 20) * 22 + ",18);";
      } else {
        colorBarra = "#D53512;";
      }
    } else if (porcentaje >= 30 && porcentaje < 70) {
      ///amarillo
      if (porcentaje > 60) {
        colorBarra = "rgb(" + (213 - ((porcentaje - 60) * 22)) + "," + (198 - ((porcentaje - 60) * 3)) + ",18);"
      } else {
        colorBarra = "rgb(213,198,18);";
      }
    }
    else if (porcentaje >= 70 && porcentaje <= 99) {
      ///verde
      if (porcentaje > 91) {
        colorBarra = "rgb(15," + (171 - ((porcentaje - 90) * 8)) + "," + (porcentaje - 90) * 23 + ");"
      } else {
        colorBarra = "rgb(15,171,18);";
      }
    } else {
      ///azul
      colorBarra = "#0F64D5;";
    }
    return colorBarra;
  }

  // private buttonDetailsAnimation(): void {
  //   let body = <HTMLDivElement>document.body;
  //   let script = document.createElement('script');
  //   script.innerHTML = '';
  //   script.src = '../../../assets/scripts/lista-expositores.js';
  //   script.async = true;
  //   script.defer = true;
  //   body.appendChild(script);
  // }
  public getDaysInEvento(diaInicio: string, diaFin: string, mesInicio: string, anio: string) {
    this.diasEvento = [];
    for (let i = parseInt(diaInicio); i <= parseInt(diaFin); i++) {
      let intermedio = new Date(parseInt(anio), parseInt(mesInicio) - 1, i);
      let fecha = i + '-' + mesInicio + '-' + anio;
      this.diasEvento.push({
        'fecha': fecha,
        'noDia': i.toString()
      });
    }
  }
}
