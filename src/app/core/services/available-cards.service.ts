import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as $ from 'jquery';

import { AuthService } from '../../auth/auth.service';
import { Card } from '../models';

@Injectable()
export class AvailableCardsService {

    private cards: Card[] = [
        { text: 'Administradores', name: 'usuarios', onlySuperAdmin: true, roles: ['ALL'], href: '/dashboard/administradores' },
        { text: 'Usuarios', name: 'usuarios', onlySuperAdmin: true, roles: ['ALL'], href: '/dashboard/usuarios' },
        { text: 'Profesores', name: 'profesores', onlySuperAdmin: false, roles: ['ALL'], href: '/dashboard/profesores' },
        { text: 'Centros', name: 'centros', onlySuperAdmin: true, roles: ['ALL'], href: '/dashboard/centros' },
        { text: 'Categorias de cursos', name: 'materias', onlySuperAdmin: true, roles: ['ALL'], href: '/dashboard/categorias' },
        { text: 'Cursos', name: 'cursos', onlySuperAdmin: false, roles: ['ALL'], href: '/dashboard/cursos' },
        { text: 'Asistencias', name: 'asistencias', onlySuperAdmin: false, roles: ['ALL'], href: '/dashboard/asistencias' },
        // { text: 'Notificaciones', name: 'notificaciones', onlySuperAdmin: false, roles: ['ALL'], href: '/dashboard/notificaciones' },
    ];

    constructor(
        private authService: AuthService
    ) { }

    getUserAvailableCards(isUserSuperAdmin?): Observable<Card[]> {
        return Observable.create(observer => {
            if(typeof isUserSuperAdmin === 'undefined') {
                this.authService.userSource.subscribe(
                    (user: any) => {
                        if(user) {
                            observer.next(this.getCards(user.esSuperAdmin));
                            observer.complete();
                        }
                    }
                );
            } else {
                observer.next(this.getCards(isUserSuperAdmin));
                observer.complete();
            }
        });
    }

    private getCards(isUserSuperAdmin) {
        let resultCards: Card[] = [];
        for (let i = 0; i < this.cards.length; i++) {
            if(this.cards[i].onlySuperAdmin) {
                if(isUserSuperAdmin) {
                    resultCards.push(this.cards[i]);
                }
            } else {
                resultCards.push(this.cards[i]);
            }
        }
        
        return resultCards;
    }

    private hasCommonElement(arr1,arr2) {
        var bExists = false;
        $.each(arr2, function(index, value){

            if($.inArray(value,arr1)!=-1){
                bExists = true;
            }

            if(bExists){
                return false;
            }
        });
        return bExists;
    }
}
