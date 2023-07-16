// import { WizardLayout3 } from './../../components/wizard/layout-3/wizard-layout-3';
import { HomePage } from './home';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import { ComponentsModule } from '../../components/components.module';
//import { AboutPage } from './about';


@NgModule({
  declarations: [
    HomePage,
    // WizardLayout3
  ],
  imports: [
    IonicPageModule.forChild(HomePage), ComponentsModule,
    LazyLoadImageModule
  ],

  // entryComponents:[
  //  WizardLayout3
  // ]
})
export class HomePageModule {}