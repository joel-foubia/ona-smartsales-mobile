/** Cette classe définit l'objet invoice (pour la gestion du modele account.invoice) **/

export class OrderLine {
	public id;
	public name;
	public date_planned;
	public product_id;
	public product_qty;
	public product_uom;
	public price_unit;
	public taxes_id;
	public invoice_lines;

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
			this.setOrderLine(serverJSON);
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
	setOrderLine(data: any) {
		this.id = data.me.id.me;

		if (!data.me.name.me || data.me.name == undefined) this.name = '';
		else this.name = data.me.name.me;

		if (data.me.product_id == undefined || !data.me.product_id.me || data.me.product_id.me == 'false')
			this.product_id = { id: 0, name: '' };
		else
			this.product_id = {
				id: data.me.product_id.me[0].me,
				name: data.me.product_id.me[1].me
			};
		if (data.me.product_uom == undefined || !data.me.product_uom.me || data.me.product_uom.me == 'false')
			this.product_uom = { id: 0, name: '' };
		else
			this.product_uom = {
				id: data.me.product_uom.me[0].me,
				name: data.me.product_uom.me[1].me
			};

		if (data.me.product_qty == undefined || !data.me.product_qty.me) this.product_qty = 0;
		else this.product_qty = data.me.product_qty.me;

		if (data.me.price_unit == undefined || !data.me.price_unit.me) this.price_unit = 0.00;
		else this.price_unit = data.me.price_unit.me;

		if (data.me.date_planned == undefined || !data.me.date_planned.me) this.date_planned = '';
		else this.date_planned = data.me.date_planned.me;

		if (data.me.taxes_id == undefined || !data.me.taxes_id.me || data.me.taxes_id.me.length == 0)
			this.taxes_id = [];
		else this.taxes_id = this.getIdTabs(data.me.taxes_id.me);
		if (data.me.invoice_lines == undefined || !data.me.invoice_lines.me) this.invoice_lines = [];
		else this.invoice_lines = this.getIdTabs(data.me.invoice_lines.me);
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
		this.name = '';
		this.product_id = { id: 0, name: '', list_price: 0 };
		this.product_uom = { id: 0, name: '' };
		this.product_qty = 1;
		this.price_unit = 0.00,
		this.taxes_id = [];
		this.invoice_lines = [];
		this.date_planned = '';
	}
}
