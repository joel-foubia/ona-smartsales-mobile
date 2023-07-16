// import { LazyLoadImageModule } from 'ng-lazyload-image';
import { IonicPage, IonicPageModule } from 'ionic-angular';
import { MainPage } from './main';
import { NgModule } from '@angular/core';
import { SwipeUpDirective } from '../../directives/swipe-up/swipe-up';
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
import { CacheImgModule } from '../../global';

@NgModule({
  declarations: [
    MainPage, SwipeUpDirective
  ],
  imports: [
    IonicPageModule.forChild(MainPage),
    CacheImgModule,
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class MainPageModule {}
