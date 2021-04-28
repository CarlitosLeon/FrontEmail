import { Salon } from "./salon";

export class Componente{
    id:number;
    activo:boolean;
    canvas:any;
    color:string;
    tipo:string;
    ptop:number;
    pleft:number;
    width:number;
    height:number;
    fill:string;
    stroke:string;
    numeroStand:string;

    salon:Salon=new Salon();

    idStandRefe:number;

    status:number
    agrupacion:string;
    countAgrupacion:number;



    //////////////////////
    isla: number;
    merged: boolean;
}