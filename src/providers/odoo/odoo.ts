import { Injectable, ViewChild } from '@angular/core';
import {
	AlertController,
	ToastController,
	LoadingController,
	ModalController,
	Events,
	PopoverController,
	Nav
} from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SMS } from '@ionic-native/sms';
import { Network } from '@ionic-native/network';
import { SmsPage } from '../../pages/sms/sms';
// import { Project } from '../../models/project';
import { Partner } from '../../models/partner';
import { Team } from '../../models/team';
import { User } from '../../models/user';
import { Agenda } from '../../models/agenda';
import { Lead } from '../../models/lead';
// import { Product } from '../../models/product';
import { Channel } from '../../models/channel';
import { Document } from '../../models/document';
// import { Task } from '../../models/task';

import { InvoiceLine } from '../../models/invoice-line';
import { TranslateService } from '@ngx-translate/core';
import { Invoice } from '../../models/invoice';
import { Calendar } from '@ionic-native/calendar';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LoginProvider } from '../login/login';
import { ConfigModels } from '../../config';

import 'rxjs/add/operator/map';
import { Note } from '../../models/note';
import { Calls } from '../../models/call';
import { Produit } from '../../models/produit';
import { AppRate } from '@ionic-native/app-rate';
import { Vente } from '../../models/vente';
import { VenteLine } from '../../models/vente-line';
import { Evenement } from '../../models/event';
import { Ticket } from '../../models/ticket';
import { Participant } from '../../models/participant';
import { Subscription } from '../../models/sub';
import { SubLine } from '../../models/sub-line';
import { Group } from '../../models/group';
import { AfProvider } from '../af/af';
import { ModelData } from '../../models/model-data';
import * as moment from 'moment';
import { Achats } from '../../models/achats';
import { OrderLine } from '../../models/order-line';

//On déclare l'objet Odoo qui porte le même nom relatif à la bibliothèque JS
declare var Odoo: any;

@Injectable()
export class OdooProvider {
	xmlrpc: any;
	palette: any;

	@ViewChild(Nav) nav: Nav;
	private txtLang: any;
	private connex: any;
	private autoSync;
	private txtObjet: any;
	private objMenu;
	private err_server = "Une erreur est survenu. Réessayer ou Contacter l'administrateur";
	private err_network = 'Problème de connexion internet. Veuillez, réessayer plus tard';
	private noInternet = "Impossible d'enregistrer. Problème de connexion Internet";

	constructor(
		public alertCtrl: AlertController,
		public toastCtrl: ToastController,
		private callNumber: CallNumber,
		private emailComposer: EmailComposer,
		private browser: InAppBrowser,
		public loading: LoadingController,
		private sms: SMS,
		private modalCtrl: ModalController,
		private lgServ: LoginProvider,
		private calServ: Calendar,
		public network: Network,
		public socialSharing: SocialSharing,
		public translate: TranslateService,
		public events: Events,
		private appRate: AppRate,
		private afServ: AfProvider,
		public popCtrl: PopoverController
	) {
		// alert('odoo');
		this.xmlrpc = Odoo;

		// alert('fin odoo');
		this.lgServ.isTable('palette_ona').then((res) => {
			if (res) {
				this.palette = JSON.parse(res);
			}
		});

		//On définit les params de connexion
		this.lgServ.getLogin().then((res) => {
			if (res) {
				let objLogin = JSON.parse(res);
				this.lgServ.getSettingUser().then((reponse) => {
					if (reponse) {
						let user = JSON.parse(reponse);
						this.connex = { login: objLogin, user: user };
						this.setModelTraduction();
						//Autosynchronize database
						this.syncListObjets(false);
						this.autoSyncDatabase();
						let connected = this.network.onConnect().subscribe(() => {
							setTimeout(() => {
								this.autoSyncDatabase();
							}, 3000);
						});
					}
				});
			} else {
				this.translate.get([ 'login', 'native', 'message', 'module', 'menu', 'form' ]).subscribe((data) => {
					this.txtObjet = data;
					this.txtLang = data.form;
					console.log(this.txtObjet);
				});
			}
		});
	}

	//On initialise la traduction
	setModelTraduction() {
		//On applique le service de traduction
		this.translate.get([ 'login', 'native', 'message', 'module', 'menu', 'form' ]).subscribe((data) => {
			this.txtObjet = data;
			this.txtLang = data.form;
			this.objMenu = data.menu;
			console.log(this.txtObjet);
		});
	}

	getLangWizard() {
		return new Promise((resolve, reject) => {
			this.translate.get([ 'start', 'subtitle', 'btns', 'login' ]).subscribe((_data) => {
				resolve(_data);
			});
		});
	}

	traduire() {
		return this.txtObjet;
	}

	/**
   * Cette fonction retourne 
   * un objet Odoo (dans lequel est définies les functions)
   **/
	odoo() {
		return this.xmlrpc;
	}

  /**
   * Cette fonction permet d'effectuer un appel
   * @param phonenumber int
   * (A Executer sur un Smartphone)
   **/
	doCall(phonenumber, txtMessage) {
		if (phonenumber) {
			this.callNumber
				.callNumber(phonenumber, true)
				.then(() => console.log('Launched dialer!'))
				.catch(() => console.log('Error launching dialer'));
		} else {
			this.showMsgWithButton(txtMessage, 'top', 'toast-error');
		}
	}
  
  /**
   * Cette fonction permet d'effectuer un appel
   * @param phonenumber int
   * (A Executer sur un Smartphone)
   **/
	doCallToSave(phonenumber, txtLangueCall, customer) {
		
		if(phonenumber!=''){

			this.callNumber.callNumber(phonenumber, true).then(() => {

				let objCalls = new Calls(null);
					objCalls.name = txtLangueCall.make_call + customer;
					objCalls.state = 'done';
					objCalls.date = moment().format('YYYY-MM-DD HH:mm:ss');
					objCalls.partner_id = { id: customer.id, name: customer.name };
					objCalls['idx'] = new Date().valueOf();

					this.copiedAddSync('call', objCalls);
					this.syncCreateObjet('call', objCalls);

					this.showMsgWithButton(txtLangueCall.add_call, 'top', 'toast-success');

				}).catch(() => console.log('Error launching dialer'));
		} else {
			this.showMsgWithButton(txtLangueCall.no_phone, 'top', 'toast-error');
		}
	}

	/**
   * Cette fonction permet d'envoyer un mail
   * @param adrEmail string
   * @param txtMessage string
   * (A Executer sur un Smartphone)
   **/
	doEmail(adrEmail, txtMessage, sujet?: string, body?: string) {
		return new Promise((resolve, reject) => {
			if (adrEmail) {
				// add alias
				this.emailComposer.addAlias('gmail', 'com.google.android.gm');

				//Now we know we can send
				let email = {
					app: 'gmail',
					to: adrEmail,
					subject: sujet,
					body: body,
					isHtml: true
				};

				this.emailComposer
					.open(email)
					.then(() => {
						resolve(true);
					})
					.catch((err) => {
						reject("Erreur l'ors de l'envoie du message")
					});
			} else {
				this.showMsgWithButton(txtMessage, 'top', 'toast-error');
			}
		});
	}

	/**
   * Cette fonction permet d'ouvrir un site web
   * @param adrWeb string
   * @param txtMessage string
   * (A Executer sur un Smartphone)
   **/
	doWebsite(adrWeb, txtMessage) {
		if (adrWeb) {
			this.browser.create(adrWeb);
		} else {
			this.showMsgWithButton(txtMessage, 'top', 'toast-error');
		}
	}

	/**
   * Cette fonction permet d'envoyer
   * des SMS
   * @param phonenumber int, le numéro de téléphone du destinataire
   **/
	doSMS(phonenumber) {
		if (phonenumber) {
		}

		let addModal = this.modalCtrl.create(SmsPage);
		let msgLoading = this.loading.create({ content: this.txtObjet.native.sms_sending });

		//callback when modal is dismissed (recieve data from View)
		addModal.onDidDismiss((data) => {
			if (data) {
				let confirm = this.alertCtrl.create({
					title: 'ONA SMART SALES',
					message: this.txtObjet.message.cost_sms,
					buttons: [
						{
							text: this.txtObjet.login.no,
							handler: () => {
								//console.log('Disagree clicked');
							}
						},
						{
							text: this.txtObjet.login.yes,
							handler: () => {
								let message = this.txtObjet.native.sms_sent;
								this.sms.send(phonenumber, data).then((res) => {
									//msgLoading.dismiss();
									this.showMsgWithButton(message, 'top', 'toast-success');
								});
							}
						}
					]
				});

				confirm.present();
			}
		});

		addModal.present();
	}

	/**
   * Cette fonction permet de partarger une note
   * ou autres document
   *
   **/
	doShare(message, subject, fichier, url, type) {
		this.socialSharing
			.share(message, subject, fichier, url)
			.then(() => {
				// Sharing via email is possible
			})
			.catch(() => {
				if (type == 'notes') this.showMsgWithButton(this.txtObjet.native.share_note, 'bottom', 'toast-info');
			});
	}

	/**
   * Cette fonction permet de partarger les informations
   * d'un client via the social Networkd
   *
   **/
	doSharePartner(item, type) {
		let message = '',
			subject = type + ': ' + item.name,
			url = '';

		for (var index in item) {
			message += index + ': ' + item[index] + '/n';
		}

		this.socialSharing
			.share(message, subject, null, url)
			.then(() => {
				// Sharing via email is possible
			})
			.catch(() => {
				this.showMsgWithButton(this.txtObjet.native.share_partner, 'bottom');
			});
	}

	/**
   * Cette fonction ouvre la boite de dialogue
   * afin que l'utilisateur puisse évaluer l'application
   * @param android string, le lien vers le Play Store
   * @param ios string, le lien vers l'App Store
   * @param objEvaluate any, l'objet JSON
   */
	doEvaluate(android, objEvaluate, ios?: any) {
		this.appRate.preferences = {
			usesUntilPrompt: 3,
			useLanguage: this.translate.getDefaultLang(),
			displayAppName: 'ONA SMART SALES',
			storeAppURL: {
				ios: '<app_id>',
				android: 'market://details?id=' + android
			}
		};

		this.appRate.promptForRating(true);
	}

	buildMessage(txtMsge, current_user, product) {
		let html = '';
		html += txtMsge.comm_name + current_user.name + '<br>';
		html += txtMsge.comm_team + current_user.sale_team_id.name + '<br>';
		html += txtMsge.email + current_user.email + '<br><br><br>';
		html +=
			txtMsge.msge_txt1 +
			' ' +
			product.name +
			' ' +
			txtMsge.msge_txt2 +
			' ' +
			product.qty_available +
			product.uom_id.name +
			txtMsge.msge_txt3 +
			'<br>';

		return html;
	}

