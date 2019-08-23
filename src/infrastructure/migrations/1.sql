create database docs;
create user docs with encrypted password 'dude';
grant all privileges on database docs to docs;

CREATE TABLE documents (
    id                    varchar(50) CONSTRAINT firstkey PRIMARY KEY,
    collection_name       varchar(255) NOT NULL,
    document_data  	      text NOT NULL,
    created_at            timestamp,
    created_by            varchar(50),
    updated_at            timestamp,
    updated_by            varchar(50)       
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO docs;