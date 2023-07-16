import { Component } from '@angular/core';
import { ViewController, NavParams, IonicPage } from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';

@IonicPage()
@Component({
  selector: 'page-pop-tag',
  templateUrl: 'pop-tag.html',
})
export class PopTagPage {
  is_tax: boolean;
	public objSpinner;
	public list_tags = [];
	public autocompleteItems = [];
	public new_tag = '';
  public remind;
  public message;
	public tabs = [];
	public tags = [];
  private txtPop;

  constructor(public vc: ViewController, public navParams: NavParams, private odooServ: OdooProvider, private lgServ: LoginProvider) {
    
    let type;
    this.txtPop = this.navParams.get('lang');
    this.message = this.txtPop.txt_tag;
    
    if(this.navParams.get('agenda')!==undefined){
      
      if(this.navParams.get('agenda')=='remind'){
        this.remind = true;
        this.message =  this.txtPop.txt_remind;
      }else{
        this.remind = false;
      }
      
      type = this.navParams.get('agenda');

    }else if(this.navParams.get('project')!==undefined){
      type = this.navParams.get('project');
      this.remind = false;
    }else if(this.navParams.get('tax')!==undefined){
      type = this.navParams.get('tax');
      this.message = this.txtPop.tax;
      this.remind = true;
    }else{
      type = 'tag_note';
      this.remind = false;
    }

  	this.loadTags(type);
  }

  ionViewDidLoad() {}

  loadTags(type){
  	
  	this.objSpinner = true;
  	this.lgServ.isTable('_ona_'+type).then(res=>{
      
      if(res){
        this.objSpinner = false;
        this.list_tags = JSON.parse(res);
      }else{
        //Données non synchroniser
        this.odooServ.displayCustomMessage(this.txtPop.tag_network);
        this.odooServ.requestObjectToOdoo(type, null, null, this.objSpinner, (res)=>{
          this.objSpinner = false;
          this.list_tags = res;
          this.lgServ.setTable('_ona_'+type, res); 
        });
      }

    });
        
  }

  //Cette fonction permet de remplir le 
  //tableau des valeurs cochées
  onChange(tag, checked){
    
    if(tag.me.id.me!=0){

      if(checked){
        this.tabs.push(tag.me.id.me);
        this.tags.push(tag);
      }else{
        for (var i = 0; i < this.tabs.length; i++) {
          if(this.tabs[i]== tag.me.id.me){
            this.tabs.splice(i,1);
            this.tags.splice(i,1);
            break;
          }
        }
  
      }

    }
  	//console.log(this.tabs);
  }

  //Permet d'ajouter un tag
  //elle va vérifier les tags existants
  //@param res Object, tableau contenant la liste d'objets (tag)
  onAddTag(){
  	
  	if(this.existTag())
  		this.odooServ.displayCustomMessage(this.txtPop.tag_exist);
  	else{
      this.addTagToList();
  		this.odooServ.displayCustomMessage(this.txtPop.tag_add);
    }
  }


  //Cette fonction permet d'ajouter le tag dans la liste
  addTagToList(){
    let tag = {
      me:{
        id: {me: 0},
        name: {me: this.new_tag}
      }
    };

    this.list_tags.push(tag);
  }

  onFinish(){

  	let objet = {
  		tab: this.tabs,
  		add: this.new_tag,
      tags: this.tags
  	};

  	//	this.odooServ.displayCustomMessage(this.txtPop.tag_exist);
  	this.vc.dismiss(objet);

  }

  //Cette fonction permet de vérifier si 
  //un tag existe déjà
  private existTag(){

  	for (var i = 0; i < this.list_tags.length; i++) {
  		if(this.list_tags[i].me.name.me==this.new_tag)
  			return true;
  	}

  	return false;
  }


}
