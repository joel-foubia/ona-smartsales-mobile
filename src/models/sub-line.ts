/** Cette classe définit l'objet Ligne d'Abonnements (pour la gestion du modele sale.subscription..line) **/

export class SubLine {

    public id;
    public name;
    public uom_id;
    public product_id;
    public analytic_account_id;
    public price_unit;
    public actual_quantity;
    public quantity;
    public price_subtotal;
    public sold_quantity;
    public discount;
      
 
    /*
     * @param type string, correspond au type de données à insérer
     * @param serverJSON JSONObject, il s'agit des données qui proviennent du server ou 
     *                              d'une autre soruce
     *
     */
    constructor(serverJSON: any) {
      
      if(serverJSON!=null){
        this.setSubLine(serverJSON);
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
    setSubLine(data : any){
      
      this.id = data.me.id.me;
      
      if(!data.me.name.me || data.me.name.me=='false')
        this.name = "";
      else
        this.name = data.me.name.me;
  
      if(data.me.uom_id==undefined || !data.me.uom_id.me || data.me.uom_id.me=='false')
        this.uom_id = {id:0, name:""};
      else
        this.uom_id = { 
          id: data.me.uom_id.me[0].me,
          name: data.me.uom_id.me[1].me 
        };
  
      if(data.me.product_id==undefined || !data.me.product_id.me || data.me.product_id.me=='false')
        this.product_id = {id:0, name:""};
      else
        this.product_id = { 
          id: data.me.product_id.me[0].me,
          name: data.me.product_id.me[1].me 
        };
  
      if(data.me.analytic_account_id==undefined || !data.me.analytic_account_id.me || data.me.analytic_account_id.me=='false')
        this.analytic_account_id = {id:0, name:""};
      else
        this.analytic_account_id = { 
          id: data.me.analytic_account_id.me[0].me,
          name: data.me.analytic_account_id.me[1].me 
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
  
      if(data.me.actual_quantity==undefined || !data.me.actual_quantity.me)
        this.actual_quantity = 0;
      else
        this.actual_quantity = data.me.actual_quantity.me;
  
      if(data.me.sold_quantity==undefined || !data.me.sold_quantity.me)
        this.sold_quantity = 0;
      else
        this.sold_quantity = data.me.sold_quantity.me;
  
      if(data.me.discount==undefined || !data.me.discount.me)
        this.discount = 0;
      else
        this.discount = data.me.discount.me;
  
    }
  
  
    //Initialisation des données
     initObjet(){
  
      this.id = 0;
      
      this.name = "";
      this.actual_quantity = 0;
      this.analytic_account_id = {id:0, name: ""};
      this.sold_quantity = 0;
      this.discount = 0;
      this.price_unit = 0;
      this.quantity = 1;
      this.price_subtotal = 0;
      this.uom_id = {id:0, name: ""};
      this.product_id = {id:0, name: ""};
      
    }
  
  
  }
  