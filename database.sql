-- Script de création de la base de données pour ERP-SIG Logistique
-- Target: SQL Server (Compatible Azure SQL / LocalDB)

-- 1. Création de la Base de Données
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ERPSIG_Logistique')
BEGIN
    CREATE DATABASE ERPSIG_Logistique;
END
GO

USE ERPSIG_Logistique;
GO

-- 2. Table des Utilisateurs (Pour la future authentification)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE Users (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Username NVARCHAR(50) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        FullName NVARCHAR(100),
        Role NVARCHAR(20) NOT NULL DEFAULT 'User', -- 'Admin', 'Manager', 'Driver'
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END
GO

-- 3. Table des Livraisons
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Deliveries]') AND type in (N'U'))
BEGIN
    CREATE TABLE Deliveries (
        Id NVARCHAR(50) PRIMARY KEY, -- Identifiant unique (ex: DEL-1234)
        
        -- Informations Client
        ClientName NVARCHAR(100) NOT NULL,
        DestinationAddress NVARCHAR(255) NOT NULL,
        
        -- Coordonnées GPS (SIG)
        Latitude DECIMAL(9, 6),
        Longitude DECIMAL(9, 6),
        
        -- État et Type
        Status NVARCHAR(20) NOT NULL CHECK (Status IN ('pending', 'transit', 'delivered', 'issue')),
        Type NVARCHAR(20) NOT NULL CHECK (Type IN ('national', 'international')),
        
        -- Détails Colis
        Weight DECIMAL(10, 2), -- en kg
        Volume DECIMAL(10, 2), -- en m3
        
        -- Spécifique International
        CountryCode NVARCHAR(2), -- Code ISO (FR, ES, US...)
        Incoterm NVARCHAR(3), -- EXW, FOB, CIF...
        
        -- Métadonnées
        DeliveryDate DATE,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE()
    );
END
GO

-- 4. Insertion de Données de Test (Seed Data)
-- Vérification si la table est vide avant d'insérer
IF NOT EXISTS (SELECT 1 FROM Deliveries)
BEGIN
    INSERT INTO Deliveries (Id, ClientName, DestinationAddress, Latitude, Longitude, Status, Type, Weight, Volume, DeliveryDate)
    VALUES 
    ('DEL-001', 'Tech Solutions Inc.', '10 Rue de la Paix, Paris, France', 48.8698, 2.3312, 'delivered', 'national', 15.5, 0.2, '2023-10-25'),
    ('DEL-003', 'Local Shop', '5 Avenue Anatole France, Paris, France', 48.8584, 2.2945, 'pending', 'national', 5.0, 0.05, '2023-10-27');

    INSERT INTO Deliveries (Id, ClientName, DestinationAddress, Latitude, Longitude, Status, Type, Weight, Volume, CountryCode, Incoterm, DeliveryDate)
    VALUES 
    ('DEL-002', 'Global Trade Ltd', 'Avenida de América, Madrid, Spain', 40.4379, -3.6760, 'transit', 'international', 120.0, 1.5, 'ES', 'DDP', '2023-10-26');
    
    PRINT 'Données de test insérées avec succès.';
END
GO
