import { Component } from '@angular/core';
import {
	NavController,
	NavParams,
	MenuController,
	ModalController,
	Events,
	AlertController,
	IonicPage
} from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
// import { FormInvoicePage } from '../form-invoice/form-invoice';
import { TranslateService } from '@ngx-translate/core';
import { OdooProvider } from '../../providers/odoo/odoo';
import { Vente } from '../../models/vente';

@IonicPage()
@Component({
	selector: 'page-details-sale',
	templateUrl: 'details-sale.html'
})
export class DetailsSalePage {
	public vente;
	public roleType;
	public lines = [];
	public current_lang;
	private txtPop;
	private txtLangue;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private lgsServ: LoginProvider,
		private odooServ: OdooProvider,
		public translate: TranslateService,
		public menuCtrl: MenuController,
		public alertCtrl: AlertController,
		public modalCtrl: ModalController,
		public evEVT: Events
	) {
		this.current_lang = this.translate.getDefaultLang();
		this.vente = this.navParams.get('toSend');

		this.translate.get([ 'pop', 'module' ]).subscribe((_res) => {
			this.txtPop = _res.pop;
			this.txtLangue = _res.module.vente;
		});

		this.roleType = 'details';
		this.getListLines();
	}

	ionViewDidLoad() {}

	//Cette fonction permet d'obtenir la liste
	//des invoices lines
	getListLines() {
		this.lgsServ.isTable('_ona_lines').then((res) => {
			if(res){

				let lines = JSON.parse(res);
				for (let i = 0; i < lines.length; i++) {
					const element = lines[i];
					if (this.vente.order_line.indexOf(element.id) > -1) this.lines.push(element);
				}
				console.log('Lines => ', this.lines);
				
			}
		});
	}

	validate() {
		let alert = this.alertCtrl.create({
			title: 'ONA SMART SALES',
			message: this.txtLangue.txt_validate,
			buttons: [
				{
					text: this.txtPop.no,
					role: 'cancel',
					handler: () => {}
				},
				{
					text: this.txtPop.validate,
					handler: () => {
						let params = { id: this.vente.id, state: 'sale' };
						this.odooServ.updateSyncRequest('vente', params);
						this.vente.state = 'sale';
						this.odooServ.updateNoSync('vente', this.vente, this.vente.id, 'standart');
						this.odooServ.showMsgWithButton(this.txtLangue.validate, 'top', 'toast-success');
					}
				}
			]
		});

		alert.present();
	}

	/**
   * Cette fonction permet d'afficher
   * le formulaire et de le modifier
   * @param <Object> objet, l'objet à modifier
   **/

	callForm(objet, type, action) {
		let params;

		if (action != 'copy') params = { objet: objet, action: 'update' };
		else params = { objet: objet, action: 'copy' };

		let addModal = this.modalCtrl.create('FormSalePage', params);
		let message;

		//callback when modal is dismissed (recieve data from View)
		addModal.onDidDismiss((data) => {
			if (data) {
				if (action != 'copy') {
					message = this.txtLangue.maj_invoice;

					if (objet.id == 0) this.odooServ.showMsgWithButton(this.txtLangue.no_sync, 'top');
					else {
						this.odooServ.updateNoSync('vente', data, objet.id, 'standart');
						this.odooServ.updateSyncRequest('vente', data);
					}
				} else {
					message = this.txtLangue.copy_invoice;
					this.odooServ.syncDuplicateObjet('vente', data);
					this.evEVT.publish('add_vente:changed', { item: data, id: this.vente.id });
					this.odooServ.copiedAddSync('vente', data);
				}

				this.odooServ.showMsgWithButton(message, 'top', 'toast-success');
			}
		});

		addModal.present();
	}

	openLeftMenu() {
		this.menuCtrl.open();
	}

	copyVente() {
		let objVente = new Vente(null);

		objVente = Object.assign({}, this.vente);
		objVente.name = objVente.name + ' (copy)';

		if (this.vente.id != 0) this.callForm(objVente, 'vente', 'copy');
		else this.odooServ.showMsgWithButton(this.txtLangue.no_sync_copy, 'top', 'toast-success');
	}

	editVente() {
		this.callForm(this.vente, 'vente', 'update');
	}
}
