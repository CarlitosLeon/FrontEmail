import { Component, OnInit } from '@angular/core';
import { IncidenciasService } from './service/incidencias.service';
import { AuthService } from 'src/app/users/service/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/users/models/user';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { IncidenciaService } from 'src/app/menu-fm/service/incidencia.service';
import { Salon } from 'src/app/models/salon';
import { Incidencia } from 'src/app/models/Incidencia';

interface ProcesoIncidencia {
  valor: string;
  nombre: string;
}

@Component({
  selector: 'app-incidencia-evento',
  templateUrl: './incidencia-evento.component.html',
  styleUrls: ['./incidencia-evento.component.css']
})
export class IncidenciaEventoComponent implements OnInit {
  //Cargando
  loadingGIncR: boolean = true;
  loadingTIncR: boolean = false;
  loadingTIncG: boolean = false;
  valueSearchIncR: string = "";
  valueSearchIncG: string = "";
  loadingUpdIR: boolean = false;
  loadingUpdIG: boolean = false;
  loadingGIncG: boolean = true;
  //Alerts
  alertSearchIncr: boolean = false;
  alertSearchIncG: boolean = false;
  menssageIncEmptyFME: string = '';
  menssageIncGEmptySalon: string = '';
  viewTableInc: boolean = false;
  viewTableIncG: boolean = false;
  viewAlertStsFilterIR: boolean = false;
  viewAlertStsFilterIG: boolean = false;
  alertEmptyIR: boolean = false;
  alertEmptyIG: boolean = false;
  //Validacion de clases
  activeBtnFilter: number = 0;
  activeBtnFilterSalon: number = 0;
  //Datos a front
  stsIRFilter: number = 3;//Select filtro status IR
  stsIGFilter: number = 3;//Select filtro status IG
  stsIRFiltername: string = "";
  stsIGFiltername: string = "";
  //Contadores incidencia referenciada
  contIRsts0: number = 0;
  contIRsts1: number = 0;
  contIRsts2: number = 0;
  contIRAll: number = 0;
  //Contadores incidencia General
  contIGsts0: number = 0;
  contIGsts1: number = 0;
  contIGsts2: number = 0;
  contIGAll: number = 0;
  //Incidencias
  incidenciaR: Array<Incidencia> = new Array<Incidencia>();
  incidenciaG: Array<Incidencia> = new Array<Incidencia>();
  userFME: Array<User> = new Array<User>();
  salonE: Array<Salon> = new Array<Salon>();
  userFMEFilter: User = null;//FM seleccionado
  salaEFilter: Salon = null; //Sala seleccionada
  //Select proceso incidencia
  processInc: Array<ProcesoIncidencia> = new Array<ProcesoIncidencia>();
  constructor(private incidenciaService: IncidenciasService,
              private authService: AuthService,
              private router: Router, private menu: IncidenciaService) { }


  ngOnInit(): void {
    this.getIncidenciasReferenciadas();
    this.getIncidenciaGeneral();
    this.getFloorManagerEvento();
    this.processInc.push({ valor: '0', nombre: 'No inciada' }, { valor: '1', nombre: 'En proceso' }, { valor: '2', nombre: 'Terminada' });
    this.menu.setNombrePantalla('INCIDENCIAS DEL EVENTO');
  }

  getIncidenciasReferenciadas() {// Get Incidencias Referenciadas
    this.loadingGIncR = true;
    this.menssageIncEmptyFME = '';
    this.viewTableInc = false;
    this.activeBtnFilter = 0;
    this.userFMEFilter = null;
    this.stsIRFilter = 3;
    this.stsIRFiltername = "";
    this.alertSearchIncr = false;
    this.alertEmptyIR = false;
    this.incidenciaService.getIncidenciasReferenciadaService(this.authService.event.id).subscribe((h) => {
      if (h.length == 0) {
        this.alertEmptyIR = true;
      }
      this.incidenciaR = h;
      this.loadingGIncR = false;
      this.contadorStsIR();
    }, error => {
      this.errorHTTP(error.status);
    });
  }

