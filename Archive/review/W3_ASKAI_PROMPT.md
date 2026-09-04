# برومت بناء W3 عبر Ask AI

**الاستعمال:** انسخ كل ما تحت الخط إلى Ask AI في GHL. **لا تحذف قسم «الممنوعات» ولا نقاط التوقّف.**

**⚠️ قبل اللصق:** الوكيل سيتوقّف عند 3 نقاط وينتظر ردّك. هذا مقصود — لا تطلب منه «كمّل لآخره» دفعة واحدة.

---

أنت تبني workflow في هذا الحساب. اقرأ التعليمات كاملة قبل أن تبدأ، ثم نفّذ **المرحلة 0 فقط** وتوقّف.

# 🚫 ممنوعات مطلقة — لا تخالفها مهما بدا الأمر منطقياً

1. **لا تضغط `Publish` ولا تُفعّل أي workflow.** كل ما تبنيه يبقى **Draft**. هذا الحساب فيه **39,514 جهة اتصال حقيقية** وأي نشر خاطئ يرسل رسائل واتساب فعلية لأشخاص حقيقيين.
2. **لا تلمس أي workflow آخر.** خصوصاً `W2 — Project Matching` (منشور وشغّال) و`agent Reception`. اقرأ منها فقط عند الطلب الصريح أدناه.
3. **لا تحذف ولا تعدّل** أي workflow أو حقل أو فرصة أو جهة اتصال قائمة.
4. **لا تنشئ حقولاً مخصّصة جديدة.** كل الحقول المطلوبة موجودة ومعرّفاتها أدناه. إن لم تجد حقلاً — **توقّف وأبلغ**، لا تنشئه.
5. **لا ترسل أي رسالة اختبار لرقم حقيقي.**
6. عند أي التباس أو اختلاف بين ما تراه وما هو مكتوب هنا: **توقّف واسأل.** لا تجتهد.

---

# المرحلة 0 — فحص واحد، ثم توقّف ⛔

**لا تبنِ شيئاً بعد. هذا فحص فقط.**

1. أنشئ workflow جديداً فارغاً باسم `TEST — GoTo Probe` (سيُحذف لاحقاً).
2. أضف أي تريغر.
3. أضف أكشن **`Wait`** واضبطه على دقيقة واحدة.
4. أضف بعده أكشن **`If/Else`** (اسمه في الواجهة قد يكون `Condition`) بأي شرط.
5. في فرع **`None`** (فرع «لم تتحقّق أي شروط») أضف أكشن **`Go To`**.
6. **افتح قائمة أهداف الـ`Go To`.**

**ثم توقّف وأجب على هذا السؤال بالضبط:**

> **هل عقدة الـ`Wait` تظهر ضمن الأهداف القابلة للاختيار في الـ`Go To`؟ اذكر كل الخيارات المعروضة حرفياً.**

**لا تكمل إلى المرحلة 1 قبل أن آذن لك.** إجابة هذا السؤال تحدّد ما إذا كانت البنية كلها قابلة للبناء أصلاً.

---

# المرحلة 1 — مجموعة واحدة فقط، ثم توقّف ⛔

*(نفّذها فقط بعد إذني)*

أنشئ workflow جديداً:

**الاسم:** `W3 — Options Delivery & Nurture`

**التريغر:** `Opportunity Stage Changed`
- Pipeline: `Sales Pipeline`
- Stage: `Active — Nurture Running`

**الإعدادات:**
| الإعداد | القيمة |
|---|---|
| Allow Re-entry | **OFF** |
| Stop on Response | **OFF** |
| Time Window | 09:00 – 21:00 |
| Timezone | `Europe/Istanbul` |

**ثم ابنِ هذه العقد بهذا الترتيب بالضبط:**

### العقدة 0 — `Wait`
**30 دقيقة.**

### العقدة 1 — `If/Else` (حارس المرحلة)
الشرط: `Opportunity` → `Pipeline Stage` **is** `Active — Nurture Running`
- فرع **YES** → يكمل إلى العقدة 2
- فرع **NO** → **`End Workflow`**

### العقدة 2 — `Custom Webhook` (استدعاء محرّك المطابقة)
> ⚠️ **لا تخترع الرابط ولا المفتاح.** افتح `W2 — Project Matching` واقرأ عقدة الـWebhook فيها، وانسخ **نفس الرابط ونفس ترويسة `Authorization` ونفس بنية الـBody** حرفياً.
>
> إن لم تستطع قراءتها — **توقّف وأبلغني**، لا تُكمل بقيمة تخمينية.

الحقول المرسلة في الـBody:
`opportunity.id` · `budget_max` · `budget_currency` · `property_location_interest` · `property_type` · `client_goal` · `property_source`

### العقدة 3 — `Wait`
**30 ثانية.**

