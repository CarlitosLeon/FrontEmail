import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/common';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {


  public id: string = "2";
  public eventoCalendario: any = [];
  public eventoSeleccionado: any;

  public eventosCalendar: any = [{
    id: '0',
    title: 'WhatsApp',
    start: new Date("2021-03-01"),
    description: "Whats programado para el cliente Trupper",
    color: 'green'
  }, {
    id: '1',
    title: 'Verificar contratos',
    start: new Date("2021-03-25"),
    end: new Date("2021-03-27"),
    description: "Nuevos contratos con clientes, sobre construcción de los stands.",
    color: 'blue'
  },
  {
    id: '2',
    title: 'Contactar a nuevo contacto de Reed',
    start: new Date("2021-03-10"),
    description: "Nuevo contacto de Reed, pactar una reunión.",
    color: 'blue'
  },
  {
    id: '3',
    title: 'Autorizar renders',
    start: new Date("2021-03-10"),
    description: "Renders nuevos cargados en la base de datos.",
    color: 'blue'
  }];

  calendarOptions: CalendarOptions = {
    themeSystem: 'bootstrap',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek'
    },
    noEventsContent: "Sin eventos.",
    handleWindowResize: true,
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Lista'
    },
    allDayText: 'Todo el día',
    timeZone: 'America/Mexico_City',
    initialView: 'dayGridMonth',
    eventColor: 'blue',
    initialEvents: this.eventosCalendar,
    locale: 'es',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dragScroll: false,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };

  constructor() { }

  ngOnInit(): void {
  }


  handleDateSelect(selectInfo: DateSelectArg) {
    console.log("Seleccion");
    var title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      var x = Number(this.id);
      x++;
      this.id = String(x);

      calendarApi.addEvent({
        title: title,
        backgroundColor: "#ccc",
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        
      });
      this.eventoCalendario.title = String(title);
      this.eventoCalendario.hola = "!";
      this.eventoCalendario.backgroundColor = "#ccc";
      this.eventoCalendario.start = selectInfo.startStr;
      this.eventoCalendario.end = selectInfo.endStr;
      this.eventoCalendario.allDay = selectInfo.allDay;

      this.eventosCalendar.push(this.eventoCalendario);
      console.log(this.eventosCalendar);
      this.eventoCalendario = [];
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.eventoSeleccionado = clickInfo.event;
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.eventosCalendar = events;
  }
}