	/***
   * Cette fonction permet d'afficher une alerte
   * en cas de succès d'une action
   * @return AlertController
   *
   **/
	alertSuccess(txtMessage) {
		let msgBox = this.alertCtrl.create({
			title: 'ONA SMART SALES',
			subTitle: txtMessage,
			cssClass: 'boxAlert-success',
			buttons: [ 'OK' ]
		});

		return msgBox;
	}

	/***
   * Cette fonction permet d'afficher une alerte
   * en cas d'erreur d'une action
   * @return AlertController
   *
   **/
	alertError() {
		let msgBox = this.alertCtrl.create({
			title: 'ONA SMART SALES',
			subTitle: this.txtObjet.native.err_update,
			cssClass: 'boxAlert-danger',
			buttons: [ 'OK' ]
		});

		return msgBox;
	}

	/**
   * Cette fonction permet d'afficher une alerte
   * en personnaliser le texte
   *
   **/
	alertCustomError(message) {
		let msgBox = this.alertCtrl.create({
			title: 'ONA SMART SALES',
			subTitle: message,
			cssClass: 'boxAlert-danger',
			buttons: [ 'COMPRIS' ]
		});

		return msgBox;
	}

	/***
   * Cette fonction permet d'afficher une alerte
   * en cas d'erreur Internet
   * @return AlertController
   *
   **/
	alertNoInternet() {
		let msgBox = this.alertCtrl.create({
			title: 'ONA SMART SALES',
			subTitle: this.err_network,
			buttons: [ 'OK' ]
		});

		return msgBox;
	}

	/**
    * Cette fonction permet de 
    * vérifier de faire patienter
    * l'utilisateur lorsqu'il accède à un contenu distant
    **/
	makeUserPatient() {
		let loadBox = this.loading.create({ content: this.txtObjet.login.checking });

		return loadBox;
	}

	/**
    * Cette fonction affiche un message
    * d'erreur d'authentification
    *
    **/
	displayErrorAuth() {
		this.showMsgWithButton(this.txtObjet.login.credentials, 'top', 'toast-error');
	}

	/**
    * Cette fonction affiche un message
    * personnalisé
    *
    **/
	displayCustomMessage(txtMessage) {
		let toast = this.toastCtrl.create({
			message: txtMessage,
			duration: 3000,
			position: 'top'
		});

		toast.present();
	}

	/**
    * Cette fonction affiche un message
    * personnalisé avec button ok
    *
    **/
	showMsgWithButton(txtMessage, position, options?: any) {
		let toast = this.toastCtrl.create({
			message: txtMessage,
			showCloseButton: true,
			closeButtonText: 'OK',
			cssClass: options !== undefined ? options : '',
			duration: 4000,
			position: position
		});
		toast.present();
	}

	//Cette fonction permet de formatter la
	//date au format UTC
	formatUTF(toConvert) {
		var objDate,
			strDate = '',
			mois,
			minutes,
			jour;
		if (toConvert == '') objDate = new Date();
		else objDate = new Date(toConvert);

		if (objDate.getMonth() < 9) mois = '0' + (objDate.getMonth() + 1);
		else mois = objDate.getMonth() + 1;

		if (objDate.getMinutes() < 10) minutes = '0' + objDate.getMinutes();
		else minutes = objDate.getMinutes();

		if (objDate.getDate() < 10) jour = '0' + objDate.getDate();
		else jour = objDate.getDate();

		strDate = objDate.getFullYear() + '-' + mois + '-' + jour + ' ' + objDate.getHours() + ':' + minutes + ':00';

		return strDate;
	}

	/**
    * Cette fonction permet de partager
    * une note à ses contacts
    *
    **/
	shareNoteToUser(note) {}

	//////////////////////////////////////////////////////////////
	// CETTE PARTIE PERMET DE DECONNECTER UN UTILISATEUR

	/**
   * Cette fonction permet est appeler
   * lorsque l'utilisateur clique sur le bouton déconnexion
   *
   * @param user Object(JSON), il s'agit du user's API
   * @param objLogin Object(JSON), il s'agit de l'utilisateur connecté
   * @return callback
   **/
	signOut(callback) {
		let confirm = this.alertCtrl.create({
			title: 'ONA SMART SALES',
			message: this.txtObjet.login.logoff,
			buttons: [
				{
					text: this.txtObjet.login.no,
					handler: () => {
						//console.log('Disagree clicked');
						callback({ code: 1, msg: '' });
					}
				},
				{
					text: this.txtObjet.login.yes,
					handler: () => {
						//console.log('Agree clicked');
						//On ouvre une nouvelle page
						let msgLoading = this.loading.create({ content: this.txtObjet.login.pending_logout });
						msgLoading.present();

						let message = this.txtObjet.login.txt_logout;
						//this.lgServ.remove('login');
						this.lgServ.remove('connected');
						msgLoading.dismiss();

						callback({ code: 0, msg: message });
					}
				}
			]
		});

		confirm.present();
	}

	/**
   * Cette fonction est chargé de retirer
   * l'utilisateur connecté dont l'identifiant se trouve
   * dans la table tab_ids
   **/
	removeOnlineUser(user, msgLoading, tab_ids, callback) {
		let message = this.txtObjet.login.txt_logout;

		this.odoo().deconnexion(user, tab_ids, (data) => {
			msgLoading.dismiss();
			//console.log(data);

			if (data.errno == 0) {
				//ON supprime les données du Login
				this.lgServ.remove('login');
				callback({ code: 0, msg: message });
			} else {
				callback({ code: 1, msg: this.txtObjet.login.fail_logout });
			}
		});
	}

	//////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////

	/**
   * Cette fonction permet d'insérer les objets 
   * dans la bd
   * @param objet JSONObject, objet à insérer
   * @param list_objets Array<any>, le tableau d'objet
   * @param type string
   */
	insertOfflineData(list_objets, type) {
		if (list_objets.length == 0) {
			console.log('Sync done');
			this.lgServ.removeTo('_ona_add_' + type).then((reponse) => {
				console.log('sync Good');
			});
			return;
		} else {
			let index = list_objets.length - 1;
			this.createDataToServer(type, list_objets[index])
				.then((_data) => {
					if (_data) {
						list_objets.splice(index, 1);
					}

					console.log('after add : ' + list_objets.length);

					this.lgServ.setTableTo('_ona_add_' + type, list_objets).then((_reponse) => {});
				})
				.catch((error) => {
					// this.updateOfflineData(list_objets, type);
				});
		}
	}

	/**
   * Cette fonction permet de mettre à jour les objets 
   * dans la bd (Serveur)
   * @param list_objets Array<any>, le tableau d'objet
   * @param type string
   */
	updateOfflineData(list_objets, type) {
		if (list_objets.length == 0) {
			console.log('Sync done');
			this.lgServ.removeTo('_ona_update_' + type).then((reponse) => {
				console.log('sync Good');
			});
			return;
		} else {
			let index = list_objets.length - 1,
				idObj;

			if (list_objets[index].me !== undefined) idObj = list_objets[index].me.id.me;
			else idObj = list_objets[index].id;

			console.log(idObj);
			if (idObj != 0) {
				//On effectue la synchronisation de la mise à jour
				this.updateDataToServer(type, idObj, list_objets[index])
					.then((_data) => {
						if (_data) {
							list_objets.splice(index, 1);
						}

						this.lgServ.setTableTo('_ona_update_' + type, list_objets).then((_reponse) => {
							// this.updateOfflineData(list_objets, type);
						});

						console.log('after update : ' + list_objets.length);
					})
					.catch((error) => {
						// this.updateOfflineData(list_objets, type);
					});
			}
		}
	}

	/**
   * Cette fonction permet de dupliquer un objet
   * dans la bd (Serveur)
   * @param list_objets Array<any>, le tableau d'objet
   * @param type string
   */
	copyOfflineData(list_objets, type) {
		if (list_objets.length == 0) {
			console.log('Sync done');
			this.lgServ.removeTo('_ona_copy_' + type).then((_rep) => {});
			return;
		} else {
			let index = list_objets.length - 1,
				idObj;

			if (list_objets[index].me !== undefined) idObj = list_objets[index].me.id.me;
			else idObj = list_objets[index].id;

			//On effectue la synchronisation de la mise à jour
			this.copyDataToServer(type, idObj, list_objets[index])
				.then((_data) => {
					if (_data) {
						list_objets.splice(index, 1);
					}

					console.log('after copy : ' + list_objets.length);
					this.lgServ.setTableTo('_ona_copy_' + type, list_objets).then((_reponse) => {
						// this.updateOfflineData(list_objets, type);
					});
				})
				.catch((error) => {});
		}
	}

	/**
   * Cette fonction permet de mettre à jour les données
   * sur le serveur distant
   * @param type string, nom de la table
   * @param idObj Number, numéro d'identifiant de l'objet à mettre à jour
   * @param objet any, l'objet à mettre à jour
   */
	updateDataToServer(type, idObj, objet) {
		return new Promise((resolve, reject) => {
			//On effectue la synchronisation de la mise à jour
			this.odoo().updateObjet(this.connex.user, this.connex.login, type, idObj, objet, (res) => {
				console.log(res);
				if (res.errno == 0 && res.val.me) {
					resolve(1);
				} else if (res.errno == 5) {
					reject(5);
				} else {
					reject(4);
				}
			}); //End of Update request
		});
	}

	/**
   * Cette fonction permet de créer un objet et le sauvegarder
   * sur le serveur distant
   * @param type string, nom de la table
   * @param objet any, l'objet à mettre à jour
   */
	createDataToServer(type, objet) {
		return new Promise((resolve, reject) => {
			//On effectue la synchronisation pour la sauvegarde des data
			this.odoo().createObjet(this.connex.user, this.connex.login, type, objet, (res) => {
				console.log(res);
				if (res.errno == 0 && res.val.me) {
					resolve(res.val.me);
				} else if (res.errno == 5) {
					reject(5);
				} else {
					reject(4);
				}
			}); //End of Create request
		});
	}

	/**
   * Cette fonction permet de dupliquer un objet
   * sur le serveur distant
   * @param type string, nom de la table
   * @param idObj Number, numéro d'identifiant de l'objet à mettre à jour
   * @param objet any, l'objet à mettre à jour
   */
	copyDataToServer(type, idObj, objet) {
		return new Promise((resolve, reject) => {
			//Client and contact
			if (idObj != 0 && (type == 'client' || type == 'contact' || type == 'produit')) {
				this.requestImageBinaryToOdoo(type, idObj, null, 'image', (_img) => {
					if (_img.length != 0) objet.image = _img[0].me.image.me;

					this.copySingleObject(type, idObj, objet, null, (res) => {
						console.log(res);
						if (res.errno == 0) {
							resolve(1);
							// list_objets.splice(i,1);
						} else if (res.errno == 5) {
							reject(5);
						} else {
							reject(4);
						}
					});
					//ENd of copy request
				});
				//Fin contact, client and produit
			} else if (idObj != 0) {
				this.copySingleObject(type, idObj, objet, null, (res) => {
					console.log(res);
					if (res.errno == 0) {
						resolve(1);
						// list_objets.splice(i,1);
					} else if (res.errno == 5) {
						reject(5);
					} else {
						reject(4);
					}
				}); //End of copy objet different of customer, contact and produit
			}
		});
	}

