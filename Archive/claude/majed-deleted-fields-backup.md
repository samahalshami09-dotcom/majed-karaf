# نسخ احتياطية للحقول/السجلات المحذوفة — نظام ماجد

سجل بيانات ما حُذف قبل حذفه (للاسترجاع عند الحاجة). حساب GHL `jo8GkEPOGeRVWN5khioH`.

## 2026-08-30 — حذف 8 حقول `buyer_*` من Contact (بيانات اختبار مكرّرة مع Opportunity)
الحقول: Buyer Budget Max `onJUlwtQvr4KB1Rfg9sB` · Buyer Property Type `A65mg8uWcfdE06iNZZfI` · Buyer District `bRnXIctfJRZSNW2EGvAP` · Buyer Goal `B1fy5lmy9RAjeHFlWdH7` · Buyer Timeline `MmGcYKMfrMXKDGHbEARm` · Buyer Needs Citizenship `NC8693qqkAAPLq7TlL4H` · Buyer Needs Residence `CFv7QBh71XypwqXOZYdk` · Buyer Installment `PoHG18KfiRasgPSuPTcj`

بيانات الـ6 جهات اتصال:
| Contact ID | Name | Property Type | (باقي الحقول) |
|---|---|---|---|
| gchPUeg5LFbIeJEtPHpE | (no name) | 1+1 | — |
| b5PBURQRVBVx87Rzjbtz | وسام | 1+1 | — |
| 8LQBLIVyZAd0FQiv9gpH | (no name) | 2+1 | — |
| Re7k1ZGbf6WQnYvRtD5P | (no name) | 3+1 | — |
| z6mdC09KnUwTIoY7lL1D | (no name) | 2+1 | — |
| qM9c1Lv2r9bqle0MzAbT | TEST Location Match 2026-08-18 | Apartment | budget_max 150000 · district arnavutkoy · goal Investment · timeline Immediate · citizenship no · residence yes · installment yes |

## 2026-08-30 — حذف حقول Contact فارغة (0 سجل)
Buying Timeline `C31Vy8sLGN59KdxHXfQt` · كل `pending_*` (8) و`intake_*` (20) — الجيل القديم لإدخال البروكر (استُبدل بإدخال البروكر مباشرة على Property).

## 2026-08-30 — حذف 6 حقول مكرّرة من Projects
المحذوفة: `cash_discount_percent` · `installment_duration` · `rental_yield` · `price_range` (0 سجل) · `blocks_count` · `floors_count` (سجل واحد).
القانونية المُبقاة: `num_blocks` · `num_floors` · `cash_discount` · `installment_months` · `annual_rental_yield` · `price_per_sqm`.
نسخة السجل الوحيد: Kılıç Life Residence `6a91bc3ecda730d348d3492d` — blocks_count=1, floors_count=17.

## 2026-08-30 — ترحيل أسعار Property + حذف 4 سجلات خطأ
**الترحيل:** `unit_price` (TRY) → `sale_price_try` لـ250 سجل · وحدات الدولار → `sale_price_usd` لـ16 سجل (1 TEST + 15 وحدة بروكر مسعّرة بالدولار). `unit_price` **لم يُحذف** (نسخة احتياطية للمصدر).

**4 سجلات Property محذوفة (أخطاء إدخال):**
| Name | Record ID (GHL) | record_id (CRM) | unit_price | type | floor |
|---|---|---|---|---|---|
| A 25 | 69ff4d8dbb75e175001209fa | 4200641000026287000 | 43 | apartment | 3 |
| 44 | 69ff4d746f70574743183f62 | 4200641000054623000 | 70 | apartment | 9 |
| BIZIM 3+1 7.750.000 | 69ff4d3f2e2b2d4cb22dcc1c | 4200641000057262000 | 235000 | apartment | 3 |
| sd | 69ff4d21ee3ed530c6615b45 | 4200641000054879000 | 4534 | apartment | 3 |

Property الآن 323 سجلاً (327 − 4).
