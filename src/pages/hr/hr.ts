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
	Slides,
	IonicPage
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
// import { FormEmployePage } from '../form-employe/form-employe';
// import { DetailsEmployePage } from '../details-employe/details-employe';

import { PopFilterPage } from '../pop-filter/pop-filter';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';

import { Team } from '../../models/team';
import { User } from '../../models/user';
import { ConfigSync, ConfigOnglet } from '../../config';

@IonicPage({
	name: 'hr'
})
@Component({
	selector: 'page-hr',
	templateUrl: 'hr.html'
})
export class HrPage {

	txtLastMonths: string;
	opport = {
		color: "rgba(176, 121, 19, 1)",
		color_light: "rgba(176, 121, 19, 0.7)"
	};

	barChartLarge: {};
	last_date = null;
	defaultImg: string;
	owner: any;
	@ViewChild('teamSlide') slides: Slides;
	@ViewChild('barCanvasLarge') barCanvasLarge;
	@ViewChild('pieCanvasLarge') pieCanvasLarge;

	current_lang: string;
	colabs: any[][];
	public vendeurs = [];
	public teams = [];
	public searchTerm: string = '';
	private dumpData: any;
	vendor: any = [];
	public objLoader;
	public txtFiltre;
	public max = 10; //Nombre d'éléments max a chargé (ioninfinite scroll)
	private offset = 0; //index à partir duquel débuter
	public isArchived = false;
	public display = false;
	private txtLangue;
	public current_period;
	private txtPop;

