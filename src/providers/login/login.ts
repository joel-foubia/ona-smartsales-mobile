import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Chart } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Team } from '../../models/team';
import { Vente } from '../../models/vente';
import { Invoice } from '../../models/invoice';

@Injectable()
export class LoginProvider {
	private today;
	private flag = '_ona_flag';

	constructor(
		public storage: Storage,
		public network: Network,
		public translate: TranslateService,
		public launchNavigator: LaunchNavigator
	) {
		this.today = moment().format('DD.MM.YYYY');
	}

	/**
   * Cette fontion retourne la date courante
   * @returns string
   */
	getCurrentDate() {
		return moment().format('YYYY-MM-DD');
	}

	/**
	 * Cette fonction permet de récupérer
	 * les paramètres de connexion de l'avocat
	 * struct {uid:"", username: "", name: "", password: ""}
	 *
	 * @return Objet <login>
	 **/
	getLogin() {
		return this.storage.get('login');
	}

	/**
	 * Cette fonction permet de stocker
	 * les paramètres de connexion de l'avocat
	 * struct {uid:"", username: "", password: ""}
	 *
	 * @param data Struct, les paramètres de connexion de l'utilisateur
	 **/

	saveLogin(data) {
		let newData = JSON.stringify(data);
		this.storage.set('login', newData);
	}

	/**
	 * Cette fonction permet de sauvegarder les 
	 * paramètres de l'utilisateur une fois que ce
	 * dernier est fournir 
	 * @param JSON data
	 *
	 **/
	saveSettingUser(data) {
		let newData = JSON.stringify(data);
		this.storage.set('setting', newData);
	}

	/**
	 * Cette fonction permet de recupérer les 
	 * paramètres de l'utilisateur 
	 *
	 * @return String
	 **/
	getSettingUser() {
		return this.storage.get('setting');
	}

	/**
	 * Cette fonction permet de sauvegarder
	 * les informations de l'abonné (numéro abonnement et numéro client)
	 *
	 * @return String
	 **/
	saveDataAbonne(abonneNumber, clientNumber) {
		let data = {
			abonne: abonneNumber,
			client: clientNumber
		};

		let newData = JSON.stringify(data);

		this.storage.set('abonne', newData);
	}

	/**
	 * Cette fonction permet de recupérer les 
	 * les informations de l'abonné (numéro abonnement et numéro client)
	 *
	 * @return String
	 **/
	getDataAbonne() {
		return this.storage.get('abonne');
	}

	/**
	 * Cette fonction recupere la valeur de l'objet type
	 * si la table (client, tribunal, ou contact existe)
	 *
	 * @return Objet <type>
	 **/
	isTable(type) {
		return this.storage.get(type);
	}

	/**
	 * Cette fonction définie la valeur true 
	 * lorsque les données sont présents dans la table (client, contact ou tribunal)
	 *
	 * @param type, nom de la table
	 * @param data Struct, 
	 **/

	setTable(type, data) {
		let newData = JSON.stringify(data);
		this.storage.set(type, newData);
	}

	/**
	 * Cette fonction permet de mettre à jour les
	 * les enregistrements dans la table (en ajout ou en modification)
	 *
	 * @param type, nom de la table
	 * @param data Struct, 
	 **/

	setObjectToTable(type, data) {
		this.isTable(type).then((rep) => {
			let results = [];
			if (rep) {
				let tabs = JSON.parse(rep);

				for (let j = 0; j < tabs.length; j++) {
					const element = tabs[j];

					//Ici retire les données enregistrées en bd interne car déjà sauvegardé sur le serveur
					if (
						(element.me === undefined && element.id == 0) ||
						(element.me !== undefined && element.me.id.me == 0)
					) {
						tabs.splice(j, 1);
					}

					for (let x = 0; x < data.length; x++) {
						if (
							(element.me === undefined && element.id == data[x].id) ||
							(element.me !== undefined && element.me.id.me == data[x].me.id.me)
						) {
							tabs[j] = data[x];
							data.splice(x, 1);
							break;
						}
					}
				}

				results = tabs.concat(data);
				this.setTable(type, results);
			} else {
				this.setTable(type, data);
			}
		});
	}

	/**
	 * This method is used to perform last update date (yyyy-mm-dd)
	 * @param type string, la table date de dernière modif
	 */
	formatDate(type) {
		return new Promise((resolve, reject) => {
			this.isTable(type + '_date').then((_date) => {
				if (_date) {
					// let tabs = _date.split(".");
					// let strDate = tabs[2]+"-"+tabs[1]+"-"+tabs[0];
					// resolve({ last_update: strDate });
					resolve({ last_update: _date });
					// this.last_date = { last_update: strDate };
				}
			});
		});
	}

	/**
	 * Cette fonction définie la valeur true 
	 * lorsque les données sont présents dans la table (client, contact ou tribunal)
	 *
	 * @param type, nom de la table
	 * @param data Struct, 
	 **/

	setTableTo(type, data) {
		let newData = JSON.stringify(data);
		return this.storage.set(type, newData);
	}

	setDataNoStringy(type, data) {
		this.storage.set(type, data);
	}

	//Cette fonction permet de supprimer la table (en mode asynchrone)
	remove(cle) {
		this.storage.remove(cle);
	}

	//Cette fonction permet de supprimer la table (en mode synchrone)
	removeTo(cle) {
		return this.storage.remove(cle);
	}

	getToday() {
		return this.today;
	}

	/**
	 * Cette fonction permet d'enregistrer la date
	 * de la dernière synchronisation
	 * 
	 */
	setLastUpdate() {
		this.storage.set('_last_synchro', moment().format());
	}

	setSync(type) {
		this.storage.set(type, moment().format('YYYY-MM-DD HH:mm:ss'));
	}

	/**
	 * cette fonction permet de dire si oui ou non
	 * la synchronisation est terminer
	 * @param value boolean, 
	 */
	fixSynchro(value: boolean) {
		this.storage.set('is_synchro', value);
	}

	/**
   * Function called in the constructor of any view to check internet status and last sync date
   * 
   */
	checkStatus(alias) {
		return new Promise((resolve, reject) => {
			this.storage.get(this.flag).then((flag) => {
				this.storage.get(alias + '_date').then((date) => {
					if (flag === false && !date) {
						resolve('i'); //No data save
						console.log('Connect To internet to view content');
					} else if (flag === false && date) {
						resolve('s'); //read data from storage
						console.log('Reading from storage');
					} else if (flag === true && date) {
						if (date === moment().format('DD.MM.YYYY')) {
							resolve('s');
							console.log('Reading from Storage');
						} else {
							resolve('w');
							console.log('Reading from Server and Synchronize with storage');
						}
					} else if (flag === true && !date) {
						resolve('rw');
						console.log('Reading from Server and save data to storage');
					}
				});
			});
		});
	}

	/**
   * Function called in app.component.ts to check availability of internet connection and last 
   * sync date
   */
	checkstatus() {
		if (this.network.type === 'unknown' || this.network.type === 'none' || this.network.type === 'undefined') {
			this.storage.set(this.flag, false);
			localStorage.setItem('is_update', 'false');
		} else {
			localStorage.setItem('is_update', 'true');
			this.storage.get('is_sync').then((reponse) => {
				this.storage.set(this.flag, true);
				if (reponse != null && reponse == false) {
					this.storage.set(this.flag, false);
				}
			});
		}

		//On écoute les évènements disconnect et on connecte
		let connected = this.network.onConnect().subscribe(() => {
			setTimeout(() => {
				localStorage.setItem('is_update', 'true');
				this.storage.get('is_sync').then((reponse) => {
					this.storage.set(this.flag, true);
					if (reponse != null && reponse == false) {
						this.storage.set(this.flag, false);
					}
				});
			}, 5000);
		});

		let disconnected = this.network.onDisconnect().subscribe(() => {
			setTimeout(() => {
				this.storage.set(this.flag, false);
				localStorage.setItem('is_update', 'false');
			}, 5000);
		});
	}

	/**
   * Cette fonction permet d'activer la synchro
   * ou de désactiver la synchro
   * @param active boolean, active ou desactive la synchro auto
   */
	desactiveSync(active: boolean) {
		this.storage.set('is_sync', active);
		this.storage.set(this.flag, active);
	}

	//Cette fonction renvoie la valeur courrante
	//de la synchro
	getCurrentValSync() {
		return this.storage.get('is_sync');
	}

	/**
	 * Function to sync executed after each minute (or 2 minutes)
	 */
	connChange(alias) {
		return new Promise((resolve, reject) => {
			console.log('Time to Sync ' + alias);
			this.storage.get(this.flag).then((flag) => {
				this.storage.get(alias + '_date').then((date) => {
					//this.presentAlert('','Flag' + flag)
					if (flag === true) {
						//Make Synchronisation
						resolve(true);
					} else if (flag === false || date === moment().format('DD.MM.YYYY')) {
						console.log('No Sync');
						resolve(false);
					}
				});
			});
		});
	}

	/**
	 * Cette fonction permet de sauvegarder une image depuis firebase
	 * @param cle string, il s'agit de l'url de la photo que l'on souhaite sauvegarder
	 * @param valeur string, image en base 64
	 */
	savePhoto(cle, valeur) {
		this.storage.set(cle, valeur);
	}

	/**
	 * Cette fonction récupère la base64 de l'image
	 * @param cle string, la clé permettant de récupérer la valeur
	 */
	findPhotoByURL(cle) {
		return new Promise((resolve, reject) => {
			this.storage.get(cle).then((res) => {
				if (res) {
					resolve(res);
				} else {
					reject({ err: 1, message: 'Image not found' });
				}
			});
		});
	}

	/**
	 * Cette fonction permet de vérifier que la date
	 * en paramètre est la meme
	 * @param current_date String date
	 * @returns boolean
	 */
	sameDate(current_date, strTime?: string) {
		let texte = '';
		if (strTime === undefined) texte = '';
		else texte = strTime;

		if (moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD' + texte).isSame(moment(current_date, 'YYYY-MM-DD'))) {
			// console.log('trouve');
			return true;
		}

		return false;
	}

	/**
	 * Cette fonction permet de vérifier que la date
	 * est correcte
	 * @param current_date String date
	 * @returns boolean
	 */
	valideDate(current_date) {
		var date = moment(current_date);
		date.add(1, 'M');

		if (
			moment(date.year().toString() + '-' + date.month().toString() + '-01', 'YYYY-MM-DD').isValid() &&
			moment(
				date.year().toString() + '-' + date.month().toString() + '-' + date.daysInMonth().toString(),
				'YYYY-MM-DD'
			).isValid()
		)
			return true;

		return false;
	}

