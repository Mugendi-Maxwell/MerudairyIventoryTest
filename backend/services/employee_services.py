from models.employees import Employees
from services.extensions import db


class EmployeeService:

    @staticmethod
    def get_all_employees():
        employees = Employees.query.all()
        return [emp.to_dict() for emp in employees]

    @staticmethod
    def create_employee(data):
        required_fields = ['name', 'email', 'phone', 'department']
        missing = [f for f in required_fields if not data.get(f)]
        if missing:
            return {"message": f"Missing fields: {', '.join(missing)}"}, 400

        if Employees.query.filter_by(email=data['email']).first():
            return {"message": "Email already exists"}, 400

        employee = Employees(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            department_id=data['department']
        )
        db.session.add(employee)
        db.session.commit()
        return employee.to_dict(), 201

    @staticmethod
    def update_employee(emp_id, data):
        employee = Employees.query.get(emp_id)
        if not employee:
            return {"message": "Employee not found"}, 404

        employee.name = data.get('name', employee.name)
        employee.email = data.get('email', employee.email)
        employee.phone = data.get('phone', employee.phone)
        employee.department = data.get('department', employee.department)

        db.session.commit()
        return employee.to_dict(), 200
