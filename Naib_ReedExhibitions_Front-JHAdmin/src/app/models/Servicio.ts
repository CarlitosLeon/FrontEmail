import { TipoServicio } from './TipoServicio';

export class Servicio{
    id:number;
    nombre:String;
    icono:String;
    tipoServicio: TipoServicio = new TipoServicio();
}