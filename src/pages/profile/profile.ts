import { Component } from '@angular/core';
import { NavParams, MenuController, ModalController, Events, IonicPage } from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';
// import { FormUserPage } from '../../pages/form-user/form-user';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../models/user';
import { ConfigOnglet } from '../../config';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
	selector: 'page-profile',
	templateUrl: 'profile.html'
})
export class ProfilePage {
	modif: any;
	blocs = [];
	objPref: any = {};
	langues: any;
	language: any;
	price_filter;
	public update;
	public user;
	public objSpinner;
	public current_lang;
	private txtLangue;

	constructor(
		public navParams: NavParams,
		public menuCtrl: MenuController,
		public modalCtrl: ModalController,
		private odooServ: OdooProvider,
		public translate: TranslateService,
		public storage: Storage,
		private lgServ: LoginProvider,
		public evT: Events
	) {
		this.current_lang = this.translate.getDefaultLang();
		this.user = this.navParams.get('objet');
		this.modif = this.navParams.get('modif');


		this.translate.get('form').subscribe((reponse) => {
			this.txtLangue = reponse;
			this.langues = ConfigOnglet.langues(reponse);
		});

		this.storage.get('ona_prix_filtre').then((prix) => {
			if (prix) this.objPref.price_filter = JSON.parse(prix);
			else {
				this.objPref.price_filter = 100000;
				storage.set('ona_prix_filtre', this.objPref.price_filter);
			}
		});

		this.storage.get('ona_distance_filtre').then((dist) => {
			if (dist) this.objPref.distance = JSON.parse(dist);
			else this.objPref.distance = 5;
		});

		this.lgServ.getCurrentValSync().then((reponse) => {
			if (reponse != null && reponse == false) this.update = reponse;
			else this.update = true;
		});
	}

	ionViewDidLoad() {
		this.odooServ.getListBlocsUser(this.user).then((res: any) => {
			console.log(res);
			this.blocs = res;
		});
	}

	openLeftMenu() {
		this.menuCtrl.open();
	}

	changeValue(event, type) {
		switch (type) {
			case 'lang': {
				this.user.lang.titre = this.find(event, this.langues);
				this.changeLangue();
				break;
			}
			case 'dist': {
				this.objPref.distance = event;
				this.lgServ.setTable('ona_distance_filtre', this.objPref.distance);
				break;
			}
		}
	}

	/**
   * Cette fonction récupère un objet sur la base du modèle lang
   * @param id int, identifiant utilisé pour récupérer l'objet
   * @param list Array<any>, liste des langues
   */
	private find(id, list) {
		for (let i = 0; i < list.length; i++) {
			if (list[i].id == id) return list[i].text;
		}
	}

	//Cette fonction permet de changer la langue de l'utilisateur
	changeLangue() {
		let prefix;
		if (this.user.lang.id !== undefined) prefix = this.user.lang.id.split('_');
		else prefix = this.user.lang.split('_');

		// console.log(prefix);
		this.odooServ.updateUser(this.user);
		this.odooServ.updateSyncRequest('user', this.user);
		localStorage.setItem('current_lang', prefix[0]);
		this.evT.publish('lang:done', prefix[0]);
	}

	//Active ou désactive les mises à jour automatique
	notify() {
		if (this.update) {
			this.lgServ.desactiveSync(true);
			this.odooServ.showMsgWithButton(this.txtLangue.notif_sync, 'top');
		} else {
			this.lgServ.desactiveSync(false);
			this.odooServ.showMsgWithButton(this.txtLangue.help_sync, 'top');
		}
	}

	/**
   * Cette fonction permet d'ouvrir la page d'édition
   * des informations de l'utilisateur
   * 
   **/
	edit() {
		let addModal = this.modalCtrl.create('FormUserPage', { objet: this.user });

		//callback when modal is dismissed (recieve data from View)
		addModal.onDidDismiss((data) => {
			if (data) {
				this.objSpinner = true;
				let message = this.txtLangue.notif_user;

				console.log(data);
				this.odooServ.updateNoSync('user', data, data.id, 'standart');
				this.odooServ.updateSyncRequest('user', data);
				this.odooServ.showMsgWithButton(message, 'top', 'toast-success');
			}
		});

		addModal.present();
	}

	priceAdded() {
		if (
			this.objPref.price_filter == undefined &&
			(this.objPref.price_filter == '' || this.objPref.price_filter == 0)
		) {
			// this.storage.set('ona_prix_filtre', 100000);
			this.lgServ.setTable('ona_prix_filtre', 100000);
		} else {
			this.lgServ.setTable('ona_prix_filtre', this.objPref.price_filter);
			// this.storage.set('ona_prix_filtre', this.objPref.price_filter);
		}
	}
}
