-- «Огненное сопло» v2: геометрия, декорации, свет и эффекты.
-- Здесь нет игровых правил. Все координаты локальны к полигону, +X направлен вдоль факела.
local Scene = {}
local OFFSET = Vector3.new(0, 0, 440)
local C = {
 steel=Color3.fromRGB(192,202,216), iron=Color3.fromRGB(97,109,124),
 dark=Color3.fromRGB(37,43,55), black=Color3.fromRGB(24,27,35),
 concrete=Color3.fromRGB(129,134,143), earth=Color3.fromRGB(111,87,60),
 sand=Color3.fromRGB(158,133,89), grass=Color3.fromRGB(175,147,65),
 white=Color3.fromRGB(242,239,225), blue=Color3.fromRGB(66,168,250),
 orange=Color3.fromRGB(254,155,49), yellow=Color3.fromRGB(255,209,58),
 green=Color3.fromRGB(91,202,111), red=Color3.fromRGB(229,61,51),
 purple=Color3.fromRGB(182,115,239), violet=Color3.fromRGB(129,156,244)
}
local function pos(x,y,z) return OFFSET+Vector3.new(x,y,z) end
local function new(class,parent,props)
 local instance=Instance.new(class)
 for key,value in pairs(props or {}) do instance[key]=value end
 instance.Parent=parent
 return instance
end
local function group(parent,name) return new("Model",parent,{Name=name}) end
-- Декоративные детали не мешают перемещению. Коллизия только у архитектуры и крупных машин.
local function part(parent,name,x,y,z,sx,sy,sz,color,material,opts)
 opts=opts or {}
 local item=new("Part",parent,{Name=name,Anchored=true,Size=Vector3.new(sx,sy,sz),
  Color=color or C.steel,Material=material or Enum.Material.Metal,
  CanCollide=opts.solid==true,CanQuery=opts.solid==true,
  CastShadow=opts.shadow~=false,Transparency=opts.alpha or 0})
 if opts.shape then item.Shape=opts.shape end
 item.CFrame=CFrame.new(pos(x,y,z))
 if opts.rot then
  item.CFrame=item.CFrame*CFrame.Angles(math.rad(opts.rot[1] or 0),math.rad(opts.rot[2] or 0),math.rad(opts.rot[3] or 0))
 end
 return item
end
local function beam(parent,name,a,b,r,color,solid)
 local v1=pos(a[1],a[2],a[3]); local v2=pos(b[1],b[2],b[3])
 local mid=(v1+v2)/2
 local item=new("Part",parent,{Name=name,Anchored=true,Size=Vector3.new(r,(v2-v1).Magnitude,r),
  Color=color or C.iron,Material=Enum.Material.Metal,CanCollide=solid==true,CanQuery=solid==true})
 item.CFrame=CFrame.lookAt(mid,v2)*CFrame.Angles(math.rad(90),0,0)
 return item
end
local function solid(parent,name,x,y,z,sx,sy,sz,c,mat)
 return part(parent,name,x,y,z,sx,sy,sz,c or C.concrete,mat or Enum.Material.Concrete,{solid=true})
end
local function sign(parent,text,x,y,z,sx,sy,bg)
 local plate=part(parent,"Табличка "..text,x,y,z,sx,sy,0.3,bg or C.dark,Enum.Material.SmoothPlastic)
 local gui=new("SurfaceGui",plate,{Face=Enum.NormalId.Front,PixelsPerStud=40,LightInfluence=0})
 new("TextLabel",gui,{BackgroundTransparency=1,Size=UDim2.fromScale(1,1),
  Font=Enum.Font.GothamBold,Text=text,TextScaled=true,TextColor3=C.white})
 return plate
end
local function lamp(parent,x,y,z,color,range,power)
 local housing=part(parent,"Промышленный светильник",x,y,z,2.3,1,2.3,C.iron,Enum.Material.Metal)
 local source=new("PointLight",housing,{Color=color,Range=range or 19,Brightness=power or 0.65,Shadows=false})
 return source
