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
	IonicPage,
	Content,
	FabButton
} from 'ionic-angular';

import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';
import { Partner } from '../../models/partner';
import { ConfigSync, ConfigOnglet } from '../../config';
import { TranslateService } from '@ngx-translate/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Calls } from '../../models/call';
// import * as moment from 'moment';
// import { CallNumber } from '@ionic-native/call-number';

@IonicPage()
@Component({
	selector: 'page-client',
	templateUrl: 'client.html'
})
export class ClientPage {
	txtLangueCall: any;
	last_date = null;
	@ViewChild(Content) content: Content;
	@ViewChild(FabButton) fabButton: FabButton;

	txtError: any;
	objParams: { partner: any; titre: any };
	txtPop: any;
	txtLangue: any;
	current_lang: string;
	public clients = [];
	public searchTerm: string = '';
	public animateClass: any;
	private dumpData: any;
	public objLoader;
	public display = false;
	public btn_display = false;
	public the_partner;
	public titre;
	public txtFiltre = [];
	filtres = [];
	second_filtres = [];
	public max = 10; //Nombre d'éléments max a chargé (ioninfinite scroll)
	private offset = 0; //index à partir duquel débuter
	public isArchived = false;

	private loading;
	// private objLogin: any;
	private user: any;
	private checkSync;
	public defaultImg;
	display_search = false;
	searchBtnColor: string = 'light';
	colorFilterBtn: string = 'gris';
	showQuickFilter: boolean = false;
	objFiltre = [];
	objCalls;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public odooService: OdooProvider,
		public loadCtrl: LoadingController,
		public alertCtrl: AlertController,
		public actionCtrl: ActionSheetController,
		public modalCtrl: ModalController,
		public lgService: LoginProvider,
		public menuCtrl: MenuController,
		public popCtrl: PopoverController,
		public events: Events,
		private translate: TranslateService,
		public launchNavigator: LaunchNavigator,
		// public callNumber: CallNumber
	) {
		//On configure la vue en fonction du partner
		this.current_lang = this.translate.getDefaultLang();
		this.the_partner = this.navParams.get('partner');
		this.titre = this.navParams.get('titre');
		this.defaultImg = 'assets/images/person.jpg';

		//Défintion du fichier de traduction
		this.txtLangue = this.odooService.traduire().module.partner;
		this.txtLangueCall =  this.odooService.traduire().module.calls;
		this.translate.get([ 'pop', 'menu', 'native' ]).subscribe((_res) => {
			this.txtPop = _res.pop;
			this.txtError = _res.native;
			if (this.the_partner == 'client') {
				this.objParams = {
					partner: this.txtLangue.client,
					titre: _res.menu.client
				};
			} else if (this.the_partner == 'contact') {
				this.objParams = {
					partner: this.txtLangue.contact,
					titre: _res.menu.contact
				};
			}
		});

		this.objLoader = true;
		this.lgService.formatDate('_ona_' + this.the_partner).then((_date) => {
			this.last_date = _date;
		});

		this.syncOffOnline();

	}

	ionViewDidLeave() {
		clearInterval(this.checkSync);
		this.events.unsubscribe('client:changed');
		this.events.unsubscribe('add_client:changed');
	}

	ionViewDidLoad() {
		this.events.subscribe('client:changed', (id_partner) => {
			for (let i = 0; i < this.clients.length; i++) {
				if (this.clients[i].id == id_partner) {
					this.clients.splice(i, 1);
					break;
				}
			}
		});

		//Evénement lors de la copie d'un objet
		this.events.subscribe('add_client:changed', (partner) => {
			for (let i = 0; i < this.clients.length; i++) {
				if (this.clients[i].id == partner.id) {
					this.clients.splice(i, 0, partner.item);
					this.odooService.copiedAddSync(this.the_partner, partner.item);
					break;
				}
			}
		});

		//Show/Hide fab
		this.lgService.showHideFab(this.content, this.fabButton);
		if(this.the_partner=="client"){
			
			this.filtres = ConfigOnglet.filtreClients(this.txtPop);
			this.second_filtres = ConfigOnglet.filtreClientsSecond(this.txtPop);

		}else{
			this.filtres = ConfigOnglet.filtreContacts(this.txtPop);
		}

		this.lgService.isTable('me_avocat').then(res=>{
			this.user = JSON.parse(res);
		});

	}

	//Cette fonction permet de synchroniser les données
	synchronizing() {
		this.display = true;
		this.setListPartners();
	}

	//Cette fonction permet de charger les données
	//lorsque l'utilisateur est en mode offline ou via online (server)
	syncOffOnline() {
		this.lgService.checkStatus('_ona_' + this.the_partner).then((res) => {
			if (res == 'i') {
				//Première utilisation sans connexion
				this.objLoader = false;
			} else if (res == 's' || res == 'w' || res == 'rw') {
				//From Storage

				this.lgService.isTable('_ona_' + this.the_partner).then((result) => {
					if (result) {
						var clientList = [];
						clientList = JSON.parse(result);
						if (this.navParams.get('client') != undefined) {
							for (let i = 0; i < clientList.length; i++) {
								if (clientList[i].parent_id.id == this.navParams.get('client').id) {
									this.clients.push(clientList[i]);
								}
							}
						} else {
							this.clients = clientList;
						}

						this.dumpData = this.clients;
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
		this.lgService.connChange('_ona_' + this.the_partner).then((res) => {
			if (res) {
				this.setListPartners();
			} else {
				clearInterval(this.checkSync);
			}
		});
	}

	/**
   * Cette fonction permet de charger la liste
   * des partenaires (clients, tribunaux, contacts)
   * @param isManual any, il s'agit de l'objet Refresh (ion-refresh)
   *
   **/
	setListPartners(isManual?: any) {
		let params = { options: { offset: 0, max: this.max } };
		this.odooService.requestObjectToOdoo(
			this.the_partner,
			null,
			this.last_date,
			false,
			(res) => {
				// console.log(res);
				let fromServ = this.loadPartnerFromServer(res);

				this.odooService.refreshViewList('_ona_' + this.the_partner, fromServ).then((rep: any) => {
					this.dumpData = rep;
					if (this.display || isManual !== undefined) {
						this.clients = rep;
						console.log(this.clients);
						this.display = false;
						if (isManual !== undefined) isManual.complete();
					}
				});

				//Store data in sqlLite and save date of last sync
				this.lgService.setObjectToTable('_ona_' + this.the_partner, fromServ);
				this.lgService.setSync('_ona_' + this.the_partner + '_date');
				fromServ = null;
			},
			isManual
		);
	}

	/** 
   * Cette fonction permet de charger la liste des partners
   * dans un array
   * @param tab Array<JSONObject>, la liste json des partners
   * 
   * @return Array<Partner>
   *
   **/
	loadPartnerFromServer(tab) {
		let result = [];

		for (let i = 0; i < tab.length; i++) {
			let objPartner = new Partner(tab[i], this.the_partner);
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

	//Cette fonction permet d'executer les actions
	//relatives à un client
	onTapItem(item) {
		
		// let display_name = item.name + ' ' + item.middle_name + ' ' + item.last_name + ' (' + item.company_type + ')';
		// display_name = display_name.toUpperCase();

		// let actionSheet = this.actionCtrl.create({
		// 	title: display_name,
		// 	cssClass: 'custom-action-sheet',
		// 	buttons: this.getListButtons(item)
		// });

		// actionSheet.present();

		let objToSend = {
			objet: item,
			type: this.the_partner
		};

		this.navCtrl.push('DetailClientPage', { toSend: objToSend });

	}

	//Cette fonction permet de définir les actions
	//à appliquer sur un item
	// private getListButtons(item) {
	// 	let tab = [];

	// 	tab.push({
	// 		text: this.txtLangue.details,
	// 		cssClass: 'btn-sheet-view',
	// 		// icon: 'ios-eye-outline',
	// 		handler: () => {
	// 			//console.log('Voir clicked');
	// 			let objToSend = {
	// 				objet: item,
	// 				type: this.the_partner
	// 			};
	// 			this.navCtrl.push('DetailClientPage', { toSend: objToSend });
	// 		}
	// 	});
	// 	if (this.the_partner == 'client')
	// 		tab.push({
	// 			text: this.txtPop.opportunity,
	// 			cssClass: 'btn-sheet-lead',
	// 			// icon: 'ios-briefcase-outline',
	// 			handler: () => {
	// 				this.navCtrl.push('PipelinePage', { client: item });
	// 			}
	// 		});
	// 	tab.push({
	// 		text: this.txtPop.update,
	// 		cssClass: 'btn-sheet-maj',
	// 		// icon: 'ios-create-outline',
	// 		handler: () => {
	// 			this.callForm(item, this.the_partner);
	// 		}
	// 	});

	// 	if (this.the_partner == 'client') {
	// 		tab.push({
	// 			text: this.txtPop.meeting,
	// 			cssClass: 'btn-sheet-meeting',
	// 			// icon: 'ios-cash-outline',
	// 			handler: () => {
	// 				this.navCtrl.push('AgendaPage', { customer: item, view: 'list' });
	// 			}
	// 		});

	// 		tab.push({
	// 			text: this.txtPop.ventes,
	// 			cssClass: 'btn-sheet-sales',
	// 			// icon: 'ios-cash-outline',
	// 			handler: () => {
	// 				this.navCtrl.push('SalesPage', { client: item, partner: 'draft' });
	// 			}
	// 		});

	// 		tab.push({
	// 			text: this.txtPop.sub,
	// 			cssClass: 'btn-sheet-sub',
	// 			// icon: 'ios-cash-outline',
	// 			handler: () => {
	// 				this.navCtrl.push('AbonnementsPage', { client: item });
	// 			}
	// 		});

	// 		tab.push({
	// 			text: this.txtPop.map,
	// 			cssClass: 'btn-sheet-map',
	// 			// icon: 'ios-call-outline',
	// 			handler: () => {
	// 				// this.odooService.doCall(item.phone, Partner.error_phone);
	// 				this.lgService.navigateTo('Toronto, ON');
	// 			}
	// 		});
	// 	}

	// 	tab.push({
	// 		text: this.txtPop.call,
	// 		cssClass: 'btn-sheet-call',
	// 		// icon: 'ios-call-outline',
	// 		handler: () => {
				
	// 			this.odooService.doCallToSave(item.phone, this.txtLangueCall.calls, item);
	// 		}
	// 	});
	// 	/* tab.push({
	// 		text: this.txtPop.sms,
	// 		cssClass: 'btn-sheet-sms',
	// 		// icon: 'ios-chatbubbles-outline',
	// 		handler: () => {
	// 			this.odooService.doSMS(item.phone);
	// 		}
	// 	}); */
	// 	tab.push({
	// 		text: this.txtPop.email,
	// 		cssClass: 'btn-sheet-mail',
	// 		// icon: 'ios-mail-outline',
	// 		handler: () => {
	// 			let mailModal = this.modalCtrl.create('MailFormPage', {
	// 				'objet': item, type : 'client'
	// 			});

	// 			mailModal.onDidDismiss((data) => {
	// 				if (data) {
						
	// 					this.odooService.showMsgWithButton('Mail envoyé avec success', 'top', 'toast-success');

	// 					// this.odooService
	// 					// 	.doEmail(data.email, this.txtError.error_mail, data.object, data.description)
	// 					// 	.then(() => {
	// 					// 	})
	// 					// 	.catch(err=>{
	// 					// 		this.odooService.showMsgWithButton(err, 'top', 'toast-success');
	// 					// 	});
	// 				}

	// 			});

	// 			mailModal.present();
	// 		}
	// 	});

	// 	return tab;
	// }

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


	/**
	 * This method is used to filter customers
	 * list 
	 * @param objet any
	 */
	filterbyObjets(objet){

		// objet.selected = !objet.selected;
		objet["selected"] = !objet.selected;
		console.log(objet);
		this.resetObjets(objet);

		// let results = [];

		if(objet.selected){
			this.objFiltre.push(objet); 
		}else{
			// console.log(i);
			// objet["selected"] = false;
			for (let j = 0; j < this.objFiltre.length; j++) {
				if(this.objFiltre[j].slug==objet.slug){
					this.objFiltre.splice(j, 1);
					break;
				}
			}
			// this.objFiltre.splice(i, 1);
		}

		this.filterListPartners(this.objFiltre);
		this.max = 10;
		// this.clients = results;
	}

	/**
	 * Cette méthode permet de filtrer 
	 * la lsite des prospects en fonction des filtres
	 * 
	 * @param item JSON object, un filtre
	 */
	onQuickFilter(item, i){

		if(item.slug=="all"){
			this.objFiltre = [];
			this.showQuickFilter = false;
			// this.resetObjets(0, "team", true);
			// this.resetObjets(0, "stage", true);

			this.content.resize();
			this.colorFilterBtn = 'gris';
			
		}else{

			if(!item.selected){
				item["selected"] = true;
				this.objFiltre.push(item);
			}else{
				// console.log(i);
				item["selected"] = false;
				for (let j = 0; j < this.objFiltre.length; j++) {
					if(this.objFiltre[j].slug==item.slug){
						this.objFiltre.splice(j, 1);
						break;
					}
				}
				// this.objFiltre.splice(i, 1);
			}
		}	

		// console.log(this.objFiltre);
		this.filterListPartners(this.objFiltre);
		this.max = 10;
	}

	/**
	 * Permet à l'utilisateur de 
	 * @param objet JSONObject
	 * @param type string, le type de groupe
	 */
	private resetObjets(objet, options?: any){
		
		for (let i = 0; i < this.second_filtres.length; i++) {
			if(this.second_filtres[i].slug != objet.slug)
				this.second_filtres[i].selected = false;
			
			if(options) this.second_filtres[i].selected = false;
		}
	
	}

  /**
   * Cette fonction permet de
   * recherche un élément dans la liste des partners
   *
   **/
	setFilteredItems(ev) {
		if (ev.target.value === undefined) {
			this.clients = this.dumpData;
			this.searchTerm = '';
			this.max = 10;
			return;
		}

		var val = ev.target.value;

		if (val != '' && val.length > 2) {
			this.searchTerm = val;
			this.clients = this.dumpData.filter((item) => {
				let txtNom = item.name + ' ' + item.middle_name + ' ' + item.last_name;
				return txtNom.toLowerCase().indexOf(val.toLowerCase()) > -1;
			});
		} else if (val == '' || val == undefined) {
			this.clients = this.dumpData;
			this.searchTerm = val;
			this.max = 10;
		}
	}

	/**
   * Cette fonction permet d'afficher
   * le formulaire et de le modifier
   * @param <Object> objet, l'objet à modifier
   **/
	callForm(objet, type) {
		let addModal = this.modalCtrl.create('FormClientPage', { objet: objet, modif: true, type: this.the_partner });
		let msgLoading = this.loadCtrl.create({ content: this.txtLangue.pending });

		//callback when modal is dismissed (recieve data from View)
		addModal.onDidDismiss((data) => {
			if (data) {
				// console.log(data);
				let message = this.txtLangue.message;
				msgLoading.present();

				//On met à jour les informations (data) dans la base de données interne

				if (objet.id == 0) this.odooService.updateNoSyncObjet(this.the_partner, data, objet);
				else {
					this.odooService.updateNoSync(this.the_partner, data, objet.id, 'standart');
					this.odooService.updateSyncRequest(this.the_partner, data);
				}

				msgLoading.dismiss();
				this.odooService.showMsgWithButton(message, 'top', 'toast-success');
			}
		});

		addModal.present();
	}

	//Cette fonction d'enregistrer
	//un nouveau partner (client, contact ou tribunal)
	onAdd() {
		let addModal = this.modalCtrl.create('FormClientPage', { modif: false, objet: {}, type: this.the_partner });
		let msgLoading = this.loadCtrl.create({ content: this.txtLangue.add });

		addModal.onDidDismiss((data) => {
			if (data) {
				let message = this.txtLangue.add_msg;
				msgLoading.present();
				data.idx = new Date().valueOf();

				//On insère dans la bd Interne
				this.clients.push(data);

				this.odooService.copiedAddSync(this.the_partner, data);
				this.odooService.syncCreateObjet(this.the_partner, data);

				msgLoading.dismiss();
				this.odooService.showMsgWithButton(message, 'top', 'toast-success');
			}
		});

		addModal.present();
	}

	//Cette fonction ouvre le menu gauche
	openLeftMenu() {
		this.menuCtrl.open();
	}

	//Cette fonction permet de faire la requete
	//pour filtrer la liste des clients
	filterListPartners(result) {
		
		let resultats = [];
		
		if(result.length==0){
			this.clients = this.dumpData;
			return;	
		}
		// console.log(result);

		for (let i = 0; i < this.dumpData.length; i++) {
			
			if (this.applyFilterPartner(result, this.dumpData[i])) resultats.push(this.dumpData[i]);
			
		}

		this.clients = resultats;
	}

	//Cette fonction permet de filtrer la liste
	// onFilter(theEvent) {
	// 	let popover = this.popCtrl.create('PopFilterPage', { 'res.partner': this.the_partner, lang: this.txtPop });
	// 	popover.present({ ev: theEvent });
	// 	popover.onDidDismiss((result) => {
	// 		if (result) {
	// 			this.txtFiltre = result;
	// 			console.log(this.txtFiltre);
	// 			this.filterListPartners(result);
	// 		}
	// 	});
	// 	//fin filtre requete
	// }

	/**
	 * On met à jour la liste des filtres
	 * @param item JSONObject, filtre
	 */
	removeFilter(item) {
		for (let j = 0; j < this.txtFiltre.length; j++) {
			if (this.txtFiltre[j].slug == item.slug) {
				this.txtFiltre.splice(j, 1);
			}
		}

		this.filterListPartners(this.txtFiltre);
		// this.filterListPartners(result);
	}

	//Permet de regrouper la listte en fonction
	//des critères
	// onGroup(event) {
	// 	let popover = this.popCtrl.create('GroupNotePage', { 'res.partner': this.titre });

	// 	popover.present({ ev: event });
	// 	popover.onDidDismiss((result) => {
	// 		let tab = [];

	// 		if (result) {
	// 			console.log(result);
	// 			if (this.the_partner == 'client' || this.the_partner == 'contact') {
	// 				/*this.odooService.groupObjectByField(this.the_partner, result, false, (res)=>{
    //           console.log(res); 
    //         });*/
	// 			}
	// 		}
	// 	});
	// }

	//Permet d'appliquer les filtres sur la liste des clients
	applyFilterPartner(searchs, objet) {
		let cpt = 0;

		for (let j = 0; j < searchs.length; j++) {
			switch (searchs[j].slug) {
				case 'person': {
					//Personne
					if (objet.company_type == 'person') cpt++;
					break;
				}
				case 'nearme': {
					//Proche de nous
					objet['nearme'] = true;
					cpt++;
					break;
				}
				case 'opportunity': {
					//Homme
					if (objet.opportunity_ids.length != 0) cpt++;
					break;
				}
				case 'meeting': {
					//Personne
					if (objet.meeting_ids.length != 0) cpt++;
					break;
				}
				case 'company': {
					//Entreprises
					if (objet.company_type == 'company') cpt++;
					break;
				}
				case 'pending_bill': {
					//En attente de paiement
					
					this.odooService.getDataOfCustomer("invoice", objet, 'pending_bill').then(res=>{
						if(res>0) cpt++;
					});

					break;

				}
				case 'expired_bill': {
					//Retard de paiement
					this.odooService.getDataOfCustomer("invoice", objet, 'expired_bill').then(res=>{
						if(res>0) cpt++;
					});
					
					break;
					
				}
				case 'sub': {
					//Abonnements
					this.odooService.getDataOfCustomer("sub", objet, 'sub').then(res=>{
						if(res>0) cpt++;
					});
					break;
				}
				case 'devis': {
					//Ayant des devis
					this.odooService.getDataOfCustomer("vente", objet, 'devis').then(res=>{
						if(res>0) cpt++;
					});
					// break;
				}
				case 'mail': {
					//mail envoyés
					// if (objet.company_type == 'company') cpt++;
					break;
				}
				case 'owner': {
					//Mes Clients
					if (objet.user_id.id == this.user.id) cpt++;
					break;
				}
				case 'saleorder': {
					//Clients ayant des commandes
					this.odooService.getDataOfCustomer("vente", objet, 'saleorder').then(res=>{
						if(res>0) cpt++;
					});
					break;
				}
				case 'archive': {
					if (!objet.active) {
						cpt++;
						this.isArchived = true;
						// console.log('archivee');
					}
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
