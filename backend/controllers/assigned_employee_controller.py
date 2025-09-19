from flask_restful import Resource
from flask import request
from services.assigned_employee_service import AssignedEmployeeService


class AssignedEmployeeResource(Resource):
    def get(self):
        
        data = AssignedEmployeeService.get_all()
        return {"assigned_employees": [item.to_dict() for item in data]}, 200

    def post(self):
     data = request.get_json()
     try:
        new_assigned = AssignedEmployeeService.create(data)
        return new_assigned.to_dict(), 201
     except ValueError as e:
        return {"message": str(e)}, 400



class AssignedEmployeeDetailResource(Resource):
    def get(self, assignment_id):
        
        assigned = AssignedEmployeeService.get_by_id(assignment_id)
        if not assigned:
            return {"message": "Assigned employee not found"}, 404
        return assigned.to_dict(), 200

    def put(self, assignment_id):
        
        data = request.get_json()
        updated = AssignedEmployeeService.update(assignment_id, data)
        if not updated:
            return {"message": "Assigned employee not found"}, 404
        return updated.to_dict(), 200

    def delete(self, assignment_id):
        
        deleted = AssignedEmployeeService.delete(assignment_id)
        if not deleted:
            return {"message": "Assigned employee not found"}, 404
        return {"message": "Assignment deleted successfully"}, 200
