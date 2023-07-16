/** Cette classe définit l'objet Ligne Facture (pour la gestion du modele account.invoice.line) **/

export class InvoiceLine {

  public id;
  public name;
  public invoice_id;
  public product_id;
  public account_id;
  public price_unit;
  public partner_id;
  public quantity;
  public price_subtotal;
  public currency_id;
  public invoice_line_tax_ids;
    
  
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
    
    if(!data.me.name.me || data.me.name.me=='false')
      this.name = "";
    else
      this.name = data.me.name.me;

    if(data.me.invoice_id==undefined || !data.me.invoice_id.me || data.me.invoice_id.me=='false')
      this.invoice_id = {id:0, name:""};
    else
      this.invoice_id = { 
        id: data.me.invoice_id.me[0].me,
        name: data.me.invoice_id.me[1].me 
      };

    if(data.me.product_id==undefined || !data.me.product_id.me || data.me.product_id.me=='false')
      this.product_id = {id:0, name:""};
    else
      this.product_id = { 
        id: data.me.product_id.me[0].me,
        name: data.me.product_id.me[1].me 
      };

    if(data.me.account_id==undefined || !data.me.account_id.me || data.me.account_id.me=='false')
      this.account_id = {id:0, name:""};
    else
      this.account_id = { 
        id: data.me.account_id.me[0].me,
        name: data.me.account_id.me[1].me 
      };

    if(data.me.price_unit==undefined || !data.me.price_unit.me)
      this.price_unit = 0;
    else
      this.price_unit = data.me.price_unit.me;

     if(data.me.quantity==undefined || !data.me.quantity.me)
      this.quantity = 1;
    else
      this.quantity = data.me.quantity.me;

    if(data.me.price_subtotal==undefined || !data.me.price_subtotal.me)
      this.price_subtotal = 0;
    else
      this.price_subtotal = data.me.price_subtotal.me;

    if(data.me.partner_id==undefined || !data.me.partner_id.me)
      this.partner_id = {id:0, name:""};
    else
      this.partner_id = {
        id: data.me.partner_id.me[0].me,
        name: data.me.partner_id.me[1].me 
      };

    if(data.me.currency_id==undefined || !data.me.currency_id.me)
      this.currency_id = {id:0, name:""};
    else
      this.currency_id = {
        id: data.me.currency_id.me[0].me,
        name: data.me.currency_id.me[1].me 
      };

    if(data.me.invoice_line_tax_ids==undefined || !data.me.invoice_line_tax_ids.me || data.me.invoice_line_tax_ids.me.length==0)
      this.invoice_line_tax_ids = [];
    else
      this.invoice_line_tax_ids = this.getIdTabs(data.me.invoice_line_tax_ids.me);

  }

  setFromAffaire(data){
    
    //this.date_invoice = new Date();
    this.invoice_id = {
      id: data.id,
      name: data.name
    }; 
    
    this.partner_id = data.partner_id;
    
  }

  //Initialisation des données
   initObjet(){

    this.id = 0;
    
    this.name = "";
    this.partner_id = {id:0, name: ""};
    this.account_id = {id:0, name: ""};
    this.currency_id = {id:0, name: ""};
    this.invoice_line_tax_ids = [];
    this.price_unit = 0;
    this.quantity = 1;
    this.price_subtotal = 0;
    this.invoice_id = {id:0, name: ""};
    this.product_id = {id:0, name: ""};
    
  }


}
