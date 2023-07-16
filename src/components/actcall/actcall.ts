import { Component } from '@angular/core';

/**
 * Generated class for the ActcallComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'actcall',
  templateUrl: 'actcall.html'
})
export class ActcallComponent {

  text: string;

  constructor() {
    console.log('Hello ActcallComponent Component');
    this.text = 'Hello World';
  }

}
