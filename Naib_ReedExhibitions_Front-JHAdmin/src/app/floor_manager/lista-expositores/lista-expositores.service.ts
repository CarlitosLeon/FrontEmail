import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/users/service/auth.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})

export class listaExpositoresService {

  private urlEndPoint: string;

  constructor(private http: HttpClient, private ruta: Router, private authService: AuthService) {
    this.urlEndPoint = environment.endPointBack;
  }

  private addAuthorizationheader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer' + token);
    }
    return this.httpHeaders;
  }


  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });




  getListaExpositores(idDetalleUsuario): Observable<HttpEvent<{}>> {
    catchError(e => {
      this.ruta.navigate(['/login']);
      Swal.fire('Error al ingresar', e.error.mensaje, 'error')
      return throwError(e);
    })
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("UsEv", idDetalleUsuario);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/api/listaExpositores/getListaExpositores`, formData, {
      reportProgress: true, headers: httpHeaders
    });
    return this.http.request(req);
  }

  updateStatusStand(listaStand, listaStatusStand): Observable<any> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("listaStand", listaStand);
    formData.append("listaStatus", listaStatusStand);
    const req = new HttpRequest('PUT', `${this.urlEndPoint}/api/listaExpositores/updateStatusStand`, formData, {
      headers: httpHeaders
    });
    return this.http.request(req).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }




}


