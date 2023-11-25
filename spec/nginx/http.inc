server {
  listen 443 ssl;

  server_name local.lurp.io;

  ssl_certificate /var/www/lurp/spec/nginx/ssl/certs/lurp_io.pem;
  ssl_certificate_key /var/www/lurp/spec/nginx/ssl/private/lurp_io.key;
  ssl_verify_client off;
  ssl_protocols SSLv2 SSLv3 TLSv1.2 TLSv1.1 TLSv1;

  ssl_session_cache    shared:SSL:1m;
  ssl_session_timeout  5m;

  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers  on;

  keepalive_timeout 70;

  root /var/www/lurp/spec/public;
  index index.html;

  include /var/www/lurp/spec/nginx/client.inc;
}
