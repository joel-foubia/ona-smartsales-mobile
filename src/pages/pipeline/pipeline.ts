import { Component, ViewChild } from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	LoadingController,
	AlertController,
	ModalController,
	MenuController,
	PopoverController,
	Events,
	Content,
	FabButton,
	ActionSheetController
} from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';
import { Lead } from '../../models/lead';
import { Team } from '../../models/team';
import { ConfigSync, ConfigOnglet } from '../../config';

// import swal from 'sweetalert';
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
	selector: 'page-pipeline',
	templateUrl: 'pipeline.html'
})
export class PipelinePage {

	filter_years = [];
	last_date = null;
	txtSales: any;
	txtSearch: any;
	dumpLeads = [];
	@ViewChild(Content) content: Content;
	@ViewChild(FabButton) fabButton: FabButton;
	searchBtnColor: string = 'light';
	colorFilterBtn: string = 'gris';
	current_lang: string;
	current_team: Team;
	reasons: any;
	objFiltre = [];
	currentStage: any;
	dumpStage = [];
	filtres = [];
	teams = [];
	team: any;
	display_search: boolean = false;
	showQuickFilter: boolean = false;
	roleType: any;
	offset: any;
	max = 10;
	display: any;
	// txtGroup: any;
	objLoader: boolean;
	eventsBinding;

	private list_leads_team: any;
	private checkSync: number;
	listeLeads = [];
	
