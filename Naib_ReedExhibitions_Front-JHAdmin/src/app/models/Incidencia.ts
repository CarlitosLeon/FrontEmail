import { DetalleUsuario } from "./DetalleUsuario";
import { IncidenciaGeneral } from "./incidenciaGeneral";
import { IncidenciaReferenciada } from "./IncidenciaReferenciada";

export class Incidencia {
    ticket: number;
    idDetalleUsuario: DetalleUsuario;
    tipoIncidencia: string;
    categoria: string;
    subcategoria: string;
    reporta: string;
    nombreReporta: string;
    telefonoReporta: string;
    seguimiento: string;
    empresaSeguimiento: string;
    nombreSeguimiento: string;
    descripcion: string;
    status: string;
    salon: number;
    detalleGeneral: IncidenciaGeneral;
    detalleReferencia: IncidenciaReferenciada;

    registro: string
    registroMinuto: string;
    registroHora: string;
    registroDia: string;
}