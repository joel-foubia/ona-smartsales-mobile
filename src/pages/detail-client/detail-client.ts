import { Component, ViewChild } from '@angular/core';
import {
	NavController,
	NavParams,
	ModalController,
	LoadingController,
	MenuController,
	AlertController,
	Events,
	IonicPage,
	ActionSheetController
} from 'ionic-angular';
// import { FormClientPage } from '../form-client/form-client';
import { OdooProvider } from '../../providers/odoo/odoo';
import { Partner } from '../../models/partner';
import { ConfigImg } from '../../config';
import { LoginProvider } from '../../providers/login/login';
import { TranslateService } from '@ngx-translate/core';
import { Lead } from '../../models/lead';
// import { Chart } from 'chart.js';
import { Vente } from '../../models/vente';
import { Calls } from '../../models/call';

// import { CallNumber } from '@ionic-native/call-number';

@IonicPage()
@Component({
	selector: 'page-detail-client',
	templateUrl: 'detail-client.html'
})
export class DetailClientPage {
	
	txtLangueCall: any;
	is_manager: boolean;
	eventsBinding: any;
	ventes = [];
	leads = [];
	txtPop: any;
	txtLangue: any;
	lines = [];
	listCategories: any = [];
	devisEventsBinding;
	private listIcons: { iconAlert: string; iconError: string; iconSuccess: string };
	public client: any;
	public titre = null;
	public the_partner;
	public roleType;
	public defaultImg;
	type: any;
	txtLangueMsg: any;
	commands = [];
	txtError: any;
	// objLogin: any;
	private opport_color = "rgba(176, 121, 19, 1)";
	private opport_color_light = "rgba(176, 121, 19, 0.7)";

