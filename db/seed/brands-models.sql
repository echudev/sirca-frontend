BEGIN;

-- 1. Insertar Marcas (brands) con manejo de conflictos
INSERT INTO brand (name) 
VALUES 
    ('Thermo'),
    ('Ecotech'),
    ('Acoem'),
    ('Teledyne'),
    ('Horiba'),
    ('Siemens'),
    ('TSI'),
    ('MonitorEurope'),
    ('MonitorLabs'),
    ('Environnement'),
    ('ENVEA'),
    ('MetOne'),
    ('DAVIS')
ON CONFLICT (name) DO NOTHING; -- Evita insertar duplicados si ya existen



-- 2. Insertar Modelos para 'Thermo'
WITH thermo AS (
    SELECT id FROM brand WHERE name = 'Thermo'
)
INSERT INTO model (name, brand_id)
SELECT sub.name, thermo.id
FROM (VALUES 
    ('48i'),
    ('42i'),
    ('43i'),
    ('49i'),
    ('48c'),
    ('42c'),
    ('146c'),
    ('146i'),
    ('111')
) AS sub(name)
CROSS JOIN thermo
ON CONFLICT (name, brand_id) DO NOTHING; -- Evita duplicados de subcategorías

-- 3. Insertar Modelos para 'Ecotech'
WITH ecotech AS (
    SELECT id FROM brand WHERE name = 'Ecotech'
)
INSERT INTO model (name, brand_id)
SELECT sub.name, ecotech.id
FROM (VALUES 
    ('Serinus 10'),
    ('Serinus 30'),
    ('Serinus 40'),
    ('SpirantBam 1020')
) AS sub(name)
CROSS JOIN ecotech
ON CONFLICT (name, brand_id) DO NOTHING; -- Evita duplicados de subcategorías

-- 3. Insertar Modelos para 'MetOne'
WITH metone AS (
    SELECT id FROM brand WHERE name = 'MetOne'
)
INSERT INTO model (name, brand_id)
SELECT sub.name, metone.id
FROM (VALUES 
    ('SpirantBam 1020')
) AS sub(name)
CROSS JOIN metone
ON CONFLICT (name, brand_id) DO NOTHING; -- Evita duplicados de subcategorías


COMMIT;
