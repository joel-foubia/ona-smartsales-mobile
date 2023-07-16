import { Component, ViewChild } from '@angular/core';
import {
	NavController,
	NavParams,
	Events,
	MenuController,
	IonicPage,
	ActionSheetController,
	ActionSheet,
	ModalController,
	LoadingController
} from 'ionic-angular';
import { GeneralProvider } from '../../providers/general/general';
import { LoginProvider } from '../../providers/login/login';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginPage } from '../login/login';
import * as moment from 'moment';
// import { Chart } from 'chart.js';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
	selector: 'page-main',
	templateUrl: 'main.html'
})
export class MainPage {
	objTeamCanvas: any;
	is_manager: boolean;
	txtTime: string;
	@ViewChild('barCanvas') barCanvas;
	@ViewChild('barCanvasLarge') barCanvasLarge;
	@ViewChild('lineCanvas') lineCanvas;
	@ViewChild('teamCanvas') teamCanvas;

	private meetings_today_ids = [];
	private meetings_ids = [];
	private invoice_ids = [];
	private calls_ids = [];
	private calls_today_ids = [];
	private opport_color = 'rgba(176, 121, 19, 1)';
	private opport_color_light = 'rgba(176, 121, 19, 0.7)';
	private invoice_color = 'rgba(130, 177, 74, 1)';
	private invoice_color_light = 'rgba(130, 177, 74, 0.7)';

