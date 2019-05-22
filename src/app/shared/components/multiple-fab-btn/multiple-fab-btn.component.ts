import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { MultilpleFabAnimations } from './multiple-fab-btn.animations';
import { TableAction } from '../../../core/models';

@Component({
    selector: 'app-multiple-fab-btn',
    templateUrl: './multiple-fab-btn.component.html',
    styleUrls: ['./multiple-fab-btn.component.scss'],
    animations: MultilpleFabAnimations
})
export class MultipleFabBtnComponent implements OnInit {
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    
    @Input('fabButtons') fabButtons: TableAction[];
    @Output() parentActions = new EventEmitter<any>();
    
    buttons = [];
    fabTogglerState = 'inactive';

    constructor() { }

    ngOnInit() {
    }

    executeAction(action) {
        const actionData = {
            action: action,
            element: null
        }
        this.parentActions.next(actionData);
        this.hideItems();
    }

    showItems() {
        this.fabTogglerState = 'active';
        this.buttons = this.fabButtons;
    }

    hideItems() {
        this.fabTogglerState = 'inactive';
        this.buttons = [];
    }

    onToggleFab() {
        this.buttons.length ? this.hideItems() : this.showItems();
    }
}
