import { Injectable } from '@angular/core';


//import 'rxjs/add/operator/map';


@Injectable()
export class GeneralProvider {

  constructor() {}

  getMenu(){

  	 let menus = [
      { title: 'Messages', icon: 'assets/images/chat.png', component: 'ChatPage', slug: null, css: 'messages' },
      { title: 'Agenda', icon: 'assets/images/agenda.svg', component: 'AgendaPage', slug: null, css: 'agenda' },
      { title: 'Notes', icon: 'assets/images/memo.png', component: 'NotesPage', slug: null, css: 'notes' },
      { title: 'Contacts', icon: 'assets/images/contact.svg', component: 'ClientPage', slug: 'contact', css: 'contacts' },
      { title: 'Customers', icon: 'assets/images/customer.svg', component: 'ClientPage', slug: 'client', css: 'customer' },
      { title: 'Sales Team', icon: 'assets/images/hr.svg', component: 'hr', slug: null, css: 'sale' },
      { title: 'Catalogue', icon: 'assets/images/brochure.svg', component: 'CataloguePage', slug: 'produit', css: 'catalogue' },
      { title: 'Leads', icon: 'assets/images/opportunity.svg', component: 'LeadsPage', slug: 'leads', css: 'leads' },
      { title: 'Your Pipeline', icon: 'assets/images/pipes.svg', component: 'PipelinePage', slug: 'pipeline', css: 'pipeline' },
      { title: 'Phonecalls', icon: 'assets/images/talking.svg', component: 'CallsPage', slug: null, css: 'calls' },
      { title: 'Quotations', icon: 'assets/images/quotation.png', component: 'SalesPage', slug: 'quotation', css: 'quots' },
      { title: 'Purchase Orders', icon: 'assets/images/order.png', component: 'SalesPage', slug: 'order', css: 'orders' }
  	 		
  	 	]; 

  	 return menus;
  }

  getMainPageMenu(res?:any){

  	 let menus = [
      { title: 'Messages', icon: 'assets/images/chat.png', component: 'ChatPage', slug: null, css: 'messages' },
      { title: 'Agenda', icon: 'assets/images/agenda.svg', component: 'AgendaPage', slug: null, css: 'agenda' },
      { title: 'Notes', icon: 'assets/images/memo.png', component: 'NotesPage', slug: null, css: 'notes' },
      { title: 'Contacts', icon: 'assets/images/contact.svg', component: 'ClientPage', slug: 'contact', css: 'contacts' },
      { title: 'Customers', icon: 'assets/images/customer.svg', component: 'ClientPage', slug: 'client', css: 'customer' },
      // { title: 'Sales Team', icon: 'assets/images/hr.svg', component: 'hr', slug: null, css: 'sale' },
      { title: 'Catalogue', icon: 'assets/images/brochure.svg', component: 'CataloguePage', slug: 'produit', css: 'catalogue' },
      { title: 'Leads', icon: 'assets/images/opportunity.svg', component: 'LeadsPage', slug: 'leads', css: 'leads' },
      { title: 'Your Pipeline', icon: 'assets/images/pipes.svg', component: 'PipelinePage', slug: 'pipeline', css: 'pipeline' },
      { title: 'Phonecalls', icon: 'assets/images/talking.svg', component: 'CallsPage', slug: null, css: 'calls' },
      { title: 'Quotations', icon: 'assets/images/quotation.png', component: 'SalesPage', slug: 'quotation', css: 'quots' },
      { title: 'Purchase Orders', icon: 'assets/images/order.png', component: 'SalesPage', slug: 'order', css: 'orders' },
      { title: 'Invoices', icon: 'assets/images/order.png', component: 'InvoicesPage', slug: null, css: 'bills' },
      { title: 'Events', icon: 'assets/images/order.png', component: 'EventsPage', slug: null, css: 'events' },
      { title: 'Sondages', icon: 'assets/images/order.png', component: 'SondagesPage', slug: null, css: 'sondages' },
      { title: 'Subscription', icon: 'assets/images/order.png', component: 'AbonnementsPage', slug: null, css: 'subs' },
      { title: 'Documentation', icon: 'assets/images/order.png', component: 'DocumentationPage', slug: null, css: 'docs' },
  	 		
  	 	]; 

  	 return menus;
  }

}
 