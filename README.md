# Sistem Manajemen Kursus Online

Di era digital yang terus berkembang, permintaan akan sistem pembelajaran secara daring semakin krusial. Pendidikan kini tidak lagi terikat pada kelas fisik, tetapi dapat diakses kapan pun dan di mana pun. Untuk mendukung perubahan dalam pendidikan ini, diperlukan platform yang dapat mempermudah proses belajar dan mengajar secara efisien dan teratur.

Sistem Pengelolaan Kursus Online adalah tugas akhir dari pelajaran Sistem Basis Data yang bertujuan untuk merancang serta menciptakan aplikasi pembelajaran online yang menarik dan mudah digunakan. Sistem ini memberikan kesempatan kepada dua kategori pengguna utama Pengajar dan Siswa untuk terlibat secara aktif dalam proses pendidikan secara digital.

# 💻 Tech Stack:

![Neon](https://img.shields.io/badge/database-Neon-00E599?style=for-the-badge&logo=neon&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23232F3E.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![JWT](https://img.shields.io/badge/JWT-%23000000.svg?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-%236DA55F.svg?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)


# Deskripsi Proyek
Platform ini adalah aplikasi berbasis web (yang juga dapat diadaptasi untuk versi mobile) yang menawarkan fitur-fitur utama untuk mendukung kegiatan belajar secara online.

Terdapat dua kategori akun pengguna, yaitu:

# Instruktur
Instruktur memiliki hak untuk:
- Mengatur dan mendesain kursus
- Mengupload materi edukasi (dalam format video, PDF, atau PPT)
- Mengubah atau menghapus kursus yang telah dibuat
- Melihat statistik keterlibatan dan perkembangan siswa

# Pelajar
Pelajar memiliki hak untuk:
- Mendaftar dan mengikuti kursus yang ada
- Mengakses materi pembelajaran
- Melihat kemajuan belajar pribadi
- Melakukan penilaian dan menerima sertifikat setelah menyelesaikan kursus

Setelah melakukan login, tampilan antarmuka pengguna (UI) akan disesuaikan sesuai dengan tipe akun (siswa/instruktur), termasuk menu navigasi dan akses fitur.




# :bar_chart: Diagram
UML
![Image](https://github.com/user-attachments/assets/11919396-14b5-4794-a587-bee88ad28371)

ERD
![Image](https://github.com/user-attachments/assets/a7986ac7-47e7-49a9-a62d-e0b68f1d2b96)

# :computer: Installation Guide

Clone this repository

```
git clone https://github.com/FauzanHandoyo/E-Learning.git
```

## Frontend

- Ensure You’re on the right folder

  ![frontend](https://github.com/user-attachments/assets/60f521c6-2ca8-4fb7-ab1a-5d915fb6c46f)

  ```
  git clone https://github.com/FauzanHandoyo/E-Learning.git
  ```

- Run npm install to install all dependencies
  ```
   npm install
  ```
- To test the installation result run
  ```
  npm run dev
  ```
   ![Runfrontend](https://github.com/user-attachments/assets/6605a904-1108-4ac7-a008-73986f9696b2)

## Backend

- Ensure You’re on the right folder

  ![Backend](https://github.com/user-attachments/assets/3f33eacf-2b99-445c-aa10-54c0d52f21a5)

- Run npm install to install all dependencies
  ```
   npm install
  ```
- Create an .env file in your project root folder and add your variables.

  ![env](https://github.com/user-attachments/assets/2cf6eaff-6ddc-423d-b24f-2b3f715e3576)

- .env
  ```
   PORT=5000
   DATABASE_URL=postgresql://neondb_owner:npg_bVMdfEPKW48r@ep-silent-credit-a1debaaj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   DATABASE_SSL=false
   FRONTEND_URL=http://localhost:5173/
   JWT_SECRET=backend

  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  ```

- Insert Database Variables

- To test the installation result run
  ```
   npm run start
  ```
# 💻 Progress Report:
-





