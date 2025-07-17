from models.department import Department
from services.extensions import db
from datetime import datetime

class DepartmentService:

    @staticmethod
    def get_all_departments():
        departments = Department.query.all()
        return [dept.to_dict() for dept in departments]

    @staticmethod
    def create_department(data):
        if Department.query.filter_by(name=data['name']).first():
            return {"message": "Department name already exists"}, 400

        new_dept = Department(
            name=data['name'],
            created_by=data['created_by']
        )
        db.session.add(new_dept)
        db.session.commit()
        return new_dept.to_dict(), 201

    @staticmethod
    def update_department(dept_id, data):
        dept = Department.query.get(dept_id)
        if not dept:
            return {"message": "Department not found"}, 404

        
        dept.name = data.get('name', dept.name)
        dept.updated_at = datetime.utcnow()

        db.session.commit()
        return dept.to_dict(), 200