	/**
   * Cette fonction permet de mettre à jour
   * les informations de l'utilisateur
   */
	updateUser(user) {
		this.lgServ.isTable('_ona_user').then((reponse) => {
			if (reponse) {
				let users = JSON.parse(reponse);
				for (let j = 0; j < users.length; j++) {
					const element = users[j];
					if (element.id == user.id) {
						users[j].lang.id = user.lang.id;
						users[j].lang.titre = user.lang.titre;
						this.lgServ.setTable('me_avocat', user);
						this.lgServ.setTable('_ona_user', users);
						break;
					}
				}
			}
		});
	}

	/**
   * Cette fonction permet de mettre à jour
   * les informations de l'utilisateur depuis
   */
	majUser(user) {
		// console.log(user.id);
		this.lgServ.isTable('_ona_user').then((result) => {
			if (result) {
				let users = JSON.parse(result);
				for (let j = 0; j < users.length; j++) {
					const element = users[j];
					if (element.id == user.id) {
						this.lgServ.setTable('me_avocat', element);
						break;
					}
				}
			} else {
				this.setListOfUser(user.id);
			}
		});

		let checkSync = setInterval(() => this.setListOfUser(user.id), 9000000);
	}

	/**
   * Cette fonction permet de mettre à jour
   * les informations de l'utilisateur connecté
   */
	setListOfUser(user_id) {
		let params = [];
		params.push(user_id);
		// console.log(user_id);

		this.getObjectsOnline(params, 'user', (res) => {
			// console.log(res);
			if (res.error === undefined) {
				let fromServ = new User(this.txtLang, res[0]);
				// console.log(fromServ);
				this.lgServ.setTable('me_avocat', fromServ);
			}
		});
	}

	/**
   * Cette fonction permet de synchroniser l'ajout d'un 
   * enregistrement à la bd sur Server
   * @param type string, le nom de l'objet (modèle)
   *
   **/
	createObjetSync(type) {
		//On récupère les les objets tampons à sync avec la bd
		this.lgServ.isTable('_ona_add_' + type).then((data) => {
			if (data) {
				let list_objets = JSON.parse(data);
				console.log('before add : ' + list_objets.length);

				this.insertOfflineData(list_objets, type);
			}
		});
	}

	/**
   * Cette fonction permet de synchroniser la mise à jour d'un 
   * enregistrement à la bd sur Server
   * @param type string, le nom de l'objet (modèle)
   *
   **/
	updateObjetSync(type) {
		//On récupère les les objets tampons à sync avec la bd
		this.lgServ.isTable('_ona_update_' + type).then((data) => {
			if (data) {
				let list_objets = JSON.parse(data),
					idObj;
				console.log('before update ' + list_objets.length);

				this.updateOfflineData(list_objets, type);
			}
		});
	}

	/**
   * Cette fonction permet de synchroniser la duplication d'un 
   * enregistrement à la bd sur Server
   * @param type string, le nom de l'objet (modèle)
   *
   **/
	copyObjetSync(type) {
		//On récupère les les objets tampons à sync avec la bd
		this.lgServ.isTable('_ona_copy_' + type).then((data) => {
			if (data) {
				let list_objets = JSON.parse(data),
					idObj;
				console.log('before copy : ' + list_objets.length);

				this.copyOfflineData(list_objets, type);
			}
		});
	}

	/**
   * Cette fonction permet de vérifier qu'un objet n'est pas
   * encore synchroniser et il a été modifié, alors on le met
   * à jour dans la bd
   *
   **/
	updateNoSyncObjet(type, data, objet) {
		this.lgServ.isTable('_ona_add_' + type).then((res) => {
			if (res) {
				let liste = JSON.parse(res);
				for (let i = 0; i < liste.length; i++) {
					if (liste[i].idx == objet.idx) {
						liste[i] = data;
						break;
					}
				}
				//On met à jour la table des ajouts
				this.lgServ.setTable('_ona_add_' + type, liste);
			}
		});
	}

	/**
   * Cette fonction permet de synchroniser à la fois
   * les ajouts et les mises à jours des tables dès lors de la connexion
   * Internet
   *
   **/
	autoSyncDatabase() {
		console.log('start autoSync');
		this.autoSync = setInterval(() => this.syncInOutDatabase(), 10000);
	}

	/**
   * Cette fonction permet de synchroniser à la fois
   * les ajouts et les mises à jours des tables dès lors de la connexion
   * Internet
   *
   **/
	syncInOutDatabase() {
		this.lgServ.getCurrentValSync().then((sync) => {
			this.lgServ.isTable('_ona_flag').then((res) => {
				if (res || (sync == false && localStorage.getItem('is_update') == 'true')) {
					let tab = ConfigModels.tab_models;
					for (let i = 0; i < tab.length; i++) {
						//On attend 2 secondes avant de déclancher l'insert
						setTimeout(() => {
							this.createObjetSync(tab[i]);
						}, 900);

						//On attend 1s avant de déclancher le update
						setTimeout(() => {
							this.updateObjetSync(tab[i]);
						}, 1000);

						setTimeout(() => {
							//this.updateListObjetSync(tab[i]);
						}, 10000);

						setTimeout(() => {
							this.copyObjetSync(tab[i]);
						}, 2000);
					}

					//Special custom table
					// this.getCustomerContact('client_contact').then(_data=>{
					//   this.lgServ.setTable('_ona_res_client_contact', _data);
					// });
				} else {
					clearInterval(this.autoSync);
				}
			});
		});
	}

	//Cette fonction permet de mettre à jour la liste
	//des objets ainsi de précharger la bd interne
	syncListObjets(isSynch: boolean, options?: any) {
		this.lgServ.isTable('_ona_date').then((res) => {
			if (res == null || res != this.lgServ.getToday() || isSynch) {
				console.log('List synchro');

				//On ajoute les Id du models pour la gestion de la sécurité
				this.getXmlIdOfModels().then((_data) => {
					console.log(_data);
				});

				let tab = ConfigModels.tab_models;
				this.updateListObjetSync(tab.length - 1);
			}
		});
	}

	/**
	 * This method is used to sync data
	 * removed from Server
	 */
	updateDeleteSync(){

		let tab = ConfigModels.tab_models;
		this.updateListObjetRemovedSync(tab.length - 1);
	}

	/**
   * Cette fonction permet de retourner
   * la valeur d'une langue (en fonction de celle du user)
   * @param lang string
   * @returns string
   */
	setLangOfCalendar(lang) {
		if (lang == 'fr') return 'fr-FR';
		else if (lang == 'en') return 'en-US';
		else if (lang == 'de') return 'de-DE';
		else if (lang == 'es') return 'es-ES';
	}

	/**
   * Cette fonction permet de vérifier les paramètres du user
   * @param params any, paramètres de saisi du user
   */
	authenticateUser(params) {
		return new Promise((resolve, reject) => {
			this.lgServ.isTable('_ona_user').then((reponse) => {
				if (reponse) {
					let users = JSON.parse(reponse),
						trouve = false;
					// console.log(users);
					for (let i = 0; i < users.length; i++) {
						if (params.username == users[i].login && users[i].password == params.password) {
							trouve = true;
							break;
						}
					}
					resolve(trouve);
				}
			});
		});
	}

	/**
   * Cette fonction permet de définir l'objet
   * Dashboar de l'utilisateur
   * @param user User, l'utilisateur connecté
   * @returns any
   */
	// getDashboard(user) {
	// 	return new Promise((resolve, reject) => {
	// 		let results = {};
	// 		const objets = [ 'agenda', 'call', 'activity' ];

	// 		for (let i = 0; i < objets.length; i++) {
	// 			const element = objets[i];
	// 		}
	// 	});
	// }

	/**
    * Cette fonction permet de mettre à jour la liste
    * des modèles à jour dans la bd
    *
    **/
	updateListObjetSync(index) {
		// console.log(index+" - "+ConfigModels.tab_models.length);
		if (index == -1) {
			
			this.lgServ.setLastUpdate();
			console.log('is update');
			this.events.publish('sync:done', true);
			this.lgServ.setSync('_ona_date');

			//Check if data exist or not
			this.updateDeleteSync();
			return;

		} else {

			let alias = ConfigModels.tab_models[index];
			this.lgServ.isTable('_ona_' + alias + '_date').then((_res) => {
				// console.log(_res);
				let _last_update_query = null;
				if (_res) {
					// let tabs = _res.split(".");
					// let strDate = tabs[2]+"-"+tabs[1]+"-"+tabs[0];
					_last_update_query = { last_update: _res };
				}

				// console.log(index+" - "+alias);
				this.requestObjectToOdoo(alias, null, _last_update_query, false, (data) => {
					// console.log(data);
					let results = [], suppliers = [];
					for (let i = 0; i < data.length; i++) {
						if (alias == 'client' || alias == 'contact') {
							results.push(new Partner(data[i], alias));
							if(results[i].supplier) suppliers.push(results[i].id);
						}
						else if (alias == 'agenda') results.push(new Agenda(data[i]));
						else if (alias == 'leads') results.push(new Lead('n', data[i]));
						else if (alias == 'team') results.push(new Team(data[i]));
						else if (alias == 'user') results.push(new User(this.txtLang, data[i]));
						else if (alias == 'invoice') results.push(new Invoice('n', data[i]));
						else if (alias == 'invoice-line')
							// else if(alias=='tasks')
							//   results.push(new Task('n', data[i]));
							results.push(new InvoiceLine('n', data[i]));
						else if (alias == 'document') results.push(new Document(data[i]));
						else if (alias == 'produit') {
							results.push(new Produit(data[i], 'produit'));
						} else if (alias == 'channel') {
							results.push(new Channel(data[i]));
						} else if (alias == 'notes') {
							results.push(new Note(data[i]));
						} else if (alias == 'call') {
							results.push(new Calls(data[i]));
						} else if (alias == 'vente') {
							results.push(new Vente(data[i]));
						} else if (alias == 'lines') {
							results.push(new VenteLine(data[i]));
						} else if (alias == 'event') {
							results.push(new Evenement(data[i]));
						} else if (alias == 'ticket') {
							results.push(new Ticket(data[i]));
						} else if (alias == 'participant') {
							results.push(new Participant(data[i]));
						} else if (alias == 'sub') {
							results.push(new Subscription(data[i]));
						} else if (alias == 'sub_line') {
							results.push(new SubLine(data[i]));
						} else if (alias == 'group') {
							results.push(new Group(data[i]));
						}else if (alias == 'purchase') {
							results.push(new Achats(data[i]));
						} else if (alias == 'purchase_line') {
							results.push(new OrderLine(data[i]));
						}	 
						else {
							results.push(data[i]);
						}
					}

					//Mise à jour de la bd
					if (results.length != 0) {
						this.lgServ.setObjectToTable('_ona_' + alias, results);
						this.lgServ.setSync('_ona_' + alias + '_date');
					}

					//Save suppliers ids
					if(suppliers.length!=0)
						this.lgServ.setTable('_ona_supplier_tab', suppliers);

					index--;
					this.updateListObjetSync(index);
				});
			});
		}
	}

