-- Roblox: сценарий «Огненное сопло», независимый от миссии Ф-1.
local Players = game:GetService("Players")
local RS = game:GetService("ReplicatedStorage")
local State = RS:WaitForChild("MissionState")
local Remotes = RS:WaitForChild("FireRemotes")
local Say = Remotes:WaitForChild("Say")
local Result = Remotes:WaitForChild("Result")
local function set(k,v) State:SetAttribute(k,v) end
local function say(s,kind) Say:FireAllClients(s,kind or "") end
local function create(class,parent,props)
 local x=Instance.new(class)
 for k,v in pairs(props or {}) do x[k]=v end
 x.Parent=parent
 return x
end
local origin=Vector3.new(0,0,440)
local function pos(x,y,z) return origin+Vector3.new(x,y,z) end
local function part(parent,name,x,y,z,sx,sy,sz,color,material)
 return create("Part",parent,{Name=name,Anchored=true,Position=pos(x,y,z),Size=Vector3.new(sx,sy,sz),Color=color,Material=material or Enum.Material.SmoothPlastic})
end
local CY=Color3.fromRGB(255,210,63)
local RED=Color3.fromRGB(230,59,46)
local BLUE=Color3.fromRGB(63,169,245)
local STEEL=Color3.fromRGB(180,187,203)
local function button(parent,name,x,color,callback)
 local p=part(parent,name,x,5.5,-25,4,1,4,color,Enum.Material.Neon)
 local a=create("ProximityPrompt",p,{ActionText=name,ObjectText="Пульт испытаний",MaxActivationDistance=10,HoldDuration=0.25,RequiresLineOfSight=false})
 a:SetAttribute("ActionKey",name)
 a:SetAttribute("ObjectKey","Пульт испытаний")
 a.Triggered:Connect(callback)
 return p
end
local function scene()
 local m=create("Model",workspace,{Name="RocketMission"})
 part(m,"Сухая степь",0,-1,0,230,2,200,Color3.fromRGB(105,88,55),Enum.Material.Ground)
 part(m,"Бетонный полигон",-12,0.1,-8,130,0.2,110,Color3.fromRGB(125,132,146),Enum.Material.Concrete)
 part(m,"Защитный бункер",-62,7,-39,36,14,4,STEEL,Enum.Material.Concrete)
 part(m,"Стенка",-80,6,-24,3,12,28,STEEL,Enum.Material.Concrete)
 part(m,"Стенка",-44,6,-24,3,12,28,STEEL,Enum.Material.Concrete)
 part(m,"Крыша",-62,13,-24,38,2,31,STEEL,Enum.Material.Concrete)
 -- Передняя стенка с реальным проходом шириной 5 studs.
 -- Раньше здесь было цельное коллизионное стекло, запиравшее игроков.
 local leftGlass=part(m,"Левое бронестекло",-71,7,-11,13,8,0.3,BLUE,Enum.Material.Glass)
 leftGlass.Transparency=0.6
 local rightGlass=part(m,"Правое бронестекло",-53,7,-11,13,8,0.3,BLUE,Enum.Material.Glass)
 rightGlass.Transparency=0.6
 local exit=part(m,"Выход из бункера",-62,10.5,-11,5,1,0.4,CY,Enum.Material.Neon)
 exit.CanCollide=false
 part(m,"Пульт управления",-62,2.5,-25,32,5,10,Color3.fromRGB(46,52,69))
 local block=part(m,"Упор", -10,8,-6,5,16,22,STEEL,Enum.Material.Concrete)
 part(m,"Топливная линия",0,15,-8,2,19,2,Color3.fromRGB(255,157,31),Enum.Material.Metal)
 part(m,"Кислородная линия",5,15,-8,2,19,2,BLUE,Enum.Material.Metal)
 local core=part(m,"Метановый двигатель",9,8,-8,17,8,9,STEEL,Enum.Material.Metal)
 local nozzle=part(m,"Сопло",24,8,-8,13,11,11,Color3.fromRGB(40,44,55),Enum.Material.Metal)
 nozzle.Shape=Enum.PartType.Cylinder
 local plume=part(m,"Реактивный факел",45,8,-8,30,6,6,Color3.fromRGB(133,171,255),Enum.Material.Neon)
 plume.Shape=Enum.PartType.Cylinder
 plume.CanCollide=false
 local cable=part(m,"Кабельный лоток",7,1.2,1,30,2,5,CY)
 local grass=part(m,"Сухая трава",75,1,-8,30,2,36,Color3.fromRGB(187,158,70),Enum.Material.Grass)
 local cow=create("Model",m,{Name="Корова"})
 part(cow,"Туловище",86,4,25,10,6,5,Color3.fromRGB(245,245,235))
 part(cow,"Голова",91,5,25,4,4,4,Color3.fromRGB(245,245,235))
 for _,x in ipairs({82,89}) do
  for _,z in ipairs({23,27}) do
   part(cow,"Нога",x,1,z,1.4,3,1.4,Color3.fromRGB(40,40,40))
  end
 end
 for i=1,4 do
  local tank=part(m,"Баллон азота",-16+i*3,4,9,2,8,2,Color3.fromRGB(40,42,47),Enum.Material.Metal)
  tank.Shape=Enum.PartType.Cylinder
 end
 local ef=create("Fire",core,{Size=11,Heat=14})
 local cf=create("Fire",cable,{Size=5,Heat=10})
 local gf=create("Fire",grass,{Size=8,Heat=10,Enabled=false})
 return m,ef,cf,gf,plume,cow
