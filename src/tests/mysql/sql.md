CREATE 

create table test_table 
(
  id int not null,
  name varchar(255) default null,
  age int default null,
  address varchar(255) default null,
  primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

PROCEDURE

create definer='tipjs'@'%' procedure 'insert_data' ()
begin
declare max_id int default 1000000;
declare i int default 1;
while i <= max_id D0
insert into test_table (id, name, age, address) values (i, CONCAT('Name', i), i % 100, CONCAT('Address', i));
set i = i + 1;
end while;
end