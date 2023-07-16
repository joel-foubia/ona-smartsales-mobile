import { Component, Input } from '@angular/core';

/**
 * Generated class for the DashproductComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'dashproduct',
  templateUrl: 'dashproduct.html'
})
export class DashproductComponent {

  @Input() events: any;

	@Input() produit: any;
  defaultImg: string = '';

  constructor() {
    this.defaultImg = 'assets/images/sb.svg';
  }

  onEvent(event: string, produit) {
		if (this.events !== undefined && this.events[event]) {
			this.events[event]({ produit });
		}
	}

}
