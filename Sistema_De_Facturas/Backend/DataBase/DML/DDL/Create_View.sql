CREATE OR REPLACE VIEW TotalRecaudadoMensual AS
SELECT 
    u.id_usuario,
    u.nombre AS nombre_usuario,
    DATE_TRUNC('month', f.fecha_creacion) AS mes,
    SUM(f.total_pagar) AS total_recaudado
FROM 
    Usuarios u
LEFT JOIN 
    Facturas f ON u.id_usuario = f.id_usuario
GROUP BY 
    u.id_usuario, u.nombre, DATE_TRUNC('month', f.fecha_creacion);
