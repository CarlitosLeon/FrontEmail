import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './users/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from './users/service/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";
import { MapaComponent } from './floor_manager/mapa/mapa.component';
import { IncidenciaEventoComponent } from './floor_manager/incidencia-evento/incidencia-evento.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChatFMComponent } from './floor_manager/incidencia-evento/chat-fm/chat-fm.component';
import { DetalleExpositorComponent } from './floor_manager/detalle-expositor/detalle-expositor.component';
import { AyudaComponent } from './floor_manager/ayuda/ayuda.component';
import { OrgchartModule } from '@dabeng/ng-orgchart';
import { MenuFMComponent } from './menu-fm/menu-fm.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AsignacionZonaComponent } from './adminFM/asignacion-zona/asignacion-zona.component';
import { HorariosFmComponent } from './adminFM/horarios-fm/horarios-fm.component';
import { ReunionWComponent } from './adminFM/reunion-w/reunion-w.component';
import { AdminReunionComponent } from './adminFM/admin-reunion/admin-reunion.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBadgeModule } from '@angular/material/badge';
import { DatePipe } from '@angular/common';
import { ListaExpositoresComponent } from './floor_manager/lista-expositores/lista-expositores.component';
import { VentasComponent } from './crm/ventas/ventas.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import { VentasProspectosComponent } from './crm/ventas-prospectos/ventas-prospectos.component';
import { PlanoComercialComponent } from './public/plano-comercial/plano-comercial.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { NgxSummernoteModule } from 'ngx-summernote';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarioComponent } from './crm/calendario/calendario.component';
import { ReportesComponent } from './crm/reportes/reportes.component';
import { ChartsModule } from 'ng2-charts';
import { EmailMasivosComponent } from './crm/emailMasivo/email-masivos/email-masivos.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
])

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListaExpositoresComponent,
    MenuFMComponent,
    MapaComponent,
    IncidenciaEventoComponent,
    DetalleExpositorComponent,
    ChatFMComponent,
    AyudaComponent,
    AsignacionZonaComponent,
    HorariosFmComponent,
    ReunionWComponent,
    AdminReunionComponent,
    VentasComponent,
    VentasProspectosComponent,
    PlanoComercialComponent,
    CalendarioComponent,
    ReportesComponent,
    EmailMasivosComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    OrgchartModule,
    MatSidenavModule,
    MatExpansionModule,
    MatSliderModule,
    MatFormFieldModule,
    MatSelectModule,
    MatBadgeModule,
    MatToolbarModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatStepperModule,
    NgxSummernoteModule,
    FullCalendarModule,
    ChartsModule,
    MatCheckboxModule,
    MatTableModule
  ],
  providers: [
    AuthService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
