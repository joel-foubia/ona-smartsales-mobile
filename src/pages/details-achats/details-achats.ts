import { Component } from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	MenuController,
	AlertController,
	ModalController,
	Events,
	LoadingController
} from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { OdooProvider } from '../../providers/odoo/odoo';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the DetailsAchatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-details-achats',
	templateUrl: 'details-achats.html'
})
export class DetailsAchatsPage {
	achat;
	public lines = [];
	public current_lang;
	private txtPop;
	private txtLangue;
	roleType: string;
	txtmodule: any;
	txtAchats: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private lgsServ: LoginProvider,
		private odooServ: OdooProvider,
		public translate: TranslateService,
		public menuCtrl: MenuController,
		public alertCtrl: AlertController,
		public modalCtrl: ModalController,
		public evEVT: Events,
		public loadCtrl: LoadingController
	) {
		this.current_lang = this.translate.getDefaultLang();
		this.achat = navParams.get('toSend');

		this.translate.get([ 'pop', 'module' ]).subscribe((_res) => {
			this.txtPop = _res.pop;
			this.txtLangue = _res.module.vente;
			this.txtmodule = _res.module.facture;
			this.txtAchats = _res.module.achats;
		});

		this.roleType = 'details';
		this.getListLines();
	}

	getListLines() {
		this.lgsServ.isTable('_ona_purchase_line').then((res) => {
			if (res) {
				let lines = JSON.parse(res);
				for (let i = 0; i < lines.length; i++) {
					const element = lines[i];
					if (this.achat.order_line.indexOf(element.id) > -1) this.lines.push(element);
				}
				console.log('Lines => ', this.lines);
			}
		});
	}

	openLeftMenu() {
		this.menuCtrl.open();
	}

	validate() {
		let alert = this.alertCtrl.create({
			title: 'ONA SMART SALES',
			message: this.txtmodule.achats.txt_validate,
			buttons: [
				{
					text: this.txtPop.no,
					role: 'cancel',
					handler: () => {}
				},
				{
					text: this.txtAchats.validate_btn,
					handler: () => {
						let params = { stage: 'open', id: this.achat.id, state: 'purchase' };
						this.odooServ.updateSyncRequest('purchase', params);
						this.achat.state = 'purchase';
						this.odooServ.updateNoSync('purchase', this.achat, this.achat.id, 'standart');
						this.odooServ.showMsgWithButton(this.txtmodule.achats.validate, 'top');
					}
				}
			]
		});
		alert.present();
	}

	ionViewDidLoad() {}

	editAchat() {
		let addModal = this.modalCtrl.create('FormAchatsPage', { objet: this.achat, modif: true, type: null });
		let msgLoading = this.loadCtrl.create({ content: this.txtAchats.pendint_update });

		//callback when modal is dismissed (recieve data from View)
		addModal.onDidDismiss((data) => {
			if (data) {
				console.log(data);
				let message = this.txtAchats.txt_update;
				msgLoading.present();

				//On met à jour les informations (data) dans la base de données interne
				if (this.achat.id == 0) this.odooServ.updateNoSyncObjet('purchase', data, this.achat);
				else {
					this.odooServ.updateNoSync('purchase', data, this.achat.id, 'standart');
					this.odooServ.updateSyncRequest('purchase', data);
				}

				msgLoading.dismiss();
				this.odooServ.showMsgWithButton(message, 'top', 'toast-success');
			}
		});

		addModal.present();
	}
}
