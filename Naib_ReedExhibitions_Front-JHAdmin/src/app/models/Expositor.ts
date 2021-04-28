import { Componente } from "./Componente";
import { ContactoExpositor } from "./ContactoExpositor";
import { StandReferencia } from "./StandReferencia";

export class Expositor {
    id: number;
    razon_social: string;
    nombre_comercial: string;
    contacto: string;
    telefono: string;
    email: string;
    rfc: string;
    estatus_crm: string;
    prioridad: string;
    direccion: string;
    pagina_web: string;
    acercaDe: string;
    logo: string = 'nouser.png';
    pais: string;
    estado: string;

    // FUNCIÓN EXCEL CRM
    nombreContacto: string;
    telefonoContacto: string;
    correoContacto: string;
    
    /////////////////////////////////////////FUNTION MAPA VENTAS
    /**
     * img===logo
     */
    clicked: boolean;
    img: string;
    stands: Componente[] = [];
    asignacion: StandReferencia[] = [];
    positionStands: Array<number> = [];
    idStandRefe: number;

    //Agrupación stands
    numStandEvento: string[] = [];
    //
    contactoExpositor:ContactoExpositor = new ContactoExpositor();
}