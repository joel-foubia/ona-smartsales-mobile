import { Component } from '@angular/core';
import { NavParams, ViewController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-pop-stage',
  templateUrl: 'pop-stage.html',
})
export class PopStagePage {
  txtPop: any;
	public stages;
  public tools = [];
  public partner = false;
	public id_stage;
  public message;

  constructor(public vc: ViewController, public navParams: NavParams) {
    
    this.txtPop = this.navParams.get('lang');
    
    if(this.navParams.get('partner')===undefined){
      this.stages = this.navParams.get('objet');
      this.id_stage = parseInt(this.navParams.get('current'));
    }else{
      this.partner = true;
      this.tools = this.listTools();
    }
  	
    if(this.navParams.get('leads')!==undefined)
      this.message = this.txtPop.txt_task;
    else if(this.navParams.get('briefcase')===undefined)
      this.message = this.txtPop.txt_note;
    
  }

  ionViewDidLoad() {}

  onAction(stage){
  	if(this.id_stage==stage.me.id.me)
  		this.vc.dismiss();
  	else
  		this.vc.dismiss(stage);
  }

  //Cette fonction liste les choix
  listTools(){
    let liste = [
      {id:1, nom: this.txtPop.camera, slug:'camera', icon:'ios-camera-outline'},
      {id:2, nom: this.txtPop.gallery, slug:'gallery', icon:'ios-images-outline'}
    ];

    return liste;
  }

  //Cette fonction récupère le choix de l'utilisateur
  onChoose(tool){
    this.vc.dismiss(tool);
  }

}
