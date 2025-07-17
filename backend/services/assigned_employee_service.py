from models.assignedEmployees import AssignedEmployee
from services.extensions import db
from datetime import datetime


class AssignedEmployeeService:

    @staticmethod
    def get_all():
        return [ae.to_dict() for ae in AssignedEmployee.query.all()]

    @staticmethod
    def assign(data):
        try:
            ae = AssignedEmployee(
                employee_id=data["employee_id"],
                inventory_item_id=data["inventory_item_id"],
                assigned_date=data.get("assigned_date", datetime.utcnow())
            )
            db.session.add(ae)
            db.session.commit()
            return ae.to_dict(), 201
        except KeyError as e:
            return {"message": f"Missing field: {str(e)}"}, 400

    @staticmethod
    def update(assignment_id, data):
        ae = AssignedEmployee.query.get(assignment_id)
        if not ae:
            return {"message": "Assignment not found"}, 404

        ae.employee_id = data.get("employee_id", ae.employee_id)
        ae.inventory_item_id = data.get("inventory_item_id", ae.inventory_item_id)
        ae.assigned_date = data.get("assigned_date", ae.assigned_date)

        db.session.commit()
        return ae.to_dict(), 200

    @staticmethod
    def delete(assignment_id):
        ae = AssignedEmployee.query.get(assignment_id)
        if not ae:
            return {"message": "Assignment not found"}, 404

        db.session.delete(ae)
        db.session.commit()
        return {"message": "Assignment deleted"}, 200
