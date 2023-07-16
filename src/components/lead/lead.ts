import { Component, Input } from '@angular/core';

/**
 * Generated class for the LeadComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'lead',
  templateUrl: 'lead.html'
})
export class LeadComponent {

  @Input() events: any;
	@Input() opport: any;
	@Input() stage: boolean;

  constructor() {
    // console.log('Hello LeadComponent Component');
    // this.text = 'Hello World';
  }

  onEvent(event: string, opport, theEvent) {
		if (this.events !== undefined && this.events[event]) {
			this.events[event]({ 'objet':opport, 'theEvent': theEvent });
		}
	}

}
