# Documentation du baromètre Open Access UCA

## Development instructions

The url path after hostname (ie http://localhost:5000/uca-oa-barometer) is a variable in the config.py file.
The ReverseProxied class in the main app.py file is a helping class to transform all the internal url calls (made by the Flask native url_for function, or the simple href hyperlinks in html templates) in a way that takes into acount the url pathname.
However the url_for function is not recognized in the external js files of the app (/static/js/), and as long as I can't do the job with the JSGlue package or another way, the blah blah solution that I found is : the url path in config.py is passed as a variable for all the html templates by the routes render_template function (app.py), then recovered in an hidden input value on the pages, this value becomes then reachable for the include config.js file, and including the link to this file in html templates allow the others js files acceed the url_subpath variable value.

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