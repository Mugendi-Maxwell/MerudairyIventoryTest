from flask_restful import Resource
from flask import request, jsonify
from services.assigned_employee_service import AssignedEmployeeService


class AssignedEmployeeResource(Resource):
    def get(self):
        data = AssignedEmployeeService.get_all()
        return {"assigned_employees": data}, 200

    def post(self):
        data = request.get_json()
        result, status = AssignedEmployeeService.assign(data)
        return result, status


class AssignedEmployeeDetailResource(Resource):
    def put(self, assignment_id):
        data = request.get_json()
        result, status = AssignedEmployeeService.update(assignment_id, data)
        return jsonify(result), status

    def delete(self, assignment_id):
        result, status = AssignedEmployeeService.delete(assignment_id)
        return result, status
