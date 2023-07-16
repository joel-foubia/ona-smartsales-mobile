
/**
 * CREATION DU SERVICE JAVASCRIPT ODOO POUR ONA AVOCAT
 * @author Dave Arthur version 1.2.1 (Décembre 2017)
 *
 * Cette librairie JavaScript permet d'établir la
 * communication et l'échange de données avec 
 * le serveur Odoo à travers ses Web Services API
 * Cette communication est effectué à travers le protocole RPC (Remote Procedure Control)
 * Cet API est définit par XML RPC : 
 *	- les requêtes sont faites à travers du XML 
 *
 * Ce service utilise la bibliothèque Java Script (xmlrpc_lib.js) qui permet de 
 * traiter les requêtes et réponses  XML 
 *
 *
 **/
 /**
  * Déclaration de l'objet Odoo
  * dans cet objet nous allons définir
  * les fonctions qui utilise les Web Services API
  *
  **/
  //console.log('test odoo');
  var Odoo = {};

  /**
   * Ici vous pouvez configurer les
   * les paramètres du Serveur distant;
   *
   **/ 
	var params = {
    	tab: [], 			//(A ne pas modifier)
    	secure:'https' 		//définir le protocole http sécurisé ou pas (http ou https)
	};

	//Cette variable va contenir la liste des modèles du tableau
	var tabModeles = [
	
		{titre:'client', model:'res.partner'},
		{titre:'notes', model:'note.note'},
		{titre:'stage_note', model:'note.stage'},
		{titre:'tag_note', model:'note.tag'},
		{titre:'contact', model:'res.partner'},
		{titre:'leads', model:'crm.lead'},
		{titre:'perte', model:'crm.lead.lost'},
		{titre:'reason', model:'crm.lost.reason'},
		{titre:'category', model:'crm.lead.tag'},
		{titre:'activite', model:'crm.activity'},
		{titre:'stage', model:'crm.stage'},
		{titre:'team', model:'crm.team'},
		{titre:'vendeurs', model:'hr.employee'},
		{titre:'offline', model:'res.users'},
		{titre:'user', model:'res.users'},
		{titre:'agenda', model:'calendar.event'},
		{titre:'tag_agenda', model:'calendar.event.type'},
		{titre:'remind', model:'calendar.alarm'},
		{titre:'invoice', model:'account.invoice'},
		{titre:'invoice-line', model:'account.invoice.line'},
		{titre:'country', model:'res.country'},
		{titre:'state', model:'res.country.state'},
		{titre:'title', model:'res.partner.title'},
		{titre:'etiquette', model:'res.partner.category'},
		{titre:'produit', model:'product.template'},
		{titre:'product', model:'product.product'},
		{titre:'unity', model:'product.uom'},
		{titre:'call', model:'crm.phonecall'},
		{titre:'channel', model:'mail.channel'},
		{titre:'vente', model:'sale.order'},
		{titre:'lines', model:'sale.order.line'},
		{titre:'tax', model:'account.tax'},
		{titre:'prime', model:'product.uom'},
		{titre:'analytic', model:'account.analytic.account'},
		{titre:'payment_term', model:'account.payment.term'},
		{titre:'account', model:'account.account'},
		{titre:'payment_method', model:'account.journal'},
		{titre:'currency', model:'res.currency'},
		{titre:'group', model:'res.groups'},
		{titre:'models', model:'ir.model.data'},
		{titre:'company', model:'res.company'},
		{titre:'event', model:'event.event'},
		{titre:'type_event', model:'event.type'},
		{titre:'ticket', model:'event.event.ticket'},
		{titre:'participant', model:'event.registration'},
		{titre:'sub', model:'sale.subscription'},
		{titre:'sub_line', model:'sale.subscription.line'},
		{titre:'purchase', model:'purchase.order'},
		{titre:'purchase_line', model:'purchase.order.line'},
		{titre:'followers', model:'mail.followers'},
		{titre:'message', model:'mail.message'},
		{titre:'mail', model:'mail.mail'},
		{titre:'attachment', model:'ir.attachment'}
		
	];

	//Cette variable contient les champs du modèle 
	var tab_fields_leads = ["active", "name", "planned_revenue", "probability", "partner_id", "email_from", "phone", "user_id", "team_id", "next_activity_id", "title_action", "date_deadline", "priority", "tag_ids", "title", "country_id", "state_id", "city", "description", "zip", "function", "fax", "type", "mobile", "partner_name", "date_open", "contact_name", "color", "stage_id",'in_call_center_queue','lost_reason','meeting_count','referred','company_currency','date_action','__last_update','order_ids','last_activity_id','create_date','write_date'];
	var tab_fields_team =  ["name", "use_leads", "use_opportunities", "use_quotations", "use_invoices", "code", "color", "resource_calendar_id", "working_hours", "invoiced_target", "user_id", "member_ids", "stage_ids",'__last_update'];
	var tab_fields_vendeurs = ['name','active','is_absent_totay','code','name_related','job_id','image_url','time_efficiency','mobile_phone','address_id','work_email','genre','birthdate','address_home_id','country_id','passport_id','identification_id','contracts_count','marital','children','user_id','resource_id','work_location','__last_update'];
	var tab_fields_produit = ['warranty','list_price','weight','sequence','color','write_uid','uom_id','description_purchase','create_date','create_uid','sale_ok','categ_id','product_manager','message_last_post','company_id','state','uom_po_id','description_sale','description','volume','write_date','active','rental','name','type','track_service','invoice_policy','description_picking','sale_delay','tracking','available_in_pos','pos_categ_id','to_weight','purchase_ok','purchase_method','produce_delay','deferred_revenue_category_id','asset_category_id','recurring_invoice','project_id','landed_cost_ok','split_method','event_type_id','event_ok','currency_id','qty_available','sales_count','image_url','__last_update', 'product_variant_ids','incoming_qty','outgoing_qty','default_code'];
	var tab_fields_call = ['name','partner_id','partner_phone','user_id','state','duration','categ_id','opportunity_id','date','team_id','partner_mobile','__last_update'];
	var tab_fields_note = ['name','open','stage_ids','stage_id','user_id','tag_ids','memo','color','create_date','write_date','__last_update', 'message_follower_ids'];
	var tab_fields_partner = ['comment','state_id','name','active','ref','middle_name','last_name','image_url','mobile','phone','email','street2','zip','city','street','fax','website','title','country_id','parent_id','lang','user_id','child_ids','category_id','company_type','function','meeting_ids','opportunity_ids','display_name','sale_order_ids','subscription_count','currency_id','total_invoiced','partner_ref','__last_update','invoice_ids','supplier'];
	var tab_fields_agenda = ['name','allday','start_datetime','stop_datetime','stop','start_date','stop_date','description','alarm_ids','categ_ids','active','user_id','color_partner_id','duration','opportunity_id','location','partner_ids','__last_update'];
	var tab_fields_channel = ['message_unread_counter','description','name','message_ids','message_partner_ids','channel_partner_ids','__last_update'];
	var tab_fields_message = ['model','date','message_type','write_date','body','channel_ids','author_id','subject','email_from','partner_ids','needaction', 'res_id', 'record_name','needaction_partner_ids','__last_update'];
	var tab_fields_mail = ['model','date','message_type','write_date','body','channel_ids','author_id','subject','email_from','partner_ids','needaction', 'res_id', 'mail_message_id','email_cc', 'email_to', '__last_update'];
	var tab_fields_vente = ['name','opportunity_id','partner_invoice_id','partner_shipping_id','picking_policy','warehouse_id','team_id','order_line','partner_id','date_order','user_id','note','currency_id','state','amount_tax','amount_untaxed','amount_total','create_date','write_date','payment_term_id','fiscal_position_id','validity_date','company_id','project_id','__last_update', 'product_id','invoice_status'];
	var tab_fields_lines = ['name','product_uom_qty','price_unit','discount','customer_lead','tax_id','currency_id','price_total','price_subtotal','product_id','price_reduce','price_tax','product_uom','order_id','invoice_lines','invoice_status','create_date','write_date','__last_update'];
	var tab_fields_invoice = ['name','date_due','date_invoice','number','reference_type','account_id','company_id','journal_id','amount_total','currency_id','state','payment_ids','residual','partner_id','user_id','amount_tax','amount_untaxed','payment_term_id','invoice_line_ids','team_id','__last_update','sent','create_date','write_date'];
	var tab_fields_line_invoice = ['name','invoice_id','product_id','account_id','price_unit','partner_id','quantity','price_subtotal','currency_id','invoice_line_tax_ids','__last_update'];
	var tab_fields_event = ['name','active','address_id','organizer_id','event_type_id','date_begin','date_end','state','date_tz','seats_min','seats_availability','seats_max','event_ticket_ids','seats_available','user_id','seats_reserved','seats_expected','seats_unconfirmed','seats_used','registration_ids','__last_update'];
	var tab_fields_ticket = ['name','is_expired','event_id','seats_availability','deadline','product_id','price','price_reduce','seats_min','seats_max','seats_available','user_id','seats_reserved','seats_expected','seats_unconfirmed','seats_used','registration_ids','__last_update'];
	var tab_fields_participant = ['name','phone','email','partner_id','event_id','event_ticket_id','date_open','date_closed','user_id','state','origin','sale_order_id','__last_update'];
	var tab_fields_sub = ['name','code','partner_id','recurring_next_date','template_id','manager_id','date_start','recurring_invoice_line_ids','recurring_rule_type','currency_id','recurring_total','user_id', 'state','__last_update'];
	var tab_fields_sub_line = ['name','uom_id','product_id','analytic_account_id','price_unit','actual_quantity','quantity','price_subtotal','sold_quantity','discount','__last_update'];
	var tab_fields_group = ['name','display_name','users','color'];
	var tab_fields_models = ['name','res_id','__last_update','model'];
	var tab_fields_attachment = ['name','res_id','res_model','website_url', 'company_id'];
	var tab_fields_purchase = ['name','date_order','state','amount_untaxed','amount_tax','amount_total','order_line','product_id','product_qty','price_unit','date_planned','partner_id','payment_term_id','fiscal_position_id','picking_type_id'];
	var tab_fields_order_lines = ['name','product_id','product_qty','price_unit','taxes_id','date_planned','invoice_lines','product_uom'];

	/**
	 * Cette fonction permet de filtrer
	 * les requêtes d'un utilisateur spécifique
	 * @param login_id, client qui s'est connecté à l'appli
	 *
	 * @return filters <Array>, retourne un tableau de filtre
	 **/
	function requetUniqUser(login_id){
		
		var domain_filter = [];

		var id = parseInt(login_id);

		domain_filter.push(new xmlrpcval('user_id',"string"));
	    domain_filter.push(new xmlrpcval('=',"string"));
	    domain_filter.push(new xmlrpcval(id,"int"));

	    return domain_filter;
	}

	/**
	 * This method is used to retrieve email
	 * sent by user
	 */
	function requetFilterMail(id){

		var domain_filter = [];

		domain_filter.push(new xmlrpcval('author_id',"string"));
	    domain_filter.push(new xmlrpcval('=',"string"));
	    domain_filter.push(new xmlrpcval(id,"int"));

	    return domain_filter;
	}

	/**
	 * Cette fonction permet de filtrer l'utilisateur
	 * ayant l'identifiant login_id
	 * @param login_id, client qui s'est connecté à l'appli
	 *
	 * @return filters <Array>, retourne un tableau de filtre
	 *
	 **/
	function requetFilterUser(login_id){
		
		var domain_filter = [];

		domain_filter.push(new xmlrpcval('id',"string"));
	    domain_filter.push(new xmlrpcval('=',"string"));
	    domain_filter.push(new xmlrpcval(login_id,"int"));

	    return domain_filter;	
	}

	/**
	 * Cettte fonction permet de construire la requete XML RPC
	 * sur un modèle
	 * @param type_user string, le nom du modèle (table)
	 * @param login_id number, l'identifiant de l'utilisateur connecté
	 * @param affaire JSON object, l'objet JSON des filtres
	 * @param objFiltre JSON object, l'objet JSON des filtres
	 */
	function buildSearchRequest(type_user, login_id, affaire, objFiltre){

		var domain_filter = [], domain_filter2 = [];
		var domain_filters = [];

		if(type_user=='client' || type_user=='res_client'){
	    	domain_filter = requetFilterClient();
	    }else if(type_user=='contact' || type_user=='res_contact'){
	    	domain_filter = requetFilterContact();
		}else if(type_user=='vendeurs'){
	    	domain_filter = requetFilterEmployee();
	    }else if(type_user=='offline'){
	    	domain_filter = requetFilterUser(login_id);
	    }else if(type_user=='leads'){
	    	domain_filter = requetFilterLeads();
	    }else if(type_user=='user'){
	    	domain_filter = requetFilterListUsers('actif');
	    	domain_filter2 = requetFilterListUsers('share');
	    }else if(type_user=='invoice'){
	    	domain_filter = requetFilterInvoices(affaire);
	    }else if(type_user=='notes'){
	    	domain_filter = requetFilterCall(login_id);
	    }else if(type_user == 'message'){
			domain_filter = requetFilterMessage(objFiltre);
		}else if(type_user == 'models'){
			domain_filter = requetFilterModels(objFiltre);
		}else if(type_user == 'mail'){
			domain_filter = requetFilterMail(login_id);
		}else{
			domain_filter = requetFilterNature(type_user);
		}

	    //Create un tableau de filtre
	    domain_filters.push(new xmlrpcval(domain_filter, "array"));

	    //Filtre de recherche
	    if(objFiltre){
			
			if(objFiltre.last_update!==undefined){
				domain_filters.push(new xmlrpcval(searchFilterLast(objFiltre, type_user), "array"));
			}

			if(objFiltre.ids!==undefined){
				domain_filters.push(new xmlrpcval(searchFilterTabs(objFiltre, type_user), "array"));
			}

	    	switch(type_user){

	    		case 'user':{
	    			domain_filters.push(new xmlrpcval(searchFilterUser(login_id), "array"));
	    			break;
				}
				case 'attachment':{
					for(var filter in objFiltre)
						domain_filters.push(new xmlrpcval(requetFilterAttachment(filter, objFiltre[filter]), "array"));		
	    			break;
	    		}

	    	}

	    }
	    
	    //filtre sur le contact
	    if(type_user=='user')
			domain_filters.push(new xmlrpcval(domain_filter2,"array"));
			
		return domain_filters;

	}
	
	/**
	 * Cette fonction permet de filtrer l'utilisateur
	 * ayant l'identifiant login_id
	 * @param login_id, client qui s'est connecté à l'appli
	 *
	 * @return filters <Array>, retourne un tableau de filtre
	 *
	 **/
	function requetFilterCall(login_id){
		
		var domain_filter = [];

		domain_filter.push(new xmlrpcval('id',"string"));
	    domain_filter.push(new xmlrpcval('!=',"string"));
	    domain_filter.push(new xmlrpcval(0,"int"));

	    return domain_filter;	
	}

	/**
	 * Cette fonction permet de récupérer la liste
	 * des utilisateurs étant actifs
	 * 
	 * @param type sting, il s'agit d'un type de requête
	 * @return filters <Array>, retourne un tableau de filtre
	 *
	 **/
	function requetFilterListUsers(type){

		var domain_filter = [];
		switch(type){
			case 'actif':{
				domain_filter.push(new xmlrpcval('active',"string"));
			    domain_filter.push(new xmlrpcval('=',"string"));
			    domain_filter.push(new xmlrpcval(true,"boolean"));
				break;
			}
			case 'share':{
				domain_filter.push(new xmlrpcval('share',"string"));
			    domain_filter.push(new xmlrpcval('!=',"string"));
			    domain_filter.push(new xmlrpcval(true,"boolean"));
				break;
			}
		}

	    return domain_filter;
	}

	/**
	 * Cette fonction permet de récupérer la 
	 * la liste des utilisateurs excluant celui qui est connecté
	 **/
	function searchFilterUser(login_id){

		var domain_filter = [];

		domain_filter.push(new xmlrpcval('id',"string"));
	    domain_filter.push(new xmlrpcval('!=',"string"));
	    domain_filter.push(new xmlrpcval(login_id,"int"));

	    return domain_filter;
	}
	
	/**
	 * Cette fonction permet de récupérer la 
	 * la liste des enregistrements mis à jour à une date précise
	 * @param obj_date JSONObject, date de mise à jour
	 * @param nom_table string
	 **/
	function searchFilterLast(obj_date, nom_table){

		let la_date = new Date(obj_date.last_update), 
			mois = la_date.getUTCMonth() +1, strMois,
			jour = la_date.getUTCDate(), strJour,
			minutes = la_date.getUTCMinutes(), strMins, 
			secondes = la_date.getUTCMilliseconds(), strSeconds, 
			hours = la_date.getUTCHours(), strHours;
		
		if(mois<10) strMois = '0'+mois; else strMois = mois;
		if(jour<10) strJour = '0'+jour; else strJour = jour;
		if(minutes<10) strMins = '0'+minutes; else strMins = minutes;
		if(secondes<10) strSeconds = '0'+secondes; else strSeconds = secondes;
		if(hours<10) strHours = '0'+hours; else strHours = hours;

		let last_date = la_date.getUTCFullYear()+"-"+strMois+"-"+strJour+" "+strHours+":"+strMins+":"+strSeconds;

		var domain_filter = [];
		if(nom_table!="followers")
			domain_filter.push(new xmlrpcval('write_date',"string"));
		else
			domain_filter.push(new xmlrpcval('__last_update',"string"));

	    domain_filter.push(new xmlrpcval('>=',"string"));
	    domain_filter.push(new xmlrpcval(last_date,"string"));

	    return domain_filter;
	}

	/**
	 * This filter help to retrieve
	 * id data form the specific in tab
	 */
	function searchFilterTabs(filtre, type){

		var domain_filter = [];

		tabs = Odoo.formatIdsToXml(filtre.ids);

		domain_filter.push(new xmlrpcval('id',"string"));
	    domain_filter.push(new xmlrpcval('in',"string"));
	    domain_filter.push(new xmlrpcval(tabs,"array"));

	    return domain_filter;	
	}

	/** 
	 * Cette fonction récupère la liste des clients, contacts ou tribunal
	 * qui correspondent au critère name
	 * @param name string, l'expression à rechercher
	 *
	 **/
	 function searchPartner(name){
	 	
	 	var expr = '%'+name+'%';
	 	var domain_filter = [];

		domain_filter.push(new xmlrpcval('display_name',"string"));
	    domain_filter.push(new xmlrpcval('ilike',"string"));
	    domain_filter.push(new xmlrpcval(expr,"string"));

	    return domain_filter;
	 }


	/**
	 * Cette fonction permet de définir
	 * le nombre de groupby à afficher
	 **/
	function isLazy(){

		var domain_filter = [];

		domain_filter.push(new xmlrpcval('lazy',"string"));
	    domain_filter.push(new xmlrpcval('=',"string"));
	    domain_filter.push(new xmlrpcval(true,"boolean"));

	    return domain_filter;	
	}

	/**
	 * Cette fonction permet de filtrer
	 * les requêtes du client
	 *
	 * @return filters <Array>, retourne un tableau de filtre
	 **/
	function requetFilterClient(){
		
		var domain_filter = [];

		domain_filter.push(new xmlrpcval('customer',"string"));
	    domain_filter.push(new xmlrpcval('=',"string"));
	    domain_filter.push(new xmlrpcval('True',"string"));

	    return domain_filter;
	}

	
	/**
	 * Cette fonction permet de filtrer
	 * les requêtes des contacts
	 *
	 * @return filters <Array>, retourne un tableau de filtre
	 **/
	function requetFilterContact(){
		
		var domain_filter = [];

		domain_filter.push(new xmlrpcval('customer',"string"));
	    domain_filter.push(new xmlrpcval('!=',"string"));
	    domain_filter.push(new xmlrpcval('True',"string"));

	    return domain_filter;
	}
	function requetFilterContact2(){

		var domain_filter = [];

		domain_filter.push(new xmlrpcval('court',"string"));
	    domain_filter.push(new xmlrpcval('!=',"string"));
	    domain_filter.push(new xmlrpcval('True',"string"));

	    return domain_filter;
	}

	/**
     * Filtre sur la liste des messages par
     * channels
     * @param filtre Array<int>, les ids des channels
     *
     **/
	function requetFilterMessage(filtre){

		var domain_filter = [], login_id = 0, tabs = [];

		if(filtre!=null){
			
			//On formate les données
			//tabs.push(filtre.partner_id.id);
			tabs = Odoo.formatIdsToXml(filtre);
			
			domain_filter.push(new xmlrpcval('channel_ids',"string"));
			domain_filter.push(new xmlrpcval('in',"string"));
			domain_filter.push(new xmlrpcval(tabs,"array"));
		}
			
	   return domain_filter;
	}
	
	/**
     * Filtre sur la liste des modèles en
     * fonction des valeurs xml_ids fournit par filtre
     * @param filtre Array<int>, les xml_ids
     *
     **/
	function requetFilterModels(filtre){

		var domain_filter = [], login_id = 0, tabs = [];

		if(filtre!=null){
			
			tabs = Odoo.formatStringToXml(filtre);
			
			domain_filter.push(new xmlrpcval('name',"string"));
			domain_filter.push(new xmlrpcval('in',"string"));
			domain_filter.push(new xmlrpcval(tabs,"array"));
		}
			
	   return domain_filter;
	}

	/**
	 * Cette fonction permet de récupérer
	 * un champ commun aux modèles
	 * @param nom string, nom du champ
	 *
	 **/
	function selectCommonField(nom){

		var champs =[];

		champs.push(new xmlrpcval(nom, "string"));

		return champs;
	}


	/**
	 * Cette fonction permet de récupérer les 
	 * champs la liste des champs dans le tableau
	 *
	 * @param tab_champs Array<String>, liste des champs à récuperer
	 *
	 **/
	function selectFieldsPartner(tab_champs){

		var champs =[];

		for (var i = 0; i < tab_champs.length; i++) 
			champs.push(new xmlrpcval(tab_champs[i], "string"));
		
		return champs;
	}

	/**
	 * Cette fonction permet de définir les champs
	 * à afficher pour l'utilisateur connecté
	 *
	 **/
	function selectListFieldsUser(){

		var champs = [];

	    champs.push(new xmlrpcval("image_url", "string"));
	    champs.push(new xmlrpcval("partner_id", "string"));
	    champs.push(new xmlrpcval("company_id", "string"));
	    champs.push(new xmlrpcval("currency_id", "string"));
	    champs.push(new xmlrpcval("display_name", "string"));
	    champs.push(new xmlrpcval("sale_team_id", "string"));
	    champs.push(new xmlrpcval("name", "string"));
	    champs.push(new xmlrpcval("login", "string"));
	    champs.push(new xmlrpcval("city", "string"));
	    champs.push(new xmlrpcval("country_id", "string"));
	    champs.push(new xmlrpcval("state_id", "string"));
	    champs.push(new xmlrpcval("login_date", "string"));
	    champs.push(new xmlrpcval("mobile", "string"));
	    champs.push(new xmlrpcval("email", "string"));
	    champs.push(new xmlrpcval("lang", "string"));
	    champs.push(new xmlrpcval("signature", "string"));
	    champs.push(new xmlrpcval("tz", "string"));
	    champs.push(new xmlrpcval("notify_email", "string"));
	    champs.push(new xmlrpcval("meeting_ids", "string"));
	    champs.push(new xmlrpcval("invoice_ids", "string"));
	    champs.push(new xmlrpcval("opportunity_ids", "string"));
	    champs.push(new xmlrpcval("groups_id", "string"));
	    champs.push(new xmlrpcval("__last_update", "string"));
	    champs.push(new xmlrpcval("target_sales_invoiced", "string"));
	    champs.push(new xmlrpcval("target_sales_won", "string"));
	    champs.push(new xmlrpcval("target_sales_done", "string"));
	    
		return champs;	
	}

	/**
	 * Cette fonction permet de définir de mettre à jour
	 * les données de l'utilisateur
	 * @param obj User, 
	 *
	 **/
	function setDataUserToUpdate(obj){

		var values = {
   				
				'name': new xmlrpcval(obj.name, "string"),
				'lang': new xmlrpcval(obj.lang.id, "string"),
				'tz': new xmlrpcval(obj.tz.id, "string"),
				'notify_email': new xmlrpcval(obj.notify_email.id , "string"),
				'signature': new xmlrpcval(obj.signature, "string")
   			};

	   	return values;
	}

	/**
	 * Cette fonction définit les données clients qui seront
	 * mise à jour dans la bd
	 * @param obj <Array Litteral>, contenant les données 
	 * @param type string, le type d'objet
	 * @param id int, l'identifiant du user connecté
	 *
	 * @return <Array Litteral>
	 **/
	function setDataClientToUpdate(obj, type, id){
		
		console.log(obj);
		var values = {};

		if(obj.id==0){
			if(type=='client')
				values['customer'] = new xmlrpcval(true, "boolean");
			else if(type=='contact')
				values['customer'] = new xmlrpcval(false, "boolean");
		}

		//Gestion du calendrier et des autres date
		if(type=='agenda' && obj.allday!==undefined){
			
			if(!obj.allday){
				obj.stop_datetime = getStopTime(new Date(obj.start_datetime.replace('T',' ')), parseFloat(obj.duration));
			}

			if(obj.allday){
				values['start_date'] = new xmlrpcval(obj.start_date, "string");
				values['stop_date'] = new xmlrpcval(obj.stop_date, "string");
			}else{
				values['start_datetime']= new xmlrpcval(formatUTF(obj.start_datetime.replace('T',' ')), "string");
				values['start'] = new xmlrpcval(formatUTF(obj.start_datetime.replace('T',' ')), "string");
				values['stop'] = new xmlrpcval(formatUTF(obj.stop_datetime), "string");
				values['duration'] = new xmlrpcval(parseFloat(obj.duration), "double");
			}
		}else if(type=='call' && obj.date!==undefined){
			values['date'] = new xmlrpcval(formatUTF(obj.date), "string");
		}else if(type=='event' && (obj.date_begin!==undefined || obj.date_end!==undefined)){
			values['date_begin'] = new xmlrpcval(formatUTF(obj.date_begin), "string");
			values['date_end'] = new xmlrpcval(formatUTF(obj.date_end), "string");
		}
		//End of Agenda time
 
		for(var elt in obj){
			
			if(obj[elt]!==undefined && elt!='id' && elt!='bg' && elt!='write_date' && elt!='create_date' && elt!='idx'){
 
				if(Array.isArray(obj[elt]) && obj[elt].length!=0){
					values[elt] = new xmlrpcval(setManyToMany(obj[elt]), "array");
				}else if(typeof obj[elt] === 'object' && obj[elt]!=null && parseInt(obj[elt].id)!=0)
					values[elt] = new xmlrpcval(parseInt(obj[elt].id), "int");
				else if(typeof obj[elt] === 'boolean')
					values[elt] = new xmlrpcval(obj[elt], "boolean");
				else if(typeof obj[elt] === 'string' && obj[elt]!="" && elt!="start_datetime" && elt!="stop_datetime" && elt!="date" && elt!="date_begin" && elt!="date_end" && elt!='obj_type')
					values[elt] = new xmlrpcval(obj[elt], "string");
				else if(typeof obj[elt] === 'number' && Number.isInteger(obj[elt]) && obj[elt]!=0)
					values[elt] = new xmlrpcval(obj[elt], "int");
				else if(typeof obj[elt] === 'number' && !Number.isInteger(obj[elt]) && obj[elt]!=0)
					values[elt] = new xmlrpcval(parseFloat(obj[elt]), "double");
				else if(elt=='user_id' && id!=0)
					values[elt] = new xmlrpcval(parseInt(id), "int");
			}
		}
		
		return values;

	}

	/**
	 * Cette fonction permet d'appliquer les options 
	 * sur une liste d'objets
	 *
	 * @param options JSON, contenant les données offset et valeur max
	 *
	 **/
	 function domain_options(options){

	 	var values =  {
	   				'offset':new xmlrpcval(options.offset , "int"),
	   				'limit': new xmlrpcval(options.max, "int")
   				};

	   	return values;	
	 }

	/**=============================================================
	 * DEFINTION DES FONCTIONS DE LA CLASSE ODOO
	 * 
	 *==============================================================*/

	/* Cette fonction permet d'authentifier l'utilisateur
	 * aux webs services API XML RPC
	 * Elle retourne un objet (JSON)
	 * @param hosting Array = configuration serveur (port, url, server ip)
	 * @param username string = pseudo de l'utilisateur
	 * @param password string = mot passe de l'utilisateur
	 * @return callback (retourne une fonction de retour ayant en paramètre la réponse du serveur)
	 */
	Odoo.authenticate = function(hosting, username, password, callback){

	 /**
	 * Cette fonction permet d'établir la communication avec Odoo
	 * Cet objet est utilisé pour authentifier un utilisateur
	 **/
  	 var connexion = new xmlrpc_client('xmlrpc/2/common', hosting.url, hosting.port, params.secure);
	  
	  //On définit la requête du client
	  var c_msg = new xmlrpcmsg('authenticate');
	  c_msg.addParam(new xmlrpcval(hosting.database, "string"));
	  c_msg.addParam(new xmlrpcval(username, "string"));
	  c_msg.addParam(new xmlrpcval(password, "string"));
	  c_msg.addParam(new xmlrpcval(params.tab, "array"));
	  
	  //var c_response = connexion.send(c_msg);
	  return connexion.send(c_msg, 0, function(res){
	  			//console.log(res);
				callback(res);
		});
	  
	};

	/** Cette fonction permet de supprimer un objet
	 *
	 * @param hosting Array = configuration serveur (port, url, server ip, uid, login, pwd)
	 * @param ids_list array (list des ids (une seul entrée) = utilisateur connecté)
	 * @param type string, la nature de l'objet
	 * @param objLogin Object, l'utilisateur connecté
	 *
	 * @return callback (reponse)
	 ***/
	Odoo.delete = function(hosting, objLogin, type, ids_list, callback){

		var uid = parseInt(hosting.userID);
	    
	    //Then, the read() method is executed:
	    var objCon = new xmlrpc_client('xmlrpc/2/object', hosting.url, hosting.port, params.secure);
	    var readmsg = new xmlrpcmsg('execute'); 
	    
	    readmsg.addParam(new xmlrpcval(hosting.database, "string")); 
	    readmsg.addParam(new xmlrpcval(uid, "int")); 
	    readmsg.addParam(new xmlrpcval(hosting.passswd, "string"));

	    if(type=='user')
	    	readmsg.addParam(new xmlrpcval("res.users", "string"));
	    else
	    	readmsg.addParam(new xmlrpcval("res.partner", "string"));

	    readmsg.addParam(new xmlrpcval("unlink", "string")); 
	    readmsg.addParam(new xmlrpcval(ids_list, "array"));
	    
		return objCon.send(readmsg, 0, function(res){
			callback(res);
		});
	};

	/** Cette fonction permet de définir des requêtes au niveau de la base de données
	 * @param hosting Array = configuration serveur (port, url, server ip, login, pwd, uid)
	 * @param objLogin , l'objet utilisateur qui s'est connecté à l'appli
	 * @param type_user string, utile pour personnalisé les requêtes
	 * @param objFiltre JSONObject, utilisé pour effectué des recherches en fonction des   
	                                critères
	 * 
	 * @return Object
	 */
	Odoo.reqListObjets = function(hosting, objLogin, objFiltre, type_user, callback){
		
		var domain_filters = [], domain_filter = [], domain_filter2 = [];
		var affaire = 0;
		var options = null;
		var name = '';
	    var uid = parseInt(hosting.userID);
	    var login_id = objLogin.uid;

	    if(hosting.affaire !== undefined){
	    	if(hosting.affaire.options===undefined)
	    		affaire = parseInt(hosting.affaire);
	    	else if(hosting.affaire.options!==undefined)
	    		options = hosting.affaire.options;
	    	
	    	if(hosting.affaire.search!==undefined){
	    		name = hosting.affaire.search;
	    	}
	    }
	    
	    //On construit la requete Odoo
		domain_filters = buildSearchRequest(type_user, login_id, affaire, objFiltre);
	    
	    //connexion au client pour l'execution des requêtes (object)
	    var objCon = new xmlrpc_client('xmlrpc/2/object', hosting.url, hosting.port, params.secure);
	    var msg = new xmlrpcmsg('execute'); 
	    
	    msg.addParam(new xmlrpcval(hosting.database, "string")); 
	    msg.addParam(new xmlrpcval(objLogin.uid, "int")); 
	    msg.addParam(new xmlrpcval(objLogin.password, "string")); 
	    
	    //On choisit le modèle en fonction de l'objet
	    for (var i = 0; i < tabModeles.length; i++) {
	    	
	    	if(type_user==tabModeles[i].titre) {
	    		msg.addParam(new xmlrpcval(tabModeles[i].model, "string"));
	    		break;
	    	}
	    }
	    
	    msg.addParam(new xmlrpcval("search", "string")); 
	    msg.addParam(new xmlrpcval(domain_filters, "array"));

	    //Optional parameters
	    if(options!=null){
	    	msg.addParam(new xmlrpcval(options.offset, "int"));
	    	msg.addParam(new xmlrpcval(options.max, "int"));
	    }
	    
		return objCon.send(msg, 0, function(res){
				callback(res);
		});
		
	};

	/** Cette fonction permet de Lister ou récuperer les objets de la BD
	 *
	 * @param hosting Array = configuration serveur (port, url, server ip, uid, login, pwd)
	 * @param ids_list array (list des ids des clients, tribunaux, contacts, ...)
	 * @param objet string - nom de l'objet (client, tribunal, contact)
	 * @param objLogin - l'objet utilisateur connecté
	 *
	 * @return Array<Object>
	 ***/
	Odoo.listObjets = function(hosting, objLogin, ids_list, objet, callback){

		//Create list of fields that You want to read
	    var field_list = [];
	    var uid = parseInt(hosting.userID);
	    
	    if(objet=='client' || objet=='contact'){
	    	field_list = selectFieldsPartner(tab_fields_partner);
	    }else if (objet=='res_client' || objet=='res_contact'){
	    	field_list = selectFieldsPartner(['display_name','image_url']);
	    }else if (objet=='followers'){
	    	field_list = selectFieldsPartner(['partner_id','res_id']);
	    }else if(objet=="lang" || objet=='category'  || objet=='reason' || objet=='tag_agenda' || objet=='remind' || objet=='stage' || objet=='country' || objet=='state' || objet=='title' || objet=='perte' || objet=='etiquette' || objet=='activite' || objet=='stage_note' || objet=='tag_note' || objet=='unity' || objet=='tax' || objet=='prime' || objet=='analytic' || objet=='payment_term' || objet=='currency' || objet=='taxes' || objet=='company' || objet=='account' || objet== 'payment_method' || objet== 'type_event'){
	    	field_list = selectListFieldsNature(objet);
	    }else if(objet=="vendeurs"){
	    	field_list = selectFieldsPartner(tab_fields_vendeurs)
	    }else if(objet=="user"){
	    	field_list = selectListFieldsUser();
	    }else if(objet == "agenda"){
	    	field_list = selectFieldsPartner(tab_fields_agenda);
	    }else if(objet == "leads"){
	    	field_list = selectFieldsPartner(tab_fields_leads);
	    }else if(objet == "team"){
	    	field_list = selectFieldsPartner(tab_fields_team);
	    }else if(objet == "produit"){
	    	field_list = selectFieldsPartner(tab_fields_produit);
	    }else if(objet == "call"){
	    	field_list = selectFieldsPartner(tab_fields_call);
	    }else if(objet == "notes"){
	    	field_list = selectFieldsPartner(tab_fields_note);
	    }else if(objet == "channel"){
	    	field_list = selectFieldsPartner(tab_fields_channel);
	    }else if(objet == "message"){
	    	field_list = selectFieldsPartner(tab_fields_message);
	    }else if(objet == "vente"){
	    	field_list = selectFieldsPartner(tab_fields_vente);
	    }else if(objet == "lines"){
	    	field_list = selectFieldsPartner(tab_fields_lines);
	    }else if(objet == "invoice"){
	    	field_list = selectFieldsPartner(tab_fields_invoice);
	    }else if(objet == "invoice-line"){
	    	field_list = selectFieldsPartner(tab_fields_line_invoice);
	    }else if(objet == "event"){
	    	field_list = selectFieldsPartner(tab_fields_event);
	    }else if(objet == "ticket"){
	    	field_list = selectFieldsPartner(tab_fields_ticket);
	    }else if(objet == "participant"){
	    	field_list = selectFieldsPartner(tab_fields_participant);
	    }else if(objet == "sub"){
	    	field_list = selectFieldsPartner(tab_fields_sub);
	    }else if(objet == "sub_line"){
	    	field_list = selectFieldsPartner(tab_fields_sub_line);
	    }else if(objet == "group"){
	    	field_list = selectFieldsPartner(tab_fields_group);
	    }else if(objet == "models"){
	    	field_list = selectFieldsPartner(tab_fields_models);
	    }

	    //Then, the read() method is executed:
	    var objCon = new xmlrpc_client('xmlrpc/2/object', hosting.url, hosting.port, params.secure);
	    var readmsg = new xmlrpcmsg('execute'); 
	    
	    readmsg.addParam(new xmlrpcval(hosting.database, "string")); 
	    readmsg.addParam(new xmlrpcval(objLogin.uid, "int")); 
	    readmsg.addParam(new xmlrpcval(objLogin.password, "string"));

	    for (var i = 0; i < tabModeles.length; i++) {
	    	
	    	if(objet==tabModeles[i].titre) {
	    		readmsg.addParam(new xmlrpcval(tabModeles[i].model, "string"));
	    		break;
	    	}
	    }

	    readmsg.addParam(new xmlrpcval("read", "string")); 
	    readmsg.addParam(new xmlrpcval(ids_list, "array"));
		readmsg.addParam(new xmlrpcval(field_list, "array"));

		//Ce paramètre permet de configurer la langue de l'utilisateur connecté
		readmsg.addParam(new xmlrpcval({ 'lang': new xmlrpcval(objLogin.lang, "string") }, "struct"));

		return objCon.send(readmsg, 0, function(res){
			callback(res);
		});
	};
	
	/** 
	 * Cette fonction permet de Lister ou récuperer les objets de la BD
	 *
	 * @param hosting Array = configuration serveur (port, url, server ip, uid, login, pwd)
	 * @param objLogin array (list des ids des clients, tribunaux, contacts, ...)
	 * @param objet string - nom de l'objet (client, tribunal, contact)
	 *
	 * @return Array<Object>
	 ***/
	Odoo.getListObjets = function(hosting, objLogin, objFiltre, objet, callback){

		//Create list of fields that You want to read
		var field_list = [];
		var domain_filters = [];
		var affaire = 0;
		var uid = parseInt(hosting.userID);
		var login_id = objLogin.uid;
		
		if(hosting.affaire !== undefined){
	    	if(hosting.affaire.options===undefined)
	    		affaire = parseInt(hosting.affaire);
	    	else if(hosting.affaire.options!==undefined)
	    		options = hosting.affaire.options;
	    	
	    	if(hosting.affaire.search!==undefined){
	    		name = hosting.affaire.search;
	    	}
		}
		
		//On construit la requete Odoo
		domain_filters = buildSearchRequest(objet, login_id, affaire, objFiltre);
	    
	    if(objet=='client' || objet=='contact'){
	    	field_list = selectFieldsPartner(tab_fields_partner);
	    }else if (objet=='res_client' || objet=='res_contact'){
	    	field_list = selectFieldsPartner(['display_name','image_url']);
	    }else if (objet=='followers'){
	    	field_list = selectFieldsPartner(['partner_id','res_id']);
	    }else if(objet=="lang" || objet=='category'  || objet=='reason' || objet=='tag_agenda' || objet=='remind' || objet=='stage' || objet=='country' || objet=='state' || objet=='title' || objet=='perte' || objet=='etiquette' || objet=='activite' || objet=='stage_note' || objet=='tag_note' || objet=='unity' || objet=='tax' || objet=='prime' || objet=='analytic' || objet=='payment_term' || objet=='currency' || objet=='taxes' || objet=='company' || objet=='account' || objet== 'payment_method' || objet== 'type_event'){
	    	field_list = selectListFieldsNature(objet);
	    }else if(objet=="vendeurs"){
	    	field_list = selectFieldsPartner(tab_fields_vendeurs)
	    }else if(objet=="user"){
	    	field_list = selectListFieldsUser();
	    }else if(objet == "agenda"){
	    	field_list = selectFieldsPartner(tab_fields_agenda);
	    }else if(objet == "leads"){
	    	field_list = selectFieldsPartner(tab_fields_leads);
	    }else if(objet == "team"){
	    	field_list = selectFieldsPartner(tab_fields_team);
	    }else if(objet == "produit"){
	    	field_list = selectFieldsPartner(tab_fields_produit);
	    }else if(objet == "call"){
	    	field_list = selectFieldsPartner(tab_fields_call);
	    }else if(objet == "notes"){
	    	field_list = selectFieldsPartner(tab_fields_note);
	    }else if(objet == "channel"){
	    	field_list = selectFieldsPartner(tab_fields_channel);
	    }else if(objet == "message"){
	    	field_list = selectFieldsPartner(tab_fields_message);
	    }else if(objet == "vente"){
	    	field_list = selectFieldsPartner(tab_fields_vente);
	    }else if(objet == "lines"){
	    	field_list = selectFieldsPartner(tab_fields_lines);
	    }else if(objet == "invoice"){
	    	field_list = selectFieldsPartner(tab_fields_invoice);
	    }else if(objet == "invoice-line"){
	    	field_list = selectFieldsPartner(tab_fields_line_invoice);
	    }else if(objet == "event"){
	    	field_list = selectFieldsPartner(tab_fields_event);
	    }else if(objet == "ticket"){
	    	field_list = selectFieldsPartner(tab_fields_ticket);
	    }else if(objet == "participant"){
	    	field_list = selectFieldsPartner(tab_fields_participant);
	    }else if(objet == "sub"){
	    	field_list = selectFieldsPartner(tab_fields_sub);
	    }else if(objet == "sub_line"){
	    	field_list = selectFieldsPartner(tab_fields_sub_line);
	    }else if(objet == "group"){
	    	field_list = selectFieldsPartner(tab_fields_group);
	    }else if(objet == "models"){
	    	field_list = selectFieldsPartner(tab_fields_models);
	    }else if(objet == "purchase"){
	    	field_list = selectFieldsPartner(tab_fields_purchase);
	    }else if(objet == "purchase_line"){
	    	field_list = selectFieldsPartner(tab_fields_order_lines);
	    }else if(objet == "mail"){
	    	field_list = selectFieldsPartner(tab_fields_mail);
	    }else if(objet == "attachment"){
	    	field_list = selectFieldsPartner(tab_fields_attachment);
	    }

	    //Then, the read() method is executed:
	    var objCon = new xmlrpc_client('xmlrpc/2/object', hosting.url, hosting.port, params.secure);
	    var readmsg = new xmlrpcmsg('execute'); 
	    
	    readmsg.addParam(new xmlrpcval(hosting.database, "string")); 
	    readmsg.addParam(new xmlrpcval(objLogin.uid, "int")); 
	    readmsg.addParam(new xmlrpcval(objLogin.password, "string"));

	    for (var i = 0; i < tabModeles.length; i++) {
	    	
	    	if(objet==tabModeles[i].titre) {
	    		readmsg.addParam(new xmlrpcval(tabModeles[i].model, "string"));
	    		break;
	    	}
	    }

		readmsg.addParam(new xmlrpcval("search_read", "string")); 
		readmsg.addParam(new xmlrpcval(domain_filters, "array"));
		readmsg.addParam(new xmlrpcval(field_list, "array"));

		//Ce paramètre permet de configurer la langue de l'utilisateur connecté
		// readmsg.addParam(new xmlrpcval({ 'lang': new xmlrpcval(objLogin.lang, "string") }, "struct"));

		return objCon.send(readmsg, 0, function(res){
			callback(res);
		});
	};


	/* Cette fonction permet de récupérer un champ spécifique
	 *
	 * @param hosting Array = configuration serveur (port, url, server ip, uid, login, pwd)
	 * @param ids_list array (list des ids des clients, tribunaux, contacts, ...)
	 * @param objet string - nom de l'objet (client, tribunal, contact)
	 * @param objLogin - l'objet utilisateur connecté
	 * @param champ string, champ à récupérer
	 *
	 * @return Array<Object>
	 ***/
	Odoo.getChampObjet = function(hosting, objLogin, ids_list, objet, champ, callback){

		//Create list of fields that You want to read
	    var field_list = [];
	    var uid = parseInt(hosting.userID);
	    
	    field_list = selectCommonField(champ);
	    
	    //Then, the read() method is executed:
	    var objCon = new xmlrpc_client('xmlrpc/2/object', hosting.url, hosting.port, params.secure);
	    var readmsg = new xmlrpcmsg('execute'); 
	    
	    readmsg.addParam(new xmlrpcval(hosting.database, "string")); 
	    readmsg.addParam(new xmlrpcval(objLogin.uid, "int")); 
	    readmsg.addParam(new xmlrpcval(objLogin.password, "string"));
	    
	    for (var i = 0; i < tabModeles.length; i++) {
	    	
	    	if(objet==tabModeles[i].titre) {
	    		readmsg.addParam(new xmlrpcval(tabModeles[i].model, "string"));
	    		break;
	    	}
	    }
	    
	    readmsg.addParam(new xmlrpcval("read", "string")); 
	    readmsg.addParam(new xmlrpcval(ids_list, "array"));
	    readmsg.addParam(new xmlrpcval(field_list, "array"));

	    //console.log(objRes);
		return objCon.send(readmsg, 0, function(res){
			callback(res);
		});
	};


	/** Cette fonction permet de modifier un objet (client, tribunal, contact)
	 * 
	 * @param hosting Array = configuration serveur (port, url, server ip, uid, login, pwd)
	 * @param objLogin Object = paramètres de l'utilisateur connecté
	 * @param type string (le type d'objet, client, tribunal, contact)
	 * @param idObj int (id de l'objet dont on souhaite modifier les infos)
	 * @param objForm Ojbet (L'objet contenant les infos saisi par l'utilisateur via un form)
	 *
	 * @return 
	 **/
	Odoo.updateObjet = function(hosting, objLogin, type, idObj, objForm, callback){

		//Create list of fields that You want to read
	    var id_list = [], values = {};
	    var uid = parseInt(hosting.userID);
	    
		id_list.push(new xmlrpcval(idObj, 'int'));

			if(type=='notes' || type=='produit' || type=='call' || type=='agenda' || type=='client' || type=='contact' || type=='event' || type=='participant'){
				values = setDataClientToUpdate(objForm, type, 0);
			}else if(type=='leads'){
				values = setDataLeadsToUpdate(objForm, uid);
			}else if(type=='user'){
				values = setDataUserToUpdate(objForm);
			}else if(type=='category'){
				values = setDataTagToUpdate(objForm);
			}else if(type=='vente'){
				values = setSaleToUpdate(objForm, type, 0);
			}else if (type=='invoice'){
				values = setDataInvoiceToUpdate(objForm, uid);
			}else if(type=='purchase'){
				// values = setSaleToUpdate(objForm, type, 0);
				values = setDataPurchaseToUpdate(objForm, uid);
			}
			
	    //Then, the write() method is executed:
	    var objCon = new xmlrpc_client('xmlrpc/2/object', hosting.url, hosting.port, params.secure);
	    var readmsg = new xmlrpcmsg('execute'); 
	    
	    readmsg.addParam(new xmlrpcval(hosting.database, "string")); 
	    readmsg.addParam(new xmlrpcval(objLogin.uid, "int")); 
	    readmsg.addParam(new xmlrpcval(objLogin.password, "string"));
	    
	    for (var i = 0; i < tabModeles.length; i++) {
	    	
	    	if(type==tabModeles[i].titre) {
	    		readmsg.addParam(new xmlrpcval(tabModeles[i].model, "string"));
	    		break;
	    	}
	    }

	    readmsg.addParam(new xmlrpcval("write", "string")); 
	    readmsg.addParam(new xmlrpcval(id_list, "array"));
	    readmsg.addParam(new xmlrpcval(values, "struct"));

	    //console.log(objCustomers);
		return objCon.send(readmsg, 0, function(res){
			callback(res);
		});
	};

	/* Cette fonction permet de créer un objet (client, tribunal, contact)
	 * 
	 * @param hosting Array = configuration serveur (port, url, server ip, uid, login, pwd)
	 * @param objLogin Object, correspond à l'objet utilisateur connecté
	 * @param type string (le type d'objet, client, tribunal, contact)
	 * @param objForm Ojbet (L'objet contenant les infos saisi par l'utilisateur via un form)
	 *
	 * @return <struct> contenant l'id de l'objet enregistré
	 **/
	Odoo.createObjet = function(hosting, objLogin, type, objForm, callback){

		//Create list of fields that You want to read
	    var values = {};
	    var uid = parseInt(hosting.userID);
	    var id = objLogin.uid;

	    	if(type=='client' || type=='contact' || type=='produit' || type=='call' || type=='agenda' || type=='event' || type=='participant' || type=='mail'){
				var titre = [];
				values = setDataClientToUpdate(objForm, type, id);
			}else if(type=='notes'){
				values = setDataClientToUpdate(objForm, type, id);
			}else if(type=='category' || type=='tag_project' || type=='tag_note' || type=='followers'){
				values = setDataTagToCreate(objForm, type);
			}else if(type=='leads'){
				values = setDataLeadsToUpdate(objForm, id);
			}else if(type=='tasks'){
				values = setDataTaskToUpdate(objForm);
				// values = setDataClientToUpdate(objForm, type, id);
			}else if(type=='vente'){
				values = setSaleToUpdate(objForm, type, id);
			}else if(type=='message'){
				values = setDataMessageToUpdate(objForm, id);
			}else if (type=='invoice'){
				values = setDataInvoiceToUpdate(objForm, id); 
			}else if(type=='purchase'){
				values = setDataPurchaseToUpdate(objForm, id);
			}
	    	
						
	    //Then, the write() method is executed:
	    var objCon = new xmlrpc_client('xmlrpc/2/object', hosting.url, hosting.port, params.secure);
	    var readmsg = new xmlrpcmsg('execute'); 
	    
	    readmsg.addParam(new xmlrpcval(hosting.database, "string")); 
	    readmsg.addParam(new xmlrpcval(objLogin.uid, "int")); 
	    readmsg.addParam(new xmlrpcval(objLogin.password, "string"));
	    
	    for (var i = 0; i < tabModeles.length; i++) {
	    	
	    	if(type==tabModeles[i].titre) {
	    		readmsg.addParam(new xmlrpcval(tabModeles[i].model, "string"));
	    		break;
	    	}
	    }
	    
	    readmsg.addParam(new xmlrpcval("create", "string")); 
	    readmsg.addParam(new xmlrpcval(values, "struct"));

	    //console.log(objCustomers);
		return objCon.send(readmsg, 0, function(res){
			callback(res);
		});
	};

	/* Cette fonction permet de créer une copie d'un objet
	 * 
	 * @param hosting Array = configuration serveur (port, url, server ip, uid, login, pwd)
	 * @param objLogin Object, correspond à l'objet utilisateur connecté
	 * @param type string (le type d'objet, client, tribunal, contact)
	 * @param objForm Ojbet (L'objet modifié)
	 * @param id int, l'id de l'objet à dupliquer
	 *
	 * @return <struct> contenant l'id de l'objet enregistré
	 **/
	Odoo.copyObjet = function(hosting, objLogin, type, objId, objForm, callback){

		//Create list of fields that You want to read
	    var values = {};
	    var uid = parseInt(hosting.userID);
	    var id = objLogin.uid;

	    	if(objForm!=null){
	    		// objForm['copy']=true;
	    		if(type=='client' || type=='contact' || type=='notes' || type=='agenda'){
					values = setDataClientToUpdate(objForm, type, id); 
				}else if(type=='tasks'){
					values = setDataClientToUpdate(objForm, type, id);
				}else if (type=='invoice'){
					values = setDataInvoiceToUpdate(objForm, id);
				}else if(type=='vente'){
					values = setSaleToUpdate(objForm, type, id);
				}
	    	}
						
	    //Then, the write() method is executed:
	    var objCon = new xmlrpc_client('xmlrpc/2/object', hosting.url, hosting.port, params.secure);
	    var readmsg = new xmlrpcmsg('execute'); 
	    
	    readmsg.addParam(new xmlrpcval(hosting.database, "string")); 
	    readmsg.addParam(new xmlrpcval(objLogin.uid, "int")); 
	    readmsg.addParam(new xmlrpcval(objLogin.password, "string"));
	    
	    for (var i = 0; i < tabModeles.length; i++) {
	    	
	    	if(type==tabModeles[i].titre) {
	    		readmsg.addParam(new xmlrpcval(tabModeles[i].model, "string"));
	    		break;
	    	}
	    }
	    
	    readmsg.addParam(new xmlrpcval("copy", "string"));
	    readmsg.addParam(new xmlrpcval(objId, "int"));
	    
	    if(objForm)
	    	readmsg.addParam(new xmlrpcval(values, "struct"));

	    //console.log(objCustomers);
		return objCon.send(readmsg, 0, function(res){
			callback(res);
		});
	};

