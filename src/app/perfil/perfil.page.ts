import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from 'src/app/models/UserModel';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'perfil.page.html',
  styleUrls: ['perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PerfilPage implements OnInit{

  userInfoReceived: UserModel | undefined;
  idUserHtmlRouterLink: any;
  

  constructor(private router: Router, private activatedRoute: ActivatedRoute, public alerta:AlertController) {
    this.userInfoReceived = this.router.getCurrentNavigation()?.extras.state?.['user'];
   }

  ngOnInit() {
  }
  gotoAsis(){
    this.router.navigate(['/asistencia'])
  }
  async presentAlert() {
    const alert = await this.alerta.create({
      header: 'Título de la Alerta',
      message: 'Mensaje de la Alerta',
      buttons: ['OK']
    });
  
    await alert.present();
  }
}