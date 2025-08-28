"""your message here

Revision ID: ad67bbf7808b
Revises: b1f8f44e6f0b
Create Date: 2025-07-30 12:50:21.730986

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ad67bbf7808b'
down_revision: Union[str, None] = 'b1f8f44e6f0b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('assigned_employees') as batch_op:
        batch_op.add_column(sa.Column('inventory_item_name', sa.String(length=255), nullable=False))

    with op.batch_alter_table('employees') as batch_op:
        batch_op.alter_column('user_id',
                              existing_type=sa.INTEGER(),
                              nullable=True)
       

def downgrade() -> None:
    with op.batch_alter_table('employees') as batch_op:
        batch_op.alter_column('user_id',
                              existing_type=sa.INTEGER(),
                              nullable=False)

    with op.batch_alter_table('assigned_employees') as batch_op:
        batch_op.drop_column('inventory_item_name')

