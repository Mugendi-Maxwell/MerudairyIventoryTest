"""Add inventory_item_name and status logic

Revision ID: c951d749282a
Revises: ad67bbf7808b
Create Date: 2025-07-30 13:41:45.341645
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'c951d749282a'
down_revision: Union[str, None] = 'ad67bbf7808b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # SQLite-safe way to drop 'user_id' column and its FK
    with op.batch_alter_table('employees') as batch_op:
        batch_op.drop_column('user_id')


def downgrade() -> None:
    # Add column and foreign key back
    with op.batch_alter_table('employees') as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key(
            'fk_employees_user_id_users',  # use a name
            'users',
            ['user_id'],
            ['id']
        )
