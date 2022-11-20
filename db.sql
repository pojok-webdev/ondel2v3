drop table if exists sentmessages;
create table sentmessages(
    id int primary key auto_increment,
    email varchar(100),
    template_id smallint,
    recipient varchar(50),
    message text,
    createdate timestamp default current_timestamp()
);

drop table if exists contactphones;
create table contactphones(
    id int primary key auto_increment,
    client_id int,
    picname varchar(100),
    picrole varchar(50),
    picphone varchar(20),
    createdate timestamp default current_timestamp()
)

use qiscus
drop table if exists messagecategories;
create table messagecategories (id int primary key auto_increment,parent_id int,name varchar(100),description text,createdate timestamp default current_timestamp);


use qiscus
drop table if exists categoryclients;
create table categoryclients (id int primary key auto_increment,
client_id int,category_id int, 
name varchar(200),
client_site_id int,address text,
createuser
varchar(50),createdate timestamp default current_timestamp());

use qiscus
drop table if exists clients;
create table clients (id int primary key auto_increment,name varchar(100),address text,picname varchar(100),picwa varchar(50),description text,kdfb varchar(100),createdate timestamp default current_timestamp());


use qiscus
drop table if exists categories_clients;
create table categories_clients (category_id int,client_id int,createdate timestamp default current_timestamp());


create table logging (id int primary key auto_increment,subject text,description text,createuser varchar(50),createdate timestamp default current_timestamp())

20220721
alter table clients add column location_id smallint after id;

