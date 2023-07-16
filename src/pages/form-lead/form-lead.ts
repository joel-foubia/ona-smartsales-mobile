import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, Slides, PopoverController, ModalController } from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';
import { AffaireProvider } from '../../providers/affaire/affaire';

import { Lead } from '../../models/lead';
import { User } from '../../models/user';

@IonicPage()
@Component({
	selector: 'page-form-lead',
	templateUrl: 'form-lead.html'
})
export class FormLeadPage {

	user: User;
	public lead : Lead;
	public action;
	public is_modif = false;
	public tags = [];
	public reminders = [];
	public attendees = [];
	public listTitles = [];
	public list_activities = [];
	private currentPartner;
	public type = false;
	leadName;

	constructor(
		public vc: ViewController,
		public navParams: NavParams,
		public popCtrl: PopoverController,
		public modalCtrl: ModalController,
		private odooServ: OdooProvider,
		private lgServ: LoginProvider,
		private formAff: AffaireProvider
	) {
		this.lead = this.navParams.get('objet');
		this.action = this.navParams.get('action');
		this.leadName = this.navParams.get('name');

		if (this.leadName !== undefined) {
			this.lead = new Lead('n', null);
			this.lead.name = this.leadName;

			console.log('Name : ', this.lead);
		}

		if (this.navParams.get('type') !== undefined && this.navParams.get('type') == 'opportunity') {
			this.type = true;
			// console.log('Type');
		}

		if (this.lead == null /* || this.leadName != undefined */) {
			// console.log('New lead');
			this.lead = new Lead('n', null);
			if (this.type) {
				this.lead.type = 'opportunity';
			} else {
				this.lead.type = 'lead';
			}
			console.log('lead', this.lead);
			
		} else if (this.lead != null && this.leadName == undefined) {
			this.is_modif = true;
			this.loadObjetsFromRemote('category');
			// this.loadObjetsFromRemote('activite');
			//this.loadObjetsFromRemote('res_client');
		}

		this.lgServ.isTable('me_avocat').then(_data=>{
			this.user = JSON.parse(_data);
		});

		this.onSelectObjet('title');
		this.onSelectObjet('activite');
	}

	ionViewDidLoad() {}

	//Cette fonction permet d'afficher la liste des tags
	//ou la liste des rappels
	private loadObjetsFromRemote(type) {
		let elements = [];

		if (type == 'category') elements = this.lead.tag_ids;
		

		this.odooServ.getTags(type, elements, false, (res) => {
			console.log(res);
			if (type == 'category') this.tags = res;
		});
	}

	//Cette fonction va récupérer la liste
	//des natures d'affaires, les statuts, les tribunaux
	//les employés qui sont enregistrés en bd
	//@param type string, correspond au type d'objet que l'on souhaite récupérer
	onSelectObjet(type) {
		let alias = type;

		this.lgServ.isTable('_ona_' + alias).then((data) => {
			if (data) {
				let res = JSON.parse(data);
				if (type == 'title') this.listTitles = res;
				else if (type == 'activite') this.list_activities = res;
			} else {
				this.formAff.setListObjetsByCase(alias, false, (res) => {
					if (type == 'title') this.listTitles = res;
					else if (type == 'activite') this.list_activities = res;

					this.lgServ.setTable('_ona_' + alias, res);
				});
			}
		});
	}

	/**
   * Cette fonction permet de modifier la
   * les attributs de l'objet affaire
   **/
	changeValue(event, type) {
		switch (type) {
			case 'title': {
				this.lead.title.name = this.find(event, this.listTitles, '');
				break;
			}
			case 'activite': {
				this.lead.next_activity_id.name = this.find(event, this.list_activities, '');
				break;
			}
		}
	}

	//Cette fonction permet de
	//retrouver un objet à partir de l'id
	//@param id int, identifiant de l'objet recherché
	//@return string
	private find(id, list, type) {
		for (let i = 0; i < list.length; i++) {
			if (list[i].me.id.me == parseInt(id)) {
				return list[i].me.name.me;
			}
		}
	}

