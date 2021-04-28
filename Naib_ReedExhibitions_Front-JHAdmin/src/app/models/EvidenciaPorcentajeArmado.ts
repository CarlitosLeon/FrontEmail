import { DetalleUsuario } from './DetalleUsuario';

export class EvidenciaPorcetnajeArmado{
    id:number;
    idStandReferencia:number;
    idDetalleUsuario:number;
    porcentajeArmado:String;
    img:String;
    registro:string;
    horaRegistro:String;
    detalleUsuario:DetalleUsuario;
}