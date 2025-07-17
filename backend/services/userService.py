from models.user import User
from services.extensions import db
import bcrypt
from flask_jwt_extended import create_access_token


class UserService:
    
    @staticmethod
    def create_user(name, email, password):
        if User.query.filter_by(email=email).first():
            return {"error": "Email already exists"}, 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        new_user = User(name=name, email=email, password=hashed_password.decode('utf-8'))
        db.session.add(new_user)
        db.session.commit()

        access_token = create_access_token(identity=new_user.id)
        return {
            "message": "User created successfully",
            "access_token": access_token,
            "username": name
        }, 201

    @staticmethod
    def authenticate_user(email, password):
        user = User.query.filter_by(email=email).first()

        if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            return {"message": "Invalid email or password"}, 401

        access_token = create_access_token(identity=user.id)
        return {
            "message": "Login successful",
            "access_token": access_token
        }, 200
