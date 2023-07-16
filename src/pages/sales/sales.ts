import { Component, ViewChild } from '@angular/core';
import {
	NavController,
	NavParams,
	LoadingController,
	AlertController,
	ActionSheetController,
	ModalController,
	MenuController,
	PopoverController,
	Events,
	FabButton,
	IonicPage,
	Content
} from 'ionic-angular';

import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';
// import { Partner } from '../../models/partner';
import { ConfigSync, ConfigOnglet } from '../../config';
// import { PopOverPage } from '../pop-over/pop-over';
import { TranslateService } from '@ngx-translate/core';
import { Vente } from '../../models/vente';

@IonicPage()
@Component({
	selector: 'page-sales',
	templateUrl: 'sales.html'
})
export class SalesPage {

	filter_lists = [];
	filter_years = [];
	eventsBinding: any;
	@ViewChild(Content) content: Content;
	@ViewChild(FabButton) fabButton: FabButton;

	objFiltre: boolean = false;
	allUsers: boolean;
	nbeVentes: Number;
	roleType: string;
	txtLangue: any;
	txtPop: any;
	client: any;
	user: any;
	type: any;
	current_lang: string;
	public sales = [];
	private filtres = [];
	public searchTerm: string = '';
	public animateClass: any;
	private dumpData: any;
	public objLoader;
	public salesState: any = {};
	public display = false;
	public current_year;
	public the_partner;
	public titre;
	public txtFiltre = [];
	public max = 10; //Nombre d'éléments max a chargé (ioninfinite scroll)
	private offset = 0; //index à partir duquel débuter
	public isArchived = false;
	display_search = false;
	searchBtnColor: string = 'light';
	private loading;
	private checkSync;
	product: any;
	productSales = [];

