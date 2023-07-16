import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProductComponent } from './product/product';
import { CacheImgModule } from '../global';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';
import { LeadComponent } from './lead/lead';
import { Ionic2RatingModule } from 'ionic2-rating';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { InvoiceComponent } from './invoice/invoice';
import { SaleComponent } from './sale/sale';
import { CallComponent } from './call/call';
import { AbbonementComponent } from './abbonement/abbonement';
import { DevisComponent } from './devis/devis';
import { ActcallComponent } from './actcall/actcall';
import { ActactionComponent } from './actaction/actaction';
// import { MapsComponent } from './maps/maps';
// import LazyLoadImageModule from 'ng-lazyload-image';
import { EventsComponent } from './events/events';
import { UserComponent } from './user/user';
import { MapUserComponent } from './map-user/map-user';
import { WalkingComponent } from './walking/walking';
import { StartComponent } from './start/start';
import { AuthComponent } from './auth/auth';
import { ImageCacheDirective } from '../directives/imagecache/imagecache';
import { AchatsComponent } from './achats/achats';
import { DashproductComponent } from './dashproduct/dashproduct';

@NgModule({
	declarations: [ ProductComponent,
    LeadComponent,
    InvoiceComponent,
    SaleComponent,
	InvoiceComponent, 
	CallComponent,
    AbbonementComponent,
    DevisComponent,
    ActcallComponent,
    ActactionComponent,
    AchatsComponent,
    // MapsComponent,
    EventsComponent,
    UserComponent,
    MapUserComponent,
    WalkingComponent,
    StartComponent,
    ImageCacheDirective,
    AuthComponent,
    DashproductComponent ],
	imports: [ TranslateModule.forChild(), CacheImgModule, IonicModule, Ionic2RatingModule,
		NgCircleProgressModule.forRoot({
			radius: 50,
			maxPercent: 100,
			outerStrokeWidth: 8,
			innerStrokeWidth: 5,
			showSubtitle: false,
			showBackground: false,
			responsive: true
			// startFromZero: false
		}) ],
	exports: [ ProductComponent,
    LeadComponent,
    InvoiceComponent,
    SaleComponent,
	InvoiceComponent,
	CallComponent,
    AbbonementComponent,
    DevisComponent,
    ActcallComponent,
    AchatsComponent,
    ActactionComponent,
    // MapsComponent,
    EventsComponent,
    UserComponent,
    MapUserComponent,
    WalkingComponent,
    StartComponent,
    AuthComponent,
    DashproductComponent ],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ComponentsModule {}