	/**
	 * This method performs synchronization of
	 * removed data on Server with database
	 * @param index number, l'index d'un élément(table) de la bd
	 */
	updateListObjetRemovedSync(index){
		
		// console.log(index+" - "+ConfigModels.tab_models.length);
		if (index == -1) {
			
			// this.lgServ.setLastUpdate();
			console.log('is removed');
			// this.events.publish('sync:done', true);
			// this.lgServ.setSync('_ona_date');

			//Check if data exist or not
			// this.updateDeleteSync();
			return;

		} else {

			let alias = ConfigModels.tab_models[index];

			this.lgServ.isTable('_ona_' + alias).then((_res) => {
				
				let _ids_query = {}, tabs = [], ids = [];

				if (_res) {

					tabs = JSON.parse(_res);
					ids = [];
				}
				
				for (let j = 0; j < tabs.length; j++) {
					const element = tabs[j];
					if(element.me===undefined)
						ids.push(element.id);
					else
						ids.push(element.me.id.me);
				}
					
				_ids_query = { 'ids': ids };
				
				this.requestIdObjectToOdoo(alias, _ids_query, (data) => {
					
					// console.log(alias+" ids => ", data);
					let results = [], suppliers = [];
					for (let i = 0; i < tabs.length; i++) {
						if(tabs[i].me===undefined){
							if(data.indexOf(tabs[i].id)>-1)
								results.push(tabs[i]);
						}else{
							if(data.indexOf(tabs[i].me.id.me)>-1)
								results.push(tabs[i]);
						}
					}

					//Mise à jour de la bd
					if (results.length != 0 && alias!='user') {
						this.lgServ.setTable('_ona_' + alias, results);
						this.lgServ.setSync('_ona_' + alias + '_date');
					}

					index--;
					this.updateListObjetRemovedSync(index);
				});
				
				

			});
		}

	}

	/**
    * Cette méthode permet de rafraichir la liste
    * des enregistrements sur une vue. Dans le but d'améliorer la 
    * synchronisation
    * @param type string, le nom de la table
    * @param data Array<any>, une liste d'objets (modèle)
    * 
    * @returns Promise
    */
	refreshViewList(type: string, data) {
		return new Promise((resolve, reject) => {
			this.lgServ.isTable(type).then((result) => {
				let tabs = [],
					resultat = [];

				if (result) tabs = JSON.parse(result);

				if (tabs.length != 0) {
					for (let j = 0; j < tabs.length; j++) {
						const element = tabs[j];
						for (let x = 0; x < data.length; x++) {
							if (element.id == data[x].id) {
								tabs[j] = data[x];
								data.splice(x, 1);
								break;
							}
						}
					}
				}

				resultat = tabs.concat(data);
				resolve(resultat);
			});
		});
	}

	/**
    * Cette méthode permet de récupérer les
    * des enregistrements liées à un customer
    *
    * @param type string, le nom de la table
    * @param data any, l'objet res.partner
    * 
    * @returns Promise
    */
	getDataOfCustomer(type: string, data, filter?:any) {

		return new Promise((resolve, reject) => {
			this.lgServ.isTable('_ona_'+type).then((result) => {
				
				let tabs = [], resultat = 0;

				if (result){
					tabs = JSON.parse(result);
					for (let j = 0; j < tabs.length; j++) {
						if(tabs[j].partner_id.id==data.id){
							if(filter=="devis" && type=="vente")
								resultat++;
							
							if(filter=="saleorder" && type=="vente" && tabs[j].state=="sale")
								resultat++;
							
							if(filter=="sub" && type=="sub")
								resultat++;
							
							if(filter=="pending_bill" && type=="invoice" && tabs[j].state=="open")
								resultat++;
							
							if(filter=="expired_bill" && type=="invoice" && tabs[j].state=="open" && new Date(tabs[j].date_due)< new Date())
								resultat++;
							
						}
					}
				} 

				// resultat = tabs.concat(data);
				resolve(resultat);
			});
		});
	}

	/**
    * Cette fonction permet de récupérer la liste des
    * éléments dans un tableau
    * @param type string, le type d'objet dont on souhaite récupérer la liste
    * @param tabs Array<int>, un tableau contenant des ids
    * @return Array<JSON>
    *
    **/
	getTagsOfType(type, tabs) {
		return new Promise((resolve, reject) => {
			let results = [];
			if (tabs.length == 0) {
				resolve(results);
			} else {
				this.lgServ.isTable('_ona_' + type).then((res) => {
					if (res) {
						let objets = JSON.parse(res);
						for (let i = 0; i < objets.length; i++) {
							for (let j = 0; j < tabs.length; j++) {
								let idx;

								if (objets[i].me === undefined) idx = objets[i].id;
								else idx = objets[i].me.id.me;

								if (tabs[j] == idx) results.push(objets[i]);
							} //end tabs
						}
					}

					resolve(results);
				});
			}
		});
	}

	/**
    * Cette fonction permet de récupérer la liste des
    * éléments dans un tableau
    * @param type string, le type d'objet dont on souhaite récupérer la liste
    * @param tabs Array<int>, un tableau contenant des ids
    * @return Array<JSON>
    *
    **/
	getListPartnersOnRes(type, tabs) {
		return new Promise((resolve, reject) => {
			let results = [];
			this.lgServ.isTable('_ona_' + type).then((res) => {
				if (res) {
					let objets = JSON.parse(res);
					for (let i = 0; i < objets.length; i++) {
						let idx;
						if (objets[i].me === undefined) idx = objets[i].id;
						else idx = objets[i].me.id.me;

						if (tabs.indexOf(idx) > -1) results.push(objets[i]);
					}
					//end of for
				}

				resolve(results);
			});
		});
	}

	/**
    * Cette fonction permet de récuperer la liste
    * des clients ou des contacts
    *
    **/
	getXmlIdOfModels() {
		return new Promise((resolve, reject) => {
			this.afServ.getListXmlIds((res) => {
				console.log(res);
				let filter = res;

				this.requestObjectToOdoo('models', null, filter, false, (reponse) => {
					let results = [];
					console.log(reponse);
					for (let i = 0; i < reponse.length; i++) {
						results.push(new ModelData(reponse[i]));
					}

					this.lgServ.setTable('_ona_models', results);
					this.lgServ.setSync('_ona_models_date');
					resolve(results);
				});
			});
		});
	}

	/**
     * Cette fonction permet d'obtenir les access 
     * et les informations sur la sécurité de l'application
     * @param user User
     * @author Arthur (davart)
     */
	getAccessOfUser(user: User) {
		return new Promise((resolve, reject) => {
			this.lgServ.isTable('_ona_models').then((_res) => {
				if (_res) {
					let models = JSON.parse(_res),
						results = [],
						list_groups = [];

					this.lgServ.isTable('_ona_group').then((_data) => {
						let groups = [];

						if (_data) groups = JSON.parse(_data);

						for (let j = 0; j < models.length; j++) {
							if (user.groups_id.indexOf(models[j].res_id) > -1) results.push(models[j]);
						}
						//End of matching id group of models with group_ids of user

						for (let k = 0; k < groups.length; k++) {
							if (user.groups_id.indexOf(groups[k].id) > -1) list_groups.push(groups[k]);
						}

						//On retourne la liste des groupes et droits liés au user connecté
						resolve({ groups: list_groups, rights: results });
					});
				}
			});
		});
	}

	/**
   * Cette fonction permet de mettre à jour
   * un enregistrement d'une table dans la bd interne
   * @param type string, le nom du modèle (objet)
   * @param data JSON, les données devant remplacer l'objet ayant l'id
   * @param id int, l'identifiant de l'objet
   * @param ev string, l'événement indiquant quel type de mise à jour que l'on effectue
   *
   **/
	updateNoSync(type, data, id, ev) {
		if (ev == 'standart') {
			this.lgServ.isTable('_ona_' + type).then((res) => {
				if (res) {
					let list_objets = JSON.parse(res);
					let idObj;

					for (let i = 0; i < list_objets.length; i++) {
						if (list_objets[i].me !== undefined) idObj = list_objets[i].me.id.me;
						else idObj = list_objets[i].id;

						if (idObj == id && idObj != 0) {
							list_objets[i] = data;
							break;
						}
					}

					//Cette instruction met à jour la database
					this.lgServ.setTable('_ona_' + type, list_objets);
				}
			});
		} else if (ev == 'advance') {
		}
	}

	/**
   * Cette fonction permet de synchroniser des requêtes spécifique
   * sur un modèle 
   * @param type string, le nom de l'objet
   * @param params any, l'objet à modifier dans la bd interne
   **/
	updateSyncRequest(type, params) {
		this.lgServ.isTable('_ona_update_' + type).then((res) => {
			let reqs = [];
			if (res) {
				reqs = JSON.parse(res);
			}

			reqs.push(params);
			this.lgServ.setTable('_ona_update_' + type, reqs);
		});
	}

	/**
   * Cette fonction permet d'ajouter un élément
   * dans la bd interne
   * @param type string, le nom du modèle
   * @param objet JSon, l'objet à insérer
   *
   **/
	copiedAddSync(type, objet) {
		this.lgServ.isTable('_ona_' + type).then((res) => {
			let reqs = [];
			if (res) {
				reqs = JSON.parse(res);
			}

			reqs.push(objet);
			this.lgServ.setTable('_ona_' + type, reqs);
		});
	}

	/**
   * Cette fonction permet de retirer un élément
   * dans la bd interne
   * @param type string, le nom du modèle
   * @param objet JSon, l'objet à supprimer
   *
   **/
	removeObjetSync(type, objet) {
		this.lgServ.isTable('_ona_' + type).then((res) => {
			let reqs = [];

			if (res) {
				reqs = JSON.parse(res);
				for (let j = 0; j < reqs.length; j++) {
					if (reqs[j].id == objet.id) {
						reqs.splice(j, 1);
						break;
					}
				}

				this.lgServ.setTable('_ona_' + type, reqs);
			}
		});
	}

