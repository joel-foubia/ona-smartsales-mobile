import { Component } from '@angular/core';
import {
	NavParams,
	ViewController,
	ToastController,
	PopoverController,
	IonicPage,
	ModalController
} from 'ionic-angular';
// import { PopStagePage } from '../pop-stage/pop-stage';
import { ImageProvider } from '../../providers/image/image';
import { TranslateService } from '@ngx-translate/core';
import { Partner } from '../../models/partner';
import { LoginProvider } from '../../providers/login/login';
import { OdooProvider } from '../../providers/odoo/odoo';

@IonicPage()
@Component({
	selector: 'page-form-client',
	templateUrl: 'form-client.html'
})
export class FormClientPage {
	titres: any = [];
	txtPop: any;
	section: string;
	public client: Partner;
	public modif;
	public copy = false;
	public the_partner;
	public default;
	public photo;

	constructor(
		public navParams: NavParams,
		public vc: ViewController,
		public toastCtrl: ToastController,
		public popCtrl: PopoverController,
		private imgServ: ImageProvider,
		public translate: TranslateService,
		private lgServ: LoginProvider,
		private odooServ: OdooProvider,
		public modalCtrl: ModalController
	) {
		this.modif = this.navParams.get('modif');
		this.default = 'assets/images/photo-camera.png';
		this.section = 'post';

		this.translate.get('pop').subscribe((_res) => {
			this.txtPop = _res;
		});

		if (this.navParams.get('copy') !== undefined) {
			this.copy = true;
		}

		if (this.modif) {
			this.the_partner = this.navParams.get('type');
			this.client = this.navParams.get('objet');
			this.photo = this.client.image_url;
		} else {
			this.the_partner = this.navParams.get('type');
			this.client = new Partner(null, this.the_partner);
			if (navParams.get('company') != undefined) {
				this.client.parent_id.id = navParams.get('company').id;
				this.client.parent_id.name = navParams.get('company').name;
			}
			this.photo = this.default;
		}

		// console.log(this.client);
		this.onSelectObjet('title');
	}

	ionViewDidLoad() {}

	onSegmentChanged(event) {}

	saveItem() {
		let newItem: any;

		newItem = this.client;
		if (!this.modif && this.client.name && (this.client.phone != '' || this.client.mobile != '')) {
			this.vc.dismiss(newItem);
		} else if (this.modif) this.vc.dismiss(newItem);
		else this.odooServ.showMsgWithButton(this.txtPop.form, 'top', 'toast-error');
	}

	//Fermer le formulaire
	close() {
		this.vc.dismiss();
	}

	/**
   * Cette fonction permet de modifier la
   * les attributs de l'objet audience
   **/
	changeValue(event, type) {
		switch (type) {
			case 'title': {
				this.client.title.name = this.find(event, this.titres, '');
				break;
			}
		}
	}

	/**
   * Cette fonction permet de rechercher 
   * un objet dans une liste
   * @param id int, identifiant de l'objet à rechercher
   * @param list Array<any>, liste des objets dans laquelle effectuer la rechercher
   * @param type string, le type d'objet
   * 
   * @returns any
   */
	private find(id, list, type) {
		for (let i = 0; i < list.length; i++) {
			if (list[i].me.id.me == parseInt(id)) return list[i].me.name.me;
		}
	}

	//Cette fonction va récupérer la liste
	//des natures d'audiences, les statuts, les tribunaux
	//les employés qui sont enregistrés en bd
	//@param type string, correspond au type d'objet que l'on souhaite récupérer
	onSelectObjet(type) {
		let alias = type;

		this.lgServ.isTable('_ona_' + alias).then((data) => {
			if (data) {
				let res = JSON.parse(data);
				if (type == 'title') this.titres = res;
			} else {
				this.odooServ.requestObjectToOdoo(alias, null, null, false, (res) => {
					if (type == 'title') this.titres = res;

					this.lgServ.setTable('_ona_' + alias, res);
				});
			}
		});
	}

	//Cette fonction ouvre un popup
	//qui demande à l'utilisateur de prendre une photo
	selectImage(event) {
		let popover = this.popCtrl.create('PopStagePage', { partner: true, lang: this.txtPop });

		popover.present({ ev: event });
		popover.onDidDismiss((result) => {
			if (result) {
				//Camera

				if (result.slug == 'camera') {
					this.imgServ.takePicture().then(
						(res) => {
							this.client.image = res;
							this.photo = 'data:image/jpeg;base64,' + res;
						},
						(err) => {
							this.odooServ.showMsgWithButton(err, 'top', 'toast-error');
						}
					);
				} else {
					//Gallery

					this.imgServ.openImagePicker().then(
						(res) => {
							//this.displayMessage(res);
							this.client.image = res;
							this.photo = 'data:image/jpeg;base64,' + res;
						},
						(err) => {
							this.odooServ.showMsgWithButton(err, 'top', 'toast-error');
						}
					);
				}
			}
		});
		//Fin Process camera
	}

	/**
   * Cette fonction permet de sélectionner les élements
   * dans une liste
   * @param partner string, le nom du modèle
   */
	selectPartner(partner, champ) {
		let data = { data: partner };
		let modal = this.modalCtrl.create('HelperPage', data);
		modal.onDidDismiss((_data) => {
			if (_data) {
				// console.log(_data);
				if (partner == 'country') {
					this.client.country_id = _data;
				} else if (partner == 'state') {
					this.client.state_id = _data;
				} else if (partner == 'client') {
					this.client.parent_id.id = _data.id;
					this.client.parent_id.name = _data.name;
				}
			}
		});

		modal.present();
	}
}
