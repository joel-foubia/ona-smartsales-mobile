import { Component, ViewChild, ElementRef } from '@angular/core';
import {
	NavController,
	AlertController,
	ModalController,
	MenuController,
	PopoverController,
	ActionSheetController,
	Events,
	NavParams,
	IonicPage,
	Content,
	FabButton
} from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';
import { ImageProvider } from '../../providers/image/image';

import { TranslateService } from '@ngx-translate/core';
// import { SpeechToTextPage } from '../speech-to-text/speech-to-text';
import { ConfigSync, ConfigOnglet } from '../../config';
import { Note } from '../../models/note';
import { AfProvider } from '../../providers/af/af';

@IonicPage()
@Component({
	selector: 'page-notes',
	templateUrl: 'notes.html'
})
export class NotesPage {
	last_date_stage = null;
	last_date = null;
	dumpData: any[];
	followers: any;
	nbeNotes: Number = 0;
	affaires: any;
	strGroup: any;
	list_groups: any;

	@ViewChild('MesNotes') listNotes: ElementRef;
	@ViewChild(Content) content: Content;
	@ViewChild(FabButton) fabButton: FabButton;

	public notes: any = [];
	public objLoader = false;
	public display = false;
	public objLogin: any;
	public user;
	public roleType;
	public activeClass: any;
	public currentStage;
	public objFiltre;
	private dumpStage;
	public bg_changed;
	public txtFiltre: any;
	private txtLangue;
	private txtPop;
	public affaire = null;
	private checkSync;
	display_search = false;
	searchBtnColor: string = 'light';
	showQuickFilter: boolean = false;
	colorFilterBtn: string = 'light';
	colors = [];
	activeFilters = [];
	color_filter_slected;
	active_filter_selected;
	current_year: any;
	filter_years = [];

	constructor(
		public navCtrl: NavController,
		public afServ: AfProvider,
		private lgService: LoginProvider,
		public odooServ: OdooProvider,
		public alertCtrl: AlertController,
		public modalCtrl: ModalController,
		public menuCtrl: MenuController,
		public popCtrl: PopoverController,
		public actionCtrl: ActionSheetController,
		public events: Events,
		public navParams: NavParams,
		private imgServ: ImageProvider,
		private translate: TranslateService
	) {
		this.objLoader = true;

		this.lgService.isTable('me_avocat').then((data) => {
			if (data) {
				this.user = JSON.parse(data);
				this.lgService.formatDate('_ona_notes').then((_date) => {
					this.last_date = _date;
				});

				this.lgService.formatDate('_ona_satge_note').then((_date) => {
					this.last_date_stage = _date;
				});

				if (this.navParams.get('affaire') === undefined) this.syncOffOnline();
				else this.getOffAffaires(this.navParams.get('affaire'));

				//this.getListStage();
				this.checkSync = setInterval(() => this.activateSyn(), ConfigSync.timeSync);
			}
		});

		this.afServ.setPalette((res) => {
			this.colors = res;

			console.log('Colors ', this.colors);
		});
		//Gestion de la langue
		this.txtLangue = this.odooServ.traduire().module.notes;

		this.translate.get('pop').subscribe((_res) => {
			this.txtPop = _res;
		});

		this.txtFiltre = { slug: 'note', nom: 'Notes' };
		this.bg_changed = false;

		this.activeFilters = [
			{ nom: this.txtPop.notes, active: true, isActif: 'True', icon: 'ios-clipboard-outline', slug: 'note' },
			{
				nom: this.txtPop.f_archive,
				active: false,
				isActif: 'False',
				icon: 'ios-archive-outline',
				slug: 'archive'
			}
		];

		this.filter_years = ConfigOnglet.filterYears(this.txtPop);
	}

	onSetClick() {
		this.showQuickFilter = !this.showQuickFilter;
		if (this.showQuickFilter == true) {
			this.colorFilterBtn = 'primary';
		} else {
			this.colorFilterBtn = 'dark';
		}
		if (this.content != null) {
			setTimeout(() => {
				// this.content.scrollToTop(2000);
			}, 1000);
		}
		this.content.resize();
	}

