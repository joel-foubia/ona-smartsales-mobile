//Définition des constanges

export class ConfigImg {
	static defaultImg = 'assets/images/person.jpg';
	static objIcons = {
		iconAlert: "<ion-icon name='alert'></ion-icon>",
		iconError: "<ion-icon name='close'></ion-icon>",
		iconSuccess: "<ion-icon name='checkmark-circle'></ion-icon>"
	};
}

export class ConfigOnglet {
	static loadOnglets(active: boolean, pop?: any) {
		// console.log('Loading onglets');
		let liste = [
			{ id: 1, titre: pop.details_call, img: 'icon-phone-forward', slug: 'phonecall' },
			{ id: 1, titre: pop.details_prospect, img: 'icon-file', slug: 'detail' },
			{ id: 0, titre: pop.to_opport, img: 'icon-keyboard-tab', slug: 'opportunity' },
			{ id: 2, titre: pop.update, img: ' icon-pencil-box', slug: 'update' },
			{ id: 4, titre: pop.add_call, img: 'icon-phone', slug: 'call' },
			{ id: 3, titre: pop.lost, img: 'icon-emoticon-sad', slug: 'lost' }
		];

		return liste;
	}

	static loadOngletsPipe(active: boolean, pop?: any) {
		let liste = [
			{ id: 1, titre: pop.details_call, img: 'icon-phone-forward', slug: 'phonecall' },
			{ id: 1, titre: pop.details_prospect, img: 'icon-file', slug: 'detail' },
			{ id: 0, titre: pop.won, img: 'icon-emoticon', slug: 'won' },
			{ id: 3, titre: pop.lost, img: 'icon-emoticon-sad', slug: 'lost' },
			{ id: 6, titre: pop.meeting_prospect, img: 'icon-calendar-text', slug: 'meeting' },
			{ id: 4, titre: pop.add_call, img: 'icon-phone', slug: 'call' },
			{ id: 2, titre: pop.update, img: 'icon-pencil-box', slug: 'update' },
			{ id: 5, titre: pop.devis, img: ' icon-cash', slug: 'quotation' }
		];

		// let inSert = { id: 3, titre: 'Delete', img: 'assets/images/logo/white/trash.png', slug: 'archive' };
		// let outSert = { id: 3, titre: 'Restore', img: 'assets/images/logo/white/fixed.png', slug: 'archive' };

		// if (active) liste.splice(3, 0, inSert);
		// else liste.splice(3, 0, outSert);

		return liste;
	}

	//Filtres Prospects
	static filtreOpports(txtPop) {
		let tab = [
			{ nom: txtPop.all_opport, icon: 'ios-person-outline', slug: 'all' },
			{ nom: txtPop.txt_opport, icon: 'ios-person-outline', slug: 'activity' },
			{ nom: txtPop.call_queue, icon: 'ios-people-outline', slug: 'call' },
			{ nom: txtPop.meeting, icon: 'ios-man-outline', slug: 'meeting' },
			{ nom: txtPop.deadline, icon: 'ios-woman-outline', slug: 'deadline' },
			{ nom: txtPop.win_opport, icon: 'ios-archive-outline', slug: 'probability' },
			{ nom: txtPop.priority, icon: 'ios-archive-outline', slug: 'priority' }
			//{ nom: 'Supprimées' , icon:'ios-trash-outline', slug: 'corbeille'}
		];

		return tab;
	}

	//Liste des filtres à appliquer sur la vue liste clients
	static filtreClients(txtPop){

		let tab = [
			{ nom: txtPop.person, slug: 'person'},
			{ nom: txtPop.company, slug: 'company'},
			{ nom: txtPop.near_me, slug: 'nearme'},
			{ nom: txtPop.myown, slug: 'owner'},
			{ nom: txtPop.meeting, slug: 'meeting'},
			{ nom: txtPop.opportunity, slug: 'opportunity'},
			{ nom: txtPop.myorders, icon:'ios-man-outline', slug: 'saleorder'},
			{ nom: txtPop.f_archive , icon:'ios-archive-outline', slug: 'archive'},
			//{ nom: 'Supprimées' , icon:'ios-trash-outline', slug: 'corbeille'}
		];

		return tab;
	}
	
