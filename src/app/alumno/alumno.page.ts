import { Component, OnInit, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserModelAlumno } from 'src/app/models/IUserModelAlumno';
import { AsistenciaService } from '../services/asistencia.service';
import { Animation, AnimationController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { ClasesService } from '../services/clases.service';
@Component({
  selector: 'app-home',
  templateUrl: 'alumno.page.html',
  styleUrls: ['alumno.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PerfilPage implements OnInit{

  showPerfilContent: boolean = true;
  showAsistenciaContent: boolean = false;
  userInfoReceived: any;
  idUserHtmlRouterLink: any;
  @ViewChild('label2', { read: ElementRef }) label2!: ElementRef;
  @ViewChild('QR', { read: ElementRef }) QR!: ElementRef;
  clases: any;
  nuevoEstado: any;

  logout() {
    localStorage.removeItem('TOKEN_ALUMNO');
    this.router.navigate(['/login']); 
  }

  private animation!: Animation;
  constructor(private clasesService: ClasesService ,private alertController: AlertController,private loadingControl: LoadingController,private AsistenciaService: AsistenciaService  ,private route: ActivatedRoute, private router: Router, private animationCtrl: AnimationController) {
    this.route.queryParams.subscribe((params: Params) => {
      this.userInfoReceived = {
        name: params['name'],
        username: params['username'],
        id : params['id'],
      };
      console.log("user info:",this.userInfoReceived);
    });
    
  }

   ngAfterViewInit() {
    this.animation = this.animationCtrl
      .create()
      .addElement(this.label2.nativeElement)
      .duration(3000)
      .fromTo('transform', 'translateX(0px)', 'translateX(100px)')
      .fromTo('opacity', '0', '1'); 
      this.animation.play();
  }


  toggleContent(event: any) {
    const tab = event.detail.value;
    if (tab === 'perfil') {
      this.showPerfilContent = true;
      this.showAsistenciaContent = false;
    } else if (tab === 'asistencia') {
      this.showPerfilContent = false;
      this.showAsistenciaContent = true;
    }
  }
  
  ngOnInit() {
    this.getAsist(this.userInfoReceived.id);
  }
  public asistenciaActualizada: EventEmitter<void> = new EventEmitter<void>();

  actualizarAsistencia() {
    this.asistenciaActualizada.emit();
  }

  async getAsist(alumnoId: number) {
    this.clases = await lastValueFrom(this.AsistenciaService.getAsistenciaList(alumnoId));
    console.log("asistencia:",this.clases);
    this.actualizarAsistencia();
  }

  async updateClaseEstado(clase: any) {
    const alumno_id = this.userInfoReceived.id;

    const asistencias = await lastValueFrom(
      this.clasesService.getAsistenciasPorClaseYSeccion(clase.clase_id, clase.seccion_id)
    );
    const alumnoYaPresente = asistencias.find((asistencia: any) => asistencia.clase_id === clase.clase_id);

    if (alumnoYaPresente && alumnoYaPresente.estado === true) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ya has marcado tu presencia en esta clase',
        buttons: ['Aceptar']
      });
  
      await alert.present();
      return;
    }
    const nuevoEstadoT = true;
    await lastValueFrom(this.AsistenciaService.updateClaseEstado(alumno_id, clase.clase_id, nuevoEstadoT));
    this.presentLoading();
  }
  

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'El alumno ' + this.userInfoReceived.name + ' ha sido marcado como presente.',  
      buttons: ['Aceptar']
    }); 
  
    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingControl.create({
      message: 'Procesando...',
      duration: 2000, 
      translucent: true,
    });
  
    await loading.present();
  
  
    loading.onDidDismiss().then(() => {
      this.presentSuccessAlert()
    });
  }
  

}

