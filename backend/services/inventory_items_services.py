from models.inventoryItem import InventoryItem
from services.extensions import db
from datetime import datetime

class InventoryService:

    @staticmethod
    def get_all_items():
        items = InventoryItem.query.filter_by(deleted_at=None).all()
        return [item.to_dict() for item in items]

    @staticmethod
    def create_item(data):
        item = InventoryItem(
            name=data['name'],
            category_id=data['category_id'],
            description=data.get('description'),
            brand=data.get('brand'),
            status=data.get('status', 'available'),
            serialno=data.get('serialno'),
            item_condition=data.get('item_condition', 'new')
        )
        db.session.add(item)
        db.session.commit()
        return item.to_dict(), 201

    @staticmethod
    def update_item(item_id, data):
        item = InventoryItem.query.get(item_id)
        if not item or item.deleted_at:
            return {"message": "Item not found"}, 404

        item.name = data.get('name', item.name)
        item.category_id = data.get('category_id', item.category_id)
        item.description = data.get('description', item.description)
        item.brand = data.get('brand', item.brand)
        item.status = data.get('status', item.status)
        item.serialno = data.get('serialno', item.serialno)
        item.item_condition = data.get('item_condition', item.item_condition)

        db.session.commit()
        return item.to_dict(), 200

    @staticmethod
    def soft_delete_item(item_id):
        item = InventoryItem.query.get(item_id)
        if not item or item.deleted_at:
            return {"message": "Item not found or already deleted"}, 404

        item.deleted_at = datetime.utcnow()
        db.session.commit()
        return {"message": "Item soft-deleted"}, 200
