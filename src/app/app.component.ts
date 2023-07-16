import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
//import { DataProvider } from '../providers/data/data';
import { ImageProvider } from '../providers/image/image';
import { OdooProvider } from '../providers/odoo/odoo';
import { LoginProvider } from '../providers/login/login';

// import { LoginPage } from '../pages/login/login';
// import { MainPage } from '../pages/main/main';

import { TranslateService } from '@ngx-translate/core';
// import { ImgCacheService } from 'ng-imgcache';
import { ImgCacheService } from '../global';
import { Storage } from '@ionic/storage';
// import { HomePage } from '../pages/home/home';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: any;

	pages = [];
	settings: any[];
	sections: any[];
	allMenus = [];
	public sqlite: SQLite;
	public avocat = null;
	public mon_logo: any;
	public defaultImg;
	public isSync = false;
	public last_update;

	constructor(
		public platform: Platform,
		public statusBar: StatusBar,
		public splashScreen: SplashScreen,
		public lgService: LoginProvider,
		public menuCtrl: MenuController,
		public events: Events,
		public storage: Storage,
		private imgProvider: ImageProvider,
		private odooServ: OdooProvider,
		private lgServ: LoginProvider,
		private translate: TranslateService,
		public imgCacheServ: ImgCacheService
	) {

		if (localStorage.getItem('first_smart') != null && localStorage.getItem('is_login') != null) {
			// this.rootPage = 'HomePage';
			this.rootPage = 'LoginPage';

		}else if (localStorage.getItem('first_smart') != null && localStorage.getItem('is_login') == null) {
			this.rootPage = 'HomePage';
			// this.rootPage = 'LoginPage';
		}else if (localStorage.getItem('is_subscriber') != null && localStorage.getItem('is_login') == null) {
			this.rootPage = 'LoginPage';
			// this.rootPage = 'LoginPage';
		} else {
			
			this.rootPage = 'PresentPage';
		}

		this.initializeApp();
		this.events.subscribe('module:selected', (data) => {
			this.storage.get('_ona_modules').then((modules) => {
				this.setModulesOfUser(JSON.parse(modules));
			});
		});
		// used for an example of ngFor and navigation
	}

	getMenus() {
		this.lgService.isTable('setting').then((data) => {
			this.allMenus = JSON.parse(data).modules;
		});
	}

	/**
	 * Function to subscribe and listen when subscription data is available in local database
	 */
	subscribeSetting() {
		this.events.subscribe('setting:available', (data) => {
			console.log('Setting available, subscribing')
			this.storage.get('_ona_modules').then((modules) => {
				this.setModulesOfUser(JSON.parse(modules));
			});
		});
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// alert('start');
			// this.translate.addLangs([ 'en', 'fr', 'es', 'de' ]);

			this.settingLanguage();
			this.subscribeSetting();

			this.imgCacheServ
				.initImgCache()
				.subscribe((v) => console.log('init', v), (err) => console.log('fail init ', err));

			this.lgServ.isTable('_last_synchro').then((reponse) => {
				if (reponse) this.last_update = reponse;
			});
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.splashScreen.hide(); // in Browser

			this.statusBar.styleDefault();
			this.menuCtrl.enable(false, 'objMenu');
			this.callEventStart();

			//On check le statut internet
			this.lgServ.checkstatus();
		});

		//Setting default lang 
		this.translate.setDefaultLang('en');
		if (localStorage.getItem('current_lang') == null) {
			this.events.publish('lang:done', 'en');	
		}else {
		
			this.translate.setDefaultLang(localStorage.getItem('current_lang'));
			this.events.publish('lang:done', localStorage.getItem('current_lang'));
			// this.translate.use(localStorage.getItem('current_lang'));
		}

		this.storage.get('preferedLanguage').then((lang) => {
			if (lang) {
				this.translate.use(lang);
				// this.translate.setDefaultLang(lang);
			} else {
				if (this.translate.getBrowserLang() !== undefined) {
					this.translate.use(this.translate.getBrowserLang());
					// this.translate.setDefaultLang(this.translate.getBrowserLang());
				} else {
					this.translate.use('fr'); // Set your language here
					// this.translate.setDefaultLang('fr');
				}
			}
		});
		

	}

	//Cette fonction configure la langue de l'utilisateur
	settingLanguage(avocat?: any) {
		// this.getMenus();
		this.lgServ.isTable('me_avocat').then((_data) => {
			let prefix = [];

			if (_data) {

				let objAvocat = JSON.parse(_data), prefix;

				//Execution de la mise à jour automatique
				this.odooServ.majUser(objAvocat);

				if (objAvocat.lang.id !== undefined) prefix = objAvocat.lang.id.split('_');
				else prefix = objAvocat.lang.split('_');

				localStorage.setItem('current_lang', prefix[0]);
				this.translate.use(prefix[0]);
			} else {
				if (avocat !== undefined) {
					prefix = avocat.lang.id.split('_');
					//console.log("set language");
					this.translate.use(prefix[0]);
				} else {
					// this.translate.setDefaultLang('en');
				}
			}

			this.lgService.isTable('setting').then((data) => {
				if (data) {
					// console.log(data);
					this.setModulesOfUser(JSON.parse(data).modules);
				}
			});
			
			
			//Définition du Menu Gauche
			this.translate.get('menu').subscribe((res) => {
				//Table du manager
				// this.sections = this.customMenu(res);
				this.events.subscribe('access:control', (data) => {
					
					this.sections = this.customMenu(res, data);
				});
			});
		});

		//Change language
		this.events.subscribe('lang:done', (lang) => {
			// console.log(lang);
			this.translate.setDefaultLang(lang);
			this.translate.use(lang);
			this.pages = [];
			this.translate.get('menu').subscribe((res) => {
				console.log(res);
				this.pages.push({ title: res.home, icon: 'assets/images/home.svg', component: 'MainPage' });
			});

			this.lgService.isTable('setting').then((data) => {
				if(data) this.setModulesOfUser(JSON.parse(data).modules);
			});

			this.translate.get('menu').subscribe((res) => {
				this.events.subscribe('access:control', (data) => {
					
					this.sections = this.customMenu(res, data);
				});
			});
		});
 
	}

	//Cette fonction permet de construire le menu en fonction des droits d'utilisateur
	private customMenu(res, is_manager?: any){

		var first_menu, second_menu;

		//Sous Menu Utilisateur
		var results = [
			{ title: res.preference, icon: '', component: '', slug: 'divider' },
			{ title: res.user, icon: 'ios-person-outline', component: 'ProfilePage', slug: 'user' },
			{ title: res.abonne, icon: 'ios-settings-outline', component: 'SettingPage' }
			// { title: res.logout, icon: 'ios-exit-outline', component: 'MainPage', slug: 'offline' }
		];

		//Rubrique manager
		var managers : Array<any> = [
			{ title: res.manager, icon: '', component: '', slug: 'divider' },
			{ title: res.team, icon: 'ios-contacts-outline', component: 'hr', slug: null },
			{ title: res.users, icon: 'ios-people-outline', component: 'UsersPage', slug: 'users' }
		];

		//Sous menu A Propos et Aide
		var about = [
			{ title: res.setting, icon: '', component: '', slug: 'divider' },
			{ title: res.about, icon: 'ios-information-circle-outline', component: 'AboutPage' },
			{ title: res.ocr, icon: 'ios-information-circle-outline', component: 'TestOcrPage' },
			{ title: res.help, icon: 'ios-help-circle-outline', component: 'AidePage' }
		];

		// console.log('before good', localStorage.getItem('manager'));
		if(is_manager){
			first_menu = managers.concat(about);
			second_menu = results.concat(first_menu);
		}else{
			second_menu = results.concat(about);
		}
		
		// console.log(second_menu);
		return second_menu;
	}

	/**
	 * Cette fonction permet de définir les menus qui devront
	 * figurer sur le menu gauche de l'application
	 * @param allMenus Array<any>, tableau des modules
	 */
	private setModulesOfUser(allMenus) {

		// console.log('All menus => ', allMenus);
		let current_lang = this.translate.getDefaultLang();
		this.pages = [];
		this.translate.get('menu').subscribe((res) => {
			this.pages.push({ title: res.home, icon: 'assets/images/home.svg', component: 'MainPage' });
		});
		for (let k = 0; k < allMenus.length; k++) {
			if (allMenus[k]!=null && allMenus[k].active == true) {
				this.pages.push({
					title: allMenus[k].title[current_lang],
					icon: allMenus[k].icon,
					component: allMenus[k].component,
					slug: allMenus[k].slug
				});
			}
		} 
	}

	callEventStart() {
		//Initialisation de la variable imgCache

		this.defaultImg = 'assets/images/person.jpg';
		this.events.subscribe('avocat:changed', (avocat) => {
			//Lorsque l'avocat est connecté on charge ses informations
			if (avocat !== undefined && avocat !== '') {
				this.avocat = avocat;

				//On charge le logo du client sur la page menu gauche
				this.imgProvider.getCallbackURL(this.avocat.img, (res) => {
					this.mon_logo = res;
				});
			}
		});
	}

	openPage(page) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		if (page.slug !== undefined) {
			if (page.slug == 'offline') this.logOff();
			else if (page.slug == 'user') this.nav.push(page.component, { objet: this.avocat.user });
			else if (page.slug == 'divider') {
			} else this.nav.push(page.component, { partner: page.slug, titre: page.title });
		} else this.nav.setRoot(page.component);
	}

	//Cette fonction permet de se déconnecter
	logOff() {
		this.odooServ.signOut((res) => {
			if (res.code == 0) {
				this.nav.setRoot('LoginPage');

				//On vide les données de l'utilisateur récent
				this.lgServ.remove('login');
				// localStorage.removeItem('is_update');
				// this.lgServ.remove('_ona_date');
				this.lgServ.remove('me_avocat');

				this.menuCtrl.enable(false, 'objMenu');
			}

			this.odooServ.displayCustomMessage(res.msg);
		});
	}

	//Cette fonction va ouvrir la page Profile de
	//l'utilisateur
	//@param objUser JSONObject, les informations relatives au user
	showProfile(objUser) {
		this.nav.push('ProfilePage', { objet: objUser });
	}

	/**
   * Cette fonction permet de synchroniser les
   * données en locale depuis le serveur
   */
	refreshData() {
		this.isSync = true;
		this.odooServ.syncListObjets(this.isSync);
		this.events.subscribe('sync:done', (is_sync) => {
			//console.log("choueete");
			if (is_sync) {
				this.isSync = !is_sync;
				this.last_update = new Date();
				this.events.unsubscribe('sync:done');
			}
		});
	}
}
