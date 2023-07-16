import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { OdooProvider } from '../../providers/odoo/odoo';

/**
 * Generated class for the FormMailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-form-mail',
	templateUrl: 'form-mail.html'
})
export class FormMailPage {
	client: any;
	mailObj = { object: '', email: '', description: '' };

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public vc: ViewController,
		public lgServ: LoginProvider,
		public odooServ: OdooProvider
	) {
		this.client = navParams.get('client');
		this.mailObj.email = this.client.email;
	}

	ionViewDidLoad() {}

	close() {
		this.vc.dismiss();
	}

	send() {
		if (this.mailObj.email == '' || this.mailObj.description == '' || this.mailObj.email == '') {
			this.odooServ.showMsgWithButton(
				'Veuillez remplir tout les champs pour envoyer votre mail',
				'top',
				'toast-error'
			);
		} else {
			this.vc.dismiss(this.mailObj);
		}
	}
}
