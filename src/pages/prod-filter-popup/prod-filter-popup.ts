import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { ConfigOnglet } from '../../config';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ProdFilterPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-prod-filter-popup',
	templateUrl: 'prod-filter-popup.html'
})
export class ProdFilterPopupPage {
	sales_count = false;
	qty_available = false;
	archived = false;
	to_sale = false;
	model: any;
	radioForm: FormGroup;
	checkboxTagsForm: FormGroup;
	rangeForm: FormGroup;
	currency: any;
	type;
	price;
	filters: any;
	filterArray = [];
	slided: boolean = false;
	subscription: any;
	states = [];
	draft = false;
	open = false;
	pending = false;
	closed = false;
	canceled = false;
	will_expire = false;
	expired = false;
	txtpop: any;
	upperRange;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public vc: ViewController,
		public storage: Storage
	) {
		this.model = this.navParams.get('model');
		this.currency = this.navParams.get('currency');
		this.txtpop = this.navParams.get('lang');
		this.subscription = this.navParams.get('sub');
		console.log('Model : ', this.model);
		console.log('Currency : ', this.currency);
		this.radioForm = new FormGroup({
			selected_option: new FormControl('consu')
		});
		this.storage.get('ona_prix_filtre').then((prix) => {
			if (prix) {
				this.upperRange = prix;
			} else {
				this.upperRange = 1000000;
				storage.set('ona_prix_filtre', this.upperRange);
			}
		});

		this.states = ConfigOnglet.subInvoice(this.txtpop);
		this.rangeForm = new FormGroup({
			single: new FormControl(25),
			dual: new FormControl({ lower: 0, upper: 1000000 })
		});

		this.checkboxTagsForm = new FormGroup({});
	}

	ionViewDidLoad() {}

	rangeChange() {
		console.log('Price Range : ', this.price);
		this.slided = true;
	}

	typeSelected() {
		console.log('Type Selected : ', this.type);
	}

	to_saleSelecetd() {
		console.log('To Sale Selected : ', this.to_sale);
	}
	archivedSelecetd() {
		console.log('Archived Selected : ', this.archived);
	}
	qty_Selecetd() {
		console.log('Quantity Selected : ', this.qty_available);
	}
	sales_countSelecetd() {
		console.log('Sales Count Selected : ', this.sales_count);
	}

	close() {
		this.vc.dismiss();
	}

	filter() {
		this.filters = {
			price: this.price,
			type: this.type,
			to_sale: this.to_sale,
			archived: this.archived,
			qty_Selecetd: this.qty_available,
			sales_count: this.sales_count
		};
		var filtersArray = [];

		if (this.type != undefined) {
			filtersArray.push({ name: 'type', slug: this.type, title: this.type });
		}
		if (this.price != undefined) {
			filtersArray.push({ name: 'price', slug: this.price, title: 'Prix' });
		}
		if (this.to_sale == true) {
			filtersArray.push({ name: 'to_sale', slug: true, title: 'Peut etre Vendu' });
		}
		if (this.sales_count == true) {
			filtersArray.push({ name: 'most_sold', slug: true, title: 'Plus Vendu' });
		}
		if (this.qty_available == true) {
			filtersArray.push({ name: 'available', slug: true, title: 'Disponible' });
		}
		if (this.archived == true) {
			filtersArray.push({ name: 'archived', slug: true, title: 'Archivé' });
		}

		for (let i = 0; i < this.states.length; i++) {
			if (this.states[i].state == true) {
				filtersArray.push({ name: this.states[i].id, slug: true, title: this.states[i].text });
			}
		}

		this.vc.dismiss(filtersArray);
	}
}
