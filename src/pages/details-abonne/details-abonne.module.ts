import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsAbonnePage } from './details-abonne';
import { TranslateModule } from '@ngx-translate/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
// import { ImageCacheDirective } from '../../directives/imagecache/imagecache';


@NgModule({
  declarations: [
    DetailsAbonnePage,
    // ImageCacheDirective
  ],
  imports: [
    IonicPageModule.forChild(DetailsAbonnePage),
    LazyLoadImageModule,
    TranslateModule.forChild()
  ],
})
export class DetailsAbonnePageModule {}
