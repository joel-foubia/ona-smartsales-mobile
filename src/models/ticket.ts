/** Cette classe définit l'objet Ticket (pour la gestion du modele event.event.ticket) **/

export class Ticket {
    
    public id;
    public name;
    public is_expired;
    public event_id;
    public seats_availability;
    public deadline;
    public product_id;
    public price;
    public price_reduce;
    public seats_min;
    public seats_max;
    public seats_available;
    public user_id;
    public seats_reserved;
    public seats_expected;
    public seats_unconfirmed;
    public seats_used;
    public registration_ids;

      
    /*
     * @param type string, correspond au type de données à insérer
     * @param serverJSON JSONObject, il s'agit des données qui proviennent du server ou 
     *                              d'une autre soruce
     *
     */
    constructor(serverJSON: any) {
      
      if(serverJSON!=null)
        this.setTicket(serverJSON);  
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
    setTicket(data : any){
      
      this.id = data.me.id.me;
  
      if(!data.me.is_expired.me || data.me.is_expired.me==undefined)
        this.is_expired = false;
      else
        this.is_expired = data.me.is_expired.me;
      
      if(!data.me.name.me || data.me.name.me=='false')
        this.name = "";
      else
        this.name = data.me.name.me;
  
      if(!data.me.seats_availability.me || data.me.seats_availability.me=='false')
        this.seats_availability = "";
      else
        this.seats_availability = data.me.seats_availability.me;
  
      if(data.me.seats_reserved==undefined || !data.me.seats_reserved.me)
        this.seats_reserved = 0;
      else
        this.seats_reserved = data.me.seats_reserved.me;
        
      if(data.me.event_id==undefined || !data.me.event_id.me)
        this.event_id = {id:0, name:""};
      else
        this.event_id = { 
          id: data.me.event_id.me[0].me,
          name: data.me.event_id.me[1].me 
        };
  
      if(!data.me.price.me || data.me.price===undefined)
        this.price = 0;
      else
        this.price = data.me.price.me;
      
      if(!data.me.price_reduce.me || data.me.price_reduce===undefined)
        this.price_reduce = 0;
      else
        this.price_reduce = data.me.price_reduce.me;
  
      if(data.me.seats_min==undefined || !data.me.seats_min.me)
        this.seats_min = 0;
      else
        this.seats_min = data.me.seats_min.me;
  
       if(data.me.seats_max==undefined || !data.me.seats_max.me)
        this.seats_max = 0;
      else
        this.seats_max = data.me.seats_max.me;
  
      if(data.me.seats_available==undefined || !data.me.seats_available.me)
        this.seats_available = 0;
      else
        this.seats_available = data.me.seats_available.me;
  
      if(data.me.seats_unconfirmed==undefined || !data.me.seats_unconfirmed.me)
        this.seats_unconfirmed = 0;
      else
        this.seats_unconfirmed = data.me.seats_unconfirmed.me;
  
      if(data.me.user_id==undefined || !data.me.user_id.me)
        this.user_id = {id:0, name:""};
      else
        this.user_id = {
          id: data.me.user_id.me[0].me,
          name: data.me.user_id.me[1].me 
        };
      
      if(data.me.product_id==undefined || !data.me.product_id.me)
        this.product_id = {id:0, name:""};
      else
        this.product_id = {
          id: data.me.product_id.me[0].me,
          name: data.me.product_id.me[1].me 
        };
  
      if(data.me.seats_used==undefined || !data.me.seats_used.me)
        this.seats_used = 0;
      else
        this.seats_used = data.me.seats_used.me;
  
      if(data.me.deadline.me==undefined || !data.me.deadline.me)
        this.deadline = '';
      else
        this.deadline = data.me.deadline.me;
      
      
      if(data.me.registration_ids==undefined || !data.me.registration_ids.me || data.me.registration_ids.me.length==0)
        this.registration_ids = [];
      else
        this.registration_ids = this.getIdTabs(data.me.registration_ids.me);
      
      if(data.me.seats_expected==undefined || !data.me.seats_expected.me)
        this.seats_expected = 0;
      else
        this.seats_expected = data.me.seats_expected.me;
  
    }
  
      
    //Initialisation des données
    initObjet(){
    
      this.id = 0;
  
      this.deadline = '';
      this.name = "";
      this.seats_availability = "";
      this.price_reduce = 0;
      this.user_id = {id:0, name: ""};
      this.seats_unconfirmed = 0;
      this.event_id = {id:0, name: ""}; 
      this.product_id = {id:0, name: ""};
      this.seats_used = 0;
      this.registration_ids = [];
      this.seats_min = 0;
      this.seats_max = 0;
      this.seats_available = 0;
      this.price = 0;
      this.seats_reserved = 0;
      this.seats_expected = 0;
      
    }
  
  
  }
  