import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/UserModel';
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

  userInfoReceived: UserModel | undefined;
  idUserHtmlRouterLink: any;
  @ViewChild('label2', { read: ElementRef }) label2!: ElementRef;
  @ViewChild('QR', { read: ElementRef }) QR!: ElementRef;
  private animation!: Animation;

  constructor(private router: Router,private animationCtrl: AnimationController) {
    this.userInfoReceived = this.router.getCurrentNavigation()?.extras.state?.['user'];
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
  }
  gotoAsis(){
    this.router.navigate(['/asistencia'])
  }
}