	// display_search: boolean = false;
	showQuickFilter: boolean = false;
	// searchBtnColor: string = 'light';
	colorFilterBtn: string = 'gris';

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public odooServ: OdooProvider,
		public loadCtrl: LoadingController,
		public alertCtrl: AlertController,
		public lgService: LoginProvider,
		public actionCtrl: ActionSheetController,
		public modalCtrl: ModalController,
		public lgServ: LoginProvider,
		public menuCtrl: MenuController,
		public popCtrl: PopoverController,
		public events: Events,
		private translate: TranslateService
	) {
		//On configure la vue en fonction du partner
		this.current_lang = this.translate.getDefaultLang();
		this.current_year = new Date().getFullYear();

		// this.type = this.navParams.get('partner');
		this.the_partner = 'vente';
		this.titre = this.navParams.get('titre');
		this.client = this.navParams.get('client');
		this.product = this.navParams.get('product');
		this.objLoader = true;

		this.translate.get(['pop', 'menu', 'module']).subscribe((res) => {
			this.txtPop = res.pop;
			this.txtLangue = res;
		});

		//On récupère les informations de l'utilisateur et on commence la synchronisation
		this.syncOffOnline();
		this.lgServ.isTable('me_avocat').then((res) => {
			if (res) this.user = JSON.parse(res);

			if (this.client != undefined || this.product != undefined) {
				this.roleType = this.navParams.get('partner');
			} else {
				this.roleType = 'draft';
			}
			//Début de la synchronisation
			this.checkSync = setInterval(() => this.activateSyn(), ConfigSync.timeSync);
		});
	}

	ionViewDidLeave() {
		clearInterval(this.checkSync);
		this.events.unsubscribe('sale:changed');
		this.events.unsubscribe('add_sale:changed');
	}

	ionViewDidLoad() {
		this.events.subscribe('sale:changed', (id_partner) => {
			for (let i = 0; i < this.sales.length; i++) {
				if (this.sales[i].id == id_partner) {
					this.sales.splice(i, 1);
					break;
				}
			}
		});
		// this.onFilter();

		//Evénement lors de la copie d'un objet
		this.events.subscribe('add_sale:changed', (partner) => {
			for (let i = 0; i < this.sales.length; i++) {
				if (this.sales[i].id == partner.id) {
					this.sales.splice(i, 0, partner.item);
					this.odooServ.copiedAddSync(this.the_partner, partner.item);
					break;
				}
			}
		});
		
		// this.onFilter(event)
		this.lgService.showHideFab(this.content, this.fabButton);
		this.bindEvents();

		this.filtres = ConfigOnglet.filtreSales(this.txtPop);
		this.filter_years = ConfigOnglet.filterYears(this.txtPop);
	}

	/**
	 * Cette méthode permet de lier les
	 * évènements tap sur les boutons
	 */
	bindEvents(){

		this.eventsBinding = {
			onClick: (event: any) => {
				// console.log(event);
				this.menu(event.devis);
			}
		};
	}

	menu(item) {
		// console.log('EVENT => ', event);
		console.log('ITEM => ', item);
		let msg_devis;
		if(item.state=="sale")
			msg_devis =  this.txtLangue.module.sales.update_saleorder;
		else	
			msg_devis =  this.txtLangue.module.sales.update_quotation;

		let buttons = [
			{
				text: this.txtPop.details,
				// icon: "document",
				cssClass: 'icon icon-file',
				handler: () => {
					this.navCtrl.push('DetailsSalePage', { toSend: item, type: this.type });
				}
			},
			{
				text: this.txtLangue.module.sales.customer,
				// icon: "document",
				cssClass: 'icon icon-email',
				handler: () => {

					let mailModal = this.modalCtrl.create('MailFormPage', {
						'objet': item, type : 'sale'
					});
	
					mailModal.onDidDismiss((data) => {
						if (data) {
							
							this.odooServ.showMsgWithButton('Mail envoyé avec success', 'top', 'toast-success');
	
							// this.odooService
							// 	.doEmail(data.email, this.txtError.error_mail, data.object, data.description)
							// 	.then(() => {
							// 	})
							// 	.catch(err=>{
							// 		this.odooService.showMsgWithButton(err, 'top', 'toast-success');
							// 	});
						}
					});
	
					mailModal.present();
				}
			},
			{
				text: msg_devis,
				// icon: "document",
				cssClass: 'icon icon-pencil-box',
				handler: () => {
					this.callForm(item, this.type);
				}
			}
		];

		//if it is a sale order display menu
		if(item.state=="sale"){

			buttons.push({
				text: this.txtLangue.module.sales.invoice_order,
				// icon: "document",
				cssClass: 'icon icon-file-document',
				handler: () => {

				}
			});
		}

		let prod_sheet = this.actionCtrl.create({
			title: item.partner_id.name,
			cssClass: 'product-action-sheets',
			buttons: buttons
		});

		prod_sheet.present();
	}

	//Cette fonction permet de synchroniser les données
	synchronizing() {
		this.display = true;
		this.setListPartners();
	}

	showMenu() {
		this.menuCtrl.open();
	}

	getListLines(vente) {
		this.lgServ.isTable('_ona_lines').then((res) => {
			let lines = JSON.parse(res);
			for (let i = 0; i < lines.length; i++) {
				const element = lines[i];
				if (vente.order_line.indexOf(element.id) > -1) {
					if (element.product_id.id == this.product.id) {
						this.productSales.push(element);
					}
				}
			}
		});
	}

	/**
   * Cette méthode permet d'activer la synchronisation
   * avec ou sans Interne 
   * @param filter any, filtre à utiliser
   */
	syncOffOnline(filter?: any) {
		this.lgServ.checkStatus('_ona_' + this.the_partner).then((res) => {
			if (res == 'i') {
				//Première utilisation sans connexion
				this.objLoader = false;
			} else if (res == 's' || res == 'w' || res == 'rw') {
				//From Storage

				this.lgServ.isTable('_ona_' + this.the_partner).then((result) => {
					if (result) {
						var salesList = [];
						var clientSales = [];
						salesList = JSON.parse(result);
						if (this.navParams.get('client') != undefined) {
							for (let k = 0; k < salesList.length; k++) {
								if (salesList[k].partner_id.id == this.navParams.get('client').id) {
									clientSales.push(salesList[k]);
								}
							}
							this.sales = this.filterSalesByType(clientSales);

							console.log('sales => ', this.sales);
							this.dumpData = clientSales;
						} else if (this.product != undefined) {
							for (let k = 0; k < salesList.length; k++) {
								this.getListLines(salesList[k]);
							}
							this.sales = this.filterSalesByType(this.productSales);
							console.log('sales => ', this.sales);
							this.dumpData = this.productSales;
						} else {
							this.sales = this.filterSalesByType(JSON.parse(result));
							console.log('sales => ', this.sales);
							this.dumpData = JSON.parse(result);
						}

						// this.sales = this.filterSalesByType(JSON.parse(result));
						// this.dumpData = JSON.parse(result);
						this.nbeVentes = this.getTotalNotes();
					}

					this.objLoader = false;
				});

				//SYnc de la liste depuis le serveur
				if (res == 'w' || res == 'rw') {
					this.objLoader = false;
					this.setListPartners();
				}
			}
		});
	}


	//Cette fonction permet d'activer la synchronisation
	activateSyn() {
		this.lgServ.connChange('_ona_' + this.the_partner).then((res) => {
			if (res) {
				this.setListPartners();
			} else {
				clearInterval(this.checkSync);
			}
		});
	}

	/**
   * Cette fonction permet de charger la liste
   * des partenaires (quotations ou sales order)
   *
   **/
	setListPartners(isManual?: any) {
		let params = { options: { offset: 0, max: this.max } };
		this.odooServ.requestObjectToOdoo(
			this.the_partner,
			null,
			null,
			false,
			(res) => {
				let fromServ = this.loadPartnerFromServer(res);
				console.log(fromServ);
				this.dumpData = fromServ;

				if (this.display || isManual !== undefined) {
					this.sales = this.filterSalesByType(fromServ);
					this.nbeVentes = this.getTotalNotes();
					this.display = false;
					if (isManual !== undefined) isManual.complete();
				}
				//Store data in sqlLite and save date of last sync
				this.lgServ.setTable('_ona_' + this.the_partner, fromServ);
				this.lgServ.setSync('_ona_' + this.the_partner + '_date');
				fromServ = null;
			},
			isManual
		);
	}

	/**
	 * Cette fonction permet de rafraichir la page
	 * notamment utilisé dans le cas des procédures de synchronisation
	 * @param refresher any
	 */
	doRefresh(refresher) {
		// this.setListPartners(refresher);
		this.syncOffOnline();
		refresher.complete();
	}

	/**
   * Cette fonction va filtrer les ventes en 
   * fonction de son état
   * @param ventes Array<Vente> liste des ventes (sale.order)
   * @returns Array<Vente>
   */
	filterSalesByType(ventes: Array<Vente>) {
		let results: any = [],
			str_type = '',
			is_year = false;
		let quotations: Array<Vente> = [],
			bc: Array<Vente> = [];
		
		
		for (let i = 0; i < ventes.length; i++) {

			is_year = this.current_year=='all' || (new Date(ventes[i].write_date).getFullYear() == this.current_year);

			if (this.client === undefined && ventes[i].state == 'draft' && is_year) quotations.push(ventes[i]);
			else if (this.client === undefined && ventes[i].state == 'sale' && is_year) bc.push(ventes[i]);
			else if (
				this.client !== undefined &&
				ventes[i].state == 'draft' &&
				this.client.id == ventes[i].partner_id.id &&
				is_year
			)
				quotations.push(ventes[i]);
			else if (
				this.client !== undefined &&
				ventes[i].state == 'sale' &&
				this.client.id == ventes[i].partner_id.id &&
				is_year
			)
				bc.push(ventes[i]);
		}

		results.push({ couleur: 'draft', nom: this.txtLangue.menu.devis_only, tabs: quotations });
		results.push({ couleur: 'sale', nom: this.txtLangue.menu.saleorder, tabs: bc });

		// if(this.client && results[0].length!=0 || results[1].length!=0)
		// 	this.odooServ.showMsgWithButton("","top","toast-info");

		return results;
	}

	/**
   * Cette fonction permet de retourner le nombre
   * total de notes
   * @returns {number}
   */
	private getTotalNotes(): number {
		let total = 0;
		for (let j = 0; j < this.sales.length; j++) total += this.sales[j].tabs.length;

		return total;
	}

	/** 
   * Cette fonction permet de charger la liste des ventes
   * dans un array
   * @param tab Array<JSONObject>, la liste json des partners
   * 
   * @return Array<Vente>
   *
   **/
	loadPartnerFromServer(tab) {
		let result = [];

		for (let i = 0; i < tab.length; i++) {
			let objPartner = new Vente(tab[i]);
			result.push(objPartner);
		}

		return result;
	}

	//AJout des éléments lorsque l'on scroll vers le
	//bas
	doInfinite(infiniteScroll) {
		this.offset += this.max;
		// let params = { options: { offset: this.offset, max: this.max } };
		this.max += 10;

		infiniteScroll.complete();
	}

	//Cette fonction permet d'executer les actions
	//relatives à un client
	onTapItem(item) {
		this.navCtrl.push('DetailsSalePage', { toSend: item, type: this.type });
	}

	/**
   * Cette fonction permet de
   * recherche un élément dans la liste des partners
   *
   **/
	setFilteredItems(ev) {
		if (ev.target.value === undefined) {
			this.sales = this.filterSalesByType(this.dumpData);
			this.max = 10;
			return;
		}

		var val = ev.target.value;
		this.searchTerm = val;

		if (val != '' && val.length > 2) {
			let list_sales = this.dumpData.filter((item) => {
				let txtNom = item.name + ' ' + item.partner_id.name + ' ' + item.opportunity_id.name;
				return txtNom.toLowerCase().indexOf(val.toLowerCase()) > -1;
			});
			this.sales = this.filterSalesByType(list_sales);
		} else if (val == '' || val == undefined) {
			this.sales = this.filterSalesByType(this.dumpData);
			this.max = 10;
		}
	}

	onQuickFilter(item, i) {

		if (item.slug == 'all') {
			// this.syncOffOnline('all');
			this.filter_lists.push(item);
			this.showQuickFilter = false;
			this.resetObjets(0, "year", true);
			this.content.resize();
			this.colorFilterBtn = 'gris';

		} else {

			if (!item.selected) {
				item['selected'] = true;
				this.filter_lists.push(item);
			} else {
				item['selected'] = false;
				this.filter_lists = [];
			}

			for (let j = 0; j < this.filtres.length; j++) {
				if (this.filtres[j].slug != item.slug) {
					this.filtres[j].selected = false;
				}
			}

			// this.applyFilterOnInvoices(this.filter_lists.slug);
		}
		
		this.filterListPartners(this.filter_lists);
		this.objFiltre = true;
		// this.txtFiltre = this.filter_lists;
		this.max = 10;
	}

	/**
   * Cette fonction permet d'afficher
   * le formulaire et de le modifier
   * @param <Object> objet, l'objet à modifier
   **/
	callForm(objet, type) {
		let addModal = this.modalCtrl.create('FormSalePage', { objet: objet, modif: true, type: this.the_partner });
		let msgLoading = this.loadCtrl.create({ content: this.txtLangue.module.sales.pendint_update });

		//callback when modal is dismissed (recieve data from View)
		addModal.onDidDismiss((data) => {
			if (data) {
				console.log(data);
				let message = this.txtLangue.sales.txt_update;
				msgLoading.present();

				//On met à jour les informations (data) dans la base de données interne
				if (objet.id == 0) this.odooServ.updateNoSyncObjet(this.the_partner, data, objet);
				else {
					this.odooServ.updateNoSync(this.the_partner, data, objet.id, 'standart');
					this.odooServ.updateSyncRequest(this.the_partner, data);
				}

				msgLoading.dismiss();
				this.odooServ.showMsgWithButton(message, 'top', 'toast-success');
			}
		});

		addModal.present();
	}

	//Cette fonction d'enregistrer
	//un nouveau partner (client, contact ou tribunal)
	onAdd() {
		let addModal = this.modalCtrl.create('FormSalePage', {
			modif: false,
			type: this.the_partner,
			param: this.type
		});
		let msgLoading = this.loadCtrl.create({ content: this.txtLangue.sales.statut_add });

		addModal.onDidDismiss((data) => {
			if (data) {
				let message = this.txtLangue.sales.txt_add;
				msgLoading.present();
				data.idx = new Date().valueOf();

				//On insère dans la bd Interne
				this.sales.push(data);

				this.odooServ.copiedAddSync(this.the_partner, data);
				this.odooServ.syncCreateObjet(this.the_partner, data);

				msgLoading.dismiss();
				this.odooServ.showMsgWithButton(message, 'top', 'toast-success');
			}
		});

		addModal.present();
	}

	//Cette fonction ouvre le menu gauche
	openLeftMenu() {
		this.menuCtrl.open();
	}

	//Cette fonction permet de définir
	//les éléments de la section sélectionnée
	segmentChanged(obj, event) {
		this.roleType = obj.couleur;
		// this.currentStage = obj.nom;

		let segments = event.target.parentNode.children;
		let len = segments.length;

		for (let i = 0; i < len; i++) {
			segments[i].classList.remove('segment-activated');
		}
		event.target.classList.add('segment-activated');
	}

	//Cette fonction permet de faire la requete
	//pour filtrer la liste des sales
	filterListPartners(result) {
		this.max = 10;
		this.allUsers = false;
		let resultats = [];

		for (let i = 0; i < this.dumpData.length; i++) {
			if (this.applyFilterPartner(result, this.dumpData[i])) resultats.push(this.dumpData[i]);
		}

		if (!this.allUsers) this.sales = this.filterSalesByType(resultats);
		else this.sales = this.filterSalesByType(this.dumpData);
	}

	/**
	 * Cette méthode permet de filtrer les Factures
	 * en fonction des groupes team, ou stage
	 * @param stage JSONObject, le stage selectionné
	 */
	filterbyObjets(objet, type){
		
		objet.selected = !objet.selected;
		this.resetObjets(objet, type);

		if(type=='year'){
			this.current_year = objet.id;
		}

		this.sales = this.filterSalesByType(this.dumpData);
		this.nbeVentes = this.getTotalNotes();
	}

	/**
	 * Permet à l'utilisateur de 
	 * @param objet JSONObject
	 * @param type string, le type de groupe
	 */
	private resetObjets(objet, type, options?: any){
		
		if(type=='year'){
			for (let i = 0; i < this.filter_years.length; i++) {
				if(this.filter_years[i].id != objet.id)
					this.filter_years[i].selected = false;

				if(options) this.filter_years[i].selected = false;
			}
		}
	}

	//Cette fonction permet de filtrer la liste
	onFilter(theEvent) {
		let popover = this.popCtrl.create('PopFilterPage', { sale: this.the_partner, lang: this.txtPop });
		popover.present({ ev: theEvent });
		popover.onDidDismiss((result) => {
			if (result) {
				this.txtFiltre = result;
				this.objFiltre = true;
				this.filterListPartners(result);
			}
		});
		//fin filtre requete
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

	//Permet de regrouper la listte en fonction
	//des critères
	// onGroup(event) {
	// 	let popover = this.popCtrl.create('GroupNotePage', { sale: this.titre, lang: this.txtPop });

	// 	popover.present({ ev: event });
	// 	popover.onDidDismiss((result) => {
	// 		// let tab = [];

	// 		if (result) {
	// 			console.log(result);
	// 			if (this.the_partner == 'client' || this.the_partner == 'contact') {
	// 				/*this.odooServ.groupObjectByField(this.the_partner, result, false, (res)=>{
    //           console.log(res); 
    //         });*/
	// 			}
	// 		}
	// 	});
	// }

	//Permet d'appliquer les filtres sur la liste des sales
	applyFilterPartner(searchs, objet) {
		let cpt = 0;

		for (let j = 0; j < searchs.length; j++) {
			switch (searchs[j].slug) {
				case 'sent': {
					//Envoyé
					if (objet.state == 'sent') cpt++;
					break;
				}
				case 'cancel': {
					//Annulé
					if (objet.state == 'cancel') cpt++;
					break;
				}
				case 'invoice': {
					//Facturée
					if (objet.state == 'done') cpt++;
					break;
				}
				case 'expired': {
					//Personne
					if (objet.validity_date != '' && new Date(objet.validity_date) < new Date()) cpt++;
					break;
				}
				case 'all': {
					//Entreprises
					this.allUsers = true;
					cpt++;
					break;
				}
			}
		} //Fin tab searchs

		if (cpt == searchs.length) return true;
		else return false;
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
}
