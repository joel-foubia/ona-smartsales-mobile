import { Component } from '@angular/core';
import { ViewController, NavParams, IonicPage, PopoverController, ActionSheetController } from 'ionic-angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { OdooProvider } from '../../providers/odoo/odoo';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
	selector: 'page-pop-user',
	templateUrl: 'pop-user.html'
})
export class PopUserPage {
	tabs = [];
	type: any;
	public users = [];
	public objSpinner = false;
	public message;
	public defaultImg = 'assets/images/person.jpg';
	txtPop: any;

	constructor(
		public vc: ViewController,
		public navParams: NavParams,
		public fiao: FingerprintAIO,
		public popCtrl: PopoverController,
		public actionCtrl: ActionSheetController,
		public odooServ: OdooProvider,
		private translate: TranslateService
	) {
		this.users = this.navParams.get('data');
		this.type = this.navParams.get('type');

		if (this.navParams.get('msg') !== undefined) this.message = 'Share with  ';
		else this.message = this.navParams.get('txt_user');

		translate.get('pop').subscribe((res) => {
			this.txtPop = res;
		});
	}
	//Cette fonction récupère le login choisit par
	//l'utilisateur
	selectLogin(item) {
		if (this.type == 'followers') {
			this.vc.dismiss(item);
		} else {
			let display_name = item.name;
			display_name = display_name.toUpperCase();

			let actionSheet = this.actionCtrl.create({
				title: display_name,
				cssClass: 'custom-action-sheet-login',
				buttons: this.getListButtons(item)
			});

			actionSheet.present();
		}
	}

	private getListButtons(item) {
		let tab = [];

		tab.push({
			text: this.txtPop.pwd,
			cssClass: 'btn-sheet-lock',
			handler: () => {
				this.vc.dismiss({ mode: 'pwd', data: item });
			}
		});
		tab.push({
			text: this.txtPop.finger,
			cssClass: 'btn-sheet-fingerprint',
			handler: () => {
				this.fiao
					.isAvailable()
					.then((result) => {
						this.fiao
							.show({
								clientId: 'ona.app.smartsales'
							})
							.then((res) => {
								// alert('finger auth OK ' + res);
								this.vc.dismiss({ mode: 'finger', data: item });
							})
							.catch((errfinger) => {
								alert('finger auth Error ' + errfinger);
								this.odooServ.showMsgWithButton(this.txtPop.finger_error, 'top', 'toast-error');
								// this.vc.dismiss();
							});
					})
					.catch((err) => {
						this.odooServ.showMsgWithButton(this.txtPop.finger_not_ava, 'top', 'toast-error');
						// this.vc.dismiss();
					});
			}
		});

		return tab;
	}

	//Cette fonction permet de remplir le
	//tableau des valeurs cochées
	onChange(user, checked) {
		if (checked) {
			this.tabs.push(user.id);
		} else {
			for (var i = 0; i < this.tabs.length; i++) {
				if (this.tabs[i] == user.id) {
					this.tabs.splice(i, 1);
					break;
				}
			}
		}
	}

	//click on finish
	onFinish() {
		this.vc.dismiss(this.tabs);
	}
}
