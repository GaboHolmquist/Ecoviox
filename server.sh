#!/bin/bash
# Script para levantar el servidor local en el puerto 8050
echo "Iniciando servidor local de Ecoviox en http://localhost:8050"
echo "Presiona Ctrl+C para detener."
python3 -m http.server 8050
