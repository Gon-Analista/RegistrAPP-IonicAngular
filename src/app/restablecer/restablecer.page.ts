import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router} from '@angular/router';
import { IUserLogin } from '../models/IUserLogin';
import { UserModel } from 'src/app/models/IUserModel';
import { ServiciosService } from '../services/supabase.service';
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
    
  
    if (this.username && this.newPassword && this.confirmPassword) {
      console.log('All fields are filled.');
  
      if (this.newPassword === this.confirmPassword) {
        console.log('Las contraseñas coinciden.');
        const user = this.usersMap.get(this.username);
        
        if (user) {
          user['password'] = this.newPassword;
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





/*
export class ResetPasswordPage {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: ServiciosService
  ) {
    const tokenParam = this.route.snapshot.paramMap.get('token');
    if (tokenParam !== null) {
      this.token = tokenParam;
    } else {
      // Maneja el caso en el que no hay token válido, por ejemplo, redirigiendo o mostrando un mensaje de error.
      console.error('Token no válido o ausente');
    }
  }

  async resetPassword() {
    if (this.newPassword === this.confirmPassword) {
      try {
        // Restablece la contraseña del usuario utilizando la función del servicio Supabase.
        await this.supabaseService.resetUserPassword(this.token, this.newPassword);

        // Redirige al usuario a la página de inicio de sesión u otra página deseada.
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        // Maneja errores según sea necesario.
      }
    } else {
      // Muestra un mensaje al usuario si las contraseñas no coinciden.
      console.log('Las contraseñas no coinciden');
    }
  }
}
*/