import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { ChatIncidencia } from 'src/app/models/Chat_Incidencia';
import { Incidencia } from 'src/app/models/Incidencia';
import { AuthService } from 'src/app/users/service/auth.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaChatService {

  private dominioUrl: string;

  constructor(private http: HttpClient,
    private authService: AuthService) {
    this.dominioUrl = environment.endPointBack;
  }


  getIncidenciaReferenciadaTicket(idI: number): Observable<Incidencia> {
    const url: string = `${this.dominioUrl}/incidencia/find/${idI}`;
    return this.http.get<Incidencia>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  getIncidenciaGeneralTicket(idI: number): Observable<Incidencia> {
    const url: string = `${this.dominioUrl}/incidencia/find/${idI}`;
    return this.http.get<Incidencia>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  updateIncidenciaReferenciada(incR: Incidencia, idU: number): Observable<Incidencia> {
    const url: string = `${this.dominioUrl}/incidencia/updateIncidenciaSts/${incR.ticket}/${idU}`;
    return this.http.put<Incidencia>(url, incR, { headers: this.authService.addAuthorizationHeaders() });
  }

  updateIncidenciaGeneral(incR: Incidencia, idU: number): Observable<Incidencia> {
    const url: string = `${this.dominioUrl}/incidencia/updateIncidenciaSts/${incR.ticket}/${idU}`;
    return this.http.put<Incidencia>(url, incR, { headers: this.authService.addAuthorizationHeaders() });
  }

  sendImg(img: File, ticket: number, idU: number): Observable<HttpEvent<{}>> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    const url: string = `${this.dominioUrl}/chat/sendImg/${ticket}/${idU}`;
    let formData = new FormData();
    formData.append("img", img);
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      headers: httpHeaders
    });
    return this.http.request(req);
  }

  sendMessage(message: ChatIncidencia, ticket: number, idU: number): Observable<ChatIncidencia> {
    const url: string = `${this.dominioUrl}/chat/sendMessage/${ticket}/${idU}`;
    return this.http.post<ChatIncidencia>(url, message, { headers: this.authService.addAuthorizationHeaders() });
  }

  getConversation(ticket: number): Observable<ChatIncidencia[]> {
    const url: string = `${this.dominioUrl}/chat/getConversation/${ticket}`;
    return this.http.get<ChatIncidencia[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

}
