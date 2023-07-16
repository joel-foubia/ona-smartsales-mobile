// import { GESTURE_REFRESHER } from "ionic-angular/umd";

export class Produit {
	public id;
	public warranty;
	public list_price;
	public weight;
	public sequence;
	public color;
	public write_uid;
	public image_url;
	public uom_id;
	public description_purchase;
	public create_date;
	public qty_available;
	public create_uid;
	public sale_ok;
	public sales_count;
	public categ_id;
	public product_manager;
	public message_last_post;
	public company_id;
	public state;
	public uom_po_id;
	public description_sale;
	public description;
	public volume;
	public write_date;
	public active;
	public rental;
	public name;
	public type;
	public track_service;
	public invoice_policy;
	public description_picking;
	public sale_delay;
	public tracking;
	public available_in_pos;
	public pos_categ_id;
	public to_weight;
	public purchase_ok;
	public purchase_method;
	public produce_delay;
	public deferred_revenue_category_id;
	public asset_category_id;
	public recurring_invoice;
	public project_id;
	public landed_cost_ok;
	public split_method;
	public event_type_id;
	public event_ok;
	public currency_id;
	public incoming_qty;
	public outgoing_qty;
	public product_variant_ids;
	public default_code;

	//Définitions des messages à envoyer
	static error_write_uid = "Le numéro de téléwrite_uid n'a pas été attribué. Aller dans la rubrique Modifier";
	static error_sequence = "Vous ne pouvez pas envoyer de mail, l'sequence n'a pas été attribué. Attribuez un sequence";
	static error_color = "Le site web ne peut pas s'ouvrir, l'adresse du site internet n'a pas été enregistré";
	static noInternet = "Impossible d'enregistrer. Problème de connexion Internet";
	static errSaving = "Une erreur est survenu lors de la création d'un nouveau";

	constructor(serverJSON: any, type: string) {
		// console.log('Entering in constructor');
		// this.setType(type);
		if (serverJSON != null) this.setProduit(serverJSON);
		else this.createProduit();
	}

	//Permet de définir la liste des titres
	//à attribuer à un parternaire
	private listTabstates() {
		let tab_state = [
			{ id: 0, text: 'Aucun' },
			{ id: 1, text: 'Madam' },
			{ id: 2, text: 'Miss' },
			{ id: 3, text: 'Sir' },
			{ id: 4, text: 'Mister' },
			{ id: 5, text: 'Doctor' },
			{ id: 6, text: 'Professor' }
		];

		return tab_state;
	}

	/** 
     * Cette fonction retourne le titre
     * en fonction de l'id
     * @param id int, l'id du titre
     * @return string
     **/
	getTitreById(id) {
		let tab = this.listTabstates();

		for (let i = 0; i < tab.length; i++) {
			if (tab[i].id == parseInt(id)) return tab[i].text;
		}
	}

