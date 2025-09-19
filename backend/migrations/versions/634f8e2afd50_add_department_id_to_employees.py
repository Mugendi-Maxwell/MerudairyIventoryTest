"""Add department_id to employees

Revision ID: 634f8e2afd50
Revises: 715900ce77f9
Create Date: 2025-09-12 13:40:05.714153
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '634f8e2afd50'
down_revision: Union[str, None] = '715900ce77f9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Assigned Employees table (only if column exists!)
    # with op.batch_alter_table('assigned_employees', schema=None) as batch_op:
    #     batch_op.drop_column('inventory_item_name')

    # Employees table
    with op.batch_alter_table('employees', schema=None) as batch_op:
        batch_op.add_column(sa.Column('department_id', sa.Integer(), nullable=False, server_default='1'))
        batch_op.create_foreign_key('fk_employees_departments', 'departments', ['department_id'], ['id'])
        batch_op.drop_column('department')

    # Returns table
    with op.batch_alter_table('returns', schema=None) as batch_op:
        batch_op.create_foreign_key('fk_returns_inventory', 'inventory_items', ['inventory_id'], ['id'])
        batch_op.create_foreign_key('fk_returns_employees', 'employees', ['employee_id'], ['id'])
        batch_op.create_foreign_key('fk_returns_locations', 'locations', ['location_id'], ['id'])


def downgrade() -> None:
    # Returns table
    with op.batch_alter_table('returns', schema=None) as batch_op:
        batch_op.drop_constraint('fk_returns_inventory', type_='foreignkey')
        batch_op.drop_constraint('fk_returns_employees', type_='foreignkey')
        batch_op.drop_constraint('fk_returns_locations', type_='foreignkey')

    # Employees table
    with op.batch_alter_table('employees', schema=None) as batch_op:
        batch_op.drop_constraint('fk_employees_departments', type_='foreignkey')
        batch_op.drop_column('department_id')
        batch_op.add_column(sa.Column('department', sa.VARCHAR(length=80), nullable=False))

    # Assigned Employees table (only if you had dropped it earlier)
    # with op.batch_alter_table('assigned_employees', schema=None) as batch_op:
    #     batch_op.add_column(sa.Column('inventory_item_name', sa.VARCHAR(length=255), nullable=False))
