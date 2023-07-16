import { LazyLoadImageModule } from 'ng-lazyload-image';
import { IonicPageModule } from 'ionic-angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormUserPage } from './form-user';


@NgModule({
  declarations: [
   FormUserPage
  ],
  imports: [
    IonicPageModule.forChild(FormUserPage),
    LazyLoadImageModule, 
    TranslateModule.forChild()
  ],
})
export class DetailClientPageModule {}
