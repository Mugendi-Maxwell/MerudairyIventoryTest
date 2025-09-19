from services.extensions import db
from datetime import datetime

class Location(db.Model):
    __tablename__ = 'locations'

    id = db.Column(db.Integer, primary_key=True)
    county = db.Column(db.String(100), nullable=False)
    office = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow, nullable=True)
    deleted_at = db.Column(db.DateTime, nullable=True) 

    created_by_user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    created_by_employee_id = db.Column(db.Integer, db.ForeignKey("employees.id"), nullable=True)

    # relationships
    created_by_user = db.relationship("User", backref="locations")
    created_by_employee = db.relationship("Employees", backref="locations")  

    def to_dict(self):
     return {
        "id": self.id,
        "county": self.county,
        "office": self.office,
        "created_by": (
            self.created_by_user.name
            if self.created_by_user
            else (self.created_by_employee.name if self.created_by_employee else None)
        )
        
    }

