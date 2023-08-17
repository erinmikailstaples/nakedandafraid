--duckDB syntax, should also work for all Postgres DBs too
CREATE TABLE location (
    id INT PRIMARY KEY,
    country_name VARCHAR(255),
    episode_location_name VARCHAR(255)
);

CREATE TABLE episode_location (
    id INT PRIMARY KEY,
    episode_location_name VARCHAR(255)
);

CREATE TABLE contestant (
    id INT PRIMARY KEY,
    group_id INT,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    episode_id INTEGER[];
);

CREATE TABLE episode (
    id INT PRIMARY KEY,
    season_id INT,
    episode_nr INT,
    aired_date DATE,
    title VARCHAR(255),
    scheduled_length_days INT,
    arrangement VARCHAR(255),
    primitive_survival_rating FLOAT
);

CREATE TABLE season (
    id INT PRIMARY KEY,
    name VARCHAR(255)
);
