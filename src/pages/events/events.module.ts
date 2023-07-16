import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventsPage } from './events';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EventsPage,
  ],
  imports: [
    IonicPageModule.forChild(EventsPage), TranslateModule.forChild()
  ],
})
export class EventsPageModule {}
