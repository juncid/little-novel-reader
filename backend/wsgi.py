"""
WSGI Configuration for PythonAnywhere

Instrucciones de configuración en PythonAnywhere:
1. Ir a la sección "Web" de tu cuenta
2. Configurar el Source code path: /home/TU_USUARIO/webapp
3. Configurar el WSGI configuration file
4. Editar el archivo WSGI y pegar lo siguiente:

import sys
import os

# Agregar el directorio del proyecto al path
project_home = '/home/TU_USUARIO/webapp'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Establecer el directorio de trabajo
os.chdir(project_home)

# Importar la aplicación Flask
from backend.app import app as application
"""

import sys
import os

# Agregar el directorio del proyecto al path
project_home = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Establecer el directorio de trabajo
os.chdir(project_home)

# Importar la aplicación Flask
from backend.app import app as application

# Para ejecutar localmente con gunicorn (opcional):
# gunicorn --chdir .. backend.wsgi:application
