import { Component } from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	ViewController,
	ToastController,
	PopoverController,
	ModalController
} from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { AffaireProvider } from '../../providers/affaire/affaire';
import { OdooProvider } from '../../providers/odoo/odoo';
import { TranslateService } from '@ngx-translate/core';
import { OrderLine } from '../../models/order-line';

/**
 * Generated class for the FormPurchaseLinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-form-purchase-line',
	templateUrl: 'form-purchase-line.html'
})
export class FormPurchaseLinePage {
	listAccounts: any;
	is_modif: boolean;
	line: any;
	current_lang: string;
	action: any;
	private txtPop;
	private txtLangue;
	listProducts = [];
	listUnits = [];
	constructor(
		public vc: ViewController,
		public navParams: NavParams,
		private lgServ: LoginProvider,
		private formAff: AffaireProvider,
		public toastCtrl: ToastController,
		private odooServ: OdooProvider,
		public popCtrl: PopoverController,
		public translate: TranslateService,
		public modalCtrl: ModalController
	) {
		this.translate.get([ 'module', 'pop' ]).subscribe((_res) => {
			this.txtPop = _res.pop;
			this.txtLangue = _res.module.facture;
		});

		this.current_lang = this.translate.getDefaultLang();
		this.line = this.navParams.get('objet');
		this.action = this.navParams.get('action');

		if (this.line == null || this.line == '') this.line = new OrderLine(null);
		else this.is_modif = true;

		this.onSelectObjet('produit');
		this.onSelectObjet('unity');
	}

	//On affiche la liste des comptes
	onSelectObjet(type) {
		this.lgServ.isTable('_ona_' + type).then((data) => {
			if (data) {
				let res = JSON.parse(data);
				if (type == 'produit') this.listProducts = res;
				if (type == 'unity') this.listUnits = res;
			} else {
				this.formAff.setListObjetsByCase(type, false, (res) => {
					if (type == 'produit') this.listProducts = res;
					if (type == 'unity') this.listUnits = res;

					this.lgServ.setTable('_ona_' + type, res);
				});
			}
			console.log('Produits ', this.listProducts, 'Units ', this.listUnits);
		});
	}

	ionViewDidLoad() {}
}