	ionViewDidLoad() {
		this.events.subscribe('note:changed', (id_partner) => {
			for (let i = 0; i < this.notes.length; i++) {
				let objets = this.notes[i].tab;
				for (let j = 0; j < objets.length; j++) {
					if (objets[j].me.id.me == id_partner) {
						this.notes[i].tab.splice(j, 1);
						break;
					}
				}
			}
		});

		//Evénement lors de la copie d'un objet
		this.events.subscribe('add_notes:changed', (partner) => {
			//console.log(partner);
			let bg_color = this.odooServ.getBgColor(0);
			let stage = { id: 0, name: this.txtPop.today };
			let tab = [];
			let objNote = Object.assign({}, partner.item);

			objNote.memo += '(copy)';
			tab.push(objNote);

			let objInsert = {
				id: 0,
				couleur: '#ffffff',
				nom: stage.name,
				tab: tab
			};

			if (this.notes.length == 0) this.notes.push(objInsert);
			else {
				for (let i = 0; i < this.notes.length; i++) {
					let objets = this.notes[i].tab;
					for (let j = 0; j < objets.length; j++) {
						if (objets[j].id == partner.id) {
							this.notes[i].tab.splice(j, 0, objNote);
							return;
						}
					}
				}
			}
		});

		//Show/Hide fab
		this.lgService.showHideFab(this.content, this.fabButton);

		//Load List of Affaires
		// this.lgService.isTable('_ona_briefcase').then(_data=>{
		//   if(_data) this.affaires = JSON.parse(_data);
		// });
	}

	ionViewDidLeave() {
		clearInterval(this.checkSync);
		this.events.unsubscribe('add_notes:changed');
		this.events.unsubscribe('note:changed');
	}

	//Cette fonction permet d'activer la synchronisation
	activateSyn() {
		this.lgService.connChange('_ona_notes').then((res) => {
			if (res) {
				this.getListStage();
			} else {
				clearInterval(this.checkSync);
			}
		});
	}

	synchronizing() {
		this.display = true;
		this.getListStage(true);
	}

	//Cette fonction permet de charger les données
	//lorsque l'utilisateur est en mode offline ou via online (server)
	syncOffOnline() {
		this.lgService.checkStatus('_ona_notes').then((res) => {
			if (res == 'i') {
				//Première utilisation sans connexion
				this.objLoader = false;
			} else if (res == 's' || res == 'w' || res == 'rw') {
				//From Storage

				this.lgService.isTable('_ona_stage_note').then((_stages) => {
					if (_stages) {
						this.dumpStage = JSON.parse(_stages);
						this.lgService.isTable('_ona_notes').then((result) => {
							if (result) {
								// console.log(JSON.parse(result));
								this.getFollowerUser().then((reponse) => {
									let notes = this.getListNotesByFollowers(reponse, JSON.parse(result));
									this.dumpData = notes;

									// console.log(notes);
									this.notes = this.odooServ.filterNotesByStages(this.dumpStage, notes, 'note');
									this.nbeNotes = this.getTotalNotes();

									if (this.notes.length != 0) {
										this.currentStage = this.notes[0].nom;
										this.roleType = this.notes[0].couleur + '';
									}

									this.activeClass = 'no-actived';
									this.objLoader = false;
								});
							}
						});
					}
				});

				//SYnc de la liste depuis le serveur
				if (res == 'w' || res == 'rw') {
					this.getListStage();
					this.objLoader = false;
				}
			}
		});
	}

