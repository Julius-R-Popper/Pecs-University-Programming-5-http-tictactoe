import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndGame } from './end-game';

describe('EndGame', () => {
  let component: EndGame;
  let fixture: ComponentFixture<EndGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
