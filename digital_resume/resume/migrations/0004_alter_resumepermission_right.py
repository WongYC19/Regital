# Generated by Django 4.0.1 on 2022-01-15 06:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resume', '0003_remove_resume_allowed_users_alter_resume_content'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resumepermission',
            name='right',
            field=models.SmallIntegerField(choices=[(0, 'Null'), (1, 'Write'), (2, 'Full')], db_index=True, default=0),
        ),
    ]
