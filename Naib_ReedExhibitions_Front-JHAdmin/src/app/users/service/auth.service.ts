import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Evento } from '../models/userEvento';
import { environment } from 'src/environments/environment.prod';
import { EventoVendedor } from '../models/EventoVendedor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private dominioUrl: string;
  private _user: User;
  private _token: string;
  private _evento: Evento;
  private _eventosVendedor: Array<EventoVendedor> = new Array<EventoVendedor>();
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {
    this.dominioUrl = environment.endPointBack;
  }

  public addAuthorizationHeaders() {
    let token = this.token;

    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    return this.httpHeaders;
  }

  public get user(): User {
    if (this._user != null) {
      return this._user;
    } else if (this._user == null && sessionStorage.getItem('usrH13Nb') != null) {
      this._user = JSON.parse(sessionStorage.getItem('usrH13Nb')) as User;
      return this._user;
    }
    return new User();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('tkH13Nb') != null) {
      this._token = sessionStorage.getItem('tkH13Nb');
      return this._token;
    }
    return null;
  }

  public get event(): Evento {
    if (this._evento != null) {
      return this._evento;
    } else if (this._evento == null && sessionStorage.getItem('evntH13Nb') != null) {
      this._evento = JSON.parse(sessionStorage.getItem('evntH13Nb')) as Evento;
      return this._evento
    }
  }

  public get eventosVendedor(): EventoVendedor[]{
    if(this._eventosVendedor.length != 0){
      return this._eventosVendedor;
    }else if(this._eventosVendedor.length == 0 && sessionStorage.getItem('evnVH13Nb') != null){
      this._eventosVendedor = JSON.parse(sessionStorage.getItem('evnVH13Nb')) as EventoVendedor[];
      return this._eventosVendedor;
    }
  }

  login(user: User): Observable<any> {
    const urlEndPoint = `${this.dominioUrl}/oauth/token`;
    const credencialesApp = btoa('NaibAPP' + ':' + 'Sin@psistH');
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + credencialesApp });
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', user.email);
    params.set('password', user.password);
    return this.http.post<any>(urlEndPoint, params.toString(), { headers: httpHeaders });
  }

  saveUser(accessToken: string) {
    let data = this.dataToken(accessToken);
    this._user = new User();
    this._user.id = data.id;
    this._user.nombre = data.name;
    this._user.aPaterno = data.surname;
    this._user.email = data.user_name;
    this._user.telefono = data.tel;
    this._user.rol = data.authorities;
    sessionStorage.setItem('usrH13Nb', JSON.stringify(this._user));
  }

  saveToken(accessToken: string) {
    this._token = accessToken;
    sessionStorage.setItem('tkH13Nb', accessToken);
  }

  saveEvento(evento: string) {//Pendientes atributos de evento
    let dataE = JSON.parse(evento);
    this._evento = new Evento();
    this._evento.id = dataE.id;
    this._evento.nombre = dataE.nombre;
    this._evento.status = dataE.status;
    sessionStorage.setItem('evntH13Nb', JSON.stringify(this._evento));
  }

  saveEventoVendedor(eventoVendedor: EventoVendedor[]) {
    this._eventosVendedor = eventoVendedor;
    sessionStorage.setItem('evnVH13Nb', JSON.stringify(eventoVendedor));
  }

  dataToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    let data = this.dataToken(this.token);
    if (data != null && data.user_name && data.user_name.length > 0) {
      return true;
    }
    return false;
  }

  logout() {
    this._token = null;
    this._user = null;
    sessionStorage.removeItem('tkH13Nb');
    sessionStorage.removeItem('usrH13Nb');
    sessionStorage.removeItem('evntH13Nb');
    sessionStorage.removeItem('evnVH13Nb');
  }

  hasRole(rol: string): boolean {
    if (this.user.rol == rol) {
      return true;
    }
    return false;
  }

  userEvento(): Observable<Evento> {
    const url: string = `${this.dominioUrl}/user/evento/`;
    return this.http.get<Evento>(url + this.user.id, { headers: this.addAuthorizationHeaders() });
  }

  userEventoVendedor(): Observable<EventoVendedor[]> {
    const url: string = `${this.dominioUrl}/user/evento/vendedor/${this.user.id}`;
    return this.http.post<EventoVendedor[]>(url, null, { headers: this.addAuthorizationHeaders() });
  }

}
