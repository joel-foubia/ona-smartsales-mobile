import { DragulaModule } from 'ng2-dragula';
import { NgCalendarModule } from 'ionic2-calendar';
import { AgendaPage } from './agenda';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core'
// import LazyLoadImageModule from 'ng-lazyload-image';
import { TranslateModule } from '@ngx-translate/core';
import { CacheImgModule } from '../../global';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AgendaPage
  ],
  imports: [
    CacheImgModule,
    IonicPageModule.forChild(AgendaPage),
    TranslateModule.forChild(),
    // LazyLoadImageModule,
    NgCalendarModule,
    DragulaModule,
    ComponentsModule
  ],
})
export class AgendaPageModule {}
