from controllers.user_auth_controller import UserSignupResource, UserLoginResource
from controllers.locationController import LocationResource 
from controllers.returnsController import ReturnResource, ReturnDetailResource
from controllers.department_controller import DepartmentResource, DepartmentDetailResource
from controllers.assigned_employee_controller import AssignedEmployeeResource, AssignedEmployeeDetailResource
from controllers.employee_controller import EmployeeResource, EmployeeDetailResource
from controllers.inventory_items_controlller import InventoryItemResource, InventoryItemDetailResource


def register_routes(app):
    from flask_restful import Api
    api = Api(app)

    api.add_resource(AssignedEmployeeResource, '/assignments')
    api.add_resource(AssignedEmployeeDetailResource, '/assignments/<int:assignment_id>')
    api.add_resource(DepartmentResource, '/departments')
    api.add_resource(DepartmentDetailResource, '/departments/<int:dept_id>')
    api.add_resource(UserSignupResource, '/auth/signup')
    api.add_resource(UserLoginResource, '/auth/login')
    api.add_resource(LocationResource, '/locations')
    api.add_resource(ReturnResource, '/returns')
    api.add_resource(ReturnDetailResource, '/returns/<int:return_id>')
    api.add_resource(EmployeeResource, '/employees')
    api.add_resource(EmployeeDetailResource, '/employees/<int:emp_id>')
    api.add_resource(InventoryItemResource, '/inventory-items')
    api.add_resource(InventoryItemDetailResource, '/inventory-items/<int:item_id>')