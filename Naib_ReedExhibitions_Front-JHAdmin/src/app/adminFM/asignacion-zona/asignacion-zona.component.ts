import { formatDate, registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import LocaleMX from '@angular/common/locales/es-MX';
import { parse } from 'path';
import { IncidenciaService } from 'src/app/menu-fm/service/incidencia.service';
import { DetalleFM } from 'src/app/models/DetalleFM';
import { DetalleUsuario } from 'src/app/models/DetalleUsuario';
import { HorarioFM } from 'src/app/models/HorarioFM';
import { Zona } from 'src/app/models/Zona';
import { Evento } from 'src/app/users/models/userEvento';
import { AuthService } from 'src/app/users/service/auth.service';
import Swal from 'sweetalert2';
import { AsignacionZonaService } from './asignacion-zona.service';
import { element } from 'protractor';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-asignacion-zona',
  templateUrl: './asignacion-zona.component.html',
  styleUrls: ['./asignacion-zona.component.css']
})
export class AsignacionZonaComponent implements OnInit {

  ////////////FUNCIONAMIENTO SLIDER///////////////
  public max = 24;
  public min = 0;
  public step = 1;
  public thumbLabel = true;
  public tickInterval = 1;
  public horas: number = 0;
  ////////////FUNCIONAMIENTO SLIDER///////////////
  public fechaSelect: any;
  public horaInicio: string;
  public horaFin: string;
  public diaFin: string;
  public fechaFin: string;
  public horasCalculadas: boolean;
  public error: string = null;
  public floorSelected: DetalleFM = undefined;
  private detalleFloorSelected: DetalleUsuario = new DetalleUsuario();;

  private position: number = 0;
  public horariosAgregados: HorarioFM[] = [];
  ///////////////////////////////////////////
  public cargando: boolean = true;
  public floorManagerEvento: DetalleUsuario[] = [];
  public listDetalleFM: DetalleFM[] = [];
  public sliderActive: boolean = false;


  public zonasEvento: Zona[] = [];
  public default: string = "---Seleccione zona de trabajo---";

  public zona: any;
  public equipo: string;
  public detallesEquipo: string;
  public selectedZone = 0;

  public diasEvento: Array<{ fecha: string, nomDia: string, noDia: string }> = [];

  private fechaMontaje: string;
  private fechaDesmontaje: string;
  private asigZona: Zona;
  private sendFloorManagerEvento: DetalleUsuario[] = [];


  fechaValidator = new FormControl('', Validators.required);



  erroresForm = { zona: true, equipo: true, detallesEquipo: true, seleccionado: true }


  constructor(private menu: IncidenciaService,
    private service: AsignacionZonaService,
    private evento: AuthService
  ) { }

  ngOnInit(): void {
    registerLocaleData(LocaleMX, 'es-MX');
    this.menu.setNombrePantalla("ADMINISTRACIÓN DE FLOOR MANAGER-ASIGNACIÓN ZONA");
    this.getListaFM();
    this.service.getZonasByEvento(this.evento.event.id).subscribe(
      Respuesta => {
        this.zonasEvento = Respuesta;
        let def = new Zona();
        def.id = 0;
        def.nombre = "---Seleccione zona de trabajo---";
        this.zonasEvento.unshift(def);
        this.zona = 0 + '-' + this.default;
      }
    );
  }

  public valdiateMatBadge(persona): number {
    let pos = 0;
    this.listDetalleFM.forEach(element => {
      if (element.detalleUsuario.id == persona.id) {
        pos = element.horarios.length;
      }
    })
    return pos;
  }

  public validSlider() {
    if (this.fechaSelect != undefined && this.horaInicio != undefined) {
      this.sliderActive = true;
    } else {
      this.sliderActive = false;
    }
  }

  private getListaFM(): void {
    this.service.getListaFM(this.evento.event.id).subscribe(
      Respuesta => {
        this.floorManagerEvento = Respuesta.listFM;
        this.listDetalleFM = Respuesta.listDetalleFM;
        if (this.floorManagerEvento.length != 0) {
          let evento = this.floorManagerEvento[0].evento;
          this.fechaMontaje = evento.inicioMontaje;
          this.fechaDesmontaje = evento.inicioDesmontaje;
        }
      });
    this.cargando = false;
  }


