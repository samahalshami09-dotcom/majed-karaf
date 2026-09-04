# برومت 2 — سجلّات Cloudflare الحيّة

**استخدمه فقط إن رجع اختبار C بـ200 واختبار D بـ400.**
(أي أن الفاصلة سبب حقيقي — وعندها نحتاج رسالة الخطأ الفعلية.)

**الصق كل ما تحت الخط.**

---

مهمة — التقاط رسالة خطأ حيّة. تحتاج تبويبين مفتوحين في آن واحد.

## ⛔ حدود
- ممنوع الضغط على Save أو Deploy في Cloudflare إطلاقاً
- ممنوع تعديل أي إعداد لعقدة الويبهوك
- W3 يبقى Draft · لا SMS
- ممنوع ذكر أي جزء من رمز التفويض

## التبويب 1 — Cloudflare
1. `https://dash.cloudflare.com/a6fdfadf01d44bbca24fddef72ec7de2/home`
2. Compute (Workers & Pages) → **majed-project-matching**
3. تبويب **Logs** → **Begin log stream** (أو Real-time logs)
4. اتركه يعمل ولا تغلقه

## التبويب 2 — GHL
5. `app.innovationvalues.com` → Sub-Accounts → `majed` → **Majed Karaf** → Switch
6. الفرصة `63oh6ELZtHHN6AUsY2jX` → `Sent Project IDs` = `,6a95ca3749b8afb35f2a13ca` → احفظ
7. Automation → Workflows → `W3` (`5e7af32d-5378-42ef-bdb2-f95daf559e60`) → عقدة **Custom Webhook**
8. أكّد أن سجل الاختبار مختار → **Send test request**

## العودة للتبويب 1
9. انسخ الإدخال الذي ظهر في السجلّ **كاملاً وحرفياً**: الرسالة · الـexception · الـstack إن وُجد · جسم الطلب الوارد إن عُرض

## التنظيف
10. امسح `Sent Project IDs` · احفظ · أكّد فارغاً
11. أوقف بثّ السجلّ

## صيغة الرد
⛔ لا تسرد خطواتك. أعطني:

```
Status Code في لوحة GHL : ...

── إدخال السجلّ في Cloudflare (حرفياً) ──
(كل ما ظهر)

── هل عُرض جسم الطلب الوارد؟ ──
نعم — (انسخه، مع [REDACTED] مكان أي توكن) / لا

── تأكيدات ──
لم أضغط Save/Deploy : نعم / لا
الحقل فُرِّغ        : نعم / لا
W3 لا يزال Draft    : نعم / لا
```

إن لم يظهر أي إدخال في السجلّ — قل ذلك صراحةً؛ فهذا بحد ذاته دليل على أن الطلب لم يصل إلى الـworker.
