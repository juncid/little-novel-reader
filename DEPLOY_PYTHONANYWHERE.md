# Despliegue en PythonAnywhere

Guía paso a paso para desplegar esta aplicación en PythonAnywhere.

## Requisitos

- Cuenta en [PythonAnywhere](https://www.pythonanywhere.com/) (plan gratuito funciona)
- Node.js instalado localmente para compilar el frontend

---

## Paso 1: Compilar el Frontend

Ejecutar localmente antes de subir:

```bash
cd frontend
npm install
npm run build
```

Esto genera la carpeta `static/` en la raíz del proyecto.

---

## Paso 2: Subir Archivos a PythonAnywhere

Subir estos archivos/carpetas a `/home/TU_USUARIO/webapp`:

```
webapp/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── wsgi.py
├── static/           ← Generado por npm run build
│   ├── index.html
│   └── assets/
├── ocr_database.json
└── users_database.json
```

### Métodos de subida:
- **Zip + Upload**: Comprimir todo y subir desde la pestaña "Files"
- **Git**: `git clone` tu repositorio en PythonAnywhere
- **Bash**: Usar `scp` o `rsync` si tienes cuenta de pago

---

## Paso 3: Crear Entorno Virtual

En la consola Bash de PythonAnywhere:

```bash
cd ~/webapp/backend
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## Paso 4: Configurar la Web App

1. Ir a la pestaña **"Web"**
2. Click en **"Add a new web app"**
3. Seleccionar **"Manual configuration"** → **Python 3.10**

### Configuración:
| Campo | Valor |
|-------|-------|
| Source code | `/home/TU_USUARIO/webapp` |
| Working directory | `/home/TU_USUARIO/webapp` |
| Virtualenv | `/home/TU_USUARIO/webapp/backend/venv` |

---

## Paso 5: Editar WSGI

Click en el link del archivo WSGI y reemplazar TODO el contenido con:

```python
import sys
import os

project_home = '/home/TU_USUARIO/webapp'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

os.chdir(project_home)

from backend.app import app as application
```

> ⚠️ Reemplaza `TU_USUARIO` con tu nombre de usuario real de PythonAnywhere

---

## Paso 6: Recargar

Click en el botón **"Reload"** verde en la pestaña Web.

Tu aplicación estará disponible en:
```
https://TU_USUARIO.pythonanywhere.com
```

---

## Solución de Problemas

### Los estilos no cargan
Verificar que `static/assets/` existe y contiene los archivos CSS.

### Error 500
Revisar logs en: `Error log` link en la pestaña Web.

### La API no responde
Verificar que `ocr_database.json` y `users_database.json` están en `/home/TU_USUARIO/webapp/`.

---

## Actualizar la Aplicación

1. Compilar frontend localmente: `npm run build`
2. Subir la nueva carpeta `static/` a PythonAnywhere
3. Si cambió el backend, subir `backend/app.py`
4. Click **"Reload"** en la pestaña Web
