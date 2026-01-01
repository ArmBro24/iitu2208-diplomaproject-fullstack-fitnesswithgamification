
SELECT 'CREATE DATABASE training_db'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'training_db')\gexec;

SELECT 'CREATE DATABASE gamification_db'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gamification_db')\gexec;
