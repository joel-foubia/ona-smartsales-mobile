import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';

/**
 * Generated class for the DetailAbonnementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-detail-abonnement',
	templateUrl: 'detail-abonnement.html'
})
export class DetailAbonnementPage {
	subscription;
	lines = [];
	lines_list = [];
	section;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public lgService: LoginProvider,
		public menuCtrler: MenuController
	) {
		this.subscription = this.navParams.get('sub');
		console.log('received Subscription => ', this.subscription);
		this.lines = this.subscription.recurring_invoice_line_ids;
		this.section = 'sub_lines';
		this.getSubLines();
	}

	onSegmentChanged(ev) {}

	openLeftMenu() {
		this.menuCtrler.open();
	}

	getSubLines() {
		this.lgService.isTable('_ona_sub_line').then((lines) => {
			if (lines && this.lines.length > 0) {
				for (let i = 0; i < JSON.parse(lines).length; i++) {
					if (this.lines.indexOf(JSON.parse(lines)[i].id) >= 0) {
						console.log('True => ', JSON.parse(lines)[i]);
						this.lines_list.push(JSON.parse(lines)[i]);
					}
				}
			}
		});
	}

	ionViewDidLoad() {}
}