	/**
	 * Cette fonction permet de vérifier que la date
	 * actuelle se trouve dans le mois courrant
	 * @param current_date String date
	 * @returns boolean
	 */
	dateBetween(current_date) {
		var date = moment(current_date);
		date.add(1, 'M');

		if (
			moment(date.year().toString() + '-' + date.month().toString() + '-01', 'YYYY-MM-DD').isValid() &&
			moment(
				date.year().toString() + '-' + date.month().toString() + '-' + date.daysInMonth().toString(),
				'YYYY-MM-DD'
			).isValid()
		)
			if (
				moment(moment().format('YYYY-MM-DD').toString()).isBetween(
					moment(date.year().toString() + '-' + date.month().toString() + '-01', 'YYYY-MM-DD')
						.format('YYYY-MM-DD')
						.toString(),
					moment(
						date.year().toString() + '-' + date.month().toString() + '-' + date.daysInMonth().toString(),
						'YYYY-MM-DD'
					)
						.format('YYYY-MM-DD')
						.toString(),
					null,
					'[]'
				)
			)
				return true;

		return false;
	}
	/**
	 * Cette fonction permet de vérifier que la date
	 * actuelle se trouve dans le mois passer
	 * @param current_date String date
	 * @returns boolean
	 */
	dateBetweenLastMonth(current_date) {
		var date = moment(current_date);

		if (
			moment(date.year().toString() + '-' + date.month().toString() + '-01', 'YYYY-MM-DD').isValid() &&
			moment(
				date.year().toString() + '-' + date.month().toString() + '-' + date.daysInMonth().toString(),
				'YYYY-MM-DD'
			).isValid()
		)
			if (
				moment(moment().format('YYYY-MM-DD').toString()).isBetween(
					moment(date.year().toString() + '-' + date.month().toString() + '-01', 'YYYY-MM-DD')
						.format('YYYY-MM-DD')
						.toString(),
					moment(
						date.year().toString() + '-' + date.month().toString() + '-' + date.daysInMonth().toString(),
						'YYYY-MM-DD'
					)
						.format('YYYY-MM-DD')
						.toString(),
					null,
					'[]'
				)
			)
				return true;

		return false;
	}

	/**
	 * Cette fontion permet de vérifier que la
	 * date courrante correspond à celle de l'attribut date
	 * de l'objet
	 * @param current_date string
	 */
	theSameDate(current_date) {
		return moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').isSame(moment(current_date, 'YYYY-MM-DD'));
	}

	/**
	 * Cette fontion permet de vérifier que la
	 * date courrante est en avance sur la date en paramètres (current_date)
	 * de l'objet
	 * @param current_date string
	 */
	afterDate(current_date) {
		var string = '';
		string = current_date;
		var date = string.split(' ')[0];
		var time = string.split(' ')[1];

		return moment(moment().format('h:mm:ss'), 'h:mm:ss').isAfter(moment(time, 'h:mm:ss'));
	}

	/**
	 * Cette méthode permet d'afficher/masquer le 
	 * bouton fab lorsque l'utilisateur scroll vers le bas/haut
	 * 
	 * @param content Content ViewChild
	 * @param fabButton FabButton ViewChild
	 */
	showHideFab(content, fabButton) {
		content.ionScroll.subscribe((d) => {
			if (d != null) fabButton.setElementClass('animated', d.directionY == 'down');
			fabButton.setElementClass('fadeOutDown', d.directionY == 'down');
		});
	}

	/**
	 * 
	 * @param monthPass Le nombre de mois en arriere
	 */
	getMonthName(monthPass) {
		return new Date(
			new Date().setMonth(new Date().getMonth() - monthPass)
		).toLocaleString(this.translate.getDefaultLang(), { month: 'long' });
	}

	/**
	 * Cette méthode permet de retourner la liste des
	 * montants prévisionel des prospects gagnés
	 * 
	 * @param list Array<Lead>, tableau des lead
	 * @param user any, l'utilisateur connecté
	 * 
	 * @returns Array<number>
	 */
	getLastMonthsInvoices(list: Array<any>, user) {
		var firstMonth = 0;
		var secondMonth = 0;
		var thirdMonth = 0;
		for (let i = 0; i < list.length; i++) {
			let elementDate = new Date(list[i].date_open);
			if (list[i].user_id.id == user.id && list[i].probability >= 100 && this.checkInterval(elementDate, 2)) {
				firstMonth = firstMonth + list[i].planned_revenue;
			}
			if (list[i].user_id.id == user.id && list[i].probability >= 100 && this.checkInterval(elementDate, 1)) {
				secondMonth = secondMonth + list[i].planned_revenue;
			}
			if (list[i].user_id.id == user.id && list[i].probability >= 100 && this.checkInterval(elementDate, 0)) {
				thirdMonth = thirdMonth + list[i].planned_revenue;
			}
		}

		return [ firstMonth, secondMonth, thirdMonth ];
	}

	/**
	 * Cette méthode permet d'afficher le graphe des
	 * sur les données sur les 3 derniers mois
	 * 
	 * @param barCanvasLarge Canvas, conteneur du graphe
	 * @param monthsLarge Array<string>, la liste des 3 derniers mois
	 * @param pop any, l'objet pour la traductions des légendes (labels)
	 * @param barChartLargeDataSet Array<any>, les données à afficher sur le graphe
	 * @param opport_color string, couleur sur le background color
	 * @param opport_color_light string, couleur sur les bordures
	 */
	loadLastMonthsBarChart(
		barCanvasLarge: any,
		monthsLarge: any,
		pop: any,
		barChartLargeDataSet: any,
		opport_color: string,
		opport_color_light: string,
		type?: string,
		objColor?: any
	) {
		let myOption = {},
			myColor;
		if (type !== undefined && type == 'bar') {
			myOption = {
				legend: {
					labels: {
						// This more specific font property overrides the global property
						fontColor: 'black'
					}
				},
				scales: {
					yAxes: [
						{
							scaleLabel: {
								display: true,
								labelString: 'Revenue (€)',
								fontSize: 10,
								padding: 0
							},
							ticks: {
								beginAtZero: true,
								fontColor: 'black'
							}
						}
					],
					xAxes: [
						{
							scaleLabel: {
								display: true,
								labelString: pop.month,
								fontSize: 10,
								padding: 0
							},
							ticks: {
								beginAtZero: true,
								fontColor: 'black'
							}
						}
					]
				}
			};
		}

		if (objColor !== undefined) {
			myColor = [ objColor.orange, objColor.blue, objColor.green ];
		} else {
			myColor = [ opport_color_light, opport_color_light, opport_color_light ];
		}

		let barChartLarge = new Chart(barCanvasLarge.nativeElement, {
			type: type,
			data: {
				labels: monthsLarge,
				datasets: [
					{
						label: pop.won_label,
						data: barChartLargeDataSet,
						backgroundColor: myColor,
						borderColor: [ opport_color, opport_color, opport_color ],
						borderWidth: 1
					}
				]
			},
			options: myOption
		});

		return barChartLarge;
	}

	checkInterval(elementDate: Date, monthPass) {
		var now = new Date();
		if (
			elementDate.getFullYear() == now.getFullYear() &&
			elementDate.getMonth() == now.getMonth() - monthPass &&
			elementDate.getDate() >= now.getDate()
		) {
			return true;
		} else {
			return false;
		}
	}

	navigateTo(address) {
		this.launchNavigator.navigate(address).then().catch((err) => {
			console.log('Error launchnavigator ', err);
		});
	}

	applyFilterNotes(searchs, objet) {
		var searchList = [];

		let cpt = 0;

		for (let j = 0; j < searchList.length; j++) {
			switch (searchList[j].slug) {
				case 'color': {
					//tag
					if (objet.bg == searchList[j].val) {
						cpt++;
					}
					break;
				}
				case 'active': {
					//active
					if (objet.active == searchs[j].active) {
						cpt++;
					}
					break;
				}
			}
		} //Fin tab searchList

		if (cpt == searchList.length) return true;
		else return false;
	}

	//////////////////////////////////////////////////////////////////////////////////////////
	//	MODULE CHART JS
	//
	/////////////////////////////////////////////////////////////////////////////////////////

