/** Cette classe définit l'objet participant (pour la gestion du modele event.registration) **/

export class Participant {

    public id;
    public name;
    public phone;
    public email;
    public partner_id;
    public event_id;
    public event_ticket_id;
    public date_open;
    public date_closed;
    public user_id;
    public state;
    public origin;
    public sale_order_id;

  
    /*
     * @param type string, correspond au type de données à insérer
     * @param serverJSON JSONObject, il s'agit des données qui proviennent du server ou 
     *                              d'une autre soruce
     *
     */
    constructor(serverJSON: any) {
      
      if(serverJSON!=null)
        this.setParticipant(serverJSON);  
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
    setParticipant(data : any){
      
      this.id = data.me.id.me;
      
      if(!data.me.name.me || data.me.name.me=='false')
        this.name = "";
      else
        this.name = data.me.name.me;
  
      if(!data.me.email.me || data.me.email.me=='false')
        this.email = "";
      else
        this.email = data.me.email.me;
  
        
      if(data.me.partner_id==undefined || !data.me.partner_id.me)
        this.partner_id = {id:0, name:""};
      else
        this.partner_id = { 
          id: data.me.partner_id.me[0].me,
          name: data.me.partner_id.me[1].me 
        };
  
      if(!data.me.state.me || data.me.state.me=='false')
        this.state = '';
      else
        this.state = data.me.state.me;
      
      if(!data.me.phone.me || data.me.phone.me=='false')
        this.phone = '';
      else
        this.phone = data.me.phone.me;
  
      if(data.me.sale_order_id==undefined || !data.me.sale_order_id.me)
        this.sale_order_id = {id:0, name:""};
      else
        this.sale_order_id = { 
            id: data.me.sale_order_id.me[0].me,
            name: data.me.sale_order_id.me[1].me 
        };
    
      if(data.me.origin==undefined || !data.me.origin.me)
        this.origin = 0;
      else
        this.origin = data.me.origin.me;
  
      if(data.me.user_id==undefined || !data.me.user_id.me)
        this.user_id = {id:0, name:""};
      else
        this.user_id = {
          id: data.me.user_id.me[0].me,
          name: data.me.user_id.me[1].me 
        };
      
      if(data.me.event_id==undefined || !data.me.event_id.me)
        this.event_id = {id:0, name:""};
      else
        this.event_id = {
          id: data.me.event_id.me[0].me,
          name: data.me.event_id.me[1].me 
        };
  
      if(data.me.date_closed.me==undefined || !data.me.date_closed.me)
        this.date_closed = '';
      else
        this.date_closed = data.me.date_closed.me;
      
      if(data.me.event_ticket_id==undefined || !data.me.event_ticket_id.me || data.me.event_ticket_id.me=='false')
        this.event_ticket_id = {id:0, name:""};
      else
        this.event_ticket_id = { 
          id: data.me.event_ticket_id.me[0].me,
          name: data.me.event_ticket_id.me[1].me 
        };

      if(data.me.date_open==undefined || !data.me.date_open.me)
        this.date_open = "";
      else
        this.date_open = data.me.date_open.me;
    }
  
      
    //Initialisation des données
    initObjet(){
    
      this.id = 0;
      this.date_open = new Date();
      this.date_closed = '';
      this.name = "";
      this.email = "";
      this.phone = "";
      this.user_id = {id:0, name: ""};
      this.partner_id = {id:0, name: ""}; 
      this.event_id = {id:0, name: ""};
      this.event_ticket_id = {id:0, name: ""};
      this.sale_order_id = {id:0, name: ""};
      this.origin = "";
      this.state = 'open';
      
    }
  
  
  }
  