/*** 
 * This function is used to build array ids
 * to get list of objects
 * @param objIds <Array>
 *
 * @return <Array> of ids
 **/

Odoo.formatIds = function (objIds){
	
	id_list = [];
    var ids = objIds.val.me;

    for(var i = 0; i < ids.length; i++){

        id_list.push(new xmlrpcval(ids[i].me, 'int'));
    }

    return id_list;
};

/*** 
 * This function is used to build array ids
 * to get list of objects
 * @param objIds <Array>
 *
 * @return <Array> of ids
 **/

Odoo.formatIdsToXml = function (objIds){
	
	id_list = [];
	
	if(objIds===undefined)
		return id_list;

	if(objIds.me===undefined)
    	var ids = objIds;
    else
    	var ids = objIds.me;

    for(var i = 0; i < ids.length; i++){
    	if(ids[i].me!==undefined)
        	id_list.push(new xmlrpcval(ids[i].me, 'int'));
        else
        	id_list.push(new xmlrpcval(ids[i], 'int'));
    }

    return id_list;
};

/*** 
 * This function is used to build array ids (string)
 * to get list of objects
 * @param objIds <Array>
 *
 * @return <Array> of ids
 **/

Odoo.formatStringToXml = function (objIds){
	
	id_list = [];
	
	if(objIds===undefined)
		return id_list;

	if(objIds.me===undefined)
    	var ids = objIds;
    else
    	var ids = objIds.me;

    for(var i = 0; i < ids.length; i++){
    	if(ids[i].me!==undefined)
        	id_list.push(new xmlrpcval(ids[i].me, 'string'));
        else
        	id_list.push(new xmlrpcval(ids[i].slug, 'string'));
    }

    return id_list;
};

