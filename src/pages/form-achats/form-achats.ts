import { Component, ViewChild } from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	ViewController,
	ModalController,
	ToastController,
	Slides,
	PopoverController
} from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { AffaireProvider } from '../../providers/affaire/affaire';
import { TranslateService } from '@ngx-translate/core';
import { Achats } from '../../models/achats';
import { OrderLine } from '../../models/order-line';
import { OdooProvider } from '../../providers/odoo/odoo';
import * as moment from 'moment';

/**
 * Generated class for the FormAchatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-form-achats',
	templateUrl: 'form-achats.html'
})
export class FormAchatsPage {
	@ViewChild('formSlide') slides: Slides;

	listMonnaies: any = [];
	listJournals: any = [];
	taxes = [];
	listCompanies: any = [];
	// listAffaires: any = [];
	segment;

	public achat: any;
	// public affaire : any;
	public lignes: Array<any> = [];
	public is_modif = false;
	public action;
	public listPeriods = [];
	public listAccounts = [];
	private user;
	public current_lang;
	private txtLangue;
	private txtPop;
	listProducts = [];
	listUnits = [];
	line: OrderLine;
	current_date;
	listPurchaseLines = [];
	constructor(
		public vc: ViewController,
		public navParams: NavParams,
		public lgServ: LoginProvider,
		public modalCtrl: ModalController,
		public toastCtrl: ToastController,
		public formAff: AffaireProvider,
		public translate: TranslateService,
		public popCtrl: PopoverController,
		public odooServ: OdooProvider
	) {
		this.current_date = moment().format('YYYY-MM-DDThh:mm');
		this.achat = this.navParams.get('objet');
		this.action = this.navParams.get('action');
		this.segment = 'info';

		console.log('Achat ', this.achat);
		this.current_lang = this.translate.getDefaultLang();
		this.translate.get([ 'pop', 'module' ]).subscribe((_res) => {
			this.txtPop = _res.pop;
			this.txtLangue = _res.module.facture;
		});

		this.line = new OrderLine(null);

		if (this.achat == null) {
			this.achat = new Achats(null);
		} else this.is_modif = true;

		this.onSelectObjet('account');
		this.onSelectObjet('payment_term');
		this.onSelectObjet('payment_method');
		this.onSelectObjet('currency');
		this.onSelectObjet('purchase_line');
		this.onSelectObjet('company');
		this.initFOrm();
	}

	segmentChanged() {}
	onSelectObjet(type) {
		this.lgServ.isTable('_ona_' + type).then((data) => {
			if (data) {
				let res = JSON.parse(data);
				if (type == 'account') this.listAccounts = res;
				else if (type == 'payment_term') this.listPeriods = res;
				else if (type == 'payment_method') this.listJournals = res;
				else if (type == 'company') this.listCompanies = res;
				else if (type == 'currency') this.listMonnaies = res;
				else if (type == 'purchase_line') {
					this.listPurchaseLines = res;
				}
			} else {
				this.formAff.setListObjetsByCase(type, false, (res) => {
					if (type == 'account') this.listAccounts = res;
					else if (type == 'payment_term') this.listPeriods = res;
					else if (type == 'payment_method') this.listJournals = res;
					else if (type == 'company') this.listCompanies = res;
					else if (type == 'currency') this.listMonnaies = res;
					else if (type == 'purchase_line') this.listPurchaseLines = res;

					this.lgServ.setTable('_ona_' + type, res);
				});
			}
		});
	}

	displayMessage(msg) {
		let toast = this.toastCtrl.create({
			message: msg,
			duration: 5000,
			position: 'top'
		});

		toast.present();
	}

	ionViewDidLoad() {}

	close() {
		this.vc.dismiss();
	}

	selectPartner(partner) {
		let name;
		if (partner == 'produit') {
			name = this.achat.product_id.name;
		} else {
			name = this.achat.partner_id.name;
		}
		let data = { data: partner, name: name, lang: this.txtPop, supplier: true };
		let modal = this.modalCtrl.create('HelperPage', data);
		modal.onDidDismiss((_data) => {
			if (_data) {
				if (partner == 'client') this.achat.partner_id = _data;
				if (partner == 'produit') {
					// console.log('Prod ', _data);
					this.achat.product_id = _data;
					this.line.product_uom = _data.uom_po_id;
					this.line.price_unit = _data.list_price;
					this.line.name = _data.name;
				}
			}
		});
		modal.present();
	}

	//Cette fonction permet d'initialiser le
	//formulaire
	initFOrm() {
		this.lgServ.isTable('me_avocat').then((res) => {
			if (res) {
				this.line.date_planned = moment().format('YYYY-MM-DDThh:mm');
				if (this.is_modif) {
					this.achat.date_planned = moment(this.achat.date_planned).format('YYYY-MM-DDThh:mm');
					for (let k = 0; k < this.listPurchaseLines.length; k++) {
						if (this.achat.order_line[this.achat.order_line.length - 1] == this.listPurchaseLines[k].id) {
							this.line = this.listPurchaseLines[k];
							this.line.date_planned = moment(this.line.date_planned).format('YYYY-MM-DDThh:mm');
						}
					}
				}
				this.user = JSON.parse(res);
				this.achat.currency_id = this.user.currency_id;
				this.achat.date_order = new Date();

				this.onLoadObject('produit');
				this.onLoadObject('unity');
				this.getListLines();
			}
		});
	}

	//On affiche la liste des comptes
	onLoadObject(type) {
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

	/**
   * Cette fonction permet de modifier la
   * les attributs de l'objet affaire
   **/
	changeValue(event, type) {
		//console.log(event);

		switch (type) {
			case 'payment': {
				this.achat.payment_term_id.name = this.find(event, this.listPeriods, '');
				break;
			}
			case 'company': {
				this.achat.company_id.name = this.find(event, this.listCompanies, '');
				break;
			}
			case 'journal': {
				this.achat.journal_id.name = this.find(event, this.listJournals, '');
				break;
			}
			case 'currency': {
				this.achat.currency_id.name = this.find(event, this.listMonnaies, '');
				break;
			}
			case 'produit': {
				this.line.product_id = this.findObj(event, this.listProducts, '');
				break;
			}
		}
	}

	//Cette fonction permet de
	//retrouver un objet à partir de l'id
	//@param id int, identifiant de l'objet recherché
	//@return string
	private find(id, list, type) {
		for (let i = 0; i < list.length; i++) {
			if (list[i].me.id.me == parseInt(id)) {
				return list[i].me.name.me;
			}
		}
	}
	private findObj(id, list, type) {
		for (let i = 0; i < list.length; i++) {
			if (list[i].id == parseInt(id)) {
				// console.log('prod ', list[i])
				return list[i];
			}
		}
	}

	//Cette fonction est appelé lorsque l'on clique
	//sur le bouton <Modifier> du formulaire
	saveItem() {
		let newItem = this.achat;

		this.achat.product_qty = this.line.product_qty;

		if (parseInt(this.achat.partner_id.id) == 0) {
			this.displayMessage(this.txtLangue.fail_customer);
			return;
		} else if (!this.is_modif && parseInt(this.achat.partner_id.id) != 0) {
			this.line.product_id = this.achat.product_id;
			this.achat.order_line.push(this.line.id);
			this.lignes.push(this.line);

			this.achat.purchase_line = [ this.line ];
			this.achat.date_order = new Date();
			this.achat.amount_total = this.achat.product_id.list_price * this.achat.product_qty;
			this.vc.dismiss(this.achat);
		} else if (this.is_modif) {
			this.achat.purchase_line = [ this.line ];
			this.vc.dismiss(this.achat);
		} else this.displayMessage(this.txtLangue.fail_form);
		console.log('achat ', this.achat);
	}

	//Cette fonction permet d'obtenir la liste
	//des invoices lines
	getListLines() {
		this.lgServ.isTable('_ona_purchase_line').then((res) => {
			let lines = JSON.parse(res);

			console.log('Purchase lines ', lines);

			for (let i = 0; i < lines.length; i++) {
				const element = lines[i];
				if (this.achat.order_line.indexOf(element.id) > -1) this.lignes.push(element);
			}
		});
	}

	addALine() {
		if (this.achat.partner_id.id == 0) {
			this.displayMessage(this.txtLangue.fail_line);
			this.segment = 'info';
			return;
		}
		if (this.achat.order_line.length > 0) {
			this.displayMessage('Alreaddy added a line');
			return;
		}

		this.line = new OrderLine(null);

		this.taxes = [];
	}

	//Cette méthode permet d'ajouter une ligne de facture
	addLine(item) {
		if (this.achat.partner_id.id == 0) {
			this.displayMessage(this.txtLangue.fail_line);
			return;
		}

		let data = { objet: item };
		let modal = this.modalCtrl.create('FormPurchaseLinePage', data);
		modal.onDidDismiss((data) => {
			if (data) {
				console.log(data);
				let element = data;
				element.currency_id = this.achat.currency_id;
				element.partner_id = this.achat.partner_id;

				this.achat.lines.push(element);
				this.lignes.push(element);
				console.log(this.achat);
			}
		});
		modal.present();
	}

	//Retirer un tag de l'affaire
	removeTag(tag, index, type) {
		let elements;
		this.taxes.splice(index, 1);
		elements = this.line.taxes_id;

		//On met à jour les attributs de l'objet
		for (let i = 0; i < elements.length; i++) {
			if (tag.me.id.me == elements[i]) {
				this.line.taxes_id.splice(i, 1);
				break;
			}
		}
	}

	//Ajouter un tag ou un reminder à partir d'une
	//fenêtre Pop up
	addObjetFromPop(event, type) {
		let elements = [];
		elements = this.taxes;

		let popover = this.popCtrl.create(
			'PopTagPage',
			{ tax: type, lang: this.txtPop },
			{ cssClass: 'custom-popaudio' }
		);
		popover.present({ ev: event });
		popover.onDidDismiss((result) => {
			if (result) {
				console.log(result);
				let find = false;

				for (let i = 0; i < result.tags.length; i++) {
					//On vérifie si le tableau n'est pas vide
					if (elements !== undefined) {
						for (let j = 0; j < elements.length; j++)
							if (elements[j].me.id.me == result.tags[i].me.id.me) {
								find = true;
								break;
							}
					}

					//On insère les éléments dans le tableau vide
					if (!find || elements.length == 0) elements.push(result.tags[i]);
				}

				//Ici on met à jour les attributs de l'objet Agenda
				for (let i = 0; i < result.tab.length; i++) {
					if (this.line.taxes_id.indexOf(result.tab[i]) == -1 || this.line.taxes_id.length == 0)
						this.line.taxes_id.push(result.tab[i]);
				}

				if (result.add != '') {
					this.odooServ.editTag(type, result, (res) => {
						console.log(res);
						this.taxes.push(res);
						this.line.taxes_id.push(res.me.id.me);
						this.odooServ.showMsgWithButton('La Taxe ajoutée', 'top');
					});
				}

				//On met à jour les attributs tags et reminders du Controller
				this.taxes = elements;
			}
		}); //Fin du Pop Tag
	}
}
