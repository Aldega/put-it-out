-- Общее меню миссий: выбранную миссию запускает сервер для всей команды.
local Players = game:GetService("Players")
local RS = game:GetService("ReplicatedStorage")
local player = Players.LocalPlayer
local remotes = RS:WaitForChild("FireRemotes")
local selectMission = remotes:WaitForChild("SelectMission")
local state = RS:WaitForChild("MissionState")

local gui = Instance.new("ScreenGui")
gui.Name = "MissionSelector"
gui.ResetOnSpawn = false
gui.DisplayOrder = 20
gui.Parent = player:WaitForChild("PlayerGui")
local backdrop = Instance.new("Frame")
backdrop.Size = UDim2.fromScale(1, 1)
backdrop.BorderSizePixel = 0
backdrop.BackgroundColor3 = Color3.fromRGB(15, 20, 36)
backdrop.BackgroundTransparency = 0.13
backdrop.Parent = gui

local panel = Instance.new("Frame")
panel.AnchorPoint = Vector2.new(0.5, 0.5)
panel.Position = UDim2.fromScale(0.5, 0.5)
panel.Size = UDim2.new(0.88, 0, 0.8, 0)
panel.BackgroundColor3 = Color3.fromRGB(255, 248, 232)
panel.Parent = backdrop
local constraint = Instance.new("UISizeConstraint")
constraint.MaxSize = Vector2.new(650, 480)
constraint.Parent = panel
local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 22)
corner.Parent = panel
local border = Instance.new("UIStroke")
border.Color = Color3.fromRGB(29, 27, 38)
border.Thickness = 4
border.Parent = panel
local layout = Instance.new("UIListLayout")
layout.HorizontalAlignment = Enum.HorizontalAlignment.Center
layout.VerticalAlignment = Enum.VerticalAlignment.Center
layout.Padding = UDim.new(0, 12)
layout.Parent = panel

local function text(value, height)
 local l = Instance.new("TextLabel")
 l.BackgroundTransparency = 1
 l.Size = UDim2.new(0.9, 0, 0, height)
 l.Font = Enum.Font.GothamBold
 l.TextScaled = true
 l.TextWrapped = true
 l.TextColor3 = Color3.fromRGB(29, 27, 38)
 l.Text = value
 l.Parent = panel
 return l
end
text("КАК ЭТО ПОТУШИТЬ?", 54)
text("Выбери миссию для всей команды", 34)

local function choice(title, info, color, id)
 local b = Instance.new("TextButton")
 b.Size = UDim2.new(0.86, 0, 0, 100)
 b.Text = ""
 b.BackgroundColor3 = color
 b.Parent = panel
 local c = Instance.new("UICorner")
 c.CornerRadius = UDim.new(0, 15)
 c.Parent = b
 local stroke = Instance.new("UIStroke")
 stroke.Color = Color3.fromRGB(29, 27, 38)
 stroke.Thickness = 3
 stroke.Parent = b
 local name = Instance.new("TextLabel")
 name.Size = UDim2.new(1, -20, 0.48, 0)
 name.Position = UDim2.fromOffset(10, 5)
 name.Font = Enum.Font.GothamBlack
 name.TextScaled = true
 name.TextColor3 = Color3.fromRGB(29, 27, 38)
 name.BackgroundTransparency = 1
 name.Text = title
 name.Parent = b
 local subtitle = Instance.new("TextLabel")
 subtitle.Size = UDim2.new(1, -20, 0.35, 0)
 subtitle.Position = UDim2.new(0, 10, 0.54, 0)
 subtitle.Font = Enum.Font.Gotham
 subtitle.TextScaled = true
 subtitle.TextColor3 = Color3.fromRGB(29, 27, 38)
 subtitle.BackgroundTransparency = 1
 subtitle.Text = info
 subtitle.Parent = b
 b.Activated:Connect(function() selectMission:FireServer(id) end)
end

choice("АВАРИЯ Ф-1", "Болид, топливо, пилот и маршалы", Color3.fromRGB(255, 193, 81), "f1")
choice("ОГНЕННОЕ СОПЛО", "Ракетный двигатель: стоп, азот и охлаждение", Color3.fromRGB(146, 198, 255), "rocket")
text("После завершения миссии меню откроется снова", 26)

local function refresh()
 gui.Enabled = state:GetAttribute("MissionId") == "menu"
end
state:GetAttributeChangedSignal("MissionId"):Connect(refresh)
refresh()
