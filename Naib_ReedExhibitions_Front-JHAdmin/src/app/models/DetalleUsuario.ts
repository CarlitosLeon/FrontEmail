import { User } from 'src/app/users/models/user';
import { Evento } from '../users/models/userEvento';
import { DetalleFM } from './DetalleFM';

export class DetalleUsuario {
    id: number;
    status: number;
    usuario: User;
    evento: Evento;
}