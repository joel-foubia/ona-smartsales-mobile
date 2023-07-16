import { Component } from '@angular/core';
import { NavController, LoadingController, Events, IonicPage, AlertController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
// import { EditSettingPage } from '../edit-setting/edit-setting';
// import { HomePage } from '../home/home';
import { ImageProvider } from '../../providers/image/image';
// import { DetailsAbonnePage } from '../details-abonne/details-abonne';
import { ConfigModels } from '../../config';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
	selector: 'page-setting',
	templateUrl: 'setting.html'
})
export class SettingPage {
	private currentAbonne: boolean = false;
	logs: any = [];
	public objSetting: any;
	public abonneNumber: any;
	public objLogo: any;
	public customSetting : any;
	txtLang: any;

	constructor(
		public navCtrl: NavController,
		private lgService: LoginProvider,
		public alertCtrl: AlertController,
		public ev: Events,
		public loadCtrl: LoadingController,
		public evEVT: Events,
		public imgServ: ImageProvider,
		private translate: TranslateService
	) {
		this.lgService.getSettingUser().then((data) => {
			if (data) {
				//Récupère les informations sur l'abonnement du client
				this.objSetting = JSON.parse(data);
				this.objSetting['abonneNumber'] = '';

				//On affiche le numéro du CLient
				this.lgService.getDataAbonne().then((reponse) => {
					this.abonneNumber = JSON.parse(reponse).client;
					this.objSetting.abonneNumber = this.abonneNumber;
					this.listLogsSubscription();
				});

				//On met à jour le logo ans la page paramètres
				this.imgServ.getCallbackURL(this.objSetting.logo, (res) => {
					this.objLogo = res;
				});
			}
		});
	}

	ionViewDidLoad() {

		this.translate.get("parameters").subscribe(res=>{
			this.txtLang = res;
		});
	}

	addSubscription(){

		// this.saveLogSubscription();
		this.ev.publish('slide:changed', 1);
		this.lgService.remove('setting');
		
		this.deleteDataBase();
		this.navCtrl.setRoot('HomePage');
	}

	/**
	 * This method is used to change
	 * @param item any
	 */
	changeSubscription(event, item){
		console.log(event);
		if(event.checked){

			let alert = this.alertCtrl.create({
				title: this.txtLang.lbl_sub+item.abonneNumber,
				message: this.txtLang.txt_sub,
				buttons: [
				  {
					text: this.txtLang.btn_cancel,
					role: 'cancel',
					handler: () => {
					  console.log('Cancel clicked');
						item['is_subscriber'] = false;
						event.checked = false;
						console.log(item);
					}
				  },
				  {
					text: this.txtLang.btn_sub,
					handler: () => {
						for (let j = 0; j < this.logs.length; j++) {
							this.logs[j]['is_subscriber'] = false;
						}
	
						item.is_subscriber = true;
						// this.saveLogSubscription();
						this.ev.publish('subscription:changed', {'toSlide':1, 'abonneNumber': item.abonneNumber, 'subNumber': item.subNumber});

						this.deleteDataBase();
						this.navCtrl.setRoot('HomePage');
	
					}
				  }
				]
			  });
			alert.present();

		}else{
			event.checked = true;
		}
	}

	//Définition de la liste des logs
	listLogsSubscription() {

		this.lgService.isTable('subscription_log').then((res) => {
			if (res) {
				this.logs = JSON.parse(res);
				
				for (let j = 0; j < this.logs.length; j++) {
					this.logs[j]['is_subscriber'] = false;
					if (
						this.logs[j].abonneNumber == this.objSetting.abonneNumber &&
						this.logs[j].subNumber == this.objSetting.subNumber
					) {
						this.currentAbonne = true;
						this.customSetting = this.logs[j];
						this.logs[j].is_subscriber = this.currentAbonne;

						break;
					}
				}

				console.log(this.logs);
				if (!this.currentAbonne) {
					this.logs.push(this.objSetting);
					this.lgService.setTable('subscription_log', this.logs);
				}
			} else {
				this.logs.push(this.objSetting);
				this.lgService.setTable('subscription_log', this.logs);
			}
		});
	}
	

	//Cette fonction ouvre la page détaillées d'un
	//abonnement
	showDetails(item) {
		this.navCtrl.push('DetailsAbonnePage', { setting: item });
		
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
	 * Cette fonction va supprimer la bd qui contient les informations
	 * de l'utilisateur connecté
	 */
	deleteDataBase() {
		
		//On supprime les données de l'abonné
		this.lgService.remove('abonne');
		this.lgService.remove('setting');
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

}
