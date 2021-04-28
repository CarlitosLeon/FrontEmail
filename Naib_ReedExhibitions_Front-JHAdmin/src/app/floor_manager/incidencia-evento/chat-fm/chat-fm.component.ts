import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IncidenciaChatService } from './service/incidencia-chat.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/users/service/auth.service';
import { HttpEventType } from '@angular/common/http';
import { ChatIncidencia } from '../../../models/Chat_Incidencia';
import { formatDate } from '@angular/common';
import { interval, timer } from 'rxjs';
import { IncidenciaService } from 'src/app/menu-fm/service/incidencia.service';
import { environment } from 'src/environments/environment.prod';
import { Incidencia } from 'src/app/models/Incidencia';
declare var $: any;

interface ProcesoIncidencia {
  valor: string;
  nombre: string;
}

@Component({
  selector: 'app-chat-fm',
  templateUrl: './chat-fm.component.html',
  styleUrls: ['./chat-fm.component.css']
})
export class ChatFMComponent implements OnInit, OnDestroy {

  constructor(private ruta: ActivatedRoute,
    private incidenciaChatService: IncidenciaChatService,
    private authService: AuthService,
    private router: Router,
    private headerMenu: IncidenciaService) { }

  //Parametros
  private idI: number = this.ruta.snapshot.params.idI;
  private tipo: string = this.ruta.snapshot.params.type;
  //Datos Front
  incidenciaR: Incidencia;
  incidenciaG: Incidencia;
  conversationI: Array<ChatIncidencia> = new Array<ChatIncidencia>();
  idUser: number;
  //Validaciones
  tipoInc: boolean = false;//true = referenciada, false = general
  //Select proceso incidencia
  processInc: Array<ProcesoIncidencia> = new Array<ProcesoIncidencia>();
  //loading
  loadingUpdIR: boolean = false;
  loadingMessage: boolean = true;
  //img
  private imgSeleccionada: File;
  private showImg: any;
  //Message
  txtMessage: string = "";
  private chatMessage: ChatIncidencia = new ChatIncidencia();
  //scroll
  scrollChat: any;
  //refresh
  private refreshConversation$ = interval(10000);
  subscribeRefresh = this.refreshConversation$.subscribe(val => this.getConversationRefresh());
  //urlImg
  urlImg: string = `${environment.endPointBack}/chat/getMessage/img/`;

  ngOnInit(): void {
    this.headerMenu.setNombrePantalla("Conversación de incidencia");
    this.validateParameter();
    this.processInc.push({ valor: '0', nombre: 'No inciada' }, { valor: '1', nombre: 'En proceso' }, { valor: '2', nombre: 'Terminada' });
    this.idUser = this.authService.user.id;

  }

  ngOnDestroy() {
    this.subscribeRefresh.unsubscribe();
  }

  private validateParameter() {
    if (this.idI != null && this.tipo != null && this.idI > 0 && this.tipo == "referenciada" || this.tipo == "general") {
      this.getIncidenciaData();
      this.getConversationStart();
    } else {
      this.router.navigate(['/incidencias']);
    }
  }

  private getConversationStart() {
    this.loadingMessage = true;
    if (this.idI != null && this.idI > 0) {
      this.incidenciaChatService.getConversation(this.idI).subscribe(h => {
        this.conversationI = h;
        this.loadingMessage = false;
        this.scroll();
      }, error => {
        this.errorHTTP(error.status);
      })
    }
  }

  private getConversationload() {
    if (this.idI != null && this.idI > 0) {
      this.incidenciaChatService.getConversation(this.idI).subscribe(h => {
        this.conversationI = h;
        this.scroll();
      }, error => {
        this.errorHTTP(error.status);
      })
    }
  }

  private getConversationRefresh() {
    if (this.idI != null && this.idI > 0) {
      this.incidenciaChatService.getConversation(this.idI).subscribe(h => {
        if (h.length != this.conversationI.length) {
          this.conversationI = h;
          this.scroll();
          this.getIncidenciaRefreshSTS();
        }
      }, error => {
        this.errorHTTP(error.status);
      })
    }
  }

