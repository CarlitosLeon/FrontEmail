import { animate, state, style, transition, trigger } from '@angular/animations';
import { getCurrencySymbol, PercentPipe } from '@angular/common';
import { IfStmt, THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { Component, Directive, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { exception } from 'console';
import { fabric } from 'fabric';
import { Rect } from 'fabric/fabric-impl';
import { NgxSpinnerService } from 'ngx-spinner';
import { element } from 'protractor';
import { config, interval, merge, Subscription, throwError, timer } from 'rxjs';
import { catchError, last } from 'rxjs/operators';
import { IncidenciaService } from 'src/app/menu-fm/service/incidencia.service';
import { ActividadExpositor } from 'src/app/models/ActividadExpositor';
import { CarteraEvento } from 'src/app/models/CarteraEvento';
import { Componente } from 'src/app/models/Componente';
import { Expositor } from 'src/app/models/Expositor';
import { Salon } from 'src/app/models/salon';
import { StandReferencia } from 'src/app/models/StandReferencia';
import { AuthService } from 'src/app/users/service/auth.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { runInNewContext } from 'vm';
import { VentasService } from './ventas.service';
declare var $: any;



var arrayOffStandFromList = [];
var arrayOnStandFromList = [];

/**
 * @GLOBAL_CONF_RECT_CIRCLE_VAR
 * @fontFamily Numbers in Rect-Circle
 * @fontSize Number in Rect-Circle
 * @idObjSelected Object id in Canvas 
 */
var fontFamily = 'sans-serif';
var fontSize = 18;
var backgroundColor = '#FFF';//canvas
//var isElement = false;
var idObjSelected;
var colorVacio = '#FFF';
var colorReserva = '#47BCC9';
var colorEspFirma = '#3AA9FC';
var colorConfirmado = '#58B76A';
var colorApagado = '#AAA9A9';
//var colorEnMovimiento = '#6920F2';
var colorSeleccion = '#FFC200';
var colorStandsPropios = '';
var colorTextoNormal = '#00000';
var grosorMargen = 0.7;
var colorTextoReservaPagado = '#FFF';
//var stroke='';
//var strokeWidth=0;
var lastX = 0;
var lastY = 0;
var currentX = 0;
var currentY = 0;
var isElement = false;

/**
 * 
 * Open modal setting values in their own
 * @param rect: Rect-Circle to get values
 * borderColor means idElementOnCanvas
 */
function openModal(rect) {
  var opc = '';
  if (rect.get('fill') != '') opc = rect.get('fill');
  var modalType = '';
  if (opc != colorVacio) {
    modalType = 'modalMap-Fill';
  } else {
    modalType = 'modalMap-Empty';
  }
  $("#" + modalType).modal("show");
}

function openModalSideList() {
  $('#modalList').modal("show");
}
function hideModalSideList() {
  $('#modalList').modal("hide");
}

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
})
export class VentasComponent implements OnInit {
  constructor(private menu: IncidenciaService, private storage: AuthService, private service: VentasService, private spinner: NgxSpinnerService, private router: Router) {
    document.body.classList.add('hold-transition');
    document.body.classList.add('sidebar-mini');
    document.body.classList.add('layout-navbar-fixed');
    document.body.classList.add('layout-fixed');
    document.body.classList.add('sidebar-closed');
    document.body.classList.add('sidebar-collapse');

  }

  /////////////////////////////////////////
  private canvas;
  private metricContext: any;
  /////////////////////////////////////////
  private selectedSalon: Salon = new Salon();


  /////////////////////////MAP
  public selectedExpoFromTable: CarteraEvento = new CarteraEvento();
  public selectedClientFromMap: CarteraEvento = null;
  public componenteSeleccionado: Componente = new Componente;

  lastExpoClicked: Expositor = new Expositor();
  /////////////////////////MAP
  panelOpenState: boolean = false;
  mensajeMover: Array<string> = [];

  mensajeCancelar: Array<string> = [];
  mensaje: number = 0;
  previousMensaje: number = 0;




  public colorReserva = '#47BCC9';
  public colorEsperando = '#3AA9FC';
  public colorConf = '#58B76A';

  ////////////////////////////////////LIST
  public selectedClient: CarteraEvento = new CarteraEvento();
  ////////////////////////////////////LIST
  /**
   * 
   */
  /////////////////////EXPO
  public listaTotalExpositores: CarteraEvento[] = [];
  public listaGeneral: CarteraEvento[] = [];
  public listaMovimiento: CarteraEvento[] = [];

  public listaMisExpositores: CarteraEvento[] = [];
  public listaMisExpositoresGeneral: CarteraEvento[] = [];
  public listaMisExpositoresEspera: CarteraEvento[] = [];

  public listaSeleccionada: CarteraEvento[] = [];
  /////////////////////EXPO

  ////////////////////////////cCOM
  public componentesInMap: Componente[] = [];
  public LinkedComponentesInMap: StandReferencia[] = [];
  public totalMovimiento: number = 0;
  ////////////////////////////cCOM

  public idVendedor = 0;

  public bucadorModal: string;
  public buscadorGeneral: string;
  public motivoCancel: string = null;
  public histotialExpH: ActividadExpositor[] = [];
  public vLoadingHEH: boolean = true;


  /////////////////////////////////////////////TOOLS
  public opened: boolean = true;
  public noProspect: boolean = true;
  public estatusStands: Array<{ valor: number, nombre: String, estatus: String }> = [];

  public totalOfSelectedStands: number = 0;
  public expoInAsignacion: boolean;
  public filtroMisClientes: boolean = true;

  private isOnSelection: boolean;
  private position = 0;
  private panning: boolean;
  private actualZoom: number; //////It´s on use
  private toqueFalso: boolean = false;
  public busquedaisActive = false;

  public opcionSeleccionadaGR = 0;
  public simOpen = false;
  ////////////////////////////////////////////////

  public counterFirma = 0;
  public counterReserva = 0;
  public counterConfirmado = 0;
  ////////////////////////////////////////////////
  urlImgExp: string = `${environment.endPointBack}/ventasProspectos/getImgExpositor/`;
  private leftBackground: number = -95;
  private topBackground: number = -140;

  ngOnInit(): void {


    this.idVendedor = this.storage.user.id;
    this.canvasConf();
    this.menu.setNombrePantalla('MAPA VENTAS');
    this.mensajeMover.push('Escriba el motivo por el cual esta re asignando el STAND del cliente ');
    this.mensajeMover.push('(Esta acción hará que el cliente sea pasado a la lista de espera)');
    ////////////
    this.mensajeCancelar.push('Escriba el motivo por el cual está cancelando la reserva de STAND del cliente ');
    this.mensajeCancelar.push('¡Esta acción hará que el cliente sea pasado a la lista de espera con reporte de cancelación!');
    //this.chargeSVG();
    this.estatusStands.push({ valor: 1, nombre: 'Reserva de Stand', estatus: colorReserva }, { valor: 2, nombre: 'Esperando Firma', estatus: colorEspFirma }, { valor: 3, nombre: 'Stand Confirmado', estatus: colorConfirmado })

    let url = './assets/ventas/mapaF.svg';
    fabric.Image.fromURL(url, (img) => {
      img.set({
        left: this.leftBackground,
        top: this.topBackground,
      });
      img.scaleToHeight(760);
      img.scaleToWidth(760);
      this.canvas.setBackgroundImage(img);
      this.canvas.renderAll();
    });
  }




