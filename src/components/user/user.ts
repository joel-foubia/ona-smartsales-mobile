import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'user',
  templateUrl: 'user.html'
})
export class UserComponent {

  current_lang: string;
  @Input() events: any;
  @Input() objUser: any;
  
  defaultImg: string;

  constructor(private translate: TranslateService) {
    // console.log('Hello UserComponent Component');
    this.defaultImg = 'assets/images/user.svg';
    this.current_lang = this.translate.getDefaultLang();
  }

  onEvent(event: string, objUser) {
		if (this.events !== undefined && this.events[event]) {
			this.events[event]({ objUser });
		}
	}

}
