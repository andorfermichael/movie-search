upstream movie {
	server localhost:5000;
}

upstream solr {
	server localhost:8983;
}

server {
	listen 80;
	server_name example.com;
	return 301 https://$server_name$request_uri;	 
}

server {
	listen 443 ssl default_server;
	
	ssl on;
	ssl_prefer_server_ciphers On;
	ssl_protocols TLSv1.2;
	ssl_session_cache shared:SSL:10m;
	ssl_session_timeout 10m;
	ssl_ciphers AES256+EECDH:AES256+EDH:!aNULL;
	ssl_stapling on;
	ssl_stapling_verify on;

	add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; preload";
	add_header X-Frame-Options DENY;
	add_header X-Content-Type-Options nosniff;

	ssl_dhparam /etc/nginx/ssl/dhparam.pem;

	ssl_certificate /etc/letsencrypt/live/example.com/cert.pem;
	ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;		

	server_name example.com;

	location / {
	    proxy_pass http://;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
		proxy_set_header Host $host;
		proxy_set_header X-Real-Ip $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
  	}

	location ^~ /movie {
		rewrite ^/movie(/.*)$ $1 break;
		proxy_pass http://movie;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-Ip $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
	}

	location ^~ /solr {
        #rewrite ^/solr(/.*)$ $1 break;
        proxy_pass http://localhost:8983;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-Ip $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

		# Only allow GET requests
        limit_except GET {
    	        deny all;
        }
        
        # Limits on rows/start (by number of chars) to prevent deep paging craziness
        if ($arg_start ~ ....+) {
                return 403;
        }

        if ($arg_rows ~ ....+) {
                return 403;
        }

		#Explicitly list args to disallow
		if ($arg_qt != "") {
			return 403;
		}
		
		# Disallow specific params that begin with a pattern, ie stream.file stream.body etc
		if ($args ~ [\&\?]stream.*?=(.*)) {
			return 403;
		}
    }

    location /socket.io {
       proxy_pass http://movie;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
       proxy_set_header Host $host;
       proxy_set_header X-Real-Ip $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
    }
}

