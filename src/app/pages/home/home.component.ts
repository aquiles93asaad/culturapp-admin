import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
  
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    cards: any;
    breakpoint: any;

    constructor(
        private _route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this._route.data.subscribe(
            data => {
                this.cards = data.cards;
            }
        )

        this.breakpoint = (window.innerWidth <= 600) ? 1 : (window.innerWidth <= 992) ? 2 : (window.innerWidth <= 1400) ? 3 : (window.innerWidth > 1400) ? 4 : 4;
    }

    ngOnDestroy() {

    }
    
    onResize(event) {
        this.breakpoint = (event.target.innerWidth <= 600) ? 1 : (event.target.innerWidth <= 992) ? 2 : (event.target.innerWidth <= 1400) ? 3 : (event.target.innerWidth > 1400) ? 4 : 4;
    }

}
