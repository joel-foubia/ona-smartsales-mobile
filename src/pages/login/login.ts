import { Component } from '@angular/core';
import {Nav, NavController, NavParams, LoadingController, MenuController, IonicPage} from 'ionic-angular';

import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';
import { ImageProvider } from '../../providers/image/image';
import { AfProvider } from '../../providers/af/af';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  
	txtTranslate: any;
  public params = {data:{}, events:{}};
  public logoCompany: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public nav: Nav, public odooService: OdooProvider, public lgService: LoginProvider, public loadCtrl: LoadingController, public menuCtrl: MenuController, public imgProvider: ImageProvider, private afServ: AfProvider, private translate: TranslateService) {

  		lgService.getSettingUser().then((data) => {

  			//ici on définit les champs qui vont être intégrer
		    //sur la page login
		  if(data){
			this.translate.get(['login', 'native', 'message', 'module', 'menu']).subscribe(_data=>{
				this.txtTranslate = _data;
			});

			let hosting = JSON.parse(data);
			let objPending = this.txtTranslate.login.checking;
	        
		    this.params.data = {
		      "username"        : "Login",
		      "password"        : this.txtTranslate.login.pwd,
		      "libelle"			: this.txtTranslate.login.txt_login,
			  "login"           : this.txtTranslate.login.btn_login,
			  "msg_error"		: this.txtTranslate.network,
			  "backgroundImage" : "assets/images/background/accueil.jpg",
			  "msg_user"		: this.txtTranslate.message.txt_user,
		      "msg_pwd"			: this.txtTranslate.login.txt_pwd,
		      "iconAccount"     : "icon-key",
		      "iconKey"         : "",
		      "iconLock"        : "assets/images/background/loginlight.jpg",
		      "defaultImage"    : "assets/images/default-logo.png",
		      "defaultIcon"     : "assets/images/default-icon.png"
		   };

		   //Mettre à jour le logo
        	imgProvider.getCallbackURL(hosting.logo, (res)=>{
             
             this.params.data['logo'] = res;
             //console.log(this.params.data.logo); 
          	});

          	afServ.getListFonctions((res)=>{
		        this.params.data['fonctions'] = res;
				this.params.data['lang'] = translate.getDefaultLang();
				localStorage.setItem('current_lang', translate.getDefaultLang());
		        //console.log(this.params.data.lang);
        	});


		//On implémente les actions (onLogin, onRegister, onFacebook, onTwitter, etc.)
	   //Afin que l'utilisateur puisse accéder à l'accueil
	   this.params.events = {
	      onLogin: function(params) {
	         
	         //console.log(params);
	         let loading = loadCtrl.create({  content: objPending });
	         let ev = { target : { getBoundingClientRect : () => { return { top: '100' }; } }};
				
			 lgService.isTable('_ona_log_users').then(_users=>{
					let trouve =  false;
					
					if(_users){

						let tab_users = JSON.parse(_users);
						for (let i = 0; i < tab_users.length; i++) {
							const element = tab_users[i];
							if (params.username==element.username && params.password==element.password) {

								var objLogin = {
									  username: params.username,
									  password: params.password,
									  uid: element.uid,
									  lang: params.lang
							   	};
								
								trouve = true; 
							    lgService.setTable('connected',true);
								lgService.saveLogin(objLogin);
								localStorage.setItem('is_login', '1');
								break;
							}
						}//End of test

					}

					if(trouve){
						menuCtrl.enable(true,"objMenu");
						nav.setRoot('MainPage');
					}else{

						loading.present();
						odooService.odoo().authenticate(hosting, params.username, params.password,  (data) => {
	
							  loading.dismiss();
							  if(data.errno==0){
								  
								  if(data.val.me){
	
									  var objLogin = {
										  username: params.username,
										  password: params.password,
										  uid: data.val.me,
										  lang: params.lang
									  };
									  
									  odooService.copiedAddSync('log_users', objLogin);
									  lgService.setTable('connected',true);
									  lgService.saveLogin(objLogin);
									  localStorage.setItem('is_login', '1');
	
									  //On commence la SYNCHRONISATION
									  odooService.syncListObjets(false);
									  
									  //Activer le menu 
									  menuCtrl.enable(true,"objMenu");
									  nav.setRoot('MainPage');
									  
								  }else{
									  odooService.displayErrorAuth();
									  params.dialog.present({ev}); 
								  }
								  
							  }else{
	
								  odooService.alertNoInternet().present();
								//   params.dialog.present({ev});
							  }
							  
						});
					}
				});
	         
	      },
	      onRegister: function(params) {
	         //console.log('onRegister:' + JSON.stringify(params));
	      },
	      onSkip: function(params) {
	         //console.log('onSkip:' + JSON.stringify(params));
	      }
	      
	    };
	  }else{

	  	this.navCtrl.push('HomePage');
	  }

  	});
	   
  }

  ionViewDidLoad() {
  	this.afServ.setPalette((res)=>{});
  }
  
}
