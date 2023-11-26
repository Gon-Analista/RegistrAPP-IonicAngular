  import { Component, OnInit, ElementRef, ViewChild, Injectable , OnDestroy } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { AlertController, IonicModule } from '@ionic/angular';
  import { ActivatedRoute, Params, Router } from '@angular/router';
  import { AsistenciaService } from '../services/asistencia.service';
  import { Animation, AnimationController } from '@ionic/angular';
  import { lastValueFrom,BehaviorSubject,Subscription   } from 'rxjs';
  import { LoadingController } from '@ionic/angular';
  import { ClasesService } from '../services/clases.service';
  import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

  @Injectable({
    providedIn: 'root'
  })

  @Component({
    selector: 'app-home',
    templateUrl: 'alumno.page.html',
    styleUrls: ['alumno.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule],
  })
  export class PerfilPage implements OnInit,OnDestroy {
    private asistenciasSubject = new BehaviorSubject<any[]>([]);
    private asistenciasSubscription: Subscription | undefined;
    scannedResult: any;  
    showPerfilContent: boolean = true;
    showAsistenciaContent: boolean = false;
    content_visibility = '';
    userInfoReceived: any;
    idUserHtmlRouterLink: any;
    @ViewChild('label2', { read: ElementRef }) label2!: ElementRef;
    @ViewChild('QR', { read: ElementRef }) QR!: ElementRef;
    clases: any;
    nuevoEstado: any;

    getAsistenciasObservable() {
      return this.asistenciasSubject.asObservable();
    }

    async checkPermission(): Promise<boolean> {
      try {
        const status = await BarcodeScanner.checkPermission({ force: true });
        if (status.granted) {
          return true;
        }
        return false;
      } catch (e) {
        console.error(e);
        throw e;
      }
    }

    
    
    async startScan() {
      try {
        const permission = await this.checkPermission();
        if(!permission) {
          return;
        }
        await BarcodeScanner.hideBackground();
        document.querySelector('body')?.classList.add('scanner-active');
        this.content_visibility = 'hidden';
        const result = await BarcodeScanner.startScan();
        console.log(result);
        BarcodeScanner.showBackground();
        document.querySelector('body')?.classList.remove('scanner-active');
        this.content_visibility = '';
        if(result?.hasContent) {
          this.scannedResult = result.content;
          const qrData = JSON.parse(this.scannedResult);
          await this.updateClaseEstado(qrData.clase_id,qrData.seccion_id);
          
        }
      } catch(e) {
        console.log(e);
        this.stopScan();
      }
    }

    stopScan() {
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
      document.querySelector('body')?.classList.remove('scanner-active');
      this.content_visibility = '';
    }


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


    async getAsist(alumnoId: number) {
      const asistencias = await lastValueFrom(this.AsistenciaService.getAsistenciaList(alumnoId));
      this.asistenciasSubject.next(asistencias);
      console.log("asistencia:", asistencias);
    }

    async updateClaseEstado(claseId: number, seccionId: number) {
      const alumno_id = this.userInfoReceived.id;

      const asistencias = await lastValueFrom(
        this.clasesService.getAsistenciasPorClaseYSeccion(claseId, seccionId)
      );
      const alumnoYaPresente = asistencias.find((asistencia: any) => asistencia.clase_id === claseId);

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
      await lastValueFrom(this.AsistenciaService.updateClaseEstado(alumno_id, claseId, nuevoEstadoT));
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

    ngOnDestroy(): void {
      this.stopScan();
  }
                                                                                                                                  
  }