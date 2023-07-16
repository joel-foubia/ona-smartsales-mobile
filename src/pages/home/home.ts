import { Component } from '@angular/core';
import { NavController, IonicPage, ModalController, NavParams } from 'ionic-angular';
import { AfProvider } from '../../providers/af/af';
// import { LoginPage } from '../login/login';
import { LoginProvider } from '../../providers/login/login';
import { OdooProvider } from '../../providers/odoo/odoo';
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  request_url = "";
  public params : any = {data:{}, events:{}};
  public objParams: any;  
    
  private objTxtButton = {
  	txtNext: "NEXT",
  	txtFinish: "START",
    txtValid: "VALIDATE"
  };  
  changeSub: any;

  constructor(public navCtrl: NavController, private servAF: AfProvider, private lgService: LoginProvider, private odooServ: OdooProvider, private translate: TranslateService, public modalCtrl: ModalController, public navParams: NavParams) {
    
      this.changeSub = this.navParams.get('changeSub');
      console.log(this.changeSub);
      
      this.authToGetParam();
      this.servAF.setPalette((res)=>{

      });

      this.translate.get(['start', 'subtitle', 'btns', 'login', 'parameters']).subscribe((results) => {
        // console.log(results);
        this.params.data = {
          'btnNext': results.btns.next,
          'btnValid': results.btns.valid,
          'btnFinish': results.btns.start,
          'btnRequest': results.btns.request,
          'btnDemo': results.btns.demo,
          'btnSkip' : '',
          'lang': localStorage.getItem('current_lang'),
            'items': [ 
              // {
              //   backgroundImage: 'assets/images/avatar-large/welcome.jpg',
              //   logo: 'assets/images/logo.png',
              //   title: '',
              //   description: results.subtitle,
              //   button: results.btns.next
              //   //skip : 'Skip' 
              // },
              {
                backgroundImage: 'assets/images/avatar-large/input.jpg',
                clientNumber: results.login.clientnumber,
                abonneNumber: results.login.subnumber,
                scan: results.login.scan,
                ou: results.login.ou,
                description: results.login.libelle_subscription,
                button: results.btns.valid, 
                subChanged: this.changeSub
                //skip : 'Skip' 
              },
              {
                backgroundImage: 'assets/images/avatar-large/valider.jpg',  
                title: results.login.resume,
                label_numero: results.login.clientnumber,
                db: results.login.expired,
                note: results.login.subnumber,
                sd: results.login.subscription,
                description: 'Thanks !',
                url: results.login.url,
                pack: results.login.pack,
                /*emoji:'assets/images/logo/smiley.png',
                txtEmoji:'Bon travail',*/
                button: this.objTxtButton.txtFinish,
                skip : 'Skip'
              }
            ]
          
        };

        //Events
        this.params.events = {
          'onFinish': function(event: any) {
              //console.log('Finish');
              localStorage.setItem('first_smart', '1');
              navCtrl.push('LoginPage');
          },
          'onRequestSub': (event: any) =>{
            // console.log('ok');
            this.servAF.getInfosAbout((_about)=>{
              // console.log(_about);
              // this.request_url = _url;
              if(_about!==undefined)
                this.odooServ.doWebsite(_about.request_url,"Aucune adresse défini");
              
            });

          },
          'onRequestDemo': (params: any) =>{
            
              params.clientNumber = '2018080019'; 
              params.abonneNumber = 'SUB2018070031';
              params.objSpinner.isActif(true);
              this.odooServ.alertSuccess(results.login.demo_login);
              this.loginToSubscription(params, results);
            
          },
          'onLogin': (params)=> {
              //console.log('Login', params);
              params.objSpinner.isActif(true);
              this.loginToSubscription(params, results);
          }
       };

      });

            
    }
    
  ionViewDidLoad() { 
      // servAF.getListFonctions(); 
  }


  //Met à jour les informations sur l'abonnement
  authToGetParam(){

   this.lgService.isTable('abonne').then(res=>{
      if(res){
        let subscription = JSON.parse(res);

        if(subscription.abonne && subscription.client){
              
          this.servAF.login(subscription.abonne, subscription.client, (res)=>{
                
            //Si l'abonnement est toujours active
                if(res.data.active){
                  //Store data parameters and data de l'abonné
                  this.lgService.saveSettingUser(res.data);
                }
          });
        }
      }      
   });

  }

  /**
   * This method is used to permform login
   * to subscription
   * 
   * @param params any, paramètres d'abonnement 
   * @param options any, paramètres optionnel utilisé pour la démo
   */
  loginToSubscription(params, options?: any){
    console.log(params);
    if(params.abonneNumber && params.clientNumber){
                
      this.servAF.login(params.abonneNumber, params.clientNumber, (res)=>{
        
          //console.log(res);
          
          params.objSpinner.isActif(false);
          if(res.correct){ 

            //Si l'abonnement est toujours active
            if(res.data.active){

              //On récupère l'id api user, puis Store data parameters and data de l'abonné
              this.odooServ.odoo().authenticate(res.data, res.data.user, res.data.passswd,  (data) => {
                params.objSpinner.isActif(false);
                
                if(data.errno==0){
                  
                  res.data.userID = data.val.me;
                  this.lgService.saveSettingUser(res.data);
                  this.lgService.saveDataAbonne(params.abonneNumber, params.clientNumber);
                  localStorage.setItem('first_smart', '1');
                  localStorage.setItem('is_subscriber', '1');
                  // console.log(res.data);
                  
                  //On passe au résumé des paramètres
                  params.currentSlider.lockSwipeToNext(false);
                  params.currentSlider.slideNext(300);
                }else if(data.errno==5) {
                  this.odooServ.showMsgWithButton(options.login.network, "top",'toast-error');
                }

              });

            }else{ //Il doit renouveler son abonnement
              this.servAF.showMessageWithBtn(options.login.renew);
            }

          }else{
            this.servAF.showMessage(res.data);
           
          }
          
      });
      

    }else{

      params.objSpinner.isActif(false);
      this.servAF.showMessageWithBtn(options.login.err_sub);
    }

  }



}
