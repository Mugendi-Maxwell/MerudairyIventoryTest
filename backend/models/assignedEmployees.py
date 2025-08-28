from services.extensions import db

class AssignedEmployee(db.Model):
    __tablename__ = 'assigned_employees'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    inventory_item_id = db.Column(db.Integer, db.ForeignKey('inventory_items.id'), nullable=False)
    inventory_item_name = db.Column(db.String(255), nullable=False)
    assigned_date = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)  # ✅ NEW FIELD

    employee = db.relationship("Employees", backref="assignments")
    inventory_item = db.relationship("InventoryItem", backref="assignments")
    location = db.relationship("Location", backref="assignments")  # ✅ RELATIONSHIP

    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'inventory_item_id': self.inventory_item_id,
            'assigned_date': self.assigned_date.isoformat(),
            'employee': self.employee.to_dict() if self.employee else None,
            'inventory_item': self.inventory_item.to_dict() if self.inventory_item else None,
            'location': self.location.to_dict() if self.location else None  # ✅ INCLUDE LOCATION
        }
