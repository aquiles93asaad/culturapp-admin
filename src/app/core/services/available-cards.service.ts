import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as $ from 'jquery';

import { AuthService } from '../../auth/auth.service';
import { Card } from '../models';

@Injectable()
export class AvailableCardsService {

    private cards: Card[] = [
        { text: 'Generar Oportunidad', name: 'sale-opportunity', profiles: ['ADMIN', 'COMERCIAL'], roles: ['ALL'], href: '/dashboard/oportunidad-de-venta',
          faqBody: 'En esta pantalla podremos crear oportunidades para nuestra empresa, desde una empresa previamente cargada, o mismo cargando la empresa en el momento desde el botón que propociona la página. Una vez que se terminan los pasos se podrá encontrar un botón que te llevara al seguimiento de la oportunidad creada.' },
        { text: 'Seguimiento de oportunidades', name: 'opportunities-list', profiles: ['ADMIN', 'COMERCIAL'], roles: ['ALL'], href: '/dashboard/oportunidades',
          faqBody: 'Aquí podremos ver el seguimiento de todas las oportunidades que nos correspondan y fueron creadas en la pestaña de "Generar Oportunidad".'},
        { text: 'Reportes', name: 'reports', profiles: ['ADMIN', 'COMERCIAL'], roles: ['ALL'], href: '/dashboard/reportes',
          faqBody: 'En esta sección podremos tener información gráfica sobre nuestras propuestas en forma de torta (por estado) o en barras (por precio).'},
        { text: 'Mi equipo', name: 'my-team', profiles: ['ADMIN', 'COMERCIAL'], roles: ['LIDER', 'SUPERVISOR'], href: '/dashboard/mi-equipo',
          faqBody: 'En esta pantalla veremos todos los usuarios pertenecientes a nuestra empresa, en la cual tendremos acciones que podremos aplicar sobre los mismos en caso que necesitemos.'},
        { text: 'Canales de venta', name: 'sales-channels', profiles: ['ADMIN', 'COMERCIAL'], roles: ['LIDER'], href: '/dashboard/canales-de-venta',
          faqBody: 'Aquí podremos encontrar todos los canales que pertenecen a nuestra empresa en los cuales podremos realizar acciones para los mismos.'},
        { text: 'Clientes', name: 'clients', profiles: ['ADMIN'], roles: ['ALL'], href: '/dashboard/clientes',
          faqBody: 'En esta sección podremos ver los clientes a los cuales podremos crearles nuestras oportunidades, y las acciones que podemos realizarles a los mismos.'},
        { text: 'Soluciones', name: 'solutions', profiles: ['ADMIN'], roles: ['ALL'], href: '/dashboard/soluciones',
          faqBody: 'En esta pantalla podremos ver las soluciones que hayamos creado para nuestras propuestas, mismo tendremos las acciones que podramos realizar a ellas.'},
        { text: 'Demos genéricas', name: 'generic-demos', profiles: ['ADMIN'], roles: ['ALL'], href: '/dashboard/demos-genericas', 
          faqBody: 'Aquí podremos parametrizar nuestras demos genericas que tendran nuestras propuestas, al mismo tiempo podremos realizar acciones para estas.'},
        { text: 'Constantes', name: 'constants', profiles: ['ADMIN'], roles: ['ALL'], href: '/dashboard/constantes',
          faqBody: 'En esta sección podremos editar las constantes que formalizan el precio estimado de nuestras propuestas' },
        { text: 'Industrias', name: 'industries', profiles: ['ADMIN'], roles: ['ALL'], href: '/dashboard/industrias',
          faqBody:'En esta pantalla podremos ver las industrias que podran tener nuestros clientes' },
    ];

    constructor(
        private authService: AuthService
    ) { }

    getUserAvailableCards(userProfiles: string[], userRoles: string[], userCompany: any): Observable<Card[]> {
        return Observable.create(observer => {
            if(!userProfiles || !userRoles) {
                this.authService.userSource.subscribe(
                    (user: any) => {
                        if(user) {
                            observer.next(this.getCards(user.profiles, user.roles, user.userCompany));
                            observer.complete();
                        }
                    }
                );
            } else {
                observer.next(this.getCards(userProfiles, userRoles, userCompany));
                observer.complete();
            }
        });
    }

    private getCards(profiles, roles, userCompany) {
        let resultCards: Card[] = [];
        for (let i = 0; i < this.cards.length; i++) {
            if(this.hasCommonElement(this.cards[i].profiles, profiles) && (this.hasCommonElement(this.cards[i].roles, roles) || this.cards[i].roles.includes('ALL')) ) {
                // Para los canales de venta de canales de venta el módulo de 'Canales de venta' no tiene que aparecer
                if(this.cards[i].text == 'Canales de venta') {
                    // Si userCompany.salesChannelOf es 'undefined' significa que es un usuario de Vivatia, pero si tiene valor y al mismo tiempo userCompany.salesChannelOf.salesChannelOf es 'undefined'
                    // es un usuario de canal de venta de Vivatia.  
                    if(typeof userCompany.salesChannelOf === 'undefined' ||  (typeof userCompany.salesChannelOf !== 'undefined' && typeof userCompany.salesChannelOf.salesChannelOf === 'undefined')) {
                        resultCards.push(this.cards[i]);
                    }
                } else {
                    resultCards.push(this.cards[i]);
                }
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
