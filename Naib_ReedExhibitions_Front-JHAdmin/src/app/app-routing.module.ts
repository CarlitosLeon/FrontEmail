import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './users/login.component';
import { ListaExpositoresComponent } from './floor_manager/lista-expositores/lista-expositores.component';
import { RolGuard } from './users/guards/rol.guard';
import { MapaComponent } from './floor_manager/mapa/mapa.component';
import { IncidenciaEventoComponent } from './floor_manager/incidencia-evento/incidencia-evento.component';
import { ChatFMComponent } from './floor_manager/incidencia-evento/chat-fm/chat-fm.component';
import { DetalleExpositorComponent } from './floor_manager/detalle-expositor/detalle-expositor.component';
import { AyudaComponent } from './floor_manager/ayuda/ayuda.component';
import { AsignacionZonaComponent } from './adminFM/asignacion-zona/asignacion-zona.component';
import { HorariosFmComponent } from './adminFM/horarios-fm/horarios-fm.component';
import { ReunionWComponent } from './adminFM/reunion-w/reunion-w.component';
import { AdminReunionComponent } from './adminFM/admin-reunion/admin-reunion.component';
import { VentasComponent } from './crm/ventas/ventas.component';
import { VentasProspectosComponent } from './crm/ventas-prospectos/ventas-prospectos.component';
import { PlanoComercialComponent } from './public/plano-comercial/plano-comercial.component';
import { CalendarioComponent } from './crm/calendario/calendario.component';
import { ReportesComponent } from './crm/reportes/reportes.component';
import { EmailMasivosComponent } from './crm/emailMasivo/email-masivos/email-masivos.component';


//Recuerda colocar el canActivate y el path con el rol
const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'listaExpositores', component: ListaExpositoresComponent, canActivate: [RolGuard], data: { rol: ['ROLE_FM', 'ROLE_ADMINFM'] } },
  { path: 'mapa', component: MapaComponent, canActivate: [RolGuard], data: { rol: ['ROLE_FM', 'ROLE_ADMINFM'] } },
  { path: 'incidencias', component: IncidenciaEventoComponent, canActivate: [RolGuard], data: { rol: ['ROLE_FM', 'ROLE_ADMINFM'] } },
  { path: 'incidencias/:type/chat/:idI', component: ChatFMComponent, canActivate: [RolGuard], data: { rol: ['ROLE_FM', 'ROLE_ADMINFM'] } },
  { path: 'detalleExpositor/:id', component: DetalleExpositorComponent, canActivate: [RolGuard], data: { rol: ['ROLE_FM', 'ROLE_ADMINFM'] } },
  { path: 'ayuda', component: AyudaComponent, canActivate: [RolGuard], data: { rol: ['ROLE_FM', 'ROLE_ADMINFM'] } },
  { path: 'AdminFloorManagers', component: AsignacionZonaComponent, canActivate: [RolGuard], data: { rol: ['ROLE_ADMINFM'] } },
  { path: 'misFloorManagers', component: HorariosFmComponent, canActivate: [RolGuard], data: { rol: ['ROLE_ADMINFM'] } },
  { path: 'reunion', component: ReunionWComponent, canActivate: [RolGuard], data: { rol: ['ROLE_ADMINFM'] } },
  { path: 'misReuniones', component: AdminReunionComponent, canActivate: [RolGuard], data: { rol: ['ROLE_ADMINFM'] } },
  { path: 'mapaVentas', component: VentasComponent, canActivate: [RolGuard], data: { rol: ['ROLE_ADMINVENTAS', 'ROLE_VENTAS'] } },
  { path: 'ventasProspectos', component: VentasProspectosComponent, canActivate: [RolGuard], data: { rol: ['ROLE_ADMINVENTAS', 'ROLE_VENTAS'] } },
  { path: 'EmailMasivos', component: EmailMasivosComponent, canActivate: [RolGuard], data: { rol: ['ROLE_ADMINVENTAS', 'ROLE_VENTAS'] } },
  { path: 'ventasCalendario', component: CalendarioComponent, canActivate: [RolGuard], data: { rol: ['ROLE_ADMINVENTAS', 'ROLE_VENTAS'] } },
  { path: 'reportes', component: ReportesComponent, canActivate: [RolGuard], data: { rol: ['ROLE_ADMINVENTAS', 'ROLE_VENTAS'] } },
  { path: 'plano-comercial', component: PlanoComercialComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
