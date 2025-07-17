from flask_restful import Resource
from flask import request, jsonify
from services.userService import UserService


class UserSignupResource(Resource):
    def post(self):
        data = request.get_json()
        if not data:
            return jsonify({"message": "No input data provided"}), 400

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return jsonify({"message": "Name, email, and password are required"}), 400

        result, status = UserService.create_user(name, email, password)
        return result, status


class UserLoginResource(Resource):
    def post(self):
        data = request.get_json()
        if not data:
            return {"message": "No input data provided"}, 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return {"message": "Email and password are required"}, 400

        result, status = UserService.authenticate_user(email, password)
        return result, status
