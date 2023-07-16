// cette classe définit l'objet calls
export class Calls{
    public id;
    public name;
    public partner_id;
    public partner_phone;
    public user_id;
    public state;
    public duration;
    public categ_id;
    public opportunity_id;
    public date;
    public team_id;
    public partner_mobile;

    //Définitions des messages à envoyer

    static error_save = "Impossible d'enregistrer un rendez vous";
    static noInternet = "Impossible d'enregistrer. Problème de connexion Internet";



    constructor(serverJSON: any) {
        if(serverJSON!=null)
          this.setCalls(serverJSON);
        else
          this.initObjet();
      }


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

      setCalls(data : any){
  
        this.id = data.me.id.me;
  
    
        if(!data.me.state.me)
          this.state = '';
        else
          this.state = data.me.state.me;
    
        if(!data.me.name.me || data.me.name == undefined)
          this.name = "";
        else
          this.name = data.me.name.me;



          if(!data.me.duration.me || data.me.duration == undefined)
          this.duration = 0;
        else
          this.duration = data.me.duration.me;


          if(!data.me.date.me || data.me.date.me == undefined)
          this.date = "";
        else
          this.date = data.me.date.me;

          if(!data.me.partner_phone.me || data.me.partner_phone == undefined)
          this.partner_phone = "";
        else
          this.partner_phone = data.me.partner_phone.me;

          if(!data.me.partner_mobile.me || data.me.partner_mobile == undefined)
          this.partner_mobile = "";
        else
          this.partner_mobile = data.me.partner_mobile.me;

    
        if(!data.me.duration.me || data.me.duration.me=='false')
          this.duration = "";
        else
          this.duration = data.me.duration.me;
    
        if(!data.me.user_id.me || data.me.user_id.me=='false')
          this.user_id = {id:0, name: ""};
        else
          this.user_id = { 
            id: data.me.user_id.me[0].me,
            name: data.me.user_id.me[1].me 
          };

          if(!data.me.team_id.me || data.me.team_id.me=='false')
          this.team_id = {id:0, name: ""};
        else
          this.team_id = { 
            id: data.me.team_id.me[0].me,
            name: data.me.team_id.me[1].me 
          };


          if(!data.me.partner_id.me || data.me.partner_id.me=='false')
          this.partner_id = {id:0, name: ""};
        else
          this.partner_id = { 
            id: data.me.partner_id.me[0].me,
            name: data.me.partner_id.me[1].me 
          };

          if(!data.me.categ_id.me || data.me.categ_id.me=='false')
          this.categ_id = {id:0, name: ""};
        else
          this.categ_id = { 
            id: data.me.categ_id.me[0].me,
            name: data.me.categ_id.me[1].me 
          };

          if(!data.me.opportunity_id.me || data.me.opportunity_id.me=='false')
          this.opportunity_id = {id:0, name: ""};
        else
          this.opportunity_id = { 
            id: data.me.opportunity_id.me[0].me,
            name: data.me.opportunity_id.me[1].me 
          };
    
        
    
      }

      initObjet(){

        this.id = 0;
        this.date = "";
        this.user_id = {id:0, name: ""};
        this.team_id = {id:0, name: ""};
        this.opportunity_id = {id:0, name: ""};
        this.partner_id = {id:0, name: ""};
        this.categ_id = {id:0, name: ""};
        this.duration = 0.0;
        this.partner_mobile = "";
        this.partner_phone = "";
      }
      
    
}

