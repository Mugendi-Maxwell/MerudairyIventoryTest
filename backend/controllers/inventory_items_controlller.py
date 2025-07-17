from flask_restful import Resource
from flask import request, jsonify
from services.inventory_items_services import InventoryService

class InventoryItemResource(Resource):
    def get(self):
        items = InventoryService.get_all_items()
        return {"inventory_items": items}, 200

    def post(self):
        data = request.get_json()
        required = ['name', 'category_id']
        if not data or any(field not in data for field in required):
            return {"message": "name and category_id are required"}, 400

        result, status = InventoryService.create_item(data)
        return result, status


class InventoryItemDetailResource(Resource):
    def put(self, item_id):
        data = request.get_json()
        if not data:
            return {"message": "No data provided"}, 400

        result, status = InventoryService.update_item(item_id, data)
        return result, status

    def delete(self, item_id):
        result, status = InventoryService.soft_delete_item(item_id)
        return result, status
