import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router, NavigationExtras, RouterLinkWithHref } from '@angular/router';
import { IUserLogin } from '../models/IUserLogin';
import { UserModel } from 'src/app/models/IUserModel';
import { RouterModule } from '@angular/router';
import { ServiciosService } from '../services/supabase.service'; 
import { Animation, AnimationController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLinkWithHref, FormsModule, RouterModule]
})
export class LoginPage implements OnInit {
  @ViewChild('logAnim', { read: ElementRef }) logAnim!: ElementRef;
  private animation!: Animation;

  userLoginModal: IUserLogin = {
    username: '',
    password: ''
  };

  constructor(private router: Router, private alertController: AlertController,private animationCtrl: AnimationController, private servicio: ServiciosService) {
   
  }

  ngAfterViewInit() {
    this.animation = this.animationCtrl
      .create()
      .addElement(this.logAnim.nativeElement)
      .fill('both')
      .duration(1500)
      .keyframes([
        { offset: 0,  opacity: '0' },
        { offset: 0.2, opacity: '0.1' },
        { offset: 0.4, opacity: '0.4' },
        { offset: 0.7,  opacity: '0.6' },
        { offset: 0.9,  opacity: '0.9',transform: 'scale(1.1)' },
        { offset: 1,  opacity: '1', transform: 'scale(1)' },
      ]);
    this.animation.play();
  }

  ngOnInit() {
    this.userLoginModalRestart();
  }

  gotoPerfil() {
    this.router.navigate(['/perfil'])
  }

  async userLogin(userLoginInfo: IUserLogin): Promise<void> {
    const profesor = await lastValueFrom(this.servicio.getLoginProfesores(userLoginInfo));
    const alumno = await lastValueFrom(this.servicio.getLoginAlumnos(userLoginInfo));
  
    if (!userLoginInfo.username || !userLoginInfo.password) {
      await this.showAlert('Campos en blanco', 'Por favor, complete ambos campos.');
    } else {
      if (profesor && profesor.password === userLoginInfo.password) {
        console.log('Usuario ingresado:', profesor.username, profesor.password, profesor.profesor_id);
        // Almacena el token de autenticación en el localStorage.
        localStorage.setItem('TOKEN_PROFESOR', 'token_del_profesor'); // Reemplaza 'TOKEN_DEL_PROFESOR' con el token real.
        this.router.navigate(['/profesor'], {
          queryParams: {
            name: profesor.name,
            username: profesor.username,
            id: profesor.profesor_id,
          }
        });
      } else if (alumno && alumno.password === userLoginInfo.password) {
        console.log('Usuario ingresado:', alumno.username, alumno.password);
        // Almacena el token de autenticación en el localStorage.
        localStorage.setItem('TOKEN_ALUMNO', 'token_del_alumno'); // Reemplaza 'TOKEN_DEL_ALUMNO' con el token real.
        this.router.navigate(['/alumno'], {
          queryParams: {
            name: alumno.name,
            username: alumno.username,
            id: alumno.alumno_id,
          }
        });
        
      } else {
        await this.showAlert('Credenciales incorrectas', 'El nombre de usuario o la contraseña son incorrectos.');
      }
    }
  
    this.userLoginModalRestart();
  }
  


  userLoginModalRestart(): void {
    this.userLoginModal.username = '';
    this.userLoginModal.password = '';
  }

  gotoRest() {
    const navigationExtras: NavigationExtras = {
      state: {
        usersMap: this.userLoginModal
      },
    };
    this.router.navigate(['/restablecer'], navigationExtras);
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
