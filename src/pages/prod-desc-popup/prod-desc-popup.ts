import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ProdDescPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-prod-desc-popup',
	templateUrl: 'prod-desc-popup.html'
})
export class ProdDescPopupPage {
	product: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public vc: ViewController) {
		this.product = this.navParams.get('model');
	}

	ionViewDidLoad() {}

	close() {
		this.vc.dismiss();
	}
}