  private contadorStsIR() {
    if (this.userFMEFilter == null) {//Todas las incidencias
      this.incidenciaService.getIncidenciasReferenciadaService(this.authService.event.id).subscribe((h) => {
        this.contIRsts0 = h.filter(x => x.status.toString().includes('0')).length;
        this.contIRsts1 = h.filter(x => x.status.toString().includes('1')).length;
        this.contIRsts2 = h.filter(x => x.status.toString().includes('2')).length;
        this.contIRAll = h.length;
      }, error => {
        this.errorHTTP(error.status);
      })
    } else if (this.userFMEFilter != null) {//Si esta seleccionado un FloorManager
      this.incidenciaService.getIncidenciaFME(this.userFMEFilter.id).subscribe((h) => {
        this.contIRsts0 = h.filter(x => x.status.toString().includes('0')).length;
        this.contIRsts1 = h.filter(x => x.status.toString().includes('1')).length;
        this.contIRsts2 = h.filter(x => x.status.toString().includes('2')).length;
        this.contIRAll = h.length;
      }, error => {
        this.errorHTTP(error.status);
      })
    }
  }

  private getFloorManagerEvento() {//Get Floor Manager del evento
    this.incidenciaService.getFMEvento(this.authService.event.id).subscribe((h) => {
      if (h.values == null) {
        return this.userFME = null;
      }
      this.userFME = h;
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  getIncidenciaFM(user: User) {//Get Incidencia Filtro Floor Manager
    this.loadingGIncR = true;
    this.menssageIncEmptyFME = '';
    this.viewTableInc = false;
    this.activeBtnFilter = user.id;
    this.userFMEFilter = user;
    this.stsIRFilter = 3;
    this.alertSearchIncr = false;
    this.viewAlertStsFilterIR = false;
    this.incidenciaService.getIncidenciaFME(user.id).subscribe((h) => {
      this.loadingGIncR = false;
      if (h.values == null) {
        this.viewTableInc = true;
        return this.menssageIncEmptyFME = `${user.nombre} ${user.aPaterno}`;
      }
      this.incidenciaR = h;
      this.contadorStsIR();
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  filterStsIncR(value) {
    this.stsIRFilter = value;
    this.loadingTIncR = true;
    this.stsIRFiltername = "";
    this.viewAlertStsFilterIR = false;
    if (value == 0) {
      this.stsIRFiltername = "No iniciada";
    } else if (value == 1) {
      this.stsIRFiltername = "En proceso";
    } else if (2) {
      this.stsIRFiltername = "Terminada";
    }

    if (value != 3) { //No son todos los status
      if (this.userFMEFilter == null) {//Todas las incidencias
        this.incidenciaService.getIncidenciasReferenciadaService(this.authService.event.id).subscribe((h) => {
          this.incidenciaR = h.filter(x => {
            this.loadingTIncR = false;
            return x.status.toString().includes(value)
          });
          if (this.incidenciaR.length == 0) {
            this.viewAlertStsFilterIR = true;
          }
        }, error => {
          this.errorHTTP(error.status);
        })
      } else if (this.userFMEFilter != null) {//Si esta seleccionado un FloorManager
        this.incidenciaService.getIncidenciaFME(this.userFMEFilter.id).subscribe((h) => {

          this.incidenciaR = h.filter(x => {
            this.loadingTIncR = false;
            return x.status.toString().includes(value)
          });
          if (this.incidenciaR.length == 0) {
            this.viewAlertStsFilterIR = true;
          }
        }, error => {
          this.errorHTTP(error.status);
        })
      }
    } else if (value == 3) {//Todos los status
      if (this.userFMEFilter == null) {
        this.getIncidenciasReferenciadas();
      } else if (this.userFMEFilter != null) {
        this.getIncidenciaFM(this.userFMEFilter);
      }
      this.loadingTIncR = false;
    }


   }

  searchTiketAndStand(value) {
    this.valueSearchIncR = "";
    this.loadingTIncR = true;
    this.viewAlertStsFilterIR = false;
    if (this.userFMEFilter == null) {//Todas las incidencias
      this.incidenciaService.getIncidenciasReferenciadaService(this.authService.event.id).subscribe((h) => {
        if (this.stsIRFilter != 3) {//status seleccionado
          this.incidenciaR = h.filter(x => {
            this.loadingTIncR = false;
            return x.status.toString().includes(this.stsIRFilter.toString());
          })

          this.incidenciaR = this.incidenciaR.filter(y => {
            this.loadingTIncR = false;
            this.alertSearchIncr = false;
            return y.ticket.toString().includes(value) || y.detalleReferencia[0].stand.componente.numeroStand.toString().includes(value);
          })
          if (this.incidenciaR.length == 0) {
            this.valueSearchIncR = value;
            this.loadingTIncR = false;
            this.alertSearchIncr = true;
          }
        } else if (this.stsIRFilter == 3) {
          this.incidenciaR = h.filter(x => {
            this.loadingTIncR = false;
            this.alertSearchIncr = false;
            return x.ticket.toString().includes(value) || x.detalleReferencia[0].stand.componente.numeroStand.toString().includes(value);
          })
          if (this.incidenciaR.length == 0) {
            this.valueSearchIncR = value;
            this.loadingTIncR = false;
            this.alertSearchIncr = true;
          }
        }
      }, error => {
        this.errorHTTP(error.status);
      })
    } else if (this.userFMEFilter != null) {//Floor Manager Seleccionado filtro
      this.incidenciaService.getIncidenciaFME(this.userFMEFilter.id).subscribe((h) => {

        if (this.stsIRFilter != 3) {//Selecciono status filtro
          this.incidenciaR = h.filter(x => {
            this.loadingTIncR = false;
            return x.status.toString().includes(this.stsIRFilter.toString());
          });

          this.incidenciaR = this.incidenciaR.filter(y => {
            this.loadingTIncR = false;
            this.alertSearchIncr = false;
            return y.ticket.toString().includes(value) || y.detalleReferencia[0].stand.componente.numeroStand.toString().includes(value);
          })
          if (this.incidenciaR.length == 0) {
            this.valueSearchIncR = value;
            this.loadingTIncR = false;
            this.alertSearchIncr = true;
          }
        } else if (this.stsIRFilter == 3) {
          this.incidenciaR = h.filter(x => {
            this.loadingTIncR = false;
            this.alertSearchIncr = false;
            return x.ticket.toString().includes(value) || x.detalleReferencia[0].stand.componente.numeroStand.toString().includes(value);
          })
          if (this.incidenciaR.length == 0) {
            this.valueSearchIncR = value;
            this.loadingTIncR = false;
            this.alertSearchIncr = true;
          }
        }
      }, error => {
        this.errorHTTP(error.status);
      })
    }
  }

  updateStsIncR(incR: Incidencia, sts, indice) {
    incR.status = sts;
    this.loadingUpdIR = true;
    this.incidenciaService.updateIncidenciaReferenciada(incR, this.authService.user.id).subscribe((h) => {
      if (this.stsIRFilter <= 2) {
        this.incidenciaR.splice(indice, 1);
        if (this.incidenciaR.length == 0) {
          this.viewAlertStsFilterIR = true;
        }
      }

      this.loadingUpdIR = false;
      this.contadorStsIR();
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  // //IncidenciaGeneral

  getIncidenciaGeneral() {//Get Incidencias generales
    this.loadingGIncG = true;
    this.menssageIncGEmptySalon = '';
    this.viewTableIncG = false;
    this.activeBtnFilterSalon = 0;
    this.stsIGFilter = 3;
    this.stsIGFiltername = "";
    this.alertEmptyIG = false;
    this.salaEFilter = null;
    this.incidenciaService.getIncidenciaGeneral(this.authService.event.id).subscribe((h) => {
      if (h.length == 0) {
        this.alertEmptyIG = true;
      }
      this.incidenciaG = h;
      this.loadingGIncG = false;
      this.contadorStsIG();
      this.getSalon();
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  private getSalon() {
    this.incidenciaService.getSalonEvento(this.authService.event.id).subscribe((h) => {
      if (h.values == null) {
        return this.salonE = null;
      }
      this.salonE = h;
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  private contadorStsIG() {
    if (this.salaEFilter == null) {//Todas las incidencias
      this.incidenciaService.getIncidenciaGeneral(this.authService.event.id).subscribe((h) => {
        this.contIGsts0 = h.filter(x => x.status.toString().includes('0')).length;
        this.contIGsts1 = h.filter(x => x.status.toString().includes('1')).length;
        this.contIGsts2 = h.filter(x => x.status.toString().includes('2')).length;
        this.contIGAll = h.length;
      }, error => {
        this.errorHTTP(error.status);
      })
    } else if (this.salaEFilter != null) {//Si esta seleccionado un salon
      this.incidenciaService.getIncidenciaGeneralSalon(this.salaEFilter.id).subscribe((h) => {
        this.contIGsts0 = h.filter(x => x.status.toString().includes('0')).length;
        this.contIGsts1 = h.filter(x => x.status.toString().includes('1')).length;
        this.contIGsts2 = h.filter(x => x.status.toString().includes('2')).length;
        this.contIGAll = h.length;
      }, error => {
        this.errorHTTP(error.status);
      })
    }
  }

  getIncidenciaGSalon(salon: Salon) {
    this.loadingGIncG = true;
    this.salaEFilter = salon;
    this.stsIGFilter = 3;
    this.menssageIncGEmptySalon = '';
    this.viewTableIncG = false;
    this.activeBtnFilterSalon = salon.id;
    this.incidenciaService.getIncidenciaGeneralSalon(salon.id).subscribe((h) => {
      if (h.length == 0) {
        this.loadingGIncG = false;
        this.viewTableIncG = true;
        return this.menssageIncGEmptySalon = `${salon.nombre}`;
      }
      this.incidenciaG = h;
      this.loadingGIncG = false;
      this.contadorStsIG();
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  filterStsIncG(value) {
    this.stsIGFilter = value;
    this.loadingTIncG = true;
    this.stsIGFiltername = "";
    this.viewAlertStsFilterIG = false;
    if (value == 0) {
      this.stsIGFiltername = "No iniciada";
    } else if (value == 1) {
      this.stsIGFiltername = "En proceso";
    } else if (2) {
      this.stsIGFiltername = "Terminada";
    }

    if (value != 3) { //No son todos los status
      if (this.salaEFilter == null) {//Todas las incidencias
        this.incidenciaService.getIncidenciaGeneral(this.authService.event.id).subscribe((h) => {
          this.incidenciaG = h.filter(x => {
            this.loadingTIncG = false;
            return x.status.toString().includes(value)
          });
          if (this.incidenciaG.length == 0) {
            this.viewAlertStsFilterIG = true;
          }
        }, error => {
          this.errorHTTP(error.status);
        })
      } else if (this.salaEFilter != null) {//Si esta seleccionado un salon
        this.incidenciaService.getIncidenciaGeneralSalon(this.salaEFilter.id).subscribe((h) => {

          this.incidenciaG = h.filter(x => {
            this.loadingTIncG = false;
            return x.status.toString().includes(value)
          });
          if (this.incidenciaG.length == 0) {
            this.viewAlertStsFilterIG = true;
          }
        }, error => {
          this.errorHTTP(error.status);
        })
      }
    } else if (value == 3) {//Todos los status
      if (this.salaEFilter == null) {
        this.getIncidenciaGeneral();
      } else if (this.salaEFilter != null) {
        this.getIncidenciaGSalon(this.salaEFilter);
      }
      this.loadingTIncG = false;
    }
  }

  updateStsIncG(incG: Incidencia, sts, indice) {
    incG.status = sts;
    this.loadingUpdIG = true;
    this.incidenciaService.updateIncidenciaGeneral(incG, this.authService.user.id).subscribe((h) => {

      if (this.stsIGFilter <= 2) {
        this.incidenciaG.splice(indice, 1);
        if (this.incidenciaG.length == 0) {
          this.viewAlertStsFilterIG = true;
        }
      }
      this.loadingUpdIG = false;
      this.contadorStsIG();
    }, error => {
      this.errorHTTP(error.status);
    })


  }

  searchTiketAndUser(value) {
    this.valueSearchIncG = "";
    this.loadingTIncG = true;
    this.viewAlertStsFilterIG = false;
    if (this.salaEFilter == null) {//Todas las incidencias
      this.incidenciaService.getIncidenciaGeneral(this.authService.event.id).subscribe((h) => {
        if (this.stsIGFilter != 3) {//status seleccionado
          this.incidenciaG = h.filter(x => {
            this.loadingTIncG = false;
            return x.status.toString().includes(this.stsIGFilter.toString());
          })

          this.incidenciaG = this.incidenciaG.filter(y => {
            this.loadingTIncG = false;
            this.alertSearchIncG = false;
            return y.ticket.toString().includes(value) || y.idDetalleUsuario.usuario.nombre.concat(" ").concat(y.idDetalleUsuario.usuario.aPaterno).toString().toLowerCase().includes(value.toLowerCase());
          })
          if (this.incidenciaG.length == 0) {
            this.valueSearchIncG = value;
            this.loadingTIncG = false;
            this.alertSearchIncG = true;
          }
        } else if (this.stsIGFilter == 3) {
          this.incidenciaG = h.filter(x => {
            this.loadingTIncG = false;
            this.alertSearchIncG = false;
            return x.ticket.toString().includes(value) || x.idDetalleUsuario.usuario.nombre.concat(" ").concat(x.idDetalleUsuario.usuario.aPaterno).toString().toLowerCase().includes(value.toLowerCase());
          })
          if (this.incidenciaG.length == 0) {
            this.valueSearchIncG = value;
            this.loadingTIncG = false;
            this.alertSearchIncG = true;
          }
        }
      }, error => {
        this.errorHTTP(error.status);
      })
    } else if (this.salaEFilter != null) {//Sala Seleccionada filtro
      this.incidenciaService.getIncidenciaGeneralSalon(this.salaEFilter.id).subscribe((h) => {

        if (this.stsIGFilter != 3) {//Selecciono status filtro
          this.incidenciaG = h.filter(x => {
            this.loadingTIncG = false;
            return x.status.toString().includes(this.stsIGFilter.toString());
          });

          this.incidenciaG = this.incidenciaG.filter(y => {
            this.loadingTIncG = false;
            this.alertSearchIncG = false;
            return y.ticket.toString().includes(value) || y.idDetalleUsuario.usuario.nombre.concat(" ").concat(y.idDetalleUsuario.usuario.aPaterno).toString().toLowerCase().includes(value.toLowerCase());
          })
          if (this.incidenciaG.length == 0) {
            this.valueSearchIncG = value;
            this.loadingTIncG = false;
            this.alertSearchIncG = true;
          }
        } else if (this.stsIGFilter == 3) {
          this.incidenciaG = h.filter(x => {
            this.loadingTIncG = false;
            this.alertSearchIncG = false;
            return x.ticket.toString().includes(value) || x.idDetalleUsuario.usuario.nombre.concat(" ").concat(x.idDetalleUsuario.usuario.aPaterno).toString().toLowerCase().includes(value.toLowerCase());
          })
          if (this.incidenciaG.length == 0) {
            this.valueSearchIncG = value;
            this.loadingTIncG = false;
            this.alertSearchIncG = true;
          }
        }
      }, error => {
        this.errorHTTP(error.status);
      })
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
