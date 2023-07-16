import { Component, ViewChild } from '@angular/core';
import {
	NavController,
	NavParams,
	MenuController,
	PopoverController,
	ModalController,
	IonicPage,
	Content,
	ActionSheetController,
	AlertController,
	Events,
	FabButton
} from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';
import { ConfigSync, ConfigOnglet } from '../../config';
import { Invoice } from '../../models/invoice';

import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
	selector: 'page-invoices',
	templateUrl: 'invoices.html'
})
export class InvoicesPage {
	
	tab_suppliers = [];
	filter_years = [];
	nbeInvoices = 0;
	roleType = "customer";
	last_date = null;
	owner: any;
	client: any;
	public affaire;
	private offset = 0; //index à partir duquel débuter
	public max = 10; //Nombre d'éléments max a chargé (ioninfinite scroll)
	public objFiltre = false;
	public objSpinner;
	public invoices = [];
	public display = false;
	public txtFiltre: any;
	public current_lang;
	public current_year;

	public stageInvoice;
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
	srcTxt = ''
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
		public evEVT: Events
	) {

		this.objSpinner = true;
		this.current_year = new Date().getFullYear();

		this.current_lang = localStorage.getItem('current_lang');
		this.txtLangue = this.odooServ.traduire().module.facture;
		this.translate.get('pop').subscribe((_res) => {
			this.txtPop = _res;
		});

		this.txtFiltre = { slug: 'all', nom: this.txtLangue.titre };
		this.client = this.navParams.get('client');

		this.lgServ.isTable('me_avocat').then((res) => {
			
			this.owner = JSON.parse(res);
			
			if (this.navParams.get('stage') !== undefined) {
				this.stageInvoice = this.navParams.get('stage');
				this.txtFiltre = { slug: this.stageInvoice.id, nom: this.stageInvoice.text };
				// this.applyFilterOnInvoices(this.stageInvoice.id);
				this.syncOffOnline(this.stageInvoice.id);
			}else{
				this.syncOffOnline('all');
			}

		});

		this.lgServ.formatDate('_ona_invoice').then((_date) => {
			this.last_date = _date;
		});

		this.checkSync = setInterval(() => this.activateSyn(), ConfigSync.timeSync);

		this.filters = ConfigOnglet.invoicesFilter(this.txtPop);

		this.eventsBinding = {
			onClick: (event: any)=> {
				
				let tabs = [];
				if (event.facture.state == 'draft') {

					tabs.push({
						text: ' Valider la facture',
						cssClass: 'icon icon-check',
						handler: () => {

							// this.translate.get([ 'pop', 'module' ]).subscribe((_res) => {
								let alert = this.alertCtrl.create({
									title: 'ONA SMART SALES',
									message: this.txtLangue.module.facture.txt_validate,
									buttons: [
										{
											text: this.txtLangue.pop.no,
											role: 'cancel',
											handler: () => {}
										},
										{
											text: this.txtLangue.pop.validate,
											handler: () => {
												let params = { stage: 'open', id: event.facture.id, state: 'open' };
												this.odooServ.updateSyncRequest('invoice', params);
												event.facture.state = 'open';

												this.odooServ.updateNoSync('invoice', event.facture, event.facture.id, 'standart');
												this.odooServ.showMsgWithButton(this.txtLangue.module.facture.validate, 'top');
											}
										}
									]
								});
								alert.present();

							// });
						}
					});
				}

				if (event.facture.state == 'open') {
					tabs.push({
						text: ' Envoyer la facture',
						cssClass: 'icon icon-share',
						handler: () => {
							let mailModal = this.modalCtrl.create('MailFormPage', {
								'objet': event.facture, type : 'invoice'
							});
			
							mailModal.onDidDismiss((data) => {
								if (data) {
									
									this.odooServ.showMsgWithButton('Mail envoyé avec success', 'top', 'toast-success');
		
								}
							});
			
							mailModal.present();
						}
					});
				}
				tabs.push({
					text: 'Consulter la facture',
					cssClass: 'icon icon-eye',
					handler: () => {
						navCtrl.push('DetailsInvoicePage', { objet: event.facture });
					}
				});
				tabs.push({
					text: 'Modifier La facture',
					cssClass: 'icon icon-pencil',
					handler: () => {
						let params;

						params = { objet: event.facture, action: 'update' };

						let addModal = modalCtrl.create('FormInvoicePage', params);
						let message;

						//callback when modal is dismissed (recieve data from View)
						addModal.onDidDismiss((data) => {
							if (data) {
								message = this.txtLangue.copy_invoice;
								odooServ.syncDuplicateObjet('invoice', data);
								evEVT.publish('add_invoice:changed', {
									item: data,
									id: event.facture.id
								});
								odooServ.copiedAddSync('invoice', data);
							}

							odooServ.showMsgWithButton(message, 'top');
						});

						addModal.present();
					}
				});

				let invoice_action = actionCtrl.create({
					title: event.facture.partner_id.name,
					cssClass: 'product-action-sheets',
					buttons: tabs
				});
				invoice_action.present();
			}
		};
	}

	ionViewDidLoad() {
		this.lgServ.showHideFab(this.content, this.fabButton);
		this.filter_years = ConfigOnglet.filterYears(this.txtPop);
	}

	ionViewDidLeave() {
		clearInterval(this.checkSync);
	}

	/**
	 * Cette fonction permet de classer 
	 * les factures en fonction des fournisseurs et clients
	 * 
	 * @param invoices Array<Invoice> liste des factures 
	 * @param suppliers Array<number> identifiants des fournisseurs
	 * 
	 * @returns Array<any>
	 */
	filterSalesByType(invoices: Array<Invoice>, suppliers: Array<any>, options?: any) {
		// console.log(this.current_year);

		let results: any = [], str_type = '';
		let fournisseurs: Array<Invoice> = [],
			bc: Array<Invoice> = [];

		for (let i = 0; i < invoices.length; i++) {
			
			let is_owner = false;
			let is_year = false;
			let is_expired = false;

			if (options===undefined && invoices[i].user_id.id == this.owner.id)
				is_owner = true;
			
			let invoice_supplier = suppliers.indexOf(invoices[i].partner_id.id)>-1;
			let invoice_customer = suppliers.indexOf(invoices[i].partner_id.id)<=-1;
			
			// console.log("object", new Date(invoices[i].write_date).getFullYear());
			is_year = this.current_year=='all' || (new Date(invoices[i].write_date).getFullYear() == this.current_year);
			
			//This method is used to select invoices overdue date
			if(this.navParams.get('state')!==undefined && this.navParams.get('state')=='expired')
				is_expired = new Date(invoices[i].date_due) < new Date();
			
			if(options===undefined){

				if (this.client === undefined && invoice_supplier && is_owner && is_year) 
					fournisseurs.push(invoices[i]);
				else if (this.client === undefined && invoice_customer && is_owner && is_year) 
					bc.push(invoices[i]);
				else if (this.client !== undefined && is_owner && invoice_supplier && this.client.id == invoices[i].partner_id.id && is_year)
					fournisseurs.push(invoices[i]);
				else if (this.client !== undefined && is_owner && invoice_customer && this.client.id == invoices[i].partner_id.id && is_year)
					bc.push(invoices[i]);
				else if (this.client !== undefined && is_owner && invoice_customer && this.client.id == invoices[i].partner_id.id && is_year && is_expired)
					bc.push(invoices[i]);

			}else{

				if (this.client === undefined && invoice_supplier && is_year) 
					fournisseurs.push(invoices[i]);
				else if (this.client === undefined && invoice_customer && is_year) 
					bc.push(invoices[i]);
				else if (this.client !== undefined && invoice_supplier && this.client.id == invoices[i].partner_id.id && is_year)
					fournisseurs.push(invoices[i]);
				else if (this.client !== undefined && invoice_customer && this.client.id == invoices[i].partner_id.id && is_year)
					bc.push(invoices[i]);
				else if (this.client !== undefined && invoice_customer && this.client.id == invoices[i].partner_id.id && is_year && is_expired)
					bc.push(invoices[i]);

			}
		}

		results.push({ couleur: 'customer', nom: this.txtLangue.client, tabs: bc });
		results.push({ couleur: 'supplier', nom: this.txtLangue.supplier, tabs: fournisseurs });

		return results;
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
			this.filter_lists;
			this.showQuickFilter = false;
			this.resetObjets(0, "year", true);
			this.content.resize();
			this.colorFilterBtn = 'gris';

		} else {

			if (!item.selected) {
				item['selected'] = true;
				this.filter_lists = item;
			} else {
				item['selected'] = false;
				this.filter_lists = {slug: 'all'};
			}

			for (let j = 0; j < this.filters.length; j++) {
				if (this.filters[j].slug != item.slug) {
					this.filters[j].selected = false;
				}
			}

			this.applyFilterOnInvoices(this.filter_lists.slug);
		}

		this.objFiltre = true;
		this.txtFiltre = this.filter_lists;
		this.max = 10;
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

		this.invoices = this.filterSalesByType(this.dumpData, this.tab_suppliers);
		this.nbeInvoices = this.getTotalNotes();
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
		this.lgServ.connChange('_ona_invoice').then((res) => {
			if (res) {
				this.listStageObjet();
			} else {
				clearInterval(this.checkSync);
			}
		});
	}

	//Cette fonction permet de charger les données
	//lorsque l'utilisateur est en mode offline ou via online (server)
	syncOffOnline(filter, currentYear?:number) {
		this.lgServ.checkStatus('_ona_invoice').then((res) => {
			if (res == 'i') {
				//Première utilisation sans connexion
				this.objSpinner = false;
			} else if (res == 's' || res == 'w' || res == 'rw') {
				//From Storage
				let factures = [], tab_suppliers = [];
				this.objSpinner = true;
				this.lgServ.isTable('_ona_invoice').then((result) => {
					this.lgServ.isTable('_ona_supplier_tab').then(_suppliers=>{

						if(_suppliers) this.tab_suppliers = JSON.parse(_suppliers);

						if (result) {
							if (filter == 'all') {

								this.objFiltre = false;
								console.log(JSON.parse(result));
								factures = this.getListInvoicesByFilter(JSON.parse(result));
								this.invoices = this.filterSalesByType(factures, this.tab_suppliers);
								// this.dumpData = this.setInvoicesByOwner(factures);
								this.dumpData = factures;
								this.objSpinner = false;

							} else {
								let list_invoices = JSON.parse(result),
									results = [];
	
								for (let i = 0; i < list_invoices.length; i++) {
									if (list_invoices[i].state == filter) results.push(list_invoices[i]);
								}
	
								this.invoices = this.filterSalesByType(results, tab_suppliers);
								this.objSpinner = false;
							}

							this.nbeInvoices = this.getTotalNotes();
						}

					});
					
				});

				//SYnc de la liste depuis le serveur
				if (res == 'w' || res == 'rw') {
					this.listStageObjet();
				}
			}
		});
	}

	/**
   	 * Cette fonction permet de retourner le nombre
   	 * total de notes
     * @returns {number}
     */
  	private getTotalNotes(): number {
		let total = 0;
		for (let j = 0; j < this.invoices.length; j++) total += this.invoices[j].tabs.length;

		return total;
	}

	/**
   * Cette fonction permet de filtrer les provisions
   * en fonction de l'avocat qui a enregistré une provision
   * @param invoices Array<Invoice>, tableau des provisions
   */
	setInvoicesByOwner(invoices) {
		let results = [];
		for (let i = 0; i < invoices.length; i++) {
			const element = invoices[i];
			if (element.user_id.id == this.owner.id) results.push(element);
		}

		return results;
	}

	//Cette fonction permet de récupérer la liste des tâches
	//liées à l'affaire (affaire)
	//@param filtre string, permet de filtrer les taches
	// getOffAffaires(filtre) {
	// 	this.lgServ.isTable('_ona_invoice').then((result) => {
	// 		if (result) {
	// 			let list_invoices = this.setInvoicesByOwner(JSON.parse(result)),
	// 				results = [];
	// 			//console.log(list_invoices);

	// 			for (let i = 0; i < list_invoices.length; i++) {
	// 				if (filtre == 'all' && list_invoices[i].file_id.id == this.affaire.id)
	// 					results.push(list_invoices[i]);
	// 				else if (filtre == list_invoices[i].state && list_invoices[i].file_id.id == this.affaire.id)
	// 					results.push(list_invoices[i]);
	// 			}

	// 			this.invoices = results;
	// 			this.objSpinner = false;
	// 		}
	// 	});
	// }

	//Cette fonction permet d'afficher la liste des
	//factures liées à un client
	getInvoicesOfClient(filtre) {

		this.lgServ.isTable('_ona_invoice').then((result) => {
			if (result) {
				let list_invoices = this.setInvoicesByOwner(JSON.parse(result)),
					results = [];
				//console.log(list_invoices);

				for (let i = 0; i < list_invoices.length; i++) {
					if (filtre == 'all' && list_invoices[i].partner_id.id == this.client.id)
						results.push(list_invoices[i]);
					else if (filtre == list_invoices[i].state && list_invoices[i].partner_id.id == this.client.id)
						results.push(list_invoices[i]);
				}

				this.invoices = results;
				this.objSpinner = false;
				this.nbeInvoices = this.getTotalNotes();
			}
		});
	}

	//On récupère la liste des factures depuis le serveur
	listStageObjet(isManual?: any) {

		this.odooServ.requestObjectToOdoo('invoice', null, this.last_date, null, (res) => {
			this.objSpinner = false;
			if (res.length != 0) {
				let results = [];
				//On synchronise avec la table
				for (let i = 0; i < res.length; i++) results.push(new Invoice('n', res[i]));

				if (this.display || isManual !== undefined) {
					//Synchronisation activé
					let list_factures = [];
					list_factures = results;
					
					this.odooServ.refreshViewList('_ona_invoice', list_factures).then((rep:any) => {
						this.lgServ.isTable("_ona_supplier_tab").then(_res=>{
							let tabs = [];
							if(_res) tabs = JSON.parse(_res);

							this.invoices = this.filterSalesByType(rep, tabs);
							this.nbeInvoices = this.getTotalNotes();
						});

						// this.invoices = this.setInvoicesByOwner(rep);
						// console.log(this.invoices);
						this.display = false;
						if (isManual !== undefined) isManual.complete();
					});
				}

				this.lgServ.setObjectToTable('_ona_invoice', results);
				this.lgServ.setSync('_ona_invoice_date');
			}

			//console.log(res);
		});
	}

	//On laisse l'utilisateur synchroniser manuellement
	synchronizing() {
		this.display = true;
		this.listStageObjet();
	}

	/**
	 * Cette fonction permet de filtrer les factures
	 * du user connecté à partir du tableau d'ids des factures
	 * @param facts Array<Invoice>, liste des factures de l'utilisateur connecté
	 */
	getListInvoicesByFilter(facts: Array<Invoice>) {
		let results = [];

		if (this.navParams.get('tab_ids') === undefined) {
			results = facts;
		} else { 

			let tabs = this.navParams.get('tab_ids');
			for (let i = 0; i < facts.length; i++) {
				if (tabs.indexOf(facts[i].id) > -1) results.push(facts[i]);
			}
		}

		return results;
	}

	//Ouvre la vue détails d'une facture
	showInvoice(fact, theEvent) {
		this.navCtrl.push('DetailsInvoicePage', { objet: fact });
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

	//Cette fonction permet d'afficher
	//la liste des filtres à appliquer
	onFilter(theEvent) {
		let popover = this.popCtrl.create('PopFilterPage', { invoices: true, lang: this.txtPop });
		popover.present({ ev: theEvent });
		popover.onDidDismiss((result) => {
			if (result) {
				// console.log('On filter filters ', result);
				this.objFiltre = true;
				this.txtFiltre = result;
				this.applyFilterOnInvoices(result.slug);
			}
		});
	}

	//On filtre la liste des factures
	applyFilterOnInvoices(filtre) {
		if (this.affaire) {
			// console.log('Affaire')
			// this.getOffAffaires(filtre);
		} else {
			// console.log('sync')
			this.syncOffOnline(filtre);
		}
	}

	//Cette fonction permet d'ajouter une nouvelle facture
	onAdd(ev) {
		let addModal = this.modalCtrl.create('FormInvoicePage', { objet: null, affaire: this.affaire });

		this.odooServ.createObjetResult('invoice', null, null, addModal, (res) => {
			this.invoices.push(res);
			this.odooServ.copiedAddSync('invoice', res);
			this.odooServ.showMsgWithButton(this.txtLangue.add_invoice, 'top');
			this.nbeInvoices = this.getTotalNotes();
		});
	}

	//Cette fonction permet d'appliquer les actions
	//lister dans le menu contextuel
	applyActionOnItem(item, result, event) {
		if (result.slug == 'update') {
			let addModal = this.modalCtrl.create('FormInvoicePage', { objet: item, action: 'update' });
			addModal.onDidDismiss((data) => {
				if (data) {
					//Mise à jour du formulaire
					this.odooServ.updateSyncRequest('invoice', data);
					this.odooServ.updateNoSync('invoice', data, item.id, 'standart');
					this.odooServ.showMsgWithButton(this.txtLangue.maj_invoice, 'top');
				}
			});
			addModal.present();
		} else if (result.slug == 'archive') {
			/*my_data = { archive: !item.active };
      this.odooServ.updateObjectByAction(result.slug, 'invoice', item.id, my_data, null, false, false, (res)=>{
          if(result.slug=="archive"){
           this.odooServ.removeObjetFromList(this.affaires, item.id, item.bitcs_stage_id.id);
          }
      });*/
		}

		//Fin de la requete
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
	/**
   * Cette fonction permet de
   * recherche un élément dans la liste des partners
   *
   **/
	setFilteredItems(ev) {

		if (ev.target.value === undefined) {
			// this.syncOffOnline("all");
			
			this.lgServ.isTable('_ona_supplier_tab').then(_suppliers=>{

				let tab_suppliers = [];
				
				if(_suppliers) tab_suppliers = JSON.parse(_suppliers);
				this.invoices = this.filterSalesByType(this.dumpData, tab_suppliers);
				this.max = 10;
				return;
			});

		}

		var val = ev.target.value;

		if (val != '' && val.length > 2) {

			let list_invoices = this.dumpData.filter((item) => {
				let txtNom = item.partner_id.name;
				return txtNom.toLowerCase().indexOf(val.toLowerCase()) > -1;
			});

			this.lgServ.isTable('_ona_supplier_tab').then(_suppliers=>{
				let tab_suppliers = [];
				if(_suppliers) tab_suppliers = JSON.parse(_suppliers);
						
				this.invoices = this.filterSalesByType(list_invoices, tab_suppliers);
			});

		} else if (val == '' || val == undefined) {

			this.lgServ.isTable('_ona_supplier_tab').then(_suppliers=>{

				let tab_suppliers = [];
				
				if(_suppliers) tab_suppliers = JSON.parse(_suppliers);
				this.invoices = this.filterSalesByType(this.dumpData, tab_suppliers);
				this.max = 10;
				return;
			});

		}

		this.nbeInvoices = this.getTotalNotes();
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
}
