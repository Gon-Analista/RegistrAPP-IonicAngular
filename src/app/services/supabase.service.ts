import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UserModel } from '../models/IUserModel';
import { UserModelAlumno } from '../models/IUserModelAlumno';
import { IUserLogin } from '../models/IUserLogin';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  URL_API = 'https://pluhkyjkzcqesuwnvwmh.supabase.co/rest/v1/';

  constructor(private http: HttpClient) { }


  header = new HttpHeaders()
    .set('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsdWhreWpremNxZXN1d252d21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc4OTk0MjQsImV4cCI6MjAxMzQ3NTQyNH0.zg4cfELCrPGkXCeGWp8O7tOQoOSqojtT4r5GMjGE2dU')

  
  getLoginProfesores(UserLogin : IUserLogin): Observable<UserModel> {
    return this.http.get<UserModel[]>(this.URL_API +'profesores?select=profesor_id,name,username,password,role&username=eq.' + UserLogin.username + '&password=eq.' + UserLogin.password, { headers: this.header, responseType: 'json' }).pipe(
      map((userInfo) => {
        console.log("userinfo profesor:",userInfo);
        return userInfo[0];
      }));
    }

  getLoginAlumnos(UserLogin : IUserLogin): Observable<UserModelAlumno> {
      return this.http.get<UserModelAlumno[]>(this.URL_API +'alumnos?select=alumno_id,name,username,password,role&username=eq.' + UserLogin.username + '&password=eq.' + UserLogin.password, { headers: this.header, responseType: 'json' }).pipe(
        map((userInfo) => {
          console.log("userinfo alumno:",userInfo);
          return userInfo[0];
        }));
  }

  }