	/**
   * Cette fonction permet de récupérer la liste followers
   * auxquel l'utilisateur est abonné
   * @returns Promise
   */
	getFollowerUser() {
		return new Promise((resolve, reject) => {
			this.lgService.isTable('_ona_followers').then((res) => {
				if (res) {
					let followers = JSON.parse(res),
						tabs = [];

					for (let j = 0; j < followers.length; j++) {

						if(followers[j].me.partner_id!==undefined && followers[j].me.partner_id.me)
							if (followers[j].me.partner_id.me[0].me == this.user.partner_id.id)
								tabs.push(followers[j].me.id.me);
					}

					resolve(tabs);
				} else {
					this.odooServ.requestObjectToOdoo(
						'followers',
						null,
						null,
						false,
						(_res) => {
							let followers = _res,
								tabs = [];

							for (let j = 0; j < followers.length; j++) {
								if(followers[j].me.partner_id!==undefined && followers[j].me.partner_id.me)
									if (followers[j].me.partner_id.me[0].me == this.user.partner_id.id)
										tabs.push(followers[j].me.id.me);
							}

							resolve(tabs);

							//On synchronise avec la table
							this.lgService.setTable('_ona_followers', _res);
							this.lgService.setSync('_ona_followers_date');
						},
						true
					);
				}
			});
		});
	}

	/**
   * Cette fonction permet d'obtenir la liste des Notes 
   * auxquelles l'utilisateur est abonné ainsi que les siennes
   * @param followers Array<number>, liste d'identifiants pour l'utilisateur
   * @param notes Array<Note>, liste des notes
   */
	getListNotesByFollowers(followers, notes) {
		let result = [];

		for (let j = 0; j < notes.length; j++) {
			let inter = [];
			inter = notes[j].message_follower_ids.filter((element) => followers.includes(element));
			// console.log(inter);
			if (inter.length != 0) result.push(notes[j]);
		}

		return result;
	}

	//Cette fonction permet de récupérer la liste des notes
	//liées à l'affaire (affaire)
	getOffAffaires(affaire) {
		this.affaire = affaire;
		this.lgService.isTable('_ona_stage_note').then((_stages) => {
			this.objLoader = false;

			if (_stages) {
				this.dumpStage = JSON.parse(_stages);
				this.lgService.isTable('_ona_notes').then((result) => {
					if (result) {
						let list_notes = JSON.parse(result),
							results = [];
						for (let i = 0; i < list_notes.length; i++) {
							if (list_notes[i].file_id.id == affaire.id) results.push(list_notes[i]);
						}

						this.notes = this.odooServ.filterNotesByStages(this.dumpStage, results, 'note');
						this.nbeNotes = this.getTotalNotes();

						if (this.notes.length != 0) this.currentStage = this.notes[0].nom;

						this.activeClass = 'no-actived';
					}
				});
			}
		});
	}

	/**
	 * Permet à l'utilisateur de 
	 * @param objet JSONObject
	 * @param type string, le type de groupe
	 */
	private resetObjets(objet, type, options?: any) {
		if (type == 'year') {
			for (let i = 0; i < this.filter_years.length; i++) {
				if (this.filter_years[i].id != objet.id) this.filter_years[i].selected = false;

				if (options) this.filter_years[i].selected = false;
			}
		}
	}

	/**
	 * Cette méthode permet de filtrer les Factures
	 * en fonction des groupes team, ou stage
	 * @param stage JSONObject, le stage selectionné
	 */
	filterbyObjets(objet, type) {
		objet.selected = !objet.selected;
		this.resetObjets(objet, type);
		let objFil;

		if (type == 'year') {
			this.current_year = objet.id;
		}

		if (this.current_year == 'all') {
			objFil = { id: 'all_years', val: objet.id };
		} else {
			objFil = { id: type, val: objet.id };
		}

		// this.filterListPartners([ objFil ]);
	}

	filterbyActive(item) {
		let results = [];
		item.selected = true;

		for (let k = 0; k < this.activeFilters.length; k++) {
			if (this.activeFilters[k].slug != item.slug) {
				this.activeFilters[k].selected = false;
			}
		}
		this.active_filter_selected = item;
		this.applyFilterOnNotes(this.active_filter_selected);
		if (this.color_filter_slected != undefined) {
			this.color_filter_slected = item;
			for (let k = 0; k < this.notes.length; k++) {
				if (this.notes[k].bg == item.val) {
					results.push(this.notes[k]);
				}
			}
			this.notes = this.odooServ.filterNotesByStages(this.notes, results, 'note');
		}
	}
	onColorFilter(item) {
		let results = [];
		item.selected = true;

		for (let k = 0; k < this.colors.length; k++) {
			if (this.colors[k].val != item.val) {
				this.colors[k].selected = false;
			}
		}
		this.color_filter_slected = item;
		for (let k = 0; k < this.dumpData.length; k++) {
			if (this.dumpData[k].bg == item.val) {
				results.push(this.dumpData[k]);
			}
		}
		this.notes = this.odooServ.filterNotesByStages(this.dumpStage, results, 'note');

		if (this.active_filter_selected != undefined) {
			this.applyFilterOnNotes(this.active_filter_selected, results);
		}
	}

