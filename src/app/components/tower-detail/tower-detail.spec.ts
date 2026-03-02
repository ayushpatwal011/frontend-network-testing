import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowerDetail } from './tower-detail';

describe('TowerDetail', () => {
  let component: TowerDetail;
  let fixture: ComponentFixture<TowerDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TowerDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TowerDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
