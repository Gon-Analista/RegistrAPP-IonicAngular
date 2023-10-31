import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, Params} from '@angular/router';
import { ClasesService } from '../services/clases.service';
import { IAsistencia } from 'src/app/models/IAsistencia';
import { lastValueFrom, throwError } from 'rxjs';
import { OverlayEventDetail } from '@ionic/core/components';
import { Animation, AnimationController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.page.html',
  styleUrls: ['./profesor.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfesorPage implements OnInit {

  showPerfilContent: boolean = true;
  showAsistenciaContent: boolean = false;
  userInfoReceived: any;
  idUserHtmlRouterLink: any;
  @ViewChild('label2', { read: ElementRef }) label2!: ElementRef;
  @ViewChild('QR', { read: ElementRef }) QR!: ElementRef;
  private animation!: Animation;
  clases: any;
  asistencia: IAsistencia = {
    clase_id: 0,
    seccion_id: 0,
    alumno_id: 0,
  };
  

  constructor(private clasesService: ClasesService  , private alertController: AlertController,private route: ActivatedRoute, private router: Router, private animationCtrl: AnimationController,private loadingController: LoadingController) {
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
  
  ngOnInit() {
    this.getClases(this.userInfoReceived.id);
  }
  
  async getClases(profesorId: number) {
    console.log("profesorId",profesorId);
    this.clases = await lastValueFrom(this.clasesService.getClasesList(profesorId));
  }

  async crearAsistencia(clase: any) {
    const listaAlumnos: any[] = await this.getAlumnosList();
    this.presentLoading();
    for (const alumno of listaAlumnos) {
      const asistencia: IAsistencia = {
        clase_id: clase.clase_id,
        seccion_id: clase.seccion_id,
        alumno_id: alumno.alumno_id,
      };
      await lastValueFrom(this.clasesService.crearAsistencia(asistencia));
    }
  
    
    
  }
  
  
 
  
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Procesando...',
      duration: 2000, 
      translucent: true,
    });
  
    await loading.present();
  
    
    loading.onDidDismiss().then(() => {
      console.log('Carga completa');
    });
  }
  


  async getAlumnosList(): Promise<any[]> {
    const alumnos = await lastValueFrom(this.clasesService.getAlumnosList());
    return alumnos;
  }
  

  
}

  
  

