import { Component, ViewChild } from '@angular/core';
import {
	NavController,
	NavParams,
	LoadingController,
	AlertController,
	ModalController,
	MenuController,
	PopoverController,
	Events,
	IonicPage,
	Content,
	ActionSheetController
} from 'ionic-angular';


import { OdooProvider } from '../../providers/odoo/odoo';
import * as moment from 'moment';
import { LoginProvider } from '../../providers/login/login';
// import { Partner } from '../../models/partner';
import { ConfigSync, ConfigOnglet } from '../../config';
import { Calls } from '../../models/call';
import { TranslateService } from '@ngx-translate/core';
import { CallNumber } from '@ionic-native/call-number';
import { CallLog } from '@ionic-native/call-log';
// import * as moment from 'moment';

@IonicPage()
@Component({
	selector: 'page-calls',
	templateUrl: 'calls.html'
})
export class CallsPage {

	last_date = null;
	@ViewChild(Content) content: Content;

	current_lang: string;
	objectUser: any;
	phoneClients: any;
	client: string;
	// newObject: Calls;
	phoneLeads: any;
	leads: any;
	public current_year;
	date: any;
	public isSearchbarOpened = false;
	public phoneCalls = [];
	public searchTerm: string = '';
	// public animateClass: any;
	private dumpData: any;
	private filtres = [];
	private filtreEquipe = [];
	public objLoader;
	public display = false;
	public the_partner;
	public titre;
	public txtFiltre = [];
	public max = 10; //Nombre d'éléments max a chargé (ioninfinite scroll)
	private offset = 0; //index à partir duquel débuter
	// private offset = 0; //index à partir duquel débuter
	public isArchived = false;