  private getIncidenciaRefreshSTS() {
    if (this.tipo == 'referenciada') {
      this.tipoInc = true;
      this.incidenciaChatService.getIncidenciaReferenciadaTicket(this.idI).subscribe((h) => {
        if (h.tipoIncidencia != "1") {
          this.router.navigate(['/incidencias']);
        }
        if (this.incidenciaR.status != h.status) {
          this.incidenciaR = h;
        }
      }, error => {
        this.errorHTTP(error.status);
        if (error.status == 0) {
          this.router.navigate(['/incidencias']);
        }

      });
    } else if (this.tipo == 'general') {
      this.tipoInc = false;
      this.incidenciaChatService.getIncidenciaGeneralTicket(this.idI).subscribe((h) => {
        if (h.tipoIncidencia != "2") {
          this.router.navigate(['/incidencias']);
        }
        if (this.incidenciaG.status != h.status) {
          this.incidenciaG = h;
        }

      }, error => {
        this.errorHTTP(error.status);
        if (error.status == 0) {
          this.router.navigate(['/incidencias']);
        }
      });
    }
  }

  private getIncidenciaData() {
    if (this.tipo == 'referenciada') {
      this.tipoInc = true;
      this.incidenciaChatService.getIncidenciaReferenciadaTicket(this.idI).subscribe((h) => {
        if (h.tipoIncidencia != "1") {
          this.router.navigate(['/incidencias']);
        }
        this.incidenciaR = h;
      }, error => {
        this.errorHTTP(error.status);
        if (error.status == 0) {
          this.router.navigate(['/incidencias']);
        }

      });
    } else if (this.tipo == 'general') {
      this.tipoInc = false;
      this.incidenciaChatService.getIncidenciaGeneralTicket(this.idI).subscribe((h) => {
        if (h.tipoIncidencia != "2") {
          this.router.navigate(['/incidencias']);
        }
        this.incidenciaG = h;

      }, error => {
        this.errorHTTP(error.status);
        if (error.status == 0) {
          this.router.navigate(['/incidencias']);
        }
      });
    }

  }

