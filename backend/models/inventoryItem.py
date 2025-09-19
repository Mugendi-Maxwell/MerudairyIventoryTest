from services.extensions import db
from models.category import Category

class InventoryItem(db.Model):
    __tablename__ = 'inventory_items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    brand = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(50), nullable=False, default='available')
    serialno = db.Column(db.String(100), nullable=True, unique=True) 
    item_condition = db.Column(db.String(50), nullable=False, default='new')

    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp()
    )
    deleted_at = db.Column(db.DateTime, nullable=True)

    # relationship
    category = db.relationship('Category', backref=db.backref('inventory_items', lazy=True))

    def to_dict(self):
     return {
        'id': self.id,
        'name': self.name,
        'description': self.description,
        'brand': self.brand,
        'status': self.status,
        'serialno': self.serialno,
        'item_condition': self.item_condition,
        'created_at': self.created_at.isoformat() if self.created_at else None,
        'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        'deleted_at': self.deleted_at.isoformat() if self.deleted_at else None,
        'category_id': self.category_id, 
        'category': self.category.to_dict() if self.category else None
    }

