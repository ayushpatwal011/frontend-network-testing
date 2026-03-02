import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedTester } from './speed-tester';

describe('SpeedTester', () => {
  let component: SpeedTester;
  let fixture: ComponentFixture<SpeedTester>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeedTester]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeedTester);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
