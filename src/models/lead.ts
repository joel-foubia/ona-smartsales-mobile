/** Cette classe définit l'objet lead (opportunité ou poste) crm.lead **/
export class Lead {

  public id;
  public name;
  public contact_name;
  public active;
  public color;
  public planned_revenue;
  public title_action;
  public probability;
  public image_url;
  public tag_ids;
  public order_ids;
  public mobile;
  public phone;
  public email_from;
  public team_id;
  public next_activity_id;
  public last_activity_id;
  public partner_id;
  public partner_name;
  public date_deadline;
  public date_open;
  
  public priority;
  public fax;
  public user_id;
  public state_id;
  public stage_id;
  public country_id;
  public type;
  public latitude;
  public longitude;
  public title;
  public function;
  public description;
  public city;
  public zip;
  
  public in_call_center_queue;
  public lost_reason;
  public meeting_count;
  public referred;
  public company_currency;
  public date_action;
  public create_date;
  public write_date;
  
  
  
  //Définitions des messages à envoyer
  static error_phone = "Le numéro de téléphone n'a pas été attribué. Aller dans la rubrique Modifier";
  static error_email_from = "Vous ne pouvez pas envoyer de mail, l'email_from n'a pas été attribué. Attribuez un email_from";
  static error_website = "Le site web ne peut pas s'ouvrir, l'adresse du site internet n'a pas été enregistré";
  static noInternet = "Impossible d'enregistrer. Problème de connexion Internet";
  static errSaving = "Une erreur est survenu lors de la création d'un nouveau";


  constructor(type: string, serverJSON: any) {

    
    if(serverJSON!=null){
      this.setPartner(serverJSON);
    }
    else
      this.createPartner();
    
  } 

