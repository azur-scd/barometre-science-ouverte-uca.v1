# Documentation du baromètre Open Access UCA

## Production mode

- Create a virtualenv and, when activated, install the dependencies with

```
pip install -r requirements.txt
```
- Launch the app

```
gunicorn --bind 0000:5000 wsgi:app
```
- Configure the http web server on the remote server to be used as a reverse proxy (create a new virtualhost for Apache or a new config file in /etc/nginx/sites-available for Nginx)

The app is running on http://your_server_ip:5000

## Development mode

- Create a virtualenv and, when activated, install the dependencies with

```
pip install -r requirements.txt
```
- Launch the app in debug mode with

```
set FLASK_APP=app
flask run
```
The app is running on http://localhost:5000

## Docker

Le dockerfile permet d'assembler l'application dans une image Docker

```
docker build -t IMAGE_NAME:TAG .
```

Une fois l'image buildée, on peut lancer l'image en tant que container Docker

```
docker run --name CONTAINER_NAME -d -p 5000:5000 IMAGE_NAME:TAG
```
Le container est démarré sur le port 5000, il suffit alors (en local) d'ouvrir l'url http://localhost:5000/URL_SUBPATH pour voir l'application.

## Docker Hub

Une image de l'application est aussi disponible sur le registre public Docker Hub

https://hub.docker.com/repository/docker/gegedenice/uca-oa-barometre

```
docker pull gegedenice/uca-oa-barometre:v0
docker run --name uca-oa-barometre -d -p 5000:5000 gegedenice/uca-oa-barometre:v0
```