	private checkSync;
	selectedUsers: any[];
	compered: any;
	turnover: any = [];
	public listUser: any = [];
	public list: any;
	public turnoverPrice: any = [];
	public displayUsers: any = [];
	public teamSelected: any = [];
	public filter_period: any = [];
	txtpop: any;
	public chiffre: any = [];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public odooServ: OdooProvider,
		public loadCtrl: LoadingController,
		public alertCtrl: AlertController,
		public actionCtrl: ActionSheetController,
		public modalCtrl: ModalController,
		public lgServ: LoginProvider,
		public menuCtrl: MenuController,
		public popCtrl: PopoverController,
		public events: Events,
		public translate: TranslateService
	) {
		this.translate.get('pop').subscribe((res) => {
			this.txtpop = res;
		});
		this.seeObject();
		this.defaultImg = "assets/images/person.jpg";
		this.initPage();
		this.getOwner();
	}

	//Cette fonction récupère les informations de l'utilisateur
	//courant
	getOwner() {
		this.lgServ.isTable('me_avocat').then(reponse => {
			if (reponse) {
				this.owner = JSON.parse(reponse);
			}
		})
	}
	applyFilterTeam(searchs, objet){
		let cpt = 0;
		var today = new Date();
		var teamDate = objet.date_order;
		var objecDate = new Date(teamDate);
		var dd = today.getMonth() + 1;
		var yy = today.getFullYear();
		for (let j = 0; j < searchs.length; j++) {
			switch (searchs[j].slug) {
				case 'mounth' : {
					if(objecDate.getMonth() + 1 == dd){
						cpt++;
						break;
					}	
				}
				case 'year' : {
					if(objecDate.getFullYear() == yy){
						cpt++
						break;
					}
				}

			}
		}
		if (cpt == searchs.length) return true;
		else return false;
	}
	
	filterTeam(currentTeam) {
		this.lgServ.isTable('_ona_user').then(reponse => {
		this.lgServ.isTable('_ona_vente').then((_data)=>{
			let team = JSON.parse(_data);
			// console.log('Team Object =>>> ', team);

			let members = JSON.parse(reponse), results = [];
			for (let j = 0; j < members.length; j++) {
				const element2 = members[j];
				if (currentTeam.member_ids.indexOf(element2.id) > 1) {
					results.push(element2);
				}
				
			}
			console.log('TEAM => ', results);
			this.teamSelected = results;
			this.vendeurs = this.teamSelected;
			this.chiffre = [];
			for (let j = 0; j < team.length; j++) {
				var sales = team[j];
				for (let h = 0; h < this.teamSelected.length; h++) {
					var fetchedTeam = this.teamSelected[h];
					if( sales.user_id.id == fetchedTeam.sale_team_id.id){
						
						var setSales = fetchedTeam;
						let prix;
						prix = sales.amount_total;
						// let currency = setSales.currency_id;
						// setSales['chiffre'] = prix;
						// setSales['currency_id'] = currency;
						var objet = {
							name : fetchedTeam.name,
							currency : fetchedTeam.currency_id,
							image_url : fetchedTeam.image_url,
							email : fetchedTeam.email,
							amount : sales.amount_total
						}
						this.chiffre.push(objet);
						// break;
					}
				}
				
			}
			console.log('Resulte ', this.chiffre);
			console.log('Users => ', this.teamSelected);
			// console.log('chiffre => ', this.chiffre);
			var affaire = [];
			for (let i = 0; i <this. chiffre.length; i++) {
				var element = this.chiffre[i];
				var teamDate = element.date_order;
				console.log('teamDate => ', teamDate);
				var objecDate = new Date(teamDate);
				var today = new Date();
				var dd = today.getMonth() + 1;
				// console.log('objecDate => ', objecDate);
				// console.log('dd => ', dd);
				if(objecDate.getMonth() + 1 == dd){
					var mountObject = element;
					affaire.push(mountObject);
				}
			}
			console.log('mount results => ', affaire);
			
		});
		});

	}
	filterDates(result){
		this.max = 10;
		let resultats = [];
		for (let i = 0; i < this.teamSelected.length; i++) {
			if(this.applyFilterTeam(result, this.teamSelected[i])){
				resultats.push(this.teamSelected[i]);
			}
			this.vendeurs = resultats;
		}
	}
	filterByPeriod(object, type){
		object.selected = !object.selected;
		this.resetObjets(object, type);
		let objDate;
		if(type=='period'){
			this.current_period = object.id;
		}else{
			objDate = {slug: type, val: object.id}
		}
		this.filterDates([objDate]);
	}
	/**
	 * Permet à l'utilisateur de 
	 * @param objet JSONObject
	 * @param type string, le type de groupe
	 */
	private resetObjets(objet, type, options?: any) {
		if (type == 'period') {
			for (let i = 0; i < this.filter_period.length; i++) {
				if (this.filter_period[i].id != objet.id)
					this.filter_period[i].selected = false;

				if (options) this.filter_period[i].selected = false;
			}
		}

	}

	seeObject() {
		this.lgServ.isTable('_ona_user').then(reponse => {
			this.lgServ.isTable('_ona_' + 'vente').then((result) => {
				let arrayUser = JSON.parse(reponse);
				this.selectedUsers = [];
				this.turnover = [];
				this.listUser = [];
				for (let i = 0; i < arrayUser.length; i++) {
					let vente = JSON.parse(result);

					for (let j = 0; j < vente.length; j++) {
						let filteredUsers = arrayUser[i];
						let filteredSelers = vente[i];
						if (filteredUsers.sale_team_id.id == filteredSelers.team_id.id) {
							this.compered = filteredSelers;
							this.list = filteredUsers;
							// console.log('filtered => ', this.compered);
							// turnover.push(vente);
						}
						// console.log('Selers => ', filteredSelers);

					}
					this.turnover.push(this.compered);
					this.listUser.push(this.list);

					// console.log('turnover => ', this.turnover);
					// console.log('Liste Utilisateur => ', this.listUser);

				}
				this.displayUsers = [];
				let array = [];
				for (let i = 0; i < this.turnover.length; i++) {
					for (let j = 0; j < this.listUser.length; j++) {
						// const element = array[j];
						if (this.turnover[i].team_id.name == this.listUser[j].sale_team_id.name) {
							var finalList = this.turnover[i];
							var image = this.listUser[j].image_url;
							var currency = this.listUser[j].currency_id;
							// var name = this.listUser[j].name;

						}
						var object = {
							chiffre: finalList.amount_total,
							img: image,
							name: finalList.name,
							id: finalList.id,
							validity_date: finalList.validity_date,
							equipe: finalList.team_id,
							date_debut: finalList.create_date,
							date_order: finalList.date_order,
							currency_id: currency
						}
					}
					// const element = array[i];
					array.push(object);
					this.turnoverPrice = array;

				}
				// console.log('FinalList => ', array);
				this.lgServ.isTable('_ona_call').then(_data => {
					var call = JSON.parse(_data);
					var open = [];
					for (let h = 0; h < call.length; h++) {
						var objectCall = call[h];
						for (let g = 0; g < this.turnoverPrice.length; g++) {
							var bon2cmd = this.turnoverPrice[g];
							if (objectCall.team_id.id == bon2cmd.equipe.id && objectCall.state == 'open') {
								var callOpen = objectCall;
							}

						}
						open.push(callOpen);
						// console.log('objectCall => ',objectCall)

					}
					// console.log('bon2cmd => ',open);

					// console.log('call => ', JSON.parse(call));
					console.log('Open => ', call);
				});
			});
			// console.log('Vendor => ', this.vendor);
		});
	}

	initPage() {
		this.objLoader = true;
		this.current_lang = this.translate.getDefaultLang();
		//this.txtLangue = this.odooServ.traduire().module.hr;
		this.translate.get('pop').subscribe(_res => {
			this.txtPop = _res;
		});

		//this.txtFiltre = {slug:'all', nom:this.txtLangue.titre};

		this.syncOffOnline('all');
		this.checkSync = setInterval(() => this.activateSyn(), ConfigSync.timeSync);

		this.lgServ.formatDate("_ona_team").then(_date => {
			this.last_date = _date;
		});

	}

	ionViewDidLoad() {
		this.filter_period = ConfigOnglet.filterPeriod(this.txtpop);
	 }

	ionViewDidLeave() {
		clearInterval(this.checkSync);
	}
	presentPopover(myEvent){
		let popover = this.popCtrl.create('PopPeriodPage', {listePeriod : this.filter_period},{cssClass: 'contact-popover'});
    popover.present({
      ev: myEvent
	});
	popover.onDidDismiss((result)=>{
		console.log('result => ', result);
	});
	}

	//Cette fonction permet d'activer la synchronisation
	activateSyn() {

		this.lgServ.connChange('_ona_team').then(res => {
			if (res) {
				this.listStageObjet();
			} else {
				clearInterval(this.checkSync);
			}
		});

	}

	//Cette fonction permet de charger les données
	//lorsque l'utilisateur est en mode offline ou via online (server)
	syncOffOnline(filter) {

		this.lgServ.checkStatus('_ona_team').then(res => {

			if (res == 'i') {
				//Première utilisation sans connexion
				this.objLoader = false;
			} else if (res == 's' || res == 'w' || res == 'rw') { //From Storage
				this.objLoader = true;
				this.lgServ.isTable('_ona_team').then(result => {
					if (result) {
						if (filter == 'all') {
							this.teams = JSON.parse(result);
							this.objLoader = false;
						}
						//On affiche les éléments de la liste
						this.listMembers(this.teams[0]);
						this.filterTeam(this.teams[0]);
					}

				});

				//SYnc de la liste depuis le serveur
				if (res == 'w' || res == 'rw') {
					this.listStageObjet();
				}

			}

		});

	}


	//On récupère la liste des factures depuis le serveur
	listStageObjet() {

		this.odooServ.requestObjectToOdoo('team', null, this.last_date, null, (res) => {
			this.objLoader = false;
			if (res.length != 0) {

				let results = [];
				//On synchronise avec la table
				for (let i = 0; i < res.length; i++)
					results.push(new Team(res[i]));

				if (this.display) { //Synchronisation activé

					this.odooServ.refreshViewList('_ona_team', results).then((rep: any) => {

						this.teams = rep;
						this.display = false;

					});

				}

				this.lgServ.setObjectToTable('_ona_team', results);
				this.lgServ.setSync('_ona_team_date');
			}

		});

	}

	//On laisse l'utilisateur synchroniser manuellement
	synchronizing() {
		this.display = true;
		this.listStageObjet();
	}

	//Ouvre la vue détails d'une facture
	// showVendeur(fact, theEvent){
	// 	let popover = this.popCtrl.create('PopOverPage', {'menus':fact, 'lang': this.txtPop, 'invoice':true}, { cssClass: 'custom-popover'});

	// 	popover.present({ev : theEvent});
	// 	popover.onDidDismiss((result)=>{
	// 		if(result){
	// 		  console.log(result);
	// 		//   if(result.slug=='detail'){
	// 		// 	this.navCtrl.push(DetailsInvoicePage, {'objet': fact});
	// 		//   }else if(result.slug=='payment'){
	// 		// 	this.navCtrl.push(PaymentsPage, {'facture':fact});
	// 		//   }else{
	// 		// 	this.applyActionOnItem(fact, result, theEvent);
	// 		//   }

	// 		} 
	// 	});

	// }

	doInfinite(infiniteScroll) {

		this.offset += this.max;
		let params = { 'options': { offset: this.offset, max: this.max } };
		this.max += 10;

		infiniteScroll.complete();
	}

	openLeftMenu() {
		this.menuCtrl.open();
	}

	//Cette fonction permet d'afficher
	//la liste des filtres à appliquer 
	onFilter(theEvent) {

		let popover = this.popCtrl.create('PopFilterPage', { 'invoices': true, 'lang': this.txtPop });
		popover.present({ ev: theEvent });
		popover.onDidDismiss((result) => {

			if (result) {
				//   this.objFiltre = true;
				//   this.txtFiltre = result;
				//   this.applyFilterOnInvoices(result.slug);
			}
		});

	}


	//Cette fonction permet d'ajouter une nouvelle facture
	onAdd(ev) {

		let addModal = this.modalCtrl.create('FormTeamPage', { 'objet': null });

		this.odooServ.createObjetResult('team', null, null, addModal, (res) => {

			this.teams.push(res);
			this.odooServ.copiedAddSync('team', res);
			this.odooServ.showMsgWithButton("Team is added", 'top');
		});
	}


	//Cette fonction permet d'appliquer les actions
	//lister dans le menu contextuel
	applyActionOnItem(item, result, event) {

		if (result.slug == "update") {

			let addModal = this.modalCtrl.create('FormTeamPage', { 'objet': item, 'action': 'update' });
			addModal.onDidDismiss((data) => {
				if (data) {
					//Mise à jour du formulaire
					this.odooServ.updateSyncRequest('team', data);
					this.odooServ.updateNoSync('team', data, item.id, 'standart');
					this.odooServ.showMsgWithButton(this.txtLangue.maj_invoice, "top");
				}
			});
			addModal.present();

		}
		//Fin de la requete
	}

	//Aller au prochain slides
	onNextTeam() {
		this.slides.slideNext();
	}

	//Aller au slide précédent
	onPrevTeam() {
		this.slides.slidePrev();
	}

	//Cette fonction permet de changer la liste
	//des vendeurs appartenant à une équipe
	changeMembers() {
		console.log(this.slides.getActiveIndex());
		let currentTeam = this.teams[this.slides.getActiveIndex()];
		this.listMembers(currentTeam);
	}

	/**
	 * Cette fonction permet de lister les membres
	 * en fonction de l'équipe
	 * @param currentTeam Team, l'équipe courante
	 */
	listMembers(currentTeam) {

		this.lgServ.isTable('_ona_user').then(reponse => {
			let members = JSON.parse(reponse), results = [];
			for (let j = 0; j < members.length; j++) {
				const element = members[j];
				if (currentTeam.member_ids.indexOf(element.id) > -1)
					results.push(element);
			}

			this.vendeurs = results;

			//Set statistics on User
			this.lgServ.getStatOfTeam(currentTeam, this.barCanvasLarge, this.txtPop, this.opport).then(res => {
				console.log(res);
				this.barChartLarge = res;
			});

			//Set stat quotations, sale order and invoice
			this.lgServ.getOrdersInvoicesOfTeam(currentTeam, this.pieCanvasLarge, this.txtPop, this.opport);
			this.txtLastMonths = this.lgServ.getMonthName(2) + ", " + this.lgServ.getMonthName(1) + ", " + this.lgServ.getMonthName(0)

		});
	}

	/**
	 * Cette fonction va faire appel au service permettant
	 * de d'afficher à temps réel les membres de l'équipe sur le
	 * terrain
	 * @param team Team, l'équipe courante
	 */
	seeTeamOnTheGround(team) {

		this.navCtrl.push('GroundPage', { 'team': team, 'membres': this.vendeurs, 'owner': this.owner });
	}

	/**
	 * Cette fonction permet d'afficher le Pipeline de
	 * l'équipe sélectionnée
	 * @param team Team, l'équipe courante
	 */
	seePipeline(team) {
		this.navCtrl.push('PipelinePage', { 'team': team, 'partner': 'pipeline' });
	}


	showVendeur(vendeur, event) {
		this.navCtrl.push('ProfilePage', { objet: vendeur, modif: 'no' });
	}


}
