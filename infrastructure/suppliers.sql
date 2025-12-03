-- Run this against your local or Azure SQL database

CREATE TABLE Suppliers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(128) NOT NULL,
    Commodity NVARCHAR(64) NOT NULL,
    ContactEmail NVARCHAR(128) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT(GETUTCDATE())
);

CREATE TABLE Documents (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FileName NVARCHAR(256) NOT NULL,
    BlobUri NVARCHAR(512) NOT NULL,
    SupplierId INT NOT NULL,
    UploadedAt DATETIME NOT NULL DEFAULT(GETUTCDATE()),
    CONSTRAINT FK_Documents_Suppliers FOREIGN KEY (SupplierId) REFERENCES Suppliers(Id)
);