	//Liste des filtres à appliquer sur la vue liste clients
	static filtreClientsSecond(txtPop){

		let tab = [
			{ nom: txtPop.pending_bill, slug: 'pending_bill'},
			{ nom: txtPop.expired_bill, slug: 'expired_bill'},
			{ nom: txtPop.sub, slug: 'sub'},
			{ nom: txtPop.devis, slug: 'devis'},
			{ nom: txtPop.courriel, slug: 'mail'},
			// { nom: txtPop.opportunity, slug: 'opportunity'},
			// { nom: txtPop.myorders, icon:'ios-man-outline', slug: 'saleorder'},
			// { nom: txtPop.f_archive , icon:'ios-archive-outline', slug: 'archive'},
			//{ nom: 'Supprimées' , icon:'ios-trash-outline', slug: 'corbeille'}
		];

		return tab; 
	}

	//Liste des filtres à appliquer sur la vue liste contacts
	static filtreContacts(txtPop){

		let tab = [
		  { nom: txtPop.person, icon:'ios-person-outline', slug: 'person'},
		  { nom: txtPop.company, icon:'ios-people-outline', slug: 'company'},
		  // { nom: this.txtPop.near_me, icon:'ios-cash-outline', slug: 'nearme'},
		  { nom: txtPop.meeting, icon:'ios-archive-outline', slug: 'meeting'},
		  // { nom: this.txtPop.opportunity, icon:'ios-man-outline', slug: 'opportunity'},
		  { nom: txtPop.f_archive , icon:'ios-archive-outline', slug: 'archive'}
		  //{ nom: 'Supprimées' , icon:'ios-trash-outline', slug: 'corbeille'}
		 ];
	
		 return tab; 
	}

	//Filtres Prospects
	static filtreSubs(txtPop) {
		let tab = [
			{ nom: txtPop.all_opport, icon: 'ios-person-outline', slug: 'all' },
			{ nom: txtPop.txt_opport, icon: 'ios-person-outline', slug: 'activity' },
			{ nom: txtPop.call_queue, icon: 'ios-people-outline', slug: 'call' },
			{ nom: txtPop.meeting, icon: 'ios-man-outline', slug: 'meeting' },
			{ nom: txtPop.deadline, icon: 'ios-woman-outline', slug: 'deadline' },
			{ nom: txtPop.win_opport, icon: 'ios-archive-outline', slug: 'probability' },
			{ nom: txtPop.priority, icon: 'ios-archive-outline', slug: 'priority' }
			//{ nom: 'Supprimées' , icon:'ios-trash-outline', slug: 'corbeille'}
		];

		return tab;
	}

	static filtreCalls(callPop) {
		let tab = [
			{ nom: callPop.all_calls, icon: 'ios-people-outline', slug: 'allCall' },
			{ nom: callPop.all_todo, icon: 'ios-person-outline', slug: 'open' },
			{ nom: callPop.open_call, icon: 'ios-person-outline', slug: 'done' },
			{ nom: callPop.txt_today, icon: 'ios-person-outline', slug: 'today' }
			// { nom: callPop.team, icon: 'ios-man-outline', slug: 'team' }
		];
		return tab;
	}

	static filtreSales(salesPop) {
		let tab = [
			{ nom: salesPop.sent, icon: 'ios-person-outline', slug: 'sent' },
			{ nom: salesPop.cancel, icon: 'ios-person-outline', slug: 'cancel' },
			{ nom: salesPop.invoiced, icon: 'ios-people-outline', slug: 'invoice' },
			{ nom: salesPop.expired, icon: 'ios-man-outline', slug: 'expired' },
			{ nom: salesPop.all, icon: 'ios-man-outline', slug: 'all' }
		];
		return tab;
	}

	//Menu Agenda
	static loadOngletsAgenda(active: boolean, pop: any) {
		let liste = [
			//  {id: 0, titre: "Couleur", img:"assets/images/logo/black/couleur.png", slug:"couleur"},
			{ id: 1, titre: pop.details, img: 'assets/images/logo/black/details.png', slug: 'detail' },
			{ id: 2, titre: pop.update, img: 'assets/images/logo/black/create.png', slug: 'update' }
		];

		let inSert = { id: 3, titre: pop.delete, img: 'assets/images/logo/black/trash.png', slug: 'archive' };
		let outSert = { id: 3, titre: pop.reset, img: 'assets/images/logo/black/fixed.png', slug: 'archive' };

		if (active) liste.splice(3, 0, inSert);
		else liste.splice(3, 0, outSert);

		return liste;
	}

