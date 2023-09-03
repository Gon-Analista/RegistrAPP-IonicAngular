import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router} from '@angular/router';
import { IUserLogin } from '../models/IUserLogin';
import { UserModel } from 'src/app/models/UserModel';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RestablecerPage implements OnInit {

  username: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  usersMap: Map<string, UserModel>;

  constructor(private router: Router, private alertController: AlertController) { 
    this.usersMap = new Map<string, UserModel>();
  }

  ngOnInit() {
    const state = this.router.getCurrentNavigation()?.extras?.state as { usersMap?: Map<string, UserModel> };
    if (state && state.usersMap) {
      this.usersMap = state.usersMap;
    } else {
      // Manejar el caso en el que no se proporciona un usersMap válido
      console.error('No se encontró usersMap en el estado de navegación.');
    }
  }

  async resetPassword() {
    console.log('Resetting password...');
    console.log('Username:', this.username);
    console.log('New Password:', this.newPassword);
    console.log('Confirm Password:', this.confirmPassword);
  
    if (this.username && this.newPassword && this.confirmPassword) {
      console.log('All fields are filled.');
  
      if (this.newPassword === this.confirmPassword) {
        console.log('Las contraseñas coinciden.');
        const user = this.usersMap.get(this.username);
        if (user) {
          user['password'] = this.newPassword;
          // Actualiza el valor en el mapa
          this.usersMap.set(this.username, user);
          await this.showAlert('Contraseña actualizada', `La contraseña del usuario ${this.username} fue actualizada correctamente.`);
          this.router.navigate(['/login']);
        } else {
          await this.showAlert('Error', `Usuario ${this.username} no encontrado`);
        }
      } else {
        await this.showAlert('Contraseñas Incorrectas', 'Las contraseñas ingresadas no coinciden.');
      }
    } else {
      await this.showAlert('Campos en blanco', 'Por favor, complete todos los campos.');
    }
  }

  async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
  


  gotoLogin(){
    this.router.navigate(['/login'])
  }

}
