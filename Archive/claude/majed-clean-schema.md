# نظام ماجد كرف — مخطط الحقول النظيف (حساب من الصفر)

**البنية المرجعية للبناء على حساب فارغ** · Innova Smart Solutions
مبدأ: حقل رسمي واحد لكل معلومة · بلا تكرار · كل الإصلاحات مدمجة من اليوم الأول.

---

## 0. مبادئ التصميم

1. **مصدر المطابقة = Opportunity فقط.** معايير المشتري لا تُكرَّر على Contact.
2. **الإدخال من البروكر يكتب مباشرة على Projects/Property.** لا حاجة لعشرات حقول `intake_*` على Contact.
3. **Contact = هوية + تصنيف + حالة ليد** فقط.
4. **جسر المنطقة موحّد:** نفس قائمة السلاگ (`arnavutkoy`, `basaksehir`…) على الطلب والمشروع والعقار — هذا يفتح المطابقة.
5. **لكل نوع مدعوم حقل سعر** (أساسي + دولار) — فلا يوجد "نوع بلا سعر".
6. **الأنواع المدعومة تُقيَّد بما له سعر:** `Studio · 1+1 · 2+1 · 3+1 · 4+1 · 5+1 · Villa · Shop · Office · Land`.
7. **قائمة المناطق (District Slug) الموحّدة** — تُستخدم حرفياً على الكائنات الثلاثة:
   `european_side · asian_side · adalar · arnavutkoy · atasehir · avcilar · bahcelievler · bakirkoy · bagcilar · basaksehir · bayrampasa · beykoz · beylikduzu · beyoglu · besiktas · buyukcekmece · catalca · cekmekoy · esenler · esenyurt · eyupsultan · fatih · gaziosmanpasa · gungoren · kadikoy · kagithane · kartal · kucukcekmece · maltepe · pendik · sancaktepe · sariyer · silivri · sultanbeyli · sultangazi · sile · sisli · tuzla · umraniye · uskudar · zeytinburnu`

---

## 1. Custom Object: **PROJECT** (مشاريع الشركة)

### الهوية والحالة
| الحقل | النوع | Field Key | القيم / ملاحظات |
|---|---|---|---|
| Project Name | TEXT | `project_name` | |
| Project Code | TEXT | `project_code` | **فريد (Unique)** — يمنع التكرار عند إعادة الإرسال |
| Developer / Construction Co. | TEXT | `developer` | |
| Project Status | SINGLE_OPTIONS | `project_status` | Active · Almost Sold · Sold Out · Under Construction · Off-Plan · Ready to Move · Coming Soon · Paused |
| Source Type | SINGLE_OPTIONS | `source_type` | Owner · Broker · Agency · Developer |

### الموقع (جسر المطابقة)
| الحقل | النوع | Field Key | القيم / ملاحظات |
|---|---|---|---|
| City Side | SINGLE_OPTIONS | `city_side` | european · asian |
| **District Slug** | SINGLE_OPTIONS | `district_slug` | **قائمة السلاگ الموحّدة** — مفتاح الربط مع الطلب |
| Neighborhood | TEXT | `neighborhood` | للعرض فقط |
| Full Address | LARGE_TEXT | `full_address` | |
| Map Link | URL | `map_link` | |

### الأهلية
| الحقل | النوع | Field Key | القيم |
|---|---|---|---|
| Eligible Citizenship | RADIO | `eligible_citizenship` | yes · no |
| Eligible Residence | RADIO | `eligible_residence` | yes · no |

### الدفع
| الحقل | النوع | Field Key | القيم / ملاحظات |
|---|---|---|---|
| Pricing Currency | SINGLE_OPTIONS | `pricing_currency` | USD · TRY · EUR |
| Installment Available | RADIO | `installment_available` | yes · no |
| Installment Duration (months) | NUMERICAL | `installment_duration` | |
| Down Payment % | NUMERICAL | `down_payment_percent` | |
| Cash Discount % | NUMERICAL | `cash_discount_percent` | العرض التحفيزي (ليس فلتر مطابقة) |

### الأسعار — أساسي + دولار لكل نوع مدعوم
| النوع | سعر أساسي (عملة المصدر) | سعر دولار (للمطابقة) |
|---|---|---|
| Studio | `price_studio` | `price_studio_usd` |
| 1+1 | `price_1plus1` | `price_1plus1_usd` |
| 2+1 | `price_2plus1` | `price_2plus1_usd` |
| 3+1 | `price_3plus1` | `price_3plus1_usd` |
| 4+1 | `price_4plus1` | `price_4plus1_usd` |
| **5+1** | `price_5plus1` | `price_5plus1_usd` |
| Villa | `price_villa` | `price_villa_usd` |
| Shop | `price_shop` | `price_shop_usd` |
| Office | `price_office` | `price_office_usd` |
| Land (per m²) | `price_land_sqm` | `price_land_sqm_usd` |
| — | Updated At: `usd_price_updated_at` (DATE_TIME) | Rate: `exchange_rate_used` (NUMERICAL) |

