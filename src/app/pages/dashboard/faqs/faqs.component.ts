import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { AvailableCardsService } from '../../../core/services';

@Component({
    selector: 'app-faqs',
    templateUrl: './faqs.component.html',
    styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
    panelOpenState: boolean;
    carousel: any;
    url: string;
    activeFaqs: any = [];

    private carousels = {
        reportes: [
            { image: 'reportes/reports-step1.png', description: 'En esta opcion se podrá elegir una fecha desde el dia que se quiera aplicar el filtro. Al mismo tiempo debajo se verá una pie(torta) con la cantidad de oportunidades por estado.'},
            { image: 'reportes/reports-step2.png', description: 'En esta opcion se podrá elegir una fecha hasta el dia que se quiera aplicar el filtro. Al mismo tiempo debajo se verá una bar(barras) con el precio de las oportunidades por estado.'},
            { image: 'reportes/reports-step3.png', description: 'Este botón enviará la petición para aplicar el filtro que se reflejara en los graficos que se encuentran debajo de los filtros.'},
        ],
        oportunidad_de_venta: [
            { image: 'generar-oportunidad/Sale-opportunity-step1.png', description: 'En este recuadro aparecerán las empresas que ya fueron cargadas anteriormente y que podremos usar para generar una oportunidad.'},
            { image: 'generar-oportunidad/Sale-opportunity-step2.png', description: 'En este botón se podrá agregar una empresa en caso de que la misma no existiese.'},
            { image: 'generar-oportunidad/Sale-opportunity-step3.png', description: 'En esta pantalla debemos poner los datos de la empresa en la cual generaremos una oportunidad.'},
            { image: 'generar-oportunidad/Sale-opportunity-step4.png', description: 'Una vez que generamos la empresa, debemos llenar los datos que nos solicita para poder continuar con el proceso'},
            { image: 'generar-oportunidad/Sale-opportunity-step5.png', description: 'En este paso podremos ver la oportunidad creada y dirigirnos a la misma desde el botón indicado en la imagen.'},
        ],
        oportunidades: [
            { image: 'seguimiento-oportunidad/Opportunities-list-step1.png', description: ''},
            { image: 'seguimiento-oportunidad/Opportunities-list-step2.png', description: 'En esta pantalla se completaran los campos de la demo a solicitar que podrá ser genérica o personalizada.'},
            { image: 'seguimiento-oportunidad/Opportunities-list-step3.png', description: 'En esta sección si posee licencias deberá chequear los campos de la misma. Si requiere nuevas licencias debera tildar la opcion "Requiere licencias nuevas"  Si requiere consultoría debera tildar la opción completando las preguntas debajo.'},
            { image: 'seguimiento-oportunidad/Opportunities-list-step4.png', description: 'Aquí podremos editar la demo que generamos anteriormente.'},
            { image: 'seguimiento-oportunidad/Opportunities-list-step5.png', description: 'En esta pantalla podremos decidir a que usuario le asignamos esta oportunidad.'},
            { image: 'seguimiento-oportunidad/Opportunities-list-step6.png', description: 'Para poder ver estas opciones debemos haber creado una propuesta anteriormente, y hacer click en la oportunidad para que se despliegue esta opción con los datos de la propuesta'},
            { image: 'seguimiento-oportunidad/Opportunities-list-step7.png', description: 'En esta sección se podrá revisar la propuesta anteriormente creada.'},
            { image: 'seguimiento-oportunidad/Opportunities-list-step8.png', description: 'Aquí veremos los detalles del precio estimado que arrojó la propuesta creada anteriormente'},
        ],
        mi_equipo: [
            { image: 'mi-equipo/My-team-setp1.png', description: 'Tocando el botón que se muestra, en esta pantalla se podrá realizar la creación de un usuario que pertenecerá a mi empresa.'},
            { image: 'mi-equipo/My-team-setp2.png', description: 'Seleccionando el botón que se muestra, permitirá editar los campos del usuario elegido, pertenenciente a mi empresa.'},
        ],
        canales_de_venta: [
            { image: 'canales-de-venta/Sales-channels-step1.png', description: 'Seleccionando el botón que se muestra en la pantalla, podrán crear una empresa completando los datos que se solicitan, las cuales serán nuestros canales de ventas.'},
            { image: 'canales-de-venta/Sales-channels-step2.png', description: 'Una vez creada la empresa, veremos el botón que se muestra en esta imagen, la cual permite crear un usuario para nuestro canal de venta.'},
            { image: 'canales-de-venta/Sales-channels-step3.png', description: 'Si clickeamos en algún canal de venta que poseemos, se desglosara una lista con todos los usuarios, desde allí podremos editar los usuarios que pertenecen a este canal de venta si así lo desearamos.'},
            { image: 'canales-de-venta/Sales-channels-step4.png', description: 'En caso que querramos editar datos de la empresa, debemos tocar el lapiz que se encuentra en la lista de nuestra empresa. Una vez dentro debemos cambiar los datos necesarios y guardar.'},
        ]

    }

    constructor(
        public dialogRef: MatDialogRef<FaqsComponent>,
        private router: Router,
        private cardsService: AvailableCardsService
    ) { }

    ngOnInit() {
        this.url = this.checkUrl().replace(/-/g,"_");
        // const url = urls.replace("-","_")
        if(this.url != 'inicio') {
            for (const key in this.carousels) {
                if (this.carousels.hasOwnProperty(key)) {
                    if(key == this.url) {
                        this.carousel = this.carousels[key];
                        break;
                    }
                }
            }
        }

        let user = (<any>window).user;
        this.cardsService.getUserAvailableCards(user.esSuperAdmin)
        .subscribe(
            cards => {
                for (let i = 0; i < cards.length; i++) {
                    this.activeFaqs.push(cards[i]);
                }
            }
        );
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    checkUrl() {
        if(this.router.url.includes('inicio')) {
            this.panelOpenState = false;
        } else {
            this.panelOpenState = true;
        }
        const url = this.router.url.split('/');
        return url[url.length - 1];
    }

}
