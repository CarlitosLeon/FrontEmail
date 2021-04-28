import { DetalleContratoServicio } from './DetalleContratoServicio';
import { DetalleUsuario } from './DetalleUsuario';

export class EvidenciaServicio{
    id:number;
    idDetalleContratoServicio:number;
    idDetalleUsuario:number;
    img:String;
    statusServicio:String;
    detalleContratoServicio:DetalleContratoServicio;
    detalleUsuario:DetalleUsuario;
    registro:string;
    horaRegistro:string;
}