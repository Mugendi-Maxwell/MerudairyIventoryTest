from services.extensions import db

class Location(db.Model):
    __tablename__ = 'locations'
    
    id = db.Column(db.Integer, primary_key=True)
    county = db.Column(db.String(100), nullable=False)
    office = db.Column(db.String(100), nullable=False)
    created_by = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    deleted_at = db.Column(db.DateTime, nullable=True, default=db.func.current_timestamp())
    
    def to_dict(self):
        return {
            'id': self.id,
            'county': self.county,
            'office': self.office,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat(),
            'deleted_at': self.deleted_at.isoformat() if self.deleted_at else None
        }