	barChart: any;
	lineChart: any;
	current_lang: string;
	params: any = { data: {}, events: {} };
	public user;
	public avocat;
	// menus: any;
	displayMenu: boolean;
	// mytotalCalls;
	todaysCalss;
	total_won;
	total_invoice;
	meetings_over = [];
	callsover = [];
	next_actions = [];
	activities = [];
	products = [];
	mood: string;
	last_month_total;
	months: string[];
	last_month_total_won;
	weeks = [ 0, 0, 0, 0 ];
	current_date: number;
	last_month;
	refreshing: boolean;
	menu_actionSheet: ActionSheet;
	menu_slide_display: boolean;
	allMenus = [];
	activities_ids = [];
	leads_ids: any[];
	type;
	txtLangue;
	subs = [];
	leads = [];
	devis = [];
	eventsBinding;
	devisEventsBinding;
	eventsSubsBinding;
	eventsProdsBinding;
	barChartLarge: any;
	monthsLarge = [];
	barChartLargeDataSet = [];
	purchaseLines = [];
	sales_teams = [];
	users = [];
	regions = [];
	dumpleads = [];
	period_type: string;
	selected_team_name = 'Choisir une equipe de vente';
	selected_user_name = 'Choisir un commercial';

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public actionCtrl: ActionSheetController,
		public serviceMenu: GeneralProvider,
		private lgService: LoginProvider,
		public evEVT: Events,
		private odooServ: OdooProvider,
		public menuCtrl: MenuController,
		public storage: Storage,
		public translate: TranslateService,
		public modalCtrl: ModalController,
		public loadCtrl: LoadingController
	) {
		this.translate.get([ 'pop', 'menu', 'module' ]).subscribe((res) => {
			this.txtLangue = res;
		});
		this.period_type = this.txtLangue.pop.monthly;
		this.current_lang = this.translate.getDefaultLang();
		// console.log('Defaukt lang : ', this.current_lang);

		this.lgService.isTable('setting').then((data) => {
			let ocrObject = {
				active : true,
				component : 'extract',
				css : 'assets/images/extract.png',
				id : 'ocr',
				package : 'standart',
				slug : '',
				title : {
					en : "Extraire texte",
					fr : "Extract text"
				}
			}
			console.log('ocrObject => ', ocrObject);
			// JSON.parse(data).modules.push(ocrObject);
			console.log('data => ', JSON.parse(data));
			if (data) {
				let modules = JSON.parse(data).modules;
				console.log('Module => ', modules);

				this.storage.get('_ona_modules').then((res) => {
					// console.log('res => ', JSON.parse(res));
					this.allMenus = modules;

					//On met à jour la table modules si l'utilisateur a sollicité un nouveau module
					this.storage.set('_ona_modules', JSON.stringify(this.allMenus)).then(() => {
						this.evEVT.publish('setting:available', this.allMenus);
					});
				});
			}
		});

		this.current_date = Date.now();
		console.log(this.current_date);
		this.last_month = new Date(new Date().getTime() - 32 * 24 * 60 * 60 * 1000);

		//linked Events
		this.bindEvents();

		this.eventsSubsBinding = {
			onView: function(event: any) {
				navCtrl.push('DetailAbonnementPage', { sub: event.subscription });
			},
			onResubscribe: function(event: any) {}
		};
	}

	getDates(subcriptions) {
		for (let i = 0; i < subcriptions.length; i++) {
			subcriptions[i].time_used =
				moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').diff(moment(subcriptions[i].date_start), 'days') *
				100 /
				moment(moment(subcriptions[i].recurring_next_date), 'YYYY-MM-DD').diff(
					moment(subcriptions[i].date_start),
					'days'
				);
			subcriptions[i].time_left =
				moment(moment(subcriptions[i].recurring_next_date), 'YYYY-MM-DD').diff(
					moment(subcriptions[i].date_start),
					'days'
				) -
				moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').diff(moment(subcriptions[i].date_start), 'days');
			if (subcriptions[i].time_used > 70) {
				subcriptions[i].time_state = 'ios-alert';
			} else if (subcriptions[i].time_used < 70) {
				subcriptions[i].time_state = 'md-checkmark-circle-outline';
			}
			// this.subcriptions[0].time_used = 80;
		}
	}

	//Method used to welcome user
	salutation() {
		let today = new Date();
		// console.log(today.getHours());
		if (today.getHours() >= 0 && today.getHours() < 18) this.txtTime = 'jour';
		else if (today.getHours() >= 18 && today.getHours() <= 23) this.txtTime = 'soir';
	}

	onViewTeamCA() {
		let buttons = [];

		for (let k = 0; k < this.objTeamCanvas.teams.length; k++) {
			buttons.push({
				text: this.objTeamCanvas.teams[k].team.name,
				cssClass: 'icon icon-account-multiple',
				handler: () => {
					this.selected_team_name = this.objTeamCanvas.teams[k].team.name;
					setTimeout(() => {
						this.navCtrl.push('GraphViewPage', {
							graphType: 'team',
							'team': this.objTeamCanvas.teams[k]
						});
					}, 50);
				}
			});
		}
		let prod_sheet = this.actionCtrl.create({
			title: this.txtLangue.pop.region_filter_title,
			cssClass: 'product-action-sheets',
			buttons: buttons
		});

		prod_sheet.present();
	}
	onViewUserCA() {
		let buttons = [];

		for (let k = 0; k < this.objTeamCanvas.users.length; k++) {
			buttons.push({
				text: this.objTeamCanvas.users[k].user.display_name,
				cssClass: 'icon icon-account',
				handler: () => {
					this.selected_user_name = this.objTeamCanvas.users[k].user.display_name;
					setTimeout(() => {
						this.navCtrl.push('GraphViewPage', {
							graphType: 'user',
							'commercial': this.objTeamCanvas.users[k]
						});
					}, 50);
				}
			});
		}
		let prod_sheet = this.actionCtrl.create({
			title: this.txtLangue.pop.region_filter_title,
			cssClass: 'product-action-sheets',
			buttons: buttons
		});

		prod_sheet.present();
	}

	listChilds(model) {
		this.lgService.isTable('_ona_' + model).then((data) => {
			if (data) {
				let result = JSON.parse(data);
				if (model == 'leads') {
					console.log('leads ', result);
					this.dumpleads = result;
					for (let i = 0; i < result.length; i++) {
						if (this.user.id == result[i].user_id.id) {
							this.leads.push(result[i]);
						}
					}
				} else if (model == 'purchase_line') {
					this.purchaseLines = result;
				} else if (model == 'team') {
					this.sales_teams = result;
				} else if (model == 'user') {
					this.users = result;
					for (let k = 0; k < this.users.length; k++) {
						if (this.regions.indexOf(this.users[k].city) < 0 && this.users[k].city != '') {
							this.regions.push(this.users[k].city);
						}
					}
					console.log('Users ', this.users);
					console.log('City ', this.regions);
				} else if (model == 'vente') {
					for (let k = 0; k < result.length; k++) {
						if (
							result[k].state == 'draft' &&
							new Date(result[k].create_date).getMonth() == new Date().getMonth()
						) {
							this.devis.push(result[k]);
						}
					}
				} else if (model == 'produit') {
					var prod_ids = [];
					for (let k = 0; k < result.length; k++) {
						prod_ids.push(result[k].id);
					}

					for (let i = 0; i < this.purchaseLines.length; i++) {
						if (prod_ids.indexOf(this.purchaseLines[i].product_id.id) > -1) {
							this.products.push(result[prod_ids.indexOf(this.purchaseLines[i].product_id.id)]);
						}
					}
				} else {
					this.getDates(result);
					for (let j = 0; j < result.length; j++) {
						if (result[j].time_used >= 80 && result[j].time_used < 100) {
							this.subs.push(result[j]);
						}
					}
				}
			}

			// console.log('Leads ', this.leads);
			// console.log('Sales ', this.devis);
			// console.log('Subs ', this.subs);
		});
	}

	/**
	 * @author Landry Fongang (mr_madcoder_fil)
	 * Method to reload main page using local database
	 */
	reloadPage() {
		this.refreshing = true;
		this.calls_today_ids = [];
		this.calls_ids = [];
		this.meetings_ids = [];
		this.meetings_today_ids = [];
		this.meetings_over = [];

		this.getUsercalls();
		this.getUserMeetings();
		// this.getusersMail();

		this.getOpportSum();
		this.getWeekOpports();
		this.getInvoices();

		if (localStorage.getItem('manager') == 'admin') {
			this.lgService.getTeamsCA(this.teamCanvas, this.txtLangue.pop).then((res: any) => {
				this.objTeamCanvas = res;
				this.lgService.loadProdNonGradientLinearChart(
					this.teamCanvas,
					this.txtLangue.pop,
					res.color,
					res.tabs,
					res.labels,
					res.label_txt
				);
			});
		}

		this.refreshing = false;
	}

	filterCARegion() {
		let buttons = [];

		for (let k = 0; k < this.regions.length; k++) {
			buttons.push({
				text: this.regions[k],
				cssClass: 'icon icon-earth',
				handler: () => {
					this.navCtrl.push('GraphViewPage', {
						region: this.regions[k],
						commercials: this.users,
						leads: this.dumpleads,
						teams: this.sales_teams,
						graphType: 'region'
					});
				}
			});
		}
		let prod_sheet = this.actionCtrl.create({
			title: this.txtLangue.pop.region_filter_title,
			cssClass: 'product-action-sheets',
			buttons: buttons
		});

		prod_sheet.present();
	}

	filterCAPeriod() {
		let buttons = [];

		buttons.push({
			text: this.txtLangue.pop.monthly,
			cssClass: 'icon icon-clock',
			handler: () => {
				this.period_type = this.txtLangue.pop.monthly;
				this.lgService.getTeamsCA('month', this.txtLangue.pop).then((res: any) => {
					this.objTeamCanvas = res;
					this.lgService.loadProdNonGradientLinearChart(
						this.teamCanvas,
						this.txtLangue.pop,
						res.color,
						res.tabs,
						res.labels,
						res.label_txt
					);
				});
			}
		});
		buttons.push({
			text: this.txtLangue.pop.year,
			cssClass: 'icon icon-clock',
			handler: () => {
				this.period_type = this.txtLangue.pop.year;
				this.lgService.getTeamsCA('year', this.txtLangue.pop).then((res: any) => {
					this.objTeamCanvas = res;
					this.lgService.loadProdNonGradientLinearChart(
						this.teamCanvas,
						this.txtLangue.pop,
						res.color,
						res.days,
						res.labels,
						res.label_txt
					);
				});
			}
		});

		let prod_sheet = this.actionCtrl.create({
			title: this.txtLangue.pop.period_filter_title,
			cssClass: 'product-action-sheets',
			buttons: buttons
		});

		prod_sheet.present();
	}

	/**
	 * Method to calculate each weeks won opports for a particular month 
	 */
	getWeekOpports() {
		this.lgService.isTable('_ona_leads').then((leads) => {
			// console.log('Leads =>', JSON.parse(leads));

			if (leads) {
				var week1 = 0;
				var week2 = 0;
				var week3 = 0;
				var week4 = 0;

				// console.log("ready for graph");
				let list_leads = JSON.parse(leads);

				for (let k = 0; k < list_leads.length; k++) {
					var yr = new Date().getFullYear();
					var month = new Date().getMonth();

					if (
						list_leads[k].user_id.id == this.user.id &&
						(new Date(list_leads[k].date_open) >= new Date(yr, month, 1) &&
							new Date(list_leads[k].date_open) <= new Date(yr, month, 7)) &&
						list_leads[k].probability == 100
					) {
						if (
							list_leads[k].planned_revenue != '' &&
							list_leads[k].planned_revenue != undefined &&
							list_leads[k].planned_revenue != null
						) {
							week1 = week1 + list_leads[k].planned_revenue;
						}
					}
					if (
						list_leads[k].user_id.id == this.user.id &&
						(new Date(list_leads[k].date_open) >= new Date(yr, month, 8) &&
							new Date(list_leads[k].date_open) <= new Date(yr, month, 14)) &&
						list_leads[k].probability == 100
					) {
						if (
							list_leads[k].planned_revenue != '' &&
							list_leads[k].planned_revenue != undefined &&
							list_leads[k].planned_revenue != null
						) {
							week2 = week2 + list_leads[k].planned_revenue;
						}
					}
					if (
						list_leads[k].user_id.id == this.user.id &&
						(new Date(list_leads[k].date_open) >= new Date(yr, month, 15) &&
							new Date(list_leads[k].date_open) <= new Date(yr, month, 21)) &&
						list_leads[k].probability == 100
					) {
						if (
							list_leads[k].planned_revenue != '' &&
							list_leads[k].planned_revenue != undefined &&
							list_leads[k].planned_revenue != null
						) {
							week3 = week3 + list_leads[k].planned_revenue;
						}
					}
					if (
						list_leads[k].user_id.id == this.user.id &&
						(new Date(list_leads[k].date_open) >= new Date(yr, month, 21) &&
							new Date(list_leads[k].date_open) <= new Date(yr, month + 1, 0)) &&
						list_leads[k].stage_id.probability == 100
					) {
						if (
							list_leads[k].planned_revenue != '' &&
							list_leads[k].planned_revenue != undefined &&
							list_leads[k].planned_revenue != null
						) {
							week4 = week4 + list_leads[k].planned_revenue;
						}
					}
				}

				this.weeks[0] = week1;
				this.weeks[1] = week2;
				this.weeks[2] = week3;
				this.weeks[4] = week4;
				var canvas = <HTMLCanvasElement>document.getElementById('bar-canvas');
				var ctx = canvas.getContext('2d');
				//Chargement du graphe sur les prospects
				this.lineChart = this.lgService.loadLinearChart(ctx, this.txtLangue.pop, this.opport_color, this.weeks);

				//On récupère le tableau des montants sur prospects gagnées (3 last months)
				this.barChartLargeDataSet = this.lgService.getLastMonthsInvoices(list_leads, this.user);

				//On affiche le graphe sur les prospects gagnés suivant les 3 derniers mois
				this.barChartLarge = this.lgService.loadLastMonthsBarChart(
					this.barCanvasLarge,
					this.monthsLarge,
					this.txtLangue.pop,
					this.barChartLargeDataSet,
					this.opport_color,
					this.opport_color_light,
					'bar'
				);

				// console.log("Yes Im ready !")
			}
		});
	}

	/**
	 * Method to get users Inoiced amount for the last and current month
	 */
	getInvoices() {
		this.lgService.isTable('_ona_invoice').then((invoice) => {
			// console.log('Invoices => ', JSON.parse(invoice));
			if (invoice) {
				let tot_invoice = 0,
					listInvoices = JSON.parse(invoice);
				let last_month_invoice = 0;
				this.months = [ moment().subtract(1, 'M').format('MMMMM'), moment().format('MMMMM') ];
				this.monthsLarge = [
					this.lgService.getMonthName(2),
					this.lgService.getMonthName(1),
					this.lgService.getMonthName(0)
				];

				for (let i = 0; i < listInvoices.length; i++) {
					var date = moment(listInvoices[i].date_invoice);
					var last_month = moment(listInvoices[i].date_invoice);
					date.add(1, 'M');

					//On récupère les factures du mois en cours
					if (this.lgService.valideDate(listInvoices[i].date_invoice)) {
						if (
							(listInvoices[i].state == 'open' || listInvoices[i].state == 'draft') &&
							listInvoices[i].user_id.id == this.user.id &&
							this.lgService.dateBetween(listInvoices[i].date_invoice)
						) {
							tot_invoice = tot_invoice + listInvoices[i].amount_total;
							this.invoice_ids.push(listInvoices[i].id);
						}
					}

					if (
						moment(
							last_month.year().toString() + '-' + last_month.month().toString() + '-01',
							'YYYY-MM-DD'
						).isValid() &&
						moment(
							last_month.year().toString() +
								'-' +
								last_month.month().toString() +
								'-' +
								last_month.daysInMonth().toString(),
							'YYYY-MM-DD'
						).isValid()
					) {
						if (
							(listInvoices[i].state == 'open' || listInvoices[i].state == 'draft') &&
							listInvoices[i].user_id.id == this.user.id &&
							moment(moment().format('YYYY-MM-DD').toString()).isBetween(
								moment(
									last_month.year().toString() + '-' + last_month.month().toString() + '-01',
									'YYYY-MM-DD'
								)
									.format('YYYY-MM-DD')
									.toString(),
								moment(
									last_month.year().toString() +
										'-' +
										last_month.month().toString() +
										'-' +
										last_month.daysInMonth().toString(),
									'YYYY-MM-DD'
								)
									.format('YYYY-MM-DD')
									.toString(),
								null,
								'[]'
							)
						) {
							last_month_invoice = last_month_invoice + listInvoices[i].amount_total;
						}
					}
				}

				this.total_invoice = tot_invoice;
				this.last_month_total = last_month_invoice;
				this.refreshing = false;

				//On charge les factures dans le graphe
				this.barChart = this.lgService.loadbarChart(
					this.barCanvas,
					this.months,
					this.txtLangue.pop,
					this.invoice_color,
					this.invoice_color_light,
					this.last_month_total,
					this.total_invoice
				);
			}
		});
	}

	/**
	 * Method to get users won opportunities amount for the current month
	 */
	getOpportSum() {
		this.lgService.isTable('_ona_leads').then((leads) => {
			if (leads) {
				var total = 0;
				var last_month_total = 0;
				let list_leads = JSON.parse(leads);

				for (let k = 0; k < list_leads.length; k++) {
					var date = moment(list_leads[k].date_open);
					var last_month = moment(list_leads[k].date_open);
					date.add(1, 'M');

					if (
						list_leads[k].user_id.id == this.user.id &&
						this.lgService.dateBetween(list_leads[k].date_open) &&
						list_leads[k].probability == 100
					) {
						if (
							list_leads[k].planned_revenue != '' &&
							list_leads[k].planned_revenue != undefined &&
							list_leads[k].planned_revenue != null
						) {
							total = total + list_leads[k].planned_revenue;
						}
					}

					if (
						list_leads[k].user_id.id == this.user.id &&
						this.lgService.dateBetweenLastMonth(list_leads[k].date_open) &&
						list_leads[k].probability == 100
					) {
						if (
							list_leads[k].planned_revenue != '' &&
							list_leads[k].planned_revenue != undefined &&
							list_leads[k].planned_revenue != null
						) {
							last_month_total = last_month_total + list_leads[k].planned_revenue;
						}
					}
				}

				this.total_won = total;
				this.last_month_total_won = last_month_total;
				if (this.total_won / this.user.target_sales_won < 0.5) {
					this.mood = 'assets/svg/mad.svg';
				} else if (
					this.total_won / this.user.target_sales_won > 0.5 &&
					this.total_won / this.user.target_sales_won < 0.8
				) {
					this.mood = 'assets/svg/happy.svg';
				} else if (this.total_won / this.user.target_sales_won > 0.8) {
					this.mood = 'assets/svg/rich.svg';
				} else {
					this.mood = 'assets/svg/mad.svg';
				}

				//Get activities of user
				this.getusersMail(list_leads);
			}
		});
	}

	/**
	 * Method to get users meetings number for the current day
	 */
	getUserMeetings() {
		this.lgService.isTable('_ona_agenda').then((agenda) => {
			if (agenda) {
				let list_meetings = JSON.parse(agenda);

				let total_meetings = [];
				let todays_meetings = [];
				let meetings_over = [];

				for (let i = 0; i < list_meetings.length; i++) {
					var mydate;

					if (list_meetings[i].allday) mydate = list_meetings[i].start_date;
					else mydate = list_meetings[i].start_datetime;

					var partners = [];
					partners = list_meetings[i].partner_ids;

					if (this.lgService.valideDate(mydate)) {
						//Nombre de meetings du mois
						if (partners.indexOf(this.user.partner_id.id) >= 0 && this.lgService.dateBetween(mydate)) {
							// total_meetings.push(list_meetings[i]);
							this.meetings_ids.push(list_meetings[i].id);
						}
					}

					//Nombre de meetings of today
					if (this.lgService.theSameDate(mydate) && partners.indexOf(this.user.partner_id.id) >= 0) {
						this.meetings_today_ids.push(list_meetings[i].id);
						if (new Date() > new Date(mydate)) {
							meetings_over.push(list_meetings[i]);
						}
					}
				}

				// this.user_total_meetings = total_meetings;
				// this.user_todays_meetings = todays_meetings;
				this.meetings_over = meetings_over;
			}
		});
	}

	/**
	 * Method to get next actions
	 */
	getNextActions(leads: Array<any>) {
		this.next_actions = [];
		this.leads_ids = [];

		for (let k = 0; k < leads.length; k++) {
			this.leads_ids.push(leads[k].id);
		}

		for (let k = 0; k < this.activities.length; k++) {
			var nextActions = [];
			if (
				this.leads_ids.indexOf(this.activities[k].id) > -1 &&
				this.lgService.sameDate(leads[k].date_action) &&
				leads[k].user_id.id == this.user.id
			) {
				nextActions.push(leads[k]);
			}
			this.activities[k].items = nextActions;
		}

		//On construit le tableau des actions
		for (let k = 0, i = -1; k < this.activities.length; k++) {
			if (k % 2 === 0) {
				i++;
				this.next_actions[i] = [];
			}
			this.next_actions[i].push(this.activities[k]);
		}
	}

	//Cette méthode permet de récupérer la liste
	//des actions
	getusersMail(leads: Array<any>) {
		this.activities = [];
		this.activities_ids = [];
		this.lgService.isTable('_ona_activite').then((activity) => {
			if (activity) {
				let list_acts = JSON.parse(activity);
				for (let i = 0; i < list_acts.length; i++) {
					var activs = {
						name: '',
						id: 0,
						slug: '',
						items: []
					};

					activs.name = list_acts[i].me.name.me;
					activs.slug = list_acts[i].me.name.me;
					activs.id = list_acts[i].me.id.me;

					this.activities.push(activs);
					this.activities_ids.push(activs.id);
				}

				this.getNextActions(leads);
				console.log('Activities length => ', this.activities_ids);
			} else {
			}
		});
	}

	/**
	 * method to get the current users calls for the day
	 */
	getUsercalls() {
		this.lgService.isTable('_ona_call').then((calls) => {
			// console.log('Calls => ', JSON.parse(calls));
			if (calls) {
				let list_calls = JSON.parse(calls);

				let todayscalls = [];
				let callsover = [];

				for (let i = 0; i < list_calls.length; i++) {
					//On récupère le nombre de total de d'appels mensuel
					if (this.lgService.valideDate(list_calls[i].date)) {
						if (
							list_calls[i].user_id.id == this.user.id &&
							this.lgService.dateBetween(list_calls[i].date)
						) {
							this.calls_ids.push(list_calls[i].id);
						}
					}

					//On crécupère les appels à effectuer aujourd'hui
					if (
						this.lgService.theSameDate(list_calls[i].date) &&
						list_calls[i].user_id.id == this.user.id &&
						list_calls[i].state == 'open'
					) {
						todayscalls.push(list_calls[i]);
						this.calls_today_ids.push(list_calls[i].id);

						if (new Date() > new Date(list_calls[i].date)) {
							// console.log('date passed');
							callsover.push(list_calls[i].date);
						}
					}
				}

				// console.log(this.calls_ids);
				this.todaysCalss = todayscalls;
				this.callsover = callsover;
			}
		});
	}

	onSwipeUp(ev) {
		this.showMenu();
		// console.log('Event ', ev);
	}
	onSwipeDown(ev) {
		// console.log('Event ', ev);
	}

	ionViewDidLoad() {
		this.lgService.isTable('me_avocat').then((data) => {
			if (data) {
				this.user = JSON.parse(data);
				this.salutation();

				// console.log(this.user);
				this.getSetting();
				this.odooServ.getAccessOfUser(this.user).then((_res) => {
					this.checkManager(_res);
					this.is_manager = true;
					/* 
					this.lgService.getTeamsCA('year', this.txtLangue.pop).then((result) => {
						console.log('My data ', result);
					}); */

					// this.evEVT.publish("is_manager", {manager: 1});
					this.lgService.getTeamsCA('month', this.txtLangue.pop).then((res: any) => {
						this.objTeamCanvas = res;
						console.log('team canvas ', this.objTeamCanvas);
						this.lgService.loadProdNonGradientLinearChart(
							this.teamCanvas,
							this.txtLangue.pop,
							res.color,
							res.tabs,
							res.labels,
							res.label_txt
						);
					});
				});

				this.getWeekOpports();
				this.getInvoices();

				this.getOpportSum();
				this.getUsercalls();
				this.getUserMeetings();

				// if(localStorage.getItem('manager')=="admin"){
				// }

				setTimeout(() => {
					this.listChilds('purchase_line');
				}, 1000);

				setTimeout(() => {
					this.listChilds('leads');
					this.listChilds('vente');
					this.listChilds('sub');
					this.listChilds('produit');
					this.listChilds('user');
					this.listChilds('team');
				}, 2000);
			}
		});
	}

	itemTapped(event, item) {
		//console.log('Item', item)
		this.navCtrl.push(item.component, { partner: item.slug, titre: item.title });
	}

	private getSetting() {
		this.lgService.getSettingUser().then((data) => {
			if (data) {
				//console.log(data);
				let organe = JSON.parse(data);
				this.avocat = {
					img: organe.logo,
					nom: organe.customer,
					user: this.user
				};
				this.evEVT.publish('avocat:changed', this.avocat);
			}
		});
	}

	/**
	 * Cette fonction permet de vérifier si l'utilisateur
	 * connecté est un manager
	 * @param data any 
	 */
	private checkManager(data: any) {
		let isManager = false;

		if (data.rights.length != 0) {
			isManager = true;
		}
		console.log('manager ', isManager);

		if (isManager) localStorage.setItem('manager', 'admin');
		else localStorage.setItem('manager', 'saler');

		this.evEVT.publish('access:control', isManager);
	}

	goToNotifs() {
		this.navCtrl.push('ChatPage');
	}

	//Cette fonction permet de se déconnecter
	deconnexion() {
		this.odooServ.signOut((res) => {
			if (res.code == 0) {
				this.navCtrl.setRoot(LoginPage);

				//On vide les données de l'utilisateur récent
				this.lgService.remove('login');
				this.lgService.remove('me_avocat');
				this.menuCtrl.enable(false, 'objMenu');
			}

			this.odooServ.displayCustomMessage(res.msg);
		});
	}

	//On va ouvrir la vue Pipeline en fonction de l'action
	//choisie par l'utilisateur
	goToPipeline(ops) {
		this.navCtrl.push('PipelinePage', { activity: ops, today: true });
	}

	goToWon() {
		this.navCtrl.push('PipelinePage', { won: 'Won' });
	}

	goToCalls(filter, state) {
		// this.navCtrl.push('CallsPage', { today: true });
		if (filter == 't') this.navCtrl.push('CallsPage', { tab_ids: this.calls_today_ids, state: state });
		else if (filter == 'm') this.navCtrl.push('CallsPage', { tab_ids: this.calls_ids, state: state });
	}

	goToMeetings(filter) {
		if (filter == 't') this.navCtrl.push('AgendaPage', { tab_ids: this.meetings_today_ids });
		else if (filter == 'm') this.navCtrl.push('AgendaPage', { tab_ids: this.meetings_ids });
	}

	goToInvoices() {
		this.navCtrl.push('InvoicesPage', { tab_ids: this.invoice_ids });
	}

	/**
	 * Method to show bottom menu on click on footer
	 */
	showMenu() {
		this.displayMenu = true;
		this.menu_actionSheet = this.actionCtrl.create({
			title: this.user.display_name + ', here is your menu',
			cssClass: 'my-custom-action-sheet custom-action-sheetMain',
			buttons: this.getListButtons()
		});

		this.menu_actionSheet.present().then(() => {
			this.menu_slide_display = true;
			// this.menu_slide_display = false;
		});
		this.menu_actionSheet.onDidDismiss(() => {
			this.menu_slide_display = false;
		});
	}

	private getListButtons() {
		// console.log('My menus => ', this.allMenus);
		let tab = [];

		var mymenus = [];

		mymenus = this.allMenus;

		for (let i = 0; i < mymenus.length; i++) {
			// if (this.translate.getDefaultLang() == 'en') {
			if (mymenus[i] != null && mymenus[i].active == true && mymenus[i].slug != 'devis-form') {
				tab.push({
					text: mymenus[i].title[this.current_lang],
					cssClass: 'btn-sheet-' + mymenus[i].css,
					handler: () => {
						this.navCtrl.push(mymenus[i].component, {
							partner: mymenus[i].slug,
							titre: mymenus[i].title[this.current_lang]
						});
					}
				});
			}
			if (mymenus[i] != null && mymenus[i].active == true && mymenus[i].slug == 'devis-form') {
				tab.push({
					text: mymenus[i].title.en,
					cssClass: 'btn-sheet-' + mymenus[i].css,
					handler: () => {
						let addModal = this.modalCtrl.create(mymenus[i].component, {
							modif: false,
							type: 'vente',
							param: this.type
						});
						let msgLoading = this.loadCtrl.create({ content: this.txtLangue.module.sales.statut_add });

						addModal.onDidDismiss((data) => {
							if (data) {
								let message = this.txtLangue.sales.txt_add;
								msgLoading.present();
								data.idx = new Date().valueOf();

								//On insère dans la bd Interne
								this.odooServ.copiedAddSync('vente', data);
								this.odooServ.syncCreateObjet('vente', data);

								msgLoading.dismiss();
								this.odooServ.showMsgWithButton(message, 'top', 'toast-success');
							}
						});

						addModal.present();
					}
				});
			}
		}

		return tab;
	}

	showMore(type) {
		if (type == 'leads') {
			this.navCtrl.push('PipelinePage', { client: this.user });
		} else if (type == 'devis') {
			this.navCtrl.push('SalesPage', { partner: 'draft' });
		} else if (type == 'produit') {
			this.navCtrl.push('CataloguePage', { prod_list: this.products });
		} else if (type == 'subs') {
			this.navCtrl.push('AbonnementsPage', { subs_list: this.subs });
		}
	}

	bindEvents() {
		this.eventsBinding = {
			onTap: (event: any) => {
				let objToSend = {
					rubrique: null,
					objet: event.objet,
					user: null,
					type: null,
					login: null
				};
				console.log(event.objet);
				this.navCtrl.push('DetailLeadOpportPage', { toSend: objToSend });
				// this.onTapItem(event.objet, event.theEvent);
			}
		};
		this.devisEventsBinding = {
			onClick: (event: any) => {
				this.navCtrl.push('DetailsSalePage', { toSend: event.devis, type: this.type });
			}
		};
		this.eventsProdsBinding = {
			onClick: (event: any) => {
				let objToSend = {
					objet: event.produit,
					type: 'produit'
				};
				this.navCtrl.push('ProdDetailPage', {
					product: event.produit,
					toSend: objToSend
				});
			}
		};
	}

	/**
    * Function qui permert de creer une devis pour le client en question
    */
	addDevis() {
		let addModal = this.modalCtrl.create('FormSalePage', {
			modif: false,
			type: 'vente',
			param: this.type,
			partner_id: this.user
		});
		let msgLoading = this.loadCtrl.create({ content: this.txtLangue.module.sales.statut_add });

		addModal.onDidDismiss((data) => {
			if (data) {
				let message = this.txtLangue.sales.txt_add;
				msgLoading.present();
				data.idx = new Date().valueOf();

				//On insère dans la bd Interne
				// this.sales.push(data);
				// this.ventes.unshift(data);

				this.odooServ.copiedAddSync('vente', data);
				this.odooServ.syncCreateObjet('vente', data);

				msgLoading.dismiss();
				this.odooServ.showMsgWithButton(message, 'top', 'toast-success');
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
			lang: this.txtLangue.pop
		});

		this.odooServ.createObjetResult('leads', null, null, addModal, (res) => {
			// let tab = [];

			// this.listeLeads.push(res);
			// this.leads.push(res);
			this.odooServ.copiedAddSync('leads', res); //ON insère dans la bd liste
			this.odooServ.showMsgWithButton(this.txtLangue.module.partner.opport_add, 'top', 'toast-success');
		});
	}

	showProfil() {
		this.navCtrl.push('ProfilePage', { objet: this.user });
	}
}