end
local function particles(partParent,name,kind)
 local emitter=new("ParticleEmitter",partParent,{
  Name=name,Enabled=false,Rate=kind=="water" and 75 or 42,
  Lifetime=kind=="water" and NumberRange.new(0.4,0.9) or NumberRange.new(0.7,1.4),
  Speed=kind=="water" and NumberRange.new(17,27) or NumberRange.new(4,11),
  SpreadAngle=Vector2.new(kind=="water" and 15 or 30,kind=="water" and 15 or 30),
  Size=NumberSequence.new({NumberSequenceKeypoint.new(0,kind=="water" and 0.25 or 1.5),NumberSequenceKeypoint.new(1,0.05)}),
  Transparency=NumberSequence.new({NumberSequenceKeypoint.new(0,0.2),NumberSequenceKeypoint.new(1,1)}),
  Color=ColorSequence.new(kind=="water" and C.blue or C.white),
  EmissionDirection=kind=="water" and Enum.NormalId.Bottom or Enum.NormalId.Top,
  Acceleration=kind=="water" and Vector3.new(0,-16,0) or Vector3.new(0,4,0)
 })
 return emitter
end
local function makeBunker(world)
 local g=group(world,"A Бункер управления")
 solid(g,"Фундамент",-62,-0.1,-25,42,1,37,C.concrete)
 solid(g,"Задняя бронестена",-62,8,-42.5,42,16,2)
 solid(g,"Левая стена",-82,8,-25,2,16,35)
 solid(g,"Железобетонная кровля",-62,17,-25,43,2,37)
 -- Дверь на южном фасаде, проём 8 studs, высота > 9 studs; никаких стеклянных коллайдеров здесь.
 solid(g,"Фасад слева",-74.5,7,-8.5,15,14,2)
 solid(g,"Фасад справа",-49.5,7,-8.5,15,14,2)
 solid(g,"Перемычка входа",-62,12.3,-8.5,10,5.4,2)
 part(g,"Открытая бронедверь",-56.5,5,-8.1,1.1,9,0.8,C.dark)
 sign(g,"ВЫХОД",-62,14,-7.3,9,1.8,C.green)
 -- Отдельные стеклопакеты на восточном фасаде (смотрят на стенд).
 solid(g,"Подоконная бронеплита",-42,2.8,-25,2,5.6,35)
 solid(g,"Верхняя бронеплита",-42,14.3,-25,2,4.5,35)
 for _,z in ipairs({-39,-28.5,-18,-9}) do
  solid(g,"Вертикальная ферма окна",-42,9,z,2,9,1.4)
 end
 for _,z in ipairs({-33.7,-23.2,-13.5}) do
  part(g,"Пулестойкий стеклопакет",-42,9.5,z,0.42,8.2,8.9,C.blue,Enum.Material.Glass,{solid=true,alpha=0.59})
  beam(g,"Стальная накладка",{-42.4,5.6,z-4.5},{-42.4,13.4,z-4.5},0.35,C.dark)
 end
 -- Пульт не перекрывает ось входа и точку спавна.
 solid(g,"Пульт испытаний",-62,2.35,-32,32,4.7,6.8,C.dark,Enum.Material.Metal)
 part(g,"Наклонная поверхность пульта",-62,4.9,-29.7,33,0.5,5,C.iron)
 for i=0,4 do
  local x=-73+i*6.2
  part(g,"Секция управления",x,7,-36,5.4,3.6,0.55,C.black)
  sign(g,({"STOP","N2","DELUGE","SIREN","CANNON"})[i+1],x,7,-35.66,5,1.4)
  for k=0,2 do
   part(g,"Сигнальный диод",x-1.1+k*1.1,5.6,-35.6,0.62,0.42,0.35,
    k==0 and C.red or (k==1 and C.yellow or C.green),Enum.Material.Neon)
  end
 end
 for i=0,7 do
  part(g,"Рычажный тумблер",-75+i*3.6,5,-28.3,0.35,0.9,0.7,C.steel)
 end
 for x=-76,-48,7 do
  solid(g,"Шкаф автоматики",x,6,-40,4.8,10,2.4,C.iron,Enum.Material.Metal)
  sign(g,"PLC",x,8,-38.65,3,1.1)
  for k=0,4 do
   part(g,"Рёбра шкафа",x-1.8+k*0.9,6,-38.72,0.08,7.6,0.15,C.black)
  end
 end
 for x=-75,-48,6 do
  beam(g,"Подвесной кабельный лоток",{x,15,-40},{x,15,-13},0.65,C.yellow)
 end
 for z=-36,-13,8 do lamp(g,-62,15.3,z,C.white,19,0.45) end
 part(g,"Напольная линия",-62,0.45,-14,7,0.1,10,C.green,Enum.Material.Neon)
 sign(g,"TEST CONTROL",-63,12,-41,16,2.2)
 local siren=lamp(g,-57.5,13,-8.2,C.red,38,0)
 solid(g,"Площадка выхода",-62,0,2,17,0.35,22)
 for x=-70,-54,16 do
  for z=0,12,6 do solid(g,"Защитный столбик",x,1,z,0.9,2,0.9,C.yellow,Enum.Material.Metal) end
 end
 return siren
