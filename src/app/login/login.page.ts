import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
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
  
  constructor(private router: Router, private alertController: AlertController){}

  ngOnInit() {
    this.userLoginModalRestart();
  }

  gotoPerfil(){
    this.router.navigate(['/perfil'])
  }
  
  async userLogin(userLoginInfo: IUserLogin): Promise<void> {
    if (!userLoginInfo.username || !userLoginInfo.password) {
      // Campos en blanco, muestra la alerta
      await this.showAlert('Campos en blanco', 'Por favor, complete ambos campos.');
    } else {
      let userFound = false;
      for (let i = 0; i < this.listUser.length; i++) {
        if (
          this.listUser[i].username === userLoginInfo.username &&
          this.listUser[i].password === userLoginInfo.password
        ) {
          let userInfoSend: NavigationExtras = {
            state: {
              user: this.listUser[i]
            }
          };
          this.router.navigate(['/perfil'], userInfoSend);
          return;
        } else {
          userFound = true;
        }

        let sendInfo = this.router.navigate(['/perfil'], userInfoSend);
      }
      if (userFound) {
        await this.showAlert('Credenciales incorrectas', 'El nombre de usuario o la contraseña son incorrectos.');
      }
    }
    this.userLoginModalRestart();
  }

  userLoginModalRestart(): void{
    this.userLoginModal.username = '';
    this.userLoginModal.password = '';
  }
  gotoRest(){
    this.router.navigate(['/restablecer'])
  }
  async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
  
    await alert.present();
  }
}
