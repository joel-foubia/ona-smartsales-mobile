import { Component, Input } from '@angular/core';

@Component({
	selector: 'call',
	templateUrl: 'call.html'
})
export class CallComponent {
	@Input() call: any;
	@Input() events: any;
	@Input() compare: boolean;
	hour: number;
	year: number;

	constructor(
	) {
		// this.dateCompare();
		console.log('Objet => ', this.call);
	}
	onEvent(event: string, call, theEvent) {
		if (this.events !== undefined && this.events[event]) {
			this.events[event]({ 'object': call, 'theEvent': theEvent });
		}
	}

	dateCompare() {
		let today = new Date();
		let time = today.getTime();
		let hour = today.getHours();
		let day = today.getDate();
		let month = today.getMonth() + 1;
		console.log('Months => ', month);
		console.log('day => ', day);
		console.log('Objet => ', this.call);
		let year = today.getFullYear();
		// for (let i = 0; i < this.call.length; i++) {
		// 	const element = this.call[i];

		// 	// if(new Date(this.call[i].date).getFullYear() == year){
		// 	// 	console.log('day cool! !!');
		// 	// }
		// }

		console.log('time => ', time, 'hour => ', hour, 'Year => ', year);
	}

	show(call){
		let today = new Date();
		let objet = new Date(call.date);
		let yearObject = objet.getFullYear();
		let month = objet.getMonth() + 1;
		let day = today.getDay();
		let currentDay = objet.getDay();
		let currentYear = today.getFullYear();
		let currentMonth = today.getMonth() + 1;

		if(call.state == 'open' && yearObject == currentYear && currentMonth == month && currentDay >= day){
			return 'open';
		}else if(call.state == 'done'){
			return 'done';
		}else if(call.state == 'open' || currentDay != day){
			return 'passed';
		}
		// if((today> new Date(call.date)) && call.state=="open"){
		// 	return 'passed';
		// }else if((today<= new Date(call.date)) && call.state=="open"){
		// 	return 'open';
		// }else if( call.state=="done"){
		// 	return 'done';
		// }
	}

}