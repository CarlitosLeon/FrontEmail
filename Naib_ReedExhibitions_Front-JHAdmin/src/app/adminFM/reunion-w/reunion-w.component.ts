import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Agenda } from 'src/app/models/Agenda';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { IncidenciaService } from 'src/app/menu-fm/service/incidencia.service';
import { element } from 'protractor';
import { AuthService } from 'src/app/users/service/auth.service';
import { AdminReunionService } from '../admin-reunion/service/adminReunion.service';
import { TratadoAcuerdo } from 'src/app/models/tratadoAcuerdo';
import { ReunionEvento } from 'src/app/models/reunionEvento';
import { BTEnvioReunion } from 'src/app/models/BTEnvioReunion';
import { envioW } from 'src/app/models/envioW';
declare var $: any;

@Component({
  selector: 'app-reunion-w',
  templateUrl: './reunion-w.component.html',
  styleUrls: ['./reunion-w.component.css']
})
export class ReunionWComponent implements OnInit {
  ////////////// Agenda/////////////////

  newinsertA: Agenda = new Agenda();
  public contactosAll: Array<Agenda> = new Array<Agenda>();
  formAgenda: FormGroup;
  public datosEjemplo: Array<Agenda> = new Array<Agenda>(); // Array<{nombre: string, numero: number, selecionado: boolean}> = [];
  ////////////// Btn_Envio_reunion/////////////////
  ////////////// Reunion_Evento/////////////////
  public cReunion: ReunionEvento;
  newInsert: envioW = new envioW();
  // newInsert: Array<{ phone: number, body: string }> = [];
  newRe: ReunionEvento = new ReunionEvento();
  public cContactoEnvio0: Array<BTEnvioReunion> = new Array<BTEnvioReunion>();
  ////////////// Tratado_Acuerdo/////////////////
  public cAcuerdos: Array<TratadoAcuerdo> = new Array<TratadoAcuerdo>();
  // tslint:disable-next-line: variable-name
  // public temas_Reunion = new FormControl('', Validators.required);
  //////////////// Whats//////////////////////////////
  mostrar: boolean;
  formWhats: FormGroup;
  precios: envioW[];
  datosCargados: Array<any> = new Array<any>();
  ///////////// CheckBox///////////////////////////////////
  // datosEjemplo: Array<any> = new Array<any>();
  datosSeleccionado: Array<any> = new Array<any>();
  // tslint:disable-next-line: variable-name
  public tTratar: Array<{ temas: string }> = [];
  ////////////////////////////////////////////////////////
  constructor(private menu: IncidenciaService,
    private router: Router,
    private authService: AuthService,
    private reunionService: AdminReunionService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.menu.setNombrePantalla('Reunion');
    this.validaForm();
    this.validaforAgenda();
    this.getAgendaEvento();
  }
  ///////////////////////////////////// Agenda////////////////////////////////////////////////////
  // tslint:disable-next-line: typedef
  public createAgenda() {
    this.newinsertA.nombre = this.formAgenda.controls.Nombre_Completo.value;
    this.newinsertA.numero = this.formAgenda.controls.Celular.value;
    this.newinsertA.rol = this.formAgenda.controls.rol.value;
    this.newinsertA.evento.id = this.authService.event.id;
    this.newinsertA.envio = false;

    this.reunionService.create(this.newinsertA, this.authService.event.id)
      .subscribe(c => {
        this.datosEjemplo.push(c);
        swal.fire(`${this.formAgenda.controls.Nombre_Completo.value}`, `Registrado con éxito`, 'success');
        $('#modal-lg').modal('hide');
        this.formAgenda.reset();
      });
  }
  private validaforAgenda() {
    this.formAgenda = this.fb.group({
      Nombre_Completo: ['', Validators.required],
      Celular: ['', [Validators.required, Validators.maxLength(12)]],
      rol: ['', Validators.required]
    });
  }

  // tslint:disable-next-line: member-ordering
  private dataAgenda: Array<Agenda> = new Array<Agenda>();
  getAgendaEvento() {
    this.reunionService.getAgendaEventoService(this.authService.event.id).subscribe(h => {
      h.forEach(c => {
        // tslint:disable-next-line: max-line-length
        this.dataAgenda.push({ id: c.id, nombre: c.nombre, rol: c.rol, numero: c.numero, creacion: c.creacion, envio: false, evento: c.evento });
      });
      this.datosEjemplo = this.dataAgenda;
    }, error => {
      this.errorHTTP(error.status);
    });
  }

