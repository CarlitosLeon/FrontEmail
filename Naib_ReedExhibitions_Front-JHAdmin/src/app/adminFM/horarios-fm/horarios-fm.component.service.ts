import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HorarioFM } from 'src/app/models/HorarioFM';
import { Incidencia } from 'src/app/models/Incidencia';
import { AuthService } from 'src/app/users/service/auth.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HorariosFmService {

  private urlEndPoint: string;

  constructor(private http: HttpClient, private ruta: Router, private authService: AuthService) {
    this.urlEndPoint = environment.endPointBack;
  }



  getHorariosFMService(idE: number): Observable<HorarioFM[]> {
    const url: string = `${this.urlEndPoint}/horariosFM/consulta/${idE}`;
    return this.http.get<HorarioFM[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  getHorariosResultadosService(idE: number): Observable<HorarioFM[]> {
    const url: string = `${this.urlEndPoint}/horariosFM/consultaResultados/${idE}`;
    return this.http.get<HorarioFM[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  getIncidenciasService(idU: number): Observable<any> {
    const url: string = `${this.urlEndPoint}/incidencia/consultaIncidenciasModal/${idU}`;
    return this.http.get<Incidencia[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }
}
