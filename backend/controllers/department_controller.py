from flask_restful import Resource
from flask import request, jsonify
from services.department_service import DepartmentService


class DepartmentResource(Resource):
    def get(self):
        departments = DepartmentService.get_all_departments()
        return {"departments": departments}, 200

    def post(self):
        data = request.get_json()
        if not data or not data.get("name") or not data.get("created_by"):
            return {"message": "name and created_by are required"}, 400

        result, status = DepartmentService.create_department(data)
        return result, status


class DepartmentDetailResource(Resource):
    def put(self, dept_id):
        data = request.get_json()
        if not data:
            return {"message": "No input data provided"}, 400

        result, status = DepartmentService.update_department(dept_id, data)
        return result, status