	//Ajouter un tag ou un reminder à partir d'une
	//fenêtre Pop up
	addObjetFromPop(event, type) {
		let elements = [];
		if (type == 'category') elements = this.tags;
		else elements = this.reminders;

		console.log(type);
		let popover = this.popCtrl.create('PopTagPage', { lead: type }, { cssClass: 'custom-popaudio' });

		popover.present({ ev: event });
		popover.onDidDismiss((result) => {
			if (result) {
				console.log(result);
				let find = false;

				for (let i = 0; i < result.tags.length; i++) {
					//On vérifie si le tableau n'est pas vide
					if (elements !== undefined) {
						for (let j = 0; j < elements.length; j++)
							if (elements[j].me.id.me == result.tags[i].me.id.me) {
								find = true;
								break;
							}
					}

					//On insère les éléments dans le tableau vide
					if (!find || elements.length == 0) elements.push(result.tags[i]);
				}

				//Ici on met à jour les attributs de l'objet Agenda
				for (let i = 0; i < result.tab.length; i++) {
					if (type == 'category') {
						//tags

						if (this.lead.tag_ids.indexOf(result.tab[i]) == -1 || this.lead.tag_ids.length == 0)
							this.lead.tag_ids.push(result.tab[i]);
					} else {
						//reminders
						/*if(this.lead.alarm_ids.indexOf(result.tab[i])==-1 || this.lead.alarm_ids.length==0)
              		this.lead.alarm_ids.push(result.tab[i]);*/
					}
				}

				if (result.add != '') {
					this.odooServ.editTag(type, result, (res) => {
						console.log(res);
						if (type == 'category') {
							this.tags.push(res);
							this.lead.tag_ids.push(res.me.id.me);
							this.odooServ.showMsgWithButton('Item Added', 'top');
						} else {
							this.reminders.push(res);
							/*this.lead.alarm_ids.push(res.me.id.me);
              	this.odooServ.showMsgWithButton("Rappel ajouté", 'top');*/
						}
					});
				}

				//On met à jour les attributs tags et reminders du Controller
				if (type == 'category') this.tags = elements;
				else this.reminders = elements;
			}
		}); //Fin du Pop Tag
	}

	/**
   * Cette fonction permet de sélectionner les élements
   * dans une liste
   * @param partner string, le nom du modèle
   */
	selectPartner(partner, champ) {
		let data = { data: partner };
		let modal = this.modalCtrl.create('HelperPage', data);
		modal.onDidDismiss((_data) => {
			if (_data) {
				// console.log(_data);
				if (partner == 'client') {
					this.setPrefillData(_data);
				} else if (partner == 'country') {
					this.lead.country_id = _data;
				} else if (partner == 'state') {
					this.lead.state_id = _data;
				}
			}
		});

		modal.present();
	}

	//ajouter un tag
	changeTag(tag, type) {
		this.odooServ.editTag(type, tag, (res) => {
			//tag.me.name.me = res;
			this.odooServ.showMsgWithButton('Item updated', 'top');
		});
	}

	//Retirer un tag de l'affaire
	removeTag(tag, index, type) {
		let elements;

		if (type == 'category') {
			this.tags.splice(index, 1);
			elements = this.lead.tag_ids;
		} else if (type == 'remind') {
			/*this.reminders.splice(index,1);
    	elements = this.lead.alarm_ids;*/
		}

		//On met à jour les attributs de l'objet
		for (let i = 0; i < elements.length; i++) {
			if (tag.me.id.me == elements[i]) {
				if (type == 'category') this.lead.tag_ids.splice(i, 1);
				break;
			}
		}
	}

	//Fermer le formulaire
	close() {
		this.vc.dismiss();
	}

	saveItem() {
		
		if(!this.is_modif){
			this.lead.team_id = this.user.sale_team_id;
			this.lead.company_currency = this.user.currency_id;
		}

		if (this.lead.name == ''){
			this.odooServ.showMsgWithButton("Please fill up the Lead's name and customer fields", 'bottom');
		}else{
			this.vc.dismiss(this.lead);
		} 
	}

	onModelChange(event) {
		console.log(event);
	}

	//Cette fonction permet de préremplir le formulaire Lead
	setPrefillData(data) {

		this.lead.city = data.city;
		this.lead.partner_name = data.name;
		// this.lead.a = data.street;
		this.lead.email_from = data.email;
		this.lead.phone = data.phone;
		this.lead.mobile = data.mobile;
		this.lead.title = data.title;
		this.lead.fax = data.fax;
		this.lead.partner_id.id = data.id;
		this.lead.partner_id.name = data.name;
	}
}
