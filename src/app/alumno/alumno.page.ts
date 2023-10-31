import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserModelAlumno } from 'src/app/models/IUserModelAlumno';
import { AsistenciaService } from '../services/asistencia.service';
import { Animation, AnimationController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';

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
  constructor(private AsistenciaService: AsistenciaService  ,private route: ActivatedRoute, private router: Router, private animationCtrl: AnimationController) {
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
  
  async getAsist(alumnoId: number) {
    this.clases = await lastValueFrom(this.AsistenciaService.getAsistenciaList(alumnoId));
    console.log("asistencia:",this.clases);
  }

  async updateClaseEstado(clase_id : number) {
    const alumno_id = this.userInfoReceived.id;
    const nuevoEstadoT = true;
    await lastValueFrom(this.AsistenciaService.updateClaseEstado(alumno_id,clase_id,nuevoEstadoT));
  }
}

