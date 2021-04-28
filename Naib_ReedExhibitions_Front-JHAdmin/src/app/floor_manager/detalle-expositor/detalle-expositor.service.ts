import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http'
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/users/service/auth.service';
import { EvidenciaPorcetnajeArmado } from '../../models/EvidenciaPorcentajeArmado';
import { formatDate } from '@angular/common';
import { EvidenciaServicio } from '../../models/EvidenciaServicio';
import { IncidenciaReferenciada } from '../../models/IncidenciaReferenciada';
import { Incidencia } from '../../models/Incidencia';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})


export class DetalleExpositorService {


  public idU: number;
  private _dataServices: Array<{ idServicio: number, nombre: String, total: number, activados: number, icono: String }> = [];
  private _totalServices: number = 0;

  constructor(private http: HttpClient,
    private ruta: Router,
    private authService: AuthService) {

  }

  private addAuthorizationheader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer' + token);
    }
    return this.httpHeaders;
  }


  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  public get urlEndPoint() {
    return this._urlEndPoint;
  }

  public get dataServices() {
    return this._dataServices;
  }

  public get totalServices() {
    return this._totalServices;
  }


  private _urlEndPoint = `${environment.endPointBack}/api/detalleExpositor`;

  getDetalleExpositor(idDetalle): Observable<any> {
    this._dataServices = [];
    return this.http.get<any>(`${this.urlEndPoint}/${idDetalle}`, { headers: this.addAuthorizationheader() }).pipe(
      /////////////////////////////////////////Manipulacion de informacion de servicios//////////////////////////////////////////////////
      tap(Response => {
        let va = Response.detalleContratoServicios;
        let servicesCounter = 0;
        let countByService = 1;
        let activeServicesCounter = 0;
        var nombre, icono;
        this._totalServices = 0;
        va.forEach(result => {
          this._totalServices = this._totalServices + 1;
          if (servicesCounter < result.tipoServicio.servicio.id) {
            if (servicesCounter != 0) {
              this._dataServices.push({ 'idServicio': servicesCounter, 'nombre': nombre, 'total': countByService, 'activados': activeServicesCounter, 'icono': icono });
              activeServicesCounter = 0;
              countByService = 1;
            }
            nombre = result.tipoServicio.servicio.nombre;
            icono = result.tipoServicio.servicio.icono;
            servicesCounter = result.tipoServicio.servicio.id;
          } else if (servicesCounter == result.tipoServicio.servicio.id) countByService = countByService + 1;
          if (result.status == 1) activeServicesCounter = activeServicesCounter + 1;

        })///End forEach
        if (va.length > 0) {
          this._dataServices.push({ 'idServicio': servicesCounter, 'nombre': nombre, 'total': countByService, 'activados': activeServicesCounter, 'icono': icono });
        }
        /////////////////////////////////////////Manipulacion de informacion de servicios//////////////////////////////////////////////////
      }),
      catchError(e => {
        if (e.status != 401) {
          this.ruta.navigate(['/']);
        }
        Swal.fire('Error al obtener datos', 'Por favor Recargue la pagina', 'error')
        return throwError(e);
      })
    )
  }

  getIncidenciasStand(idDetalle): Observable<IncidenciaReferenciada[]> {
    return this.http.get(`${this.urlEndPoint}/incidenciasStand/${idDetalle}`, { headers: this.addAuthorizationheader() }).pipe(
      map(response => {
        let now = new Date();
        let nowDia = parseInt(formatDate(now, 'dd', 'en-US'));
        let nowMes = parseInt(formatDate(now, 'MM', 'en-US'));
        let nowHora = parseInt(formatDate(now, 'HH', 'en-US'));
        let nowMinuto = parseInt(formatDate(now, 'mm', 'en-US'));
        let year = parseInt(formatDate(now, 'yyyy', 'en-US'));

        let evidencia = response as IncidenciaReferenciada[]
        return evidencia.map(resp => {
          var horasVista = 0, minutosVista = 0, diasVista = 0;
          let fecha = resp.incidencia.registro;
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

            diasVista = this.monnthDays(mes, year) - dia;
            for (var i = (mes + 1); i < nowMes; i++) {
              diasVista = diasVista + this.monnthDays(i, year)
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

          resp.incidencia.registroDia = diasVista.toString();
          resp.incidencia.registroHora = tiempoHoras;
          resp.incidencia.registroMinuto = tiempoMinutos;

          return resp;
        });
      })
    );
  }

  updateStatusIncidencia(incidencia: Incidencia, idUsuario: number): Observable<any> {
    const url: string = `${environment.endPointBack}/incidencia/updateIncidenciaSts/${incidencia.ticket}/${idUsuario}`;
    return this.http.put<IncidenciaReferenciada>(url, incidencia, { headers: this.authService.addAuthorizationHeaders() });
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

  getEvidenciasStand(idDetalle): Observable<EvidenciaPorcetnajeArmado[]> {
    return this.http.get(`${this.urlEndPoint}/evidencias/${idDetalle}`, { headers: this.addAuthorizationheader() }).pipe(
      map(response => {
        let evidencia = response as EvidenciaPorcetnajeArmado[]
        return evidencia.map(resp => {
          let fecha = resp.registro;
          resp.registro = formatDate(resp.registro, 'dd/MM/yyyy', 'en-US');
          resp.horaRegistro = formatDate(fecha, 'HH:mm', 'en-US');
          return resp;
        });
      })
    );
  }


  updatePorcentajeArmado(porcentajeArmado: any, idStand: any): Observable<any> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("porcentajeArmado", porcentajeArmado);
    formData.append("idStandRefe", idStand);
    const req = new HttpRequest('PUT', `${this.urlEndPoint}/evidencias/porcentajeArmado`, formData, {
      headers: httpHeaders
    });
    return this.http.request(req);
  }


  uploadEvidencia(foto: File, idStandRefe, idDetalleUsuario, porcentaje): Observable<HttpEvent<{}>> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("foto", foto);
    formData.append("idStandRefe", idStandRefe);
    formData.append("idDetalleUsuario", idDetalleUsuario);
    formData.append("porcentaje", porcentaje);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/uploadEvidenciaArmado`, formData, {
      reportProgress: true, headers: httpHeaders
    });
    return this.http.request(req);
  }


  getEvidenciaServicios(idStandRefe): Observable<EvidenciaServicio[]> {
    return this.http.get(`${this.urlEndPoint}/evidenciaServicios/${idStandRefe}`, { headers: this.addAuthorizationheader() }).pipe(
      map(response => {
        let evidencia = response as EvidenciaServicio[]
        return evidencia.map(resp => {
          let fecha = resp.registro;
          resp.registro = formatDate(resp.registro, 'dd/MM/yyyy', 'en-US');
          resp.horaRegistro = formatDate(fecha, 'HH:mm', 'en-US');
          return resp;
        });
      })
    );
  }


  updateStatusServicio(servicios: any, status: any): Observable<any> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("idServicios", servicios);
    formData.append("status", status);
    const req = new HttpRequest('PUT', `${this.urlEndPoint}/statusServicio`, formData, {
      headers: httpHeaders
    });
    return this.http.request(req);
  }

  uploadEvidenciaServicio(foto: File, idDetalleContratoServicio, idDetalleUsuario, estatusServicio): Observable<HttpEvent<{}>> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("foto", foto);
    formData.append("idDetalleContratoServicio", idDetalleContratoServicio);
    formData.append("idDetalleUsuario", idDetalleUsuario);
    formData.append("estatusServicio", estatusServicio);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/uploadEvidenciaServicio`, formData, {
      reportProgress: true, headers: httpHeaders
    });
    return this.http.request(req);
  }


  createR(incidencia: Incidencia, idSr: number): Observable<any> {
    this.idU = this.authService.user.id;
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    return this.http.post<Incidencia>(`${environment.endPointBack}/incidencia/saveR?idSr=${idSr}&idU=${this.idU}`, incidencia, { headers: httpHeaders });
  }


  uploadFotoR(foto: File, idInci): Observable<HttpEvent<{}>> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    this.idU = this.authService.user.id;
    let formData = new FormData();
    formData.append("foto", foto);
    formData.append("idInci", idInci);
    const req = new HttpRequest('POST', `${environment.endPointBack}/incidencia/saveFotoInci?idU=${this.idU}`, formData, {
      reportProgress: true, headers: httpHeaders
    });
    return this.http.request(req);
  }

}

