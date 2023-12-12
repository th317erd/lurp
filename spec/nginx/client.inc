location / {
  # kill cache
  add_header Last-Modified $date_gmt;
  add_header Cache-Control 'private no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
  if_modified_since off;
  expires off;
  etag off;
}
