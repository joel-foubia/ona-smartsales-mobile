import { Component, Input, ViewChild } from '@angular/core';
import { Slides, PopoverController } from 'ionic-angular';
// import { PopUserPage } from '../../../pages/pop-user/pop-user';
// import { PopLoginPage } from '../../../pages/pop-login/pop-login';
import { LoginProvider } from '../../providers/login/login';
import { OdooProvider } from '../../providers/odoo/odoo';
import { User } from '../../models/user';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'auth',
	templateUrl: 'auth.html'
})
export class AuthComponent {
	lang: any;
	@ViewChild('fonctionsSlide') slides: Slides;

	@Input() data: any;
	@Input() events: any;

	private txtLang: any;
	public username: string;
	public password: string;
	private refLogin;
	public display;
	txtPop: any;

	constructor(
		public popCtrl: PopoverController,
		private lgServ: LoginProvider,
		private odooServ: OdooProvider,
		private translate: TranslateService
	) {
		this.translate.get('form').subscribe((reponse) => {
			this.txtLang = reponse;
		});
		this.translate.get('pop').subscribe((reponse) => {
			this.txtPop = reponse;
		});
	}

	onEvent = (event: string): void => {
		if (this.events[event]) {
			this.events[event]({
				username: this.username,
				password: this.password,
				dialog: this.refLogin,
				lang: this.lang
			});
		}
	};

	//On affiche la liste des utilisateurs
	onSelectUser(theEvent, users) {
		let popover = this.popCtrl.create(
			'PopUserPage',
			{ data: users, txt_user: this.data.msg_user },
			{ cssClass: 'custom-popuser' }
		);
		let ev = {
			target: {
				getBoundingClientRect: () => {
					return { top: '80' };
				}
			}
		};

		//callback when modal is dismissed (recieve data from View)
		popover.onDidDismiss((data) => {
			if (data) {
				if (data.mode == 'pwd') {
					this.prepareLogin(data.data);
				} else {
					this.fingerLogin(data.data);
				}
			} else {
			}
		});

		popover.present({ ev });
	}

	fingerLogin(user) {
		this.lgServ.isTable('login').then((res) => {
			if (res) {
				this.password = JSON.parse(res).password;
				this.onEvent('onLogin');
				this.lgServ.setTable('me_avocat', user);
			} else {
				this.odooServ.showMsgWithButton(this.txtPop.first_finger_auth, 'top', 'toast-info');
				this.prepareLogin(user);
			}
		});
	}

	//Préparation de la connexion par mot de passe
	//Cette fonction ouvre une boite de dialogue invitant l' user (user)
	//a fournir son mot de passe
	prepareLogin(user) {
		let image;
		this.username = user.login;
		this.lang = user.lang;

		let popover = this.popCtrl.create(
			'PopLoginPage',
			{ data: user, pwd: this.data.msg_pwd },
			{ cssClass: 'custom-poplogin' }
		);
		let ev = {
			target: {
				getBoundingClientRect: () => {
					return { top: '100' };
				}
			}
		};

		this.refLogin = popover;

		//callback when modal is dismissed (recieve data from View)
		popover.onDidDismiss((data) => {
			if (data) {
				this.password = data;
				this.onEvent('onLogin');
				this.lgServ.setTable('me_avocat', user);
			}
		});

		popover.present({ ev });
	}

	//Aller au prochain slides
	onNext() {
		this.slides.slideNext();
	}

	//Aller au slide précédent
	onPrevious() {
		this.slides.slidePrev();
	}

	/**
   * Cette fonction va formatter la liste des utilisateurs
   * @param list_users Array<any>, liste des utilisateurs à formatter
   */
	formatUsers(list_users) {
		let final = [];
		for (let i = 0; i < list_users.length; i++) {
			final.push(new User(this.txtLang, list_users[i]));
		}

		return final;
	}

	/** Cette fontion récupère les utilisateurs
   * liés à un abonnement **/
	loadUsers(theEvent) {
		this.display = true;
		this.lgServ.getSettingUser().then((reponse) => {
			if (reponse) {
				let user = JSON.parse(reponse);
				let objLogin = { uid: parseInt(user.userID), password: user.passswd };

				this.lgServ.isTable('_ona_user').then((_data) => {
					if (_data) {
						this.display = false;
						console.log('Users ', JSON.parse(_data));
						this.onSelectUser(theEvent, JSON.parse(_data));
					} else {
						//Début req Odoo
						this.odooServ.odoo().reqListObjets(user, objLogin, null, 'user', (data) => {
							//console.log(data);
							if (data.errno == 0) {
								let tab = [];
								tab = this.odooServ.odoo().formatIds(data);

								this.odooServ.odoo().listObjets(user, objLogin, tab, 'user', (res) => {
									this.display = false;
									if (res.errno == 0) {
										let results = this.formatUsers(res.val.me);
										this.lgServ.setTable('_ona_user', results);
										this.lgServ.setSync('_ona_user_date');
										this.onSelectUser(theEvent, results);
									} else {
										this.odooServ.displayCustomMessage(
											'Impossible de charger la liste. Vérifier votre connexion internet'
										);
									}
								});
							} else if (data.errno == 5) {
								this.display = false;
								this.odooServ.alertNoInternet().present();
							} else {
								this.display = false;
								this.odooServ.alertCustomError(data.errstr).present();
							}
						});
						//Fin req Odoo
					}
				});
			}
		});
	}
}
