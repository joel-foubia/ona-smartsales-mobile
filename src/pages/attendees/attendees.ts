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
import { PopOverPage } from '../pop-over/pop-over';
import { TranslateService } from '@ngx-translate/core';
import { Participant } from '../../models/participant';

@IonicPage()
@Component({
  selector: 'page-attendees',
  templateUrl: 'attendees.html',
})
export class AttendeesPage {

  last_date = null;
  residual: number;
  evenement: any;
  current_lang: string;
	public participants = [];
	public searchTerm: string = '';
	public animateClass: any;
	private dumpData: any;
	public objLoader;
	public display = false;

	public the_partner;

	public txtFiltre = [];
	public max = 10; //Nombre d'éléments max a chargé (ioninfinite scroll)
	private offset = 0; //index à partir duquel débuter
	public isArchived = false;
	private loading;
	private checkSync;
	public defaultImg;

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
		this.current_lang = this.translate.getDefaultLang();
    	this.the_partner = 'participant';
    	this.evenement = this.navParams.get('objet');
		this.residual = this.evenement.seats_max - this.evenement.registration_ids.length;
		this.objLoader = true;
		
		this.lgService.formatDate("_ona_"+this.the_partner).then(_date=>{
			this.last_date = _date;
		});

		this.syncOffOnline();

	}

	ionViewDidLeave() {
		clearInterval(this.checkSync);
		this.events.unsubscribe('attendee:changed');
		this.events.unsubscribe('add_attendee:changed');
	}

	ionViewDidLoad() {
		this.events.subscribe('attendee:changed', id_partner => {
			for (let i = 0; i < this.participants.length; i++) {
				if (this.participants[i].id == id_partner) {
					this.participants.splice(i, 1);
					break;
				}
			}
		});

		//Evénement lors de la copie d'un objet
		this.events.subscribe('add_attendee:changed', partner => {
			for (let i = 0; i < this.participants.length; i++) {
				if (this.participants[i].id == partner.id) {
					this.participants.splice(i, 0, partner.item);
					this.odooService.copiedAddSync(this.the_partner, partner.item);
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
		this.lgService.checkStatus('_ona_' + this.the_partner).then(res => {
			if (res == 'i') {
				//Première utilisation sans connexion
				this.objLoader = false;
			} else if (res == 's' || res == 'w' || res == 'rw') {
				//From Storage
				
				this.lgService.isTable('_ona_' + this.the_partner).then(result => {
					if (result) {
						this.participants = this.getAttendeesOfEvents(JSON.parse(result));
						console.log(this.participants);
						this.dumpData = this.participants;
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
   * Cette fonction permet de filtrer la liste des participants
   * et d'afficher celle qui correspondent à l'évènement choisit
   * @param attendees Array<Participant>, le tableau des participants
   * @returns Array<Participant>
   */
  getAttendeesOfEvents(attendees: Array<Participant>){
    let results = [];

    for (let i = 0; i < attendees.length; i++) {
      const element = attendees[i];
      if(element.event_id.id == this.evenement.id)
        results.push(element);
    }

    return results;
  }

	//Cette fonction permet d'activer la synchronisation
	activateSyn() {
		this.lgService.connChange('_ona_' + this.the_partner).then(res => {
			if (res) {
				this.setListPartners();
			} else {
				clearInterval(this.checkSync);
			}
		});
	}

	/**
   * Cette fonction permet de charger la liste
   * des partenaires (clients, tribunaux, contacts)
   * @param isManual any, il s'agit de l'objet Refresh (ion-refresh)
   *
   **/
	setListPartners(isManual?: any) {
		
		let params = { options: { offset: 0, max: this.max } };
		this.odooService.requestObjectToOdoo(this.the_partner, null, this.last_date, false, res => {
			// console.log(res);
			let fromServ = this.loadPartnerFromServer(res);
			
			this.odooService.refreshViewList('_ona_' + this.the_partner, fromServ).then((rep:any)=>{
				
				this.dumpData = this.getAttendeesOfEvents(rep);

				if (this.display || isManual!==undefined) {		
					this.participants = this.getAttendeesOfEvents(rep);
					this.display = false;
					if(isManual!==undefined) isManual.complete();
				}
			});
			
			//Store data in sqlLite and save date of last sync
			this.lgService.setObjectToTable('_ona_' + this.the_partner, fromServ);
			this.lgService.setSync('_ona_' + this.the_partner + '_date');
			fromServ = null;
		});
	}

	/** 
   * Cette fonction permet de charger la liste des participants
   * dans un array
   * @param tab Array<JSONObject>, la liste json des participants
   * 
   * @return Array<Partner>
   *
   **/
	loadPartnerFromServer(tab) {
		let result = [];

		for (let i = 0; i < tab.length; i++) {
			let objPartner = new Participant(tab[i]);
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
		this.syncOffOnline();
		// refresher.complete();
		// this.setListPartners(refresher);
	}

	//Cette fonction permet d'executer les actions
	//relatives à un participant
	onTapItem(item) {
		
		// let display_name = item.name + ' ' + item.middle_name + ' ' + item.last_name;
		// display_name = display_name.toUpperCase();

		// let actionSheet = this.actionCtrl.create({
		// 	title: display_name,
		// 	cssClass: 'custom-action-sheet',
		// 	buttons: this.getListButtons(item),
		// });

		// actionSheet.present();
	}


	

	/**
   * Cette fonction permet de
   * recherche un élément dans la liste des partners
   *
   **/
	setFilteredItems(ev) {
		if (ev.target.value === undefined) {
			this.participants = this.dumpData;
			this.max = 10;
			return;
		}

		var val = ev.target.value;

		if (val != '' && val.length > 2) {
			this.participants = this.dumpData.filter(item => {
				let txtNom = item.name;
				return txtNom.toLowerCase().indexOf(val.toLowerCase()) > -1;
			});
		} else if (val == '' || val == undefined) {
			this.participants = this.dumpData;
			this.max = 10;
		}
	}

	/**
   * Cette fonction permet d'afficher
   * le formulaire et de le modifier
   * @param <Object> objet, l'objet à modifier
   **/
	callForm(objet, type) {
		let addModal = this.modalCtrl.create('FormAttendeePage', { objet: objet, modif: true, current_event: this.evenement });
		let msgLoading = this.loadCtrl.create({ content: 'Updating is processing. Please a moment...' });

		//callback when modal is dismissed (recieve data from View)
		addModal.onDidDismiss(data => {
			if (data) {
				console.log(data);
				let message = 'Les informations sur le participant ont été modifiées';
				msgLoading.present();

				//On met à jour les informations (data) dans la base de données interne
								
				if (objet.id == 0) this.odooService.updateNoSyncObjet(this.the_partner, data, objet);
				else {
					this.odooService.updateNoSync(this.the_partner, data, objet.id, 'standart');
					this.odooService.updateSyncRequest(this.the_partner, data);
				}

				msgLoading.dismiss();
				this.odooService.showMsgWithButton(message, 'top', 'toast-success');
			}

		});

		addModal.present();
	}

	//Cette fonction d'enregistrer
	//un nouveau partner (client, contact ou tribunal)
	onAdd() {
		let addModal = this.modalCtrl.create('FormAttendeePage', { modif: false, objet: {}, current_event: this.evenement });
		let msgLoading = this.loadCtrl.create({ content: 'Enregistrement en cours...' });

		addModal.onDidDismiss(data => {
			if (data) {
				let message = 'Informations of '+data.name+' are saved !';
				msgLoading.present();
				data.idx = new Date().valueOf();

				//On insère dans la bd Interne
				this.participants.push(data);

				this.odooService.copiedAddSync(this.the_partner, data);
				this.odooService.syncCreateObjet(this.the_partner, data);

				msgLoading.dismiss();
				this.odooService.showMsgWithButton(message, 'top', 'toast-success');
			}
		});

		addModal.present();
	}

	//Cette fonction ouvre le menu gauche
	openLeftMenu() {
		this.menuCtrl.open();
	}

  //Cette fonction permet de désigner un utilisateur
  //présent
	present(objet){
      objet.state = 'done';
      let params = { id: objet.id, state: 'done'};
      this.odooService.updateNoSync(this.the_partner, objet, objet.id, 'standart');
      this.odooService.updateSyncRequest(this.the_partner, params);
      
      this.odooService.showMsgWithButton('The attendee '+objet.name+' is present !', 'top', 'toast-success');
  }
  
  //Cette fonction permet d'annuler une réservation
  //faite par le participant
  annuler(objet){
      objet.state = 'cancel';
      let params = { id: objet.id, state: 'cancel'};
      this.odooService.updateNoSync(this.the_partner, objet, objet.id, 'standart');
      this.odooService.updateSyncRequest(this.the_partner, params);
      
      this.odooService.showMsgWithButton('The attendee '+objet.name+' is present !', 'top', 'toast-success');
  }
  
}