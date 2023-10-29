import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
        `${this.supaurl}clases?profesor_id=eq.${profesorId}&select=*,asignaturas(*)`,
        { headers: this.supaheader }
      );
    }


  insertarClases(clases: IClases): Observable<any>{
    return this.http.post<any>(this.supaurl+'clases',clases,{headers: this.supaheader, observe: 'response'});
  }

  updateClases(clases: any): Observable<HttpErrorResponse | any>{
    return this.http.patch<any>(this.supaurl+'clases?clase_id=eq.'+clases.id,clases,{headers: this.supaheader, observe: 'response'});
  }
  
  
  
  
  
  
  
  
  
  
}