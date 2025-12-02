#!/bin/bash

# 1. ตั้งค่าตัวแปร
BACKUP_DIR="/root/savvy/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="savvy_backup_$TIMESTAMP.sql"
CONTAINER_NAME="savvy_db"  # ชื่อ Container Database ของเรา
DB_USER="postgres"
DB_NAME="savvy_db"

# 2. เริ่มการ Backup
echo "Starting backup: $FILENAME"
cd /root/savvy

# สั่ง pg_dump จากใน Container ออกมาข้างนอก
# -T คือปิด TTY เพื่อให้รันผ่าน Cron ได้
docker compose exec -T db pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/$FILENAME

# 3. ตรวจสอบว่าไฟล์ถูกสร้างจริงไหม
if [ -f "$BACKUP_DIR/$FILENAME" ]; then
    echo "✅ Backup successful: $FILENAME"
    
    # 4. ลบไฟล์ที่เก่าเกิน 7 วันทิ้ง (กัน Server เต็ม)
    find $BACKUP_DIR -type f -name "*.sql" -mtime +7 -delete
else
    echo "❌ Backup failed!"
fi
