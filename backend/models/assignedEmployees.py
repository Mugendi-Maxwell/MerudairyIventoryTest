from services.extensions import db

class AssignedEmployee(db.Model):
    __tablename__ = 'assigned_employees'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    inventory_item_id = db.Column(db.Integer, db.ForeignKey('inventory_items.id'), nullable=False)
    assigned_date = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    # FIXED relationships
    employee = db.relationship("Employees", backref="assignments")
    inventory_item = db.relationship("InventoryItem", backref="assignments")

    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'inventory_item_id': self.inventory_item_id,
            'assigned_date': self.assigned_date.isoformat(),
            'employee': self.employee.to_dict() if self.employee else None,
            'inventory_item': self.inventory_item.to_dict() if self.inventory_item else None
        }
