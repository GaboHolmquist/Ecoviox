#!/bin/bash
# WEBUP - Script de respaldo y publicación en GitHub Pages
# Uso: ./webup.sh "Mensaje del commit"

MSG=$1
if [ -z "$MSG" ]; then
  MSG="WEBUP: Actualización de diseño y ajustes"
fi

echo "=========================================="
echo "          INICIANDO PROCESO WEBUP         "
echo "=========================================="

# 1. Crear Respaldo Local con marca de tiempo
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/backup_$TIMESTAMP"
mkdir -p "$BACKUP_DIR"

# Copiar archivos clave
cp index.html "$BACKUP_DIR/" 2>/dev/null
cp styles.css "$BACKUP_DIR/" 2>/dev/null
cp script.js "$BACKUP_DIR/" 2>/dev/null
cp -r assets "$BACKUP_DIR/assets" 2>/dev/null

echo "[+] Respaldo local guardado en: $BACKUP_DIR"

# 2. Agregar cambios locales al commit actual
git add .

# 3. Crear rama de respaldo Git y empujarla a GitHub
echo "[+] Creando respaldo en rama Git 'backup-latest'..."
git branch -D backup-latest 2>/dev/null # Eliminar local si existe
git checkout -b backup-latest
git push -f origin backup-latest
git checkout main

# 4. Confirmar cambios en main y empujar
echo "[+] Publicando cambios en la rama principal 'main'..."
git commit -m "$MSG"
git push origin main

echo "=========================================="
echo "      ¡WEBUP COMPLETADO CON ÉXITO!        "
echo "=========================================="
