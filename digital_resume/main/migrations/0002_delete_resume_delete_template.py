# Generated by Django 4.0.1 on 2022-01-11 17:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Resume',
        ),
        migrations.DeleteModel(
            name='Template',
        ),
    ]
