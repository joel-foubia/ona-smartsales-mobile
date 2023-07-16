import { Component, Input } from '@angular/core';

/**
 * Generated class for the AchatsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
	selector: 'achats',
	templateUrl: 'achats.html'
})
export class AchatsComponent {
	@Input() events: any;

	@Input() achat: any;
	
	@Input() current_lang: any;
	constructor() {}

	onEvent(event: string, achat) {
		if (this.events !== undefined && this.events[event]) {
			this.events[event]({ achat });
		}
	}
}
