import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';

import { map, catchError } from 'rxjs/operators';
import { envioW } from 'src/app/models/envioW';
import { EnviowPdfMessage } from 'src/app/models/enviow-pdf-message';

@Injectable({
  providedIn: 'root'
})
export class SmsWhatsService {
  private urlEndPoint = 'http://api.chat-api.com/instance188024';

  private httpHeaders = new HttpHeaders({ 'content-type': 'application/json' });

  constructor(private http: HttpClient) { }

  createPdf(crm: EnviowPdfMessage): Observable<EnviowPdfMessage> {
    const url = `${this.urlEndPoint}/sendFile?token=dht9qbqnr1pw1jen`;
    return this.http.post(url, crm, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.whatsApp as EnviowPdfMessage),
      catchError(e => {
        // tslint:disable-next-line: triple-equals
        if (e.status == 401) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        return throwError(e);
      })
    );
  }
}
