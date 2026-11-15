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

-- Пять команд пульта регистрируются только на сервере.
local ControlEv=Remotes:FindFirstChild("RocketControl") or create("RemoteEvent",Remotes,{Name="RocketControl"})
local FeedbackEv=Remotes:FindFirstChild("RocketFeedback") or create("RemoteEvent",Remotes,{Name="RocketFeedback"})

-- Физическое устройство, которое Roblox держит в руке через стандартную Tool.Grip.
-- Кнопки на корпусе декоративные; нажимаются крупные кнопки на экране (в том числе с телефона).
local function newRemoteTool()
 local tool=create("Tool",nil,{Name="RocketRemote",ToolTip="Пульт управления огневым стендом",
  RequiresHandle=true,CanBeDropped=false,Grip=CFrame.new(0,-0.13,-0.22)*CFrame.Angles(math.rad(-20),0,math.rad(90))})
 local handle=create("Part",tool,{
  Name="Handle",Size=Vector3.new(0.9,0.20,0.65),Material=Enum.Material.Metal,
  Color=Color3.fromRGB(35,43,54),Anchored=false,CanCollide=false,CanTouch=false,Massless=true
 })
 local function decoration(name,x,y,z,sx,sy,sz,color,material)
  local p=create("Part",tool,{
   Name=name,Size=Vector3.new(sx,sy,sz),Material=material or Enum.Material.SmoothPlastic,
   Color=color,Anchored=false,CanCollide=false,CanTouch=false,Massless=true,
   CFrame=handle.CFrame*CFrame.new(x,y,z)
  })
  create("WeldConstraint",handle,{Part0=handle,Part1=p})
  return p
 end
 local screen=decoration("Экран телеметрии",0,0.13,-0.12,0.72,0.04,0.33,
  Color3.fromRGB(15,31,37),Enum.Material.SmoothPlastic)
 local screenGui=create("SurfaceGui",screen,{
  Name="Дисплей",Face=Enum.NormalId.Top,PixelsPerStud=120,LightInfluence=0
 })
 create("TextLabel",screenGui,{
  Size=UDim2.fromScale(1,1),BackgroundTransparency=1,
  Font=Enum.Font.GothamBold,TextScaled=true,Text="TEST / REMOTE",
  TextColor3=Color3.fromRGB(83,236,196)
 })
 local colors={
  Color3.fromRGB(239,75,60),Color3.fromRGB(251,196,67),
  Color3.fromRGB(63,163,233),Color3.fromRGB(64,158,240),
  Color3.fromRGB(247,193,75)
 }
 for i,c in ipairs(colors) do
  local x=-0.3+(i-1)*0.15
  decoration("Кнопка "..i,x,0.145,0.205,0.105,0.06,0.14,c,Enum.Material.SmoothPlastic)
 end
 decoration("Антенна",0.34,0.10,-0.37,0.05,0.24,0.06,Color3.fromRGB(180,193,207),Enum.Material.Metal)
 return tool
end
local function ownsTool(player)
 local character=player.Character
 local backpack=player:FindFirstChildOfClass("Backpack")
 return (character and character:FindFirstChild("RocketRemote"))
  or (backpack and backpack:FindFirstChild("RocketRemote"))
end
local function giveTool(player)
 if State:GetAttribute("MissionId")~="rocket" then return end
 if ownsTool(player) then return end
 local backpack=player:FindFirstChildOfClass("Backpack")
 local character=player.Character
 if not backpack or not character then return end
 local humanoid=character:FindFirstChildOfClass("Humanoid")
 if not humanoid or humanoid.Health<=0 then return end
 local tool=newRemoteTool()
 tool.Parent=backpack
 humanoid:EquipTool(tool)
end
local function removeTool(player)
 for _,owner in ipairs({player.Character,player:FindFirstChildOfClass("Backpack")}) do
  if owner then
   local old=owner:FindFirstChild("RocketRemote")
   if old and old:IsA("Tool") then old:Destroy() end
  end
 end
