import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/users/service/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/users/models/user';
import { environment } from 'src/environments/environment.prod';
import { Salon } from 'src/app/models/salon';
import { Incidencia } from 'src/app/models/Incidencia';

@Injectable({
  providedIn: 'root'
})
export class IncidenciasService {

  private dominioUrl: string;

  constructor(private http: HttpClient,
    private authService: AuthService) {
    this.dominioUrl = environment.endPointBack;
  }



  getIncidenciasReferenciadaService(idE: number): Observable<Incidencia[]> {
    const url: string = `${this.dominioUrl}/incidencia/referenciada/evento/${idE}`;
    return this.http.get<Incidencia[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  getFMEvento(idE: number): Observable<User[]> {
    const url: string = `${this.dominioUrl}/incidencia/evento/usersFM/${idE}`;
    return this.http.get<User[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  getIncidenciaFME(idU: number): Observable<Incidencia[]> {
    const url: string = `${this.dominioUrl}/incidencia/referenciada/FM/${idU}`;
    return this.http.get<Incidencia[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  updateIncidenciaReferenciada(incR: Incidencia, idU: number): Observable<Incidencia> {
    const url: string = `${this.dominioUrl}/incidencia/updateIncidenciaSts/${incR.ticket}/${idU}`;
    return this.http.put<Incidencia>(url, incR, { headers: this.authService.addAuthorizationHeaders() });
  }

  //Incidecia General

  getIncidenciaGeneral(idE: number): Observable<Incidencia[]> {
    const url: string = `${this.dominioUrl}/incidencia/general/${idE}`;
    return this.http.get<Incidencia[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  getIncidenciaGeneralSalon(idS: number): Observable<Incidencia[]> {
    const url: string = `${this.dominioUrl}/incidencia/general/salon/${idS}`;
    return this.http.get<Incidencia[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  updateIncidenciaGeneral(incR: Incidencia, idU: number): Observable<Incidencia> {
    const url: string = `${this.dominioUrl}/incidencia/updateIncidenciaSts/${incR.ticket}/${idU}`;
    return this.http.put<Incidencia>(url, incR, { headers: this.authService.addAuthorizationHeaders() });
  }

  getSalonEvento(idE: number): Observable<Salon[]> {
    const url: string = `${this.dominioUrl}/incidencia/salon/evento/${idE}`;
    return this.http.get<Salon[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

}