### التسويق والمرافق (مجموعة مختصرة)
`project_type` (SINGLE_OPTIONS) · `available_unit_types` (MULTIPLE_OPTIONS) · `delivery_date` (DATE) · `commission_rate` (NUMERICAL) · `amenities` (MULTIPLE_OPTIONS مدمجة: Pool/Gym/Security/Parking/Kids/…) · `cover_image` · `gallery` · `brochure` · `project_notes` (LARGE_TEXT) · `expected_rental_yield` (NUMERICAL)

**العلاقات:** Project ↔ جهة العرض (Contact) · Project ← Property (واحد لمتعدد).

---

## 2. Custom Object: **PROPERTY** (وحدة فعلية / إعادة بيع)

| الحقل | النوع | Field Key | القيم / ملاحظات |
|---|---|---|---|
| Property Name | TEXT | `property_name` | |
| Property Code | TEXT | `property_code` | **فريد** |
| Type | SINGLE_OPTIONS | `type` | الأنواع المدعومة |
| Status | SINGLE_OPTIONS | `status` | Available · Reserved · **Sold** — فلتر "غير مباع" |
| Construction Status | SINGLE_OPTIONS | `construction_status` | Ready to Move · Under Construction · Off-Plan |
| City Side | SINGLE_OPTIONS | `city_side` | european · asian |
| District Slug | SINGLE_OPTIONS | `district_slug` | قائمة السلاگ الموحّدة |
| Bathrooms | NUMERICAL | `bathrooms` | |
| Area (m²) | NUMERICAL | `area_sqm` | |
| Floor | NUMERICAL | `floor` | |
| View | SINGLE_OPTIONS | `view` | Sea · City · Garden · Forest · No View |
| Furnished | RADIO | `furnished` | yes · no |
| Sale Price (base) | MONETORY | `sale_price` | بعملة المصدر |
| Sale Price USD | NUMERICAL | `sale_price_usd` | للمطابقة |
| Currency | SINGLE_OPTIONS | `currency` | USD · TRY · EUR |
| Exchange Rate Used | NUMERICAL | `exchange_rate_used` | |
| USD Price Updated At | DATE_TIME | `usd_price_updated_at` | |
| Eligible Citizenship | RADIO | `eligible_citizenship` | yes · no |
| Eligible Residence | RADIO | `eligible_residence` | yes · no |
| Installment Available | RADIO | `installment_available` | yes · no |
| Down Payment % | NUMERICAL | `down_payment_percent` | |
| Availability Checked At | DATE_TIME | `availability_checked_at` | نضارة التوفر (72 ساعة) |
| Times Sent | NUMERICAL | `times_sent` | |
| Commission Rate % | NUMERICAL | `commission_rate` | |
| Source Type | SINGLE_OPTIONS | `source_type` | Owner · Broker · Agency · Developer |
| Images | FILE_UPLOAD | `images` | |

**العلاقات:** Property ↔ Project (`project_id` عبر Association) · Property ↔ جهة العرض (Contact).

---

## 3. **OPPORTUNITY** (طلب المشتري = مصدر المطابقة)

### معايير المطابقة الرسمية
| الحقل | النوع | Field Key | القيم |
|---|---|---|---|
| Budget Max | NUMERICAL | `budget_max` | |
| Budget Currency | SINGLE_OPTIONS | `budget_currency` | USD (افتراضي) · TRY · EUR |
| Location Interest | SINGLE_OPTIONS | `property_location_interest` | قائمة السلاگ الموحّدة |
| Property Type | SINGLE_OPTIONS | `property_type` | الأنواع المدعومة |
| Client Goal | SINGLE_OPTIONS | `client_goal` | investment · housing · citizenship · residence |
| Property Source | SINGLE_OPTIONS | `property_source` | Project · Resale |
| Needs Citizenship | RADIO | `client_needs_citizenship` | yes · no |
| Needs Residence | RADIO | `client_needs_residence` | yes · no |
| Installment | RADIO | `client_installment` | yes · no |

