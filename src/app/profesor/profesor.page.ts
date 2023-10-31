import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, Params} from '@angular/router';
import { ClasesService } from '../services/clases.service';
import { IAsistencia } from 'src/app/models/IAsistencia';
import { lastValueFrom, throwError } from 'rxjs';
import { OverlayEventDetail } from '@ionic/core/components';
import { Animation, AnimationController } from '@ionic/angular';

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
  name!: string;
  @ViewChild('label2', { read: ElementRef }) label2!: ElementRef;
  @ViewChild('QR', { read: ElementRef }) QR!: ElementRef;
  private animation!: Animation;
  clases: any;
  asistencia: IAsistencia = {
    clase_id: 0,
    alumnos_id: 0
  };

  constructor(private clasesService: ClasesService  ,private route: ActivatedRoute, private router: Router, private animationCtrl: AnimationController) {
    this.route.queryParams.subscribe((params: Params) => {
      this.userInfoReceived = {
        name: params['name'],
        username: params['username'],
        role: params['role'],
      };
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
    this.clases = await lastValueFrom(this.clasesService.getClasesList(profesorId));
  }

  async crearAsistencia(clase: any) {
    const asistencia: IAsistencia = {
      clase_id: clase.clase_id ,
      alumnos_id: 4
    };
    console.log("asistencia",asistencia);
    console.log("clase",clase);
    console.log("id",clase.clase_id);
    const response = await lastValueFrom(this.clasesService.crearAsistencia(asistencia));
  }
  


  gotoAsis(){
    this.router.navigate(['/asistencia'])
  }
}




