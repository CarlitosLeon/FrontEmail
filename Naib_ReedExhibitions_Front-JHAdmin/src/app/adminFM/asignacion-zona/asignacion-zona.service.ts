import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/users/service/auth.service';
import { Zona } from 'src/app/models/Zona';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})


export class AsignacionZonaService {

  private _urlEndPoint: string;

  constructor(private http: HttpClient, private ruta: Router, private authService: AuthService) {
    this._urlEndPoint = environment.endPointBack;
  }

  private addAuthorizationheader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer' + token);
    }
    return this.httpHeaders;
  }

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });



  getListaFM(idEvento: number): Observable<any> {
    return this.http.get<any>(`${this._urlEndPoint}/api/adminfm/lista_fm/${idEvento}`, { headers: this.addAuthorizationheader() });
  }

  getZonasByEvento(idEvento: number): Observable<Zona[]> {
    return this.http.get<Zona[]>(`${this._urlEndPoint}/api/adminfm/zonas_evento/${idEvento}`, { headers: this.addAuthorizationheader() });
  }

  uploadRegistroAsingacionFM(registro: any): Observable<any> {
    let asignacionFM = registro;
    return this.http.post<any>(this._urlEndPoint + '/api/adminfm/asignacionZonaFM', asignacionFM, { headers: this.authService.addAuthorizationHeaders() }).pipe(
      catchError(e => {
        if (e.status != 401) {
          //this.ruta.navigate(['/']);
        }
        return throwError(e);
      })
    )
  }

  deleteHorarioFM(id: number): Observable<any> {
    return this.http.delete<any>(`${this._urlEndPoint}/api/adminfm/deleteHorario/${id}`, { headers: this.addAuthorizationheader() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire('Error al eliminar el registro', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }



}

