import { Component } from '@angular/core';
import { NavParams, ViewController, IonicPage } from 'ionic-angular';
import { ConfigImg, ConfigOnglet } from '../../config';

@IonicPage()
@Component({
	selector: 'page-pop-over',
	templateUrl: 'pop-over.html',
})
export class PopOverPage {
	is_channel: boolean;
	txtPop: any;
	is_client: boolean = false;
	public objet: any;
	public menus: any;
	public defaultImage;
	public is_task;
	public task;
	public is_agenda = false;
	public is_pipeline = false;
	public is_product: boolean = false;

	constructor(public navParams: NavParams, public viewCtrl: ViewController) {
		this.defaultImage = ConfigImg.defaultImg;
		this.txtPop = this.navParams.get('lang');

		if (
			this.navParams.get('task') === undefined &&
			this.navParams.get('agenda') === undefined &&
			this.navParams.get('pipeline') === undefined &&
			this.navParams.get('client') === undefined  && 
			this.navParams.get('product') === undefined &&
			this.navParams.get('channel')===undefined
		) {
			this.is_task = false;
			this.objet = this.navParams.get('menus');
			this.menus = this.loadMenu();
		} else if (this.navParams.get('agenda') !== undefined) {
			this.is_agenda = true;
			this.is_task = false;
			this.objet = this.navParams.get('menus');
			this.menus = ConfigOnglet.loadOngletsAgenda(this.objet.active, this.txtPop);
		} else if (this.navParams.get('pipeline') !== undefined) {
			this.is_pipeline = true;
			this.objet = this.navParams.get('menus');
			this.menus = ConfigOnglet.loadOngletsPipe(this.objet.active, this.txtPop);
		} else if (this.navParams.get('client') !== undefined) {
			//this.is_pipeline = true;
			this.is_client = true;
			this.objet = this.navParams.get('menus');
			// this.menus = ConfigOnglet.loadOngletsClient(this.objet.active);
		}else if(this.navParams.get('channel')!==undefined){
			this.is_channel = true; 
			this.is_task = false;
			this.menus = this.navParams.get('objet');
			console.log(this.menus);
		}else if (this.navParams.get('product') !== undefined) {
			// console.log('Product onglets loading');
			//this.is_pipeline = true;
			this.is_product = true;
			this.objet = this.navParams.get('menus');
			this.menus = ConfigOnglet.loadOngletsProducts(this.objet.active, this.txtPop);
		} else {
			this.is_task = true;
			this.task = this.navParams.get('task');
			this.menus = this.listActionsOfTask();
		}
	}

	openDetails(item) {
		this.viewCtrl.dismiss(item);
	}

	//sélectionner l'action du menu contextuel (Task)
	openAction(item) {
		this.viewCtrl.dismiss(item);
	}

	loadMenu() {
		return ConfigOnglet.loadOnglets(this.objet.active, this.txtPop);
	}

	private listActionsOfTask() {
		return ConfigOnglet.loadActions();
	}
}
