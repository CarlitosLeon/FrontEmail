import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Agenda } from 'src/app/models/Agenda';
import { ReunionEvento } from 'src/app/models/reunionEvento';
import { AuthService } from 'src/app/users/service/auth.service';
import { environment } from 'src/environments/environment.prod';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AdminReunionService {

  private dominioUrl: string;

  constructor(private http: HttpClient,
    private authService: AuthService) {
    this.dominioUrl = environment.endPointBack;
  }


  getReunionesService(idE: number): Observable<ReunionEvento[]> {
    const url: string = `${this.dominioUrl}/reuniones/eventoAll/${idE}`;
    return this.http.post<ReunionEvento[]>(url, null, { headers: this.authService.addAuthorizationHeaders() });
  }

  putCerrarReunionService(reunionEvento: ReunionEvento): Observable<ReunionEvento> {
    const url: string = `${this.dominioUrl}/reuniones/cerrarReunion`;
    return this.http.put<ReunionEvento>(url, reunionEvento, { headers: this.authService.addAuthorizationHeaders() });
  }

  getAgendaEventoService(idE: number): Observable<Agenda[]> {
    const url: string = `${this.dominioUrl}/reuniones/contactos/evento/${idE}`;
    return this.http.post<Agenda[]>(url, null, { headers: this.authService.addAuthorizationHeaders() });
  }

  sendWhatsApp(message: any): Observable<any> {
    const httpHeaders = new HttpHeaders({ 'content-type': 'application/json' });
    const url: string = `http://api.chat-api.com/instance188024/sendMessage?token=dht9qbqnr1pw1jen`;
    return this.http.post<any>(url, message, { headers: httpHeaders });
  }

  create(agenda: Agenda, idE: number): Observable<any> {
    // tslint:disable-next-line: no-inferrable-types
    const url: string = `${this.dominioUrl}/reuniones/save/${idE}`;
    return this.http.post<any>(url, agenda, { headers: this.authService.addAuthorizationHeaders() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        // swal.fire('Error al crear la medida', e.error.mensaje, 'error');
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  createReunion(reunionEvento: ReunionEvento, idE: number): Observable<any> {
    // tslint:disable-next-line: no-inferrable-types
    const url: string = `${this.dominioUrl}/reuniones/Reunion_Evento/${idE}`;
    return this.http.post<any>(url, reunionEvento, { headers: this.authService.addAuthorizationHeaders() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        // swal.fire('Error al crear la medida', e.error.mensaje, 'error');
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
