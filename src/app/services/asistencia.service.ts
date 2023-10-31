import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable} from 'rxjs';
import { IAsistencia } from '../models/IAsistencia';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  supaurl = 'https://pluhkyjkzcqesuwnvwmh.supabase.co/rest/v1/';

  constructor(private http: HttpClient) { }


  supaheader = new HttpHeaders()
    .set('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsdWhreWpremNxZXN1d252d21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc4OTk0MjQsImV4cCI6MjAxMzQ3NTQyNH0.zg4cfELCrPGkXCeGWp8O7tOQoOSqojtT4r5GMjGE2dU')



  
  getAsistenciaList(alumnoId: number): Observable<any> {
      return this.http.get<any>(
        `${this.supaurl}asistencias?alumno_id=eq.${alumnoId}&select=*,clases(fecha,sala,asignatura_id(nombre_asignatura)),secciones:seccion_id(nombre_seccion,sede_id(nombre_sede))`,
        { headers: this.supaheader }
      );
    }

  updateClaseEstado(alumno_id: number, clase_id: number, nuevoEstado: boolean): Observable<any> {
    const url = `${this.supaurl}asistencias?alumno_id=eq.${alumno_id}&clase_id=eq.${clase_id}`;
    const body = {
      estado: nuevoEstado
    };
    return this.http.patch(url, body, { headers: this.supaheader });
  }
}

