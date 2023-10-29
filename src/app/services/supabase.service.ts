import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UserModel } from '../models/IUserModel';	
import { IUserLogin } from '../models/IUserLogin';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  URL_API = 'https://pluhkyjkzcqesuwnvwmh.supabase.co/rest/v1/';

  constructor(private http: HttpClient) { }


  header = new HttpHeaders()
    .set('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsdWhreWpremNxZXN1d252d21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc4OTk0MjQsImV4cCI6MjAxMzQ3NTQyNH0.zg4cfELCrPGkXCeGWp8O7tOQoOSqojtT4r5GMjGE2dU')


  // lista de usuarios via id(arreglo)
    getUser(id: string): Observable<UserModel> {
      return this.http.get<UserModel[]>(this.URL_API + 'profesores?profesor_id=eq.' + id, { headers: this.header, responseType: 'json' }).pipe(
          map( (userInfo) => {
            console.log(userInfo)
              return userInfo[0];
          })
      );
  }
  
  getLoginProfesores(UserLogin : IUserLogin): Observable<UserModel> {
    return this.http.get<UserModel[]>(this.URL_API +'profesores?select=name,username,password,role&username=eq.' + UserLogin.username + '&password=eq.' + UserLogin.password, { headers: this.header, responseType: 'json' }).pipe(
      map((userInfo) => {
        console.log("userinfo:",userInfo);
        return userInfo[0];
      }));
    }

  getLoginAlumnos(UserLogin : IUserLogin): Observable<UserModel> {
      return this.http.get<UserModel[]>(this.URL_API +'alumnos?select=name,username,password,role&username=eq.' + UserLogin.username + '&password=eq.' + UserLogin.password, { headers: this.header, responseType: 'json' }).pipe(
        map((userInfo) => {
          console.log("userinfo:",userInfo);
          return userInfo[0];
        }));
      }

  getSecciones(id_usuario:string): Observable<any> {
    return this.http.get<any[]>(this.URL_API + 'Asignacion?select=id_seccion(*)&id_usuario=eq.'+id_usuario, { headers: this.header, responseType: 'json' })
  }







  





  }
  
