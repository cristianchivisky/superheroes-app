from flask_pymongo import PyMongo
import json
import base64
import os
from flask import Flask

app = Flask(__name__)
def connect_db():
    """Función para conectar a la base de datos Mongo.
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

mongo = connect_db()

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
