# Documentation du baromètre Open Access UCA

## Docker

Le dockerfile permet d'assembler l'application dans une image Docker

```
docker built -t IMAGE_NAME:TAG .
```

Une fois l'image buildée, on peut lancer l'image en tant que container Docker

```
docker run --name CONTAINER_NAME -d -p 5000:5000 IMAGE_NAME:TAG
```
Le container est démarré sur le port 5000, il suffit alors (en local) d'ouvrir l'url http://localhost:5000 pour voir l'application.