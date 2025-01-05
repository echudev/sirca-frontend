BEGIN;

WITH analizador AS (
    SELECT id FROM item_subcategory WHERE name = 'ANALIZADOR'
)
INSERT INTO item (name, item_code, subcategory_id, acquisition_date, updated_at)
SELECT 
    sub.name, 
    sub.item_code, 
    analizador.id, 
    sub.acquisition_date::date, 
    now()
FROM (
    VALUES 
        ('Analizador de CO', 'CO-24-TH48I', '2024-06-01'),
        ('Analizador de CO2', 'CO2-24-TH48I', '2024-06-01'),
        ('Analizador de NOx', 'NOx-24-TH48I', '2024-06-01'),
        ('Analizador de SO2', 'SO2-24-TH48I', '2024-06-01')
) AS sub(name, item_code, acquisition_date)
CROSS JOIN analizador
ON CONFLICT (item_code) DO NOTHING;

WITH consumible AS (
    SELECT id FROM item_subcategory WHERE name = 'CONSUMIBLE'
)
INSERT INTO item (name, item_code, subcategory_id, acquisition_date, updated_at)
SELECT 
    sub.name, 
    sub.item_code, 
    consumible.id, 
    sub.acquisition_date::date, 
    now()
FROM (
    VALUES 
        ('Cinta BAM1020', 'CI-24-BM20', '2024-06-01'),
        ('Filtros u47', 'FI-47-2024', '2024-06-01'),
        ('Kit Bomba Bam1020', 'KI-BM-1020', '2024-06-01'),
        ('Pila CR2032', 'PI-24-2032', '2024-06-01')
) AS sub(name, item_code, acquisition_date)
CROSS JOIN consumible
ON CONFLICT (item_code) DO NOTHING;

COMMIT;
