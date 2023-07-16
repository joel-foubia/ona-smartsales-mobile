import { Component } from '@angular/core';

/**
 * Generated class for the MapUserComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'map-user',
  templateUrl: 'map-user.html'
})
export class MapUserComponent {

  text: string;

  constructor() {
    console.log('Hello MapUserComponent Component');
    this.text = 'Hello World';
  }

}
