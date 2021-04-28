import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { Componente } from '../../models/Componente';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/users/service/auth.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})

export class MapaService {

  private apiURL: string;
  constructor(
    private http: HttpClient, private ruta: Router, private authService: AuthService
  ) {
    this.apiURL = environment.endPointBack;
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getExpositorById(idExpositor): Observable<HttpEvent<{}>> {
    catchError(e => {
      this.ruta.navigate(['/login']);
      Swal.fire('Error al ingresar', e.error.mensaje, 'error')
      return throwError(e);
    });
    const token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    const req = new HttpRequest('GET', `${this.apiURL}/api/detalleExpositor/` + idExpositor, formData, {
      reportProgress: true, headers: httpHeaders
    });
    return this.http.request(req);
  }

}
