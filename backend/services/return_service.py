from models.returns import Returns
from models.inventoryItem import InventoryItem  
from models.assignedEmployees import AssignedEmployee as Assignment  
from services.extensions import db

class ReturnService:

    @staticmethod
    def get_all():
        return [r.to_dict() for r in Returns.query.all()]

    @staticmethod
    def create(data):
        try:
            return_entry = Returns(
                employee_id=data['employee_id'],
                location_id=data['location_id'],
                inventory_id=data['inventory_id'],
                return_date=data.get('return_date'),
            )
            db.session.add(return_entry)

            #  Mark inventory as Available again
            inventory_item = InventoryItem.query.get(data['inventory_id'])
            if inventory_item:
                inventory_item.status = ("available")
                db.session.add

            #  Remove related assignment so item no longer shows as issued
            assignment = Assignment.query.filter_by(
                employee_id=data['employee_id'],
                inventory_item_id=data['inventory_id'],
                location_id=data['location_id']
            ).first()

            if assignment:
                db.session.delete(assignment)

            db.session.commit()
            return return_entry.to_dict(), 201

        except KeyError as e:
            return {"message": f"Missing field: {str(e)}"}, 400
        except Exception as e:
            db.session.rollback()
            return {"message": f"Error creating return: {str(e)}"}, 500

    @staticmethod
    def update(return_id, data):
        return_entry = Returns.query.get(return_id)
        if not return_entry:
            return {"message": "Return not found"}, 404

        old_inventory_id = return_entry.inventory_id

        # Update fields
        return_entry.employee_id = data.get('employee_id', return_entry.employee_id)
        return_entry.location_id = data.get('location_id', return_entry.location_id)
        return_entry.inventory_id = data.get('inventory_id', return_entry.inventory_id)
        return_entry.return_date = data.get('return_date', return_entry.return_date)

        # ✅ If inventory_id changed, update availability
        if 'inventory_id' in data and data['inventory_id'] != old_inventory_id:
            old_item = InventoryItem.query.get(old_inventory_id)
            if old_item:
                old_item.is_available = False  # revert old one

            new_item = InventoryItem.query.get(data['inventory_id'])
            if new_item:
                new_item.is_available = True

        try:
            db.session.commit()
            return return_entry.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Error updating return: {str(e)}"}, 500

    @staticmethod
    def delete(return_id):
        return_entry = Returns.query.get(return_id)
        if not return_entry:
            return {"message": "Return not found"}, 404

        try:
            db.session.delete(return_entry)
            db.session.commit()
            return {"message": "Return deleted"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Error deleting return: {str(e)}"}, 500
