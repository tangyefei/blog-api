# blog-api


Install mysql and configure 

on centos

https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-centos-7

on mac

https://dev.mysql.com/doc/mysql-osx-excerpt/5.7/en/osx-installation-pkg.html


login into mysql

```
/usr/local/mysql/bin/mysql -u root -p
```

init database and table

```
CREATE DATABASE IF NOT EXISTS blog;

use blog;

CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT,
    type VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    overview VARCHAR(255) NOT NULL,
    created_at DATE,
    tags VARCHAR(255) NOT NULL,
    content VARCHAR(4000) NOT NULL,
    PRIMARY KEY (id)
)  ENGINE=INNODB;

`````````

run node server 

```
$ npm install forever -g
$ nohup forever start app.js &
```
