/** Cette classe définit l'objet Produit(Prime) (pour la gestion du modele product.product) **/

export class Product {

  public id;
  public name;
  public display_name;
  public fees;
  public taxes_id;
  public active;
  public categ_id;
  public currency_id;
  public lst_price;
  public description_sale;
  public fuel_type;
  public horsepower_min;
  public horsepower_max;
  public cr_amount;
  public acc_amount;
  public fc_amount;
  public ipt_amount;
  public quantity : Number = 1;


  constructor(serverJSON: any) {
    if(serverJSON!=null)
      this.setProduit(serverJSON);
    else
      this.initProduit();
    
  }

  private getIdTabs(liste){

    let tab = [];
    for (var i = 0; i < liste.length; i++) {
        tab.push(liste[i].me);
    }

    return tab;
  }

  /** 
   * Cette fonction retourne le libelle de la notification
   * en fonction de l'id
   * @param id string, l'id du titre
   * @return string 
   **/
  getTitreById(id, tab){

    for (let i = 0; i < tab.length; i++) {
      if(tab[i].id==id)
        return tab[i].text;
    }

    return '';

  }

  /** Cette fonction permet de définir 
   * les valeurs des champs
   * @param data JSONObject, il s'agit des données JSON du serveur
   *
   ***/
  setProduit(data : any){
    
    this.id = data.me.id.me;
    this.active = data.me.active.me;

    if(data.me.fuel_type==undefined || !data.me.fuel_type.me)
      this.fuel_type = "";
    else
      this.fuel_type = data.me.fuel_type.me;
    
    if(data.me.quantity==undefined || !data.me.quantity.me)
      this.quantity = 1;
    else
      this.quantity = data.me.quantity.me;
    
    if(data.me.display_name==undefined || !data.me.display_name.me)
      this.display_name = "";
    else
      this.display_name = data.me.display_name.me;

    if(!data.me.horsepower_max.me || data.me.horsepower_max==undefined)
      this.horsepower_max = 0;
    else
      this.horsepower_max = data.me.horsepower_max.me;
    
    if(!data.me.horsepower_min.me || data.me.horsepower_min==undefined)
      this.horsepower_min = 0;
    else
      this.horsepower_min = data.me.horsepower_min.me;
    
    if(!data.me.cr_amount.me || data.me.cr_amount==undefined)
      this.cr_amount = 0;
    else
      this.cr_amount = data.me.cr_amount.me;
    
    if(!data.me.fees.me || data.me.fees==undefined)
      this.fees = 0;
    else
      this.fees = data.me.fees.me;

    if(data.me.ipt_amount==undefined || !data.me.ipt_amount.me)
      this.ipt_amount = 0; 
    else
      this.ipt_amount = data.me.ipt_amount.me;

    if(!data.me.name.me || data.me.name.me=='false')
      this.name = "";
    else
      this.name = data.me.name.me;

    if(data.me.categ_id==undefined || !data.me.categ_id.me || data.me.categ_id.me=='false')
      this.categ_id = {id:0, name: ""};
    else
      this.categ_id = { 
        id: data.me.categ_id.me[0].me,
        name: data.me.categ_id.me[1].me 
      };

    if(data.me.currency_id==undefined || !data.me.currency_id.me || data.me.currency_id.me=='false')
      this.currency_id = {id:0, name: ""};
    else
      this.currency_id = { 
        id: data.me.currency_id.me[0].me,
        name: data.me.currency_id.me[1].me 
      };

    if(data.me.acc_amount==undefined || !data.me.acc_amount.me)
      this.acc_amount = 0; 
    else
      this.acc_amount = data.me.acc_amount.me;
    
    if(data.me.fc_amount==undefined || !data.me.fc_amount.me)
      this.fc_amount = 0; 
    else
      this.fc_amount = data.me.fc_amount.me;



    if(!data.me.description_sale.me || data.me.description_sale.me=='false')
      this.description_sale = "";
    else
      this.description_sale = String(data.me.description_sale.me).replace(/<[^>]+>/gm, '');



    if(!data.me.lst_price.me || data.me.lst_price===undefined)
      this.lst_price = 0;
    else
      this.lst_price = data.me.lst_price.me;

    if(data.me.taxes_id==undefined || !data.me.taxes_id.me || data.me.taxes_id.me.length==0)
      this.taxes_id = [];
    else
      this.taxes_id = this.getIdTabs(data.me.taxes_id.me);

    //this.code = data.me.code.me;

  }

  //Cette fonction permet d'initialiser un objet Project
  initProduit(){
    this.id = 0;
    this.active = true;
    this.name = "";
    this.categ_id = {id:0, name:""};
    this.currency_id = {id:0, name: ""};
    this.description_sale = "";
    this.lst_price = 0;
    //this.property_account_income_id = {id:0, name:""};
    this.taxes_id = [];
    //this.code = '';
  }


}