  //Permet de définir la liste des titres
  //à attribuer à un parternaire
  private getIdTabs(liste){

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
  setPartner(data : any){
    
    this.id = data.me.id.me;
    this.in_call_center_queue = data.me.in_call_center_queue.me;

    if(!data.me.name.me || data.me.name.me=='false')
      this.name = "";
    else
      this.name = data.me.name.me;
    
    if(!data.me.referred.me || data.me.referred.me=='false')
      this.referred = "";
    else
      this.referred = data.me.referred.me;

    if(!data.me.contact_name.me || data.me.contact_name.me=='false')
      this.contact_name = "";
    else
      this.contact_name = data.me.contact_name.me;

    if(!data.me.type.me || data.me.type.me===undefined)
      this.type = "";
    else
      this.type = data.me.type.me;
    
    if(!data.me.create_date.me || data.me.create_date.me===undefined)
      this.create_date = "";
    else
      this.create_date = data.me.create_date.me;
    
    if(!data.me.write_date.me || data.me.write_date.me===undefined)
      this.write_date = "";
    else
      this.write_date = data.me.write_date.me;
    
    if(!data.me.date_action.me || data.me.date_action.me===undefined)
      this.date_action = "";
    else
      this.date_action = data.me.date_action.me;

    if(!data.me.color.me || data.me.color.me===undefined)
      this.color = 0;
    else
      this.color = data.me.color.me;
    
    if(!data.me.meeting_count.me || data.me.meeting_count.me===undefined)
      this.meeting_count = 0;
    else
      this.meeting_count = data.me.meeting_count.me;

    if(!data.me.function.me || data.me.function.me===undefined)
      this.function = "";
    else
      this.function = data.me.function.me;

    if(data.me.probability==undefined || !data.me.probability.me || data.me.probability.me=='false')
      this.probability = 0;
    else
      this.probability = data.me.probability.me;

    if(data.me.tag_ids==undefined || !data.me.tag_ids.me || data.me.tag_ids.me.length==0)
      this.tag_ids = [];
    else
      this.tag_ids = this.getIdTabs(data.me.tag_ids.me);
    
    if(data.me.order_ids==undefined || !data.me.order_ids.me || data.me.order_ids.me.length==0)
      this.order_ids = [];
    else
      this.order_ids = this.getIdTabs(data.me.order_ids.me);

    if(!data.me.email_from.me || data.me.email_from.me=='false')
      this.email_from = "";
    else
      this.email_from = data.me.email_from.me;

    if(!data.me.phone.me || data.me.phone.me=='false')
      this.phone = "";
    else
      this.phone = data.me.phone.me;

    if(!data.me.mobile.me || data.me.mobile.me=='false')
      this.mobile = "";
    else
      this.mobile = data.me.mobile.me;

    if(!data.me.priority.me || data.me.priority.me=='false')
      this.priority = 0;
    else
      this.priority = data.me.priority.me;

    if(data.me.date_deadline==undefined || !data.me.date_deadline.me || data.me.date_deadline.me=='false')
      this.date_deadline = "";
    else
      this.date_deadline = data.me.date_deadline.me;

    if(data.me.date_open===undefined || !data.me.date_open.me || data.me.date_open.me=='false')
      this.date_open = "";
    else
      this.date_open = data.me.date_open.me;

    if(data.me.fax===undefined || !data.me.fax.me || data.me.fax.me=='false')
      this.fax = "";
    else
      this.fax = data.me.fax.me;

    if(data.me.image_url===undefined || !data.me.image_url.me)
      this.image_url = "assets/images/person.jpg";
    else
      this.image_url = data.me.image_url.me;

    if (data.me.user_id === undefined || !data.me.user_id.me || data.me.user_id.me == 'false')
        this.user_id = { id: 0, name: '' };
    else
        this.user_id = { id: data.me.user_id.me[0].me, name: data.me.user_id.me[1].me };
    
    if (data.me.company_currency == undefined || !data.me.company_currency.me || data.me.company_currency.me == 'false')
        this.company_currency = { id: 0, name: '' };
    else
        this.company_currency = { id: data.me.company_currency.me[0].me, name: data.me.company_currency.me[1].me };
    
    if (data.me.lost_reason == undefined || !data.me.lost_reason.me || data.me.lost_reason.me == 'false')
        this.lost_reason = { id: 0, name: '' };
    else
        this.lost_reason = { id: data.me.lost_reason.me[0].me, name: data.me.lost_reason.me[1].me };
    
    if(data.me.team_id==undefined || !data.me.team_id.me || data.me.team_id.me=='false')
      this.team_id = {id:0, name: ""};
    else
      this.team_id = { 
        id: data.me.team_id.me[0].me,
        name: data.me.team_id.me[1].me 
      };

    if(data.me.partner_id==undefined || !data.me.partner_id.me)
      this.partner_id = {id:0, name:""};
    else
      this.partner_id = { 
        id: data.me.partner_id.me[0].me,
        name: data.me.partner_id.me[1].me 
      };

    if(data.me.next_activity_id==undefined || !data.me.next_activity_id.me || data.me.next_activity_id.me=='false')
      this.next_activity_id = {id:0, name: ""};
    else
      this.next_activity_id = { 
        id: data.me.next_activity_id.me[0].me,
        name: data.me.next_activity_id.me[1].me 
      };
    
    if(data.me.last_activity_id==undefined || !data.me.last_activity_id.me || data.me.last_activity_id.me=='false')
      this.last_activity_id = {id:0, name: ""};
    else
      this.last_activity_id = { 
        id: data.me.last_activity_id.me[0].me,
        name: data.me.last_activity_id.me[1].me 
      };

    if(data.me.title_action==undefined || !data.me.title_action.me || data.me.date_deadline.me=='false')
      this.title_action = "";
    else
      this.title_action = data.me.title_action.me;

    if(data.me.description==undefined || !data.me.description.me)
      this.description = "";
    else
      this.description = data.me.description.me;

    if(data.me.city==undefined || !data.me.city.me)
      this.city = "";
    else
      this.city = data.me.city.me; 

    if(data.me.partner_name==undefined || !data.me.partner_name.me)
      this.partner_name = "";
    else
      this.partner_name = data.me.partner_name.me;

    if(data.me.zip==undefined || !data.me.zip.me)
      this.zip = "";
    else
      this.zip = data.me.zip.me;

    if(data.me.title==undefined || !data.me.title.me || data.me.title.me=='false')
      this.title = { id: 0, name: ''}; 
    else
        this.title = { id: data.me.title.me[0].me, name: data.me.title.me[1].me };

    if(data.me.state_id==undefined || !data.me.state_id.me || data.me.state_id.me=='false')
        this.state_id = { id: 0, name: ''}; 
    else
        this.state_id = { id: data.me.state_id.me[0].me, name: data.me.state_id.me[1].me };

    if(data.me.stage_id==undefined || !data.me.stage_id.me)
        this.stage_id = { id: 0, name: ''}; 
    else
        this.stage_id = { id: data.me.stage_id.me[0].me, name: data.me.stage_id.me[1].me };

    if(data.me.country_id==undefined || !data.me.country_id.me)
        this.country_id = { id: 0, name: ''};
    else
        this.country_id = { id: data.me.country_id.me[0].me, name: data.me.country_id.me[1].me };


    this.active = data.me.active.me;
    this.planned_revenue = data.me.planned_revenue.me;

  }


  //On créé un objet de type Partner
  createPartner(){
   
    this.id = 0;
    this.color = 0;
    this.name = "";
    this.contact_name = "";
    this.probability = 10;
    this.email_from = "";
    this.function = "";
    this.phone = "";
    this.type = "";
    this.mobile = "";
    this.fax = "";
    this.city = "";
    this.zip = "";
    this.priority = 0;
    this.meeting_count = 0;
    this.in_call_center_queue = false;
    this.date_deadline = "";
    this.date_open = "";
    this.partner_name = "";
    this.image_url = "assets/images/person.jpg";
    // this.image = "";
    //this.doc_count = 0;
    this.planned_revenue = 0;
    this.next_activity_id = {id:0, name: ""};
    this.team_id = { id: 0, name: '' };
    this.user_id = { id: 0, name: '' };
    this.partner_id = {id:0, name:""};
    this.title_action = "";
    this.date_action = "";
    this.write_date = "";
    this.create_date = "";
    this.referred = "";
    this.active = true;
    this.tag_ids = [];
    this.order_ids = [];
    this.title = { id: 0, name: '' };
    this.state_id = { id: 0, name: '' }; 
    this.stage_id = { id: 0, name: '' };
    this.country_id = { id: 0, name: '' };
    this.company_currency = { id: 0, name: '' };
    this.lost_reason = { id: 0, name: '' };
  }

}
