CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    email VARCHAR(255) UNIQUE NOT NULL, 
    username VARCHAR(50) UNIQUE NOT NULL, 
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE instructor_applications ( -- for users applying to be instructors
    id SERIAL PRIMARY KEY,                -- Unique identifier for each application
    user_id INT NOT NULL,                 -- References the user applying to be an instructor
    applied_at TIMESTAMP DEFAULT NOW(),   -- Timestamp of the application
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE courses ( -- for courses created by instructors
    id SERIAL PRIMARY KEY,                -- Unique identifier for each course
    title VARCHAR(255) NOT NULL,          -- Title of the course
    description TEXT,                     -- Detailed description of the course
    instructor_id INT NOT NULL,           -- References the instructor who created the course
    price DECIMAL(10, 2) DEFAULT 0.00,    -- Price of the course (default is free)
    created_at TIMESTAMP DEFAULT NOW(),   -- Timestamp when the course was created
    updated_at TIMESTAMP DEFAULT NOW(),   -- Timestamp when the course was last updated
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE course_content (
    id SERIAL PRIMARY KEY,                
    course_id INT NOT NULL,               -- References the course the content belongs to
    title VARCHAR(255) NOT NULL,          -- Title of the video content
    content_url TEXT NOT NULL,            -- URL or path to the video file
    created_at TIMESTAMP DEFAULT NOW(),   -- Timestamp when the content was added
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,                -- Unique identifier for each enrollment
    user_id INT NOT NULL,                 -- References the user who enrolled
    course_id INT NOT NULL,               -- References the course the user enrolled in
    enrolled_at TIMESTAMP DEFAULT NOW(),  -- Timestamp when the enrollment occurred
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);