  ///////////////// Check- Mostrar y ocultar/////////////////////////
  jh() {
    this.mostrar = true;
    // tslint:disable-next-line: no-shadowed-variable
    this.datosEjemplo.forEach(element => {
      const indexArrayEjemplo = this.datosEjemplo.findIndex(ejemplo => ejemplo.nombre === element.nombre);
      this.datosEjemplo[indexArrayEjemplo].envio = true;
    });

  }
  jh2() {
    this.mostrar = false;
    // tslint:disable-next-line: no-shadowed-variable
    this.datosEjemplo.forEach(element => {
      const indexArrayEjemplo = this.datosEjemplo.findIndex(ejemplo => ejemplo.nombre === element.nombre);
      this.datosEjemplo[indexArrayEjemplo].envio = false;
    });

  }
  ///////////////// Check/////////////////////////
  public checkBoxEj(x: any): void {
    const indexArrayEjemplo = this.datosEjemplo.findIndex(ejemplo => ejemplo.nombre === x.nombre);
    this.datosEjemplo[indexArrayEjemplo].envio = !this.datosEjemplo[indexArrayEjemplo].envio;



    this.valiarChe();
  }



  dSeleccionado() {
    this.mostrar = false;
    this.datosSeleccionado = [];
    let arr: Array<any> = new Array<any>();
    arr.slice(0, arr.length);
    // tslint:disable-next-line: no-shadowed-variable
    this.datosEjemplo.forEach(element => {
      // tslint:disable-next-line: triple-equals
      if (element.envio == true) {
        arr = this.datosSeleccionado.filter(x => {
          return x.nombre.toLowerCase().toString().includes(element.nombre.toLowerCase().toString());
        });
        // tslint:disable-next-line: triple-equals
        if (arr.length == 1) {

        } else {
          this.datosSeleccionado.push(element);
          this.mostrar = false;
        }
      }
    });

    this.enviar();
  }
  valiarChe() {
    return !this.datosEjemplo.some(datosEjemplo => datosEjemplo.envio);
  }
  enviar() {
    const fechaR = this.formWhats.controls.fecha_Reunion.value;
    const hors = this.formWhats.controls.hora_Reunion.value;
    const año = fechaR.slice(0, 4);
    const mes = fechaR.slice(5, 7);
    const dia = fechaR.substr(-2);
    const hr = hors.slice(0, 2);
    const min = hors.slice(3, 5);
    const horaA = new Date(Date.UTC(año, mes, dia, hr, min, 0));
    this.newRe.hora = horaA;
    this.newRe.nombre = this.formWhats.controls.alias_Reunion.value;
    this.newRe.lugar = this.formWhats.controls.lugar_Reunion.value;
    this.newRe.fecha = this.formWhats.controls.fecha_Reunion.value;
    this.newRe.status = 0;

    this.datosSeleccionado.forEach(element => {
      this.newRe.bitacora.push({ id: null, agenda: element, fecha_hora: this.formWhats.controls.fecha_Reunion.value, status: 0 });
    }, error => {
      this.errorHTTP(error.status);
    });

    this.cAcuerdos.forEach(element => {
      this.newRe.temas.push(element);
    });
    this.newRe.id = 2147483647;
    this.reunionService.createReunion(this.newRe, this.authService.event.id).subscribe(h => {
      this.cAcuerdos = [];
    });



    // tslint:disable-next-line: no-shadowed-variable
    this.datosSeleccionado.forEach(element => {
      this.create(element.numero);
    });
  }
  ///////////////////////////////////// Btn_Envio_Reunion///////////////////////////////////////////

