import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Lead } from '../../models/lead';
import { Partner } from '../../models/partner';
import { OdooProvider } from '../../providers/odoo/odoo';
import { TranslateService } from '@ngx-translate/core';
import { LoginProvider } from '../../providers/login/login';
import * as moment from 'moment';

/**
 * Generated class for the FormActivityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-form-activity',
	templateUrl: 'form-activity.html'
})
export class FormActivityPage {
	public is_modif = false;
	public lead: Lead;
	public client: Partner;
	leads = [];
	activity_selected;
	activities = [];
	txtPop;
	type: string = 'form';
  current_lang: string;
  myactivities = [];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public view: ViewController,
		public odooServ: OdooProvider,
		public lgServ: LoginProvider,
		public translate: TranslateService
	) {
		if (navParams.get('activity') == true) {
			this.type = 'activity';
		} else {
			this.type = 'form';
		}
		this.current_lang = translate.getDefaultLang();
		this.getActivities();
		this.translate.get('pop').subscribe((_res) => {
			this.txtPop = _res;
		});
		this.leads = navParams.get('leads');
		this.myactivities = navParams.get('activities');
		this.client = navParams.get('client');

		this.lead = new Lead('n', null);
	}

	getActivities() {
		this.lgServ.isTable('_ona_activite').then((data) => {
			if (data) {
				this.activities = JSON.parse(data);
			}
		});
	}

	ionViewDidLoad() {}

	close() {
		this.view.dismiss();
	}

	onAdd() {
		if (this.lead.id != 0 && this.activity_selected != undefined) {
			this.lead.next_activity_id.id = this.activity_selected.id.me;
			this.lead.next_activity_id.name = this.activity_selected.name.me;
			this.lead.date_action = moment().format('YYYY-MM-DD');
			this.view.dismiss(this.lead);
		} else {
			this.odooServ.showMsgWithButton(this.txtPop.act_add_err, 'top', 'toast-error');
		}
	}
}
