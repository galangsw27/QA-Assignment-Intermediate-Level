# DemoBlaze Automation Framework

Framework automation testing untuk website [demoblaze.com](https://www.demoblaze.com) menggunakan Playwright dengan TypeScript dan Page Object Model (POM).

## 🚀 Instalasi

### Prerequisites

- [Node.js](https://nodejs.org/) version 18 atau lebih baru

### Langkah Instalasi

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Install Playwright browsers**

   ```bash
   npx playwright install chromium
   ```

3. **Setup environment variables**

   Copy file `.env.example` ke `.env` dan sesuaikan:

   ```bash
   cp .env.example .env
   ```

   Edit file `.env` dengan data test Anda:

   ```env
   TEST_USERNAME=your_username
   TEST_PASSWORD=your_password
   ORDER_NAME=Your Name
   ORDER_COUNTRY=Your Country
   ORDER_CITY=Your City
   ORDER_CARD=1234567890123456
   ORDER_MONTH=01
   ORDER_YEAR=2025
   ```

## 🧪 Menjalankan Tes

| Command | Deskripsi |
|---------|-----------|
| `npm run test` | Run semua tests |
| `npm run test:headed` | Run dengan browser visible |
| `npm run test:ui` | Run dengan Playwright UI mode (debugging) |
| `npm run test:debug` | Run dengan debug mode |
| `npm run report` | Tampilkan HTML report |

### Contoh:

```bash
# Run test
npm run test

# Lihat hasil report
npm run report
```

## 💡 Alasan Pemilihan Teknologi

### 1. Playwright

- **Auto-wait**: Otomatis menunggu elemen siap sebelum aksi, mengurangi flaky tests
- **Cross-browser**: Support Chromium, Firefox, dan WebKit dalam satu API
- **Built-in Assertions**: `expect` API dengan auto-retry
- **Parallel Execution**: Eksekusi tes paralel out-of-the-box
- **Debugging Tools**: UI mode, trace viewer, dan codegen
- **HTML Reporter**: Built-in reporter dengan screenshot dan video on failure

### 2. TypeScript

- **Type Safety**: Catch errors di compile-time, bukan runtime
- **IDE Support**: Better autocomplete, refactoring, dan navigation
- **Maintainability**: Lebih mudah maintain codebase besar

### 3. Page Object Model (POM)

- **Separation of Concerns**: Pisahkan test logic dari page structure
- **Reusability**: Page objects dapat digunakan di multiple tests
- **Maintainability**: Perubahan UI hanya perlu diubah di satu tempat

### 4. dotenv

- **Security**: Credentials tidak di-hardcode dalam code
- **Flexibility**: Mudah switch antara environments
- **Git Safety**: `.env` file tidak di-commit ke repository

---

**Created with ❤️ using Playwright + TypeScript**