	/** Cette fonction permet d'enregistrer les requetes de copie
   *  pour chaque objet (modèles)
   * @param type string, le nom de l'objet
   *
   **/
	syncDuplicateObjet(type, data) {
		this.lgServ.isTable('_ona_copy_' + type).then((res) => {
			let reqs = [];
			if (res) {
				reqs = JSON.parse(res);
			}

			reqs.push(data);
			this.lgServ.setTable('_ona_copy_' + type, reqs);
		});
	}

	/** Cette fonction permet d'enregistrer les requetes d'insertion
   *  pour chaque objet (modèles)
   * @param type string, le nom de l'objet
   *
   **/
	syncCreateObjet(type, data) {
		this.lgServ.isTable('_ona_add_' + type).then((res) => {
			let reqs = [];
			if (res) {
				reqs = JSON.parse(res);
			}

			reqs.push(data);
			this.lgServ.setTable('_ona_add_' + type, reqs);
		});
	}

  /**
   * Cette fonction permet de mettre à
   * jour la liste des notes dans la bd interne
   *
   ***/
	updateListStagesSync(alias, list_notes) {
		let results = [];
		for (let i = 0; i < list_notes.length; i++) {
			let tabs = list_notes[i].tab;
			for (let j = 0; j < tabs.length; j++) results.push(tabs[j]);
		}

		//this.lgServ.setTable('_ona_'+alias, results);
	}

	/**
   * Cette fonction permet de récupérer la liste des
   * meetings dont les ids (participants)
   *
   **/
	getMyMeetings(sources, tab_ids) {
		//console.log('id '+tab_ids);

		return new Promise((resolve, reject) => {
			let results = [];
			for (let i = 0; i < sources.length; i++) {
				let cpt = 0;

				if (tab_ids.length != 0) {
					for (let j = 0; j < tab_ids.length; j++) {
						if (sources[i].partner_ids.indexOf(tab_ids[j]) > -1) cpt++;
					}
				} else {
					results.push(sources[i]);
				}

				if (cpt > 0) results.push(sources[i]);
			}

			resolve(results);
		});
	}

	/**
   * 
   * @param type string, le type d'objet 
   * @param champ string, le champ surlequel appliqué le filtre
   * @param id l'id de l'élément courant
   */
	groupElementsBy(type: string, champ: string, id: any) {
		return new Promise((resolve, reject) => {
			// console.log(champ);
			// console.log(id);
			let results = [];
			this.lgServ.isTable('_ona_' + type).then((res) => {
				if (res) {
					let elements = JSON.parse(res);
					for (let i = 0; i < elements.length; i++) {
						if (elements[i].me === undefined) {
							if (elements[i][champ].id == parseInt(id)) results.push(elements[i]);
						} else {
							if (
								champ == 'file_id' &&
								elements[i].file_id.id != 0 &&
								elements[i].file_id.id == parseInt(id)
							)
								results.push(elements[i]);
							else if (champ == 'color' && elements[i].color == parseInt(id)) results.push(elements[i]);
						}
					}
				}

				resolve(results);
			});
		});
	}

	///////////////////////////////////////////////////////////////////////////////////
	/**
	 * Cette fonction permet d'enregistrer un
	 * nouvel objet
	 * @param type string, (client, contact, tribunal)
   	 * @param objLogin Object, identifiant de l'utilisateur
	 * @param user struct, contient les params de connexion
	 * @param objModal ModalController, l'objet Modal controller
	 * 
	 *
	 **/

	createObjet(type, objLogin, user, objModal) {
		let msgLoading = this.loading.create({
			content: "Procédure d'enregistrement en cours, Patienter un moment..."
		});
		let message = '';

		//callback when modal is dismissed (recieve data from View)
		objModal.onDidDismiss((data) => {
			if (data) {
				if (type == 'client') message = this.txtObjet.message.customer;
				else if (type == 'contact') message = this.txtObjet.message.contact;
				else if (type == 'notes') message = this.txtObjet.message.note;
				else if (type == 'tags') message = this.txtObjet.message.tag;

				//console.log(data);
				msgLoading.present();
				//On met à jour les informations (data) dans la base de données interne
				this.syncCreateObjet(type, data); //on insere dans la bd des ajouts
				this.copiedAddSync(type, data); //ON insère dans la bd liste
				msgLoading.dismiss();
				this.showMsgWithButton(message, 'top', 'toast-success');
			}
		});

		objModal.present();
	}

	createObjetResult(type, objLogin, user, objModal, callback) {
		let message = '';

		//callback when modal is dismissed (recieve data from View)
		objModal.onDidDismiss((data) => {
			if (data) {
				if (type == 'notes') message = this.txtObjet.message.note;
				else if (type == 'client' || type == 'contact') {
					message = 'Le ' + type + ' a été créé';
				} else if (type == 'agenda') {
					message = this.txtObjet.message.meeting;
					this.lgServ.setTable('remind', data.reminders);
				} else if (type == 'leads') {
					//message = this.txtObjet.message.meeting;
					//this.lgServ.setTable('remind', data.reminders);
				} else {
					message = this.txtObjet.message.copy;
				}

				//console.log(data);
				this.syncCreateObjet(type, data);
				callback(data);
			}
		});

		objModal.present();
	}

	/**
   * Cette fonction permet d'insérer des données 
   * en mode Online
   * 
   * @param type string, le nom du modèle
   * @param data JSON Object, l'objet à insérer
   * @param objLoader boolean, le spinner
   * @param callback 
   */

	createSingleOnline(type, data, objLoader, callback) {
		this.lgServ.getLogin().then((res) => {
			if (res) {
				let objLogin = JSON.parse(res);
				this.lgServ.getSettingUser().then((reponse) => {
					if (reponse) {
						let user = JSON.parse(reponse);

						this.odoo().createObjet(user, objLogin, type, data, (res) => {
							objLoader = false;
							// console.log(res);
							if (res.errno == 0) {
								let tab = [],
									tab_ids;

								tab.push({ me: res.val.me });
								tab_ids = this.odoo().formatIdsToXml(tab);

								//On ajoute l'objet enregistré à la liste
								this.getAttributesObject(user, objLogin, objLoader, tab_ids, type, (data) => {
									callback(data[0]);
								});
							} else if (res.errno == 5) {
								callback({ error: 0, message: this.txtObjet.message.internet });
							} else callback({ error: 1, message: this.txtObjet.message.err_chat });
						});
					}
				});
			}
		});
	}

	/**
   * Cette fonction permet d'ouvrir
   * une boite de dialogue pour confirmer
   * un nouvel enregistrement
   *
   **/
	addNewObjet(objNav, titre, message) {
		let confirm = this.alertCtrl.create({
			title: titre,
			message: message,
			buttons: [
				{
					text: 'NO',
					handler: () => {
						//console.log('Disagree clicked');
						objNav.pop(); // On quitte la page
					}
				},
				{
					text: 'YES',
					handler: () => {
						//console.log('Agree clicked');
						//On ouvre une nouvelle page
					}
				}
			]
		});
		confirm.present();
	}

	getListOfModelsToNotify() {
		let tab_objets = [
			{ title: this.objMenu.chat, icon: 'message', component: 'ChatPage', slug: 'mail.message' },
			{ title: this.objMenu.agenda, icon: 'agenda', component: 'DetailsAgendaPage', slug: 'calendar.event' },
			{ title: this.objMenu.note, icon: 'notes', component: 'FormNotePage', slug: 'note.note' },
			{ title: this.objMenu.affaire, icon: 'leads', component: 'DetailLeadOpportPage', slug: 'crm.lead' },
			// { title: this.objMenu.audience, icon: 'audiences', component: 'DetailsAudiencePage', slug: 'calendar.event' },

			{ title: this.objMenu.compta, icon: 'invoice', component: 'DetailsInvoicePage', slug: 'account.invoice' }
		];

		return tab_objets;
	}

	/**
   * Cette fonction permet d'afficher les informations
   * relatives à une 
   * @param objMsg Message, objet de type Message
   */
	getPageOfModel(objMsg) {
		return new Promise((resolve, reject) => {
			let models = this.getListOfModelsToNotify();

			for (let j = 0; j < models.length; j++) {
				const element = models[j];

				this.lgServ.isTable('_ona_' + element.icon).then((res) => {
					if (res) {
						let tables = JSON.parse(res);
						//console.log(tables);
						let objFind;
						for (let idx = 0; idx < tables.length; idx++) {
							let id;
							if (tables[idx].me !== undefined) id = tables[idx].me.id.me;
							else id = tables[idx].id;
							//console.log(element.icon+" =>"+id);
							if (id == objMsg.res_id && element.slug == objMsg.model) {
								//console.log("find");
								objFind = { objet: tables[idx], page: element };
								//console.log(objFind);
								resolve(objFind);
								break;
							}
						}
					}
				});
			}
		});
	}

	////////////////////////////////////////////////////////////////////////////
	// DEFINITION DES REQUETES ODOO PERMETTANT DE RECUPERER LES ENREGISTREMENTS
	///////////////////////////////////////////////////////////////////////////

	/**
   * Cette fonction permet de récupérer la liste
   * des enregistrements 
   *
   * @param user Object(JSON), il s'agit du user's API
   * @param type string, la nature du modèle (note, audiences, tâches)
   * @param objLogin Object(JSON), il s'agit de l'utilisateur connecté
   * @param objFiltre Object(JSON), cet objet permet de filtrer la recherche de l'utilisateur
   * @param offset int, index à partir duquel commencer la lecture
   * @param max int, le nombre d'objets à récupérer
   *
   * @return callback
   **/
	requestObjectToOdoo(type, objAffaire, objFiltre, objSpinner, callback, options?: any) {
		objSpinner = true;
		let id_affaire = 0;

		if (objAffaire != null) {
			if (objAffaire.options === undefined) id_affaire = objAffaire.id;
			else if (objAffaire.options !== undefined) id_affaire = objAffaire;

			if (objAffaire.search !== undefined) {
				id_affaire = objAffaire;
			}
		}

		//console.log(id_affaire);
		this.lgServ.getLogin().then((res) => {
			if (res) {
				let objLogin = JSON.parse(res);
				this.lgServ.getSettingUser().then((reponse) => {
					if (reponse) {
						let user = JSON.parse(reponse);
						user['affaire'] = id_affaire;

						this.odoo().getListObjets(user, objLogin, objFiltre, type, (data) => {
							// console.log(data);

							if (data.errno == 0) {
								callback(data.val.me);
							} else {
								if (data.errno == 5) {
									if (options !== undefined) {
										this.showMsgWithButton(this.txtObjet.native.err_network, 'top', 'toast-error');
										if (options.complete() !== undefined) options.complete();
									}
								} else {
									if (data.errno == 4) {
										callback([]);
									}

									if (options !== undefined) {
										this.showMsgWithButton(this.txtObjet.native.err_server, 'top', 'toast-error');
										if (options.complete() !== undefined) options.complete();
									}
								}
							}
						});
					}
				});
			}
		});
	}

