import { Component, ViewChild } from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	LoadingController,
	AlertController,
	ActionSheetController,
	ModalController,
	MenuController,
	PopoverController,
	Events,
	Content,
	FabButton
} from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';
import { ConfigSync } from '../../config';
import { Partner } from '../../models/partner';
import { Produit } from '../../models/produit';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { AfProvider } from '../../providers/af/af';
// import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
	selector: 'page-catalogue',
	templateUrl: 'catalogue.html'
})
export class CataloguePage {
	@ViewChild(FabButton) fabButton: FabButton;
	last_date = null;
	defaultImg: string;
	public clients = [];
	public searchTerm: string = '';
	public animateClass: any;
	private dumpData = [];
	objFiltre = [];
	public objLoader;
	public display = false;
	public btn_display = false;
	private the_partner;
	public titre;
	public txtFiltre = [];
	public present: boolean = false;
	public max = 10; //Nombre d'éléments max a chargé (ioninfinite scroll)
	private offset = 0; //index à partir duquel débuter
	start = 0;
	end = 10;
	public isArchived = false;
	colorFilterBtn: string = 'gris';

	// private tmpMajclients = [];
	private isStorage = false; //données sont stockées
	private loading;
	private alert;
	private objLogin: any;
	private user: any;
	private storedDay;
	private checkSync;
	current_lang = '';
	obJFilter = [];
	obJFi;
	filteredData = [];
	filterResults = [];
	display_search: boolean = false;
	showQuickFilter: boolean = false;
	products = [];
	searchText;
	pop: any;
	eventsBinding;
	searchBtnColor: string = 'light';
	// display_search = false;
	@ViewChild(Content) content: Content;
	filterProduct = [];
	unclassified = [];
	categories_list = [];
	selected_filter: any;
	objectFilterPopup: {};
	prods_received: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public odooService: OdooProvider,
		public loadCtrl: LoadingController,
		public alertCtrl: AlertController,
		public actionCtrl: ActionSheetController,
		public modalCtrl: ModalController,
		public afProvider: AfProvider,
		public lgService: LoginProvider,
		public menuCtrl: MenuController,
		public popCtrl: PopoverController,
		public events: Events,
		public translate: TranslateService
	) {
		// this.filter();
		this.translate.get('pop', 'sales').subscribe((res) => {
			this.pop = res;
		});
		this.defaultImg = 'assets/images/shopping-basket.SVG';
		this.lgService.isTable('me_avocat').then((data) => {
			this.current_lang = JSON.parse(data).lang.id;
			this.current_lang.replace('_', '-');
		});

		this.the_partner = 'produit';
		this.titre = this.navParams.get('titre');
		this.prods_received = this.navParams.get('prod_list');
		this.lgService.formatDate('_ona_' + this.the_partner).then((_date) => {
			this.last_date = _date;
		});

		if (this.prods_received == undefined) {
			setTimeout(() => {
				this.syncOffOnline();
			}, 500);
		} else {
			this.clients = this.prods_received;
			this.dumpData = this.prods_received;
		}

		//on vérifie si on a accès à la bd
		// On récupère les paramètres login
		this.lgService.getLogin().then((res) => {
			if (res) {
				this.objLogin = JSON.parse(res);
				this.lgService.getSettingUser().then((data) => {
					if (data) {
						this.user = JSON.parse(data);
						this.checkSync = setInterval(() => this.activateSyn(), ConfigSync.timeSync);
					}
				});
			}
		});
		this.eventsBinding = {
			onClick: function(event: any) {
				lgService.getLogin().then((res) => {
					if (res) {
						lgService.getSettingUser().then((user_data) => {
							if (user_data) {
								translate.get('pop').subscribe((lang) => {
									let prod_action = actionCtrl.create({
										title: event.product.name,
										cssClass: 'product-action-sheets',
										buttons: [
											{
												text: 'Fiche du produit',
												// icon: "document",
												cssClass: 'icon icon-file-document',
												handler: () => {
													let objToSend = {
														objet: event.product,
														user: JSON.parse(user_data),
														type: navParams.get('partner'),
														login: JSON.parse(res)
													};
													navCtrl.push('ProdDetailPage', {
														product: event.product,
														toSend: objToSend
													});
												}
											},
											{
												text: ' Editer le Produit',
												cssClass: 'icon icon-pencil',
												handler: () => {
													let objToSend = {
														objet: event.product,
														user: JSON.parse(user_data),
														type: navParams.get('partner'),
														login: JSON.parse(res)
													};
													let updateModal = modalCtrl.create('FormProductPage', {
														modif: true,
														toSend: objToSend,
														type: navParams.get('partner')
													});
													updateModal.present();

													updateModal.onDidDismiss((data) => {
														// console.log('Updating Product ...');
														if (data) {
															console.log(data);
															let message =
																'Les informations sur le ' +
																navParams.get('partner') +
																' ont été modifiées';
															// msgLoading.present();

															//On met à jour les informations (data) dans la base de données interne

															if (event.product.id == 0)
																odooService.updateNoSyncObjet(
																	navParams.get('partner'),
																	data,
																	event.product
																);
															else {
																odooService.updateNoSync(
																	navParams.get('partner'),
																	data,
																	event.product.id,
																	'standart'
																);
																odooService.updateSyncRequest(
																	navParams.get('partner'),
																	data
																);
															}

															// msgLoading.dismiss();
															odooService.showMsgWithButton(
																message,
																'top',
																'toast-success'
															);
														}
													});
												}
											},
											{
												text: 'Consulter les commandes',
												cssClass: 'icon icon-content-paste',
												handler: () => {
													navCtrl.push('SalesPage', {
														product: event.product,
														partner: 'sale'
													});
												}
											},
											{
												text: 'Consulter les devis',
												cssClass: 'icon icon-script',
												handler: () => {
													navCtrl.push('SalesPage', {
														product: event.product,
														partner: 'draft'
													});
												}
											},
											{
												text: 'Créer un devis',
												cssClass: 'icon icon-cash',
												handler: () => {
													let addModal = modalCtrl.create('FormSalePage', {
														modif: false,
														type: 'vente',
														param: undefined,
														product: event.product
													});

													translate.get('sales').subscribe((res) => {
														let msgLoading = loadCtrl.create({
															content: res.statut_add
														});

														addModal.onDidDismiss((data) => {
															if (data) {
																let message = res.txt_add;
																msgLoading.present();
																data.idx = new Date().valueOf();

																//On insère dans la bd Interne
																// this.sales.push(data);
																// this.ventes.unshift(data);

																odooService.copiedAddSync('vente', data);
																odooService.syncCreateObjet('vente', data);

																msgLoading.dismiss();
																odooService.showMsgWithButton(
																	message,
																	'top',
																	'toast-success'
																);
															}
														});
													});
													addModal.present();
												}
											},
											{
												text: 'Alerter en cas de rupture de stock',
												cssClass: 'icon icon-alert',
												handler: () => {
													lgService.isTable('_ona_user').then((data) => {
														if (data) {
															var company_prod;
															var usersList = [];
															usersList = JSON.parse(data);
															for (let k = 0; k < usersList.length; k++) {
																if (usersList[k].id == event.product.company_id.id) {
																	company_prod = usersList[k];
																}
															}
															lgService.isTable('me_avocat').then((data) => {
																if (data) {
																	translate.get('module').subscribe((res) => {
																		odooService.doEmail(
																			company_prod.email,
																			odooService.buildMessage(
																				res.prod_detail,
																				JSON.parse(data),
																				event.product
																			)
																		);
																	});
																}
															});
														}
													});
													translate.get('module').subscribe((res) => {
														odooService.showMsgWithButton(
															res.prod_detail.supply_email_msge,
															'top',
															'toast-sucess'
														);
													});
												}
											}
										]
									});
									prod_action.present();
								});
							}
						});
					}
				});
			}
		};
	}

	ionViewDidLeave() {
		clearInterval(this.checkSync);
		this.events.unsubscribe('client:changed');
		this.events.unsubscribe('add_client:changed');
	}

	ionViewDidLoad() {
		this.events.subscribe('client:changed', (id_partner) => {
			for (let i = 0; i < this.clients.length; i++) {
				if (this.clients[i].id == id_partner) {
					this.clients.splice(i, 1);
					break;
				}
			}
		});
		this.lgService.showHideFab(this.content, this.fabButton);
		//Evénement lors de la copie d'un objet
	}

	//Cette fonction permet de synchroniser les données
	synchronizing() {
		this.display = true;
		this.setListPartners();
	}

	showSideMenu() {
		this.menuCtrl.open();
	}

	//Cette fonction permet d'activer la synchronisation
	activateSyn() {
		this.lgService.connChange('_ona_' + this.the_partner).then((res) => {
			if (res) {
				this.setListPartners();
			} else {
				clearInterval(this.checkSync);
			}
		});
	}
	removeDuplicates(arr) {
		this.filterProduct = [];
		for (let i = 0; i < arr.length; i++) {
			if (this.filterProduct.indexOf(arr[i].pos_categ_id.id) > -1) {
				this.filterProduct.push(arr[i].pos_categ_id);
			}
		}
		return this.filterProduct;
	}

	getCategories(list: Array<any>) {
		// var array = [];
		for (let k = 0; k < this.dumpData.length; k++) {
			if (list.indexOf(this.dumpData[k].pos_categ_id.id) > -1) {
				this.categories_list.push(this.dumpData[k].pos_categ_id);
			}
		}
	}

	filter() {
		this.categories_list = this.afProvider.getCategories(this.clients);
		let unclass = {
			id: 0,
			name: this.pop.un_classified
		};
		let all = {
			id: 'all',
			name: this.pop.all_cat
		};
		let plus = {
			id: 'plus',
			name: this.pop.plus_list
		};

		this.categories_list.unshift(all);
		this.categories_list.push(unclass);
		this.categories_list.push(plus);

		console.log('Cat list', this.categories_list);
	}

	/**
	 * Permet à l'utilisateur de 
	 * @param objet JSONObject
	 * @param type string, le type de groupe
	 */
	private resetObjets(objet, type, options?: any) {
		if (type == 'all') {
			for (let i = 0; i < this.categories_list.length; i++) {
				if (this.categories_list[i].id != objet.id) this.categories_list[i].selected = false;

				if (options) this.categories_list[i].selected = false;
			}
		}
	}

	onSetClick() {
		this.showQuickFilter = !this.showQuickFilter;
		if (this.showQuickFilter == true) {
			this.colorFilterBtn = 'primary';
		} else {
			this.colorFilterBtn = 'dark';
		}
		if (this.content != null) {
			setTimeout(() => {}, 1000);
		}
		this.content.resize();
	}

	/**
	 * Cette méthode permet de filtrer 
	 * la lsite des prospects en fonction des filtres
	 * 
	 * @param item JSON object, un filtre
	 */
	onQuickFilter(item, i) {
		if (item.id == 'all') {
			this.colorFilterBtn = 'gris';
			this.clients = this.dumpData;
			this.showQuickFilter = true;
			item['selected'] = true;
			this.content.resize();
		} else {
			if (item.id == 'plus') {
				this.showQuickFilter = false;
				this.onFilter();
				this.content.resize();
			} else if (!item.selected) {
				item['selected'] = true;
				this.clients = [];
				for (let i = 0; i < this.dumpData.length; i++) {
					if (this.dumpData[i].pos_categ_id.id == item.id) {
						this.clients.push(this.dumpData[i]);
					} else if (this.clients.length == 0 || this.clients.length == undefined) {
						// this.searchText;
						this.present = true;
						this.selected_filter = {
							name: item.name
						};
					}
				}
			} else {
				item['selected'] = false;
				this.clients = this.dumpData;
			}
			for (let j = 0; j < this.categories_list.length; j++) {
				if (this.categories_list[j].id != item.id) {
					this.categories_list[j].selected = false;
				}
			}
		}
		this.max = 10;
	}

	ionViewDidEnter() {}
	syncOffOnline() {
		this.lgService.checkStatus('_ona_' + this.the_partner).then((res) => {
			if (res == 'i') {
				//Première utilisation sans connexion
			} else if (res == 's' || res == 'w' || res == 'rw') {
				//From Storage
				this.objLoader = true;
				this.lgService.isTable('_ona_' + this.the_partner).then((result) => {
					if (result) {
						var productList = [];
						productList = JSON.parse(result);
						for (let k = 0; k < productList.length; k++) {
							if (
								productList[k].sale_ok == true &&
								productList[k].active == true
							) {
								this.clients.push(productList[k]);
								this.dumpData.push(productList[k]);
								this.present = true;
							}
						}

						// this.dumpData = productList;
						setTimeout(() => {
							this.filter();
						}, 500);
						console.log(this.clients);
					}
					this.objLoader = false;
				});

				//SYnc de la liste depuis le serveur
				if (res == 'w' || res == 'rw') {
					this.setListPartners();
				}
			}
		});
	}
	/**
   * Cette fonction permet de charger la liste
   * des partenaires (clients, tribunaux, contacts)
   *
   **/
	setListPartners(refresher?: any) {
		// console.log('Setting list partner');
		let params = { options: { offset: 0, max: this.max } };
		this.odooService.requestObjectToOdoo(this.the_partner, null, this.last_date, false, (res) => {
			// console.log('Req list : ', res);
			let fromServ = this.loadPartnerFromServer(res);

			this.odooService.refreshViewList('_ona_' + this.the_partner, fromServ).then((rep: any) => {
				this.dumpData = rep;
				if (this.display || refresher !== undefined) {
					for (let j = 0; j < rep.length; j++) {
						if (rep[j].sale_ok == true && rep[j].active == true) this.clients.push(rep[j]);
					}

					console.log('Produits =>', this.clients);
					this.display = false;
					if (refresher !== undefined) refresher.complete();
				}
			});

			//Store data in sqlLite and save date of last sync
			this.lgService.setObjectToTable('_ona_' + this.the_partner, fromServ);
			this.lgService.setSync('_ona_' + this.the_partner + '_date');
			fromServ = null;
		});
	}

	/** 
   * Cette fonction permet de charger la liste des partners
   * dans un array
   * @param tab Array<JSONObject>, la liste json des partners
   * 
   * @return Array<Partner>
   *
   **/
	loadPartnerFromServer(tab) {
		let result = [];

		for (let i = 0; i < tab.length; i++) {
			let objPartner = new Produit(tab[i], this.the_partner);
			result.push(objPartner);
		}

		return result;
	}

	/**
	 * Cette fonction permet de rafraichir la page
	 * notamment utilisé dans le cas des procédures de synchronisation
	 * @param refresher any
	 */
	doRefresh(refresher) {
		// this.setListPartners(refresher);
		if (this.prods_received == undefined) {
			this.syncOffOnline();
		}
		refresher.complete();
	}

	cleanFilter(filter: any[], j: number, length: number, i: number) {
		// console.log('Cleaning Filter', 'Length : ', length);
		// var i = 0;
		j++;
		if (filter[i]) {
			if (filter[i][1] == undefined || filter[i][1] == '' || filter[i][1] == false) {
				filter.splice(i, 1);
				if (i > 0) {
					i--;
				}
			} else {
				i++;
			}
		}
		if (j > length) {
			console.log('Cleaned Array : ', filter);
		} else {
			this.cleanFilter(filter, j, length, i);
		}
	}

	onFilter() {
		let filterModal = this.modalCtrl.create('ProdFilterPopupPage', {
			model: this.the_partner,
			currency: 'EUR',
			lang: this.pop
		});
		filterModal.present();
		filterModal.onDidDismiss((result) => {
			if (result) {
				this.txtFiltre = result;

				console.log('Filter received : ', this.txtFiltre);
				this.filterListPartners(result);
			}
		});
	}

	filterListPartners(result) {
		this.max = 10;
		this.filterResults = [];
		let resultats = [];
		let dumpresults = [];

		for (let i = 0; i < this.dumpData.length; i++) {
			if (this.applyFilterPartner(result, this.dumpData[i])) {
				resultats.push(this.dumpData[i]);
				this.filterResults.push(this.dumpData[i]);
			}
		}

		for (let l = 0; l < result; l++) {
			if (result[l].name == 'most_sold') {
				this.dumpData.sort(function(a, b) {
					return b.sales_count - a.sales_count;
				});
			}
		}

		if (resultats.length > 0) {
			for (let i = 0; i < 10; i++) {
				dumpresults.push(resultats[i]);
			}
			this.clients = dumpresults;
		} else {
			this.clients.length = 0;
		}

		// console.log('Filtered Prods : ', resultats);
		// console.log('Filtered Results : ', this.filterResults);
		// console.log('Dump Data : ', this.dumpData);
	}

	applyFilterPartner(searchs, objet) {
		let cpt = 0;

		for (let j = 0; j < searchs.length; j++) {
			switch (searchs[j].name) {
				case 'to_sale': {
					//peaut etre vendu

					if (objet.sale_ok == true) cpt++;

					break;
				}
				case 'archived': {
					//Archiver
					if (objet.active == false) cpt++;

					break;
				}
				case 'type': {
					//type de produit
					if (objet.type == searchs[j].slug) {
						cpt++;
					}

					break;
				}
				case 'available': {
					//Available
					if (objet.qty_available > 0) cpt++;
					break;
				}
				case 'price': {
					//Prix
					if (objet.list_price >= searchs[j].slug.lower && objet.list_price <= searchs[j].slug.upper) cpt++;
					break;
				}
				/* case 'price': {
					//Prix
					if (objet.list_price >= searchs[j].slug.lower && objet.list_price <= searchs[j].slug.upper) cpt++;
					break;
				} */
			}
		} //Fin tab searchs

		if (cpt == searchs.length) return true;
		else return false;
	}

	//AJout des éléments lorsque l'on scroll vers le
	//bas
	doInfinite(infiniteScroll) {
		this.offset += this.max;
		// let params = { options: { offset: this.offset, max: this.max } };
		this.max += 10;

		infiniteScroll.complete();
	}

	//AJout des éléments lorsque l'on scroll vers le
	//bas
	// doInfinite(infiniteScroll) {
	// 	console.log('Loading More');

	// 	if (this.filterResults.length == 0) {
	// 		this.start = this.start + 10;
	// 		this.end = this.end + this.start;
	// 		// var all = [];
	// 		// all = JSON.parse(prod);
	// 		all = this.dumpData;
	// 		console.log('All : ', all);
	// 		console.log('Prods : ', this.clients);
	// 		if (this.clients.length >= all.length) {
	// 			infiniteScroll.complete();
	// 			return;
	// 		}
	// 		for (let i = this.start; i < this.end; i++) {
	// 			if (all[i]) {
	// 				if (all[i].sale_ok == true && all[i].active == true) {
	// 					this.clients.push(all[i]);
	// 				} else {
	// 					infiniteScroll.complete();
	// 					return;
	// 				}
	// 			}
	// 		}
	// 		infiniteScroll.complete();
	// 	}
	// 	if (this.filterResults.length > 0) {
	// 		console.log('More filterd results');

	// 		/* this.max += 10;
	// 		this.offset += this.max; */
	// 		this.start += 10;
	// 		this.end += this.start;
	// 		var all = [];
	// 		all = this.filterResults;
	// 		if (this.clients.length >= all.length) {
	// 			infiniteScroll.complete();
	// 			return;
	// 		}
	// 		for (let i = this.start; i < this.end; i++) {
	// 			if (all[i]) {
	// 				if (all[i]) {
	// 					this.clients.push(all[i]);
	// 				} else {
	// 					infiniteScroll.complete();
	// 					return;
	// 				}
	// 			}
	// 		}
	// 		infiniteScroll.complete();
	// 	}
	// }

	setFilteredItems(ev) {
		if (ev.target.value === undefined) {
			this.clients = this.dumpData;
			this.max = 10;
			return;
		}

		var val = ev.target.value;

		if (val != '' && val.length > 2) {
			this.clients = this.dumpData.filter((item) => {
				let txtNom = item.name + ' ' + item.middle_name + ' ' + item.last_name;
				return txtNom.toLowerCase().indexOf(val.toLowerCase()) > -1;
			});
		} else if (val == '' || val == undefined) {
			this.clients = this.dumpData;
			this.max = 10;
		}
	}

	showProd(prod, event) {
		let popover = this.popCtrl.create(
			'PopOverPage',
			{ menus: prod, product: true, lang: this.pop },
			{ cssClass: 'custom-popover' }
		);

		popover.present({ ev: event });
		popover.onDidDismiss((result) => {
			if (result) {
				console.log(result);

				if (result.slug == 'update') {
					//  Update Logic Here
					let objToSend = {
						objet: prod,
						user: this.user,
						type: this.the_partner,
						login: this.objLogin
					};
					let updateModal = this.modalCtrl.create('FormProductPage', {
						modif: true,
						toSend: objToSend,
						type: this.the_partner
					});
					updateModal.present();

					updateModal.onDidDismiss((data) => {
						// console.log('Updating Product ...');
						if (data) {
							console.log(data);
							let message = 'Les informations sur le ' + this.the_partner + ' ont été modifiées';
							// msgLoading.present();

							//On met à jour les informations (data) dans la base de données interne

							if (prod.id == 0) this.odooService.updateNoSyncObjet(this.the_partner, data, prod);
							else {
								this.odooService.updateNoSync(this.the_partner, data, prod.id, 'standart');
								this.odooService.updateSyncRequest(this.the_partner, data);
							}

							// msgLoading.dismiss();
							this.odooService.showMsgWithButton(message, 'top', 'toast-success');
						}
					});
				} else if (result.slug == 'detail') {
					let objToSend = {
						objet: prod,
						user: this.user,
						type: this.the_partner,
						login: this.objLogin
					};
					this.navCtrl.push('ProdDetailPage', { product: prod, toSend: objToSend });
				} else {
					// Sale Logic Here
				}
			}
		});
	}

	onAdd() {
		let addModal = this.modalCtrl.create('FormProductPage', { modif: false, objet: {}, type: this.the_partner });
		addModal.present();
		addModal.onDidDismiss((data) => {
			if (data) {
				let message = 'Great! You are created a Product !';

				data.idx = new Date().valueOf();
				// data.type = 'produit';

				//On insère dans la bd Interne
				this.clients.unshift(data);

				//On sauvegarde dans la bd temporaire (pour sync)
				this.odooService.copiedAddSync(this.the_partner, data);
				this.odooService.syncCreateObjet(this.the_partner, data);

				this.odooService.showMsgWithButton(message, 'top');
			}
		});
	}
	searchItems() {
		this.display_search = !this.display_search;
		if (this.display_search) {
			this.searchBtnColor = 'primary';
		} else {
			this.searchBtnColor = 'light';
		}
		this.content.resize();
	}
}
