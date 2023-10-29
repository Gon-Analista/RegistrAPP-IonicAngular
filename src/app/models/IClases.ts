import { Time } from "@angular/common";

export interface IClases{

    clase_id: number;
    asignatura_id: number;
    fecha: Date;
    hora_inicio: Time;
    hora_final: Time;
}