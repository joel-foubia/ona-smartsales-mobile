import { Component, Input } from '@angular/core';

/**
 * Generated class for the SaleComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'sale',
  templateUrl: 'sale.html'
})
export class SaleComponent {

  @Input() events: any;

  @Input() sale: any;
  
	@Input() current_lang: any;
  constructor() {
  }

}
