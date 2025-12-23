"""
Backend API ligero para servir la base de datos OCR.
Optimizado para PythonAnywhere con soporte para archivos estáticos.
"""
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import os

# Detectar si estamos en PythonAnywhere
IS_PYTHONANYWHERE = 'PYTHONANYWHERE_DOMAIN' in os.environ

# Configurar rutas base
if IS_PYTHONANYWHERE:
    # En PythonAnywhere, usar rutas absolutas
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
else:
    BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Rutas a las bases de datos
DATABASE_PATH = os.path.join(BASE_DIR, 'ocr_database.json')
USERS_DATABASE_PATH = os.path.join(BASE_DIR, 'users_database.json')

# Carpeta de archivos estáticos del frontend compilado
STATIC_FOLDER = os.path.join(BASE_DIR, 'static')

app = Flask(__name__, static_folder=STATIC_FOLDER, static_url_path='')
CORS(app)  # Permitir CORS para el frontend


def load_database():
    """Cargar la base de datos JSON."""
    try:
        with open(DATABASE_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"_default": {}}
    except json.JSONDecodeError:
        return {"_default": {}}


def load_users_database():
    """Cargar la base de datos de usuarios."""
    try:
        with open(USERS_DATABASE_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"users": {}}
    except json.JSONDecodeError:
        return {"users": {}}


def save_users_database(data):
    """Guardar la base de datos de usuarios."""
    with open(USERS_DATABASE_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# ============ SERVIR FRONTEND ============

@app.route('/')
def serve_index():
    """Servir el archivo index.html principal."""
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/<path:path>')
def serve_static(path):
    """Servir archivos estáticos o redirigir al index para SPA."""
    # Si el archivo existe, servirlo
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    # Si no existe, servir index.html (para rutas SPA)
    return send_from_directory(app.static_folder, 'index.html')


# ============ ENDPOINTS DE API ============

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint de salud."""
    return jsonify({
        "status": "ok",
        "environment": "pythonanywhere" if IS_PYTHONANYWHERE else "local"
    })


# ============ ENDPOINTS DE USUARIOS ============

@app.route('/api/users', methods=['GET'])
def get_users():
    """Obtener lista de todos los usuarios."""
    db = load_users_database()
    users = list(db.get("users", {}).values())
    return jsonify(users)


@app.route('/api/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """Obtener un usuario específico."""
    db = load_users_database()
    user = db.get("users", {}).get(user_id)
    if user:
        return jsonify(user)
    return jsonify({"error": "Usuario no encontrado"}), 404


@app.route('/api/users/<user_id>/progress', methods=['POST'])
def update_reading_progress(user_id):
    """Actualizar el progreso de lectura de un usuario."""
    db = load_users_database()
    
    if user_id not in db.get("users", {}):
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    data = request.get_json()
    document_id = data.get("document_id")
    current_page = data.get("current_page", 0)
    
    if not document_id:
        return jsonify({"error": "document_id es requerido"}), 400
    
    # Actualizar progreso
    if "reading_progress" not in db["users"][user_id]:
        db["users"][user_id]["reading_progress"] = {}
    
    db["users"][user_id]["reading_progress"][document_id] = {
        "current_page": current_page,
        "last_read": request.json.get("timestamp", "")
    }
    
    save_users_database(db)
    return jsonify({"status": "ok", "progress": db["users"][user_id]["reading_progress"][document_id]})


@app.route('/api/users/<user_id>/progress/<document_id>', methods=['GET'])
def get_reading_progress(user_id, document_id):
    """Obtener el progreso de lectura de un documento específico."""
    db = load_users_database()
    
    user = db.get("users", {}).get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    progress = user.get("reading_progress", {}).get(document_id, {"current_page": 0})
    return jsonify(progress)


# ============ ENDPOINTS DE DOCUMENTOS ============

@app.route('/api/documents', methods=['GET'])
def get_documents():
    """Obtener lista de todos los documentos."""
    db = load_database()
    documents = []
    
    for key, doc in db.get("_default", {}).items():
        documents.append({
            "id": doc.get("id"),
            "filename": doc.get("filename"),
            "title": doc.get("title"),
            "author": doc.get("author"),
            "description": doc.get("description"),
            "genre": doc.get("genre"),
            "publishedYear": doc.get("publishedYear"),
            "coverImage": doc.get("coverImage"),
            "rating": doc.get("rating"),
            "page_count": doc.get("page_count"),
            "pages_processed": doc.get("pages_processed"),
            "status": doc.get("status"),
            "engine": doc.get("engine"),
            "created_at": doc.get("created_at"),
            "updated_at": doc.get("updated_at"),
            "translation_count": len(doc.get("translations", []))
        })
    
    return jsonify(documents)


@app.route('/api/documents/<doc_id>', methods=['GET'])
def get_document(doc_id):
    """Obtener un documento específico por ID."""
    db = load_database()
    
    for key, doc in db.get("_default", {}).items():
        if doc.get("id") == doc_id:
            return jsonify(doc)
    
    return jsonify({"error": "Documento no encontrado"}), 404


@app.route('/api/documents/<doc_id>/translations', methods=['GET'])
def get_translations(doc_id):
    """Obtener las traducciones de un documento."""
    db = load_database()
    
    for key, doc in db.get("_default", {}).items():
        if doc.get("id") == doc_id:
            return jsonify({
                "document_id": doc_id,
                "filename": doc.get("filename"),
                "translations": doc.get("translations", [])
            })
    
    return jsonify({"error": "Documento no encontrado"}), 404


@app.route('/api/documents/<doc_id>/pages', methods=['GET'])
def get_pages(doc_id):
    """Obtener las páginas OCR de un documento."""
    db = load_database()
    
    for key, doc in db.get("_default", {}).items():
        if doc.get("id") == doc_id:
            return jsonify({
                "document_id": doc_id,
                "filename": doc.get("filename"),
                "pages": doc.get("pages", [])
            })
    
    return jsonify({"error": "Documento no encontrado"}), 404


if __name__ == '__main__':
    print(f"📚 Cargando base de datos desde: {DATABASE_PATH}")
    print(f"👥 Cargando usuarios desde: {USERS_DATABASE_PATH}")
    print(f"🌐 Sirviendo frontend desde: {STATIC_FOLDER}")
    app.run(host='0.0.0.0', port=5000, debug=True)
