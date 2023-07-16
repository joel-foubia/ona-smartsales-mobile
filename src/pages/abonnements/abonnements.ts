import { Component, ViewChild } from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	LoadingController,
	AlertController,
	ActionSheetController,
	ModalController,
	MenuController,
	PopoverController,
	Events,
	Content,
	FabButton
} from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { ConfigSync, ConfigOnglet } from '../../config';
import { Subscription } from '../../models/sub';
import * as moment from 'moment';

@IonicPage()
@Component({
	selector: 'page-abonnements',
	templateUrl: 'abonnements.html'
})
export class AbonnementsPage {
	last_date = null;
	client: any;
	txtlang: any;
	display: boolean;
	checkSync: number;
	user: any;
	objLoader: boolean;
	the_partner: any;
	current_lang: string;
	dumpData = [];
	subcriptions = [];
	time_state;
	txtFiltre = [];
	filtered: boolean;
	max: number;
	display_search: boolean = false;
	showQuickFilter: boolean = false;
	colorFilterBtn: string = 'gris';
	searchBtnColor: string = 'light';
	@ViewChild(Content) content: Content;
	@ViewChild(FabButton) fabButton: FabButton;
	eventsBinding;
	filtres = [];
	objFiltre = [];
	filter_years = [];
	current_year;

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
		private translate: TranslateService
	) {

		//On configure la vue en fonction du partner
		this.current_lang = localStorage.getItem('current_lang');
		this.the_partner = 'sub';
		this.objLoader = true;
		this.translate.get('pop').subscribe((res) => {
			this.txtlang = res;
		});

		if (navParams.get('subs_list') != undefined) {
			this.subcriptions = this.listSubscriptions(navParams.get('subs_list'));
			this.dumpData = this.listSubscriptions(navParams.get('subs_list'));
		} else {
			this.syncOffOnline();
		}

		//on vérifie si on a accès à la bd
		// On récupère les paramètres login
		this.lgService.isTable('me_avocat').then((res) => {
			this.checkSync = setInterval(() => this.activateSyn(), ConfigSync.timeSync);
		});

		this.lgService.formatDate('_ona_' + this.the_partner).then((_date) => {
			this.last_date = _date;
		});

		this.eventsBinding = {
			onView: function(event: any) {
				navCtrl.push('DetailAbonnementPage', { sub: event.subscription });
			},
			onResubscribe: function(event: any) {}
		};

		this.filtres = ConfigOnglet.subInvoice(this.txtlang);
		this.filter_years = ConfigOnglet.filterYears(this.txtlang);
	}

	/**
	 * Cette méthode permet de filtrer les Factures
	 * en fonction des groupes team, ou stage
	 * @param stage JSONObject, le stage selectionné
	 */
	filterbyObjets(objet, type) {
		objet.selected = !objet.selected;
		this.resetObjets(objet, type);
		let objFil;

		if (type == 'year') {
			this.current_year = objet.id;
		}

		if (this.current_year == 'all') {
			objFil = { id: 'all_years', val: objet.id };
		} else {
			objFil = { id: type, val: objet.id };
		}

		this.filterListPartners([ objFil ]);
	}

	/**
	 * Permet à l'utilisateur de 
	 * @param objet JSONObject
	 * @param type string, le type de groupe
	 */
	private resetObjets(objet, type, options?: any) {
		if (type == 'year') {
			for (let i = 0; i < this.filter_years.length; i++) {
				if (this.filter_years[i].id != objet.id) this.filter_years[i].selected = false;

				if (options) this.filter_years[i].selected = false;
			}
		}
	}

	ionViewDidLeave() {
		clearInterval(this.checkSync);
		/* 	this.events.unsubscribe('client:changed');
		this.events.unsubscribe('add_client:changed'); */
	}

	//On synchronise les données de la bd interne avec
	//celle du serveur
	synchronizing() {
		this.display = true;
		this.setListPartners();
	}

	getDates() {
		for (let i = 0; i < this.subcriptions.length; i++) {
			this.subcriptions[i].time_used =
				moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').diff(
					moment(this.subcriptions[i].date_start),
					'days'
				) *
				100 /
				moment(moment(this.subcriptions[i].recurring_next_date), 'YYYY-MM-DD').diff(
					moment(this.subcriptions[i].date_start),
					'days'
				);
			this.subcriptions[i].time_left =
				moment(moment(this.subcriptions[i].recurring_next_date), 'YYYY-MM-DD').diff(
					moment(this.subcriptions[i].date_start),
					'days'
				) -
				moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').diff(
					moment(this.subcriptions[i].date_start),
					'days'
				);
			if (this.subcriptions[i].time_used > 70) {
				this.subcriptions[i].time_state = 'ios-alert';
			} else if (this.subcriptions[i].time_used < 70) {
				this.subcriptions[i].time_state = 'md-checkmark-circle-outline';
			}
			/* 
			if (this.subcriptions[i].time_used >= 100) {
				this.subcriptions.splice(i, 1);
			} */
			// this.subcriptions[0].time_used = 80;
		}
	}

	cancelFilter() {
		this.syncOffOnline();
		this.filtered = false;
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
	 * Cette méthode permet de filtrer 
	 * la lsite des prospects en fonction des filtres
	 * 
	 * @param item JSON object, un filtre
	 */
	onQuickFilter(item, i) {
		if (item.slug == 'all') {
			this.objFiltre = [];
			this.showQuickFilter = false;
			this.content.resize();
			this.colorFilterBtn = 'gris';
		} else {
			if (!item.selected) {
				item['selected'] = true;
				this.objFiltre = [ item ];
				this.txtFiltre = [ item ];
			} else {
				item['selected'] = false;
				for (let j = 0; j < this.objFiltre.length; j++) {
					if (this.objFiltre[j].slug == item.slug) {
						this.objFiltre.splice(j, 1);
						break;
					}
				}
			}
			for (let j = 0; j < this.filtres.length; j++) {
				if (this.filtres[j].id != item.id) {
					this.filtres[j].selected = false;
				}
			}
		}
		this.filterListPartners(this.objFiltre);
		this.max = 10;
	}

	setFilteredItems(ev) {
		if (ev.target.value === undefined) {
			this.subcriptions = this.dumpData;
			this.max = 10;
			return;
		}

		var val = ev.target.value;

		if (val != '' && val.length > 2) {
			this.subcriptions = this.dumpData.filter((item) => {
				let txtNom = item.name + ' ' + item.partner_id.name;
				return txtNom.toLowerCase().indexOf(val.toLowerCase()) > -1;
			});
		} else if (val == '' || val == undefined) {
			this.subcriptions = this.dumpData;
			this.max = 10;
		}
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
						this.subcriptions = this.listSubscriptions(JSON.parse(result));
						console.log('Subscriptions => ', this.subcriptions);
						this.getDates();
						this.dumpData = this.subcriptions;
					}

					this.objLoader = false;
				});

				//SYnc de la liste depuis le serveur
				if (res == 'w' || res == 'rw') {
					// this.objLoader = false;
					this.setListPartners();
				}
			}
		});
	}

	/**
	 * Cette méthode permet de filtrer les abonnements
	 * en fonction du client
	 * @param subs Array<Subscription> liste des abonnements
	 * @returns Array<Subscription>
	 */
	listSubscriptions(subs: Array<Subscription>) {
		let result = [];

		if (this.navParams.get('client') === undefined) {
			for (let k = 0; k < subs.length; k++) {
				var time_used =
					moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').diff(moment(subs[k].date_start), 'days') *
					100 /
					moment(moment(subs[k].recurring_next_date), 'YYYY-MM-DD').diff(moment(subs[k].date_start), 'days');

				if (time_used < 100) {
					result.push(subs[k]);
				}
			}
		} else {
			
			this.client = this.navParams.get('client');
			for (let j = 0; j < subs.length; j++) {
				var time_used =
					moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').diff(moment(subs[j].date_start), 'days') *
					100 /
					moment(moment(subs[j].recurring_next_date), 'YYYY-MM-DD').diff(moment(subs[j].date_start), 'days');
				if (subs[j].partner_id.id == this.client.id && time_used < 100) {
					result.push(subs[j]);
				}
			}
		}

		return result;
	}

	/**
	 * Cette fonction permet de rafraichir la page
	 * notamment utilisé dans le cas des procédures de synchronisation
	 * @param refresher any
	 */
	doRefresh(refresher) {
		// this.setListPartners(refresher);
		this.syncOffOnline();
		// refresher.complete();
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
   * Cette fonction permet de charger la liste
   * des partenaires (clients, tribunaux, contacts)
   * @param isManual any, il s'agit de l'objet Refresh (ion-refresh)
   *
   **/
	setListPartners(isManual?: any) {
		// let params = { options: { offset: 0, max: this.max } };
		this.odooService.requestObjectToOdoo(
			this.the_partner,
			null,
			this.last_date,
			false,
			(res) => {
				let fromServ = this.loadPartnerFromServer(res);

				this.odooService.refreshViewList('_ona_' + this.the_partner, fromServ).then((rep: any) => {
					if (this.display || isManual !== undefined) {
						this.subcriptions = this.listSubscriptions(rep);
						this.getDates();
						this.dumpData = this.subcriptions;
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
			let objPartner = new Subscription(tab[i]);
			result.push(objPartner);
		}

		return result;
	}

	openLeftMenu() {
		this.menuCtrl.open();
	}

	onFilter(theEvent) {
		let popover = this.popCtrl.create(
			'ProdFilterPopupPage',
			{ model: this.the_partner, lang: this.txtlang, currency: 'EUR', sub: true },
			{ cssClass: 'catalogue-popover' }
		);
		popover.present({ ev: theEvent });

		popover.onDidDismiss((result) => {
			if (result) {
				this.txtFiltre = result;
				console.log('Filter Received => ', this.txtFiltre);
				this.filtered = true;
				this.filterListPartners(result);
			}
		});
	}

	openDetails(sub) {
		this.navCtrl.push('DetailAbonnementPage', { sub: sub });
	}

	filterListPartners(result) {
		console.log('objFiltre ', result);

		// this.max = 10;
		let resultats = [];

		for (let i = 0; i < this.dumpData.length; i++) {
			if (this.applyFilterPartner(result, this.dumpData[i])) resultats.push(this.dumpData[i]);
		}

		this.subcriptions = resultats;

		this.getDates();
	}

	//Permet d'appliquer les filtres sur la liste des clients
	applyFilterPartner(searchs, objet) {
		let cpt = 0;
		var today = moment().format('YYYY-MM-DD').toString();
		var start = moment(objet.date_start, 'YYYY-MM-DD').format('YYYY-MM-DD').toString();
		var end = moment(objet.recurring_next_date, 'YYYY-MM-DD').format('YYYY-MM-DD').toString();

		for (let j = 0; j < searchs.length; j++) {
			switch (searchs[j].id) {
				case 'draft': {
					//Nouveau
					if (objet.state == 'draft') {
						cpt++;
					}
					break;
				}
				case 'open': {
					//En Cours
					if (objet.state == 'open') {
						cpt++;
					}
					break;
				}
				case 'pending': {
					//A Renouveler
					if (objet.state == 'pending') {
						cpt++;
					}
					break;
				}
				case 'closed': {
					//Ferme
					if (objet.state == 'closed') {
						cpt++;
					}
					break;
				}
				case 'canceled': {
					//Annuler
					if (objet.state == 'canceled') {
						cpt++;
					}
					break;
				}
				case 'expired': {
					//Expire
					if (moment(start).isValid() && moment(end).isValid()) {
						if (moment(today).isAfter(moment(end))) {
							cpt++;
						}
					}
					break;
				}
				case 'year': {
					//par date
					if (new Date(objet.date_start).getFullYear() == searchs[j].val) {
						cpt++;
					}
					break;
				}
				case 'all_years': {
					//par date

					cpt++;

					break;
				}
				case 'will_expire': {
					//Wil Expire
					if (moment(start).isValid() && moment(end).isValid()) {
						if (
							moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').diff(moment(objet.date_start), 'days') *
								100 /
								moment(moment(objet.recurring_next_date), 'YYYY-MM-DD').diff(
									moment(objet.date_start),
									'days'
								) >
								80 &&
							moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').diff(moment(objet.date_start), 'days') *
								100 /
								moment(moment(objet.recurring_next_date), 'YYYY-MM-DD').diff(
									moment(objet.date_start),
									'days'
								) <
								100
						) {
							cpt++;
						}
					}
					break;
				}
				case 'all': {
					//Tout
					// this.syncOffOnline();
					cpt++;
					break;
				}
			}
		} //Fin tab searchs

		if (cpt == searchs.length) return true;
		else return false;
	}

	ionViewDidLoad() {

	}
	
	resubscribe(sub) {}
}
