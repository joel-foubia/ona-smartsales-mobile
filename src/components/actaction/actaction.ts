import { Component, Input } from '@angular/core';

/**
 * Generated class for the ActactionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'actaction',
  templateUrl: 'actaction.html'
})
export class ActactionComponent {
  @Input() action: any;
  @Input() current_lang: any;


  constructor() {
  }

}
