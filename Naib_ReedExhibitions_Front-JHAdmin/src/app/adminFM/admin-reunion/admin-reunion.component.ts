import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IncidenciaService } from 'src/app/menu-fm/service/incidencia.service';
import { Agenda } from 'src/app/models/Agenda';
import { BTEnvioReunion } from 'src/app/models/BTEnvioReunion';
import { ReunionEvento } from 'src/app/models/reunionEvento';
import { TratadoAcuerdo } from 'src/app/models/tratadoAcuerdo';
import { AuthService } from 'src/app/users/service/auth.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { AdminReunionService } from './service/adminReunion.service';
declare var $: any;

@Component({
  selector: 'app-admin-reunion',
  templateUrl: './admin-reunion.component.html',
  styleUrls: ['./admin-reunion.component.css']
})
export class AdminReunionComponent implements OnInit {
  // Loading
  public loadingReunion: boolean = false;

  // Data
  public reunionPendiente: Array<ReunionEvento> = new Array<ReunionEvento>();
  public reunionConcluida: Array<ReunionEvento> = new Array<ReunionEvento>();
  // Cerrar reunion
  public cReunion: ReunionEvento;
  public cTratados: Array<TratadoAcuerdo> = new Array<TratadoAcuerdo>();
  public cContactoEnvio0: Array<BTEnvioReunion> = new Array<BTEnvioReunion>();
  public addAcuerdo = new FormControl('', Validators.required);
  public cAcuerdos: Array<TratadoAcuerdo> = new Array<TratadoAcuerdo>();
  public btnCReunion: boolean = false;
  private cIndex: number;
  // Reunion Concluida
  public vDReunion: ReunionEvento;
  public vDTratados: Array<TratadoAcuerdo> = new Array<TratadoAcuerdo>();
  public vDAcuerdos: Array<TratadoAcuerdo> = new Array<TratadoAcuerdo>();
  public vDContactoEnvio1: Array<BTEnvioReunion> = new Array<BTEnvioReunion>();
  //Contactos
  public contactosAll: Array<Agenda> = new Array<Agenda>();


  constructor(private authService: AuthService,
    private router: Router,
    private menu: IncidenciaService,
    private reunionService: AdminReunionService) { }

  ngOnInit(): void {
    this.menu.setNombrePantalla('MIS REUNIONES');
    this.getAllReuniones();
  }

  private getAllReuniones() {
    this.reunionPendiente = [];
    this.reunionConcluida = [];
    this.loadingReunion = true;
    this.reunionService.getReunionesService(this.authService.event.id).subscribe(h => {
      h.forEach(element => {
        if (element.status === 0) {
          this.reunionPendiente.push(element);
        } else if (element.status === 1) {
          this.reunionConcluida.push(element);
        }
      });
      this.loadingReunion = false;
    }, error => {
      this.errorHTTP(error.status);
    });
  }

  modalCReunion(x: ReunionEvento, i: number) {
    this.cReunion = x;
    this.cIndex = i;
    this.cTratados = [];
    this.cTratados = this.cReunion.temas.filter(r => r.tipo === 0);
    this.cContactoEnvio0 = [];
    this.cContactoEnvio0 = this.cReunion.bitacora.filter(a => a.status === 0);
  }

  addAcuerdoCR() {
    this.cAcuerdos.push({ id: null, descripcion: this.addAcuerdo.value.trim(), tipo: 1 });
    this.addAcuerdo.reset();
  }

  deleteAcuerdoCR(i: number) {
    this.cAcuerdos.splice(i, 1);
  }

  private bodyPendiente(): string {
    const s = `Buen día. \n`;
    const d = `Hacemos de su conocimiento los temas tratados y los acuerdos de la reunión *${this.cReunion.nombre}* `;
    const d2 = `que se llevó a cabo en la fecha *${this.formatDate(this.cReunion.fecha)}* en *${this.cReunion.lugar}*\n\n`;
    const x = `*Los temas a tratar son:*\n\n`;
    let t = '';
    const x2 = `\n*Los acuerdos son:* \n\n`;
    let a = '';
    const f = `\nEsperamos le sea de gran ayuda está información, de no ser así responda este mensaje.`;
    this.cReunion.temas.forEach(element => {
      if (element.tipo === 0) {
        t += `-${element.descripcion}\n`;
      } else if (element.tipo === 1) {
        a += `-${element.descripcion}\n`;
      }

    });

    return s + d + d2 + x + t + x2 + a + f;
  }

