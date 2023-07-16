import { Component, ViewChild } from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	ActionSheetController,
	Events,
	LoadingController,
	Slides
} from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { OdooProvider } from '../../providers/odoo/odoo';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the GraphViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-graph-view',
	templateUrl: 'graph-view.html'
})
export class GraphViewPage {
	users = [];
	leads = [];
	teams = [];
	teamsResult = [];
	region;
	type;
	product;
	@ViewChild('teamSlide') slides: Slides;
	@ViewChild('teamCanvas') teamCanvas;
	txtLangue: any;
	objTeamCanvas: any;
	lineChart1: any;
	lineChart2: any;
	current_lang;
	lineChart3: any;
	canvasArray = [];
	currentTeam: any;
	current_user: any;
	index = 0;
	user: any;
	teamsData = [];
	teamObjet: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public actionCtrl: ActionSheetController,
		private lgService: LoginProvider,
		public evEVT: Events,
		private odooServ: OdooProvider,
		public translate: TranslateService,
		public loadCtrl: LoadingController
	) {
		this.type = this.navParams.get('graphType');
		this.teamsData = this.navParams.get('teamsData');
		this.translate.get([ 'pop', 'menu', 'module' ]).subscribe((res) => {
			this.txtLangue = res;
		});
		this.lgService.isTable('me_avocat').then((data) => {
			this.current_user = JSON.parse(data);
		});

		this.current_lang = translate.getDefaultLang();
		this.region = this.navParams.get('region');
		this.teamObjet = this.navParams.get('team');
		this.users = this.navParams.get('commercials');
		this.user = this.navParams.get('commercial');
		this.leads = this.navParams.get('leads');
		this.teams = this.navParams.get('teams');
		this.product = this.navParams.get('product');

		this.loadData();
	}

	ionViewDidLoad() {
		/* 	var canvas1 = <HTMLCanvasElement>document.getElementById('barchart-canvas-large');
		var ctx1 = canvas1.getContext('2d'); */
		if (this.type == 'region') {
			this.lgService.loadNonGradientLinearChart(
				this.teamCanvas,
				this.txtLangue.pop,
				this.currentTeam.color,
				this.currentTeam.color,
				this.currentTeam.tabs
			);
		}
		if (this.type == 'user') {
			this.lgService.loadNonGradientLinearChart(
				this.teamCanvas,
				this.txtLangue.pop,
				this.user.color,
				this.user.color,
				this.user.tabs
			);
		}
		if (this.type == 'team') {
			this.lgService.loadNonGradientLinearChart(
				this.teamCanvas,
				this.txtLangue.pop,
				this.teamObjet.color,
				this.teamObjet.color,
				this.teamObjet.tabs
			);
		}
	}

	//Aller au prochain slides
	onNextTeam() {
		this.index++;
		this.currentTeam = this.teamsResult[this.index];
		this.lgService.loadNonGradientLinearChart(
			this.teamCanvas,
			this.txtLangue.pop,
			this.currentTeam.color,
			this.currentTeam.color,
			this.currentTeam.tabs
		);
	}

	loadData() {
		if (this.type == 'region') {
			this.lgService.getOpportsByRegion(this.region, this.users, this.leads, this.teams).then((res: any) => {
				console.log('Teams ', res);
				this.currentTeam = res[this.index];
				this.teamsResult = res;
			});
		}
		if (this.type == 'user') {
			console.log('user ', this.user);
		}
		if (this.type == 'teams') {
		}
	}
	//Aller au slide précédent
	onPrevTeam() {
		this.index--;
		this.currentTeam = this.teamsResult[this.index];
		this.lgService.loadNonGradientLinearChart(
			this.teamCanvas,
			this.txtLangue.pop,
			this.currentTeam.color,
			this.currentTeam.color,
			this.currentTeam.tabs
		);
	}

	//Cette fonction permet de changer la liste
	//des vendeurs appartenant à une équipe
	changeMembers() {
		// console.log(this.slides.getActiveIndex());
	}

	viewCommTO(item) {
		this.navCtrl.push('GraphViewPage', {
			commercial: item,
			graphType: 'user'
		});
	}
}
