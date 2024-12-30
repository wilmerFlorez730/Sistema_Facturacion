-- Tabla Usuarios (Opcional)
CREATE TABLE Usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20)   
);

-- Tabla Cultivos
CREATE TABLE Cultivos (
    id_cultivo SERIAL PRIMARY KEY,
    nombre_cultivo VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- Tabla Facturas
CREATE TABLE Facturas (
    id_factura SERIAL PRIMARY KEY,
    id_usuario INT, -- Relación con Usuarios (si aplica)
    id_cultivo INT NOT NULL, -- Relación con Cultivos
    kilos_pareja NUMERIC(10, 2) DEFAULT 0, -- Kilos Pareja
    kilos_gruesa NUMERIC(10, 2) DEFAULT 0, -- Kilos Gruesa
    kilos_millo NUMERIC(10, 2) DEFAULT 0, -- Kilos Millo
    precio_pareja NUMERIC(10, 2) DEFAULT 0, -- Precio por Kilo Pareja
    precio_gruesa NUMERIC(10, 2) DEFAULT 0, -- Precio por Kilo Gruesa
    precio_millo NUMERIC(10, 2) DEFAULT 0, -- Precio por Kilo Millo
    total_pagar NUMERIC(12, 2) GENERATED ALWAYS AS (
        (kilos_pareja * precio_pareja) + 
        (kilos_gruesa * precio_gruesa) + 
        (kilos_millo * precio_millo)
    ) STORED,
    estado_pago VARCHAR(20) DEFAULT 'Pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES Usuarios (id_usuario) ON DELETE SET NULL,
    CONSTRAINT fk_cultivo FOREIGN KEY (id_cultivo) REFERENCES Cultivos (id_cultivo) ON DELETE CASCADE
);

-- Tabla Pagos (Opcional)
CREATE TABLE Pagos (
    id_pago SERIAL PRIMARY KEY,
    id_factura INT NOT NULL, -- Relación con Facturas
    monto_pagado NUMERIC(12, 2) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo_pago VARCHAR(50),
    CONSTRAINT fk_factura FOREIGN KEY (id_factura) REFERENCES Facturas (id_factura) ON DELETE CASCADE
);

