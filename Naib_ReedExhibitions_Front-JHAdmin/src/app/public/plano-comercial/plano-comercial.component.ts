import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { PlanoComercialService } from './plano-comercial.service';
import { StandReferencia } from 'src/app/models/StandReferencia';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Componente } from 'src/app/models/Componente';
import Swal from "sweetalert2";
import 'fabric';
import { environment } from 'src/environments/environment.prod';
import { NgxSpinnerService } from 'ngx-spinner';
declare let fabric;
declare var $: any;

@Component({
  selector: 'app-plano-comercial',
  templateUrl: './plano-comercial.component.html',
  styleUrls: ['./plano-comercial.component.css']
})
export class PlanoComercialComponent implements OnInit {
  //Data
  private data: Array<StandReferencia> = new Array<StandReferencia>();
  public Expositores: Array<StandReferencia> = new Array<StandReferencia>();
  private components: Array<Componente> = new Array<Componente>();

  //Buscador
  search = new FormControl('');
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  isFind: boolean = false;

  //Element HTML
  sidenavLeft: boolean = false;
  @ViewChild('divCanvas', { static: true }) divCanvas: ElementRef;

  //Canvas
  private canvas = new fabric.Canvas('canvas');
  private backgroundColor = '#F0F8FF';
  private colorVacio = '#b6b8ba';
  private metricContext: any;
  private grosorMargen = 1;
  private fontFamily = 'sans-serif';//Berlin Sans FB
  private fontSize = 18;
  private colorTextoNormal = '#00000';//#343434 //#2b2828

  private idE: number = 1;

  //Detalle Exp
  selectExpositor: StandReferencia = null;
  stsAsignacion: string = null;
  urlImgExp: string = `${environment.endPointBack}/ventasProspectos/getImgExpositor/`;

  //Reservacion
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = true;

  constructor(private service: PlanoComercialService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService) { }


