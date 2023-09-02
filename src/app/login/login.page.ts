import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, NavigationExtras, RouterLinkWithHref } from '@angular/router';
import { IUserLogin } from '../models/IUserLogin';
import { UserModel } from 'src/app/models/UserModel';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule,
    RouterLinkWithHref, FormsModule, RouterModule]})
export class LoginPage implements OnInit {

  listUser: UserModel[] = [
    new UserModel('Gonzalo','Ulloa','go.ulloa@duocuc.cl','PROFESOR','go.ulloa','ulloa123'),
    new UserModel('David','Mallma','da.mallma@duocuc.cl','ALUMNO','da.mallma','mallma123')
  ];

  userLoginModal: IUserLogin = {
    username: '',
    password: ''
  };
  
  constructor(private router: Router){}

  ngOnInit() {
    this.userLoginModalRestart();
  }

  gotoPerfil(){
    this.router.navigate(['/perfil'])
  }
  
  userLogin(userLoginInfo: IUserLogin): boolean{
    for(let i = 0; i < this.listUser.length; i++){
      console.log('Comparando:', this.listUser[i].username, userLoginInfo.username);
      console.log('Contraseñas:', this.listUser[i].password, userLoginInfo.password);
      if((this.listUser[i].username == userLoginInfo.username) && (this.listUser[i].password == userLoginInfo.password)){
        console.log('User Loged...', this.userLoginModal.username, this.userLoginModal.password);
        let userInfoSend: NavigationExtras = {
          state: {
            user: this.listUser[i]
          }
        }
        let sendInfo = this.router.navigate(['/perfil'], userInfoSend);
      }
      else{
        console.log('User not found');
      }
    }
    this.userLoginModalRestart();
    return false;
    
  }

  userLoginModalRestart(): void{
    this.userLoginModal.username = '';
    this.userLoginModal.password = '';
  }
  gotoRest(){
    this.router.navigate(['/restablecer'])
  }

}