  //Update incidencia Referenciada
  updateStsIncR(incR: any, sts) {
    incR.status = sts;
    this.loadingUpdIR = true;
    this.incidenciaChatService.updateIncidenciaReferenciada(incR, this.authService.user.id).subscribe((h) => {
      this.loadingUpdIR = false;
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  seleccionarImg(event) {
    this.imgSeleccionada = event.target.files[0];
    if (this.imgSeleccionada != null) {
      if (this.imgSeleccionada.type.indexOf('image') < 0) {
        Swal.fire('Lo sentimos', 'El archivo debe ser una imágen', 'error');
        this.imgSeleccionada = null;
      } else {
        var reader = new FileReader();
        reader.readAsDataURL(this.imgSeleccionada);
        reader.onload = (e) => {
          this.showImg = reader.result;

          Swal.fire({
            title: '¿Desea enviar esta imágen?',
            html: '<br><img src="' + this.showImg + '" style="width: 300px;">',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.value) {
              this.sendImg();
            }

          })
          $("#sendImagenFile").val("");
        }///End reader onload
      }
    }
  }

  private sendImg() {
    if (!this.imgSeleccionada) {
      Swal.fire('Lo sentimos', 'Debe seleccionar una imágen', 'info');
    } else {
      if (this.tipoInc) {
        this.incidenciaChatService.sendImg(this.imgSeleccionada, this.incidenciaR.ticket, this.authService.user.id).subscribe(event => {
          if (event.type === HttpEventType.Response) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })

            Toast.fire({
              icon: 'success',
              title: 'Imágen enviada'
            })
            this.getConversationload();
            this.imgSeleccionada = null;
          }
        }, error => {
          this.errorHTTP(error.status);
        })
      } else if (!this.tipoInc) {
        this.incidenciaChatService.sendImg(this.imgSeleccionada, this.incidenciaG.ticket, this.authService.user.id).subscribe(event => {
          if (event.type === HttpEventType.Response) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })

            Toast.fire({
              icon: 'success',
              title: 'Imágen enviada'
            })
            this.getConversationload();
            this.imgSeleccionada = null;
          }
        }, error => {
          this.errorHTTP(error.status);
        })
      }

    }
  }

  sendMessage() {
    if (this.txtMessage != "") {
      this.chatMessage.mensaje = this.txtMessage;
      if (this.tipoInc) {
        this.incidenciaChatService.sendMessage(this.chatMessage, this.incidenciaR.ticket, this.authService.user.id).subscribe(h => {
          this.getConversationload();
          this.txtMessage = "";
        }, error => {
          this.errorHTTP(error.status);
        })
      } else if (!this.tipoInc) {
        this.incidenciaChatService.sendMessage(this.chatMessage, this.incidenciaG.ticket, this.authService.user.id).subscribe(h => {
          this.getConversationload();
          this.txtMessage = "";
        }, error => {
          this.errorHTTP(error.status);
        })
      }
    } else {
      Swal.fire('Lo sentimos', 'El mensaje no puede estar vacío', 'info');
    }
  }

  //Tiempo de incidencia
  formatTimeH(datetimeRegistro: Date) {
    var horasVista = 0, minutosVista = 0, diasVista = 0;
    let now = new Date();
    let nowDia = parseInt(formatDate(now, 'dd', 'en-US'));
    let nowMes = parseInt(formatDate(now, 'MM', 'en-US'));
    let nowHora = parseInt(formatDate(now, 'HH', 'en-US'));
    let nowMinuto = parseInt(formatDate(now, 'mm', 'en-US'));
    let nowYear = parseInt(formatDate(now, 'yyyy', 'en-US'));
    let fecha = datetimeRegistro;
    let dia = parseInt(formatDate(fecha, 'dd', 'en-US'));
    let mes = parseInt(formatDate(fecha, 'MM', 'en-US'));
    let hora = parseInt(formatDate(fecha, 'HH', 'en-US'));
    let minuto = parseInt(formatDate(fecha, 'mm', 'en-US'));

    ///////////////Dia igual, mes igual
    if (nowDia == dia && nowMes == mes) {
      horasVista = nowHora - hora - 1;
      let minutosTranscurridos = 60 - minuto + nowMinuto;
      if (minutosTranscurridos >= 60) {
        horasVista = horasVista + 1;
        minutosVista = minutosTranscurridos - 60;
      } else {
        minutosVista = minutosTranscurridos;
      }
      ///////////////Dia diferente, mes igual
    } else if (nowDia != dia && nowMes == mes) {

      if ((nowDia - dia) != 1) {
        diasVista = nowDia - dia - 1;
      }

      let minutosTranscurridos = 60 - minuto + nowMinuto;
      let horasTranscurridas = 24 - hora + nowHora - 1;

      if (horasTranscurridas >= 24) {
        diasVista = diasVista + 1;
        horasVista = horasTranscurridas - 24;
      } else {
        horasVista = horasTranscurridas;
      }

      if (minutosTranscurridos >= 60) {
        horasVista = horasVista + 1;
        minutosVista = minutosTranscurridos - 60;
      } else {
        minutosVista = minutosTranscurridos;
      }

      ///////////////Dia diferente, mes diferente
    } else {

      diasVista = this.monnthDays(mes, nowYear) - dia;
      for (var i = (mes + 1); i < nowMes; i++) {
        diasVista = diasVista + this.monnthDays(i, nowYear)
      }
      diasVista = nowDia - 1 + diasVista;

      let minutosTranscurridos = 60 - minuto + nowMinuto;
      let horasTranscurridas = 24 - hora + nowHora - 1;

      if (horasTranscurridas >= 24) {
        diasVista = diasVista + 1;
        horasVista = horasTranscurridas - 24;
      } else {
        horasVista = horasTranscurridas;
      }

      if (minutosTranscurridos >= 60) {
        horasVista = horasVista + 1;
        minutosVista = minutosTranscurridos - 60;
      } else {
        minutosVista = minutosTranscurridos;
      }

    }
    var tiempoHoras, tiempoMinutos;
    if (horasVista < 10) {
      tiempoHoras = '0' + horasVista;
    } else {
      tiempoHoras = horasVista;
    }

    if (minutosVista < 10) {
      tiempoMinutos = '0' + minutosVista;
    } else {
      tiempoMinutos = minutosVista;
    }

    return `${diasVista}d ${tiempoHoras}h ${tiempoMinutos}m`;
  }

  private monnthDays(mes: number, year: number): number {
    if (mes == 4 || mes == 6 || mes == 9 || mes == 11) {
      return 30;
    } else if (mes == 2) {
      if (year % 4 == 0) {
        return 29;
      } else {
        return 28;
      }
    } else {
      return 31;
    }
  }

  private scroll() {
    timer(0).subscribe(h => {
      this.scrollChat = document.getElementById('conversationH');
      this.scrollChat.scrollTop = this.scrollChat.scrollHeight;
    })
    //$('conversationH').scrollBottom()
  }

  //ErrorHTTP
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
