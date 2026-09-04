# برومت Ask AI — الصقه كما هو

---

أنت داخل الحساب الفرعي Majed Karaf (Location `jo8GkEPOGeRVWN5khioH`).

**قبل أي شيء، أجب بسطر واحد:** هل تستطيع **إنشاء وتعديل عقد داخل Workflow** بنفسك، أم أنت للقراءة والإرشاد فقط؟ لا تبدأ أي مهمة قبل أن تجيب على هذا.

بعدها نفّذ المهمتين بالترتيب:

## المهمة 1 — فحص تشخيصي (الأولوية القصوى)

افتح عقدة **Custom Webhook** في:
- `W2 — Project Matching` (`12312c5d-8cdf-48de-a621-6557e0a6b4f3`)
- `W3 — Options Delivery & Nurture` (`5e7af32d-5378-42ef-bdb2-f95daf559e60`)

اقرأ **RAW BODY** في كل منهما وأجب على ثلاثة أسئلة:

1. اذكر **أسماء المفاتيح فقط** في جسم كل طلب (بدون القيم).
2. هل يوجد أي فرق بين قائمة مفاتيح W2 وقائمة مفاتيح W3؟
3. **هل يوجد أي مفتاح يتعلق بوضع تجريبي** — مثل `dryRun` أو `dry_run` أو `test` أو `mode`؟

> **لماذا هذا حرج:** آخر استجابة محفوظة من المحرّك كانت `DRY_RUN: true`. إن كان W3 يرسل مفتاح وضع تجريبي، فسيعمل بالوضع التجريبي بعد النشر ويرسل رسائل حقيقية عن مطابقات لم تُسجَّل — فشل صامت لا يُكتشف إلا من شكوى عميل.

⛔ **لا تذكر أي جزء من رمز التفويض (Bearer Token) في ردك.**

## المهمة 2 — بناء (نفّذها فقط إن كنت تستطيع البناء)

في `W3 — Options Delivery & Nurture`، **بعد** عقد القفل الموجودة، أضف هذه العقد بالترتيب:

```
1. Wait — 1 minute
2. If/Else — الشرط: Opportunity → Pipeline Stage  is  "Active — Nurture Running"
      فرع NO  → Update Opportunity: Nurture Active = No  →  End Workflow
3. (عقدة الويبهوك الموجودة تأتي هنا في فرع YES)
4. Wait — 10 seconds
5. If/Else — الشرط: Opportunity → Match Found  is  "Yes"
      فرع NO  → اتركه فارغاً مؤقتاً (سيُربط لاحقاً بأكشن Go To)
6. SMS — النص أدناه
7. Update Opportunity — الحقل: Sent Project IDs
      القيمة: {{opportunity.sent_project_ids}},{{opportunity.next_match_id}}
```

**نص رسالة الـSMS:**

```
مرحبا {{contact.first_name}} 👋
لقينالك خيار عقاري بيناسب طلبك:

🏢 {{opportunity.next_match_name}}
📍 المنطقة: {{opportunity.next_match_district}}
🏠 النوع: {{opportunity.next_match_type}}
💵 السعر يبدأ من: {{opportunity.next_match_price}} دولار

بيهمّك تفاصيل أكتر أو تحجز معاينة؟ ردّ علينا ومستشارنا بيتواصل معك مباشرة.
```

## حدود مطلقة

- **لا تنشر W3** — يبقى Draft.
- **لا تلمس أي workflow آخر** — في الحساب 35 workflow منشوراً وشغّالاً، منها `agent Reception` بـ15,793 مشتركاً.
- **لا تنسخ المجموعة ولا تكرّرها** — واحدة فقط.
- **لا تخترع أي قيمة.** إن لم تجد حقلاً أو خياراً، قل ذلك بدل تخمين بديل.

في نهاية ردك افصل بوضوح: **ما نفّذته** · **ما لم أستطع تنفيذه ولماذا**.
