import { Lead } from './../../models/lead';
import { Component } from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	Events,
	AlertController,
	MenuController,
	ModalController,
	LoadingController,
	PopoverController,
} from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo/odoo';
import { TranslateService } from '@ngx-translate/core';
import { LoginProvider } from '../../providers/login/login';


@IonicPage()
@Component({
	selector: 'page-detail-lead-opport',
	templateUrl: 'detail-lead-opport.html',
})
export class DetailLeadOpportPage {

	devisEventsBinding: any;
	txtLangue: any;
	callEvents: any;
	phonecalls = [];
	commands = [];
	activities = [];
	ventes = [];
	txtLangueMsg: any;
	txtPop: any;
	current_lang: string = "en";
	public lead: any;
	public opport: any;
	// private user = null;
	public titre = null;
	public the_partner;
	public defaultImage;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public loadCtrl: LoadingController,
		public modalCtrl: ModalController,
		public menuCtrl: MenuController,
		// public alertCtrl: AlertController,
		public evEVT: Events,
		public popCtrl: PopoverController,
		private odooService: OdooProvider,
		private lgServ: LoginProvider,
		private translate: TranslateService
	) {
		// console.log('From Pipe', this.navParams.get('toSend'));
		// this.defaultImage = "assets/images/person.jpg";
		this.lead = this.navParams.get('toSend').objet;
		// this.roleType = 'general';
		this.the_partner = this.navParams.get('toSend').type;
	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad DetailLeadOpportPage');
		this.current_lang = this.translate.getDefaultLang();
		this.translate.get([ 'pop', 'module', 'sales' ]).subscribe((_res) => {
			this.txtPop = _res.pop;
			this.txtLangueMsg = _res.module;
			this.txtLangue = _res.module;
		});

		this.loadActivities();
		this.loadSaleOrders();
	}


	//Cette méthode permet de charger les activitiés
	loadActivities(){

		let actionObj = {
			id: 0, name: '', date: '', type: '', user: '', opport: ''
		};

		actionObj.user = this.lead.user_id.name;
		actionObj.opport = this.lead.name;

		if (this.lead.next_activity_id.id != 0) {
			actionObj.id = this.lead.next_activity_id.id;
			actionObj.name = this.lead.next_activity_id.name;
			actionObj.date = this.lead.date_action;
			actionObj.type = 'next';
			this.activities.push(actionObj);
		}

		if (this.lead.last_activity_id.id != 0) {
			actionObj.id = this.lead.last_activity_id.id;
			actionObj.name = this.lead.last_activity_id.name;
			actionObj.date = this.lead.date_open;
			actionObj.type = 'last';
			this.activities.push(actionObj);
		}

		//Cette méthode permet de récupérer les activités
		this.lgServ.isTable('_ona_call').then(res=>{
			if(res){
				let calls = JSON.parse(res);
				for (let i = 0; i < calls.length; i++) {
					if(calls[i].opportunity_id.id == this.lead.id){

						this.phonecalls.push(calls[i]);
					}
						
				}

			}
		});
	}

	/**
	 * This method is used to bind event
	 * on events item
	 */
	loadBindEvents(){

		this.callEvents = {
			onClick: (event: any) => {}
		};

		this.devisEventsBinding = {
			onClick: (event: any) =>{
				this.navCtrl.push('DetailsSale', {toSend: event});	
			}
		}
	}

	/**
	 * This method is used to load quotation and saleorder
	 * @author daveart
	 */
	loadSaleOrders(){

		this.lgServ.isTable("_ona_vente").then(res=>{
			if(res){
				
				let quotations = JSON.parse(res);
				for (let j = 0; j < quotations.length; j++) {
					if(quotations[j].opportunity_id.id == this.lead.id && quotations[j].state == 'draft')
						this.ventes.push(quotations[j]);
					else if(quotations[j].opportunity_id.id == this.lead.id && quotations[j].state == 'sale')
						this.commands.push(quotations[j]);
					
				}
			}
		});

	}
	
	addActivity(event){
		let popover = this.popCtrl.create('AddActivitypopPage', {}, { cssClass: 'custom-popover'});
		
		popover.present({ev : event});
	}

	//
	openPopOver(event){
		let popover = this.popCtrl.create('LeaddetailoptpopPage', {}, { cssClass: 'custom-popover'});
		
		popover.present({ev : event});
		popover.onDidDismiss(data => {
			if (data) {
				console.log(data);
			}
		});	
	}

	/**
   * Cette fonction permet d'éditer
   * le nom, middle_name, last_name
   *
   **/
	editClient() {
		this.callForm(this.lead, this.the_partner, 'modif');
	}

	/**
   * Cette fonction permet d'afficher
   * le formulaire et de le modifier
   * @param <Object> objet, l'objet à modifier
   **/

	callForm(objet, type, action) {
		let params;

		if (action != 'copy') params = { objet: objet, modif: true };
		else params = { objet: objet, modif: true, copy: true };

		let addModal = this.modalCtrl.create('FormClientPage', params);
		let message;

		//callback when modal is dismissed (recieve data from View)
		addModal.onDidDismiss(data => {
			if (data) {
				if (action != 'copy') {
					message =
						'Les informations sur le ' + this.the_partner + ' ' + this.lead.name + ' ont été modifiées';

					//On met à jour les informations (data) dans la base de données interne
					this.odooService.updateNoSync(this.the_partner, data, objet.id, 'standart');

					if (objet.id == 0) this.odooService.updateNoSyncObjet(this.the_partner, data, objet);
					else this.odooService.updateSyncRequest(this.the_partner, data);

					this.odooService.showMsgWithButton(
						'les informations du ' + this.the_partner + ' ont été mis à jour !',
						'top'
					);
				} else {
					message = 'Le ' + this.the_partner + ' ' + this.lead.name + ' a été dupliqué';
					this.evEVT.publish('add_client:changed', { item: data, id: this.lead.id });
				}
			}
		});

		addModal.present();
	}

	//Cette fonction permet d'appliquer la suppresion de l'objet
	//en cours
	processDelete(type) {
		let params, message, msgLoading;

		//Choisir le type de requête
		switch (type) {
			case 'd': {
				params = { delete: true };
				message = this.the_partner + ' ' + this.lead.name + ' a été supprimé de la liste';
				break;
			}
			case 'a': {
				params = { archive: true };
				message = this.the_partner + ' ' + this.lead.name + ' a été archivé';
				break;
			}
			case 'f': {
				params = { archive: false };
				message = this.the_partner + ' ' + this.lead.name + " n 'est plus dans les archives";
				break;
			}
		}

		params['id'] = this.lead.id;
		//On met à jour la table dans la bd interne
		this.odooService.updateNoSync(this.the_partner, this.lead, this.lead.id, params);

		//On ajoute les requetes qui vont etre synchroniser au server
		if (this.lead.id == 0) this.odooService.updateNoSyncObjet(this.the_partner, this.lead, this.lead);
		else this.odooService.updateSyncRequest(this.the_partner, params);

		this.evEVT.publish('client:changed', this.lead.id);
		this.odooService.showMsgWithButton(message, 'bottom');
		if (type == 'd') this.navCtrl.pop();
	}
	//Cette fonction permet d'archiver
	//un client
	archiveClient(choice) {
		this.processDelete(choice);
	}

	//Dupliquer un client
	copyClient() {
		let objClient = this.lead;
		objClient.name = this.lead.name + ' (copy)';
		//objClient.image = this.client.image;
		objClient.image_url = this.lead.image_url;

		if (this.lead.id != 0) this.odooService.syncDuplicateObjet(this.the_partner, objClient);
		else this.odooService.copiedAddSync(this.the_partner, objClient);
		this.callForm(objClient, this.the_partner, 'copy');
	}
	//Cette fonction permet de passer un appel
	//@param phonenumber int
	appeler(phonenumber) {
		this.odooService.doCall(phonenumber, Lead.error_phone);
	}

	//Cette fonction permet l'envoi d'un Mail
	//@param email string, email du destinataire
	sendEmail(email) {
		this.odooService.doEmail(email, Lead.error_email_from);
	}

	//Cette fonction permet d'ouvrir un site web
	//@param link_website string, url du site web
	openWeb(link_website) {
		this.odooService.doWebsite(link_website, Lead.error_website);
	}

	//Cette fonction permet d'ouvrir la page
	//affichant la liste des affaires d'un client
	showCase() {}

	openLeftMenu() {
		this.menuCtrl.open();
	}

	/**
    * Function qui permert de creer une devis pour le client en question
    */
   addDevis() {

		let addModal = this.modalCtrl.create('FormSalePage', {
			modif: false,
			type: 'vente',
			lead_id: this.lead
		});

		let msgLoading = this.loadCtrl.create({ content: this.txtLangueMsg.statut_add });

		addModal.onDidDismiss((data) => {
			if (data) {
				let message = this.txtLangueMsg.txt_add;
				msgLoading.present();
				data.idx = new Date().valueOf();

				//On insère dans la bd Interne
				// this.sales.push(data);
				this.ventes.unshift(data);

				this.odooService.copiedAddSync('vente', data);
				this.odooService.syncCreateObjet('vente', data);

				msgLoading.dismiss();
				this.odooService.showMsgWithButton(message, 'top', 'toast-success');
			}
		});

		addModal.present();
	}

	/**
	 * This method is used to plan a call
	 * to opportunity
	 */
	addCall(){

		let phoneModal = this.modalCtrl.create('FormCallPage', { modif: false, objet: null, lead: this.lead });
		let msgLoading = this.loadCtrl.create({ content: 'Enregistrement en cours...' });

		phoneModal.onDidDismiss((data) => {
			if (data) {
				console.log('Call programmed : ', data);
				let message = this.txtLangue.calls.to_add;
				msgLoading.present();

				data.idx = new Date().valueOf();

				//On insère dans la bd Interne
				this.phonecalls.push(data);

				//On sauvegarde dans la bd temporaire (pour sync)
				this.odooService.copiedAddSync('call', data);
				this.odooService.syncCreateObjet('call', data);

				msgLoading.dismiss();
				this.odooService.showMsgWithButton(message, 'top', 'toast-success');

			}
		});

		phoneModal.present();
	}

	/**
	 * This method is used to display
	 * rest of view filter by type
	 * @param type string, le modèle
	 */
	showMore(type) {
		if (type == 'call') {
			this.navCtrl.push('CallsPage', { lead: this.lead });
		} else if (type == 'devis') {
			this.navCtrl.push('SalesPage', { lead: this.lead, partner: 'draft' });
		} else if (type == 'commands') {
			this.navCtrl.push('SalesPage', { lead: this.lead, partner: 'sale' });
		} 
	}

}