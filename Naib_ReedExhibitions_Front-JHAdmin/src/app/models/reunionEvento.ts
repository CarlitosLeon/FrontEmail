import { Evento } from "../users/models/userEvento";
import { BTEnvioReunion } from "./BTEnvioReunion";
import { TratadoAcuerdo } from "./tratadoAcuerdo";

export class ReunionEvento {
    id: number;
    evento: Evento;
    nombre: string;
    lugar: string;
    fecha: Date;
    hora: Date;
    status: number;
    creacion: Date;
    temas: Array<TratadoAcuerdo> = new Array<TratadoAcuerdo>();
    bitacora: Array<BTEnvioReunion> = new Array<BTEnvioReunion>();
}
