# -*- coding: utf-8 -*-
W, H = 1500, 1080
INK="#0d2137"; BRASS="#a8741a"; LINE="#b3ac9c"; SOFT="#f7f5f0"; PAPER="#f2f0ea"
OK="#2f6b4f"; CRIT="#9c2b25"; WARN="#8a5a12"; T2="#4d5b6b"; T3="#7b8794"
p=[]
def esc(s): return s.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
def box(x,y,w,h,title,sub="",tag="",accent=LINE,fill=SOFT,tcol=INK):
    p.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill}" stroke="{accent}" stroke-width="1.4"/>')
    cx=x+w/2
    ty=y+(h/2-8 if sub or tag else h/2+5)
    p.append(f'<text x="{cx}" y="{ty}" text-anchor="middle" font-size="15" font-weight="600" fill="{tcol}">{esc(title)}</text>')
    if sub: p.append(f'<text x="{cx}" y="{ty+18}" text-anchor="middle" font-size="12" fill="{T2}">{esc(sub)}</text>')
    if tag: p.append(f'<text x="{cx}" y="{ty+34}" text-anchor="middle" font-size="10.5" fill="{T3}" font-family="monospace" direction="ltr">{esc(tag)}</text>')
def arrow(x1,y1,x2,y2,dash=False,col=LINE):
    d=' stroke-dasharray="5 4"' if dash else ''
    p.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{col}" stroke-width="1.6"{d} marker-end="url(#a)"/>')
def band(x,y,w,h,label,note=""):
    p.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="none" stroke="{LINE}" stroke-width="1" stroke-dasharray="3 4"/>')
    p.append(f'<text x="{x+w-14}" y="{y+22}" text-anchor="end" font-size="13.5" font-weight="600" fill="{INK}">{esc(label)}</text>')
    if note: p.append(f'<text x="{x+w-14}" y="{y+40}" text-anchor="end" font-size="11.5" fill="{T3}">{esc(note)}</text>')

# ---- band 1: supply (RTL: right to left) ----
band(40,56,1420,110,"جهة العرض — إدخال المخزون")
box(1180,86,250,64,"المورّد","بروكر · مالك · وكالة · مطوّر")
arrow(1175,118,1120,118)
box(870,86,250,64,"وكيل الاستقبال","يصنّف ويوجّه","agent Reception")
arrow(865,118,810,118)
box(560,86,250,64,"وكيل الإدخال","جلسة جمع معلومات · لا يخمّن")

# ---- band 2: inventory + engine ----
band(40,186,1420,150,"المخزون والحساب","AI للّغة لا للحساب")
box(1230,222,200,48,"Projects","مصدر البحث الافتراضي",accent=OK)
box(1230,278,200,48,"Property","Resale فقط · معطّل",accent=WARN)
arrow(1225,274,1160,274)
box(910,242,250,64,"محدّث الأسعار","TRY → USD · كرون 6ص","0 6 * * 1-5",accent=OK)
arrow(905,274,850,274)
box(560,236,290,76,"محرّك المطابقة","منطقة · نوع · سعر USD · أهلية","v3.0.0 · 922430af",accent=BRASS,fill="#f9f2e4")
p.append(f'<text x="545" y="268" text-anchor="end" font-size="11.5" fill="{T3}">استجابة متزامنة</text>')
p.append(f'<text x="545" y="285" text-anchor="end" font-size="11.5" fill="{T3}">match_found · next_match_*</text>')

# ---- band 3: pipeline ----
band(40,356,1420,116,"جهة الطلب — بايبلاين المشترين")
xs=[1270,1090,880,690,510,320]
labels=[("Lead In",""),("Call Done","ماجد يملأ الاحتياجات"),("Active — Nurture","زر التشغيل"),
        ("Unit Interest","اهتمام"),("Verifying","تأكيد التوفّر"),("Viewing → Closed","تسليم بشري")]
for i,(t,s) in enumerate(labels):
    acc = BRASS if i==2 else LINE
    fl  = "#f9f2e4" if i==2 else SOFT
    box(xs[i],386,160,66,t,s,accent=acc,fill=fl)
    if i<5: arrow(xs[i]-5,419,xs[i]-25,419)

# ---- band 4: workflows ----
band(40,492,1420,116,"طبقة الأتمتة — الحالة الحقيقية")
wf=[("W1","بوابة الجودة","draft ×2",WARN),("W2","المطابقة","draft",WARN),("W3","التسليم والرعاية","draft · v40",OK),
    ("W4","ردّ العميل","غير موجود",CRIT),("W5","تحقّق التوفّر","غير موجود",CRIT),("W6","تسليم بشري","غير موجود",CRIT)]
for i,(t,s,tag,c) in enumerate(wf):
    box(xs[i],520,160,72,t,s,tag,accent=c)
    if i<5: arrow(xs[i]-5,556,xs[i]-25,556)

# ---- W3 anatomy ----
band(40,632,1420,180,"W3 — تشريح المجموعة الواحدة","9 عقد × 8 مجموعات")
box(1250,672,180,58,"Stage Guard","ما زال في المرحلة؟",accent=BRASS)
arrow(1245,701,1205,701)
box(1035,672,170,58,"Webhook","نداء المحرّك")
arrow(1030,701,990,701)
box(820,672,170,58,"Write Match Result","6 حقول من الاستجابة",accent=BRASS)
arrow(815,701,775,701)
box(605,672,170,58,"Match Guard","response › match_found",accent=BRASS)
# YES
arrow(600,690,560,668)
box(370,640,180,52,"SMS → Update Opp","إرسال + تسجيل",accent=OK)
# NO
arrow(600,715,560,748)
box(370,724,180,48,"Go to","قفزة إلى Wait",accent=LINE)
arrow(365,666,300,690); arrow(365,748,300,712)
box(120,672,180,58,"Wait 4 days","المجموعة التالية")
p.append(f'<text x="1435" y="795" text-anchor="end" font-size="11.5" fill="{T3}">فرع None من Stage Guard ← Unlock — Set Nurture Active = No ← END</text>')

# ---- chain ----
band(40,832,1420,110,"سلسلة المجموعات الثماني — 28 يوماً")
hooks=["#2","#3","#4","#6","#7","#5","#18","#19"]
cw=150; gap=24; x0=1430-cw
for i in range(8):
    x=x0-i*(cw+gap)
    acc = BRASS if i==7 else LINE
    box(x,862,cw,62,f"مجموعة {i+1}",f"اليوم {i*4}",f"webhook {hooks[i]}",accent=acc)
    if i<7: arrow(x-3,893,x-gap+5,893)
p.append(f'<text x="1435" y="962" text-anchor="end" font-size="11.5" fill="{T3}">#N عدّاد إنشاء لا ترتيب — التسلسل الفعلي غير تصاعدي</text>')

# ---- lock note ----
p.append(f'<rect x="40" y="978" width="1420" height="62" rx="8" fill="#f9f2e4" stroke="{BRASS}" stroke-width="1.2"/>')
p.append(f'<text x="1440" y="1002" text-anchor="end" font-size="13" font-weight="600" fill="{INK}">قفل التزامن</text>')
p.append(f'<text x="1440" y="1022" text-anchor="end" font-size="12" fill="{T2}">L1 يفحص · L2 يرفع القفل عند الدخول · Unlock يفكّه عند كل مخرج · Go to — Unlock (End) في نهاية السلسلة</text>')

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="Segoe UI, Tahoma, Arial, sans-serif" direction="rtl">
<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" fill="{LINE}"/></marker></defs>
<rect width="{W}" height="{H}" fill="{PAPER}"/>
<text x="1460" y="34" text-anchor="end" font-size="21" font-weight="700" fill="{INK}">نظام ماجد كرف — المخطط الكامل</text>
<text x="1460" y="50" text-anchor="end" font-size="11.5" fill="{T3}">Location jo8GkEPOGeRVWN5khioH · W3 v40 · 2026-09-06</text>
{"".join(p)}
</svg>'''
open("/home/user/majed-karaf/Archive/deliverables/majed-diagram.svg","w",encoding="utf-8").write(svg)
print("svg written", len(svg), "bytes")
