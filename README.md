# Superheroes App

![Marvel Logo](server/static/Marvel-DC.png)

## Introducción

Esta aplicación web tiene como objetivo gestionar información de personajes de películas de comics Marvel y DC. La aplicación utiliza las siguientes tecnologías:

- **Backend**: Python, Flask, MongoDB
- **Frontend**: React, Next.js, Tailwind CSS
- **Contenedores**: Docker

## Funcionalidades

- Almacenamiento de información de superhéroes en MongoDB
- Visualización de información resumida de superhéroes en cards
- Vista en detalle de cada superhéroe con carrusel de imágenes
- Visualización del logo de la casa del superhéroe en la vista de detalle
- Posibilidad de cargar, actualizar y eliminar superhéroes
- Carteles de información de éxito o fracaso para las operaciones CRUD
- Rutas para:
  - `/superheroes`: Todos los superhéroes
  - `POST /superhero`: Agregar superhéroe
  - `PUT /superhero/id`: Actualizar superhéroe
  - `DELETE /superhero/id`: Eliminar superhéroe
  - `/marvel`: Solo superhéroes de Marvel
  - `/dc`: Solo superhéroes de DC
- Filtro por nombre de superhéroes en las vistas de cards
- Carga inicial de al menos 40 superhéroes

## Arquitectura

La aplicación se compone de tres microservicios:

- **API**: Implementada en Python con Flask y MongoDB, se encarga de la gestión de datos de superhéroes.
- **Frontend**: Implementado en React y Next.js con Tailwind CSS, se encarga de la interfaz de usuario y la interacción con la API.
- **Base de datos**: MongoDB almacenará la información de los superhéroes.

## Contenedores

Se utilizarán contenedores Docker para aislar y ejecutar cada microservicio de forma independiente.

## Instalación

Sigue estos pasos para configurar el proyecto localmente:

### Prerrequisitos

- Docker instalado en tu máquina.

### Instrucciones

1. Clona el repositorio:

   ```bash
    git clone https://github.com/cristianchivisky/superheroes-app.git
    ```

2. Cambia de directorio:

   ```bash	
    cd superheroes-app
    ```
3. Construye los contenedores Docker:

   ```bash
    docker compose build
    ```
4. Inicia los contenedores Docker:

   ```bash
    docker compose up
    ```

### Uso

Accede a la aplicación en tu navegador en [http://localhost:3000](http://localhost:3000).

## Contribuciones

¡Las contribuciones son bienvenidas! Sigue estos pasos para contribuir:

1. Haz un fork del repositorio.
2. Crea una nueva rama.
3. Realiza tus cambios y haz commit.
4. Sube tus cambios.
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Para preguntas o soporte, contacta a [cristian.chivisky@gmail.com](mailto:cristian.chivisky@gmail.com).


## Conclusión

Este proyecto permite desarrollar una aplicación web completa para gestionar información de superhéroes, utilizando tecnologías modernas y escalables. La aplicación puede ser extendida con nuevas funcionalidades y personalizada para diferentes necesidades.