end
local RocketScene = require(script.Parent:WaitForChild("RocketScene"))
local Lighting = game:GetService("Lighting")
local origin=Vector3.new(0,0,440)
local function pos(x,y,z) return origin+Vector3.new(x,y,z) end
local CY=Color3.fromRGB(255,210,63)
local RED=Color3.fromRGB(230,59,46)
local BLUE=Color3.fromRGB(63,169,245)
local function part(parent,name,x,y,z,sx,sy,sz,color,material)
 return create("Part",parent,{Name=name,Anchored=true,CanCollide=false,CanQuery=false,
  Position=pos(x,y,z),Size=Vector3.new(sx,sy,sz),Color=color,
  Material=material or Enum.Material.SmoothPlastic})
end
local function button(parent,name,x,color,callback)
 local p=part(parent,name,x,5.2,-30,4,1,3,color,Enum.Material.Neon)
 local a=create("ProximityPrompt",p,{ActionText=name,ObjectText="Пульт испытаний",MaxActivationDistance=10,HoldDuration=0.25,RequiresLineOfSight=false})
 a:SetAttribute("ActionKey",name)
 a:SetAttribute("ObjectKey","Пульт испытаний")
 a.Triggered:Connect(callback)
 return p
end
local function teleport(p)
 local char=p.Character
 if not char then return end
 char:PivotTo(CFrame.new(pos(-62,5,-16)))
