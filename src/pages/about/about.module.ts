import { NgModule } from '@angular/core';
// import { MapsLayout2 } from './../../components/maps/layout-2/maps-layout-2';
import { IonicPageModule } from 'ionic-angular';
import { AboutPage } from './about';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { TranslateModule } from '@ngx-translate/core';
// import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
   AboutPage,
  //  MapsLayout2
  ],
  imports: [
    IonicPageModule.forChild(AboutPage),
    LazyLoadImageModule,
    // ComponentsModule,
    TranslateModule.forChild()
  ],
  entryComponents:[]
})
export class AboutPageModule {}
