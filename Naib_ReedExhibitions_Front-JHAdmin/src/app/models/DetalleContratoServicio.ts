import { TipoServicio } from './TipoServicio';

export class DetalleContratoServicio{
    id:number;
    idStandReferencia:number;
    idTipoServicio:number;
    status:String;
    statusPago:String;
    tipoServicio:TipoServicio;
}