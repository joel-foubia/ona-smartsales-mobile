import { Component } from '@angular/core';
import { ViewController, NavParams, IonicPage, Events, NavController, AlertController } from 'ionic-angular';
import { ImageProvider } from '../../providers/image/image';
import { LoginProvider } from '../../providers/login/login';
import { TranslateService } from '@ngx-translate/core';
import { AfProvider } from '../../providers/af/af';
import { Storage } from '@ionic/storage';
import { ConfigModels } from '../../config';

@IonicPage()
@Component({
	selector: 'page-details-abonne',
	templateUrl: 'details-abonne.html'
})
export class DetailsAbonnePage {
	objLogo: any;
	objSetting: any;
	section;
	allMenus = [];
	modules = [];
	txtLang: any;
	is_current: boolean;

	constructor(
		public vc: ViewController,
		public navParams: NavParams,
		private imgServ: ImageProvider,
		public lgService: LoginProvider,
		public translate: TranslateService,
		public ev: Events,
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public storage: Storage,
		public afServ: AfProvider
	) {
		this.getMenus();
		this.section = 'details';
		this.objSetting = this.navParams.get('setting');
		this.imgServ.getCallbackURL(this.objSetting.logo, (res) => {
			this.objLogo = res;
		});
	}

	getMenus() {
		
		this.lgService.isTable('_ona_modules').then((data) => {
			this.allMenus = JSON.parse(data);
			console.log('list', this.allMenus);
			let myLang = localStorage.getItem('current_lang');
			
			for (let k = 0; k < this.allMenus.length; k++) {
			
				if(this.allMenus[k]!=null){

					this.modules.push({
						active: this.allMenus[k].active,
						component: this.allMenus[k].component,
						css: this.allMenus[k].css,
						icon: this.allMenus[k].icon,
						slug: this.allMenus[k].slug,
						title: this.allMenus[k].title[myLang],
						id: this.allMenus[k].id
					});
				}
				
			}
		});
	}

	ionViewDidLoad() {

		this.translate.get("parameters").subscribe(res=>{
			this.txtLang = res;
		});

		this.getCurrentSub();
	}

	/**
	 * 
	 * @param item Module to enable/disable in local storage
	 */
	update(item) {

		for (let i = 0; i < this.allMenus.length; i++) {
			if (item.id == this.allMenus[i].id) {
				this.allMenus[i].active = item.active;
				this.lgService.isTable('_ona_modules').then((data) => {
					var newModules = JSON.parse(data);
					newModules = this.allMenus;
					this.storage.set('_ona_modules', JSON.stringify(newModules)).then(() => {
						this.ev.publish('module:selected', this.allMenus);
					});
					if (item.active == true) {
						this.afServ.checkModuleAvailability(item).then(
							(res) => {
								// this.afServ.promptPremiumSub();
								this.modules[i].active = false;
							},
							(err) => {
							}
						);
					}
				});
			}
		}
	}

	/**
   * Cette fonction permet de rediriger le 
   * utilisateur vers la page lui permettant 
   * de changer son abonnement (SLide 2)
   *
   **/
  changeAbonnement() {

	//this.lgService.setTable("subscription_log", this.objSetting);
	let alert = this.alertCtrl.create({
		title: this.txtLang.lbl_sub,
		message: this.txtLang.txt_sub,
		buttons: [
			{
				text: this.txtLang.btn_cancel,
				role: 'cancel',
				handler: () => {}
			},
			{
				text: this.txtLang.btn_sub,
				handler: () => {
					this.saveLogSubscription();
					this.ev.publish('slide:changed', 1);
					this.lgService.remove('setting');

					this.deleteDataBase();
					this.navCtrl.setRoot('HomePage');
					// this.vc.dismiss();
				}
			}
		]
	});

	alert.present();
 }

	close() {
		this.vc.dismiss();
	}

  /**
   * Cette fonction va supprimer la bd qui contient les informations
   * de l'utilisateur connecté
   */
	deleteDataBase() {
		//On supprime les données de l'abonné
		this.lgService.remove('abonne');
		this.lgService.remove('_ona_date');
		this.lgService.remove('_last_synchro');
		localStorage.removeItem('is_update');

		//On supprime les données de l'utilisateur
		this.lgService.remove('login');
		this.lgService.remove('is_sync');
		this.lgService.remove('me_avocat');

		//On supprime les données des modules
		let list_tables = ConfigModels.tab_models;
		for (let i = 0; i < list_tables.length; i++) {
			const element = list_tables[i];
			this.lgService.remove('_ona_' + element);
			this.lgService.remove('_ona_' + element + '_date');
		}
	}

	//cette méthode permet de faire des logs subscription
	saveLogSubscription() {
		this.lgService.isTable('subscription_log').then((res) => {
			if (res) {
			} else {
				let current_tab = [];
				current_tab.push(this.objSetting);
				this.lgService.setTable('subscription_log', current_tab);
			}
		});
	}

	/**
	 * This method is used to retrieve
	 * current subscription
	 */
	private getCurrentSub(){

		this.lgService.getSettingUser().then((data) => {
			if (data) {
				//Récupère les informations sur l'abonnement du client
				let currentSetting = JSON.parse(data);

				//On affiche le numéro du CLient
				this.lgService.getDataAbonne().then((reponse) => {
					let abonneNumber = JSON.parse(reponse).client;
						currentSetting['abonneNumber'] = abonneNumber;
					
					if(currentSetting.subNumber == this.objSetting.subNumber && currentSetting.abonneNumber == this.objSetting.abonneNumber){
						this.is_current = true;
					}
				});
			}
		});		
	}

}
