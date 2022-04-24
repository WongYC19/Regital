# Generated by Django 4.0.1 on 2022-01-18 14:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('resume', '0007_rename_public_url_publicresume_public_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='publicresume',
            name='id',
        ),
        migrations.AlterField(
            model_name='publicresume',
            name='resume_id',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='resume.resume'),
        ),
    ]