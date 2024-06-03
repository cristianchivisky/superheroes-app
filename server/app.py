from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from pymongo import MongoClient
from flask_cors import CORS
import json
import base64
import os

app = Flask(__name__)
CORS(app)
def connect_db():
    """Función para conectar a la base de datos Mongo"""
    try:
        app.config["MONGO_URI"] = "mongodb://mongo_db:27017/superheroes"
        mongo = PyMongo(app)
        print("Conectado a Mongo")
        return mongo
    except ConnectionError as e:
        print("Error de conexión con Mongo:", e)
        return None

mongo = connect_db()

def load_data():
    """Carga los datos iniciales en la base de datos desde el archivo JSON."""
    if mongo is not None:
        collection = mongo.db.superheroes
        collection.delete_many({})
        with open('data/superheroes.json') as f:
            superheroes = json.load(f)
            
            for superhero in superheroes:
                name = superhero['name']
                image_path = os.path.join('static', f"{name}.png")
                if os.path.exists(image_path):
                    with open(image_path, 'rb') as img_file:
                        encoded_image = base64.b64encode(img_file.read()).decode('utf-8')
                        superhero['image'] = encoded_image
                else:
                    superhero['image'] = None  # Maneja el caso que no haya imagen
                collection.insert_one(superhero)
        print("Datos cargados exitosamente")
    else:
        print("Error: No se pudo conectar a la base de datos.")

def format_superheroes(superheroes):
    """Formatea los documentos de superhéroes para la respuesta JSON."""
    return [{
        '_id': str(superhero['_id']),
        'name': superhero['name'],
        'real_name': superhero['real_name'],
        'age': superhero['age'],
        'home': superhero['home'],
        'biography': superhero['biography'],
        'equipment': superhero['equipment'],
        'image': superhero['image']
    } for superhero in superheroes]

@app.route('/superheroes', methods=['GET'])
def get_superheroes():
    """Recupera todos los documentos de superhéroes de la base de datos."""
    superheroes = mongo.db.superheroes.find()#.sort(sort)
    return jsonify(format_superheroes(superheroes))


@app.route('/superhero', methods=['POST'])
def add_superhero():
    """Agrega un nuevo documento de superhéroe a la base de datos."""
    data = request.get_json()
    if not data:
        return jsonify({"message": "Missing data"}), 400
    mongo.db.superheroes.insert_one(data)
    return jsonify({"message": "Superhero added"}), 201

@app.route('/superhero/<id>', methods=['PUT'])
def update_superhero(id):
    """Actualiza un documento de superhéroe existente en la base de datos."""
    data = request.get_json()
    if not data:
        return jsonify({"message": "Missing data"}), 400
    try:
        mongo.db.superheroes.update_one({"_id": ObjectId(id)}, {"$set": data})
        return jsonify({"message": "Superhero updated"})
    except Exception as e:
        return jsonify({"message": f"Error updating superhero: {str(e)}"}), 400

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
    return jsonify({'message': f"¡Ooops! La página que buscas no está en el servidor! {error}"}), 404

if __name__ == '__main__':
    load_data()  # Carga los datos iniciales
    app.run(host='py-server', port='5000', debug=True)
