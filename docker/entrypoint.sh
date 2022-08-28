#!/bin/sh

ROOT_DIR=/usr/share/nginx/html

# Replace env vars in JavaScript files
echo "Replacing env constants in JS"
for file in $ROOT_DIR/static/js/app.*.js* $ROOT_DIR/static/js/chunk-vendors.*.js* $ROOT_DIR/index.html;
do
  echo "Processing $file ...";

  sed -i 's|VUE_APP_CATALOG_URL_PARAM|'${VUE_APP_CATALOG_URL}'|g' $file

done

echo "Starting Nginx"
exec nginx -g 'daemon off;'