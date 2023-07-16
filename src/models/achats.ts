/** Cette classe définit l'objet invoice (pour la gestion du modele account.invoice) **/

export class Achats {
	public id;
	public name;
	public date_order;
	public state;
	public amount_untaxed;
	public amount_tax;
	public amount_total;
	public order_line;
	public product_id;
	public product_qty;
	public price_unit;
	public date_planned;
	public partner_id;
	public payment_term_id;
	public fiscal_position_id;
	public picking_type_id;

	//Définitions des messages à envoyer
	static error_save = "Impossible d'enregistrer une audience";
	static noInternet = "Impossible d'enregistrer. Problème de connexion Internet";

	/*
     * @param type string, correspond au type de données à insérer
     * @param serverJSON JSONObject, il s'agit des données qui proviennent du server ou 
     *                              d'une autre soruce
     *
     */
	constructor(serverJSON: any) {
		if (serverJSON != null) {
			this.setAchats(serverJSON);
		} else {
			this.initObjet();
		}
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

	/** Cette fonction permet de définir 
     * les valeurs des champs
     * @param data JSONObject, il s'agit des données JSON du serveur
     *
     ***/
	setAchats(data: any) {
		this.id = data.me.id.me;

		if (!data.me.state.me || data.me.state.me == undefined) this.state = '';
		else this.state = data.me.state.me;

		if (!data.me.name.me || data.me.name == undefined) this.name = '';
		else this.name = data.me.name.me;

		if (!data.me.date_order.me || data.me.date_order == undefined) this.date_order = '';
		else this.date_order = data.me.date_order.me;

		if (data.me.product_id == undefined || !data.me.product_id.me || data.me.product_id.me == 'false')
			this.product_id = { id: 0, name: '' };
		else
			this.product_id = {
				id: data.me.product_id.me[0].me,
				name: data.me.product_id.me[1].me
			};

		if (!data.me.state.me || data.me.state.me == 'false') this.state = '';
		else this.state = data.me.state.me;

		if (data.me.product_qty == undefined || !data.me.product_qty.me) this.product_qty = 0;
		else this.product_qty = data.me.product_qty.me;

		if (data.me.price_unit == undefined || !data.me.price_unit.me) this.price_unit = 0;
		else this.price_unit = data.me.price_unit.me;

		if (data.me.date_planned == undefined || !data.me.date_planned.me) this.date_planned = '';
		else this.date_planned = data.me.date_planned.me;

		if (data.me.amount_total == undefined || !data.me.amount_total.me) this.amount_total = 0;
		else this.amount_total = data.me.amount_total.me;

		if (data.me.amount_tax == undefined || !data.me.amount_tax.me) this.amount_tax = 0;
		else this.amount_tax = data.me.amount_tax.me;

		if (data.me.amount_untaxed == undefined || !data.me.amount_untaxed.me) this.amount_untaxed = 0;
		else this.amount_untaxed = data.me.amount_untaxed.me;

		if (data.me.partner_id == undefined || !data.me.partner_id.me) this.partner_id = { id: 0, name: '' };
		else
			this.partner_id = {
				id: data.me.partner_id.me[0].me,
				name: data.me.partner_id.me[1].me
			};
		if (data.me.payment_term_id == undefined || !data.me.payment_term_id.me)
			this.payment_term_id = { id: 0, name: '' };
		else
			this.payment_term_id = {
				id: data.me.payment_term_id.me[0].me,
				name: data.me.payment_term_id.me[1].me
			};
		if (data.me.picking_type_id == undefined || !data.me.picking_type_id.me)
			this.picking_type_id = { id: 0, name: '' };
		else
			this.picking_type_id = {
				id: data.me.picking_type_id.me[0].me,
				name: data.me.picking_type_id.me[1].me
			};
		if (data.me.fiscal_position_id == undefined || !data.me.fiscal_position_id.me)
			this.fiscal_position_id = { id: 0, name: '' };
		else
			this.fiscal_position_id = {
				id: data.me.fiscal_position_id.me[0].me,
				name: data.me.fiscal_position_id.me[1].me
			};

		if (data.me.order_line == undefined || !data.me.order_line.me || data.me.order_line.me.length == 0)
			this.order_line = [];
		else this.order_line = this.getIdTabs(data.me.order_line.me);
	}

	setFromAffaire(data) {
		//this.date_invoice = new Date();
		/*  this.team_id = {
        id: data.id,
        name: data.name
      };
      
      this.partner_id = data.partner_id; */
	}

	//Initialisation des données
	initObjet() {
		this.id = 0;
		this.date_order = '';
		this.name = '';
		this.state = 'draft';
		this.product_id = { id: 0, name: '' };
		this.picking_type_id = { id: 0, name: '' };
		this.fiscal_position_id = { id: 0, name: '' };
		this.partner_id = { id: 0, name: '' };
		this.payment_term_id = { id: 0, name: '' };
		this.amount_total = 0;
		this.amount_tax = 0;
		this.order_line = [];
		this.product_qty = 0;
		this.price_unit = '';
		this.amount_untaxed = 0;
	}
}
