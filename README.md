# TestMean

Una presiosidad de proyecto, lo amo con toda mi alma (ya, fuera ironías)
Este proyecto añade muchas tecnologías, esta es la lista completa (añadiré conforme necesite más):

IMPLEMENTADAS
- NodeJS
- AngularJS	(necesitará Angular2?)
- LDAP
- SQL Server 2012 (debería ser versión 2008)
- CAS SSO (pdte configurar correctamente)

AÚN POR IMPLEMENTAR:
- KendoUI


#### Instalación de proshecto ####
(De momento está pensado para arrancar por cmd, pero debería ser un servicio IIS; ya actualizaré)

REQUISITOS:
- NodeJS, en mi caso v6.11.0
- SQL Server 2012
- Apache DS (para el servidor LDAP)
- Bower instalado en modo global (npm install -g bower@1.8.0)

Bajar el proyecto en local con este comando en el cmd:
- git clone https://github.com/tropezoon/TestMean.git

Cuando acabe de bajarse, hay que colocarse en la raíz del proyecto y ejecutar estos comandos en cmd:
- npm install
- bower install

Luego será necesario modificar el contenido del fichero ./config/_const.js, para que las URLs concuerden con las del sistema
Para arrancar el proyecto:
 - Se necesita tener arrancado el servidor LDAP!
 - Ejecutar el comando 'npm start'

Enjoy! (heh)