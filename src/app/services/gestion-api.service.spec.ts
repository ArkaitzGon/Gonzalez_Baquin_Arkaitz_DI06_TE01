import { TestBed } from '@angular/core/testing';
import { GestionApiService } from './gestion-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RespuestaNoticias } from '../interfaces/interfaces';

describe('GestionApiService', () => {
  //Inicializaremos el servicio
  let service : GestionApiService;
  //Necesitaremos un mock para sustituir el HttpCliente
  let httpMock : HttpTestingController;

  //Habrá que import los modulos necesarios, como por ejemplo para simular HttpClient
  beforeEach(() => {
    TestBed.configureTestingModule({
      //importamos el httpClienteTestingModule (OJO, no importamos httpClient)
      imports:[HttpClientTestingModule],
      //En providers añadilos el servicio que vamos a utilizar
      providers: [GestionApiService]
    });
    //Inyectamos el servicio al TestBed. En service tengo un objeto gestionApiService
    service = TestBed.inject(GestionApiService);
    //Inyectamos el httpTestingController al TestBed. Aqui tengo un objeto similar a HttpClient (pero para test)
    httpMock = TestBed.inject(HttpTestingController);
  });

  //afterEach, verificamos httpMock que no queden respuestas pendientes
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //Simulamos sin ejecutar la lógica a ver si podemos llamar al método cargarCategoria
  it("Comprobar si podemos llamar al método cargarCategoria", () => {
    expect(service.cargarCategoria).toBeDefined();
  });
  

  //
  it('Debería cargar los datos en el BehaviorSubject correctamente', () => {
    const categoria = 'business';
    //Necesitaremos un mock de tipo RespuestasNoticias para simular la respuesta del servidor 
    const mockResponse : RespuestaNoticias= {
      "status": "ok",
      "totalResults": 2,
      "articles": [
        {
          "source": { "id": "the-washington-post", "name": "The Washington Post" },
          "author": "Tony Romm",
          "title": "Debt ceiling vote in Senate to be blocked by Republicans - The Washington Post",
          "description": "The GOP's expected opposition is sure to deal a death blow to the measure, which had passed the House, and adds to the pressure on Democrats to devise their own path forward ahead of a series of urgent fiscal deadlines starting this week.",
          "url": "https://www.washingtonpost.com/us-policy/2021/09/27/senate-debt-ceiling-government-shutdown/",
          "urlToImage": "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/RUHMA7A4VEI6ZPVIGCHKCNCZJ4.jpg&w=1440",
          "publishedAt": "2021-09-27T14:40:20Z",
          "content": "Ahead of the planned Monday vote, Senate Minority Leader Mitch McConnell (R-Ky.) staked his partys position that Republicans are not willing to vote for any measure that raises or suspends the debt c… [+5463 chars]"
        },
        {
          "source": { "id": undefined, "name": "Barron's" },
          "author": undefined,
          "title": "Apple and Tesla Suppliers Hit By Global Energy Crisis. What to Know. - Barron's",
          "description": "Debt ceiling and infrastructure spending in Congress this week, German elections leave no clear winner, Chinese agencies take steps to shield consumer funds from Evergrande crisis, and other news to start your day.",
          "url": "https://www.barrons.com/articles/things-to-know-today-51632735533",
          "urlToImage": "https://images.barrons.com/im-407144/social",
          "publishedAt": "2021-09-27T14:10:00Z",
          "content": "A worldwide energy shortage is threatening to develop into a full-blown crisis.\r\nThe scenes in the U.K. over the weekend were reminiscent of the 1970s, as drivers queued at thousands of filling stati… [+271 chars]"
        }
      ]
    };

    //Ejecutamos la lógica de cargarCategoria para testear que el BehaviorSuject funciona correctamente
    service.cargarCategoria(categoria);
    //Simulamos una llamada API y esperamos una respuesta y que sea de tipo GET
    //Recordar que hacemos uso de HttpTestingController, no de httpClient, por tanto, estamos simulando la llamada API.
    //Necesitaremos apiKey de cada uno. 
    //IMPORTANTE MODIFICAR EL APIKEY EN LA CARPETA ENVIRONMENTS
    const req = httpMock.expectOne(`https://newsapi.org/v2/top-headlines?country=us&category=${categoria}&apiKey=${service.apiKey}`);
    expect(req.request.method).toBe('GET');
    //Simulamos que la respuesta del servidor sea nuestro mockResponse (flush)
    req.flush(mockResponse);
    //datos$ tendría que modificarse con los datos simulados (categoria=business y totalResults=2), por tanto data contendrá esos datos.
    //Aquí habrá que hacer el subscribe de datos$, y comprobaremos que data esté definido y que data.categoria y data.totalResults son iguales a nuestra categoria y totalResults
    service.datos$.subscribe(data => {
      expect(data).toBeDefined();
      expect(data!.categoria).toBe(categoria);
      expect(data!.totalResults).toBe(mockResponse.totalResults);
    });
  });
});