end
local function teleport(p)
 local char=p.Character
 if not char then return end
 char:PivotTo(CFrame.new(pos(-62,5,-16)))
end
local function play()
 local model,ef,cf,gf,plume,cow=scene()
 local stop=false
 local purged=false
 local purge=0
 local shower=0
 local saved=false
 local early=false
 local grassBurned=false
 local wetGrass=0
 local elapsed=0
 local fireEngine=0.55
 local fireCable=0.25
 local fireGrass=0
 local damage=0
 local lost=false
 local done=false
 local firstAction=nil
 local function action() if not firstAction then firstAction=elapsed end end
 button(model,"Аварийный стоп",-73,RED,function()
  if done or stop then return end
  action()
  stop=true
  fireEngine=math.min(fireEngine,0.45)
  say("Аварийный стоп! Клапаны метана и кислорода закрыты. Теперь продуй двигатель азотом.","good")
 end)
 button(model,"Продувка азотом",-66,CY,function()
  if done or purge>0 then return end
  action()
  if not stop then
   early=true
   say("Азот не пробьётся, пока двигатель работает. Сначала аварийный стоп!","bad")
   return
  end
  purge=3
  say("Азот вытесняет остатки метана и кислорода из двигателя.","good")
 end)
 button(model,"Водяной душ",-59,BLUE,function()
  if done then return end
  action()
  shower=6
  say("Водяной душ охлаждает кабели и стенд, но не перекрывает поток газа.","good")
 end)
 button(model,"Включить сирену",-52,RED,function()
  if done or saved then return end
  action()
  saved=true
  cow:PivotTo(cow:GetPivot()+Vector3.new(40,0,30))
  say("Сирена включена! Корова убежала в безопасное место.","good")
 end)
 -- Лафет установлен снаружи, но запускается из безопасного бункера.
 part(model,"Лафетный ствол",46,3,18,5,6,8,BLUE,Enum.Material.Metal)
 button(model,"Полить траву",-48,BLUE,function()
  if done then return end
  action()
  wetGrass=8
  fireGrass=math.max(0,fireGrass-0.25)
  say("Лафетный ствол поливает траву: влажная полоса сдерживает огонь.","good")
 end)
 local listener=Players.PlayerAdded:Connect(function(p)
  p.CharacterAdded:Connect(function() if State:GetAttribute("MissionId")=="rocket" then task.wait(0.2) teleport(p) end end)
 end)
 for _,p in ipairs(Players:GetPlayers()) do teleport(p) end
 set("Phase","plan")
 set("Countdown",6)
 say("На огневом стенде загорелся метановый двигатель! Управляйте испытанием из бункера.")
 for i=6,1,-1 do set("Countdown",i) task.wait(1) end
 set("Phase","play")
 local function finished(win,reason)
  done=true
  set("Phase","result")
  local stars=0
  if win then
   stars=1
   if damage<=50 then stars=2 end
   if damage<=25 then stars=3 end
  end
  local medals={
   {name="Сначала стоп",got=stop and firstAction~=nil and not early},
   {name="Стоп, потом азот",got=not early},
   {name="Степь не загорелась",got=not grassBurned},
   {name="Корова спасена",got=saved},
   {name="Без ошибок",got=not early}
  }
  Result:FireAllClients({win=win,reason=reason,stars=stars,time=math.floor(elapsed),damage=math.floor(damage),mistakes=early and 1 or 0,medals=medals})
 end
 while not done and State:GetAttribute("MissionId")=="rocket" do
  local dt=math.min(task.wait(0.1),0.25)
  elapsed=elapsed+dt
  if not stop then
   fireEngine=math.min(1,fireEngine+0.035*dt)
  else
   fireEngine=math.max(0,fireEngine-0.03*dt)
  end
  if purge>0 then
   purge=math.max(0,purge-dt)
   fireEngine=math.max(0,fireEngine-0.4*dt)
   if purge==0 then purged=true; fireEngine=0; say("Продувка окончена. Двигатель безопасен!","good") end
  end
  if shower>0 then
   shower=math.max(0,shower-dt)
   fireCable=math.max(0,fireCable-0.22*dt)
  else
   if fireEngine>0.1 then fireCable=math.min(1,fireCable+fireEngine*0.025*dt) end
  end
  if wetGrass>0 then
   wetGrass=math.max(0,wetGrass-dt)
   fireGrass=math.max(0,fireGrass-0.12*dt)
  elseif not stop then
   fireGrass=math.min(1,fireGrass+fireEngine*0.025*dt)
  end
  if fireGrass>0.08 then grassBurned=true end
  if fireGrass>0.6 and not saved and not lost then
   lost=true
   cow:PivotTo(cow:GetPivot()+Vector3.new(40,0,30))
   say("Огонь добрался до коровы! Она убежала сама.","bad")
  end
  plume.Transparency=stop and 1 or 0.2
  ef.Enabled=fireEngine>0.02
  cf.Enabled=fireCable>0.02
  gf.Enabled=fireGrass>0.02
  ef.Size=3+fireEngine*12
  cf.Size=2+fireCable*9
  gf.Size=2+fireGrass*10
  damage=math.min(100,damage+(fireEngine*0.85+fireCable*0.45+fireGrass*0.65)*dt)
  set("Time",elapsed)
  set("FEngine",fireEngine)
  set("FSpill",fireCable)
  set("FBarrier",fireGrass)
  set("Damage",damage)
  set("Pilot",saved and "out" or "inside")
  if stop and purged and fireEngine==0 and fireCable==0 and fireGrass==0 then finished(true,"Испытательный стенд спасён!") end
  if damage>=100 then finished(false,"Стенд сильно повреждён.") end
  if elapsed>=300 then finished(false,"Время вышло.") end
 end
 task.wait(12)
 listener:Disconnect()
 model:Destroy()
 for _,p in ipairs(Players:GetPlayers()) do task.spawn(function() p:LoadCharacter() end) end
 set("MissionId","menu")
 set("Phase","menu")
end
task.spawn(function()
 while true do
  while State:GetAttribute("MissionId")~="rocket" do task.wait(0.25) end
  play()
 end
end)
