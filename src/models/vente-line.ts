/** Cette classe définit l'objet lead (opportunité ou poste) sale.order.line **/
export class VenteLine {

  public id;
  public name;
  public product_uom_qty;
  public price_unit;
  public discount;
  public customer_lead;
  public tax_id;
  public currency_id;
  public price_total;
  public price_subtotal;
  public product_id;
  public price_reduce;
  public price_tax;
  public product_uom;
  public order_id;
  public invoice_lines;
  public invoice_status; 
  public create_date;
  public write_date;

  static statut(){
    return [ 
      {id:'draft', titre:'Proposition'},
      {id:'sent', titre:'Envoyé'},
      {id:'sale', titre:'Bon de commande'},
      {id:'done', titre:'Terminé'},
      {id:'cancel', titre:'Annulé'}
    ];
     
  }

  constructor(serverJSON: any) {
    
    if(serverJSON!=null){
      this.setVenteLine(serverJSON);
    }
    else
      this.createVenteLine();
    
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

  /**
   * cette fonction permet de retourner le 
   * stage courant
   * @param id string, l'identifiant du stage
   * @param tabs Array<any>, tableau des stages
   */
  getNameStage(id, tabs){
    
    for (let i = 0; i < tabs.length; i++) {
      if(id==tabs[i].id)
        return tabs[i]; 
    }
  }

  /** Cette fonction permet de définir 
   * les valeurs des champs
   * @param data JSONObject, il s'agit des données JSON du serveur
   *
   ***/
  setVenteLine(data : any){
    
    this.id = data.me.id.me;

    if(!data.me.name.me || data.me.name.me=='false')
      this.name = "";
    else
      this.name = data.me.name.me;


    if(!data.me.product_uom_qty.me || data.me.product_uom_qty.me===undefined)
      this.product_uom_qty = 0;
    else
      this.product_uom_qty = data.me.product_uom_qty.me;

    if(data.me.invoice_status==undefined || !data.me.invoice_status.me)
      this.invoice_status = 0;
    else
      this.invoice_status = data.me.invoice_status.me;

    if(data.me.tax_id==undefined || !data.me.tax_id.me || data.me.tax_id.me.length==0)
      this.tax_id = [];
    else
      this.tax_id = this.getIdTabs(data.me.tax_id.me);
    
    if(data.me.invoice_lines==undefined || !data.me.invoice_lines.me || data.me.invoice_lines.me.length==0)
      this.invoice_lines = [];
    else
      this.invoice_lines = this.getIdTabs(data.me.invoice_lines.me);


    if(!data.me.price_subtotal.me || data.me.price_subtotal.me=='false')
      this.price_subtotal = 0;
    else
      this.price_subtotal = data.me.price_subtotal.me;
    
    if(data.me.order_id==undefined || !data.me.order_id.me || data.me.order_id.me=='false')
      this.order_id = { id: 0, name: '' };
    else
      this.order_id = { id: data.me.order_id.me[0].me, name: data.me.order_id.me[1].me };
    
    if(data.me.create_date==undefined || !data.me.create_date.me)
      this.create_date = "";
    else
      this.create_date = data.me.create_date.me;
    
    if(data.me.write_date==undefined || !data.me.write_date.me)
      this.write_date = "";
    else
      this.write_date = data.me.write_date.me;
    
    if(data.me.product_id==undefined || !data.me.product_id.me)
      this.product_id = {id:0, name: ""};
    else
      this.product_id = { 
        id: data.me.product_id.me[0].me,
        name: data.me.product_id.me[1].me 
      };

    
    if(data.me.price_tax==undefined || !data.me.price_tax.me)
      this.price_tax = 0;
    else
      this.price_tax = data.me.price_tax.me;

    if(data.me.price_reduce==undefined || !data.me.price_reduce.me)
      this.price_reduce = 0; 
    else
      this.price_reduce = data.me.price_reduce.me;
    
    if(data.me.price_unit==undefined || !data.me.price_unit.me)
      this.price_unit = 0; 
    else
      this.price_unit = data.me.price_unit.me;
    
    if(data.me.discount==undefined || !data.me.discount.me)
      this.discount = 0; 
    else
      this.discount = data.me.discount.me;
    
    if(data.me.customer_lead==undefined || !data.me.customer_lead.me)
      this.customer_lead = 0; 
    else
      this.customer_lead = data.me.customer_lead.me;
    
    if(data.me.price_total==undefined || !data.me.price_total.me)
      this.price_total = 0; 
    else
      this.price_total = data.me.price_total.me;
     
    if(data.me.currency_id==undefined || !data.me.currency_id.me)
      this.currency_id = { id: 0, name: ''};
    else
      this.currency_id = { id: data.me.currency_id.me[0].me, name: data.me.currency_id.me[1].me };
    
      if(data.me.product_uom==undefined || !data.me.product_uom.me)
      this.product_uom = { id: 0, name: ''};
    else
      this.product_uom = { id: data.me.product_uom.me[0].me, name: data.me.product_uom.me[1].me };
    
  }


  //On créé un objet de type Partner
  createVenteLine(){
   
    this.id = 0;
    this.product_uom_qty = 0;
    this.name = "";
    this.invoice_status = 0;
    
    this.price_subtotal = 0;
    this.price_total = 0;
    this.currency_id = {id:0, name: ""};
    
    this.customer_lead = 0;
    this.discount = 0;
    this.price_reduce = 0;
    this.product_id = { id: 0, name: '' };
    this.product_uom = { id: 0, name: '' };
    this.order_id = {id:0, name:""};
    this.price_tax = 0;
    this.write_date = "";
    this.create_date = "";
    this.tax_id = [];
    
  }

}