	static loadOngletsForDetails() {
		let liste = [
			{ id: 0, titre: 'Détails', img: 'assets/images/logo/details.png', slug: 'detail' },
			{ id: 1, titre: 'Notes', img: 'assets/images/logo/notes.png', slug: 'notes' },
			{ id: 2, titre: 'Audiences', img: 'assets/images/logo/court.png', slug: 'audience' },
			{ id: 3, titre: 'Tâches', img: 'assets/images/logo/tasks.png', slug: 'tache' },
			{ id: 4, titre: 'Factures', img: 'assets/images/logo/bill.png', slug: 'facture' }
		];

		return liste;
	}

	static loadActions() {
		let liste = [
			{ id: 0, titre: 'Modifier', img: 'assets/images/logo/black/create.png', slug: 'update' },
			//{id: 1, titre: "Supprimer", img:"assets/images/logo/black/trash.png", slug:"corbeille"},
			{ id: 2, titre: 'Dupliquer', img: 'assets/images/logo/black/copy.png', slug: 'copy' },
			{ id: 3, titre: 'Archiver', img: 'assets/images/logo/black/archive.png', slug: 'archive' }
		];

		return liste;
	}

	static langues(pop: any) {
		return [
			{ id: 'fr_BE', text: pop.tab_lang.fr },
			//{ id:'fr_FR', text:"Francais (France)"},
			{ id: 'en_US', text: pop.tab_lang.us }
		];
	}

	static companyTypes() {
		return [ { id: 'person', text: 'Individual' }, { id: 'company', text: 'Company' } ];
	}

	static notifs(pop: any) {
		return [ { id: 'none', text: pop.never }, { id: 'always', text: pop.always } ];
	}

	static tz(pop: any) {
		let tab = [ { id: '', text: '' }, { id: 'none', text: pop.never }, { id: 'always', text: pop.always } ];

		return tab;
	}

	static productTypes(pop?: any) {
		let tab = [
			{ id: 'consu', text: pop.consumable },
			{ id: 'service', text: pop.service },
			{ id: 'product', text: pop.stored_product }
		];

		return tab;
	}

	static invoicePolicy(pop?: any) {
		let tab = [
			{ id: 'order', text: pop.order },
			{ id: 'delivery', text: pop.delivery },
			{ id: 'cost', text: pop.cost }
		];

		return tab;
	}

	static loadProductType(pop?: any) {
		let liste = [
			{ name: pop.consumable, value: 'cons' },
			{ name: pop.stored_product, value: 'product' },
			{ name: pop.service, value: 'services' }
		];

		return liste;
	}

	static loadInvoicePolicy(pop?: any) {
		let liste = [
			{ label: pop.check, value: 'check' },
			{ label: pop.bank, value: 'bank' }
			// {name: "Services", value:"services"}
		];

		return liste;
	}

	static loadOngletsProducts(active: boolean, pop?: any) {
		let liste = [
			{ id: 1, titre: pop.details, img: 'assets/images/logo/white/search.svg', slug: 'detail' },
			{ id: 2, titre: pop.update, img: 'assets/images/logo/white/edit.png', slug: 'update' }
			// { id: 2, titre: pop.sale, img: 'assets/images/logo/white/badge.svg', slug: 'ventes' },
			// { id: 4, titre: 'Add To Calls', img: 'assets/images/logo/white/phone-call.png', slug: 'call' },
		];

		let inSert = { id: 3, titre: pop.delete, img: 'assets/images/logo/white/trash.png', slug: 'archive' };
		let outSert = { id: 3, titre: pop.reset, img: 'assets/images/logo/white/fixed.png', slug: 'archive' };

		return liste;
	}

	static purchaseMethod(pop?: any) {
		let tab = [ { id: 'purchase', text: pop.purchase }, { id: 'receive', text: pop.receive } ];

		return tab;
	}

