import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the LeaddetailoptpopPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-leaddetailoptpop',
	templateUrl: 'leaddetailoptpop.html',
})
export class LeaddetailoptpopPage {
	constructor(public navCtrl: NavController, public navParams: NavParams, public view: ViewController) {}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad LeaddetailoptpopPage');
	}

	closePop(strAction: string) {
    	// console.log('Dismisiing')
		this.view.dismiss(strAction);
	}
}
