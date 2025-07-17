from flask_restful import Resource
from flask import request, jsonify
from services.employee_services import EmployeeService


class EmployeeResource(Resource):
    def get(self):
        employees = EmployeeService.get_all_employees()
        return {"employees": employees}, 200

    def post(self):
        data = request.get_json()
        result, status = EmployeeService.create_employee(data)
        return jsonify(result), status


class EmployeeDetailResource(Resource):
    def put(self, emp_id):
        data = request.get_json()
        result, status = EmployeeService.update_employee(emp_id, data)
        return jsonify(result), status