	/**
	 * Cette fonction permet de récupérer 
	 * la liste des identifiants d'un modèle
	 *
	 * @param user Object(JSON), il s'agit du user's API
	 * @param type string, la nature du modèle (note, audiences, tâches)
	 * @param objLogin Object(JSON), il s'agit de l'utilisateur connecté
	 * @param objFiltre Object(JSON), cet objet permet de filtrer la recherche de l'utilisateur
	 * @param offset int, index à partir duquel commencer la lecture
	 * @param max int, le nombre d'objets à récupérer
	 *
	 * @return callback
	 **/
	requestIdObjectToOdoo(type, objFiltre, callback, options?: any) {
		
		const id_affaire = 0;

		//console.log(id_affaire);
		this.lgServ.getLogin().then((res) => {
			if (res) {
				let objLogin = JSON.parse(res);
				this.lgServ.getSettingUser().then((reponse) => {
					if (reponse) {
						let user = JSON.parse(reponse);
						user['affaire'] = id_affaire;

						this.odoo().reqListObjets(user, objLogin, objFiltre, type, (data) => {
							// console.log(data.val.me);
							let liste_ids = data.val.me, tab_ids = [];

							if (data.errno == 0) {

								for (let k = 0; k < liste_ids.length; k++) 
									tab_ids.push(liste_ids[k].me)
									
								callback(tab_ids);

							} else {

								if (data.errno == 5) {
									if (options !== undefined) {
										this.showMsgWithButton(this.txtObjet.native.err_network, 'top', 'toast-error');
										if (options.complete() !== undefined) options.complete();
									}
								} else {
									if (data.errno == 4) {
										callback([]);
									}

									if (options !== undefined) {
										this.showMsgWithButton(this.txtObjet.native.err_server, 'top', 'toast-error');
										if (options.complete() !== undefined) options.complete();
									}
								}
							}
						});
					}
				});
			}
		});
	}

	/**
   * Cette méthode permet de récupérer la liste
   * des enregistrements d'un modèle à partir de 
   * de la table des identifiants
   * @param tab Array<int>, tableau des identifiants
   * @param type string , le nom de l'objet
   * @param callback 
   */
	getObjectsOnline(tab_ids, type, callback) {
		this.lgServ.getLogin().then((res) => {
			if (res) {
				let objLogin = JSON.parse(res);
				this.lgServ.getSettingUser().then((reponse) => {
					if (reponse) {
						let user = JSON.parse(reponse);
						let tab = this.odoo().formatIdsToXml(tab_ids);
						this.odoo().listObjets(user, objLogin, tab, type, (data) => {
							//objSpinner = false;
							if (data.errno == 0) {
								callback(data.val.me);
							} else if (data.errno == 5) {
								callback({ error: 5, message: '' });
							} else {
								callback({ error: 1, message: '' });
							}
						});
					}
				});
			}
		});
	}

	/** Cette fonction récupère la couleur
   *  du code correspondant
   **/
	getBgColor(code_color) {
		let colors = this.palette;

		if (colors !== undefined) {
			for (let i = 0; i < colors.length; i++) {
				if (colors[i].code == code_color) {
					return colors[i].val;
				}
			}
		}

		return null;
	}

	/**
   * Cette fonction permet d'obtenir la liste des notes
   * regroupées par Stages
   *
   * @param stages Object(JSON),
   * @param notes Object
   * @param criteria string, détermine s'il s'agit (note, archive ou supprimée)
   *
   * @return JSON Object
   **/
	filterNotesByStages(stages, notes, criteria) {
		let result = [];
		for (var i = 0; i < stages.length; i++) {
			let tab = [];

			for (var j = 0; j < notes.length; j++) {
				if (stages[i].me.id.me == notes[j].stage_id.id) {
					let bg_color = this.getBgColor(notes[j].color);
					notes[j]['bg'] = bg_color;
					// notes[j].memo = String(notes[j].me.memo.me).replace(/<[^>]+>/gm, '');
					if (criteria == 'note' && notes[j].open) tab.push(notes[j]);
					else if (criteria == 'archive' && !notes[j].open) tab.push(notes[j]);
				}
			}

			if (tab.length != 0)
				result.push({ id: stages[i].me.id.me, couleur: i, nom: stages[i].me.name.me, tab: tab });
		}
		console.log(result);
		return result;
	}

	/**
   * Cette fonction permet de classer
   * les leads par équipe de vente
   * @param objets Array<JSON>, liste des objets à classer
   * @param type string, le type d'objet à classer
   * @param slug string, (all or team)
   * @param id_team int, id de la team ()
   **/
	getLeadsOfTeams(teams, type, slug) {
		return new Promise((resolve, reject) => {
			this.lgServ.isTable('_ona_' + type).then((res) => {
				if (res) {
					let results = [],
						objets = JSON.parse(res);
					if (slug == 'pipeline') {
						for (let i = 0; i < teams.length; i++) {
							for (let j = 0; j < objets.length; j++) {
								if (teams[i].id == objets[j].team_id.id) results.push(objets[j]);
							}
						}
					} else {
						results = objets;
					}

					resolve(results);
				} else {
					reject('No Teams. Synchronize your data');
				}
			});
		});
	}

	/**
   * Cette fonction permet de classer
   * les leads par équipe de vente
   * @param objets Array<JSON>, liste des objets à classer
   * @param type string, le type d'objet à classer
   * @param slug string, (all or team)
   * @param id_team int, id de la team ()
   **/
	groupLeadsByTeams(type, slug, id_team) {
		return new Promise((resolve, reject) => {
			this.lgServ.isTable('_ona_' + type).then((res) => {
				if (res) {
					let results = [],
						objets = JSON.parse(res);

					for (let j = 0; j < objets.length; j++) {
						if (id_team == objets[j].team_id.id) {
							console.log('trouve');
							results.push(objets[j]);
						}
					}

					resolve(results);
				}
			});
		});
	}

	/**
   * Cette fonction permet d'obtenir la liste des opportunities
   * regroupées par Stages
   *
   * @param stages Object(JSON),
   * @param affaires Object
   *
   * @return JSON Object
   **/
	filterAffairesByStages(stages, leads, criteria) {
		let result = [];

		for (var i = 0; i < stages.length; i++) {
			let tab = [];

			for (var j = 0; j < leads.length; j++) {
				if (stages[i].me.id.me == leads[j].stage_id.id) {
					let bg_color = this.getBgColor(leads[j].color);
					leads[j]['bg'] = bg_color;
					if (criteria == 'pipeline' && leads[j].active && leads[j].type == 'opportunity') tab.push(leads[j]);
					/*else if (criteria == 'archive' && !leads[j].active) tab.push(leads[j]);
            else if (criteria == 'invoice' && leads[j].active && leads[j].invoice_count > 0)
              tab.push(leads[j]);*/
				}
			}

			if (tab.length != 0)
				result.push({ id: stages[i].me.id.me, couleur: i, nom: stages[i].me.name.me, tab: tab });
		}

		return result;
	}

	/** 
   * Cette fonction permet de récupérer le champ
   * image de type binary = base64
   * @param type string, l'objet pour lequel récupérer le champ image
   * @param id int, l'identifiant de l'objet dont on souhaite recupérer le champ
   * @param champ string, le champ dont on souhaite récupérer
   **/
	requestImageBinaryToOdoo(type, ids, loading, champ, callback) {
		//console.log(id_affaire);
		this.lgServ.getLogin().then((res) => {
			if (res) {
				let objLogin = JSON.parse(res);
				this.lgServ.getSettingUser().then((reponse) => {
					if (reponse) {
						let user = JSON.parse(reponse);
						let tab = [],
							tab_ids = [];
						//tab.push({me: id});

						tab_ids = this.odoo().formatIdsToXml(ids);
						//On appelle la fonction qui va recuperer les attributs
						this.odoo().getChampObjet(user, objLogin, tab_ids, type, champ, (data) => {
							if (data.errno == 0) {
								callback(data.val.me);
							} else if (data.errno == 5) {
								//loading.dismiss();
								//this.showMsgWithButton(this.err_network, 'top');
							} else {
								//loading.dismiss();
								//this.showMsgWithButton(this.err_server, 'top');
							}
						});
					}
				});
			}
		});
	}

	/**
   * Cette fonction est chargé de retirer
   * l'utilisateur connecté dont l'identifiant se trouve
   * dans la table tab_ids
   **/
	getAttributesObject(user, objLogin, objSpinner, tab_ids, type, callback, options?: any) {
		this.odoo().listObjets(user, objLogin, tab_ids, type, (data) => {
			//objSpinner = false;
			if (data.errno == 0) {
				callback(data.val.me);
			} else {
				if (data.errno == 5) {
					if (options !== undefined) {
						this.showMsgWithButton(this.txtObjet.native.err_network, 'top', 'toast-error');
						if (options.complete() !== undefined) options.complete();
					}
				} else {
					if (options !== undefined) {
						this.showMsgWithButton(this.txtObjet.native.err_server, 'top', 'toast-error');
						if (options.complete() !== undefined) options.complete();
					}
				}
			}
		});
	}

	/**
   * Cette fonction permet de mettre à Jour les 
   * informations sur la note et d'autres objet
   **/
	updateNoteToOdoo(user, login, type, idObjet, data, callback) {
		//On met à jour les informations (data) dans la base de données
		this.odoo().updateObjet(user, login, type, idObjet, data, (res) => {
			//console.log(res);
			callback(res);
		});
	}

	/**
   * Cette fonction permet de mettre à jour
   * une note en fonction de l'action à appliquer sur la note
   * @param action JSONObject, il contient l'action à executer et le message à afficher en cas
   *                          de succès
   * @param user, les paramètres de connexion
   * @param login, les paramètres du user connecté
   * @param idObj int, l'identifiant de la note à modifier
   * @param data JSONObject, les données à insérer
   *
   **/
	updateObjectByAction(action, type, idObj, data, stages, objLoader, objSpinner, callback) {
		let message = '';

		switch (action) {
			case 'stage': {
				message = 'The stage are changed';
				break;
			}
			case 'opportunity': {
				message = 'The Lead is converted into opportunity and move in the Pipeline';
				break;
			}
			case 'lost': {
				message = 'The Lead is lost';
				break;
			}
			case 'won': {
				message = 'Congratulations you are won this Opportunity';
				break;
			}
			case 'archive': {
				message = 'This is Lead is deleted';
				break;
			}
			case 'update': {
				message = 'The Lead/Opportunity is updated';
				break;
			}
			case 'tags': {
				message = 'The tag is linked to Lead/Opportunity';
				break;
			}
			case 'new': {
				break;
			}
		}

		if (action != 'update') data['id'] = idObj;
		// else
		//   this.updateNoSync(type, data, idObj, 'standart');

		//Définition de la requête
		//Mise à jour de la liste  des requetes de maj (bd)
		this.updateSyncRequest(type, data);

		// if(action!="won")
		//   this.showMsgWithButton(message,'top','toast-success');
		callback(true);
	}

