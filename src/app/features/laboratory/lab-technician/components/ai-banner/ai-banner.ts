import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faWandMagicSparkles,
  faShieldHalved,
  faSatelliteDish
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ai-banner',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './ai-banner.html',
  styleUrl: './ai-banner.css'
})
export class AiBanner {

  magic = faWandMagicSparkles;
  shield = faShieldHalved;
  satellite = faSatelliteDish;

}