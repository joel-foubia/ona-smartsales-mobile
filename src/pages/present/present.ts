import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-present',
  templateUrl: 'present.html',
})
export class PresentPage {

  show: any;
  public params : any = {};
  public primary = "#154360";
  public secondary = "#82B14A";
 
  constructor(public navCtrl: NavController, private translate: TranslateService, public storage: Storage, public popCtrler: PopoverController, public evT: Events, public navParams: NavParams) {

    this.show = this.navParams.get("show");
    this.translate.get(['start','btns']).subscribe((results) => {
      // console.log(results);
      this.params['data'] = {
        'btnNext': results.btns.next,
        'btnValid': results.btns.valid,
        'btnFinish': results.btns.start,
        'btnRequest': results.btns.request,
        'btnSkip' : results.btns.affair,
        'lang': translate.getDefaultLang(),
          'items': [ 
            {
              backgroundImage: 'assets/images/slider/start.jpg',
              logo: 'assets/images/logo.png',
              title: results.start.slide1_t,
              description: results.start.slide1_d,
              couleur: "#0288d1",
              button: results.btns.next
            },
            {
              backgroundImage: 'assets/images/slider/start2.jpg',
              logo: 'icon icon-arrange-bring-to-front',
              title: results.start.slide_t,
              description: results.start.slide_d,
              couleur: this.primary,
              button: results.btns.next 
            },
            {
              backgroundImage: 'assets/images/slider/start3.jpg',
              logo: 'icon icon-account-multiple',
              title: results.start.slide2_t,
              description: results.start.slide2_d,
              couleur: this.secondary,
              button: results.btns.next 
            },
            {
              backgroundImage: 'assets/images/slider/start4.jpg',
              logo: 'icon icon-phone-in-talk',
              title: results.start.slide3_t,
              description: results.start.slide3_d,
              couleur: this.primary,
              button: results.btns.next 
            },
            {
              backgroundImage: 'assets/images/slider/start5.jpg',  
              logo: 'icon icon-chart-bar',
              title: results.start.slide4_t,
              description: results.start.slide4_d,
              couleur: this.secondary,
              button: results.btns.next
            },
            {
              backgroundImage: 'assets/images/slider/start6.jpg',  
              logo: 'icon icon-tag',
              title: results.start.slide5_t,
              couleur: this.primary,
              description: results.start.slide5_d,
              button: results.btns.finish
            }
          ]
        
      };

      //Events
      this.params['events'] = {
        'onFinish': (event: any) => {
            //console.log('Finish');
          if(this.show===undefined)
            this.navCtrl.push('HomePage');
          else
            this.navCtrl.setRoot('MainPage');
        },
        'onRequest': (event: any)=>{
          
        }
        
     };

    });

    //On laisse le soin à l'utilisateur de configurer sa langue
    if(localStorage.getItem("current_lang")==null){
      this.chooseLangue();
    }

  }

  ionViewDidLoad() {
    
  }

  //Cette fonction permet à l'utilisateur d'éffectuer
	//la recherche via la voix
	chooseLangue(){

		let ev = { target : { getBoundingClientRect : () => { return { top: '100' }; } }};
		let popover = this.popCtrler.create('PopLanguePage', {'lang': ''}, {cssClass: 'custom-poplangue'});
		
		popover.present({ev});
		popover.onDidDismiss((result)=>{
		  
			if(result){
        // this.navCtrl.push('SearchPage', { search: result });
        this.translate.setDefaultLang(result);
        this.evT.publish('lang:done', result);
        this.translate.use(result);
        this.storage.set("preferedLanguage", result);
        localStorage.setItem("current_lang", result);

        //On recharge la liste
        this.translate.get(['start','btns']).subscribe((results) => {
          // console.log(results);
          this.params['data'] = {
            'btnNext': results.btns.next,
            'btnValid': results.btns.valid,
            'btnFinish': results.btns.start,
            'btnRequest': results.btns.request,
            'btnSkip' : results.btns.affair,
            'lang': this.translate.getDefaultLang(),
              'items': [ 
                {
                  backgroundImage: 'assets/images/slider/start.jpg',
                  logo: 'assets/images/logo.png',
                  title: results.start.slide1_t,
                  description: results.start.slide1_d,
                  couleur: "#0288d1",
                  button: results.btns.next
                },
                {
                  backgroundImage: 'assets/images/slider/start2.jpg',
                  logo: 'icon icon-arrange-bring-to-front',
                  title: results.start.slide_t,
                  description: results.start.slide_d,
                  couleur: this.primary,
                  button: results.btns.next 
                },
                {
                  backgroundImage: 'assets/images/slider/start3.jpg',
                  logo: 'icon icon-account-multiple',
                  title: results.start.slide2_t,
                  description: results.start.slide2_d,
                  couleur: this.secondary,
                  button: results.btns.next 
                },
                {
                  backgroundImage: 'assets/images/slider/start4.jpg',
                  logo: 'icon icon-phone-in-talk',
                  title: results.start.slide3_t,
                  description: results.start.slide3_d,
                  couleur: this.primary,
                  button: results.btns.next 
                },
                {
                  backgroundImage: 'assets/images/slider/start5.jpg',  
                  logo: 'icon icon-chart-bar',
                  title: results.start.slide4_t,
                  description: results.start.slide4_d,
                  couleur: this.secondary,
                  button: results.btns.next
                },
                {
                  backgroundImage: 'assets/images/slider/start6.jpg',  
                  logo: 'icon icon-tag',
                  title: results.start.slide5_t,
                  couleur: this.primary,
                  description: results.start.slide5_d,
                  button: results.btns.finish
                }
              ]
            
          };
    
          //Events
          this.params['events'] = {
            'onFinish': (event: any) =>{
                //console.log('Finish');
                if(this.show===undefined)
                  this.navCtrl.push('HomePage');
                else
                  this.navCtrl.setRoot('MainPage');
            },
            'onRequest': (event: any)=>{
              
            }
            
         };
    
        });
      }
      
		});    
	}

}
