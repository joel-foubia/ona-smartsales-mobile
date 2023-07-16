import { Component, ViewChild } from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	MenuController,
	AlertController,
	ModalController,
	PopoverController,
	ActionSheetController,
	Events
} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';

/**
 * Generated class for the ProdDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-prod-detail',
	templateUrl: 'prod-detail.html'
})
export class ProdDetailPage {
	product: any;
	current_lang = '';
	description: string;
	showMore: boolean;
	the_partner: any;
	objToSend: any;
	current_user;
	txtMsge: any;
	company_prod: any;
	eventsProdsBinding: any;
	eventsSaleBinding: any;
	purchase_lines = [];
	txtLangue: any;
	@ViewChild('teamCanvas') teamCanvas;
	graphData;
	mode = 'week';
	lines = [];
	is_manager: boolean = true;
	ventes = [];
	teams = [];
	users = [];
	turn_over_data;
	current_team;
	current_team_member;
	@ViewChild('teamManagerCanvas') teamManagerCanvas;
	index = 0;
	mode_ca = 'month';

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public storage: Storage,
		public menuCtrler: MenuController,
		public alertCtrl: AlertController,
		public modalCtrl: ModalController,
		public popCtrl: PopoverController,
		public translate: TranslateService,
		public lgService: LoginProvider,
		public odooService: OdooProvider,
		public actionCtrl: ActionSheetController,
		public events: Events
	) {
		this.translate.get([ 'pop', 'menu', 'module' ]).subscribe((res) => {
			this.txtLangue = res;
		});
		this.mode = this.txtLangue.pop.weekly;
		this.mode_ca = this.txtLangue.pop.monthly;
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
		this.eventsSaleBinding = {
			onClick: (event: any) => {
				this.navCtrl.push('DetailsSalePage', { toSend: event.devis, type: null });
			}
		};
		this.translate.get('module').subscribe((res) => {
			this.txtMsge = res.prod_detail;
		});
		this.objToSend = this.navParams.get('toSend');
		this.the_partner = 'produit';
		this.product = this.navParams.get('product');
		console.log('Product received : ', this.product);

		this.storage.get('me_avocat').then((data) => {
			this.current_lang = JSON.parse(data).lang.id;
			this.current_lang.replace(/_/g, '-');
		});

		this.lgService.isTable('me_avocat').then((data) => {
			if (data) {
				this.current_user = JSON.parse(data);
			}
		});

		this.events.subscribe('access:control', (data) => {
			this.is_manager = data;
		});
		if (this.product.qty_available <= 0) {
			this.presentAlert(this.product);
		}
		this.listChild('purchase_line');
		this.listChild('lines');
		this.listChild('vente');
		this.listChild('team');
		this.listChild('user');

		this.calcDesc(this.product.description_sale);
		this.getCommands();
		this.getSimilar();
		this.getCompanyEmail();

		this.buildGraphDta('week');
	}

	buildCaGraphData() {
		this.lgService.getProdCa(this.product, 'month', this.txtLangue.pop).then((res: any) => {
			console.log('Turn over ', res);
			this.turn_over_data = res;
			if (this.is_manager) {
				this.current_team = res[this.index];
				this.lgService.loadNonGradientLinearChart(
					this.teamManagerCanvas,
					this.txtLangue.pop,
					this.current_team.color,
					this.current_team.color,
					this.current_team.tabs
				);
			} else {
				this.current_team_member = res.users[this.index];
				this.lgService.loadNonGradientLinearChart(
					this.teamManagerCanvas,
					this.txtLangue.pop,
					this.current_team_member.color,
					this.current_team_member.color,
					this.current_team_member.tabs
				);
			}
		});
	}

	listChild(model) {
		this.lgService.isTable('_ona_' + model).then((res) => {
			if (res) {
				var results = JSON.parse(res);
				if (model == 'purchase_line') {
					this.purchase_lines = results;
					// console.log('Purchase lines ', this.purchase_lines);
				}
				if (model == 'lines') {
					this.lines = results;
					// console.log('Lines ', this.lines);
				}
				if (model == 'vente') {
					this.ventes = results;
					// console.log('Sales ', this.ventes);
				}
				if (model == 'team') {
					this.teams = results;
					// console.log('Teams ', this.teams);
				}
				if (model == 'user') {
					this.users = results;
					// console.log('Users ', this.users);
				}
			}
		});
	}

	buildGraphDta(mode) {
		this.graphData = this.lgService.getStockEvol(
			this.product,
			this.purchase_lines,
			mode,
			this.txtLangue.pop,
			this.lines
		);
		console.log('Graph data ', this.graphData);
	}

	getCompanyEmail() {
		this.lgService.isTable('_ona_user').then((data) => {
			if (data) {
				var usersList = [];
				usersList = JSON.parse(data);
				for (let k = 0; k < usersList.length; k++) {
					if (usersList[k].id == this.product.company_id.id) {
						this.company_prod = usersList[k];
					}
				}
			}
		});
	}

	calcDesc(desc) {
		var tempdec = '';
		tempdec = desc;
		var arraydec = [];
		for (let i = 0; i < 50; i++) {
			if (tempdec[i]) {
				arraydec.push(tempdec[i]);
			}
		}
		if (arraydec.join('').length < tempdec.length) {
			this.showMore = true;
			console.log('Less than');
			this.description = arraydec.join('') + '...';
		} else {
			this.showMore = false;
			console.log('greater than');
			this.description = arraydec.join('');
		}
	}

	getCommands() {
		this.lgService.isTable('_ona_vente').then((data) => {
			if (data) {
				var salesList = [];
				var productSales = [];
				salesList = JSON.parse(data);
				for (let k = 0; k < salesList.length; k++) {
					if (salesList[k].product_id.id == this.product.id) {
						productSales.push(salesList[k]);
					}
				}
				this.product.sales = productSales;
				console.log('Product sales', this.product.sales);
				console.log(' sales', salesList);
			}
		});
	}
	getSimilar() {
		this.lgService.isTable('_ona_produit').then((data) => {
			if (data) {
				var prods = [];
				var similar = [];
				prods = JSON.parse(data);
				for (let k = 0; k < prods.length; k++) {
					if (this.product.product_variant_ids.indexOf(prods[k].id) > -1) {
						similar.push(prods[k]);
					}
				}
				this.product.similar = similar;
				console.log('Product similar', this.product.similar);
			}
		});
	}

	readMore(event) {
		let popover = this.popCtrl.create(
			'ProdDescPopupPage',
			{ model: this.product },
			{ cssClass: 'description-popover' }
		);
		popover.present({ ev: event });
	}

	presentAlert(prod) {
		this.translate.get('module.prod_detail').subscribe((res) => {
			let alert = this.alertCtrl.create({
				title: res.empty_stock,
				message: res.the + ' ' + prod.type.toUpperCase() + ' : ' + prod.name + ' ' + res.not_in_stock,
				buttons: [
					{
						text: res.cancel,
						role: 'cancel',
						handler: () => {}
					}
				]
			});
			alert.present();
		});
	}

	openLeftMenu() {
		this.menuCtrler.open();
	}
	archive() {
		this.translate.get('module.prod_detail').subscribe((res) => {
			this.product.active = false;
			let message = res.article + ' ' + this.product.name + res.was_archived;

			//On met à jour les informations (data) dans la base de données interne

			if (this.product.id == 0) this.odooService.updateNoSyncObjet(this.the_partner, this.product, this.product);
			else {
				this.odooService.updateNoSync(this.the_partner, this.product, this.product.id, 'standart');
				this.odooService.updateSyncRequest(this.the_partner, { active: false, id: this.product.id });
			}

			this.odooService.showMsgWithButton(message, 'top', 'toast-success');
		});
	}

	update() {
		//  Update Logic Here
		this.translate.get('module.prod_detail').subscribe((res) => {
			let updateModal = this.modalCtrl.create('FormProductPage', {
				modif: true,
				toSend: this.objToSend,
				type: this.the_partner
			});
			updateModal.present();

			updateModal.onDidDismiss((data) => {
				if (data) {
					console.log('On modal close =>', data);
					let message = res.info + this.the_partner + res.was_mod;
					this.calcDesc(data.description_sale);
					//On met à jour les informations (data) dans la base de données interne

					if (this.product.id == 0) this.odooService.updateNoSyncObjet(this.the_partner, data, this.product);
					else {
						this.odooService.updateNoSync(this.the_partner, data, this.product.id, 'standart');
						this.odooService.updateSyncRequest(this.the_partner, data);
					}

					this.odooService.showMsgWithButton(message, 'top', 'toast-success');
				}
			});
		});
	}

	createLead() {
		// this.navCtrl.push('FormLeadPage', { objet: null, type: 'lead', action: 'insert', name: this.product.name });
		let addModal = this.modalCtrl.create('FormLeadPage', {
			objet: null,
			type: 'lead',
			action: 'insert',
			name: this.product.name
		});
		addModal.present();
	}
	explainLock(prod) {
		if (prod.sale_ok == true) {
			this.odooService.showMsgWithButton('This icon means that the product can be sold', 'middle', 'toast-info');
		} else {
			this.odooService.showMsgWithButton(
				'This icon means that the product can not be sold',
				'middle',
				'toast-info'
			);
		}
	}

	sendSupplyMail() {
		this.odooService.doEmail(this.company_prod.email, this.buildMessage());
		this.odooService.showMsgWithButton(this.txtMsge.supply_email_msge, 'top', 'toast-sucess');
	}

	private buildMessage() {
		let html = '';
		html += this.txtMsge.comm_name + this.current_user.name + '<br>';
		html += this.txtMsge.comm_team + this.current_user.sale_team_id.name + '<br>';
		html += this.txtMsge.email + this.current_user.email + '<br><br><br>';
		html +=
			this.txtMsge.msge_txt1 +
			' ' +
			this.product.name +
			' ' +
			this.txtMsge.msge_txt2 +
			' ' +
			this.product.qty_available +
			this.product.uom_id.name +
			this.txtMsge.msge_txt3 +
			'<br>';

		return html;
	}

	ionViewDidLoad() {
		this.buildCaGraphData();
		this.lgService.loadLinearMultipleChartProd(this.teamCanvas, this.txtLangue.pop, this.graphData);
	}

	onPeriodFilter() {
		let buttons = [];

		buttons.push({
			text: this.txtLangue.pop.weekly,
			cssClass: 'icon icon-clock',
			handler: () => {
				this.mode = this.txtLangue.pop.weekly;
				this.graphData = this.lgService.getStockEvol(
					this.product,
					this.purchase_lines,
					'week',
					this.txtLangue.pop,
					this.lines
				);
				/* this.lgService.loadProdNonGradientLinearChart(
					this.teamCanvas,
					this.txtLangue.pop,
					this.graphData[0].color,
					this.graphData[0].days,
					this.graphData[0].labels,
					this.graphData[0].label_txt
				); */
				this.lgService.loadLinearMultipleChartProd(this.teamCanvas, this.txtLangue.pop, this.graphData);
			}
		});
		buttons.push({
			text: this.txtLangue.pop.monthly,
			cssClass: 'icon icon-clock',
			handler: () => {
				this.mode = this.txtLangue.pop.monthly;
				this.graphData = this.lgService.getStockEvol(
					this.product,
					this.purchase_lines,
					'month',
					this.txtLangue.pop,
					this.lines
				);
				/* this.lgService.loadProdNonGradientLinearChart(
					this.teamCanvas,
					this.txtLangue.pop,
					this.graphData[0].color,
					this.graphData[0].days,
					this.graphData[0].labels,
					this.graphData[0].label_txt
				); */
				this.lgService.loadLinearMultipleChartProd(this.teamCanvas, this.txtLangue.pop, this.graphData);
			}
		});
		buttons.push({
			text: this.txtLangue.pop.year,
			cssClass: 'icon icon-clock',
			handler: () => {
				this.mode = this.txtLangue.pop.year;
				this.graphData = this.lgService.getStockEvol(
					this.product,
					this.purchase_lines,
					'year',
					this.txtLangue.pop,
					this.lines
				);
				/* this.lgService.loadProdNonGradientLinearChart(
					this.teamCanvas,
					this.txtLangue.pop,
					this.graphData[0].color,
					this.graphData[0].days,
					this.graphData[0].labels,
					this.graphData[0].label_txt
				); */
				this.lgService.loadLinearMultipleChartProd(this.teamCanvas, this.txtLangue.pop, this.graphData);
			}
		});

		let prod_sheet = this.actionCtrl.create({
			title: this.txtLangue.pop.period_filter_title,
			cssClass: 'product-action-sheets',
			buttons: buttons
		});

		prod_sheet.present();
	}

	onPrevTeam() {
		if (this.is_manager) {
			this.index--;
			this.current_team = this.turn_over_data[this.index];
			this.lgService.loadProdNonGradientLinearChart(
				this.teamManagerCanvas,
				this.txtLangue.pop,
				this.current_team.color,
				this.current_team.tabs,
				this.current_team.labels,
				''
			);
		} else {
			this.index--;
			this.current_team_member = this.turn_over_data.users[this.index];
			this.lgService.loadProdNonGradientLinearChart(
				this.teamManagerCanvas,
				this.txtLangue.pop,
				this.current_team_member.color,
				this.current_team_member.tabs,
				this.current_team_member.labels,
				''
			);
		}
	}

	onNextTeam() {
		if (this.is_manager) {
			this.index++;
			this.current_team = this.turn_over_data[this.index];
			this.lgService.loadProdNonGradientLinearChart(
				this.teamManagerCanvas,
				this.txtLangue.pop,
				this.current_team.color,
				this.current_team.tabs,
				this.current_team.labels,
				''
			);
		} else {
			this.index++;
			this.current_team_member = this.turn_over_data.res[this.index];
			this.lgService.loadProdNonGradientLinearChart(
				this.teamManagerCanvas,
				this.txtLangue.pop,
				this.current_team_member.color,
				this.current_team_member.tabs,
				this.current_team_member.labels,
				''
			);
		}
	}

	onPeriodFilterCA() {
		let buttons = [];

		buttons.push({
			text: this.txtLangue.pop.monthly,
			cssClass: 'icon icon-clock',
			handler: () => {
				this.mode_ca = this.txtLangue.pop.monthly;
				this.lgService.getProdCa(this.product, 'month', this.txtLangue.pop).then((res: any) => {
					console.log('Turn over ', res);
					this.turn_over_data = res;
					if (this.is_manager) {
						this.index = 0;
						this.current_team = res[this.index];
						this.lgService.loadProdNonGradientLinearChart(
							this.teamManagerCanvas,
							this.txtLangue.pop,
							this.current_team.color,
							this.current_team.tabs,
							this.current_team.labels,
							''
						);
					} else {
						this.index = 0;
						this.current_team_member = res.users[this.index];
						this.lgService.loadProdNonGradientLinearChart(
							this.teamManagerCanvas,
							this.txtLangue.pop,
							this.current_team_member.color,
							this.current_team_member.tabs,
							this.current_team_member.labels,
							''
						);
					}
				});
			}
		});
		buttons.push({
			text: this.txtLangue.pop.year,
			cssClass: 'icon icon-clock',
			handler: () => {
				this.mode_ca = this.txtLangue.pop.year;
				this.lgService.getProdCa(this.product, 'year', this.txtLangue.pop).then((res: any) => {
					console.log('Turn over ', res);
					this.turn_over_data = res;
					if (this.is_manager) {
						this.index = 0;
						this.current_team = res[this.index];
						this.lgService.loadProdNonGradientLinearChart(
							this.teamManagerCanvas,
							this.txtLangue.pop,
							this.current_team.color,
							this.current_team.tabs,
							this.current_team.labels,
							''
						);
					} else {
						this.index = 0;
						this.current_team_member = res.users[this.index];
						this.lgService.loadProdNonGradientLinearChart(
							this.teamManagerCanvas,
							this.txtLangue.pop,
							this.current_team_member.color,
							this.current_team_member.tabs,
							this.current_team_member.labels,
							''
						);
					}
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
}