  ngOnInit(): void {
    this.configCanvas();
    this.getData();
    this.filtroSearch();
    //this.getComponents();
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  private getData() {
    this.spinner.show('spinnerGlobal');
    this.service.getData(this.idE).subscribe(h => {
      ////console.log(h);
      this.data = h;
      h.forEach(element => {
        let exist = this.options.includes(element.expositor.nombre_comercial);
        if (!exist) {
          this.options.push(element.expositor.nombre_comercial);
          this.Expositores.push(element);
        }
      });

      this.Expositores.forEach(element => {
        element.expositor.numStandEvento = this.getStandExp(element.expositor.id);
      });
      this.spinner.hide('spinnerGlobal');
    }, errorH => {
      this.errorHTTP(errorH.status);
    });
  }

  private configCanvas() {
    this.canvas = new fabric.Canvas('canvas', {
      width: this.divCanvas.nativeElement.clientWidth,
      height: screen.height * .798,
      hoverCursor: 'pointer',
      selection: false,
      allowTouchScrolling: true
      //backgroundColor: this.backgroundColor,
      //backgroundImage: './assets/ventas/contorno.svg',
      //defaultCursor: 'hand',
    });

    this.metricContext = this.canvas.getContext("2d");
    this.metricContext.font = this.fontFamily;
    ////console.log(this.canvas);
    this.backgroundCanvas();
    this.mouseDown();
    this.mouseMove();
    this.mouseUp();
    this.hoverObjeto();
    this.outObjeto();
    this.centerZoom();
    //this.touchC();
    //this.configPoint((this.divCanvas.nativeElement.clientWidth / 2) / 2, 0);
    this.zoomCanvas();
    this.canvas.renderAll();

    let t$ = timer(0);
    t$.subscribe(tx => {
      this.getComponents();
    });
  }

  private leftBackground: number = -95;
  private topBackground: number = -140;
  private backgroundCanvas() {
    let url = './assets/ventas/planoBorder.svg';
    fabric.Image.fromURL(url, (img) => {
      img.set({
        left: this.leftBackground,
        top: this.topBackground,
        // width: 1500,
        // height: 1500
      });
      img.scaleToHeight(760);
      img.scaleToWidth(760);
      this.canvas.backgroundImage = img;
      this.canvas.renderAll();
    });
  }


  private getComponents() {
    this.spinner.show('spinnerGlobal');
    this.service.getComponents(this.idE).subscribe(h => {
      h.forEach((element, index) => {
        this.newDraw(element);
        if ((index + 1) == h.length) {
          this.assignedStand();
          this.canvas.renderAll();
        }
      });
    }, errorH => {
      this.errorHTTP(errorH.status);
    });
  }

  private assignedStand() {
    //let c: string[] = ['', '#F2C3BB', '#F2C3BB', '#BC6761']
    this.data.forEach((element, index) => {
      let x = this.canvas._objects.find(o => o.idComH == element.componente.id);
      let indice = this.canvas._objects.indexOf(o => o.idComH == element.componente.id);
      x._objects[0].fill = '#F2C3BB';
      x._objects[0].stroke = '#6a6a6b';
      var width = element.componente.width;
      var height = element.componente.height;
      // let metrics = this.metricContext.measureText((element.expositor.razon_social + this.fontSize).toString() + '');
      let razon_social = this.wordBreak(element.expositor.razon_social);
      var text: any;

      let size = width - (width * 0.95);
      text = new fabric.Text(`${razon_social}`, {
        //angle: 90,
        fontFamily: this.fontFamily,
        fill: this.colorTextoNormal,
        originX: 'center',
        originY: 'center',
        fontSize: size,
        selectable: false,
        textAlign: 'center'
      })

      x.add(text);
      let texto = x._objects[1];
      x.remove(x.item(1));
      x.add(texto);
      this.canvas.renderAll();

      if ((index + 1) == this.data.length) {
        this.spinner.hide('spinnerGlobal');
        
      }
    });
  }


  numStandSelect: string = '';
  private moveCanvas: boolean = false;
  private pX = 0;
  private pY = 0;
  mouseDown() {
    this.canvas.on('mouse:down', (options) => {//Importante se quita funcion y se vuelve compatible
      // //console.log(options);
      if (options.target != null) {
        if (options.target.type == 'group') {
          this.moveCanvas = false;
          this.selectExpositor = null;
          this.stsAsignacion = null;
         // //console.log(options);
          this.numStandSelect = options.target.numStandH;
          ///Color selección
          // let color = options.target._objects[0].fill;
          // options.target._objects[0].set({ fill: '#f9c426' })
          // this.canvas.renderAll();
          // let showColor$ = timer(1000);
          // showColor$.subscribe(val => {
          //   options.target._objects[0].set({ fill: color });
          //   this.canvas.renderAll();
          // });
          ///
          this.findAsigned(options.target.idComH, options.target.numStandH);
          let s = this.data.find(x => x.componente.numeroStand == options.target.numStandH);
          if (s != null && this.selectExpositor != null) {
            this.stsAsignacion = s.estatus_asignacion;
          }
          //
          $('#detailModalPC').modal('show');
        }
      } else {
        this.pX = options.absolutePointer.x;
        this.pY = options.absolutePointer.y;
        this.moveCanvas = true;
      }
    });
  }

  mouseUp() {
    this.canvas.on('mouse:up', (options) => {//Importante se quita funcion y se vuelve compatible
      ////console.log(options);
      if (options.target == null) {
        this.moveCanvas = false;
      }
    });
  }

  private fillHover: string;
  private strokeHover: string;

  private hoverObjeto() {//Color hover dentro de stand #9a9a80, Borde #5c5b38
    this.canvas.on('mouse:over', (options) => {
      ////console.log(this.canvas);
     // //console.log(options);
      if (options.target != null) {
        if (options.target.type == 'group' && options.target.idComH != null) {
          this.fillHover = options.target._objects[0].fill;
          this.strokeHover = options.target._objects[0].stroke;
          options.target._objects[0].set({ fill: '#BC6761', stroke: '#525050', strokeWidth: 1, opacity: 0.8 })
          this.deleteTooltipJH();
          this.selectExpositor = null;
          this.findAsigned(options.target.idComH, options.target.numStandH);
          let nComercial = '';
          let url = "";
          if (this.selectExpositor == null) {
            nComercial = "Reservame"
            url = "./assets/img_project/check_40622.png";
          } else {
            nComercial = this.selectExpositor.expositor.nombre_comercial;
            url = `${environment.endPointBack}/ventasProspectos/getImgExpositor/${this.selectExpositor.expositor.logo}`;
          }



          var rect = new fabric.Rect({
            // left: parseInt(options.target.left),
            // top: parseInt(options.target.top) - 15,
            fill: '#212121',
            stroke: '#546E7A',
            opacity: 0.7,
            strokeWidth: this.grosorMargen,
            width: 105,
            height: 23,
            hasControls: false,
            selectable: false,
            lockMovementX: true,
            lockMovementY: true,
            rx: 8,
            ry: 8,
            // scaleY: 0.5,
            originX: 'center',
            originY: 'center',
          });

          var text = new fabric.Text(`${options.target.numStandH} - ${nComercial}`, {
            fontFamily: this.fontFamily,
            fill: "#ffff",
            // left: parseInt(options.target.left),
            // top: parseInt(options.target.top),
            fontSize: 14,
            originX: 'center',
            originY: 'center',
            selectable: false,
          });

          var group = new fabric.Group([rect, text], {
            selectable: false,
            hasControls: false,
            lockMovementX: true,
            lockMovementY: true,
            left: parseInt(options.target.left) - 50,
            top: parseInt(options.target.top) - 20,
            nameJH: 'TooltipJH'
            // idComH: element.id,
            // numStandH: element.numeroStand
          });

          //this.canvas.add(group);
          this.canvas.renderAll();

        }
      }

    });
  }

  deleteTooltipJH() {
    let i = this.canvas._objects.filter(o => o.nameJH == "TooltipJH");
   // //console.log(i)
    i.forEach(element => {
      this.canvas.remove(element)
    });
    this.canvas.renderAll();
  }

  outObjeto() {
    this.canvas.on('mouse:out', (options) => {
      ////console.log(options);
      if (options.target != null) {
        if (options.target.type == 'group' && options.target.idComH != null) {
          options.target._objects[0].set({ fill: this.fillHover, stroke: this.strokeHover, strokeWidth: 1 })
          this.canvas.renderAll();
          // e.target.set('fill', '#ffff');
          let i = this.canvas._objects.filter(o => o.nameJH == "TooltipJH");
          ////console.log(i)
          i.forEach(element => {
            this.canvas.remove(element)
          });

          //this.canvas.setCursor("hand");
          this.canvas.renderAll();

        }

      }
    });
  }

  private mouseMove() {
    this.canvas.on('mouse:move', (options) => {
      // //console.log(options);
      if (this.moveCanvas) {
        this.canvas.setCursor('grabbing');
        if (options.e.type == 'mousemove' && (options.e.movementX != undefined && options.e.movementY != undefined)) {
          let delta = new fabric.Point(options.e.movementX, options.e.movementY);
          // //console.log(delta)
          this.canvas.relativePan(delta);
        } else if (options.e.type == 'touchmove') {
          let delta = new fabric.Point((options.absolutePointer.x) - this.pX, (options.absolutePointer.y) - this.pY);
          // //console.log(delta)
          this.canvas.relativePan(delta);
        }
      }
    });
  }


  plusZoom() {
    var zoom = this.canvas.getZoom();
    let center = this.canvas.getCenter();
    if (zoom < 20) {
      this.canvas.zoomToPoint({ x: center.left, y: center.top }, zoom + 0.5);
    }
   // //console.log(zoom)
  }

  minusZoom() {
    var zoom = this.canvas.getZoom();
    let center = this.canvas.getCenter();
    if (zoom > 0.5) {
      this.canvas.zoomToPoint({ x: center.left, y: center.top }, zoom - 0.5);
    }
    ////console.log(zoom)
  }

  centerZoom() {
    this.canvas.setZoom(1);
    let center = this.canvas.getCenter();
    //console.log(center)
    let delta = new fabric.Point((-center.left / 2) - (-this.leftBackground), this.topBackground);
    this.canvas.absolutePan(delta);
  }

  private zoomCanvas() {
    this.canvas.on('mouse:wheel', (options) => {
      //console.log(options);
      var delta = options.e.deltaY;
      var zoom = this.canvas.getZoom();
      //console.log(zoom)
      if (zoom >= (0.3)) {
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        this.canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, zoom);
        options.e.preventDefault();
        options.e.stopPropagation();
      } else {
        this.canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, (0.3));
      }

    })
  }


  private findAsigned(idC: number, stand: string) { //Busca Expositor y selecciona
    let exp = this.Expositores.find(x => x.componente.id == idC || x.expositor.numStandEvento.includes(stand));
    ////console.log(exp);
    if (exp != null || exp != undefined) {
      this.selectExpositor = exp;
    }
  }

  seleccionarModal(x: StandReferencia) {
    // //console.log(x);
    this.stsAsignacion = null;
    this.findAsigned(x.componente.id, x.componente.numeroStand);
    $('#detailModalPC').modal('show');
  }

  findStands: boolean = false;
  findStandsMap(stand: string[]) {
    this.centerZoom()
    //console.log(stand);
    if (!this.findStands) {
      this.findStands = true;
      $('#detailModalPC').modal('hide');
      let f1 = '#f9c426';
      let f2 = '#ffffff';
      stand.forEach(element => {
        let c = this.canvas._objects.find(x => x.numStandH == element);
        let f0 = c.item(0).fill;
        c.item(0).animate('fill', f1, {
          onChange: this.canvas.renderAll.bind(this.canvas),
          duration: 1000,
          onComplete: () => {
            let url = `./assets/ventas/pin.svg`;
            fabric.Image.fromURL(url, (img) => {

              img.set({
                originX: 'center',
                originY: 'bottom',
              })
              img.scaleToHeight(30);
              img.scaleToWidth(30);
              c.add(img);
            })
            c.item(0).animate('fill', f2, {
              onChange: this.canvas.renderAll.bind(this.canvas),
              duration: 2000,
              onComplete: () => {
                c.item(0).animate('fill', f1, {
                  onChange: this.canvas.renderAll.bind(this.canvas),
                  duration: 2000,
                  onComplete: () => {
                    c.item(0).animate('fill', f2, {
                      onChange: this.canvas.renderAll.bind(this.canvas),
                      duration: 2000,
                      onComplete: () => {
                        c.item(0).animate('fill', f1, {
                          onChange: this.canvas.renderAll.bind(this.canvas),
                          duration: 2000,
                          onComplete: () => {
                            c.item(0).animate('fill', f0, {
                              onChange: this.canvas.renderAll.bind(this.canvas),
                              duration: 3000,
                              onComplete: () => {
                                c.remove(c.item(3))
                                this.findStands = false;
                                this.canvas.renderAll();
                              }
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
        })
      })
    }
  }

  private newDraw(element: any) {
    var rect = new fabric.Rect({
      left: parseInt(element.pleft),
      top: parseInt(element.ptop),
      // fill: this.colorVacio,//#e2e2d3
      fill: '#FFFF',
      stroke: '#6a6a6b',//#b6b59c S #F2C3BB #777575 #9db3cb
      strokeWidth: this.grosorMargen,
      width: parseInt(element.width),
      height: parseInt(element.height),
      hasControls: false,
      selectable: false,
      lockMovementX: true,
      lockMovementY: true
    });

    var width = parseInt(element.width);
    var height = parseInt(element.height);
    let metrics = this.metricContext.measureText((element.numeroStand + this.fontSize).toString() + '');
    ////console.log(metrics);
    var text: any;
    if (metrics.width <= width - 10) {
      // //console.log(metrics);
      // //console.log(width);
      // //console.log(element.numeroStand);
      let size1 = 0;
      if (width > height) {
        size1 = height - (height * 0.75);
      } else if (height > width) {
        size1 = height - (height * 0.90);
      } else {
        size1 = height - (height * 0.85);
      }

      text = new fabric.Text(element.numeroStand + ' ', {
        fontFamily: this.fontFamily,
        fill: this.colorTextoNormal,
        left: parseInt(element.pleft) + 1,
        top: parseInt(element.ptop) + 1,
        fontSize: size1,
        selectable: false
      });
    } else if (metrics.width > width - 10) {
      if (this.fontSize + 3 > height) {
        let size2 = height - (height * 0.75);
        text = new fabric.Text(element.numeroStand + ' ', {
          fontFamily: this.fontFamily,
          fill: this.colorTextoNormal,
          left: parseInt(element.pleft) + 1,
          top: parseInt(element.ptop) + 1,
          fontSize: size2,
          selectable: false
        });
      } else {
        let size3 = height - (height * 0.87);
        text = new fabric.Text(element.numeroStand + ' ', {
          //angle: 90,
          fontFamily: this.fontFamily,
          fill: this.colorTextoNormal,
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
      lockMovementY: true,
      idComH: element.id,
      numStandH: element.numeroStand
    });

    this.canvas.add(group);
  }


  private getStandExp(idE: number): string[] {
    let s: string[] = [];
    let x = this.data.filter(h => h.expositor.id == idE);
    x.forEach(element => {
      s.push(element.componente.numeroStand);
    });
    return s;
  }

  symbology() {
    const swalWithBootstrapButtons = Swal.mixin({
      buttonsStyling: false
    });
    Swal.fire({
      customClass: {
        confirmButton: 'btn btn-xs btn-light elevation-1'
      },
      title: "",
      buttonsStyling: false,
      html: `<div class="text-center" style="font-size: 12px;">
                <div class="form-inline">
                  <div class="rounded p-3" style="background-color: #fff; border: 1px solid #6a6a6b;"></div>
                    <div class="ml-2">Stand libre</div>
                </div> 
                <div class="form-inline mt-3">
                  <div class="rounded p-3" style="background-color: #F2C3BB; border: 1px solid #6a6a6b;"></div>
                  <div class="ml-2">Stand ocupado</div>
              </div>  
              <div class="form-inline mt-3">
                  <div class="rounded p-3" style="background-color: #BC6761; border: 1px solid #525050; opacity: 0.8"></div>
                  <div class="ml-2">Stand seleccionado</div>
              </div>   
            </div>`,
      confirmButtonText: 'Entiendo'
    });
  }


  findList() {
    this.search.disable();
    this.isFind = true;
    this.Expositores = this.Expositores.filter(h => h.expositor.nombre_comercial.toLowerCase().includes(this.search.value.toLowerCase())
      || h.expositor.numStandEvento.toString().toLowerCase().includes(this.search.value.toLowerCase())
      || h.expositor.razon_social.toLowerCase().includes(this.search.value.toLowerCase()));
  }

  clearSearch() {
    this.isFind = false;
    this.search.setValue('');
    this.search.enable();
    this.Expositores = [];
    this.allDataExp();
  }

  private allDataExp() {
    let e: number[] = [];
    this.data.forEach(element => {
      let exist = e.includes(element.expositor.id);
      if (!exist) {
        e.push(element.expositor.id);
        this.Expositores.push(element);
      }
    });

    this.Expositores.forEach(element => {
      element.expositor.numStandEvento = this.getStandExp(element.expositor.id);
    });
  }

  filtroSearch() {
    this.filteredOptions = this.search.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    var width = (this.divCanvas.nativeElement.offsetWidth > 0) ? this.divCanvas.nativeElement.offsetWidth : screen.width;
    var height = (this.divCanvas.nativeElement.offsetHeight > 0) ? this.divCanvas.nativeElement.offsetHeight : screen.height;
    var delta = new fabric.Point(-width / 2 + width * 0.1, -100);
    this.canvas.absolutePan(delta);
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    this.canvas.renderAll();
  }

  // ErrorHTTP
  private errorHTTP(status: number) {
    if (status == 500) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success btn-sm'
        },
        buttonsStyling: false
      });
      Swal.fire({
        customClass: {
          confirmButton: 'btn btn-info btn-sm'
        },
        title: "Server Error.",
        buttonsStyling: false,
        html: "<img src='./assets/img_project/excepciones/error500.jpg' class='img-fluid' alt='Server Error'>",
        confirmButtonText: 'Entiendo'
      });
    } else if (status == 0) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success btn-sm'
        },
        buttonsStyling: false
      });
      Swal.fire({
        customClass: {
          confirmButton: 'btn btn-info btn-sm'
        },
        title: "",
        buttonsStyling: false,
        html: "<img src='./assets/img_project/excepciones/errorConexion.jpg' class='img-fluid' alt='Error de conexion'>",
        confirmButtonText: 'Entiendo'
      });
    }
  }

}