end

local function makeStand(world)
 local g=group(world,"C Огневой стенд")
 solid(g,"Армированная плита",8,0.5,-8,92,1,44)
 solid(g,"Упорная стена",-18,9,-8,6,18,25)
 for z=-21,5,26 do
  for x=-12,36,12 do
   beam(g,"Несущая колонна",{x,1,z},{x,14,z},1.4,C.dark,true)
   beam(g,"Структурная диагональ",{x,3,z},{x+10,13,z},0.64,C.steel)
  end
  beam(g,"Продольная ферма",{-12,14,z},{38,14,z},1.2,C.iron)
  for x=-12,34,8 do beam(g,"Перила",{x,14,z},{x,18,z},0.25,C.yellow) end
  beam(g,"Поручень",{-12,18,z},{36,18,z},0.33,C.yellow)
 end
 for z=-21,5,26 do solid(g,"Сервисный настил",12,13.6,z,55,0.7,2.5,C.iron,Enum.Material.Metal) end
 for x=-10,34,5 do
  part(g,"Решётчатый сегмент",x,14.05,-21,0.35,0.08,2,C.dark)
  part(g,"Решётчатый сегмент",x,14.05,5,0.35,0.08,2,C.dark)
 end
 -- Группа двигателя, фланцы, насосы и трубная обвязка.
 local engine=solid(g,"Метановый двигатель",9,8,-8,16,7,8,C.steel,Enum.Material.Metal)
 for dx=-6,6,3 do
  part(g,"Кольцевой фланец",9+dx,8,-8,0.85,9.2,9.2,C.dark,Enum.Material.Metal,{shape=Enum.PartType.Cylinder})
  for k=0,7 do
   local a=k*math.pi/4
   part(g,"Болт крепления",9+dx,8+4.1*math.sin(a),-8+4.1*math.cos(a),0.9,0.35,0.35,C.yellow)
  end
 end
 for _,z in ipairs({-14,-2}) do
  for _,y in ipairs({5.4,10.6}) do
   part(g,"Турбонасос",1,y,z,7,3.5,3.5,C.iron,Enum.Material.Metal,{shape=Enum.PartType.Cylinder})
   for x=-2,4,1.4 do
    part(g,"Рёбра насоса",x,y,z,0.3,3.75,3.75,C.black)
   end
  end
 end
 part(g,"Камера сгорания",23,8,-8,11,5.6,6.4,C.steel,Enum.Material.Metal,{shape=Enum.PartType.Cylinder})
 for x=19,28,2 do
  part(g,"Кольцо охлаждения",x,8,-8,0.5,7,7,C.blue,Enum.Material.Metal,{shape=Enum.PartType.Cylinder})
 end
 solid(g,"Сопло двигателя",34,8,-8,13,11,11,C.black,Enum.Material.Metal).Shape=Enum.PartType.Cylinder
 part(g,"Срез сопла",40,8,-8,1.2,12.3,12.3,C.steel,Enum.Material.Metal,{shape=Enum.PartType.Cylinder})
 for _,v in ipairs({
  {name="CH4", z=-15, y=20,color=C.orange},
  {name="LOX", z=-1, y=21,color=C.blue},
  {name="N2", z=6, y=16,color=C.yellow},
 }) do
  beam(g,v.name.." вход",{-13,3,v.z},{-13,v.y,v.z},0.9,v.color)
  beam(g,v.name.." подача",{-13,v.y,v.z},{18,v.y,v.z},0.9,v.color)
  beam(g,v.name.." отвод",{18,v.y,v.z},{18,8,v.z},0.8,v.color)
  for x=-9,18,5 do part(g,"Крепёж магистрали",x,v.y,v.z,0.5,1.2,1.2,C.black) end
  sign(g,v.name,-15,19,v.z+0.7,3.4,1.4)
 end
 for _,z in ipairs({-15,-1}) do
  for x=-3,20,5.5 do
   part(g,"Красный вентиль",x,22,z,2.4,0.4,2.4,C.red,Enum.Material.Metal,{shape=Enum.PartType.Cylinder})
   beam(g,"Шток вентиля",{x,20,z},{x,22,z},0.35,C.iron)
  end
 end
 for x=0,24,6 do
  beam(g,"Охлаждающая трубка",{x,9,-14},{x+3,12,-16},0.48,C.blue)
  beam(g,"Обратная трубка",{x,6,-2},{x+3,6,-17},0.45,C.steel)
 end
 -- Кабельный лоток является отдельным очагом, декоративные кабели не блокируют путь.
 local cable=solid(g,"Кабельный лоток",7,2.3,5,46,1.8,4,C.yellow,Enum.Material.Metal)
 for x=-14,28,3 do part(g,"Пластина лотка",x,3.3,5,0.5,0.35,4,C.black) end
 for _,z in ipairs({4,5,6}) do beam(g,"Силовой кабель",{-16,3.7,z},{30,3.7,z},0.27,z==4 and C.red or (z==5 and C.blue or C.green)) end
 -- Оросительная система: визуально читаемая рампа с семью форсунками.
 beam(g,"Водяная гребёнка",{-8,24,-8},{33,24,-8},1.2,C.blue)
 local water={}
 for x=-5,31,6 do
  beam(g,"Подвод форсунки",{x,24,-8},{x,22,-8},0.8,C.blue)
  local nozzle=part(g,"Распылитель",x,22,-8,1.1,1.1,1.1,C.steel)
  table.insert(water,particles(nozzle,"Водяные струи","water"))
 end
 -- Слив / дефлектор пламени, копоть, жёлто-чёрная разметка.
 solid(g,"Газоотводный канал",62,0.5,-8,44,0.9,23,C.concrete)
 part(g,"Термический ожог",58,1.01,-8,31,0.08,15,C.black,Enum.Material.SmoothPlastic,{alpha=0.37})
 for _,z in ipairs({-21,5}) do solid(g,"Борт огнеотвода",63,3,z,44,6,2) end
 for x=38,80,4 do
  part(g,"Сигнальная штриховка",x,1.04,-22,1.8,0.08,0.8,(x%8==6) and C.yellow or C.black)
 end
 -- Факел по оси X; отдельные сегменты исчезают после STOP.
 local plume={}
 local cols={Color3.fromRGB(58,155,230),C.violet,C.purple,Color3.fromRGB(117,81,188)}
 for i=1,4 do
  table.insert(plume,part(g,"Струя - сегмент "..i,42+(i-1)*10.2,8,-8,
   7+i*2,8.2-i*1.3,8.2-i*1.3,cols[i],Enum.Material.Neon,
   {shape=Enum.PartType.Cylinder,alpha=0.18+i*0.07}))
 end
 for x=47,68,7 do
  table.insert(plume,part(g,"Скачок уплотнения",x,8,-8,0.55,4.5,4.5,Color3.fromRGB(150,198,238),Enum.Material.Neon,
   {shape=Enum.PartType.Cylinder,alpha=0.78}))
 end
 local flareLight=lamp(g,42,8,-8,C.blue,24,0.53)
 -- Инженерное табло: игрок видит подтверждение команды за пределами бункера.
 local monitorAnchor=part(g,"Телеметрия стенда",-5,20,9,1.4,0.6,1.4,C.iron,Enum.Material.Metal)
 local board=new("BillboardGui",monitorAnchor,{
  Name="Табло состояния",Adornee=monitorAnchor,AlwaysOnTop=true,
  Size=UDim2.fromOffset(260,76),StudsOffset=Vector3.new(0,2.5,0),
  MaxDistance=160,LightInfluence=0
 })
 local background=new("Frame",board,{
  Size=UDim2.fromScale(1,1),BackgroundColor3=Color3.fromRGB(18,29,41),
  BackgroundTransparency=0.08,BorderSizePixel=0
 })
 new("UICorner",background,{CornerRadius=UDim.new(0,8)})
 new("UIStroke",background,{Thickness=2,Color=Color3.fromRGB(82,158,198)})
 local monitor=new("TextLabel",background,{
  Name="Статус",Size=UDim2.new(1,-16,1,-10),Position=UDim2.fromOffset(8,5),
  BackgroundTransparency=1,Text="ПОДАЧА CH4 / LOX",TextColor3=Color3.fromRGB(255,197,90),
  TextSize=15,TextWrapped=true,Font=Enum.Font.GothamBold
 })
 -- Локальные технические прожекторы: подсвечивают фермы и насосы сбоку,
 -- вместо увеличения экспозиции всей ночной сцены.
 for _,fixture in ipairs({
  {-12,20,18, -3,7,-8},
  {14,20,21, 10,8,-8},
  {34,19,-29, 23,8,-8},
  {-24,18,-26, -6,8,-8}
 }) do
  local x,y,z,tx,ty,tz=table.unpack(fixture)
  local lampBody=part(g,"Светильник обслуживания стенда",x,y,z,2.4,1.4,2.4,C.iron,Enum.Material.Metal)
  lampBody.CFrame=CFrame.lookAt(lampBody.Position,pos(tx,ty,tz))
  new("SpotLight",lampBody,{
   Face=Enum.NormalId.Front,Angle=78,Range=43,Brightness=1.05,
   Color=Color3.fromRGB(226,235,255),Shadows=false
  })
 end
 -- Мягкая локальная подсветка рабочей дорожки не даёт персонажу исчезнуть в темноте.
 local footlight=part(g,"Свет на техническом проходе",-19,3,10,1.2,0.5,1.2,C.iron)
 new("PointLight",footlight,{
  Range=24,Brightness=0.42,Color=Color3.fromRGB(233,214,188),Shadows=false
 })
 local nitrogen={}
 for _,pt in ipairs({{35,9,-8},{7,12,-10},{-2,10,-16}}) do
  local emitterBase=part(g,"Сопло продувки",pt[1],pt[2],pt[3],0.5,0.5,0.5,C.yellow)
  table.insert(nitrogen,particles(emitterBase,"Азотная продувка","gas"))
 end
 local sparks=part(g,"Зона утечки",-1,11,-12,1,1,1,C.dark)
 local sparkEmitter=new("ParticleEmitter",sparks,{Enabled=true,Rate=25,Lifetime=NumberRange.new(0.2,0.55),
  Speed=NumberRange.new(5,14),Color=ColorSequence.new(C.orange),LightEmission=0.8,
  Size=NumberSequence.new({NumberSequenceKeypoint.new(0,0.3),NumberSequenceKeypoint.new(1,0)}),
  SpreadAngle=Vector2.new(140,140)})
 return {engine=engine,cable=cable,water=water,nitrogen=nitrogen,
  plume=plume,glow=flareLight,sparks=sparkEmitter,monitor=monitor}