	static stateInvoice(pop?: any) {
		let tab_states = [
			{ id: 'draft', text: pop.draft, icon: 'assets/images/logo/draft.png' },
			{ id: 'open', text: pop.open, icon: 'assets/images/logo/open.png' },
			{ id: 'paid', text: pop.paid, icon: 'assets/images/logo/paid.png' },
			{ id: 'proforma', text: pop.forma, icon: 'assets/images/logo/proforma.png' }
		];

		return tab_states;
	}
	
	//Filtre sur les années
	static filterYears(pop?: any) {
		
		let currentYear = new Date().getFullYear();

		let tab_states = [
			{ id: currentYear, text: currentYear, selected: true },
			{ id: currentYear-1, text: currentYear-1 },
			{ id: currentYear-2, text: currentYear-2 },
			{ id: currentYear-3, text: currentYear-3 },
			{ id: currentYear-4, text: currentYear-4 },
			{ id: 'all', text: pop.all_year }
		];

		return tab_states;
	}

	//Filtre sur les periodes
	static filterPeriod(pop?: any) {
		
		let currentMonth = new Date().getMonth();
		let currentYear = new Date().getFullYear();
		let currentWeek = new Date().getMonth();

		let tab_states = [
			{ id: currentMonth + 1, text: pop.currentMonth, selected: true },
			{ id: currentWeek, text: pop.currentWeek },
			{ id: currentYear, text: pop.currentYear},
			// { id: currentYear-3, text: currentYear-3 },
			// { id: currentYear-4, text: currentYear-4 }
		];

		return tab_states;
	}

	static subInvoice(pop?: any) {
		let tab_states = [
			{ id: 'all', text: pop.all_subs, icon: 'assets/images/logo/draft.png' },
			{ id: 'draft', text: pop.new, icon: 'assets/images/logo/draft.png' },
			{ id: 'open', text: pop.pending, icon: 'assets/images/logo/open.png' },
			{ id: 'pending', text: pop.renew, icon: 'assets/images/logo/paid.png' },
			{ id: 'closed', text: pop.close, icon: 'assets/images/logo/paid.png' },
			{ id: 'canceled', text: pop.cancel, icon: 'assets/images/logo/proforma.png' }
		];

		return tab_states;
	}

	static invoicesFilter(txtPop?: any) {
		let tab = [
			{ slug: 'all', nom: txtPop.all_invoices, active: false },
			{ nom: txtPop.draft, active: true, slug: 'draft' },
			{ nom: txtPop.open, active: false, slug: 'open' },
			{ nom: txtPop.paid, active: false, slug: 'paid' },
			{ nom: txtPop.proforma, active: false, slug: 'proforma' },
			{ nom: txtPop.cancel, active: false, slug: 'cancelled' },
			// { nom: txtPop.bill, active: false, slug: 'all' }
		];

		return tab;
	}

	static equipeVente(callPop) {
		let tab = [
			{ nom: callPop.equipe, icon: 'ios-people-outline', slug: 'team_id' }
		];
		return tab;
	}

	static achatsFilter(txtPop?: any) {
		let tab = [
			{ slug: 'all', nom: txtPop.all_achats, active: false },
			{ nom: txtPop.quot, active: true, slug: 'quot' },
			{ nom: txtPop.purchase, active: false, slug: 'purchase' },
			{ nom: txtPop.n_invoice, active: false, slug: 'n_invoice' },
			{ nom: txtPop.invoice, active: false, slug: 'invoice' },
			{ nom: txtPop.mail, active: false, slug: 'mail' },
		];

		return tab;
	}
}

export class ConfigModels {
	static tab_models = [
		'sub',
		'purchase',
		'purchase_line',
		'sub_line',
		'etiquette',
		'tag_note',
		'unity',
		'tax',
		'country',
		'state',
		'title',
		'prime',
		'analytic',
		'account',
		'ticket',
		'event',
		'type_event',
		'participant',
		'invoice-line',
		'payment_term',
		'currency',
		'group',
		'company',
		'payment_method',
		'followers',
		'stage_note',
		'produit',
		'vente',
		'lines',
		'client',
		'contact',
		'leads',
		'category',
		'notes',
		'tag_agenda',
		'remind',
		'channel',
		'activite',
		'perte',
		'vendeurs',
		'offline',
		'stage',
		'agenda',
		'user',
		'invoice',
		'team',
		'call',
	];
}

export class ConfigSync {
	static timeSync = 90000;
}
