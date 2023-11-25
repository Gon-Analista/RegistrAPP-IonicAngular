import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalPagePage } from './modal-page.page';

describe('ModalPagePage', () => {
  let component: ModalPagePage;
  let fixture: ComponentFixture<ModalPagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