	/** Cette fonction permet de définir 
     * les valeurs des champs
     * @param data JSONObject, il s'agit des données JSON du serveur
     *
     ***/
	setProduit(data: any) {
		this.id = data.me.id.me;

		if (!data.me.name.me || data.me.name.me == 'false') this.name = '';
		else this.name = data.me.name.me;

		if (!data.me.type.me || data.me.type.me == 'false') this.type = '';
		else this.type = data.me.type.me;

		if (data.me.image_url === undefined || !data.me.image_url.me) this.image_url = 'assets/images/sb.svg';
		else this.image_url = data.me.image_url.me;

		if (!data.me.track_service.me || data.me.track_service.me == 'false') this.track_service = '';
		else this.track_service = data.me.track_service.me;
		if (!data.me.invoice_policy.me || data.me.invoice_policy == undefined) this.invoice_policy = '';
		else this.invoice_policy = data.me.invoice_policy.me;

		if (data.me.description_picking == undefined || !data.me.description_picking.me) this.description_picking = '';
		else this.description_picking = data.me.description_picking.me;
		if (data.me.sale_delay == undefined || !data.me.sale_delay.me) this.sale_delay = 0;
		else this.sale_delay = data.me.sale_delay.me;
		if (data.me.sales_count == undefined || !data.me.sales_count.me) this.sales_count = 0;
		else this.sales_count = data.me.sales_count.me;
		if (data.me.qty_available == undefined || !data.me.qty_available.me) this.qty_available = 0;
		else this.qty_available = data.me.qty_available.me;
		if (data.me.outgoing_qty == undefined || !data.me.outgoing_qty.me) this.outgoing_qty = 0;
		else this.outgoing_qty = data.me.outgoing_qty.me;
		if (data.me.incoming_qty == undefined || !data.me.incoming_qty.me) this.incoming_qty = 0;
		else this.incoming_qty = data.me.incoming_qty.me;
		if (data.me.tracking == undefined || !data.me.tracking.me) this.tracking = '';
		else this.tracking = data.me.tracking.me;

		if (data.me.available_in_pos === undefined || !data.me.available_in_pos.me) this.available_in_pos = false;
		else this.available_in_pos = data.me.available_in_pos.me;

		if (data.me.to_weight === undefined || !data.me.to_weight.me) this.to_weight = 0;
		else this.to_weight = data.me.to_weight.me;

		if (data.me.purchase_method == undefined || !data.me.purchase_method.me) this.purchase_method = '';
		else this.purchase_method = data.me.purchase_method.me;
		if (data.me.produce_delay == undefined || !data.me.produce_delay.me) this.produce_delay = 0;
		else this.produce_delay = data.me.produce_delay.me;

		if (data.me.recurring_invoice.me === undefined || !data.me.recurring_invoice.me) this.recurring_invoice = '';
		else this.recurring_invoice = data.me.recurring_invoice.me;

		if (data.me.landed_cost_ok === undefined || !data.me.landed_cost_ok.me) this.landed_cost_ok = '';
		else this.landed_cost_ok = data.me.landed_cost_ok.me;

		if (data.me.split_method == undefined || !data.me.split_method.me) this.split_method = '';
		else this.split_method = data.me.split_method.me;

		if (data.me.event_ok == undefined || !data.me.event_ok.me) this.event_ok = false;
		else this.event_ok = data.me.event_ok.me;

		if (data.me.warranty == undefined || !data.me.warranty.me || data.me.warranty.me == 'false')
			this.warranty = 0.0;
		else this.warranty = data.me.warranty.me;

		if (data.me.list_price == undefined || !data.me.list_price.me || data.me.list_price.me == 'false')
			this.list_price = 0;
		else this.list_price = data.me.list_price.me;

		this.active = data.me.active.me;

		if (data.me.rental == undefined || !data.me.rental.me) this.rental = '';
		else this.rental = data.me.rental.me;
		if (data.me.default_code == undefined || !data.me.default_code.me) this.default_code = '';
		else this.default_code = data.me.default_code.me;

		if (data.me.sequence == undefined || !data.me.sequence.me) this.sequence = 0;
		else this.sequence = data.me.sequence.me;

		if (data.me.color == undefined || !data.me.color.me) this.color = 0;
		else this.color = data.me.color.me;

		if (data.me.description_purchase == undefined || !data.me.description_purchase.me)
			this.description_purchase = '';
		else this.description_purchase = data.me.description_purchase.me;

		if (!data.me.create_date.me || data.me.create_date == undefined) this.create_date = '';
		else this.create_date = data.me.create_date.me;
		if (!data.me.write_date.me || data.me.write_date.me == 'false') this.write_date = '';
		else this.write_date = data.me.write_date.me;

		if (data.me.sale_ok == undefined || !data.me.sale_ok.me) this.sale_ok = 0;
		else this.sale_ok = data.me.sale_ok.me;

		if (data.me.volume == undefined || !data.me.volume.me || data.me.volume.me == 'false') this.volume = 0;
		else this.volume = data.me.volume.me;

		if (data.me.categ_id == undefined || !data.me.categ_id.me || data.me.categ_id.me == 'false') this.categ_id = '';
		else this.categ_id = data.me.categ_id.me;
		if (
			data.me.description_sale == undefined ||
			!data.me.description_sale.me ||
			data.me.description_sale.me == 'false'
		)
			this.description_sale = '';
		else this.description_sale = data.me.description_sale.me;

		//ON attribut des valeurs aux restes des propriétés

		if (
			data.me.message_last_post == undefined ||
			!data.me.message_last_post.me ||
			data.me.message_last_post.me == 'false'
		)
			this.message_last_post = 0;
		else this.message_last_post = data.me.message_last_post.me;

		if (data.me.company_id == undefined || !data.me.company_id.me || data.me.company_id.me == 'false')
			this.company_id = { id: 0, name: '' };
		else this.company_id = { id: data.me.company_id.me[0].me, name: data.me.company_id.me[1].me };

		if (data.me.state == undefined || !data.me.state.me || data.me.state.me == 'false')
			this.state = { id: 0, name: '' };
		else this.state = { id: data.me.state.me[0].me, name: data.me.state.me[1].me };

		if (
			data.me.product_variant_ids == undefined ||
			!data.me.product_variant_ids.me ||
			data.me.product_variant_ids.me.length == 0
		)
			this.product_variant_ids = [];
		else this.product_variant_ids = this.getIdTabs(data.me.product_variant_ids.me);

		if (data.me.uom_po_id == undefined || !data.me.uom_po_id.me || data.me.uom_po_id.me == 'false')
			this.uom_po_id = { id: 0, name: '' };
		else this.uom_po_id = { id: data.me.uom_po_id.me[0].me, name: data.me.uom_po_id.me[1].me };
		if (
			data.me.asset_category_id == undefined ||
			!data.me.asset_category_id.me ||
			data.me.asset_category_id.me == 'false'
		)
			this.asset_category_id = { id: 0, name: '' };
		else
			this.asset_category_id = {
				id: data.me.asset_category_id.me[0].me,
				name: data.me.asset_category_id.me[1].me
			};
		if (data.me.categ_id == undefined || !data.me.categ_id.me || data.me.categ_id.me == 'false')
			this.categ_id = { id: 0, name: '' };
		else
			this.categ_id = {
				id: data.me.categ_id.me[0].me,
				name: data.me.categ_id.me[1].me
			};
		if (data.me.create_uid == undefined || !data.me.create_uid.me || data.me.create_uid.me == 'false')
			this.create_uid = { id: 0, name: '' };
		else
			this.create_uid = {
				id: data.me.create_uid.me[0].me,
				name: data.me.create_uid.me[1].me
			};
		if (
			data.me.deferred_revenue_category_id == undefined ||
			!data.me.deferred_revenue_category_id.me ||
			data.me.deferred_revenue_category_id.me == 'false'
		)
			this.deferred_revenue_category_id = { id: 0, name: '' };
		else
			this.deferred_revenue_category_id = {
				id: data.me.deferred_revenue_category_id.me[0].me,
				name: data.me.deferred_revenue_category_id.me[1].me
			};
		if (data.me.event_type_id == undefined || !data.me.event_type_id.me || data.me.event_type_id.me == 'false')
			this.event_type_id = { id: 0, name: '' };
		else
			this.event_type_id = {
				id: data.me.event_type_id.me[0].me,
				name: data.me.event_type_id.me[1].me
			};
		if (data.me.pos_categ_id == undefined || !data.me.pos_categ_id.me || data.me.pos_categ_id.me == 'false')
			this.pos_categ_id = { id: 0, name: '' };
		else
			this.pos_categ_id = {
				id: data.me.pos_categ_id.me[0].me,
				name: data.me.pos_categ_id.me[1].me
			};
		if (
			data.me.product_manager == undefined ||
			!data.me.product_manager.me ||
			data.me.product_manager.me == 'false'
		)
			this.product_manager = { id: 0, name: '' };
		else
			this.product_manager = {
				id: data.me.product_manager.me[0].me,
				name: data.me.product_manager.me[1].me
			};
		if (data.me.uom_id == undefined || !data.me.uom_id.me || data.me.uom_id.me == 'false')
			this.uom_id = { id: 0, name: '' };
		else
			this.uom_id = {
				id: data.me.uom_id.me[0].me,
				name: data.me.uom_id.me[1].me
			};
		if (data.me.write_uid == undefined || !data.me.write_uid.me || data.me.write_uid.me == 'false')
			this.write_uid = { id: 0, name: '' };
		else
			this.write_uid = {
				id: data.me.write_uid.me[0].me,
				name: data.me.write_uid.me[1].me
			};
		if (data.me.currency_id == undefined || !data.me.currency_id.me || data.me.currency_id.me == 'false')
			this.currency_id = { id: 0, name: '' };
		else
			this.currency_id = {
				id: data.me.currency_id.me[0].me,
				name: data.me.currency_id.me[1].me
			};
	}