### تتبّع النتائج والإرسال (موحّد على Opportunity)
| الحقل | النوع | Field Key |
|---|---|---|
| Sent Project IDs | LARGE_TEXT | `sent_project_ids` |
| Rejected Project IDs | LARGE_TEXT | `rejected_project_ids` |
| Sent Property IDs | LARGE_TEXT | `sent_property_ids` |
| Rejected Property IDs | LARGE_TEXT | `rejected_property_ids` |
| Option 1 (id/name/price) | TEXT/TEXT/NUMERICAL | `option_1_id` · `option_1_name` · `option_1_price` |
| Option 2 (id/name/price) | TEXT/TEXT/NUMERICAL | `option_2_id` · `option_2_name` · `option_2_price` |
| Match Status | SINGLE_OPTIONS | `match_status` (MATCHED · NO_MATCH · RESALE_SKIPPED · ERROR) |
| Match Count | NUMERICAL | `match_count` |

### الرعاية والصفقة
| الحقل | النوع | Field Key / ملاحظات |
|---|---|---|
| Nurture Phase | SINGLE_OPTIONS | `nurture_phase` (running · paused · stopped) — الرعاية لكل طلب |
| Nurture Started At | DATE_TIME | `nurture_started_at` |
| Deal Price | NUMERICAL | `financial_property_price` |
| Deal Currency | SINGLE_OPTIONS | `financial_currency` (USD·TRY·EUR) |
| Commission | NUMERICAL | `financial_commission` |
| Agency Contact | TEXT | `agency_contact` |

---

## 4. **CONTACT** (هوية + تصنيف + حالة ليد فقط)

| الحقل | النوع | Field Key | القيم |
|---|---|---|---|
| Name / Phone / Email | (قياسي) | — | |
| Phone 2 | PHONE | `phone_2` | |
| Contact Role | SINGLE_OPTIONS | `contact_role` | buyer · broker · owner · agency · developer · friend_family |
| Gender | SINGLE_OPTIONS | `gender` | Mr. · Ms. |
| Nationality | SINGLE_OPTIONS | `nationality` | (قائمة الدول) |
| Speaking Languages | MULTIPLE_OPTIONS | `speaking_languages` | |
| Lead Source | SINGLE_OPTIONS | `lead_source` | Instagram · Facebook · TikTok · Landing Page · Google Ads · Meta Ads |
| Lead Stage | SINGLE_OPTIONS | `lead_stage` | New · Talk · Qualify · Offer · Close · Lost |
| Working Location | MULTIPLE_OPTIONS | `working_location` | للبروكر (مناطق عمله) |

> **لا** حقول `buyer_*` ولا `intake_*` ولا `pending_*` — كلها اختفت. المعايير على Opportunity، والإدخال يكتب على Projects/Property.

---

## 5. البايبلاينات (نظيفة)

**بايبلاين المشترين:**
Lead In → Call Done — Needs Filled → Active — Nurture Running → Unit Interest → Verifying with Owner → Viewing Scheduled → Deal Closed / Lost.

**بايبلاين المورّدين (المخزون):**
New Inventory → Under Review → Active → Inactive.

**بايبلاين التأهيل الأولي (اختياري):**
New Submission → Under Review → Qualified → Not Qualified.

---

## 6. مقارنة سريعة: الفوضى الحالية ← النظيف

| | الحساب الحالي | النظيف |
|---|---|---|
| ميزانية المشتري | 5 حقول موزّعة | `opportunity.budget_max` فقط |
| منطقة | 6 حقول بقيم مختلفة | سلاگ موحّد على 3 كائنات |
| هدف الشراء | 4 حقول بقيم متناقضة | `client_goal` بقيم موحّدة |
| إدخال البروكر | 30+ حقل على Contact | يكتب مباشرة على Project/Property |
| منع تكرار المرفوض | غير موجود | `rejected_project_ids` موجود |
| تخزين الخيارات | مطابقة واحدة | Option 1 + Option 2 |
| أنواع بلا سعر | 5+1/Duplex/Penthouse… | كل نوع مدعوم له سعر |

---

## 7. الخطوة التالية

1. تُنشأ هذه البنية على الحساب (الجديد أو النظيف).
2. تُبنى قواعد الأسعار (محدّث الصرف) وتُثبت قبل أي مطابقة.
3. **استيراد تجريبي 5–10 مشاريع** من المصدر → تأكيد نزول الحقول → الاستيراد الكامل.
4. المحرّك والـWorkflows تقرأ من هذه الحقول الرسمية حصراً.

**قرار مطلوب:** نبنيها على **حساب جديد (Sub-account) نظيف**، أم **نعيد بناء الحساب الحالي** بعد Export كامل؟ (الجديد أنظف وأأمن، لكن يتطلب نقل العملاء والمخزون الحاليين.)

---

*Innova Smart Solutions — مخطط الحقول النظيف لنظام ماجد كرف.*