	user: any;
	@ViewChild('barCanvasLarge') barCanvasLarge;
	barChartLargeDataSet = [];
	barChartLarge;
	monthsLarge = [];
	activities = [];
	current_lang: string;
	

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public odooService: OdooProvider,
		public loadCtrl: LoadingController,
		public modalCtrl: ModalController,
		public menuCtrl: MenuController,
		public alertCtrl: AlertController,
		public evEVT: Events,
		public actionCtrl: ActionSheetController,
		public lgServ: LoginProvider,
		public translate: TranslateService
	) {
		this.defaultImg = ConfigImg.defaultImg;
		this.client = this.navParams.get('toSend').objet;
		this.roleType = 'coordonnees';
		this.current_lang = translate.getDefaultLang();
		this.the_partner = this.navParams.get('toSend').type;
		this.listIcons = ConfigImg.objIcons;
		this.translate.get([ 'pop', 'module', 'native' ]).subscribe((_res) => {
			this.txtPop = _res.pop;
			this.txtLangue = _res.module.partner;
			this.txtLangueMsg = _res.module.sales;
			this.txtLangueCall = _res.module;
			this.txtError = _res.native;
		});

		//On appel les evènements clic
		this.bindEvents();
	}

	ionViewDidLoad() {
		
		this.lgServ.isTable('me_avocat').then(res=>{
			this.user = JSON.parse(res);
		});

		// console.log(this.client);
		this.listChilds('client');
		this.listChilds('etiquette');
		this.listChilds('vente');
		this.listChilds('leads');
		// this.listChilds('activite');

		if(localStorage.getItem("manager")!=null && localStorage.getItem("manager")=="admin")
			this.is_manager = true;

		setTimeout(() => {
			this.getWonOpportData();
		}, 1500);

		setTimeout(() => {
			let monthsLarge = [ this.lgServ.getMonthName(2), this.lgServ.getMonthName(1), this.lgServ.getMonthName(0) ];
			let barChartLarge = this.lgServ.loadLastMonthsBarChart(this.barCanvasLarge, monthsLarge, this.txtPop, this.barChartLargeDataSet, this.opport_color, this.opport_color_light, 'bar');
		}, 3000);
	}
	
	// 
	
	/**
   * Cette fonction permet d'éditer
   * le nom, middle_name, last_name
   *
   **/
	editClient() {
		this.callForm(this.client, this.the_partner, 'modif');
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
		addModal.onDidDismiss((data) => {
			if (data) {
				if (action != 'copy') {
					message = this.txtLangue.message;

					//On met à jour les informations (data) dans la base de données interne

					if (objet.id == 0) this.odooService.updateNoSyncObjet(this.the_partner, data, objet);
					else {
						this.odooService.updateSyncRequest(this.the_partner, data);
						this.odooService.updateNoSync(this.the_partner, data, objet.id, 'standart');
					}
				} else {
					message = this.txtLangue.copy;
					data.display_name = data.name;
					this.odooService.syncDuplicateObjet(this.the_partner, data);
					this.evEVT.publish('add_client:changed', { item: data, id: this.client.id });
					this.odooService.copiedAddSync(this.the_partner, data);
				}

				this.odooService.showMsgWithButton(message, 'top', 'toast-success');
			}
		});

		addModal.present();
	}

	makeCall(item){

		let numero = '';

		if (item.phone!='') {
			numero = item.phone;
		}else if(item.mobile!=''){
			numero = item.phone;
		}

		this.odooService.doCallToSave(numero, this.txtLangueCall.calls, item);
		
	}

	//Cette fonction permet d'appliquer la suppresion de l'objet
	//en cours
	processDelete(type) {
		let params, message;

		//Choisir le type de requête
		switch (type) {
			case 'a': {
				params = { active: false };
				this.client.active = false;
				message = this.txtLangue.archive;
				break;
			}
			case 'f': {
				params = { active: true };
				this.client.active = true;
				message = this.txtLangue.reset;
				break;
			}
		}

		params['id'] = this.client.id;
		//On met à jour la table dans la bd interne
		this.odooService.updateNoSync(this.the_partner, this.client, this.client.id, 'standart');

		//On ajoute les requetes qui vont etre synchroniser au server
		if (this.client.id != 0) this.odooService.updateSyncRequest(this.the_partner, params);

		this.evEVT.publish('client:changed', this.client.id);
		this.odooService.showMsgWithButton(message, 'bottom', 'toast-success');
		if (type == 'd') this.navCtrl.pop();
	}

	//Cette fonction permet d'archiver
	//un client
	archiveClient(choice) {
		this.processDelete(choice);
	}

	//Dupliquer un client
	copyClient() {
		let objClient = new Partner(null, this.the_partner);

		objClient = Object.assign({}, this.client);
		objClient.name = objClient.name + ' (copy)';
		//objClient.image = this.client.image;

		if (this.client.id != 0) this.callForm(objClient, this.the_partner, 'copy');
		else this.odooService.showMsgWithButton(this.txtPop.fail_copy_task, 'top', 'toast-info');
	}

	//Cette fonction permet de passer un appel
	//@param phonenumber int
	appeler(phonenumber) {
		let obj_number = phonenumber;
		if (phonenumber == '') obj_number = this.client.phone;

		this.odooService.doCall(obj_number, this.txtLangue.error_phone);
	}

	//Cette fonction permet d'envoyer un SMS
	//@param phonenumber int, le numéro de phone
	sendSMS(phonenumber) {
		this.odooService.doSMS(phonenumber);
	}

	//Cette fonction permet l'envoi d'un Mail
	//@param email string, email du destinataire
	sendEmail(email) {
		this.odooService.doEmail(email, this.txtLangue.error_email);
	}

	seeMeetings() {
		this.navCtrl.push('AgendaPage', { customer: this.client, view: 'list' });
	}
	subscribe(){
		// var sub = this.navParams.get('toSend');
		// this.navCtrl.push('AbonnementsPage', { customer: this.client, view: 'list' });
		console.log('Test if it is working');
	}

	//Cette fonction permet d'ouvrir un site web
	//@param link_website string, url du site web
	openWeb(link_website) {
		this.odooService.doWebsite(link_website, this.txtLangue.error_website);
	}

	/**
    * Function qui permert d'ajouter un contact au
    * client de type Company(entreprise)
    */
	addContact() {
		let addModal = this.modalCtrl.create('FormClientPage', {
			modif: false,
			objet: {},
			type: 'client',
			company: this.client
		});
		let msgLoading = this.loadCtrl.create({ content: this.txtLangue.add });

		addModal.onDidDismiss((data) => {
			if (data) {
				let message = this.txtLangue.add_msg;
				msgLoading.present();
				data.idx = new Date().valueOf();

				//On insère dans la bd Interne
				this.lines.push(data);
				this.client.child_ids.push(data.id);

				this.odooService.copiedAddSync('client', data);
				this.odooService.syncCreateObjet('client', data);

				msgLoading.dismiss();
				this.odooService.showMsgWithButton(message, 'top', 'toast-success');
			}
		});

		addModal.present();
	}
	/**
    * Function qui permert d'ajouter un contact au
    * client de type Company(entreprise)
    */
	addLead() {
		let addModal = this.modalCtrl.create('FormLeadPage', {
			objet: null,
			action: 'insert',
			type: 'opportunity',
			lang: this.txtPop
		});

		this.odooService.createObjetResult('leads', null, null, addModal, (res) => {
			// let tab = [];

			// this.listeLeads.push(res);
			this.leads.push(res);
			this.odooService.copiedAddSync('leads', res); //ON insère dans la bd liste
			this.odooService.showMsgWithButton(this.txtLangue.opport_add, 'top', 'toast-success');
		});
	}

	updateInList(objet) {
		for (let k = 0; k < this.activities.length; k++) {
			if (this.activities[k].id == objet.next_activity_id.id) {
				// this.activities[k].id
			}
		}
	}

	/**
    * Function qui permert d'ajouter un next activity sur un
    * prospect d'un client
    */
	addActivity() {
		if (this.leads.length > 0) {
			let addModal = this.modalCtrl.create('FormActivityPage', {
				client: this.client,
				leads: this.leads
			});
			let msgLoading = this.loadCtrl.create({ content: this.txtLangueMsg.statut_add });

			addModal.onDidDismiss((data: Lead) => {
				if (data) {
					let message = this.txtPop.act_added;
					msgLoading.present();

					console.log('Lead received ', data);
					// this.updateInList(data)
					this.odooService.updateNoSyncLeads('leads', data, data.id, 'standart').then(() => {
						this.listChilds('leads');
					});
					//On insère dans la bd Interne

					this.odooService.updateObjectByAction(
						'update',
						'leads',
						data.id,
						data,
						null,
						false,
						false,
						(res) => {
							// this.odooService.updateNoSync('leads', data, data.id, 'standart');
						}
					);
					msgLoading.dismiss();
					this.odooService.showMsgWithButton(message, 'top', 'toast-success');
				}
			});

			addModal.present();
		} else {
			this.odooService.showMsgWithButton(this.txtPop.no_lead, 'top', 'toast-info');
		}
	}
	/**
    * Function qui permert d'ajouter une commande au
    * client
    */
	addSaleOrder() {
		let addModal = this.modalCtrl.create('FormSalePage', {
			modif: false,
			type: 'vente',
			param: this.type,
			partner_id: this.client
		});
		let msgLoading = this.loadCtrl.create({ content: this.txtLangueMsg.statut_add });

		addModal.onDidDismiss((data) => {
			if (data) {
				let message = this.txtLangueMsg.txt_add;
				msgLoading.present();
				data.idx = new Date().valueOf();
				data.state = 'sale';

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
    * Function qui permert de creer une devis pour le client en question
    */
	addDevis() {
		let addModal = this.modalCtrl.create('FormSalePage', {
			modif: false,
			type: 'vente',
			param: this.type,
			partner_id: this.client
		});
		let msgLoading = this.loadCtrl.create({ content: this.txtLangueMsg.sales.statut_add });

		addModal.onDidDismiss((data) => {
			if (data) {
				let message = this.txtLangueMsg.sales.txt_add;
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

	//Cette méthode permet de rediriger l'utilisateur vers la 
	//vue correspondante
	showMore(type) {

		if (type == 'leads') {
			this.navCtrl.push('PipelinePage', { client: this.client });
		} else if (type == 'devis') {
			this.navCtrl.push('SalesPage', { client: this.client, partner: 'draft' });
		} else if (type == 'commands') {
			this.navCtrl.push('SalesPage', { client: this.client, partner: 'sale' });
		} else if (type == 'contacts') {
			this.navCtrl.push('ClientPage', { client: this.client, partner: 'client' });
		} else if (type == 'activities') {
			this.navCtrl.push('FormActivityPage', { activity: true, activities: this.activities });
		}else if (type == 'meeting') {
			this.seeMeetings();
		}else if (type == 'sub') {
			this.navCtrl.push('AbonnementsPage', { client: this.client});
		}else if (type == 'invoice') {
			this.navCtrl.push('InvoicesPage', { client: this.client, state:'expired' });
		}else if (type == 'email') {
			this.navCtrl.push('MailsPage', { client: this.client });
		}
	}

	viewContact(item) {

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
			type: this.the_partner,
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
	// 				type: this.the_partner,
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
	// 			// this.callForm(item, this.the_partner);
	// 		}
	// 	});

	// 	if (this.the_partner == 'client') {
	// 		tab.push({
	// 			text: this.txtPop.meeting,
	// 			cssClass: 'btn-sheet-meeting',
	// 			// icon: 'ios-cash-outline',
	// 			handler: () => {
	// 				this.navCtrl.push('AgendaPage', { client: item });
	// 			}
	// 		});

	// 		tab.push({
	// 			text: this.txtPop.devis,
	// 			cssClass: 'btn-sheet-sales',
	// 			// icon: 'ios-cash-outline',
	// 			handler: () => {
	// 				this.navCtrl.push('SalesPage', { client: item, partner: 'quotation' });
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
	// 			}
	// 		});
	// 	}

	// 	tab.push({
	// 		text: this.txtPop.call,
	// 		cssClass: 'btn-sheet-call',
	// 		// icon: 'ios-call-outline',
	// 		handler: () => {
	// 			this.odooService.doCall(item.phone, this.txtError.launch_dial_phone);
	// 		}
	// 	});
	// 	tab.push({
	// 		text: this.txtPop.sms,
	// 		cssClass: 'btn-sheet-sms',
	// 		// icon: 'ios-chatbubbles-outline',
	// 		handler: () => {
	// 			this.odooService.doSMS(item.phone);
	// 		}
	// 	});
	// 	tab.push({
	// 		text: this.txtPop.email,
	// 		cssClass: 'btn-sheet-mail',
	// 		// icon: 'ios-mail-outline',
	// 		handler: () => {
	// 			this.odooService.doEmail(item.email, this.txtError.error_mail);
	// 		}
	// 	});

	// 	return tab;
	// }

	/**
    * Cette fonction permet d'afficher la liste
    * des contacts, ou des catégories
    * @param type string, nom de l'objet
    */
	listChilds(type) {
		this.lgServ.isTable('_ona_' + type).then((res) => {
			if (res) {
				if (type == 'leads') {
					this.leads = [];
					this.activities = [];
				}
				let lines = JSON.parse(res);

				for (let i = 0; i < lines.length; i++) {
					let element = lines[i];
					if (type == 'client') {
						if (element.id != 0) {
							if (this.client.child_ids.indexOf(element.id) > -1) {
								this.lines.push(element);
							}
						} else {
							if (element.parent_id.id == this.client.id) {
								this.lines.push(element);
							}
						}
					} else if (type == 'leads') {
						if (element.id != 0) {
							if (this.client.opportunity_ids.indexOf(element.id) > -1) {
								this.leads.push(element);
							}
						} else {
							if (element.partner_id.id == this.client.id) {
								this.leads.push(element);
							}
						}
					} else if (type == 'vente') {
						if (element.id != 0) {
							if (this.client.sale_order_ids.indexOf(element.id) > -1) {
								if (element.state == 'sale') {
									this.commands.push(element);
								} else {
									this.ventes.push(element);
								}
							}
						} else {
							if (element.partner_id.id == this.client.id) {
								if (element.state == 'sale') {
									this.commands.push(element);
								} else {
									this.ventes.push(element);
								}
							}
						}
					} else if (type == 'etiquette') {
						if (this.client.category_id.indexOf(element.me.id.me) > -1) {
							this.listCategories.push(element);
						}
					} else {
					}
				}
				if (type == 'leads') {
					for (let j = 0; j < this.leads.length; j++) {
						let actionObj = {
							id: 0,
							name: '',
							date: '',
							type: '',
							user: '',
							opport: ''
						};
						if (this.leads[j].next_activity_id.id != 0) {
							actionObj.id = this.leads[j].next_activity_id.id;
							actionObj.name = this.leads[j].next_activity_id.name;
							actionObj.date = this.leads[j].date_action;
							actionObj.type = 'next';
							actionObj.user = this.leads[j].user_id.name;
							actionObj.opport = this.leads[j].name;
							this.activities.push(actionObj);
						}
						if (this.leads[j].last_activity_id.id != 0) {
							actionObj.id = this.leads[j].last_activity_id.id;
							actionObj.name = this.leads[j].last_activity_id.name;
							actionObj.date = this.leads[j].date_open;
							actionObj.type = 'last';
							actionObj.user = this.leads[j].user_id.name;
							actionObj.opport = this.leads[j].name;
							this.activities.push(actionObj);
						}
					}
					console.log('activities => ', this.activities);
				}
				console.log('leads ', this.leads);
				console.log('contacts', this.lines);
				console.log('ventes => ', this.ventes);
				console.log('commands => ', this.commands);
			} else {
				this.odooService.requestObjectToOdoo(type, null, null, false, (res) => {
					let fromServ = [];

					for (let j = 0; j < res.length; j++) {
						if (type == 'client') {
							fromServ.push(new Partner(res[j], type));
							// this.lines = fromServ;
							if (this.client.child_ids.indexOf(fromServ[j].id) > -1) this.lines.push(fromServ[j]);
						} else if (type == 'leads') {
							fromServ.push(new Lead('m', res[j]));

							if (this.client.opportunity_ids.indexOf(fromServ[j].id) > -1) this.leads.push(fromServ[j]);
						} else if (type == 'vente') {
							fromServ.push(new Vente(res[j]));
							if (this.client.sale_order_ids.indexOf(fromServ[j].id) > -1) {
								if (fromServ[j].state == 'sale') {
									this.ventes.push(fromServ[j]);
								} else {
									this.commands.push(fromServ[j]);
								}
							}
						} else {
							fromServ.push(res[j]);
							if (this.client.category_id.indexOf(res[j].me.id.me) > -1) {
								this.listCategories.push(res[j]);
							}
							// this.listCategories = fromServ;
						}
					}

					//Store data in sqlLite and save date of last sync
					this.lgServ.setTable('_ona_' + type, fromServ);
					this.lgServ.setSync('_ona_' + type + '_date');
					// fromServ = null;
				});
			}
		});

		console.log('Activities ', this.activities);
	}

	openLeftMenu() {
		this.menuCtrl.open();
	}

	defineRdv() {}

	getWonOpportData() {
		this.barChartLargeDataSet = this.lgServ.getLastMonthsInvoices(this.leads, this.user);
	}

	/**
	 * Cette méthode permet de lier les
	 * évènements tap sur les boutons
	 */
	bindEvents() {
		this.eventsBinding = {
			onTap: (event: any) => {
				let objToSend = {
					rubrique: null,
					objet: event.objet,
					user: null,
					type: this.the_partner,
					login: null
				};
				// console.log(event);
				this.navCtrl.push('DetailLeadOpportPage', { toSend: objToSend });
				// this.onTapItem(event.objet, event.theEvent);
			}
		};
		this.devisEventsBinding = {
			onClick: (event: any) => {
				this.navCtrl.push('DetailsSalePage', { toSend: event.devis, type: this.type });
			}
		};
	}
}