	titre: any;
	the_partner: any;
	conn_user: any;
	txtpop: any;
	client: any;
	txtLangue: any;
	nbeLeads : Number = 0;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private odooServ: OdooProvider,
		public loadCtrl: LoadingController,
		public alertCtrl: AlertController,
		public modalCtrl: ModalController,
		private lgService: LoginProvider,
		public menuCtrl: MenuController,
		public popCtrl: PopoverController,
		public events: Events,
		public actionCtrl: ActionSheetController,
		public translate: TranslateService
	) {

		this.current_lang = this.translate.getDefaultLang();
		this.translate.get(['pop','module']).subscribe(res=>{
			this.txtpop = res.pop;
			this.txtLangue =res.module.pipeline;
			this.txtSales =res.module.sales;
		});

		// this.defaultImg = 'assets/images/person.jpg';
		this.the_partner = this.navParams.get('partner');
		this.client = this.navParams.get('client');
		this.objLoader = true;
		this.team = this.navParams.get('team');

		this.lgService.formatDate("_ona_leads").then(_date=>{
			this.last_date = _date;
		});

		this.lgService.isTable('me_avocat').then((user) => {
			this.conn_user = JSON.parse(user);
						
			this.syncOffOnline();
			this.checkSync = setInterval(() => this.activateSyn(), ConfigSync.timeSync);
		});
		
		//On appel les evènements clic
		this.bindEvents();
	}

	ionViewDidLeave() {
		clearInterval(this.checkSync);
	}


	ionViewDidLoad() {
	
		this.events.subscribe('add_lead:changed', (partner) => {
			
			for (let j = 0; j < this.listeLeads.length; j++) {
				if (this.listeLeads[j].id == partner.id) {
					this.listeLeads.splice(j, 0, partner.item);
					break;
				}
			}
			
		});

		//Evénement sur une affaire lors de la modification ou archivage
		this.events.subscribe('lead:changed', (id_partner) => {
			
			for (let j = 0; j < this.listeLeads.length; j++) {
				if (this.listeLeads[j].id == id_partner) {
					this.listeLeads.splice(j, 1);
					break;
				}
			}
			
		});

		//Show/Hide fab
		this.lgService.showHideFab(this.content, this.fabButton);

		this.filtres = ConfigOnglet.filtreOpports(this.txtpop);
		this.filter_years = ConfigOnglet.filterYears(this.txtpop);

		//Retrieve raisons of lost
		this.getListPerte();
	}

	synchronizing() {
		this.display = true;
		this.getListStage();
	}

	/**
	 * Cette méthode permet de lier les
	 * évènements tap sur les boutons
	 */
	bindEvents(){

		this.eventsBinding = {
			onTap: (event: any) => {
				this.onTapItem(event.objet, event.theEvent);
			},
			onStage: (event: any) => {
				this.showListStage(event.objet, event.theEvent);
			},
			onQuotation: (event: any) => {
				
				this.onAddQuotation(event.objet);
			}
		};
	}

	//Cette fonction permet d'activer la synchronisation
	activateSyn() {
		this.lgService.connChange('_ona_leads').then((res) => {
			if (res) {
				this.getListStage();
			} else {
				clearInterval(this.checkSync);
			}
		});
	}

	/**
	 * Cette fonction permet de rafraichir la page
	 * notamment utilisé dans le cas des procédures de synchronisation (manuel)
	 * @param refresher any
	 */
	doRefresh(refresher){
		// this.getListStage(refresher);
		this.syncOffOnline();
		refresher.complete();
	}

	
	/**
	 *  Cette fonction permet de faire la recherche sur les piplines
	 * @author foubs	
	 * @param ev
	 */
	setFilteredItems(ev) {

		if (ev.target.value === undefined) {
			this.listeLeads = this.dumpLeads;
			this.max = 10;
			this.txtSearch = undefined;
			return;
		}

		var val = ev.target.value;
		this.txtSearch = val;

		if (val != '' && val.length > 2) {
			let list_sales = this.listeLeads.filter(item => {
				let txtNom = item.name + ' ' + item.partner_id.name+' '+item.country_id.name +' '+ item.city + ' '+ item.partner_name;
				return txtNom.toLowerCase().indexOf(val.toLowerCase()) > -1;
			});

			this.listeLeads = list_sales;
			
		} else if (val == '' || val == undefined) {
			this.listeLeads = this.dumpLeads;
			this.txtSearch = undefined;
			this.max = 10;
		}

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
			this.resetObjets(0, "team", true);
			this.resetObjets(0, "stage", true);
			this.resetObjets(0, "year", true);

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
	 * Cette méthode permet de filtrer les Prospects 
	 * en fonction des groupes team, ou stage
	 * @param stage JSONObject, le stage selectionné
	 */
	filterbyObjets(objet, type){
		
		objet.selected = !objet.selected;
		this.resetObjets(objet, type);

		let results = [];

		for (let j = 0; j < this.dumpLeads.length; j++) {
			if(type=='stage' && this.dumpLeads[j].stage_id.id == objet.me.id.me)
				results.push(this.dumpLeads[j]);	
			else if(type=='team' && this.dumpLeads[j].team_id.id == objet.id)
				results.push(this.dumpLeads[j]);	
			else if(type=='year' && (new Date(this.dumpLeads[j].write_date).getFullYear() == objet.id || objet.id=='all'))
				results.push(this.dumpLeads[j]);
		}

		this.listeLeads = results;
	}

	/**
	 * Permet à l'utilisateur de 
	 * @param objet JSONObject
	 * @param type string, le type de groupe
	 */
	private resetObjets(objet, type, options?: any){
		if(type=='team'){
			for (let i = 0; i < this.teams.length; i++) {
				if(this.teams[i].id != objet.id)
					this.teams[i].selected = false;
				
				if(options) this.teams[i].selected = false;
			}

		}else if(type=='stage'){
			for (let i = 0; i < this.dumpStage.length; i++) {
				if(this.dumpStage[i].me.id.me != objet.me.id.me)
					this.dumpStage[i].selected = false;

				if(options) this.dumpStage[i].selected = false;
			}
		
		}else if(type=='year'){
			for (let i = 0; i < this.filter_years.length; i++) {
				if(this.filter_years[i].id != objet.id)
					this.filter_years[i].selected = false;

				if(options) this.filter_years[i].selected = false;
			}
		}
	}

	//Cette fonction permet de charger les données
	//lorsque l'utilisateur est en mode offline ou via online (server)
	syncOffOnline() {

		this.lgService.checkStatus('_ona_leads').then((res) => {
			if (res == 'i') {
				//Première utilisation sans connexion (ajout d'un casier)
				this.objLoader = false;
			} else if (res == 's' || res == 'w' || res == 'rw') {
				//From Storage

				let currentYear = new Date().getFullYear();
				//Start leads request
				this.lgService.isTable('_ona_leads').then((result) => {
					if (result) {
						let pipelines = [], objets = JSON.parse(result);
						let allopports = [];
						allopports = this.getOpportByFilters(objets, currentYear);

						if(this.client != undefined){
							for (let k = 0; k < objets.length; k++) {
								if(objets[k].partner_id.id == this.client.id){
									pipelines.push(objets[k])
								}								
							}
						}
						else{
							pipelines = this.getOpportByFilters(objets, currentYear);
						}

						// console.log(pipelines);

						this.listeLeads = pipelines;
						this.dumpLeads = pipelines;

						this.objLoader = false;
					}
				});
				//End of leads request

				this.lgService.isTable('_ona_stage').then((_stages) => {
					if (_stages) {
						this.getStagesOfTeam(JSON.parse(_stages)).then((list_stages: any)=>{
							this.dumpStage = list_stages;			
						});
					}
				});

				//SYnc de la liste depuis le serveur
				if (res == 'w' || res == 'rw') {
					this.objLoader = false;
					this.getListStage();
				}
			}
		});
	}


	/**
	 * Cette fonction permet de filter la liste
	 * des opportunités en fonction de 
	 * @param objets Array<Lead>
	 */
	getOpportByFilters(objets: Array<Lead>, currentYear?: any){

		let results = [];
		let activity = this.navParams.get('activity');
		// console.log(activity);
		// Load opportunities depending on type user wants to view, either oppotunities with next action or all opportunities
		for (let j = 0; j < objets.length; j++) {

			if((currentYear!==undefined && (new Date(objets[j].write_date).getFullYear()== currentYear) || currentYear==undefined)){

				if (activity!==undefined && this.conn_user.id == objets[j].user_id.id && objets[j].next_activity_id.id == activity.id && this.lgService.sameDate(objets[j].date_action)) {
					results.push(objets[j]);
					// console.log(results);
				}else if(this.navParams.get('won')){
						
					if (this.lgService.valideDate(objets[j].date_open))
						if (this.conn_user.id == objets[j].user_id.id && 
							this.lgService.dateBetween(objets[j].date_open) &&
							(objets[j].probability == 100 || objets[j].probability == 100)
						) {
							// console.log('trouve');
							results.push(objets[j]);
						}
	
				}else if(this.navParams.get('won')===undefined && activity===undefined){
					// console.log('ici');
					if (this.conn_user.id == objets[j].user_id.id) {
						results.push(objets[j]);
					}
				}

			}

		}

		return results;
	}

	//Cette fonction permet de récupérer la liste
	//Des raisons sur la perte d'une opportunité
	getListPerte() {
		this.lgService.isTable('_ona_reason').then((res) => {
			if (res) {
				this.reasons = JSON.parse(res);
			} else {
				this.odooServ.requestObjectToOdoo('reason', null, null, false, (res) => {
					// console.log(res);
					this.reasons = res;
					this.lgService.setTable('_ona_reason', res);
				});
			}
		});
	}

	/**
	 * Cette fonction permet de récupérer la
	 * liste des stages liées à une équipe de vente
	 */
	getStagesOfTeam(stages){
		
		return new Promise((resolve, reject)=>{
			
			this.getListTeams().then((equipes: Array<Team>)=>{
				// console.log(equipes);
				// console.log(this.conn_user);
				this.current_team = new Team(null);
				for (let i = 0; i < equipes.length; i++) {
					if(equipes[i].id== this.conn_user.sale_team_id.id){
						this.current_team = equipes[i];
						break;
					}
				}

				let results = [];
				for (let j = 0; j < stages.length; j++) {
					if(this.current_team.stage_ids.indexOf(stages[j].me.id.me)>-1)
						results.push(stages[j]);
				}

				resolve(results);
			});

		});
	}

	//Cette fonction permet d'obtenir la liste
	// des stages d'une affaire en fonction de l'utilisateur
	getListStage(isManual?: any) {
		this.odooServ.requestObjectToOdoo('stage', null, null, false, (res) => {
			
			this.getStagesOfTeam(res).then((list_stages: any)=>{
				this.dumpStage = list_stages;
				this.loadListAffaires(list_stages, isManual);
			});

			//On met à jour la liste des stages
			this.lgService.setTable('_ona_stage', res);
		});
	}

	//Obtenir la liste des équipes de vente
	getListTeams() {
		
		return new Promise((resolve, reject)=>{

			this.lgService.isTable('_ona_team').then((res) => {
				if (res) {
					this.teams = JSON.parse(res);
					resolve(JSON.parse(res));
				} else {
					this.odooServ.requestObjectToOdoo('team', null, null, false, (res) => {
						let results = [];
						
						for (let i = 0; i < res.length; i++) results.push(new Team(res[i]));
	
						this.teams = results;
						this.lgService.setTable('_ona_team', results);
						this.lgService.setSync('_ona_team_date');
						resolve(results);
						
					});
				}
			});

		});
		
	}

	//Cette fonction permet de classer les affaires
	//en fonction des stages d'une affaire
	//@param stages Array<JSONObject>, contient la liste des stages (affaires)
	loadListAffaires(stages, isRefresh?: any) {

		this.odooServ.requestObjectToOdoo('leads', null, this.last_date, false, (res) => {
			if (res.length != 0) {
				// console.log(res);
				let results = [], pipelines = [];
				//On synchronise avec la table
				for (let i = 0; i < res.length; i++) results.push(new Lead('m', res[i]));

				if (this.display || isRefresh!==undefined) {
					
					this.odooServ.refreshViewList('_ona_leads', results).then((rep: any)=>{
						
						//Synchronisation activé
						let currentYear = new Date().getFullYear();
						pipelines = this.getOpportByFilters(rep, currentYear);
						this.listeLeads = pipelines;
						this.dumpLeads = pipelines;
						this.display = false;
						// this.nbeLeads = this.getTotalLeads(); 
						
						if(isRefresh!==undefined) isRefresh.complete();
					});
				}

				this.lgService.setObjectToTable('_ona_leads', results);
				this.lgService.setSync('_ona_leads_date');
			}
		}, isRefresh);
	}

	//Permet de récupérer l'id de la team et affiche
	//le pipeline en fonction de la team
	onChange(ev) {
		// console.log(ev);
		// this.txtGroup = Team.findTeam(parseInt(ev), this.teams);
		this.odooServ.groupLeadsByTeams('leads', 'team', parseInt(ev)).then(
			(res: any) => {
				this.list_leads_team = res;
				this.listeLeads = res;
			},
			(err) => {
				this.odooServ.showMsgWithButton(err, 'top');
			}
		);
	}

	//AJout des éléments lorsque l'on scroll vers le
	//bas
	doInfinite(infiniteScroll) {
		this.offset += this.max;
		// let params = { options: { offset: this.offset, max: this.max } };
		this.max += 10;

		infiniteScroll.complete();
	}

	//Permet d'enregistrer une nouvelle affaire
	//et de l'inserer dans la liste des affaires
	onAdd(event) {
		let addModal = this.modalCtrl.create('FormLeadPage', { objet: null, action: 'insert', type: 'opportunity', lang: this.txtpop });

		this.odooServ.createObjetResult('leads', null, null, addModal, (res) => {
			let tab = [], tab_ids;
			
			this.listeLeads.push(res);
			this.odooServ.copiedAddSync('leads', res); //ON insère dans la bd liste
			this.odooServ.showMsgWithButton(this.txtLangue.opport_add, 'top', 'toast-success');
		});
	}

	/**
   * Cette fonction permet d'ouvrir
   * un menu Pop up pour des sous rubriques
   * @param data, la liste des sous rubrique
   * @param myEvent, on affiche
   *
   **/
	onTapItem(item, theEvent) {

		let menu_actionSheet = this.actionCtrl.create({
			title: item.name,
			cssClass: 'custom-pipeline-sheets',
			// cssClass: 'my-custom-action-sheet custom-action-sheetMain',
			buttons: this.getListButtons(item)
		});
		
		menu_actionSheet.present();
	}

	/**
	 * Cette méthode permet d'afficher la liste
	 * des actions à effectuer sur une opportunité
	 * 
	 * @param item Lead
	 */
	private getListButtons(item) {

		let tab = [], mymenus = [];
		if(item.type=='opportunity')
			mymenus = ConfigOnglet.loadOngletsPipe(item.active, this.txtpop);
		else
			mymenus = ConfigOnglet.loadOnglets(item.active, this.txtpop);

		for (let i = 0; i < mymenus.length; i++) {

			tab.push({
				text: mymenus[i].titre,
				cssClass: 'icon ' + mymenus[i].img,
				handler: () => {
					if (mymenus[i].slug == 'detail') {
						let objToSend = { 
							rubrique: mymenus[i], objet: item, user: null, type: this.the_partner, login: null
						};
	
						this.navCtrl.push('DetailLeadOpportPage', { toSend: objToSend });
	
					} else if (mymenus[i].slug == 'meeting') {
						this.navCtrl.push('AgendaPage', { lead: item });
					} else if (mymenus[i].slug == 'quotation') {
						this.navCtrl.push('SalesPage', { lead: item });
					
					}else if (mymenus[i].slug == 'phonecall') {
						
						if(item.mobile!="")
							this.odooServ.doCall(item.mobile,"");
						else if(item.mobile=="" && item.phone!="")
							this.odooServ.doCall(item.phone,"");
						else
							this.odooServ.showMsgWithButton(this.txtLangue.opport_phonecall, "top",'toast-info');
						
					} else {
						this.applyActionOnItem(item, mymenus[i]);
					}
				}
			});
			
		}

		return tab;
	}

	/**
	 * Cette fonction permet à l'utilisateur
	 * de changer de stage
	 *
	 **/
	showListStage(item, event) {
		let stage_id = item.stage_id.id;
		let popover = this.popCtrl.create('PopStagePage', { objet: this.dumpStage, current: stage_id, leads: true, lang: this.txtpop });

		popover.present({ ev: event });
		popover.onDidDismiss((result) => {
			if (result) {
				let id = item.id;
				let data = { stage_leads: true, data: result };
				item.stage_id.id = result.me.id.me;
				item.stage_id.name = result.me.name.me;

				//On modifie le stage de l'affaire
				this.odooServ.updateObjectByAction('stage', 'leads', id, data, null, false, false, (res) => {
					this.odooServ.updateNoSync('leads', item, item.id, 'standart');
					setTimeout(() => {
						this.updateListStagesAffaires('pipeline');
					}, 500);
				});
			}
		});
	}

	//Mise à jour de la liste des leads organiser en tabs
	updateListStagesAffaires(params) {

		this.lgService.isTable('_ona_leads').then((response) => {
			
			let results = JSON.parse(response), pipelines = [];
			let currentYear = new Date().getFullYear();

			pipelines = this.getOpportByFilters(results, currentYear);
			this.listeLeads = pipelines;
			// this.leads = this.odooServ.filterAffairesByStages(this.dumpStage, pipelines, params);
		});
	}

	//Cette fonction permet d'afficher une liste
	//des collaborateurs à qui transférer l'affaire
	showListUser(item, event) {
		let others = { user: true };

		this.lgService.isTable('_ona_user').then((_data) => {
			if (_data) {
				let popover = this.popCtrl.create('PopUserPage', { data: JSON.parse(_data), msg: true, lang: this.txtpop });
				popover.present({ ev: event });
				popover.onDidDismiss((result) => {
					if (result) {
						let id = item.id;
						let data = { user_leads: true, single: result };

						//On modifie le stage de la note
						this.odooServ.updateObjectByAction(
							'user',
							'leads',
							id,
							data,
							this.dumpStage,
							false,
							false,
							(res) => {
								if (res) {
									this.odooServ.removeObjetFromList(this.listeLeads, item.id, item.stage_id.id);
								}
							}
						);
					}
				});
			}
		});
	}

	openLeftMenu() {
		this.menuCtrl.open();
	}

	onFilter(theEvent) {
		let popover = this.popCtrl.create('PopFilterPage', { 'res.partner': 'opportunity', lang: this.txtpop });
		popover.present({ ev: theEvent });
		popover.onDidDismiss((result) => {
			if (result) {
				this.objFiltre = result;
				// console.log(this.objFiltre);
				this.filterListPartners(result);
			}
		});
		//fin filtre requete
	}

	//Cette fonction permet de faire la requete
	//pour filtrer la liste des clients
	filterListPartners(result) {

		let resultats = [];
		this.max = 10;
		
		if(result.length==0){
			this.listeLeads = this.dumpLeads;
			return;	
		}
				
		for (let i = 0; i < this.dumpLeads.length; i++) {
			if (this.applyFilterPartner(result, this.dumpLeads[i])) resultats.push(this.dumpLeads[i]);
		}

		this.listeLeads = resultats;
		// this.leads = this.odooServ.filterAffairesByStages(this.dumpStage, resultats, 'pipeline');
		console.log('Leads =>',this.listeLeads);
	}

	//Permet d'appliquer les filtres sur la liste des clients
	applyFilterPartner(searchs, objet) {
		let cpt = 0;

		for (let j = 0; j < searchs.length; j++) {
			switch (searchs[j].slug) {
				case 'activity': {
					//Personne
					if (objet.next_activity_id.id != 0) cpt++;
					break;
				}
				case 'deadline': {
					//Impayés
					if (new Date(objet.date_deadline) < new Date()) cpt++;
					break;
				}
				case 'probability': {
					//Homme
					if (objet.probality >= 50) cpt++;
					break;
				}
				case 'priority': {
					//Personne
					if (objet.priority > 1) cpt++;
					break;
				}
				
			}
		} //Fin tab searchs

		if (cpt == searchs.length) return true;
		else return false;
	}

	//Cette fonction permet d'appliquer les actions
	//lister dans le menu contextuel
	applyActionOnItem(item, result, event?:any) {

		let my_data = null;
		// console.log(result);
		if (result.slug == 'update') {
			let addModal = this.modalCtrl.create('FormLeadPage', { objet: item, action: 'update', type: 'opportunity', lang: this.txtpop});
			addModal.onDidDismiss((data) => {
				if (data) {
					//Mise à jour du formulaire

					this.odooServ.updateObjectByAction(result.slug, 'leads', item.id, data, null, false, false, (res) => {
						this.odooServ.updateNoSync('leads', data, item.id, 'standart');
						
					});
				}
			});
			addModal.present();

		} else if (result.slug == 'call') { //On programme un appel

			let addModal = this.modalCtrl.create('FormCallPage', { lead: item, modif: false});
			addModal.onDidDismiss((data) => {
				if (data) {
					//Add to calls list
					let message = this.txtLangue.opport_call;
					data.idx = new Date().valueOf();
										
					//On sauvegarde dans la bd temporaire (pour sync)
					this.odooServ.syncCreateObjet('call', data);
					this.odooServ.copiedAddSync('call', data);
					this.odooServ.showMsgWithButton(message, 'top', 'toast-success');
					
				}
			});

			addModal.present();

		}else if (result.slug == 'couleur') {
			this.onColor(event, item);
		} else if (result.slug == 'archive') {
			my_data = { archive: !item.active };
			item.active = !item.active;
			this.odooServ.updateNoSync('leads', item, item.id, 'standart');
		} else if (result.slug == 'won') {

			// item.active = false;
			item.won = true;
			item.probability = 100;
			item.stage_id.id = this.dumpStage[this.dumpStage.length - 1].me.id.me;
			item.stage_id.name = this.dumpStage[this.dumpStage.length - 1].me.name.me;
			my_data = { won: true, active: true, probability: 100, stage_won: item.stage_id };
			this.odooServ.updateNoSync('leads', item, item.id, 'standart');

		} else if (result.slug == 'lost') {
			
			let popover = this.popCtrl.create('PopNote2Page', { pipeline: true, reasons: this.reasons, lang: this.txtpop });
			
			popover.present({ ev: event });
			popover.onDidDismiss((result) => {
				let tab = [];
				if (result) {
					// console.log(result);
					item.lost = true;
					item.active = false;
					// console.log('Reasons Result : ', result);
					item.lost_reason.id = result.me.id.me;
					item.lost_reason.name = result.me.name.me;
					my_data = { lost: item.lost_reason, id: item.id };

					this.odooServ.updateNoSync('leads', item, item.id, 'standart');
					this.odooServ.showMsgWithButton(this.txtLangue.opport_loss, 'top', 'toast-error');
				}
			});
		}

		//On execute la requete
		if (my_data) {

			this.odooServ.updateObjectByAction(result.slug, 'leads', item.id, my_data, null, false, false,
				(res) => {
					if (result.slug == 'archive' || result.slug == 'lost' || result.slug == 'won') {
						setTimeout(() => {
							this.updateListStagesAffaires('pipeline');
						}, 700);

					} 
			});
		}
		//Fin de la requete
	}

	//Cette fonction permet de modifier la couleur
	//d'arrière plan d'une affaire
	onColor(event, leads) {
		
	} //End update color

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
	 * Cette méthode permet de créer le Devis
	 * 
	 * @param lead Lead, objet Lead
	 */
	onAddQuotation(lead){

		let addModal = this.modalCtrl.create('FormSalePage', { modif: false, objet: {}, type: 'vente', param: lead });
		let msgLoading = this.loadCtrl.create({ content: this.txtSales.statut_add });

		addModal.onDidDismiss(data => {
			if (data) {
				let message = this.txtSales.txt_add;
				msgLoading.present();
				data.idx = new Date().valueOf();

				//On insère dans la bd Interne
				// this.sales.push(data);

				this.odooServ.copiedAddSync('vente', data);
				this.odooServ.syncCreateObjet('vente', data);

				msgLoading.dismiss();
				this.odooServ.showMsgWithButton(message, 'top', 'toast-success');
      		}
      
		});

		addModal.present();
	}

}
