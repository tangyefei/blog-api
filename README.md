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

INSERT INTO articles(type, title, created_at, tags, overview, content) VALUES ("tech", "测试标题", "2018-05-23", "文学", "概述", "内容")

INSERT INTO articles(type, title, created_at, tags, overview, content) VALUES ('module', '[置顶]从2018年起，每周阅读一本书', '2019-04-10', '读书', '每周读一本书', '');

INSERT INTO 
 articles(type, title, created_at, tags, overview, content)
VALUES
 ('article', '[原创]价值判断怎么破坏你的生活?', '2019-03-26', '心理,社交', '为什么有的人很难按照自己所想去生活，并且在社交生活中表现的难以合群。', '');
 
INSERT INTO 
 articles(type, title, created_at, tags, overview, content)
VALUES
 ('tech','[译]Flask Web Development (更新到第八章）','2015-07-08','Flask,Python','因为开发使用的缘故，提供该图书的英文版的简明扼要的翻译。', '');
 `````````