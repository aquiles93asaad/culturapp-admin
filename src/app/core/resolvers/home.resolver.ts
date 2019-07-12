import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AvailableCardsService } from '../services';
import { Card } from '../models';


@Injectable()
export class HomeResolver implements Resolve<Card[]> {

    constructor(
        private cardsService: AvailableCardsService
    ) { }

    resolve(): Observable<Card[]> {
        let user = (<any>window).user;
        if(user) {
            return this.cardsService.getUserAvailableCards(user.esSuperAdmin);
        } else {
            return this.cardsService.getUserAvailableCards();
        }
    }

}