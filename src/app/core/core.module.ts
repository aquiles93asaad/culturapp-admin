import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
    AvailableCardsService,
    UserService,
    AsistenciaService,
    CentroService,
    CursoService,
    MateriaService,
    NotificacionService
 } from './services'
import { LoaderService } from './loader/loader.service';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        AvailableCardsService,
        UserService,
        LoaderService,
        AsistenciaService,
        CentroService,
        CursoService,
        MateriaService,
        NotificacionService
    ],
    declarations: [
        LoaderComponent
    ],
    exports: [
        LoaderComponent
    ]
})
export class CoreModule { }
