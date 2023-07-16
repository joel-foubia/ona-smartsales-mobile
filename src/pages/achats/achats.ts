import { Component, ViewChild } from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	Content,
	FabButton,
	MenuController,
	PopoverController,
	ModalController,
	ActionSheetController,
	AlertController,
	Events,
	LoadingController
} from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';
import { TranslateService } from '@ngx-translate/core';
import { Achats } from '../../models/achats';
import { ConfigSync, ConfigOnglet } from '../../config';

/**
 * Generated class for the AchatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-achats',
	templateUrl: 'achats.html'
})
export class AchatsPage {
	private checkSync;
	private txtLangue;
	private txtPop;
	display_search: boolean = false;
	searchBtnColor: string = 'light';
	@ViewChild(Content) content: Content;
	@ViewChild(FabButton) fabButton: FabButton;
	dumpData = [];
	filters = [];
	eventsBinding;
	showQuickFilter: boolean = false;
	colorFilterBtn: string = 'light';
	filter_lists;
	srcTxt = '';
	private offset = 0; //index à partir duquel débuter
	public max = 10; //Nombre d'éléments max a chargé (ioninfinite scroll)
	public objFiltre = false;
	public objSpinner;
	public achats = [];
	public txtFiltre = [];
	public display = false;
	public current_lang;
	public current_year;
	last_date;
	owner;
	txtAchats: any;
	txtmodule: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private odooServ: OdooProvider,
		private lgServ: LoginProvider,
		public menuCtrl: MenuController,
		public popCtrl: PopoverController,
		public translate: TranslateService,
		public modalCtrl: ModalController,
		public actionCtrl: ActionSheetController,
		public alertCtrl: AlertController,
		public evEVT: Events,
		public loadCtrl: LoadingController,
		public alertCtrler: AlertController
	) {
		this.objSpinner = true;
		this.current_year = new Date().getFullYear();
		this.current_lang = this.translate.getDefaultLang();

		this.translate.get([ 'pop', 'module' ]).subscribe((_res) => {
			this.txtPop = _res.pop;
			this.txtLangue = _res.module.facture;
			this.txtmodule = _res.module;
		});
		this.translate.get('module').subscribe((_res) => {
			this.txtAchats = _res.achats;
		});

		this.lgServ.isTable('me_avocat').then((res) => {
			this.owner = JSON.parse(res);

			this.syncOffOnline('all');
		});

		this.lgServ.formatDate('_ona_purchase').then((_date) => {
			this.last_date = _date;
		});
		this.checkSync = setInterval(() => this.activateSyn(), ConfigSync.timeSync);

		this.filters = ConfigOnglet.achatsFilter(this.txtAchats.filters);
	}

	ionViewDidLoad() {
		this.lgServ.showHideFab(this.content, this.fabButton);
		this.bindEvents();
	}

	ionViewDidLeave() {
		clearInterval(this.checkSync);
	}

	/**
	 * Cette méthode permet de lier les
	 * évènements tap sur les boutons
	 */
	bindEvents() {
		this.eventsBinding = {
			onClick: (event: any) => {
				console.log('binding');
				this.menu(event.achat);
			}
		};
	}

	menu(achat) {
		let buttons = [
			{
				text: this.txtPop.details,
				// icon: "document",
				cssClass: 'icon icon-file',
				handler: () => {
					this.navCtrl.push('DetailsAchatsPage', { toSend: achat });
				}
			},
			{
				text: this.txtPop.mod_achat,
				// icon: "document",
				cssClass: 'icon icon-pencil-box',
				handler: () => {
					this.callForm(achat);
				}
			}
		];
		if (achat.state == 'draft') {
			buttons.push({
				text: this.txtPop.conf_order,
				// icon: "document",
				cssClass: 'icon icon-check',
				handler: () => {
					// this.callForm(achat);
					this.confirmPurchase(achat);
				}
			});
		}

		let prod_sheet = this.actionCtrl.create({
			title: achat.name + ' - ' + achat.partner_id.name,
			cssClass: 'product-action-sheets',
			buttons: buttons
		});

		prod_sheet.present();
	}

	confirmPurchase(item) {
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
						let params = { stage: 'open', id: item.id, state: 'purchase' };
						this.odooServ.updateSyncRequest('purchase', params);
						item.state = 'purchase';
						this.odooServ.updateNoSync('purchase', item, item.id, 'standart');
						this.odooServ.showMsgWithButton(this.txtmodule.achats.validate, 'top');
					}
				}
			]
		});
		alert.present();
	}

	/* Cette fonction permet d'afficher
   * le formulaire et de le modifier
   * @param <Object> objet, l'objet à modifier
   **/
	callForm(objet) {
		let addModal = this.modalCtrl.create('FormAchatsPage', { objet: objet, modif: true, type: null });
		let msgLoading = this.loadCtrl.create({ content: this.txtAchats.pendint_update });

		//callback when modal is dismissed (recieve data from View)
		addModal.onDidDismiss((data) => {
			if (data) {
				console.log(data);
				let message = this.txtAchats.txt_update;
				msgLoading.present();

				//On met à jour les informations (data) dans la base de données interne
				if (objet.id == 0) this.odooServ.updateNoSyncObjet('purchase', data, objet);
				else {
					this.odooServ.updateNoSync('purchase', data, objet.id, 'standart');
					this.odooServ.updateSyncRequest('purchase', data);
				}

				msgLoading.dismiss();
				this.odooServ.showMsgWithButton(message, 'top', 'toast-success');
			}
		});

		addModal.present();
	}

	//Cette fonction permet de charger les données
	//lorsque l'utilisateur est en mode offline ou via online (server)
	syncOffOnline(filter, currentYear?: number) {
		this.lgServ.checkStatus('_ona_purchase').then((res) => {
			if (res == 'i') {
				//Première utilisation sans connexion
				this.objSpinner = false;
			} else if (res == 's' || res == 'w' || res == 'rw') {
				//From Storage
				this.lgServ.isTable('_ona_purchase').then((data) => {
					if (data) {
						this.objSpinner = false;
						let achats_list = [];
						achats_list = JSON.parse(data);
						console.log('Achats list =>', JSON.parse(data));
						this.achats = achats_list;
						this.dumpData = achats_list;
					}
				});

				//SYnc de la liste depuis le serveur
				if (res == 'w' || res == 'rw') {
					this.objSpinner = false;
					this.display = true;
					this.listAchatsObjet();
				}
			}
		});
	}

	//On récupère la liste des factures depuis le serveur
	listAchatsObjet(isManual?: any) {
		this.odooServ.requestObjectToOdoo('purchase', null, this.last_date, null, (res) => {
			// console.log('My res =>', res);

			this.objSpinner = false;
			if (res.length != 0) {
				let results = [];
				//On synchronise avec la table
				for (let i = 0; i < res.length; i++) results.push(new Achats(res[i]));

				this.odooServ.refreshViewList('_ona_purchase', results).then((rep: any) => {
					this.dumpData = rep;
					if (this.display || isManual !== undefined) {
						this.achats = rep;
						console.log(this.achats);
						this.display = false;
						if (isManual !== undefined) isManual.complete();
					}
				});

				this.lgServ.setObjectToTable('_ona_purchase', results);
				this.lgServ.setSync('_ona_purchase_date');
			}

			//console.log(res);
		});
	}

	/**
	 * Cette fonction permet de rafraichir la page
	 * notamment utilisé dans le cas des procédures de synchronisation
	 * @param refresher any
	 */
	doRefresh(refresher) {
		// this.listStageObjet(refresher);
		this.syncOffOnline('all');
		refresher.complete();
	}

	//Cette fonction permet d'activer la synchronisation
	activateSyn() {
		this.lgServ.connChange('_ona_purchase').then((res) => {
			if (res) {
				this.listAchatsObjet();
			} else {
				clearInterval(this.checkSync);
			}
		});
	}

	doInfinite(infiniteScroll) {
		this.offset += this.max;
		let params = { options: { offset: this.offset, max: this.max } };
		this.max += 10;

		infiniteScroll.complete();
	}

	showMenu() {
		this.menuCtrl.open();
	}

	searchItems() {
		this.display_search = !this.display_search;
		if (this.display_search) {
			this.searchBtnColor = 'primary';
		} else {
			this.searchBtnColor = 'light';
		}
		this.content.resize();
	}
	setFilteredItems(ev) {
		if (ev.target.value === undefined) {
			this.achats = this.dumpData;
			this.max = 10;
			return;
		}

		var val = ev.target.value;

		if (val != '' && val.length > 2) {
			this.achats = this.dumpData.filter((item) => {
				let txtNom = item.name + ' ' + item.partner_id.name;
				return txtNom.toLowerCase().indexOf(val.toLowerCase()) > -1;
			});
		} else if (val == '' || val == undefined) {
			this.achats = this.dumpData;
			this.max = 10;
		}
	}
	onSetClick() {
		this.showQuickFilter = !this.showQuickFilter;
		if (this.showQuickFilter == true) {
			this.colorFilterBtn = 'primary';
		} else {
			this.colorFilterBtn = 'dark';
		}
		if (this.content != null) {
			setTimeout(() => {
				// this.content.scrollToTop(2000);
			}, 1000);
		}
		this.content.resize();
	}
	onQuickFilter(item, i) {
		if (item.slug == 'all') {
			this.syncOffOnline('all');
			// this.filter_lists;
			this.showQuickFilter = false;
			this.content.resize();
			this.colorFilterBtn = 'gris';
			for (let j = 0; j < this.filters.length; j++) {
				this.filters[j].selected = false;
			}
		} else {
			if (!item.selected) {
				item['selected'] = true;
				this.filter_lists = item;
			} else {
				item['selected'] = false;
				this.filter_lists = { slug: 'all' };
			}

			for (let j = 0; j < this.filters.length; j++) {
				if (this.filters[j].slug != item.slug) {
					this.filters[j].selected = false;
				}
			}

			// this.applyFilterOnInvoices(this.filter_lists.slug);
			this.filterListPartners([ this.filter_lists ]);

			console.log('filters ', this.filter_lists);
		}

		this.objFiltre = true;
		this.txtFiltre = this.filter_lists;
		this.max = 10;
	}
	onAdd(ev) {
		let addModal = this.modalCtrl.create('FormAchatsPage');

		this.odooServ.createObjetResult('purchase', null, null, addModal, (res) => {
			this.achats.push(res);
			this.odooServ.copiedAddSync('purchase', res);
			this.odooServ.showMsgWithButton(this.txtLangue.add_invoice, 'top');
			// this.nbeInvoices = this.getTotalNotes();
		});
	}

	//On laisse l'utilisateur synchroniser manuellement
	synchronizing() {
		this.display = true;
		this.listAchatsObjet();
	}

	filterListPartners(result) {
		let resultats = [];

		if (result.length == 0) {
			this.achats = this.dumpData;
			return;
		}
		// console.log(result);

		for (let i = 0; i < this.dumpData.length; i++) {
			if (this.applyFilterPartner(result, this.dumpData[i])) resultats.push(this.dumpData[i]);
		}

		this.achats = resultats;
	}

	applyFilterPartner(searchs, objet) {
		let cpt = 0;

		for (let j = 0; j < searchs.length; j++) {
			switch (searchs[j].slug) {
				case 'quot': {
					//Personne
					if (objet.state == 'draft') cpt++;
					break;
				}
				case 'purchase': {
					//Homme
					if (objet.purchase == 'purchase') cpt++;
					break;
				}
			}
		} //Fin tab searchs

		if (cpt == searchs.length) return true;
		else return false;
	}
}