end
local function play()
 local visuals=RocketScene.build()
 local model=visuals.model
 local ef,cf,gf,cow=visuals.engineFire,visuals.cableFire,visuals.grassFire,visuals.cow
 -- Ночной профиль света включается только на время ракетной миссии.
 -- Яркость всей сцены снижена, контраст металла остаётся за локальными прожекторами.
 local previousLighting={
  ClockTime=Lighting.ClockTime,
  Brightness=Lighting.Brightness,
  Ambient=Lighting.Ambient,
  OutdoorAmbient=Lighting.OutdoorAmbient,
  ExposureCompensation=Lighting.ExposureCompensation,
  EnvironmentDiffuseScale=Lighting.EnvironmentDiffuseScale,
  EnvironmentSpecularScale=Lighting.EnvironmentSpecularScale
 }
 Lighting.ClockTime=22.5
 Lighting.Brightness=1.30
 Lighting.Ambient=Color3.fromRGB(42,48,61)
 Lighting.OutdoorAmbient=Color3.fromRGB(61,69,84)
 Lighting.ExposureCompensation=-0.23
 Lighting.EnvironmentDiffuseScale=0.52
 Lighting.EnvironmentSpecularScale=0.36
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
 local function publishRemoteStatus()
  set("RocketStopped",stop)
  set("RocketPurging",purge>0)
  set("RocketPurged",purged)
  set("RocketDeluge",shower>0)
  set("RocketCannon",wetGrass>0)
  set("RocketSiren",saved)
 end
 local controls={}
 controls.stop=function()
  if stop then return false,"Клапаны уже перекрыты." end
  action()
  stop=true
  fireEngine=math.min(fireEngine,0.45)
  return true,"Аварийный стоп: CH4 и LOX перекрыты. Запусти продувку азотом."
 end
 controls.nitrogen=function()
  if purged then return false,"Азотная продувка уже завершена." end
  if purge>0 then return false,"Продувка уже выполняется." end
  action()
  if not stop then
   early=true
   return false,"Сначала нажми СТОП! Азот нельзя подавать при работающем двигателе.","bad"
  end
  purge=3
  return true,"Продувка N2 активна: вытесняем остатки горючего и окислителя."
 end
 controls.deluge=function()
  if shower>0 then return false,"Водяная рампа уже работает." end
  action()
  shower=6
  return true,"Водяной душ включён: охлаждаем кабели и стенд."
 end
 controls.cannon=function()
  if wetGrass>0 then return false,"Лафетный ствол уже поливает траву." end
  action()
  wetGrass=8
  fireGrass=math.max(0,fireGrass-0.25)
  return true,"Лафет работает: полоса сухой травы увлажнена."
 end
 controls.siren=function()
  if saved then return false,"Сирена уже включена, корова в безопасности." end
  if lost then return false,"Корова уже убежала от огня. Спасти её сиреной поздно." end
  action()
  saved=true
  cow:PivotTo(cow:GetPivot()+Vector3.new(40,0,30))
  return true,"Сирена включена: корова ушла из опасной зоны."
 end
 local function executeControl(player,id,remote)
  if typeof(id)~="string" or controls[id]==nil then return end
  if State:GetAttribute("MissionId")~="rocket" or State:GetAttribute("Phase")~="play" or done then
   if player then FeedbackEv:FireClient(player,id,false,"Управление доступно после начала испытания.") end
   return
  end
  if remote then
   local character=player.Character
   local held=character and character:FindFirstChild("RocketRemote")
   if not held or not held:IsA("Tool") then
    FeedbackEv:FireClient(player,id,false,"Возьми переносной пульт в руку.")
    return
   end
  end
  local ok,text,kind=controls[id]()
  publishRemoteStatus()
  if player then FeedbackEv:FireClient(player,id,ok,text) end
  if ok then
   say(text,"good")
  elseif kind=="bad" then
   say(text,"bad")
  end
 end
 publishRemoteStatus()
 button(model,"Аварийный стоп",-73,RED,function(player) executeControl(player,"stop",false) end)
 button(model,"Продувка азотом",-66,CY,function(player) executeControl(player,"nitrogen",false) end)
 button(model,"Водяной душ",-59,BLUE,function(player) executeControl(player,"deluge",false) end)
 button(model,"Включить сирену",-52,RED,function(player) executeControl(player,"siren",false) end)
 -- Стационарный пульт сохраняется как резервный способ управления.
 button(model,"Полить траву",-48,BLUE,function(player) executeControl(player,"cannon",false) end)
 local remoteConnection=ControlEv.OnServerEvent:Connect(function(player,id)
  executeControl(player,id,true)
 end)
 local connections={}
 local function watchPlayer(p)
  local c=p.CharacterAdded:Connect(function()
   task.wait(0.25)
   if State:GetAttribute("MissionId")=="rocket" and not done then
    teleport(p)
    giveTool(p)
   end
  end)
  table.insert(connections,c)
  teleport(p)
  giveTool(p)
 end
 local listener=Players.PlayerAdded:Connect(watchPlayer)
 for _,p in ipairs(Players:GetPlayers()) do watchPlayer(p) end
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
  publishRemoteStatus()
  if fireGrass>0.08 then grassBurned=true end
  if fireGrass>0.6 and not saved and not lost then
   lost=true
   cow:PivotTo(cow:GetPivot()+Vector3.new(40,0,30))
   say("Огонь добрался до коровы! Она убежала сама.","bad")
  end
  RocketScene.update(visuals,stop,purge>0,shower>0,wetGrass>0,elapsed)
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
 remoteConnection:Disconnect()
 listener:Disconnect()
 for _,connection in ipairs(connections) do connection:Disconnect() end
 for key,value in pairs(previousLighting) do
  Lighting[key]=value
 end
 model:Destroy()
 for _,p in ipairs(Players:GetPlayers()) do
  removeTool(p)
  task.spawn(function() p:LoadCharacter() end)
 end
 set("RocketStopped",false)
 set("RocketPurged",false)
 set("RocketPurging",false)
 set("RocketDeluge",false)
 set("RocketCannon",false)
 set("RocketSiren",false)
 set("MissionId","menu")
 set("Phase","menu")
end
task.spawn(function()
 while true do
  while State:GetAttribute("MissionId")~="rocket" do task.wait(0.25) end
  play()
 end
end)
