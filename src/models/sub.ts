/** Cette classe définit l'objet Abonnement (pour la gestion du modele sale.subscription) **/

export class Subscription {

    public id;
    public name;
    public code;
    public state;
    public partner_id;
    public recurring_next_date;
    public template_id;
    public manager_id;
    public date_start;
    public recurring_invoice_line_ids;
    public recurring_rule_type;
    public currency_id;
    public recurring_total;
    public user_id;
    
  
    /*
     * @param type string, correspond au type de données à insérer
     * @param serverJSON JSONObject, il s'agit des données qui proviennent du server ou 
     *                              d'une autre soruce
     *
     */
    constructor(serverJSON: any) {
      
      if(serverJSON!=null)
        this.setSub(serverJSON);  
      else
        this.initObjet();
      
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
    setSub(data : any){
      
      this.id = data.me.id.me;
  
      if(!data.me.code.me || data.me.code.me==undefined)
        this.code = "";
      else
        this.code = data.me.code.me;
      
      if(!data.me.state.me || data.me.state.me==undefined)
        this.state = "";
      else
        this.state = data.me.state.me;
      
      if(!data.me.name.me || data.me.name.me=='false')
        this.name = "";
      else
        this.name = data.me.name.me;
  
        
      if(data.me.partner_id==undefined || !data.me.partner_id.me)
        this.partner_id = {id:0, name:""};
      else
        this.partner_id = { 
          id: data.me.partner_id.me[0].me,
          name: data.me.partner_id.me[1].me 
        };
  
      if(!data.me.recurring_rule_type.me || data.me.recurring_rule_type.me=='false')
        this.recurring_rule_type = '';
      else
        this.recurring_rule_type = data.me.recurring_rule_type.me;
      
      if(!data.me.currency_id.me || data.me.currency_id===undefined)
        this.currency_id = {id:0, name:""};
      else
        this.currency_id = { 
            id: data.me.currency_id.me[0].me,
            name: data.me.currency_id.me[1].me 
          };
  
      if(data.me.recurring_total==undefined || !data.me.recurring_total.me)
        this.recurring_total = 0;
      else
        this.recurring_total = data.me.recurring_total.me;
  
      if(data.me.user_id==undefined || !data.me.user_id.me)
        this.user_id = {id:0, name:""};
      else
        this.user_id = {
          id: data.me.user_id.me[0].me,
          name: data.me.user_id.me[1].me 
        };
      
      if(data.me.template_id==undefined || !data.me.template_id.me)
        this.template_id = {id:0, name:""};
      else
        this.template_id = {
          id: data.me.template_id.me[0].me,
          name: data.me.template_id.me[1].me 
        };
  
      if(data.me.date_start.me==undefined || !data.me.date_start.me)
        this.date_start = '';
      else
        this.date_start = data.me.date_start.me;
      
  
      if(data.me.recurring_invoice_line_ids==undefined || !data.me.recurring_invoice_line_ids.me || data.me.recurring_invoice_line_ids.me.length==0)
        this.recurring_invoice_line_ids = [];
      else
        this.recurring_invoice_line_ids = this.getIdTabs(data.me.recurring_invoice_line_ids.me);
      
      if(data.me.manager_id==undefined || !data.me.manager_id.me || data.me.manager_id.me=='false')
        this.manager_id = {id:0, name:""};
      else
        this.manager_id = { 
          id: data.me.manager_id.me[0].me,
          name: data.me.manager_id.me[1].me 
        };

      if(data.me.recurring_next_date==undefined || !data.me.recurring_next_date.me)
        this.recurring_next_date = "";
      else
        this.recurring_next_date = data.me.recurring_next_date.me;
    }
  
      
    //Initialisation des données
    initObjet(){
    
      this.id = 0;
      this.recurring_next_date = "";
      this.date_start = "";
      this.name = "";
      this.state = "";
      this.code = "";
      this.currency_id = {id:0, name: ""};
      this.user_id = {id:0, name: ""};
      this.partner_id = {id:0, name: ""}; 
      this.template_id = {id:0, name: ""};
      this.manager_id = {id:0, name: ""};
      this.recurring_invoice_line_ids = [];
      this.recurring_total = 0;
      this.recurring_rule_type = '';
      
    }
  
  
  }
  