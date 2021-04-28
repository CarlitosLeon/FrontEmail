import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Componente } from 'src/app/models/Componente';
import { StandReferencia } from 'src/app/models/StandReferencia';
import { AuthService } from 'src/app/users/service/auth.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PlanoComercialService {

  private dominioUrl: string = environment.endPointBack;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getData(idE: number): Observable<StandReferencia[]> {
    const url: string = `${this.dominioUrl}/public/plano-comercial/data/${idE}`;
    return this.http.post<StandReferencia[]>(url, null, { headers: this.authService.addAuthorizationHeaders() })
  }

  getComponents(idE: number): Observable<Componente[]> {
    const url: string = `${this.dominioUrl}/public/plano-comercial/data/component/${idE}`;
    return this.http.post<Componente[]>(url, null, { headers: this.authService.addAuthorizationHeaders() })
  }

}
