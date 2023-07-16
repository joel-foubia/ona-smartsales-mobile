import { Component, Input } from '@angular/core';

/**
 * Generated class for the EventsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'events',
  templateUrl: 'events.html'
})
export class EventsComponent {

  @Input() meeting: any;
  @Input() eventsBinding: any;
  @Input() current_lang: any;
  constructor() {
  }

  onEvent(event: string, meeting) {
		if (this.eventsBinding !== undefined && this.eventsBinding[event]) {
			this.eventsBinding[event]({meeting});
		}
	}
}
