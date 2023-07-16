/** Cette classe définit l'objet invoice (pour la gestion du modele account.invoice) **/

export class Invoice {

  public id;
  public name;
  public date_due;
  public date_invoice;
  public create_date;
  public write_date;
  public number;
  public sent;
  public reference_type;
  public team_id;
  public account_id;
  public company_id;
  public journal_id;
  public amount_total;
  public currency_id;
  public state;
  public payment_ids;
  public residual;
  public partner_id;
  public user_id;
  public amount_tax;
  public amount_untaxed;
  public payment_term_id;
  public invoice_line_ids;
  public lines = [];
    
  
  //Définitions des messages à envoyer
  static error_save = "Impossible d'enregistrer une audience";
  static noInternet = "Impossible d'enregistrer. Problème de connexion Internet";

  /*
   * @param type string, correspond au type de données à insérer
   * @param serverJSON JSONObject, il s'agit des données qui proviennent du server ou 
   *                              d'une autre soruce
   *
   */
  constructor(type, serverJSON: any) {
    
    if(serverJSON!=null){
      if(type!='a')
        this.setInvoice(serverJSON);
      else
        this.setFromAffaire(serverJSON);  
    }else{
      this.initObjet();
    }
    
    
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


  /** Cette fonction permet de définir 
   * les valeurs des champs
   * @param data JSONObject, il s'agit des données JSON du serveur
   *
   ***/
  setInvoice(data : any){
    
    this.id = data.me.id.me;

    if(!data.me.residual.me || data.me.residual.me==undefined)
      this.residual = 0;
    else
      this.residual = data.me.residual.me;
    
    if(!data.me.name.me || data.me.name==undefined)
      this.name = "";
    else
      this.name = data.me.name.me;
    
    if(!data.me.create_date.me || data.me.create_date==undefined)
      this.create_date = "";
    else
      this.create_date = data.me.create_date.me;
    
    if(!data.me.write_date.me || data.me.write_date==undefined)
      this.write_date = "";
    else
      this.write_date = data.me.write_date.me;
    
    if(data.me.sent.me===undefined || !data.me.sent.me)
      this.sent = false;
    else
      this.sent = data.me.sent.me;

    if(!data.me.number.me || data.me.number.me=='false')
      this.number = "";
    else
      this.number = data.me.number.me;

    if(data.me.team_id==undefined || !data.me.team_id.me || data.me.team_id.me=='false')
      this.team_id = {id:0, name:""};
    else
      this.team_id = { 
        id: data.me.team_id.me[0].me,
        name: data.me.team_id.me[1].me 
      };

    if(data.me.account_id==undefined || !data.me.account_id.me || data.me.account_id.me=='false')
      this.account_id = {id:0, name:""};
    else
      this.account_id = { 
        id: data.me.account_id.me[0].me,
        name: data.me.account_id.me[1].me 
      };

    if(!data.me.state.me || data.me.state.me=='false')
      this.state = '';
    else
      this.state = data.me.state.me;
    
    if(!data.me.reference_type.me || data.me.reference_type.me=='false')
      this.reference_type = '';
    else
      this.reference_type = data.me.reference_type.me;

    if(data.me.amount_total==undefined || !data.me.amount_total.me)
      this.amount_total = 0;
    else
      this.amount_total = data.me.amount_total.me;

     if(data.me.amount_tax==undefined || !data.me.amount_tax.me)
      this.amount_tax = 0;
    else
      this.amount_tax = data.me.amount_tax.me;

    if(data.me.amount_untaxed==undefined || !data.me.amount_untaxed.me)
      this.amount_untaxed = 0;
    else
      this.amount_untaxed = data.me.amount_untaxed.me;

    if(data.me.partner_id==undefined || !data.me.partner_id.me)
      this.partner_id = {id:0, name:""};
    else
      this.partner_id = {
        id: data.me.partner_id.me[0].me,
        name: data.me.partner_id.me[1].me 
      };

    if(data.me.user_id==undefined || !data.me.user_id.me)
      this.user_id = {id:0, name:""};
    else
      this.user_id = {
        id: data.me.user_id.me[0].me,
        name: data.me.user_id.me[1].me 
      };
    
    if(data.me.company_id==undefined || !data.me.company_id.me)
      this.company_id = {id:0, name:""};
    else
      this.company_id = {
        id: data.me.company_id.me[0].me,
        name: data.me.company_id.me[1].me 
      };

    if(data.me.payment_term_id==undefined || !data.me.payment_term_id.me)
      this.payment_term_id = {id:0, name:""};
    else
      this.payment_term_id = {
        id: data.me.payment_term_id.me[0].me,
        name: data.me.payment_term_id.me[1].me 
      };

    if(data.me.date_invoice.me==undefined || !data.me.date_invoice.me)
      this.date_invoice = '';
    else
      this.date_invoice = data.me.date_invoice.me;
    
    
    if(data.me.payment_ids==undefined || !data.me.payment_ids.me || data.me.payment_ids.me.length==0)
      this.payment_ids = [];
    else
      this.payment_ids = this.getIdTabs(data.me.payment_ids.me);
    
    if(data.me.currency_id==undefined || !data.me.currency_id.me)
      this.currency_id = {id:0, name:""};
    else
      this.currency_id = {
        id: data.me.currency_id.me[0].me,
        name: data.me.currency_id.me[1].me 
      };

    if(data.me.invoice_line_ids==undefined || !data.me.invoice_line_ids.me || data.me.invoice_line_ids.me.length==0)
      this.invoice_line_ids = [];
    else
      this.invoice_line_ids = this.getIdTabs(data.me.invoice_line_ids.me);
    
      if(data.me.journal_id==undefined || !data.me.journal_id.me || data.me.journal_id.me=='false')
      this.journal_id = {id:0, name:""};
    else
      this.journal_id = { 
        id: data.me.journal_id.me[0].me,
        name: data.me.journal_id.me[1].me 
      };

    this.date_due = data.me.date_due.me;
  }

  setFromAffaire(data){
    
    //this.date_invoice = new Date();
    this.team_id = {
      id: data.id,
      name: data.name
    };
    
    this.partner_id = data.partner_id;
    
  }

  //Initialisation des données
  initObjet(){
  
    this.id = 0;
    this.date_due = new Date();
    this.date_invoice = '';
    this.write_date = '';
    this.create_date = '';
    this.name = "";
    this.sent = false;
    this.number = "";
    this.reference_type = "";
    this.user_id = {id:0, name: ""};
    this.partner_id = {id:0, name: ""};
    this.account_id = {id:0, name: ""}; 
    this.company_id = {id:0, name: ""};
    this.journal_id = {id:0, name: ""};
    this.payment_term_id = {id:0, name: ""};
    this.payment_ids = [];
    this.invoice_line_ids = [];
    this.amount_total = 0;
    this.amount_tax = 0;
    this.amount_untaxed = 0;
    this.state = 'draft';
    this.team_id = {id:0, name: ""};
    this.currency_id = {id:0, name: ""};
    this.lines = [];
  }


}
