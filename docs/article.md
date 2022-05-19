Hola, eres nuevo en el nuevo del testing? ¿Quieres saber en qué consisten los test de integración en angular? Bienvenidos!

En este post quiero hablaros de los test de integración en angular.
A menudo la gente pregunta en qué consisten los test de integración y de cuál es su diferencia en angular con los unitarios. 

Gente muy relevante del mundo front nos invita a que los test que hagamos sean mas dirigidos a los test de integración que a los unitarios.


![](https://raw.githubusercontent.com/ciglesiasweb/angular-integration-tests-sample/main/docs//images/tweets.png)

La definición de test de integración en la wikipedia es la siguiente:

"Pruebas integrales o pruebas de integración son aquellas que se realizan en el ámbito del desarrollo de software una vez que se han aprobado las pruebas unitarias y lo que prueban es que todos los elementos unitarios que componen el software, funcionan juntos correctamente probándolos en grupo. Se centra principalmente en probar la comunicación entre los componentes y sus comunicaciones ya sea hardware o software." Wikipedia


## ¿En el mundo de angular a qué se refiere?

En angular, para mostrar una página web (una componente "container") tenemos multitud de elementos que interactuan:

* Servicios
* Componentes, 
* Pipes... 
* Y no nos olvidemos de las directivas *ngFor, *ngIf que juegan un rol importante en el comportamiento final de la aplicación.

La siguiente imagen muestra los distintos elementos que pueden interactuar en una página de angular

![](https://raw.githubusercontent.com/ciglesiasweb/angular-integration-tests-sample/main/docs/images/elements-to-test.png)

## ¿Para tener un test de integración debemos testear todo ese diagrama?😨
Desde luego que no! 

Un test de integración testea la relación de elementos que nosotros deseamos.
El diagrama de arriba nos muestra todos los elementos de una página web. Testear todos esos elementos en conjunción sería un test e2e y existen herramientas muy eficientes para ello (yo soy muy fanático de cypress)


## ¿Qué políticas/estrategias se testean?
Nosotros escogemos la estrategia de testeo. En la web de angular [Component testing scenarios](https://angular.io/guide/testing-components-scenarios) se nos plantean distintas situaciones de aplicaciones angular y de estrategias para testearlas. Ahí va algún ejemplo:

* En el caso de una componente que llama a otra puede que con tan solo
testear que se llama a la hija con unos valores esperados nos sea suficiente.
 
* Testear una componente que usa un servicio de datos y otro de formateo.
    

## Manos a la obra!
Para este tutorial he creado un repo en github [repo](https://github.com/ciglesiasweb/angular-integration-tests-sample) que pinta un listado de coches. 
Para que tenga cierta complejidad he añadido angular material y la página está configurada en dos componentes indepenedientes:  una con el buscador y otra con la  tabla.
![](https://raw.githubusercontent.com/ciglesiasweb/angular-integration-tests-sample/main/docs/videos/demo.gif)

He usado la configuración que viene por defecto de angular testing: Jasmine en cualquier caso se podría crear otra rama de jest (Solo si veo mas de 10 "Me gusta" 😁)


A medida que he ido creando componentes con schematics (ejecutando ng generate) me han ido generando test de cada uno de los componentes, me he ido preocupando de que no dejaran de compilar yendo actualizandolos a medida que avanzaba. 

También he añadido un test unitario de la componente de la tabla. 


Como cita [@DavidKPiano](https://twitter.com/DavidKPiano), tenemos test unitarios que indican que el desarrollador esta trabajando debidamente, esto es, que el código es testeable.
Un código deja de ser testeable cuando: hay demasiadas dependencias cruzadas, el código es demasiado complejo (no se usa el concepto DRY), el elemento tiene demasiada responsabilidad...

## Manos a la obra. Vamos con nuestro primer test de integración
El diagrama de elementos de software en nuestra app es así:

![](https://raw.githubusercontent.com/ciglesiasweb/angular-integration-tests-sample/main/docs/images/elements-repo.png)

Vamos a hacer el test de integración de este diagrama completo.

Si levantais el servidor con `npm start` vereis que usamos como "estado" la url, esto es, si buscamos por una clave nos redirige a ?q=&#60;clave&#62;

Y que el código del contenedor, aún albergando la página es muy poca cosa:

![](https://raw.githubusercontent.com/ciglesiasweb/angular-integration-tests-sample/main/docs/images/car-list-container.png)

## Test cases
Para certificar que las piezas de software de esta feature encajan definimos estos casos:

* si el usuario rellena el campo de búsqueda y pulsa buscar, entonces nos redirige a la página ?q=&#60;campo relleno&#62;
* si nos encontamos en la pagina ?q=&#60;foo&#62; nos saldará el campo de búsqueda con foo y la tabla abajo con los resultados de la búsqueda.


## Configuración del escenario del test


Como en este test queremos simular las iteraciones de usuario lo primero que haremos es añadir a los elementos html clave selectores para poder usarlos en los tests:

![](https://raw.githubusercontent.com/ciglesiasweb/angular-integration-tests-sample/main/docs/images/att-selectors.png)

Hemos seleccionado la nomencliatura "data-test-id" ya que es agnóstica y podrá utilizarse en cypress.
También nos creamos una función de ayuda en nuestro test:

`
  function getBySel(nativeElement: any, id: string) { 
    return nativeElement.querySelector([data-testid="${id}"]); 
  }
`


A continuación tenemos que configurar el test para que renderice la página ficticia.... si pongo una sentencia debugger en el test vereis a qué me refiero:

Configurar el test es ir añadiendo al beforeEach los elementos necesarios del test.
![](https://raw.githubusercontent.com/ciglesiasweb/angular-integration-tests-sample/main/docs/images/debugger-test.png)

El navegador de jasmine "pinta" en cada test y ejecuta las iteraciones. Para que esto ocurra debemos de añadir todos los elementos necesarios: módulos de angular material tales como la tabla, el spinner y otros tantos.

Esta etapa es un tanto tediosa. Para que ser mas ágiles es conveniente ejecutar tan solo el test de integración sobre el que trabajamos y obviar el resto. Ejecutando el comando:

`ng test -- --include src/app/features/car-list/containers`
focalizaremos nuestro trabajo en ir pasito a pasito configurando el test... paciencia!

## Ya tenemos configurado el test!
Enhorabuena! configurar un test de integración es arduo, pero ahora tienes una idea real de lo que interactúa en angular...

* Te has visto con que ngIf no funciona si no te has importado CommonsModule
* Has tenido que traerte NoopAnimationsModule para que no se hagan animations css en los tests
* Si tu aplicación usa traducciones seguramente has tenido que pelearte con este  configuración también...

Este costoso trabajo tiene muchas recompensas, adquieres una visión mas precisa de lo que compone una aplicación angular en cada escenario. en adelante tus desarrollos serán mejores!

## Vamos con los tests!
Por supuesto! A continuación pongo un link al test de integración y donde hay comentarios aclaratorios. [link al test de integración](https://github.com/ciglesiasweb/angular-integration-tests-sample/blob/main/src/app/features/car-list/containers/car-list-container/car-list-container.component.spec.ts)


Este test tiene la particularidad de tener dos describes ya que necesitaba de dos configuraciones diferentes una de ellas simula que estamos en la página ?q=foo


## Un test unitario también please.

También he creado el test unitario de la componente que muestra la tabla de angular material. [Link al test unitario](https://github.com/ciglesiasweb/angular-integration-tests-sample/blob/main/src/app/features/car-list/components/car-list/car-list.component.spec.ts)

La componente es de naturaleza asíncrona, ya que pinta un loader, una tabla con la respuesta de un api de modo que he seguido la parte de la guía [Component marble test](https://angular.io/guide/testing-components-scenarios#component-marble-tests)


Los casos a testear son específicos de la componente:

* Enseña un loader antes de la respuesta del servidor.
* Pinta una tabla con las columnas que concuerden con la respuesta del api.
* En caso de que no haya datos me pinta un mensaje de no hay datos.


## Conclusiones
* Angular nos da de las herramientas necesarias para testear multitud de situaciones simples y complejas. En la web  de angular y particularmente en la sección [Component testing scenarios](https://angular.io/guide/testing-components-scenarios) hay mucha documentación.
* Los test de integración dan confianza de que las distintas piezas de software se comunican bien.
* Los test de integración nos da un conocimiento mas profundo de la aplicación.
* Existen mecanismos para que el implementar los test sea mas fácil como:
  - Ejecutar los test que nos interesan con `ng test -- --include path/to/element`
  - Poniendo un `debugger` en un test se nos detiene el test y podemos ver que está renderizando jasmine.


Bueno, espero que os haya gustado el post y... Happy Testiiiiing!

