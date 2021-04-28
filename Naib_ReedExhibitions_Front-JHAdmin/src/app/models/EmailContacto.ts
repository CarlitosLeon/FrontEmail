import { ContactoExpositor } from "./ContactoExpositor";
import { FirmaEmail } from "./FirmaEmail";

export class EmailContacto {
    id: number;
    contacto_expositor: ContactoExpositor;
    firma: FirmaEmail;
    asunto: string;
    descripcion: string;
    fecha_programado: Date;
    status: number;
    creacion: Date;
    checked: boolean;
   
}