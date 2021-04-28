import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ActividadExpositor } from "src/app/models/ActividadExpositor";
import { CarteraEvento } from "src/app/models/CarteraEvento";
import { Componente } from "src/app/models/Componente";
import { AuthService } from "src/app/users/service/auth.service";
import { environment } from "src/environments/environment.prod";
import Swal from "sweetalert2";


@Injectable({
    providedIn: 'root'
  })


export class VentasService{

  constructor(private http: HttpClient, private ruta: Router, private authService: AuthService, private router:Router, private spinner:NgxSpinnerService){ }


  private addAuthorizationheader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer' + token);
    }
    return this.httpHeaders;
  }

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  private _urlEndPoint =`${environment.endPointBack}/vMap`;

  


  getAllMapVentasInfo(idEvento:number): Observable<any> {
    this.spinner.show();
    return this.http.get<any>(`${this._urlEndPoint}/generalMap/${idEvento}`, { headers: this.addAuthorizationheader()}).pipe(
      catchError(e=>{
        this.spinner.hide();
        if(e.status==0){
          Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success btn-sm'
            },
            buttonsStyling: false
          })
          Swal.fire({
            customClass: {
              confirmButton: 'btn btn-info btn-sm'
            },
            title: "",
            buttonsStyling: false,
            html: "<img src='./assets/img_project/excepciones/errorConexion.jpg' class='img-fluid' alt='Error de conexión'>",
            confirmButtonText: 'Entiendo'
          })
        }else if(e.status==401){
          this.authService.logout();
          this.router.navigate(['/']);
        }
        return throwError(e);
      }),
      )
  }

  saveAsignacionStand(asignacion:CarteraEvento,idComponente:number, idUsuario:number):Observable<any>{
    return this.http.post<any>(`${this._urlEndPoint}/venta/stand/${idComponente}/${idUsuario}`,asignacion, { headers: this.addAuthorizationheader()});
  }

  saveAgrupacionStand(componente:Componente[],idCarteraEvento:number, idUsuario:number):Observable<any>{
    return this.http.post<any>(`${this._urlEndPoint}/venta/agrupacion/stand/${idCarteraEvento}/${idUsuario}`,componente, { headers: this.addAuthorizationheader()});
  }

  updateSeparacionStand(componente:Componente[],idMain:number,idCarteraEvento:number, idUsuario:number):Observable<any>{
    return this.http.post<any>(`${this._urlEndPoint}/venta/agrupacion/stand/${idCarteraEvento}/${idUsuario}`,componente, { headers: this.addAuthorizationheader()});
  }


  updateStatusAsignacionStand(asignacion:CarteraEvento,idStand:number,idUsuario:number, sts:number, motivo:string):Observable<any>{
    return this.http.put<any>(`${this._urlEndPoint}/venta/sts/${idStand}/${idUsuario}/${sts}?motivo=${motivo}`,asignacion, { headers: this.addAuthorizationheader()});
  }

  getHistorialExpositorH(idCE: number): Observable<ActividadExpositor[]> {
    return this.http.post<ActividadExpositor[]>(`${this._urlEndPoint}/venta/Historial/Exp/${idCE}`, null, { headers: this.addAuthorizationheader() });
  }

}