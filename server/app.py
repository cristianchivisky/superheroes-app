from flask import Flask
from flask_cors import CORS
from db import mongo, load_data
from routes import routes_blueprint

app = Flask(__name__)
CORS(app)  # Habilita CORS para peticiones de otras fuentes

app.register_blueprint(routes_blueprint)

if __name__ == '__main__':
    load_data()  # Carga los datos iniciales
    app.run(host='py-server', port=5000, debug=True)
