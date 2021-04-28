import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/users/service/auth.service';
import { Incidencia } from '../../models/Incidencia';
import { Salon } from '../../models/salon';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {

  private urlEndPoint: string;
  public idS: number;
  public idU: number;
  public idEventoSeleccionadoService: number;

  private _nombrePantalla:string = "";
  private _sideBarExpositoresMapa=new EventEmitter<any>();

  public get nombrePantalla(){
    return this._nombrePantalla;
  }
  
  public setNombrePantalla(nombre:string):void{
    this._nombrePantalla=nombre;
  }

  public get sideBarExpositoresMapa():EventEmitter<any>{
    return this._sideBarExpositoresMapa;
  }

  constructor(private http: HttpClient, private authService: AuthService) { 
    this.urlEndPoint = environment.endPointBack;
  }

  create(incidencia: Incidencia): Observable<any> {
    this.idS = incidencia.salon;
    this.idU = this.authService.user.id;
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    return this.http.post<Incidencia>(`${this.urlEndPoint}/incidencia/save/${this.idS}/${this.idU}`, incidencia, { headers: httpHeaders });
  }


  uploadFoto(foto: File, idInci): Observable<HttpEvent<{}>> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    this.idU = this.authService.user.id;
    let formData = new FormData();
    formData.append("foto", foto);
    formData.append("idInci", idInci);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/incidencia/saveFotoInci?idU=${this.idU}`, formData, {
      reportProgress: true, headers: httpHeaders
    });
    return this.http.request(req);
  }
  
  getSalonEvento(idE: number): Observable<Salon[]>{
    const url: string = `${this.urlEndPoint}/incidencia/salon/evento/${idE}`;
    return this.http.get<Salon[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  getIdEvento(idESelect: number) {
    this.idEventoSeleccionadoService = idESelect;
  }

}
