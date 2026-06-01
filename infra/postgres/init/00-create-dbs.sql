
SELECT 'CREATE DATABASE training_db'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'training_db')\gexec;

SELECT 'CREATE DATABASE gamification_db'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gamification_db')\gexec;

SELECT 'CREATE DATABASE challenge_db'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'challenge_db')\gexec;

SELECT 'CREATE DATABASE notification_db'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'notification_db')\gexec;

SELECT 'CREATE DATABASE reg_db'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'reg_db')\gexec;
