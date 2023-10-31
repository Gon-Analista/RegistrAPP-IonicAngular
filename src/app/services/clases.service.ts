import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable} from 'rxjs';
import { IAsistencia } from '../models/IAsistencia';
import { IClases } from '../models/IClases';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {

  supaurl = 'https://pluhkyjkzcqesuwnvwmh.supabase.co/rest/v1/';

  constructor(private http: HttpClient) { }


  supaheader = new HttpHeaders()
    .set('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsdWhreWpremNxZXN1d252d21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc4OTk0MjQsImV4cCI6MjAxMzQ3NTQyNH0.zg4cfELCrPGkXCeGWp8O7tOQoOSqojtT4r5GMjGE2dU')
  
  getClasesList(profesorId: number): Observable<any> {
      return this.http.get<any>(
        `${this.supaurl}clases?profesor_id=eq.${profesorId}&select=*,asignaturas(nombre_asignatura),secciones(nombre_seccion,seccion_id),profesor:profesor_id(name,last_name)`,
        { headers: this.supaheader }
      );
    }

  getAlumnosList(): Observable<any> {
      return this.http.get<any>(
        `${this.supaurl}alumnos?select=alumno_id`,
        { headers: this.supaheader }
      );
    }

  crearAsistencia(asistencia: IAsistencia): Observable<any> {
      return this.http.post(`${this.supaurl}/asistencias`, asistencia, { headers:this.supaheader });
    }


    delClase(claseId: number): Observable<any> {
      return this.http.delete<any>(`${this.supaurl}clases?clase_id=eq.${claseId}`, { headers: this.supaheader });
    }
    
    

  

  
  
  
  
  
  
  
  
  
  
}