	/** set up type **/
	setType(type: string) {
		this.type = type;
	}

	getType() {
		return this.type;
	}

	//On créé un objet de type produit
	createProduit() {
		this.currency_id = { id: 0, name: 'EUR' };
		this.id = 0;
		this.incoming_qty = 0.0;
		this.outgoing_qty = 0.0;
		this.default_code = '';
		this.warranty = 0.0;
		this.list_price = 1.0;
		this.weight = 0;
		this.sequence = 0;
		this.color = 0;
		this.write_uid = { id: 0, name: '' };
		this.uom_id = { id: 0, name: 'Unité(s)' };
		this.description_purchase = '';
		this.create_date = '';
		this.create_uid = { id: 0, name: '' };
		this.sale_ok = true;
		this.categ_id = { id: 0, name: '' };
		this.product_manager = { id: 0, name: '' };
		this.message_last_post = '';
		this.company_id = { id: 0, name: '' };
		this.state = '';
		this.uom_po_id = { id: 0, name: 'Unité(s)' };
		this.description_sale = '';
		this.description = '';
		this.volume = 0;
		this.write_date = '';
		this.active = true;
		this.rental = false;
		this.name = '';
		this.type = 'consu';
		this.track_service = '';
		this.invoice_policy = 'order';
		this.description_picking = '';
		this.sale_delay = 7.0;
		this.sales_count = 0;
		this.tracking = '';
		this.image_url = 'assets/images/sb.svg';
		this.available_in_pos = true;
		this.pos_categ_id = { id: 0, name: '' };
		this.to_weight = false;
		this.purchase_ok = true;
		this.purchase_method = 'receive';
		this.produce_delay = 1.0;
		this.qty_available = 0;
		this.deferred_revenue_category_id = { id: 0, name: '' };
		this.asset_category_id = { id: 0, name: '' };
		this.recurring_invoice = false;
		this.project_id = { id: 0, name: '' };
		this.landed_cost_ok = false;
		this.split_method = '';
		this.event_type_id = { id: 0, name: '' };
		this.event_ok = false;
		this.product_variant_ids = [];
	}
	//Cette fonction permet de générer un tableau
	//d'identifiant
	private getIdTabs(liste) {
		let tab = [];

		for (var i = 0; i < liste.length; i++) {
			tab.push(liste[i].me);
		}

		return tab;
	}
}
