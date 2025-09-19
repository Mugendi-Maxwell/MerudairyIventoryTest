from models.assignedEmployees import AssignedEmployee
from models.inventoryItem import InventoryItem
from services.extensions import db


class AssignedEmployeeService:
    @staticmethod
    def get_all():
        return AssignedEmployee.query.all()

    @staticmethod
    def get_by_id(assigned_id):
        return AssignedEmployee.query.get(assigned_id)

    @staticmethod
    def create(data):
        # Get the inventory item
        inventory_item = InventoryItem.query.get(data.get("inventory_item_id"))
        if not inventory_item:
            raise ValueError("Inventory item not found")

        # Prevent assigning if already issued
        if inventory_item.status == "issued":
            raise ValueError("This inventory item is already issued")
        
        # Create the assignment
        new_assigned = AssignedEmployee(
            employee_id=data.get("employee_id"),
            inventory_item_id=data.get("inventory_item_id"),
            
            location_id=data.get("location_id"),
        )

        # Mark inventory as issued
        inventory_item.status = "issued"

        db.session.add(new_assigned)
        db.session.commit()
        return new_assigned

    @staticmethod
    def update(assigned_id, data):
        assigned = AssignedEmployee.query.get(assigned_id)
        if not assigned:
            return None

        # Update assignment fields
        assigned.employee_id = data.get("employee_id", assigned.employee_id)
        assigned.inventory_item_id = data.get("inventory_item_id", assigned.inventory_item_id)
        assigned.location_id = data.get("location_id", assigned.location_id)

        db.session.commit()
        return assigned

    @staticmethod
    def delete(assigned_id):
        assigned = AssignedEmployee.query.get(assigned_id)
        if not assigned:
            return None

        # Free up inventory when assignment is deleted
        inventory_item = InventoryItem.query.get(assigned.inventory_item_id)
        if inventory_item:
            inventory_item.status = "available"

        db.session.delete(assigned)
        db.session.commit()
        return assigned
