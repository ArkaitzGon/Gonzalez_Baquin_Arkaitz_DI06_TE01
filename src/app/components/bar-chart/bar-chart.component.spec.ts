import { GestionApiService } from './../../services/gestion-api.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BarChartComponent } from './bar-chart.component';
//import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef, Renderer2 } from '@angular/core';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  //Será un array de un objeto que contenga categoria y totalResults, estará inicializado a un array vacío.
  let mockApiData: { categoria: string; totalResults: number }[] = [];

  // Declara un BehaviorSubject falso para usar en las pruebas. Asignar un valor inicial al objeto que contiene categoria y totalResults.
  const fakeSubject = new BehaviorSubject<{ categoria: string; totalResults: number }[]>([
    { categoria: 'sports', totalResults: 10 }
  ]);
  /*Inicializar variable*/

  //Creamos un mock para sustituir GestionApiService. 
  //Contiene un método cargarCategoria que recibe un string categoria y no devulve nada.
  /*const mockGestionService: {
    cargarCategoria: (categoria: string) => void;
  } = {
    cargarCategoria: (categoria: string) => {
    }
  };*/
  const mockGestionService = {
    cargarCategoria: (categoria: string) => {},
    datos$: fakeSubject.asObservable()
  };


  //Necesitamos añadir el sustituto de HttpClient
  //De providers, como sustituiremos GestionApiService, como useValue, necesitaremos añadir {datos$: fakeSubject, mockGestionService}
  //En este caso, cuando queremos hacer uso de GestionApiService, estaremos haciendo uso de mockGestionService y fakeSubject
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartComponent ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: GestionApiService, useValue: mockGestionService },
        { provide: 'datos$', useValue: fakeSubject },
        { provide: ElementRef, useValue: {} },
        { provide: Renderer2, useValue: {} }
      ],
    }).compileComponents();

    //fakeSubject.next([{ categoria: 'sports', totalResults: 10 }]);


    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Comprobamos si podemos ejecutar el método ngOnInit
  //No se ejecuta la lógica del ngOnInit
  it('Se puede ejecutar ngOnInit', () => {
    expect(component.ngOnInit).toBeDefined();
  });

  //Comprobamos si podemos ejecutar el método ngOnInit
  //Se ejecuta la lógica de ngOnInit
  it('El método ngOnInit se ejecuta correctamente', () => {

    const ngOnInitSpy = spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();

    expect(ngOnInitSpy).toHaveBeenCalled();
  });

  //Necesitaremos 2 espías uno por cada método
  //Usaremos un mockData, será un objeto que contenga un valor de categoria y totalResults
  //Haremos uso de fakeSubject (el fake BehaviorSubject). Simularemos el next de este BehaviorSubject pasándole el mockData
  it('Comprobamos si podemos llamar a actualizarValoresChart y actualizarChart', () => {
    // Creamos un mockData
    const mockData = { categoria: 'sports', totalResults: 10 };

    // Creamos un espía para el método actualizarValoresChart
    const actualizarValoresChartSpy = spyOn(component, 'actualizarValoresChart').and.callThrough();

    // Creamos un espía para el método actualizarChart
    const actualizarChartSpy = spyOn(component, 'actualizarChart').and.callThrough();

    // Simulamos el next del BehaviorSubject fakeSubject pasándole el mockData
    fakeSubject.next([mockData]);


    // Verificamos si los métodos actualizarValoresChart y actualizarChart han sido llamados
    expect(actualizarValoresChartSpy).toHaveBeenCalledWith(mockData.categoria, mockData.totalResults);
    expect(actualizarChartSpy).toHaveBeenCalled();
  });

  //Cargaremos el mockApiData de valores e inicializaremos la variable apiData del componente con este mockApiData (No asignar todos los valores)
  //Crearemos un mockData, con los datos de categoria y totalResults que no existen en el mockApiData, para pasar estos valores al método actualizarValoresChart
  //Si el método actualizarValoresChart, se ha ejecutado correctamente, mediante el método find, podemos comprobar a ver si los valores de mockData se han insertado en component.apiData
  //Al hacer uso de .find, devolverá el objeto encontrado, los que hemos puesto en mockData.
  //Por tanto, esperamos que ese objeto devuelto exista y que el valor totalResults sea igual al totalResults de mockData
  it('Comprobamos si podemos ejecutar actualizarValoresChart', () => {
    mockApiData = [
      { categoria: 'technology', totalResults: 20 },
      { categoria: 'health', totalResults: 15 }
    ];
    component.apiData = mockApiData;

    const mockData = { categoria: 'sports', totalResults: 10 };

    component.actualizarValoresChart(mockData.categoria, mockData.totalResults);

    const result = component.apiData.find(item => item.categoria === mockData.categoria);
    expect(result).toBeDefined();
    expect(result?.totalResults).toBe(mockData.totalResults);
  });
});