  cerrarReunion() {
    this.btnCReunion = true;
    this.cAcuerdos.forEach(element => {
      this.cReunion.temas.push(element);
    });
    this.cContactoEnvio0.forEach(element => {
      const message = { phone: element.agenda.numero, body: this.bodyPendiente() };
      this.reunionService.sendWhatsApp(message).subscribe(w => {
        if (w.sent == false) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            onOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
          });
          Toast.fire({
            icon: 'error',
            title: `Ocurrio un problema al envíar WhatsApp al número ${element.agenda.numero}`
          });
        }
      }, error => {
        this.errorHTTP(error.status);
      });
    });
    this.reunionService.putCerrarReunionService(this.cReunion).subscribe(h => {
      this.cAcuerdos = [];
      this.btnCReunion = false;
      this.getAllReuniones();
      this.loadBtnMinuta = false;
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se ha enviado la minuta de la reunión a los invitados.',
        showConfirmButton: true
      });
      $('#modal-CR').modal('hide');

    }, error => {
      this.errorHTTP(error.status);
    });
  }

  verDRConcluida(x: ReunionEvento) {
    this.vDReunion = x;
    this.vDTratados = [];
    this.vDTratados = this.vDReunion.temas.filter(r => r.tipo === 0);
    this.vDAcuerdos = [];
    this.vDAcuerdos = this.vDReunion.temas.filter(a => a.tipo === 1);
    this.vDContactoEnvio1 = [];
    // this.vDContactoEnvio1 = this.vDReunion.bitacora.filter(c => c.status === 1);
    this.vDReunion.bitacora.filter(c => c.status === 1).forEach(element => {
      if (this.vDContactoEnvio1.find(n => n.agenda.numero === element.agenda.numero)) {
      } else {
        this.vDContactoEnvio1.push(element);
      }
    });
    this.cleanAgenda();
    this.getAgendaEvento();
  }

  private cleanAgenda() {
    this.contactosAll = [];
    this.checkTrue = [];
    this.dataAgenda = [];
  }

  private dataAgenda: Array<Agenda> = new Array<Agenda>();
  getAgendaEvento() {
    this.reunionService.getAgendaEventoService(this.authService.event.id).subscribe(h => {
      h.forEach(c => {
        this.dataAgenda.push({ id: c.id, nombre: c.nombre, rol: c.rol, numero: c.numero, creacion: c.creacion, envio: false, evento: c.evento });
      });
      this.contactosAll = this.dataAgenda;
      this.checkTrue = this.dataAgenda;
    }, error => {
      this.errorHTTP(error.status);
    });
  }

  public vSearch: string = '';
  public emptySearch: boolean = false;
  searchContact(x: string) {
    this.vCAll = true;
    this.emptySearch = false;
    this.vSearch = x;
    this.contactosAll = this.dataAgenda;
    if (x !== '') {
      this.contactosAll = this.contactosAll.filter(c => c.nombre.toLowerCase().includes(x.toLowerCase()));
      if (this.contactosAll.length === 0) {
        this.emptySearch = true;
      }
    } else {
      this.contactosAll = this.checkTrue;
      this.vCAll = false;
    }
  }

  public checkTrue: Array<Agenda> = new Array<Agenda>();
  checkContacto(x: Agenda) {
    this.checkTrue.forEach(element => {
      if (element.numero === x.numero) {
        element.envio = !element.envio;
      }
    });
    this.vBtnEnvio();
  }

  vCAll: boolean = false;
  checkAllContacts(e) {
    if (e) {
      this.checkTrue.forEach(x => {
        x.envio = true;
      });
    } else {
      this.checkTrue.forEach(x => {
        x.envio = false;
      });
    }
  }

  vCheckedAll(): boolean {
    let v = 0;
    this.checkTrue.forEach(x => {
      if (x.envio) {
        v += 1;
      }
    });
    if (v === this.checkTrue.length) {
      return true;
    }
    return false;
  }

  public vBtnEnvio(): boolean {
    let n: number = 0;
    this.checkTrue.forEach(element => {
      if (element.envio) {
        n += 1;
      }
    });
    if (n > 0) {
      return true;
    }
    return false;
  }

  private bodyConcluida(): string {
    const s = `Buen día. \n`;
    const d = `Hacemos de su conocimiento los temas tratados y los acuerdos de la reunión *${this.vDReunion.nombre}* `;
    const d2 = `que se llevó a cabo en la fecha *${this.formatDate(this.vDReunion.fecha)}* en *${this.vDReunion.lugar}*\n\n`;
    const x = `*Los temas a tratar son:*\n\n`;
    let t = '';
    const x2 = `\n*Los acuerdos son:* \n\n`;
    let a = '';
    const f = `\nEsperamos le sea de gran ayuda está información, de no ser así responda este mensaje.`;
    this.vDReunion.temas.forEach(element => {
      if (element.tipo === 0) {
        t += `-${element.descripcion}\n`;
      } else if (element.tipo === 1) {
        a += `-${element.descripcion}\n`;
      }

    });

    return s + d + d2 + x + t + x2 + a + f;
  }

  private formatDate(x): any {
    const fecha = x;
    moment.locale('es');
    const dateTime = moment(fecha);
    const full2 = dateTime.format('LL');
    return full2;
  }

  public loadBtnMinuta: boolean = false;
  public sendMinuta() {
    this.loadBtnMinuta = true;
    this.checkTrue.forEach(element => {
      if (element.envio) {
        const message = { phone: element.numero, body: this.bodyConcluida() };
        this.reunionService.sendWhatsApp(message).subscribe(w => {
          if (w.sent === false) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 4000,
              timerProgressBar: true,
              onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            });
            Toast.fire({
              icon: 'error',
              title: `Ocurrio un problema al envíar WhatsApp al número ${element.numero}`
            });
          }
          $('#modal-vD').modal('hide');
        });
      }
    });
    this.loadBtnMinuta = false;
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Se ha enviado la minuta nuevamente.',
      showConfirmButton: false,
      timer: 1500
    });
  }




  // ErrorHTTP
  private errorHTTP(status: number) {
    if (status == 401) {
      this.authService.logout();
      this.router.navigate(['/']);
    } else if (status == 500) {
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
