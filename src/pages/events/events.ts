import { Component } from '@angular/core';
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
	IonicPage,
} from 'ionic-angular';

import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';
import { ConfigSync } from '../../config';

import { TranslateService } from '@ngx-translate/core';
import { Evenement } from '../../models/event';


@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html', 
})
export class EventsPage {
	last_date = null;
    current_lang: string;
	public events = [];
	public searchTerm: string = '';
	public animateClass: any;
	private dumpData: any;
	public objLoader;
	public display = false;
	// public btn_display = false;
	public the_partner;
	public titre;
	public txtFiltre = [];
	public max = 10; //Nombre d'éléments max a chargé (ioninfinite scroll)
	private offset = 0; //index à partir duquel débuter
	public isArchived = false;

	private loading;
	// private objLogin: any;
	private user: any;
	private checkSync;
	public defaultImg;
	txtpop: any;

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
		public objEvents: Events,
		private translate: TranslateService

	) {
		//On configure la vue en fonction du partner
		this.translate.get('pop').subscribe(res=>{
			this.txtpop = res;
		})
		this.current_lang = this.translate.getDefaultLang();
		this.the_partner = 'event';
		// this.titre = this.navParams.get('titre');
		this.defaultImg = "assets/images/person.jpg";
		this.objLoader = true;
		
		this.lgServ.formatDate("_ona_"+this.the_partner).then(_date=>{
			this.last_date = _date;
		});

		
		this.lgServ.isTable('me_avocat').then(res => {
			if (res) this.user = JSON.parse(res);			
			
			this.syncOffOnline();
      		this.checkSync = setInterval(() => this.activateSyn(), ConfigSync.timeSync);
		});
	}

	ionViewDidLeave() {
		clearInterval(this.checkSync);
		this.objEvents.unsubscribe('event:changed');
		this.objEvents.unsubscribe('add_event:changed');
	}

	ionViewDidLoad() {
		this.objEvents.subscribe('event:changed', id_partner => {
			for (let i = 0; i < this.events.length; i++) {
				if (this.events[i].id == id_partner) {
					this.events.splice(i, 1);
					break;
				}
			}
		});

		//Evénement lors de la copie d'un objet
		this.objEvents.subscribe('add_event:changed', partner => {
			for (let i = 0; i < this.events.length; i++) {
				if (this.events[i].id == partner.id) {
					this.events.splice(i, 0, partner.item);
					this.odooServ.copiedAddSync(this.the_partner, partner.item);
					break;
				}
			}
		});
	}

	//Cette fonction permet de synchroniser les données
	synchronizing() {
		this.display = true;
		this.setListPartners();
	}

	

	//Cette fonction permet de charger les données
	//lorsque l'utilisateur est en mode offline ou via online (server)
	syncOffOnline() {
		this.lgServ.checkStatus('_ona_' + this.the_partner).then(res => {
			if (res == 'i') {
				//Première utilisation sans connexion
				this.objLoader = false;
			} else if (res == 's' || res == 'w' || res == 'rw') {
				//From Storage
				
				this.lgServ.isTable('_ona_' + this.the_partner).then(result => {
					if (result) {
						this.events = this.onComingEvents(JSON.parse(result));
						console.log(this.events);
						this.dumpData = JSON.parse(result);
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

	//Cette fonction permet d'activer la synchronisation
	activateSyn() {
		this.lgServ.connChange('_ona_' + this.the_partner).then(res => {
			if (res) {
				this.setListPartners();
			} else {
				clearInterval(this.checkSync);
			}
		});
  }
  
  /**
   * Cette fonction permet de récupérer la liste
   * des évènements à venir
   */
  onComingEvents(listEvents: Array<Evenement>){
    let results = [];
    for (let i = 0; i < listEvents.length; i++) {
      const element = listEvents[i];
      if (new Date(element.date_end) >= new Date())
        results.push(element);
    }

    return results;
  }

	/**
   * Cette fonction permet de charger la liste
   * des évènements
   * @param isManual any, il s'agit de l'objet Refresh (ion-refresh)
   *
   **/
	setListPartners(isManual?: any) {

		let params = { options: { offset: 0, max: this.max } };
		this.odooServ.requestObjectToOdoo(this.the_partner, null, this.last_date, false, res => {
			// console.log(res);
			let fromServ = this.loadPartnerFromServer(res);
			console.log(fromServ);
			
			this.odooServ.refreshViewList('_ona_' + this.the_partner, fromServ).then((rep:any)=>{
				
				this.dumpData = rep;
				if (this.display || isManual!==undefined) {
					this.events = this.onComingEvents(rep);
					console.log(this.events);
					this.display = false;
					if (isManual !== undefined) isManual.complete();
				}
			});

			//Store data in sqlLite and save date of last sync
			this.lgServ.setObjectToTable('_ona_' + this.the_partner, fromServ);
			this.lgServ.setSync('_ona_' + this.the_partner + '_date');
			fromServ = null;
		});
	}

	/** 
   * Cette fonction permet de charger la liste des évènements
   * dans un array
   * @param tab Array<JSONObject>, la liste json des évènements
   * 
   * @return Array<Evenement>
   *
   **/
	loadPartnerFromServer(tab) {
		let result = [];

		for (let i = 0; i < tab.length; i++) {
			let objPartner = new Evenement(tab[i]);
			result.push(objPartner);
		}

		return result;
	}

	//AJout des éléments lorsque l'on scroll vers le
	//bas
	doInfinite(infiniteScroll) {
		this.offset += this.max;
		// let params = { options: { offset: this.offset, max: this.max } };
		this.max += 10;

		infiniteScroll.complete();
	}

	/**
	 * Cette fonction permet de rafraichir la page
	 * notamment utilisé dans le cas des procédures de synchronisation
	 * @param refresher any
	 */
	doRefresh(refresher){
		// this.setListPartners(refresher);
		this.syncOffOnline();
		refresher.complete();
	}

	//Cette fonction permet d'executer les actions
	//relatives à un évènement
	onTapItem(item) {

		let actionSheet = this.actionCtrl.create({
			title: item.name,
			cssClass: 'custom-action-sheet',
			buttons: this.getListButtons(item),
		});

		actionSheet.present();
	}


	//Cette fonction permet de définir les actions
	//à appliquer sur un item
	private getListButtons(item) {
		let tab = [];
		this.translate.get('module.events').subscribe(res=>{

			tab.push({
				text: res.detail,
				cssClass: 'btn-sheet-view',
				// icon: 'ios-eye-outline',
				handler: () => {
					//console.log('Voir clicked');
					let objToSend = { objet: item};
					this.navCtrl.push('DetailsEventPage', { toSend: objToSend, section:"coordonnees" });
				},
			});
			
			tab.push({
				text: res.edit,
				cssClass: 'btn-sheet-maj',
				// icon: 'ios-create-outline',
				handler: () => {
					this.callForm(item, this.the_partner);
				},
			});
			
			tab.push({
				text: res.part,
				cssClass: 'btn-sheet-meeting',
				// icon: 'ios-people-outline',
				handler: () => {
					// let objToSend = { objet: item, section:"participant"};
					this.navCtrl.push('AttendeesPage', { objet: item });
				},
			});
		})
			
		return tab;
	}

	/**
   * Cette fonction permet de
   * recherche un élément dans la liste des partners
   *
   **/
	setFilteredItems(ev) {
		if (ev.target.value === undefined) {
			this.events = this.dumpData;
			this.max = 10;
			return;
		}

		var val = ev.target.value;

		if (val != '' && val.length > 2) {
			this.events = this.dumpData.filter(item => {
				let txtNom = item.name + ' ' + item.middle_name + ' ' + item.last_name;
				return txtNom.toLowerCase().indexOf(val.toLowerCase()) > -1;
			});
		} else if (val == '' || val == undefined) {
			this.events = this.dumpData;
			this.max = 10;
		}
	}

	/**
   * Cette fonction permet d'afficher
   * le formulaire et de le modifier
   * @param <Object> objet, l'objet à modifier
   **/
	callForm(objet, type) {
		let addModal = this.modalCtrl.create('FormEventPage', { objet: objet, modif: true, type: this.the_partner, lang: this.txtpop });
		let msgLoading = this.loadCtrl.create({ content: 'Updating is processing. Please a moment...' });

		//callback when modal is dismissed (recieve data from View)
		addModal.onDidDismiss(data => {
			if (data) {
        let message = 'Les informations sur l\'évènement  ont été modifiées';
				msgLoading.present();
        
				//On met à jour les informations (data) dans la base de données interne
        data.date_begin = this.odooServ.formatUTF(new Date(data.date_begin.replace('T',' ')));
        data.date_end = this.odooServ.formatUTF(new Date(data.date_end.replace('T',' ')));
				console.log(data);

				if (objet.id == 0) this.odooServ.updateNoSyncObjet(this.the_partner, data, objet);
				else {
					this.odooServ.updateNoSync(this.the_partner, data, objet.id, 'standart');
					this.odooServ.updateSyncRequest(this.the_partner, data);
				} 

				msgLoading.dismiss();
				this.odooServ.showMsgWithButton(message, 'top', 'toast-success');
			}

		});

		addModal.present();
	}

	//Cette fonction d'enregistrer
	//un nouvel évènement
	onAdd() {
		let addModal = this.modalCtrl.create('FormEventPage', { modif: false, objet: {}, type: this.the_partner, lang: this.txtpop });
		let msgLoading = this.loadCtrl.create({ content: 'Enregistrement en cours...' });

		addModal.onDidDismiss(data => {
			if (data) {
				let message = 'Informations Event '+data.name+' are saved !';
				msgLoading.present();
				data.idx = new Date().valueOf();
        data.date_begin = this.odooServ.formatUTF(new Date(data.date_begin.replace('T',' ')));
        data.date_end = this.odooServ.formatUTF(new Date(data.date_end.replace('T',' ')));
				//On insère dans la bd Interne
				this.events.push(data);
        console.log(data);
				this.odooServ.copiedAddSync(this.the_partner, data);
				this.odooServ.syncCreateObjet(this.the_partner, data);

				msgLoading.dismiss();
				this.odooServ.showMsgWithButton(message, 'top', 'toast-success');
			}
		});

		addModal.present();
  }

	//Cette fonction ouvre le menu gauche
	openLeftMenu() {
		this.menuCtrl.open();
	}

	//Cette fonction permet de faire la requete
	//pour filtrer la liste des events
	filterListPartners(result) {
		this.max = 10;
		let resultats = [];

		for (let i = 0; i < this.dumpData.length; i++) {
			if (this.applyFilterPartner(result, this.dumpData[i])) resultats.push(this.dumpData[i]);
		}

		this.events = this.onComingEvents(resultats);
	}

	//Cette fonction permet de filtrer la liste
	onFilter(theEvent) {

		let popover = this.popCtrl.create('PopFilterPage', { 'events': this.the_partner, lang: this.txtpop });
		popover.present({ ev: theEvent });
		popover.onDidDismiss(result => {
			if (result) {
				this.txtFiltre = result;
				console.log(this.txtFiltre);
				this.filterListPartners(result);
			}
		});
		//fin filtre requete
	}

	//Permet de regrouper la listte en fonction
	//des critères
	onGroup(event) {
		let popover = this.popCtrl.create('GroupNotePage', { 'event': this.titre, lang: this.txtpop });

		popover.present({ ev: event });
		popover.onDidDismiss(result => {
			let tab = [];

			if (result) {
				console.log(result);
				
			}
		});
	}

	//Permet d'appliquer les filtres sur la liste des events
	applyFilterPartner(searchs, objet) {
		let cpt = 0;

		for (let j = 0; j < searchs.length; j++) {
			switch (searchs[j].slug) {
				case 'incoming': {
					if (new Date(objet.date_end) > new Date()) cpt++;
					break;
				}
				case 'own': {
					if (objet.user_id.id == this.user.id) cpt++;
					break;
				}
				case 'booked': {
					if (objet.seats_max == objet.registration_ids.length || new Date(objet.date_begin)< new Date()) cpt++;
					break;
				}
				case 'open': {
					if (objet.seats_max > objet.registration_ids.length || objet.seats_availability!='limited') cpt++;
					break;
				}
				case 'week': {
					if (this.isWeek(objet)) cpt++;
					break;
				}
				case 'all': {
					cpt++;
					break;
				}
				case 'archive': {
					if (!objet.active) {
						cpt++;
						this.isArchived = true;
						console.log('archivee');
					}
					break;
				}
			}
		} //Fin tab searchs

		if (cpt == searchs.length) return true;
		else return false;
  }
  
  /**
   * Cette fonction permet de vérifier les dates d'évènements
   * en semaine
   * @param objet Evenement, objet de type évènement
   * @returns boolean
   */
  private isWeek(objet){
    let trouve = false;

    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    var firstday = new Date(curr.setDate(first));
    var lastday = new Date(curr.setDate(last));

    if(firstday<= new Date(objet.date_begin) && lastday>= new Date(objet.date_begin))
      trouve = true;

    return trouve;
  }

}