	/**
   * Cette fonction permet de mettre à jour
   * un objet quelque soit le modèle
   * 
   * @param type string, il s'agit d'un type de modèle
   * @param idObj int, l'identifiant de la note à modifier
   * @param data JSONObject, les données à insérer
   *
   **/
	updateSingleObject(type, idObj, data, objSpinner, callback) {
		this.lgServ.getLogin().then((res) => {
			if (res) {
				let login = JSON.parse(res);
				this.lgServ.getSettingUser().then((reponse) => {
					if (reponse) {
						let user = JSON.parse(reponse);

						this.odoo().updateObjet(user, login, type, idObj, data, (result) => {
							//console.log(result);
							if (typeof objSpinner !== 'boolean') objSpinner.dismiss();
							else objSpinner = false;

							if (result.errno == 0) {
								callback(result);
							} else if (result.errno == 5) {
								//this.showMsgWithButton(this.err_network, 'bottom');
							} else {
								//this.showMsgWithButton(this.err_server, 'bottom');
							}
						});
					}
				});
				//fin get settingUser
			}
		}); //fin getLogin
	}

	/**
   * Cette fonction permet de faire une copie 
   * d'un objet quelque soit le modèle
   * 
   * @param type string, il s'agit d'un type de modèle
   * @param id int, l'identifiant de l'objet à dupliquer
   * @param data JSONObject, les données modifiées
   * @param loading LoadingCtrl, pour afficher le traitement d'une action
   *
   **/
	copySingleObject(type, id, data, loading, callback) {
		this.lgServ.getLogin().then((res) => {
			if (res) {
				let login = JSON.parse(res);
				this.lgServ.getSettingUser().then((reponse) => {
					if (reponse) {
						let user = JSON.parse(reponse);

						this.odoo().copyObjet(user, login, type, id, data, (result) => {
							console.log(result);

							callback(result);
						});
					}
				});
				//fin get settingUser
			}
		}); //fin getLogin
	}

	/**
   * Cette fonction permet de classer les objets
   * par stages 
   * @param stages Array<JsonObject>, la liste des stages
   * @param objLoader boolean
   * @param type string, le type d'objet à charger
   **/
	private loadListObjets(stages, objLoader, objSpinner, type, callback) {
		objLoader = true;

		if (objLoader) objSpinner = false;
		else objSpinner = true;

		this.requestObjectToOdoo(type, null, null, objSpinner, (res) => {
			objSpinner = false;
			objLoader = false; // Flag de mise à jour de la liste des objets

			//console.log(res);
			if (res.length != 0) {
				let tab_objets = this.filterAffairesByStages(stages, res, 'affaire');
				callback(tab_objets);
			}
		});
	}

	/**
   * Cette fonction permet d'insérer une objet
   * dans la bd et d'ajouter la note à la liste
   *
   * @param Form ObjPage, il s'agit de la vue Formulaire
   * @param params JSON, il s'agit des paramètres à envoyer au formulaire
   * @param type string, il s'agit du type d'objet sur lequel faire une insertion (client,  
   *                     notes, etc.)
   * @param login JSONObject, il sera utilisé pour identifier la req faite par le user connecte
   * @param user JSONObject, il définit la config pour se connecter au serveur
   * @param objLoader boolean, il s'agit d'un spinner d'attente
   * @param callback, cette fonction est utilisé pour récupérer le retour du serveur via un 
   *                callback
   ***/
	onAddObjet(Form, params, type, login, user, objLoader, callback) {
		let addModal = this.modalCtrl.create(Form, params);

		this.createObjetResult(type, login, user, addModal, (res) => {
			let tab = [],
				tab_ids;

			/*tab.push({me: res});
        tab_ids = this.odoo().formatIdsToXml(tab);*/
			callback(res);
			/*//On ajoute l'objet enregistré à la liste
        this.getAttributesObject(user, login, objLoader, tab_ids, type, (data)=>{
          
        });*/
		});
	}

	/**
   * Cette fonction permet de créer un objet
   * @param type string, 
   * @param data Object, il s'agit de l'objet à insérer
   * @param options Object, informations de l'utilisateur connecté (optional)
   *
   **/
	addObjetToServer(type, data, options?: any) {
		return new Promise((resolve, reject) => {
			this.lgServ.getSettingUser().then((reponse) => {
				if (reponse) {
					let user = JSON.parse(reponse);

					this.lgServ.getLogin().then((_login) => {
						if (_login) {
							let objLogin = JSON.parse(_login);

							this.odoo().createObjet(user, objLogin, type, data, (res) => {
								//console.log(res);

								if (res.errno == 0) {
									//this.alertSuccess(message).present();
									let tab = [],
										tab_ids;

									tab.push({ me: res.val.me });
									tab_ids = this.odoo().formatIdsToXml(tab);

									//On ajoute l'objet enregistré à la liste
									this.getAttributesObject(user, objLogin, false, tab_ids, type, (data) => {
										if (data.length !== undefined) resolve(data[0]);
										else reject({ error: 5, message: this.txtObjet.native.err_network });
									});
								} else if (res.errno == 5) {
									reject({ error: 5, message: this.txtObjet.native.err_network });
								} else {
									reject({ error: 4, message: this.txtObjet.native.err_server });
								}
							});
						}
					});
				}
			});
		});
	}

	/**
   * Cette fonction créer un objet à partir d'un formulaire
   * de sauvegarder les informations du formulaire dans la bd
   * et de renvoyer l'objet créé en fonction du type de modèle
   *
   * @param Form FormController, le formulaire de création
   * @param type string, définit le nom du modèle pour lequel on souhaite créer l'objet
   * @param params JSONObject, les paramètres du Formulaire
   *
   **/
	addMyObjet(type, Form, params, callback) {
		this.lgServ.getLogin().then((res) => {
			if (res) {
				let login = JSON.parse(res);
				this.lgServ.getSettingUser().then((reponse) => {
					if (reponse) {
						let user = JSON.parse(reponse);

						this.onAddObjet(Form, params, type, login, user, false, (_data) => callback(_data));
					}
				});
				//fin get settingUser
			}
		}); //fin getLogin
	}

	/**
   * Cette fonction permet de mettre à jour une objet
   * dans la bd et d'ajouter la note à la liste
   *
   * @param Form ObjPage, il s'agit de la vue Formulaire
   * @param params JSON, il s'agit des paramètres à envoyer au formulaire
   * @param type string, il s'agit du type d'objet sur lequel faire une insertion (client,  
   *                     notes, etc.)
   * @param login JSONObject, il sera utilisé pour identifier la req faite par le user connecte
   * @param user JSONObject, il définit la config pour se connecter au serveur
   * @param objLoader boolean, il s'agit d'un spinner d'attente
   * @param callback, cette fonction est utilisé pour récupérer le retour du serveur via un 
   *                callback
   ***/
	onUpdateObjet(form, params, type, login, user, objLoader, callback) {
		let addModal = this.modalCtrl.create(form, params);

		let msgLoading = this.loading.create({ content: 'Updating process...' });
		let message = '';

		let noInternet = 'Update is unavaible due Internet network';
		let errSaving = 'Une erreur est survenu lors de la modification';

		//callback when modal is dismissed (recieve data from View)
		addModal.onDidDismiss((data) => {
			if (data) {
				data['update'] = true;
				if (type == 'team') {
					message = this.txtObjet.message.update_team;
				} else if (type == 'tasks') {
					message = this.txtObjet.message.update_task;
				}

				// msgLoading.present();
				this.updateSyncRequest(type, data);
				this.updateNoSync(type, data, data.id, 'standart');
				// msgLoading.dismiss();
				this.showMsgWithButton(message, 'top', 'toast-success');

				callback(true);
				//On met à jour les informations (data) dans la base de données

				/*this.odoo().updateObjet(user, login, type, data.id, data, (res) =>{

              if(res.errno==0){
                //this.alertSuccess(message).present();
                callback(res.val.me);
              }else{

                if(res.errno==5)
                  this.alertCustomError(noInternet).present();
                else
                  this.alertCustomError(this.err_server).present();
              }
          });*/
			}
		});

		addModal.present();
	}

	/**
   * Cette fonction permet d'insérer un élément
   * dans une liste d'objets (vide ou pas)
   * @param liste Array<Object>
   * @param elt Object, objet à inserer
   **/
	emptyTabInsert(liste, elt, type) {
		let stage, current;

		if (type == 'notes') {
			let bg_color = this.getBgColor(elt.color);
			stage = { id: elt.stage_id.id, name: elt.stage_id.name };

			// elt.me.memo.me = String(elt.memo).replace(/<[^>]+>/gm, '');
			elt['bg'] = bg_color;
			current = elt;
		} else {
			stage = { id: elt.stage_id.id, name: elt.stage_id.name };
			/*if(type=='tasks')
        current = new Task('n',elt);
      else*/
			/*if(type=='audiences')
        current = new Audience('n',elt);*/
		}

		//Cette fonction permet d'insérer un élément dans un tab vide
		if (liste.length == 0) {
			let tab = [];
			tab.push(current);

			let objInsert = {
				id: 0,
				couleur: '#ffffff',
				nom: stage.name,
				tab: tab
			};

			liste.push(objInsert);
		}

		for (let i = 0; i < liste.length; i++) {
			if (liste[i].id == stage.id) {
				liste[i].tab.push(current);
				break;
			}
		}
	}

	/**
   * Cette fonction permet de retirer un élément
   * dans la liste
   * @param elements Array<Lead> , liste des éléments
   * @param id int, l'id de l'élément à retirer
   * @param stage int, stage auquel appartient l'objet
   *
   **/
	removeObjetFromList(elements, id, stage) {
		for (let j = 0; j < elements.length; j++) {
			if (elements[j].id == id) {
				elements.splice(j, 1);
				break;
			}
		}
	}

	/** Cette fonction permet de d'ajouter un élément
   *  dans la liste après l'appel d'un évènement
   *  @param events Events
   *  @param nom_event string, nom de l'évènement
   *  @param liste Array<JSONObject>, liste des objets
   *
   **/
	addElementOnEvent(events, nom_event, liste) {
		events.subscribe(nom_event, (partner) => {
			for (let i = 0; i < liste.length; i++) {
				let elements = liste[i].tab;

				for (let j = 0; j < elements.length; j++) {
					if (elements[j].id == partner.id) {
						elements.splice(i, 0, partner.item);
						break;
					}
				}
			}
		});
	}

	/**
   * Cette fonction permet de retirer
   * un élément du tableau après un évènement
   *
   **/
	removeElementOnEvent(events, nom_event, liste) {
		events.subscribe(nom_event, (id_partner) => {
			for (let i = 0; i < liste.length; i++) {
				let elements = liste[i].tab;

				for (let j = 0; j < elements.length; j++) {
					if (elements[j].id == id_partner) {
						elements.splice(j, 1);
						break;
					}
				}
			}
		});
	}

