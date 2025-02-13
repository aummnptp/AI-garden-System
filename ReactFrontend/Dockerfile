# ---- Base Image ----
    FROM node:18 AS base

    WORKDIR /app
    
    # คัดลอก package.json และ package-lock.json เพื่อติดตั้ง dependencies
    COPY package.json package-lock.json ./
    
    # ติดตั้ง dependencies
    RUN npm install
    
    # คัดลอกโค้ดทั้งหมด
    COPY . .
    
    # เปิดพอร์ตที่ใช้ใน Vite (ปกติคือ 5173)
    EXPOSE 5173
    
    # รันแบบ Development Mode
    CMD ["npm", "run", "dev", "--", "--host"]
    