# blog-api

```
CREATE DATABASE IF NOT EXISTS blog;

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

Use below command to run: 

```
$ nohup node app.js &
```