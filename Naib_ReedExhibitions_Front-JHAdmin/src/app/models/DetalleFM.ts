import { DetalleUsuario } from './DetalleUsuario';
import { HorarioFM } from './HorarioFM';
import { Zona } from './Zona';

export class DetalleFM {
    id: number;
    detalleUsuario: DetalleUsuario = new DetalleUsuario();
    horarios: HorarioFM[] = [];
    zona: Zona;
    equipo: string;
    detalle: string;
    creacion: string;
}