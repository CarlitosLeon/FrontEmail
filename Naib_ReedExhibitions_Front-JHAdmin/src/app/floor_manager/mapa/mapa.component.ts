import { TipoServicio } from '../../models/TipoServicio';
import { Servicio } from '../../models/Servicio';
import { Incidencia } from '../../models/Incidencia';
import { IncidenciaReferenciada } from '../../models/IncidenciaReferenciada';
import { StandReferencia } from '../../models/StandReferencia';
import { MapaService } from './mapa.service';
import { Componente } from '../../models/Componente';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { listaExpositoresService } from '../lista-expositores/lista-expositores.service';
import { AuthService } from 'src/app/users/service/auth.service';
import { HttpEventType } from '@angular/common/http';
import { timer, Observable } from 'rxjs';
import { EventEmitter, element } from 'protractor';
import { parse } from 'path';
import { DetalleUsuario } from '../../models/DetalleUsuario';
import { Router } from '@angular/router';
import 'fabric';
import { IncidenciaService } from 'src/app/menu-fm/service/incidencia.service';
declare let fabric;
declare var $: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit, OnDestroy {

  public sidebar:boolean = false;
  opened:boolean;

  public listaStand: StandReferencia[];
  public activeUser;
  public totalExpositores: number;
  public listaFm: DetalleUsuario[];
  public totalFm;
  public timerBuscador: number = 0;

  private listaEstatusStand: Array<string> = [];
  private listaIdStand: Array<string> = [];
  private TimeEstatusStand: number = 0;
  private lastIdStandSelected;
  private listaMisExpositores: StandReferencia[] = [];
  private listaExpositoresUser: StandReferencia[] = [];
  private listaTotalExpositores: StandReferencia[] = [];
  public standReferencia: StandReferencia;
  public incidencias: Incidencia[] = [];
  public incidenciaReferenciada: IncidenciaReferenciada;
  public incidenciaReferenciadas: IncidenciaReferenciada[] = [];
  public incidenciasR: Incidencia[] = [];
  public incidenciasA: Incidencia[] = [];
  public incidenciasV: Incidencia[] = [];
  public servicios: Servicio[] = [];
  public tipoServicio: TipoServicio;
  public numIncR: number;
  public numIncA: number;
  public numIncV: number;

  public serviciosContratados: Servicio[] = [];

  private canvas;
  private rectangulo;
  private text;
  private img;
  public stands: Componente[];
  public objComponente: Componente;
  public numbers;

  constructor(
    private listaExpositorService: listaExpositoresService,
    private authService: AuthService, private ruta: Router,
    private menu: IncidenciaService,
    public restApi: MapaService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.canvas = new fabric.Canvas('canvas', {
    });
    this.menu.setNombrePantalla('MAPA');
    this.activeUser = this.authService.user.id;
    this.getListaExpositores(this.authService.user.id);
    this.sidebarAM();
  }

  sidebarAM(){
    this.menu.sideBarExpositoresMapa.subscribe(evento=>{
      this.opened=evento;
    });
  }

  ngOnDestroy() {
    if(this.sidebar){
      $("#btnsidebar").ControlSidebar('toggle');
    }
    
  }


  private getListaExpositores(idUsuario: number): void {
    this.listaExpositorService.getListaExpositores(idUsuario).subscribe(
      Respuesta => {
        if (Respuesta.type === HttpEventType.Response) {
          const response: any = Respuesta.body;
          this.listaTotalExpositores = response.listaExpositores;
          this.listaFm = response.usersByEvento;
          this.totalFm = this.listaFm.length;

          response.listaExpositores.forEach(element => {
            this.listaMisExpositores.push(element);
            const cantidadIncidencias = element.incidencias.length;
            let grosor = 1;
            let colorLine = '#000000';
            if (cantidadIncidencias > 0) {
              let statusIncidencia = '';
              let danger = false;
              let warning = false;
              let info = false;
              let image = '';
              element.incidencias.forEach(element => {
                statusIncidencia = element.incidencia.status;
                if (statusIncidencia === '0') {
                  danger = true;
                } else if (statusIncidencia === '1') {
                  warning = true;
                } else if (statusIncidencia === '2') {
                  info = true;
                }

              });
              if (danger) {
                image =  './assets/img_project/16R.svg';
                colorLine = 'red';
              } else if (warning) {
                image =  './assets/img_project/16A.svg';
                colorLine = 'yellow';
              }
              //  else if (info) {
              //   image = 'http://localhost:8090/img/16A.svg';
              //   colorLine = 'blue';
              // }
              grosor = 3;

              fabric.Image.fromURL(image, (img) => {
                this.img = img.set({
                  left: Number(element.componente.pleft.trim()) + Number(element.componente.width.trim()) - 18,
                  top: Number(element.componente.ptop.trim()) + Number(element.componente.height.trim()) - 18,
                  width: 20,
                  height: 20,
                  hasControls: false,
                  lockMovementX: true,
                  lockMovementY: true,
                  selectable: false
                  // opacity: 0.5,
                  // scaleX: this.canvas.width/img.width,
                  // scaleY: this.canvas.height/img.height
                  ,
                });
                this.canvas.add(this.img);
              });
            }

            this.rectangulo = new fabric.Rect({
              top: Number(element.componente.ptop.trim()),
              left: Number(element.componente.pleft.trim()),
              width: Number(element.componente.width.trim()),
              height: Number(element.componente.height.trim()),
              fill: this.getColorStand(element.status.trim(), Number(element.porcentajeArmado.trim())),
              stroke: colorLine,
              strokeWidth: grosor,
              hasControls: false,
              lockMovementX: true,
              lockMovementY: true,
              selectable: false
            });

            this.canvas.add(this.rectangulo);

            this.text = new fabric.Text(element.componente.numeroStand+'', {
              fontFamily: 'Seoge UI Emoji',
              left: this.rectangulo.left + 1,
              top: this.rectangulo.top,
              fill: 'black',
              hasControls: false,
              lockMovementX: true,
              lockMovementY: true,
              selectable: false,
              fontSize: 12,
              fontWeight: 'bold',
              // lockScalingX: true,
              // lockScalingY: true,
              // font: '2px Arial',
              fillStyle: '#000000'
            });
            this.canvas.add(this.text);
          });

          this.totalExpositores = this.listaMisExpositores.length;
          this.listaStand = this.listaMisExpositores;

        }
      }
    );
  }


  getColorStand(status, porcentaje): string {

    let color = '#f7f7f7';

    // estatus
    if (status === '0' && porcentaje === 0) {//nada
      color = '#f7f7f7';
    } else if (status === '1' && porcentaje === 0) {//trazado
      color = '#006766';
    } else if (status === '2' && porcentaje === 0) {//etiquetado
      color = '#85c6c3';
    } else {
      //rojo
      if (porcentaje < 30) {
        if (porcentaje > 20) {
          color = "rgb(213," + (porcentaje - 20) * 22 + ",18)";
        } else {
          color = "#D53512";
        }
      } else if (porcentaje >= 30 && porcentaje < 70) {
        // amarillo
        if (porcentaje > 60) {
          color = "rgb(" + (213 - ((porcentaje - 60) * 22)) + "," + (198 - ((porcentaje - 60) * 3)) + ",18)"
        } else {
          color = "rgb(213,198,18)";
        }
      }
      else if (porcentaje >= 70 && porcentaje <= 99) {
        // verde
        if (porcentaje > 91) {
          color = "rgb(15," + (171 - ((porcentaje - 90) * 8)) + "," + (porcentaje - 90) * 23 + ")"
        } else {
          color = "rgb(15,171,18)";
        }
      } else {
        // azul
        color = "#0F64D5";
      }
      // if (porcentaje > 0 && porcentaje <= 20) {// rojo
      //   color = '#D53512';
      // } else if (porcentaje > 20 && porcentaje <= 40) {// amarillo
      //   color = 'rgb(213,198,18)';
      // } else if (porcentaje > 40 && porcentaje <= 60) {// naranja
      //   color = '#ffb300';
      // } else if (porcentaje > 60 && porcentaje <= 99) {///azul
      //   color = 'rgb(15,171,18)';
      // } else if (porcentaje === 100) {// verde
      //   color = '#0F64D5';
      // }
    }
    return color;
  }


  getInfoExpositor(idExpositor): void {
    this.restApi.getExpositorById(idExpositor).subscribe(
      Respuesta => {
        if (Respuesta.type === HttpEventType.Response) {
          const response: any = Respuesta.body;
          this.standReferencia = response.standReferencia;
          this.incidencias = response.incidencia;
          // this.incidenciaReferenciadas = response.incidencia;
          this.servicios = response.detalleContratoServicios;
          this.numIncR = 0;
          this.numIncA = 0;
          this.numIncV = 0;
          let status = '';
          if (this.incidencias.length > 0) {
            this.incidencias.forEach(element => {
              status = element.status.trim();
              if (Number(status) === 0) {//no iniciada
                this.numIncR = this.numIncR + 1;
              } else if (Number(status) === 1) {//en proceso
                this.numIncA = this.numIncA + 1;
              } else if (Number(status) === 2) {//terminada
                this.numIncV = this.numIncV + 1;
              }
            });
          }
          this.serviciosContratados = [];
          if (this.servicios.length > 0) {
            this.servicios.forEach(element => {
              this.serviciosContratados.push(element.tipoServicio.servicio);
            });
          }
        }
      }
    );
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

    if (termino === '') {
      this.listaStand = this.listaMisExpositores;
    } else {
      this.listaTotalExpositores.forEach(element => {
        if (element.numeroStand.toLowerCase().startsWith(termino.toLowerCase()) || element.expositor.nombre_comercial.toLowerCase().startsWith(termino.toLowerCase())) {
          this.listaStand.push(element);
        }
      });
    }
  }


  buscaExpositor(): void {
    this.timerBuscador = this.timerBuscador + 1;
    this.listaStand = [];
    let termino = this.terminoBusqueda;
    // this.terminoBusqueda=termino;
    // var time = timer(500);
    // time.subscribe((n) => {
    //   if (n == 0) {
    //     this.timerBuscador = this.timerBuscador - 1;
    //     if (this.timerBuscador == 0) {

    //     }
    //   }
    // });

    if (termino === '') {
      // this.FiltroExpositores();
      this.listaStand = this.listaMisExpositores;
    } else {
      this.listaTotalExpositores.forEach(element => {
        if (element.numeroStand.toLowerCase() === termino.toLowerCase() || element.expositor.nombre_comercial.toLowerCase() == termino.toLowerCase()) {
          this.listaStand.push(element);
        }
      });
    }
  }

}
