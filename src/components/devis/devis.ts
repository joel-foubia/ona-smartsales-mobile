import { Component, Input } from '@angular/core';

/**
 * Generated class for the DevisComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'devis',
  templateUrl: 'devis.html'
})
export class DevisComponent { 

  text: string;
  @Input() events: any;

	@Input() fact: any;
  constructor() {
    this.text = 'Hello World';
  }

  onEvent(event: string, devis) {
		if (this.events !== undefined && this.events[event]) {
			this.events[event]({ devis });
		}
	}


}
