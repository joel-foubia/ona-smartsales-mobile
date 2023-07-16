import { VenteLine } from "./vente-line";

/** Cette classe définit l'objet lead (opportunité ou poste) sale.order **/
export class Vente {

  public id;
  public name;
  public opportunity_id;
  public partner_invoice_id;
  public partner_shipping_id;
  public picking_policy;
  public warehouse_id;
  public team_id;
  public order_line;
  public partner_id;
  public date_order;
  public user_id;
  public note;
  public currency_id;
  public state;
  public amount_tax;
  public invoice_status;
  public amount_untaxed;
  public amount_total;
  public create_date;
  public product_id;
  public write_date;
  public payment_term_id;
  public fiscal_position_id;
  public validity_date;
  public company_id;
  public project_id;
  public objetLine: VenteLine;
  

  static statut(){
    return [ 
      {id:'draft', titre:'Proposition'},
      {id:'sent', titre:'Envoyé'},
      {id:'sale', titre:'Bon de Commande'},
      {id:'done', titre:'Terminé'},
      {id:'cancel', titre:'Annulé'}
    ];
     
  }

  constructor(serverJSON: any) {
    
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
  setPartner(data : any){
    
    this.id = data.me.id.me;

    if(!data.me.name.me || data.me.name.me=='false')
      this.name = "";
    else
      this.name = data.me.name.me;


    if(!data.me.picking_policy.me || data.me.picking_policy.me===undefined)
      this.picking_policy = 0;
    else
      this.picking_policy = data.me.picking_policy.me;

    if(data.me.order_line==undefined || !data.me.order_line.me || data.me.order_line.me.length==0)
      this.order_line = [];
    else
      this.order_line = this.getIdTabs(data.me.order_line.me);

    if(data.me.team_id==undefined || !data.me.team_id.me || data.me.team_id.me=='false')
      this.team_id = { id: 0, name: '' };
    else
        this.team_id = { id: data.me.team_id.me[0].me, name: data.me.team_id.me[1].me };
    
    if(data.me.partner_shipping_id==undefined || !data.me.partner_shipping_id.me || data.me.partner_shipping_id.me=='false')
      this.partner_shipping_id = { id: 0, name: '' };
    else
      this.partner_shipping_id = { id: data.me.partner_shipping_id.me[0].me, name: data.me.partner_shipping_id.me[1].me };

    if(data.me.date_order==undefined || !data.me.date_order.me || data.me.date_order.me=='false')
      this.date_order = "";
    else
      this.date_order = data.me.date_order.me;
    
    if(data.me.invoice_status==undefined || !data.me.invoice_status.me || data.me.invoice_status.me=='false')
      this.invoice_status = "";
    else
      this.invoice_status = data.me.invoice_status.me;
    
    if(data.me.create_date==undefined || !data.me.create_date.me)
      this.create_date = "";
    else
      this.create_date = data.me.create_date.me;
    
    if(data.me.write_date==undefined || !data.me.write_date.me)
      this.write_date = "";
    else
      this.write_date = data.me.write_date.me;

    /* if(!data.me.partner_product_uom.me || data.me.partner_product_uom.me=='false')
      this.partner_product_uom = "assets/images/person.jpg";
    else
      this.partner_product_uom = data.me.partner_product_uom.me; */

    if (data.me.user_id == undefined || !data.me.user_id.me || data.me.user_id.me == 'false')
        this.user_id = { id: 0, name: '' };
    else
        this.user_id = { id: data.me.user_id.me[0].me, name: data.me.user_id.me[1].me };
    
    if(data.me.opportunity_id==undefined || !data.me.opportunity_id.me)
      this.opportunity_id = {id:0, name: ""};
    else
      this.opportunity_id = { 
        id: data.me.opportunity_id.me[0].me,
        name: data.me.opportunity_id.me[1].me 
      };

    if(data.me.partner_id==undefined || !data.me.partner_id.me)
      this.partner_id = {id:0, name:""};
    else
      this.partner_id = { 
        id: data.me.partner_id.me[0].me,
        name: data.me.partner_id.me[1].me 
      };

    if(data.me.partner_invoice_id==undefined || !data.me.partner_invoice_id.me )
      this.partner_invoice_id = {id:0, name: ""};
    else
      this.partner_invoice_id = { 
        id: data.me.partner_invoice_id.me[0].me,
        name: data.me.partner_invoice_id.me[1].me 
      };
    if(data.me.product_id==undefined || !data.me.product_id.me )
      this.product_id = {id:0, name: ""};
    else
      this.product_id = { 
        id: data.me.product_id.me[0].me,
        name: data.me.product_id.me[1].me 
      };

    if(data.me.note==undefined || !data.me.note.me)
      this.note = "";
    else
      this.note = data.me.note.me;

    if(data.me.state==undefined || !data.me.state.me)
      this.state = "";
    else
      this.state = data.me.state.me;

    if(data.me.warehouse_id==undefined || !data.me.warehouse_id.me || data.me.warehouse_id.me=='false')
        this.warehouse_id = { id: 0, name: ''}; 
    else
        this.warehouse_id = { id: data.me.warehouse_id.me[0].me, name: data.me.warehouse_id.me[1].me };

    if(data.me.payment_term_id==undefined || !data.me.payment_term_id.me)
        this.payment_term_id = { id: 0, name: ''}; 
    else
        this.payment_term_id = { id: data.me.payment_term_id.me[0].me, name: data.me.payment_term_id.me[1].me };

    
    if(data.me.validity_date==undefined || !data.me.validity_date.me)
      this.validity_date = ""; 
    else
      this.validity_date = data.me.validity_date.me;
    
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

    if(data.me.company_id==undefined || !data.me.company_id.me)
      this.company_id = { id: 0, name: ''};
    else
      this.company_id = { id: data.me.company_id.me[0].me, name: data.me.company_id.me[1].me };
    
    if(data.me.currency_id==undefined || !data.me.currency_id.me)
      this.currency_id = { id: 0, name: ''};
    else
      this.currency_id = { id: data.me.currency_id.me[0].me, name: data.me.currency_id.me[1].me };
    
    if(data.me.fiscal_position_id==undefined || !data.me.fiscal_position_id.me)
      this.fiscal_position_id = { id: 0, name: ''};
    else
      this.fiscal_position_id = { id: data.me.fiscal_position_id.me[0].me, name: data.me.fiscal_position_id.me[1].me };
    
    if(data.me.project_id==undefined || !data.me.project_id.me)
      this.project_id = { id: 0, name: ''};
    else
      this.project_id = { id: data.me.project_id.me[0].me, name: data.me.project_id.me[1].me };    

  }


  //On créé un objet de type Partner
  createPartner(){
   
    this.id = 0;
    this.picking_policy = "";
    this.name = "";
    
    this.validity_date = "";
    
    this.amount_total = 0;
    this.amount_tax = 0;
    this.amount_untaxed = 0;
    
    this.company_id = {id:0, name: ""};
    this.project_id = {id:0, name: ""};
    this.state = "";
    this.team_id = {id:0, name: ""};
    this.currency_id = {id:0, name: ""};
    this.date_order = "";
    this.partner_invoice_id = {id:0, name: ""};
    this.product_id = {id:0, name: ""};
    this.opportunity_id = { id: 0, name: '' };
    this.fiscal_position_id = { id: 0, name: '' };
    this.user_id = { id: 0, name: '' };
    this.partner_id = {id:0, name:""};
    this.partner_shipping_id = {id:0, name:""};
    this.write_date = "";
    this.create_date = "";
    this.invoice_status = "";
    this.order_line = [];
    this.warehouse_id = { id: 0, name: '' };
    this.payment_term_id = { id: 0, name: '' };
    this.objetLine = new VenteLine(null);
  }

}