	private objLogin: any;
	private user: any;
	private checkSync;
	txtpop: any;
	result: any;
	question: any;
	callEvents: any;
	display_search: boolean = false;
	showQuickFilter: boolean = false;
	searchBtnColor: string = 'light';
	colorFilterBtn: string = 'gris';
	objFiltre = [];
	hour: number;
	year: number;
	notCalled: any;
	filter_years: any = [];
	teamList: any;
	currentData: any = [];
	compare: boolean = false;


	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public odooService: OdooProvider,
		public loadCtrl: LoadingController,
		public alertCtrl: AlertController,
		public modalCtrl: ModalController,
		public lgService: LoginProvider,
		public menuCtrl: MenuController,
		public popCtrl: PopoverController,
		public actionCtrl: ActionSheetController,
		public events: Events,
		public callNumber: CallNumber,
		public callLog: CallLog,
		public translate: TranslateService
	) {
		this.google();
		this.lgService.checkStatus('_ona_' + this.the_partner).then((res) => {
			console.log('CALLS => ', res);
		});
		let date = new Date();
		let key = date.getTime();
		this.hour = date.getHours();
		this.year = date.getFullYear();
		console.log('TIME => ', key);
		console.log('date => ', date.getHours());
		console.log('year => ', date.getFullYear());

		this.build();
		this.current_lang = this.translate.getDefaultLang();
		this.translate.get('pop').subscribe((res) => {
			this.txtpop = res;
		});

		this.listTeam();
		this.the_partner = 'call';
		this.leads = 'leads';
		this.client = 'client';
		this.titre = this.navParams.get('titre');
		// this.defaultImg = 'assets/images/person.jpg';
		this.objLoader = true;
		// this.recentCalls();
		this.syncOffOnline();

		// this.message = 'nouvelle appel téléphonique';
		this.listLeads();
		this.listClients();

		this.lgService.isTable('me_avocat').then((result) => {
			if (result) this.objectUser = JSON.parse(result);

			console.log('User Infos => ', this.objectUser);

			// this.syncOffOnline();
			this.checkSync = setInterval(() => this.activateSyn(), ConfigSync.timeSync);
		});

		this.lgService.formatDate("_ona_" + this.the_partner).then(_date => {
			this.last_date = _date;
		});
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

	//Cette fonction récupère la liste des clients
	listClients() {

		this.lgService.isTable('_ona_' + this.client).then((result) => {

			if (result)
				this.phoneClients = JSON.parse(result);
		});
	}
	google(){
		let array = [];

		this.dumpData = array
		for (let i = 0; i < array.length; i++) {
			var element = array[i];
		}
		console.log('Phone calls => ', element);
	}

	build() {
	// for (let i = 0; i < this.dumpData.length; i++) {
	// 	let objDate = this.dumpData[i].date;
	// 	let period = new Date();
	// 	let year = period.getFullYear();
	// 	let month = period.getMonth() + 1;
	// 	let yearObj = new Date(objDate).getFullYear();
	// 	let monthobj = new Date(objDate).getMonth() + 1;
	// 	if(objDate.state == 'open' && ((yearObj == year || yearObj + 1 == year ) && (monthobj == month || monthobj == month + 1))){
	// 		this.compare = true;
	// 	}else{
	// 		this.compare = false;
	// 	}				
	// }
		this.callEvents = {
			onClick: (event: any) => {
				this.call(event.object);
			},
			onPlan: (event: any) => {
				this.plan(event.object, event.theEvent);
			},
			onModify: (event: any) => {
				this.modify(event.theEvent, event.object);
			}, onTest: (event: any) => {
				this.test(event.object);
			}
		};
	}

	test(call) {
		let action = this.actionCtrl.create({
			title: 'Choisissez une option',
			cssClass: 'product-action-sheets',
			buttons: [
				{
					text: 'Appeler',
					cssClass: "icon icon-phone",
					handler: () => {
						this.call(call);
					}
				},
				{
					text: ' Modifier l\'appel',
					cssClass: "icon icon-pencil",
					handler: () => {
						this.modify('call', call);
					}
				},
				{
					text: 'Plannifier un autre appel',
					cssClass: "icon icon-content-paste",
					handler: () => {
						this.plan('call', call);
					}
				}

			]
		});
		action.present();
	}
	synchronizing() {
		this.objLoader = true;
		this.syncOffOnline();
		// this.updateListMeeting('ok');
	}

	/**
	 * Method to pass a call by clicking on a planned call
	 * @param item Planned call to pass
	 */
	call(item) {
		if (
			item.state == 'open' && new Date() < new Date(item.date)
		) {
			this.translate.get('Ts_Translat').subscribe((res) => {
				this.question = res.question;

				let alert = this.alertCtrl.create({
					title: item.partner_id.name,
					message: this.question + item.partner_id.name,
					buttons: [
						{
							text: 'Cancel',
							role: 'cancel',
							handler: () => { }
						},
						{
							text: 'Call',
							handler: () => {
								this.callNumber
									.callNumber(item.partner_phone, true)
									.then((res) => {
										//update local db and server with duration and state
										var calllogs = [];
										calllogs = res;
										if (calllogs.length > 0) {
											this.updateAfterCall(item, calllogs[0].duration);
										}
										this.callLog
											.getCallLog([
												{
													name: 'number',
													value: item.partner_phone,
													operator: '=='
												}
											])
											.then((res) => {
												//update local db and server with duration and state
												var calllogs = [];
												calllogs = res;
												if (calllogs.length > 0) {
													this.updateAfterCall(item, calllogs[0].duration);
												}
											});
									})
									.catch((err) => { console.error(err) });
							}
						}
					]
				});
				alert.present();
			});
		}

		else {
			this.odooService.showMsgWithButton("Désolé, mais la date limite pour cet appel est arrivé à éxpiration. !", 'top', 'toast-info')
		}
	}
	/**
	 * @description cette fonction permet a l'utilisateur de savoir comment faire pour modifier un appel
	 * @author Foubia
	 */

	onInfo(getInfo) {
		console.log('Info event => ', getInfo);
		this.odooService.showMsgWithButton("Vous pouvez effectuer un balayage vers la gauche sur un appel téléphonique afin de découvrir les fonctionnalités de cet appel", 'top', 'toast-info');
	}

	/**
	 * Method to update a call after it had been passed
	 * @param call L'objet call a update
	 * @param duration La duree de l'appel en question (in seconds)
	 */
	updateAfterCall(call, duration) {
		var state = {
			id: call.id,
			state: 'done',
			duration: duration
		};
		this.odooService.updateSyncRequest(this.the_partner, state);
		this.odooService.updateNoSync(this.the_partner, call, call.id, 'standart');
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
	/**
   * Cette fonction permet de
   * recherche un élément dans la liste des partners
   *
   **/
	setFilteredItems(ev) {
		if (ev.target.value === undefined) {
			this.phoneCalls = this.dumpData;
			this.max = 10;
			return;
		}
		var val = ev.target.value;


		if (val != '' && val.length > 2) {
			this.phoneCalls = this.dumpData.filter(item => {
				let txtNom = item.name + ' ' + item.partner_id.name + ' ' + item.team_id.name;
				return txtNom.toLowerCase().indexOf(val.toLowerCase()) > -1;
			});
		} else if (val == '' || val == undefined) {
			this.phoneCalls = this.dumpData;
			this.max = 10;
		}
	}

	// creation d'un nouvelle appel.
	onAdd() {

		let phoneModal = this.modalCtrl.create('FormCallPage', { modif: false, objet: null, lang: this.txtpop });
		let msgLoading = this.loadCtrl.create({ content: 'Enregistrement en cours...' });

		phoneModal.onDidDismiss((data) => {
			if (data) {
				console.log('Call programmed : ', data);
				let message = "L'appel téléphonique a été programmée";
				msgLoading.present();

				data.idx = new Date().valueOf();

				//On insère dans la bd Interne
				this.phoneCalls.push(data);

				//On sauvegarde dans la bd temporaire (pour sync)
				this.odooService.copiedAddSync(this.the_partner, data);
				this.odooService.syncCreateObjet(this.the_partner, data);

				msgLoading.dismiss();
				this.odooService.showMsgWithButton(message, 'top', 'toast-success');

			}
		});

		phoneModal.present();
	}

	//cette methode permet a ce que l'utilisateur puis plannifier un appel

	doInfinite(infiniteScroll) {
		this.offset += this.max;
		// let params = { options: { offset: this.offset, max: this.max } };
		this.max += 10;

		infiniteScroll.complete();
	}

	plan(data, calls) {
		let alert = this.alertCtrl.create({
			title: 'Date',
			inputs: [
				{
					name: 'date',
					placeholder: 'Title',
					type: 'datetime-local'
				}
			],
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					handler: (data) => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Save',
					handler: (data) => {
						var date;
						var dateAlert;
						var dateEvent;
						dateAlert = data.date;
						console.log('Date => ', dateAlert);
						var event = new Date(dateAlert);
						dateEvent = event.toISOString();
						console.log('Date => ', dateEvent);
						var date1 = dateEvent.replace('T', ' ');
						console.log('date =>', date1);
						date = date1.replace('.000Z', '');
						console.log('New date =>', date);

						//   if(this.date){

						// 	calls.date = this.date;
						// 	console.log('data => ', calls);

						// }
						var newObject = Object.assign({}, calls);


						if (newObject) {
							newObject.id = 0;
							newObject.date = date;
						}

						// console.log('New_Objects =>', newObject);
						this.odooService.syncCreateObjet(this.the_partner, newObject);
						this.odooService.copiedAddSync(this.the_partner, newObject);

						var state = { id: calls.id, state: 'cancel' };

						setTimeout(() => {
							calls.state = 'cancel';
							// console.log('Old_Objects =>', calls);
							this.odooService.updateSyncRequest(this.the_partner, state);
							this.odooService.updateNoSync(this.the_partner, calls, calls.id, 'standart');
						}, 500);

						//On met à jour la liste d'appels
						setTimeout(() => {
							this.updateListCalls();
						}, 500);


					}
				}
			]
		});
		alert.present();
	}

	/**
	 * Cette fonction permet de mettre à jour
	 * la liste d'appels 
	 */
	updateListCalls() {

		this.lgService.isTable('_ona_' + this.the_partner).then((result) => {
			this.result = result;
			if (result) {
				let arrayCalls = JSON.parse(result), appels = [];

				for (let i = 0; i < arrayCalls.length; i++) {
					if (arrayCalls[i].user_id.id == this.objectUser.id && arrayCalls[i].state == 'open')
						appels.push(arrayCalls[i]);
				}

				this.phoneCalls = this.getListCallsByFilter(appels);
			}
		});
	}

	// Cette methode permet de modifier un appel
	modify(event, calls) {
		console.log('Obj => ', calls);
		console.log('Event => ', event);

		let phoneModal = this.modalCtrl.create('FormCallPage', { objet: calls, modif: true, lang: this.txtpop });
		let msgLoading = this.loadCtrl.create({ content: 'Enregistrement en cours...' });

		phoneModal.onDidDismiss((data) => {
			if (data) {
				console.log(data);
				let message = "Les informations sur l'appel ont été modifiées";
				msgLoading.present();

				//On met à jour les informations (data) dans la base de données interne

				if (calls.id == 0) this.odooService.updateNoSyncObjet(this.the_partner, data, calls);
				else {
					this.odooService.updateNoSync(this.the_partner, data, calls.id, 'standart');
					this.odooService.updateSyncRequest(this.the_partner, data);
				}

				msgLoading.dismiss();
				this.odooService.showMsgWithButton(message, 'top', 'toast-success');
			}
		});

		phoneModal.present();
	}

	/**
	 * Permet à l'utilisateur de 
	 * @param objet JSONObject
	 * @param type string, le type de groupe
	 */
	private resetObjets(objet, type, options?: any) {
		if (type == 'year') {
			for (let i = 0; i < this.filter_years.length; i++) {
				if (this.filter_years[i].id != objet.id)
					this.filter_years[i].selected = false;

				if (options) this.filter_years[i].selected = false;
			}
		}

	}
	/**
	 * Cette méthode permet de filtrer 
	 * la lsite des prospects en fonction des filtres
	 * 
	 * @param item JSON object, un filtre
	 */
	onQuickFilter(item, i) {
		if (!item.selected) {
			this.showQuickFilter = true;
			this.phoneCalls = this.dumpData;
			this.content.resize();
		}

		if (item.slug == "allCall") {
			this.showQuickFilter = true;

			this.phoneCalls = this.dumpData;
			// console.log('Dump => ', this.phoneCalls);
			this.content.resize();
			this.colorFilterBtn = 'gris';
			item['selected'] = true;

		} else {
			if (!item.selected) {
				if (item.slug == "team") {
					this.showQuickFilter = true;
					this.content.resize();
					this.colorFilterBtn = 'gris';
					item['selected'] = true;
					this.phoneCalls = [];
					for (let i = 0; i < this.dumpData.length; i++) {
						if (this.objectUser.sale_team_id.id == this.dumpData[i].team_id.id) {
							this.phoneCalls.push(this.dumpData[i]);
						}
					}
					if (this.phoneCalls.length == 0) {
						var obj1 = {
							name: item.nom
						}
						// this.notCalled = [];
						this.notCalled.push(obj1);
					}
				} else if (item.slug == "today") {
					this.showQuickFilter = true;
					this.content.resize();
					this.colorFilterBtn = 'gris';
					item['selected'] = true;
					this.phoneCalls = [];
					var currentdate = new Date();
					for (let i = 0; i < this.dumpData.length; i++) {
						var one = this.dumpData[i].date;
						var objecDate = new Date(one);
						var day = currentdate.getDate();
						var year = currentdate.getFullYear();
						var comparedDay = objecDate.getDate();
						var comparedYear = objecDate.getFullYear();
						if (day == comparedDay && comparedYear == year) {
							this.phoneCalls.push(this.dumpData[i]);
						}
					}
					this.notCalled = [];
					if (this.phoneCalls.length == 0) {
						var obj3 = {
							name: item.nom
						}
						this.notCalled.push(obj3);
						console.log('Not there => ', this.notCalled);
					}
				} else if (item.slug == "default") {
					this.showQuickFilter = true;
					this.content.resize();
					this.colorFilterBtn = 'gris';
					item['selected'] = true;
					this.phoneCalls = [];
					for (let i = 0; i < this.dumpData.length; i++) {
						if (this.dumpData[i].user_id.id == this.objectUser.id) {
							this.phoneCalls.push(this.dumpData[i]);
						}
					}
				} else {
					this.phoneCalls = [];
					this.notCalled = [];
					for (let i = 0; i < this.dumpData.length; i++) {
						if (this.dumpData[i].state == item.slug) {
							this.phoneCalls.push(this.dumpData[i]);
						}
						console.log('Selected => ', this.phoneCalls);
					}
					if (this.phoneCalls.length == 0) {
						var obj2 = {
							name: item.nom
						}
						this.notCalled.push(obj2);
						console.log('Not there => ', this.notCalled);
					}


				}
				item["selected"] = true;
			} else {
				item["selected"] = false;
				this.phoneCalls = this.dumpData;
			}
			for (let j = 0; j < this.phoneCalls.length; j++) {
				if (this.phoneCalls[j].id != item.id) {
					this.phoneCalls[j].selected = false;
				}
			}
		}

		this.max = 10;
	}
	filterTeam(objet) {
		if (objet.selected == true) {
			objet['selected'] = false;
		} else {
			objet['selected'] = true;
			for (let k = 0; k < this.teamList.length; k++) {
				if (objet.id != this.teamList[k].id) {
					this.teamList[k].selected = false;
				}
			}
		}
		let results = [];
		for (let i = 0; i < this.dumpData.length; i++) {
			if (this.dumpData[i].team_id.id == objet.id) {
				results.push(this.dumpData[i]);
			}
		}
		this.phoneCalls = results;
		
		console.log('Object => ', objet);
		this.notCalled = [];
		if (this.phoneCalls.length == 0) {
			var obj3 = {
				name: objet.name
			}
			this.notCalled.push(obj3);
			console.log('Not there => ', this.notCalled);
	}
	}
	listTeam() {
		this.lgService.isTable('_ona_team').then((result) => {
			if (result) {
				this.teamList = JSON.parse(result);
				for (let i = 0; i < this.teamList.length; i++) {
					this.teamList[i].selected = false;
					
				}
				console.log('Liste Team => ', this.teamList);
			}
		});
	}

	// Cette methode permet de recuperer la liste des leads present dans la base de donnees
	listLeads() {
		this.lgService.isTable('_ona_' + this.leads).then((result) => {
			if (result) {
				this.phoneLeads = JSON.parse(result);
			}
		});
	}

	// Cette methode permet d'aller vers l'opportunite
	opportunity(calls) {

		var leads = this.phoneLeads;
		// console.log('Calls =>', calls);
		let opportunityId = calls.opportunity_id.id;
		if (opportunityId == 0) {

		} else {

			for (let i = 0; i < leads.length; i++) {
				var newLeads = leads[i];
				// console.log('Leads => ', newLeads);
				if (opportunityId == newLeads.id) {
					let objToSend = { objet: newLeads };
					this.navCtrl.push('DetailLeadOpportPage', { toSend: objToSend });
				}
			}
		}

	}

	//Cette fonction ouvre le menu gauche
	openLeftMenu() {
		this.menuCtrl.open();
	}

	// onFilter(theEvent) {
	// 	let popover = this.popCtrl.create('PopFilterPage', { 'res.partner': this.the_partner, lang: this.txtpop });
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

	filterListPartners(result, object) {
		// console.log('objFiltre ', result);
		// console.log('dumpData => ', this.dumpData);
		this.max = 10;
		let resultats = [];

		for (let i = 0; i < this.dumpData.length; i++) {
			if (this.applyFilterPartner(result, this.dumpData[i])) {
				resultats.push(this.dumpData[i]);
			}
		}

		this.phoneCalls = resultats;
		this.notCalled = [];

		if (this.phoneCalls.length == 0) {
			var obj3 = {
				name: object.text
			}
			this.notCalled.push(obj3);
			console.log('Not there => ', this.notCalled);
		}

	}


	applyFilterPartner(searchs, objet) {
		let cpt = 0;
		var one = objet.date;
		var currentdate = new Date();
		// var year = currentdate.getFullYear();
		var year = new Date(objet.date).getFullYear();
		var month = currentdate.getMonth() + 1;
		var day = currentdate.getDate();
		var objecDate = new Date(one);
		var comparedYear = objecDate.getFullYear();
		var comparedMonth = objecDate.getMonth() + 1;
		var comparedDay = objecDate.getDate();

		// console.log('day =>', day, 'month =>', month, 'New Year =>', year);
		// console.log('comparedDay =>', comparedDay, 'comparedMonth =>', comparedMonth, 'comparedYear =>', comparedYear);
		// var date = one.substring(0, 10);
		// console.log('Object =>', comparedDate);

		for (let j = 0; j < searchs.length; j++) {
			switch (searchs[j].slug) {
				case 'default': {
					//default
					if (objet.user_id.id == this.objectUser.id) {
						cpt++;
					}
					break;
				}
				case 'open': {
					//open
					if (objet.state == 'open') {
						cpt++;
					}
					break;
				}
				case 'team_id': {
					//Homme
					if (objet.team_id.id == this.objectUser.sale_team_id.id) {
						cpt++;
					}
					break;
				}
				case 'today': {
					//Personne
					if (day == comparedDay) cpt++;
					break;
				}
				case 'all_years': {
					//par date
					cpt++;
					break;
				}
				case 'year': {
					//par date
					if (new Date(objet.date).getFullYear() == searchs[j].val) {
						cpt++;
					}
					break;
				}
			}
		} //Fin tab searchs

		if (cpt == searchs.length) return true;
		else return false;
	}

	//Effecer les donneer apres chaque synchronisation

	ionViewDidLeave() {
		clearInterval(this.checkSync);

	}

	sortCallsOpen(arrayCalls, appels = []) {
		for (let i = 0; i < arrayCalls.length; i++) {
			if (arrayCalls[i].user_id.id == this.objectUser.id && arrayCalls[i].state == 'open')
				appels.push(arrayCalls[i]);
		}
	}

	syncOffOnline() {

		this.lgService.checkStatus('_ona_' + this.the_partner).then((res) => {
			if (res == 'i') {
				this.objLoader = false;
			} else if (res == 's' || res == 'w' || res == 'rw') {
				this.lgService.isTable('_ona_' + this.the_partner).then((result) => {
					if (result) {
						var arrayCalls = JSON.parse(result),
							appels = [];
						var currentYear = new Date();
						var one = arrayCalls.date;
						this.phoneCalls = [];
						for (let i = 0; i < arrayCalls.length; i++) {
							if (arrayCalls[i].user_id.id == this.objectUser.id && arrayCalls[i].state == 'open') {
								appels.push(arrayCalls[i]);
								let date = new Date(arrayCalls[i].date).getFullYear();
							}
						}
						this.dumpData = appels;
						var year = currentYear.getFullYear();
						let passedData = this.navParams.get('state');
						if(passedData != 'today'){
							this.filterbyObjets({ id: year, text: year, selected: true }, 'year');
							console.log('PhoneCalls =>', this.dumpData);
						}else{
							this.phoneCalls = [];
							var currentdate = new Date();
							for (let i = 0; i < this.dumpData.length; i++) {
								let one = this.dumpData[i].date;
								var objecDate = new Date(one);
								var day = currentdate.getDate();
								let year = currentdate.getFullYear();
								var comparedDay = objecDate.getDate();
								var comparedYear = objecDate.getFullYear();
								if (day == comparedDay && comparedYear == year) {
									this.phoneCalls.push(this.dumpData[i]);
						}
					}
						}
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

	/**
	 * Cette fonction permet de filtrer les appels
	 * du user connecté à partir du tableau d'ids des appels
	 * @param appels Array<Calls>, liste des appels de l'utilisateur connecté
	 */
	getListCallsByFilter(appels: Array<Calls>) {
		let results = [];

		if (this.navParams.get('tab_ids') === undefined) {
			results = appels;
		} else {
			let tabs = this.navParams.get('tab_ids');
			for (let i = 0; i < appels.length; i++) {
				if (tabs.indexOf(appels[i].id) > -1) results.push(appels[i]);
			}
		}

		return results;
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
	   * Cette fonction permet de charger la liste
	   * des partenaires (clients, tribunaux, contacts)
	   *
	   **/
	setListPartners(isManual?: any) {

		// let params = { options: { offset: 0, max: this.max } };
		this.odooService.requestObjectToOdoo(this.the_partner, null, this.last_date, false, (res) => {
			let fromServ = this.loadPartnerFromServer(res);
			//this.clients = fromServ;

			if (res.length != 0) {

				this.odooService.refreshViewList('_ona_' + this.the_partner, fromServ).then((rep: any) => {
					this.dumpData = rep;

					if (this.display || isManual !== undefined) {

						var appel = [];
						this.sortCallsOpen(this.dumpData, appel);
						var filteredCalls = this.getListCallsByFilter(appel);
						this.phoneCalls = filteredCalls;
						console.log('===> ', this.phoneCalls);
						this.display = false;
						if (isManual !== undefined) isManual.complete();
					}

				});

				//Store data in sqlLite and save date of last sync
				this.lgService.setObjectToTable('_ona_' + this.the_partner, fromServ);
				this.lgService.setSync('_ona_' + this.the_partner + '_date');
				fromServ = null;

			} else {

				if (isManual !== undefined) isManual.complete();
			}

		}, isManual);
	}

	loadPartnerFromServer(tab) {
		let result = [];

		for (let i = 0; i < tab.length; i++) {
			let objPartner = new Calls(tab[i]);
			result.push(objPartner);
		}

		return result;
	}
	/**
	 * Cette méthode permet de filtrer les Factures
	 * en fonction des groupes team, ou stage
	 * @param stage JSONObject, le stage selectionné
	 */
	filterbyObjets(objet, type) {

		objet.selected = !objet.selected;
		this.resetObjets(objet, type);
		let objDate;
		if (type == 'year') {
			this.current_year = objet.id;
		}
		if (this.current_year == 'all') {
			objDate = { slug: 'all_years', val: objet.id };
		}
		else {
			objDate = { slug: type, val: objet.id };
		}
		this.filterListPartners([objDate], objet);
	}


	ionViewDidLoad() {
		this.filtres = ConfigOnglet.filtreCalls(this.txtpop);
		console.log('Filtres => ', this.filtres);
		this.filtreEquipe = ConfigOnglet.equipeVente(this.txtpop);
		this.filter_years = ConfigOnglet.filterYears(this.txtpop);
		console.log('filter_years => ', this.filter_years);
		// this.filterbyObjets();
	}
}	