end

local function makeIndustry(world)
 local g=group(world,"D Служебная техзона")
 solid(g,"Подъездная площадка",-4,0.12,38,86,0.25,48,C.concrete,Enum.Material.Concrete)
 for row=0,1 do
  for i=0,5 do
   local x=-30+i*3.8
   local z=19+row*7
   local bottle=part(g,"Баллон азота",x,4.1,z,2.3,8.2,2.3,C.black,Enum.Material.Metal,{shape=Enum.PartType.Cylinder})
   part(g,"Плечо баллона",x,8.1,z,1.45,0.8,1.45,C.yellow)
   part(g,"Вентиль баллона",x,8.8,z,0.6,0.7,0.6,C.iron)
   beam(g,"Коллектор азота",{x,9.2,z},{x,10.8,z},0.28,C.yellow)
  end
 end
 beam(g,"Коллектор батареи",{-33,10.9,20},{-6,10.9,20},0.85,C.yellow)
 for i=0,2 do
  solid(g,"Распределительный шкаф",16+i*5.5,5,23,4.5,10,3.2,C.iron,Enum.Material.Metal)
  sign(g,"POWER",16+i*5.5,7,21.2,3.3,1,C.black)
  for k=0,4 do part(g,"Вентиляционная прорезь",15+i*5.5,3+k,21.15,2,0.13,0.25,C.black) end
 end
 for i=0,2 do
  solid(g,"Резервуар и насос",-23+i*12,4.5,48,9,9,9,i==0 and C.orange or (i==1 and C.blue or C.steel),Enum.Material.Metal)
  for k=0,3 do part(g,"Обруч резервуара",-23+i*12,2+k*2,48,9.2,0.3,9.2,C.dark) end
 end
 for i=0,5 do
  solid(g,"Паллета с ящиками",12+i*5,0.4,44,4,0.8,5,C.earth,Enum.Material.Wood)
  for k=0,1 do part(g,"Инструментальный ящик",12+i*5,2+k*2,44,3.5,1.8,4,C.iron) end
 end
 for x=-35,36,7 do
  solid(g,"Кабельная опора",x,3.5,14,0.9,7,0.9,C.dark,Enum.Material.Metal)
 end
 beam(g,"Техтрубопровод",{-35,7,14},{35,7,14},0.7,C.blue)
 for x=-34,34,6 do part(g,"Техпроезд",x,0.3,58,2,0.05,0.3,C.yellow,Enum.Material.Neon) end
 sign(g,"TECH / N2",-6,12,23,14,2,C.dark)
