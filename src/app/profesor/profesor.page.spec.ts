import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfesorPage } from './profesor.page';

describe('ProfesorPage', () => {
  let component: ProfesorPage;
  let fixture: ComponentFixture<ProfesorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