/*** 
 * This function is used to return
 * URL Server
 *
 * @return string
 **/

Odoo.getUrlServer = function (){
	
    return params.secure+'://'+params.url;
};

/*** =============================================================================
 *
 * CREATION DU SERVICE POUR LA GESTION DES DEVIS ET BONS DE COMMANDES
 * L'objectif sera de pouvoir :
 * 2. Requetes sur les model sale.order et sale.order.line
 *
 *================================================================================*/


	/**
	 * Cette fonction permet de récupérer la liste des
	 * des affaires qui sont actives
	 * @return filters <Array>
	 **/
	function activeAffaire(){

		var domain_filter = [];

		domain_filter.push(new xmlrpcval('active',"string"));
	    domain_filter.push(new xmlrpcval('=',"string"));
	    domain_filter.push(new xmlrpcval(true,"boolean"));

	    return domain_filter;
	}

	/**
	 * Cette fonction permet de récupérer la liste des
	 * des objets qui n'ont pas été supprimés
	 * @return filters <Array>
	 **/
	function notDelete(){

		var domain_filter = [];

		domain_filter.push(new xmlrpcval('unlink',"string"));
	    domain_filter.push(new xmlrpcval('=',"string"));
	    domain_filter.push(new xmlrpcval(true,"boolean"));

	    return domain_filter;
	}


	/**
	 * Permet de définir un filtre pour la liste
	 * des natures du dossier client
	 **/
	function requetFilterNature(model){

		var domain_filter = [];
		if(model == 'followers'){

			domain_filter.push(new xmlrpcval('res_model',"string"));
			domain_filter.push(new xmlrpcval('=',"string"));
			domain_filter.push(new xmlrpcval('note.note',"string"));

		}else{

			if(model!="perte")
				domain_filter.push(new xmlrpcval('name',"string"));
			else	
				domain_filter.push(new xmlrpcval('display_name',"string"));
	
			domain_filter.push(new xmlrpcval('!=',"string"));
			domain_filter.push(new xmlrpcval('',"string"));
		}

	    return domain_filter;
	}

	/**
	 * Cette fonction permet d'appliquer les filtres
	 * sur les pièces jointes à récupérer
	 *
	 * @param filtre string, la clé de l'objet 
	 * @param valeur string, la valeur de l'objet
	 * @returns Array<any>
	 */
	function requetFilterAttachment(filtre, valeur){

		var domain_filter = [], login_id = 0;

		if(filtre=='res_id'){
		
			domain_filter.push(new xmlrpcval('res_id',"string"));
			domain_filter.push(new xmlrpcval('=',"string"));
			domain_filter.push(new xmlrpcval(valeur,"int"));
			
		}else if(filtre=='res_model'){
			domain_filter.push(new xmlrpcval('res_model',"string"));
			domain_filter.push(new xmlrpcval('=',"string"));
			domain_filter.push(new xmlrpcval(valeur,"string"));
		}
			
	   return domain_filter;
	}
 

	/**
	 * Cette fonction permet de récupérer
	 * les champs de l'objet nature d'une affaire
	 **/
	function selectListFieldsNature(model){

		var champs = [];
		if(model!="perte")
			champs.push(new xmlrpcval('name',"string"));
		else	
			champs.push(new xmlrpcval('display_name',"string"));

	    return champs;
	}

	/**
	 * Cette fonction permet de définir la
	 * requete pour récupérer la liste de tous les statuts d'affaires
	 * @return Array<Object>
	 **/
	function requetFilterStatut(){

		var domain_filter = [];

		domain_filter.push(new xmlrpcval('name',"string"));
	    domain_filter.push(new xmlrpcval('!=',"string"));
	    domain_filter.push(new xmlrpcval('',"string"));

	    return domain_filter;
	}

	/**
	 * Cette fonction permet de récupérer
	 * les champs de l'objet Satut d'une affaire
	 **/
	function selectListFieldsStatut(){

		var champs = [];
		champs.push(new xmlrpcval("name", "string"));	    
	    champs.push(new xmlrpcval("id", "string"));

	    return champs;
	}


	/**
	 * Cette fonction permet de définir la
	 * requete pour récupérer la liste des avocats
	 * appartenant à un cabinet bien précis
	 * @param id int, id de l'utilisateur (responsable du cabinet)
	 * @return Array<Object>
	 **/
	function requetFilterEmployee(){

		var domain_filter = [];

		domain_filter.push(new xmlrpcval('name_related',"string"));
	    domain_filter.push(new xmlrpcval('!=',"string"));
	    domain_filter.push(new xmlrpcval('',"string"));

	    return domain_filter;
	}

	/**
	 * Sélectionne les champs de l'objet hr.employee  qui vont apparaite
	 * dans la liste
	 **/
	function selectListFieldsEmployee(){

		var champs = [];
		//champs.push(new xmlrpcval("parent_id", "string"));  
		champs.push(new xmlrpcval("name_related", "string"));
	    champs.push(new xmlrpcval("id", "string"));

	    return champs;
	}

	//====================================================
	//	MODELES NOTE ET STAGE
	//====================================================
	/**
	 * Cette fonction permet de faire une
	 * requête sur la table note pour récupérer
	 * la liste des entrées
	 *
	 **/
	function requetFilterNote(id){
		
		var domain_filter = [];
		
		domain_filter.push(new xmlrpcval('user_id',"string"));
	    domain_filter.push(new xmlrpcval('=',"string"));
	    domain_filter.push(new xmlrpcval(id,"int"));

	    return domain_filter;
	}



	//////////////////////////////////////////////////////////////
	//		END OF NOTE
	//////////////////////////////////////////////////////////////



	/**
	 * Cette fonction permet de définir une requete
	 * pour récupérer la liste des tags
	 * @param id int, l'utilisateur connecté
	 *
	 **/
	function requetFilterTags(id){

		var domain_filter = [];

		domain_filter.push(new xmlrpcval('id',"string"));
	    domain_filter.push(new xmlrpcval('!=',"string"));
	    domain_filter.push(new xmlrpcval(0,"int"));

	    return domain_filter;

	}

	/**
	 * Sélectionne les champs de l'objet tag  qui vont apparaite
	 * dans la liste des tags
	 **/
	function selectListFieldsTag(){

		var champs = [];
		
		champs.push(new xmlrpcval("name", "string"));
	    champs.push(new xmlrpcval("id", "string"));
	    
	    return champs;
	}

	/**
	 * Cette fonction permet d'insérer les valeurs
	 * dans le modèle note.tag ou analytic.tag
	 **/
	function setDataTagToCreate(obj, type){
		
		var valeur, values;
		if(type == 'followers'){
			
			values = { 
				'res_model': new xmlrpcval(obj.res_model, "string"),
				'partner_id': new xmlrpcval(obj.partner_id, "string")
			};

		}else{

			if(type=='tag_project' || type=='tag_note')
				valeur = obj;
			else
				valeur = obj.name;
	
			values = { 'name': new xmlrpcval(valeur, "string")};
		}

	   	return values;
	}

	/**
	 * Cette fonction permet de mettre à jour le nom
	 * d'un tag
	 * @param obj string, le nom à mettre à jour
	 *
	 **/
	function setDataTagToUpdate(obj){

		var values = { 'name': new xmlrpcval(obj, "string")};

	   	return values;	
	}


 /**======================================================
  * CE MODULE EST DEDIE AU MODELE crm.lead (leads)
  * - insertion des données dans la table
  * - modification
  * - consultation
  *
  ****************************************************************/


  /**
   * Cette fonction permet d'inserer ou de 
   * mettre à jour les infos du modèle ona.lawyer.hearing
   * @param obj JSON, contient les données à insérer
   * @param id int, l'identifiant de l'utilisateur connecté
   *
   **/
  function setDataLeadsToUpdate(obj, id){

  	console.log(obj);
  	// console.log(id);
 	var values;
 	var login_id = parseInt(id);

 	if(obj.user_id!==undefined)
 		obj.user_id.id = login_id;

 	if(obj.call!==undefined){ 
 		
 		values =  { 'active': new xmlrpcval(false, "boolean")};	 		

 	}else if(obj.lost!==undefined){
 		
		 values =  { 'active': new xmlrpcval(false, "boolean"),
		 			 'lost_reason': new xmlrpcval(parseInt(obj.id), "int"),
				};

 	}else if(obj.opportunity!==undefined){
 		
 		values =  { 'type': new xmlrpcval('opportunity', "string")};	 		

 	}else if(obj.archive!==undefined){ //classeé cette audience
		
		values =  { 'active': new xmlrpcval(obj.archive, "boolean")};

 	}else if(obj.stage_leads!==undefined){ //classeé cette audience
		
		values =  { 'stage_id': new xmlrpcval(obj.data.me.id.me, "int")};	 		

 	}else if(obj.won!==undefined){ //classeé cette audience
		
		values =  {  //'active': new xmlrpcval(false, "boolean"),
					'probality': new xmlrpcval(obj.probality, "double"),
					'stage_id': new xmlrpcval(obj.stage_won.id, "int")
				  };	 		

 	}else{ //On met à jour les infors 
 		
		 	values =  {
				'name':new xmlrpcval(obj.name , "string"),
				'type':new xmlrpcval(obj.type , "string"),
				'probality': new xmlrpcval(obj.probality, "double"),
				'email_from': new xmlrpcval(obj.email_from, "string"),
				'function': new xmlrpcval(obj.function, "string"),
				'phone': new xmlrpcval(obj.phone, "string"),
				'mobile': new xmlrpcval(obj.mobile, "string"),
				'fax': new xmlrpcval(obj.fax, "string"),
				'city': new xmlrpcval(obj.city, "string"),
				'zip': new xmlrpcval(obj.zip, "string"),
				'priority': new xmlrpcval(obj.priority, "string"),
				/*'date_deadline': new xmlrpcval(onlyDate(obj.date_deadline), "string"),
				'date_open': new xmlrpcval(formatUTF(obj.date_open), "string"),*/
				'description': new xmlrpcval(obj.description , "string"),
				'partner_name': new xmlrpcval(obj.partner_name, "string"),
				'title_action': new xmlrpcval(obj.title_action, "string"),
				'planned_revenue': new xmlrpcval(obj.planned_revenue, "double"),
				'next_activity_id': new xmlrpcval(parseInt(obj.next_activity_id.id), "int"),
				'team_id': new xmlrpcval(parseInt(obj.team_id.id), "int"),
				'user_id': new xmlrpcval(obj.user_id.id, "int"),
				'partner_id': new xmlrpcval(parseInt(obj.partner_id.id), "int"),
				'title': new xmlrpcval(parseInt(obj.title.id), "int"),
				'state_id': new xmlrpcval(parseInt(obj.state_id.id), "int"),
				'country_id': new xmlrpcval(parseInt(obj.country_id.id), "int"),
				'tag_ids': new xmlrpcval(setManyToMany(obj.tag_ids), "array")
			};

			if(obj.date_deadline!=''){
				values['date_deadline'] = new xmlrpcval(onlyDate(new Date(obj.date_deadline)), "string");
				//values['date_open'] = new xmlrpcval(formatUTF(obj.date_open), "string");
			}
			if(obj.date_open!=''){
				//values['date_deadline'] = new xmlrpcval(onlyDate(new Date(obj.date_deadline)), "string");
				values['date_open'] = new xmlrpcval(formatUTF(obj.date_open), "string");
			}


 	}
 	
   	return values;

  }

  /** =================================================================
   * 	MODULE LEADS (PISTES OU OPPORTUNITES)
   *    - Création d'une Piste/Opportunité
   *    - Modification d'une piste ou opportunité
   *    - Listing d'une piste ou opportunité
   *
   *====================================================================*/
   /**
	 * Cette fonction permet de faire une
	 * requête sur la table tasks pour récupérer
	 * la liste des entrées
	 * @param id int, l'utilisateur connecté
	 * @param id_affaire, l'identifiant de l'affaire
	 *
	 **/
	function requetFilterLeads(){
		
		var domain_filter = [];

		/*domain_filter.push(new xmlrpcval('project_id',"string"));
	    domain_filter.push(new xmlrpcval('=',"string"));
	    domain_filter.push(new xmlrpcval(id_affaire,"int"));*/

	    domain_filter.push(new xmlrpcval('name',"string"));
	    domain_filter.push(new xmlrpcval('!=',"string"));
	    domain_filter.push(new xmlrpcval('',"string"));

	    return domain_filter;
	}

	/**
	 * Sélectionne les champs de l'objet tasks  qui vont apparaite
	 * dans la liste des taches
	 **/
	function selectListFieldsTasks(){

		var champs = [];
		
		champs.push(new xmlrpcval("name", "string"));
		champs.push(new xmlrpcval("user_id", "string"));
		champs.push(new xmlrpcval("date_deadline", "string"));
		champs.push(new xmlrpcval("progress", "string"));
		champs.push(new xmlrpcval("stage_id", "string"));
		champs.push(new xmlrpcval("bitcs_next_action_type", "string"));
		champs.push(new xmlrpcval("description", "string"));
		champs.push(new xmlrpcval("project_id", "string"));
		champs.push(new xmlrpcval("partner_id", "string"));
		champs.push(new xmlrpcval("date_end", "string"));
		champs.push(new xmlrpcval("total_hours", "string"));
		champs.push(new xmlrpcval("code", "string"));
	    champs.push(new xmlrpcval("active", "string"));
	    
	    return champs;
	}
   
   function getTheDate(obj_date){

		var year = obj_date.getFullYear();
		var month = obj_date.getMonth()+1;
		var day = obj_date.getDate();

		return year+"-"+month+"-"+day;
   }


   /** Cette fonction permet d'éditer une tâche **/
   function setDataTaskToUpdate(obj){

 	var id_nature, id_stage, id_user, id_project, description, date_done, id_partner;
 	var values;
 	
 	if(obj.register!==undefined || obj.update!==undefined){
		description = obj.description;
		if(obj.date_deadline=='')
 			date_done = getTheDate(new Date());
		else 		
 			date_done = getTheDate(new Date(obj.date_deadline));
		
 	}

 	if(obj.insert!==undefined){ //On insère les données dans la bd
 		
	 	description = obj.description;
 		if(obj.date_deadline=='')
 			date_done = getTheDate(new Date());
		else 		
 			date_done = getTheDate(new Date(obj.date_deadline));

	 	values =  {
			'bitcs_next_action_type':new xmlrpcval(parseInt(obj.bitcs_next_action_type.id), "int"),
			'stage_id': new xmlrpcval(parseInt(obj.stage_id.id), "int"),
			'date_deadline': new xmlrpcval(date_done, "string"),
			'description': new xmlrpcval(description , "string"),
			'name': new xmlrpcval(obj.name, "string"),
			'user_id': new xmlrpcval(parseInt(obj.user_id.id), "int"),
			'project_id': new xmlrpcval(parseInt(obj.project_id.id), "int"),
			'partner_id': new xmlrpcval(parseInt(obj.partner_id.id), "int")
		};

 	}else if(obj.register!==undefined){
 		
		values =  {
			'bitcs_next_action_type':new xmlrpcval(parseInt(obj.bitcs_next_action_type.id), "int"),
			'stage_id': new xmlrpcval(parseInt(obj.stage_id.id), "int"),
			'date_deadline': new xmlrpcval(date_done, "string"),
			'description': new xmlrpcval(description , "string"),
			'name': new xmlrpcval(obj.name, "string"),
			'user_id': new xmlrpcval(parseInt(obj.user_id.id), "int"),
			'project_id': new xmlrpcval(parseInt(obj.project_id.id), "int"),
			'partner_id': new xmlrpcval(parseInt(obj.partner_id.id), "int")
		};	 		

 	}else if(obj.stage!==undefined){ //classeé cette audience
		
		values =  { 'stage_id': new xmlrpcval(obj.data.me.id.me, "int")};	 		

 	}
 	else if(obj.slug!==undefined){ //classeé cette audience
		
		if(obj.slug=="archive")
			values =  { 'active': new xmlrpcval(false, "boolean")};
		else if(obj.slug=="corbeille")
			values =  {'unlink': new xmlrpcval(true, "boolean")};	 		

 	}else if(obj.update!==undefined){ //On met à jour les infors 
 		
	 	values =  {
			'bitcs_next_action_type':new xmlrpcval(parseInt(obj.bitcs_next_action_type.id), "int"),
			'stage_id': new xmlrpcval(parseInt(obj.stage_id.id), "int"),
			'date_deadline': new xmlrpcval(date_done, "string"),
			'description': new xmlrpcval(description , "string"),
			'name': new xmlrpcval(obj.name, "string"),
			'user_id': new xmlrpcval(parseInt(obj.user_id.id), "int")
		};
 	}else if(obj.copy!==undefined){
 		date_done = getTheDate(new Date(obj.date_deadline));
 		values =  {
			'bitcs_next_action_type':new xmlrpcval(parseInt(obj.bitcs_next_action_type.id), "int"),
			'stage_id': new xmlrpcval(parseInt(obj.stage_id.id), "int"),
			'date_deadline': new xmlrpcval(date_done, "string"),
			'description': new xmlrpcval(obj.description, "string"),
			'name': new xmlrpcval(obj.name, "string"),
			'partner_id': new xmlrpcval(parseInt(obj.partner_id.id), "int"),
			'project_id': new xmlrpcval(parseInt(obj.project_id.id), "int"),
			'user_id': new xmlrpcval(parseInt(obj.user_id.id), "int")
			
		};
 	}
 	
   	return values;
   }


   /** ==================================================================
    *	MODULE AGENDA 
    *   Récupérer la liste des meetings (d'un utilisateur unique)
    *   Récupérer la liste des meetings de tous les avocats
    *
    *=====================================================================*/

    /**
     * Filtre sur la liste des agendas en fonction
     * des utilisateurs
     * @param id int, l'identifiant de l'utilisateur connecté
     *
     **/
     function requetFilterAgenda(id, filtre){

     	var domain_filter = [], login_id = 0, tabs = [];

     	if(filtre!=null){
     		if(filtre.agenda===undefined){

     			//On formate les données
     			//tabs.push(filtre.partner_id.id);
     			tabs = Odoo.formatIdsToXml(filtre);
     			
     			domain_filter.push(new xmlrpcval('partner_ids',"string"));
		    	domain_filter.push(new xmlrpcval('in',"string"));
		    	domain_filter.push(new xmlrpcval(tabs,"array"));
     		}else{
     			
     		}

     	}else{
     		
 			domain_filter.push(new xmlrpcval('id',"string"));
    		domain_filter.push(new xmlrpcval('!=',"string"));
    		domain_filter.push(new xmlrpcval(0,"int"));
     	}
     		
	    return domain_filter;
     }


   /**
    * Cette fonction permet de fixer des ids
    * appartenant à un objet 
    * @param list_ids Array<int>
    * @return Array
    *
    **/
   function setManyToMany(list_ids){
   		
   		if(list_ids===undefined)
   			var obj_ids = [];
   		else
   			var obj_ids = list_ids;

   		var tab_ids = [], tab = [], filters = [];

   		if(obj_ids.length!=0){
			for(var i = 0; i < obj_ids.length; i++)
		        tab_ids.push(new xmlrpcval(obj_ids[i], 'int'));
		}
		
		tab.push(new xmlrpcval(6 , "int"));
		tab.push(new xmlrpcval(0 , "int"));
		tab.push(new xmlrpcval(tab_ids , "array"));
		filters.push(new xmlrpcval(tab, "array"));

		return filters;
   }

   //Cette fonction permet de calculer la date de fin
   //@param startTime Date, date de début
   //@param duration float, date de fin
   //@return Date
   function getStopTime(startTime, duration){

  	var endTime = new Date(), timeDuration;
  	var total;
  	var strDuration = duration.toString();
  	var tab = strDuration.split(".");
  	
  	if(tab.length!==undefined || tab.length<2)
  		timeDuration = miliseconds(duration,0,0);
  	else if(tab.length>1)
  		timeDuration = miliseconds(parseInt(tab[0]), parseInt(tab[1]), 0);

  	//timeDuration = 1000*(duration*3600);
  	var startMs = startTime.valueOf();

  	total = startMs + timeDuration;
  	endTime.setTime(total);

  	return endTime;
  }

    //Convertir le temps en millisecondes
  	function miliseconds(hrs,min,sec)
	{
	    return ((hrs*60*60+min*60+sec)*1000);
	}

  //Cette fonction permet de formatter la
  //date au format UTC
  function formatUTF(toConvert){

  	var objDate, strDate = '', mois, minutes;
	if(toConvert=='')
		objDate = new Date();
	else  	
  		objDate = new Date(toConvert);
  	
  	if(objDate.getMonth()<9)
  		mois = '0'+(objDate.getMonth()+1);
  	else
  		mois = objDate.getMonth()+1;

  	if(objDate.getMinutes()<10)
  		minutes = '0'+objDate.getMinutes();
  	else
  		minutes = objDate.getMinutes();

  	strDate = objDate.getFullYear()+'-'+mois+'-'+objDate.getDate()+' '+objDate.getHours()+':'+minutes+':00';

  	return strDate;
  }

  //Cette fonction permet de convertir l'objet Date
  //en date
  function onlyDate(obj_date){

  	var objDate, strDate = '', mois;

  	if(objDate=='')
  		objDate = new Date();
  	else
  		objDate = obj_date;

  	if(objDate.getMonth()<9)
  		mois = '0'+(objDate.getMonth()+1);
  	else
  		mois = objDate.getMonth()+1;
  	

  	strDate = objDate.getFullYear()+'-'+mois+'-'+objDate.getDate();

  	return strDate;
  }


    /** =======================================================================
     *  MODULE FACTURES, PAIEMENTS
     *  Ce module sera en charge du traitement des factures et paiements suite
     *  à une affaire
     *
     **/

      /**
       * Définition de la requête permettant
       * d'afficher la liste des factures en fonction
       * d'une affaire
       * @param id_affaire int, l'identifiant d'une affaire
       **/
       function requetFilterInvoices(id_affaire){

       		var domain_filter = [];

       		domain_filter.push(new xmlrpcval('id',"string"));
		    domain_filter.push(new xmlrpcval('!=',"string"));
		    domain_filter.push(new xmlrpcval(0,"int"));

		    return domain_filter;
	   }

	  /**
       * Cette fonction permet d'affecter des valeurs aux champs du
       * modèle account.invoice
       *
       **/
	  function setDataInvoiceToUpdate(obj, id){

		var values, login_id;
		console.log(obj);

		if(obj.couleur!==undefined){
			values =  { 'color_partner_id': new xmlrpcval(obj.couleur.code, "int")};
			return values;

		}else if(obj.archive!==undefined){
			values =  { 'active': new xmlrpcval(obj.archive, "boolean")};
			return values;

		}else if(obj.attendees!==undefined){
			values =  { 'partner_ids': new xmlrpcval(setManyToMany(obj.data), "array")};
		}else if(obj.stage!==undefined){
			values =  { 'state': new xmlrpcval(obj.state, "string")};
		}else{

			if(obj.user_id.id==0)
				obj.user_id.id = id;
			
			console.log(onlyDate(new Date(obj.date_invoice)));

			values =  {
				'account_id':new xmlrpcval(parseInt(obj.account_id.id), "int"),
				'company_id':new xmlrpcval(parseInt(obj.company_id.id), "int"),
				'currency_id':new xmlrpcval(parseInt(obj.currency_id.id), "int"),
				'journal_id':new xmlrpcval(parseInt(obj.journal_id.id), "int"),
				'payment_term_id': new xmlrpcval(parseInt(obj.payment_term_id.id), "int"),
				'user_id': new xmlrpcval(obj.user_id.id, "int"),
				'date_invoice': new xmlrpcval(onlyDate(new Date(obj.date_invoice)), "string"),
				'date_due': new xmlrpcval(onlyDate(new Date(obj.date_due)), "string"),
				'partner_id': new xmlrpcval(parseInt(obj.partner_id.id), "int")
			};

			if(obj.id==0 && obj.lines.length!=0){
				values['invoice_line_ids'] = new xmlrpcval(fillManyToMany(obj.lines[0]), "array");
			}else if(obj.id!=0 && obj.invoice_line_ids.length==0 && obj.lines.length!=0){
				values['invoice_line_ids'] = new xmlrpcval(fillManyToMany(obj.lines[0]), "array");
			}else if(obj.id!=0 && obj.invoice_line_ids.length!=0 && obj.lines.length!=0){

			}

	 	}

	 return values;
 	}
 


	   /////////////////////////////////////////////////////////////
	   //	GESTION DES DEVIS ET COMMANDES
	   //
	   /////////////////////////////////////////////////////////////
	   /**
		 * Cette fonction permet d'inserer ou de 
		 * mettre à jour les infos du modèle ona.lawyer.hearing
		 * @param obj JSON, contient les données à insérer
		 * @param id int, l'identifiant de l'utilisateur connecté
		 *
		 **/
		function setSaleToUpdate(obj, type, id){

			console.log(obj);
			var values = {};
		
			for(var elt in obj){
				
				if(elt=='objetLine' && Array.isArray(obj[elt])){
					values[elt] = new xmlrpcval(fillManyToMany(obj.objetLine), "array");
				}else if(typeof obj[elt] == 'object' && parseInt(obj[elt].id)!=0)
					values[elt] = new xmlrpcval(parseInt(obj[elt].id), "int");
				else if(typeof obj[elt] == 'boolean')
					values[elt] = new xmlrpcval(obj[elt], "boolean");
				else if(typeof obj[elt] === 'number' && Number.isInteger(obj[elt]) && obj[elt]!=0)
					values[elt] = new xmlrpcval(obj[elt], "int");
				else if(typeof obj[elt] === 'number' && !Number.isInteger(obj[elt]) && obj[elt]!=0)
					values[elt] = new xmlrpcval(parseFloat(obj[elt]), "double");
				else if(typeof obj[elt] == 'string' && obj[elt]!="")
					values[elt] = new xmlrpcval(obj[elt], "string");
				else if(elt=='user_id' && id!=0)
					values[elt] = new xmlrpcval(parseInt(id), "int");
			} 

			values['date_order'] = new xmlrpcval(obj.date_order, "string");
			// values['order_line'] = new xmlrpcval(setManyToMany(obj.order_line), "array");

			return values;

		}

	  /**
       * Cette fonction permet d'affecter des valeurs aux champs du
       * modèle account.invoice
       *
       **/
	  function setDataPurchaseToUpdate(obj, id){

			var values, login_id;
			
			if(obj.archive!==undefined){
				values =  { 'active': new xmlrpcval(obj.archive, "boolean")};
				return values;
				
			}else if(obj.stage!==undefined){
				values =  { 'state': new xmlrpcval(obj.state, "string")};
			}else{
				/* if(obj.user_id.id==0)
					obj.user_id.id = id; */
				

				values =  {
					'date_planned':new xmlrpcval(onlyDate(new Date(obj.date_planned)), "string"),
					'date_order':new xmlrpcval(onlyDate(new Date(obj.date_order)), "string"),
					'currency_id':new xmlrpcval(parseInt(obj.currency_id.id), "int"),
					'partner_id': new xmlrpcval(parseInt(obj.partner_id.id), "int")
				};

				if(obj.id==0 && obj.purchase_line.length!=0){
					values['order_line'] = new xmlrpcval(fillManyToManyPurchase(obj.purchase_line[0]), "array");
				}else if(obj.id!=0 && obj.purchase_line.length==0 && obj.purchase_line.length!=0){
					values['order_line'] = new xmlrpcval(fillManyToManyPurchase(obj.purchase_line[0]), "array");
				}else if(obj.id!=0 && obj.purchase_line.length!=0 && obj.purchase_line.length!=0){

				}

			}
			console.log('values  ', values);

		return values;
	}

	/**
	* Cette fonction permet de définir les valeurs du 
	* modèle sale.order.line (lié à la commande)
	* @param obj VenteLine
	* @return struct (JSON)
	*
	**/
	function setValuesOfModelPurchase(obj){
		
		console.log(obj);
		var values = {};
		
		for(var elt in obj){
			
			if(obj[elt]!==undefined && elt!='id' && elt!='bg' && elt!='write_date' && elt!='create_date' && elt!='idx'){

				if(Array.isArray(obj[elt]) && obj[elt].length!=0){
					values[elt] = new xmlrpcval(setManyToMany(obj[elt]), "array");
				}else if(typeof obj[elt] === 'object' && parseInt(obj[elt].id)!=0)
					values[elt] = new xmlrpcval(parseInt(obj[elt].id), "int");
				else if(typeof obj[elt] === 'boolean')
					values[elt] = new xmlrpcval(obj[elt], "boolean");
				else if(typeof obj[elt] === 'string' && obj[elt]!="" && elt!="start_datetime")
					values[elt] = new xmlrpcval(obj[elt], "string");
				else if(typeof obj[elt] === 'number' && Number.isInteger(obj[elt]) && obj[elt]!=0)
					values[elt] = new xmlrpcval(obj[elt], "int");
				else if(typeof obj[elt] === 'number' && !Number.isInteger(obj[elt]) && obj[elt]!=0)
					values[elt] = new xmlrpcval(parseFloat(obj[elt]), "double");
				else if(elt=='user_id' && id!=0)
					values[elt] = new xmlrpcval(parseInt(id), "int");
			}
		}

		if(obj.tax_id!==undefined && obj.tax_id.length!=0){
			values['tax_id'] = new xmlrpcval(setManyToMany(obj.tax_id), "array");
		}

		return values;
	}

	/**
	* Cette fonction permet de fixer de remplir
	* les valeurs d'un champ many2many
	* @param tab_ids Array<Object>
	* @return Array
	*
	**/
	function fillManyToManyPurchase(ligne){
		
		var tab_ids = [], tab = [], filters = [];
		
		tab.push(new xmlrpcval(0 , "int"));
		tab.push(new xmlrpcval(0 , "int"));
		tab.push(new xmlrpcval(setValuesOfModelPurchase(ligne), "struct"));
		filters.push(new xmlrpcval(tab, "array"));

		return filters;
	}

		/**
		* Cette fonction permet de définir les valeurs du 
		* modèle sale.order.line (lié à la commande)
		* @param obj VenteLine
		* @return struct (JSON)
		*
		**/
		function setValuesOfModel(obj){
			
			console.log(obj);
			var values = {};
			
			for(var elt in obj){
				
				if(obj[elt]!==undefined && elt!='id' && elt!='bg' && elt!='write_date' && elt!='create_date' && elt!='idx'){
 
					if(Array.isArray(obj[elt]) && obj[elt].length!=0){
						values[elt] = new xmlrpcval(setManyToMany(obj[elt]), "array");
					}else if(typeof obj[elt] === 'object' && parseInt(obj[elt].id)!=0)
						values[elt] = new xmlrpcval(parseInt(obj[elt].id), "int");
					else if(typeof obj[elt] === 'boolean')
						values[elt] = new xmlrpcval(obj[elt], "boolean");
					else if(typeof obj[elt] === 'string' && obj[elt]!="" && elt!="start_datetime")
						values[elt] = new xmlrpcval(obj[elt], "string");
					else if(typeof obj[elt] === 'number' && Number.isInteger(obj[elt]) && obj[elt]!=0)
						values[elt] = new xmlrpcval(obj[elt], "int");
					else if(typeof obj[elt] === 'number' && !Number.isInteger(obj[elt]) && obj[elt]!=0)
						values[elt] = new xmlrpcval(parseFloat(obj[elt]), "double");
					else if(elt=='user_id' && id!=0)
						values[elt] = new xmlrpcval(parseInt(id), "int");
				}
			}

			if(obj.tax_id!==undefined && obj.tax_id.length!=0){
				values['tax_id'] = new xmlrpcval(setManyToMany(obj.tax_id), "array");
			}

			return values;
		}

		/**
		* Cette fonction permet de fixer de remplir
		* les valeurs d'un champ many2many
		* @param tab_ids Array<Object>
		* @return Array
		*
		**/
		function fillManyToMany(ligne){
			
			var tab_ids = [], tab = [], filters = [];
			
			tab.push(new xmlrpcval(0 , "int"));
			tab.push(new xmlrpcval(0 , "int"));
			tab.push(new xmlrpcval(setValuesOfModel(ligne), "struct"));
			filters.push(new xmlrpcval(tab, "array"));

			return filters;
		}

		/**
		 * Cette fonction permet d'insérer un message
		 * dans la bd
		 * @param obj Message, objet de type Message
		 * @param login int, l'identifiant de l'utilisateur
		 */
		function setDataMessageToUpdate(obj, login){
	
			var values, login_id;
			console.log(obj);
		
			if(obj.attendees!==undefined){
				values =  { 'partner_ids': new xmlrpcval(setManyToMany(obj.data), "array")};
			}else{

				values =  {
					'body': new xmlrpcval(obj.body, "string"),
					'message_type': new xmlrpcval(obj.message_type, "string"),	
					'author_id': new xmlrpcval(obj.author_id.id, "int"),
					'channel_ids': new xmlrpcval(setManyToMany(obj.channel_ids), "array")
				};

				
			}

			return values;
		}