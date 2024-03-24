
# Agora-Challenge Node-Typescript
>Este proyecto consiste en una API CRUD para gestionar publicaciones, donde un usuario autenticado puede consumir endpoints para visualizar, crear, actualizar y eliminar publicaciones. Solo los usuarios logueados pueden editar y eliminar sus propias publicaciones.

## Puntos Destacados del Desafío
- Base de Datos MongoDB: Se utiliza MongoDB con dos colecciones, users y posts.
- Paginación de Publicaciones: Las publicaciones están limitadas a 3 por página, lo que requiere navegar la paginación para ver todas ellas. También se incluye una consulta opcional para ordenar las publicaciones por fecha.
- Autenticación con JWT: Se implementa un middleware que valida la presencia de un JWT válido para interactuar con los endpoints.
- Validaciones de Datos: Se realizan validaciones para garantizar que se envíen los parámetros adecuados a través de body, params o queries.
- CORS Configurado: La configuración de CORS está preparada para su uso, solo se deben agregar las URLs permitidas en la lista blanca para interactuar con la API.
  
## Dependencias Principales
- Express: Framework de Node.js para construir aplicaciones web y API.
- Bcrypt: Para el cifrado de contraseñas.
- CORS: Middleware para el manejo de solicitudes CORS.
- Dotenv: Para la gestión de variables de entorno.
- Jsonwebtoken: Para la generación y validación de tokens de autenticación.
- MongoDB: Base de datos NoSQL utilizada.
- Node-Cache: Para el manejo de caché.
- Winston: Biblioteca para el registro de logs.
- Zod: Para la validación de datos.

## Inicio rápido
Para ejecutar la aplicación localmente, sigue estos sencillos pasos:

1- Clona este repositorio:

```bash
git clone git@github.com:adrian947/challenge-agora.git
```
2- Dirigete al proyecto cambia el archivo `.env.example` por `.env` (dejo variables de ejemplo, puedes usar las mismas o cambiarlas, pero si deseas usar el contenedor de docker aprovecha la url de conexión)

3- Asegurate de estar dentro de la carpeta del proyecto y ejecuta:
```bash
docker-compose up
```

Ahora, la aplicación estará disponible y lista para que continues desarrollando.

### Pasos para comenzar a trabajar
El servidor correra por defecto en http://localhost:5000 

1- Ejecuta este endpoint para verificar el estado de la API.
```bash
http://localhost:5000/api/health
```
2- Ejecuta este endpoint para cargar seeders a la base de datos.
```bash
http://localhost:5000/api/seed
```
3- Ejecuta este endpoint para loguearte puedes utilizar el usuario y password que dejo a continuación.
```bash
http://localhost:5000/api/login
```
```json
{
    "email": "user1@example.com" ,
    "password": "password1"
}
```




## Trabajar sin docker (Asegurate de tener una url de conexión de mongo funcionando)
1- Instalar dependencias 
```bash
npm install
```
2- Levantar server
```bash
npm run dev
```
3- Generar carpeta dist
```bash
npm run build
```
4- Correr aplicacion modo producción.
```bash
npm run build
```


### ¡Disfruta explorando la API!