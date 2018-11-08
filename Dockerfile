FROM nginx:1.15.2

COPY /www /usr/share/nginx/html

COPY /default.conf /etc/nginx/conf.d/default.conf