from services.extensions import db
from datetime import datetime

class Returns(db.Model):
    __tablename__ = 'returns'

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)
    inventory_id = db.Column(db.Integer, db.ForeignKey('inventory_items.id'), nullable=False)
    return_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    employee = db.relationship("Employees", backref="returns")
    location = db.relationship("Location", backref="returns")
    inventory_item = db.relationship("InventoryItem", backref="returns")

    def to_dict(self):
        return {
            'id': self.id,
            'return_date': self.return_date.isoformat() if self.return_date else None,
            'employee': self.employee.to_dict() if self.employee else None,
            'location': self.location.to_dict() if self.location else None,
            'inventory_item': self.inventory_item.to_dict() if self.inventory_item else None
        }
