"""Add location_id to AssignedEmployee

Revision ID: b5a9450de9b1
Revises: c951d749282a
Create Date: 2025-08-05 09:30:51.878973

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b5a9450de9b1'
down_revision: Union[str, None] = 'c951d749282a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    with op.batch_alter_table('assigned_employees', schema=None) as batch_op:
        batch_op.add_column(sa.Column('location_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key(
            'fk_assigned_employees_location', 
            'locations',                       
            ['location_id'],                   
            ['id']                            
        )


def downgrade():
    with op.batch_alter_table('assigned_employees', schema=None) as batch_op:
        batch_op.drop_constraint('fk_assigned_employees_location', type_='foreignkey')
        batch_op.drop_column('location_id')