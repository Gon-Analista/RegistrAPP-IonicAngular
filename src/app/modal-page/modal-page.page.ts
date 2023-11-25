import { Component, OnInit,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ModalPagePage implements OnInit {
  @Input() clase: string | undefined;
  @Input() seccion: string| undefined;
  @Input() profesor: string| undefined;
  @Input() alumnos: any[] | undefined;
  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }
  cancel() {
    this.modalController.dismiss();
  }
}
