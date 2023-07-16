import { Component, Input } from '@angular/core';

/**
 * Generated class for the InvoiceComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'invoice',
  templateUrl: 'invoice.html'
})
export class InvoiceComponent {

  text: string;
  @Input() events: any;

	@Input() facture: any;

  constructor() {
    this.text = 'Hello World';
  }

  onEvent(event: string, facture) {
		if (this.events !== undefined && this.events[event]) {
			this.events[event]({ facture });
		}
	}

}
