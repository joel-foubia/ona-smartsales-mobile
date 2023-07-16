import { Component, Input } from '@angular/core';

/**
 * Generated class for the AbbonementComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'abbonement',
  templateUrl: 'abbonement.html'
})
export class AbbonementComponent {

  @Input() events: any;

	@Input() subscription: any;
  constructor() {
   
  }

  onEvent(event: string, subscription) {
		if (this.events !== undefined && this.events[event]) {
			this.events[event]({ subscription });
		}
	}

}
