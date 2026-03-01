-- EventSphere Database Schema
-- This file auto-runs when the PostgreSQL container starts for the first time.

-- Custom ENUM types
CREATE TYPE event_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE user_role AS ENUM ('superadmin', 'department');

-- ===================
-- FUNCTIONS / TRIGGERS
-- ===================

CREATE FUNCTION check_venue_capacity() RETURNS trigger
    LANGUAGE plpgsql AS $$
DECLARE
  event_capacity INTEGER;
  current_count INTEGER;
BEGIN
  SELECT v.capacity INTO event_capacity
  FROM events e JOIN venue v ON e.venue_id = v.id
  WHERE e.id = NEW.event_id;

  SELECT COUNT(*) INTO current_count
  FROM registrations
  WHERE event_id = NEW.event_id;

  IF current_count >= event_capacity THEN
    RAISE EXCEPTION 'Event is full. Venue capacity reached.';
  END IF;

  RETURN NEW;
END;
$$;

CREATE FUNCTION prevent_venue_conflict() RETURNS trigger
    LANGUAGE plpgsql AS $$
DECLARE
  conflict_count INTEGER;
BEGIN
  IF NEW.status = 'approved' THEN
    SELECT COUNT(*) INTO conflict_count
    FROM events
    WHERE venue_id = NEW.venue_id
    AND status = 'approved'
    AND id != NEW.id
    AND start_time < NEW.end_time
    AND end_time > NEW.start_time;

    IF conflict_count > 0 THEN
      RAISE EXCEPTION 'Venue is already booked for this time slot.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE FUNCTION update_updated_at() RETURNS trigger
    LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ===================
-- TABLES
-- ===================

CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE venue (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE admins (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
    is_superadmin BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    venue_id BIGINT NOT NULL REFERENCES venue(id) ON DELETE RESTRICT,
    department_id BIGINT NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status event_status NOT NULL DEFAULT 'pending',
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_by BIGINT NOT NULL REFERENCES admins(id) ON DELETE RESTRICT,
    approved_by BIGINT REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT events_check CHECK (end_time > start_time)
);

CREATE TABLE registrations (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE RESTRICT,
    student_name VARCHAR(150) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (event_id, roll_number),
    UNIQUE (event_id, student_email)
);

-- ===================
-- INDEXES
-- ===================

CREATE INDEX idx_events_status ON events USING btree (status);
CREATE INDEX idx_events_venue_start ON events USING btree (venue_id, start_time);
CREATE INDEX idx_registrations_event_id ON registrations USING btree (event_id);

-- ===================
-- TRIGGERS
-- ===================

CREATE TRIGGER check_venue_conflict BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION prevent_venue_conflict();

CREATE TRIGGER enforce_capacity BEFORE INSERT ON registrations
    FOR EACH ROW EXECUTE FUNCTION check_venue_capacity();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===================
-- SEED DATA
-- ===================

INSERT INTO departments (name) VALUES
('CSE'), ('Mechanical'), ('ECE'), ('IT'), ('Civil'), ('MBA'), ('Basic Science');

INSERT INTO venue (name, capacity) VALUES
('Main Auditorium', 500),
('Seminar Hall A', 100),
('Seminar Hall B', 80),
('Open Ground', 1000),
('Computer Lab', 60);
