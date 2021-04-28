import { Evento } from "../users/models/userEvento";

export class Agenda {
    id: number;
    evento: Evento = new Evento();
    nombre: string;
    rol: string;
    numero: number;
    creacion: Date;
    envio: boolean;
}
