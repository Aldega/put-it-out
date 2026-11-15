-- Экран переносного пульта. Показывается, когда Tool RocketRemote находится в руках.
-- Команды проходят только через сервер: клиент не изменяет состояние миссии.
local Players = game:GetService("Players")
local RS = game:GetService("ReplicatedStorage")
local player = Players.LocalPlayer
local State = RS:WaitForChild("MissionState")
local remotes = RS:WaitForChild("FireRemotes")
local control = remotes:WaitForChild("RocketControl")
local feedback = remotes:WaitForChild("RocketFeedback")

local INK = Color3.fromRGB(26, 31, 43)
local MID = Color3.fromRGB(40, 52, 67)
local WHITE = Color3.fromRGB(239, 245, 251)
local MUTED = Color3.fromRGB(163, 184, 203)
local GREEN = Color3.fromRGB(94, 223, 140)
local RED = Color3.fromRGB(241, 89, 74)
local BLUE = Color3.fromRGB(92, 177, 246)
local YELLOW = Color3.fromRGB(255, 208, 89)

local function new(kind, parent, props)
 local obj=Instance.new(kind)
 for k,v in pairs(props or {}) do obj[k]=v end
 obj.Parent=parent
 return obj
end
local function round(frame,radius)
 new("UICorner",frame,{CornerRadius=UDim.new(0,radius)})
end

local gui=new("ScreenGui",player:WaitForChild("PlayerGui"),{
 Name="RocketRemoteGUI",ResetOnSpawn=false,DisplayOrder=12,
 ZIndexBehavior=Enum.ZIndexBehavior.Sibling
})
local panel=new("Frame",gui,{
 Name="RemotePanel",AnchorPoint=Vector2.new(1,1),
 Position=UDim2.new(1,-14,1,-14),Size=UDim2.fromOffset(262,376),
 BackgroundColor3=INK,BorderSizePixel=0,Visible=false
})
round(panel,16)
new("UIStroke",panel,{Color=BLUE,Thickness=2,Transparency=0.2})
new("UIPadding",panel,{
 PaddingTop=UDim.new(0,12),PaddingBottom=UDim.new(0,12),
 PaddingLeft=UDim.new(0,12),PaddingRight=UDim.new(0,12)
})
local layout=new("UIListLayout",panel,{
 FillDirection=Enum.FillDirection.Vertical,HorizontalAlignment=Enum.HorizontalAlignment.Center,
 SortOrder=Enum.SortOrder.LayoutOrder,Padding=UDim.new(0,7)
})
new("TextLabel",panel,{
 Name="Heading",LayoutOrder=1,Size=UDim2.new(1,0,0,24),
 BackgroundTransparency=1,Font=Enum.Font.GothamBlack,
 Text="ПУЛЬТ ИСПЫТАНИЙ",TextSize=19,TextColor3=WHITE
})
new("TextLabel",panel,{
 LayoutOrder=2,Size=UDim2.new(1,0,0,18),BackgroundTransparency=1,
 Text="CH4 / LOX · ДИСТАНЦИОННЫЙ КОНТРОЛЬ",
 Font=Enum.Font.GothamMedium,TextSize=10,TextColor3=MUTED
})
local rows={
 {id="stop",label="СТОП · клапаны",color=RED},
 {id="nitrogen",label="N2 · продувка",color=YELLOW},
 {id="deluge",label="ВОДЯНОЙ ДУШ",color=BLUE},
 {id="cannon",label="ЛАФЕТ · трава",color=BLUE},
 {id="siren",label="СИРЕНА · корова",color=YELLOW}
}
local rowViews={}
for i,item in ipairs(rows) do
 local button=new("TextButton",panel,{
  LayoutOrder=i+2,Size=UDim2.new(1,0,0,42),
  BackgroundColor3=MID,BorderSizePixel=0,Text="",
  AutoButtonColor=true
 })
 round(button,9)
 local accent=new("Frame",button,{Size=UDim2.fromOffset(5,31),
  Position=UDim2.fromOffset(7,5),BackgroundColor3=item.color,BorderSizePixel=0})
 round(accent,3)
 new("TextLabel",button,{BackgroundTransparency=1,
  Position=UDim2.fromOffset(20,0),Size=UDim2.new(1,-89,1,0),
  Text=item.label,TextColor3=WHITE,Font=Enum.Font.GothamBold,
  TextSize=12,TextXAlignment=Enum.TextXAlignment.Left})
 local status=new("TextLabel",button,{BackgroundTransparency=1,
  AnchorPoint=Vector2.new(1,0.5),Position=UDim2.new(1,-8,0.5,0),
  Size=UDim2.fromOffset(68,28),Text="ГОТОВ",
  TextColor3=MUTED,TextSize=10,Font=Enum.Font.GothamBold,
  TextXAlignment=Enum.TextXAlignment.Right
 })
 rowViews[item.id]=status
 button.Activated:Connect(function()
  if State:GetAttribute("MissionId")~="rocket" then return end
  if State:GetAttribute("Phase")~="play" then return end
  control:FireServer(item.id)
 end)
