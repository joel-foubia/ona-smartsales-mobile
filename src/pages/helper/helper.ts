import { Component } from '@angular/core';
import { ViewController, NavParams, IonicPage, ModalController, LoadingController } from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';
// import { FormClientPage } from '../../pages/form-client/form-client';
import { Partner } from '../../models/partner';
import { Lead } from '../../models/lead';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
	selector: 'page-helper',
	templateUrl: 'helper.html'
})
export class HelperPage {
	txtLangue: any;
	public partners = [];
	public type_partner;
	public objLoader;
	public currentName;
	private listPartners = [];
	private alias;
	supplier = false;

	constructor(
		public vc: ViewController,
		public navParams: NavParams,
		private odooServ: OdooProvider,
		private lgServ: LoginProvider,
		public modalCtrl: ModalController,
		public translate: TranslateService,
		public loadCtrl: LoadingController
	) {
		this.type_partner = this.navParams.get('data');
		this.currentName = this.navParams.get('name');
		this.supplier = this.navParams.get('supplier');

		this.translate.get('module').subscribe((_res) => {
			this.txtLangue = _res.partner;
		});

		if (this.type_partner == 'client' || this.type_partner == 'contact' || this.type_partner == 'leads') {
			this.alias = this.type_partner;
		} else this.alias = this.type_partner;

		if (this.type_partner != 'client_contact' && (this.type_partner == 'leads' || this.type_partner == 'produit')) {
			
			this.lgServ.isTable('_ona_' + this.alias).then((_data) => {
				if (_data) {
					//console.log(_data);
					this.listPartners = JSON.parse(_data);
				} else {
					this.odooServ.requestObjectToOdoo(this.alias, null, null, false, (res) => {
						if (
							this.type_partner == 'client' ||
							this.type_partner == 'contact' ||
							this.type_partner == 'leads'
						) {
							this.listPartners = this.loadPartnerFromServer(res);
							this.lgServ.setTable('_ona_' + this.alias, this.listPartners);
						} else {
							this.listPartners = res;
							this.lgServ.setTable('_ona_' + this.alias, res);
						}
					});
				}
			});

		} else if (this.type_partner != 'leads'  && this.type_partner != 'produit' && this.type_partner != 'client_contact') {
			this.listClientContat();
		} else {
		}
	}

	//Cette fonction permet de récupérer la liste
	//des contacts et clients
	listClientContat() {
		this.lgServ.isTable('_ona_client').then((_data) => {
			if (_data) {
				this.listPartners = JSON.parse(_data);
				this.lgServ.isTable('_ona_contact').then((_contacts) => {
					if (_contacts) {
						this.listPartners.push(JSON.parse(_contacts));
						console.log(this.listPartners);
					} else {
						this.odooServ.requestObjectToOdoo('contact', null, null, false, (res) => {
							let fromServ = this.loadPartnerFromServer(res);
							this.listPartners.push(fromServ);
							this.lgServ.setTable('_ona_contact', fromServ);
						});
					}
				});

				//console.log(_data);
			} else {
				this.odooServ.requestObjectToOdoo('client', null, null, false, (res) => {
					this.listPartners = this.loadPartnerFromServer(res);
					this.lgServ.setTable('_ona_client', this.listPartners);
				});
			}
		});
	}

	//Cette fonction permet de formatter les données recues du serveur (client)
	loadPartnerFromServer(tab) {
		let result = [];
		for (let i = 0; i < tab.length; i++) {
			let objPartner: any;
			if (this.type_partner == 'client' || this.type_partner == 'contact')
				objPartner = new Partner(tab[i], this.type_partner);
			else if (this.type_partner == 'leads') objPartner = new Lead('', tab[i]);
			result.push(objPartner);
		}

		return result;
	}

	getItems(ev) {
		let val = ev.target.value;

		if (val == '' || val == undefined) {
			this.partners = [];
			this.objLoader = false;
			return;
		}

		if (val != '' && val.length > 1) {
			this.objLoader = true;
			let params = { search: val };

			if (this.listPartners.length != 0) {
				this.objLoader = false;
				if (this.type_partner != 'leads' && this.type_partner != 'produit') {
					this.partners = this.listPartners.filter((item) => {
						let txtNom = '';

						if (
							this.type_partner == 'client' ||
							this.type_partner == 'contact' ||
							this.type_partner == 'client_contact'
						) {
							if (item.display_name) {
								txtNom = item.display_name;
							} else if(item.name) {
								txtNom = item.name;
							}

						} else if (this.type_partner == 'leads') txtNom = item.name;
						else txtNom = item.me.name.me;

						return txtNom.toLowerCase().indexOf(val.toLowerCase()) > -1;
					});

				}else if (this.navParams.get('supplier') != undefined && this.navParams.get('supplier') != null) {
					this.partners = this.listPartners.filter((item) => {
						return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1 && item.supplier == true;
					});
				}
				else {
					this.partners = this.listPartners.filter((item) => {
						return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
					});
				}
			} else {
				//From Server
				/*this.odooServ.requestObjectToOdoo(this.alias, params, null, false, (res)=>{
          console.log(res);
          this.partners = res;
        });*/
			}
		} else if (val == '' || val == undefined) {
			this.partners = [];
			this.objLoader = false;
		}
	}

	//Effacer la liste
	clearItems(ev) {
		let val = ev.target.value;

		if (val == '' || val == undefined) {
			this.partners = [];
			this.objLoader = false;
			return;
		}
	}

	//On récupère l'élément choisit par l'utilisateur
	selectedItem(item) {
		let txtNom = '';

		if (
			this.type_partner == 'client' ||
			this.type_partner == 'leads' ||
			this.type_partner == 'produit' ||
			this.type_partner == 'contact' ||
			this.type_partner == 'client_contact'
		) {
			txtNom = item.name;
			this.vc.dismiss(item);
		} else {
			txtNom = item.me.name.me;
			let objet = { id: item.me.id.me, name: txtNom };
			this.vc.dismiss(objet);
		}
	}

	close() {
		this.vc.dismiss();
	}

	//Cette fonction permet d'ajouter un client ou contact ou tribunal
	addPartner() {
		let addModal = this.modalCtrl.create('FormClientPage', { modif: false, objet: {}, type: this.type_partner });
		let msgLoading = this.loadCtrl.create({ content: this.txtLangue.add });

		addModal.onDidDismiss((data) => {
			if (data) {
				let message = this.txtLangue.add_msg;

				data.idx = new Date().valueOf();
				msgLoading.present();

				this.odooServ
					.addObjetToServer(this.type_partner, data)
					.then((res) => {
						msgLoading.dismiss();
						this.odooServ.copiedAddSync(this.type_partner, new Partner(res, this.type_partner));
						this.vc.dismiss(new Partner(res, this.type_partner));
					})
					.catch((err) => {
						console.log(err);
						msgLoading.dismiss();
						// this.odooServ.syncCreateObjet(this.type_partner, data);
						//On insère dans la bd Interne
						this.odooServ.showMsgWithButton(this.txtLangue.sync_msg, 'top', 'toast-error');
					});
			}
		});

		addModal.present();
	}
}
