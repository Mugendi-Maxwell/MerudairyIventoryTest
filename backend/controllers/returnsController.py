from flask_restful import Resource
from flask import request, jsonify
from services.return_service import ReturnService


class ReturnResource(Resource):
    def get(self):
        returns = ReturnService.get_all()
        return {"returns": returns}

    def post(self):
        data = request.get_json()
        result, status = ReturnService.create(data)
        return result, status


class ReturnDetailResource(Resource):
    def put(self, return_id):
        data = request.get_json()
        result, status = ReturnService.update(return_id, data)
        return result, status

    def delete(self, return_id):
        result, status = ReturnService.delete(return_id)
        return result, status
