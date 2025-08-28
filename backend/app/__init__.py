from flask import Flask
from services.extensions import db, cors
from flask_jwt_extended import JWTManager
from .config import config_by_name
from routes import register_routes  

jwt = JWTManager()  

def create_app(config_name="development"):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    db.init_app(app)
    jwt.init_app(app) 
    cors.init_app(app)  
    register_routes(app)

    return app
