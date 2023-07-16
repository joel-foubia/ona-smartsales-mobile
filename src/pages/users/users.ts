import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { ConfigSync } from '../../config';
import { OdooProvider } from '../../providers/odoo/odoo';
import { Partner } from '../../models/partner';
import * as moment from 'moment';
import { User } from '../../models/user';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
	selector: 'page-users',
	templateUrl: 'users.html'
})
export class UsersPage {
	txtNative: any;
	eventsBinding: any;
	txtLang: any;
	last_date = null;
	users = [];
	dumpUsers = [];
	max = 10;

	checkSync: number;
	objLoader = true;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public menuCtrler: MenuController,
		public lgService: LoginProvider,
		private translate: TranslateService,
		public odooService: OdooProvider
	) {
		this.lgService.isTable('me_avocat').then((res) => {
			if (res) {
				this.syncOffOnline();
				this.checkSync = setInterval(() => this.activateSyn(), ConfigSync.timeSync);
			}
		});

		this.translate.get([ 'form', 'native' ]).subscribe((res) => {
			this.txtLang = res.form;
			this.txtNative = res.native;
		});

		this.lgService.formatDate('_ona_user').then((_date) => {
			this.last_date = _date;
		});
	}

	/**
	 * Cette méthode permet de formater la liste
	 * des utilisateurs
	 * 
	 * @param tab Array<any>, tableau d'objets
	 */
	loadPartnerFromServer(tab) {
		let result = [];

		for (let i = 0; i < tab.length; i++) {
			let objPartner = new User(this.txtLang, tab[i]);
			result.push(objPartner);
		}

		return result;
	}

	//This method is used to synchronise users list from Server
	synchronizing() {
		this.odooService.requestObjectToOdoo('user', null, this.last_date, false, (res) => {
			// console.log(res);
			let fromServ = this.loadPartnerFromServer(res);
			//this.clients = fromServ;
			this.odooService.refreshViewList('_ona_user', fromServ).then((rep: any) => {

				this.dumpUsers = rep;
				this.users = rep;

				//Store data in sqlLite and save date of last sync
				this.lgService.setTable('_ona_user', rep);
				this.lgService.setSync('_ona_user_date');
				fromServ = null;
			});
		});
	}

	syncOffOnline() {
		this.lgService.checkStatus('_ona_user').then((res) => {
			if (res == 'i') {
				//Première utilisation sans connexion
				// this.objLoader = false;
			} else if (res == 's' || res == 'w' || res == 'rw') {
				//From Storage

				this.lgService.isTable('_ona_user').then((result) => {
					if (result) {
						this.users = JSON.parse(result);
						this.dumpUsers = JSON.parse(result);
					}

					this.objLoader = false;
				});

				//SYnc de la liste depuis le serveur
				if (res == 'w' || res == 'rw') {
					this.objLoader = false;
					this.synchronizing();
				}
			}
		});
	}

	activateSyn() {
		this.lgService.connChange('_ona_user').then((res) => {
			if (res) {
				// this.getListStage();
				this.synchronizing();
			} else {
				clearInterval(this.checkSync);
			}
		});
	}

	ionViewDidLeave() {
		clearInterval(this.checkSync);
	}

	ionViewDidLoad() {
		this.loadBindEvents();
	}

	openMenu() {
		this.menuCtrler.open();
	}

	doInfinite(infiniteScroll) {
		this.max += 10;
		infiniteScroll.complete();
	}

	//Load events on item
	loadBindEvents() {
		this.eventsBinding = {
			onClick: (event: any) => {
				event.objUser.visible = true;
				this.odooService.getListBlocsUser(event.objUser).then((res: any) => {
					for (let j = 0; j < res.length; j++) {
						console.log(res[j]);
						if (res[j].state == 'opportunity') {
							event.objUser.opports = res[j].total_won_opports;
						} else if (res[j].state == 'saleorder') {
							event.objUser.total_orders = res[j].total_saleorders;
						}
					}
					console.log(event.objUser);
					// this.blocs = res;
				});
			},
			onClose: (event: any) => {
				console.log(event.objUser);
				event.objUser.visible = false;
			},
			onCall: (event: any) => {
				console.log(event.objUser.mobile);
				if (event.objUser.mobile != '') this.odooService.doCall(event.objUser.mobile, '');
				else this.odooService.showMsgWithButton(this.txtNative.launch_dial_phone, 'top', 'toast-info');
			},
			onView: (event: any) => {
				this.navCtrl.push('ProfilePage', { objet: event.objUser, modif: 'no' });
			}
		};
	}
}