  /////////////////////////////////////// Reunion_Evento///////////////////////////////////////
  private formatDate(x): any {
    const fecha = x;
    moment.locale('es');
    const dateTime = moment(fecha);
    const full2 = dateTime.format('LL');
    return full2;
  }
  private Hora(x): any {
    let time = x.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [x];
    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? '\tA.M.' : '\tP.M.';
      time[0] = +time[0] % 12 || 12;
    }
    return time.join('');

  }
  private validaForm() { // 3
    this.formWhats = this.fb.group({
      hora_Reunion: ['', Validators.required],
      temas_Reunion: ['', Validators.required],
      lugar_Reunion: ['', Validators.required],
      fecha_Reunion: ['', Validators.required],
      alias_Reunion: ['', Validators.required]
    });
  }
  // tslint:disable-next-line: ban-types
  private Temas(): String {
    const al = `Nombre de la reunion:\t *${this.formWhats.controls.alias_Reunion.value}* \n\n`;
    const fe = `Me dirijo ante usted con el fin de comunicarle que el Día\t *${this.formatDate(this.formWhats.controls.fecha_Reunion.value)}*, \t`;
    const lR = `solicitamos de su prestigiosa presencia en:\t*${this.formWhats.controls.lugar_Reunion.value}*, `;
    const tmas = `para llevar acabo los siguientes temas a tratar:\n`;
    let t = ``;
    const hr = `\nLa hora de reunion sera a las:\t*${this.Hora(this.formWhats.controls.hora_Reunion.value)}*\n`;
    const txt = '\nDeseo le sea de gran ayuda está información.\t Sin más por el momento, le agradezco de antemano\n';
    // tslint:disable-next-line: no-shadowed-variable
    this.cAcuerdos.forEach(element => {
      t += `\n-${element.descripcion}\n`;
    });
    return al + fe + lR + tmas + t + hr + txt;
  }

  // tslint:disable-next-line: typedef
  public loadBtnMinuta: boolean = false;
  public create(num) {
    this.loadBtnMinuta = true;
    // tslint:disable-next-line: no-shadowed-variable
    const message = { phone: this.newInsert.phone = num, body: this.Temas() };
    this.reunionService.sendWhatsApp(message)
      .subscribe(c => {
        if (c === false) {
          const Toast = swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            onOpen: (toast) => {
              toast.addEventListener('mouseenter', swal.stopTimer)
              toast.addEventListener('mouseleave', swal.resumeTimer)
            }
          });
          Toast.fire({
            icon: 'error',
            title: `Ocurrio un problema al envíar WhatsApp`
          });
        }
        this.loadBtnMinuta = false;
        swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Mensaje Enviado con Exito.',
          showConfirmButton: false,
          timer: 1500
        });
        this.cAcuerdos = [];
        this.tTratar = [];
        this.formWhats.reset();
        // tslint:disable-next-line: no-shadowed-variable
        this.datosEjemplo.forEach(element => {
          const indexArrayEjemplo = this.datosEjemplo.findIndex(ejemplo => ejemplo.nombre === element.nombre);
          this.datosEjemplo[indexArrayEjemplo].envio = false;
        });
      }, error => {
        this.errorHTTP(error.status);
      });
  }
  //////////////////////////// Tratado_Acuerdo/////////////////////////////////
  addAcuerdoCR() {
    this.cAcuerdos.push({ id: null, descripcion: this.formWhats.controls.temas_Reunion.value.trim(), tipo: 0 });
    this.formWhats.controls.temas_Reunion.reset();
  }
  deleteAcuerdoCR(i: number) {
    this.cAcuerdos.splice(i, 1);
  }
  ////////////////////////////////////// Buscador /////////////////////////////////////////////
  // tslint:disable-next-line: member-ordering
  // tslint:disable-next-line: no-inferrable-types
  // tslint:disable-next-line: member-ordering
  public vSearch: string = '';
  // tslint:disable-next-line: no-inferrable-types
  // tslint:disable-next-line: member-ordering
  public emptySearch: boolean = false;

  searchContact(x: string) {
    this.emptySearch = false;
    this.vSearch = x;
    this.datosEjemplo = this.dataAgenda;
    if (x !== '') {
      this.datosEjemplo = this.datosEjemplo.filter(c => c.nombre.toLowerCase().includes(x.toLowerCase()));
      if (this.datosEjemplo.length === 0) {
        this.emptySearch = true;
      }
    } else {
      // this.contactosAll = this.checkBoxEj;
    }
  }
  // tslint:disable-next-line: member-ordering




  // ErrorHTTP
  private errorHTTP(status: number) {
    if (status == 401) {
      this.authService.logout();
      this.router.navigate(['/']);
    } else if (status === 500) {
      const swalWithBootstrapButtons = swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success btn-sm'
        },
        buttonsStyling: false
      });
      swal.fire({
        customClass: {
          confirmButton: 'btn btn-info btn-sm'
        },
        title: 'Server Error.',
        buttonsStyling: false,
        html: '<img src=\'./assets/img_project/excepciones/error500.jpg\' class=\'img-fluid\' alt=\'Server Error\'>',
        confirmButtonText: 'Entiendo'
      });
    } else if (status === 0) {
      const swalWithBootstrapButtons = swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success btn-sm'
        },
        buttonsStyling: false
      });
      swal.fire({
        customClass: {
          confirmButton: 'btn btn-info btn-sm'
        },
        title: "",
        buttonsStyling: false,
        html: '<img src=\'./assets/img_project/excepciones/errorConexion.jpg\' class=\'img-fluid\' alt=\'Error de conexion\'>',
        confirmButtonText: 'Entiendo'
      });
    }
  }

}


