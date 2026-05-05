IF DB_ID('DisasterResponseMIS') IS NOT NULL
BEGIN
    ALTER DATABASE DisasterResponseMIS SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE DisasterResponseMIS;
END
GO

CREATE DATABASE DisasterResponseMIS;
GO

USE DisasterResponseMIS;
GO

PRINT 'Database created successfully.';
GO