	//Cette fonction permet d'afficher
	//la liste des filtres à appliquer
	onFilter(theEvent) {
		let popover = this.popCtrl.create('PopFilterPage', { note: true, lang: this.txtPop });
		popover.present({ ev: theEvent });
		popover.onDidDismiss((result) => {
			if (result) {
				console.log('Filter res ', result);
				if (result.slug != 'rappel') {
					this.applyFilterOnNotes(result);
					this.txtFiltre = result;
				}
			}
		});
	}

	filterList(result) {
		console.log('Dump data ', this.dumpData);
		let resultats = [];
		for (let i = 0; i < this.dumpData.length; i++) {
			if (this.lgService.applyFilterNotes(result, this.dumpData[i])) {
				resultats.push(this.dumpData[i]);
				// this.filterResults.push(this.dumpData[i]);
			}
		}
		console.log('result on filter', resultats);
		/* this.notes = this.odooServ.filterNotesByStages(this.dumpStage, resultats, objFiltre.slug);
    this.nbeNotes = this.getTotalNotes(); */
	}

	//Cette fonction permet de définir
	//les éléments de la section sélectionnée
	segmentChanged(obj, event) {
		this.roleType = obj.couleur;
		this.currentStage = obj.nom;

		let segments = event.target.parentNode.children;
		let len = segments.length;

		for (let i = 0; i < len; i++) {
			segments[i].classList.remove('segment-activated');
		}
		event.target.classList.add('segment-activated');
	}

	//Cette fonction permet de mettre à jour les
	//notes dans la bd interne
	loadListNotes(stages, params?: any) {
		// console.log(params);
		let isParams = false;
		if (typeof params == 'boolean') isParams = true;

		// console.log(isParams);
		this.odooServ.requestObjectToOdoo(
			'notes',
			null,
			this.last_date,
			false,
			(res) => {
				// console.log(res);
				let fromServer: Array<Note> = [];
				if (res.length != 0) {
					for (let i = 0; i < res.length; i++) fromServer.push(new Note(res[i]));

					// console.log(fromServer);

					if (this.display || (!isParams && params !== undefined)) {
						// console.log("j y suis ");
						this.odooServ.refreshViewList('_ona_notes', fromServer).then((rep) => {
							// console.log(rep);
							this.getFollowerUser().then((reponse) => {
								let notes = this.getListNotesByFollowers(reponse, rep);
								this.notes = this.odooServ.filterNotesByStages(stages, notes, 'note');
								this.dumpData = notes;
								this.nbeNotes = this.getTotalNotes();
								this.display = false;

								if (!isParams && params !== undefined) {
									params.complete();
								}
							});
						});
					}

					//On synchronise avec la table
					this.lgService.setObjectToTable('_ona_notes', fromServer);
					this.lgService.setTable('_ona_stage_note', stages);
					this.lgService.setSync('_ona_notes_date');
				} else {
					if (this.display || (!isParams && params !== undefined)) params.complete();
				}
			},
			isParams
		);
	}

	/**
	 * Cette fonction permet de rafraichir la page
	 * notamment utilisé dans le cas des procédures de synchronisation
	 * @param refresher any
	 */
	doRefresh(refresher) {
		// this.getListStage(refresher);
		this.syncOffOnline();
		refresher.complete();
	}

