CREATE DATABASE tata;

\ connect tata;

CREATE EXTENSION hstore;

CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    country VARCHAR(20),
    city VARCHAR(20),
    address VARCHAR(200),
    rating NUMERIC,
    experience NUMERIC,
    price NUMERIC
);

CREATE TABLE babies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    date_of_birth VARCHAR(20),
    date_range VARCHAR(2)
);

CREATE TABLE follow_up (
    id SERIAL PRIMARY KEY,
    baby_id INTEGER REFERENCES babies(id),
    follow_up_date DATE,
    motorMilestones BOOLEAN [],
    feedingMilestones BOOLEAN [],
    communicationMilestones BOOLEAN [],
    sensoryMilestones BOOLEAN [],
    score NUMERIC,
    notes TEXT
);

CREATE TABLE doctor_availability (
    availability_id SERIAL PRIMARY KEY,
    doctor_id INT,
    weekday INT CHECK (
        weekday BETWEEN 1
        AND 7
    ),
    -- 1 for Monday, 7 for Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    baby_id INT REFERENCES babies(id),
    doctor_id INT REFERENCES doctors(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20),
    type VARCHAR(20) record VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50) CHECK(
        payment_method IN ('credit_card', 'cash', 'insurance')
    )
);