end

local function makeSteppe(world)
 local g=group(world,"E Степь, цель и лафет")
 local grass=solid(g,"Сухая трава",88,0.7,-8,41,1.4,52,C.grass,Enum.Material.Grass)
 for i=0,56 do
  local x=70+(i*29%39)
  local z=-32+(i*17%49)
  local height=1.4+(i%5)*0.55
  part(g,"Пучок сухой травы",x,1.6+height/2,z,0.35,height,0.35,i%3==0 and C.sand or C.grass,Enum.Material.Grass)
 end
 local cow=group(g,"Корова")
 part(cow,"Тело",86,5,26,10,6,5,C.white)
 part(cow,"Пятно на боку",86,6.7,23.45,3.6,2.1,0.3,C.black)
 part(cow,"Пятно на крупе",82.5,4.8,28.55,2.4,2.6,0.3,C.black)
 part(cow,"Шея",90.7,5.3,26,3,5,3.8,C.white)
 part(cow,"Голова",92.6,6.4,26,4.3,3.5,3.6,C.white)
 part(cow,"Морда",95,5.7,26,2,1.9,3.2,Color3.fromRGB(244,172,184))
 for _,z in ipairs({24.6,27.4}) do
  part(cow,"Глаз",94.2,7.05,z,0.55,0.55,0.55,C.black,Enum.Material.SmoothPlastic,{shape=Enum.PartType.Ball})
 end
 for _,x in ipairs({82.5,89.5}) do
  for _,z in ipairs({24.3,27.7}) do
   part(cow,"Нога",x,2,z,1.25,4,1.3,C.white)
   part(cow,"Копыто",x,0.5,z,1.4,1,1.6,C.dark)
  end
 end
 for _,z in ipairs({24,28}) do part(cow,"Ухо",92.1,8.3,z,1.6,0.7,1.8,C.white) end
 beam(cow,"Хвост",{81,6,26},{78,2.7,27},0.3,C.white)
 -- Лафетный ствол дистанционного управления.
 solid(g,"Основание лафета",46,1.4,18,7,2.8,7,C.dark,Enum.Material.Metal)
 part(g,"Поворотная турель",46,3.2,18,5,1.8,5,C.iron,Enum.Material.Metal,{shape=Enum.PartType.Cylinder})
 beam(g,"Ствол",{46,4.2,18},{63,7,-2},1.4,C.blue)
 for i=0,3 do
  part(g,"Прижим рукава",46+i*3,4.3+i*0.45,18-i*3,1,0.7,0.7,C.dark)
 end
 local sprayBase=part(g,"Выход лафета",63,7,-2,0.6,0.6,0.6,C.blue)
 local cannon=particles(sprayBase,"Лафетный ствол","water")
 -- Рельеф вдали, вал и камни.
 for i=0,8 do
  local x=68+i*7
  solid(g,"Земляной вал",x,1.7,-57,10,3.5,10,C.earth,Enum.Material.Ground)
 end
 for i=0,18 do
  local x=65+(i*41%70)
  local z=36+(i*13%34)
  part(g,"Камень",x,0.8,z,1.3+(i%4),1.5+(i%3),2.3+(i%5),C.concrete,Enum.Material.Rock)
 end
 return grass,cow,cannon