	/**
   * Cette fonction permet d'ajouter un objet à la 
   * bd et de récupérer les infos de l'objet enregistré
   * @param type string, le type de d'objet tags
   * @param data JSON, objet (informations) à insérer dans le modèle type
   * @param user JSON, l'objet contenant les informations de connexion
   * @param objLogin JSON, l'utilisateur connecté
   *
   **/
	singleAddObjetResult(user, objLogin, type, data, callback) {
		this.odoo().createObjet(user, objLogin, type, data, (res) => {
			console.log(res);
			if (res.errno == 0) {
				let tab = [],
					tab_ids;
				tab.push({ me: res.val.me });
				tab_ids = this.odoo().formatIdsToXml(tab);

				this.getAttributesObject(user, objLogin, false, tab_ids, type, (_data) => {
					callback(_data[0]);
				});
			} else if (res.errno == 5) {
				this.showMsgWithButton(this.txtObjet.message.tag_info, 'bottom');
				this.syncCreateObjet(type, data);
			} else {
				//this.showMsgWithButton(this.err_server, 'bottom');
			}
		});
	}

	/**
   * Cette fonction permet de récupérer
   * les tags appartenant à un objet
   * @param type string, le type de d'objet tags
   * @param tag_ids, le tableau contenants les ids des tags
   * @param spinner boolean
   *
   **/
	getTags(type, tag_ids, spinner, callback) {
		this.lgServ.getLogin().then((res) => {
			if (res) {
				let login = JSON.parse(res);

				this.lgServ.getSettingUser().then((reponse) => {
					if (reponse) {
						let user = JSON.parse(reponse);
						let tabs = [];
						tabs = this.odoo().formatIdsToXml(tag_ids);

						this.getAttributesObject(user, login, spinner, tabs, type, (_res) => {
							callback(_res);
						});
					}
				});
			}
		});
	}

	/**
   * Cette fonction permet d'ajouter ou de modifier
   * un tag
   * @param type string, le type de d'objet tags
   * @param objTag, le tag à modifier (null si insertion)
   * @param user JSON, l'objet contenant les informations de connexion
   * @param login JSON, l'utilisateur connecté
   *
   **/
	editTag(type, objTag, callback) {
		if (objTag.add !== undefined) {
			//On insère le tag
			this.lgServ.getLogin().then((res) => {
				console.log('get login  ', res)
				if (res) {
					let login = JSON.parse(res);

					this.lgServ.getSettingUser().then((reponse) => {
						if (reponse) {
							let user = JSON.parse(reponse);
							this.singleAddObjetResult(user, login, type, objTag.add, (res) => {
								callback(res);
							});
						}
					});
				}
			});
		} else {
			//On modifie le tag

			let prompt = this.alertCtrl.create({
				title: 'ONA Smart Sales',
				message: this.txtObjet.message.update_tag,
				inputs: [
					{
						name: 'tag',
						placeholder: this.txtObjet.message.txt_tag,
						value: objTag.me.name.me
					}
				],
				buttons: [
					{
						text: this.txtObjet.btns.cancel,
						role: 'cancel'
					},
					{
						text: this.txtObjet.message.update,
						handler: (data) => {
							//console.log(data);
							objTag.me.name.me = data.tag;
							this.updateSingleObject(type, objTag.me.id.me, data.tag, false, (res) => {
								callback(res);
							});
						}
					}
				]
			});

			prompt.present();
		}
	}

	/**
   * Cette fonction permet d'enregistrer un rendez vous
   * dans le calendrier (Agenda) de l'appareil de l'utilisateur
   * @param agenda Agenda, l'objet Agenda à insérer
   *
   **/
	saveInCalendar(agenda) {
		
		return new Promise((resolve, reject) => {
			
			let debut, fin, options = {};

			if (agenda.allday) {
				debut = new Date(agenda.start_date);
				fin = new Date(agenda.stop_date);
			} else {
				debut = new Date(agenda.start_datetime);
				fin = new Date(agenda.stop);
			}

			//On crée l'événement
			let event = {
				title: agenda.name,
				lieu: agenda.location,
				msg: agenda.description,
				start: debut,
				end: fin
			};

			//On récupère le remind
			this.lgServ.isTable('remind').then((reponse) => {
				if (reponse) {
					let remind = JSON.parse(reponse);
					options = {};
				}

				this.calServ.deleteEvent(event.title, event.lieu, event.msg, event.start, event.end).then(deleted=>{

					this.calServ.createEvent(event.title, event.lieu, event.msg, event.start, event.end).then((msg) => {
						resolve(msg);
	
					}).catch((err) => {
						reject(err);
					});

				});
				

				//This lines according to iOS
				// this.calServ.hasReadWritePermission().then((res) => {
				// 	if(res){

				// 	}else{
				// 		//Request permission
				// 		this.calServ.requestReadWritePermission().then((res) => {
				// 			this.calServ.createEventInteractively(event.title, event.lieu, event.msg, event.start, event.end).then((msg) => {
				// 				resolve(msg);
			
				// 			}).catch((err) => {
				// 				reject(err);
				// 			});
				// 		});
				// 	}

				// }).catch((error) => {
				// 	reject(error);
				// });

			}); //Fin LgServ

		});

	} //Fin saving in calendar

	//On synchronise l'Agenda avec tous les rendez vous
	//de l'utilisateur courant out tous les autres utilisateurs
	synInCalendar(events) {
		for (let i = 0; i < events.length; i++) {
			this.saveInCalendar(events[i].agenda).then((res) => {});
		}
	}

	/**
    * Cette fonction permet de créer la liste
    * des factures relative à une affaire ou pas
    **/
	filterInvoice(res, type) {
		let resultats = [];

		for (let i = 0; i < res.length; i++) resultats.push(new Invoice(type, res[i]));

		return resultats;
	}

	/////////////////////////////////////////////////////////////////////////////////
	// Cette section permet de générer la liste des blocs (meetings, opportunités,
	// bons de commandes, factures)
	//
	/////////////////////////////////////////////////////////////////////////////////
	
	getListBlocsUser(user: User){
		
		return new Promise((resolve, reject)=>{
			console.log(user);
			this.lgServ.isTable('_ona_call').then(_calls=>{

				let results = [];
				this.lgServ.isTable('_ona_vente').then(_data=>{
	
					this.lgServ.isTable('_ona_invoice').then(_res=>{
	
						this.lgServ.isTable('_ona_leads').then(res=>{
							
							//On ajoute la ligne meeting
							results.push({
								"state": "meetings",
								"icon": "icon-calendar",
								"label": this.txtObjet.module.agenda.f_subtitle,
								"total_meetings": user.meeting_ids.length
							});
			
							if(res){
								let leads : Array<Lead> = JSON.parse(res), opports_won = 0, opports_total = 0;
								for (let i = 0; i < leads.length; i++) {
									if(user.id == leads[i].user_id.id && leads[i].type=="opportunity") {
										if(leads[i].probability==100)
											opports_won++;
	
										opports_total++;
									}
									
								}
			
								let opport_ratio = 0;
								
								if(opports_total!=0)
									opport_ratio = Math.ceil((opports_won/opports_total)*100);
			
								//ON ajoute la ligne Opportunités
								results.push({
									"state": "opportunity",
									"icon": "icon-account-check",
									"rapport_opports": opport_ratio,
									"total_won_opports": opports_won,
									"label": this.txtObjet.message.opportunity,
									"total_opports": opports_total
								});
			
							}
						});
	
						//Traitements de la liste des bons de commandes liés à l'utilisateur
						if(_data){
							let ventes:Array<Vente> = JSON.parse(_data), somme = 0;
							for (let j = 0; j < ventes.length; j++) {
								if(user.id==ventes[j].user_id.id && ventes[j].state=="sale")
									somme+= ventes[j].amount_total;
								
							}
	
							//On ajoute la ligne meeting
							results.push({
								"state": "saleorder",
								"icon": "icon-cart-outline",
								"label": this.txtObjet.menu.saleorder,
								"total_saleorders": somme
							});
						}
	
						//On traite la liste des factures afin de retourner le montant total sur les factures
						if(_res){
							let factures : Array<Invoice> = JSON.parse(_res), total = 0, total_residual = 0, total_unpaid = 0;
							for (let j = 0; j < factures.length; j++) {
								if(user.id == factures[j].user_id.id){
									total+= factures[j].amount_total;
									total_residual += factures[j].residual;
									if(factures[j].state=="open")
										total_unpaid+= factures[j].amount_total;
								}							
							}
	
							let total_paid = total_unpaid - total_residual;
							//On ajoute la ligne meeting
							results.push({
								"state": "invoices",
								"icon": "icon-credit-card",
								"label": this.txtObjet.menu.compta,
								"total_residual": total_residual,
								"total_unpaid": total_unpaid,
								"total_paid": total_paid,
								"total_invoices": total
							});
						}

						//Récupérer la liste des appels relatifs à un utilisateur
						if(_calls){

							let list_calls : Array<Calls> = JSON.parse(_calls), 
								calls_past = 0, 
								calls_todo = 0, 
								calls_total = 0, 
								calls_done = 0;
							for (let k = 0; k < list_calls.length; k++) {

								if(list_calls[k].user_id.id == user.id){
									if(list_calls[k].state=="open" && new Date()>new Date(list_calls[k].date))
										calls_past++;
									else if(list_calls[k].state=="open" && new Date()<=new Date(list_calls[k].date))
										calls_todo++;
									else if(list_calls[k].state=="done")
										calls_done++;
								} 
								
							}

							//On ajoute la ligne des appels
							results.push({
								"state": "call",
								"icon": "icon-phone",
								"label": this.txtObjet.menu.calls,
								"total_calls": calls_total,
								"total_done": calls_done,
								"total_past": calls_past,
								"total_todo": calls_todo
							});
						}
	
						resolve(results);
					});
				});
			});

		});
	}

	/**
	 * 
	 */
	updateNoSyncLeads(type, data, id, ev) {

		return new Promise((resolve) => {
			if (ev == 'standart') {
				this.lgServ.isTable('_ona_' + type).then((res) => {
					if (res) {
						let list_objets = JSON.parse(res);
						let idObj;

						for (let i = 0; i < list_objets.length; i++) {
							if (list_objets[i].me !== undefined) idObj = list_objets[i].me.id.me;
							else idObj = list_objets[i].id;

							if (idObj == id && idObj != 0) {
								list_objets[i] = data;
								break;
							}
						}

						//Cette instruction met à jour la database
						resolve(this.lgServ.setTableTo('_ona_' + type, list_objets));
					}
				});

			} else if (ev == 'advance') {
			}
		});
	}

}