  private canvasConf() {
    this.canvas = new fabric.Canvas('canvas', {
      hoverCursor: 'hand',
      selection: false,
      backgroundColor: backgroundColor,
      defaultCursor: 'default',
      allowTouchScrolling: true,
      //stopContextMenu:true- Detiene en el contextMenu de Chrome
    });


    let zoom = 0.8;
    let xs = window.innerWidth / 2;
    let ys = window.innerHeight / 2;
    //this.canvas.zoomToPoint({ x: xs, y: ys },1);
    let delta = new fabric.Point(-xs + 300, -ys + 340);
    this.canvas.absolutePan(delta);
    /*
    this.canvas.setZoom(0.6);
    let obj={x:215,y:215};
    this.canvas.restorePointerVpt(obj);
    */
    /**
     * @ZoomFunction_to_Canvas
     */



    this.canvas.on('mouse:wheel', (opt) => {
      var delta = opt.e.deltaY;
      var zoom = this.canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      this.actualZoom = zoom;
      this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    this.canvas.on('mouse:up', (opt) => {
      this.panning = false;
      //this.canvas.selection = true;
    })

    this.canvas.on('mouse:down', (options) => {
      isElement = false;
      if (options.target) {
        if (options.target.type != 'group') {
          //isElement = false;
          this.panning = true;
          //this.canvas.selection = false;
        }
      } else {
        this.panning = true;
      }
    });
    this.canvas.on('mouse:move', (opt) => {
      isElement = false;
      if (this.panning && opt && opt.e) {
        let delta = new fabric.Point(opt.e.movementX, opt.e.movementY);
        if (delta.x != undefined && delta.y != undefined) {
          this.canvas.relativePan(delta);
        } else {
          console.log(opt);
          if (undefined != opt.e.touches[0].clientX && undefined != opt.e.touches[0].clientY) {
            currentX = opt.e.touches[0].clientX;
            currentY = opt.e.touches[0].clientY;
            var xChange = currentX - lastX;
            var yChange = currentY - lastY;

            if ((Math.abs(currentX - lastX) <= 50) && (Math.abs(currentY - lastY) <= 50)) {
              delta = new fabric.Point(xChange, yChange);
              this.canvas.relativePan(delta);
            }

            lastX = opt.e.touches[0].clientX;
            lastY = opt.e.touches[0].clientY;
          }
        }
      }
    })


    this.canvas.on('touch:gesture', (event) => {
      // Handle zoom only if 2 fingers are touching the screen
      if (event.e.touches && event.e.touches.length == 2) {
        // Get event point
        var point = new fabric.Point(event.self.x, event.self.y);
        // Remember canvas scale at gesture start
        if (event.self.state == "start") {
          var zoomStartScale = event.self.canvas.getZoom();
        }
        // Calculate delta from start scale
        var delta = zoomStartScale * event.self.scale;
        // Zoom to pinch point
        event.self.canvas.zoomToPoint(point, delta);
      }
    });


    this.metricContext = this.canvas.getContext("2d");
    this.metricContext.font = fontFamily;

    this.getAllMapInfo();
  }

  public asignSelectedElement() {
    if (isElement) {
      if (idObjSelected.item(0).get('fill') != colorApagado) {
        if (!this.isOnSelection) {
          this.reBootValues();
          this.componenteSeleccionado.id = parseInt(idObjSelected.item(0).get('cornerColor'));
          this.componenteSeleccionado.numeroStand = idObjSelected.item(0).get('borderColor');
          this.componenteSeleccionado.height = parseInt(idObjSelected.item(0).get('height'));
          this.componenteSeleccionado.width = parseInt(idObjSelected.item(0).get('width'));
          this.componenteSeleccionado.ptop = parseInt(idObjSelected.get('top'));
          this.componenteSeleccionado.pleft = parseInt(idObjSelected.get('left'));
          this.position = this.listaTotalExpositores.findIndex(element => element.expositor.id === parseInt(idObjSelected.item(0).get('cornerStrokeColor')));
          if (this.position != -1) {
            this.selectedClientFromMap = this.listaTotalExpositores[this.position];
            this.selectedClient = this.selectedClientFromMap;
            this.vLoadingHEH = true;
            this.service.getHistorialExpositorH(this.selectedClientFromMap.id).subscribe(h => {
              this.histotialExpH = h;
              this.vLoadingHEH = false;
            })
          }

          openModal(idObjSelected.item(0));
        } else {
          if (idObjSelected.item(0).get('fill') === colorSeleccion) {
            idObjSelected.item(0).set({
              fill: colorVacio
            })
            let counter = 0;
            let result = 0;
            arrayOnStandFromList.forEach(element => {
              if (element.item(0).get('cornerColor') == idObjSelected.item(0).get('cornerColor')) {
                result = counter;
              }
              counter = counter + 1;
            });
            arrayOnStandFromList.splice(result, 1);
          } else {
            idObjSelected.item(0).set({
              fill: colorSeleccion,
              stroke: '#606055'
            })
            arrayOnStandFromList.push(idObjSelected);
          }
          this.totalOfSelectedStands = arrayOnStandFromList.length;
          this.canvas.renderAll();
        }
      }
    }
  }

  /**
   * @Load_InfoMapa_ListaExpositores_Asignaciones
   */

  private getAllMapInfo() {
    this.service.getAllMapVentasInfo(1).subscribe(
      Respuesta => {
        var texto;
        var polygon;
        let done;
        ////////////////////Get all component
        Respuesta.componentes.forEach(element => {
          var rect = new fabric.Rect({
            left: parseInt(element.pleft),
            top: parseInt(element.ptop),
            fill: colorVacio,
            stroke: '#00000',
            strokeWidth: grosorMargen,
            width: parseInt(element.width),
            height: parseInt(element.height),
            hasControls: false,
            selectable: false,
            lockMovementX: true,
            lockMovementY: true,
            borderColor: '' + element.numeroStand,//numeroStand
            cornerColor: '' + element.id,//idComponente
            //cornerStrokeColor: '' + 0,///idExpositor
            strokeLineCap: ''///Previous color
          });
          var x = parseInt(element.pleft);
          var y = parseInt(element.ptop);
          var width = parseInt(element.width);
          var height = parseInt(element.height);
          let metrics = this.metricContext.measureText((element.numeroStand + fontSize).toString() + '');
          var text: any;
          // if (metrics.width <= width - 10) {
          //   text = new fabric.Text(element.numeroStand + '', {
          //     //angle:90,
          //     fontFamily: fontFamily,
          //     fill: colorTextoNormal,
          //     left: parseInt(element.pleft) + 5,
          //     top: parseInt(element.ptop) + 2,
          //     fontSize: fontSize,
          //     selectable: false
          //   });
          // } else if (metrics.width > width - 10) {
          //   if (fontSize + 3 > height) {
          //     let size = height - (height * 0.43);
          //     text = new fabric.Text(element.numeroStand + '', {
          //       fontFamily: fontFamily,
          //       fill: colorTextoNormal,
          //       left: parseInt(element.pleft) + 2,
          //       top: parseInt(element.ptop) + 5,
          //       fontSize: size,
          //       selectable: false
          //     });
          //   } else {
          //     text = new fabric.Text(element.numeroStand + '', {
          //       angle: 90,
          //       fontFamily: fontFamily,
          //       fill: colorTextoNormal,
          //       left: parseInt(element.pleft) + 22,
          //       top: parseInt(element.ptop) + 5,
          //       fontSize: fontSize,
          //       selectable: false
          //     });
          //   }
          // }
          if (metrics.width <= width - 10) {
            // console.log(metrics);
            // console.log(width);
            // console.log(element.numeroStand);
            let size1 = 0;
            if (width > height) {
              size1 = height - (height * 0.75);
            } else if (height > width) {
              size1 = height - (height * 0.90);
            } else {
              size1 = height - (height * 0.85);
            }

            text = new fabric.Text(element.numeroStand + ' ', {
              fontFamily: fontFamily,
              fill: colorTextoNormal,
              left: parseInt(element.pleft) + 1,
              top: parseInt(element.ptop) + 1,
              fontSize: size1,
              selectable: false
            });
          } else if (metrics.width > width - 10) {
            if (fontSize + 3 > height) {
              let size2 = height - (height * 0.75);
              text = new fabric.Text(element.numeroStand + ' ', {
                fontFamily: fontFamily,
                fill: colorTextoNormal,
                left: parseInt(element.pleft) + 1,
                top: parseInt(element.ptop) + 1,
                fontSize: size2,
                selectable: false
              });
            } else {
              let size3 = height - (height * 0.87);
              text = new fabric.Text(element.numeroStand + ' ', {
                //angle: 90,
                fontFamily: fontFamily,
                fill: colorTextoNormal,
                left: parseInt(element.pleft) + 1,
                top: parseInt(element.ptop) + 1,
                fontSize: size3,
                selectable: false
              });
            }
          }


          var group = new fabric.Group([rect, text], {
            selectable: false,
            hasControls: false,
            lockMovementX: true,
            lockMovementY: true
          });
          group.on('mousedown', () => {
            idObjSelected = group;
            isElement = true;
          });


          this.canvas.add(group);
          element.canvas = group;
          let componente: Componente = element;
          componente.pleft = parseInt(componente.pleft.toString());
          componente.ptop = parseInt(componente.ptop.toString());
          componente.height = parseInt(componente.height.toString());
          componente.width = parseInt(componente.width.toString());
          this.componentesInMap.push(componente);
          if (!done) this.selectedSalon = element.salon;
          done = true;
        });


        /////////////Get Relaciones Stand-Expositor
        Respuesta.relacionados.forEach(element => {
          this.componentesInMap.forEach(componente => {
            var color = colorVacio;
            switch (element.componente.fill) {
              case colorConfirmado:
                color = colorConfirmado;
                break;
              case colorEspFirma:
                color = colorEspFirma;
                break;
              case colorReserva:
                color = colorReserva;
                break;
            }
            if (componente.canvas.item(0).get('cornerColor') == element.componente.id) {

              if (color == colorConfirmado) this.counterConfirmado = this.counterConfirmado + 1;
              if (color == colorEspFirma) this.counterFirma = this.counterFirma + 1;
              if (color == colorReserva) this.counterReserva = this.counterReserva + 1;
              componente.canvas.item(0).set({
                cornerStrokeColor: '' + element.expositor.id,///idExpositor
                fill: color
              })

              let razon_social = this.wordBreak(element.expositor.razon_social);
              var text: any;

              let size = componente.width - (componente.width * 0.95);
              text = new fabric.Text(`${razon_social}`, {
                //angle: 90,
                fontFamily: fontFamily,
                fill: colorTextoNormal,
                originX: 'center',
                originY: 'center',
                fontSize: size,
                selectable: false,
                textAlign: 'center'
              })

              componente.canvas.add(text);
              this.canvas.renderAll();

              /*
              let url = '../../assets/ventas/img_proyect/mexico.png';
              fabric.Image.fromURL(url, (img) => {
                var width = parseInt(componente.width.toString());
                var height = parseInt(componente.height.toString());
                if (width > 0 || height > 0) {
                  var angulo = 0;
                  var valor = width
                  if (height > width) {
                    valor = height / 4.5;
                    angulo = 90;
                  }
                  var imga = img.set({
                    hasControls: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    selectable: false,
                    originX: 'center',
                    originY: 'center',
                    lockUniScaling: true,
                    angle: angulo
                  });

                  img.scaleToHeight(valor);
                  img.scaleToWidth(valor);

                  componente.canvas.remove(componente.canvas.item(1))
                  componente.canvas.add(imga);
                  this.canvas.renderAll();
                }
              });
              */
            }
          });
          this.LinkedComponentesInMap.push(element);
        });


        ////////////Get Expositores y asignacion de stands 
        Respuesta.expositores.forEach(element => {
          let car: CarteraEvento = element;
          car.expositor.clicked = false;
          car.expositor.stands = [];
          car.expositor.asignacion = [];
          this.LinkedComponentesInMap.forEach(relacion => {
            if (relacion.expositor.id == element.expositor.id) {
              car.expositor.stands.push(relacion.componente);
              car.expositor.asignacion.push(relacion);
            }
          });
          if (!car.reubicacion) {
            this.listaGeneral.push(car);
          } else {
            this.listaMovimiento.push(car);
            this.totalMovimiento = this.listaMovimiento.length;
          }
          if (element.vendedor.id == this.idVendedor) {
            this.noProspect = false;
            if (car.reubicacion) {
              this.listaMisExpositoresEspera.push(car);
            } else {
              this.listaMisExpositoresGeneral.push(car);
            }
            this.listaMisExpositores.push(car);
          }
          this.listaTotalExpositores.push(car);
        })

        if (texto != undefined || texto != null) {
          let coords = JSON.parse(texto.split(']')[0] + ']');
          let conf = JSON.parse(texto.split(']')[1]);
          //polygon = new fabric.Polygon(coords, conf);
          //this.canvas.add(polygon)
          //this.canvas.sendToBack(polygon);
        }
        this.spinner.hide();
      });
    this.listTabla = this.listaMisExpositores;
    this.listaSeleccionada = this.listaMisExpositoresGeneral;
  }


  /**
   * @Asign_Elements_From_MapTo_AngularElements
   * @param totalOfSelectedStands: Numero de stands en seleccion;
   */

  private reBootValues(): void {
    if (this.selectedExpoFromTable != null) this.selectedExpoFromTable.expositor.clicked = false;
    this.selectedExpoFromTable = null;
    this.panelOpenState = false;
    this.listTabla = this.listaMisExpositores;
    this.bucadorModal = '';
    this.motivoCancel = '';
    this.buscadorGeneral = '';
    this.previousMensaje = 0;
  }


  /**
   *@Toogle_Expansion_PanelFunction_ModalFill
   */
  togglePanel(opcion) {
    if (opcion != this.previousMensaje) {
      this.panelOpenState = true;
    } else {
      this.previousMensaje = 1;
      this.panelOpenState = false;
    }
    if (opcion == 1) {
      this.mensaje = 1;
    } else if (opcion == 2) {
      this.mensaje = 2;
    }
    this.previousMensaje = this.mensaje;
    if (!this.panelOpenState) this.previousMensaje = 0;
  }

  /**
   * @Select_Expo_From_ModalTable
   */

  public pickExpositorFromList(item: CarteraEvento) {
    if (item.vendedor.id == this.idVendedor) {
      if (item.expositor == this.lastExpoClicked) {
        item.expositor.clicked = false;
        this.lastExpoClicked = new Expositor();
        this.selectedExpoFromTable = null;
      } else {
        this.lastExpoClicked.clicked = false;
        item.expositor.clicked = true;
        this.lastExpoClicked = item.expositor;
      }
      if (item.expositor.clicked) this.selectedExpoFromTable = item;
    }
  }

  private createNewGroup(cuadro: Componente, idExpositor: number): any {
    var rect = new fabric.Rect({
      left: cuadro.pleft,
      top: cuadro.ptop,
      fill: colorReserva,
      stroke: '#00000',
      strokeWidth: grosorMargen,
      width: cuadro.width,
      height: cuadro.height,
      hasControls: false,
      selectable: false,
      lockMovementX: true,
      lockMovementY: true,
      borderColor: '' + cuadro.numeroStand,//numeroStand
      cornerColor: '' + this.idPrueba,//idComponente
      cornerStrokeColor: '' + idExpositor,///idExpositor
      strokeLineCap: ''///Previous color
    });
    cuadro.id = this.idPrueba
    this.idPrueba = this.idPrueba + 1;
    let metrics = this.metricContext.measureText((cuadro.numeroStand + fontSize).toString() + '');
    var text: any;
    if (metrics.width <= cuadro.width - 10) {
      text = new fabric.Text(cuadro.numeroStand + '', {
        //angle:90,
        fontFamily: fontFamily,
        fill: colorTextoNormal,
        left: parseInt(cuadro.pleft.toString()) + 5,
        top: parseInt(cuadro.ptop.toString()) + 2,
        fontSize: fontSize,
        selectable: false
      });
    } else if (metrics.width > cuadro.width - 10) {
      if (fontSize + 3 > cuadro.height) {
        let size = cuadro.height - (cuadro.height * 0.43);
        text = new fabric.Text(cuadro.numeroStand + '', {
          fontFamily: fontFamily,
          fill: colorTextoNormal,
          left: parseInt(cuadro.pleft.toString()) + 2,
          top: parseInt(cuadro.ptop.toString()) + 5,
          fontSize: size,
          selectable: false
        });
      } else {
        text = new fabric.Text(cuadro.numeroStand + '', {
          angle: 90,
          fontFamily: fontFamily,
          fill: colorTextoNormal,
          left: parseInt(cuadro.pleft.toString()) + 22,
          top: parseInt(cuadro.ptop.toString()) + 5,
          fontSize: fontSize,
          selectable: false
        });
      }

    }

    var group = new fabric.Group([rect, text], {
      selectable: false,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true
    });
    group.on('mousedown', () => {
      idObjSelected = group;
      isElement = true;
    });

    return group;
  }

  private listUpdates: any = [];

  private groupComponents(nears: Componente[], newC: Componente, idExpositor: number) {
    var cuadro = new Componente();
    let coordX = newC.pleft;
    let coordY = newC.ptop;
    let width = newC.width;
    let height = newC.height;
    let status = newC.status;
    let merged = false;
    let counter = 1;
    cuadro.numeroStand = newC.numeroStand;

    for (let i = 0; i < nears.length; i++) {
      let idE = parseInt(nears[i].canvas.item(0).get('cornerStrokeColor'));
      if (idE == idExpositor && nears[i].status == 1) {
        let nearTop = parseInt(nears[i].ptop.toString());
        let nearLeft = parseInt(nears[i].pleft.toString());
        let nearWidth = parseInt(nears[i].width.toString());
        let nearHeight = parseInt(nears[i].height.toString());
        if (((coordY == nearTop + nearHeight || coordY + height == nearTop) && nearWidth == width) ||
          ((coordX == nearLeft + nearWidth || coordX + width == nearLeft) && nearHeight == height)) {
          cuadro.pleft = newC.pleft;
          cuadro.ptop = newC.ptop;
          if (nearLeft < parseInt(newC.pleft.toString())) cuadro.pleft = nearLeft;
          if (nearTop < parseInt(newC.ptop.toString())) cuadro.ptop = nearTop;
          cuadro.status = 1;
          if (Number.isNaN(parseInt(cuadro.numeroStand))) cuadro.numeroStand = nears[i].numeroStand;

          if ((coordY == nearTop + nearHeight || coordY + height == nearTop) && nearWidth == width) {//Arriba-Abajo
            cuadro.width = nearWidth;
            cuadro.height = nearHeight + height;
            if (coordY + height == nearTop) cuadro.ptop = coordY;
          } else if ((coordX == nearLeft + nearWidth || coordX + width == nearLeft) && nearHeight == height) {//Izquierda-Derecha
            cuadro.width = nearWidth + width;
            cuadro.height = nearHeight;
            if (coordX + width == nearLeft) cuadro.pleft = coordX;
          }
          //cuadro.canvas=this.createNewGroup(cuadro,idExpositor);
          let com: Componente = new Componente();
          com.id = nears[i].id
          com.numeroStand = nears[i].numeroStand
          com.fill = nears[i].fill;
          com.status = 0;
          com.salon = this.selectedSalon;
          com.width = nears[i].width;
          com.height = nears[i].height;
          com.pleft = nears[i].pleft;
          com.ptop = nears[i].ptop;
          com.canvas = null;
          com.agrupacion = '0';
          this.listUpdates.push(com);
          this.listUpdates.push(newC);
          nears[i].status = 0;
          counter = counter + 1;
          let pos = this.componentesInMap.findIndex(element => element.id === this.componenteSeleccionado.id);
          if (pos != -1) this.componentesInMap[pos].status = 0;
          merged = true;
          break;
        }
      }
    }
    if (merged) {
      console.log("LOG DE GROUP:");
      console.log(cuadro);
      cuadro.countAgrupacion = counter;
      this.finalMergeComponente(cuadro, 0);
    }
  }

  /**
   * @Asign_Confirm_StandToExpo_From_ModalEmpty
   * @param selectedExpoFromTable: Expositor seleccionado desde tabla en modal
   */

  ////////////PRUEBA
  private idPrueba = 500;

  public asignarStandFromMapa() {
    if (this.selectedExpoFromTable != null) {
      Swal.fire({
        title: 'Confirmar Reservación de Stand',
        html: '<img style="width: 250px;" src="' + this.urlImgExp + this.selectedExpoFromTable.expositor.logo + '" class="img-circle"><br><br>' +
          '<b>' + this.selectedExpoFromTable.expositor.nombre_comercial + '</b><br><br>' +
          '<div class="row">' +
          '<div class="col-lg-2 "></div>' +
          '<div class="col-lg-8 ml-2 bg-light rounded border border-dark"><b>#' + this.componenteSeleccionado.numeroStand + '</b></div>' +
          '<div class="col-lg-2 "></div>' +
          '</div><br>' +
          'Reservar este Stand para el expositor?<br>',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          let near = [];
          this.componenteSeleccionado.fill = colorReserva;
          let com: any = new Componente();
          com.id = this.componenteSeleccionado.id
          com.numeroStand = this.componenteSeleccionado.numeroStand
          com.fill = colorReserva;
          com.status = 1;
          com.salon = this.selectedSalon;
          com.width = this.componenteSeleccionado.width;
          com.height = this.componenteSeleccionado.height;
          com.pleft = this.componenteSeleccionado.pleft;
          com.ptop = this.componenteSeleccionado.ptop;
          com.agrupacion = '0';
          this.selectedExpoFromTable.expositor.stands.push(com);
          this.componentesInMap.forEach(element => {
            if (element.id == this.componenteSeleccionado.id) {
              idObjSelected.item(0).set({
                fill: colorReserva,
                cornerStrokeColor: '' + this.selectedExpoFromTable.expositor.id///idExpositor
              });
              element.fill = colorReserva;
            }
            let coordX = element.pleft;
            let coordY = element.ptop;
            let width = element.width;
            let height = element.height;
            let status = element.status;

            if ((coordX == this.componenteSeleccionado.pleft) && (this.componenteSeleccionado.width == width)) {
              if ((this.componenteSeleccionado.ptop == height + coordY) || (this.componenteSeleccionado.ptop + this.componenteSeleccionado.height == coordY)) {
                near.push(element);
              }
            } else if ((coordY == this.componenteSeleccionado.ptop) && (this.componenteSeleccionado.height == height)) {
              if ((this.componenteSeleccionado.pleft == width + coordX) || (this.componenteSeleccionado.pleft + this.componenteSeleccionado.width == coordX)) {
                near.push(element);
              }
            }

          });
          //this.groupComponents(near, com, this.selectedExpoFromTable.expositor.id);
          this.selectedExpoFromTable.reubicacion = false;

          ///////////////SAVE INTO BD/////////////////////////



          this.service.saveAsignacionStand(this.selectedExpoFromTable, this.componenteSeleccionado.id, this.storage.user.id).subscribe(
            Respuesta => {
              let asig: StandReferencia = Respuesta;
              this.selectedExpoFromTable.expositor.asignacion.push(asig);
              Swal.fire(
                '!Stand reservado!',
                '',
                'success'
              )
            }
          );


          let pos = this.listaMovimiento.findIndex(element => element.expositor.id === this.selectedExpoFromTable.expositor.id);
          if (pos != -1) {
            this.listaGeneral.push(this.listaMovimiento[pos]);
            this.listaMovimiento.splice(pos, 1);
            this.totalMovimiento = this.listaMovimiento.length;

            this.listaGeneral.sort((a, b) => {
              if (a.expositor.nombre_comercial.toLowerCase() > b.expositor.nombre_comercial.toLowerCase()) return 1;
              if (a.expositor.nombre_comercial.toLowerCase() < b.expositor.nombre_comercial.toLowerCase()) return -1;
              return 0;
            });

          }
          let misG = this.listaMisExpositoresEspera.findIndex(element => element.expositor.id === this.selectedExpoFromTable.expositor.id);
          if (misG != -1) {
            this.listaMisExpositoresGeneral.push(this.listaMisExpositoresEspera[misG]);
            this.listaMisExpositoresEspera.splice(misG, 1);
            this.listaMisExpositoresGeneral.sort((a, b) => {
              if (a.expositor.nombre_comercial.toLowerCase() > b.expositor.nombre_comercial.toLowerCase()) return 1;
              if (a.expositor.nombre_comercial.toLowerCase() < b.expositor.nombre_comercial.toLowerCase()) return -1;
              return 0;
            });
          }

          this.canvas.renderAll();
          $('#modalMap-Empty').modal('hide');
        }
      })
    }
  }


  /**
   * @Init_ProcessAsign_StandToExpositor_From_SideList
   */

  public asignarStandFromLista() {
    this.expoInAsignacion = !this.expoInAsignacion;
    if (this.expoInAsignacion) {
      this.spinner.show();
      this.componentesInMap.forEach(element => {
        if (element.fill != colorVacio) {
          element.canvas.item(0).set({
            strokeLineCap: element.canvas.item(0).get('fill'),
            fill: colorApagado,
            strokeWidth: 2,
            stroke: '#606055'
          })
          arrayOffStandFromList.push(element.canvas.item(0));
          this.canvas.renderAll();
        }
      })
      this.spinner.hide();
      this.isOnSelection = true;
      ////////Cancelar Option
    } else {
      arrayOffStandFromList.forEach(element => {
        element.set({
          stroke: '#00000',
          strokeWidth: grosorMargen,
          fill: element.get('strokeLineCap')
        })
      })
      arrayOnStandFromList.forEach(element => {
        element.item(0).set({
          fill: colorVacio,
          stroke: '#00000'
        })
      })
      arrayOnStandFromList = [];
      arrayOffStandFromList = [];
      this.totalOfSelectedStands = arrayOnStandFromList.length;
      this.canvas.renderAll();
      this.isOnSelection = false;
    }
  }


  /**
   * @GetText_OfEvery_SelectedStands_ModalEmpty
   */
  private getSelectedStandsFromMapa_Lista(): string {
    var text = '';
    arrayOnStandFromList.forEach(element => {
      text = text + '<div class="col-lg-12 ml-2 bg-light rounded border border-dark"><b>#' + element.item(0).get('borderColor') + '</b></div> <br>';
    });
    return text;
  }




  private orderGroupsOn(grupos: any[]): any[] {
    for (let i = 0; i < grupos.length; i++) {
      for (let x = 0; x < grupos.length - 1; x++) {
        let left = grupos[x].get('left');
        let nextLeft = grupos[x + 1].get('left');
        if (left > nextLeft) {
          var bubble = grupos[x + 1];
          grupos[x + 1] = grupos[x];
          grupos[x] = bubble;
        }
      }
    }
    return grupos;
  }

  private orderIslas(grupos: Componente[]): any[] {
    for (let i = 0; i < grupos.length; i++) {
      for (let x = 0; x < grupos.length - 1; x++) {
        if (grupos[x].isla > grupos[x + 1].isla) {
          var bubble = grupos[x + 1];
          grupos[x + 1] = grupos[x];
          grupos[x] = bubble;
        }
      }
    }
    return grupos;
  }

  private orderRowsGroups(grupos: Componente[]): any[] {
    for (let i = 0; i < grupos.length; i++) {
      for (let x = 0; x < grupos.length - 1; x++) {
        if (grupos[x].pleft == grupos[x + 1].pleft) {
          if (grupos[x].ptop > grupos[x + 1].ptop) {
            var bubble = grupos[x + 1];
            grupos[x + 1] = grupos[x];
            grupos[x] = bubble;
          }
        }
      }
    }
    return grupos;
  }



  /**
   * @Get_SelectionExpo_From_SideList
   */


  public pickExpoFromSideList(item) {
    if (!this.toqueFalso) {
      this.selectedClient = item;
      this.vLoadingHEH = true;
      openModalSideList();
      this.service.getHistorialExpositorH(item.id).subscribe(h => {
        this.histotialExpH = h;
        this.vLoadingHEH = false;
      })
    }
  }





  /**
   * @Confirm_AsignStandToExpo_From_SideList
   * @param arrayOnStandFromList: Stands seleccionados en mapa
   */
  public confirmAsignarStandFromLista() {
    Swal.fire({
      title: 'Confirmar Reservación de Stand',
      html: '<img style="width: 250px;" src="' + this.urlImgExp + this.selectedClient.expositor.logo + '" class="img-circle"><br><br>' +
        '<b>' + this.selectedClient.expositor.nombre_comercial + '</b><br><br>' +
        '<div class="row">' +
        this.getSelectedStandsFromMapa_Lista() +
        '</div><br>' +
        'Reservar los Stands para el expositor?<br>',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {

        var nears: Componente[] = [];
        //nears = this.groupSelectedElements();
        /*
        nears.forEach(element => {
          element.canvas = this.createNewGroup(element, this.selectedClient.expositor.id);
          element.status = 1;
          this.componentesInMap.push(element);
          this.finalMergeComponente(element, 1);
        });


        //console.log(nears);

        for (let i = 0; i < arrayOnStandFromList.length; i++) {
          for (let x = 0; x < this.componentesInMap.length; x++) {
            if (this.componentesInMap[x].id == parseInt(arrayOnStandFromList[i].item(0).get('cornerColor'))) {
              this.componentesInMap[x].status = 0;
              break;
            }
          }
        }
        */
        arrayOnStandFromList.forEach(element => {

          let com: Componente = new Componente();
          com.id = element.item(0).get('cornerColor')//idComponente
          com.numeroStand = element.item(0).get('borderColor')//numeroStand
          com.fill = colorReserva;
          com.status = 1;
          com.salon = this.selectedSalon;
          com.width = element.item(0).get('width');
          com.height = element.item(0).get('height');
          com.pleft = element.get('left');
          com.ptop = element.get('top');
          com.agrupacion = '0';
          com.fill = colorReserva;

          this.selectedClient.expositor.stands.push(com);
          this.selectedClient.reubicacion = false;
          element.item(0).set({
            fill: colorReserva,
            stroke: '#00000',
            cornerStrokeColor: '' + this.selectedClient.expositor.id///idExpositor
          })


          /////////////BD/////////////////////////
          this.service.saveAsignacionStand(this.selectedClient, com.id, this.storage.user.id).subscribe(
            Respuesta => {
              let asig: StandReferencia = Respuesta;
              this.selectedClient.expositor.asignacion.push(asig);
              Swal.fire(
                '!Stand reservado!',
                '',
                'success'
              )
            }
          );
          /////////////BD/////////////////////////


          let pos = this.listaMovimiento.findIndex(element => element.expositor.id === this.selectedClient.expositor.id);
          if (pos != -1) {
            this.listaGeneral.push(this.listaMovimiento[pos]);
            this.listaMovimiento.splice(pos, 1);
            this.totalMovimiento = this.listaMovimiento.length;
          }
          let misG = this.listaMisExpositoresEspera.findIndex(element => element.expositor.id === this.selectedClient.expositor.id);
          if (misG != -1) {
            this.listaMisExpositoresGeneral.push(this.listaMisExpositoresEspera[misG]);
            this.listaMisExpositoresEspera.splice(misG, 1);
          }
        })
        Swal.fire(
          '!Stand reservado!',
          '',
          'success'
        );
        this.isOnSelection = false;
        this.expoInAsignacion = false;
        arrayOffStandFromList.forEach(element => {
          element.set({
            stroke: '#00000',
            strokeWidth: grosorMargen,
            fill: element.get('strokeLineCap')
          })
        })
        arrayOffStandFromList = [];
        arrayOnStandFromList = [];
        this.totalOfSelectedStands = arrayOnStandFromList.length;
        this.canvas.renderAll();
        $('#modalMap-Empty').modal('hide');
      }
    })
  }



  private groupSelectedElements(): any[] {
    var nears: Componente[] = [];
    arrayOnStandFromList = this.orderGroupsOn(arrayOnStandFromList);
    let isla = 0;
    arrayOnStandFromList.forEach(grupo => {
      let coordX = grupo.get('left');
      let coordY = grupo.get('top');
      let width = grupo.item(0).get('width');
      let height = grupo.item(0).get('height');
      let texto = grupo.item(1).get('text');

      let existe = false;
      nears.forEach(element => {
        if (element.pleft == coordX && element.ptop == coordY && element.width == width && element.height == height && element.numeroStand == texto) {
          existe = true;
        }
      });
      if (!existe) {
        let componente: Componente = new Componente();
        componente.pleft = coordX;
        componente.ptop = coordY;
        componente.height = height;
        componente.width = width;
        componente.numeroStand = texto;
        componente.merged = false;
        let islaF = 0
        nears.forEach(element => {

          if (element.pleft == coordX && element.ptop + element.height == coordY) {//arriba
            islaF = element.isla;
          } else if (element.pleft == coordX && element.ptop == coordY + height) { //abajo
            islaF = element.isla;
          } else if (element.pleft + element.width == coordX && element.ptop == coordY) {//izquierda
            islaF = element.isla;
          } else if (element.pleft == coordX + width && element.ptop == coordY) {//derecha
            islaF = element.isla;
          }
        });
        if (islaF == 0) {
          isla = isla + 1;
          islaF = isla;
        }
        componente.isla = islaF;
        nears.push(componente);
      }
    });


    nears.forEach(element => {
      let coordX = element.pleft;
      let coordY = element.ptop;
      let width = element.width;
      let height = element.height;
      //let texto = grupo.item(1).get('text');

      nears = this.orderIslas(nears);

      nears.forEach(near => {
        if (near.pleft == coordX && (near.ptop + near.height == coordY || near.ptop == coordY + height)) {//arriba- abajo
          if (near.isla != element.isla) {
            near.isla = element.isla;
          }
        } else if (near.ptop == coordY && (near.pleft + near.width == coordX || near.pleft == coordX + width)) {//izquierda-derecha
          if (near.isla != element.isla) {
            near.isla = element.isla;
          }
        }
      });
    });
    nears = this.orderRowsGroups(nears);

    let merged = true;
    while (merged) {
      merged = false;
      let primero = null, segundo = null;
      for (let i = 0; i < nears.length; i++) {
        for (let x = 0; x < nears.length; x++) {
          if (nears[x].isla == nears[i].isla) {
            if (nears[x].pleft == nears[i].pleft && (nears[x].ptop + nears[x].height == nears[i].ptop || nears[x].ptop == nears[i].ptop + nears[i].height)) {//arriba
              if (nears[x].width == nears[i].width) {
                let componente = new Componente();
                componente.pleft = nears[x].pleft;
                componente.width = nears[x].width;
                componente.numeroStand = nears[x].numeroStand;
                componente.isla = nears[x].isla;
                componente.height = nears[x].height + nears[i].height;
                componente.merged = false;
                if (nears[x].ptop < nears[i].ptop) {
                  componente.ptop = nears[x].ptop;
                } else {
                  componente.ptop = nears[i].ptop;
                }
                nears.push(componente);
                primero = x;
                segundo = i;
                break;
              }
              //izquierda, derecha
            } else if (nears[x].ptop == nears[i].ptop && (nears[x].pleft + nears[x].width == nears[i].pleft || nears[x].pleft == nears[i].pleft + nears[i].width)) {//izquierda
              if (nears[x].height == nears[i].height) {
                let componente = new Componente();
                componente.ptop = nears[x].ptop;
                componente.numeroStand = nears[x].numeroStand;
                componente.isla = nears[x].isla;
                componente.height = nears[x].height;
                componente.width = nears[x].width + nears[i].width;
                componente.merged = false;
                if (nears[x].pleft < nears[i].pleft) {
                  componente.pleft = nears[x].pleft;
                } else {
                  componente.pleft = nears[i].pleft;
                }
                nears.push(componente);
                primero = x;
                segundo = i;
                break;
              }
            }
          }
        }
        if (primero != null && segundo != null) {
          merged = true;
          break;
        }
      }
      if (primero != null && segundo != null) {
        nears.splice(primero, 1);
        nears.splice(segundo, 1);
        merged = true;
      }
    }
    console.log(nears);
    return nears;
  }

  stopInterval: Subscription;

  private finalMergeComponente(com: Componente, opc: number) {
    console.log(this.selectedExpoFromTable)
    let merged = true;
    let didSomething = false;
    let counter = 0;
    com.agrupacion = 'main';
    com.salon = this.selectedSalon;
    com.stroke = '#0000';
    com.fill = colorReserva;
    if (opc == 0) {
      while (merged) {
        merged = false;
        for (let i = 0; i < this.selectedExpoFromTable.expositor.stands.length; i++) {
          let coordX = parseInt(this.selectedExpoFromTable.expositor.stands[i].pleft.toString());
          let coordY = parseInt(this.selectedExpoFromTable.expositor.stands[i].ptop.toString());
          let width = parseInt(this.selectedExpoFromTable.expositor.stands[i].width.toString());
          let height = parseInt(this.selectedExpoFromTable.expositor.stands[i].height.toString());
          let status = parseInt(this.selectedExpoFromTable.expositor.stands[i].status.toString());

          if (status == 1 && this.selectedExpoFromTable.expositor.stands[i].id != com.id) {
            if ((coordX == com.pleft) && (com.width == width)) {
              if ((com.ptop == height + coordY) || (com.ptop + com.height == coordY)) {
                com.height = parseInt(com.height.toString()) + height;
                this.selectedExpoFromTable.expositor.stands[i].status = 0;
                //this.componentesInMap.push(com);
                this.listUpdates.push(this.selectedExpoFromTable.expositor.stands[i])
                if (com.ptop > coordY) com.ptop = coordY;
                merged = true;
                didSomething = true;
                counter = counter + 1;
                break;
              }
            } else if ((coordY == com.ptop) && (com.height == height)) {
              if ((com.pleft == width + coordX) || (com.pleft + com.width == coordX)) {
                com.width = parseInt(com.width.toString()) + width;
                this.selectedExpoFromTable.expositor.stands[i].status = 0;
                this.listUpdates.push(this.selectedExpoFromTable.expositor.stands[i])
                //this.componentesInMap.push(com);
                if (com.pleft > coordX) com.pleft = coordX;
                merged = true;
                didSomething = true;
                counter = counter + 1;
                break;
              }
            }
          }
        }
      }
      if (didSomething) {
        console.log('LOG DEL RESULTADO FINAL');
        console.log(com);
        com.countAgrupacion = com.countAgrupacion + counter;
      }
      com.id = null;
      let coun = 0;
      let res = 0;
      this.listUpdates.forEach(element => {
        if (element.agrupacion == 'main') {
          res = coun;
        }
        coun = coun + 1;
      });
      this.listUpdates.splice(res, 1);
      this.listUpdates.push(com);

      this.service.saveAgrupacionStand(this.listUpdates, this.selectedExpoFromTable.id, this.storage.user.id).subscribe(
        Respuesta => {
          let asig: StandReferencia = Respuesta;
          this.selectedExpoFromTable.expositor.asignacion.push(asig);
          Swal.fire(
            '!Stand agrupado!',
            '',
            'success'
          )
          com.canvas = this.createNewGroup(com, this.selectedExpoFromTable.expositor.id);
          this.selectedExpoFromTable.expositor.stands.push(com);
          this.componentesInMap.push(com);
          this.canvas.add(com.canvas);
          this.canvas.renderAll();
        }
      );

      console.log(this.listUpdates);
    } else if (opc == 1) {
      while (merged) {
        merged = false;
        for (let i = 0; i < this.selectedClient.expositor.stands.length; i++) {
          let coordX = this.selectedClient.expositor.stands[i].pleft;
          let coordY = this.selectedClient.expositor.stands[i].ptop;
          let width = this.selectedClient.expositor.stands[i].width;
          let height = this.selectedClient.expositor.stands[i].height;
          let status = this.selectedClient.expositor.stands[i].status;
          let idExpositor = this.selectedClient.expositor.id;
          if (status == 1 && this.selectedClient.expositor.stands[i].id != com.id) {
            if ((coordX == com.pleft) && (com.width == width)) {
              if ((com.ptop == height + coordY) || (com.ptop + com.height == coordY)) {
                com.height = parseInt(com.height.toString()) + height;
                this.selectedClient.expositor.stands[i].status = 0;
                if (com.ptop > coordY) com.ptop = coordY;
                merged = true;
                didSomething = true;
                counter = counter + 1;
              }
            } else if ((coordY == com.ptop) && (com.height == height)) {
              if ((com.pleft == width + coordX) || (com.pleft + com.width == coordX)) {
                com.width = parseInt(com.width.toString()) + width;
                this.selectedClient.expositor.stands[i].status = 0;
                if (com.pleft > coordX) com.pleft = coordX;
                merged = true;
                didSomething = true;
                counter = counter + 1;
              }
            }
          }
        }
      }

      if (didSomething) {
        console.log('LOG DEL RESULTADO FINAL');
        console.log(com);
        com.countAgrupacion = com.countAgrupacion + counter;
      }

    }
  }



  /**
   * MOVER/CANCELAR STANDS
   */
  public moverCancelarStand() {
    let confirm = '';
    let result = 0;
    let sts = 4;
    var color = colorVacio;
    if (this.mensaje == 1) {
      confirm = 'El cliente ha sido movido a la lista de reubicación'
      color = colorVacio;
    } else if (this.mensaje == 2) {
      confirm = 'La reservacion del cliente ha sido cancelada'
      sts = 5;
    }

    this.panelOpenState = false;
    idObjSelected.item(0).set({ fill: color })
    this.componentesInMap.forEach(element => {
      if (element.id == this.componenteSeleccionado.id) {
        element.fill = colorVacio;
      }
    })

    let counter = 0;
    this.selectedClientFromMap.expositor.stands.forEach(stand => {
      if (this.componenteSeleccionado.id == stand.id) {
        result = counter;
      }
      counter = counter + 1;
    })
    $('#modalMap-Fill').modal('hide');
    this.selectedClientFromMap.expositor.stands.splice(result, 1);
    if (this.mensaje == 1) {
      if (!this.selectedClientFromMap.reubicacion) {
        let position = this.listaGeneral.findIndex(element => element.expositor.id === this.selectedClientFromMap.expositor.id);
        if (position != -1) {
          this.selectedClientFromMap.reubicacion = true;
          this.listaGeneral.splice(position, 1)
          this.listaMovimiento.push(this.listaTotalExpositores[this.position]);
        }
        //
        let pos = this.listaMisExpositoresGeneral.findIndex(element => element.expositor.id === this.selectedClientFromMap.expositor.id);
        if (pos != -1) {
          this.listaMisExpositoresEspera.push(this.listaMisExpositoresGeneral[pos]);
          this.listaMisExpositoresGeneral.splice(pos, 1);
        }
      }
    }
    this.selectedClientFromMap.expositor.asignacion.forEach(asignacion => {
      if (this.componenteSeleccionado.id == asignacion.componente.id) {
        this.service.updateStatusAsignacionStand(this.selectedClientFromMap, asignacion.id, this.storage.user.id, sts, this.motivoCancel).subscribe(
          Respuesta => {
            this.totalMovimiento = this.listaMovimiento.length;
            Swal.fire(
              confirm,
              '',
              'success'
            )
          }
        )

      }
    });
    this.canvas.renderAll();

  }



  public updatestatusStand(stand: Componente, valor: any, origen: number) {
    let color = stand.fill;
    let numero = 1;
    switch (valor) {
      case '1':
        color = colorReserva;
        break;
      case '2':
        color = colorEspFirma;
        numero = 2;
        break;
      case '3':
        color = colorConfirmado;
        numero = 3;
        break;
    }
    this.componentesInMap.forEach(element => {
      if (element.id == stand.id) {
        element.canvas.item(0).set({
          fill: color
        });
        stand.fill = color;
      }
    })

    if (origen == 0) {
      this.selectedClientFromMap.expositor.asignacion.forEach(asignacion => {
        if (stand.id == asignacion.componente.id) {
          this.service.updateStatusAsignacionStand(this.selectedClientFromMap, asignacion.id, this.storage.user.id, numero, 'No').subscribe()
        }
      });
    } else {
      this.selectedClient.expositor.asignacion.forEach(asignacion => {
        if (stand.id == asignacion.componente.id) {
          this.service.updateStatusAsignacionStand(this.selectedClient, asignacion.id, this.storage.user.id, numero, 'No').subscribe()
        }
      });
    }
    this.canvas.renderAll();
  }

  public timerBuscador: number = 0;
  public terminoBusqueda;
  public listTabla: CarteraEvento[] = [];

  public buscadorModal(event) {
    this.timerBuscador = this.timerBuscador + 1;
    this.listTabla = [];
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
    this.listTabla = this.listaMisExpositores.filter(
      (val) => val.expositor['nombre_comercial'].toLowerCase().includes(termino.toLowerCase()));

  }

  public timerBuscadorG


  public terminoBusquedaSideList;
  public mBuscadorGeneral(event) {
    this.busquedaisActive = false;
    this.timerBuscadorG = this.timerBuscadorG + 1;
    this.listaSeleccionada = [];
    let termino = event.target.value;
    this.terminoBusquedaSideList = termino;
    var time = timer(500);
    time.subscribe((n) => {
      if (n == 0) {
        this.timerBuscadorG = this.timerBuscadorG - 1;
      }
    });


    if (this.filtroMisClientes) {
      if (this.listaMisExpositores.length == 0) {
        this.filtroMisClientes = false;
        this.listaSeleccionada = this.listaGeneral.filter(
          (val) => val.expositor['nombre_comercial'].toLowerCase().includes(termino.toLowerCase()));
      } else {
        let reubicacion = false;
        for (let i = 0; i < this.listaMisExpositores.length; i++) {
          if (this.listaMisExpositores[i].reubicacion) {
            reubicacion = true;
            break;
          }
        }
        if (reubicacion) {
          this.filtroMisClientes = false;
          this.listaSeleccionada = this.listaGeneral.filter(
            (val) => val.expositor['nombre_comercial'].toLowerCase().includes(termino.toLowerCase()));
        } else {
          this.listaSeleccionada = this.listaMisExpositores.filter(
            (val) => val.expositor['nombre_comercial'].toLowerCase().includes(termino.toLowerCase()));
        }
      }
    } else {
      this.listaSeleccionada = this.listaGeneral.filter(
        (val) => val.expositor['nombre_comercial'].toLowerCase().includes(termino.toLowerCase()));
    }

    if (this.listaSeleccionada.length == 0) {
      this.busquedaisActive = true;
      this.listaSeleccionada = this.listaGeneral.filter(
        obj => {
          var isHere = false;
          obj.expositor.stands.forEach(element => {
            if (element.numeroStand.toLowerCase().includes(termino.toLowerCase())) isHere = true;
          })
          if (isHere) return obj;
        }
      )
    }

  }




  /*


  /*
  MODAL INFO
  */
  /*
   public Time = 0;
   public colorBarra;
   public porcentajeArmado = 0;
 */

  /*
  public calcularPorcentaje(): void {

    this.colorBarra = undefined;
    this.porcentajeArmado = 1200;
    let percent = $("#percentLabel").attr("style");
    if (percent == undefined) {
      percent = '--percent:0';
    }
    if (this.porcentajeArmado != percent.split(":")[1].slice(0, -1)) {
      this.porcentajeArmado = percent.split(":")[1].slice(0, -1);
      this.cambiarColorBarraPorcentaje(this.porcentajeArmado);
      this.updatePorcentajeArmado(this.porcentajeArmado);
    }
  }

  cambiarColorBarraPorcentaje(porcentaje: number): void {
    //rojo
    if (porcentaje < 30) {
      if (porcentaje > 20) {
        this.colorBarra = "rgb(213," + (porcentaje - 20) * 22 + ",18)";
      } else {
        this.colorBarra = "#D53512";
      }
    } else if (porcentaje >= 30 && porcentaje < 70) {
      ///amarillo
      if (porcentaje > 60) {
        this.colorBarra = "rgb(" + (213 - ((porcentaje - 60) * 22)) + "," + (198 - ((porcentaje - 60) * 3)) + ",18)"
      } else {
        this.colorBarra = "rgb(213,198,18)";
      }
    }
    else if (porcentaje >= 70 && porcentaje <= 99) {
      ///verde
      if (porcentaje > 91) {
        this.colorBarra = "rgb(15," + (171 - ((porcentaje - 90) * 8)) + "," + (porcentaje - 90) * 23 + ")"
      } else {
        this.colorBarra = "rgb(15,171,18)";
      }
    } else {
      ///azul
      this.colorBarra = "#0F64D5";
    }

    this.cambiarColor();
  }


  public cambiarColor() {
    idObjSelected.set({
      fill: this.colorBarra
    })
    this.canvas.renderAll();
  }


  updatePorcentajeArmado(porcentaje: number): void {
    this.Time = 1;
    var time = timer(2000);
    time.subscribe((n) => {
      if (n == 0) {
        this.Time = 0;
      }
    })
  }
*/

  private restartCanvasPosition() {
    var delta = new fabric.Point(0, 0);
    this.canvas.absolutePan(delta);
    this.canvas.zoomToPoint({ x: 0, y: 0 }, 1);
  }


  public ubicarStand(componente: Componente) {
    this.toqueFalso = true;
    this.restartCanvasPosition();
    $('#modalMap-Fill').modal('hide');
    var zoom = this.canvas.getZoom();
    zoom = 1.45;
    let xs = parseInt(componente.pleft.toString()) * 2;
    let ys = parseInt(componente.ptop.toString()) * 2;
    this.canvas.zoomToPoint({ x: xs, y: ys }, zoom);
    this.componentesInMap.forEach(element => {
      if (element.id == componente.id) {
        this.animateColorObject(componente, element);
      }
    });
  }




  /**
   * @Param componente=Stand seleccionado
   * @Param valor respectivo en canvas
   */
  private animateColorObject(componente, element) {
    element.canvas.item(0).animate('fill', colorSeleccion, {
      onChange: this.canvas.renderAll.bind(this.canvas),
      onComplete: () => {
        element.canvas.item(0).animate('fill', componente.fill, {
          onChange: this.canvas.renderAll.bind(this.canvas),
          onComplete: () => {
            element.canvas.item(0).animate('fill', colorSeleccion, {
              onChange: this.canvas.renderAll.bind(this.canvas),
              onComplete: () => {
                element.canvas.item(0).animate('fill', componente.fill, {
                  onChange: this.canvas.renderAll.bind(this.canvas),
                  onComplete: () => {
                    element.canvas.item(0).animate('fill', colorSeleccion, {
                      onChange: this.canvas.renderAll.bind(this.canvas),
                      onComplete: () => {
                        element.canvas.item(0).animate('fill', componente.fill, {
                          onChange: this.canvas.renderAll.bind(this.canvas),
                          onComplete: () => {
                            element.canvas.item(0).animate('fill', colorSeleccion, {
                              onChange: this.canvas.renderAll.bind(this.canvas),
                              onComplete: () => {
                                element.canvas.item(0).animate('fill', componente.fill, {
                                  onChange: this.canvas.renderAll.bind(this.canvas)
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            });
          }
        })
      }
    });
  }


  public chargeGeneral() {
    this.opcionSeleccionadaGR = 0;
    if (this.filtroMisClientes) {
      if (this.listaMisExpositores.length > 0) {
        this.listaSeleccionada = this.listaMisExpositoresGeneral
      }
    } else {
      this.listaSeleccionada = this.listaGeneral;
    }
  }

  public chargeMovimiento() {
    this.opcionSeleccionadaGR = 1;
    this.listaSeleccionada = this.listaMisExpositoresEspera;
  }

  public activateFunction() {
    this.toqueFalso = false;
  }


  public filtrarMisClientes() {
    this.filtroMisClientes = !this.filtroMisClientes;
    if (this.opcionSeleccionadaGR == 0) {
      if (this.filtroMisClientes) {
        this.listaSeleccionada = this.listaMisExpositoresGeneral;
      } else {
        this.listaSeleccionada = this.listaGeneral;
      }
    }
  }

  public toogleSimbologiaFunction() {
    this.simOpen = !this.simOpen;
  }


  @ViewChild('canvas', { static: false }) swipeCanvas: ElementRef;
  menuTopLeftPosition = { x: '0', y: '0' }

  // reference to the MatMenuTrigger in the DOM
  @ViewChild(MatMenuTrigger,) matMenuTrigger: MatMenuTrigger;

  /**
   * Method called when the user click with the right button
   * @param event MouseEvent, it contains the coordinates
   * @param item Our data contained in the row of the table
   */


  @HostListener('window:resize', ['$event'])
  onResize(event) {

    var width = (this.canvasContainer.nativeElement.offsetWidth > 0) ? this.canvasContainer.nativeElement.offsetWidth : screen.width;
    var height = (this.canvasContainer.nativeElement.offsetHeight > 0) ? this.canvasContainer.nativeElement.offsetHeight : screen.height;
    var delta = new fabric.Point(-width / 2 + width * 0.1, -100);
    this.canvas.absolutePan(delta);
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    this.canvas.renderAll();
  }



  public changeView() {
    var width = (this.canvasContainer.nativeElement.offsetWidth > 0) ? this.canvasContainer.nativeElement.offsetWidth : screen.width;
    var height = (this.canvasContainer.nativeElement.offsetHeight > 0) ? this.canvasContainer.nativeElement.offsetHeight : screen.height;
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    this.canvas.renderAll();
  }

  @ViewChild('canvasContainer')
  canvasContainer: ElementRef;

  ngAfterViewInit() { //Recién en este punto tendrás acceso al valor
    var width = (this.canvasContainer.nativeElement.offsetWidth > 0) ? this.canvasContainer.nativeElement.offsetWidth : screen.width;
    var height = (this.canvasContainer.nativeElement.offsetHeight > 0) ? this.canvasContainer.nativeElement.offsetHeight : screen.height;
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    this.canvas.renderAll();
  }


  onRightClick(event: MouseEvent, item: CarteraEvento) {
    // preventDefault avoids to show the visualization of the right-click menu of the browser
    event.preventDefault();
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';
    this.matMenuTrigger.menuData = { 'item': item }
    this.matMenuTrigger.menu.focusFirstItem('mouse');
    this.matMenuTrigger.openMenu();
    event.preventDefault();
  }
  public btn(ctxItem: CarteraEvento) {
    console.log(ctxItem);
  }

  logout() {
    this.storage.logout();
    this.router.navigate(['/']);
  }

  private wordBreak(x: string) {
    let a = x.split(' ')
    let w: string = '';
    a.forEach(word => {
      if (word.length > 4) {
        w = w + word + '\n';
      } else {
        w = w + word + ' ';
      }
    });
    return w;
  }
}