end
local message=new("TextLabel",panel,{
 LayoutOrder=9,Size=UDim2.new(1,0,0,48),BackgroundColor3=Color3.fromRGB(21,31,43),
 BorderSizePixel=0,Text="Управляй испытанием, оставаясь у стенда.",
 TextSize=12,TextColor3=MUTED,Font=Enum.Font.GothamMedium,
 TextWrapped=true,TextXAlignment=Enum.TextXAlignment.Center
})
round(message,8)
local launcher=new("TextButton",gui,{
 Name="EquipLauncher",AnchorPoint=Vector2.new(1,1),
 Position=UDim2.new(1,-14,1,-16),Size=UDim2.fromOffset(164,48),
 BackgroundColor3=MID,BorderSizePixel=0,Text="ВЗЯТЬ ПУЛЬТ",
 TextSize=14,TextColor3=WHITE,Font=Enum.Font.GothamBold,Visible=false
})
round(launcher,11)
new("UIStroke",launcher,{Thickness=2,Color=BLUE})

local function toolLocation()
 local char=player.Character
 local tool=char and char:FindFirstChild("RocketRemote")
 if tool and tool:IsA("Tool") then return tool,true end
 local backpack=player:FindFirstChildOfClass("Backpack")
 tool=backpack and backpack:FindFirstChild("RocketRemote")
 if tool and tool:IsA("Tool") then return tool,false end
 return nil,false
end

local function refresh()
 local rocket=State:GetAttribute("MissionId")=="rocket"
 local phase=State:GetAttribute("Phase")
 local available=(phase=="plan" or phase=="play")
 local tool,equipped=toolLocation()
 panel.Visible=rocket and available and equipped
 launcher.Visible=rocket and available and tool~=nil and not equipped
 local stop=State:GetAttribute("RocketStopped")==true
 local purged=State:GetAttribute("RocketPurged")==true
 local purging=State:GetAttribute("RocketPurging")==true
 local deluge=State:GetAttribute("RocketDeluge")==true
 local cannon=State:GetAttribute("RocketCannon")==true
 local saved=State:GetAttribute("RocketSiren")==true
 local display={
  stop={stop and "ГОТОВО" or "ГОТОВ",stop and GREEN or MUTED},
  nitrogen={purged and "ГОТОВО" or (purging and "РАБОТА" or (stop and "ГОТОВ" or "ЖДЁТ")),purged and GREEN or (purging and YELLOW or MUTED)},
  deluge={deluge and "РАБОТА" or "ГОТОВ",deluge and BLUE or MUTED},
  cannon={cannon and "РАБОТА" or "ГОТОВ",cannon and BLUE or MUTED},
  siren={saved and "ГОТОВО" or "ГОТОВ",saved and GREEN or MUTED}
 }
 for key,v in pairs(display) do
  rowViews[key].Text=v[1]
  rowViews[key].TextColor3=v[2]
 end
 if phase=="plan" then
  message.Text="Осмотрись: запуск управления после обратного отсчёта."
  message.TextColor3=MUTED
 elseif not stop then
  message.Text="Первое действие: аварийный СТОП."
  message.TextColor3=YELLOW
 elseif not purged then
  message.Text="Подача перекрыта. Запусти азот (N2)."
  message.TextColor3=YELLOW
 elseif purged and not deluge then
  message.Text="Двигатель погашен. Охлади кабели и проверь траву."
  message.TextColor3=GREEN
 end
end
launcher.Activated:Connect(function()
 local tool=toolLocation()
 local char=player.Character
 local hum=char and char:FindFirstChildOfClass("Humanoid")
 if tool and hum then hum:EquipTool(tool) end
end)
feedback.OnClientEvent:Connect(function(id,accepted,detail)
 if State:GetAttribute("MissionId")~="rocket" then return end
 message.Text=tostring(detail or "")
 message.TextColor3=accepted and GREEN or RED
end)
local watched={
 "MissionId","Phase","RocketStopped","RocketPurged",
 "RocketPurging","RocketDeluge","RocketCannon","RocketSiren"
}
for _,attr in ipairs(watched) do State:GetAttributeChangedSignal(attr):Connect(refresh) end
local charConns={}
local function bindCharacter(char)
 for _,c in ipairs(charConns) do c:Disconnect() end
 table.clear(charConns)
 table.insert(charConns,char.ChildAdded:Connect(refresh))
 table.insert(charConns,char.ChildRemoved:Connect(refresh))
 refresh()
end
player.CharacterAdded:Connect(bindCharacter)
if player.Character then bindCharacter(player.Character) end
local backpack=player:WaitForChild("Backpack")
backpack.ChildAdded:Connect(refresh)
backpack.ChildRemoved:Connect(refresh)
refresh()
