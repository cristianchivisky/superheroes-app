from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from db import mongo

routes_blueprint = Blueprint('routes', __name__)

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
        'images': superhero.get('images', [])
    } for superhero in superheroes]

@routes_blueprint.route('/', methods=['GET'])
def index():
    return 'Hello, world! This is the homepage of the Superheroes app.'

@routes_blueprint.route('/superheroes', methods=['GET'])
def get_superheroes():
    """Recupera todos los documentos de superhéroes de la base de datos."""
    superheroes = mongo.db.superheroes.find()  # Obtiene todos los superhéroes de la base de datos
    return jsonify(format_superheroes(superheroes))

@routes_blueprint.route('/add_superhero', methods=['POST'])
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

@routes_blueprint.route('/superhero/update/<id>', methods=['PUT'])
def update_superhero(id):
    """Modifica un documento de superhéroe de la base de datos."""
    data = request.get_json()
    mongo.db.superheroes.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"message": f"Superhero updated {data}"})

@routes_blueprint.route('/superhero/delete/<id>', methods=['DELETE'])
def delete_superhero(id):
    """Elimina un documento de superhéroe de la base de datos."""
    try:
        mongo.db.superheroes.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "Superhero deleted"})
    except Exception as e:
        return jsonify({"message": f"Error deleting superhero: {str(e)}"}), 400

@routes_blueprint.route('/marvel', methods=['GET'])
def get_marvel_superheroes():
    """Recupera todos los superhéroes de Marvel de la base de datos."""
    superheroes = mongo.db.superheroes.find({"home": "Marvel"})
    return jsonify(format_superheroes(superheroes))

@routes_blueprint.route('/dc', methods=['GET'])
def get_dc_superheroes():
    """Recupera todos los superhéroes de DC de la base de datos."""
    superheroes = mongo.db.superheroes.find({"home": "DC"})
    return jsonify(format_superheroes(superheroes))
