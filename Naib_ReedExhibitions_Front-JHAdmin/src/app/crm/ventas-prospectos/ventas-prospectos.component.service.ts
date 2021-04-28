import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActividadExpositor } from 'src/app/models/ActividadExpositor';
import { archivoContacto } from 'src/app/models/Archivocontacto';
import { CarteraEvento } from 'src/app/models/CarteraEvento';
import { ContactoExpositor } from 'src/app/models/ContactoExpositor';
import { EmailContacto } from 'src/app/models/EmailContacto';
import { Expositor } from 'src/app/models/Expositor';
import { FirmaEmail } from 'src/app/models/FirmaEmail';
import { NotasExpositor } from 'src/app/models/NotasExpositor';
import { WhatsAppContacto } from 'src/app/models/whatsappContacto';
import { User } from 'src/app/users/models/user';
import { Evento } from 'src/app/users/models/userEvento';
import { AuthService } from 'src/app/users/service/auth.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class VentasProspectosService {

  public id: number;

  constructor(private http: HttpClient, private ruta: Router, private authService: AuthService) { }

  private urlEndPoint = `${environment.endPointBack}/ventasProspectos`;

  getEventos(): Observable<Evento[]> {
    const url: string = `${this.urlEndPoint}/getEventosProspectos`;
    return this.http.get<Evento[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  getAllExpositores(idE: number): Observable<CarteraEvento[]> {
    const url: string = `${this.urlEndPoint}/crmAllExpositores/${idE}`;
    return this.http.get<CarteraEvento[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  getMisExpositores(idE: number): Observable<CarteraEvento[]> {
    this.id = this.authService.user.id;
    const url: string = `${this.urlEndPoint}/crmMisExpositores/${this.id}/${idE}`;
    return this.http.get<CarteraEvento[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  getNotasExpositor(idEx: number): Observable<NotasExpositor[]> {
    const url: string = `${this.urlEndPoint}/crmConsultNotas/${idEx}`;
    return this.http.get<NotasExpositor[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  getContactoExpositor(idEx: number): Observable<ContactoExpositor[]> {
    const url: string = `${this.urlEndPoint}/crmConsultContacto/${idEx}`;
    return this.http.get<ContactoExpositor[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  createNewNota(descripcion: string, idEx: number): Observable<HttpEvent<{}>> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("descripcion", descripcion);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/crmCreateNota/${idEx}`, formData, {
      reportProgress: true, headers: httpHeaders
    });
    return this.http.request(req);
  }

  getActividadExpositor(idEx: number, idEv: number): Observable<ActividadExpositor[]> {
    const url: string = `${this.urlEndPoint}/crmConsultActividades/${idEx}/${idEv}`;
    return this.http.get<ActividadExpositor[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  createNewActividad(tipo: string, descripcion: string, accion: string, idC: number): Observable<HttpEvent<{}>> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("tipo", tipo);
    formData.append("descripcion", descripcion);
    formData.append("accion", accion);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/crmCreateActividad/${idC}`, formData, {
      reportProgress: true, headers: httpHeaders
    });
    return this.http.request(req);
  }

  getCountStands(status: number, idEv: number): Observable<any> {
    const url: string = `${this.urlEndPoint}/crmCountsStand/${status}/${idEv}`;
    return this.http.get<any[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  updateStatusCrm(estatusAnt: number, estatus: number, idEx: number, idC: number): Observable<Expositor[]> {
    const url: string = `${this.urlEndPoint}/crmUpdateStatusCrm/${estatusAnt}/${estatus}/${idEx}/${idC}`;
    return this.http.post<Expositor[]>(url, null, { headers: this.authService.addAuthorizationHeaders() });
  }

  updatePrioridad(estatusAnt: number, estatus: number, idEx: number, idC: number): Observable<Expositor[]> {
    const url: string = `${this.urlEndPoint}/crmUpdatePrioridad/${estatusAnt}/${estatus}/${idEx}/${idC}`;
    return this.http.post<Expositor[]>(url, null, { headers: this.authService.addAuthorizationHeaders() });
  }

  deleteExpo(idEx: number): Observable<void[]> {
    const url: string = `${this.urlEndPoint}/crmDeleteExpo/${idEx}`;
    return this.http.post<void[]>(url, null, { headers: this.authService.addAuthorizationHeaders() });
  }

  consVendedores(idEv: number): Observable<User[]> {
    const url: string = `${this.urlEndPoint}/crmConsVendedores/${idEv}`;
    return this.http.get<User[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  consRelacionVendedor(idEx: number): Observable<CarteraEvento[]> {
    const url: string = `${this.urlEndPoint}/crmConsRelacionVendedor/${idEx}`;
    return this.http.get<CarteraEvento[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  saveCartera(idV: number, idEx: number, idEv: number, idCa: number): Observable<CarteraEvento[]> {
    const url: string = `${this.urlEndPoint}/crmSaveCartera/${idV}/${idEx}/${idEv}/${idCa}`;
    return this.http.post<CarteraEvento[]>(url, null, { headers: this.authService.addAuthorizationHeaders() });
  }

  deleteContacto(idC: number): Observable<void[]> {
    const url: string = `${this.urlEndPoint}/crmDeleteContacto/${idC}`;
    return this.http.post<void[]>(url, null, { headers: this.authService.addAuthorizationHeaders() });
  }

  uploadFotoContacto(idC: number, foto: File, nombre: string, telefono: string, email: string): Observable<HttpEvent<{}>> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("foto", foto);
    formData.append("nombre", nombre);
    formData.append("telefono", telefono);
    formData.append("email", email);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/crmUpdateContactoFoto/${idC}`, formData, {
      reportProgress: true, headers: httpHeaders
    });
    return this.http.request(req);
  }

  uploadContacto(idC: number, nombre: string, telefono: string, email: string): Observable<HttpEvent<{}>> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("telefono", telefono);
    formData.append("email", email);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/crmUpdateContacto/${idC}`, formData, {
      reportProgress: true, headers: httpHeaders
    });
    return this.http.request(req);
  }


  uploadFotoExpositor(idEx: number, foto: File, razonSocial: string, nombreComercial: string, direccion: string,
    rfc: string, telefono: string, correo: string, paginaWeb: string, pais: string, estado: string, acercaDe: string): Observable<Expositor> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("foto", foto);
    formData.append("razonSocial", razonSocial);
    formData.append("nombreComercial", nombreComercial);
    formData.append("direccion", direccion);
    formData.append("rfc", rfc);
    formData.append("telefono", telefono);
    formData.append("correo", correo);
    formData.append("paginaWeb", paginaWeb);
    formData.append("pais", pais);
    formData.append("estado", estado);
    formData.append("acercaDe", acercaDe);

    return this.http.post<Expositor>(`${this.urlEndPoint}/crmUpdateExpositorFoto/${idEx}`, formData, { headers: httpHeaders });
  }

  uploadExpositor(idEx: number, razonSocial: string, nombreComercial: string, direccion: string,
    rfc: string, telefono: string, correo: string, paginaWeb: string, pais: string, estado: string, acercaDe: string): Observable<Expositor> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("razonSocial", razonSocial);
    formData.append("nombreComercial", nombreComercial);
    formData.append("direccion", direccion);
    formData.append("rfc", rfc);
    formData.append("telefono", telefono);
    formData.append("correo", correo);
    formData.append("paginaWeb", paginaWeb);
    formData.append("pais", pais);
    formData.append("estado", estado);
    formData.append("acercaDe", acercaDe);

    return this.http.post<Expositor>(`${this.urlEndPoint}/crmUpdateExpositor/${idEx}`, formData, { headers: httpHeaders });
  }

  consultSiTieneStands(idEx: number): Observable<Number> {
    const url: string = `${this.urlEndPoint}/getTieneStandsAsignacion/${idEx}`;
    return this.http.get<Number>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  saveExpositor(expositor: Expositor, idEv: number): Observable<Expositor> {
    let token = this.authService.token;
    this.id = this.authService.user.id;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    return this.http.post<Expositor>(`${this.urlEndPoint}/crmSaveExpositor/${this.id}/${idEv}`, expositor, { headers: httpHeaders });
  }

  saveFotoExpositor(foto: File, idEx: number): Observable<Expositor> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("foto", foto);
    return this.http.post<Expositor>(`${this.urlEndPoint}/crmSaveFotoExpositor/${idEx}`, formData, { headers: httpHeaders });
  }

  saveContactosExpositor(idEx: number, contactos: any): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/crmSaveContactoExpositor/${idEx}`, contactos, { headers: this.authService.addAuthorizationHeaders() });
  }

  saveFotoContactos(foto: File, idEx: number): Observable<ContactoExpositor> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("archivo", foto);
    return this.http.post<ContactoExpositor>(`${this.urlEndPoint}/crmSaveFotoContacto/${idEx}`, formData, { headers: httpHeaders });
  }

  consRfc(rfc: string): Observable<Number> {
    return this.http.get<Number>(`${this.urlEndPoint}/getRfcUnico/${rfc}`, { headers: this.authService.addAuthorizationHeaders() });
  }


  saveContacto(foto: File, idEx: number, nombre: string, telefono: string, email: string): Observable<ContactoExpositor[]> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("foto", foto);
    formData.append("nombre", nombre);
    formData.append("telefono", telefono);
    formData.append("email", email);
    return this.http.post<ContactoExpositor[]>(`${this.urlEndPoint}/crmSaveContactoFoto/${idEx}`, formData, { headers: httpHeaders });
  }

  saveContactoSinF(idEx: number, nombre: string, telefono: string, email: string): Observable<ContactoExpositor[]> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("telefono", telefono);
    formData.append("email", email);
    return this.http.post<ContactoExpositor[]>(`${this.urlEndPoint}/crmSaveContacto/${idEx}`, formData, { headers: httpHeaders });
  }
  //Heras
  getHistorialExpositorH(idCE: number): Observable<ActividadExpositor[]> {
    return this.http.post<ActividadExpositor[]>(`${this.urlEndPoint}/crm/Historial/Exp/${idCE}`, null, { headers: this.authService.addAuthorizationHeaders() });
  }

  //Carlos
  getsmsWhast(idwEx: number): Observable<WhatsAppContacto[]> {
    const url: string = `${this.urlEndPoint}/Mensajes/${idwEx}`;
    return this.http.get<WhatsAppContacto[]>(url, { headers: this.authService.addAuthorizationHeaders() });
  }

  getemailContacto(ideCon: number): Observable<EmailContacto[]>{
    const url: string = `${this.urlEndPoint}/Email/${ideCon}`;
    return this.http.get<EmailContacto[]>(url,{headers: this.authService.addAuthorizationHeaders() });
  }
  getPdfs(idaC:number): Observable<archivoContacto[]>{
    const url: string = `${this.urlEndPoint}/ArchivosEmail/${idaC}`;
    return this.http.get<archivoContacto[]>(url,{headers: this.authService.addAuthorizationHeaders() });
  }
  createsmsWhats(waC : WhatsAppContacto, idcE: number): Observable <any> {
   const url: string = `${this.urlEndPoint}/crmCreateWha/${idcE}`;
   return this.http.post<any>(url, waC,{ headers: this.authService.addAuthorizationHeaders() }).pipe(
     catchError(e => {
       console.error(e.error.mensaje);
       // swal.fire('Error al crear la medida', e.error.mensaje, 'error');
       // Swal.fire(e.error.mensaje, e.error.error, 'error');
       return throwError(e);
     })
   );

 }

 createCorreo(saveEmail:EmailContacto,ideCon:number): Observable<any>{
  const url: string = `${this.urlEndPoint}/saveEmail/${ideCon}`;
  return this.http.post<any>(url, saveEmail, { headers: this.authService.addAuthorizationHeaders() }).pipe(
    catchError(e => {
      console.error(e.error.message);
      Swal.fire(e.error.message, e.error.error, 'error');
      return throwError(e);
      
    })
  );

 }

 createarchivoContacto(archivo: File,idEc:number): Observable<any>{
  let token = this.authService.token;
  const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  const url: string = `${this.urlEndPoint}/saveArchivo/${idEc}`;
  let formData = new FormData(); 
  formData.append('archivo', archivo);

  const req = new HttpRequest('POST', url, formData, {
    reportProgress: true,
    headers: httpHeaders
  });



  return this.http.request(req);
 }

 upload(descripcion: File,fCha: string ,idEx: number): Observable<HttpEvent<{}>> {
   let token = this.authService.token;
   const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
   const url: string = `${this.urlEndPoint}/crmPdf/${fCha}/${idEx}`;    
   let formData = new FormData(); 
   formData.append('descripcion', descripcion);
   

   const req = new HttpRequest('POST', url, formData, {
     reportProgress: true,
     headers: httpHeaders
   });

   return this.http.request(req);
 }

 createFirmas(archivo: File, nombre: string, descripcion:string): Observable<FirmaEmail[]> {
  let token = this.authService.token;
  const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  let formData = new FormData();

  formData.append("archivo", archivo);
  formData.append("nombre", nombre);
  formData.append("descripcion", descripcion);
  return this.http.post<FirmaEmail[]>(`${this.urlEndPoint}/saveFirmas`, formData, { headers: httpHeaders }).pipe(
    catchError(e => {
      console.log(e.error.message);
      Swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);

    })
  );
 }

updFirmas(idE:number,nombre: string, descripcion:string,archivo: File): Observable<FirmaEmail[]>{
  let token = this.authService.token;
  const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  let formData = new FormData();

  formData.append("nombre", nombre);
  formData.append("descripcion", descripcion);
  formData.append("archivo", archivo);

  return this.http.put<FirmaEmail[]>(`${this.urlEndPoint}/UpdateFirmas/${idE}`, formData, { headers: httpHeaders }).pipe(
    catchError(e => {
      console.log(e.error.message);
      Swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);

    })
  );
}

updSign(idE:number,nombre: string, descripcion:string): Observable<FirmaEmail[]>{
  let token = this.authService.token;
  const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  let formData = new FormData();

  formData.append("nombre", nombre);
  formData.append("descripcion", descripcion);

  return this.http.put<FirmaEmail[]>(`${this.urlEndPoint}/updateSined/${idE}`, formData, { headers: httpHeaders }).pipe(
    catchError(e => {
      console.log(e.error.message);
      Swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);

    })
  );
}



 deleteEmail(id: number): Observable<void[]> {
  const url: string = `${this.urlEndPoint}/deleteEmail/${id}`;
  return this.http.post<void[]>(url, null, { headers: this.authService.addAuthorizationHeaders() }).pipe(
    catchError(e => {
      console.log(e.error.message);
      Swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);
      
    })
  );
}

getFirma(idE): Observable<FirmaEmail>{
  const url: string = `${this.urlEndPoint}/Firmas/${idE}`;
  return this.http.get<FirmaEmail>(url,{headers: this.authService.addAuthorizationHeaders() }); 

}

getFirmas(): Observable<FirmaEmail[]> {
  const url: string = `${this.urlEndPoint}/Firmas`;
  return this.http.get<FirmaEmail[]>(url,{headers: this.authService.addAuthorizationHeaders() });
}

getEcontactoEx():Observable<ContactoExpositor[]>{
  const url: string = `${this.urlEndPoint}/emailCEpo`;
  return this.http.get<ContactoExpositor[]>(url,{headers: this.authService.addAuthorizationHeaders() });

}

sendEmailProgramed(ideCon): Observable<EmailContacto>{
  const url: string = `${this.urlEndPoint}/sendFile/${ideCon}`;
  return this.http.get<EmailContacto>(url,{ headers: this.authService.addAuthorizationHeaders() }).pipe(
    catchError(e => {
      console.log(e.error.mensaje);
      Swal.fire(e.error.message, e.error.error, 'error');
      return throwError(e);
      
    })
  )
}
 
}