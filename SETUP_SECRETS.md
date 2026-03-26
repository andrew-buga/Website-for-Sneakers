# 📋 GitHub Secrets Setup - ИНСТРУКЦІЯ

Для добавлення секретів на GitHub, виконай ці кроки:

## КРОК 1️⃣ — Отримай значення з .env.local

Відкрий свій файл `.env.local` і знайди ці три значення:

```
DATABASE_URL = [СКОПІЮЙ ПОЛНИЙ РЯДОК]
NEXTAUTH_SECRET = [СКОПІЮЙ ЗНАЧЕННЯ]
JWT_SECRET = [СКОПІЮЙ ЗНАЧЕННЯ]
```

## КРОК 2️⃣ — Коригуй скрипт add-secrets.ps1

Відкрий файл `add-secrets.ps1`:

**Знайди на рядках 3-5:**
```powershell
$DATABASE_URL = "postgresql://user:password@localhost:5432/database"  # ← ЗАМІСТЬ ЦЬОГО
$NEXTAUTH_SECRET = "your-nextauth-secret-here"  # ← ZAMIST CYOGO
$JWT_SECRET = "your-jwt-secret-here"  # ← ZAMIST CYOGO
```

**Замініть на твої реальні значення:**
```powershell
$DATABASE_URL = "твоє DATABASE_URL зі значенням"
$NEXTAUTH_SECRET = "твоє NEXTAUTH_SECRET зі значенням"
$JWT_SECRET = "твоє JWT_SECRET зі значенням"
```

## КРОК 3️⃣ — Запусти скрипт

```powershell
cd c:\Users\lenovo\Downloads\responsive-react-website
.\add-secrets.ps1
```

Якщо виникне помилка про виконання скриптів, запусти:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\add-secrets.ps1
```

## КРОК 4️⃣ — Перевір результат

Після успішного виконання скрипту, перейди на:
```
https://github.com/andrew-buga/Website-for-Sneakers/settings/secrets/actions
```

Там повинно бути 6 секретів:
- ✅ NEXT_PUBLIC_API_BASE_URL
- ✅ NEXT_PUBLIC_APP_URL
- ✅ NEXT_PUBLIC_SITE_URL
- ✅ DATABASE_URL
- ✅ NEXTAUTH_SECRET
- ✅ JWT_SECRET

## КРОК 5️⃣ — Push на GitHub

```bash
git push origin main
```

## КРОК 6️⃣ — Перевір workflow

Перейди на: https://github.com/andrew-buga/Website-for-Sneakers/actions

Workflow повинен запуститися і завершитися успішно ✅

---

**⚠️ ВАЖЛИВО:** 
- Значення з .env.local містять приватні ключі
- Вони будуть зашифровані на GitHub
- Не розповсюджуй їх публічно
