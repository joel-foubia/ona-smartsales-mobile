import { Component } from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	ViewController,
	PopoverController,
	ToastController,
	ModalController
} from 'ionic-angular';
import { ConfigImg, ConfigOnglet } from '../../config';
import { TranslateService } from '@ngx-translate/core';
import { ImageProvider } from '../../providers/image/image';
import { LoginProvider } from '../../providers/login/login';
import { OdooProvider } from '../../providers/odoo/odoo';
import { Produit } from '../../models/produit';

/**
 * Generated class for the FormProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-form-product',
	templateUrl: 'form-product.html'
})
export class FormProductPage {
	modif: any;
	default: string;
	section: string;
	product: Produit;
	producType = [];
	invoiceType = [];
	purchaseMethod = [];
	unity: any = [];
	public photo;
	objectReceived: any;
	the_partner: any;

	constructor(
		public navCtrl: NavController,
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
		this.section = 'info';
		this.objectReceived = this.navParams.get('toSend');
		console.log('Object received : ', this.objectReceived);

		this.translate.get('pop').subscribe((res) => {
			this.producType = ConfigOnglet.productTypes(res);
			this.invoiceType = ConfigOnglet.invoicePolicy(res);
			this.purchaseMethod = ConfigOnglet.purchaseMethod(res);
		});

		if (this.modif) {
			this.the_partner = this.navParams.get('type');
			this.product = this.objectReceived.objet;
			this.photo = this.objectReceived.objet.image_url;
		} else {
			this.the_partner = this.navParams.get('type');
			this.product = new Produit(null, this.the_partner);
			this.photo = '';
		}

		this.onSelectObjet('unity');
	}

	selectImage(event) {
		let popover = this.popCtrl.create('PopStagePage', { partner: true });

		popover.present({ ev: event });
		popover.onDidDismiss((result) => {
			if (result) {
				//Camera

				if (result.slug == 'camera') {
					this.imgServ.takePicture().then(
						(res) => {
							//   this.client.image = res;
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
							//   this.client.image = res;
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

	//Cette fonction va récupérer la liste
	//des natures d'audiences, les statuts, les tribunaux
	//les employés qui sont enregistrés en bd
	//@param type string, correspond au type d'objet que l'on souhaite récupérer
	onSelectObjet(type) {
		let alias = type;

		this.lgServ.isTable('_ona_' + alias).then((data) => {
			if (data) {
				let res = JSON.parse(data);
				console.log('response : ', res);
				if (type == 'unity') this.unity = res;
			} else {
				this.odooServ.requestObjectToOdoo(alias, null, null, false, (res) => {
					console.log('response : ', res);
					if (type == 'unity') this.unity = res;

					this.lgServ.setTable('_ona_' + alias, res);
				});
			}
		});
	}

	ionViewDidLoad() {}

	ionViewDidEnter() {
		this.translate.get('pop').subscribe((res) => {
			this.purchaseMethod = ConfigOnglet.purchaseMethod(res);
			this.invoiceType = ConfigOnglet.invoicePolicy(res);
			this.producType = ConfigOnglet.productTypes(res);
		});
	}

	saveItem() {
		// this.prody.name = this.leadName;
		if (this.product.name == '')
			this.translate.get('module.prod_form').subscribe((res) => {
				this.odooServ.showMsgWithButton(res.fill_fields, 'bottom');
			});
		else this.vc.dismiss(this.product);
	}

	updateItem() {
		if (this.product.name == '')
			this.translate.get('module.prod_form').subscribe((res) => {
				this.odooServ.showMsgWithButton(res.fill_fields, 'bottom');
			});
		else this.vc.dismiss(this.product);
	}

	close() {
		this.vc.dismiss();
	}
}
