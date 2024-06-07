from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS
import json
import base64
import os

app = Flask(__name__)
CORS(app) # Habilita CORS para peticiones de otras fuentes

def connect_db():
    """Función para conectar a la base de datos Mongo.
    Intenta conectar a la base de datos especificada en la configuración de la aplicación.
    Si la conexión es exitosa, devuelve el objeto de PyMongo. De lo contrario,
    imprime un mensaje de error y devuelve None.
    """
    try:
        app.config["MONGO_URI"] = "mongodb://mongo_db:27017/superheroes"
        mongo = PyMongo(app)
        print("Conectado a Mongo")
        return mongo
    except ConnectionError as e:
        print("Error de conexión con Mongo:", e)
        return None

mongo = connect_db()  # Intenta conectar al iniciar la aplicación

def load_data():
    """Carga los datos iniciales en la base de datos.
    Esta función es opcional y se puede comentar si no se desea cargar datos predeterminados.
    Verifica si la colección de superhéroes está vacía y, si lo está, lee los datos de un archivo JSON
    y los inserta en la base de datos.
    """
    if mongo is not None:
        collection = mongo.db.superheroes # Obtiene la colección de superhéroes
        #collection.delete_many({})  # Elimina todos los documentos existentes en la colección de superhéroes
        if collection.count_documents({}) == 0:  # Verifica si la colección está vacía
            with open('data/superheroes.json') as f: # Lee el archivo JSON de superhéroes
                superheroes = json.load(f)
                for superhero in superheroes:
                    name = superhero['name']
                    image_dir = os.path.join('static', name) # Construye la ruta del directorio de imágenes
                    images = []
                    # Lee las imágenes asociadas al superhéroe
                    if os.path.exists(image_dir) and os.path.isdir(image_dir):
                        for filename in os.listdir(image_dir):
                            if filename.endswith(".png") or filename.endswith(".jpg") or filename.endswith(".jpeg"):
                                with open(os.path.join(image_dir, filename), 'rb') as img_file:
                                    encoded_image = base64.b64encode(img_file.read()).decode('utf-8') # Codifica la imagen en base64
                                    images.append(encoded_image)
                    superhero['images'] = images # Agrega las imágenes al documento del superhéroe
                    collection.insert_one(superhero)  # Inserta el documento del superhéroe en la base de datos
            print("Datos cargados exitosamente")
        else:
            print("La colección de superhéroes ya contiene datos, no se cargaron datos adicionales.")
    else:
        print("Error: No se pudo conectar a la base de datos.")

def format_superheroes(superheroes):
    """Formatea los documentos de superhéroes para la respuesta JSON.
    Esta función toma una lista de documentos de superhéroes y la transforma en una lista de diccionarios
    con las propiedades necesarias para la respuesta JSON de la API. Se convierte el campo `_id` de ObjectId
    a string para compatibilidad con clientes.
    """
    return [{
        '_id': str(superhero['_id']),
        'name': superhero['name'],
        'real_name': superhero['real_name'],
        'age': superhero['age'],
        'home': superhero['home'],
        'biography': superhero['biography'],
        'equipment': superhero['equipment'],
        'images': superhero.get('images', [])  # Incluye un arreglo vacío si 'images' no existe
    } for superhero in superheroes]

# Rutas de la API
@app.route('/', methods=['GET'])
def index():
    return 'Hello, world! This is the homepage of the Superheroes app.'

@app.route('/superheroes', methods=['GET'])
def get_superheroes():
    """Recupera todos los documentos de superhéroes de la base de datos."""
    superheroes = mongo.db.superheroes.find()  # Obtiene todos los superhéroes de la base de datos
    return jsonify(format_superheroes(superheroes))

@app.route('/superhero', methods=['POST'])
def add_superhero():
    """Agrega un nuevo documento de superhéroe a la base de datos."""
    data = request.get_json()  # Obtiene los datos del JSON enviado desde el frontend
    if 'images' in data:
        images = data['images']  # Lista de imágenes en Base64
        # Guardar imágenes en Base64 en la base de datos
        data['images'] = images
    # Inserta el nuevo superhéroe en la base de datos
    mongo.db.superheroes.insert_one(data)
    return jsonify({"message": "Superhero added"}), 201

@app.route('/superhero/<id>', methods=['PUT'])
def update_superhero(id):
    data = request.get_json()
    mongo.db.superheroes.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"message": f"Superhero updated {data}"})

@app.route('/superhero/<id>', methods=['DELETE'])
def delete_superhero(id):
    """Elimina un documento de superhéroe de la base de datos."""
    try:
        mongo.db.superheroes.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "Superhero deleted"})
    except Exception as e:
        return jsonify({"message": f"Error deleting superhero: {str(e)}"}), 400

@app.route('/marvel', methods=['GET'])
def get_marvel_superheroes():
    """Recupera todos los superhéroes de Marvel de la base de datos."""
    superheroes = mongo.db.superheroes.find({"home": "Marvel"})
    return jsonify(format_superheroes(superheroes))

@app.route('/dc', methods=['GET'])
def get_dc_superheroes():
    """Recupera todos los superhéroes de DC de la base de datos."""
    superheroes = mongo.db.superheroes.find({"home": "DC"})
    return jsonify(format_superheroes(superheroes))

@app.errorhandler(404)
def page_not_found(error):
    """Manejador de error personalizado para la página no encontrada (404)."""
    return jsonify({'message': f"¡Ooops! La página que buscas no está en el servidor! {error}"}), 404

if __name__ == '__main__':
    load_data()  # Carga los datos iniciales
    app.run(host='py-server', port='5000', debug=True)
