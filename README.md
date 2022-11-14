# UI for catalog

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Docker build
```
docker build -t maximkrupin/shop-sample-ui:${UI_VERSION} -f ./docker/Dockerfile .
```

### Docker run
1) Set VUE_APP_CATALOG_URL in /docker/.env - address of catalog service
2) From directory 'docker' execute:
```
docker-compose up -d
```
