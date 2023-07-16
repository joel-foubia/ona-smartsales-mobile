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
// import { Invoice } from '../../models/invoice';

import { TranslateService } from '@ngx-translate/core';
import { Mail } from '../../models/mail';

@IonicPage()
@Component({
  selector: 'page-mails',
  templateUrl: 'mails.html',
})
export class MailsPage {
  
	filter_years = [];
	last_date = null;
	owner: any;
	client: any;
	
	private offset = 0; //index à partir duquel débuter
	public max = 10; //Nombre d'éléments max a chargé (ioninfinite scroll)
	public objFiltre = false;
	public objSpinner;
	public messages = [];
	public display = false;
	public txtFiltre: any;
	public current_lang;
	public current_year;

	// public stageInvoice;
	private checkSync;
	private txtLangue;
	private txtPop;
	display_search: boolean = false;
	searchBtnColor: string = 'light';
	@ViewChild(Content) content: Content;
	@ViewChild(FabButton) fabButton: FabButton;
	dumpData = [];
	filters = [];
	// eventsBinding;
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
		var mailClient = this.navParams.get('client');
		console.log('Mail Client => ', mailClient);
		this.syncOffOnline();

		this.objSpinner = true;
		this.current_year = new Date().getFullYear();
    this.current_lang = localStorage.getItem('current_lang');
    // this.txtLangue = this.odooServ.traduire().module.facture;
    
		this.translate.get('pop').subscribe((_res) => {
			this.txtPop = _res;
		});

		this.client = this.navParams.get('client');
		this.lgServ.isTable('me_avocat').then((res) => {
			
			this.owner = JSON.parse(res);    
		});

		this.checkSync = setInterval(() => this.activateSyn(), ConfigSync.timeSync);
		// this.filters = ConfigOnglet.invoicesFilter(this.txtPop);
	}

	ionViewDidLoad() {
		this.lgServ.showHideFab(this.content, this.fabButton);
		this.filter_years = ConfigOnglet.filterYears(this.txtPop);
	}

	ionViewDidLeave() {
		clearInterval(this.checkSync);
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
			this.syncOffOnline();
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

			// this.applyFilterOnInvoices(this.filter_lists.slug);
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

		// this.messages = this.filterSalesByType(this.dumpData, this.tab_suppliers);

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
		this.syncOffOnline();
		refresher.complete();
	}

	//Cette fonction permet d'activer la synchronisation
	activateSyn() {
		this.lgServ.connChange('_ona_mail').then((res) => {
			if (res) {
				this.listStageObjet();
			} else {
				clearInterval(this.checkSync);
			}
		});
	}

	//Cette fonction permet de charger les données
	//lorsque l'utilisateur est en mode offline ou via online (server)
	syncOffOnline(currentYear?:number) {
    
    this.lgServ.checkStatus('_ona_mail').then((res) => {
			if (res == 'i') {
				//Première utilisation sans connexion
				this.objSpinner = false;
			} else if (res == 's' || res == 'w' || res == 'rw') {
				//From Storage
				let lesEmails = [];
				this.objSpinner = true;
				this.lgServ.isTable('_ona_mail').then((result) => {
							
						if (result) {
							
								this.objFiltre = false;
								console.log(JSON.parse(result));
								lesEmails = this.getListEmailsByFilter(JSON.parse(result));
								this.messages = lesEmails;
								
								this.dumpData = lesEmails;
								console.log('Emails => ', this.dumpData);
								this.objSpinner = false;
						}

					});
					
				//SYnc de la liste depuis le serveur
				if (res == 'w' || res == 'rw') {
					console.log('before listStageObject() => ')
					this.listStageObjet();
				}
			}
		});
	}


	//On récupère la liste des factures depuis le serveur
	listStageObjet(isManual?: any) {

		this.odooServ.requestObjectToOdoo('mail', null, this.last_date, null, (res) => {
      
      this.objSpinner = false;
			if (res.length != 0) {
				let results = [];
				//On synchronise avec la table
				for (let i = 0; i < res.length; i++) results.push(new Mail(res[i]));

				if (this.display || isManual !== undefined) {
					//Synchronisation activé
					let list_factures = [];
					list_factures = results;
					console.log('In Case Not => ', list_factures);
          this.messages = this.getListEmailsByFilter(list_factures);
					          
          this.display = false;
          if (isManual !== undefined) isManual.complete();
				}

				this.lgServ.setObjectToTable('_ona_mail', results);
				this.lgServ.setSync('_ona_mail_date');
			}

			console.log('res',res);
		});
	}

	//On laisse l'utilisateur synchroniser manuellement
	synchronizing() {
		this.display = true;
		this.listStageObjet();
	}

	/**
	 * Cette fonction permet de filtrer les Emails
	 * du user connecté et/ou du client choisi
	 * @param facts Array<Mail>, liste des factures de l'utilisateur connecté
	 */
	getListEmailsByFilter(facts: Array<Mail>) {
    
    let results = [], obj_client = false;
    
    if (this.client !== undefined) 
      obj_client = true;

    for (let j = 0; j < facts.length; j++) {
      
      const element = facts[j];
      if(element.author_id.id==this.owner.id && obj_client && element.partner_ids.indexOf(this.client.id)>-1){
        results.push(element);
      }else if(element.author_id.id = this.owner.id && !obj_client){
        results.push(element);
      }
    }

		return results;
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
  
	/**
   * Cette fonction permet de
   * recherche un élément dans la liste des partners
   *
   **/
	setFilteredItems(ev) {

		if (ev.target.value === undefined) {
			// this.syncOffOnline("all");
			
      this.messages = this.dumpData;
      this.max = 10;
      return;
		}

		var val = ev.target.value;

		if (val != '' && val.length > 2) {

			this.messages = this.dumpData.filter((item) => {
				let txtNom = item.partner_id.name;
				return txtNom.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
      
      // this.messages = this.filterSalesByType(list_invoices, tab_suppliers);

		} else if (val == '' || val == undefined) {

      this.messages = this.dumpData;
      this.max = 10;
      return;

		}

	}

}