  private getDay(day: string): string {
    let dia = "";
    switch (day) {
      case 'Monday':
        dia = "Lunes";
        break;
      case 'Tuesday':
        dia = "Martes";
        break;
      case 'Wednesday':
        dia = "Miercoles";
        break;
      case 'Thursday':
        dia = "Jueves";
        break;
      case 'Friday':
        dia = "Viernes";
        break;
      case 'Saturday':
        dia = "Sábado";
        break;
      case 'Sunday':
        dia = "Domingo";
        break;
    }
    return dia;
  }

  monnthDays(mes: number, year: number): number {
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



  public getDaysInEvento() {
    this.diasEvento = [];
    let diaInicio = formatDate(this.fechaMontaje, 'dd', 'en-US');
    let diaFin = formatDate(this.fechaDesmontaje, 'dd', 'en-US');
    let mesInicio = formatDate(this.fechaMontaje, 'MM', 'en-US');
    let mesFin = formatDate(this.fechaDesmontaje, 'MM', 'en-US');
    let anio = formatDate(this.fechaMontaje, 'yyyy', 'en-US');
    if (mesInicio == mesFin) {
      for (let i = parseInt(diaInicio); i <= parseInt(diaFin); i++) {
        let intermedio = new Date(parseInt(anio), parseInt(mesInicio) - 1, i);
        let fecha = i + '-' + mesInicio + '-' + anio;
        this.diasEvento.push({
          'fecha': fecha,
          'nomDia': this.getDay(formatDate(intermedio, 'EEEE', 'en-US')),
          'noDia': i.toString()
        });
      }
      /////Case cambio de mes.
    } else {
      let finDeMes = this.monnthDays(parseInt(mesInicio), parseInt(anio));
      for (let i = parseInt(diaInicio); i <= finDeMes; i++) {
        let intermedio = new Date(parseInt(anio), parseInt(mesInicio) - 1, i);
        let fecha = i + '-' + mesInicio + '-' + anio;
        this.diasEvento.push({
          'fecha': fecha,
          'nomDia': this.getDay(formatDate(intermedio, 'EEEE', 'en-US')),
          'noDia': i.toString()
        });
      }
      for (let i = 1; i <= parseInt(diaFin); i++) {
        let intermedio = new Date(parseInt(anio), parseInt(mesFin) - 1, i);
        let fecha = i + '-' + mesFin + '-' + anio;
        this.diasEvento.push({
          'fecha': fecha,
          'nomDia': this.getDay(formatDate(intermedio, 'EEEE', 'en-US')),
          'noDia': i.toString()
        });
      }
    }

  }

  ////Cambiar a tipo del model
  pickFloorManager(persona: DetalleUsuario): void {
    let found: boolean;
    let num = 0;
    this.listDetalleFM.forEach(element => {
      if (element.detalleUsuario.id == persona.id) {
        this.floorSelected = element;
        found = true;
        this.position = num;
      }
      num = num + 1;
    })
    if (!found) {
      let nuevo = new DetalleFM();
      nuevo.detalle = null;
      nuevo.equipo = null;
      nuevo.zona = null;
      nuevo.detalleUsuario = persona;
      nuevo.id = 0;
      nuevo.creacion = formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS', 'es-MX');
      nuevo.horarios = []
      this.listDetalleFM.push(nuevo);
      this.floorSelected = nuevo;
      this.position = num;
    }
    this.detalleFloorSelected = persona;
    this.getDaysInEvento();
    this.horariosAgregados = [];
    /////////////////////////PICK
    this.horariosAgregados = this.listDetalleFM[this.position].horarios;
    this.floorSelected.horarios = this.horariosAgregados;
    this.equipo = this.listDetalleFM[this.position].equipo;
    this.detallesEquipo = this.listDetalleFM[this.position].detalle;
    if (this.listDetalleFM[this.position].zona != null) {
      this.zona = this.listDetalleFM[this.position].zona.id + '-' + this.listDetalleFM[this.position].zona.nombre;
      this.selectedZone = this.listDetalleFM[this.position].zona.id;
    } else {
      this.zona = 0 + '-' + this.default;
      this.selectedZone = 0;
    }
    /////////////////////////PICK

    this.horariosAgregados.forEach(element => {
      let index = this.diasEvento.findIndex(dia => parseInt(dia.noDia) === parseInt(formatDate(element.entrada, 'dd', 'en-US')));
      if (index >= 0) this.diasEvento.splice(index, 1);
      element.stringEntrada = this.getDay(formatDate(element.entrada, 'EEEE', 'en-US')) + '/' + formatDate(element.entrada, 'dd-MM-yyyy', 'en-US');
      element.stringSalida = this.getDay(formatDate(element.salida, 'EEEE', 'en-US')) + '/' + formatDate(element.salida, 'dd-MM-yyyy', 'en-US');
      element.horaEntrada = formatDate(element.entrada, 'HH:mm', 'en-US');
      element.horaSalida = formatDate(element.salida, 'HH:mm', 'en-US');
      /////////////////////Validate hours registered
      let inicio = parseInt(formatDate(element.entrada, 'HH', 'en-US'));
      let fin = parseInt(formatDate(element.salida, 'HH', 'en-US'));
      let total = 0;
      if(inicio>fin){
        total=24-inicio+fin;
      }else{
        total=fin-inicio;
      }
      element.horas = total;
    });

  }

  public asignEquipo(event) {
    this.listDetalleFM[this.position].equipo = event.target.value;
  }

  public asignDetallesEquipo(event) {
    this.listDetalleFM[this.position].detalle = event.target.value;
  }

  public asignZona() {
    let selected = this.zonasEvento.findIndex(element => element.nombre === this.zona.split('-')[1]);
    if (selected != -1) {
      this.listDetalleFM[this.position].zona = this.zonasEvento[selected];
    }
  }

  public calcularHoras(): void {
    if (this.horaInicio != undefined) {
      this.horasCalculadas = true;
      var hora = parseInt(this.horaInicio.split(":")[0]);
      let minuto = this.horaInicio.split(":")[1];
      var dia = parseInt(this.fechaSelect.noDia);
      hora = this.horas + hora;

      if (hora > 23) {
        hora = hora - 24;
        dia = dia + 1;
      }
      this.horaFin = hora + ":" + minuto;

      let mes = parseInt(formatDate(this.fechaMontaje, 'MM', 'en-US'));
      let anio = parseInt(formatDate(this.fechaMontaje, 'yyyy', 'en-US'));
      if (this.monnthDays(mes, anio) < dia) {
        dia = 1;
        mes = mes + 1;
      }
      let index = this.diasEvento.find(element => element.noDia === dia.toString());
      if (index == undefined) {
        let salida = new Date(anio, mes - 1, dia);
        this.diaFin = this.getDay(formatDate(salida, 'EEEE', 'en-US'));
        this.fechaFin = formatDate(salida, 'dd-MM-yyyy', 'en-US')
      } else {
        this.diaFin = index.nomDia;
        this.fechaFin = index.fecha;
      }
    }
  }

  public addHorario(): void {
    if (this.validateFormDiasHoras()) {
      let horario: HorarioFM = new HorarioFM();
      horario.stringEntrada = this.fechaSelect.nomDia + "/" + this.fechaSelect.fecha;
      horario.horaEntrada = this.horaInicio;
      horario.stringSalida = this.diaFin + "/" + this.fechaFin;
      horario.horaSalida = this.horaFin;
      horario.horas = this.horas;
      ////////////////////Valores para back
      let array = horario.stringEntrada.split('-');
      let entrada = horario.horaEntrada.split(':');
      let newEntrada = new Date(parseInt(array[2]), parseInt(array[1]) - 1, parseInt(array[0].split('/')[1]), parseInt(entrada[0]), parseInt(entrada[1]));
      let arraySalida = horario.stringSalida.split('-');
      let salida = horario.horaSalida.split(':');
      let newSalida = new Date(parseInt(arraySalida[2]), parseInt(arraySalida[1]) - 1, parseInt(arraySalida[0].split('/')[1]), parseInt(salida[0]), parseInt(salida[1]));
      horario.entrada = formatDate(newEntrada, 'yyyy-MM-ddTHH:mm:ss.SSS', 'es-MX');
      horario.salida = formatDate(newSalida, 'yyyy-MM-ddTHH:mm:ss.SSS', 'es-MX');
      horario.horas = this.horas;
      this.listDetalleFM[this.position].horarios.push(horario);
      ////////////Eliminar dia del combo box
      let index = this.diasEvento.findIndex(element => parseInt(element.noDia) == this.fechaSelect.noDia);
      if (index >= 0) this.diasEvento.splice(index, 1);
      /////////Reset Values
      this.fechaSelect = undefined;
      this.fechaSelect = "--Seleccione--";
      this.horaInicio = undefined;
      this.horas = 0;
      this.horasCalculadas = false;
      this.validSlider();
    }
  }

  public deleteHorario(horario: HorarioFM) {
    let index =0;
    if (horario.id != undefined) {
      index = this.horariosAgregados.findIndex(element => element.id == horario.id);
      this.service.deleteHorarioFM(horario.id).subscribe(Respuesta => {
      });
    } else {
      index = this.horariosAgregados.findIndex(element => element.horaEntrada === horario.horaEntrada);
    }
    if (index != -1) this.horariosAgregados.splice(index, 1);
    this.getDaysInEvento();
    this.floorSelected.horarios=this.horariosAgregados;
    if(this.floorSelected.horarios.length>0){
      this.floorSelected.horarios.forEach(element => {
        let index = this.diasEvento.findIndex(dia => parseInt(dia.noDia) === parseInt(formatDate(element.entrada, 'dd', 'en-US')));
        if (index >= 0) this.diasEvento.splice(index, 1);
        });
    }
  }


  private validateFormDiasHoras(): boolean {
    let res = true
    if (this.fechaSelect == undefined) {
      this.error = "Debe seleccionar una fecha de trabajo";
      res = false;
    } else if (this.horaInicio == undefined) {
      this.error = "Debe seleccionar la hora de entrada";
      res = false;
    } else if (this.horas == 0) {
      this.error = "Debe seleccionar un numero de horas de trabajo";
      res = false;
    }
    return res;
  }

  private getSelectedDays(): string {
    var dias = "";
    if (this.horariosAgregados.length > 0) {
      dias = '<table class="table table-bordered table-hover table-sm small text-center" style="margin: auto;">' +
        '<thead style="background-color: #4385EF;" class="text-white">' +
        '<tr>' +
        '<th><i class="fas fa-calendar-check"></i> Dia</th>' +
        '<th><i class="fas fa-clock"></i> Entrada</th>' +
        '<th><i class="fas fa-calendar-check"></i> Horas</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';
    }
    this.horariosAgregados.forEach(result => {
      dias = dias + "<tr>";
      dias = dias + '<td>' + result.stringEntrada + '</td>';
      dias = dias + '<td>' + result.horaEntrada + '</td>';
      dias = dias + '<td>' + result.horas + '</td>';
      dias = dias + '</tr>'
    });
    return dias;
  }


  public guardarAsignacionFM(): void {

    if (this.validateForm()) {
      Swal.fire({
        title: 'Asignar Floor Manager al evento',
        html: '<b>' + this.floorSelected.detalleUsuario.usuario.nombre + ' ' + this.floorSelected.detalleUsuario.usuario.aPaterno + '</b><br>' +
          'Equipo: <b>' + this.equipo + '</b><br>' +
          'Zona: <b>' + this.zona.split('-')[1] + '</b><br>' +
          this.getSelectedDays() +
          '</tbody>' +
          '</table>',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          this.addRegistroAsignacionZona();
        }

      })
    }
  }


  private validateForm(): boolean {
    let res = true;;
    if (this.equipo == undefined) {
      this.erroresForm.equipo = false
      res = false;
    } else {
      this.erroresForm.equipo = true
    }
    if (this.detallesEquipo == undefined || this.detallesEquipo == '') {
      this.erroresForm.detallesEquipo = false;
      res = false;
    } else {
      this.erroresForm.detallesEquipo = true
    }
    if (parseInt(this.zona[0]) == 0) {
      this.erroresForm.zona = false
      res = false;
    } else {
      this.erroresForm.zona = true
    }
    return res;
  }




  private addRegistroAsignacionZona(): void {
    this.service.uploadRegistroAsingacionFM(this.listDetalleFM).subscribe(
      Respuesta => {
        Respuesta.asignacionFM.forEach(nuevo => {
          let index = this.listDetalleFM.findIndex(element => element.id == nuevo.id);
          if (index != -1) this.listDetalleFM[index] = nuevo;
        });
        Swal.fire(
          '!Floor Manager Asignado!',
          '',
          'success'
        )
      });
    this.floorSelected = undefined;
  }

}

