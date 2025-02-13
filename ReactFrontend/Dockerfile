# ---- Stage 1: Build ----
    FROM node:18 AS build

    WORKDIR /app
    
    # คัดลอกไฟล์ที่จำเป็นต่อการติดตั้ง dependencies
    COPY package.json package-lock.json ./
    
    # ติดตั้ง dependencies
    RUN npm install
    
    # คัดลอกโค้ดทั้งหมด
    COPY . .
    
    # รันคำสั่ง build ของ Vite
    RUN npm run build
    
    # ---- Stage 2: Production (Serve) ----
    FROM nginx:alpine
    
    # คัดลอกไฟล์ในโฟลเดอร์ dist (ที่ได้จากการ build)
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # เปิด port 80
    EXPOSE 80
    
    # คำสั่งเริ่มต้น
    CMD ["nginx", "-g", "daemon off;"]