end

local function makePerimeter(world)
 local g=group(world,"F Периметр и ночное окружение")
 solid(g,"Степной грунт",0,-0.9,0,270,1.8,220,C.earth,Enum.Material.Ground)
 -- Не запираем игрока: сервисный проезд оставлен открытым.
 for x=-122,118,8 do
  for _,z in ipairs({-96,92}) do
   beam(g,"Заборный столб",{x,0,z},{x,8,z},0.5,C.iron)
   if x<112 then part(g,"Сетка секции",x+4,4,z,7.5,7.5,0.09,C.steel,Enum.Material.Metal,{alpha=0.7}) end
  end
 end
 for z=-88,88,8 do
  beam(g,"Столб ограждения",{-122,0,z},{-122,8,z},0.5,C.iron)
  beam(g,"Столб ограждения",{122,0,z},{122,8,z},0.5,C.iron)
  if z<80 then
   part(g,"Западная сетка",-122,4,z+4,0.09,7.5,7.5,C.steel,Enum.Material.Metal,{alpha=0.7})
   part(g,"Восточная сетка",122,4,z+4,0.09,7.5,7.5,C.steel,Enum.Material.Metal,{alpha=0.7})
  end
 end
 solid(g,"Въездная дорога",-65,0.06,71,24,0.16,60,C.concrete,Enum.Material.Asphalt)
 for i=0,7 do
  local x=-75+i*2.9
  part(g,"Штриховка дороги",x,0.16,65,1.3,0.1,0.3,C.yellow)
 end
 for i=0,6 do
  local x=-105+i*32
  local z=-79+(i%3)*5
  solid(g,"Дальний грунтовый холм",x,6,z,33,12+(i%3)*5,20,C.earth,Enum.Material.Ground)
 end
 for i=0,7 do
  local x=-111+i*29
  local z=81+(i%2)*7
  part(g,"Сухой кустарник",x,1,z,2,2,2,C.grass,Enum.Material.Grass)
 end
 -- Прожекторы направлены локально, а не все в одну точку;
 -- суженный световой конус сохраняет тени и не выжигает детали стенда.
 for _,pt in ipairs({
  {-105,-70,-65,-28},
  {-5,-76,13,-8},
  {93,-65,55,-16},
  {100,66,74,17}
 }) do
  local x=pt[1]; local z=pt[2]
  solid(g,"Бетонное основание прожектора",x,0.7,z,5,1.4,5)
  beam(g,"Мачта прожектора",{x,1,z},{x,29,z},1.1,C.iron)
  for h=4,24,5 do
   beam(g,"Растяжка",{x-2,h,z},{x+2,h+5,z},0.3,C.steel)
  end
  part(g,"Поперечная балка",x,29,z,9,0.8,0.7,C.iron)
  for _,dx in ipairs({-2.3,2.3}) do
   local spot=part(g,"Головка прожектора",x+dx,28.6,z,2.5,1.5,1.8,C.iron,Enum.Material.Metal)
   spot.CFrame=CFrame.lookAt(spot.Position,pos(pt[3]+dx,1,pt[4]))
   local lens=part(g,"Матовая линза прожектора",x+dx,28.6,z,1.8,1.0,0.12,
    Color3.fromRGB(210,198,169),Enum.Material.Glass,{alpha=0.15})
   lens.CFrame=spot.CFrame*CFrame.new(0,0,-0.98)
   new("SpotLight",spot,{
    Face=Enum.NormalId.Front,Angle=46,Range=75,Brightness=0.65,
    Color=Color3.fromRGB(255,215,171),Shadows=false
   })
  end
 end
 for _,p in ipairs({{-95,-52},{-40,67},{52,54},{100,-41}}) do
  sign(g,"ОПАСНО / FIRE",p[1],4,p[2],12,2.2,C.red)
  beam(g,"Стойка знака",{p[1],0,p[2]},{p[1],3,p[2]},0.5,C.steel)
 end
