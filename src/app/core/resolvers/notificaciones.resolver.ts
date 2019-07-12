import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Notificacion } from '../models';
import { NotificacionService } from '../services';

@Injectable()
export class NotificacionsResolver implements Resolve<Notificacion[]> {

    constructor(
        private notificacionService: NotificacionService
    ) { }

    resolve(): Observable<Notificacion[]> {
        return this.notificacionService.get();
    }
}