	loadProdNonGradientLinearChart(
		lineCanvas: any,
		pop: any,
		opport_color_light: string,
		weeks: Array<any>,
		labels: Array<any>,
		label
	) {
		// console.log('Displaying line chart');
		let lineChart = new Chart(lineCanvas.nativeElement, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						label: label,
						fill: true,
						lineTension: 0.1,
						backgroundColor: opport_color_light,
						borderColor: opport_color_light,
						borderCapStyle: 'butt',
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: 'miter',
						pointBorderColor: 'rgba(255, 255, 255, 1)',
						pointBackgroundColor: '#000',
						pointBorderWidth: 1,
						pointHoverRadius: 5,
						pointHoverBackgroundColor: opport_color_light,
						pointHoverBorderColor: 'rgba(225,225,225,1)',
						pointHoverBorderWidth: 2,
						pointRadius: 1,
						pointHitRadius: 10,
						// data: [ 65, 59, 80, 81 ],
						data: weeks,
						spanGaps: false
					}
				]
			},
			options: {
				legend: {
					labels: {
						// This more specific font property overrides the global property
						fontColor: 'black'
					}
				},
				scales: {
					yAxes: [
						{
							ticks: {
								fontColor: 'black'
								// fontSize: 14,
								// stepSize: 1,
								// beginAtZero: true
							},
							scaleLabel: {
								display: true,
								labelString: 'Revenue (€)',
								fontSize: 10,
								padding: 0
							}
						}
					],
					xAxes: [
						{
							ticks: {
								fontColor: 'black'
								// fontSize: 16,
								// stepSize: 1,
								// beginAtZero: true
							},
							scaleLabel: {
								display: true,
								labelString: 'Duration',
								fontSize: 10,
								padding: 0
							}
						}
					]
				}
			}
		});

		return lineChart;
	}

	loadNonGradientLinearChart(
		lineCanvas: any,
		pop: any,
		opport_color_light: string,
		opport_color: string,
		weeks: any
	) {
		// console.log('Displaying line chart');
		let lineChart = new Chart(lineCanvas.nativeElement, {
			type: 'line',
			data: {
				labels: [ pop.week1, pop.week2, pop.week3, pop.week4 ],
				datasets: [
					{
						label: pop.chart_label,
						fill: true,
						lineTension: 0.1,
						backgroundColor: opport_color_light,
						borderColor: opport_color,
						borderCapStyle: 'butt',
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: 'miter',
						pointBorderColor: 'rgba(255, 255, 255, 1)',
						pointBackgroundColor: '#000',
						pointBorderWidth: 1,
						pointHoverRadius: 5,
						pointHoverBackgroundColor: opport_color,
						pointHoverBorderColor: 'rgba(225,225,225,1)',
						pointHoverBorderWidth: 2,
						pointRadius: 1,
						pointHitRadius: 10,
						// data: [ 65, 59, 80, 81 ],
						data: weeks,
						spanGaps: false
					}
				]
			},
			options: {
				legend: {
					labels: {
						// This more specific font property overrides the global property
						fontColor: 'black'
					}
				},
				scales: {
					yAxes: [
						{
							ticks: {
								fontColor: 'black'
								// fontSize: 14,
								// stepSize: 1,
								// beginAtZero: true
							},
							scaleLabel: {
								display: true,
								labelString: 'Revenue (€)',
								fontSize: 10,
								padding: 0
							}
						}
					],
					xAxes: [
						{
							ticks: {
								fontColor: 'black'
								// fontSize: 16,
								// stepSize: 1,
								// beginAtZero: true
							},
							scaleLabel: {
								display: true,
								labelString: 'Duration',
								fontSize: 10,
								padding: 0
							}
						}
					]
				}
			}
		});

		return lineChart;
	}

	/**
	 * This method is used to define Chart based on 
	 * data parameters
	 * 
	 * @param lineCanvas Canvas, le bloc devant contenir le chart
	 * @param pop any, objet pour la traduction des mots (pop)
	 * @param opport_color_light string, couleur pour les bordures
	 * @param opport_color string, couleur des textes
	 * @param weeks Array<any>, tableau des semaines contenant les données
	 * 
	 * @return Chart
	 */
	loadLinearChart(ctx: any, pop: any, opport_color: string, weeks: any) {
		console.log('Displaying line chart ', weeks);
		var gradientFill = ctx.createLinearGradient(0, 0, 0, 150);
		gradientFill.addColorStop(0, 'rgba(130, 177, 74, 0.8)');
		gradientFill.addColorStop(1, 'rgba(255, 255, 255, 0.6)');
		let lineChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: [ pop.week1, pop.week2, pop.week3, pop.week4 ],
				datasets: [
					{
						label: pop.chart_label,
						fill: true,
						// showLine: false,
						lineTension: 0.1,
						backgroundColor: gradientFill,
						borderColor: opport_color,
						borderCapStyle: 'butt',
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: 'miter',
						pointBorderColor: 'rgba(255, 255, 255, 1)',
						pointBackgroundColor: 'rgb(21, 67, 96)',
						pointBorderWidth: 1,
						pointHoverRadius: 5,
						pointHoverBackgroundColor: opport_color,
						pointHoverBorderColor: 'rgba(225,225,225,1)',
						pointHoverBorderWidth: 2,
						pointRadius: 1,
						pointHitRadius: 10,
						// data: [ 65, 59, 80, 81 ],
						data: weeks,
						spanGaps: false
					}
				]
			},
			options: {
				legend: {
					labels: {
						// This more specific font property overrides the global property
						fontColor: 'black'
					}
				},
				scales: {
					yAxes: [
						{
							ticks: {
								fontColor: 'black'
								// fontSize: 14,
								// stepSize: 1,
								// beginAtZero: true
							}
						}
					],
					xAxes: [
						{
							ticks: {
								fontColor: 'black'
								// fontSize: 16,
								// stepSize: 1,
								// beginAtZero: true
							}
						}
					]
				}
			}
		});

		return lineChart;
	}

	/**
	 * This method is used to define Chart based on 
	 * data parameters
	 * 
	 * @param lineCanvas Canvas, le bloc devant contenir le chart
	 * @param pop any, objet pour la traduction des mots (pop)
	 * @param weeks Array<any>, tableau des semaines contenant les données
	 * 
	 * @return Chart
	 */
	loadLinearMultipleChart(lineCanvas: any, pop: any, datas: Array<any>) {
		let widgets = [];
		for (let j = 0; j < datas.length; j++) {
			// const element = datas[j];

			let dataFirst = {
				label: datas[j].nom,
				data: datas[j].tabs,
				lineTension: 0.3,
				fill: false,
				borderColor: datas[j].color,
				backgroundColor: 'transparent',
				pointBorderColor: datas[j].color,
				pointBackgroundColor: 'lightgreen',
				pointRadius: 5,
				pointHoverRadius: 15,
				pointHitRadius: 30,
				pointBorderWidth: 2,
				pointStyle: 'rect'
			};

			widgets.push(dataFirst);
		}

		let speedData = {
			labels: [ pop.week1, pop.week2, pop.week3, pop.week4 ],
			datasets: widgets
		};

		let chartOptions = {
			legend: {
				display: true,
				position: 'top',
				labels: {
					boxWidth: 80,
					fontColor: 'black'
				}
			}
		};

		let lineChart = new Chart(lineCanvas.nativeElement, {
			type: 'line',
			data: speedData,
			options: chartOptions
		});

		return lineChart;
	}
	/**
	 * This method is used to define Chart based on 
	 * data parameters
	 * 
	 * @param lineCanvas Canvas, le bloc devant contenir le chart
	 * @param pop any, objet pour la traduction des mots (pop)
	 * @param weeks Array<any>, tableau des semaines contenant les données
	 * 
	 * @return Chart
	 */
	loadLinearMultipleChartProd(lineCanvas: any, pop: any, datas: Array<any>) {
		let widgets = [];
		for (let j = 0; j < datas.length; j++) {
			// const element = datas[j];

			let dataFirst = {
				label: datas[j].label_txt,
				data: datas[j].days,
				lineTension: 0.3,
				fill: false,
				borderColor: datas[j].color,
				backgroundColor: 'transparent',
				pointBorderColor: datas[j].color,
				pointBackgroundColor: 'lightgreen',
				pointRadius: 5,
				pointHoverRadius: 15,
				pointHitRadius: 30,
				pointBorderWidth: 2,
				pointStyle: 'rect'
			};

			widgets.push(dataFirst);
		}

		let speedData = {
			labels: datas[0].labels,
			datasets: widgets
		};

		let chartOptions = {
			legend: {
				display: true,
				position: 'top',
				labels: {
					boxWidth: 80,
					fontColor: 'black'
				}
			},
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: true,
							fontColor: 'black'
						},
						scaleLabel: {
							display: true,
							labelString: 'Quantity',
							fontSize: 10,
							padding: 0
						}
					}
				],
				xAxes: [
					{
						ticks: {
							beginAtZero: true,
							fontColor: 'black'
						},
						scaleLabel: {
							display: true,
							labelString: 'Duration',
							fontSize: 10,
							padding: 0
						}
					}
				]
			}
		};

		let lineChart = new Chart(lineCanvas.nativeElement, {
			type: 'line',
			data: speedData,
			options: chartOptions
		});

		return lineChart;
	}
	/**
	 * This method is used to define Chart based on 
	 * data parameters
	 * 
	 * @param lineCanvas Canvas, le bloc devant contenir le chart
	 * @param pop any, objet pour la traduction des mots (pop)
	 * @param weeks Array<any>, tableau des semaines contenant les données
	 * 
	 * @return Chart
	 */
	loadLinearMultipleChartMonth(lineCanvas: any, pop: any, datas: Array<any>) {
		let widgets = [];
		for (let j = 0; j < datas.length; j++) {
			// const element = datas[j];

			let dataFirst = {
				label: datas[j].nom,
				data: datas[j].tabs,
				lineTension: 0.3,
				fill: false,
				borderColor: datas[j].color,
				backgroundColor: 'transparent',
				pointBorderColor: datas[j].color,
				pointBackgroundColor: 'lightgreen',
				pointRadius: 5,
				pointHoverRadius: 15,
				pointHitRadius: 30,
				pointBorderWidth: 2,
				pointStyle: 'rect'
			};

			widgets.push(dataFirst);
		}

		let speedData = {
			labels: [
				pop.month1,
				pop.month2,
				pop.month3,
				pop.month4,
				pop.month5,
				pop.month6,
				pop.month7,
				pop.month8,
				pop.month9,
				pop.month10,
				pop.month11,
				pop.month12
			],
			datasets: widgets
		};

		let chartOptions = {
			legend: {
				display: true,
				position: 'top',
				labels: {
					boxWidth: 80,
					fontColor: 'black'
				}
			},
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: true,
							fontColor: 'black'
						},
						scaleLabel: {
							display: true,
							labelString: 'Revenue (€)',
							fontSize: 10,
							padding: 0
						}
					}
				],
				xAxes: [
					{
						ticks: {
							beginAtZero: true,
							fontColor: 'black'
						},
						scaleLabel: {
							display: true,
							labelString: 'Months',
							fontSize: 10,
							padding: 0
						}
					}
				]
			}
		};

		let lineChart = new Chart(lineCanvas.nativeElement, {
			type: 'line',
			data: speedData,
			options: chartOptions
		});

		return lineChart;
	}

	/**
	 * This method is used to build Graph (bar type)
	 * for drawing invoice on two months
	 * 
	 * @param barCanvas Canvas, objet contenant le graphe
	 * @param months Array<any>, résultats sur les mois récents
	 * @param pop any, objet contenant les traductions
	 * @param invoice_color string, couleur pour les bordures
	 * @param invoice_color_light string, couleur du background
	 * @param last_month_total number, montant total du mois précédent
	 * @param total_invoice number, montant total des factures
	 * 
	 * @returns Chart
	 */
	loadbarChart(
		barCanvas: any,
		months: any,
		pop: any,
		invoice_color: string,
		invoice_color_light: string,
		last_month_total,
		total_invoice
	) {
		let barChart = new Chart(barCanvas.nativeElement, {
			type: 'bar',
			data: {
				labels: months,
				datasets: [
					{
						label: pop.bar_label,
						data: [ last_month_total, total_invoice ],
						backgroundColor: [ invoice_color_light, invoice_color_light, invoice_color_light ],
						borderColor: [ invoice_color, invoice_color, invoice_color ],
						borderWidth: 1
					}
				]
			},
			options: {
				legend: {
					labels: {
						// This more specific font property overrides the global property
						fontColor: 'black'
					}
				},
				scales: {
					yAxes: [
						{
							ticks: {
								beginAtZero: true,
								fontColor: 'black'
							}
						}
					],
					xAxes: [
						{
							ticks: {
								beginAtZero: true,
								fontColor: 'black'
							}
						}
					]
				}
			}
		});

		return barChart;
	}

	/** ======================================================================================
	 *  STATISTIQUE SUR LES EQUIPES DE VENTES 
	 * 
	 * 
	 ==========================================================================================*/

	/**
	  * This method is used to build Line Chart
	  * for a specific team
	  * @param team Team, objet de type Team
	  */
	getStatOfTeam(team: Team, barCanvasLarge, pop: any, opport: any) {
		return new Promise((resolve, reject) => {
			this.isTable('_ona_leads').then((leads) => {
				// console.log('Leads =>', JSON.parse(leads));

				if (leads) {
					let weeks = [];
					let monthsLarge = [ this.getMonthName(2), this.getMonthName(1), this.getMonthName(0) ];

					// console.log("ready for graph");
					let list = JSON.parse(leads);

					var firstMonth = 0;
					var secondMonth = 0;
					var thirdMonth = 0;

					for (let i = 0; i < list.length; i++) {
						let elementDate = new Date(list[i].date_open);

						if (
							list[i].team_id.id == team.id &&
							list[i].probability >= 100 &&
							this.checkInterval(elementDate, 2)
						) {
							firstMonth = firstMonth + list[i].planned_revenue;
						}
						if (
							list[i].team_id.id == team.id &&
							list[i].probability >= 100 &&
							this.checkInterval(elementDate, 1)
						) {
							secondMonth = secondMonth + list[i].planned_revenue;
						}
						if (
							list[i].team_id.id == team.id &&
							list[i].probability >= 100 &&
							this.checkInterval(elementDate, 0)
						) {
							thirdMonth = thirdMonth + list[i].planned_revenue;
						}
					}

					let barChartLargeDataSet = [ firstMonth, secondMonth, thirdMonth ];
					console.log(barChartLargeDataSet);

					//On affiche le graphe sur les prospects gagnés suivant les 3 derniers mois
					let barChartLarge = this.loadLastMonthsBarChart(
						barCanvasLarge,
						monthsLarge,
						pop,
						barChartLargeDataSet,
						opport.color,
						opport.color_light,
						'bar'
					);
					resolve(barChartLarge);
				}
			});
		});
	}

	/**
	  * This method is used to build Pie Chart
	  * for a specific team
	  * @param team Team, objet de type Team
	  */
	getOrdersInvoicesOfTeam(team: Team, barCanvasLarge, pop: any, opport: any) {
		let objColor = {
			orange: '#ef8513',
			blue: '#4d8ff3',
			green: '#0cbd3c'
		};

		this.isTable('_ona_vente').then((ventes) => {
			this.isTable('_ona_invoice').then((data) => {
				var devis = 0;
				var orders = 0;
				var factures = 0;

				// let weeks = [];
				let monthsLarge = [ pop.devis, pop.txt_order, pop.bill ];

				if (ventes) {
					// console.log("ready for graph");
					let list: Array<Vente> = JSON.parse(ventes);

					for (let i = 0; i < list.length; i++) {
						let elementDate = new Date(list[i].create_date);

						if (
							list[i].team_id.id == team.id &&
							list[i].state == 'draft' &&
							this.checkInterval(elementDate, 2)
						) {
							devis++;
						}

						if (
							list[i].team_id.id == team.id &&
							list[i].state == 'sale' &&
							this.checkInterval(elementDate, 1)
						) {
							orders++;
						}
					}
				}

				if (data) {
					let list: Array<Invoice> = JSON.parse(data);

					for (let i = 0; i < list.length; i++) {
						let elementDate = new Date(list[i].date_invoice);

						if (
							list[i].team_id.id == team.id &&
							list[i].state == 'open' &&
							this.checkInterval(elementDate, 2)
						) {
							factures++;
						}
					}
				}

				let barChartLargeDataSet = [ devis, orders, factures ];
				console.log(barChartLargeDataSet);

				//On affiche le graphe sur les prospects gagnés suivant les 3 derniers mois
				let barChartLarge = this.loadLastMonthsBarChart(
					barCanvasLarge,
					monthsLarge,
					pop,
					barChartLargeDataSet,
					opport.color,
					opport.color_light,
					'pie',
					objColor
				);
				// resolve(barChartLarge);
			});
		});
	}

	getMember(users: Array<any>, id) {
		for (let k = 0; k < users.length; k++) {
			if (id == users[k].id) {
				return users[k];
			}
		}
	}

	getTeamsCA(type, pop) {
		return new Promise((resolve, reject) => {
			this.isTable('_ona_team').then((tdata) => {
				this.isTable('_ona_leads').then((sdata) => {
					this.isTable('_ona_user').then((udata) => {
						let leads = JSON.parse(sdata);
						let teams = JSON.parse(tdata);
						let users = JSON.parse(udata);
						if (type == 'month') {
							let teamList = [];
							let finalTeamData;
							for (let l = 0; l < teams.length; l++) {
								let userList = [];
								for (let j = 0; j < teams[l].member_ids.length; j++) {
									var member = this.getMember(users, teams[l].member_ids[j]);
									let week1 = 0,
										week2 = 0,
										week3 = 0,
										week4 = 0;
									if (member != undefined) {
										for (let k = 0; k < leads.length; k++) {
											var yr = new Date().getFullYear();
											var month = new Date().getMonth();

											if (
												leads[k].user_id.id == member.id &&
												member.sale_team_id.id == teams[l].id &&
												(new Date(leads[k].date_open) >= new Date(yr, month, 1) &&
													new Date(leads[k].date_open) <= new Date(yr, month, 7)) &&
												leads[k].probability == 100
											) {
												if (
													leads[k].planned_revenue != '' &&
													leads[k].planned_revenue != undefined &&
													leads[k].planned_revenue != null
												) {
													week1 = week1 + leads[k].planned_revenue;
												}
											}
											if (
												leads[k].user_id.id == member.id &&
												member.sale_team_id.id == teams[l].id &&
												(new Date(leads[k].date_open) >= new Date(yr, month, 8) &&
													new Date(leads[k].date_open) <= new Date(yr, month, 14)) &&
												leads[k].probability == 100
											) {
												if (
													leads[k].planned_revenue != '' &&
													leads[k].planned_revenue != undefined &&
													leads[k].planned_revenue != null
												) {
													week2 = week2 + leads[k].planned_revenue;
												}
											}
											if (
												leads[k].user_id.id == member.id &&
												member.sale_team_id.id == teams[l].id &&
												(new Date(leads[k].date_open) >= new Date(yr, month, 15) &&
													new Date(leads[k].date_open) <= new Date(yr, month, 21)) &&
												leads[k].probability == 100
											) {
												if (
													leads[k].planned_revenue != '' &&
													leads[k].planned_revenue != undefined &&
													leads[k].planned_revenue != null
												) {
													week3 = week3 + leads[k].planned_revenue;
												}
											}
											if (
												leads[k].user_id.id == member.id &&
												member.sale_team_id.id == teams[l].id &&
												(new Date(leads[k].date_open) >= new Date(yr, month, 21) &&
													new Date(leads[k].date_open) <= new Date(yr, month + 1, 0)) &&
												leads[k].probability == 100
											) {
												if (
													leads[k].planned_revenue != '' &&
													leads[k].planned_revenue != undefined &&
													leads[k].planned_revenue != null
												) {
													week4 = week4 + leads[k].planned_revenue;
												}
											}
										}

										userList.push({
											user: member,
											labels: [ pop.week1, pop.week2, pop.week3, pop.week4 ],
											total: week1 + week2 + week3 + week4,
											color:
												'#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
											tabs: [ week1, week2, week3, week4 ]
										});
									}
								}
								var Tweek1 = 0,
									Tweek2 = 0,
									Tweek3 = 0,
									Tweek4 = 0;
								for (let k = 0; k < userList.length; k++) {
									Tweek1 = userList[k].tabs[0] + Tweek1;
									Tweek2 = userList[k].tabs[1] + Tweek2;
									Tweek3 = userList[k].tabs[2] + Tweek3;
									Tweek4 = userList[k].tabs[3] + Tweek4;
								}
								teamList.push({
									team: teams[l],
									labels: [ pop.week1, pop.week2, pop.week3, pop.week4 ],
									tabs: [ Tweek1, Tweek2, Tweek3, Tweek4 ],
									color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
									users: userList,
									total: Tweek1 + Tweek2 + Tweek3 + Tweek4
								});
							}
							var Fweek1 = 0;
							var Fweek2 = 0;
							var Fweek3 = 0;
							var Fweek4 = 0;
							var allUsers = [];
							var allTeams = [];
							for (let k = 0; k < teamList.length; k++) {
								Fweek1 = Fweek1 + teamList[k].tabs[0];
								Fweek2 = Fweek2 + teamList[k].tabs[1];
								Fweek3 = Fweek3 + teamList[k].tabs[2];
								Fweek4 = Fweek4 + teamList[k].tabs[3];
								allUsers = allUsers.concat(teamList[k].users);
								allTeams.push(teamList[k])
							}
							finalTeamData = {
								labels: [ pop.week1, pop.week2, pop.week3, pop.week4 ],
								color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
								users: allUsers,
								teams: allTeams,
								tabs: [ Fweek1, Fweek2, Fweek3, Fweek4 ],
								label_txt: pop.label_ca
							};
							console.log('Team data ', finalTeamData)

							resolve(finalTeamData);
						} else if (type == 'year') {
							let teamList = [];
							let finalTeamData;
							for (let l = 0; l < teams.length; l++) {
								let userList = [];
								for (let j = 0; j < teams[l].member_ids.length; j++) {
									var member = this.getMember(users, teams[l].member_ids[j]);
									let january = 0;
									let feabruary = 0;
									let march = 0;
									let april = 0;
									let may = 0;
									let june = 0;
									let july = 0;
									let august = 0;
									let september = 0;
									let october = 0;
									let november = 0;
									let december = 0;
									if (member != undefined) {
										for (let k = 0; k < leads.length; k++) {
											var yr = new Date().getFullYear();
											var month = new Date().getMonth();

											if (
												new Date().getFullYear() == new Date(leads[k].date_open).getFullYear()
											) {
												if (
													leads[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													new Date(leads[k].date_open).getMonth() + 1 == 1 &&
													leads[k].probability == 100
												) {
													if (
														leads[k].planned_revenue != '' &&
														leads[k].planned_revenue != undefined &&
														leads[k].planned_revenue != null
													) {
														january = january + leads[k].planned_revenue;
													}
												}
												if (
													leads[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													new Date(leads[k].date_open).getMonth() + 1 == 2 &&
													leads[k].probability == 100
												) {
													if (
														leads[k].planned_revenue != '' &&
														leads[k].planned_revenue != undefined &&
														leads[k].planned_revenue != null
													) {
														feabruary = feabruary + leads[k].planned_revenue;
													}
												}
												if (
													leads[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													new Date(leads[k].date_open).getMonth() + 1 == 3 &&
													leads[k].probability == 100
												) {
													if (
														leads[k].planned_revenue != '' &&
														leads[k].planned_revenue != undefined &&
														leads[k].planned_revenue != null
													) {
														march = march + leads[k].planned_revenue;
													}
												}
												if (
													leads[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													new Date(leads[k].date_open).getMonth() + 1 == 4 &&
													leads[k].probability == 100
												) {
													if (
														leads[k].planned_revenue != '' &&
														leads[k].planned_revenue != undefined &&
														leads[k].planned_revenue != null
													) {
														april = april + leads[k].planned_revenue;
													}
												}
												if (
													leads[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													new Date(leads[k].date_open).getMonth() + 1 == 5 &&
													leads[k].probability == 100
												) {
													if (
														leads[k].planned_revenue != '' &&
														leads[k].planned_revenue != undefined &&
														leads[k].planned_revenue != null
													) {
														may = may + leads[k].planned_revenue;
													}
												}
												if (
													leads[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													new Date(leads[k].date_open).getMonth() + 1 == 6 &&
													leads[k].probability == 100
												) {
													if (
														leads[k].planned_revenue != '' &&
														leads[k].planned_revenue != undefined &&
														leads[k].planned_revenue != null
													) {
														june = june + leads[k].planned_revenue;
													}
												}
												if (
													leads[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													new Date(leads[k].date_open).getMonth() + 1 == 7 &&
													leads[k].probability == 100
												) {
													if (
														leads[k].planned_revenue != '' &&
														leads[k].planned_revenue != undefined &&
														leads[k].planned_revenue != null
													) {
														july = july + leads[k].planned_revenue;
													}
												}
												if (
													leads[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													new Date(leads[k].date_open).getMonth() + 1 == 8 &&
													leads[k].probability == 100
												) {
													if (
														leads[k].planned_revenue != '' &&
														leads[k].planned_revenue != undefined &&
														leads[k].planned_revenue != null
													) {
														august = august + leads[k].planned_revenue;
													}
												}
												if (
													leads[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													new Date(leads[k].date_open).getMonth() + 1 == 9 &&
													leads[k].probability == 100
												) {
													if (
														leads[k].planned_revenue != '' &&
														leads[k].planned_revenue != undefined &&
														leads[k].planned_revenue != null
													) {
														september = september + leads[k].planned_revenue;
													}
												}
												if (
													leads[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													new Date(leads[k].date_open).getMonth() + 1 == 10 &&
													leads[k].probability == 100
												) {
													if (
														leads[k].planned_revenue != '' &&
														leads[k].planned_revenue != undefined &&
														leads[k].planned_revenue != null
													) {
														october = october + leads[k].planned_revenue;
													}
												}
												if (
													leads[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													new Date(leads[k].date_open).getMonth() + 1 == 11 &&
													leads[k].probability == 100
												) {
													if (
														leads[k].planned_revenue != '' &&
														leads[k].planned_revenue != undefined &&
														leads[k].planned_revenue != null
													) {
														november = november + leads[k].planned_revenue;
													}
												}
												if (
													leads[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													new Date(leads[k].date_open).getMonth() + 1 == 12 &&
													leads[k].probability == 100
												) {
													if (
														leads[k].planned_revenue != '' &&
														leads[k].planned_revenue != undefined &&
														leads[k].planned_revenue != null
													) {
														december = december + leads[k].planned_revenue;
													}
												}
											}
										}

										userList.push({
											user: member,
											labels: [
												pop.month1,
												pop.month2,
												pop.month3,
												pop.month4,
												pop.month5,
												pop.month6,
												pop.month7,
												pop.month8,
												pop.month9,
												pop.month10,
												pop.month11,
												pop.month12
											],
											total:
												january +
												feabruary +
												march +
												april +
												may +
												june +
												july +
												august +
												september +
												october +
												november +
												december,
											color:
												'#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
											tabs: [
												january,
												feabruary,
												march,
												april,
												may,
												june,
												july,
												august,
												september,
												october,
												november,
												december
											]
										});
									}
								}
								var TMonth1 = 0,
									TMonth2 = 0,
									TMonth3 = 0,
									TMonth4 = 0,
									TMonth5 = 0,
									TMonth6 = 0,
									TMonth7 = 0,
									TMonth8 = 0,
									TMonth9 = 0,
									TMonth10 = 0,
									TMonth11 = 0,
									TMonth12 = 0;

								for (let k = 0; k < userList.length; k++) {
									TMonth1 = userList[k].tabs[0] + TMonth1;
									TMonth2 = userList[k].tabs[1] + TMonth2;
									TMonth3 = userList[k].tabs[2] + TMonth3;
									TMonth4 = userList[k].tabs[3] + TMonth4;
									TMonth5 = userList[k].tabs[4] + TMonth5;
									TMonth6 = userList[k].tabs[5] + TMonth6;
									TMonth7 = userList[k].tabs[6] + TMonth7;
									TMonth8 = userList[k].tabs[7] + TMonth8;
									TMonth9 = userList[k].tabs[8] + TMonth9;
									TMonth10 = userList[k].tabs[9] + TMonth10;
									TMonth11 = userList[k].tabs[10] + TMonth11;
									TMonth12 = userList[k].tabs[11] + TMonth12;
								}
								teamList.push({
									team: teams[l],
									labels: [
										pop.month1,
										pop.month2,
										pop.month3,
										pop.month4,
										pop.month5,
										pop.month6,
										pop.month7,
										pop.month8,
										pop.month9,
										pop.month10,
										pop.month11,
										pop.month12
									],
									tabs: [
										TMonth1,
										TMonth2,
										TMonth3,
										TMonth4,
										TMonth5,
										TMonth6,
										TMonth7,
										TMonth8,
										TMonth9,
										TMonth10,
										TMonth11,
										TMonth12
									],
									color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
									users: userList,
									total:
										TMonth1 +
										TMonth2 +
										TMonth3 +
										TMonth4 +
										TMonth5 +
										TMonth6 +
										TMonth7 +
										TMonth8 +
										TMonth9 +
										TMonth10 +
										TMonth11 +
										TMonth12
								});
							}
							var FMonth1 = 0,
								FMonth2 = 0,
								FMonth3 = 0,
								FMonth4 = 0,
								FMonth5 = 0,
								FMonth6 = 0,
								FMonth7 = 0,
								FMonth8 = 0,
								FMonth9 = 0,
								FMonth10 = 0,
								FMonth11 = 0,
								FMonth12 = 0;
							var allUsers = [];
							var allTeams = [];
							for (let k = 0; k < teamList.length; k++) {
								FMonth1 = FMonth1 + teamList[k].tabs[0];
								FMonth2 = FMonth2 + teamList[k].tabs[1];
								FMonth3 = FMonth3 + teamList[k].tabs[2];
								FMonth4 = FMonth4 + teamList[k].tabs[3];
								FMonth5 = FMonth5 + teamList[k].tabs[4];
								FMonth6 = FMonth6 + teamList[k].tabs[5];
								FMonth7 = FMonth7 + teamList[k].tabs[6];
								FMonth8 = FMonth8 + teamList[k].tabs[7];
								FMonth9 = FMonth9 + teamList[k].tabs[8];
								FMonth10 = FMonth10 + teamList[k].tabs[9];
								FMonth11 = FMonth11 + teamList[k].tabs[10];
								FMonth12 = FMonth12 + teamList[k].tabs[11];
								allTeams.push(teamList[k])
								allUsers = allUsers.concat(teamList[k].users);
							}
							finalTeamData = {
								labels: [
									pop.month1,
									pop.month2,
									pop.month3,
									pop.month4,
									pop.month5,
									pop.month6,
									pop.month7,
									pop.month8,
									pop.month9,
									pop.month10,
									pop.month11,
									pop.month12
								],
								color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
								users: allUsers,
								teams: allTeams,
								tabs: [
									FMonth1,
									FMonth2,
									FMonth3,
									FMonth4,
									FMonth5,
									FMonth6,
									FMonth7,
									FMonth8,
									FMonth9,
									FMonth10,
									FMonth11,
									FMonth12
								],
								label_txt: pop.label_ca
							};
							console.log('Team data ', finalTeamData)
							resolve(finalTeamData);
						}
					});
				});
			});
		});
	}

	getProdCa(prod, type, pop) {
		return new Promise((resolve, reject) => {
			this.isTable('_ona_team').then((tdata) => {
				this.isTable('_ona_vente').then((sdata) => {
					this.isTable('_ona_user').then((udata) => {
						let sales = JSON.parse(sdata);
						let teams = JSON.parse(tdata);
						let users = JSON.parse(udata);
						if (type == 'month') {
							let teamList = [];
							for (let l = 0; l < teams.length; l++) {
								let userList = [];
								for (let j = 0; j < teams[l].member_ids.length; j++) {
									var member = this.getMember(users, teams[l].member_ids[j]);
									let week1 = 0,
										week2 = 0,
										week3 = 0,
										week4 = 0;
									if (member != undefined) {
										for (let k = 0; k < sales.length; k++) {
											var yr = new Date().getFullYear();
											var month = new Date().getMonth();

											if (
												sales[k].user_id.id == member.id &&
												sales[k].product_id.id == prod.id &&
												member.sale_team_id.id == teams[l].id &&
												(new Date(sales[k].date_open) >= new Date(yr, month, 1) &&
													new Date(sales[k].date_open) <= new Date(yr, month, 7)) &&
												sales[k].state == 'sale'
											) {
												week1 = week1 + sales[k].amount_total;
											}
											if (
												sales[k].user_id.id == member.id &&
												member.sale_team_id.id == teams[l].id &&
												sales[k].product_id.id == prod.id &&
												(new Date(sales[k].date_open) >= new Date(yr, month, 8) &&
													new Date(sales[k].date_open) <= new Date(yr, month, 14)) &&
												sales[k].state == 'sale'
											) {
												week2 = week2 + sales[k].amount_total;
											}
											if (
												sales[k].user_id.id == member.id &&
												member.sale_team_id.id == teams[l].id &&
												sales[k].product_id.id == prod.id &&
												(new Date(sales[k].date_open) >= new Date(yr, month, 15) &&
													new Date(sales[k].date_open) <= new Date(yr, month, 21)) &&
												sales[k].state == 'sale'
											) {
												week3 = week3 + sales[k].amount_total;
											}
											if (
												sales[k].user_id.id == member.id &&
												member.sale_team_id.id == teams[l].id &&
												sales[k].product_id.id == prod.id &&
												(new Date(sales[k].date_open) >= new Date(yr, month, 21) &&
													new Date(sales[k].date_open) <= new Date(yr, month + 1, 0)) &&
												sales[k].state == 'sale'
											) {
												week4 = week4 + sales[k].amount_total;
											}
										}

										userList.push({
											user: member,
											labels: [ pop.week1, pop.week2, pop.week3, pop.week4 ],
											total: week1 + week2 + week3 + week4,
											color:
												'#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
											tabs: [ week1, week2, week3, week4 ]
										});
									}
								}
								var Tweek1 = 0,
									Tweek2 = 0,
									Tweek3 = 0,
									Tweek4 = 0;
								for (let k = 0; k < userList.length; k++) {
									Tweek1 = userList[k].tabs[0] + Tweek1;
									Tweek2 = userList[k].tabs[1] + Tweek2;
									Tweek3 = userList[k].tabs[2] + Tweek3;
									Tweek4 = userList[k].tabs[3] + Tweek4;
								}
								teamList.push({
									team: teams[l],
									labels: [ pop.week1, pop.week2, pop.week3, pop.week4 ],
									tabs: [ Tweek1, Tweek2, Tweek3, Tweek4 ],
									color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
									users: userList,
									total: Tweek1 + Tweek2 + Tweek3 + Tweek4
								});
							}
							resolve(teamList);
						} else if (type == 'year') {
							let teamList = [];
							for (let l = 0; l < teams.length; l++) {
								let userList = [];
								for (let j = 0; j < teams[l].member_ids.length; j++) {
									var member = this.getMember(users, teams[l].member_ids[j]);
									let january = 0;
									let feabruary = 0;
									let march = 0;
									let april = 0;
									let may = 0;
									let june = 0;
									let july = 0;
									let august = 0;
									let september = 0;
									let october = 0;
									let november = 0;
									let december = 0;
									if (member != undefined) {
										for (let k = 0; k < sales.length; k++) {
											var yr = new Date().getFullYear();
											var month = new Date().getMonth();

											if (
												new Date().getFullYear() == new Date(sales[k].date_open).getFullYear()
											) {
												if (
													sales[k].user_id.id == member.id &&
													sales[k].product_id.id == prod.id &&
													member.sale_team_id.id == teams[l].id &&
													new Date(sales[k].date_open).getMonth() + 1 == 1 &&
													sales[k].state == 'sale'
												) {
													january = january + sales[k].amount_total;
												}
												if (
													sales[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													sales[k].product_id.id == prod.id &&
													new Date(sales[k].date_open).getMonth() + 1 == 2 &&
													sales[k].state == 'sale'
												) {
													feabruary = feabruary + sales[k].amount_total;
												}
												if (
													sales[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													sales[k].product_id.id == prod.id &&
													new Date(sales[k].date_open).getMonth() + 1 == 3 &&
													sales[k].state == 'sale'
												) {
													march = march + sales[k].amount_total;
												}
												if (
													sales[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													sales[k].product_id.id == prod.id &&
													new Date(sales[k].date_open).getMonth() + 1 == 5 &&
													sales[k].state == 'sale'
												) {
													may = may + sales[k].amount_total;
												}
												if (
													sales[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													sales[k].product_id.id == prod.id &&
													new Date(sales[k].date_open).getMonth() + 1 == 6 &&
													sales[k].state == 'sale'
												) {
													june = june + sales[k].amount_total;
												}
												if (
													sales[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													sales[k].product_id.id == prod.id &&
													new Date(sales[k].date_open).getMonth() + 1 == 7 &&
													sales[k].state == 'sale'
												) {
													july = july + sales[k].amount_total;
												}
												if (
													sales[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													sales[k].product_id.id == prod.id &&
													new Date(sales[k].date_open).getMonth() + 1 == 8 &&
													sales[k].state == 'sale'
												) {
													august = august + sales[k].amount_total;
												}
												if (
													sales[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													sales[k].product_id.id == prod.id &&
													new Date(sales[k].date_open).getMonth() + 1 == 9 &&
													sales[k].state == 'sale'
												) {
													september = september + sales[k].amount_total;
												}
												if (
													sales[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													sales[k].product_id.id == prod.id &&
													new Date(sales[k].date_open).getMonth() + 1 == 10 &&
													sales[k].state == 'sale'
												) {
													october = october + sales[k].amount_total;
												}
												if (
													sales[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													sales[k].product_id.id == prod.id &&
													new Date(sales[k].date_open).getMonth() + 1 == 11 &&
													sales[k].state == 'sale'
												) {
													november = november + sales[k].amount_total;
												}
												if (
													sales[k].user_id.id == member.id &&
													member.sale_team_id.id == teams[l].id &&
													sales[k].product_id.id == prod.id &&
													new Date(sales[k].date_open).getMonth() + 1 == 12 &&
													sales[k].state == 'sale'
												) {
													december = december + sales[k].amount_total;
												}
											}
										}

										userList.push({
											user: member,
											labels: [
												pop.month1,
												pop.month2,
												pop.month3,
												pop.month4,
												pop.month5,
												pop.month6,
												pop.month7,
												pop.month8,
												pop.month9,
												pop.month10,
												pop.month11,
												pop.month12
											],
											total:
												january +
												feabruary +
												march +
												april +
												may +
												june +
												july +
												august +
												september +
												october +
												november +
												december,
											color:
												'#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
											tabs: [
												january,
												feabruary,
												march,
												april,
												may,
												june,
												july,
												august,
												september,
												october,
												november,
												december
											]
										});
									}
								}
								var TMonth1 = 0,
									TMonth2 = 0,
									TMonth3 = 0,
									TMonth4 = 0,
									TMonth5 = 0,
									TMonth6 = 0,
									TMonth7 = 0,
									TMonth8 = 0,
									TMonth9 = 0,
									TMonth10 = 0,
									TMonth11 = 0,
									TMonth12 = 0;

								for (let k = 0; k < userList.length; k++) {
									TMonth1 = userList[k].tabs[0] + TMonth1;
									TMonth2 = userList[k].tabs[1] + TMonth2;
									TMonth3 = userList[k].tabs[2] + TMonth3;
									TMonth4 = userList[k].tabs[3] + TMonth4;
									TMonth5 = userList[k].tabs[4] + TMonth5;
									TMonth6 = userList[k].tabs[5] + TMonth6;
									TMonth7 = userList[k].tabs[6] + TMonth7;
									TMonth8 = userList[k].tabs[7] + TMonth8;
									TMonth9 = userList[k].tabs[8] + TMonth9;
									TMonth10 = userList[k].tabs[9] + TMonth10;
									TMonth11 = userList[k].tabs[10] + TMonth11;
									TMonth12 = userList[k].tabs[11] + TMonth12;
								}
								teamList.push({
									team: teams[l],
									labels: [
										pop.month1,
										pop.month2,
										pop.month3,
										pop.month4,
										pop.month5,
										pop.month6,
										pop.month7,
										pop.month8,
										pop.month9,
										pop.month10,
										pop.month11,
										pop.month12
									],
									tabs: [
										TMonth1,
										TMonth2,
										TMonth3,
										TMonth4,
										TMonth5,
										TMonth6,
										TMonth7,
										TMonth8,
										TMonth9,
										TMonth10,
										TMonth11,
										TMonth12
									],
									color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
									users: userList,
									total:
										TMonth1 +
										TMonth2 +
										TMonth3 +
										TMonth4 +
										TMonth5 +
										TMonth6 +
										TMonth7 +
										TMonth8 +
										TMonth9 +
										TMonth10 +
										TMonth11 +
										TMonth12
								});
							}
							resolve(teamList);
						}
					});
				});
			});
		});
	}

	getStockEvol(prod, lines: Array<any>, type, pop, order_lines: Array<any>) {
		let result = [];
		if (type == 'week') {
			var current = new Date();
			var first = new Date().getDate() - new Date().getDay();
			let day1 = 0,
				day2 = 0,
				day3 = 0,
				day4 = 0,
				day5 = 0,
				day6 = 0,
				day7 = 0;
			let vday1 = 0,
				vday2 = 0,
				vday3 = 0,
				vday4 = 0,
				vday5 = 0,
				vday6 = 0,
				vday7 = 0;
			for (let i = 0; i < lines.length; i++) {
				let currentLine = lines[i];
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.date_planned) == new Date(current.setDate(first))
				) {
					day1 = day1 + currentLine.product_qty;
				}
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.date_planned) == new Date(current.setDate(first + 1))
				) {
					day2 = day2 + currentLine.product_qty;
				}
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.date_planned) == new Date(current.setDate(first + 2))
				) {
					day3 = day3 + currentLine.product_qty;
				}
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.date_planned) == new Date(current.setDate(first + 3))
				) {
					day4 = day4 + currentLine.product_qty;
				}
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.date_planned) == new Date(current.setDate(first + 4))
				) {
					day5 = day5 + currentLine.product_qty;
				}
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.date_planned) == new Date(current.setDate(first + 5))
				) {
					day6 = day6 + currentLine.product_qty;
				}
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.date_planned) == new Date(current.setDate(first + 6))
				) {
					day7 = day7 + currentLine.product_qty;
				}
			}
			for (let i = 0; i < order_lines.length; i++) {
				let currentLine = order_lines[i];
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.create_date) == new Date(current.setDate(first))
				) {
					vday1 = vday1 + currentLine.product_qty;
				}
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.create_date) == new Date(current.setDate(first + 1))
				) {
					vday2 = vday2 + currentLine.product_qty;
				}
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.create_date) == new Date(current.setDate(first + 2))
				) {
					vday3 = vday3 + currentLine.product_qty;
				}
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.create_date) == new Date(current.setDate(first + 3))
				) {
					vday4 = vday4 + currentLine.product_qty;
				}
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.create_date) == new Date(current.setDate(first + 4))
				) {
					vday5 = vday5 + currentLine.product_qty;
				}
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.create_date) == new Date(current.setDate(first + 5))
				) {
					vday6 = vday6 + currentLine.product_qty;
				}
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.create_date) == new Date(current.setDate(first + 6))
				) {
					vday7 = vday7 + currentLine.product_qty;
				}
			}
			result.push({
				labels: [ pop.day1, pop.day2, pop.day3, pop.day4, pop.day5, pop.day6, pop.day7 ],
				days: [ day1, day2, day3, day4, day5, day6, day7 ],
				color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
				label_txt: pop.label_week
			});
			result.push({
				labels: [ pop.day1, pop.day2, pop.day3, pop.day4, pop.day5, pop.day6, pop.day7 ],
				days: [ vday1, vday2, vday3, vday4, vday5, vday6, vday7 ],
				color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
				label_txt: pop.label_week_out
			});
			return result;
		}
		if (type == 'month') {
			var yr = new Date().getFullYear();
			var month = new Date().getMonth();
			let week1 = 0,
				week2 = 0,
				week3 = 0,
				week4 = 0;
			let vweek1 = 0,
				vweek2 = 0,
				vweek3 = 0,
				vweek4 = 0;

			for (let k = 0; k < lines.length; k++) {
				let currentLine = lines[k];
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.date_planned) >= new Date(yr, month, 1) &&
					new Date(currentLine.date_planned) <= new Date(yr, month, 7)
				) {
					week1 = week1 + currentLine.product_qty;
				}
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.date_planned) >= new Date(yr, month, 8) &&
					new Date(currentLine.date_planned) <= new Date(yr, month, 14)
				) {
					week2 = week2 + currentLine.product_qty;
				}
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.date_planned) >= new Date(yr, month, 15) &&
					new Date(currentLine.date_planned) <= new Date(yr, month, 21)
				) {
					week3 = week3 + currentLine.product_qty;
				}
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.date_planned) >= new Date(yr, month, 21) &&
					new Date(currentLine.date_planned) <= new Date(yr, month + 1, 0)
				) {
					week4 = week4 + currentLine.product_qty;
				}
			}
			for (let k = 0; k < order_lines.length; k++) {
				let currentLine = order_lines[k];
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.create_date) >= new Date(yr, month, 1) &&
					new Date(currentLine.create_date) <= new Date(yr, month, 7)
				) {
					vweek1 = vweek1 + currentLine.product_qty;
				}
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.create_date) >= new Date(yr, month, 8) &&
					new Date(currentLine.create_date) <= new Date(yr, month, 14)
				) {
					vweek2 = vweek2 + currentLine.product_qty;
				}
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.create_date) >= new Date(yr, month, 15) &&
					new Date(currentLine.create_date) <= new Date(yr, month, 21)
				) {
					vweek3 = vweek3 + currentLine.product_qty;
				}
				if (
					prod.id == currentLine.product_id.id &&
					new Date(currentLine.create_date) >= new Date(yr, month, 21) &&
					new Date(currentLine.create_date) <= new Date(yr, month + 1, 0)
				) {
					vweek4 = vweek4 + currentLine.product_qty;
				}
			}
			result.push({
				labels: [ pop.week1, pop.week2, pop.week3, pop.week4 ],
				days: [ week1, week2, week3, week4 ],
				color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
				label_txt: pop.label_week
			});
			result.push({
				labels: [ pop.week1, pop.week2, pop.week3, pop.week4 ],
				days: [ vweek1, vweek2, vweek3, vweek4 ],
				color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
				label_txt: pop.label_week_out
			});
			return result;
		}
		if (type == 'year') {
			let january = 0;
			let feabruary = 0;
			let march = 0;
			let april = 0;
			let may = 0;
			let june = 0;
			let july = 0;
			let august = 0;
			let september = 0;
			let october = 0;
			let november = 0;
			let december = 0;
			let vjanuary = 0;
			let vfeabruary = 0;
			let vmarch = 0;
			let vapril = 0;
			let vmay = 0;
			let vjune = 0;
			let vjuly = 0;
			let vaugust = 0;
			let vseptember = 0;
			let voctober = 0;
			let vnovember = 0;
			let vdecember = 0;

			for (let l = 0; l < lines.length; l++) {
				let currentLine = lines[l];
				if (new Date(currentLine.date_planned).getFullYear() == new Date().getFullYear()) {
					if (
						prod.id == currentLine.product_id.id &&
						new Date(currentLine.date_planned).getMonth() + 1 == 1
					) {
						january = january + currentLine.product_qty;
					}
					if (
						prod.id == currentLine.product_id.id &&
						new Date(currentLine.date_planned).getMonth() + 1 == 2
					) {
						feabruary = feabruary + currentLine.product_qty;
					}
					if (
						prod.id == currentLine.product_id.id &&
						new Date(currentLine.date_planned).getMonth() + 1 == 3
					) {
						march = march + currentLine.product_qty;
					}
					if (
						prod.id == currentLine.product_id.id &&
						new Date(currentLine.date_planned).getMonth() + 1 == 4
					) {
						april = april + currentLine.product_qty;
					}
					if (
						prod.id == currentLine.product_id.id &&
						new Date(currentLine.date_planned).getMonth() + 1 == 5
					) {
						may = may + currentLine.product_qty;
					}
					if (
						prod.id == currentLine.product_id.id &&
						new Date(currentLine.date_planned).getMonth() + 1 == 6
					) {
						june = june + currentLine.product_qty;
					}
					if (
						prod.id == currentLine.product_id.id &&
						new Date(currentLine.date_planned).getMonth() + 1 == 7
					) {
						july = july + currentLine.product_qty;
					}
					if (
						prod.id == currentLine.product_id.id &&
						new Date(currentLine.date_planned).getMonth() + 1 == 8
					) {
						august = august + currentLine.product_qty;
					}
					if (
						prod.id == currentLine.product_id.id &&
						new Date(currentLine.date_planned).getMonth() + 1 == 9
					) {
						september = september + currentLine.product_qty;
					}
					if (
						prod.id == currentLine.product_id.id &&
						new Date(currentLine.date_planned).getMonth() + 1 == 10
					) {
						october = october + currentLine.product_qty;
					}
					if (
						prod.id == currentLine.product_id.id &&
						new Date(currentLine.date_planned).getMonth() + 1 == 11
					) {
						november = november + currentLine.product_qty;
					}
					if (
						prod.id == currentLine.product_id.id &&
						new Date(currentLine.date_planned).getMonth() + 1 == 12
					) {
						december = december + currentLine.product_qty;
					}
				}
			}
			for (let l = 0; l < order_lines.length; l++) {
				let currentLine = order_lines[l];
				if (new Date(currentLine.create_date).getFullYear() == new Date().getFullYear()) {
					if (prod.id == currentLine.product_id.id && new Date(currentLine.create_date).getMonth() + 1 == 1) {
						vjanuary = vjanuary + currentLine.product_qty;
					}
					if (prod.id == currentLine.product_id.id && new Date(currentLine.create_date).getMonth() + 1 == 2) {
						vfeabruary = vfeabruary + currentLine.product_qty;
					}
					if (prod.id == currentLine.product_id.id && new Date(currentLine.create_date).getMonth() + 1 == 3) {
						vmarch = vmarch + currentLine.product_qty;
					}
					if (prod.id == currentLine.product_id.id && new Date(currentLine.create_date).getMonth() + 1 == 4) {
						vapril = vapril + currentLine.product_qty;
					}
					if (prod.id == currentLine.product_id.id && new Date(currentLine.create_date).getMonth() + 1 == 5) {
						vmay = vmay + currentLine.product_qty;
					}
					if (prod.id == currentLine.product_id.id && new Date(currentLine.create_date).getMonth() + 1 == 6) {
						vjune = vjune + currentLine.product_qty;
					}
					if (prod.id == currentLine.product_id.id && new Date(currentLine.create_date).getMonth() + 1 == 7) {
						vjuly = vjuly + currentLine.product_qty;
					}
					if (prod.id == currentLine.product_id.id && new Date(currentLine.create_date).getMonth() + 1 == 8) {
						vaugust = vaugust + currentLine.product_qty;
					}
					if (prod.id == currentLine.product_id.id && new Date(currentLine.create_date).getMonth() + 1 == 9) {
						vseptember = vseptember + currentLine.product_qty;
					}
					if (
						prod.id == currentLine.product_id.id &&
						new Date(currentLine.create_date).getMonth() + 1 == 10
					) {
						voctober = voctober + currentLine.product_qty;
					}
					if (
						prod.id == currentLine.product_id.id &&
						new Date(currentLine.create_date).getMonth() + 1 == 11
					) {
						vnovember = vnovember + currentLine.product_qty;
					}
					if (
						prod.id == currentLine.product_id.id &&
						new Date(currentLine.create_date).getMonth() + 1 == 12
					) {
						vdecember = vdecember + currentLine.product_qty;
					}
				}
			}
			result.push({
				labels: [
					pop.month1,
					pop.month2,
					pop.month3,
					pop.month4,
					pop.month5,
					pop.month6,
					pop.month7,
					pop.month8,
					pop.month9,
					pop.month10,
					pop.month11,
					pop.month12
				],
				days: [
					january,
					feabruary,
					march,
					april,
					may,
					june,
					july,
					august,
					september,
					october,
					november,
					december
				],
				color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
				label_txt: pop.label_week
			});
			result.push({
				labels: [
					pop.month1,
					pop.month2,
					pop.month3,
					pop.month4,
					pop.month5,
					pop.month6,
					pop.month7,
					pop.month8,
					pop.month9,
					pop.month10,
					pop.month11,
					pop.month12
				],
				days: [
					vjanuary,
					vfeabruary,
					vmarch,
					vapril,
					vmay,
					vjune,
					vjuly,
					vaugust,
					vseptember,
					voctober,
					vnovember,
					vdecember
				],
				color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
				label_txt: pop.label_week_out
			});
			return result;
		}
	}

	getOpportsByRegion(region: String, users: Array<any>, leads: Array<any>, teams: Array<any>) {
		return new Promise((resolve, reject) => {
			let teamList = [];
			for (let l = 0; l < teams.length; l++) {
				let userList = [];
				for (let j = 0; j < teams[l].member_ids.length; j++) {
					var member = this.getMember(users, teams[l].member_ids[j]);
					let week1 = 0,
						week2 = 0,
						week3 = 0,
						week4 = 0;
					if (member != undefined) {
						for (let k = 0; k < leads.length; k++) {
							var yr = new Date().getFullYear();
							var month = new Date().getMonth();

							if (
								leads[k].user_id.id == member.id &&
								member.sale_team_id.id == teams[l].id &&
								member.city == region &&
								(new Date(leads[k].date_open) >= new Date(yr, month, 1) &&
									new Date(leads[k].date_open) <= new Date(yr, month, 7)) &&
								leads[k].probability == 100
							) {
								if (
									leads[k].planned_revenue != '' &&
									leads[k].planned_revenue != undefined &&
									leads[k].planned_revenue != null
								) {
									week1 = week1 + leads[k].planned_revenue;
								}
							}
							if (
								leads[k].user_id.id == member.id &&
								member.city == region &&
								member.sale_team_id.id == teams[l].id &&
								(new Date(leads[k].date_open) >= new Date(yr, month, 8) &&
									new Date(leads[k].date_open) <= new Date(yr, month, 14)) &&
								leads[k].probability == 100
							) {
								if (
									leads[k].planned_revenue != '' &&
									leads[k].planned_revenue != undefined &&
									leads[k].planned_revenue != null
								) {
									week2 = week2 + leads[k].planned_revenue;
								}
							}
							if (
								leads[k].user_id.id == member.id &&
								member.city == region &&
								member.sale_team_id.id == teams[l].id &&
								(new Date(leads[k].date_open) >= new Date(yr, month, 15) &&
									new Date(leads[k].date_open) <= new Date(yr, month, 21)) &&
								leads[k].probability == 100
							) {
								if (
									leads[k].planned_revenue != '' &&
									leads[k].planned_revenue != undefined &&
									leads[k].planned_revenue != null
								) {
									week3 = week3 + leads[k].planned_revenue;
								}
							}
							if (
								leads[k].user_id.id == member.id &&
								member.city == region &&
								member.sale_team_id.id == teams[l].id &&
								(new Date(leads[k].date_open) >= new Date(yr, month, 21) &&
									new Date(leads[k].date_open) <= new Date(yr, month + 1, 0)) &&
								leads[k].stage_id.probability == 100
							) {
								if (
									leads[k].planned_revenue != '' &&
									leads[k].planned_revenue != undefined &&
									leads[k].planned_revenue != null
								) {
									week4 = week4 + leads[k].planned_revenue;
								}
							}
						}

						userList.push({
							user: member,
							total: week1 + week2 + week3 + week4,
							color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
							tabs: [ week1, week2, week3, week4 ]
						});
					}
				}
				var Tweek1 = 0,
					Tweek2 = 0,
					Tweek3 = 0,
					Tweek4 = 0;
				for (let k = 0; k < userList.length; k++) {
					Tweek1 = userList[k].tabs[0] + Tweek1;
					Tweek2 = userList[k].tabs[1] + Tweek2;
					Tweek3 = userList[k].tabs[2] + Tweek3;
					Tweek4 = userList[k].tabs[3] + Tweek4;
				}
				teamList.push({
					team: teams[l],
					tabs: [ Tweek1, Tweek2, Tweek3, Tweek4 ],
					color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
					users: userList,
					total: Tweek1 + Tweek2 + Tweek3 + Tweek4
				});
			}
			resolve(teamList);
		});
	}

	getMonthsOpportsTeams(lineCanvas, pop) {
		return new Promise((resolve, reject) => {
			this.isTable('_ona_leads').then((leads) => {
				// console.log('Leads =>', JSON.parse(leads));
				this.isTable('_ona_team').then((res) => {
					let results = [];
					let Tresults;

					if (res) {
						let teams = JSON.parse(res);

						if (leads) {
							// console.log("ready for graph");
							let list_leads = JSON.parse(leads);
							for (let j = 0; j < teams.length; j++) {
								let january = 0;
								let feabruary = 0;
								let march = 0;
								let april = 0;
								let may = 0;
								let june = 0;
								let july = 0;
								let august = 0;
								let september = 0;
								let october = 0;
								let november = 0;
								let december = 0;
								// const element = teams[j];

								for (let k = 0; k < list_leads.length; k++) {
									var yr = new Date().getFullYear();
									var month = new Date().getMonth();

									if (yr == new Date(list_leads[k].date_open).getFullYear()) {
										if (
											list_leads[k].team_id.id == teams[j].id &&
											new Date(list_leads[k].date_open).getMonth() + 1 == 1 &&
											list_leads[k].probability == 100
										) {
											if (
												list_leads[k].planned_revenue != '' &&
												list_leads[k].planned_revenue != undefined &&
												list_leads[k].planned_revenue != null
											) {
												january = january + list_leads[k].planned_revenue;
											}
										}
										if (
											list_leads[k].team_id.id == teams[j].id &&
											new Date(list_leads[k].date_open).getMonth() + 1 == 2 &&
											list_leads[k].probability == 100
										) {
											if (
												list_leads[k].planned_revenue != '' &&
												list_leads[k].planned_revenue != undefined &&
												list_leads[k].planned_revenue != null
											) {
												feabruary = feabruary + list_leads[k].planned_revenue;
											}
										}
										if (
											list_leads[k].team_id.id == teams[j].id &&
											new Date(list_leads[k].date_open).getMonth() + 1 == 3 &&
											list_leads[k].probability == 100
										) {
											if (
												list_leads[k].planned_revenue != '' &&
												list_leads[k].planned_revenue != undefined &&
												list_leads[k].planned_revenue != null
											) {
												march = march + list_leads[k].planned_revenue;
											}
										}
										if (
											list_leads[k].team_id.id == teams[j].id &&
											new Date(list_leads[k].date_open).getMonth() + 1 == 4 &&
											list_leads[k].probability == 100
										) {
											if (
												list_leads[k].planned_revenue != '' &&
												list_leads[k].planned_revenue != undefined &&
												list_leads[k].planned_revenue != null
											) {
												april = april + list_leads[k].planned_revenue;
											}
										}
										if (
											list_leads[k].team_id.id == teams[j].id &&
											new Date(list_leads[k].date_open).getMonth() + 1 == 5 &&
											list_leads[k].probability == 100
										) {
											if (
												list_leads[k].planned_revenue != '' &&
												list_leads[k].planned_revenue != undefined &&
												list_leads[k].planned_revenue != null
											) {
												may = may + list_leads[k].planned_revenue;
											}
										}
										if (
											list_leads[k].team_id.id == teams[j].id &&
											new Date(list_leads[k].date_open).getMonth() + 1 == 6 &&
											list_leads[k].probability == 100
										) {
											if (
												list_leads[k].planned_revenue != '' &&
												list_leads[k].planned_revenue != undefined &&
												list_leads[k].planned_revenue != null
											) {
												june = june + list_leads[k].planned_revenue;
											}
										}
										if (
											list_leads[k].team_id.id == teams[j].id &&
											new Date(list_leads[k].date_open).getMonth() + 1 == 7 &&
											list_leads[k].probability == 100
										) {
											if (
												list_leads[k].planned_revenue != '' &&
												list_leads[k].planned_revenue != undefined &&
												list_leads[k].planned_revenue != null
											) {
												july = july + list_leads[k].planned_revenue;
											}
										}
										if (
											list_leads[k].team_id.id == teams[j].id &&
											new Date(list_leads[k].date_open).getMonth() + 1 == 8 &&
											list_leads[k].probability == 100
										) {
											if (
												list_leads[k].planned_revenue != '' &&
												list_leads[k].planned_revenue != undefined &&
												list_leads[k].planned_revenue != null
											) {
												august = august + list_leads[k].planned_revenue;
											}
										}
										if (
											list_leads[k].team_id.id == teams[j].id &&
											new Date(list_leads[k].date_open).getMonth() + 1 == 9 &&
											list_leads[k].probability == 100
										) {
											if (
												list_leads[k].planned_revenue != '' &&
												list_leads[k].planned_revenue != undefined &&
												list_leads[k].planned_revenue != null
											) {
												september = september + list_leads[k].planned_revenue;
											}
										}
										if (
											list_leads[k].team_id.id == teams[j].id &&
											new Date(list_leads[k].date_open).getMonth() + 1 == 10 &&
											list_leads[k].probability == 100
										) {
											if (
												list_leads[k].planned_revenue != '' &&
												list_leads[k].planned_revenue != undefined &&
												list_leads[k].planned_revenue != null
											) {
												october = october + list_leads[k].planned_revenue;
											}
										}
										if (
											list_leads[k].team_id.id == teams[j].id &&
											new Date(list_leads[k].date_open).getMonth() + 1 == 11 &&
											list_leads[k].probability == 100
										) {
											if (
												list_leads[k].planned_revenue != '' &&
												list_leads[k].planned_revenue != undefined &&
												list_leads[k].planned_revenue != null
											) {
												november = november + list_leads[k].planned_revenue;
											}
										}
										if (
											list_leads[k].team_id.id == teams[j].id &&
											new Date(list_leads[k].date_open).getMonth() + 1 == 12 &&
											list_leads[k].probability == 100
										) {
											if (
												list_leads[k].planned_revenue != '' &&
												list_leads[k].planned_revenue != undefined &&
												list_leads[k].planned_revenue != null
											) {
												december = december + list_leads[k].planned_revenue;
											}
										}
									}
								}

								results.push({
									nom: teams[j].name,
									color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
									tabs: [
										january,
										feabruary,
										march,
										april,
										may,
										june,
										july,
										august,
										september,
										october,
										november,
										december
									]
								});
							}
							let Tjanuary = 0;
							let Tfeabruary = 0;
							let Tmarch = 0;
							let Tapril = 0;
							let Tmay = 0;
							let Tjune = 0;
							let Tjuly = 0;
							let Taugust = 0;
							let Tseptember = 0;
							let Toctober = 0;
							let Tnovember = 0;
							let Tdecember = 0;
							for (let k = 0; k < results.length; k++) {
								Tjanuary = results[k].tabs[0] + Tjanuary;
								Tfeabruary = results[k].tabs[1] + Tfeabruary;
								Tmarch = results[k].tabs[2] + Tmarch;
								Tapril = results[k].tabs[3] + Tapril;
								Tmay = results[k].tabs[4] + Tmay;
								Tjune = results[k].tabs[5] + Tjune;
								Tjuly = results[k].tabs[6] + Tjuly;
								Taugust = results[k].tabs[7] + Taugust;
								Tseptember = results[k].tabs[8] + Tseptember;
								Toctober = results[k].tabs[9] + Toctober;
								Tnovember = results[k].tabs[10] + Tnovember;
								Tdecember = results[k].tabs[11] + Tdecember;
							}
							Tresults = {
								results: results,
								labels: [
									pop.month1,
									pop.month2,
									pop.month3,
									pop.month4,
									pop.month5,
									pop.month6,
									pop.month7,
									pop.month8,
									pop.month9,
									pop.month10,
									pop.month11,
									pop.month12
								],
								days: [
									Tjanuary,
									Tfeabruary,
									Tmarch,
									Tapril,
									Tmay,
									Tjune,
									Tjuly,
									Taugust,
									Tseptember,
									Toctober,
									Tnovember,
									Tdecember
								],
								color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
								label_txt: pop.label_week_out
							};
						}
					}

					//Chargement du graphe sur les prospects
					resolve(Tresults);
				});
			});
		});
	}

	/**
	 * Cette méthode permet d'afficher les graphes en fonction des équipes
	 * de ventes
	 * 
	 * @param lineCanvas Canvas, l'objet qui va recevoir les charts (teams)
	 * @param pop any, la traduction
	 */
	getWeekOpportsTeams(lineCanvas, pop) {
		return new Promise((resolve, reject) => {
			this.isTable('_ona_leads').then((leads) => {
				// console.log('Leads =>', JSON.parse(leads));
				this.isTable('_ona_team').then((res) => {
					let results = [];
					let Tresults;

					if (res) {
						let teams = JSON.parse(res);

						if (leads) {
							// console.log("ready for graph");
							let list_leads = JSON.parse(leads);
							for (let j = 0; j < teams.length; j++) {
								let week1 = 0,
									week2 = 0,
									week3 = 0,
									week4 = 0;
								// const element = teams[j];

								for (let k = 0; k < list_leads.length; k++) {
									var yr = new Date().getFullYear();
									var month = new Date().getMonth();

									if (yr == new Date(list_leads[k].date_open).getFullYear()) {
										if (
											list_leads[k].team_id.id == teams[j].id &&
											(new Date(list_leads[k].date_open) >= new Date(yr, month, 1) &&
												new Date(list_leads[k].date_open) <= new Date(yr, month, 7)) &&
											list_leads[k].probability == 100
										) {
											if (
												list_leads[k].planned_revenue != '' &&
												list_leads[k].planned_revenue != undefined &&
												list_leads[k].planned_revenue != null
											) {
												week1 = week1 + list_leads[k].planned_revenue;
											}
										}
										if (
											list_leads[k].team_id.id == teams[j].id &&
											(new Date(list_leads[k].date_open) >= new Date(yr, month, 8) &&
												new Date(list_leads[k].date_open) <= new Date(yr, month, 14)) &&
											list_leads[k].probability == 100
										) {
											if (
												list_leads[k].planned_revenue != '' &&
												list_leads[k].planned_revenue != undefined &&
												list_leads[k].planned_revenue != null
											) {
												week2 = week2 + list_leads[k].planned_revenue;
											}
										}
										if (
											list_leads[k].team_id.id == teams[j].id &&
											(new Date(list_leads[k].date_open) >= new Date(yr, month, 15) &&
												new Date(list_leads[k].date_open) <= new Date(yr, month, 21)) &&
											list_leads[k].probability == 100
										) {
											if (
												list_leads[k].planned_revenue != '' &&
												list_leads[k].planned_revenue != undefined &&
												list_leads[k].planned_revenue != null
											) {
												week3 = week3 + list_leads[k].planned_revenue;
											}
										}
										if (
											list_leads[k].team_id.id == teams[j].id &&
											(new Date(list_leads[k].date_open) >= new Date(yr, month, 21) &&
												new Date(list_leads[k].date_open) <= new Date(yr, month + 1, 0)) &&
											list_leads[k].stage_id.probability == 100
										) {
											if (
												list_leads[k].planned_revenue != '' &&
												list_leads[k].planned_revenue != undefined &&
												list_leads[k].planned_revenue != null
											) {
												week4 = week4 + list_leads[k].planned_revenue;
											}
										}
									}
								}

								results.push({
									nom: teams[j].name,
									color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
									tabs: [ week1, week2, week3, week4 ]
								});
							}
							var Tweek1 = 0,
								Tweek2 = 0,
								Tweek3 = 0,
								Tweek4 = 0;
							for (let k = 0; k < results.length; k++) {
								Tweek1 = results[k].tabs[0] + Tweek1;
								Tweek2 = results[k].tabs[1] + Tweek2;
								Tweek3 = results[k].tabs[2] + Tweek3;
								Tweek4 = results[k].tabs[3] + Tweek4;
							}
							Tresults = {
								results: results,
								nom: 'Total CA',
								color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
								tabs: [ Tweek1, Tweek2, Tweek3, Tweek4 ]
							};
						}
					}

					console.log(results);
					console.log(Tresults);
					//Chargement du graphe sur les prospects
					resolve(Tresults);
				});
			});
		});
	}
}