end

-- Импортируемые mesh-ассеты живут в ServerStorage.RocketAssets.
-- Движок клонирует их на готовую сцену, а детали из Part остаются запасным вариантом.
local ASSETS = {
 Engine = { model = "RocketEngineAsset", center = Vector3.new(12.07364,0.45174,0.22182), width = 54.14727 },
 Stand = { model = "RocketStandAsset", center = Vector3.new(8.40568,2.48000,1.08500), width = 73.55309 }
}
local ENGINE_PARTS = {
 ["Метановый двигатель"]=true,["Кольцевой фланец"]=true,["Болт крепления"]=true,
 ["Турбонасос"]=true,["Рёбра насоса"]=true,["Камера сгорания"]=true,
 ["Кольцо охлаждения"]=true,["Сопло двигателя"]=true,["Срез сопла"]=true,
 ["Красный вентиль"]=true,["Шток вентиля"]=true,["Охлаждающая трубка"]=true,
 ["Обратная трубка"]=true,["Крепёж магистрали"]=true
}
local STAND_PARTS = {
 ["Несущая колонна"]=true,["Структурная диагональ"]=true,
 ["Продольная ферма"]=true,["Сервисный настил"]=true,
 ["Решётчатый сегмент"]=true,["Перила"]=true,["Поручень"]=true,
 ["Кабельная опора"]=true,["CH4 вход"]=true,["CH4 подача"]=true,
 ["CH4 отвод"]=true,["LOX вход"]=true,["LOX подача"]=true,
 ["LOX отвод"]=true,["N2 вход"]=true,["N2 подача"]=true,
 ["N2 отвод"]=true
}
local function placeImportedArt(world, kind, standGroup)
 local config=ASSETS[kind]
 local storage=game:GetService("ServerStorage")
 local root=storage:FindFirstChild("RocketAssets")
 local source=root and root:FindFirstChild(config.model)
 if not source or not source:IsA("Model") then return false end
 local artwork=source:Clone()
 artwork.Name="Imported"..kind
 artwork.Parent=world
 if not artwork:FindFirstChildWhichIsA("BasePart",true) then artwork:Destroy(); return false end
 for _,item in ipairs(artwork:GetDescendants()) do
  if item:IsA("BasePart") then
   item.Anchored=true
   item.CanCollide=false
   item.CanQuery=false
   item.CanTouch=false
  end
 end
 -- Импорт в Studs предпочтителен, но дополнительная нормализация защищает от неверного масштаба.
 local _,beforeSize=artwork:GetBoundingBox()
 if beforeSize.X>0.01 then
  local factor=config.width/beforeSize.X
  if factor>=0.05 and factor<=25 then artwork:ScaleTo(artwork:GetScale()*factor) end
 end
 local boundingCF=artwork:GetBoundingBox()
 local target=pos(9+config.center.X,8+config.center.Y,-8+config.center.Z)
 artwork:TranslateBy(target-boundingCF.Position)
 local hidden=kind=="Engine" and ENGINE_PARTS or STAND_PARTS
 for _,obj in ipairs(standGroup:GetDescendants()) do
  if obj:IsA("BasePart") and hidden[obj.Name] then
   obj.Transparency=1
   -- Коллизии декоративных деталей не должны становиться невидимыми стенами.
   if obj.Name~="Сервисный настил" then
    obj.CanCollide=false
    obj.CanQuery=false
   end
  end
 end
 return true
