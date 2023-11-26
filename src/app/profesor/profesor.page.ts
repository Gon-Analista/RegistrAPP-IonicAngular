import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, Params} from '@angular/router';
import { ClasesService } from '../services/clases.service';
import { IAsistencia } from 'src/app/models/IAsistencia';
import { IClases } from 'src/app/models/IClases';
import { lastValueFrom, throwError } from 'rxjs';
import { OverlayEventDetail } from '@ionic/core/components';
import { Animation, AnimationController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalPagePage } from '../modal-page/modal-page.page';
import { ToastController } from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode';


@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.page.html',
  styleUrls: ['./profesor.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,QRCodeModule]
})
export class ProfesorPage implements OnInit {
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  showPerfilContent: boolean = true;
  showAsistenciaContent: boolean = false;
  userInfoReceived: any;
  tiempoRestante: number = 60;
  name: any;
  qrCodeValue: any | null = null;
  selectedClase: any;
  idUserHtmlRouterLink: any;
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('label2', { read: ElementRef }) label2!: ElementRef;
  @ViewChild('QR', { read: ElementRef }) QR!: ElementRef;
  private animation!: Animation;
  mostrarCodigoQR: boolean = true;
  clases: any;
  alumnos: any;
  asistencia: IAsistencia = {
    clase_id: 0,
    seccion_id: 0,
    alumno_id: 0,
  };

  logout() {
    localStorage.removeItem('TOKEN_PROFESOR');
    this.router.navigate(['/login']); 
  }

  async generateQRCode(clase: any) {
    const existeAsistencia = await this.verificarAsistenciaExistente(clase.clase_id, clase.seccion_id);
  
    if (existeAsistencia) {
      this.popupClaseExistente(clase)
    } else {
      const listaAlumnos: any[] = await this.getAlumnosList();
      this.presentLoading(clase);
      
      for (const alumno of listaAlumnos) {
        const asistencia: IAsistencia = {
          clase_id: clase.clase_id,
          seccion_id: clase.seccion_id,
          alumno_id: alumno.alumno_id,
        };
  
        await lastValueFrom(this.clasesService.crearAsistencia(asistencia));
      }
      const qrData = JSON.stringify({
        clase_id: clase.clase_id,
        seccion_id: clase.seccion_id,
    });
      this.qrCodeValue = qrData;
      const interval = setInterval(() => {
        this.tiempoRestante--;
  
        if (this.tiempoRestante <= 0) {
          this.mostrarCodigoQR = false;
          clearInterval(interval); 
        }
      }, 1000);
    }
}
  constructor(private toastController: ToastController,private modalController: ModalController,private clasesService: ClasesService  , private alertController: AlertController,private route: ActivatedRoute, private router: Router, private animationCtrl: AnimationController,private loadingController: LoadingController) {
    this.route.queryParams.subscribe((params: Params) => {
      this.userInfoReceived = {
        name: params['name'],
        username: params['username'],
        id: params['id'],
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

  async openModal(clase: any) {
    const alumnos = await lastValueFrom(this.clasesService.getAlumnosPresentes(clase.clase_id, clase.seccion_id));
    console.log("alumnos presentes:",alumnos);
    if (alumnos.length === 0) {
      const toast = await this.toastController.create({
        message: 'La clase no está abierta en este momento',
        duration: 2000,
        position: 'middle'
      });
      toast.present();
      return;
    }
    const modal = await this.modalController.create({
      component: ModalPagePage,
      componentProps: {
        clase: clase.clase_id,
        seccion: clase.secciones.seccion_id,
        profesor: clase.profesor_id,
        alumnos: alumnos,
      },
    });
  
    await modal.present();
  }
  
  
  
  ngOnInit() {
    
    this.getClases(this.userInfoReceived.id);
  }
  
  async getClases(profesorId: number) {
    console.log("profesorId",profesorId);
    this.clases = await lastValueFrom(this.clasesService.getClasesList(profesorId));
  }

  async crearAsistencia(clase: any) {
    const existeAsistencia = await this.verificarAsistenciaExistente(clase.clase_id, clase.seccion_id);
  
    if (existeAsistencia) {
      this.popupClaseExistente(clase)
    } else {
      const listaAlumnos: any[] = await this.getAlumnosList();
      this.presentLoading(clase);
      
      for (const alumno of listaAlumnos) {
        const asistencia: IAsistencia = {
          clase_id: clase.clase_id,
          seccion_id: clase.seccion_id,
          alumno_id: alumno.alumno_id,
        };
  
        await lastValueFrom(this.clasesService.crearAsistencia(asistencia));
      }
    }
  }

  async getAlumnosList(): Promise<any[]> {
    const alumnos = await lastValueFrom(this.clasesService.getAlumnosList());
    return alumnos;
  }
  
  async verificarAsistenciaExistente(claseId: number, seccionId: number): Promise<boolean> {
  try {
    const asistencias = await lastValueFrom(
      this.clasesService.getAsistenciasPorClaseYSeccion(claseId, seccionId)
    );
    return asistencias.length > 0;
  } catch (error) {
    console.error('Error al verificar la existencia de asistencia:', error);
    return false;
  }
}


  async deleteClase(clase: any): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Finalizar',
      subHeader: clase.asignaturas.nombre_asignatura,
      message: '¿Está seguro de finalizar esta Clase?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: async () => {
            try {
            const response = await this.clasesService.delClase(clase.clase_id).toPromise();
            console.log("clase id:", clase.clase_id);
            console.log(response);
            // eliminamos la clase de manera local
            const index = this.clases.indexOf(clase);
            if (index !== -1) {
              this.clases.splice(index, 1);
            }
            } catch (err: any) {
              console.log(err);
              if (err.status === 400) {
                console.log('Error 400');
              }
            }
          },
        },
      ],
    });
    await alert.present();
  
  }

async presentSuccessAlert(clase: any): Promise<void> {
  const alert = await this.alertController.create({
    header: 'Éxito',
    message: 'La clase de ' + clase.asignaturas.nombre_asignatura + ' ha sido abierta correctamente.',
    buttons: ['Aceptar']
  });

  await alert.present();
}

  
  async presentLoading(clase: any) {
    const loading = await this.loadingController.create({
      message: 'Procesando...',
      duration: 2000, 
      translucent: true,
    });
  
    await loading.present();
  
    
    loading.onDidDismiss().then(() => {
      this.presentSuccessAlert(clase);
    });
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
  
  async cancel() {
    console.log('Cerrando el modal');
    await this.modalController.dismiss({ dismissed: true });
  }
  
  
  confirm() {
    console.log('Confirm');
  }
  

  async popupClaseExistente(clase: any): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'La clase de ' + clase.asignaturas.nombre_asignatura + ' ya esta en proceso',
      buttons: ['Aceptar']
    });
  
    await alert.present();
  }
  

}
