/** Cette classe définit l'objet Partner (client, contact, tribunal) **/
export class Partner {

  public idx; //auto increment
  public id;
  public comment;
  public state_id;
  public name;
  public supplier;
  public active;
  public partner_ref;
  public middle_name;
  public last_name;
  public image_url;
  public mobile;
  public phone;
  public email;
  public display_name;
  public image;
  public street2;
  public zip;
  public city;
  public total_invoiced;
  public street;
  public fax;
  public website;
  public title;
  public country_id;
  public currency_id;
  public parent_id;
  public lang;
  public user_id;
  public child_ids; // Adresses and contacts
  public category_id; // Tags
  public company_type; //company
  public function;
  public meeting_ids;
  public invoice_ids;
  public opportunity_ids;
  public sale_order_ids;
  public subscription_count;
  
  private obj_type; //soit un client, contact
  

  //Définitions des messages à envoyer
  static error_phone = "Le numéro de téléphone n'a pas été attribué. Aller dans la rubrique Modifier";
  static error_email = "Vous ne pouvez pas envoyer de mail, l'Email n'a pas été attribué. Attribuez un Email";
  static error_website = "Le site web ne peut pas s'ouvrir, l'adresse du site internet n'a pas été enregistré";
  static noInternet = "Impossible d'enregistrer. Problème de connexion Internet";
  static errSaving = "Une erreur est survenu lors de la création d'un nouveau";


  constructor(serverJSON: any, type: string) {

    this.setType(type);
    if(serverJSON!=null)
      this.setPartner(serverJSON);
    else
      this.createPartner();
    
  } 

  //Permet de définir la liste des titres
  //à attribuer à un parternaire
  private listTabTitles(){

    let tab_title = [
      { id:0, text:"Aucun"},
      { id:1, text:"Madam" },
      { id:2, text:"Miss"},
      { id:3, text:"Sir"},
      { id:4, text:"Mister"},
      { id:5, text:"Doctor"},
      { id:6, text:"Professor"}
      
    ];  

    return tab_title;
  }

  //Cette fonction permet de générer un tableau
  //d'identifiant
  private getIdTabs(liste){

    let tab = [];

    for (var i = 0; i < liste.length; i++) {
        tab.push(liste[i].me);
    }

    return tab;
  } 

  /** 
   * Cette fonction retourne le titre
   * en fonction de l'id
   * @param id int, l'id du titre
   * @return string
   **/
  getTitreById(id){

    let tab = this.listTabTitles();

    for (let i = 0; i < tab.length; i++) {
      if(tab[i].id==parseInt(id))
        return tab[i].text;
    }
 
  }