end

function Scene.build()
 local world=group(workspace,"RocketMission")
 makePerimeter(world)
 local alarm=makeBunker(world)
 local engineFX=makeStand(world)
 -- Встроенная геометрия останется видимой, пока готовые MeshPart-модели не импортированы.
 local standGroup=world:FindFirstChild("C Огневой стенд")
 local hasEngineMesh=placeImportedArt(world,"Engine",standGroup)
 local hasStandMesh=placeImportedArt(world,"Stand",standGroup)
 makeIndustry(world)
 local grass,cow,cannon=makeSteppe(world)
 local engineFire=new("Fire",engineFX.engine,{Size=10,Heat=12})
 local cableFire=new("Fire",engineFX.cable,{Size=4,Heat=8})
 local grassFire=new("Fire",grass,{Enabled=false,Size=4,Heat=8})
 return {model=world,engineFire=engineFire,cableFire=cableFire,grassFire=grassFire,
  cow=cow,plume=engineFX.plume,glow=engineFX.glow,monitor=engineFX.monitor,
  sparks=engineFX.sparks,water=engineFX.water,nitrogen=engineFX.nitrogen,
  cannon=cannon,alarm=alarm,hasEngineMesh=hasEngineMesh,hasStandMesh=hasStandMesh}
end
function Scene.update(v,stopped,purging,deluge,cannonOn,clock,saved,purged)
 -- Свечение остаётся акцентом: не выбеливает стенд и не теряет градацию по длине факела.
 for i,p in ipairs(v.plume) do
  p.Transparency=stopped and 1 or (i<=4 and 0.59+i*0.055 or 0.9)
 end
 v.glow.Brightness=stopped and 0 or 0.53+0.04*math.sin(clock*10)
 v.sparks.Enabled=not stopped
 for _,e in ipairs(v.nitrogen) do e.Enabled=purging end
 for _,e in ipairs(v.water) do e.Enabled=deluge end
 v.cannon.Enabled=cannonOn
 v.alarm.Brightness=saved and ((math.floor(clock*2)%2==0) and 1.25 or 0.15) or 0
 if purged then
  v.monitor.Text="N2 ГОТОВО • ДВИГАТЕЛЬ ОСТАНОВЛЕН"
  v.monitor.TextColor3=Color3.fromRGB(118,240,166)
 elseif purging then
  v.monitor.Text="КЛАПАНЫ ЗАКРЫТЫ • ПРОДУВКА N2"
  v.monitor.TextColor3=Color3.fromRGB(129,213,255)
 elseif stopped then
  v.monitor.Text="CH4 / LOX ПЕРЕКРЫТЫ • ЖДЁМ N2"
  v.monitor.TextColor3=Color3.fromRGB(255,209,103)
 else
  v.monitor.Text="ПОДАЧА CH4 / LOX • АВАРИЯ"
  v.monitor.TextColor3=Color3.fromRGB(255,142,110)
 end
end
return Scene
