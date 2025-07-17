from services.extensions import db
from datetime import datetime

class Returns(db.Model):
    __tablename__ = 'returns'

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, nullable=False)
    location_id = db.Column(db.Integer, nullable=False)
    return_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    quantity = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'location_id': self.location_id,
            'return_date': self.return_date.isoformat(),
            'quantity': self.quantity
        }
