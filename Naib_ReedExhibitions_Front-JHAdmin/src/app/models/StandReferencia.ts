import { Servicio } from './Servicio';
import { Incidencia } from './Incidencia';
import { Expositor } from './Expositor';
import { Componente } from './Componente';
import { User } from '../users/models/user';

export class StandReferencia{
    id:number;
    componente:Componente=new Componente();
    expositor:Expositor=new Expositor();
    porcentajeArmado:string;
    status:string;
    statusPago:string;
    estatus_asignacion:string;
    
    //Agrados
    idExpositor:number;
    idSalon:number;
    numeroStand:string;
    asignacionEvento;
    incidencias:Incidencia[]=[];
    incidencia:Incidencia=new Incidencia();
    servicios:Servicio[]=[];
    usuarios:User[]=[];

}