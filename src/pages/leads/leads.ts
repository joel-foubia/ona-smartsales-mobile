import { Component } from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	LoadingController,
	AlertController,
	ModalController,
	MenuController,
	PopoverController,
	Events
} from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';
import { Lead } from '../../models/lead';
import { ConfigSync } from '../../config';
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
	selector: 'page-leads',
	templateUrl: 'leads.html',
})
export class LeadsPage {
	
	txtFiltre = [];
	txtLangue: any;
	current_lang: string;
	isArchived: boolean = false;
	objLoader: boolean;
	checkSync: number;
	user: any;
	public leads = [];
	display = false;
	dumpData = [];
	titre: any;
	the_partner: any;
	public max = 10; //Nombre d'éléments max a chargé (ioninfinite scroll)
	private offset = 0; //index à partir duquel débuter
	poptext: any;
	
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
		public events: Events,
		public translate: TranslateService
	) {
		this.current_lang = this.translate.getDefaultLang();
		
		//On récupére les expressions pour la traduction
		this.translate.get(['pop','module']).subscribe(res=>{
			this.poptext = res.pop;
			this.txtLangue = res.module.leads;
		});

		this.objLoader = true;
		this.the_partner = this.navParams.get('partner');
		this.titre = this.navParams.get('titre');
		
		this.lgService.isTable('me_avocat').then(res => {
			if (res) {
				this.user = JSON.parse(res);
				this.syncOffOnline();
				this.checkSync = setInterval(() => this.activateSyn(), ConfigSync.timeSync);
			}
		});
	}

	ionViewDidLeave() {
		clearInterval(this.checkSync);
	}


	//Cette fonction permet d'executer les actions
	//relatives à un client
	onTapItem(item, theEvent) {

		let popover = this.popCtrl.create('PopOverPage', {'menus':item, lang: this.poptext}, { cssClass: 'custom-popover'});
		
		popover.present({ev : theEvent});
    	popover.onDidDismiss((result)=>{
        if(result){
        //   console.log(result);

          if(result.slug=='update'){
          	this.callForm(item, 'update');
          }else if(result.slug=='detail'){
            let objToSend = { objet: item, type: this.the_partner };
			this.navCtrl.push('DetailLeadOpportPage', { toSend: objToSend });
          
          }else if(result.slug=='call'){

            let addModal = this.modalCtrl.create('FormCallPage', { lead: item, modif: false});
			addModal.onDidDismiss((data) => {
				if (data) {
					//Add to calls list
					let message = 'L\'appel téléphonique a été programmée';
					
					data.idx = new Date().valueOf();
					console.log('Call programmed : ', data);
					
					//On sauvegarde dans la bd temporaire (pour sync)
					this.odooService.syncCreateObjet('call', data);
					this.odooService.copiedAddSync('call', data);
					this.odooService.showMsgWithButton(message, 'top', 'toast-success');
					
				}
			});

			addModal.present();

          }else{
            this.applyActionOnItem(item, result, theEvent);
          }
           
        } 
    });
		
	}

  /**
   * Cette fonction permet d'afficher
   * le formulaire et de le modifier
   * @param <Object> objet, l'objet à modifier
   **/
	callForm(objet, type) {
		let addModal = this.modalCtrl.create('FormLeadPage', { objet: objet, type: 'lead', action: 'update', lang: this.poptext });
		let msgLoading = this.loadCtrl.create({ content: '' });

		//callback when modal is dismissed (recieve data from View)
		addModal.onDidDismiss(data => {
			if (data) {
				console.log(data); 
				let message = this.txtLangue.maj_lead;
				msgLoading.present();

				//On met à jour les informations (data) dans la base de données interne
				this.odooService.updateNoSync(this.the_partner, data, objet.id, 'standart');

				if (objet.id == 0) this.odooService.updateNoSyncObjet(this.the_partner, data, objet);
				else this.odooService.updateSyncRequest(this.the_partner, data); 
					
				msgLoading.dismiss();
				this.odooService.showMsgWithButton(message, 'top', 'toast-success');

			}
		});

		addModal.present();
	}

	//Apply action on the item
	//Cette fonction permet d'appliquer les actions
  //lister dans le menu contextuel
  applyActionOnItem(item, result, event){
    
    let my_data = null;

    if(result.slug=="opportunity"){
      my_data = { opportunity: true };
    }else if(result.slug=="lost"){
      my_data = { lost: !item.active };
    }else if(result.slug=="archive"){
      my_data = { archive: !item.active };
    }

    //On execute la requete
    if(my_data){

        this.objLoader = true;
        this.odooService.updateObjectByAction(result.slug, this.the_partner, item.id, my_data, null, false, false, (res)=>{
            this.objLoader = false;
            if(result.slug=='archive'){
				item.active = false;
				this.odooService.showMsgWithButton(this.txtLangue.archive,"top",'toast-info');
			}else if(result.slug=='opportunity'){
				item.type = 'opportunity';
				this.odooService.showMsgWithButton(this.txtLangue.to_opport,"top",'toast-info');
			}else if(result.slug=='lost'){
				item.active = false;
				this.odooService.showMsgWithButton(this.txtLangue.to_lost,"top",'toast-info');
			}
			
			this.odooService.updateNoSync(this.the_partner, item, item.id, 'standart');
			
			this.updateListLeads(item);
			
        });
    }
    //Fin de la requete
  }

  updateListLeads(lead: Lead){
	 
	for (let i = 0; i < this.leads.length; i++) {
		if(this.leads[i].id==lead.id){
			this.leads.splice(i, 1);
        	break;
		}
	}
  }

	//AJout des éléments lorsque l'on scroll vers le
	//bas
	doInfinite(infiniteScroll) {
		this.offset += this.max;
		let params = { options: { offset: this.offset, max: this.max } };
		this.max += 10;

		infiniteScroll.complete();
	}

	//Cette fonction permet d'activer la synchronisation
	activateSyn() {
		this.lgService.connChange('_ona_' + this.the_partner).then(res => {
			if (res) {
				this.setLeadsList();
			} else {
				clearInterval(this.checkSync);
			}
		});
	}

	//Cette fonction permet de charger les données
	//lorsque l'utilisateur est en mode offline ou via online (server)
	syncOffOnline() {
		this.lgService.checkStatus('_ona_' + this.the_partner).then(res => {
			if (res == 'i') {
				//Première utilisation sans connexion
				this.objLoader = false;
			} else if (res == 's' || res == 'w' || res == 'rw') {
				//From Storage
				
				this.lgService.isTable('_ona_' + this.the_partner).then(result => {
					if (result) {
						let results = JSON.parse(result), tab = [];

						for (var i = 0; i < results.length; i++) {
							if(results[i].type=='lead')
								tab.push(results[i]);
						}

						this.leads = this.filterByOwn(tab);
						// console.log(this.leads);
						this.dumpData = tab;
					}

					this.objLoader = false;
				});

				//SYnc de la liste depuis le serveur
				if (res == 'w' || res == 'rw') {
					this.objLoader = false;
					this.setLeadsList();
				}
			}
		});
	}

	ionViewDidLoad() {
		// this.setLeadsList();
	}


	/**
	 * Cette fonction permet de trier la liste
	 * des leads en fonction de l'utilisateur qui l'a créé
	 * @param leads Array<Lead>
	 */
	filterByOwn(leads: Array<Lead>){
		let results = [];

		for (let j = 0; j < leads.length; j++) {
			if(leads[j].user_id.id==this.user.id && leads[j].active)
				results.push(leads[j]);
		}

		return results;
	}

	//Cette fonction ouvre le menu gauche
	openLeftMenu() {
		this.menuCtrl.open();
	}

	/**
	 * Cette fonction permet de rafraichir la page
	 * notamment utilisé dans le cas des procédures de synchronisation
	 * @param refresher any
	 */
	doRefresh(refresher){
		this.setLeadsList(refresher);
	}

	//Cette méthode permet de mettre à jour la liste des leads
	setLeadsList(isManual?: any) {
		
		let params = { options: { offset: 0, max: this.max } };
		this.odooService.requestObjectToOdoo(this.the_partner, null, null, false, res => {
			let tabs = [];
			let fromServ = this.loadLeadFromServer(res);
			for (let i = 0; i < fromServ.length; i++) {
				if(fromServ[i].type=='lead')
					tabs.push(fromServ[i]);
			}
			
			this.dumpData = tabs;

			if (this.display || isManual!==undefined) {
				this.leads = this.filterByOwn(tabs);
				this.display = false;
				if(isManual!==undefined) isManual.complete();
			}

			this.lgService.setTable('_ona_' + this.the_partner, fromServ);
			this.lgService.setSync('_ona_' + this.the_partner + '_date');
			fromServ = null;

		}, isManual);
	}

	/** 
   * Cette fonction permet de charger la liste des partners
   * dans un array
   * @param tab Array<JSONObject>, la liste json des partners
   * 
   * @return Array<Partner>
   *
   **/
	loadLeadFromServer(tab) {
		let result = [];

		for (let i = 0; i < tab.length; i++) {

			let objPartner = new Lead(this.the_partner, tab[i]);
			result.push(objPartner);
		}

		return result;
	}

	//Permet d'appliquer les filtres sur la liste des clients
	applyFilterPartner(searchs, objet) {
		let cpt = 0;
		
		// console.log(searchs);
		for (let j = 0; j < searchs.length; j++) {
			switch (searchs[j].slug) {
				case 'pistes': {
					//Personne
					if (objet.user_id.id == this.user.id && objet.active){
						cpt++;
						// console.log(objet);
					} 
					break;
				}
				case 'notes': {
					//description (note client)
					if (objet.description != '') cpt++;
					break;
				}
				case 'archive': {
					if (!objet.active) {
						cpt++;
						this.isArchived = true;
						// console.log('archivee');
					}
					break;
				}
			}
		}//Fin tab searchs
	
		if (cpt == searchs.length) return true;
		else return false;
	} 


	//Cette fonction d'enregistrer
	//un nouveau partner (client, contact ou tribunal)
	onAdd(){
			
		let addModal = this.modalCtrl.create('FormLeadPage', {'objet':null, 'type':'lead', lang: this.poptext, 'action':'insert'});
		let msgLoading = this.loadCtrl.create({content: this.txtLangue.register });
			
		addModal.onDidDismiss((data) => {

			if(data){
			let message = this.txtLangue.created;

			msgLoading.present();
			data.idx = new Date().valueOf();
			data.type = 'lead';
			
			//On insère dans la bd Interne
			this.leads.push(data);
			
			//On sauvegarde dans la bd temporaire (pour sync)
			this.odooService.copiedAddSync(this.the_partner, data);
			this.odooService.syncCreateObjet(this.the_partner, data);
			
			msgLoading.dismiss(); 
			this.odooService.showMsgWithButton(message,'top');
			
			}

		});

		addModal.present();
	}

  /**
   * Cette fonction permet de
   * recherche un élément dans la liste des partners
   *
   **/
  	setFilteredItems(ev) {
		
		if (ev.target.value === undefined) {
			this.leads = this.dumpData;
			this.max = 10;
			return;
		}

		var val = ev.target.value;

		if (val != '' && val.length > 2) {
			this.leads = this.dumpData.filter(item => {
				let txtNom = item.name + ' ' + item.partner_id.name + ' ' + item.contact_name;
				return txtNom.toLowerCase().indexOf(val.toLowerCase()) > -1;
			});
		} else if (val == '' || val == undefined) {
			this.leads = this.dumpData;
			this.max = 10;
		}
	}

	//Cette fonction permet de faire la requete
	//pour filtrer la liste des clients
	filterListPartners(result) {

		this.max = 10;
		let resultats = [];

		for (let i = 0; i < this.dumpData.length; i++) {
			if (this.applyFilterPartner(result, this.dumpData[i])) resultats.push(this.dumpData[i]);
		}

		this.leads = resultats;
	}

	//Cette fonction permet de filtrer la liste
	onFilter(theEvent) {

		let popover = this.popCtrl.create('PopFilterPage', { 'piste': this.the_partner, 'lang': this.poptext });
		popover.present({ ev: theEvent });
		popover.onDidDismiss(result => {
			if (result) {
				this.txtFiltre = result;
				// console.log(this.txtFiltre);
				this.filterListPartners(result);
			}
		});
		//fin filtre requete
	}


}