	//Cette fonction permet d'afficher la liste
	// des stages
	// @param item object JSON, la note dont on souhaite changé le stage
	showListStage(item, theEvent) {
		//console.log(this.dumpStage);
		let stage_id = item.stage_id.id;
		let popover = this.popCtrl.create('PopStagePage', {
			objet: this.dumpStage,
			current: stage_id,
			lang: this.txtPop
		});
		popover.present({ ev: theEvent });

		popover.onDidDismiss((result) => {
			if (result) {
				let id = item.id;
				item.stage_id.id = result.me.id.me;
				item.stage_id.name = result.me.name.me;

				let data = { stage_id: item.stage_id };
				this.odooServ.updateNoSync('notes', item, item.id, 'standart');

				setTimeout(() => {
					//On modifie le stage de la note
					this.updateNoteByAction('stage_note', this.user, this.objLogin, 'notes', id, data);
				}, 700);
			}
		});
	}

	/**
   * Cette fonction permet de retourner le nombre
   * total de notes
   * @returns {Number}
   */
	getTotalNotes(): Number {
		let total = 0;
		for (let j = 0; j < this.notes.length; j++) total += this.notes[j].tab.length;

		return total;
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
	updateNoteByAction(action, user, login, type, idObj, data) {
		let message = '';

		switch (action) {
			case 'stage_note': {
				message = this.txtLangue.stage;
				break;
			}
			case 'archive': {
				message = this.txtLangue.archive;
				break;
			}
			case 'share': {
				message = this.txtLangue.share;
				break;
			}
			case 'couleur': {
				message = this.txtLangue.color;
				break;
			}
			case 'rappel': {
				message = this.txtLangue.rappel;
				break;
			}
			case 'update': {
				message = this.txtLangue.update;
				break;
			}
		}

		data['id'] = idObj;
		//Définition de la requête
		this.odooServ.updateSyncRequest(type, data);
		this.odooServ.showMsgWithButton(message, 'top', 'toast-success');

		//Mise à jour de la liste des notes (bd interne)
		//this.odooServ.updateListStagesSync(type, this.notes);
		if (action != 'couleur' && action != 'update') this.updateListNotes('note');
	}

	/**
   * Cette fonction permet d'appliquer les filtres sur les champs
   * @param objFiltre ObjectJson, l'objet contenant le filtre à appliquer
   *
   **/
	applyFilterOnNotes(objFiltre, list?: Array<any>) {
		if (list != undefined) {
			console.log('List =>', list);
			let results = [];
			if (this.affaire != null) {
				for (let i = 0; i < list.length; i++) {
					if (list[i].file_id.id == this.affaire.id) results.push(list[i]);
				}
			} else {
				results = list;
			}

			this.notes = this.odooServ.filterNotesByStages(this.dumpStage, results, objFiltre.slug);
			this.nbeNotes = this.getTotalNotes();
		} else {
			this.lgService.isTable('_ona_notes').then((res) => {
				if (res) {
					this.objFiltre = res;

					let list_notes = JSON.parse(res),
						results = [];
					if (this.affaire != null) {
						for (let i = 0; i < list_notes.length; i++) {
							if (list_notes[i].file_id.id == this.affaire.id) results.push(list_notes[i]);
						}
					} else {
						results = list_notes;
					}

					this.notes = this.odooServ.filterNotesByStages(this.dumpStage, results, objFiltre.slug);
					this.nbeNotes = this.getTotalNotes();
				}
			});
		}
	}

	//Création d'une note
	//La fonction create de l'objet modalCtrl prend 2 paramètres:
	//  Le formulaire (Form)
	//  un objet JSON : <login de connexion, les paramètres d'utilisateur, l'objet note>
	onAdd(data) {
		let id_affaire = 0;
		if (this.affaire != null) {
			id_affaire = this.affaire.id;
		}

		let addModal = this.modalCtrl.create('FormNotePage', {
			objConnect: { login: this.objLogin, user: this.user, note: null, toSend: data }
		});

		//this.odooServ.createObjet('notes', this.objLogin, this.user, addModal);
		this.odooServ.createObjetResult('notes', this.objLogin, this.user, addModal, (res) => {
			//console.log(res);
			let objet: any = res,
				stage_id;
			let bg_color = this.odooServ.getBgColor(0);

			if (this.notes.length != 0 && this.notes[0].id !== undefined) stage_id = this.notes[0].id;
			else stage_id = 0;

			objet['bg'] = bg_color;
			objet.create_date = new Date().toISOString();
			objet.stage_id = { id: stage_id, name: this.txtPop.today };

			console.log(objet);
			let tab = [],
				tab_ids;
			if (this.notes.length != 0) {
				this.notes[0].tab.push(objet);
			} else {
				//La liste des affaires est vide
				let stage = { id: 0, name: this.txtPop.today };
				let tab = [];
				tab.push(objet);

				let objInsert = {
					id: 0,
					couleur: '#ffffff',
					nom: stage.name,
					tab: tab
				};
				this.notes.push(objInsert);
			}

			this.odooServ.copiedAddSync('notes', objet);
			this.odooServ.showMsgWithButton(this.txtLangue.add, 'top', 'toast-success');
		});
	}

	//Permet la création d'une note à partir
	//d'une image
	onAddImage(event) {
		let popover = this.popCtrl.create('PopStagePage', { partner: true, lang: this.txtPop });
		let photo_base64, photo;

		popover.present({ ev: event });
		popover.onDidDismiss((result) => {
			if (result) {
				//Camera

				if (result.slug == 'camera') {
					this.imgServ.takePicture().then(
						(res) => {
							photo_base64 = 'data:image/jpeg;base64,' + res;
							photo = '<img src="' + photo_base64 + '" />';
							this.onAdd(photo);
						},
						(err) => {
							this.odooServ.showMsgWithButton(err, 'bottom', 'toast-error');
						}
					);
				} else {
					//Gallery

					this.imgServ.openImagePicker().then(
						(res) => {
							photo_base64 = 'data:image/jpeg;base64,' + res;
							photo = '<img src="' + photo_base64 + '" />';
							this.onAdd(photo);
						},
						(err) => {
							this.odooServ.showMsgWithButton(err, 'bottom', 'toast-error');
						}
					);
				}
			}
		});
		//Fin Process camera
	}

	//Permet la création d'une note à partir
	//de la voix (la voix est convertier en texte)
	onAddMicro(event) {
		let ev = {
			target: {
				getBoundingClientRect: () => {
					return { top: '100' };
				}
			}
		};
		let popover = this.popCtrl.create('SpeechToTextPage', { lang: this.txtPop }, { cssClass: 'custom-popaudio' });

		popover.present({ ev });
		popover.onDidDismiss((result) => {
			if (result) {
				this.onAdd(result);
				//this.modifierCouleur(current, result, objNote);
			}
		});
	}

	//Cette fonction permet d'afficher un menu
	//pour regrouper les notes en fonctions de la couleur ou
	//en fonction d'une affaire
	onGroup(event) {
		let popover = this.popCtrl.create('GroupNotePage', { note: true, lang: this.txtPop });

		popover.present({ ev: event });
		popover.onDidDismiss((result) => {
			let tab = [];

			if (result) {
				//console.log(result);
				this.strGroup = result;
				if (result.ch == 'file_id') this.list_groups = this.affaires;
				else if (result.ch == 'color') {
					//this.syncOffOnline();
					this.strGroup = result;
					this.groupByColor();
				} else {
					this.strGroup = undefined;
					this.syncOffOnline();
				}
			}
		});
	}

	groupByColor() {
		let popover = this.popCtrl.create('PopColorPage', { couleur: 10 }, { cssClass: 'custom-popcolor' });
		let ev = {
			target: {
				getBoundingClientRect: () => {
					return { top: '100' };
				}
			}
		};
		popover.present({ ev });

		popover.onDidDismiss((result) => {
			if (result) {
				this.updateProjectChanged(result.code);
			}
		});
	}

	/**
   * Cette fonction permet de mettre à jour la 
   * liste des notes en fonction de l'affaire
   * choisit
   */
	updateProjectChanged(ev) {
		//console.log('Current index is', ev);

		this.odooServ.groupElementsBy('notes', this.strGroup.ch, ev).then((reponse) => {
			// console.log(reponse);
			this.notes = this.odooServ.filterNotesByStages(this.dumpStage, reponse, 'note');
			this.nbeNotes = this.getTotalNotes();
		});
	}

	//Cette fonction permet de changer
	//la couleur d'arrière plan d'une note
	onColor(current, objNote) {
		let popover = this.popCtrl.create('PopColorPage', { couleur: objNote.color }, { cssClass: 'custom-popcolor' });
		let ev = {
			target: {
				getBoundingClientRect: () => {
					return { top: '100' };
				}
			}
		};
		popover.present({ ev });

		popover.onDidDismiss((result) => {
			if (result) {
				this.modifierCouleur(current, result, objNote);
			}
		});
	}

	//Cette fonction permet d'appliquer la couleur
	//sur une note et de mettre le code couleur relative à la note
	private modifierCouleur(event, result, objNote) {
		let others = this.listNotes.nativeElement.querySelectorAll('ion-card');
		let idNote = objNote.id;
		objNote.color = result.code;
		const objToUpdate = { id: idNote, color: result.code };

		let len = others.length;
		//console.log(others);

		for (let i = 0; i < len; i++) {
			let current = parseInt(others[i].getAttribute('id'));
			if (current == idNote) {
				//this.bg_changed = {'background-color': result.val };
				others[i].style.background = result.val;
				break;
			}
		}

		event.target.classList.add('on-activated');
		this.odooServ.updateNoSync('notes', objNote, objNote.id, 'standart');
		this.updateNoteByAction('couleur', this.user, this.objLogin, 'notes', idNote, objToUpdate);
	}

	//Affiche une liste d'actions à appliquer sur
	//l'item choisit par l'utilisateur
	onTapNote(id, nomStage, item, event) {
		//console.log(item);
		let stage = { id: id, nom: nomStage };
		let display_name = item.name.substring(0, 90);
		let id_note = item.id;

		let actionSheet = this.actionCtrl.create({
			title: display_name,
			cssClass: 'custom-note',
			buttons: [
				{
					text: this.txtPop.color,
					cssClass: 'btn-sheet',
					icon: 'ios-color-palette-outline',
					handler: () => {
						this.onColor(event, item);
					}
				},
				{
					text: this.txtPop.archive,
					cssClass: 'btn-sheet',
					icon: 'ios-archive-outline',
					handler: () => {
						//console.log('Voir clicked');
						let data = { open: false, id: id_note };
						item.open = false;

						if (id_note != 0) {
							this.odooServ.updateNoSync('notes', item, id_note, 'standart');
							setTimeout(() => {
								this.updateNoteByAction('archive', this.user, this.objLogin, 'notes', id_note, data);
							}, 400);
						}
					}
				},
				{
					text: this.txtPop.update,
					cssClass: 'btn-sheet',
					icon: 'ios-create-outline',

					handler: () => {
						//console.log('Modifier clicked');
						// console.log(item);
						this.modifier(item);
					}
				},
				{
					text: this.txtPop.share,
					cssClass: 'btn-sheet',
					icon: 'ios-redo-outline',
					handler: () => {
						//console.log('corbeille');
						let data = { corbeille: true, id: id_note };
						this.onShareToUser(item);
						//this.updateNoteByAction('corbeille', this.user, this.objLogin, 'notes', id_note, data);
					}
				}
			]
		});

		actionSheet.present();
	}

	//On affiche la liste des utilisateurs
	//et on change le user_id de la note
	onShareToUser(item) {
		// let message = item.memo;
		// this.odooServ.doShare(message, subject, null, '', 'notes');
		this.lgService.isTable('_ona_user').then((users) => {
			if (users) {
				let popover = this.popCtrl.create(
					'PopUserPage',
					{ data: JSON.parse(users), txt_user: this.txtLangue.msg_user, type: 'followers' },
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
						this.setFollowerToNote(data, item);
					}
				});

				popover.present({ ev });
			} else {
				this.odooServ.showMsgWithButton('Pour voir les autres collaborateurs, activez Internet', 'bottom');
			}
		});
	}

	/**
   * Cette méthode permet de partarger la note 
   * @param user User, l'utilisateur à qui sera transférer la note
   * @param note Note, la note à partarger
   */
	setFollowerToNote(user, note) {
		let objFollower = {
			add: {
				partner_id: user.partner_id.id,
				res_model: 'note.note'
			}
		};

		this.odooServ.editTag('followers', objFollower, (res) => {
			console.log(res);
			// this.followers.push(res);
			this.odooServ.copiedAddSync('followers', res);
			note.message_follower_ids.push(res.me.id.me);

			//On met à jour la note
			this.odooServ.updateNoSync('notes', note, note.id, 'standart');
			this.odooServ.updateSyncRequest('notes', note);
			this.odooServ.showMsgWithButton('La note a été partargée', 'top', 'toast-info');
		});
	}

	//Cette fonction permet d'obtenir la liste
	// des stages en fonction de l'utilisateur
	getListStage(options?: any) {
		if (typeof options == 'boolean') {
			this.odooServ.requestObjectToOdoo(
				'stage_note',
				null,
				null,
				false,
				(res) => {
					this.dumpStage = res;
					this.loadListNotes(res, options);
					this.objLoader = false;
				},
				options
			);
		} else {
			// console.log('is not bool');
			this.odooServ.requestObjectToOdoo('stage_note', null, null, false, (res) => {
				this.dumpStage = res;
				this.loadListNotes(res, options);
				this.objLoader = false;
			});
		}
	}

	//Cette fonction permet de mettre à jour
	//la liste des notes après modification d'un stage
	updateListNotes(params) {
		this.lgService.isTable('_ona_notes').then((response) => {
			if (response) {
				let list_notes = JSON.parse(response),
					results = [];
				if (this.affaire != null) {
					for (let i = 0; i < list_notes.length; i++) {
						if (list_notes[i].file_id.id == this.affaire.id) results.push(list_notes[i]);
					}
				} else {
					results = list_notes;
				}

				this.notes = this.odooServ.filterNotesByStages(this.dumpStage, results, params);
				this.nbeNotes = this.getTotalNotes();
			}
		});
	}

	//Afficher le menu gauche de l'application
	showMenu() {
		this.menuCtrl.open();
	}

	/**
   * Cette fonction permet de modifier
   * une note
   *
   **/
	modifier(objNote) {
		let addModal = this.modalCtrl.create('FormNotePage', { objConnect: { note: objNote } });

		//callback when modal is dismissed (recieve data from View)
		addModal.onDidDismiss((data) => {
			if (data) {
				console.log(data);
				this.odooServ.updateNoSync('notes', data, objNote.id, 'standart');
				this.updateNoteByAction('update', this.user, this.objLogin, 'notes', objNote.id, data);
			}
		});

		addModal.present();
	}

	/**
   * Permet de répositioner un bloc
   */
	searchItems() {
		this.display_search = !this.display_search;
		if (this.display_search) {
			this.searchBtnColor = 'primary';
		} else {
			this.searchBtnColor = 'light';
		}
		this.content.resize();
	}

	/**
   * Cette méthode permet de rechercher une note
   * @param ev String, la recherche
   */
	setFilteredItems(ev) {
		if (ev.target.value === undefined) {
			// this.notes = this.dumpData;
			this.notes = this.odooServ.filterNotesByStages(this.dumpStage, this.dumpData, 'note');
			this.roleType = this.notes[0].couleur + '';
			// this.max = 10;
			return;
		}

		var val = ev.target.value;

		if (val != '' && val.length > 2) {
			let notes;
			notes = this.dumpData.filter((item) => {
				let txtNom = item.memo;
				return txtNom.toLowerCase().indexOf(val.toLowerCase()) > -1;
			});

			this.notes = this.odooServ.filterNotesByStages(this.dumpStage, notes, 'note');

			if (notes.length != 0) this.roleType = this.notes[0].couleur + '';
		} else if (val == '' || val == undefined) {
			this.notes = this.odooServ.filterNotesByStages(this.dumpStage, this.dumpData, 'note');
			this.roleType = this.notes[0].couleur + '';
			// this.max = 10;
		}
	}
}
