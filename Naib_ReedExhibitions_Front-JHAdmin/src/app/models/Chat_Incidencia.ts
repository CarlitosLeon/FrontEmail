import { DetalleUsuario } from './DetalleUsuario';
import { Incidencia } from './Incidencia';

export class ChatIncidencia{
    id:number;
    incidencia:Incidencia;
    detalleUsuario: DetalleUsuario;
    mensaje: string;
    tipo: string;
    registro: Date;

}