  /** Cette fonction permet de définir 
   * les valeurs des champs
   * @param data JSONObject, il s'agit des données JSON du serveur
   *
   ***/
  setPartner(data : any){
    
    this.id = data.me.id.me;

    if(!data.me.name.me || data.me.name==undefined)
      this.name = "";
    else
      this.name = data.me.name.me;
    
    if(!data.me.supplier.me || data.me.supplier==undefined)
      this.supplier = false;
    else
      this.supplier = data.me.supplier.me;
    
    if(!data.me.display_name.me || data.me.display_name==undefined)
      this.display_name = "";
    else
      this.display_name = data.me.display_name.me;

    if(data.me.middle_name==undefined || !data.me.middle_name.me || data.me.middle_name.me=='false')
      this.middle_name = "";
    else
      this.middle_name = data.me.middle_name.me;

    if(data.me.last_name==undefined || !data.me.last_name.me || data.me.last_name.me=='false')
      this.last_name = "";
    else
      this.last_name = data.me.last_name.me;

    if(!data.me.email.me || data.me.email.me=='false')
      this.email = "";
    else
      this.email = data.me.email.me;

    if(!data.me.website.me || data.me.website==undefined || data.me.website.me=="http://false")
      this.website = "";
    else
      this.website = data.me.website.me;

    if(!data.me.phone.me || data.me.phone.me=='false')
      this.phone = "";
    else
      this.phone = data.me.phone.me;

    if(!data.me.mobile.me || data.me.mobile.me=='false')
      this.mobile = "";
    else
      this.mobile = data.me.mobile.me;

    if(!data.me.fax.me || data.me.fax.me=='false')
      this.fax = "";
    else
      this.fax = data.me.fax.me;

    if(!data.me.city.me || data.me.city.me=='false')
      this.city = "";
    else
      this.city = data.me.city.me;

    if(!data.me.street.me || data.me.street.me=='false')
      this.street = "";
    else
      this.street = data.me.street.me;

    if(data.me.zip==undefined || !data.me.zip.me)
      this.zip = "";
    else
      this.zip = data.me.zip.me;
    
    if(data.me.total_invoiced==undefined || !data.me.total_invoiced.me)
      this.total_invoiced = 0;
    else
      this.total_invoiced = data.me.total_invoiced.me;
    
    if(data.me.subscription_count==undefined || !data.me.subscription_count.me)
      this.subscription_count = 0;
    else
      this.subscription_count = data.me.subscription_count.me;

    if(data.me.street2==undefined || !data.me.street2.me)
      this.street2 = "";
    else
      this.street2 = data.me.street2.me;

    if(data.me.image_url.me===undefined || !data.me.image_url.me)
      this.image_url = "assets/images/person.jpg";
    else
      this.image_url = data.me.image_url.me; 

    /*if(!data.me.image.me || data.me.image.me=='false')
      this.image = "";
    else
      this.image = data.me.image.me;*/
    
    //ON attribut des valeurs aux restes des propriétés
    if(data.me.function==undefined || !data.me.function.me || data.me.function.me=='false')
      this.function = "";
    else
      this.function = data.me.function.me; 
    
    if(data.me.comment==undefined || !data.me.comment.me )
      this.comment = "";
    else
      this.comment = data.me.comment.me; 

    if(data.me.child_ids==undefined || !data.me.child_ids.me || data.me.child_ids.me.length==0)
      this.child_ids = [];
    else
      this.child_ids = this.getIdTabs(data.me.child_ids.me);
    
    if(data.me.category_id==undefined || !data.me.category_id.me || data.me.category_id.me.length==0)
      this.category_id = [];
    else
      this.category_id = this.getIdTabs(data.me.category_id.me);
    
    if(data.me.meeting_ids==undefined || !data.me.meeting_ids.me || data.me.meeting_ids.me.length==0)
      this.meeting_ids = [];
    else
      this.meeting_ids = this.getIdTabs(data.me.meeting_ids.me);
    
    if(data.me.invoice_ids==undefined || !data.me.invoice_ids.me || data.me.invoice_ids.me.length==0)
      this.invoice_ids = [];
    else
      this.invoice_ids = this.getIdTabs(data.me.invoice_ids.me);
    
    if(data.me.sale_order_ids==undefined || !data.me.sale_order_ids.me || data.me.sale_order_ids.me.length==0)
      this.sale_order_ids = [];
    else
      this.sale_order_ids = this.getIdTabs(data.me.sale_order_ids.me);
    
    if(data.me.opportunity_ids==undefined || !data.me.opportunity_ids.me || data.me.opportunity_ids.me.length==0)
      this.opportunity_ids = [];
    else
      this.opportunity_ids = this.getIdTabs(data.me.opportunity_ids.me);

    if(data.me.company_type==undefined || !data.me.company_type.me || data.me.company_type.me=='false')
      this.company_type = "";
    else
      this.company_type = data.me.company_type.me;

    if(data.me.title==undefined || !data.me.title.me || data.me.title.me=='false')
      this.title = { id: 0, name: ''}; 
    else
        this.title = { id: data.me.title.me[0].me, name: data.me.title.me[1].me };
    
    if(data.me.currency_id==undefined || !data.me.currency_id.me)
      this.currency_id = { id: 0, name: ''}; 
    else
      this.currency_id = { id: data.me.currency_id.me[0].me, name: data.me.currency_id.me[1].me };
    
    if(data.me.parent_id==undefined || !data.me.parent_id.me || data.me.parent_id.me=='false')
      this.parent_id = { id: 0, name: ''}; 
    else
      this.parent_id = { id: data.me.parent_id.me[0].me, name: data.me.parent_id.me[1].me };
    
    if(data.me.country_id==undefined || !data.me.country_id.me)
        this.country_id = { id: 0, name: ''};
    else
        this.country_id = { id: data.me.country_id.me[0].me, name: data.me.country_id.me[1].me };
    
    if(data.me.state_id==undefined || !data.me.state_id.me)
        this.state_id = { id: 0, name: ''};
    else
        this.state_id = { id: data.me.state_id.me[0].me, name: data.me.state_id.me[1].me };

    if (data.me.user_id == undefined || !data.me.user_id.me || data.me.user_id.me == 'false')
        this.user_id = { id: 0, name: '' };
    else
        this.user_id = { id: data.me.user_id.me[0].me, name: data.me.user_id.me[1].me };
     
    if(data.me.company_type==undefined || !data.me.company_type.me || data.me.company_type.me=='false')
        this.company_type = "";
    else
      this.lang = data.me.lang.me;
    
    this.partner_ref = data.me.partner_ref.me;
    this.active = data.me.active.me;
    // this.is_company = data.me.is_company.me;

  }
  
  /** set up type **/
  setType(type: string){
    this.obj_type = type; 
  }

  getType(){
    return this.obj_type;
  }

  //On créé un objet de type Partner
  createPartner(){

    this.id = 0;
    this.name = "";
    this.middle_name = "";
    this.last_name = "";
    this.email = "";
    this.website = "";
    this.phone = "";
    this.mobile = "";
    this.fax = "";
    this.city = "";
    this.street = "";
    this.zip = "";
    this.street2 = "";
    this.image_url = "assets/images/person.jpg";
    this.image = "";
    this.function = "";
    this.display_name = "";
    
    this.company_type = "person";
    this.title = { id: 0, name: '' };
    this.user_id = { id: 0, name: '' };
    this.country_id = { id: 0, name: '' };
    this.state_id = { id: 0, name: '' };
    this.parent_id = { id: 0, name: '' };
    this.currency_id = { id: 0, name: 'EUR' };
    this.category_id = [];
    this.child_ids = [];
    this.opportunity_ids = [];
    this.sale_order_ids = [];
    this.meeting_ids = [];
    this.invoice_ids = [];
    this.lang = "en_US";
    this.partner_ref = "";
    this.comment = "";
    this.total_invoiced = 0;
    this.subscription_count = 0;
    this.active = true;
    this.supplier = false;
  }

}