### العقدة 4 — `If/Else` (حارس المطابقة)
الشرط: `Opportunity` → `Match Found` **is** `Yes`
- فرع **YES** → يكمل إلى العقدة 5
- فرع **NO** → أكشن **`Go To`**
  **الهدف:** عقدة الـ`Wait` التالية في الإيقاع.
  > في هذه المجموعة الأولى لا يوجد «Wait تالٍ» بعد — **اترك هدف الـ`Go To` فارغاً مؤقتاً وأبلغني**. سنربطه في المرحلة 2.
  >
  > ❗ **مهم:** لا تجعل فرع الـNO ينهي الـworkflow. المخزون يتجدّد، فالموعد التالي قد يجد مطابقة.

### العقدة 5 — `SMS`
النص حرفياً (لا تغيّر كلمة، لا تُعد الصياغة، لا تُضف رموزاً):

```
مرحبا {{contact.first_name}} 👋
لقينالك خيار عقاري بيناسب طلبك:

🏢 {{opportunity.next_match_name}}
📍 المنطقة: {{opportunity.next_match_district}}
🏠 النوع: {{opportunity.next_match_type}}
💵 السعر يبدأ من: {{opportunity.next_match_price}} دولار

بيهمّك تفاصيل أكتر أو تحجز معاينة؟ ردّ علينا ومستشارنا بيتواصل معك مباشرة.
```

### العقدة 6 — `Update Opportunity`
| الحقل | القيمة |
|---|---|
| `Sent Project IDs` | `{{opportunity.sent_project_ids}},{{opportunity.next_match_id}}` |

**ثم توقّف وأبلغني:**
- هل بُنيت العقد السبع كلها؟
- ما الذي لم تستطع ضبطه بالضبط كما هو مكتوب؟
- هل الـworkflow ما زال **Draft**؟ (يجب أن يكون كذلك)

---

# المرحلة 2 — التكرار ⛔

*(نفّذها فقط بعد إذني وبعد أن أختبر المجموعة الأولى)*

كرّر المجموعة (العقد 1→6) **8 مرات إضافية**، وبينها عقد `Wait` بهذا الإيقاع:

| # | الانتظار قبل المجموعة | الموعد |
|---|---|---|
| 1 | Wait 30 minutes | بعد نصف ساعة |
| 2 | Wait 24 hours | اليوم 1 |
| 3 | Wait 2 days | اليوم 3 |
| 4 | Wait 2 days | اليوم 5 |
| 5 | Wait 2 days | اليوم 7 |
| 6 | Wait 7 days | اليوم 14 |
| 7 | Wait 7 days | اليوم 21 |
| 8 | Wait 7 days | اليوم 28 |
| 9 | Wait 15 days | دوري |

**ثم:**
- في **كل** مجموعة: اضبط هدف الـ`Go To` (فرع NO) على **عقدة الـ`Wait` التالية**.
- في المجموعة **9**: هدف الـ`Go To` هو `Wait 15 days` نفسها.
- بعد المجموعة **9**: أضف `Go To` أخيراً هدفه `Wait 15 days` — **حلقة دائمة**.

**الإجمالي المتوقّع: ≈73 عقدة.**

**اتركه Draft وأبلغني.**

---

# المرجع — معرّفات مؤكّدة (فُحصت حيّاً 2026-09-02)

**Location:** `jo8GkEPOGeRVWN5khioH`

| العنصر | المعرّف |
|---|---|
| Pipeline `Sales Pipeline` | `VaZ3T6vb5fRqmOeazIhw` |
| Stage `Active — Nurture Running` | `131945cf-813a-4fb3-aa62-05a0d166f16d` |
| Stage `Unit Interest` | `7bc6f50d-6a70-456e-b3da-abf014c7d74e` |
| W2 (للنسخ منه فقط) | `12312c5d-8cdf-48de-a621-6557e0a6b4f3` |

**حقول الفرصة:**

| الحقل | النوع | المعرّف |
|---|---|---|
| `match_found` | RADIO (Yes/No) | `kjHzXz4vU0KsbrLrhNWw` |
| `next_match_name` | TEXT | `ccYRitAyIyaibrRPx19a` |
| `next_match_price` | NUMERICAL | `XcXO3d986SBYvdHYcUcL` |
| `next_match_district` | TEXT | `J7vvZUI2502Z1LELEFWZ` |
| `next_match_type` | TEXT | `wd8XZ3Lg8576fQJFz7nZ` |
| `next_match_id` | TEXT | `QlkyPIdl7zgvqtFld8FW` |
| `sent_project_ids` | LARGE_TEXT | `pqg3NQZYXEEY4c2R73eC` |
| `budget_max` | NUMERICAL | `vjr0Rzx7UZIKrdxi2dnw` |
| `budget_currency` | SINGLE_OPTIONS | `FnONN7UWwgtBAbZjvObN` |
| `property_location_interest` | SINGLE_OPTIONS | `CdSgfjsSOwvw6TlexFyb` |
| `property_type` | SINGLE_OPTIONS | `qB3KOydbYuRO0zcvu2OS` |
| `client_goal` | SINGLE_OPTIONS | `XF9bftk0tWzX2kfRG3QI` |
| `property_source` | SINGLE_OPTIONS | `4lM3nGFJZtfcGouZByfL` |

**تذكير أخير: اتركه Draft. لا تنشر. توقّف عند كل ⛔.**
