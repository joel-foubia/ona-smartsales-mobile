// import { LazyLoadImageModule } from 'ng-lazyload-image';
import { IonicPageModule } from 'ionic-angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DetailsAgendaPage } from './details-agenda';
import { CacheImgModule } from '../../global';

@NgModule({
  declarations: [
    DetailsAgendaPage
  ],
  imports: [
    CacheImgModule,
    IonicPageModule.forChild(DetailsAgendaPage),
    // LazyLoadImageModule, 
    TranslateModule.forChild()
  ],
})
export class DetailClientPageModule {}
