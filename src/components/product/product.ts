import { Component, Input } from '@angular/core';

/**
 * Generated class for the ProductComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'product',
  templateUrl: 'product.html'
})
export class ProductComponent {

  text: string;
  @Input() events: any;

	@Input() product: any;
  defaultImg: string;

  constructor() {
    this.text = 'Hello World';
    this.defaultImg = 'assets/images/sb.svg';
  }

  onEvent(event: string, product) {
		if (this.events !== undefined && this.events[event]) {
			this.events[event]({ product });
		}
	}
}
