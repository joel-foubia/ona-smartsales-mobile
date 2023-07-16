// import { LazyLoadImageModule } from 'ng-lazyload-image';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormAgendaPage } from './form-agenda';

@NgModule({
  declarations: [
    FormAgendaPage
  ],
  imports: [
    IonicPageModule.forChild(FormAgendaPage),
    TranslateModule.forChild()
  ],
})
export class DetailClientPageModule {}
