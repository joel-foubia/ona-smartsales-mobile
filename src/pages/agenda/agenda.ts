import { Component, ViewChild } from '@angular/core';
import {
	NavController,
	NavParams,
	MenuController,
	PopoverController,
	ModalController,
	LoadingController,
	IonicPage,
	AlertController,
  Content,
  FabButton
} from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';

// import { FormAgendaPage } from '../form-agenda/form-agenda';

import { Agenda } from '../../models/agenda';
import { DragulaService } from 'ng2-dragula';
import { TranslateService } from '@ngx-translate/core';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { ConfigSync } from '../../config';

@IonicPage()
@Component({
	selector: 'page-agenda',
	templateUrl: 'agenda.html'
})
export class AgendaPage {
	last_date = null;
	defaultImg: string;
	@ViewChild(CalendarComponent) myCalendar: CalendarComponent;
	public meetings = [];
	// public hearingStage;
	public objSpinner = false;
	public dumpEvents = [];
	public collabos = [];
	private tab_ids = [];
	public objLoader = false;

	date: any;
	eventSource = [];
	viewTitle: string;
	selectedDay = new Date();
	calendar: any;
	public txtNoEvents = '';
	public txtAllDay = '';
	public objUser;
	public dgOpt;
	public current_lang;
	private checkSync;
	private txtLangue;
	private txtPop;
	max = 10;
	view_mode: string = 'other';
	offset: number;
	eventsBinding;
  customer;
  @ViewChild(Content) content: Content;
	@ViewChild(FabButton) fabButton: FabButton;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public menuCtrl: MenuController,
		private odooServ: OdooProvider,
		private popCtrl: PopoverController,
		public modalCtrl: ModalController,
		public loadCtrl: LoadingController,
		private lgServ: LoginProvider,
		private dgServ: DragulaService,
		private translate: TranslateService,
		public alertCtrl: AlertController
	) {
		this.current_lang = this.translate.getDefaultLang();
		// console.log(this.current_lang);
		this.defaultImg = 'assets/images/person.jpg';
		this.calendar = {
			mode: 'month',
			currentDate: this.selectedDay,
			locale: this.odooServ.setLangOfCalendar(this.current_lang)
		};

		//Gestion de la langue
		this.translate.get('module').subscribe((res) => {
			this.txtLangue = res.agenda;
			this.txtNoEvents = this.txtLangue.rdv;
			this.txtAllDay = this.txtLangue.allday;
		});

		this.translate.get('pop').subscribe((_res) => {
			this.txtPop = _res;
		});

		this.lgServ.formatDate('_ona_agenda').then((_date) => {
			this.last_date = _date;
		});

		this.lgServ.isTable('me_avocat').then((res) => {
			if (res) {
				//On récupère l'utilisateur courant
				if (this.navParams.get('customer') === undefined) {
          this.objUser = JSON.parse(res);
          this.tab_ids.push(this.objUser.partner_id.id);
				} else {
          this.customer =  this.navParams.get('customer');
          this.objUser = this.navParams.get('customer');
          this.tab_ids.push(this.objUser.id);
        }
        
				this.syncOffOnline();
        this.checkSync = setInterval(() => this.activateSyn(), ConfigSync.timeSync);
				console.log('Customer ', this.customer)
			}
		});

		if (navParams.get('view') == 'list') {
			this.view_mode = 'list';
		}

		this.dgOpt = {
			removeOnSpill: true
		};

		//Lorsqu'on élément est retiré de la liste
		this.dgServ.removeModel.subscribe((value) => {
			this.loadAfterRemove();
		});

		this.bindEvents();
	}

	bindEvents() {
		this.eventsBinding = {
			onClick: (event: any) => {
				let popover = this.popCtrl.create(
					'PopOverPage',
					{ menus: event.meeting.agenda, agenda: true, lang: this.txtPop },
					{ cssClass: 'custom-agenda' }
				);

				popover.present();
				popover.onDidDismiss((result) => {
					if (result) {
						//console.log(result);

						if (result.slug == 'detail') {
							this.navCtrl.push('DetailsAgendaPage', { objet: event.meeting });
						} else if (result.slug == 'update') {
							this.onUpdate(event.meeting.agenda, 'update');
						} else if (result.slug == 'couleur') {
							this.onColor(event.meeting.agenda);
						} else {
							let confirm = this.alertCtrl.create({
								title: 'ONA SMART SALES',
								message: this.txtLangue.delete_info,
								buttons: [
									{
										text: this.txtPop.no,
										handler: () => {}
									},
									{
										text: this.txtPop.yes,
										handler: () => {
											this.onArchive(event.meeting.agenda);
										}
									}
								]
							});

							confirm.present();
						}
					}
				});
			}
		};
	}

	ionViewDidLoad() {
    this.lgServ.showHideFab(this.content, this.fabButton);
  }

	ionViewDidLeave() {
		clearInterval(this.checkSync);
	}

	//AJout des éléments lorsque l'on scroll vers le
	//bas
	doInfinite(infiniteScroll) {
		this.offset += this.max;
		// let params = { options: { offset: this.offset, max: this.max } };
		this.max += 10;

		infiniteScroll.complete();
	}

	openLeftMenu() {
		this.menuCtrl.open();
	}

	//Cette fonction permet de charger les données
	//lorsque l'utilisateur est en mode offline ou via online (server)
	syncOffOnline() {
		this.lgServ.checkStatus('_ona_agenda').then((res) => {
			if (res == 'i') {
				//Première utilisation sans connexion
			} else if (res == 's' || res == 'w' || res == 'rw') {
				//From Storage

				this.lgServ.isTable('_ona_agenda').then((result) => {
					if (result) {
						// console.log(JSON.parse(result));
						let results = this.getListAgendaFilters(JSON.parse(result));
						this.loadMeetings(results);
						this.objLoader = false;
					}
				});

				//SYnc de la liste depuis le serveur
				if (res == 'w' || res == 'rw') {
					this.updateListMeeting();
				}
			}
		});
	}

	/**
   * Cette fonction récupère la liste des 
   * rendez vous qui seront trier en fonction d'un tab d'ids (Agenda)
   * @param rdvs Array<Agenda>
   */
	getListAgendaFilters(rdvs: Array<Agenda>) {
		let results = [];

		if (this.navParams.get('tab_ids') === undefined) {
			results = rdvs;
		} else {
			let tabs = this.navParams.get('tab_ids');
			for (let i = 0; i < rdvs.length; i++) {
				if (tabs.indexOf(rdvs[i].id) > -1) results.push(rdvs[i]);
			}
		}

		return results;
	}

	/**
	 * Cette fonction permet de rafraichir la page
	 * notamment utilisé dans le cas des procédures de synchronisation
	 * @param refresher any
	 */
	//Cette fonction permet de synchroniser les données
	synchronizing() {
		this.objLoader = true;
		this.syncOffOnline();
		// this.updateListMeeting('ok');
	}

	//Mise à jour des meetings depuis le serveur
	updateListMeeting(isManual?: any) {
		this.odooServ.requestObjectToOdoo(
			'agenda',
			null,
			this.last_date,
			false,
			(_data) => {
				let tabs_agenda = [];
				for (let i = 0; i < _data.length; i++) {
					tabs_agenda.push(new Agenda(_data[i]));
				}

				if (this.objLoader) {
					this.odooServ.refreshViewList('_ona_agenda', tabs_agenda).then((rep: any) => {
						let results = this.getListAgendaFilters(rep);
						this.loadMeetings(results);

						this.objLoader = false;
					});
				}

				//On met à jour la bd interne
				this.lgServ.setObjectToTable('_ona_agenda', tabs_agenda);
				this.lgServ.setSync('_ona_agenda_date');
			},
			isManual
		);
	}

	//Cette fonction permet d'activer la synchronisation
	activateSyn() {
		this.lgServ.connChange('_ona_agenda').then((res) => {
			if (res) {
				this.updateListMeeting();
			} else {
				clearInterval(this.checkSync);
			}
		});
	}

	/** 
   * Cette fonction permet de charger la liste des rendez vous ou
   * audiences
   * @param tab Array<JSONObject>, la liste json des partners
   * 
   * @return Array<Agenda>
   * 
   **/
	loadAgendaFromServer(tab) {
		let result = [];

		for (let i = 0; i < tab.length; i++) {
			let objAgenda = tab[i];
			//let objAgenda = new Agenda(tab[i]);

			if (objAgenda.color_partner_id >= 10) objAgenda['bg'] = '#ffffff';
			else objAgenda['bg'] = this.odooServ.getBgColor(objAgenda.color_partner_id);

			result.push(objAgenda);
		}

		return result;
	}

	/**
   * Cette fonction permet de charger les meetings
   * relative à une affaire
   *
   **/
	loadMeetings(sources) {
		let tab_ids = [];

    if(this.objUser.partner_id){
      tab_ids.push(this.objUser.partner_id.id);
    }
    else{
      tab_ids.push(this.objUser.id);
    }
		this.objSpinner = true;
		this.odooServ.getMyMeetings(sources, tab_ids).then((res) => {
			this.meetings = this.loadAgendaFromServer(res);
			// console.log(this.meetings);
			this.objSpinner = false;
			this.dumpEvents = this.meetings;
			this.eventSource = this.loadHearingInCalendar();
			// console.log('Meetings ', this.eventSource);
			
			let index = this.eventSource.length -1;
			this.addMeetingToCalendar(index);

		});

	}

	/**
	 * This method is used to load data event
	 * in Calendar
	 * @param index number, index de l'objet courant
	 */
	addMeetingToCalendar(index){
		
			if(index==-1){
				return;
			}else{

				this.odooServ.saveInCalendar(this.eventSource[index].agenda).then((res)=>{
					index--;
					this.addMeetingToCalendar(index);
				}).catch((err) => {
					
				});

			}
		
	}

	//Changer le libellé du mois
	onViewTitleChanged(titre) {
		this.viewTitle = titre;
	}

	//permet de selectionner une date dans le calendrier
	onTimeSelected(event) {
		this.selectedDay = event.selectedTime;
	}

	//changer le mode de vue
	changeMode(mode) {
		if (mode == 'list') {
			this.view_mode = 'list';
		} else {
			this.view_mode = 'other';
			this.calendar.mode = mode;
		}
	}

	//Cette fonction affiche la date d'aujourd'hui
	today() {
		this.calendar.currentDate = new Date();
	}

	//selectionne un evenement
	onEventSelected(event) {}

	eventSelected(pos, event) {
		//console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
		let popover = this.popCtrl.create(
			'PopOverPage',
			{ menus: event.agenda, agenda: true, lang: this.txtPop },
			{ cssClass: 'custom-agenda' }
		);

		popover.present({ ev: pos });
		popover.onDidDismiss((result) => {
			if (result) {
				//console.log(result);

				if (result.slug == 'detail') {
					this.navCtrl.push('DetailsAgendaPage', { objet: event });
				} else if (result.slug == 'update') {
					this.onUpdate(event.agenda, 'update');
				} else if (result.slug == 'couleur') {
					this.onColor(event.agenda);
				} else {
					let confirm = this.alertCtrl.create({
						title: 'ONA SMART SALES',
						message: this.txtLangue.delete_info,
						buttons: [
							{
								text: this.txtPop.no,
								handler: () => {}
							},
							{
								text: this.txtPop.yes,
								handler: () => {
									this.onArchive(event.agenda);
								}
							}
						]
					});

					confirm.present();
				}
			}
		});
	}

	//Cette fonction permet d'ouvrir le menu contextuel
	//pour le choix du mode de lecture
	openMode(theEvent) {
		let popover = this.popCtrl.create('PopNote2Page', { agenda: true, lang: this.txtPop });
		popover.present({ ev: theEvent });
		popover.onDidDismiss((result) => {
			if (result) {
				this.changeMode(result.slug);
			}
		});
	}

	//Convertir le temps en millisecondes
	private miliseconds(hrs, min, sec) {
		return (hrs * 60 * 60 + min * 60 + sec) * 1000;
	}

	/**
   * Cette fonction permet de calculer la 
   * date de fin d'une activité
   * @param startTime Datetime, date de début
   * @param duration float, la durée de l'activité
   * 
   **/
	private getEndTime(startTime, duration) {
		let endTime = new Date();
		let total, timeDuration;

		var strDuration = duration.toString();
		var tab = strDuration.split('.');

		if (tab.length !== undefined || tab.length < 2) timeDuration = this.miliseconds(duration, 0, 0);
		else if (tab.length > 1) timeDuration = this.miliseconds(parseInt(tab[0]), parseInt(tab[1]), 0);

		//let timeDuration = 1000*(duration*3600);
		let startMs = startTime.valueOf();

		total = startMs + timeDuration;
		endTime.setTime(total);

		return endTime;
	}

	/**
   * Cette méthode permet d'obtenir la 
   * date de demain
   * @param stop_date string, la date d'aujourd'hui
   * @returns Date object
   */
	private goToTheNextDay(stop_date) {
		let objStop = new Date(stop_date);
		let jour = objStop.getTime() + 24 * 60 * 60 * 1000;

		return new Date(jour);
	}

	//Cette fonction charge les meetings
	// dans le calendrier
	loadHearingInCalendar() {
		let events = [];

		for (let i = 0; i < this.meetings.length; i += 1) {
			let currentObj = this.meetings[i];
			let startTime, endTime;

			if (currentObj.color_partner_id >= 10) currentObj['bg'] = '#ffffff';
			else currentObj['bg'] = this.odooServ.getBgColor(currentObj.color_partner_id);

			if (!currentObj.allday) {
				startTime = new Date(currentObj.start_datetime);
				if (currentObj.stop) endTime = new Date(currentObj.stop);
				else endTime = this.getEndTime(new Date(currentObj.start_datetime), currentObj.duration);
			} else {
				startTime = new Date(currentObj.start_date);
				endTime = this.goToTheNextDay(currentObj.stop_date);
			}

			events.push({
				title: currentObj.name,
				startTime: startTime,
				endTime: endTime,
				agenda: currentObj,
				allDay: currentObj.allday
			});
		}

		//On synchronise l'agenda avec celui de l'appareil du Client
		//this.odooServ.synInCalendar(events);

		// console.log(events);
		return events;
	}

	//Cette fonction permet d'ajouter un événement
	onAdd() {
		let params = { modif: false, objet: null, partner: this.objUser.partner_id };
		let startTime, endTime;

		this.odooServ.addMyObjet('agenda', 'FormAgendaPage', params, (res) => {
			// console.log(res);
			//let objAgenda = new Agenda(res);
			let objAgenda = res;
			this.odooServ.copiedAddSync('agenda', objAgenda);
			this.odooServ.showMsgWithButton(this.txtLangue.meeting_add, 'top');

			if (objAgenda.color_partner_id >= 10) objAgenda['bg'] = '#ffffff';
			else objAgenda['bg'] = this.odooServ.getBgColor(objAgenda.color_partner_id);

			//On synchronise l'agenda avec celui de l'appareil du Client
			
			this.odooServ.saveInCalendar(objAgenda).then((res)=>{

      });

			if (!objAgenda.allday) {
				startTime = new Date(objAgenda.start_datetime);
				endTime = this.getEndTime(new Date(objAgenda.start_datetime), objAgenda.duration);
			} else {
				startTime = new Date(objAgenda.start_date);
				endTime = this.goToTheNextDay(objAgenda.stop_date);
			}

			let objet = {
				title: objAgenda.name,
				startTime: startTime,
				endTime: endTime,
				agenda: objAgenda,
				allDay: objAgenda.allday
			};

			let events = this.eventSource;

			events.push(objet);

			this.eventSource = [];
			this.eventSource = events;

			this.myCalendar.loadEvents();
			// console.log(this.eventSource);

			/*divDays[this.eventSource.length-1].style.background = '#ffffff';
        divDays[this.eventSource.length-1].style.background = '#ffffff';*/
		});
	}
	//Fin ajout dans l'agenda

	//Modification d'un rendez vous
	onUpdate(objet, type) {
		if (objet.id == 0) {
			this.odooServ.showMsgWithButton(this.txtLangue.fail_update_rdv, 'top', 'toast-info');
			return;
		}

		let params = { modif: true, objet: objet, action: type };
		let addModal = this.modalCtrl.create('FormAgendaPage', params);

		addModal.onDidDismiss((data) => {
			if (data) {

				this.odooServ.updateSyncRequest('agenda', data);
				data.stop = this.getEndTime(new Date(data.start_datetime), parseFloat(data.duration));

				this.odooServ.updateNoSync('agenda', data, data.id, 'standart');

				let events, startTime, endTime;
				events = this.eventSource;

				for (let i = 0; i < events.length; i++) {
					if (events[i].agenda.id == data.id) {
						if (!data.allday) {
							startTime = new Date(data.start_datetime);
							endTime = new Date(data.stop);
						} else {
							startTime = new Date(data.start_date);
							endTime = this.goToTheNextDay(data.stop_date);
						}

						//On modifie l'événement
						events[i] = {
							title: data.name,
							startTime: startTime,
							endTime: endTime,
							agenda: data,
							allDay: data.allday
						};

						break;
					}
				}

				this.eventSource = [];
				setTimeout(() => {
					this.eventSource = events;
				});
				this.odooServ.showMsgWithButton(this.txtLangue.update_rdv, 'top');
			}
		});

		addModal.present();
	}

	//Cette fonction permet de modifier la couleur
	//d'arrière plan d'un Rendez vous
	onColor(item) {
		let popover = this.popCtrl.create(
			'PopColorPage',
			{ couleur: item.color_partner_id },
			{ cssClass: 'custom-popcolor' }
		);
		let ev = {
			target: {
				getBoundingClientRect: () => {
					return { top: '100' };
				}
			}
		};

		popover.present({ ev });
		popover.onDidDismiss((result) => {
			if (result) {
				// console.log(result);
				item.bg = result.val;

				let data = { couleur: result, id: item.id };
				this.odooServ.updateSyncRequest('agenda', data);
				this.odooServ.showMsgWithButton(this.txtLangue.color, 'top');
				/*this.odooServ.updateSingleObject('agenda', item.id, data, false, (res)=>{
          });*/
				//FIn de la requete de mise à jour
			}
		});
	} //End update color

	//Cette fonction permet de supprimer un
	//rendez vous ou de l'annuler
	onArchive(item) {
		let req = { active: !item.active, id: item.id };
		item.active = !item.active;
		this.odooServ.updateSyncRequest('agenda', req);
		this.odooServ.removeObjetSync('agenda', item);
		let events = this.eventSource;

		for (let j = 0; j < events.length; j++) {
			if (events[j].agenda.id == item.id) {
				events.splice(j, 1);
				break;
			}
		}

		this.eventSource = [];
		setTimeout(() => {
			this.eventSource = events;
		});

		this.odooServ.showMsgWithButton(this.txtLangue.miss_rdv, 'top');

		/*this.odooServ.updateSingleObject('agenda', item.id, req, false, (res)=>{
      

    });*/
	}

	//Cette fonction permet d'afficher les rendez-vous
	//de tous les collaborateurs
	onFilter(event) {
		let popover = this.popCtrl.create('PopFilterPage', { agenda: true, lang: this.txtPop });
		popover.present({ ev: event });

		popover.onDidDismiss((result) => {
			if (result) {
				if (result.length == 0) {
					//Mise à jour des rendez vous
					this.lgServ.isTable('_ona_agenda').then((sources) => {
						if (sources) {
							this.odooServ.getMyMeetings(JSON.parse(sources), this.tab_ids).then((res) => {
								let events;
								this.meetings = this.loadAgendaFromServer(res);
								events = this.loadHearingInCalendar();

								this.eventSource = [];
								setTimeout(() => {
									this.eventSource = events;
								});
							});
						}
					});
				} else {
					//let req = {agenda: 'all'};
					//On affiche les rendez vous de tout le monde
					this.lgServ.isTable('_ona_agenda').then((sources) => {
						if (sources) {
							this.odooServ.getMyMeetings(JSON.parse(sources), []).then((res) => {
								let events;

								this.meetings = this.loadAgendaFromServer(res);
								events = this.loadHearingInCalendar();

								this.eventSource = [];
								setTimeout(() => {
									this.eventSource = events;
								});
							});
						}
					});

					/*this.odooServ.requestObjectToOdoo('agenda', null, req, false, (res)=>{
              });*/
				}
			}
		});
	}

	//Cette fonction permet d'ajouter un collaborateur
	//afin de pouvour consulter ces rendez vous
	onAddPartner() {
		let data = { data: 'contact', name: '', lang: this.txtPop };
		let modal = this.modalCtrl.create('HelperPage', data);

		modal.onDidDismiss((data) => {
			if (data) {
				let find = false;

				for (let j = 0; j < this.collabos.length; j++)
					if (this.collabos[j].id == data.id) {
						find = true;
						break;
					}

				if (!find) {
					// let objet = {};
					// objet['me'] = {
					//   id: { me : data.id },
					//   display_name: { me: data.name },
					//   image_url: { me: data.image_url }
					// };

					//On met à jour l'attribut collabos du Controller
					this.collabos.push(data);
					this.tab_ids.push(data.id);
				} //Fin liste des collaborateurs

				//console.log(this.tab_ids);
				this.objLoader = true;
				//On met à jout la liste des meetings
				this.lgServ.isTable('_ona_agenda').then((sources) => {
					if (sources) {
						this.odooServ.getMyMeetings(JSON.parse(sources), this.tab_ids).then((res) => {
							let events;
							this.objLoader = false;
							this.meetings = this.loadAgendaFromServer(res);
							events = this.loadHearingInCalendar();

							this.eventSource = [];
							setTimeout(() => {
								this.eventSource = events;
							});
						});
					}
				});

				//Fin Mise à jour
			}
		});

		modal.present();
	}

	//Cette fonction permet de recharger une liste
	//après qu'un élément ait été retiré
	private loadAfterRemove() {
		let tab_ids = [];

		tab_ids.push(this.objUser.partner_id.id);

		for (var i = 0; i < this.collabos.length; i++) {
			tab_ids.push(this.collabos[i].id);
		}

		//On met à jout la liste des meetings
		this.objLoader = true;
		this.lgServ.isTable('_ona_agenda').then((sources) => {
			if (sources) {
				this.odooServ.getMyMeetings(JSON.parse(sources), tab_ids).then((res) => {
					let events;
					this.objLoader = false;
					this.meetings = this.loadAgendaFromServer(res);
					events = this.loadHearingInCalendar();

					this.eventSource = [];
					setTimeout(() => {
						this.eventSource = events;
					});
				});
			}
		});
	}

	helpMe() {
		this.odooServ.showMsgWithButton(this.txtLangue.txt_help, 'top');
	}
}
